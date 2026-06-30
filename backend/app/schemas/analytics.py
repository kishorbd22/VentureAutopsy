"""
Analytics schemas for request/response validation
"""

from datetime import date
from typing import Optional
from pydantic import BaseModel, Field


class AnalyticsSummary(BaseModel):
    """Analytics summary response"""
    total_analyses: int = Field(..., description="Total number of analyses performed")
    total_users: int = Field(..., description="Total number of registered users")
    popular_industries: list[dict] = Field(..., description="Top industries by analysis count")
    average_score: float = Field(..., description="Average risk score across all analyses")
    daily_users: int = Field(..., description="Number of unique users today")
    daily_analyses: int = Field(..., description="Number of analyses today")


class DailyAnalytics(BaseModel):
    """Daily analytics data point"""
    date: date
    analyses: int
    users: int
    avg_score: float


class IndustryStats(BaseModel):
    """Industry statistics"""
    industry: str
    count: int
    avg_risk_score: float
    avg_lifespan: Optional[float] = None
    avg_funding: Optional[float] = None