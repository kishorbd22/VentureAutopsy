"""
Tests for StartupValidator
"""


from app.utils.validators import StartupValidator


class TestStartupValidator:
    """Test suite for StartupValidator"""

    def test_validate_valid_record(self):
        """Test validation of a complete valid record"""
        record = {
            "name": "TestStartup",
            "industry": "Technology",
            "total_funding_usd": 5000000,
            "lifespan_days": 1095,
            "death_cause": "Cash Flow Problems",
        }

        is_valid, errors, normalized = StartupValidator.validate_record(record)

        assert is_valid is True
        assert len(errors) == 0
        assert normalized["name"] == "TestStartup"
        assert normalized["industry"] == "Technology"
        assert normalized["total_funding_usd"] == 5000000
        assert normalized["lifespan_days"] == 1095

    def test_validate_missing_required_fields(self):
        """Test validation fails for missing required fields"""
        record = {"total_funding_usd": 5000000}

        is_valid, errors, normalized = StartupValidator.validate_record(record)

        assert is_valid is False
        assert len(errors) == 2  # Missing name and industry
        assert "Missing required field: name" in errors
        assert "Missing required field: industry" in errors

    def test_validate_record_name_truncation(self):
        """Test that names exceeding 255 chars are truncated"""
        long_name = "A" * 300
        record = {"name": long_name, "industry": "Technology"}

        is_valid, errors, normalized = StartupValidator.validate_record(record)

        assert is_valid is True
        assert len(normalized["name"]) == 255

    def test_validate_numeric_fields(self):
        """Test numeric field validation and conversion"""
        record = {
            "name": "TestStartup",
            "industry": "Technology",
            "total_funding_usd": "5000000.50",
            "lifespan_days": "1095",
            "funding_rounds": "3",
            "number_of_employees": "50",
        }

        is_valid, errors, normalized = StartupValidator.validate_record(record)

        assert is_valid is True
        assert normalized["total_funding_usd"] == 5000000.50
        assert normalized["lifespan_days"] == 1095
        assert normalized["funding_rounds"] == 3
        assert normalized["number_of_employees"] == 50

    def test_validate_invalid_numeric_fields(self):
        """Test handling of invalid numeric values"""
        record = {
            "name": "TestStartup",
            "industry": "Technology",
            "total_funding_usd": "not-a-number",
            "lifespan_days": "invalid",
        }

        is_valid, errors, normalized = StartupValidator.validate_record(record)

        assert is_valid is False
        assert any("Invalid numeric value" in error for error in errors)

    def test_validate_negative_values_corrected(self):
        """Test that negative funding and employees are converted to positive"""
        record = {
            "name": "TestStartup",
            "industry": "Technology",
            "total_funding_usd": -5000000,
            "number_of_employees": -50,
        }

        is_valid, errors, normalized = StartupValidator.validate_record(record)

        assert is_valid is True
        assert normalized["total_funding_usd"] == 5000000
        assert normalized["number_of_employees"] == 50

    def test_validate_date_formats(self):
        """Test various date format parsing"""
        test_cases = [
            ("2020-01-01", True),
            ("01/15/2020", True),
            ("15/01/2020", True),
            ("January 15, 2020", True),
            ("invalid-date", False),
        ]

        for date_str, should_parse in test_cases:
            record = {
                "name": "TestStartup",
                "industry": "Technology",
                "founded_date": date_str,
                "closed_date": date_str,
            }

            is_valid, errors, normalized = StartupValidator.validate_record(record)

            if should_parse:
                assert is_valid is True
                assert normalized["founded_date"] is not None
            else:
                assert is_valid is False

    def test_validate_boolean_fields(self):
        """Test boolean field validation"""
        test_cases = [
            ("true", True),
            ("True", True),
            ("1", True),
            ("yes", True),
            ("false", False),
            ("False", False),
            ("0", False),
            ("no", False),
        ]

        for input_val, expected in test_cases:
            record = {
                "name": "TestStartup",
                "industry": "Technology",
                "verified": input_val,
                "featured": input_val,
            }

            is_valid, errors, normalized = StartupValidator.validate_record(record)

            assert is_valid is True
            assert normalized["verified"] == expected
            assert normalized["featured"] == expected

    def test_validate_tags(self):
        """Test tag normalization and deduplication"""
        record = {
            "name": "TestStartup",
            "industry": "Technology",
            "tags": "saas, technology, b2b, SAAS",
        }

        is_valid, errors, normalized = StartupValidator.validate_record(record)

        assert is_valid is True
        # Tags should be preserved as string
        assert "saas" in normalized["tags"].lower()

    def test_validate_batch_success(self):
        """Test batch validation with mostly valid records"""
        records = [{"name": f"Startup{i}", "industry": "Technology"} for i in range(10)]

        result = StartupValidator.validate_batch(records)

        assert result["stats"]["total"] == 10
        assert result["stats"]["valid_count"] == 10
        assert result["stats"]["invalid_count"] == 0
        assert len(result["valid"]) == 10

    def test_validate_batch_with_errors(self):
        """Test batch validation with some invalid records"""
        records = [
            {"name": "Valid1", "industry": "Technology"},
            {"name": "", "industry": "Technology"},  # Invalid: empty name
            {"industry": "Healthcare"},  # Invalid: missing name
            {"name": "Valid2", "industry": "Finance"},
            {"name": "Valid3", "industry": "Healthcare"},
        ]

        result = StartupValidator.validate_batch(records)

        assert result["stats"]["total"] == 5
        assert result["stats"]["valid_count"] == 3
        assert result["stats"]["invalid_count"] == 2
        assert len(result["valid"]) == 3
        assert len(result["invalid"]) == 2
