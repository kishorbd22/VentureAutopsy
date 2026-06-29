import { Loader2 } from "lucide-react"
import { cn } from "../lib/utils"

/**
 * Loading spinner component
 * @param {Object} props
 * @param {string} [props.size="md"] - Size of the spinner: "sm" | "md" | "lg"
 * @param {string} [props.text] - Optional loading text
 * @param {boolean} [props.fullPage=false] - Whether to display as full page overlay
 */
export default function Loading({ size = "md", text, fullPage = false }) {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const containerClass = fullPage
    ? "fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    : "flex items-center justify-center py-12"

  return (
    <div className={cn(containerClass, "flex flex-col items-center gap-3")}>
      <Loader2 className={cn(sizeMap[size], "animate-spin text-primary-600")} />
      {text && (
        <p className="text-sm text-gray-500 animate-pulse">{text}</p>
      )}
    </div>
  )
}

/**
 * Loading skeleton for startup cards
 */
export function StartupCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}

/**
 * Loading skeleton for tables
 */
export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className="h-8 flex-1 animate-pulse rounded bg-gray-200"
          />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-4">
          {Array.from({ length: cols }).map((_, col) => (
            <div
              key={col}
              className="h-6 flex-1 animate-pulse rounded bg-gray-100"
            />
          ))}
        </div>
      ))}
    </div>
  )
}