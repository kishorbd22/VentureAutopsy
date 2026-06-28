"""
Insight Service
Generates actionable insights and recommendations for startup analysis
"""

from collections import Counter
from typing import Any, Dict, List


class InsightService:
    """Generates insights and recommendations based on analysis results"""

    def __init__(self, similar_startups: List[Dict[str, Any]], current: Dict[str, Any]):
        """
        Initialize insight service

        Args:
            similar_startups: List of similar failed startup records
            current: Current startup data being analyzed
        """
        self.similar_startups = similar_startups
        self.current = current

    def generate_insights(self) -> List[str]:
        """
        Generate actionable insights based on similar startups

        Returns list of insight strings
        """
        insights = []

        if not self.similar_startups:
            insights.append(
                "No directly similar failed startups found in our database."
            )
            return insights

        # Analyze common death causes
        death_causes = [s.get("death_cause", "") for s in self.similar_startups]
        cause_counts = Counter(death_causes)

        if cause_counts:
            most_common_cause = cause_counts.most_common(1)[0]
            insights.append(
                f"Most common failure reason in similar startups: {most_common_cause[0]} "
                f"({most_common_cause[1]} out of {len(self.similar_startups)} similar cases)"
            )

        # Analyze average lifespan (always included when similar startups exist)
        lifespans = [
            s.get("lifespan_days", 0)
            for s in self.similar_startups
            if s.get("lifespan_days")
        ]
        if lifespans:
            avg_lifespan = sum(lifespans) / len(lifespans)
            insights.append(
                f"Similar startups had an average lifespan of {avg_lifespan:.0f} days"
            )
        else:
            insights.append(
                "Similar startups had an average lifespan of unavailable (no lifespan data)"
            )

        # Funding insights
        fundings = [
            s.get("total_funding_usd", 0)
            for s in self.similar_startups
            if s.get("total_funding_usd")
        ]
        if fundings:
            avg_funding = sum(fundings) / len(fundings)
            insights.append(
                f"Average total funding in similar cases: ${avg_funding:,.0f}"
            )

        return insights

    def generate_recommendations(
        self, risk_score: int, risk_factors: List[Dict[str, Any]]
    ) -> List[str]:
        """
        Generate recommendations based on risk factors and score

        Args:
            risk_score: Numerical risk score
            risk_factors: List of risk factor dicts

        Returns list of recommendation strings
        """
        recommendations = []

        # Based on risk factors
        for factor in risk_factors:
            if "Cash Flow" in factor["factor"] or "Runway" in factor["factor"]:
                recommendations.append(
                    "Focus on extending cash runway: reduce burn rate, increase revenue, or raise additional capital."
                )
            elif "Industry" in factor["factor"]:
                recommendations.append(
                    "Study successful companies in your space to understand what differentiation strategies work."
                )
            elif "Market Fit" in factor["factor"] or "Death Cause" in factor["factor"]:
                recommendations.append(
                    "Validate product-market fit more rigorously before scaling. Consider pivoting if metrics are weak."
                )

        # General recommendations
        if risk_score >= 70:
            recommendations.append(
                "⚠️  Critical risk level detected. Consider seeking mentorship and conducting thorough financial planning."
            )

        if not recommendations:
            recommendations.append(
                "Continue monitoring key metrics and stay adaptable to market changes."
            )

        return list(set(recommendations))  # Remove duplicates
