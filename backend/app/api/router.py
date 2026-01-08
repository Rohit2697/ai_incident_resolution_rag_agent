from fastapi import APIRouter

from app.api.routes.upload_docs import router as upload_router
from app.api.routes.chat import router as chat_router
from app.api.routes.upload_docs_result import router as upload_docs_result_router
from app.api.routes.chat_result import router as chat_result_router
api_router=APIRouter()

api_router.include_router(upload_router,prefix="",tags=["Documents"])
api_router.include_router(chat_router,prefix="",tags=["chat"])
api_router.include_router(upload_docs_result_router,prefix="",tags=["Upload Docs Result"])
api_router.include_router(chat_result_router,prefix="",tags=["Chat Result"])