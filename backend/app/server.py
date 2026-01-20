from fastapi import FastAPI
from app.api.router import api_router
from fastapi.middleware.cors import CORSMiddleware
from  app.environment.environment import env_veriables
app=FastAPI(
  title="Incident RAG AI"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[env_veriables["FRONTEND"]["url"]],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(api_router)



