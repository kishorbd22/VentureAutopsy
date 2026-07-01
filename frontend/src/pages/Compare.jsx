import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useStartups } from "../hooks/useStartups"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Skeleton } from "../components/ui/skeleton"
import { ErrorDisplay } from "../components/ErrorDisplay"
import {
  Search,
  X,
  Globe,
  DollarSign,
  Users,
  Clock,
  AlertTriangle,
  Skull,
  BarChart3,
  Layers,
  GitCompare,
  CalendarDays,
  CheckCircle2,
  MinusCircle,
} from "lucide-react"

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useState(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  })
  return debounced
}

function StartupSelector({ label, selected, onSelect, onClear, startups }) {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 200)

  const filtered = useMemo(() => {
    if (!debouncedSearch) return startups.slice(0, 5)
    const q = debouncedSearch.toLowerCase()
    return startups.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.industry?.toLowerCase().includes(q)
    ).slice(0, 8)
  }, [debouncedSearch, startups])

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <Search className="h-4 w-4 text-gray-400" />
        {label}
      </label>

      {selected ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 p-3 bg-primary-50 border border-primary-200 rounded-xl"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-sm font-bold text-white">
            {selected.name?.charAt(0) || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{selected.name}</p>
            <p className="text-xs text-gray-500">{selected.industry}</p>
          </div>
          <button
            onClick={onClear}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </motion.div>
      ) : (
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to search startups..."
            className="input pl-9"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {search && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="p-3 text-sm text-gray-400 text-center">No startups found</p>
              ) : (
                filtered.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { onSelect(s); setSearch("") }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {s.name?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.industry}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                      ID: {s.id}
                    </Badge>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CompareRow({ label, left, right, type = "text", leftIcon: LeftIcon, rightIcon: RightIcon }) {
  const renderValue = (val, IconComponent) => {
    if (val === undefined || val === null) {
      return <span className="text-gray-300 italic">N/A</span>
    }

    let display = val
    if (type === "currency" && typeof val === "number") {
      display = val >= 1e9 ? `$${(val / 1e9).toFixed(2)}B` : `$${(val / 1e6).toFixed(1)}M`
    } else if (type === "days" && typeof val === "number") {
      display = `${val.toLocaleString()} days (${(val / 365).toFixed(1)} yrs)`
    } else if (type === "number" && typeof val === "number") {
      display = val.toLocaleString()
    }

    return (
      <span className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
        {IconComponent && <IconComponent className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />}
        {display}
      </span>
    )
  }

  const isEqual = String(left ?? "") === String(right ?? "")

  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
    >
      <td className="py-3 pr-4">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
      </td>
      <td className={`py-3 px-4 ${isEqual ? "" : "bg-red-50/50"}`}>
        {renderValue(left, LeftIcon)}
      </td>
      <td className={`py-3 px-4 ${isEqual ? "" : "bg-emerald-50/50"}`}>
        {renderValue(right, RightIcon)}
      </td>
      <td className="py-3 pl-4">
        {isEqual ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : (
          <MinusCircle className="h-4 w-4 text-amber-400" />
        )}
      </td>
    </motion.tr>
  )
}

export default function Compare() {
  const { data: startups = [], isLoading, error, refetch } = useStartups()
  const [startupA, setStartupA] = useState(null)
  const [startupB, setStartupB] = useState(null)

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <GitCompare className="h-8 w-8 text-gray-400" />
          Startup Comparison
        </h1>
        <p className="text-gray-500 mt-1">
          Compare two startups side by side to analyze differences in funding, lifespan, industry, and more.
        </p>
      </motion.div>

      {error ? (
        <ErrorDisplay
          title="Failed to load startups"
          message={error.friendlyMessage || error.message}
          onRetry={refetch}
          fullPage
        />
      ) : (
        <>
          {/* ═══════════════ SELECTORS ═══════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {isLoading ? (
              <>
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </>
            ) : (
              <>
                <Card>
                  <CardContent className="p-4">
                    <StartupSelector
                      label="Startup A (Left)"
                      selected={startupA}
                      onSelect={setStartupA}
                      onClear={() => setStartupA(null)}
                      startups={startups.filter((s) => s.id !== startupB?.id)}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <StartupSelector
                      label="Startup B (Right)"
                      selected={startupB}
                      onSelect={setStartupB}
                      onClear={() => setStartupB(null)}
                      startups={startups.filter((s) => s.id !== startupA?.id)}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </motion.div>

          {/* ═══════════════ COMPARISON TABLE ═══════════════ */}
          <AnimatePresence mode="wait">
            {startupA && startupB ? (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="overflow-hidden">
                  {/* Header with startup names */}
                  <div className="grid grid-cols-[1fr_2fr_2fr_40px] gap-0 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="p-4" />
                    <div className="p-4 border-x border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-sm font-bold text-white">
                          {startupA.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{startupA.name}</p>
                          <p className="text-xs text-gray-500">ID: {startupA.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">
                          {startupB.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{startupB.name}</p>
                          <p className="text-xs text-gray-500">ID: {startupB.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-center">
                      <GitCompare className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Comparison rows */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <tbody>
                        <CompareRow
                          label="Industry"
                          left={startupA.industry}
                          right={startupB.industry}
                          leftIcon={Layers}
                          rightIcon={Layers}
                        />
                        <CompareRow
                          label="Country"
                          left={startupA.country}
                          right={startupB.country}
                          leftIcon={Globe}
                          rightIcon={Globe}
                        />
                        <CompareRow
                          label="Stage at Death"
                          left={startupA.stage_at_death}
                          right={startupB.stage_at_death}
                          leftIcon={BarChart3}
                          rightIcon={BarChart3}
                        />
                        <CompareRow
                          label="Total Funding"
                          left={startupA.total_funding_usd}
                          right={startupB.total_funding_usd}
                          type="currency"
                          leftIcon={DollarSign}
                          rightIcon={DollarSign}
                        />
                        <CompareRow
                          label="Employees"
                          left={startupA.number_of_employees}
                          right={startupB.number_of_employees}
                          type="number"
                          leftIcon={Users}
                          rightIcon={Users}
                        />
                        <CompareRow
                          label="Lifespan"
                          left={startupA.lifespan_days}
                          right={startupB.lifespan_days}
                          type="days"
                          leftIcon={Clock}
                          rightIcon={Clock}
                        />
                        <CompareRow
                          label="Death Cause"
                          left={startupA.death_cause}
                          right={startupB.death_cause}
                          leftIcon={AlertTriangle}
                          rightIcon={AlertTriangle}
                        />
                        {startupA.founded_date || startupB.founded_date ? (
                          <CompareRow
                            label="Founded"
                            left={startupA.founded_date}
                            right={startupB.founded_date}
                            leftIcon={CalendarDays}
                            rightIcon={CalendarDays}
                          />
                        ) : null}
                        {startupA.closed_date || startupB.closed_date ? (
                          <CompareRow
                            label="Closed"
                            left={startupA.closed_date}
                            right={startupB.closed_date}
                            leftIcon={Skull}
                            rightIcon={Skull}
                          />
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            ) : (
              /* Empty state */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <GitCompare className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Select Two Startups</h3>
                <p className="text-sm text-gray-400 max-w-sm">
                  Choose two startups from the selectors above to compare their attributes side by side.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════════ LEGEND ═══════════════ */}
          {startupA && startupB && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-6 text-xs text-gray-400"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Matching values
              </span>
              <span className="flex items-center gap-1.5">
                <MinusCircle className="h-3.5 w-3.5 text-amber-400" />
                Different values
              </span>
              <span>·</span>
              <span>Rows highlighted show differences</span>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}