#!/usr/bin/env python3
"""
Bulk Import Script for Startup Data
Usage: python import_startups.py <csv_file_path> [--batch-size 1000]
"""

import argparse
import os
import sys
from datetime import datetime

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from app.config.database import SessionLocal
from app.models.startup import Startup
from app.services.data_ingestion_service import DataIngestionService


def print_banner(text: str):
    """Print formatted banner"""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70 + "\n")


def import_csv_file(
    csv_path: str, batch_size: int = 1000, clear_existing: bool = False
):
    """
    Import startups from CSV file

    Args:
        csv_path: Path to CSV file
        batch_size: Number of records per batch
        clear_existing: If True, clear existing data before import
    """
    print_banner("STARTUP DATA IMPORT")

    # Validate file exists
    if not os.path.exists(csv_path):
        print(f"❌ Error: File not found: {csv_path}")
        return False

    print(f"📁 Input file: {csv_path}")
    print(f"📊 Batch size: {batch_size}")
    print(f"🗑️  Clear existing data: {'Yes' if clear_existing else 'No'}")

    # Create database session
    db = SessionLocal()

    try:
        # Clear existing data if requested
        if clear_existing:
            print("\n⚠️  Clearing existing startup data...")
            deleted = db.query(Startup).delete()
            db.commit()
            print(f"   Deleted {deleted} existing records")

        # Initialize ingestion service
        print("\n🚀 Starting import process...")
        ingestion_service = DataIngestionService(db)

        # Ingest data
        result = ingestion_service.ingest_from_csv(csv_path, batch_size)

        # Print results
        print_banner("IMPORT RESULTS")

        if result["success"]:
            stats = result["stats"]
            print("✅ Import completed successfully!\n")
            print(f"   Total records processed: {stats['total_records']}")
            print(
                f"   Valid records: {stats['valid_records']} ({stats['success_rate']:.2f}%)"
            )
            print(f"   Invalid records: {stats['invalid_records']}")
            print(f"   Inserted into database: {stats['inserted_records']}")
            print(f"   Skipped (duplicates): {stats['skipped_records']}")

            # Print database statistics
            if "database_stats" in stats:
                db_stats = stats["database_stats"]
                print("\n   Database Statistics:")
                print(f"   - Total startups: {db_stats.get('total_startups', 0)}")
                print(
                    f"   - Average lifespan: {db_stats.get('avg_lifespan', 0):.0f} days"
                )
                print(
                    f"   - Median lifespan: {db_stats.get('median_lifespan', 0):.0f} days"
                )
                print(f"   - Average funding: ${db_stats.get('avg_funding', 0):,.0f}")

                if db_stats.get("top_industries"):
                    print("\n   Top 5 Industries:")
                    for i, (industry, count) in enumerate(
                        list(db_stats["industries"].items())[:5], 1
                    ):
                        print(f"   {i}. {industry}: {count}")

            # Print validation errors if any
            if result.get("errors"):
                print("\n⚠️  Validation Errors (First 10):")
                for error in result["errors"][:10]:
                    error_msg = (
                        "; ".join(error["errors"])
                        if isinstance(error["errors"], list)
                        else error["errors"]
                    )
                    print(f"   Row {error['row']}: {error_msg}")

            # Generate and save report
            report = ingestion_service.generate_import_report(result)
            report_path = (
                f"import_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
            )
            with open(report_path, "w") as f:
                f.write(report)
            print(f"\n📄 Detailed report saved to: {report_path}")

            return True

        else:
            print(f"❌ Import failed: {result.get('error')}")
            return False

    except Exception as e:
        print(f"❌ Error during import: {str(e)}")
        db.rollback()
        return False

    finally:
        db.close()


def validate_csv(csv_path: str):
    """Validate CSV file without importing"""
    print_banner("CSV VALIDATION")

    if not os.path.exists(csv_path):
        print(f"❌ Error: File not found: {csv_path}")
        return False

    print(f"📁 Validating: {csv_path}\n")

    db = SessionLocal()

    try:
        ingestion_service = DataIngestionService(db)
        result = ingestion_service.validate_csv_format(csv_path)

        if result["valid"]:
            print("✅ CSV file is valid!\n")
            print(f"   Headers found: {', '.join(result['headers'])}")
            print(f"   Row count: {result['row_count']}")
            print(
                f"   Required fields present: {'Yes' if result['required_fields_present'] else 'No'}"
            )
            return True
        else:
            print(f"❌ CSV validation failed: {result['error']}")
            if "headers" in result:
                print(f"   Headers found: {', '.join(result['headers'])}")
            return False

    finally:
        db.close()


