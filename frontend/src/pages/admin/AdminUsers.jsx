import { useState } from "react"
import { useAdminUsers, useDeleteUser, useUpdateUserRole } from "../../hooks/useAdmin"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  ShieldOff,
  Loader2,
} from "lucide-react"

export default function AdminUsers() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const { data, isLoading, error, refetch } = useAdminUsers({
    page,
    page_size: 10,
    search: debouncedSearch,
  })
  const deleteMutation = useDeleteUser()
  const roleMutation = useUpdateUserRole()

  // Debounce search
  const handleSearch = (value) => {
    setSearch(value)
    setDebouncedSearch(value)
    setPage(1)
  }

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    await deleteMutation.mutateAsync(userId)
    refetch()
  }

  const handleToggleRole = async (userId, currentRole) => {
    await roleMutation.mutateAsync({ userId, isAdmin: !currentRole })
    refetch()
  }

  const totalPages = data?.total_pages || 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-500 mt-1">Manage platform users and permissions</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by email, username, or name..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">Failed to load users</p>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users ({data?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : data?.users?.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No users found</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.users?.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{user.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.full_name || user.username}
                            </p>
                            <p className="text-xs text-gray-500">@{user.username}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            <Badge variant={user.is_active ? "default" : "secondary"}>
                              {user.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {user.is_verified && (
                              <Badge variant="outline" className="text-xs">Verified</Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={user.is_admin ? "destructive" : "outline"}>
                            {user.is_admin ? "Admin" : "User"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleRole(user.id, user.is_admin)}
                              title={user.is_admin ? "Remove Admin" : "Make Admin"}
                            >
                              {user.is_admin ? (
                                <ShieldOff className="h-4 w-4 text-gray-600" />
                              ) : (
                                <Shield className="h-4 w-4 text-gray-600" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(user.id)}
                              disabled={deleteMutation.isPending}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data?.total || 0)} of{" "}
                  {data?.total || 0} users
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}