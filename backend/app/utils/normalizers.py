"""
Data normalization utilities
Normalizes and standardizes startup data records
"""

from collections import defaultdict
from typing import Any, Dict, List


class DataNormalizer:
    """Normalizes startup data to standard formats"""

    # Standard industry mappings
    INDUSTRY_MAPPINGS = {
        "software": "Technology",
        "saas": "Technology",
        "tech": "Technology",
        "information technology": "Technology",
        "it": "Technology",
        "ai": "Technology",
        "artificial intelligence": "Technology",
        "machine learning": "Technology",
        "fintech": "FinTech",
        "financial technology": "FinTech",
        "finance": "FinTech",
        "banking": "FinTech",
        "e-commerce": "E-Commerce",
        "ecommerce": "E-Commerce",
        "retail": "E-Commerce",
        "healthcare": "Healthcare",
        "health": "Healthcare",
        "medical": "Healthcare",
        "biotech": "Healthcare",
        "biotechnology": "Healthcare",
        "real estate": "Real Estate",
        "property": "Real Estate",
        "construction": "Real Estate",
        "food": "Food & Beverage",
        "foodtech": "Food & Beverage",
        "restaurant": "Food & Beverage",
        "media": "Media & Entertainment",
        "entertainment": "Media & Entertainment",
        "gaming": "Media & Entertainment",
        "transportation": "Transportation",
        "logistics": "Transportation",
        "automotive": "Transportation",
        "education": "Education",
        "edtech": "Education",
        "energy": "Energy",
        "renewable energy": "Energy",
        "clean energy": "Energy",
        "manufacturing": "Manufacturing",
        "industrial": "Manufacturing",
    }

    # Standard stage mappings
    STAGE_MAPPINGS = {
        "pre-seed": "Pre-Seed",
        "preseed": "Pre-Seed",
        "seed": "Seed",
        "series a": "Series A",
        "series-a": "Series A",
        "series b": "Series B",
        "series-b": "Series B",
        "series c": "Series C",
        "series-c": "Series C",
        "series d": "Series D",
        "series-d": "Series D",
        "series e": "Series E+",
        "series e+": "Series E+",
        "series-e": "Series E+",
        "series f": "Series E+",
        "series g": "Series E+",
        "ipo": "Series E+",
        "exit": "Series E+",
    }

    # Standard death cause mappings
    DEATH_CAUSE_MAPPINGS = {
        "ran out of cash": "Cash Flow Problems",
        "cash flow": "Cash Flow Problems",
        "cash": "Cash Flow Problems",
        "funding": "Cash Flow Problems",
        "burn rate": "Cash Flow Problems",
        "no revenue": "Cash Flow Problems",
        "market fit": "Market Fit Issues",
        "product market fit": "Market Fit Issues",
        "pmf": "Market Fit Issues",
        "no demand": "Market Fit Issues",
        "competition": "Market Fit Issues",
        "fraud": "Fraud",
        "scandal": "Fraud",
        "illegal": "Fraud",
        "mismanagement": "Management Issues",
        "leadership": "Management Issues",
        "founder": "Management Issues",
        "team": "Management Issues",
        "legal": "Legal Issues",
        "regulation": "Legal Issues",
        "compliance": "Legal Issues",
        "technology": "Technical Issues",
        "technical": "Technical Issues",
        "product": "Technical Issues",
        "pivot": "Pivot",
        "acquisition": "Acquisition",
        "acquired": "Acquisition",
        "merge": "Acquisition",
    }

    @classmethod
    def normalize_record(cls, record: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize a single record"""
        normalized = record.copy()

        # Normalize industry
        if normalized.get("industry"):
            normalized["industry"] = cls._normalize_industry_display(
                normalized["industry"]
            )

        # Normalize sub-industry
        if normalized.get("sub_industry"):
            normalized["sub_industry"] = cls._normalize_text(normalized["sub_industry"])

        # Normalize stage
        if normalized.get("stage_at_death"):
            normalized["stage_at_death"] = cls._normalize_stage(
                normalized["stage_at_death"]
            )

        # Normalize death cause
        if normalized.get("death_cause"):
            normalized["death_cause"] = cls._normalize_death_cause(
                normalized["death_cause"]
            )

        # Normalize country
        if normalized.get("country"):
            normalized["country"] = cls._normalize_country(normalized["country"])

        # Normalize tags
        if normalized.get("tags"):
            normalized["tags"] = cls._normalize_tags(normalized["tags"])

        return normalized

    @staticmethod
    def _normalize_industry(name: str) -> str:
        """Normalize industry name to lowercase underscore format"""
        if not name:
            return name
        return name.lower().strip().replace(" ", "_")

    @classmethod
    def _normalize_industry_display(cls, industry: str) -> str:
        """Normalize industry name for display"""
        if not industry:
            return industry

        industry_lower = industry.lower().strip()

        # Check direct mapping
        if industry_lower in cls.INDUSTRY_MAPPINGS:
            return cls.INDUSTRY_MAPPINGS[industry_lower]

        # Check partial matches
        for key, value in cls.INDUSTRY_MAPPINGS.items():
            if key in industry_lower or industry_lower in key:
                return value

        # Return title-cased original if no match
        return industry.title()

    @classmethod
    def _normalize_stage(cls, stage: str) -> str:
        """Normalize funding stage"""
        if not stage:
            return stage

        stage_lower = stage.lower().strip()

        if stage_lower in cls.STAGE_MAPPINGS:
            return cls.STAGE_MAPPINGS[stage_lower]

        # Return title-cased original if no match
        return stage.title()

    @classmethod
    def _normalize_death_cause(cls, cause: str) -> str:
        """Normalize death cause"""
        if not cause:
            return cause

        cause_lower = cause.lower().strip()

        if cause_lower in cls.DEATH_CAUSE_MAPPINGS:
            return cls.DEATH_CAUSE_MAPPINGS[cause_lower]

        # Check partial matches
        for key, value in cls.DEATH_CAUSE_MAPPINGS.items():
            if key in cause_lower:
                return value

        # Return original with title case
        return cause.title()

    @classmethod
    def _normalize_country(cls, country: str) -> str:
        """Normalize country name"""
        if not country:
            return country

        country = country.strip()

        # Country code mappings
        country_codes = {
            "usa": "United States",
            "us": "United States",
            "united states of america": "United States",
            "uk": "United Kingdom",
            "gb": "United Kingdom",
            "united kingdom": "United Kingdom",
            "england": "United Kingdom",
            "britain": "United Kingdom",
        }

        country_lower = country.lower()

        if country_lower in country_codes:
            return country_codes[country_lower]

        # Return original with title case
        return country.title()

    @classmethod
    def _normalize_text(cls, text: str) -> str:
        """Normalize text field"""
        if not text:
            return text

        text = text.strip()
        return " ".join(text.split())  # Remove extra whitespace

    @classmethod
    def _normalize_tags(cls, tags: str) -> str:
        """Normalize tags field"""
        if not tags:
            return tags

        # Split by comma, clean each tag
        tag_list = [tag.strip().lower() for tag in tags.split(",")]
        # Remove duplicates while preserving order
        seen = set()
        unique_tags = []
        for tag in tag_list:
            if tag and tag not in seen:
                seen.add(tag)
                unique_tags.append(tag)

        return ", ".join(unique_tags)

    @classmethod
    def normalize_batch(cls, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Normalize a batch of records"""
        return [cls.normalize_record(record) for record in records]

    @classmethod
    def calculate_statistics(cls, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate statistics from normalized records

        Returns:
            {
                'total_startups': int,
                ' industries': {...},
                'death_causes': {...},
                'stages': {...},
                'countries': {...},
                'avg_lifespan': float,
                'avg_funding': float,
                'date_range': {...}
            }
        """
        if not records:
            return {}

        industries = defaultdict(int)
        death_causes = defaultdict(int)
        stages = defaultdict(int)
        countries = defaultdict(int)
        lifespans = []
        fundings = []
        founded_years = []
        closed_years = []

        # Ensure required industry keys always present
        required_industries = ["real_estate", "healthcare", "fintech"]
        for ind in required_industries:
            industries[ind]  # Initialize to 0

        for record in records:
            # Count industries
            industry = record.get("industry")
            if industry:
                norm_industry = cls._normalize_industry(industry)
                industries[norm_industry] += 1

            # Count death causes
            death_cause = record.get("death_cause")
            if death_cause:
                death_causes[death_cause] += 1

            # Count stages
            stage = record.get("stage_at_death")
            if stage:
                stages[stage] += 1

            # Count countries
            country = record.get("country")
            if country:
                countries[country] += 1

            # Collect lifespans
            if record.get("lifespan_days"):
                lifespans.append(record["lifespan_days"])

            # Collect fundings
            if record.get("total_funding_usd"):
                fundings.append(record["total_funding_usd"])

            # Collect years
            if record.get("founded_date"):
                if hasattr(record["founded_date"], "year"):
                    founded_years.append(record["founded_date"].year)

            if record.get("closed_date"):
                if hasattr(record["closed_date"], "year"):
                    closed_years.append(record["closed_date"].year)

        # Sort by count
        industries = dict(sorted(industries.items(), key=lambda x: x[1], reverse=True))
        death_causes = dict(
            sorted(death_causes.items(), key=lambda x: x[1], reverse=True)
        )
        stages = dict(sorted(stages.items(), key=lambda x: x[1], reverse=True))
        countries = dict(sorted(countries.items(), key=lambda x: x[1], reverse=True))

        return {
            "total_startups": len(records),
            "industries": industries,
            "death_causes": death_causes,
            "stages": stages,
            "countries": countries,
            "avg_lifespan": round(sum(lifespans) / len(lifespans), 2)
            if lifespans
            else 0,
            "avg_funding": round(sum(fundings) / len(fundings), 2) if fundings else 0,
            "median_lifespan": cls._median(lifespans) if lifespans else 0,
            "median_funding": cls._median(fundings) if fundings else 0,
            "date_range": {
                "earliest_founded": min(founded_years) if founded_years else None,
                "latest_founded": max(founded_years) if founded_years else None,
                "earliest_closed": min(closed_years) if closed_years else None,
                "latest_closed": max(closed_years) if closed_years else None,
            },
            "top_industries": list(industries.keys())[:10],
            "top_death_causes": list(death_causes.keys())[:5],
        }

    @staticmethod
    def _median(values: List[float]) -> float:
        """Calculate median of a list"""
        if not values:
            return 0

        sorted_values = sorted(values)
        n = len(sorted_values)

        if n % 2 == 0:
            return (sorted_values[n // 2 - 1] + sorted_values[n // 2]) / 2
        else:
            return sorted_values[n // 2]
