"""
Risk scoring configuration
Centralized risk weights, thresholds, and level mappings
"""

# Death cause weights
DEATH_CAUSE_WEIGHTS = {
    "fraud": 30,
    "cash flow problems": 25,
    "market fit issues": 20,
}

# Funding risk thresholds
FUNDING_RISK_THRESHOLDS = {
    "low": 100000,
    "medium": 1000000,
}

# Funding risk weights
FUNDING_RISK_WEIGHTS = {
    "low": 20,
    "medium": 10,
}

# Stage risk mappings
STAGE_RISK = {
    "late": 20,
    "series_b": 10,
}

LATE_STAGES = ["series c", "series d", "series e", "series e+", "series f", "series g"]

# Employee risk thresholds
EMPLOYEE_RISK_THRESHOLDS = {
    "small": 50,
    "medium": 200,
}

# Employee risk weights
EMPLOYEE_RISK_WEIGHTS = {
    "small": 10,
    "medium": 5,
}

# Industry risk weights
INDUSTRY_RISK = {
    "technology": 20,
    "fintech": 20,
    "e-commerce": 15,
    "healthcare": 15,
    "real estate": 10,
    "food & beverage": 15,
    "media & entertainment": 15,
    "transportation": 15,
    "education": 10,
    "energy": 10,
    "manufacturing": 10,
}

# Risk level thresholds
RISK_LEVELS = {
    "low": (0, 20),
    "medium": (21, 40),
    "high": (41, 69),
    "critical": (70, 100),
}

DEFAULT_INDUSTRY_RISK = 5
