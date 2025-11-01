from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.api.v1.api import api_router
from app.db.database import engine, Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    logger.info("Starting up RealWorldEd API...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
    yield
    # Shutdown
    logger.info("Shutting down RealWorldEd API...")


# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI Simulated Experience Platform for Real-World Learning",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],  # Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    logger.error(f"Global exception: {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"}
    )


# Include API routes
app.include_router(api_router, prefix="/api/v1")


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to RealWorldEd API",
        "version": "1.0.0",
        "docs": "/docs"
    }


# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "RealWorldEd API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
