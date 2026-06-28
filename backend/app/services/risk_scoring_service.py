"""
Risk Scoring Service
Applies config weights to extracted features and returns score + risk level
"""

from typing import Any, Dict, Tuple

from app.features.extractor import FeatureExtractor
from app.utils.risk_config import RISK_LEVELS


class RiskScoringService:
    """Service for calculating risk score from features"""

    @staticmethod
    def _get_death_cause_weight(death_cause: str) -> int:
        """Get risk weight for a death cause."""
        return FeatureExtractor._get_death_cause_risk(death_cause)

    @staticmethod
    def _get_financial_risk_weight(total_funding: float) -> int:
        """Get risk weight based on total funding amount."""
        return FeatureExtractor._get_funding_risk(total_funding)

    @staticmethod
    def _get_stage_risk_weight(stage: str) -> int:
        """Get risk weight based on funding stage."""
        return FeatureExtractor._get_stage_risk(stage)

    @staticmethod
    def _get_employee_risk_weight(employees: int) -> int:
        """Get risk weight based on number of employees."""
        return FeatureExtractor._get_employee_risk(employees)

    @staticmethod
    def score_features(
        features: Dict[str, Dict[str, Any]]
    ) -> Tuple[int, str, Dict[str, Dict[str, Any]]]:
        """
        Sum feature weights and determine risk level.

        Args:
            features: Dict with keys like funding_risk, stage_risk, etc.
                      Each value is {'value': int, 'source': str}

        Returns:
            (score, risk_level, breakdown)
        """
        breakdown = {}
        score = 0
        for key, feature in features.items():
            val = feature.get("value", 0) if isinstance(feature, dict) else feature
            score += val
            breakdown[key] = feature
        score = min(score, 100)

        if score >= RISK_LEVELS["critical"][0]:
            risk_level = "Critical"
        elif score >= RISK_LEVELS["high"][0]:
            risk_level = "High"
        elif score >= RISK_LEVELS["medium"][0]:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        return score, risk_level, breakdown
