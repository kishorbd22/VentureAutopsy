"""
API router
Main router that includes all sub-routers
"""

from fastapi import APIRouter

from app.routes import (admin_routes, analyze_routes, analytics_routes, ai_routes, auth_routes,
                        import_routes, startup_routes, user_routes)

api_router = APIRouter()

# Include admin routes (must be before other routes to avoid conflicts)
api_router.include_router(admin_routes.router, prefix="/admin", tags=["Admin"])

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

# Include analytics routes
api_router.include_router(
    analytics_routes.router, prefix="/analytics", tags=["Analytics"]
)

# Include AI routes
api_router.include_router(
    ai_routes.router, prefix="/ai", tags=["AI Features"]
)