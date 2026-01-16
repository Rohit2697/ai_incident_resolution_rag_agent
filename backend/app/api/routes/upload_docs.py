from fastapi import APIRouter, UploadFile,File,Form,HTTPException
from pathlib import Path
from rq import Retry
from app.redis.worker.upload_docs_worker import upload_docs_worker_job
from app.redis.cleint.client import queue
import shutil
import uuid

router=APIRouter()

UPLOAD_DIR=Path("uploads")

UPLOAD_DIR.mkdir(exist_ok=True) 


@router.post('/upload-document')
def upload_document(
  file:UploadFile=File(...),
  collection_name:str=Form(...),
  userId:str=Form(...),
  chunk_size:int=Form(500),
  chunk_overlap:int=Form(50)
):
  if not file.filename.endswith(".pdf"):
    raise HTTPException(status_code=400,detail="Only PDF file type allowed")
  file_id=f"{uuid.uuid4()}.pdf"
  file_path=UPLOAD_DIR/file_id
  with open(file_path,"wb") as buffer:
    shutil.copyfileobj(file.file,buffer)
  job=queue.enqueue(upload_docs_worker_job,userId,file.filename,collection_name,file_path,chunk_size,chunk_overlap,retry=Retry(max=3,interval=[10,30,60]))
  return {
    "message": "File upload initiated",
    "job_id": job.id
  }
