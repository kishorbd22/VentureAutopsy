import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAnalysisHistory } from "../hooks/useAnalysisHistory"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import {
  Clock,
  Trash2,
  Calendar,
  Sun,
  Moon,
  CalendarDays,
  Skull,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash,
  FlaskConical,
  Eye,
  RotateCcw,
} from "lucide-react"

const riskConfig = {
  Critical: { badge: "destructive", icon: Skull, color: "text-red-600" },
  High: { badge: "destructive", icon: XCircle, color: "text-orange-600" },
  Medium: { badge: "warning", icon: AlertTriangle, color: "text-yellow-600" },
  Low: { badge: "success", icon: CheckCircle2, color: "text-emerald-600" },
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  if (isToday) return `Today at ${timeStr}`
  if (isYesterday) return `Yesterday at ${timeStr}`
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function SectionHeader({ icon: Icon, label, count, color = "gray" }) {
  const colorMap = {
    gray: "text-gray-400 bg-gray-100",
    blue: "text-blue-500 bg-blue-50",
    amber: "text-amber-500 bg-amber-50",
    purple: "text-purple-500 bg-purple-50",
  }
  const iconBg = colorMap[color] || colorMap.gray

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`rounded-lg p-2 ${iconBg}`}>
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{label}</h2>
      <Badge variant="secondary" className="text-[10px]">
        {count}
      </Badge>
    </div>
  )
}

function HistoryEntry({ entry, onDelete }) {
  const navigate = useNavigate()
  const config = riskConfig[entry.riskLevel] || riskConfig.Medium
  const RiskIcon = config.icon

  const borderColor =
    entry.riskLevel === "Critical" ? "#ef4444" :
    entry.riskLevel === "High" ? "#f97316" :
    entry.riskLevel === "Medium" ? "#f59e0b" :
    "#10b981"

  return (
    <motion.div variants={itemAnim} layout className="group relative">
      <Card
        className="overflow-hidden hover:shadow-md transition-all duration-300 border-l-4"
        style={{ borderLeftColor: borderColor }}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${config.color} bg-gray-50`}>
              <RiskIcon className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {entry.startupName || "Unnamed Analysis"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatTime(entry.timestamp)}
                  </p>
                </div>
                <Badge variant={config.badge} className="flex-shrink-0 text-[10px]">
                  {entry.score} pts · {entry.riskLevel}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {entry.input?.industry && (
                  <span className="text-[10px] text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                    {entry.input.industry}
                  </span>
                )}
                <span className="text-[10px] text-gray-400">
                  {entry.riskFactorCount || 0} factors · {entry.recommendationCount || 0} recommendations
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  navigate("/report", {
                    state: {
                      analysisData: entry.fullData,
                      startupName: entry.startupName,
                    },
                  })
                }
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(entry.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Clock className="h-10 w-10 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">No Analysis History</h3>
      <p className="text-sm text-gray-400 max-w-sm">
        Your analysis history will appear here once you start analyzing startups.
      </p>
      <Link to="/analyze">
        <Button className="mt-4 gap-2">
          <FlaskConical className="h-4 w-4" />
          Analyze a Startup
        </Button>
      </Link>
    </div>
  )
}

export default function History() {
  const { grouped, removeEntry, clearHistory } = useAnalysisHistory()
  const [showConfirm, setShowConfirm] = useState(false)

  const totalCount = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0)

  const sectionConfig = [
    { key: "today", label: "Today", icon: Sun, color: "amber" },
    { key: "yesterday", label: "Yesterday", icon: Moon, color: "purple" },
    { key: "thisWeek", label: "This Week", icon: CalendarDays, color: "blue" },
    { key: "older", label: "Older", icon: Calendar, color: "gray" },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Clock className="h-8 w-8 text-gray-400" />
            Analysis History
          </h1>
          <p className="text-gray-500 mt-1">
            View and revisit your past startup analyses.
          </p>
        </div>
        {totalCount > 0 && (
          <div className="flex items-center gap-2">
            {showConfirm ? (
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                <span className="text-xs text-red-600 font-medium">Clear all {totalCount} entries?</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => { clearHistory(); setShowConfirm(false) }}
                  className="h-8 text-xs"
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirm(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirm(true)}
                className="gap-2 text-red-500 border-red-200 hover:bg-red-50"
              >
                <Trash className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        )}
      </motion.div>

      {totalCount === 0 ? (
        <EmptyState />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="history"
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {sectionConfig.map(({ key, label, icon: Icon, color }) => {
              const items = grouped[key]
              if (!items || items.length === 0) return null

              return (
                <div key={key}>
                  <SectionHeader icon={Icon} label={label} count={items.length} color={color} />
                  <div className="space-y-2">
                    {items.map((entry) => (
                      <HistoryEntry
                        key={entry.id}
                        entry={entry}
                        onDelete={removeEntry}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}