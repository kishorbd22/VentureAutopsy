import { useRef, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { motion } from "framer-motion"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Separator } from "../components/ui/separator"
import { exportAsJSON, exportAsCSV, exportAsPDF } from "../lib/export"
import {
  Shield,
  TrendingUp,
  Lightbulb,
  ListChecks,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Skull,
  Download,
  ArrowLeft,
  Clock,
  DollarSign,
  Target,
  Zap,
  BarChart3,
  Brain,
  Sparkles,
  Layers,
  FileJson,
  FileSpreadsheet,
  FileText,
  ChevronDown,
} from "lucide-react"

const riskConfig = {
  Critical: {
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "destructive",
    icon: Skull,
    label: "Critical Risk",
    gradient: "from-red-500 to-red-700",
    lightGradient: "from-red-50 to-red-100",
  },
  High: {
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-red-200",
    badge: "destructive",
    icon: XCircle,
    label: "High Risk",
    gradient: "from-orange-500 to-orange-700",
    lightGradient: "from-orange-50 to-orange-100",
  },
  Medium: {
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    badge: "warning",
    icon: AlertTriangle,
    label: "Medium Risk",
    gradient: "from-yellow-500 to-yellow-700",
    lightGradient: "from-yellow-50 to-yellow-100",
  },
  Low: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "success",
    icon: CheckCircle2,
    label: "Low Risk",
    gradient: "from-emerald-500 to-emerald-700",
    lightGradient: "from-emerald-50 to-emerald-100",
  },
}

function getSeverityBadgeVariant(severity) {
  const map = { critical: "destructive", high: "destructive", medium: "warning", low: "info" }
  return map[severity] || "secondary"
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
}

function AnimatedScoreGauge({ score, riskLevel }) {
  const config = riskConfig[riskLevel] || riskConfig.Medium
  const scorePercent = Math.min(Math.max(score, 0), 100)
  const circumference = 2 * Math.PI * 56

  return (
    <div className="relative flex flex-col items-center">
      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <motion.circle
          cx="64" cy="64" r="56"
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - scorePercent / 100) }}
          transition={{ duration: 2, ease: "easeOut" }}
          className={config.color}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          className={`text-5xl font-black ${config.color}`}
        >
          {score}
        </motion.span>
        <span className="text-xs text-gray-400 mt-1">/ 100</span>
      </div>
    </div>
  )
}

