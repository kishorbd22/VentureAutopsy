"""
FeatureExtractor for Venture Autopsy
Extracts structured numeric features from startup data for risk assessment
"""

from typing import Any, Dict

from app.utils.risk_config import (DEATH_CAUSE_WEIGHTS, DEFAULT_INDUSTRY_RISK,
                                   EMPLOYEE_RISK_THRESHOLDS,
                                   EMPLOYEE_RISK_WEIGHTS,
                                   FUNDING_RISK_THRESHOLDS,
                                   FUNDING_RISK_WEIGHTS, INDUSTRY_RISK,
                                   LATE_STAGES, STAGE_RISK)


class FeatureExtractor:
    """Extracts structured risk features from startup data"""

    @staticmethod
    def _get_death_cause_risk(death_cause: str) -> Dict[str, Any]:
        """Get risk weight for a death cause (0-30)."""
        value = DEATH_CAUSE_WEIGHTS.get(death_cause.lower().strip(), 0)
        return {"value": value, "source": "death_cause_weights"}

    @staticmethod
    def _get_funding_risk(total_funding: float) -> Dict[str, Any]:
        """Get risk weight based on total funding amount (0-20)."""
        if total_funding < FUNDING_RISK_THRESHOLDS["low"]:
            return {"value": FUNDING_RISK_WEIGHTS["low"], "source": "funding_risk_low"}
        elif total_funding <= FUNDING_RISK_THRESHOLDS["medium"]:
            return {
                "value": FUNDING_RISK_WEIGHTS["medium"],
                "source": "funding_risk_medium",
            }
        return {"value": 0, "source": "funding_risk_none"}

    @staticmethod
    def _get_stage_risk(stage: str) -> Dict[str, Any]:
        """Get risk weight based on funding stage (0-20)."""
        stage_lower = stage.lower().strip()
        if stage_lower in LATE_STAGES:
            return {"value": STAGE_RISK["late"], "source": "stage_risk_late"}
        if stage_lower == "series b":
            return {"value": STAGE_RISK["series_b"], "source": "stage_risk_series_b"}
        return {"value": 0, "source": "stage_risk_none"}

    @staticmethod
    def _get_employee_risk(employees: int) -> Dict[str, Any]:
        """Get risk weight based on number of employees (0-10)."""
        if employees < EMPLOYEE_RISK_THRESHOLDS["small"]:
            return {
                "value": EMPLOYEE_RISK_WEIGHTS["small"],
                "source": "employee_risk_small",
            }
        elif employees <= EMPLOYEE_RISK_THRESHOLDS["medium"]:
            return {
                "value": EMPLOYEE_RISK_WEIGHTS["medium"],
                "source": "employee_risk_medium",
            }
        return {"value": 0, "source": "employee_risk_none"}

    @staticmethod
    def _get_industry_risk(industry: str) -> Dict[str, Any]:
        """Get risk weight based on industry (0-20)."""
        if not industry:
            return {"value": 0, "source": "industry_risk_empty"}
        industry_lower = industry.lower().strip()
        for key, weight in INDUSTRY_RISK.items():
            if key in industry_lower or industry_lower in key:
                return {"value": weight, "source": f"industry_risk_{key}"}
        return {"value": DEFAULT_INDUSTRY_RISK, "source": "industry_risk_default"}

    def extract_features(self, startup: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
        """
        Extract structured numeric features from startup data.

        Args:
            startup: Dictionary containing startup data fields

        Returns:
            {
                'funding_risk': {'value': int, 'source': str},
                'stage_risk': {'value': int, 'source': str},
                'employee_risk': {'value': int, 'source': str},
                'industry_risk': {'value': int, 'source': str},
                'death_cause_risk': {'value': int, 'source': str}
            }
        """
        # Death cause risk
        death_cause = startup.get("death_cause", "")
        death_cause_risk = self._get_death_cause_risk(death_cause)

        # Funding risk
        total_funding = startup.get("total_funding_usd")
        if total_funding is not None:
            total_funding = float(total_funding)
            funding_risk = self._get_funding_risk(total_funding)
        else:
            funding_risk = {"value": 0, "source": "funding_risk_missing"}

        # Stage risk
        stage = startup.get("stage_at_death", "")
        if stage:
            stage_risk = self._get_stage_risk(stage)
        else:
            stage_risk = {"value": 0, "source": "stage_risk_missing"}

        # Employee risk
        employees = startup.get("number_of_employees")
        if employees is not None:
            employees = int(employees)
            employee_risk = self._get_employee_risk(employees)
        else:
            employee_risk = {"value": 0, "source": "employee_risk_missing"}

        # Industry risk
        industry = startup.get("industry", "")
        industry_risk = self._get_industry_risk(industry)

        return {
            "funding_risk": funding_risk,
            "stage_risk": stage_risk,
            "employee_risk": employee_risk,
            "industry_risk": industry_risk,
            "death_cause_risk": death_cause_risk,
        }
