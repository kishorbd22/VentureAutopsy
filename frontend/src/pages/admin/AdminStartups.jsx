import { useState } from "react"
import { useAdminStartups, useDeleteStartup } from "../../hooks/useAdmin"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
  Loader2,
  Filter,
} from "lucide-react"

export default function AdminStartups() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("")

  const { data, isLoading, error, refetch } = useAdminStartups({
    page,
    page_size: 10,
    search: debouncedSearch,
    industry: selectedIndustry || undefined,
  })
  const deleteMutation = useDeleteStartup()

  const handleSearch = (value) => {
    setSearch(value)
    setDebouncedSearch(value)
    setPage(1)
  }

  const handleDelete = async (startupId) => {
    if (!confirm("Are you sure you want to delete this startup?")) return
    await deleteMutation.mutateAsync(startupId)
    refetch()
  }

  const totalPages = data?.total_pages || 1

  // Get unique industries from data for filter
  const industries = [...new Set(data?.startups?.map((s) => s.industry).filter(Boolean))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Startups Management</h1>
        <p className="text-gray-500 mt-1">Review and manage startup database</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, description, or country..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedIndustry}
                onChange={(e) => {
                  setSelectedIndustry(e.target.value)
                  setPage(1)
                }}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md bg-white text-sm"
              >
                <option value="">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">Failed to load startups</p>
          </CardContent>
        </Card>
      )}

      {/* Startups Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            All Startups ({data?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
          ) : data?.startups?.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No startups found</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Industry</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Funding</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Employees</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Death Cause</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.startups?.map((startup) => (
                      <tr key={startup.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{startup.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{startup.name}</p>
                            {startup.sub_industry && (
                              <p className="text-xs text-gray-500">{startup.sub_industry}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{startup.industry || "N/A"}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {startup.country || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {startup.total_funding_usd
                            ? `$${(startup.total_funding_usd / 1000000).toFixed(1)}M`
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {startup.number_of_employees || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {startup.death_cause || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(startup.id)}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                  {data?.total || 0} startups
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