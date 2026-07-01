import * as React from "react"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef(({ className, error, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        error ? "input-premium-error" : "input-premium",
        "min-h-[100px] resize-y",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }