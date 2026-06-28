"""
Data ingestion service
Handles bulk import and processing of startup datasets
"""

import csv
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.models.startup import Startup
from app.utils.normalizers import DataNormalizer
from app.utils.validators import StartupValidator


class DataIngestionService:
    """Service for ingesting and processing startup data"""

    def __init__(self, db: Session):
        self.db = db
        self.validator = StartupValidator()
        self.normalizer = DataNormalizer()

    def ingest_from_csv(self, csv_path: str, batch_size: int = 1000) -> Dict[str, Any]:
        """
        Ingest startup data from CSV file

        Args:
            csv_path: Path to CSV file
            batch_size: Number of records to process per batch

        Returns:
            {
                'success': bool,
                'stats': {...},
                'errors': [...]
            }
        """
        if not os.path.exists(csv_path):
            return {"success": False, "error": f"File not found: {csv_path}"}

        try:
            # Read CSV file
            records = self._read_csv(csv_path)

            if not records:
                return {"success": False, "error": "No records found in CSV file"}

            # Validate and normalize
            validation_result = self.validator.validate_batch(records)
            print("\nValidation Stats:")
            print(validation_result["stats"])
            print("Valid Records:")
            print(validation_result["valid"])
            print("Invalid Records:")
            print(validation_result["invalid"])

            # Normalize valid records
            normalized_records = self.normalizer.normalize_batch(
                validation_result["valid"]
            )

            # Bulk insert into database
            insert_stats = self._bulk_insert(normalized_records, batch_size)

            # Calculate statistics
            stats = DataNormalizer.calculate_statistics(normalized_records)

            return {
                "success": True,
                "stats": {
                    "file": os.path.basename(csv_path),
                    "total_records": len(records),
                    "valid_records": len(validation_result["valid"]),
                    "invalid_records": len(validation_result["invalid"]),
                    "inserted_records": insert_stats["inserted"],
                    "skipped_records": insert_stats["skipped"],
                    "success_rate": (
                        len(validation_result["valid"]) / len(records) * 100
                    )
                    if records
                    else 0,
                    "validation_stats": validation_result["stats"],
                    "database_stats": stats,
                },
                "errors": validation_result["invalid"][:50],  # Limit error reporting
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    def ingest_from_dict(self, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Ingest startup data from list of dictionaries

        Args:
            records: List of startup records

        Returns:
            {
                'success': bool,
                'stats': {...},
                'errors': [...]
            }
        """
        try:
            # Validate and normalize
            validation_result = self.validator.validate_batch(records)

            # Normalize valid records
            normalized_records = self.normalizer.normalize_batch(
                validation_result["valid"]
            )

            # Bulk insert into database
            insert_stats = self._bulk_insert(normalized_records)

            # Calculate statistics
            stats = DataNormalizer.calculate_statistics(normalized_records)

            return {
                "success": True,
                "stats": {
                    "total_records": len(records),
                    "valid_records": len(validation_result["valid"]),
                    "invalid_records": len(validation_result["invalid"]),
                    "inserted_records": insert_stats["inserted"],
                    "skipped_records": insert_stats["skipped"],
                    "success_rate": (
                        len(validation_result["valid"]) / len(records) * 100
                    )
                    if records
                    else 0,
                    "database_stats": stats,
                },
                "errors": validation_result["invalid"][:50],
            }

        except Exception as e:
            return {"success": False, "error": str(e)}

    def _read_csv(self, csv_path: str) -> List[Dict[str, Any]]:
        """Read and parse CSV file"""
        records = []

        with open(csv_path, "r", encoding="utf-8-sig") as file:
            # Use DictReader to map columns
            reader = csv.DictReader(file)

            for row in reader:
                # Clean up keys (strip whitespace)
                cleaned_row = {k.strip(): v for k, v in row.items() if k}
                records.append(cleaned_row)

        return records

    def _bulk_insert(
        self, records: List[Dict[str, Any]], batch_size: int = 1000
    ) -> Dict[str, int]:
        """
        Bulk insert records into database

        Args:
            records: List of normalized records
            batch_size: Records per batch

        Returns:
            {
                'inserted': int,
                'skipped': int
            }
        """
        inserted = 0
        skipped = 0

        # Process in batches
        for i in range(0, len(records), batch_size):
            batch = records[i : i + batch_size]

            try:
                for record in batch:
                    # Check if startup already exists (by name + industry + closed_date)
                    existing = (
                        self.db.query(Startup)
                        .filter(
                            Startup.name == record.get("name"),
                            Startup.industry == record.get("industry"),
                        )
                        .first()
                    )

                    if existing:
                        skipped += 1
                        continue

                    # Create new startup
                    startup = Startup(**record)
                    self.db.add(startup)
                    inserted += 1

                # Commit batch
                self.db.commit()

            except Exception as e:
                print("\n========== BULK INSERT ERROR ==========")
                print(type(e))
                print(e)
                import traceback

                traceback.print_exc()

                self.db.rollback()
                skipped += len(batch)

        return {"inserted": inserted, "skipped": skipped}

    def generate_import_report(self, import_result: Dict[str, Any]) -> str:
        """Generate human-readable import report"""
        if not import_result.get("success"):
            return f"Import failed: {import_result.get('error')}"

        stats = import_result["stats"]
        report = []
        report.append("=" * 60)
        report.append("DATA IMPORT REPORT")
        report.append("=" * 60)
        report.append(f"File: {stats['file']}")
        report.append(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append("")
        report.append("SUMMARY")
        report.append("-" * 60)
        report.append(f"Total records processed: {stats['total_records']}")
        report.append(f"Valid records: {stats['valid_records']}")
        report.append(f"Invalid records: {stats['invalid_records']}")
        report.append(f"Inserted into database: {stats['inserted_records']}")
        report.append(f"Skipped (duplicates): {stats['skipped_records']}")
        report.append(f"Success rate: {stats['success_rate']:.2f}%")
        report.append("")

        if "database_stats" in stats:
            db_stats = stats["database_stats"]
            report.append("DATABASE STATISTICS")
            report.append("-" * 60)
            report.append(
                f"Total startups in database: {db_stats.get('total_startups', 0)}"
            )
            report.append(
                f"Average lifespan: {db_stats.get('avg_lifespan', 0):.0f} days"
            )
            report.append(
                f"Median lifespan: {db_stats.get('median_lifespan', 0):.0f} days"
            )
            report.append(f"Average funding: ${db_stats.get('avg_funding', 0):,.0f}")
            report.append("")

            if db_stats.get("top_industries"):
                report.append("TOP INDUSTRIES")
                report.append("-" * 60)
                for i, (industry, count) in enumerate(
                    list(db_stats["top_industries"].items())[:10], 1
                ):
                    report.append(f"{i:2}. {industry}: {count}")
                report.append("")

            if db_stats.get("top_death_causes"):
                report.append("TOP FAILURE REASONS")
                report.append("-" * 60)
                for i, (cause, count) in enumerate(
                    list(db_stats["top_death_causes"].items())[:5], 1
                ):
                    report.append(f"{i}. {cause}: {count}")
                report.append("")

        if import_result.get("errors"):
            report.append("VALIDATION ERRORS (First 50)")
            report.append("-" * 60)
            for error in import_result["errors"]:
                error_msg = (
                    "; ".join(error["errors"])
                    if isinstance(error["errors"], list)
                    else error["errors"]
                )
                report.append(f"Row {error['row']}: {error_msg}")
            report.append("")

        report.append("=" * 60)

        return "\n".join(report)

    def validate_csv_format(self, csv_path: str) -> Dict[str, Any]:
        """Validate CSV file format and structure"""
        if not os.path.exists(csv_path):
            return {"valid": False, "error": "File not found"}

        try:
            with open(csv_path, "r", encoding="utf-8-sig") as file:
                reader = csv.DictReader(file)
                headers = reader.fieldnames

                if not headers:
                    return {
                        "valid": False,
                        "error": "CSV file is empty or has no headers",
                    }

                # Check for required fields
                required = ["name", "industry"]
                missing = [f for f in required if f not in headers]

                if missing:
                    return {
                        "valid": False,
                        "error": f'Missing required columns: {", ".join(missing)}',
                        "headers": headers,
                    }

                # Count rows
                row_count = sum(1 for _ in reader)

                return {
                    "valid": True,
                    "headers": headers,
                    "row_count": row_count,
                    "required_fields_present": True,
                }

        except Exception as e:
            return {"valid": False, "error": str(e)}

    def load_startups_from_csv_to_memory(self, csv_path: str) -> List[Dict[str, Any]]:
        """
        Load startups from CSV into memory for analysis
        Used by StartupAnalyzer without database insertion
        """
        if not os.path.exists(csv_path):
            return []

        try:
            records = self._read_csv(csv_path)
            validation_result = self.validator.validate_batch(records)
            normalized_records = self.normalizer.normalize_batch(
                validation_result["valid"]
            )

            return normalized_records

        except Exception as e:
            print(f"Error loading CSV to memory: {str(e)}")
            return []

    def export_to_csv(
        self, output_path: str, filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Export database records to CSV

        Args:
            output_path: Path to save CSV file
            filters: Optional filters to apply

        Returns:
            {
                'success': bool,
                'records_exported': int,
                'file_path': str
            }
        """
        try:
            # Query database
            query = self.db.query(Startup)

            # Apply filters
            if filters:
                if "industry" in filters:
                    query = query.filter(Startup.industry == filters["industry"])
                if "country" in filters:
                    query = query.filter(Startup.country == filters["country"])
                if "min_funding" in filters:
                    query = query.filter(
                        Startup.total_funding_usd >= filters["min_funding"]
                    )

            startups = query.all()

            # Write to CSV
            fieldnames = [
                "name",
                "industry",
                "sub_industry",
                "country",
                "city",
                "founded_date",
                "closed_date",
                "lifespan_days",
                "total_funding_usd",
                "funding_rounds",
                "death_cause",
                "death_cause_details",
                "stage_at_death",
                "number_of_employees",
                "tags",
                "verified",
                "featured",
                "created_at",
            ]

            with open(output_path, "w", newline="", encoding="utf-8") as file:
                writer = csv.DictWriter(file, fieldnames=fieldnames)
                writer.writeheader()

                for startup in startups:
                    row = {
                        "name": startup.name,
                        "industry": startup.industry,
                        "sub_industry": startup.sub_industry,
                        "country": startup.country,
                        "city": startup.city,
                        "founded_date": startup.founded_date.isoformat()
                        if startup.founded_date
                        else "",
                        "closed_date": startup.closed_date.isoformat()
                        if startup.closed_date
                        else "",
                        "lifespan_days": startup.lifespan_days,
                        "total_funding_usd": startup.total_funding_usd,
                        "funding_rounds": startup.funding_rounds,
                        "death_cause": startup.death_cause,
                        "death_cause_details": startup.death_cause_details,
                        "stage_at_death": startup.stage_at_death,
                        "number_of_employees": startup.number_of_employees,
                        "tags": startup.tags,
                        "verified": startup.verified,
                        "featured": startup.featured,
                        "created_at": startup.created_at.isoformat()
                        if startup.created_at
                        else "",
                    }
                    writer.writerow(row)

            return {
                "success": True,
                "records_exported": len(startups),
                "file_path": output_path,
            }

        except Exception as e:
            return {"success": False, "error": str(e)}
