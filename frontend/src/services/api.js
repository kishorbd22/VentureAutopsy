import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token (for future use)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login (for future use)
          console.error('Unauthorized - please login')
          break
        case 403:
          // Forbidden
          console.error('Forbidden - insufficient permissions')
          break
        case 404:
          // Not found
          console.error('Resource not found')
          break
        case 422:
          // Validation error
          console.error('Validation error:', data.detail)
          break
        case 500:
          // Server error
          console.error('Server error')
          break
        default:
          console.error(`Error ${status}:`, data)
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error - no response received')
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default api