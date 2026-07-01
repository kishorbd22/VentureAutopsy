import { useDailyAnalytics, useIndustryStats } from "../../hooks/useAnalytics"
import { useAdminStats } from "../../hooks/useAdmin"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts"
import { TrendingUp, Users, FlaskConical, BarChart3 } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF6B6B"]

export default function AdminAnalytics() {
  const { data: stats } = useAdminStats()
  const { data: dailyData } = useDailyAnalytics(30)
  const { data: industryData } = useIndustryStats()

  // Prepare chart data
  const dailyChartData = dailyData?.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    analyses: day.analyses,
    users: day.users,
  })) || []

  const industryChartData = industryData?.slice(0, 8).map((ind) => ({
    name: ind.industry,
    value: ind.count,
  })) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>
        <p className="text-gray-500 mt-1">Platform performance and usage metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <FlaskConical className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_analyses || 0}</div>
            <p className="text-xs text-gray-500">{stats?.analyses_today || 0} today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            <p className="text-xs text-gray-500">{stats?.new_users_today || 0} new today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avg_risk_score?.toFixed(1) || "0.0"}</div>
            <p className="text-xs text-gray-500">Out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.growth_rate || 0}%</div>
            <p className="text-xs text-gray-500">Daily engagement</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity (Last 30 Days)</CardTitle>
          <CardDescription>Analyses and user activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="analyses" stroke="#8884d8" name="Analyses" strokeWidth={2} />
              <Line type="monotone" dataKey="users" stroke="#82ca9d" name="Users" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Industry Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Industry Distribution</CardTitle>
            <CardDescription>Analyses by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={industryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {industryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Industries Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Industries by Volume</CardTitle>
            <CardDescription>Number of analyses per industry</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={industryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Industry Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Statistics</CardTitle>
          <CardDescription>Detailed breakdown by industry</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Industry</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Analyses</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Risk Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Funding</th>
                </tr>
              </thead>
              <tbody>
                {industryData?.map((industry, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{industry.industry}</td>
                    <td className="py-3 px-4 text-gray-700">{industry.count}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          industry.avg_risk_score > 70
                            ? "text-red-600"
                            : industry.avg_risk_score > 50
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {industry.avg_risk_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {industry.avg_funding ? `$${(industry.avg_funding / 1000000).toFixed(1)}M` : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}