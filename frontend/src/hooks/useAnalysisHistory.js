import { useState, useCallback, useMemo } from "react"

const STORAGE_KEY = "va-analysis-history"
const MAX_ENTRIES = 100

/**
 * Analysis history entry
 * @typedef {Object} AnalysisHistoryEntry
 * @property {string} id - Unique identifier
 * @property {number} timestamp - Unix timestamp
 * @property {string} startupName - Name of the analyzed startup
 * @property {Object} input - User input that was submitted
 * @property {number} score - Risk score
 * @property {string} riskLevel - Risk level string
 * @property {number} riskFactorCount - Number of risk factors
 * @property {number} recommendationCount - Number of recommendations
 * @property {Object} fullData - Full analysis response data
 */

/**
 * Load analysis history from localStorage
 * @returns {AnalysisHistoryEntry[]}
 */
function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Save analysis history to localStorage
 * @param {AnalysisHistoryEntry[]} history
 */
function saveHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_ENTRIES)))
  } catch (e) {
    console.error("Failed to save analysis history:", e)
  }
}

/**
 * Hook to manage analysis history with localStorage persistence
 *
 * @returns {{
 *   history: AnalysisHistoryEntry[],
 *   grouped: { today: AnalysisHistoryEntry[], yesterday: AnalysisHistoryEntry[], thisWeek: AnalysisHistoryEntry[], older: AnalysisHistoryEntry[] },
 *   addEntry: (entry: Omit<AnalysisHistoryEntry, 'id' | 'timestamp'>) => string,
 *   removeEntry: (id: string) => void,
 *   clearHistory: () => void,
 *   getEntry: (id: string) => AnalysisHistoryEntry | undefined,
 * }}
 */
export function useAnalysisHistory() {
  const [history, setHistory] = useState(loadHistory)

  const addEntry = useCallback((entryData) => {
    const id = `analysis-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    const entry = {
      id,
      timestamp: Date.now(),
      ...entryData,
    }

    setHistory((prev) => {
      const updated = [entry, ...prev]
      saveHistory(updated)
      return updated
    })

    return id
  }, [])

  const removeEntry = useCallback((id) => {
    setHistory((prev) => {
      const updated = prev.filter((e) => e.id !== id)
      saveHistory(updated)
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setHistory([])
  }, [])

  const getEntry = useCallback(
    (id) => history.find((e) => e.id === id),
    [history]
  )

  // Group entries by time period
  const grouped = useMemo(() => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const yesterdayStart = todayStart - 86400000
    const weekStart = todayStart - now.getDay() * 86400000

    const groups = { today: [], yesterday: [], thisWeek: [], older: [] }

    history.forEach((entry) => {
      const ts = entry.timestamp
      if (ts >= todayStart) {
        groups.today.push(entry)
      } else if (ts >= yesterdayStart) {
        groups.yesterday.push(entry)
      } else if (ts >= weekStart) {
        groups.thisWeek.push(entry)
      } else {
        groups.older.push(entry)
      }
    })

    return groups
  }, [history])

  return { history, grouped, addEntry, removeEntry, clearHistory, getEntry }
}