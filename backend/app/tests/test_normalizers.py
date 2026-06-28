"""
Tests for DataNormalizer
"""


from app.utils.normalizers import DataNormalizer


class TestDataNormalizer:
    """Test suite for DataNormalizer"""

    def test_normalize_industry_strict(self):
        """Test strict industry normalization (lowercase, strip, underscore)"""
        assert DataNormalizer._normalize_industry("Software") == "software"
        assert DataNormalizer._normalize_industry("  SaaS  ") == "saas"
        assert DataNormalizer._normalize_industry("Real Estate") == "real_estate"
        assert DataNormalizer._normalize_industry("Health Care") == "health_care"
        assert DataNormalizer._normalize_industry("") == ""
        assert DataNormalizer._normalize_industry(None) is None

    def test_normalize_industry_display_software(self):
        """Test industry normalization for software display"""
        assert DataNormalizer._normalize_industry_display("software") == "Technology"
        assert DataNormalizer._normalize_industry_display("SaaS") == "Technology"
        assert DataNormalizer._normalize_industry_display("AI") == "Technology"

    def test_normalize_industry_display_fintech(self):
        """Test industry normalization for fintech display"""
        assert DataNormalizer._normalize_industry_display("fintech") == "FinTech"
        assert (
            DataNormalizer._normalize_industry_display("financial technology")
            == "FinTech"
        )
        assert DataNormalizer._normalize_industry_display("banking") == "FinTech"

    def test_normalize_industry_display_healthcare(self):
        """Test industry normalization for healthcare display"""
        assert DataNormalizer._normalize_industry_display("healthcare") == "Healthcare"
        assert DataNormalizer._normalize_industry_display("biotech") == "Healthcare"
        assert DataNormalizer._normalize_industry_display("medical") == "Healthcare"

    def test_normalize_industry_display_realestate(self):
        """Test industry normalization for real estate display"""
        assert (
            DataNormalizer._normalize_industry_display("real estate") == "Real Estate"
        )
        assert DataNormalizer._normalize_industry_display("property") == "Real Estate"
        assert (
            DataNormalizer._normalize_industry_display("construction") == "Real Estate"
        )

    def test_normalize_industry_display_unknown(self):
        """Test normalization of unknown industry display"""
        result = DataNormalizer._normalize_industry_display("UnknownIndustry")
        assert result == "Unknownindustry"  # Title case

    def test_normalize_stage_preseed(self):
        """Test stage normalization"""
        assert DataNormalizer._normalize_stage("pre-seed") == "Pre-Seed"
        assert DataNormalizer._normalize_stage("preseed") == "Pre-Seed"
        assert DataNormalizer._normalize_stage("Pre-Seed") == "Pre-Seed"

    def test_normalize_stage_series(self):
        """Test series stage normalization"""
        assert DataNormalizer._normalize_stage("series a") == "Series A"
        assert DataNormalizer._normalize_stage("Series-A") == "Series A"
        assert DataNormalizer._normalize_stage("series b") == "Series B"
        assert DataNormalizer._normalize_stage("series e") == "Series E+"
        assert DataNormalizer._normalize_stage("series g") == "Series E+"

    def test_normalize_death_cause_cash(self):
        """Test death cause normalization"""
        assert (
            DataNormalizer._normalize_death_cause("ran out of cash")
            == "Cash Flow Problems"
        )
        assert (
            DataNormalizer._normalize_death_cause("cash flow") == "Cash Flow Problems"
        )
        assert (
            DataNormalizer._normalize_death_cause("burn rate") == "Cash Flow Problems"
        )

    def test_normalize_death_cause_market_fit(self):
        """Test market fit normalization"""
        assert (
            DataNormalizer._normalize_death_cause("market fit") == "Market Fit Issues"
        )
        assert DataNormalizer._normalize_death_cause("no demand") == "Market Fit Issues"
        assert (
            DataNormalizer._normalize_death_cause("competition") == "Market Fit Issues"
        )

    def test_normalize_death_cause_fraud(self):
        """Test fraud normalization"""
        assert DataNormalizer._normalize_death_cause("fraud") == "Fraud"
        assert DataNormalizer._normalize_death_cause("scandal") == "Fraud"

    def test_normalize_country(self):
        """Test country normalization"""
        assert DataNormalizer._normalize_country("USA") == "United States"
        assert DataNormalizer._normalize_country("us") == "United States"
        assert DataNormalizer._normalize_country("UK") == "United Kingdom"
        assert DataNormalizer._normalize_country("United Kingdom") == "United Kingdom"

    def test_normalize_tags(self):
        """Test tag normalization"""
        result = DataNormalizer._normalize_tags("saas, technology, B2B, saas")
        assert result == "saas, technology, b2b"
        assert result.count("saas") == 1  # No duplicates

    def test_normalize_text(self):
        """Test text normalization"""
        assert DataNormalizer._normalize_text("  Hello   World  ") == "Hello World"
        assert DataNormalizer._normalize_text("Multiple   spaces") == "Multiple spaces"

    def test_normalize_record_complete(self):
        """Test complete record normalization"""
        record = {
            "name": "TestStartup",
            "industry": "software",
            "sub_industry": "saas",
            "country": "usa",
            "stage_at_death": "series a",
            "death_cause": "cash flow",
            "tags": "saas, b2b, SAAS",
        }

        result = DataNormalizer.normalize_record(record)

        assert result["industry"] == "Technology"
        assert result["sub_industry"] == "saas"
        assert result["country"] == "United States"
        assert result["stage_at_death"] == "Series A"
        assert result["death_cause"] == "Cash Flow Problems"

    def test_normalize_batch(self):
        """Test batch normalization"""
        records = [
            {"industry": "software", "name": "Test1"},
            {"industry": "fintech", "name": "Test2"},
            {"industry": "healthcare", "name": "Test3"},
        ]

        result = DataNormalizer.normalize_batch(records)

        assert len(result) == 3
        assert result[0]["industry"] == "Technology"
        assert result[1]["industry"] == "FinTech"
        assert result[2]["industry"] == "Healthcare"

    def test_calculate_statistics_empty(self):
        """Test statistics calculation with empty data"""
        stats = DataNormalizer.calculate_statistics([])
        assert stats == {}

    def test_calculate_statistics_with_data(self):
        """Test statistics calculation with sample data"""
        records = [
            {
                "name": "Startup1",
                "industry": "Technology",
                "lifespan_days": 1000,
                "total_funding_usd": 5000000,
                "death_cause": "Cash Flow Problems",
                "stage_at_death": "Series A",
            },
            {
                "name": "Startup2",
                "industry": "Technology",
                "lifespan_days": 1500,
                "total_funding_usd": 10000000,
                "death_cause": "Market Fit Issues",
                "stage_at_death": "Series B",
            },
            {
                "name": "Startup3",
                "industry": "Healthcare",
                "lifespan_days": 2000,
                "total_funding_usd": 8000000,
                "death_cause": "Cash Flow Problems",
                "stage_at_death": "Series A",
            },
        ]

        stats = DataNormalizer.calculate_statistics(records)

        assert stats["total_startups"] == 3
        assert stats["avg_lifespan"] == 1500.0
        assert stats["avg_funding"] == 7666666.67
        # Industries are normalized to lowercase underscore keys
        assert stats["industries"]["technology"] == 2
        assert stats["industries"]["healthcare"] == 1
        # Required industry keys are always present
        assert "real_estate" in stats["industries"]
        assert stats["industries"]["real_estate"] == 0
        assert "fintech" in stats["industries"]
        assert stats["industries"]["fintech"] == 0
        assert stats["death_causes"]["Cash Flow Problems"] == 2

    def test_calculate_statistics_median(self):
        """Test median calculation"""
        records = [
            {"lifespan_days": 1000, "total_funding_usd": 5000000},
            {"lifespan_days": 2000, "total_funding_usd": 10000000},
            {"lifespan_days": 3000, "total_funding_usd": 15000000},
        ]

        stats = DataNormalizer.calculate_statistics(records)

        assert stats["median_lifespan"] == 2000
        assert stats["median_funding"] == 10000000

    def test_calculate_statistics_date_range(self):
        """Test date range calculation"""
        from datetime import datetime

        records = [
            {"founded_date": datetime(2020, 1, 1), "closed_date": datetime(2023, 1, 1)},
            {"founded_date": datetime(2018, 1, 1), "closed_date": datetime(2022, 1, 1)},
        ]

        stats = DataNormalizer.calculate_statistics(records)

        assert stats["date_range"]["earliest_founded"] == 2018
        assert stats["date_range"]["latest_founded"] == 2020
        assert stats["date_range"]["earliest_closed"] == 2022
        assert stats["date_range"]["latest_closed"] == 2023
