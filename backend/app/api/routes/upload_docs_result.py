from app.redis.cleint.client import queue
from fastapi import APIRouter

router=APIRouter()

@router.get('/upload-docs-worker-result/{job_id}')
def get_upload_docs_result(job_id: str):
    job = queue.fetch_job(job_id)
    if job is None:
        return {"message": "Job not found"}
    if job.is_finished:
        return {"status": "finished", "result": job.result}
    elif job.is_failed:
        return {"status": "failed", "error": str(job.exc_info)}
    else:
        return {"status": "in_progress"}