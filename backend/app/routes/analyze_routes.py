"""
Analysis routes
API endpoints for startup analysis
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from app.services.startup_analyzer import analyzer

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
    death_cause_details: Optional[str] = Field(None, description="Details about failure reason")
    stage_at_death: Optional[str] = Field(None, description="Funding stage at failure")
    lifespan_days: Optional[int] = Field(None, description="Days until closure")


@router.post("/analyze")
async def analyze_startup(request: StartupAnalysisRequest):
    """
    Analyze a startup and provide risk assessment
    Returns risk score, similar startups, and risk factors
    """
    try:
        # Convert request to dict
        startup_data = request.dict(exclude_none=True)
        
        # Perform analysis
        result = analyzer.analyze_startup(startup_data)
        
        return {
            "success": True,
            "data": {
                "risk_score": result['risk_score'],
                "risk_level": result['risk_level'],
                "risk_factors": result['risk_factors'],
                "similar_startups": result['similar_startups'][:5],  # Top 5
                "insights": result['insights'],
                "recommendations": result['recommendations']
            }
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )


@router.get("/industries")
async def get_industries():
    """
    Get list of all industries from the database
    """
    industries = list(set(
        s.get('industry', '') for s in analyzer.failed_startups 
        if s.get('industry')
    ))
    industries.sort()
    
    return {
        "success": True,
        "data": industries
    }


@router.get("/death-causes")
async def get_death_causes():
    """
    Get list of all death causes from the database
    """
    causes = list(set(
        s.get('death_cause', '') for s in analyzer.failed_startups 
        if s.get('death_cause')
    ))
    causes.sort()
    
    return {
        "success": True,
        "data": causes
    }