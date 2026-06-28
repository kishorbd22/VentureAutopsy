"""
Explainable AI Module
Provides transparent reasoning for risk scores and recommendations
"""

from collections import Counter
from typing import Any, Dict, List


class ExplainableAnalyzer:
    """Generates explainable insights for startup risk analysis"""

    def __init__(self, failed_startups: List[Dict[str, Any]]):
        self.failed_startups = failed_startups
        self.industry_stats = self._calculate_industry_stats()

    def _calculate_industry_stats(self) -> Dict[str, Dict[str, Any]]:
        """Calculate detailed statistics per industry"""
        industry_data = {}

        for startup in self.failed_startups:
            industry = startup.get("industry", "").lower()
            if not industry:
                continue

            if industry not in industry_data:
                industry_data[industry] = {
                    "count": 0,
                    "total_funding": 0,
                    "total_lifespan": 0,
                    "death_causes": Counter(),
                    "stages": Counter(),
                    "funding_list": [],
                    "lifespan_list": [],
                }

            stats = industry_data[industry]
            stats["count"] += 1

            if startup.get("total_funding_usd"):
                stats["total_funding"] += startup["total_funding_usd"]
                stats["funding_list"].append(startup["total_funding_usd"])

            if startup.get("lifespan_days"):
                stats["total_lifespan"] += startup["lifespan_days"]
                stats["lifespan_list"].append(startup["lifespan_days"])

            if startup.get("death_cause"):
                stats["death_causes"][startup["death_cause"]] += 1

            if startup.get("stage_at_death"):
                stats["stages"][startup["stage_at_death"]] += 1

        # Calculate averages
        for industry, stats in industry_data.items():
            if stats["count"] > 0:
                stats["avg_funding"] = stats["total_funding"] / stats["count"]
                stats["avg_lifespan"] = stats["total_lifespan"] / stats["count"]
                stats["median_funding"] = self._median(stats["funding_list"])
                stats["median_lifespan"] = self._median(stats["lifespan_list"])

        return industry_data

    @staticmethod
    def _median(values: List[float]) -> float:
        """Calculate median"""
        if not values:
            return 0
        sorted_values = sorted(values)
        n = len(sorted_values)
        if n % 2 == 0:
            return (sorted_values[n // 2 - 1] + sorted_values[n // 2]) / 2
        return sorted_values[n // 2]

    def explain_risk_score(
        self, startup_data: Dict[str, Any], risk_score: int, risk_factors: List[Dict]
    ) -> Dict[str, Any]:
        """
        Generate detailed explanation for risk score

        Returns:
            {
                'summary': str,
                'reasoning': [...],
                'influential_startups': [...],
                'confidence_score': float
            }
        """
        reasoning = []
        influential_startups = []
        confidence_scores = []

        # Explain each risk factor
        for factor in risk_factors:
            factor_reasoning = self._explain_factor(factor, startup_data)
            reasoning.append(factor_reasoning)
            confidence_scores.append(factor_reasoning["confidence"])

            # Find influential startups for this factor
            influential = self._find_influential_startups(factor, startup_data)
            influential_startups.extend(influential)

        # Calculate overall confidence
        overall_confidence = (
            sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
        )

        # Generate narrative summary
        summary = self._generate_narrative_summary(
            startup_data, risk_score, risk_factors, reasoning
        )

        # Remove duplicates while preserving order
        seen = set()
        unique_influential = []
        for s in influential_startups:
            if s["name"] not in seen:
                seen.add(s["name"])
                unique_influential.append(s)

        return {
            "summary": summary,
            "reasoning": reasoning,
            "influential_startups": unique_influential[:5],  # Top 5
            "confidence_score": round(overall_confidence, 2),
        }

    def _get_matching_startups_by_factor(
        self, factor: Dict[str, Any], startup_data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Find historical startups matching this risk factor"""
        factor_name = factor.get("factor", "")
        matches = []

        for startup in self.failed_startups:
            matched = False

            if "Death Cause" in factor_name:
                death_cause = startup_data.get("death_cause", "")
                if (
                    death_cause
                    and startup.get("death_cause", "").lower() == death_cause.lower()
                ):
                    matched = True

            elif "Financial" in factor_name:
                funding = startup_data.get("total_funding_usd")
                if funding is not None:
                    s_funding = startup.get("total_funding_usd")
                    if s_funding is not None and s_funding < 1000000:
                        matched = True

            elif "Stage" in factor_name:
                stage = startup_data.get("stage_at_death", "")
                if stage and startup.get("stage_at_death", "").lower() == stage.lower():
                    matched = True

            elif "Employee" in factor_name:
                emp = startup_data.get("number_of_employees")
                if emp is not None:
                    s_emp = startup.get("number_of_employees")
                    if s_emp is not None and s_emp < 200:
                        matched = True

            else:
                # Generic: match on industry or death_cause
                if (
                    startup.get("industry", "").lower()
                    == startup_data.get("industry", "").lower()
                ):
                    matched = True

            if matched:
                matches.append(startup)

        return matches

    def _explain_factor(
        self, factor: Dict[str, Any], startup_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Explain a single risk factor with deterministic formatting"""
        factor_name = factor["factor"]
        severity = factor["severity"]
        weight = factor["weight"]
        description = factor["description"]

        # Find matching historical failures
        matches = self._get_matching_startups_by_factor(factor, startup_data)
        match_count = len(matches)
        startup_names = [s.get("name", "Unknown") for s in matches[:5]]

        # Build explanation with required format:
        # "Factor: {description} matches {n} historical failures: {names}"
        if startup_names:
            names_str = ", ".join(startup_names)
            explanation = (
                f"Factor: {description} matches {match_count} "
                f"historical failures: {names_str}"
            )
        else:
            explanation = (
                f"Factor: {description} matches {match_count} "
                f"historical failures in our database"
            )

        # Confidence calculation:
        # base = 0.5, +0.1 per match, cap at 0.95
        confidence = min(0.95, 0.5 + (match_count * 0.1))

        return {
            "factor": factor_name,
            "severity": severity,
            "weight": weight,
            "explanation": explanation,
            "confidence": confidence,
            "educational_tip": self._get_educational_tip(factor_name),
        }

    def _get_educational_tip(self, factor_name: str) -> str:
        """Get educational tip for risk factor"""
        tips = {
            "Industry": "💡 Industry failure rates are historical averages. Success is still possible with the right strategy and execution.",
            "Late Stage": "💡 Late-stage failures often stem from growth-at-all-costs mentality. Focus on sustainable unit economics.",
            "Cash Runway": "💡 The Rule of 18: Aim for 18+ months of runway. Consider extending through revenue growth or cost cuts.",
            "Death Cause": "💡 Understanding past failures is the first step to avoiding them. Learn from those who came before you.",
            "High Burn Rate": "💡 Benchmark: Aim for burn multiple under 1.5x in early stages, improving to 1.0x or lower at scale.",
        }

        for key, tip in tips.items():
            if key in factor_name:
                return tip

        return "💡 Context matters. Use this insight alongside other factors for a complete picture."

    def _find_influential_startups(
        self, factor: Dict[str, Any], startup_data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Find historical startups that influenced this risk factor"""
        influential = []

        for startup in self.failed_startups:
            relevance = self._calculate_relevance(startup, factor, startup_data)
            if relevance > 0:
                influential.append(
                    {
                        "name": startup.get("name", "Unknown"),
                        "industry": startup.get("industry", ""),
                        "death_cause": startup.get("death_cause", ""),
                        "relevance_score": relevance,
                        "matching_factors": self._get_matching_factors(
                            startup, factor, startup_data
                        ),
                    }
                )

        # Sort by relevance
        influential.sort(key=lambda x: x["relevance_score"], reverse=True)
        return influential[:3]

    def _calculate_relevance(
        self, startup: Dict, factor: Dict, startup_data: Dict
    ) -> float:
        """Calculate how relevant a historical startup is to this factor"""
        score = 0.0

        # Industry match
        if (
            startup.get("industry", "").lower()
            == startup_data.get("industry", "").lower()
        ):
            score += 0.3

        # Death cause match
        if (
            startup.get("death_cause", "")
            and factor["factor"] in startup["death_cause"]
        ):
            score += 0.3

        # Stage match
        if startup.get("stage_at_death") == startup_data.get("stage_at_death"):
            score += 0.2

        # Similar metrics
        if startup.get("total_funding_usd") and startup_data.get("total_funding_usd"):
            funding_ratio = min(
                startup["total_funding_usd"], startup_data["total_funding_usd"]
            ) / max(startup["total_funding_usd"], startup_data["total_funding_usd"])
            score += funding_ratio * 0.2

        return score

    def _get_matching_factors(
        self, startup: Dict, factor: Dict, startup_data: Dict
    ) -> List[str]:
        """Get list of matching factors"""
        matches = []

        if (
            startup.get("industry", "").lower()
            == startup_data.get("industry", "").lower()
        ):
            matches.append("Industry")

        if startup.get("death_cause", "") == startup_data.get("death_cause", ""):
            matches.append("Death Cause")

        if startup.get("stage_at_death") == startup_data.get("stage_at_death"):
            matches.append("Stage")

        return matches

    def _generate_narrative_summary(
        self,
        startup_data: Dict[str, Any],
        risk_score: int,
        risk_factors: List[Dict],
        reasoning: List[Dict],
    ) -> str:
        """Generate founder-friendly narrative summary"""
        startup_name = startup_data.get("name", "Your startup")
        industry = startup_data.get("industry", "your industry")
        risk_level = self._get_risk_level(risk_score)

        # Build narrative
        narrative_parts = []

        # Opening
        narrative_parts.append(
            f"Based on our analysis of {len(self.failed_startups)} historical startup failures, "
            f"{startup_name} shows a {risk_level.lower()} risk profile with a score of {risk_score}/100. "
            f"This assessment is based on patterns observed in {len([s for s in self.failed_startups if s.get('industry', '').lower() == industry.lower()])} "
            f"similar companies in {industry}."
        )

        # Key concerns
        if risk_factors:
            top_factors = [f["factor"] for f in risk_factors[:3]]
            narrative_parts.append(
                f"The primary concerns are: {', '.join(top_factors)}. "
                f"Each of these factors has contributed to the overall risk assessment."
            )

        # Similar startups
        similar = self._find_top_similar_startups(startup_data, top_n=2)
        if similar:
            names = [s["name"] for s in similar]
            narrative_parts.append(
                f"Notable cases with similar profiles include {', '.join(names)}. "
                f"Studying their journeys can provide actionable insights for your startup."
            )

        # Call to action
        narrative_parts.append(
            "We recommend reviewing the detailed recommendations below and considering "
            "how to address each identified risk factor. Remember, awareness of these risks "
            "is the first step toward building a resilient business."
        )

        return " ".join(narrative_parts)

    def _get_risk_level(self, score: int) -> str:
        """Get risk level from score"""
        if score >= 70:
            return "Critical"
        elif score >= 41:
            return "High"
        elif score >= 21:
            return "Medium"
        return "Low"

    def _find_top_similar_startups(
        self, startup_data: Dict, top_n: int = 3
    ) -> List[Dict]:
        """Find most similar historical startups"""
        scored = []

        for startup in self.failed_startups:
            score = 0
            if (
                startup.get("industry", "").lower()
                == startup_data.get("industry", "").lower()
            ):
                score += 3
            if (
                startup.get("death_cause", "").lower()
                == startup_data.get("death_cause", "").lower()
            ):
                score += 2
            if startup.get("stage_at_death") == startup_data.get("stage_at_death"):
                score += 1

            if score > 0:
                scored.append({**startup, "similarity_score": score})

        scored.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored[:top_n]

    def explain_recommendations(
        self,
        recommendations: List[str],
        risk_factors: List[Dict],
        similar_startups: List[Dict],
    ) -> List[Dict[str, Any]]:
        """
        Explain why each recommendation was generated

        Returns:
            [
                {
                    'recommendation': str,
                    'reasoning': str,
                    'based_on_factors': [...],
                    'confidence': float,
                    'priority': int
                }
            ]
        """
        explained_recs = []

        for idx, rec in enumerate(recommendations, 1):
            # Determine which factors this recommendation addresses
            related_factors = []
            for factor in risk_factors:
                if self._recommendation_matches_factor(rec, factor):
                    related_factors.append(factor["factor"])

            # Calculate confidence based on related factors
            confidence = min(0.95, 0.6 + (len(related_factors) * 0.1))

            # Generate reasoning
            reasoning = self._generate_recommendation_reasoning(
                rec, related_factors, similar_startups
            )

            explained_recs.append(
                {
                    "recommendation": rec,
                    "reasoning": reasoning,
                    "based_on_factors": related_factors,
                    "confidence": round(confidence, 2),
                    "priority": idx,
                }
            )

        return explained_recs

    def _recommendation_matches_factor(self, rec: str, factor: Dict) -> bool:
        """Check if a recommendation addresses a specific factor"""
        rec_lower = rec.lower()
        factor_name = factor["factor"].lower()

        if "cash" in rec_lower or "runway" in rec_lower or "burn" in rec_lower:
            return "cash" in factor_name or "runway" in factor_name
        elif "industry" in rec_lower or "market" in rec_lower:
            return "industry" in factor_name or "market" in factor_name
        elif "mentorship" in rec_lower or "planning" in rec_lower:
            return True  # General recommendation for critical risk
        elif "product" in rec_lower or "fit" in rec_lower or "pivot" in rec_lower:
            return "market fit" in factor_name or "death cause" in factor_name

        return False

    def _generate_recommendation_reasoning(
        self, rec: str, related_factors: List[str], similar_startups: List[Dict]
    ) -> str:
        """Generate reasoning for why this recommendation was made"""
        reasoning_parts = []

        if related_factors:
            reasoning_parts.append(
                f"This recommendation is based on {len(related_factors)} identified risk factor(s): "
                f"{', '.join(related_factors)}."
            )

        # Add evidence from similar startups
        if similar_startups:
            reasoning_parts.append(
                f"Our analysis of {len(similar_startups)} similar failed startups shows that "
                f"addressing these factors was critical for survival."
            )

        # Add generic reasoning based on recommendation content
        if "cash" in rec.lower() or "runway" in rec.lower():
            reasoning_parts.append(
                "Cash management is one of the top reasons startups fail. "
                "Extending runway provides more time to achieve profitability or secure additional funding."
            )
        elif "product-market fit" in rec.lower() or "pivot" in rec.lower():
            reasoning_parts.append(
                "Product-market fit is essential for sustainable growth. "
                "Many startups fail because they build something nobody wants badly enough to pay for."
            )
        elif "industry" in rec.lower() or "differentiation" in rec.lower():
            reasoning_parts.append(
                "Understanding what makes successful companies in your space different "
                "can help you avoid common pitfalls and identify your unique value proposition."
            )
        elif "mentorship" in rec.lower() or "planning" in rec.lower():
            reasoning_parts.append(
                "Critical risk levels indicate significant challenges ahead. "
                "Seeking external guidance and thorough planning can make the difference between success and failure."
            )

        return (
            " ".join(reasoning_parts)
            if reasoning_parts
            else "Based on overall risk assessment."
        )
