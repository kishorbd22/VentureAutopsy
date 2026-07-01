import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Calendar, DollarSign, Users, MapPin, Skull, ArrowLeft } from 'lucide-react'
import api from '../services/api'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

export default function StartupDetail() {
  const { id } = useParams()
  const [startup, setStartup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStartup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-dark-700 border-t-accent-500"></div>
          <p className="mt-4 text-surface-400">Loading startup details...</p>
        </div>
      </div>
    )
  }

  if (error || !startup) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-danger-400">{error || 'Startup not found'}</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/startups" className="inline-flex items-center gap-2 text-surface-400 hover:text-accent-400 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Startups
        </Link>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mt-2">
          <div>
            <h1 className="page-title flex items-center gap-3">
              <Building2 className="h-8 w-8 text-accent-400" />
              {startup.name}
            </h1>
            <p className="page-description">{startup.industry || 'Uncategorized'}</p>
          </div>
          <div className="flex gap-2">
            {startup.verified && (
              <Badge variant="success" className="gap-1.5">
                ✓ Verified
              </Badge>
            )}
            {startup.featured && (
              <Badge variant="warning" className="gap-1.5">
                ⭐ Featured
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="pt-6">
            {startup.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">Description</h2>
                <p className="text-surface-300">{startup.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                  <Calendar className="h-5 w-5 text-accent-400" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-400">Founded</span>
                    <span className="font-medium text-surface-200">
                      {startup.founded_date ? new Date(startup.founded_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-400">Closed</span>
                    <span className="font-medium text-surface-200">
                      {startup.closed_date ? new Date(startup.closed_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-400">Lifespan</span>
                    <span className="font-medium text-surface-200">
                      {startup.lifespan_days ? `${startup.lifespan_days} days` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                  <DollarSign className="h-5 w-5 text-success-400" />
                  Financial
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-400">Total Funding</span>
                    <span className="font-medium text-surface-200">
                      {startup.total_funding_usd ? `$${startup.total_funding_usd.toLocaleString()}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-400">Funding Rounds</span>
                    <span className="font-medium text-surface-200">{startup.funding_rounds || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-400">Employees</span>
                    <span className="font-medium text-surface-200">{startup.number_of_employees || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                  <MapPin className="h-5 w-5 text-warning-400" />
                  Location
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-400">City</span>
                    <span className="font-medium text-surface-200">{startup.city || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-400">State</span>
                    <span className="font-medium text-surface-200">{startup.state_province || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-400">Country</span>
                    <span className="font-medium text-surface-200">{startup.country || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
                  <Skull className="h-5 w-5 text-danger-400" />
                  Death Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-400">Cause</span>
                    <span className="font-medium text-surface-200">{startup.death_cause || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-surface-400">Stage at Death</span>
                    <span className="font-medium text-surface-200">{startup.stage_at_death || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {startup.tags && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(startup.tags).map((tag, index) => (
                    <span key={index} className="bg-dark-700/50 text-surface-300 px-3 py-1 rounded-full text-sm border border-dark-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
