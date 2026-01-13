from app.rag.rag import Rag
import os
from pathlib import Path
from app.db.mongo import collections
from datetime import datetime
rag=Rag(vector_url="http://localhost:6333")

async def upload_docs_worker_job(userId:str,file_name:str,collection_name:str,file_path:str, chunk_size:int, chunk_overlap:int):
    try:
        chunks=rag.extract(Path(file_path),chunk_size,chunk_overlap)
        result=rag.store(chunks,collection_name)
        await collections.update_one(
        {"userId": userId},
        {"$set": {
            "collection_name": collection_name,
            "status": "indexed",
            "chunk_size": chunk_size,
            "chunk_overlap": chunk_overlap,
            "updated_at":datetime.utcnow()
        },
            "$setOnInsert":{
            "created_at":datetime.utcnow()
            }
        },
        upsert=True
        )
        return {
            "message": "Document indexed successfully",
            "file_name": file_name,
            "collection": collection_name,
            "chunks_indexed": result["chunks_indexed"]
        }
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
