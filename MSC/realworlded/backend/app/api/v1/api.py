from fastapi import APIRouter
from app.api.v1.endpoints import auth, sessions, chat, evaluation

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(sessions.router, prefix="/sessions", tags=["Sessions"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(evaluation.router, prefix="/evaluation", tags=["Evaluation"])
