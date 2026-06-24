"""
Startup service
Business logic layer for startup operations
"""

from sqlalchemy.orm import Session
from app.models.startup import Startup


class StartupService:
    """Service class for startup business logic"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all_startups(self, skip: int = 0, limit: int = 100):
        """Get all startups with pagination"""
        return self.db.query(Startup).offset(skip).limit(limit).all()
    
    def get_startup_by_id(self, startup_id: int):
        """Get a specific startup by ID"""
        return self.db.query(Startup).filter(Startup.id == startup_id).first()
    
    def create_startup(self, startup_data: dict):
        """Create a new startup"""
        startup = Startup(**startup_data)
        self.db.add(startup)
        self.db.commit()
        self.db.refresh(startup)
        return startup
    
    def update_startup(self, startup_id: int, startup_data: dict):
        """Update an existing startup"""
        startup = self.get_startup_by_id(startup_id)
        if startup:
            for key, value in startup_data.items():
                setattr(startup, key, value)
            self.db.commit()
            self.db.refresh(startup)
        return startup
    
    def delete_startup(self, startup_id: int):
        """Delete a startup"""
        startup = self.get_startup_by_id(startup_id)
        if startup:
            self.db.delete(startup)
            self.db.commit()
        return startup