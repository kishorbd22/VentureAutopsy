import { useMemo } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts"
import { useStartups } from "../hooks/useStartups"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Skeleton } from "../components/ui/skeleton"
import ErrorDisplay from "../components/ErrorDisplay"
import {
  Building2, TrendingUp, Skull, DollarSign, Clock, BarChart3,
  AlertTriangle, Search, ArrowRight, Sparkles, Layers,
  PieChart as PieChartIcon, Activity, Shield,
} from "lucide-react"

const COLORS = {
  FinTech: "#3b82f6",
  HealthTech: "#10b981",
  EdTech: "#f59e0b",
  "E-commerce": "#ef4444",
  SaaS: "#8b5cf6",
  "AI/ML": "#ec4899",
  Enterprise: "#14b8a6",
  Consumer: "#f97316",
  Other: "#6b7280",
}

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6b7280"]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-900 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-gray-600">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: p.color }} />
            {p.name}: <span className="font-semibold">{p.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

function PieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold text-gray-900">{payload[0].name}</p>
        <p className="text-gray-600">Count: <span className="font-semibold">{payload[0].value}</span></p>
      </div>
    )
  }
  return null
}

function StatCard({ icon: Icon, label, value, subvalue, trend, color = "primary" }) {
  const iconColorMap = {
    primary: "text-primary-600 bg-primary-50",
    red: "text-red-600 bg-red-50",
    amber: "text-amber-600 bg-amber-50",
    emerald: "text-emerald-600 bg-emerald-50",
    indigo: "text-indigo-600 bg-indigo-50",
    purple: "text-purple-600 bg-purple-50",
    blue: "text-blue-600 bg-blue-50",
  }

  return (
    <motion.div variants={item}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform origin-left">
                {value ?? <Skeleton className="h-8 w-20" />}
              </p>
              {subvalue && <p className="text-xs text-gray-400">{subvalue}</p>}
            </div>
            <div className={`rounded-xl p-3 ${iconColorMap[color]}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          {trend && (
            <div className="mt-3 flex items-center gap-1 text-xs">
              <TrendingUp className={`h-3 w-3 ${trend > 0 ? "text-emerald-500" : "text-red-500"}`} />
              <span className={trend > 0 ? "text-emerald-600" : "text-red-600"}>
                {Math.abs(trend)}% from last period
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ChartCard({ title, description, icon: Icon, children, action }) {
  return (
    <motion.div variants={item}>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Icon className="h-4 w-4 text-gray-400" />
              {title}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[300px]">
            {children}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Home() {
  const { data: startups = [], isLoading, error, refetch } = useStartups()

  // ─── Compute derived stats ────────────────────────────────────
  const stats = useMemo(() => {
    if (!startups.length) return null

    const total = startups.length
    const industries = [...new Set(startups.map((s) => s.industry).filter(Boolean))]
    const totalFunding = startups.reduce((sum, s) => sum + (parseFloat(s.total_funding_usd) || 0), 0)
    const avgLifespan = startups.reduce((sum, s) => {
      if (s.founded_date && s.closed_date) {
        const days = (new Date(s.closed_date) - new Date(s.founded_date)) / (1000 * 60 * 60 * 24)
        return sum + days
      }
      return sum + (s.lifespan_days || 0)
    }, 0) / total
    const avgFunding = totalFunding / total

    return { total, industriesCount: industries.length, totalFunding, avgLifespan, avgFunding }
  }, [startups])

  // ─── Industry Distribution ────────────────────────────────────
  const industryDistribution = useMemo(() => {
    if (!startups.length) return []
    const counts = {}
    startups.forEach((s) => {
      const ind = s.industry || "Other"
      counts[ind] = (counts[ind] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [startups])

  // ─── Funding by Stage ─────────────────────────────────────────
  const fundingByStage = useMemo(() => {
    if (!startups.length) return []
    const stages = {}
    startups.forEach((s) => {
      const stage = s.stage_at_death || "Unknown"
      stages[stage] = (stages[stage] || 0) + (parseFloat(s.total_funding_usd) || 0)
    })
    return Object.entries(stages)
      .map(([stage, amount]) => ({ stage, amount: Math.round(amount) }))
      .sort((a, b) => b.amount - a.amount)
  }, [startups])

  // ─── Death Causes ────────────────────────────────────────────
  const deathCauseData = useMemo(() => {
    if (!startups.length) return []
    const counts = {}
    startups.forEach((s) => {
      const cause = s.death_cause || "Unknown"
      counts[cause] = (counts[cause] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [startups])

  // ─── Startups Over Time (by founded year) ────────────────────
  const timeData = useMemo(() => {
    if (!startups.length) return []
    const years = {}
    startups.forEach((s) => {
      if (s.founded_date) {
        const year = new Date(s.founded_date).getFullYear()
        if (!isNaN(year)) {
          years[year] = (years[year] || 0) + 1
        }
      }
    })
    return Object.entries(years)
      .map(([year, count]) => ({ year: parseInt(year), count }))
      .sort((a, b) => a.year - b.year)
  }, [startups])

  // ─── Stage Distribution (for pie) ────────────────────────────
  const stageDistribution = useMemo(() => {
    if (!startups.length) return []
    const counts = {}
    startups.forEach((s) => {
      const stage = s.stage_at_death || "Unknown"
      counts[stage] = (counts[stage] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [startups])

  // ─── Risk Level Distribution ─────────────────────────────────
  const riskDistribution = useMemo(() => {
    if (!startups.length) return []
    // Derive risk from lifespan and funding as a proxy
    const levels = { Low: 0, Medium: 0, High: 0, Critical: 0 }
    startups.forEach((s) => {
      const lifespan = s.lifespan_days || 0
      const funding = parseFloat(s.total_funding_usd) || 0
      // Heuristic: short lifespan + low funding = higher risk
      if (lifespan < 365 && funding < 500000) levels.Critical++
      else if (lifespan < 730 && funding < 2000000) levels.High++
      else if (lifespan < 1095 && funding < 5000000) levels.Medium++
      else levels.Low++
    })
    return Object.entries(levels).map(([name, value]) => ({ name, value }))
  }, [startups])

  // ─── Recent / Featured Startups ──────────────────────────────
  const recentStartups = useMemo(() => {
    return [...startups]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 5)
  }, [startups])

  return (
    <div className="space-y-8 pb-12">
      {/* ═══════════════ PAGE HEADER ═══════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Skull className="h-8 w-8 text-gray-400" />
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of startup failure intelligence and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/analyze">
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              New Analysis
            </Button>
          </Link>
          <Link to="/analytics">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Full Analytics
            </Button>
          </Link>
        </div>
      </motion.div>

      {error ? (
        <ErrorDisplay
          title="Failed to load dashboard data"
          message={error.friendlyMessage || error.message}
          onRetry={refetch}
          fullPage
        />
      ) : (
        <>
          {/* ═══════════════ STATISTICS CARDS ═══════════════ */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatCard
              icon={Building2}
              label="Total Startups"
              value={isLoading ? null : stats?.total.toLocaleString()}
              subvalue={`across ${stats?.industriesCount || 0} industries`}
              color="primary"
            />
            <StatCard
              icon={DollarSign}
              label="Total Funding"
              value={isLoading ? null : `$${(stats?.totalFunding || 0) >= 1e9
                ? (stats.totalFunding / 1e9).toFixed(1) + "B"
                : (stats.totalFunding / 1e6).toFixed(1) + "M"
              }`}
              subvalue={`avg $${((stats?.avgFunding || 0) / 1e6).toFixed(1)}M per startup`}
              color="emerald"
            />
            <StatCard
              icon={Clock}
              label="Avg Lifespan"
              value={isLoading ? null : `${Math.round((stats?.avgLifespan || 0) / 365)} yrs`}
              subvalue={`${Math.round(stats?.avgLifespan || 0).toLocaleString()} days`}
              color="amber"
            />
            <StatCard
              icon={Shield}
              label="Risk Coverage"
              value={isLoading ? null : `${riskDistribution.reduce((s, r) => s + r.value, 0)}`}
              subvalue={`${riskDistribution.find(r => r.name === "High")?.value || 0} high risk`}
              color="red"
            />
          </motion.div>

          {/* ═══════════════ CHARTS ROW 1 ═══════════════ */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Industry Distribution - Bar Chart */}
            <ChartCard
              title="Industry Distribution"
              description="Startups by industry sector"
              icon={Layers}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industryDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      angle={-35}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]} maxBarSize={50}>
                      {industryDistribution.map((entry, i) => (
                        <Cell key={i} fill={COLORS[entry.name] || CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Risk Distribution - Pie Chart */}
            <ChartCard
              title="Risk Distribution"
              description="Startups by estimated risk level"
              icon={Activity}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-[250px] w-full rounded-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, i) => {
                        const colors = { Low: "#10b981", Medium: "#f59e0b", High: "#ef4444", Critical: "#7f1d1d" }
                        return <Cell key={i} fill={colors[entry.name] || CHART_COLORS[i]} />
                      })}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </motion.div>

          {/* ═══════════════ CHARTS ROW 2 ═══════════════ */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Death Causes - Bar Chart */}
            <ChartCard
              title="Death Causes"
              description="Most common reasons for startup failure"
              icon={AlertTriangle}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deathCauseData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#6b7280" }}
                      width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]} maxBarSize={30}>
                      {deathCauseData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* Startups Over Time - Line Chart */}
            <ChartCard
              title="Failed Startups Over Time"
              description="Number of failed startups by founding year"
              icon={TrendingUp}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Startups"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 4 }}
                      activeDot={{ r: 6, fill: "#2563eb" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </motion.div>

          {/* ═══════════════ FUNDING BY STAGE + RECENT ═══════════════ */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Funding by Stage */}
            {fundingByStage.length > 0 && (
              <ChartCard
                title="Funding by Stage"
                description="Total funding amount by funding stage"
                icon={DollarSign}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fundingByStage} margin={{ top: 10, right: 10, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "#6b7280" }} />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`}
                    />
                    <Tooltip
                      formatter={(value) => [`$${(value / 1e6).toFixed(2)}M`, "Funding"]}
                    />
                    <Bar dataKey="amount" name="Funding" radius={[4, 4, 0, 0]} maxBarSize={45}>
                      {fundingByStage.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Recent Startups */}
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Skull className="h-4 w-4 text-gray-400" />
                    Recent Startups
                  </CardTitle>
                  <CardDescription>Latest additions to the database</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1 space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    ))
                  ) : recentStartups.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No startups in the database yet.</p>
                  ) : (
                    recentStartups.map((s, i) => (
                      <motion.div
                        key={s.id || i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-sm font-bold text-primary-600">
                          {s.name?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                            {s.name || "Unnamed Startup"}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{s.industry || "N/A"}</span>
                            {s.death_cause && (
                              <>
                                <span>·</span>
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {s.death_cause}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <Link
                          to={`/startups/${s.id}`}
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* ═══════════════ STAGE DISTRIBUTION PIE ═══════════════ */}
          {stageDistribution.length > 0 && (
            <motion.div variants={container} initial="hidden" animate="show">
              <ChartCard
                title="Stage Distribution"
                description="Startups by funding stage at time of failure"
                icon={PieChartIcon}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stageDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      dataKey="value"
                    >
                      {stageDistribution.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </motion.div>
          )}

          {/* ═══════════════ QUICK ACTION CTA ═══════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center"
          >
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6" />
              Ready to Analyze Your Startup?
            </h2>
            <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
              Get a comprehensive risk assessment with personalized recommendations based on historical data.
            </p>
            <Link to="/analyze">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50 gap-2"
              >
                <Search className="h-4 w-4" />
                Start Analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </>
      )}
    </div>
  )
}