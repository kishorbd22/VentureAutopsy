import { cn } from "../../lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("skeleton", className)}
      {...props}
    />
  )
}

function SkeletonCard({ className, ...props }) {
  return (
    <div className={cn("card-premium p-6 space-y-4", className)} {...props}>
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

function SkeletonTable({ rows = 5, className, ...props }) {
  return (
    <div className={cn("card-premium overflow-hidden", className)} {...props}>
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28 ml-auto" />
        </div>
      </div>
      <div className="divide-y divide-dark-800">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 rounded-full ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonLine({ className, ...props }) {
  return <Skeleton className={cn("h-4 w-full", className)} {...props} />
}

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonLine }