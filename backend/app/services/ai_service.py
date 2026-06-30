"""
AI Service
Provides LLM-powered insights, report generation, and scenario simulation
"""

from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.models.analysis import Analysis


class AIService:
    """Service for AI-powered features"""

    def __init__(self, db: Session):
        self.db = db

    def generate_report(self, analysis_id: int) -> Dict[str, Any]:
        """
        Generate a comprehensive AI report for an analysis
        In production, this would call an LLM API (OpenAI, Gemini, etc.)
        """
        analysis = self.db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            raise ValueError(f"Analysis {analysis_id} not found")

        # Simulate AI-generated report
        # In production: call OpenAI API with analysis data as context
        report = {
            "executive_summary": self._generate_executive_summary(analysis),
            "detailed_analysis": self._generate_detailed_analysis(analysis),
            "risk_factors": self._generate_risk_factors(analysis),
            "recommendations": self._generate_recommendations(analysis),
            "industry_comparison": self._generate_industry_comparison(analysis),
            "action_plan": self._generate_action_plan(analysis),
        }

        return report

    def _generate_executive_summary(self, analysis: Analysis) -> str:
        """Generate executive summary using LLM"""
        # Placeholder - in production use actual LLM
        return f"""
Based on our analysis of {analysis.startup_name or 'your startup'} in the {analysis.industry or 'technology'} sector,
we have identified a risk score of {analysis.risk_score}/100, categorized as {analysis.risk_level} risk.

Key findings indicate that while the venture shows promise in several areas, there are critical risk factors
that require immediate attention. Our analysis draws from patterns observed in over 50,000 historical startup failures.

The primary concerns revolve around funding strategy, market positioning, and operational efficiency.
With strategic interventions, there is a viable path to mitigating these risks and improving success probability.
""".strip()

    def _generate_detailed_analysis(self, analysis: Analysis) -> List[Dict[str, str]]:
        """Generate detailed analysis sections"""
        return [
            {
                "title": "Financial Health",
                "content": f"Analysis of funding trajectory and burn rate suggests {'concern' if analysis.risk_score > 50 else 'moderate stability'}. "
                          f"With ${analysis.total_funding_usd or 0:,.0f} in total funding and {analysis.number_of_employees or 0} employees, "
                          f"the cost structure requires optimization."
            },
            {
                "title": "Market Positioning",
                "content": f"The {analysis.industry or 'technology'} sector shows {'high' if analysis.risk_score > 60 else 'moderate'} volatility. "
                          f"Competitive analysis reveals both opportunities and threats in the current landscape."
            },
            {
                "title": "Operational Efficiency",
                "content": "Team composition and operational processes are evaluated against industry benchmarks. "
                          "Recommendations for improvement are provided in the action plan section."
            },
        ]

    def _generate_risk_factors(self, analysis: Analysis) -> List[Dict[str, Any]]:
        """Generate prioritized risk factors"""
        risks = []
        
        if analysis.risk_score > 70:
            risks.append({
                "severity": "critical",
                "factor": "Cash Flow Management",
                "description": "High risk of running out of capital within 12-18 months",
                "mitigation": "Extend runway through cost reduction or additional funding"
            })
        
        if analysis.death_cause:
            risks.append({
                "severity": "high",
                "factor": "Failure Pattern Match",
                "description": f"Similar startups failed due to: {analysis.death_cause}",
                "mitigation": "Address root causes identified in historical cases"
            })
        
        risks.append({
            "severity": "medium",
            "factor": "Market Timing",
            "description": "Current market conditions may affect growth trajectory",
            "mitigation": "Develop contingency plans for different market scenarios"
        })
        
        return risks

    def _generate_recommendations(self, analysis: Analysis) -> List[str]:
        """Generate AI-powered recommendations"""
        recommendations = [
            "Implement monthly financial projections with 18-month runway visibility",
            "Establish key performance indicators for all critical business functions",
            "Develop customer retention strategy to improve unit economics",
            "Explore strategic partnerships to accelerate market penetration",
            "Consider diversifying revenue streams to reduce dependency risk",
        ]
        
        if analysis.risk_score > 60:
            recommendations.extend([
                "Urgent: Review and optimize cost structure immediately",
                "Consider pivoting to a more sustainable business model",
                "Engage with advisors who have experience in turnaround situations"
            ])
        
        return recommendations

    def _generate_industry_comparison(self, analysis: Analysis) -> Dict[str, Any]:
        """Generate industry benchmarking"""
        return {
            "industry": analysis.industry or "Technology",
            "avg_success_rate": "23%",
            "avg_lifespan_years": 3.2,
            "common_failure_points": [
                "Insufficient market validation",
                "Poor unit economics",
                "Team dysfunction",
                "Competitive pressure"
            ],
            "your_position": "Below average" if analysis.risk_score > 50 else "Average",
            "percentile": f"{max(0, 100 - analysis.risk_score)}th"
        }

    def _generate_action_plan(self, analysis: Analysis) -> List[Dict[str, Any]]:
        """Generate 90-day action plan"""
        return [
            {
                "phase": "Immediate (0-30 days)",
                "actions": [
                    "Audit all expenses and identify quick cost savings",
                    "Set up weekly financial tracking dashboard",
                    "Schedule board meeting to discuss risk findings"
                ]
            },
            {
                "phase": "Short-term (30-60 days)",
                "actions": [
                    "Launch customer success program",
                    "Optimize pricing strategy based on market research",
                    "Begin strategic partnership discussions"
                ]
            },
            {
                "phase": "Medium-term (60-90 days)",
                "actions": [
                    "Evaluate product-market fit metrics",
                    "Prepare materials for potential fundraising",
                    "Implement OKR tracking system"
                ]
            }
        ]

    def chat_with_analysis(self, analysis_id: int, user_message: str, conversation_history: List[Dict]) -> Dict[str, Any]:
        """
        Chat with AI about an analysis
        Enables Q&A like "What if I raise $2M?"
        """
        analysis = self.db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            raise ValueError(f"Analysis {analysis_id} not found")

        # In production: Use actual LLM with context from analysis
        # Simulate intelligent response based on keywords
        response = self._generate_ai_response(analysis, user_message)
        
        return {
            "response": response,
            "analysis_context": {
                "industry": analysis.industry,
                "risk_score": analysis.risk_score,
                "risk_level": analysis.risk_level
            },
            "suggested_questions": [
                "What are my biggest risks?",
                "How can I improve my score?",
                "What similar startups succeeded?",
                "What's my runway?"
            ]
        }

    def _generate_ai_response(self, analysis: Analysis, message: str) -> str:
        """Generate contextual AI response"""
        message_lower = message.lower()
        
        # Scenario simulation: "What if I raise $2M?"
        if "raise" in message_lower or "funding" in message_lower or "$" in message:
            return f"""
Based on scenario analysis, raising additional funding would have the following impact:

Current Risk Score: {analysis.risk_score}/100
Projected Score with $2M: {max(0, analysis.risk_score - 15)}/100

Key improvements:
- Extended runway from ~12 months to ~24 months
- Reduced immediate cash flow pressure
- Ability to invest in growth initiatives

New risks introduced:
- Increased burn rate expectations
- Higher valuation pressure
- Need to show rapid growth

Recommendation: Raising $2M would significantly improve your position, 
but ensure you have a clear plan for achieving key milestones within 12 months.
""".strip()

        # General Q&A
        if "risk" in message_lower:
            return f"Your primary risks are centered around {analysis.death_cause or 'market positioning'}. " \
                   f"With a risk score of {analysis.risk_score}, immediate attention to cash flow management is critical."

        if "improve" in message_lower or "better" in message_lower:
            return "Focus on three areas: 1) Extend runway, 2) Improve unit economics, 3) Strengthen team. " \
                   "These have the highest impact on reducing failure probability."

        # Default response
        return f"""
Based on your analysis (Risk Score: {analysis.risk_score}, Industry: {analysis.industry}),
I can help you understand the specific factors contributing to your risk profile and provide
tailored recommendations. What specific aspect would you like to explore?
""".strip()

    def simulate_scenario(self, analysis_id: int, scenario_params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Simulate 'what-if' scenarios
        E.g., "What if I raise $2M?", "What if I pivot to SaaS?"
        """
        analysis = self.db.query(Analysis).filter(Analysis.id == analysis_id).first()
        if not analysis:
            raise ValueError(f"Analysis {analysis_id} not found")

        # Simulate scenario impact
        base_score = analysis.risk_score
        score_impact = 0
        narrative = ""
        recommendations = []

        # Funding increase scenario
        if "funding" in scenario_params or scenario_params.get("raise_amount"):
            amount = scenario_params.get("raise_amount", 1000000)
            impact_pct = min(20, (amount / 1000000) * 10)  # -10 points per $1M, max -20
            score_impact = -impact_pct
            narrative = f"Raising ${amount:,.0f} would reduce your risk score by {impact_pct:.0f} points, " \
                       f"primarily by extending runway and reducing immediate cash flow pressure."
            recommendations = [
                f"Target raise amount: ${amount:,.0f}",
                "Prepare detailed financial projections",
                "Identify strategic investors in your industry",
                "Set clear 18-month milestones"
            ]

        # Pivot scenario
        elif "pivot" in scenario_params or scenario_params.get("new_industry"):
            new_industry = scenario_params.get("new_industry", "SaaS")
            score_impact = -5  # Pivots are risky but show adaptability
            narrative = f"Pivoting to {new_industry} would likely have mixed results. " \
                       f"While it signals adaptability, it also introduces execution risk in an unfamiliar market."
            recommendations = [
                f"Validate demand in {new_industry} with 20+ customer interviews",
                "Assess team's ability to execute in new domain",
                "Consider gradual transition rather than full pivot"
            ]

        # Team expansion scenario
        elif "team" in scenario_params or scenario_params.get("new_hires"):
            hires = scenario_params.get("new_hires", 5)
            score_impact = -3 if hires <= 10 else 2  # Small teams good, large teams risky
            narrative = f"Hiring {hires} people would {'help' if hires <= 10 else 'increase'} your execution capacity, " \
                       f"but also increases burn rate significantly."
            recommendations = [
                "Priority hires: CTO, Head of Sales, Customer Success Lead",
                "Use equity strategically to conserve cash",
                "Implement remote-first to reduce office costs"
            ]

        else:
            # Generic improvement scenario
            score_impact = -8
            narrative = "Implementing best practices across all areas would improve your risk profile significantly."
            recommendations = [
                "Focus on customer retention (aim for >90% NRR)",
                "Optimize pricing for growth",
                "Build strategic partnerships",
                "Improve operational efficiency"
            ]

        new_score = max(0, min(100, base_score + score_impact))
        
        return {
            "scenario": scenario_params,
            "original_score": base_score,
            "projected_score": round(new_score),
            "improvement": round(abs(score_impact)),
            "risk_reduction_percent": round((abs(score_impact) / base_score) * 100) if base_score > 0 else 0,
            "narrative": narrative,
            "recommendations": recommendations,
            "confidence": "High" if abs(score_impact) > 10 else "Medium",
            "key_assumptions": [
                "Assumes successful execution of recommended actions",
                "Based on historical patterns from similar companies",
                "Market conditions remain stable"
            ]
        }