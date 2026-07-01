import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import api from '../services/api'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post('/auth/login', data)
      return response.data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token)
      window.location.href = '/'
    },
    onError: (error) => {
      setError(error.friendlyMessage || 'Login failed')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    loginMutation.mutate(formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to your Venture Autopsy account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don{'\u2019'}t have an account?{' '}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          © 2024 Venture Autopsy. All rights reserved.
        </p>
      </div>
    </div>
  )
}