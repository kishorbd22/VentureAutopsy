"""
Analysis database model
Stores analytics data for startup analyses
"""

from sqlalchemy import Column, DateTime, Float, Integer, String, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy import JSON

from app.config.database import Base


class Analysis(Base):
    """Analysis model for storing startup analysis results and tracking analytics"""

    __tablename__ = "analyses"

    # Primary Key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # Foreign Key to User (optional for anonymous analyses)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Input Data
    startup_name = Column(String(255))
    industry = Column(String(100), index=True)
    sub_industry = Column(String(100))
    country = Column(String(100))
    total_funding_usd = Column(Float)
    number_of_employees = Column(Integer)
    stage_at_death = Column(String(100))
    death_cause = Column(String(100))

    # Results
    risk_score = Column(Integer, index=True)
    risk_level = Column(String(50), index=True)
    analysis_data = Column(JSON().with_variant(JSON, "postgresql"))

    # Request Metadata
    ip_address = Column(String(45))
    user_agent = Column(Text)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    def __repr__(self):
        return (
            f"<Analysis(id={self.id}, industry='{self.industry}', risk_score={self.risk_score})>"
        )