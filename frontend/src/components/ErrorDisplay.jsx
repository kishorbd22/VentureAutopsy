import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

/**
 * Error display component with retry and navigation options
 * @param {Object} props
 * @param {string} [props.title="Something went wrong"]
 * @param {string} [props.message]
 * @param {Error} [props.error]
 * @param {Function} [props.onRetry]
 * @param {boolean} [props.fullPage=false]
 */
export default function ErrorDisplay({
  title = "Something went wrong",
  message,
  error,
  onRetry,
  fullPage = false,
}) {
  const navigate = useNavigate()

  const containerClass = fullPage
    ? "flex min-h-[50vh] items-center justify-center"
    : "flex items-center justify-center py-12"

  return (
    <div className={cn(containerClass)}>
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {message && (
          <p className="text-sm text-gray-500">{message}</p>
        )}
        {error && (
          <details className="w-full rounded-lg bg-gray-50 p-3 text-left">
            <summary className="cursor-pointer text-xs font-medium text-gray-500">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto text-xs text-gray-600">
              {error.message || JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
        <div className="flex gap-3">
          {onRetry && (
            <Button variant="default" onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * Inline error message component
 */
export function ErrorMessage({ message, className }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600",
        className
      )}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}