"""
Data validation utilities
Validates startup records against schema requirements
"""

from datetime import datetime
from typing import Any, Dict, List, Tuple


class StartupValidator:
    """Validates startup data records"""

    REQUIRED_FIELDS = ["name", "industry"]

    NUMERIC_FIELDS = [
        "lifespan_days",
        "total_funding_usd",
        "funding_rounds",
        "number_of_employees",
    ]

    DATE_FIELDS = ["founded_date", "closed_date"]

    TEXT_FIELDS = [
        "description",
        "industry",
        "sub_industry",
        "country",
        "state_province",
        "city",
        "death_cause",
        "death_cause_details",
        "stage_at_death",
        "source_url",
    ]

    BOOLEAN_FIELDS = ["verified", "featured"]

    @classmethod
    def validate_record(
        cls, record: Dict[str, Any], row_num: int = None
    ) -> Tuple[bool, List[str], Dict[str, Any]]:
        """
        Validate a single startup record

        Returns:
            (is_valid, errors, normalized_record)
        """
        errors = []
        normalized = {}
        row_info = f"Row {row_num}: " if row_num else ""

        # Check required fields
        for field in cls.REQUIRED_FIELDS:
            if not record.get(field):
                errors.append(f"{row_info}Missing required field: {field}")

        # Normalize required fields
        normalized["name"] = (
            record.get("name", "").strip() if record.get("name") else None
        )
        normalized["industry"] = (
            record.get("industry", "").strip() if record.get("industry") else None
        )

        # Validate and normalize numeric fields
        for field in cls.NUMERIC_FIELDS:
            value = record.get(field)
            if value is not None and value != "":
                try:
                    normalized[field] = (
                        float(value) if "." in str(value) else int(value)
                    )
                except (ValueError, TypeError):
                    errors.append(
                        f"{row_info}Invalid numeric value for {field}: {value}"
                    )
            else:
                normalized[field] = None

        # Validate and normalize date fields
        for field in cls.DATE_FIELDS:
            value = record.get(field)
            if value:
                parsed_date = cls._parse_date(value)
                if parsed_date:
                    normalized[field] = parsed_date
                else:
                    errors.append(f"{row_info}Invalid date format for {field}: {value}")
            else:
                normalized[field] = None

        # Validate text fields
        for field in cls.TEXT_FIELDS:
            value = record.get(field)
            if value and isinstance(value, str):
                normalized[field] = value.strip() if value.strip() else None
            else:
                normalized[field] = None

        # Validate boolean fields
        for field in cls.BOOLEAN_FIELDS:
            value = record.get(field)
            if isinstance(value, str):
                normalized[field] = value.lower() in ["true", "1", "yes"]
            else:
                normalized[field] = bool(value) if value is not None else False

        # Validate name length
        name = record.get("name", "")
        if name and len(name) > 255:
            normalized["name"] = name[:255]

        # Validate industry length
        industry = record.get("industry", "")
        if industry and len(industry) > 100:
            errors.append(f"{row_info}Industry exceeds 100 characters")
            normalized["industry"] = industry[:100]

        # Validate funding is non-negative
        if (
            normalized.get("total_funding_usd") is not None
            and normalized["total_funding_usd"] < 0
        ):
            normalized["total_funding_usd"] = abs(normalized["total_funding_usd"])

        # Validate employees is positive
        if (
            normalized.get("number_of_employees") is not None
            and normalized["number_of_employees"] < 0
        ):
            normalized["number_of_employees"] = abs(normalized["number_of_employees"])

        # Copy any additional fields as tags
        if "tags" in record:
            tags_value = record["tags"]
            if isinstance(tags_value, str):
                normalized["tags"] = tags_value
            else:
                normalized["tags"] = str(tags_value)
        else:
            normalized["tags"] = None

        is_valid = len(errors) == 0
        return is_valid, errors, normalized

    @staticmethod
    def _parse_date(date_value: Any) -> datetime:
        """Parse date from various formats"""
        if isinstance(date_value, datetime):
            return date_value

        formats = [
            "%Y-%m-%d",
            "%m/%d/%Y",
            "%d/%m/%Y",
            "%Y-%m",
            "%m-%Y",
            "%B %d, %Y",
            "%d %B %Y",
        ]

        date_str = str(date_value).strip()

        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue

        return None

    @classmethod
    def validate_batch(cls, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Validate a batch of records

        Returns:
            {
                'valid': [...],
                'invalid': [...],
                'stats': {...}
            }
        """
        valid_records = []
        invalid_records = []
        error_counts = {}

        for i, record in enumerate(records, start=2):  # Start at 2 (header is row 1)
            is_valid, errors, normalized = cls.validate_record(record, i)

            if is_valid:
                valid_records.append(normalized)
            else:
                invalid_records.append({"row": i, "record": record, "errors": errors})

                for error in errors:
                    error_type = error.split(":")[0] if ":" in error else error
                    error_counts[error_type] = error_counts.get(error_type, 0) + 1

        return {
            "valid": valid_records,
            "invalid": invalid_records,
            "stats": {
                "total": len(records),
                "valid_count": len(valid_records),
                "invalid_count": len(invalid_records),
                "success_rate": (len(valid_records) / len(records) * 100)
                if records
                else 0,
                "error_breakdown": error_counts,
            },
        }
