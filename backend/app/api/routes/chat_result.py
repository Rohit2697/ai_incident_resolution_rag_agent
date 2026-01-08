from fastapi import APIRouter
from app.redis.cleint.client import queue

router=APIRouter()

@router.get('/chat-result/{job_id}')
def chat_result(job_id:str):
    job=queue.fetch_job(job_id)
    if job is None:
        return {
            "message": "Job not found"
        }
    elif job.is_finished:
        return {
            "message": "finished", "result":job.result
        }
    elif job.is_failed:
        return {
            "message": "failed", "error": str(job.exc_info)
        }
    else:
        return {
            "message": "in_progress"
        }