from app.api.schema.chatRequest import ChatRequest
from fastapi import APIRouter
from app.redis.worker.chat_worker import chat_worker
from app.redis.cleint.client import queue
from rq import Retry
router=APIRouter()



@router.post("/chat")
def chat(chat_body:ChatRequest):
  job=queue.enqueue(chat_worker,chat_body.query,chat_body.collection_name, retry=Retry(max=3,interval=[10,30,60]))
  return {
        "message": "chat initiated",
        "job_id": job.id
    }