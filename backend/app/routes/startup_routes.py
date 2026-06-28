"""
Startup routes
API endpoints for startup operations
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.models.startup import Startup

router = APIRouter()


@router.get("/", response_model=List[dict])
async def get_startups(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all startups with pagination
    Returns a list of startups
    """
    startups = db.query(Startup).offset(skip).limit(limit).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "industry": s.industry,
            "founded_date": s.founded_date,
            "closed_date": s.closed_date,
        }
        for s in startups
    ]


@router.get("/{startup_id}", response_model=dict)
async def get_startup(startup_id: int, db: Session = Depends(get_db)):
    """
    Get a specific startup by ID
    Returns detailed startup information
    """
    startup = db.query(Startup).filter(Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Startup with id {startup_id} not found",
        )

    return {
        "id": startup.id,
        "name": startup.name,
        "description": startup.description,
        "industry": startup.industry,
        "sub_industry": startup.sub_industry,
        "founded_date": startup.founded_date,
        "closed_date": startup.closed_date,
        "lifespan_days": startup.lifespan_days,
        "country": startup.country,
        "state_province": startup.state_province,
        "city": startup.city,
        "total_funding_usd": startup.total_funding_usd,
        "funding_rounds": startup.funding_rounds,
        "death_cause": startup.death_cause,
        "death_cause_details": startup.death_cause_details,
        "stage_at_death": startup.stage_at_death,
        "tags": startup.tags,
        "number_of_employees": startup.number_of_employees,
        "source_url": startup.source_url,
        "verified": startup.verified,
        "featured": startup.featured,
        "created_at": startup.created_at,
        "updated_at": startup.updated_at,
    }
