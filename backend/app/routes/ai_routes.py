"""
AI routes
Endpoints for AI-powered features: reports, chat, scenario simulation
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.services.ai_service import AIService
from app.models.analysis import Analysis

router = APIRouter()


class ChatMessage(BaseModel):
    """Chat message request"""
    message: str = Field(..., description="User's question or message")
    conversation_history: List[Dict[str, str]] = Field(default_factory=list, description="Previous conversation")


class ScenarioRequest(BaseModel):
    """Scenario simulation request"""
    scenario_type: str = Field(..., description="Type of scenario: funding, pivot, team, or general")
    params: Dict[str, Any] = Field(default_factory=dict, description="Scenario parameters")


@router.get("/report/{analysis_id}")
async def generate_ai_report(analysis_id: int, db: Session = Depends(get_db)):
    """
    Generate comprehensive AI report for an analysis
    Includes executive summary, detailed analysis, risk factors, recommendations, and action plan
    """
    try:
        # Verify analysis exists
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Analysis {analysis_id} not found"
            )

        service = AIService(db)
        report = service.generate_report(analysis_id)
        
        return {
            "success": True,
            "data": report,
            "error": None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate report: {str(e)}",
        )


@router.post("/chat/{analysis_id}")
async def chat_with_analysis(
    analysis_id: int,
    request: ChatMessage,
    db: Session = Depends(get_db)
):
    """
    Chat with AI about an analysis
    Ask questions like "What if I raise $2M?" or "How can I improve my score?"
    """
    try:
        # Verify analysis exists
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Analysis {analysis_id} not found"
            )

        service = AIService(db)
        result = service.chat_with_analysis(
            analysis_id=analysis_id,
            user_message=request.message,
            conversation_history=request.conversation_history
        )
        
        return {
            "success": True,
            "data": result,
            "error": None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat failed: {str(e)}",
        )


@router.post("/simulate/{analysis_id}")
async def simulate_scenario(
    analysis_id: int,
    request: ScenarioRequest,
    db: Session = Depends(get_db)
):
    """
    Simulate 'what-if' scenarios
    Examples:
    - "What if I raise $2M?"
    - "What if I pivot to SaaS?"
    - "What if I hire 10 more people?"
    
    Request body:
    {
        "scenario_type": "funding",
        "params": {
            "raise_amount": 2000000
        }
    }
    """
    try:
        # Verify analysis exists
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Analysis {analysis_id} not found"
            )

        service = AIService(db)
        result = service.simulate_scenario(
            analysis_id=analysis_id,
            scenario_params={**request.params, "type": request.scenario_type}
        )
        
        return {
            "success": True,
            "data": result,
            "error": None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Scenario simulation failed: {str(e)}",
        )


@router.get("/suggestions/{analysis_id}")
async def get_ai_suggestions(analysis_id: int, db: Session = Depends(get_db)):
    """
    Get AI-generated suggestions and next steps for an analysis
    """
    try:
        analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Analysis {analysis_id} not found"
            )

        service = AIService(db)
        report = service.generate_report(analysis_id)
        
        suggestions = {
            "immediate_actions": report["action_plan"][0]["actions"],
            "top_risks": [r["factor"] for r in report["risk_factors"][:3]],
            "key_metrics_to_track": [
                "Burn rate",
                "Customer acquisition cost (CAC)",
                "Lifetime value (LTV)",
                "Monthly recurring revenue (MRR)",
                "Churn rate"
            ],
            "recommended_resources": [
                {
                    "title": "The Lean Startup",
                    "type": "Book",
                    "relevance": "High"
                },
                {
                    "title": "Startup Post-Mortem Database",
                    "type": "Database",
                    "relevance": "High"
                },
                {
                    "title": "Financial Modeling Template",
                    "type": "Template",
                    "relevance": "Medium"
                }
            ]
        }
        
        return {
            "success": True,
            "data": suggestions,
            "error": None
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get suggestions: {str(e)}",
        )