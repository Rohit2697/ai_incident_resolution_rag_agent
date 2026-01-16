from fastapi import APIRouter,Query
from app.redis.cleint.client import queue
from app.redis.worker.chat_worker import retriieve_chats_worker
from rq import Retry
router=APIRouter()

@router.get('/chat-history')
def chat_history(userId:str=Query(...,example="admin"),collection_name:str=Query(...,example="nodejs")):
    job=queue.enqueue(retriieve_chats_worker,userId,collection_name,retry=Retry(max=3,interval=[10,30,60]))
    return {
        "message": "chat retrieval initiated",
        "job_id": job.id
    }
