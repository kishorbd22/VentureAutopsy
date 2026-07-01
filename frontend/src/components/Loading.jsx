import { Loader2 } from "lucide-react"

function Loading({ fullPage = false, text = "Loading..." }) {
  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-dark-700 border-t-accent-500 rounded-full animate-spin" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-transparent border-r-accent-500/30 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>
          <p className="text-surface-400 text-sm font-medium">{text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
        <p className="text-surface-400 text-sm">{text}</p>
      </div>
    </div>
  )
}

function LoadingSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  }

  return (
    <div className={className}>
      <div className="relative inline-flex">
        <div className={`${sizes[size]} border-2 border-dark-700 border-t-accent-500 rounded-full animate-spin`} />
        <div className={`absolute inset-0 ${sizes[size]} border-2 border-transparent border-r-accent-500/30 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
    </div>
  )
}

export { Loading, LoadingSpinner }