from fastapi import APIRouter, HTTPException
from app.redis.cleint.client import queue
router=APIRouter()
@router.get('/collections-result/{job_id}')
def get_all_collection_result(job_id:str):
    job=queue.fetch_job(job_id)
    print(job)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.is_finished:
        if job.result.get("ok"):
            return {"status": "finished", "result": job.result}
        raise HTTPException(status_code=400, detail=f"{job.result.get('message')}")
    elif job.is_failed:
        raise HTTPException(status_code=500, detail=f"Job failed: {str(job.exc_info)}")
    else:
        return {"status": "in_progress"}