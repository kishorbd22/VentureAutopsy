"""
Tests for RiskScoringService
"""


from app.services.risk_scoring_service import RiskScoringService


class TestRiskScoringService:
    """Test suite for RiskScoringService"""

    def test_score_features_death_cause(self):
        """Test death cause weights in scoring"""
        features = {"death_cause_risk": {"value": 30, "source": "death_cause_weights"}}
        score, level, breakdown = RiskScoringService.score_features(features)
        assert score == 30
        assert level == "Medium"
        assert breakdown["death_cause_risk"]["source"] == "death_cause_weights"

    def test_score_features_funding(self):
        """Test funding weights in scoring"""
        features = {"funding_risk": {"value": 20, "source": "funding_risk_low"}}
        score, level, breakdown = RiskScoringService.score_features(features)
        assert score == 20
        assert level == "Low"

    def test_score_features_stage(self):
        """Test stage weights in scoring"""
        features = {"stage_risk": {"value": 20, "source": "stage_risk_late"}}
        score, level, breakdown = RiskScoringService.score_features(features)
        assert score == 20
        assert level == "Low"

    def test_score_features_employee(self):
        """Test employee weights in scoring"""
        features = {"employee_risk": {"value": 10, "source": "employee_risk_small"}}
        score, level, breakdown = RiskScoringService.score_features(features)
        assert score == 10
        assert level == "Low"

    def test_score_features_combined(self):
        """Test combining multiple features"""
        features = {
            "death_cause_risk": {"value": 30, "source": "death_cause_weights"},
            "funding_risk": {"value": 20, "source": "funding_risk_low"},
            "stage_risk": {"value": 20, "source": "stage_risk_late"},
            "employee_risk": {"value": 10, "source": "employee_risk_small"},
            "industry_risk": {"value": 20, "source": "industry_risk_technology"},
        }
        score, level, breakdown = RiskScoringService.score_features(features)
        assert score == 100
        assert level == "Critical"
        assert breakdown["industry_risk"]["source"] == "industry_risk_technology"

    def test_score_features_capped_at_100(self):
        """Test score is capped at 100"""
        features = {
            "death_cause_risk": {"value": 30, "source": "death_cause_weights"},
            "funding_risk": {"value": 20, "source": "funding_risk_low"},
            "stage_risk": {"value": 20, "source": "stage_risk_late"},
            "employee_risk": {"value": 10, "source": "employee_risk_small"},
            "industry_risk": {"value": 25, "source": "industry_risk_default"},
        }
        score, level, breakdown = RiskScoringService.score_features(features)
        assert score == 100
        assert level == "Critical"

    def test_score_features_risk_levels(self):
        """Test risk level thresholds"""
        # Low: 0-20
        score, level, breakdown = RiskScoringService.score_features(
            {"death_cause_risk": {"value": 20, "source": "death_cause_weights"}}
        )
        assert level == "Low"

        # Medium: 21-40
        score, level, breakdown = RiskScoringService.score_features(
            {"death_cause_risk": {"value": 25, "source": "death_cause_weights"}}
        )
        assert level == "Medium"

        # High: 41-69
        score, level, breakdown = RiskScoringService.score_features(
            {
                "death_cause_risk": {"value": 30, "source": "death_cause_weights"},
                "funding_risk": {"value": 20, "source": "funding_risk_low"},
            }
        )
        assert level == "High"

        # Critical: 70+
        score, level, breakdown = RiskScoringService.score_features(
            {
                "death_cause_risk": {"value": 30, "source": "death_cause_weights"},
                "funding_risk": {"value": 20, "source": "funding_risk_low"},
                "stage_risk": {"value": 20, "source": "stage_risk_late"},
            }
        )
        assert level == "Critical"

    def test_score_features_empty(self):
        """Test with no features"""
        score, level, breakdown = RiskScoringService.score_features({})
        assert score == 0
        assert level == "Low"

    def test_score_features_deterministic(self):
        """Test scoring is deterministic"""
        features = {
            "death_cause_risk": {"value": 25, "source": "death_cause_weights"},
            "funding_risk": {"value": 10, "source": "funding_risk_medium"},
        }
        score1, level1, _ = RiskScoringService.score_features(features)
        score2, level2, _ = RiskScoringService.score_features(features)
        assert score1 == score2
        assert level1 == level2

    def test_delegates_to_feature_extractor(self):
        """Test that helper methods delegate to FeatureExtractor"""
        assert RiskScoringService._get_death_cause_weight("Fraud")["value"] == 30
        assert RiskScoringService._get_financial_risk_weight(50000)["value"] == 20
        assert RiskScoringService._get_stage_risk_weight("Series C")["value"] == 20
        assert RiskScoringService._get_employee_risk_weight(30)["value"] == 10
