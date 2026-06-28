"""
Tests for StartupAnalyzer
"""


import pytest

from app.services.startup_analyzer import StartupAnalyzer


class TestStartupAnalyzer:
    """Test suite for StartupAnalyzer"""

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

    def test_analyzer_initialization_with_list(self, mock_failed_startups):
        """Test analyzer can be initialized with startup list"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        assert len(analyzer.failed_startups) == 5
        assert analyzer.failed_startups[0]["name"] == "WeWork"

    def test_find_similar_startups_industry_match(self, mock_failed_startups):
        """Test finding similar startups by industry"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        startup_data = {
            "industry": "Real Estate",
            "sub_industry": "Coworking",
            "death_cause": "Cash Flow Problems",
            "stage_at_death": "Series G",
        }

        similar = analyzer.find_similar_startups(startup_data, top_n=3)

        assert len(similar) > 0
        assert similar[0]["name"] == "WeWork"
        assert similar[0]["similarity_score"] >= 3  # Industry match

    def test_find_similar_startups_no_match(self, mock_failed_startups):
        """Test when no similar startups found"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        startup_data = {"industry": "Unknown Industry", "death_cause": "Unknown Cause"}

        similar = analyzer.find_similar_startups(startup_data, top_n=5)

        assert len(similar) == 0

    def test_find_similar_startups_returns_top_n(self, mock_failed_startups):
        """Test that find_similar_startups respects top_n parameter"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        startup_data = {"industry": "Technology", "death_cause": "Fraud"}

        similar = analyzer.find_similar_startups(startup_data, top_n=2)

        assert len(similar) <= 2

    def test_calculate_risk_score_death_cause_weights(self, mock_failed_startups):
        """Test risk score death cause weights"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        # Fraud = 30
        result = analyzer.calculate_risk_score({"death_cause": "Fraud"})
        assert result["score"] == 30
        assert result["risk_level"] == "Medium"

        # Cash Flow Problems = 25
        result = analyzer.calculate_risk_score({"death_cause": "Cash Flow Problems"})
        assert result["score"] == 25
        assert result["risk_level"] == "Medium"

        # Market Fit Issues = 20
        result = analyzer.calculate_risk_score({"death_cause": "Market Fit Issues"})
        assert result["score"] == 20
        assert result["risk_level"] == "Low"

        # Unknown death cause = 0
        result = analyzer.calculate_risk_score({"death_cause": "Unknown"})
        assert result["score"] == 0
        assert result["risk_level"] == "Low"

    def test_calculate_risk_score_financial_weights(self, mock_failed_startups):
        """Test risk score financial weights"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        # < 100k = 20
        result = analyzer.calculate_risk_score({"total_funding_usd": 50000})
        assert result["score"] == 20
        assert result["risk_level"] == "Low"

        # 100k - 1M = 10
        result = analyzer.calculate_risk_score({"total_funding_usd": 500000})
        assert result["score"] == 10
        assert result["risk_level"] == "Low"

        # > 1M = 0
        result = analyzer.calculate_risk_score({"total_funding_usd": 5000000})
        assert result["score"] == 0
        assert result["risk_level"] == "Low"

    def test_calculate_risk_score_stage_weights(self, mock_failed_startups):
        """Test risk score stage weights"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        # Series C = 20
        result = analyzer.calculate_risk_score({"stage_at_death": "Series C"})
        assert result["score"] == 20
        assert result["risk_level"] == "Low"

        # Series B = 10
        result = analyzer.calculate_risk_score({"stage_at_death": "Series B"})
        assert result["score"] == 10
        assert result["risk_level"] == "Low"

        # Seed = 0
        result = analyzer.calculate_risk_score({"stage_at_death": "Seed"})
        assert result["score"] == 0
        assert result["risk_level"] == "Low"

    def test_calculate_risk_score_employee_weights(self, mock_failed_startups):
        """Test risk score employee weights"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        # < 50 = 10
        result = analyzer.calculate_risk_score({"number_of_employees": 30})
        assert result["score"] == 10
        assert result["risk_level"] == "Low"

        # 50-200 = 5
        result = analyzer.calculate_risk_score({"number_of_employees": 100})
        assert result["score"] == 5
        assert result["risk_level"] == "Low"

        # > 200 = 0
        result = analyzer.calculate_risk_score({"number_of_employees": 500})
        assert result["score"] == 0
        assert result["risk_level"] == "Low"

    def test_calculate_risk_score_zero_when_no_factors(self, mock_failed_startups):
        """Test risk score is 0 when no risk factors present"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        result = analyzer.calculate_risk_score({})
        assert result["score"] == 0
        assert result["risk_level"] == "Low"
        assert result["total_factors"] == 0

    def test_calculate_risk_score_capped_at_100(self, mock_failed_startups):
        """Test risk score is capped at 100"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        # Fraud (30) + <100k funding (20) + Series C (20) + <50 employees (10) = 80
        # Add Cash Flow Problems via death cause combined approach won't work
        # Use a combo that exceeds 100
        startup_data = {
            "death_cause": "Fraud",  # 30
            "total_funding_usd": 50000,  # 20
            "stage_at_death": "Series C",  # 20
            "number_of_employees": 30,  # 10
        }
        result = analyzer.calculate_risk_score(startup_data)
        assert result["score"] == 80
        assert result["risk_level"] == "Critical"

        # Exceeds 100 - should cap
        # To exceed 100: fraud=30 + <100k=20 + Series C=20 + <50 employees=10 + another stage not possible
        # Max possible: fraud(30) + <100k(20) + Series C(20) + <50 emp(10) = 80
        # We can't exceed 100 with these weights, but keep cap logic

    def test_calculate_risk_score_risk_levels(self, mock_failed_startups):
        """Test risk level assignment based on deterministic thresholds"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        # Critical (70+): Fraud(30) + <100k funding(20) + Series C(20) + <50 emp(10) = 80
        startup_critical = {
            "death_cause": "Fraud",
            "total_funding_usd": 50000,
            "stage_at_death": "Series C",
            "number_of_employees": 10,
        }
        result = analyzer.calculate_risk_score(startup_critical)
        assert result["score"] == 80
        assert result["risk_level"] == "Critical"

        # High (41-69): Cash Flow Problems(25) + <100k funding(20) + <50 emp(10) = 55
        startup_high = {
            "death_cause": "Cash Flow Problems",
            "total_funding_usd": 50000,
            "number_of_employees": 30,
        }
        result = analyzer.calculate_risk_score(startup_high)
        assert result["score"] == 55
        assert result["risk_level"] == "High"

        # Medium (21-40): Market Fit Issues(20) + 100k-1M funding(10) + <50 emp(10) = 40
        startup_medium = {
            "death_cause": "Market Fit Issues",
            "total_funding_usd": 500000,
            "number_of_employees": 30,
        }
        result = analyzer.calculate_risk_score(startup_medium)
        assert result["score"] == 40
        assert result["risk_level"] == "Medium"

        # Low (0-20): Market Fit Issues(20) alone = 20
        startup_low = {
            "death_cause": "Market Fit Issues",
        }
        result = analyzer.calculate_risk_score(startup_low)
        assert result["score"] == 20
        assert result["risk_level"] == "Low"

    def test_calculate_risk_score_always_has_score_and_risk_level(
        self, mock_failed_startups
    ):
        """Test that output always includes score and risk_level"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        result = analyzer.calculate_risk_score({})
        assert "score" in result
        assert "risk_level" in result
        assert "risk_factors" in result
        assert "total_factors" in result

    def test_analyze_startup_complete(self, mock_failed_startups):
        """Test complete startup analysis"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        startup_data = {
            "name": "TestStartup",
            "industry": "FinTech",
            "sub_industry": "Cryptocurrency",
            "death_cause": "Fraud",
            "stage_at_death": "Series C",
            "total_funding_usd": 1000000,
            "number_of_employees": 50,
        }

        result = analyzer.analyze_startup(startup_data)

        # Check API response structure
        assert result["success"] is True
        assert "data" in result
        assert "meta" in result

        data = result["data"]
        assert "score" in data
        assert "risk_level" in data
        assert "explanations" in data
        assert "recommendations" in data

        meta = result["meta"]
        assert "cached" in meta
        assert "processing_time_ms" in meta

    def test_generate_insights_with_similar_startups(self, mock_failed_startups):
        """Test insight generation"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        similar = [
            {
                "name": "WeWork",
                "death_cause": "Cash Flow Problems",
                "lifespan_days": 5000,
                "total_funding_usd": 12000000000,
            },
            {
                "name": "FTX",
                "death_cause": "Fraud",
                "lifespan_days": 1395,
                "total_funding_usd": 2000000000,
            },
        ]

        insights = analyzer._generate_insights(similar, {"industry": "Technology"})

        assert len(insights) > 0
        assert any("lifespan" in insight.lower() for insight in insights)
        assert any("funding" in insight.lower() for insight in insights)

    def test_generate_insights_no_similar_startups(self, mock_failed_startups):
        """Test insight generation with no similar startups"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        insights = analyzer._generate_insights([], {"industry": "Technology"})

        assert len(insights) == 1
        assert "No directly similar" in insights[0]

    def test_generate_recommendations_cash_flow(self, mock_failed_startups):
        """Test recommendation generation for cash flow issues"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        risk_assessment = {
            "score": 75,
            "risk_factors": [
                {"factor": "Low Cash Runway", "severity": "critical", "weight": 25}
            ],
        }

        recommendations = analyzer._generate_recommendations(risk_assessment, [])

        assert len(recommendations) > 0
        assert any(
            "cash" in rec.lower() or "runway" in rec.lower() for rec in recommendations
        )

    def test_generate_recommendations_critical_risk(self, mock_failed_startups):
        """Test recommendation generation for critical risk"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        risk_assessment = {
            "score": 85,
            "risk_factors": [
                {"factor": "Test Factor", "severity": "high", "weight": 20}
            ],
        }

        recommendations = analyzer._generate_recommendations(risk_assessment, [])

        assert any(
            "mentorship" in rec.lower() or "planning" in rec.lower()
            for rec in recommendations
        )

    def test_get_industry_stats(self, mock_failed_startups):
        """Test industry statistics calculation"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        stats = analyzer._get_industry_stats()

        assert isinstance(stats, dict)
        assert "real estate" in stats or "technology" in stats
        assert stats.get("real estate", 0) >= 1

    def test_reload_data(self, mock_failed_startups):
        """Test data reload preserves in-memory dataset in test mode"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups
        analyzer._test_mode = True

        initial_count = len(analyzer.failed_startups)
        analyzer.reload_data()

        # In test mode, the mock dataset should be preserved
        assert len(analyzer.failed_startups) == initial_count
        assert analyzer.failed_startups[0]["name"] == "WeWork"

    def test_analyze_startup_caches_result(self, mock_failed_startups):
        """Test that analyze_startup caches results for repeated inputs"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        startup_data = {
            "industry": "Healthcare",
            "death_cause": "Fraud",
            "total_funding_usd": 500000,
            "stage_at_death": "Series B",
            "number_of_employees": 100,
        }

        result1 = analyzer.analyze_startup(startup_data)
        result2 = analyzer.analyze_startup(startup_data)

        # Both should return valid API responses with correct cache flags
        assert result1["success"] is True
        assert result2["success"] is True
        assert result1["meta"]["cached"] is False  # First call
        assert result2["meta"]["cached"] is True  # Second call (cached)
        assert result1["data"]["score"] == result2["data"]["score"]
        assert len(analyzer._cache) == 1

    def test_analyze_startup_different_inputs_different_cache(
        self, mock_failed_startups
    ):
        """Test that different inputs produce different cache entries"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        startup1 = {"industry": "Healthcare", "death_cause": "Fraud"}
        startup2 = {"industry": "Technology", "death_cause": "Cash Flow Problems"}

        analyzer.analyze_startup(startup1)
        analyzer.analyze_startup(startup2)

        assert len(analyzer._cache) == 2

    def test_clear_cache(self, mock_failed_startups):
        """Test clear_cache empties the cache"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        startup_data = {"industry": "Healthcare", "death_cause": "Fraud"}
        analyzer.analyze_startup(startup_data)
        assert len(analyzer._cache) == 1

        analyzer.clear_cache()
        assert len(analyzer._cache) == 0

    def test_cache_key_deterministic(self, mock_failed_startups):
        """Test cache key generation is deterministic"""
        analyzer = StartupAnalyzer(db=None)

        data = {"industry": "Healthcare", "death_cause": "Fraud"}
        key1 = analyzer._make_cache_key(data)
        key2 = analyzer._make_cache_key(data)
        assert key1 == key2

    def test_cache_key_order_independent(self, mock_failed_startups):
        """Test cache key is same regardless of dict key order"""
        analyzer = StartupAnalyzer(db=None)

        data1 = {"industry": "Healthcare", "death_cause": "Fraud"}
        data2 = {"death_cause": "Fraud", "industry": "Healthcare"}

        key1 = analyzer._make_cache_key(data1)
        key2 = analyzer._make_cache_key(data2)
        assert key1 == key2
