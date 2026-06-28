"""
Tests for FeatureExtractor
"""


from app.features.extractor import FeatureExtractor


class TestFeatureExtractor:
    """Test suite for FeatureExtractor"""

    def test_extract_features_death_cause(self):
        """Test death cause risk extraction"""
        extractor = FeatureExtractor()

        # Fraud = 30
        result = extractor.extract_features({"death_cause": "Fraud"})
        assert result["death_cause_risk"]["value"] == 30
        assert result["death_cause_risk"]["source"] == "death_cause_weights"

        # Cash Flow Problems = 25
        result = extractor.extract_features({"death_cause": "Cash Flow Problems"})
        assert result["death_cause_risk"]["value"] == 25

        # Market Fit Issues = 20
        result = extractor.extract_features({"death_cause": "Market Fit Issues"})
        assert result["death_cause_risk"]["value"] == 20

        # Unknown = 0
        result = extractor.extract_features({"death_cause": "Unknown"})
        assert result["death_cause_risk"]["value"] == 0

        # Empty = 0
        result = extractor.extract_features({"death_cause": ""})
        assert result["death_cause_risk"]["value"] == 0

    def test_extract_features_funding(self):
        """Test funding risk extraction"""
        extractor = FeatureExtractor()

        # < 100k = 20
        result = extractor.extract_features({"total_funding_usd": 50000})
        assert result["funding_risk"]["value"] == 20
        assert result["funding_risk"]["source"] == "funding_risk_low"

        # 100k - 1M = 10
        result = extractor.extract_features({"total_funding_usd": 500000})
        assert result["funding_risk"]["value"] == 10
        assert result["funding_risk"]["source"] == "funding_risk_medium"

        # > 1M = 0
        result = extractor.extract_features({"total_funding_usd": 5000000})
        assert result["funding_risk"]["value"] == 0
        assert result["funding_risk"]["source"] == "funding_risk_none"

        # Missing = 0
        result = extractor.extract_features({})
        assert result["funding_risk"]["value"] == 0
        assert result["funding_risk"]["source"] == "funding_risk_missing"

    def test_extract_features_stage(self):
        """Test stage risk extraction"""
        extractor = FeatureExtractor()

        # Series C = 20
        result = extractor.extract_features({"stage_at_death": "Series C"})
        assert result["stage_risk"]["value"] == 20
        assert result["stage_risk"]["source"] == "stage_risk_late"

        # Series B = 10
        result = extractor.extract_features({"stage_at_death": "Series B"})
        assert result["stage_risk"]["value"] == 10
        assert result["stage_risk"]["source"] == "stage_risk_series_b"

        # Seed = 0
        result = extractor.extract_features({"stage_at_death": "Seed"})
        assert result["stage_risk"]["value"] == 0

        # Empty = 0
        result = extractor.extract_features({"stage_at_death": ""})
        assert result["stage_risk"]["value"] == 0

    def test_extract_features_employee(self):
        """Test employee risk extraction"""
        extractor = FeatureExtractor()

        # < 50 = 10
        result = extractor.extract_features({"number_of_employees": 30})
        assert result["employee_risk"]["value"] == 10
        assert result["employee_risk"]["source"] == "employee_risk_small"

        # 50-200 = 5
        result = extractor.extract_features({"number_of_employees": 100})
        assert result["employee_risk"]["value"] == 5

        # > 200 = 0
        result = extractor.extract_features({"number_of_employees": 500})
        assert result["employee_risk"]["value"] == 0

        # Missing = 0
        result = extractor.extract_features({})
        assert result["employee_risk"]["value"] == 0

    def test_extract_features_industry(self):
        """Test industry risk extraction"""
        extractor = FeatureExtractor()

        # Technology = 20
        result = extractor.extract_features({"industry": "Technology"})
        assert result["industry_risk"]["value"] == 20
        assert result["industry_risk"]["source"] == "industry_risk_technology"

        # FinTech = 20 (fintech key matches)
        result = extractor.extract_features({"industry": "FinTech"})
        assert result["industry_risk"]["value"] == 20

        # Healthcare = 15
        result = extractor.extract_features({"industry": "Healthcare"})
        assert result["industry_risk"]["value"] == 15

        # Real Estate = 10
        result = extractor.extract_features({"industry": "Real Estate"})
        assert result["industry_risk"]["value"] == 10

        # Unknown = 5 (default)
        result = extractor.extract_features({"industry": "Unknown Sector"})
        assert result["industry_risk"]["value"] == 5
        assert result["industry_risk"]["source"] == "industry_risk_default"

        # Empty = 0
        result = extractor.extract_features({"industry": ""})
        assert result["industry_risk"]["value"] == 0

    def test_extract_features_all_fields(self):
        """Test extract_features returns all expected fields"""
        extractor = FeatureExtractor()

        startup = {
            "death_cause": "Fraud",
            "total_funding_usd": 50000,
            "stage_at_death": "Series C",
            "number_of_employees": 30,
            "industry": "Technology",
        }

        result = extractor.extract_features(startup)

        assert result["funding_risk"]["value"] == 20
        assert result["stage_risk"]["value"] == 20
        assert result["employee_risk"]["value"] == 10
        assert result["industry_risk"]["value"] == 20
        assert result["death_cause_risk"]["value"] == 30

    def test_extract_features_deterministic(self):
        """Test extract_features is deterministic"""
        extractor = FeatureExtractor()

        startup = {
            "death_cause": "Cash Flow Problems",
            "total_funding_usd": 500000,
            "stage_at_death": "Series B",
            "number_of_employees": 100,
            "industry": "Healthcare",
        }

        result1 = extractor.extract_features(startup)
        result2 = extractor.extract_features(startup)

        assert result1 == result2

    def test_extract_features_no_data(self):
        """Test extract_features with empty input"""
        extractor = FeatureExtractor()

        result = extractor.extract_features({})

        for key in [
            "funding_risk",
            "stage_risk",
            "employee_risk",
            "industry_risk",
            "death_cause_risk",
        ]:
            assert key in result
            assert "value" in result[key]
            assert "source" in result[key]

    def test_static_methods_direct_call(self):
        """Test static methods can be called directly"""
        assert FeatureExtractor._get_death_cause_risk("Fraud")["value"] == 30
        assert FeatureExtractor._get_funding_risk(50000)["value"] == 20
        assert FeatureExtractor._get_stage_risk("Series C")["value"] == 20
        assert FeatureExtractor._get_employee_risk(30)["value"] == 10
        assert FeatureExtractor._get_industry_risk("Technology")["value"] == 20
