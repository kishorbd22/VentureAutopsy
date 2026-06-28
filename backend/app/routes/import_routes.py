"""
Import/Export routes
API endpoints for data ingestion and management
"""

import os
import tempfile

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.services.data_ingestion_service import DataIngestionService
from app.utils.validators import StartupValidator

router = APIRouter()


@router.post("/import/csv")
async def import_csv(
    file: UploadFile = File(...),
    batch_size: int = 1000,
    clear_existing: bool = False,
    db: Session = Depends(get_db),
):
    """
    Import startup data from CSV file upload

    Args:
        file: CSV file to upload
        batch_size: Number of records per batch
        clear_existing: Whether to clear existing data first

    Returns:
        {
            'success': bool,
            'stats': {...},
            'errors': [...]
        }
    """
    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Only CSV files are allowed"
        )

    # Save uploaded file temporarily
    temp_file = None
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(
            mode="wb", delete=False, suffix=".csv"
        ) as temp:
            content = await file.read()
            temp.write(content)
            temp_file = temp.name

        # Initialize ingestion service
        ingestion_service = DataIngestionService(db)

        # Clear existing data if requested
        if clear_existing:
            from app.models.startup import Startup

            db.query(Startup).delete()
            db.commit()

        # Ingest data
        result = ingestion_service.ingest_from_csv(temp_file, batch_size)

        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("error", "Import failed"),
            )

        return {
            "success": True,
            "message": "Data imported successfully",
            "data": result["stats"],
            "errors": result.get("errors", []),
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Import failed: {str(e)}",
        )

    finally:
        # Clean up temp file
        if temp_file and os.path.exists(temp_file):
            os.unlink(temp_file)


@router.post("/import/validate")
async def validate_csv(file: UploadFile = File(...)):
    """
    Validate CSV file format without importing

    Returns:
        {
            'valid': bool,
            'headers': [...],
            'row_count': int,
            'stats': {...}
        }
    """
    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Only CSV files are allowed"
        )

    # Save uploaded file temporarily
    temp_file = None
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(
            mode="wb", delete=False, suffix=".csv"
        ) as temp:
            content = await file.read()
            temp.write(content)
            temp_file = temp.name

        # Validate format
        validator = StartupValidator()
        result = validator.validate_csv_format(temp_file)

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Validation failed: {str(e)}",
        )

    finally:
        # Clean up temp file
        if temp_file and os.path.exists(temp_file):
            os.unlink(temp_file)


@router.get("/import/stats")
async def get_import_statistics(db: Session = Depends(get_db)):
    """
    Get statistics about the imported data

    Returns:
        {
            'total_records': int,
            'industries': {...},
            'death_causes': {...},
            'average_lifespan': float,
            'average_funding': float
        }
    """
    try:
        from app.models.startup import Startup
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

        return {"success": True, "data": stats}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get statistics: {str(e)}",
        )


@router.get("/import/sample-csv-template")
async def get_sample_csv_template():
    """
    Get sample CSV template for data import

    Returns sample CSV structure with headers
    """
    csv_template = """name,industry,sub_industry,country,founded_date,closed_date,lifespan_days,total_funding_usd,funding_rounds,death_cause,death_cause_details,stage_at_death,number_of_employees,tags
Example Startup,Technology,SaaS,USA,2020-01-01,2023-01-01,1095,5000000,3,Cash Flow Problems,"Ran out of cash before reaching profitability",Series A,50,"saas,technology,b2b"
"""

    return {
        "template": csv_template,
        "description": "Sample CSV template for startup data import",
        "required_fields": ["name", "industry"],
        "optional_fields": [
            "sub_industry",
            "country",
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
        ],
    }
