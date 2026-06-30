"""
Health check routes
Provides system health and status endpoints
"""

from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.config.database import get_db

router = APIRouter()


@router.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """
    Basic health check endpoint
    Returns status of the application and database connectivity
    """
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "services": {
            "api": "healthy",
            "database": "unknown"
        }
    }

    # Check database connectivity
    try:
        db.execute(text("SELECT 1"))
        health_status["services"]["database"] = "healthy"
    except Exception as e:
        health_status["services"]["database"] = f"unhealthy: {str(e)}"
        health_status["status"] = "degraded"

    return health_status


@router.get("/health/ready")
async def readiness_check(db: Session = Depends(get_db)):
    """
    Readiness check for Kubernetes/load balancers
    Returns 200 if ready to serve traffic
    """
    try:
        # Check database
        db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except Exception:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="Service not ready")


@router.get("/health/live")
async def liveness_check():
    """
    Liveness check for Kubernetes
    Returns 200 if the application is running
    """
    return {"status": "alive"}


@router.get("/metrics")
async def get_metrics():
    """
    Basic application metrics
    Can be extended for Prometheus integration
    """
    import psutil
    import os
    
    try:
        process = psutil.Process(os.getpid())
        metrics = {
            "cpu_percent": process.cpu_percent(interval=1),
            "memory_info": {
                "rss_mb": process.memory_info().rss / 1024 / 1024,
                "vms_mb": process.memory_info().vms / 1024 / 1024,
            },
            "num_threads": process.num_threads(),
            "timestamp": datetime.utcnow().isoformat()
        }
        return metrics
    except Exception as e:
        return {
            "error": f"Failed to collect metrics: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }