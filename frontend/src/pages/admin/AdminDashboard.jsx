import { useAdminStats } from "../../hooks/useAdmin"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Users, Building2, FlaskConical, TrendingUp, UserPlus, BarChart3 } from "lucide-react"

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useAdminStats()

  const statCards = [
    {
      title: "Total Users",
      value: stats?.total_users ?? 0,
      subtitle: `${stats?.new_users_today ?? 0} new today`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Active Users",
      value: stats?.active_users ?? 0,
      subtitle: "Currently active",
      icon: UserPlus,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Total Startups",
      value: stats?.total_startups ?? 0,
      subtitle: "In database",
      icon: Building2,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Analyses",
      value: stats?.total_analyses ?? 0,
      subtitle: `${stats?.analyses_today ?? 0} today`,
      icon: FlaskConical,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Avg Risk Score",
      value: stats?.avg_risk_score?.toFixed(1) ?? "0.0",
      subtitle: "Out of 100",
      icon: TrendingUp,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Growth Rate",
      value: `${stats?.growth_rate ?? 0}%`,
      subtitle: "Daily engagement",
      icon: BarChart3,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ]

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">Failed to load dashboard stats</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? "..." : stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <Users className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-500">View, edit, or remove users</p>
            </a>
            <a
              href="/admin/startups"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <Building2 className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Manage Startups</h3>
              <p className="text-sm text-gray-500">Review and manage startup data</p>
            </a>
            <a
              href="/admin/import"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <FlaskConical className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Import Data</h3>
              <p className="text-sm text-gray-500">Upload CSV files</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}