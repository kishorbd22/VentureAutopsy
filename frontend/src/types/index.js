/**
 * Shared type definitions for the Venture Autopsy frontend
 * These serve as documentation and data contracts for the application
 */

/**
 * @typedef {Object} Startup
 * @property {number} id
 * @property {string} name
 * @property {string} industry
 * @property {string} business_model
 * @property {string} founded_year
 * @property {string} country
 * @property {string} funding_stage
 * @property {number} total_funding
 * @property {string} failure_reason
 * @property {string} failure_stage
 * @property {string} founded_date
 * @property {string} failed_date
 * @property {number} [risk_score]
 * @property {string} [status]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} StartupDetail
 * @property {number} id
 * @property {string} name
 * @property {string} industry
 * @property {string} business_model
 * @property {string} founded_year
 * @property {string} country
 * @property {string} funding_stage
 * @property {number} total_funding
 * @property {string} failure_reason
 * @property {string} failure_stage
 * @property {Object} analysis
 * @property {number} analysis.risk_score
 * @property {Object} analysis.breakdown
 * @property {Array<import('./index').FailureFactor>} analysis.breakdown.factors
 * @property {Object} analysis.timeline
 * @property {Array} analysis.similar_startups
 * @property {Array} analysis.financial_metrics
 */

/**
 * @typedef {Object} FailureFactor
 * @property {string} name
 * @property {number} weight
 * @property {string} description
 * @property {'low' | 'medium' | 'high'} severity
 * @property {string} category
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {string} name
 * @property {string} role
 * @property {boolean} is_active
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} AnalysisInput
 * @property {string} startup_name
 * @property {string} industry
 * @property {string} business_model
 * @property {string} founded_year
 * @property {string} country
 * @property {string} funding_stage
 * @property {number} total_funding
 * @property {string} [team_size]
 * @property {string} [revenue_model]
 */

/**
 * @typedef {Object} AnalysisResult
 * @property {number} risk_score
 * @property {string} risk_level
 * @property {Object} breakdown
 * @property {Array<FailureFactor>} breakdown.factors
 * @property {Object} timeline
 * @property {Array} similar_startups
 * @property {Array} [recommendations]
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} [message]
 * @property {*} [data]
 * @property {Object} [error]
 * @property {string} [error.code]
 * @property {string} [error.detail]
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Array} items
 * @property {number} total
 * @property {number} page
 * @property {number} size
 * @property {number} pages
 */

/**
 * @typedef {'low' | 'medium' | 'high' | 'critical'} RiskLevel
 */

/**
 * @typedef {'market' | 'financial' | 'team' | 'product' | 'operations' | 'external'} FactorCategory
 */

export default {};