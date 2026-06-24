import { useState, useEffect } from 'react'
import api from '../services/api'

export function useStartups() {
  const [startups, setStartups] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchStartups = async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/startups/', { params })
      setStartups(response.data)
      return response.data
    } catch (err) {
      setError('Failed to fetch startups')
      console.error(err)
      return []
    } finally {
      setLoading(false)
    }
  }

  const fetchStartupById = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/startups/${id}`)
      return response.data
    } catch (err) {
      setError('Failed to fetch startup details')
      console.error(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    startups,
    loading,
    error,
    fetchStartups,
    fetchStartupById,
  }
}