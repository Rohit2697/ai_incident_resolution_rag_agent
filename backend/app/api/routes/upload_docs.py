from fastapi import APIRouter, UploadFile,File,Form,HTTPException
from pathlib import Path
import shutil
from rag.rag import Rag
import uuid

router=APIRouter()

UPLOAD_DIR=Path("uploads")

UPLOAD_DIR.mkdir(exist_ok=True) 


@router.post('/upload-document')
def upload_document(
  file:UploadFile=File(...),
  collection_name:str=Form(...),
  chunk_size:int=Form(500),
  chunk_overlap:int=Form(50)
):
  if not file.filename.endswith(".pdf"):
    raise HTTPException(status_code=400,detail="Only PDF file type allowed")
  
  file_id=f"{uuid.uuid4()}.pdf"
  file_path=UPLOAD_DIR/file_id

  with open(file_path,"wb") as buffer:
    shutil.copyfileobj(file.file,buffer)
  
  rag=Rag(vector_url="http://localhost:6333")
  
  chunks=rag.extract(file_path,chunk_size,chunk_overlap)
  result=rag.store(chunks,collection_name)
  return {
        "message": "Document indexed successfully",
        "file_name": file.filename,
        "collection": collection_name,
        "chunks_indexed": result["chunks_indexed"]
    }
