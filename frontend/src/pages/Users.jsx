import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, ArrowRight } from 'lucide-react'
import api from '../services/api'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users/')
      setUsers(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch users')
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
          <p className="mt-4 text-surface-400">Loading users...</p>
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
            <Users className="h-8 w-8 text-accent-400" />
            Users
          </h1>
          <p className="page-description">{users.length} users in database</p>
        </div>
        <Button className="btn-premium">
          <Search className="h-4 w-4 mr-2" />
          Find Users
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="card-premium h-full hover:border-accent-500/30 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-premium flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{user.name || user.username || 'User'}</h3>
                    <p className="text-xs text-surface-500">{user.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {user.role || 'User'}
                  </Badge>
                  <span className="text-xs text-surface-500">
                    Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="card text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No users yet</h2>
          <p className="text-gray-600">No registered users yet.</p>
        </div>
      )}
    </motion.div>
  )
}
