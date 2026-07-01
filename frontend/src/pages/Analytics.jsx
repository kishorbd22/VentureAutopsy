import { useState } from "react"
import { useAnalyticsSummary, useDailyAnalytics, useIndustryStats } from "../hooks/useAnalytics"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  TrendingUp,
  Users,
  FlaskConical,
  Calendar,
  Factory,
} from "lucide-react"

export default function Analytics() {
  const [days, setDays] = useState(30)
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useAnalyticsSummary()
  const { data: dailyData, isLoading: dailyLoading } = useDailyAnalytics(days)
  const { data: industries, isLoading: industriesLoading } = useIndustryStats()

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Platform metrics and insights
        </p>
      </div>

      {/* Error State */}
      {summaryError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">Failed to load analytics data</p>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <FlaskConical className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryLoading ? "..." : summary?.total_analyses || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {summary?.daily_analyses || 0} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryLoading ? "..." : summary?.total_users || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {summary?.daily_users || 0} active today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryLoading ? "..." : summary?.average_score?.toFixed(1) || "0.0"}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Out of 100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industries Analyzed</CardTitle>
            <Factory className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryLoading ? "..." : summary?.popular_industries?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Unique categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Industries */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Industries</CardTitle>
          <CardDescription>
            Top industries by analysis count
          </CardDescription>
        </CardHeader>
        <CardContent>
          {industriesLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : industries && industries.length > 0 ? (
            <div className="space-y-3">
              {industries.slice(0, 5).map((industry) => (
                <div key={industry.industry} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {industry.industry}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {industry.count} analyses
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-600">
                    Avg score: {industry.avg_risk_score.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No industry data available yet</p>
          )}
        </CardContent>
      </Card>

      {/* Daily Analytics Chart Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daily Activity</CardTitle>
              <CardDescription>
                Analyses and users over time
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {dailyLoading ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-sm text-gray-500">Loading chart...</p>
            </div>
          ) : dailyData && dailyData.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-2">
              {dailyData.map((day) => (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-primary-500 rounded-t"
                    style={{
                      height: `${(day.analyses / Math.max(...dailyData.map(d => d.analyses))) * 100}%`,
                      minHeight: day.analyses > 0 ? "4px" : "0",
                    }}
                    title={`${day.analyses} analyses`}
                  />
                  <span className="text-xs text-gray-500 rotate-45 origin-left">
                    {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-sm text-gray-500">No daily data available yet</p>
            </div>
          )}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary-500 rounded" />
              <span className="text-gray-600">Analyses</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}