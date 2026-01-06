from api.schema.chatRequest import ChatRequest
from fastapi import APIRouter,HTTPException
from qdrant_client.http.exceptions import UnexpectedResponse
from rag.rag import Rag
router=APIRouter()

rag=Rag(vector_url="http://localhost:6333")

@router.post("/chat")
def chat(chat_body:ChatRequest):
  try:
    result=rag.retrieve(user_query=chat_body.query,collection_name=chat_body.collection_name)
    return result
  
  except UnexpectedResponse:
    raise HTTPException(
      status_code=400,
        detail="No documents indexed yet for this collection. Please upload documents first."
    )