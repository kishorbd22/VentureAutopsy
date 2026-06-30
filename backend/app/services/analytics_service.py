"""
Analytics service for tracking and retrieving platform metrics
"""

from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy import func, distinct, cast, Date
from sqlalchemy.orm import Session

from app.models.analysis import Analysis
from app.models.user import User


class AnalyticsService:
    """Service for analytics operations"""

    def __init__(self, db: Session):
        self.db = db

    def get_summary(self) -> dict:
        """Get analytics summary"""
        # Total analyses
        total_analyses = self.db.query(func.count(Analysis.id)).scalar() or 0

        # Total users
        total_users = self.db.query(func.count(User.id)).scalar() or 0

        # Popular industries (top 10)
        popular_industries = (
            self.db.query(
                Analysis.industry,
                func.count(Analysis.id).label('count'),
                func.avg(Analysis.risk_score).label('avg_score')
            )
            .filter(Analysis.industry.is_not(None))
            .group_by(Analysis.industry)
            .order_by(func.count(Analysis.id).desc())
            .limit(10)
            .all()
        )

        # Average score
        average_score = self.db.query(func.avg(Analysis.risk_score)).scalar() or 0.0

        # Daily users (unique users today)
        today = datetime.utcnow().date()
        daily_users = (
            self.db.query(func.count(distinct(Analysis.user_id)))
            .filter(Analysis.user_id.is_not(None))
            .filter(cast(Analysis.created_at, Date) == today)
            .scalar()
        ) or 0

        # Daily analyses
        daily_analyses = (
            self.db.query(func.count(Analysis.id))
            .filter(cast(Analysis.created_at, Date) == today)
            .scalar()
        ) or 0

        return {
            "total_analyses": total_analyses,
            "total_users": total_users,
            "popular_industries": [
                {
                    "industry": row.industry,
                    "count": row.count,
                    "avg_score": round(row.avg_score, 2)
                }
                for row in popular_industries
            ],
            "average_score": round(average_score, 2),
            "daily_users": daily_users,
            "daily_analyses": daily_analyses
        }

    def get_daily_analytics(self, days: int = 30) -> List[dict]:
        """Get daily analytics for the past N days"""
        end_date = datetime.utcnow().date()
        start_date = end_date - timedelta(days=days)

        daily_data = (
            self.db.query(
                cast(Analysis.created_at, Date).label('date'),
                func.count(Analysis.id).label('analyses'),
                func.count(distinct(Analysis.user_id)).label('users'),
                func.avg(Analysis.risk_score).label('avg_score')
            )
            .filter(cast(Analysis.created_at, Date) >= start_date)
            .group_by(cast(Analysis.created_at, Date))
            .order_by(cast(Analysis.created_at, Date))
            .all()
        )

        return [
            {
                "date": row.date.isoformat(),
                "analyses": row.analyses,
                "users": row.users or 0,
                "avg_score": round(row.avg_score, 2) if row.avg_score else 0.0
            }
            for row in daily_data
        ]

    def get_industry_stats(self) -> List[dict]:
        """Get statistics by industry"""
        industry_stats = (
            self.db.query(
                Analysis.industry,
                func.count(Analysis.id).label('count'),
                func.avg(Analysis.risk_score).label('avg_risk_score'),
                func.avg(Analysis.number_of_employees).label('avg_employees'),
                func.avg(Analysis.total_funding_usd).label('avg_funding')
            )
            .filter(Analysis.industry.is_not(None))
            .group_by(Analysis.industry)
            .order_by(func.count(Analysis.id).desc())
            .all()
        )

        return [
            {
                "industry": row.industry,
                "count": row.count,
                "avg_risk_score": round(row.avg_risk_score, 2),
                "avg_lifespan": None,  # Not tracked directly
                "avg_funding": round(row.avg_funding, 2) if row.avg_funding else None
            }
            for row in industry_stats
        ]

    def track_analysis(self, user_id: Optional[int], data: dict, result: dict, ip_address: str, user_agent: str):
        """Track an analysis request"""
        analysis = Analysis(
            user_id=user_id,
            startup_name=data.get('name'),
            industry=data.get('industry'),
            sub_industry=data.get('sub_industry'),
            country=data.get('country'),
            total_funding_usd=data.get('total_funding_usd'),
            number_of_employees=data.get('number_of_employees'),
            stage_at_death=data.get('stage_at_death'),
            death_cause=data.get('death_cause'),
            risk_score=result.get('score', 0),
            risk_level=result.get('risk_level', 'Unknown'),
            analysis_data=result,
            ip_address=ip_address,
            user_agent=user_agent
        )
        self.db.add(analysis)
        self.db.commit()
        return analysis