import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function AnalyzeStartup() {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    sub_industry: '',
    country: '',
    total_funding_usd: '',
    number_of_employees: '',
    death_cause: '',
    death_cause_details: '',
    stage_at_death: '',
    lifespan_days: ''
  })
  
  const [industries, setIndustries] = useState([])
  const [deathCauses, setDeathCauses] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)

  // Load dropdown data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [industriesRes, causesRes] = await Promise.all([
          api.get('/analysis/industries'),
          api.get('/analysis/death-causes')
        ])
        setIndustries(industriesRes.data.data)
        setDeathCauses(causesRes.data.data)
      } catch (err) {
        console.error('Failed to load form data:', err)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAnalysisResult(null)

    try {
      // Prepare data - convert numeric fields
      const requestData = {
        ...formData,
        total_funding_usd: formData.total_funding_usd ? parseFloat(formData.total_funding_usd) : undefined,
        number_of_employees: formData.number_of_employees ? parseInt(formData.number_of_employees) : undefined,
        lifespan_days: formData.lifespan_days ? parseInt(formData.lifespan_days) : undefined
      }

      const response = await api.post('/analysis/analyze', requestData)
      setAnalysisResult(response.data.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze startup. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical': return 'text-red-600 bg-red-100 border-red-200'
      case 'High': return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'Low': return 'text-green-600 bg-green-100 border-green-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Startup Analysis</h1>
        <p className="text-gray-600">
          Analyze your startup's risk profile based on historical data from failed startups.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-6">Startup Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Startup Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Acme Inc"
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Industry <span className="text-red-500">*</span>
              </label>
              <select
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select Industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sub_industry" className="block text-sm font-medium text-gray-700 mb-1">
                Sub-Industry (Optional)
              </label>
              <input
                type="text"
                id="sub_industry"
                name="sub_industry"
                value={formData.sub_industry}
                onChange={handleChange}
                className="input"
                placeholder="e.g., SaaS, FinTech"
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country (Optional)
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="input"
                placeholder="e.g., USA"
              />
            </div>

            <div>
              <label htmlFor="stage_at_death" className="block text-sm font-medium text-gray-700 mb-1">
                Stage at Risk
              </label>
              <select
                id="stage_at_death"
                name="stage_at_death"
                value={formData.stage_at_death}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Stage</option>
                <option value="Pre-Seed">Pre-Seed</option>
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Series C">Series C</option>
                <option value="Series D">Series D</option>
                <option value="Series E">Series E+</option>
              </select>
            </div>

            <div>
              <label htmlFor="death_cause" className="block text-sm font-medium text-gray-700 mb-1">
                Primary Risk Factor
              </label>
              <select
                id="death_cause"
                name="death_cause"
                value={formData.death_cause}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Risk Factor</option>
                {deathCauses.map(cause => (
                  <option key={cause} value={cause}>{cause}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="total_funding_usd" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Funding ($)
                </label>
                <input
                  type="number"
                  id="total_funding_usd"
                  name="total_funding_usd"
                  value={formData.total_funding_usd}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., 1000000"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="number_of_employees" className="block text-sm font-medium text-gray-700 mb-1">
                  Employees
                </label>
                <input
                  type="number"
                  id="number_of_employees"
                  name="number_of_employees"
                  value={formData.number_of_employees}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., 50"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lifespan_days" className="block text-sm font-medium text-gray-700 mb-1">
                Days in Business
              </label>
              <input
                type="number"
                id="lifespan_days"
                name="lifespan_days"
                value={formData.lifespan_days}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 730 (2 years)"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="death_cause_details" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Context (Optional)
              </label>
              <textarea
                id="death_cause_details"
                name="death_cause_details"
                value={formData.death_cause_details}
                onChange={handleChange}
                className="input"
                rows="3"
                placeholder="Provide any additional context about your startup..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.industry}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Startup'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {analysisResult && (
            <>
              {/* Risk Score Card */}
              <div className="card">
                <h2 className="text-2xl font-semibold mb-4">Risk Assessment</h2>
                
                <div className={`rounded-lg border-2 p-6 mb-6 ${getRiskColor(analysisResult.risk_level)}`}>
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">
                      {analysisResult.risk_score}
                    </div>
                    <div className="text-xl font-semibold">
                      Risk Score: {analysisResult.risk_level}
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {analysisResult.risk_factors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Risk Factors</h3>
                    <div className="space-y-3">
                      {analysisResult.risk_factors.map((factor, index) => (
                        <div key={index} className="border-l-4 border-gray-200 bg-gray-50 p-4 rounded">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(factor.severity)}`}></div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-gray-900">{factor.factor}</h4>
                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                  {factor.weight} pts
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{factor.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Insights Card */}
              {analysisResult.insights.length > 0 && (
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">💡 Insights</h3>
                  <ul className="space-y-2">
                    {analysisResult.insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-primary-600 mt-1">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations Card */}
              {analysisResult.recommendations.length > 0 && (
                <div className="card bg-blue-50 border border-blue-200">
                  <h3 className="text-xl font-semibold mb-4 text-blue-900">📋 Recommendations</h3>
                  <ul className="space-y-3">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3 text-blue-800">
                        <span className="text-blue-600 mt-1">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Similar Startups Card */}
              {analysisResult.similar_startups.length > 0 && (
                <div className="card">
                  <h3 className="text-xl font-semibold mb-4">🔍 Similar Failed Startups</h3>
                  <div className="space-y-4">
                    {analysisResult.similar_startups.map((startup, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{startup.name}</h4>
                            <p className="text-sm text-gray-600">{startup.industry}</p>
                          </div>
                          <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                            {startup.similarity_score} matches
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>• <span className="font-medium">Cause:</span> {startup.death_cause}</p>
                          <p>• <span className="font-medium">Lifespan:</span> {startup.lifespan_days} days</p>
                          <p>• <span className="font-medium">Funding:</span> ${(startup.total_funding_usd / 1000000).toFixed(1)}M</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!analysisResult && !error && (
            <div className="card bg-gray-50 border-2 border-dashed border-gray-300">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">No Analysis Yet</h3>
                <p className="text-gray-600">
                  Fill in your startup details and click "Analyze Startup" to see results here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}