import { useState, useEffect } from 'react'
import api from '../services/api'

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/users/', { params })
      setUsers(response.data)
      return response.data
    } catch (err) {
      setError('Failed to fetch users')
      console.error(err)
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchUserById = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (err) {
      setError('Failed to fetch user details')
      console.error(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchUserById,
  }
}