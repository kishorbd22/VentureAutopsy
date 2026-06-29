import { cn } from "../../lib/utils"

/**
 * Skeleton component for loading placeholders
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  )
}

export { Skeleton }