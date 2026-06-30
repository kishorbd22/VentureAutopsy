"""
Analytics routes
API endpoints for platform analytics and metrics
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schemas.analytics import AnalyticsSummary, DailyAnalytics, IndustryStats
from app.services.analytics_service import AnalyticsService

router = APIRouter()


@router.get("/summary", response_model=AnalyticsSummary)
async def get_analytics_summary(request: Request, db: Session = Depends(get_db)):
    """
    Get analytics summary including:
    - Total analyses
    - Total users
    - Popular industries
    - Average score
    - Daily users
    """
    try:
        service = AnalyticsService(db)
        summary = service.get_summary()
        return summary
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve analytics summary: {str(e)}",
        )


@router.get("/daily", response_model=List[DailyAnalytics])
async def get_daily_analytics(
    days: int = 30,
    request: Request = None,
    db: Session = Depends(get_db)
):
    """
    Get daily analytics data for the past N days
    Default: last 30 days
    """
    try:
        if days < 1 or days > 365:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Days must be between 1 and 365"
            )
        
        service = AnalyticsService(db)
        daily_data = service.get_daily_analytics(days=days)
        return daily_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve daily analytics: {str(e)}",
        )


@router.get("/industries", response_model=List[IndustryStats])
async def get_industry_stats(request: Request, db: Session = Depends(get_db)):
    """
    Get statistics by industry including:
    - Analysis count
    - Average risk score
    - Average funding
    """
    try:
        service = AnalyticsService(db)
        stats = service.get_industry_stats()
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve industry stats: {str(e)}",
        )