def export_database(output_path: str, industry: str = None, country: str = None):
    """Export database to CSV"""
    print_banner("DATABASE EXPORT")

    print(f"📁 Output file: {output_path}")

    filters = {}
    if industry:
        filters["industry"] = industry
        print(f"🏭 Filter by industry: {industry}")
    if country:
        filters["country"] = country
        print(f"🌍 Filter by country: {country}")

    db = SessionLocal()

    try:
        ingestion_service = DataIngestionService(db)
        result = ingestion_service.export_to_csv(
            output_path, filters if filters else None
        )

        if result["success"]:
            print("\n✅ Export completed successfully!")
            print(f"   Records exported: {result['records_exported']}")
            print(f"   File saved to: {result['file_path']}")
            return True
        else:
            print(f"❌ Export failed: {result.get('error')}")
            return False

    finally:
        db.close()


def get_statistics():
    """Get database statistics"""
    print_banner("DATABASE STATISTICS")

    db = SessionLocal()

    try:
        from app.utils.normalizers import DataNormalizer

        # Query all startups
        startups = db.query(Startup).all()

        # Convert to dict format
        records = []
        for s in startups:
            records.append(
                {
                    "name": s.name,
                    "industry": s.industry,
                    "sub_industry": s.sub_industry,
                    "country": s.country,
                    "lifespan_days": s.lifespan_days,
                    "total_funding_usd": s.total_funding_usd,
                    "death_cause": s.death_cause,
                    "stage_at_death": s.stage_at_death,
                    "founded_date": s.founded_date,
                    "closed_date": s.closed_date,
                }
            )

        stats = DataNormalizer.calculate_statistics(records)

        print(f"📊 Total Startups: {stats.get('total_startups', 0)}")
        print("\n📈 Metrics:")
        print(
            f"   Average lifespan: {stats.get('avg_lifespan', 0):.0f} days ({stats.get('avg_lifespan', 0)/365:.1f} years)"
        )
        print(f"   Median lifespan: {stats.get('median_lifespan', 0):.0f} days")
        print(f"   Average funding: ${stats.get('avg_funding', 0):,.0f}")
        print(f"   Median funding: ${stats.get('median_funding', 0):,.0f}")

        if stats.get("date_range"):
            date_range = stats["date_range"]
            print("\n📅 Date Range:")
            if date_range.get("earliest_founded"):
                print(
                    f"   Founded: {date_range['earliest_founded']} - {date_range['latest_founded']}"
                )
            if date_range.get("earliest_closed"):
                print(
                    f"   Closed: {date_range['earliest_closed']} - {date_range['latest_closed']}"
                )

        if stats.get("top_industries"):
            print("\n🏭 Top 10 Industries:")
            for i, (industry, count) in enumerate(
                list(stats["industries"].items())[:10], 1
            ):
                percentage = (count / stats["total_startups"]) * 100
                print(f"   {i:2}. {industry}: {count} ({percentage:.1f}%)")

        if stats.get("top_death_causes"):
            print("\n💀 Top 5 Failure Reasons:")
            for i, (cause, count) in enumerate(
                list(stats["death_causes"].items())[:5], 1
            ):
                percentage = (count / stats["total_startups"]) * 100
                print(f"   {i}. {cause}: {count} ({percentage:.1f}%)")

        if stats.get("stages"):
            print("\n💰 Stages at Failure:")
            for stage, count in list(stats["stages"].items())[:5]:
                percentage = (count / stats["total_startups"]) * 100
                print(f"   - {stage}: {count} ({percentage:.1f}%)")

        return True

    except Exception as e:
        print(f"❌ Error getting statistics: {str(e)}")
        return False

    finally:
        db.close()


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description="Startup Data Import/Export Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Import CSV file
  python import_startups.py data.csv
  
  # Import with custom batch size
  python import_startups.py data.csv --batch-size 500
  
  # Import and clear existing data
  python import_startups.py data.csv --clear
  
  # Validate CSV without importing
  python import_startups.py data.csv --validate
  
  # Export database to CSV
  python import_startups.py --export output.csv
  
  # Export filtered data
  python import_startups.py --export output.csv --industry Technology
  
  # Get database statistics
  python import_startups.py --stats
        """,
    )

    parser.add_argument("input_file", nargs="?", help="Input CSV file path")
    parser.add_argument(
        "--batch-size",
        type=int,
        default=1000,
        help="Batch size for processing (default: 1000)",
    )
    parser.add_argument(
        "--clear", action="store_true", help="Clear existing data before import"
    )
    parser.add_argument(
        "--validate", action="store_true", help="Validate CSV without importing"
    )
    parser.add_argument(
        "--export", metavar="OUTPUT", help="Export database to CSV file"
    )
    parser.add_argument("--industry", help="Filter export by industry")
    parser.add_argument("--country", help="Filter export by country")
    parser.add_argument("--stats", action="store_true", help="Show database statistics")

    args = parser.parse_args()

    # Execute command
    if args.stats:
        get_statistics()

    elif args.export:
        export_database(args.export, args.industry, args.country)

    elif args.validate and args.input_file:
        validate_csv(args.input_file)

    elif args.input_file:
        import_csv_file(args.input_file, args.batch_size, args.clear)

    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
