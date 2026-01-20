from pyexpat.errors import messages
from app.rag.rag import Rag
from fastapi import HTTPException
from qdrant_client.http.exceptions import UnexpectedResponse
from app.rag.utils.utils import save_chat_messages,get_chat_history
from app.api.schema.chat import ChatResponse
from app.db.mongo import collections
rag=Rag()


def chat_worker(query:str,collection_name:str,userId)->ChatResponse:
    try:
       check_if_user_has_collection=collections.find_one(
        {'userId':userId,
         'collections.collection_name':collection_name,
         'collections.status':'indexed'})
       if not check_if_user_has_collection:
          return {   
            "ok": False,
            "context":"chat_worker",
            "error_code": "COLLECTION_NOT_INDEXED",
            "message": "Collection not indexed yet. Please upload documents first.",
            "data": None
        }
       
       save_user_result=save_chat_messages(user_id=userId,collection_name=collection_name,role="user",content=query)
       if(save_user_result["error"]):
          return {   
            "ok": False,
            "context":"chat_worker",
            "error_code": "UNABLE_TO_SAVE_INTO_DB",
            "message": save_user_result["message"],
            "data": None
        }
       result:ChatResponse=rag.retrieve(user_query=query,collection_name=collection_name,userId=userId)  
       save_assistant_result=save_chat_messages(user_id=userId,collection_name=collection_name,role="assistant",content=result["response"])
       if(save_assistant_result["error"]):
            return {   
            "ok": False,
            "context":"chat_worker",
            "error_code": "UNABLE_TO_SAVE_INTO_DB",
            "message": save_assistant_result["message"],
            "data": None
        }
       return {   
            "ok": True,
            "context":"chat_worker",
            "error_code": None,
            "message": "chat response",
            "data": result
        }
    except UnexpectedResponse:
       return {   
            "ok": False,
            "context":"chat_worker",
            "error_code": "NO_DOCUMENT_INDEXED",
            "message": "No documents indexed yet for this collection. Please upload documents first.",
            "data": None
        }
    except Exception as e:
         return {   
                "ok": False,
                "context":"chat_worker",
                "error_code": "CHAT_WORKER_FAILED",
                "message": str(e),
                "data": None
          }
        # raise HTTPException(
        # status_code=400,
        #     detail="No documents indexed yet for this collection. Please upload documents first."
        # )

def retriieve_chats_worker(userId:str,collection_name:str):
   try: 
    chat_history=get_chat_history(userId,collection_name)
    if(chat_history["error"]):
        return {   
               "ok": False,
               "context":"chat_history_worker",
               "error_code": "RETRIEVE_CHAT_FAILED",
               "message": chat_history["message"],
               "data": []
         }
    return {   
               "ok": True,
                "context":"chat_history_worker",
               "error_code": None,
               "message": "chat history retrieved",
               "data": chat_history["data"]
         }
   except Exception as e:
        return {   
               "ok": False,
                "context":"chat_history_worker",
               "error_code": "RETRIEVE_CHAT_FAILED",
               "message": str(e),
               "data": []
         }