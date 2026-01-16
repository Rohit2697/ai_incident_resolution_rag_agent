from fastapi import APIRouter
from rq import Retry 
from app.redis.worker.get_all_collection_worker import get_all_collection_worker
from app.redis.cleint.client import queue
router=APIRouter()

@router.get('/collections/{userId}')
def get_all_collection(userId:str):
    job=queue.enqueue(get_all_collection_worker,userId,retry=Retry(max=3,interval=[10,30,60]))
    return {
        "message": "collection retrieval initiated",
        "job_id": job.id
    }