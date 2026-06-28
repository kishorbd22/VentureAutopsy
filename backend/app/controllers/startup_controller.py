"""
Startup controller
Handles HTTP requests and responses for startup operations
"""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.startup import Startup
from app.services.startup_service import StartupService


class StartupController:
    """Controller for startup endpoints"""

    def __init__(self, db: Session):
        self.db = db
        self.service = StartupService(db)

    def get_all(self, skip: int = 0, limit: int = 100):
        """Get all startups"""
        startups = self.service.get_all_startups(skip, limit)
        return [self._format_startup(s) for s in startups]

    def get_by_id(self, startup_id: int):
        """Get startup by ID"""
        startup = self.service.get_startup_by_id(startup_id)
        if not startup:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Startup with id {startup_id} not found",
            )
        return self._format_startup(startup, detailed=True)

    def _format_startup(self, startup: Startup, detailed: bool = False):
        """Format startup object for response"""
        if detailed:
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
        return {
            "id": startup.id,
            "name": startup.name,
            "industry": startup.industry,
            "founded_date": startup.founded_date,
            "closed_date": startup.closed_date,
        }
