"""
Startup Analyzer Service
Provides analysis functionality for startup risk assessment
"""

import hashlib
import json
import os
from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.features.extractor import FeatureExtractor
from app.services.insights_engine import InsightService
from app.services.risk_scoring_service import RiskScoringService
from app.utils.explainable_ai import ExplainableAnalyzer


class StartupAnalyzer:
    """Analyzes startups and provides risk assessment"""

    def __init__(self, db: Session = None, debug: bool = False):
        """
        Initialize analyzer with optional database session

        Args:
            db: SQLAlchemy database session. If None, creates new session.
            debug: If True, include full feature breakdown in results.
        """
        self.db = db
        self._test_mode = False
        self.debug = debug
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.failed_startups = self._load_failed_startups()

    def _load_failed_startups(self) -> List[Dict[str, Any]]:
        """
        Load failed startups data from database or CSV fallback

        Priority:
        1. Database (if available and has records)
        2. CSV file (fallback)
        """
        startups = []

        # Try to load from database first
        if self.db:
            try:
                from app.models.startup import Startup

                db_startups = self.db.query(Startup).all()

                if db_startups:
                    # Convert database models to dict format
                    for s in db_startups:
                        startup_dict = {
                            "name": s.name,
                            "industry": s.industry,
                            "sub_industry": s.sub_industry,
                            "country": s.country,
                            "founded_date": s.founded_date,
                            "closed_date": s.closed_date,
                            "lifespan_days": s.lifespan_days,
                            "total_funding_usd": s.total_funding_usd,
                            "funding_rounds": s.funding_rounds,
                            "death_cause": s.death_cause,
                            "death_cause_details": s.death_cause_details,
                            "stage_at_death": s.stage_at_death,
                            "number_of_employees": s.number_of_employees,
                            "tags": s.tags,
                        }
                        startups.append(startup_dict)

                    print(f"✅ Loaded {len(startups)} startups from database")
                    return startups
            except Exception as e:
                print(f"Warning: Could not load from database: {e}")

        # Fallback to CSV
        print("⚠️  Falling back to CSV file")
        csv_path = "backend/data/failed_startups.csv"

        # Try relative path first
        if not os.path.exists(csv_path):
            csv_path = os.path.join(
                os.path.dirname(__file__), "../../data/failed_startups.csv"
            )

        try:
            import csv as csv_module

            with open(csv_path, "r", encoding="utf-8") as file:
                reader = csv_module.DictReader(file)
                for row in reader:
                    # Convert numeric fields
                    if row.get("lifespan_days"):
                        row["lifespan_days"] = int(row["lifespan_days"])
                    if row.get("total_funding_usd"):
                        row["total_funding_usd"] = float(row["total_funding_usd"])
                    if row.get("funding_rounds"):
                        row["funding_rounds"] = int(row["funding_rounds"])
                    if row.get("number_of_employees"):
                        row["number_of_employees"] = int(row["number_of_employees"])

                    # Parse tags
                    if row.get("tags"):
                        row["tags"] = [
                            tag.strip() for tag in row.get("tags", "").split(",")
                        ]

                    startups.append(row)

            print(f"✅ Loaded {len(startups)} startups from CSV")
        except Exception as e:
            print(f"❌ Warning: Could not load CSV file: {e}")

        return startups

    def _get_industry_stats(self) -> Dict[str, int]:
        """
        Pre-calculate industry failure statistics

        Returns:
            {
                'technology': 15,
                'healthcare': 8,
                ...
            }
        """
        industry_stats = {}
        for startup in self.failed_startups:
            industry = startup.get("industry", "").lower()
            if industry:
                industry_stats[industry] = industry_stats.get(industry, 0) + 1
        return industry_stats

    def get_unique_industries(self) -> List[str]:
        """Return sorted list of unique industries from dataset"""
        industries = list(
            set(
                s.get("industry", "") for s in self.failed_startups if s.get("industry")
            )
        )
        industries.sort()
        return industries

    def get_unique_death_causes(self) -> List[str]:
        """Return sorted list of unique death causes from dataset"""
        causes = list(
            set(
                s.get("death_cause", "")
                for s in self.failed_startups
                if s.get("death_cause")
            )
        )
        causes.sort()
        return causes

    def reload_data(self):
        """Reload data from source"""
        if self._test_mode:
            # In test mode, preserve in-memory dataset
            print(f"🔄 Data reloaded. Total records: {len(self.failed_startups)}")
            return
        self.failed_startups = self._load_failed_startups()
        print(f"🔄 Data reloaded. Total records: {len(self.failed_startups)}")

    def find_similar_startups(
        self, startup_data: Dict[str, Any], top_n: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Find similar failed startups based on industry and characteristics

        Optimized for large datasets with indexing
        """
        industry = startup_data.get("industry", "").lower()
        death_cause = startup_data.get("death_cause", "").lower()
        sub_industry = startup_data.get("sub_industry", "").lower()
        stage = startup_data.get("stage_at_death")

        similar = []

        # Batch processing for large datasets
        batch_size = 1000
        for i in range(0, len(self.failed_startups), batch_size):
            batch = self.failed_startups[i : i + batch_size]

            for failed in batch:
                score = 0

                # Industry match (highest weight)
                if failed.get("industry", "").lower() == industry:
                    score += 3

                # Sub-industry match
                if failed.get("sub_industry", "").lower() == sub_industry:
                    score += 2

                # Death cause match
                if failed.get("death_cause", "").lower() == death_cause:
                    score += 2

                # Stage match
                if failed.get("stage_at_death") == stage:
                    score += 1

                if score > 0:
                    similar.append({**failed, "similarity_score": score})

        # Sort by similarity score and return top N
        similar.sort(key=lambda x: x["similarity_score"], reverse=True)
        return similar[:top_n]

    @staticmethod
    def _get_death_cause_weight(death_cause: str) -> int:
        """Get risk weight for a death cause (exact match). Delegates to FeatureExtractor."""
        return FeatureExtractor._get_death_cause_risk(death_cause)

    @staticmethod
    def _get_financial_risk_weight(total_funding: float) -> int:
        """Get risk weight based on total funding amount. Delegates to FeatureExtractor."""
        return FeatureExtractor._get_funding_risk(total_funding)

    @staticmethod
    def _get_stage_risk_weight(stage: str) -> int:
        """Get risk weight based on funding stage. Delegates to FeatureExtractor."""
        return FeatureExtractor._get_stage_risk(stage)

    @staticmethod
    def _get_employee_risk_weight(employees: int) -> int:
        """Get risk weight based on number of employees. Delegates to FeatureExtractor."""
        return FeatureExtractor._get_employee_risk(employees)

    def calculate_risk_score(self, startup_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate risk score by orchestrating FeatureExtractor and RiskScoringService.

        Returns score (0-100), risk level, and risk factors.
        """
        features = FeatureExtractor().extract_features(startup_data)
        score, risk_level, breakdown = RiskScoringService.score_features(features)

        risk_factors = []
        death_cause = startup_data.get("death_cause", "")
        if features["death_cause_risk"]["value"]:
            risk_factors.append(
                {
                    "factor": "Death Cause Risk",
                    "description": f'Death cause "{death_cause}" contributes {features["death_cause_risk"]["value"]} points',
                    "severity": "high"
                    if features["death_cause_risk"]["value"] >= 25
                    else "medium",
                    "weight": features["death_cause_risk"]["value"],
                }
            )
        if features["funding_risk"]["value"]:
            total_funding = startup_data.get("total_funding_usd", 0)
            risk_factors.append(
                {
                    "factor": "Financial Risk",
                    "description": f'Total funding ${float(total_funding):,.0f} contributes {features["funding_risk"]["value"]} points',
                    "severity": "high"
                    if features["funding_risk"]["value"] >= 20
                    else "medium",
                    "weight": features["funding_risk"]["value"],
                }
            )
        if features["stage_risk"]["value"]:
            stage = startup_data.get("stage_at_death", "")
            risk_factors.append(
                {
                    "factor": "Stage Risk",
                    "description": f'Stage "{stage}" contributes {features["stage_risk"]["value"]} points',
                    "severity": "high",
                    "weight": features["stage_risk"]["value"],
                }
            )
        if features["employee_risk"]["value"]:
            employees = startup_data.get("number_of_employees", 0)
            risk_factors.append(
                {
                    "factor": "Employee Risk",
                    "description": f'{employees} employees contributes {features["employee_risk"]["value"]} points',
                    "severity": "medium",
                    "weight": features["employee_risk"]["value"],
                }
            )

        result = {
            "score": score,
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "total_factors": len(risk_factors),
        }
        if self.debug:
            result["feature_breakdown"] = breakdown
        return result

    def _make_cache_key(self, startup_data: Dict[str, Any]) -> str:
        """Create a deterministic, hashable cache key from startup data"""
        normalized = {k: startup_data.get(k) for k in sorted(startup_data.keys())}
        payload = json.dumps(normalized, sort_keys=True, default=str)
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    def clear_cache(self) -> None:
        """Clear all cached analysis results"""
        self._cache.clear()

    def analyze_startup(self, startup_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Complete startup analysis with explainable AI

        Returns comprehensive analysis including:
        - Risk score with detailed reasoning
        - Similar startups with influence scores
        - Explainable recommendations with confidence
        - Narrative summary
        """
        import time

        start_time = time.perf_counter()

        cache_key = self._make_cache_key(startup_data)
        cached = self._cache.get(cache_key)
        if cached:
            result = {
                "score": cached["risk_score"],
                "risk_level": cached["risk_level"],
                "explanations": cached["explanation"]["reasoning"]
                if "explanation" in cached
                else [],
                "recommendations": cached["recommendations"],
            }
            processing_time_ms = int((time.perf_counter() - start_time) * 1000)
            return {
                "success": True,
                "data": result,
                "meta": {"cached": True, "processing_time_ms": processing_time_ms},
            }

        # Find similar failed startups
        similar_startups = self.find_similar_startups(startup_data, top_n=5)

        # Calculate risk score
        risk_assessment = self.calculate_risk_score(startup_data)

        # Generate recommendations
        recommendations = self._generate_recommendations(
            risk_assessment, similar_startups
        )

        # Initialize explainable AI
        explainer = ExplainableAnalyzer(self.failed_startups)

        # Generate explainable risk score
        risk_explanation = explainer.explain_risk_score(
            startup_data, risk_assessment["score"], risk_assessment["risk_factors"]
        )

        # Generate explainable recommendations
        explained_recommendations = explainer.explain_recommendations(
            recommendations, risk_assessment["risk_factors"], similar_startups
        )

        result = {
            "risk_score": risk_assessment["score"],
            "risk_level": risk_assessment["risk_level"],
            "risk_factors": risk_assessment["risk_factors"],
            "similar_startups": similar_startups,
            "insights": self._generate_insights(similar_startups, startup_data),
            "recommendations": explained_recommendations,
            "explanation": risk_explanation,
            "confidence_score": risk_explanation["confidence_score"],
        }
        if self.debug:
            result["feature_breakdown"] = risk_assessment.get("feature_breakdown")

        self._cache[cache_key] = result

        processing_time_ms = int((time.perf_counter() - start_time) * 1000)
        return {
            "success": True,
            "data": {
                "score": result["risk_score"],
                "risk_level": result["risk_level"],
                "explanations": result["explanation"]["reasoning"]
                if "explanation" in result
                else [],
                "recommendations": result["recommendations"],
            },
            "meta": {"cached": False, "processing_time_ms": processing_time_ms},
        }

    def _generate_insights(
        self, similar_startups: List[Dict], current: Dict[str, Any]
    ) -> List[str]:
        """Generate actionable insights by delegating to InsightService"""
        service = InsightService(similar_startups, current)
        return service.generate_insights()

    def _generate_recommendations(
        self, risk_assessment: Dict, similar_startups: List[Dict]
    ) -> List[str]:
        """Generate recommendations by delegating to InsightService"""
        service = InsightService(similar_startups, {})
        return service.generate_recommendations(
            risk_assessment["score"], risk_assessment.get("risk_factors", [])
        )


# Singleton instance
analyzer = StartupAnalyzer()
