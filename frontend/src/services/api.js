import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      const errorMessage = data?.detail || data?.message || error.message

      switch (status) {
        case 401:
          localStorage.removeItem('token')
          console.error('Unauthorized - please login')
          break
        case 403:
          console.error('Forbidden - insufficient permissions')
          break
        case 404:
          console.error('Resource not found')
          break
        case 422:
          console.error('Validation error:', data?.detail)
          break
        case 429:
          console.error('Rate limit exceeded')
          break
        case 500:
          console.error('Server error')
          break
        default:
          console.error(`Error ${status}:`, data)
      }

      // Enhance error object with server message
      error.friendlyMessage = errorMessage
      error.statusCode = status
    } else if (error.request) {
      error.friendlyMessage = 'Network error - no response received'
      console.error(error.friendlyMessage)
    } else {
      error.friendlyMessage = error.message
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  }
)

// ─── Startup endpoints ───────────────────────────────────────────

/**
 * Fetch all startups with optional filtering
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>}
 */
export const fetchStartups = (params = {}) =>
  api.get('/startups/', { params }).then((res) => res.data)

/**
 * Fetch a single startup by ID
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export const fetchStartupById = (id) =>
  api.get(`/startups/${id}`).then((res) => res.data)

// ─── User endpoints ──────────────────────────────────────────────

/**
 * Fetch all users with optional filtering
 * @param {Object} params
 * @returns {Promise<Array>}
 */
export const fetchUsers = (params = {}) =>
  api.get('/users/', { params }).then((res) => res.data)

/**
 * Fetch user by ID
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export const fetchUserById = (id) =>
  api.get(`/users/${id}`).then((res) => res.data)

// ─── Analysis endpoints ──────────────────────────────────────────

/**
 * Analyze a startup
 * POST /analysis/analyze
 * @param {Object} data - Analysis input data
 * @param {string} data.industry - Industry sector (required)
 * @param {string} [data.name] - Startup name
 * @param {string} [data.sub_industry] - Sub-industry
 * @param {string} [data.country] - Country
 * @param {number} [data.total_funding_usd] - Total funding in USD
 * @param {number} [data.number_of_employees] - Number of employees
 * @param {string} [data.death_cause] - Reason for failure
 * @param {string} [data.death_cause_details] - Details about failure reason
 * @param {string} [data.stage_at_death] - Funding stage at failure
 * @param {number} [data.lifespan_days] - Days until closure
 * @returns {Promise<{success: boolean, data: Object, meta: Object}>}
 */
export const analyzeStartup = (data) =>
  api.post('/analysis/analyze', data).then((res) => res.data)

/**
 * Fetch list of all industries
 * GET /analysis/industries
 * @returns {Promise<{success: boolean, data: string[], error: string|null}>}
 */
export const fetchIndustries = () =>
  api.get('/analysis/industries').then((res) => res.data)

/**
 * Fetch list of all death causes
 * GET /analysis/death-causes
 * @returns {Promise<{success: boolean, data: string[], error: string|null}>}
 */
export const fetchDeathCauses = () =>
  api.get('/analysis/death-causes').then((res) => res.data)

// ─── Analytics endpoints ─────────────────────────────────────────

/**
 * Get analytics summary including total analyses, users, popular industries, etc.
 * GET /analytics/summary
 * @returns {Promise<{total_analyses: number, total_users: number, popular_industries: Array, average_score: number, daily_users: number, daily_analyses: number}>}
 */
export const getAnalyticsSummary = () =>
  api.get('/analytics/summary').then((res) => res.data)

/**
 * Get daily analytics data for past N days
 * GET /analytics/daily?days=30
 * @param {number} days - Number of days to fetch (1-365)
 * @returns {Promise<Array<{date: string, analyses: number, users: number, avg_score: number}>>}
 */
export const getDailyAnalytics = (days = 30) =>
  api.get(`/analytics/daily?days=${days}`).then((res) => res.data)

/**
 * Get industry statistics
 * GET /analytics/industries
 * @returns {Promise<Array<{industry: string, count: number, avg_risk_score: number, avg_lifespan: number|null, avg_funding: number|null}>>}
 */
