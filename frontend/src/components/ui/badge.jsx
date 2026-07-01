import { cn } from "../../lib/utils"

const badgeVariants = {
  default: "badge-neutral",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
  destructive: "badge-danger",
  info: "badge-info",
  secondary: "badge-neutral",
  outline: "badge border border-dark-600 text-surface-400",
  premium: "badge bg-gradient-premium text-white",
}

function Badge({ className, variant = "default", ...props }) {
  return (
    <span className={cn(badgeVariants[variant] || badgeVariants.default, className)} {...props} />
  )
}

export { Badge, badgeVariants }