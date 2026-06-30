"""
Admin routes
Dashboard, user management, startup management, CSV import
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.config.database import get_db
from app.models.user import User
from app.models.startup import Startup
from app.models.analysis import Analysis
from app.middleware.admin_middleware import require_admin
from app.services.data_ingestion_service import DataIngestionService

router = APIRouter()


# Response models
class AdminDashboardStats(BaseModel):
    total_users: int
    active_users: int
    total_startups: int
    total_analyses: int
    avg_risk_score: float
    growth_rate: float
    new_users_today: int
    analyses_today: int


class UserListResponse(BaseModel):
    users: List[dict]
    total: int
    page: int
    page_size: int
    total_pages: int


class StartupListResponse(BaseModel):
    startups: List[dict]
    total: int
    page: int
    page_size: int
    total_pages: int


# Dashboard Stats
@router.get("/dashboard/stats", response_model=AdminDashboardStats)
async def get_dashboard_stats(request: Request, db: Session = Depends(get_db)):
    """Get admin dashboard statistics"""
    # require_admin will raise if not admin
    await require_admin(request, db)

    total_users = db.query(func.count(User.id)).scalar() or 0
    active_users = db.query(func.count(User.id)).filter(User.is_active.is_(True)).scalar() or 0
    total_startups = db.query(func.count(Startup.id)).scalar() or 0
    total_analyses = db.query(func.count(Analysis.id)).scalar() or 0
    avg_risk_score = db.query(func.avg(Analysis.risk_score)).scalar() or 0.0

    # Today's stats
    from datetime import date
    today = date.today()
    new_users_today = (
        db.query(func.count(User.id))
        .filter(func.cast(User.created_at, db) == today)
        .scalar() or 0
    )
    analyses_today = (
        db.query(func.count(Analysis.id))
        .filter(func.cast(Analysis.created_at, db) == today)
        .scalar() or 0
    )

    # Simple growth rate (could be more sophisticated)
    growth_rate = round((analyses_today / max(total_analyses, 1)) * 100, 2)

    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_startups": total_startups,
        "total_analyses": total_analyses,
        "avg_risk_score": round(avg_risk_score, 2),
        "growth_rate": growth_rate,
        "new_users_today": new_users_today,
        "analyses_today": analyses_today,
    }


# Users Management
@router.get("/users", response_model=UserListResponse)
async def get_users(
    request: Request,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc")
):
    """Get paginated list of users with search"""
    await require_admin(request, db)

    query = db.query(User)

    # Search
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (User.email.ilike(search_filter)) |
            (User.username.ilike(search_filter)) |
            (User.full_name.ilike(search_filter))
        )

    # Sorting
    sort_column = getattr(User, sort_by, User.created_at)
    if sort_order == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(sort_column)

    # Pagination
    total = query.count()
    users = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "users": [
            {
                "id": u.id,
                "email": u.email,
                "username": u.username,
                "full_name": u.full_name,
                "is_active": u.is_active,
                "is_admin": u.is_admin,
                "is_verified": u.is_verified,
                "created_at": u.created_at.isoformat() if u.created_at else None,
                "last_login": u.last_login.isoformat() if u.last_login else None,
            }
            for u in users
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }


@router.delete("/users/{user_id}")
async def delete_user(request: Request, user_id: int, db: Session = Depends(get_db)):
    """Delete a user"""
    await require_admin(request, db)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"success": True, "message": "User deleted"}


@router.put("/users/{user_id}/role")
async def update_user_role(
    request: Request, user_id: int, is_admin: bool, db: Session = Depends(get_db)
):
    """Update user admin role"""
    await require_admin(request, db)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_admin = is_admin
    db.commit()

    return {"success": True, "message": "User role updated"}


# Startups Management
@router.get("/startups", response_model=StartupListResponse)
async def get_startups(
    request: Request,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    industry: Optional[str] = Query(None)
):
    """Get paginated list of startups with search and filter"""
    await require_admin(request, db)

    query = db.query(Startup)

    # Search
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Startup.name.ilike(search_filter)) |
            (Startup.description.ilike(search_filter)) |
            (Startup.country.ilike(search_filter))
        )

    # Filter by industry
    if industry:
        query = query.filter(Startup.industry == industry)

    # Sorting by newest first
    query = query.order_by(desc(Startup.created_at))

    # Pagination
    total = query.count()
    startups = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "startups": [
            {
                "id": s.id,
                "name": s.name,
                "industry": s.industry,
                "sub_industry": s.sub_industry,
                "country": s.country,
                "total_funding_usd": s.total_funding_usd,
                "number_of_employees": s.number_of_employees,
                "death_cause": s.death_cause,
                "stage_at_death": s.stage_at_death,
                "created_at": s.created_at.isoformat() if s.created_at else None,
            }
            for s in startups
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }


@router.delete("/startups/{startup_id}")
async def delete_startup(request: Request, startup_id: int, db: Session = Depends(get_db)):
    """Delete a startup"""
    await require_admin(request, db)

    startup = db.query(Startup).filter(Startup.id == startup_id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")

    db.delete(startup)
    db.commit()

    return {"success": True, "message": "Startup deleted"}


# CSV Import
@router.post("/import/csv")
async def import_csv(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Import startups from CSV file"""
    await require_admin(request, db)

    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    try:
        service = DataIngestionService(db)
        # Read file content
        content = await file.read()
        result = service.import_from_csv_content(content.decode('utf-8'))

        return {
            "success": True,
            "data": result,
            "message": f"Successfully imported {result.get('imported', 0)} startups"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Import failed: {str(e)}"
        )


@router.get("/import/sample-template")
async def get_sample_template(request: Request, db: Session = Depends(get_db)):
    """Get sample CSV template for import"""
    await require_admin(request, db)

    # Return sample CSV as text
    csv_content = """name,industry,sub_industry,country,total_funding_usd,number_of_employees,death_cause,stage_at_death
Example Startup,SaaS,B2B,USA,5000000,50,Cash Flow Problems,Series A
Another Company,FinTech,Payments,UK,2000000,25,Market Competition,Seed"""

    return {
        "success": True,
        "data": csv_content,
        "filename": "startup_import_template.csv"
    }