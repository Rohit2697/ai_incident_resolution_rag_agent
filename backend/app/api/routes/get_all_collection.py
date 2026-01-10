from fastapi import APIRouter
from app.rag.client import client
router=APIRouter()

@router.get('/collections')
def get_all_collection():
  collections=client.get_collections()
  excluded = {"user_memory", "mem0migrations"}
  return {
    "collections":[c.name for c in collections.collections if c.name not in excluded]
  }