export const getIndustryStats = () =>
  api.get('/analytics/industries').then((res) => res.data)

// ─── AI endpoints ─────────────────────────────────────────────────

/**
 * Generate comprehensive AI report for an analysis
 * GET /ai/report/{analysisId}
 * @param {number} analysisId
 * @returns {Promise<{success: boolean, data: Object, error: string|null}>}
 */
export const generateAIReport = (analysisId) =>
  api.get(`/ai/report/${analysisId}`).then((res) => res.data)

/**
 * Chat with AI about an analysis
 * POST /ai/chat/{analysisId}
 * @param {number} analysisId
 * @param {{message: string, conversation_history?: Array<{role: string, content: string}>}} payload
 * @returns {Promise<{success: boolean, data: Object, error: string|null}>}
 */
export const chatWithAnalysis = (analysisId, payload) =>
  api.post(`/ai/chat/${analysisId}`, payload).then((res) => res.data)

/**
 * Simulate a what-if scenario
 * POST /ai/simulate/{analysisId}
 * @param {number} analysisId
 * @param {{scenario_type: string, params: Object}} payload
 * @returns {Promise<{success: boolean, data: Object, error: string|null}>}
 */
export const simulateScenario = (analysisId, payload) =>
  api.post(`/ai/simulate/${analysisId}`, payload).then((res) => res.data)

/**
 * Get AI-generated suggestions for an analysis
 * GET /ai/suggestions/{analysisId}
 * @param {number} analysisId
 * @returns {Promise<{success: boolean, data: Object, error: string|null}>}
 */
export const getAISuggestions = (analysisId) =>
  api.get(`/ai/suggestions/${analysisId}`).then((res) => res.data)

// ─── Admin endpoints ──────────────────────────────────────────────

/**
 * Get admin dashboard stats
 * GET /admin/dashboard/stats
 * @returns {Promise<{success: boolean, data: Object, error: string|null}>}
 */
export const getAdminStats = () =>
  api.get('/admin/dashboard/stats').then((res) => res.data)

/**
 * Get paginated users list with search
 * GET /admin/users?page=1&page_size=20&search=...
 * @param {Object} params
 * @returns {Promise<{success: boolean, data: Object, error: string|null}>}
 */
export const getAdminUsers = (params = {}) =>
  api.get('/admin/users', { params }).then((res) => res.data)

/**
 * Delete a user
 * DELETE /admin/users/{userId}
 * @param {number} userId
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deleteAdminUser = (userId) =>
  api.delete(`/admin/users/${userId}`).then((res) => res.data)

/**
 * Update user admin role
 * PUT /admin/users/{userId}/role?is_admin=true
 * @param {number} userId
 * @param {boolean} isAdmin
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const updateUserRole = (userId, isAdmin) =>
  api.put(`/admin/users/${userId}/role`, null, { params: { is_admin: isAdmin } }).then((res) => res.data)

/**
 * Get paginated startups list with search
 * GET /admin/startups?page=1&page_size=20&search=...&industry=...
 * @param {Object} params
 * @returns {Promise<{success: boolean, data: Object, error: string|null}>}
 */
export const getAdminStartups = (params = {}) =>
  api.get('/admin/startups', { params }).then((res) => res.data)

/**
 * Delete a startup
 * DELETE /admin/startups/{startupId}
 * @param {number} startupId
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deleteAdminStartup = (startupId) =>
  api.delete(`/admin/startups/${startupId}`).then((res) => res.data)

/**
 * Import CSV file
 * POST /admin/import/csv
 * @param {File} file
 * @returns {Promise<{success: boolean, data: Object, message: string}>}
 */
export const importCSV = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/admin/import/csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data)
}

/**
 * Get sample CSV template
 * GET /admin/import/sample-template
 * @returns {Promise<{success: boolean, data: string, filename: string}>}
 */
export const getSampleTemplate = () =>
  api.get('/admin/import/sample-template').then((res) => res.data)

export default api
