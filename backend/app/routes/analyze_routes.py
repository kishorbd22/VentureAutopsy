"""
Analysis routes
API endpoints for startup analysis
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.services.startup_analyzer import StartupAnalyzer
from app.services.analytics_service import AnalyticsService

router = APIRouter()


class StartupAnalysisRequest(BaseModel):
    """Request model for startup analysis"""

    name: Optional[str] = Field(None, description="Startup name")
    industry: str = Field(..., description="Industry sector")
    sub_industry: Optional[str] = Field(None, description="Sub-industry")
    country: Optional[str] = Field(None, description="Country")
    total_funding_usd: Optional[float] = Field(None, description="Total funding in USD")
    number_of_employees: Optional[int] = Field(None, description="Number of employees")
    death_cause: Optional[str] = Field(None, description="Reason for failure")
    death_cause_details: Optional[str] = Field(
        None, description="Details about failure reason"
    )
    stage_at_death: Optional[str] = Field(None, description="Funding stage at failure")
    lifespan_days: Optional[int] = Field(None, description="Days until closure")


@router.post("/analyze")
async def analyze_startup(
    request: StartupAnalysisRequest, db: Session = Depends(get_db)
):
    """
    Analyze a startup and provide risk assessment
    Returns risk score, similar startups, and risk factors
    """
    try:
        # Convert request to dict
        startup_data = request.model_dump(exclude_none=True)

        # Initialize analyzer with database session for optimized performance
        analyzer = StartupAnalyzer(db=db)

        # Perform analysis
        result = analyzer.analyze_startup(startup_data)

        # Track analytics
        try:
            analytics_service = AnalyticsService(db)
            analytics_service.track_analysis(
                user_id=None,  # TODO: Get from current user when auth is implemented
                data=startup_data,
                result=result["data"],
                ip_address=request.client.host if request.client else None,
                user_agent=request.headers.get("user-agent", "")
            )
        except Exception as e:
            # Don't fail the analysis if tracking fails
            print(f"Analytics tracking failed: {e}")

        return {
            "success": True,
            "data": {
                "score": result["data"]["score"],
                "risk_level": result["data"]["risk_level"],
                "explanations": result["data"]["explanations"],
                "recommendations": result["data"]["recommendations"],
            },
            "meta": {
                "cached": result["meta"]["cached"],
                "processing_time_ms": result["meta"]["processing_time_ms"],
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}",
        )


@router.get("/industries")
async def get_industries(db: Session = Depends(get_db)):
    """
    Get list of all industries from the dataset
    """
    try:
        analyzer = StartupAnalyzer(db=db)
        industries = analyzer.get_unique_industries()

        return {"success": True, "data": industries, "error": None}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve industries: {str(e)}",
        )


@router.get("/death-causes")
async def get_death_causes(db: Session = Depends(get_db)):
    """
    Get list of all death causes from the dataset
    """
    try:
        analyzer = StartupAnalyzer(db=db)
        causes = analyzer.get_unique_death_causes()

        return {"success": True, "data": causes, "error": None}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve death causes: {str(e)}",
        )
