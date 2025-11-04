import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

export type ProgressState = "complete" | "indeterminate" | "loading"

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /**
   * The current progress value (0 to max)
   */
  value?: number
  /**
   * The maximum progress value (default: 100)
   */
  max?: number
  /**
   * Callback function that receives the current progress state
   */
  onStateChange?: (state: ProgressState) => void
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, max = 100, onStateChange, ...props }, ref) => {
  // Calculate progress state
  const state = React.useMemo<ProgressState>(() => {
    if (value === undefined || value === null) {
      return "indeterminate"
    }
    if (value >= max) {
      return "complete"
    }
    return "loading"
  }, [value, max])

  // Calculate percentage for display
  const percentage = React.useMemo(() => {
    if (value === undefined || value === null) {
      return undefined
    }
    return Math.min(100, Math.max(0, (value / max) * 100))
  }, [value, max])

  // Notify state changes
  React.useEffect(() => {
    onStateChange?.(state)
  }, [state, onStateChange])

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full progress-bg progress-default",
        className
      )}
      value={percentage}
      max={100}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-black progress-indicator transition-all"
        style={{ transform: `translateX(-${100 - (percentage || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
