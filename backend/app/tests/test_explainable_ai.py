"""
Tests for ExplainableAnalyzer
"""

import pytest

from app.utils.explainable_ai import ExplainableAnalyzer


class TestExplainableAnalyzer:
    """Test suite for ExplainableAnalyzer"""

    @pytest.fixture
    def mock_failed_startups(self):
        """Mock failed startups data"""
        return [
            {
                "name": "WeWork",
                "industry": "Real Estate",
                "sub_industry": "Coworking",
                "death_cause": "Cash Flow Problems",
                "stage_at_death": "Series G",
                "lifespan_days": 5000,
                "total_funding_usd": 12000000000,
                "number_of_employees": 12000,
            },
            {
                "name": "Theranos",
                "industry": "Healthcare",
                "sub_industry": "Health Tech",
                "death_cause": "Fraud",
                "stage_at_death": "Series C",
                "lifespan_days": 5700,
                "total_funding_usd": 700000000,
                "number_of_employees": 800,
            },
            {
                "name": "Juicero",
                "industry": "Consumer Electronics",
                "sub_industry": "Kitchen Tech",
                "death_cause": "Market Fit Issues",
                "stage_at_death": "Series B",
                "lifespan_days": 1700,
                "total_funding_usd": 120000000,
                "number_of_employees": 300,
            },
            {
                "name": "Quibi",
                "industry": "Media & Entertainment",
                "sub_industry": "Streaming",
                "death_cause": "Market Fit Issues",
                "stage_at_death": "Series C",
                "lifespan_days": 1060,
                "total_funding_usd": 1750000000,
                "number_of_employees": 200,
            },
            {
                "name": "FTX",
                "industry": "FinTech",
                "sub_industry": "Cryptocurrency",
                "death_cause": "Fraud",
                "stage_at_death": "Series C",
                "lifespan_days": 1395,
                "total_funding_usd": 2000000000,
                "number_of_employees": 350,
            },
        ]

    def test_explainable_analyzer_initialization(self, mock_failed_startups):
        """Test explainable analyzer initialization"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        assert explainer.failed_startups == mock_failed_startups
        assert len(explainer.industry_stats) > 0

    def test_explain_risk_score_returns_required_fields(self, mock_failed_startups):
        """Test explain_risk_score returns all required fields"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        startup_data = {
            "name": "TestStartup",
            "industry": "Real Estate",
            "death_cause": "Cash Flow Problems",
        }

        risk_factors = [
            {
                "factor": "High Industry Failure Rate",
                "severity": "high",
                "weight": 20,
                "description": "Real Estate has many failures",
            }
        ]

        result = explainer.explain_risk_score(startup_data, 65, risk_factors)

        assert "summary" in result
        assert "reasoning" in result
        assert "influential_startups" in result
        assert "confidence_score" in result

    def test_explain_risk_score_confidence_calculation(self, mock_failed_startups):
        """Test confidence score is calculated correctly"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        startup_data = {
            "name": "TestStartup",
            "industry": "Real Estate",
            "death_cause": "Cash Flow Problems",
        }

        risk_factors = [
            {
                "factor": "High Industry Failure Rate",
                "severity": "high",
                "weight": 20,
                "description": "Test",
            }
        ]

        result = explainer.explain_risk_score(startup_data, 65, risk_factors)

        # Confidence should be between 0 and 1
        assert 0 <= result["confidence_score"] <= 1

    def test_explain_risk_score_influential_startups_found(self, mock_failed_startups):
        """Test that influential startups are identified"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        startup_data = {
            "name": "TestStartup",
            "industry": "Real Estate",
            "death_cause": "Cash Flow Problems",
            "stage_at_death": "Series G",
        }

        risk_factors = [
            {
                "factor": "High Industry Failure Rate",
                "severity": "high",
                "weight": 20,
                "description": "Real Estate has failures",
            }
        ]

        result = explainer.explain_risk_score(startup_data, 65, risk_factors)

        # Should find WeWork as influential
        assert len(result["influential_startups"]) > 0
        names = [s["name"] for s in result["influential_startups"]]
        assert "WeWork" in names

    def test_explain_factor_industry(self, mock_failed_startups):
        """Test industry factor explanation"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        factor = {
            "factor": "High Industry Failure Rate",
            "severity": "high",
            "weight": 20,
            "description": "Industry has many failures",
        }

        startup_data = {"industry": "Real Estate"}

        result = explainer._explain_factor(factor, startup_data)

        assert "explanation" in result
        assert "confidence" in result
        assert "educational_tip" in result
        assert "Factor:" in result["explanation"]
        assert 0 <= result["confidence"] <= 1

    def test_explain_factor_late_stage(self, mock_failed_startups):
        """Test late stage factor explanation"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        factor = {
            "factor": "Late Stage Risk",
            "severity": "high",
            "weight": 15,
            "description": "Late stage risk test",
        }

        startup_data = {"stage_at_death": "Series C"}

        result = explainer._explain_factor(factor, startup_data)

        assert "Factor:" in result["explanation"]
        # Stage matching looks for exact stage match, and Theranos/Quibi/FTX are Series C
        assert result["confidence"] >= 0.5
        assert result["confidence"] <= 0.95

    def test_explain_factor_cash_runway(self, mock_failed_startups):
        """Test cash runway factor explanation"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        factor = {
            "factor": "Low Cash Runway",
            "severity": "critical",
            "weight": 25,
            "description": "Only 6 months runway",
        }

        startup_data = {}

        result = explainer._explain_factor(factor, startup_data)

        assert "Factor:" in result["explanation"]
        assert "historical failures" in result["explanation"]
        # No death_cause or industry match with empty startup_data, so generic fallback
        # Generic matches on industry, but no industry provided -> match_count=0
        # confidence = 0.5 + 0*0.1 = 0.5
        assert result["confidence"] == 0.5

    def test_explain_factor_death_cause(self, mock_failed_startups):
        """Test death cause factor explanation"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        factor = {
            "factor": "Death Cause Risk",
            "severity": "high",
            "weight": 20,
            "description": "Fraud detected",
        }

        startup_data = {"death_cause": "Fraud"}

        result = explainer._explain_factor(factor, startup_data)

        assert "Factor:" in result["explanation"]
        assert "Fraud" in result["explanation"] or "Fraud" in result["description"]
        # Theranos and FTX have Fraud death cause
        assert "Theranos" in result["explanation"]
        assert "FTX" in result["explanation"]
        # confidence = 0.5 + 2*0.1 = 0.7
        assert result["confidence"] == 0.7

    def test_get_educational_tip(self, mock_failed_startups):
        """Test educational tips are returned"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        tip = explainer._get_educational_tip("Industry")
        assert "💡" in tip
        assert len(tip) > 20

        tip = explainer._get_educational_tip("Cash Runway")
        assert "Rule of 18" in tip or "runway" in tip.lower()

    def test_get_educational_tip_default(self, mock_failed_startups):
        """Test default educational tip"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        tip = explainer._get_educational_tip("Unknown Factor")
        assert "💡" in tip
        assert len(tip) > 20

    def test_find_influential_startups(self, mock_failed_startups):
        """Test finding influential startups"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        factor = {
            "factor": "High Industry Failure Rate",
            "severity": "high",
            "weight": 20,
        }

        startup_data = {
            "industry": "Real Estate",
            "death_cause": "Cash Flow Problems",
            "stage_at_death": "Series G",
        }

        influential = explainer._find_influential_startups(factor, startup_data)

        assert len(influential) > 0
        assert all("relevance_score" in s for s in influential)
        assert all("matching_factors" in s for s in influential)

    def test_calculate_relevance_industry_match(self, mock_failed_startups):
        """Test relevance calculation with industry match"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        startup = {
            "industry": "Real Estate",
            "death_cause": "Cash Flow Problems",
            "stage_at_death": "Series G",
            "total_funding_usd": 1000000000,
        }

        factor = {"factor": "Industry Risk"}
        startup_data = {"industry": "Real Estate", "total_funding_usd": 1000000000}

        relevance = explainer._calculate_relevance(startup, factor, startup_data)

        assert relevance > 0
        assert relevance <= 1.0

    def test_calculate_relevance_no_match(self, mock_failed_startups):
        """Test relevance calculation with no matches"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        startup = {
            "industry": "Unknown",
            "death_cause": "Unknown",
            "stage_at_death": "Pre-Seed",
        }

        factor = {"factor": "Test"}
        startup_data = {
            "industry": "Different",
            "death_cause": "Different",
            "stage_at_death": "Seed",
        }

        relevance = explainer._calculate_relevance(startup, factor, startup_data)
        assert relevance == 0

    def test_generate_narrative_summary(self, mock_failed_startups):
        """Test narrative summary generation"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        startup_data = {"name": "TestStartup", "industry": "Real Estate"}

        risk_factors = [{"factor": "Industry Risk"}, {"factor": "Cash Flow Problems"}]

        reasoning = []

        summary = explainer._generate_narrative_summary(
            startup_data, 75, risk_factors, reasoning
        )

        assert "TestStartup" in summary
        assert "Real Estate" in summary
        assert "75" in summary
        assert len(summary) > 100  # Should be substantial

    def test_explain_recommendations(self, mock_failed_startups):
        """Test recommendation explanation"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        recommendations = [
            "Focus on extending cash runway: reduce burn rate.",
            "Study successful companies in your space.",
        ]

        risk_factors = [
            {"factor": "Low Cash Runway", "severity": "critical"},
            {"factor": "High Industry Failure Rate", "severity": "high"},
        ]

        similar_startups = [{"name": "WeWork", "death_cause": "Cash Flow Problems"}]

        explained = explainer.explain_recommendations(
            recommendations, risk_factors, similar_startups
        )

        assert len(explained) == 2
        assert all("reasoning" in e for e in explained)
        assert all("confidence" in e for e in explained)
        assert all("priority" in e for e in explained)
        assert explained[0]["priority"] == 1
        assert explained[1]["priority"] == 2

    def test_explain_recommendations_confidence_calculation(self, mock_failed_startups):
        """Test confidence calculation for recommendations"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        # Use a recommendation that matches "cash" or "runway" factors
        recommendations = [
            "Focus on extending cash runway: reduce burn rate, increase revenue, or raise additional capital."
        ]
        risk_factors = [{"factor": "Low Cash Runway"}, {"factor": "High Industry Risk"}]

        explained = explainer.explain_recommendations(recommendations, risk_factors, [])

        # Recommendation contains "cash" and "runway" => matches "Low Cash Runway" (1 factor)
        # confidence = 0.6 + 0.1*1 = 0.7
        assert explained[0]["confidence"] >= 0.7
        assert explained[0]["confidence"] <= 1.0

    def test_industry_stats_calculation(self, mock_failed_startups):
        """Test industry statistics are calculated correctly"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        stats = explainer.industry_stats

        assert "real estate" in stats
        assert "healthcare" in stats
        assert "fintech" in stats

        # Check stats structure
        real_estate_stats = stats["real estate"]
        assert "count" in real_estate_stats
        assert "avg_funding" in real_estate_stats
        assert "avg_lifespan" in real_estate_stats
        assert real_estate_stats["count"] >= 1

    def test_find_top_similar_startups(self, mock_failed_startups):
        """Test finding top similar startups"""
        explainer = ExplainableAnalyzer(mock_failed_startups)

        startup_data = {
            "industry": "Real Estate",
            "death_cause": "Cash Flow Problems",
            "stage_at_death": "Series G",
        }

        similar = explainer._find_top_similar_startups(startup_data, top_n=2)

        assert len(similar) <= 2
        assert similar[0]["name"] == "WeWork"  # Best match
        assert similar[0]["similarity_score"] >= 3
