from fastapi import APIRouter

from api.routes.upload_docs import router as upload_router
from api.routes.chat import router as chat_router

api_router=APIRouter()

api_router.include_router(upload_router,prefix="",tags=["Documents"])
api_router.include_router(chat_router,prefix="",tags=["chat"])