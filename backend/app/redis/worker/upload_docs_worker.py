from app.rag.rag import Rag
from pathlib import Path
rag=Rag(vector_url="http://localhost:6333")

def upload_docs_worker_job(file_name:str,collection_name:str,file_path:str, chunk_size:int, chunk_overlap:int):
    chunks=rag.extract(Path(file_path),chunk_size,chunk_overlap)
    result=rag.store(chunks,collection_name)
    return {
        "message": "Document indexed successfully",
        "file_name": file_name,
        "collection": collection_name,
        "chunks_indexed": result["chunks_indexed"]
    }
