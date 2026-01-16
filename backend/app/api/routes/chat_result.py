from fastapi import APIRouter,HTTPException
from app.redis.cleint.client import queue

router=APIRouter()

@router.get('/chat-worker-result/{job_id}')
def chat_result(job_id:str):
    job=queue.fetch_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    elif job.is_finished:
        if job.result.get("ok"):
            return {
                "message": "finished",
                "result": job.result
            }
        else:
            raise HTTPException(status_code=400, detail=f"{job.result.get('message')}")
    elif job.is_failed:
        raise HTTPException(status_code=500, detail=f"Job failed: {str(job.exc_info)}")
    else:
        return {
            "message": "in_progress"
        }