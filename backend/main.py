"""
Startup Graveyard Analyzer - Backend Application
FastAPI server with SQLite database and modular architecture
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config.settings import settings
from app.config.database import init_database
from app.middleware.error_handler import ErrorHandlerMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print(f"🚀 Starting {settings.APP_NAME} v{settings.API_VERSION}")
    init_database()
    print("✓ Database initialized successfully")
    
    yield
    
    # Shutdown
    print("👋 Shutting down application")


app = FastAPI(
    title=settings.APP_NAME,
    description="API for analyzing startup failures and trends",
    version=settings.API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Error Handler Middleware
app.add_middleware(ErrorHandlerMiddleware)


# Health Check Endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint
    Returns the status of the API
    """
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.API_VERSION,
        "message": "API is running smoothly"
    }


# Root Endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint with API information
    """
    return {
        "app": settings.APP_NAME,
        "version": settings.API_VERSION,
        "docs": "/docs",
        "health": "/health"
    }


# Include API routers
from app.routes.api_router import api_router
app.include_router(api_router, prefix=f"/api/{settings.API_VERSION}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )