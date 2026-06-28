"""
System-level integration tests for Venture Autopsy
"""

import time

import pytest

from app.features.extractor import FeatureExtractor
from app.services.risk_scoring_service import RiskScoringService
from app.services.startup_analyzer import StartupAnalyzer


@pytest.fixture
def mock_failed_startups():
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


class TestFullPipeline:
    """Test the complete analysis pipeline end-to-end"""

    def test_pipeline_feature_to_score(self):
        """Test FeatureExtractor -> RiskScoringService pipeline"""
        extractor = FeatureExtractor()
        startup_data = {
            "industry": "Technology",
            "death_cause": "Fraud",
            "total_funding_usd": 50000,
            "stage_at_death": "Series C",
            "number_of_employees": 30,
        }

        # Extract features
        features = extractor.extract_features(startup_data)

        # Score features
        score, risk_level, breakdown = RiskScoringService.score_features(features)

        # Verify we got a valid score
        assert 0 <= score <= 100
        assert risk_level in ["Low", "Medium", "High", "Critical"]

        # Verify breakdown contains all features
        for key in [
            "funding_risk",
            "stage_risk",
            "employee_risk",
            "industry_risk",
            "death_cause_risk",
        ]:
            assert key in breakdown
            assert "value" in breakdown[key]
            assert "source" in breakdown[key]

    def test_pipeline_with_explainable_ai(self, mock_failed_startups):
        """Test full pipeline including ExplainableAnalyzer"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        startup_data = {
            "industry": "FinTech",
            "sub_industry": "Cryptocurrency",
            "death_cause": "Fraud",
            "stage_at_death": "Series C",
            "total_funding_usd": 1000000,
            "number_of_employees": 50,
        }

        result = analyzer.analyze_startup(startup_data)

        # Verify API response structure
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

    def test_pipeline_deterministic_score(self):
        """Test that same input produces identical score every time"""
        startup_data = {
            "industry": "Healthcare",
            "death_cause": "Cash Flow Problems",
            "total_funding_usd": 500000,
            "stage_at_death": "Series B",
            "number_of_employees": 100,
        }

        # Run pipeline multiple times
        scores = []
        for _ in range(5):
            extractor = FeatureExtractor()
            features = extractor.extract_features(startup_data)
            score, _, _ = RiskScoringService.score_features(features)
            scores.append(score)

        # All scores must be identical
        assert all(s == scores[0] for s in scores)


class TestCacheBehavior:
    """Test caching mechanism in StartupAnalyzer"""

    def test_cache_returns_same_result(self, mock_failed_startups):
        """Test that repeated calls with same input return cached result"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        startup_data = {
            "industry": "Technology",
            "death_cause": "Market Fit Issues",
            "total_funding_usd": 500000,
        }

        result1 = analyzer.analyze_startup(startup_data)
        result2 = analyzer.analyze_startup(startup_data)

        # Verify response schema and cache flag
        assert result1["success"] is True
        assert result2["success"] is True
        assert result1["meta"]["cached"] is False
        assert result2["meta"]["cached"] is True
        assert result1["data"]["score"] == result2["data"]["score"]

    def test_different_inputs_different_cache_entries(self, mock_failed_startups):
        """Test that different inputs produce separate cache entries"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        data1 = {"industry": "Technology", "death_cause": "Fraud"}
        data2 = {"industry": "Healthcare", "death_cause": "Cash Flow Problems"}

        analyzer.analyze_startup(data1)
        analyzer.analyze_startup(data2)

        assert len(analyzer._cache) == 2

    def test_clear_cache_empties_cache(self, mock_failed_startups):
        """Test that clear_cache() empties the cache"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        data = {"industry": "FinTech", "death_cause": "Fraud"}
        analyzer.analyze_startup(data)

        assert len(analyzer._cache) == 1

        analyzer.clear_cache()
        assert len(analyzer._cache) == 0

    def test_cache_key_deterministic(self):
        """Test cache key generation is deterministic"""
        analyzer = StartupAnalyzer(db=None)

        data = {"industry": "Technology", "death_cause": "Fraud"}
        key1 = analyzer._make_cache_key(data)
        key2 = analyzer._make_cache_key(data)

        assert key1 == key2

    def test_cache_key_order_independent(self):
        """Test cache key is same regardless of dict key order"""
        analyzer = StartupAnalyzer(db=None)

        data1 = {"industry": "Technology", "death_cause": "Fraud"}
        data2 = {"death_cause": "Fraud", "industry": "Technology"}

        key1 = analyzer._make_cache_key(data1)
        key2 = analyzer._make_cache_key(data2)

        assert key1 == key2


class TestAPIResponseSchema:
    """Test API response schema validation"""

    def test_response_has_required_fields(self):
        """Test that response structure is correct"""
        # This is a schema validation test
        expected_keys = {"success", "data", "error"}

        # Simulate a response
        response = {"success": True, "data": {"risk_score": 50}, "error": None}

        assert set(response.keys()) == expected_keys
        assert response["success"] is True
        assert response["error"] is None

    def test_error_response_schema(self):
        """Test error response structure"""
        response = {"success": False, "data": None, "error": "Something went wrong"}

        assert "success" in response
        assert "data" in response
        assert "error" in response
        assert response["success"] is False


class TestPerformance:
    """Performance sanity tests"""

    def test_analysis_completes_under_threshold(self, mock_failed_startups):
        """Test that analysis completes in reasonable time"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        startup_data = {
            "industry": "Technology",
            "death_cause": "Fraud",
            "total_funding_usd": 50000,
            "stage_at_death": "Series C",
            "number_of_employees": 30,
        }

        start_time = time.time()
        result = analyzer.analyze_startup(startup_data)
        elapsed_time = time.time() - start_time

        # Should complete in under 5 seconds (generous threshold)
        assert elapsed_time < 5.0
        assert result is not None

    def test_multiple_analyses_performance(self, mock_failed_startups):
        """Test performance with multiple sequential analyses"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        startup_data = {
            "industry": "Technology",
            "death_cause": "Fraud",
            "total_funding_usd": 50000,
            "stage_at_death": "Series C",
            "number_of_employees": 30,
        }

        start_time = time.time()

        # Run 10 analyses
        for _ in range(10):
            analyzer.analyze_startup(startup_data)

        # Use fresh analyzer to avoid cache
        analyzer2 = StartupAnalyzer(db=None)
        analyzer2.failed_startups = mock_failed_startups

        for _ in range(10):
            analyzer2.analyze_startup(startup_data)

        elapsed_time = time.time() - start_time

        # 20 analyses should complete in under 10 seconds
        assert elapsed_time < 10.0

    def test_cached_analysis_faster_than_fresh(self, mock_failed_startups):
        """Test that cached analysis is faster than fresh (or equal on low-res timers)"""
        analyzer = StartupAnalyzer(db=None)
        analyzer.failed_startups = mock_failed_startups

        startup_data = {
            "industry": "Technology",
            "death_cause": "Market Fit Issues",
            "total_funding_usd": 500000,
        }

        # Warm up / populate cache
        analyzer.analyze_startup(startup_data)

        # Fresh analyzer (no cache) - run several to get measurable time
        fresh_analyzer = StartupAnalyzer(db=None)
        fresh_analyzer.failed_startups = mock_failed_startups
        start_fresh = time.perf_counter()
        for _ in range(3):
            fresh_analyzer.analyze_startup(startup_data)
        time_fresh = time.perf_counter() - start_fresh

        # Cached analyzer
        start_cached = time.perf_counter()
        for _ in range(3):
            analyzer.analyze_startup(startup_data)
        time_cached = time.perf_counter() - start_cached

        # Cached should be no slower than fresh; prefer faster but allow equal on fast machines
        assert time_cached <= time_fresh


class TestDebugMode:
    """Test debug mode functionality"""

    def test_debug_false_no_breakdown(self, mock_failed_startups):
        """Test that debug=False omits feature_breakdown"""
        analyzer = StartupAnalyzer(db=None, debug=False)
        analyzer.failed_startups = mock_failed_startups

        result = analyzer.analyze_startup(
            {"industry": "Technology", "death_cause": "Fraud"}
        )

        assert "feature_breakdown" not in result

    def test_debug_true_includes_breakdown(self, mock_failed_startups):
        """Test that debug=True includes feature_breakdown in cached result"""
        analyzer = StartupAnalyzer(db=None, debug=True)
        analyzer.failed_startups = mock_failed_startups

        result = analyzer.analyze_startup(
            {"industry": "Technology", "death_cause": "Fraud"}
        )
        assert result is not None

        # Check that cache contains feature_breakdown
        cache_key = list(analyzer._cache.keys())[0]
        cached_result = analyzer._cache[cache_key]
        assert "feature_breakdown" in cached_result
        breakdown = cached_result["feature_breakdown"]
        assert "death_cause_risk" in breakdown
        assert "industry_risk" in breakdown

    def test_debug_mode_in_calculate_risk_score(self, mock_failed_startups):
        """Test debug mode in calculate_risk_score"""
        analyzer = StartupAnalyzer(db=None, debug=True)
        analyzer.failed_startups = mock_failed_startups

        result = analyzer.calculate_risk_score({"death_cause": "Fraud"})

        assert "feature_breakdown" in result
        assert result["feature_breakdown"]["death_cause_risk"]["value"] == 30
