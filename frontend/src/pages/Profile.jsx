import { useState, useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { User, Save, Shield, Activity } from "lucide-react"
import api from "../services/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

export default function Profile() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    full_name: "",
  })

  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await api.get("/auth/me")
      return response.data
    },
  })

  useEffect(() => {
    if (user?.data) {
      setFormData({
        name: user.data.name || "",
        email: user.data.email || "",
        username: user.data.username || "",
        full_name: user.data.full_name || "",
      })
    }
  }, [user])

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put("/auth/me", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["currentUser"])
      alert("Profile updated successfully")
    },
    onError: (error) => {
      alert(error.friendlyMessage || "Failed to update profile")
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-dark-700 border-t-accent-500"></div>
          <p className="mt-4 text-surface-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <User className="h-8 w-8 text-accent-400" />
            Profile Settings
          </h1>
          <p className="text-surface-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent-400" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-premium flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {formData.name?.charAt(0)?.toUpperCase() || formData.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">
                    {formData.name || formData.username || "User"}
                  </h3>
                  <p className="text-xs text-surface-500">{formData.email}</p>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-surface-300">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                  className="input-premium"
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-surface-300">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="johndoe"
                  className="input-premium"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-surface-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-premium"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="gap-2"
                >
                  {updateMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success-400" />
              Security & Privacy
            </CardTitle>
            <CardDescription>
              Manage your security preferences and account protection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700/50">
              <div>
                <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                <p className="text-xs text-surface-500">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Shield className="h-4 w-4" />
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50 border border-dark-700/50">
              <div>
                <p className="text-sm font-medium text-white">Change Password</p>
                <p className="text-xs text-surface-500">Update your account password</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-danger-500/20 bg-danger-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger-400">
              <Activity className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-xl bg-danger-500/10 border border-danger-500/20">
              <div>
                <p className="text-sm font-medium text-white">Delete Account</p>
                <p className="text-xs text-surface-500">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}