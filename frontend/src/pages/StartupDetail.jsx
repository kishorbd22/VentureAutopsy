import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../services/api'

export default function StartupDetail() {
  const { id } = useParams()
  const [startup, setStartup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStartup()
  }, [id])

  const fetchStartup = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/startups/${id}`)
      setStartup(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch startup details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading startup details...</div>
      </div>
    )
  }

  if (error || !startup) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error || 'Startup not found'}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/startups" className="text-primary-600 hover:text-primary-700">
        ← Back to Startups
      </Link>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{startup.name}</h1>
            <p className="text-xl text-gray-600">{startup.industry}</p>
          </div>
          <div className="flex gap-2">
            {startup.verified && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                ✓ Verified
              </span>
            )}
            {startup.featured && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                ⭐ Featured
              </span>
            )}
          </div>
        </div>

        {startup.description && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700">{startup.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Timeline</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Founded:</span>
                <span className="font-medium">
                  {startup.founded_date ? new Date(startup.founded_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Closed:</span>
                <span className="font-medium">
                  {startup.closed_date ? new Date(startup.closed_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lifespan:</span>
                <span className="font-medium">
                  {startup.lifespan_days ? `${startup.lifespan_days} days` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Financial</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Funding:</span>
                <span className="font-medium">
                  {startup.total_funding_usd ? `$${startup.total_funding_usd.toLocaleString()}` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Funding Rounds:</span>
                <span className="font-medium">{startup.funding_rounds || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Employees:</span>
                <span className="font-medium">{startup.number_of_employees || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Location</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">City:</span>
                <span className="font-medium">{startup.city || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">State:</span>
                <span className="font-medium">{startup.state_province || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Country:</span>
                <span className="font-medium">{startup.country || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Death Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Cause:</span>
                <span className="font-medium">{startup.death_cause || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stage:</span>
                <span className="font-medium">{startup.stage_at_death || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {startup.tags && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {JSON.parse(startup.tags).map((tag, index) => (
                <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}