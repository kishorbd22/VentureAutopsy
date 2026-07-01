import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import AnalysisForm from "../components/AnalysisForm"
import { useAnalysis } from "../hooks/useAnalysis"
import { useAnalysisHistory } from "../hooks/useAnalysisHistory"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { ErrorMessage } from "../components/ErrorDisplay"
import {
  Shield,
  TrendingUp,
  Lightbulb,
  ListChecks,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Skull,
  History,
} from "lucide-react"

const riskConfig = {
  Critical: {
    color: "text-danger-400",
    bg: "bg-danger-500/10",
    border: "border-danger-500/20",
    icon: Skull,
    label: "Critical Risk",
  },
  High: {
    color: "text-warning-400",
    bg: "bg-warning-500/10",
    border: "border-warning-500/20",
    icon: XCircle,
    label: "High Risk",
  },
  Medium: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: AlertTriangle,
    label: "Medium Risk",
  },
  Low: {
    color: "text-success-400",
    bg: "bg-success-500/10",
    border: "border-success-500/20",
    icon: CheckCircle2,
    label: "Low Risk",
  },
}

function getSeverityBadge(severity) {
  const map = {
    critical: "destructive",
    high: "destructive",
    medium: "warning",
    low: "info",
  }
  return map[severity] || "secondary"
}

function RiskScoreCard({ score, riskLevel, explanations = [] }) {
  const config = riskConfig[riskLevel] || riskConfig.Medium
  const scorePercent = Math.min(score, 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`overflow-hidden ${config.border}`}>
        <CardHeader className={`${config.bg} border-b ${config.border}`}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
            <Badge variant={riskLevel === "Critical" ? "destructive" : riskLevel === "High" ? "destructive" : riskLevel === "Medium" ? "warning" : "success"}>
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center gap-8">
            <div className="relative flex-shrink-0">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke={scorePercent > 70 ? "#ef4444" : scorePercent > 40 ? "#f59e0b" : "#10b981"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - scorePercent / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className={`text-3xl font-bold ${config.color}`}
                >
                  {score}
                </motion.span>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium text-gray-700">Analysis Summary</p>
              {explanations.length > 0 ? (
                <ul className="space-y-1.5">
                  {explanations.slice(0, 3).map((exp, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-primary-500 mt-0.5">•</span>
                      {exp}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">No detailed explanations available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function InsightsCard({ title, icon: Icon, items, variant = "default" }) {
  if (!items || items.length === 0) return null

  const variantStyles = {
    default: { bg: "bg-white", border: "border-gray-200", iconColor: "text-primary-500" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", iconColor: "text-amber-500" },
    info: { bg: "bg-blue-50", border: "border-blue-200", iconColor: "text-blue-500" },
  }
  const style = variantStyles[variant] || variantStyles.default

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className={`${style.bg} ${style.border}`}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Icon className={`h-5 w-5 ${style.iconColor}`} />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className={`${style.iconColor} mt-0.5`}>→</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function FactorsCard({ factors = [] }) {
  if (!factors || factors.length === 0) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Risk Factors
          </CardTitle>
          <CardDescription>Key factors contributing to the risk score</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {factors.map((factor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <Badge variant={getSeverityBadge(factor.severity)} className="mt-0.5 flex-shrink-0">
                {factor.weight} pts
              </Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{factor.factor}</p>
                {factor.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{factor.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function SimilarStartupsCard({ startups = [] }) {
  if (!startups || startups.length === 0) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            Similar Failed Startups
          </CardTitle>
          <CardDescription>Startups that share similar characteristics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {startups.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                <p className="text-xs text-gray-500">{s.industry} · {s.death_cause}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="text-xs font-medium text-gray-700">{s.lifespan_days}d</p>
                <p className="text-xs text-gray-400">${(s.total_funding_usd / 1000000).toFixed(1)}M</p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function AnalyzeStartup() {
  const navigate = useNavigate()
  const { mutateAsync: analyze, isPending, error } = useAnalysis()
  const { addEntry } = useAnalysisHistory()
  const [result, setResult] = useState(null)
  const [submittedName, setSubmittedName] = useState("")

  const handleSubmit = async (data) => {
    try {
      const response = await analyze(data)
      const resultData = response.data

      setResult(resultData)
      setSubmittedName(data.name || "This Startup")

      // Persist to history
      addEntry({
        startupName: data.name || "This Startup",
        input: data,
        score: resultData.score,
        riskLevel: resultData.risk_level,
        riskFactorCount: resultData.risk_factors?.length || 0,
        recommendationCount: resultData.recommendations?.length || 0,
        fullData: resultData,
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Skull className="h-8 w-8 text-gray-400" />
          Startup Analysis
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Analyze your startup{'\u2019'}s risk profile based on historical data from failed startups.
          Our AI compares your inputs against thousands of data points to predict failure patterns.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form - Left Side */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <AnalysisForm onSubmit={handleSubmit} isPending={isPending} />
            </CardContent>
          </Card>
        </div>

        {/* Results - Right Side */}
        <div className="lg:col-span-3 space-y-6">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <ErrorMessage
                message={error.friendlyMessage || error.message || "Analysis failed. Please try again."}
              />
            </motion.div>
          )}

          {/* Loading state */}
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-gray-200" />
                <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />
              </div>
              <p className="text-sm text-gray-500 animate-pulse">Analyzing your startup data...</p>
            </motion.div>
          )}

          {/* Results */}
          <AnimatePresence mode="wait">
            {result && !isPending && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* View Report Button */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <Button
                    onClick={() =>
                      navigate("/report", {
                        state: {
                          analysisData: result,
                          startupName: submittedName,
                        },
                      })
                    }
                    className="gap-2"
                  >
                    View Full Report
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>

                {/* Risk Score */}
                <RiskScoreCard
                  score={result.score}
                  riskLevel={result.risk_level}
                  explanations={result.explanations}
                />

                {/* Risk Factors */}
                {result.risk_factors && result.risk_factors.length > 0 && (
                  <FactorsCard factors={result.risk_factors} />
                )}

                {/* Insights */}
                {result.insights && result.insights.length > 0 && (
                  <InsightsCard
                    title="Insights"
                    icon={Lightbulb}
                    items={result.insights}
                    variant="info"
                  />
                )}

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <InsightsCard
                    title="Recommendations"
                    icon={ListChecks}
                    items={result.recommendations}
                    variant="warning"
                  />
                )}

                {/* Similar Startups */}
                {result.similar_startups && result.similar_startups.length > 0 && (
                  <SimilarStartupsCard startups={result.similar_startups} />
                )}

                {/* History link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-center"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/history")}
                    className="gap-2 text-gray-400"
                  >
                    <History className="h-4 w-4" />
                    View analysis history
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!result && !isPending && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Shield className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No Analysis Yet</h3>
              <p className="text-sm text-gray-400 max-w-sm">
                Fill in your startup details on the left and click &ldquo;Analyze Startup&rdquo; to see the risk assessment here.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}