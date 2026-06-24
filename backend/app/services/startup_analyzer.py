"""
Startup Analyzer Service
Provides analysis functionality for startup risk assessment
"""

import csv
import os
from datetime import datetime
from typing import List, Dict, Any
from collections import Counter
import math


class StartupAnalyzer:
    """Analyzes startups and provides risk assessment"""
    
    def __init__(self):
        self.failed_startups = self._load_failed_startups()
    
    def _load_failed_startups(self) -> List[Dict[str, Any]]:
        """Load failed startups data from CSV"""
        csv_path = os.path.join(os.path.dirname(__file__), '../../data/failed_startups.csv')
        
        startups = []
        try:
            with open(csv_path, 'r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # Convert numeric fields
                    if row.get('lifespan_days'):
                        row['lifespan_days'] = int(row['lifespan_days'])
                    if row.get('total_funding_usd'):
                        row['total_funding_usd'] = float(row['total_funding_usd'])
                    if row.get('funding_rounds'):
                        row['funding_rounds'] = int(row['funding_rounds'])
                    if row.get('number_of_employees'):
                        row['number_of_employees'] = int(row['number_of_employees'])
                    
                    # Parse tags
                    if row.get('tags'):
                        row['tags'] = [tag.strip() for tag in row['tags'].split(',')]
                    
                    startups.append(row)
        except Exception as e:
            print(f"Warning: Could not load CSV file: {e}")
        
        return startups
    
    def find_similar_startups(self, startup_data: Dict[str, Any], top_n: int = 5) -> List[Dict[str, Any]]:
        """
        Find similar failed startups based on industry and characteristics
        """
        industry = startup_data.get('industry', '').lower()
        death_cause = startup_data.get('death_cause', '').lower()
        
        similar = []
        
        for failed in self.failed_startups:
            score = 0
            
            # Industry match (highest weight)
            if failed.get('industry', '').lower() == industry:
                score += 3
            
            # Sub-industry match
            if failed.get('sub_industry', '').lower() == startup_data.get('sub_industry', '').lower():
                score += 2
            
            # Death cause match
            if failed.get('death_cause', '').lower() == death_cause:
                score += 2
            
            # Stage match
            if failed.get('stage_at_death') == startup_data.get('stage_at_death'):
                score += 1
            
            if score > 0:
                similar.append({
                    **failed,
                    'similarity_score': score
                })
        
        # Sort by similarity score and return top N
        similar.sort(key=lambda x: x['similarity_score'], reverse=True)
        return similar[:top_n]
    
    def calculate_risk_score(self, startup_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate risk score based on various factors
        Returns score (0-100) and risk factors
        """
        risk_factors = []
        risk_score = 0
        
        # Factor 1: Industry risk (based on historical failure rate)
        industry = startup_data.get('industry', '').lower()
        industry_failures = sum(1 for s in self.failed_startups 
                               if s.get('industry', '').lower() == industry)
        
        if industry_failures > 10:
            risk_score += 20
            risk_factors.append({
                'factor': 'High Industry Failure Rate',
                'description': f'{industry} has seen {industry_failures} failures in our database',
                'severity': 'high',
                'weight': 20
            })
        elif industry_failures > 5:
            risk_score += 10
            risk_factors.append({
                'factor': 'Moderate Industry Risk',
                'description': f'{industry} has moderate failure history',
                'severity': 'medium',
                'weight': 10
            })
        
        # Factor 2: Funding stage risk
        stage = startup_data.get('stage_at_death', '').lower()
        high_risk_stages = ['series c', 'series d', 'series e', 'series f', 'series g']
        if any(risk_stage in stage for risk_stage in high_risk_stages):
            risk_score += 15
            risk_factors.append({
                'factor': 'Late Stage Risk',
                'description': 'Many late-stage startups still fail despite significant funding',
                'severity': 'high',
                'weight': 15
            })
        
        # Factor 3: Cash runway estimation
        total_funding = startup_data.get('total_funding_usd', 0)
        employees = startup_data.get('number_of_employees', 10)
        
        if total_funding > 0 and employees > 0:
            # Estimate burn rate: $15k per employee per month
            estimated_burn_rate = employees * 15000
            runway_months = (total_funding / estimated_burn_rate) if estimated_burn_rate > 0 else 0
            
            if runway_months < 12:
                risk_score += 25
                risk_factors.append({
                    'factor': 'Low Cash Runway',
                    'description': f'Estimated runway: {runway_months:.1f} months (< 1 year)',
                    'severity': 'critical',
                    'weight': 25
                })
            elif runway_months < 18:
                risk_score += 15
                risk_factors.append({
                    'factor': 'Concerning Cash Runway',
                    'description': f'Estimated runway: {runway_months:.1f} months (< 1.5 years)',
                    'severity': 'high',
                    'weight': 15
                })
        
        # Factor 4: Common death causes
        death_cause = startup_data.get('death_cause', '').lower()
        high_risk_causes = ['fraud', 'cash flow problems', 'market fit issues']
        
        if any(cause in death_cause for cause in high_risk_causes):
            risk_score += 20
            risk_factors.append({
                'factor': 'High-Risk Death Cause',
                'description': f'Similar startups failed due to: {startup_data.get("death_cause")}',
                'severity': 'high',
                'weight': 20
            })
        
        # Factor 5: Team size efficiency
        if employees > 0 and total_funding > 0:
            funding_per_employee = total_funding / employees
            if funding_per_employee > 500000:  # Very high burn
                risk_score += 10
                risk_factors.append({
                    'factor': 'High Burn Rate',
                    'description': f'${funding_per_employee:,.0f} funding per employee suggests high burn',
                    'severity': 'medium',
                    'weight': 10
                })
        
        # Cap at 100
        risk_score = min(risk_score, 100)
        
        # Determine risk level
        if risk_score >= 70:
            risk_level = 'Critical'
        elif risk_score >= 50:
            risk_level = 'High'
        elif risk_score >= 30:
            risk_level = 'Medium'
        else:
            risk_level = 'Low'
        
        return {
            'risk_score': risk_score,
            'risk_level': risk_level,
            'risk_factors': risk_factors,
            'total_factors': len(risk_factors)
        }
    
    def analyze_startup(self, startup_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Complete startup analysis
        Returns comprehensive analysis including similar startups and risk assessment
        """
        # Find similar failed startups
        similar_startups = self.find_similar_startups(startup_data, top_n=5)
        
        # Calculate risk score
        risk_assessment = self.calculate_risk_score(startup_data)
        
        # Generate insights based on similar startups
        insights = self._generate_insights(similar_startups, startup_data)
        
        return {
            'risk_score': risk_assessment['risk_score'],
            'risk_level': risk_assessment['risk_level'],
            'risk_factors': risk_assessment['risk_factors'],
            'similar_startups': similar_startups,
            'insights': insights,
            'recommendations': self._generate_recommendations(risk_assessment, similar_startups)
        }
    
    def _generate_insights(self, similar_startups: List[Dict], current: Dict[str, Any]) -> List[str]:
        """Generate actionable insights based on similar startups"""
        insights = []
        
        if not similar_startups:
            insights.append("No directly similar failed startups found in our database.")
            return insights
        
        # Analyze common death causes
        death_causes = [s.get('death_cause', '') for s in similar_startups]
        cause_counts = Counter(death_causes)
        
        if cause_counts:
            most_common_cause = cause_counts.most_common(1)[0]
            insights.append(
                f"Most common failure reason in similar startups: {most_common_cause[0]} "
                f"({most_common_cause[1]} out of {len(similar_startups)} similar cases)"
            )
        
        # Analyze average lifespan
        lifespans = [s.get('lifespan_days', 0) for s in similar_startups if s.get('lifespan_days')]
        if lifespans:
            avg_lifespan = sum(lifespans) / len(lifespans)
            insights.append(
                f"Similar startups lasted average of {avg_lifespan:.0f} days "
                f"({avg_lifespan/365:.1f} years) before closing"
            )
        
        # Funding insights
        fundings = [s.get('total_funding_usd', 0) for s in similar_startups if s.get('total_funding_usd')]
        if fundings:
            avg_funding = sum(fundings) / len(fundings)
            insights.append(
                f"Average total funding in similar cases: ${avg_funding:,.0f}"
            )
        
        return insights
    
    def _generate_recommendations(self, risk_assessment: Dict, similar_startups: List[Dict]) -> List[str]:
        """Generate recommendations based on analysis"""
        recommendations = []
        
        # Based on risk factors
        for factor in risk_assessment.get('risk_factors', []):
            if 'Cash Flow' in factor['factor'] or 'Runway' in factor['factor']:
                recommendations.append(
                    "Focus on extending cash runway: reduce burn rate, increase revenue, or raise additional capital."
                )
            elif 'Industry' in factor['factor']:
                recommendations.append(
                    "Study successful companies in your space to understand what differentiation strategies work."
                )
            elif 'Market Fit' in factor['factor'] or 'Death Cause' in factor['factor']:
                recommendations.append(
                    "Validate product-market fit more rigorously before scaling. Consider pivoting if metrics are weak."
                )
        
        # General recommendations
        if risk_assessment['risk_score'] >= 70:
            recommendations.append(
                "⚠️  Critical risk level detected. Consider seeking mentorship and conducting thorough financial planning."
            )
        
        if not recommendations:
            recommendations.append(
                "Continue monitoring key metrics and stay adaptable to market changes."
            )
        
        return list(set(recommendations))  # Remove duplicates


# Singleton instance
analyzer = StartupAnalyzer()