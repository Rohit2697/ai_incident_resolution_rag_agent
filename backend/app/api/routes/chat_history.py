from fastapi import APIRouter,Query
from app.redis.cleint.client import queue
from app.redis.worker.chat_worker import get_chat_history
from rq import Retry
router=APIRouter()

@router.get('/chat-history')
def chat_history(userId:str=Query(...,example="test@gmail.com"),collection_name:str=Query(...,example="incident_1")):
    job=queue.enqueue(get_chat_history,userId,collection_name,retry=Retry(max=3,interval=[10,30,60]))
    return {
        "message": "chat retrieval initiated",
        "job_id": job.id
    }
