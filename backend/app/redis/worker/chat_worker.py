from app.rag.rag import Rag
from fastapi import HTTPException
from qdrant_client.http.exceptions import UnexpectedResponse

rag=Rag(vector_url="http://localhost:6333")

def chat_worker(query:str,collection_name:str):
    try:
        result=rag.retrieve(user_query=query,collection_name=collection_name)
        return result
    except UnexpectedResponse:
        raise HTTPException(
        status_code=400,
            detail="No documents indexed yet for this collection. Please upload documents first."
        )