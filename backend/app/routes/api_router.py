"""
API router
Main router that includes all sub-routers
"""

from fastapi import APIRouter

from app.routes import (analyze_routes, auth_routes, import_routes,
                        startup_routes, user_routes)

api_router = APIRouter()

# Include startup routes
api_router.include_router(startup_routes.router, prefix="/startups", tags=["Startups"])

# Include user routes
api_router.include_router(user_routes.router, prefix="/users", tags=["Users"])

# Include analysis routes
api_router.include_router(analyze_routes.router, prefix="/analysis", tags=["Analysis"])

# Include auth routes
api_router.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])

# Include import/export routes
api_router.include_router(
    import_routes.router, prefix="/data", tags=["Data Management"]
)
