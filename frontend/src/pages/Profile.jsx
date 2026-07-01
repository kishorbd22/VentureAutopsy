import { useQuery } from '@tanstack/react-query'
import { User, LogOut } from 'lucide-react'
import api from '../services/api'

export default function Profile() {
  const { data: profile, isLoading, error: profileError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/auth/me')
      return response.data
    },
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (profileError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Failed to load profile. Please try again.</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">User Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 border-b">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={48} className="text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {profile?.full_name || profile?.username}
              </h2>
              <p className="text-muted-foreground">@{profile?.username}</p>
              <div className="flex gap-2 mt-3">
                {profile?.is_admin && (
                  <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                    Admin
                  </span>
                )}
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    profile?.is_verified
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}
                >
                  {profile?.is_verified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Account Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Email</label>
                  <p className="text-foreground font-medium">{profile?.email}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Username</label>
                  <p className="text-foreground font-medium">@{profile?.username}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Status</label>
                  <p className="text-foreground font-medium">
                    {profile?.is_active ? (
                      <span className="text-green-600 dark:text-green-400">Active</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">Inactive</span>
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Member Since</label>
                  <p className="text-foreground font-medium">
                    {formatDate(profile?.created_at)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Last Login</label>
                  <p className="text-foreground font-medium">
                    {formatDate(profile?.last_login)}
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile?.bio && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Bio</h3>
                <p className="text-foreground bg-background p-4 rounded-md border">
                  {profile.bio}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t flex justify-between">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}