import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Startups() {
  const [startups, setStartups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStartups()
  }, [])

  const fetchStartups = async () => {
    try {
      setLoading(true)
      const response = await api.get('/startups/')
      setStartups(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch startups')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading startups...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Startups</h1>
        <p className="text-gray-600">{startups.length} startups found</p>
      </div>

      {startups.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🏚️</div>
          <h2 className="text-2xl font-semibold mb-2">No startups yet</h2>
          <p className="text-gray-600">No ventures in the database yet. Start analyzing to build your intelligence.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <Link
              key={startup.id}
              to={`/startups/${startup.id}`}
              className="card hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-xl font-semibold mb-2">{startup.name}</h3>
              <p className="text-gray-600 mb-4">{startup.industry}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Founded: {startup.founded_date ? new Date(startup.founded_date).getFullYear() : 'N/A'}</span>
                <span className="text-primary-600 font-medium">View Details →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}