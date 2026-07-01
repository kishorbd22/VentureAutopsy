import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default: "bg-gradient-premium text-white hover:opacity-90 hover:shadow-glow active:scale-[0.98]",
        primary: "bg-accent-600 text-white hover:bg-accent-500 hover:shadow-glow active:scale-[0.98]",
        secondary: "bg-dark-800 text-surface-200 border border-dark-700 hover:bg-dark-700 hover:text-white active:scale-[0.98]",
        outline: "border border-dark-700 bg-transparent text-surface-300 hover:bg-dark-800 hover:text-white active:scale-[0.98]",
        ghost: "text-surface-400 hover:text-white hover:bg-dark-800",
        link: "text-accent-400 underline-offset-4 hover:underline hover:text-accent-300",
        success: "bg-success-600 text-white hover:bg-success-500 active:scale-[0.98]",
        danger: "bg-danger-600 text-white hover:bg-danger-500 active:scale-[0.98]",
        warning: "bg-warning-600 text-white hover:bg-warning-500 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2 gap-2",
        sm: "h-8 rounded-lg px-3 text-xs gap-1.5",
        lg: "h-12 rounded-xl px-6 text-base gap-2",
        xl: "h-14 rounded-2xl px-8 text-lg gap-2.5",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  asChild = false, 
  loading = false,
  children,
  disabled,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Comp>
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }