"""
API Integration Tests
Tests for FastAPI endpoints
"""

from unittest.mock import Mock, patch

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config.database import get_db
from main import app

# Test database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Create test engine
test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create test session
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


class TestAPIEndpoints:
    """Integration tests for API endpoints"""

    @pytest.fixture
    def client(self):
        """Create test client with test database"""
        from app.config.database import Base

        # Create tables
        Base.metadata.create_all(bind=test_engine)

        # Override dependency
        def override_get_db():
            db = TestingSessionLocal()
            try:
                yield db
            finally:
                db.close()

        app.dependency_overrides[get_db] = override_get_db

        yield TestClient(app)

        # Cleanup
        del app.dependency_overrides[get_db]
        Base.metadata.drop_all(bind=test_engine)

    @pytest.fixture
    def mock_db(self):
        """Mock database session"""
        db = Mock()
        db.query.return_value.all.return_value = []
        return db

    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get("/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "app" in data
        assert "version" in data

    def test_root_endpoint(self, client):
        """Test root endpoint"""
        response = client.get("/")

        assert response.status_code == 200
        data = response.json()
        assert "app" in data
        assert "version" in data
        assert "docs" in data

    @patch("app.routes.analyze_routes.StartupAnalyzer")
    def test_analyze_startup_success(self, mock_analyzer_class, client):
        """Test successful startup analysis"""
        # Mock analyzer
        mock_analyzer = Mock()
        mock_analyzer.analyze_startup.return_value = {
            "data": {
                "score": 65,
                "risk_level": "High",
                "explanations": {"summary": "Test summary"},
                "recommendations": [
                    {"recommendation": "Focus on extending cash runway"}
                ],
            },
            "meta": {"cached": False, "processing_time_ms": 12},
        }
        mock_analyzer_class.return_value = mock_analyzer

        # Make request
        response = client.post(
            "/api/v1/analysis/analyze",
            json={
                "name": "TestStartup",
                "industry": "Technology",
                "total_funding_usd": 500000,
                "number_of_employees": 50,
                "death_cause": "Cash Flow Problems",
                "stage_at_death": "Series A",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert data["data"]["score"] == 65
        assert data["data"]["risk_level"] == "High"

    def test_analyze_startup_missing_required_field(self, client):
        """Test analysis with missing required field"""
        response = client.post(
            "/api/v1/analysis/analyze",
            json={
                "name": "TestStartup"
                # Missing 'industry'
            },
        )

        assert response.status_code == 422  # Validation error

    @patch("app.routes.analyze_routes.StartupAnalyzer")
    def test_analyze_startup_server_error(self, mock_analyzer_class, client):
        """Test analysis endpoint with server error"""
        mock_analyzer = Mock()
        mock_analyzer.analyze_startup.side_effect = Exception("Analysis failed")
        mock_analyzer_class.return_value = mock_analyzer

        response = client.post(
            "/api/v1/analysis/analyze",
            json={"name": "TestStartup", "industry": "Technology"},
        )

        assert response.status_code == 500
        data = response.json()
        assert "detail" in data

    @patch("app.routes.analyze_routes.StartupAnalyzer")
    def test_get_industries(self, mock_analyzer_class, client):
        """Test get industries endpoint"""
        mock_analyzer = Mock()
        mock_analyzer.get_unique_industries.return_value = ["Technology", "Healthcare"]
        mock_analyzer_class.return_value = mock_analyzer

        response = client.get("/api/v1/analysis/industries")

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert "Technology" in data["data"]
        assert "Healthcare" in data["data"]

    @patch("app.routes.analyze_routes.StartupAnalyzer")
    def test_get_death_causes(self, mock_analyzer_class, client):
        """Test get death causes endpoint"""
        mock_analyzer = Mock()
        mock_analyzer.get_unique_death_causes.return_value = [
            "Cash Flow Problems",
            "Market Fit Issues",
        ]
        mock_analyzer_class.return_value = mock_analyzer

        response = client.get("/api/v1/analysis/death-causes")

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert "Cash Flow Problems" in data["data"]
        assert "Market Fit Issues" in data["data"]

    def test_get_stats_empty_database(self, client):
        """Test statistics with empty database"""
        # This should work even with empty database
        response = client.get("/api/v1/data/import/stats")

        assert response.status_code == 200
        data = response.json()
        assert "success" in data

    def test_get_sample_csv_template(self, client):
        """Test CSV template endpoint"""
        response = client.get("/api/v1/data/import/sample-csv-template")

        assert response.status_code == 200
        data = response.json()
        assert "template" in data
        assert "required_fields" in data
        assert "optional_fields" in data
        assert "name" in data["required_fields"]
        assert "industry" in data["required_fields"]

    @patch("app.routes.import_routes.DataIngestionService")
    def test_import_csv_success(self, mock_ingestion_class, client):
        """Test CSV import endpoint"""
        mock_service = Mock()
        mock_service.ingest_from_csv.return_value = {
            "success": True,
            "stats": {
                "total_records": 10,
                "valid_records": 10,
                "invalid_records": 0,
                "inserted_records": 10,
                "skipped_records": 0,
            },
            "errors": [],
        }
        mock_ingestion_class.return_value = mock_service

        # Create test CSV file content
        csv_content = b"name,industry\nTest,Technology\n"

        response = client.post(
            "/api/v1/data/import/csv",
            files={"file": ("test.csv", csv_content, "text/csv")},
            data={"batch_size": 100},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["total_records"] == 10

    def test_import_csv_wrong_file_type(self, client):
        """Test CSV import with non-CSV file"""
        response = client.post(
            "/api/v1/data/import/csv",
            files={"file": ("test.txt", b"test", "text/plain")},
        )

        assert response.status_code == 400
        data = response.json()
        assert "Only CSV files" in data["detail"]

    @patch("app.routes.import_routes.StartupValidator")
    def test_validate_csv_success(self, mock_validator_class, client):
        """Test CSV validation endpoint"""
        mock_validator = Mock()
        mock_validator.validate_csv_format.return_value = {
            "valid": True,
            "headers": ["name", "industry", "country"],
            "row_count": 10,
            "required_fields_present": True,
        }
        mock_validator_class.return_value = mock_validator

        csv_content = b"name,industry\nTest,Technology\n"

        response = client.post(
            "/api/v1/data/import/validate",
            files={"file": ("test.csv", csv_content, "text/csv")},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["valid"] is True
        assert data["row_count"] == 10

    def test_validate_csv_wrong_file_type(self, client):
        """Test CSV validation with non-CSV file"""
        response = client.post(
            "/api/v1/data/import/validate",
            files={"file": ("test.txt", b"test", "text/plain")},
        )

        assert response.status_code == 400
        data = response.json()
        assert "Only CSV files" in data["detail"]