function KPIStatCard({ icon: Icon, label, value, subvalue, color = "primary" }) {
  const colorMap = {
    primary: "text-primary-600 bg-primary-50",
    red: "text-red-600 bg-red-50",
    amber: "text-amber-600 bg-amber-50",
    emerald: "text-emerald-600 bg-emerald-50",
    indigo: "text-indigo-600 bg-indigo-50",
    purple: "text-purple-600 bg-purple-50",
  }
  const iconBg = colorMap[color] || colorMap.primary

  return (
    <motion.div variants={item} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className={`rounded-lg p-3 ${iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subvalue && <p className="text-xs text-gray-400 mt-0.5">{subvalue}</p>}
        </div>
      </div>
    </motion.div>
  )
}

export default function AnalysisReport() {
  const location = useLocation()
  const reportRef = useRef(null)
  const [exporting, setExporting] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)

  const analysisData = location.state?.analysisData
  const startupName = location.state?.startupName || "Your Startup"

  if (!analysisData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analysis Data</h2>
          <p className="text-gray-500 mb-6">Please analyze a startup first to view the report.</p>
          <Link to="/analyze">
            <Button>Go to Analysis</Button>
          </Link>
        </div>
      </div>
    )
  }

  const {
    score = 0,
    risk_level = "Medium",
    risk_factors = [],
    similar_startups = [],
    insights = [],
    recommendations = [],
    explanations = [],
  } = analysisData

  const config = riskConfig[risk_level] || riskConfig.Medium
  const RiskIcon = config.icon

  const exportToPDFVisual = async () => {
    setExporting(true)
    try {
      if (!reportRef.current) return
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, logging: false })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth - 20, imgHeight - 20)
      pdf.save(`venture-autopsy-${Date.now()}.pdf`)
    } catch (error) {
      console.error("PDF export failed:", error)
    } finally {
      setExporting(false)
    }
  }

  const handleExport = (fn) => {
    setShowExportMenu(false)
    fn(analysisData, startupName)
  }

  // Compute stats from similar startups
  const avgLifespan = similar_startups.length
    ? Math.round(similar_startups.reduce((s, st) => s + (st.lifespan_days || 0), 0) / similar_startups.length)
    : 0
  const avgFunding = similar_startups.length
    ? similar_startups.reduce((s, st) => s + (st.total_funding_usd || 0), 0) / similar_startups.length / 1000000
    : 0
  const topDeathCause = (() => {
    if (!similar_startups.length) return "N/A"
    const counts = {}
    similar_startups.forEach((s) => {
      if (s.death_cause) counts[s.death_cause] = (counts[s.death_cause] || 0) + 1
    })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return top ? top[0] : "N/A"
  })()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/analyze">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Skull className="h-5 w-5 text-gray-400" />
                  Risk Intelligence Report
                </h1>
                <p className="text-xs text-gray-500">
                  for <span className="font-semibold text-gray-700">{startupName}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={config.badge} className="text-xs">
                {config.label}
              </Badge>

              {/* Export Dropdown */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-3 w-3" />
                </Button>
                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      <button
                        onClick={() => handleExport(exportToPDFVisual)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-red-500" />
                        PDF (Visual)
                      </button>
                      <button
                        onClick={() => handleExport(exportAsPDF)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-blue-500" />
                        PDF (Data)
                      </button>
                      <button
                        onClick={() => handleExport(exportAsJSON)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
                      >
                        <FileJson className="h-4 w-4 text-amber-500" />
                        JSON
                      </button>
                      <button
                        onClick={() => handleExport(exportAsCSV)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                        CSV
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl bg-gradient-to-r ${config.gradient} p-8 text-white shadow-xl relative overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <AnimatedScoreGauge score={score} riskLevel={risk_level} />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2 justify-center md:justify-start">
                <Brain className="h-6 w-6" /> Executive Summary
              </h2>
              <p className="text-white/80 leading-relaxed mb-4">
                Based on historical analysis of startup failure patterns,{" "}
                <span className="font-semibold text-white">{startupName}</span> presents a{" "}
                <span className="font-bold underline decoration-white/30">{risk_level.toLowerCase()}</span>{" "}
                risk profile with a score of <span className="font-bold text-2xl">{score}/100</span>.
              </p>
              {explanations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {explanations.slice(0, 2).map((exp, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs bg-white/15 rounded-full px-3 py-1.5 text-white/90">
                      <Sparkles className="h-3 w-3" /> {exp}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* KPIs */}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPIStatCard icon={RiskIcon} label="Risk Level" value={risk_level} color={risk_level === "Critical" ? "red" : risk_level === "High" ? "red" : risk_level === "Medium" ? "amber" : "emerald"} />
          <KPIStatCard icon={AlertTriangle} label="Risk Factors" value={risk_factors.length} subvalue="identified" color="red" />
          <KPIStatCard icon={TrendingUp} label="Similar Cases" value={similar_startups.length} subvalue="in database" color="indigo" />
          <KPIStatCard icon={ListChecks} label="Recommendations" value={recommendations.length} subvalue="action items" color="emerald" />
        </motion.div>

        {/* Risk Factors */}
        {risk_factors.length > 0 && (
          <motion.div variants={container} initial="hidden" animate="show">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900">Risk Factors</h2>
              <span className="text-xs text-gray-400">({risk_factors.length} factors)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {risk_factors.map((factor, i) => (
                <motion.div key={i} variants={item}>
                  <Card className={`border-l-4 ${
                    factor.severity === "critical" || factor.severity === "high" ? "border-l-red-500"
                    : factor.severity === "medium" ? "border-l-amber-500" : "border-l-blue-500"
                  }`}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <Badge variant={getSeverityBadgeVariant(factor.severity)} className="mt-0.5 flex-shrink-0">
                          {factor.weight} pts
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm">{factor.factor}</h4>
                          {factor.description && <p className="text-xs text-gray-500 mt-1">{factor.description}</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Explanations */}
        {explanations.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className={`bg-gradient-to-r ${config.lightGradient} border-0`}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className={`h-5 w-5 ${config.color}`} /> Why This Score?
                </CardTitle>
                <CardDescription>Detailed reasoning behind the risk assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {explanations.map((exp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className="flex items-start gap-3 p-3 bg-white/70 rounded-lg"
                  >
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full ${config.bg} flex items-center justify-center text-xs font-bold ${config.color}`}>
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-700">{exp}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Insights + Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.length > 0 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-500" /> Key Insights
                  </CardTitle>
                  <CardDescription>Patterns and observations from the analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {insights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg"
                    >
                      <span className="text-blue-500 mt-0.5 flex-shrink-0">→</span>
                      <p className="text-sm text-gray-700">{insight}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {recommendations.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" /> Strategic Recommendations
                  </CardTitle>
                  <CardDescription>Actionable steps to mitigate risks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {recommendations.map((rec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg"
                    >
                      <span className="text-amber-500 mt-0.5 flex-shrink-0">→</span>
                      <p className="text-sm text-gray-700">{rec}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Similar Startups */}
        {similar_startups.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-indigo-500" /> Similar Failed Startups
                    </CardTitle>
                    <CardDescription>
                      {similar_startups.length} historical case{similar_startups.length !== 1 ? "s" : ""} matching your profile
                    </CardDescription>
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Avg Lifespan</p>
                      <p className="text-sm font-semibold text-gray-700">{avgLifespan}d</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Avg Funding</p>
                      <p className="text-sm font-semibold text-gray-700">${avgFunding.toFixed(1)}M</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Top Cause</p>
                      <p className="text-sm font-semibold text-gray-700 truncate max-w-[120px]">{topDeathCause}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {similar_startups.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="group bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm truncate group-hover:text-indigo-600 transition-colors">
                            {s.name}
                          </h4>
                          <p className="text-xs text-gray-500">{s.industry}</p>
                        </div>
                        <Badge variant="secondary" className="ml-2 flex-shrink-0 text-xs">#{i + 1}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                        {s.death_cause && (
                          <span className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3 text-red-400" /> {s.death_cause}
                          </span>
                        )}
                      </div>
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-gray-400">
                          <Clock className="h-3 w-3" />{s.lifespan_days || "?"}d
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <DollarSign className="h-3 w-3" />
                          {s.total_funding_usd ? `$${(s.total_funding_usd / 1000000).toFixed(1)}M` : "?"}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Target className="h-3 w-3" />
                          {s.similarity_score || "?"}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="pt-8 text-center">
          <Separator className="mb-6" />
          <p className="text-xs text-gray-400">
            Report generated on{" "}
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-xs text-gray-400 mt-1">Venture Autopsy · AI-Powered Startup Failure Intelligence</p>
        </motion.div>
      </div>
    </div>
  )
}