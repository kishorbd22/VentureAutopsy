import { motion } from "framer-motion"
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"

function ErrorDisplay({ 
  error, 
  fullPage = false, 
  onRetry,
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again."
}) {
  const navigate = useNavigate()

  const content = (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-danger-500/10 border border-danger-500/20 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-danger-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-surface-400 max-w-md mb-2">{message}</p>
      {error && (
        <p className="text-sm text-danger-400/80 bg-danger-500/5 rounded-lg px-4 py-2 max-w-md mb-6 font-mono">
          {error.message || String(error)}
        </p>
      )}
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button variant="primary" onClick={onRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
        <Button variant="secondary" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
          <Home className="w-4 h-4" />
          Home
        </Button>
      </div>
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 p-8">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16 px-8">
      {content}
    </div>
  )
}

function ErrorBoundaryFallback({ error, resetErrorBoundary }) {
  return (
    <ErrorDisplay
      error={error}
      fullPage
      title="Application Error"
      message="The application encountered an unexpected error. Please try refreshing."
      onRetry={resetErrorBoundary}
    />
  )
}

function ErrorMessage({ message, className = "" }) {
  if (!message) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 ${className}`}
    >
      <AlertTriangle className="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-danger-300">{message}</p>
    </motion.div>
  )
}

export { ErrorDisplay, ErrorBoundaryFallback, ErrorMessage }
