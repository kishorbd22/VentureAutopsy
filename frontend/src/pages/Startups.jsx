import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Search, ArrowRight } from 'lucide-react'
import api from '../services/api'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-dark-700 border-t-accent-500"></div>
          <p className="mt-4 text-surface-400">Loading startups...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-danger-400">{error}</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Building2 className="h-8 w-8 text-accent-400" />
            Startups
          </h1>
          <p className="page-description">{startups.length} startups in database</p>
        </div>
        <Link to="/analyze">
          <Button className="btn-premium">
            <Search className="h-4 w-4 mr-2" />
            Analyze New
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {startups.map((startup, index) => (
          <motion.div
            key={startup.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link to={`/startups/${startup.id}`}>
              <Card className="card-premium h-full hover:border-accent-500/30 transition-all duration-300 cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-accent-300 transition-colors">
                          {startup.name}
                        </h3>
                        <p className="text-xs text-surface-500">{startup.industry || 'Uncategorized'}</p>
                      </div>
                    </div>
                  </div>

                  {startup.description && (
                    <p className="mt-3 text-sm text-surface-400 line-clamp-2">
                      {startup.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {startup.stage || 'Unknown Stage'}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-surface-500 group-hover:text-accent-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {startups.length === 0 && (
        <div className="card text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No startups yet</h2>
          <p className="text-gray-600">No ventures in the database yet. Start analyzing to build your intelligence.</p>
        </div>
      )}
    </motion.div>
  )
}