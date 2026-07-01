import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-600 text-white hover:bg-primary-700",
        secondary:
          "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700",
        success:
          "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
        warning:
          "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
        info:
          "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        outline:
          "border-gray-300 text-gray-700 hover:bg-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }