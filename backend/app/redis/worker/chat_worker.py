from app.rag.rag import Rag
from fastapi import HTTPException
from qdrant_client.http.exceptions import UnexpectedResponse
from app.rag.utils.utils import save_chat_messages,get_chat_history
from app.api.schema.chat import ChatResponse

rag=Rag(vector_url="http://localhost:6333")


async def chat_worker(query:str,collection_name:str,userId)->ChatResponse:
    try:
       await save_chat_messages(user_id=userId,collection_name=collection_name,role="user",content=query)
       result:ChatResponse=rag.retrieve(user_query=query,collection_name=collection_name,userId=userId)  
       await save_chat_messages(user_id=userId,collection_name=collection_name,role="assistant",content=result["response"])
       return result
    except UnexpectedResponse:
        raise HTTPException(
        status_code=400,
            detail="No documents indexed yet for this collection. Please upload documents first."
        )
    
async def retriieve_chats_worker(userId:str,collection_name:str):
   try: 
    messages=await get_chat_history(userId,collection_name)
    return messages
   except Exception as e:
       print(e)
       return []