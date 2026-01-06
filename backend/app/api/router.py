from fastapi import APIRouter

from api.routes.upload_docs import router as upload_router

api_router=APIRouter()

api_router.include_router(upload_router,prefix="",tags=["Documents"])