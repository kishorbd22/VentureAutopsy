"""
Tests for DataIngestionService
"""

from unittest.mock import Mock

import pytest

from app.services.data_ingestion_service import DataIngestionService


class TestDataIngestionService:
    """Test suite for DataIngestionService"""

    @pytest.fixture
    def mock_db(self):
        """Mock database session"""
        db = Mock()
        db.query.return_value.filter.return_value.first.return_value = None
        db.commit.return_value = None
        db.rollback.return_value = None
        db.add.return_value = None
        return db

    @pytest.fixture
    def ingestion_service(self, mock_db):
        """Create DataIngestionService with mock db"""
        return DataIngestionService(mock_db)

    @pytest.fixture
    def sample_csv_content(self):
        """Sample CSV content for testing"""
        return """name,industry,sub_industry,country,founded_date,closed_date,lifespan_days,total_funding_usd,funding_rounds,death_cause,death_cause_details,stage_at_death,number_of_employees,tags
TestStartup1,Technology,SaaS,USA,2020-01-01,2023-01-01,1095,5000000,3,Cash Flow Problems,"Ran out of cash",Series A,50,"saas,technology"
TestStartup2,Healthcare,Health Tech,USA,2018-01-01,2022-01-01,1460,10000000,4,Market Fit Issues,"No PMF",Series B,100,"healthtech,medical"
TestStartup3,FinTech,Crypto,USA,2019-01-01,2023-06-01,1620,15000000,5,Fraud,"Misleading",Series C,200,"crypto,blockchain"
"""

    def test_ingest_from_csv_file_not_found(self, ingestion_service):
        """Test handling of non-existent CSV file"""
        result = ingestion_service.ingest_from_csv("nonexistent.csv")

        assert result["success"] is False
        assert "File not found" in result["error"]

    def test_ingest_from_csv_success(
        self, ingestion_service, mock_db, sample_csv_content, tmp_path
    ):
        """Test successful CSV ingestion"""
        # Create temporary CSV file
        csv_file = tmp_path / "test.csv"
        csv_file.write_text(sample_csv_content)

        result = ingestion_service.ingest_from_csv(str(csv_file), batch_size=10)

        assert result["success"] is True
        assert result["stats"]["total_records"] == 3
        assert result["stats"]["valid_records"] == 3
        assert result["stats"]["inserted_records"] == 3
        assert mock_db.commit.called

    def test_ingest_from_csv_with_duplicates(
        self, ingestion_service, mock_db, tmp_path
    ):
        """Test duplicate detection during import"""
        csv_content = """name,industry
TestStartup,Technology
TestStartup,Technology
TestStartup,Technology
"""
        csv_file = tmp_path / "test.csv"
        csv_file.write_text(csv_content)

        # Mock that startup already exists
        mock_db.query.return_value.filter.return_value.first.return_value = Mock()

        result = ingestion_service.ingest_from_csv(str(csv_file))

        assert result["success"] is True
        assert result["stats"]["skipped_records"] == 3  # All duplicates
        assert result["stats"]["inserted_records"] == 0

    def test_ingest_from_csv_with_invalid_records(self, ingestion_service, tmp_path):
        """Test handling of invalid records in CSV"""
        csv_content = """name,industry
ValidStartup,Technology
,Healthcare
MissingName,Technology
AnotherValid,FinTech
"""
        csv_file = tmp_path / "test.csv"
        csv_file.write_text(csv_content)

        result = ingestion_service.ingest_from_csv(str(csv_file))

        assert result["success"] is True
        assert result["stats"]["valid_records"] == 3
        assert result["stats"]["invalid_records"] == 1

    def test_ingest_from_dict_success(self, ingestion_service, mock_db):
        """Test ingestion from dictionary list"""
        records = [
            {"name": "Startup1", "industry": "Technology"},
            {"name": "Startup2", "industry": "Healthcare"},
            {"name": "Startup3", "industry": "FinTech"},
        ]

        result = ingestion_service.ingest_from_dict(records)

        assert result["success"] is True
        assert result["stats"]["total_records"] == 3
        assert result["stats"]["valid_records"] == 3
        assert result["stats"]["inserted_records"] == 3
        assert mock_db.commit.called

    def test_validate_csv_format_success(self, ingestion_service, tmp_path):
        """Test CSV format validation"""
        csv_content = """name,industry,country
Test,Technology,USA
"""
        csv_file = tmp_path / "test.csv"
        csv_file.write_text(csv_content)

        result = ingestion_service.validate_csv_format(str(csv_file))

        assert result["valid"] is True
        assert "name" in result["headers"]
        assert "industry" in result["headers"]
        assert result["row_count"] == 1

    def test_validate_csv_format_missing_required(self, ingestion_service, tmp_path):
        """Test CSV validation with missing required columns"""
        csv_content = """name,country
Test,USA
"""
        csv_file = tmp_path / "test.csv"
        csv_file.write_text(csv_content)

        result = ingestion_service.validate_csv_format(str(csv_file))

        assert result["valid"] is False
        assert "Missing required columns" in result["error"]

    def test_export_to_csv_success(self, ingestion_service, mock_db, tmp_path):
        """Test CSV export"""
        # Mock database query
        mock_startup = Mock()
        mock_startup.name = "TestStartup"
        mock_startup.industry = "Technology"
        mock_startup.sub_industry = "SaaS"
        mock_startup.country = "USA"
        mock_startup.city = "San Francisco"
        mock_startup.founded_date = None
        mock_startup.closed_date = None
        mock_startup.lifespan_days = 1000
        mock_startup.total_funding_usd = 5000000
        mock_startup.funding_rounds = 3
        mock_startup.death_cause = "Cash Flow"
        mock_startup.death_cause_details = "Details"
        mock_startup.stage_at_death = "Series A"
        mock_startup.number_of_employees = 50
        mock_startup.tags = "saas,tech"
        mock_startup.verified = False
        mock_startup.featured = False
        mock_startup.created_at = None

        mock_db.query.return_value.all.return_value = [mock_startup]

        output_file = tmp_path / "export.csv"
        result = ingestion_service.export_to_csv(str(output_file))

        assert result["success"] is True
        assert result["records_exported"] == 1
        assert output_file.exists()

    def test_generate_import_report(self, ingestion_service):
        """Test import report generation"""
        import_result = {
            "success": True,
            "stats": {
                "file": "test.csv",
                "total_records": 100,
                "valid_records": 95,
                "invalid_records": 5,
                "inserted_records": 90,
                "skipped_records": 5,
                "success_rate": 95.0,
                "database_stats": {
                    "total_startups": 100,
                    "avg_lifespan": 1500,
                    "avg_funding": 5000000,
                    "top_industries": {"Technology": 50, "Healthcare": 30},
                    "top_death_causes": {"Cash Flow": 40, "Market Fit": 30},
                },
            },
        }

        report = ingestion_service.generate_import_report(import_result)

        assert "DATA IMPORT REPORT" in report
        assert "test.csv" in report
        assert "100" in report
        assert "95.00%" in report

    def test_generate_import_report_failure(self, ingestion_service):
        """Test import report for failed import"""
        import_result = {"success": False, "error": "File not found"}

        report = ingestion_service.generate_import_report(import_result)

        assert "Import failed" in report
        assert "File not found" in report

    def test_load_startups_from_csv_to_memory(self, ingestion_service, tmp_path):
        """Test loading startups to memory"""
        csv_content = """name,industry,death_cause
Test1,Technology,Cash Flow
Test2,Healthcare,Market Fit
"""
        csv_file = tmp_path / "test.csv"
        csv_file.write_text(csv_content)

        startups = ingestion_service.load_startups_from_csv_to_memory(str(csv_file))

        assert len(startups) == 2
        assert startups[0]["name"] == "Test1"
        assert startups[0]["industry"] == "Technology"

    def test_batch_insert_performance(self, ingestion_service, mock_db, tmp_path):
        """Test batch insert with large dataset"""
        # Create CSV with 100 records
        rows = ["name,industry"]
        for i in range(100):
            rows.append(f"Startup{i},Technology")

        csv_content = "\n".join(rows)
        csv_file = tmp_path / "large.csv"
        csv_file.write_text(csv_content)

        result = ingestion_service.ingest_from_csv(str(csv_file), batch_size=25)

        assert result["success"] is True
        assert result["stats"]["total_records"] == 100
        assert mock_db.commit.call_count == 4  # 4 batches of 25

    def test_normalizer_integration(self, ingestion_service, mock_db, tmp_path):
        """Test that normalizer is properly integrated"""
        csv_content = """name,industry,stage_at_death,death_cause,country
TestStartup,software,series-a,cash flow,usa
"""
        csv_file = tmp_path / "test.csv"
        csv_file.write_text(csv_content)

        result = ingestion_service.ingest_from_csv(str(csv_file))

        assert result["success"] is True
        # Verify normalization occurred (mock_db would have received normalized data)
        assert mock_db.add.called
