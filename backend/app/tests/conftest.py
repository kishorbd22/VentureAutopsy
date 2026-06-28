"""
Pytest configuration and fixtures
"""

from typing import Generator

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config.database import Base
from app.services.startup_analyzer import StartupAnalyzer
from app.utils.explainable_ai import ExplainableAnalyzer

# Test database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# Create test engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create test session
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db() -> Generator[Session, None, None]:
    """
    Create test database session
    Yields a session and cleans up after test
    """
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Create session
    session = TestingSessionLocal()

    try:
        yield session
    finally:
        # Cleanup
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="module")
def sample_startups() -> list:
    """Load sample startup data for testing"""
    return [
        {
            "name": "TestStartup1",
            "industry": "Technology",
            "sub_industry": "SaaS",
            "country": "USA",
            "founded_date": "2020-01-01",
            "closed_date": "2023-01-01",
            "lifespan_days": 1095,
            "total_funding_usd": 5000000,
            "funding_rounds": 3,
            "death_cause": "Cash Flow Problems",
            "death_cause_details": "Ran out of cash",
            "stage_at_death": "Series A",
            "number_of_employees": 50,
            "tags": "saas,technology",
        },
        {
            "name": "TestStartup2",
            "industry": "Healthcare",
            "sub_industry": "Health Tech",
            "country": "USA",
            "founded_date": "2018-01-01",
            "closed_date": "2022-01-01",
            "lifespan_days": 1460,
            "total_funding_usd": 10000000,
            "funding_rounds": 4,
            "death_cause": "Market Fit Issues",
            "death_cause_details": "No product-market fit",
            "stage_at_death": "Series B",
            "number_of_employees": 100,
            "tags": "healthtech,medical",
        },
        {
            "name": "TestStartup3",
            "industry": "Technology",
            "sub_industry": "AI/ML",
            "country": "USA",
            "founded_date": "2019-01-01",
            "closed_date": "2023-06-01",
            "lifespan_days": 1620,
            "total_funding_usd": 15000000,
            "funding_rounds": 5,
            "death_cause": "Fraud",
            "death_cause_details": "Misleading investors",
            "stage_at_death": "Series C",
            "number_of_employees": 200,
            "tags": "ai,ml,enterprise",
        },
    ]


@pytest.fixture(scope="module")
def analyzer_with_db(db) -> Generator[StartupAnalyzer, None, None]:
    """Create analyzer with test database"""
    analyzer = StartupAnalyzer(db=db)
    yield analyzer
    db.close()


@pytest.fixture(scope="module")
def explainable_analyzer(
    analyzer_with_db,
) -> Generator[ExplainableAnalyzer, None, None]:
    """Create explainable analyzer with test data"""
    yield ExplainableAnalyzer(analyzer_with_db.failed_startups)
