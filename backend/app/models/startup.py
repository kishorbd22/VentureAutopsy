"""
Startup database model
Represents a venture in the autopsy database
"""

from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.sql import func

from app.config.database import Base


class Startup(Base):
    """Startup model for storing company data"""

    __tablename__ = "startups"

    # Primary Key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # Basic Information
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    industry = Column(String(100), index=True)
    sub_industry = Column(String(100))

    # Temporal Information
    founded_date = Column(DateTime)
    closed_date = Column(DateTime)
    lifespan_days = Column(Integer)

    # Location
    country = Column(String(100))
    state_province = Column(String(100))
    city = Column(String(100))

    # Financial Information
    total_funding_usd = Column(Float)
    funding_rounds = Column(Integer)

    # Categorization
    death_cause = Column(String(100))
    death_cause_details = Column(Text)
    stage_at_death = Column(String(100))

    # Additional Data
    tags = Column(Text)  # JSON string for tags
    number_of_employees = Column(Integer)

    # Metadata
    source_url = Column(Text)
    verified = Column(Boolean, default=False)
    featured = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return (
            f"<Startup(id={self.id}, name='{self.name}', industry='{self.industry}')>"
        )
