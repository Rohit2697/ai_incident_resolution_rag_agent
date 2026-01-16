from app.rag.rag import Rag
import os
from pathlib import Path
from app.db.mongo import collections
from datetime import datetime
rag=Rag()

def upload_docs_worker_job(userId:str,file_name:str,collection_name:str,file_path:str, chunk_size:int, chunk_overlap:int):
    try:
        exists=collections.find_one({ "userId": userId,"collections.collection_name": collection_name, "collections.status": "indexed"}, {"_id":0})
        if exists:
            return {
            "ok": False,
            "error_code": "COLLECTION_ALREADY_EXISTS",
            "message": "Collection already exists",
            "data": None
        }
        chunks=rag.extract(Path(file_path),chunk_size,chunk_overlap)
        result=rag.store(chunks,collection_name)
        collections.update_one(
        {"userId": userId},
        {"$push": {
            "collections": {
            "collection_name": collection_name,
            "status": "indexed",
            "chunk_size": chunk_size,
            "chunk_overlap": chunk_overlap,
            "updated_at":datetime.utcnow()
            }   
        },
          "$set":{
            "updated_at":datetime.utcnow()
          },
          "$setOnInsert":{
            "created_at":datetime.utcnow()
            }
        },
        upsert=True
        )
        return {   
            "ok": True,
            "error_code": None,
            "message": "Document indexed successfully",
            "data": {
            "file_name": file_name,
            "collection": collection_name,
            "chunks_indexed": result["chunks_indexed"]
            }
        }
    except Exception as e:
        print(e)
        return {   
            "ok": False,
            "error_code": "INDEXING_FAILED",
            "message": str(e),
            "data": None
        }
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
