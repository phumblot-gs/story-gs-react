import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Label for the minimum value */
  labelMin?: string
  /** Label for the maximum value */
  labelMax?: string
  /** Debug mode - adds visual indicators and console logs */
  debug?: boolean
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, labelMin, labelMax, debug, disabled, onValueChange, ...props }, ref) => {
  const bg = useBgContext()

  // Determine colors based on data-bg context
  const getSliderStyles = () => {
    const isDisabled = disabled

    if (bg === "black") {
      return {
        rail: "bg-black-secondary",
        track: isDisabled ? "bg-grey-stronger" : "bg-white",
        thumb: isDisabled ? "bg-grey-stronger" : "bg-white",
        thumbBorder: isDisabled ? "border-grey-stronger" : "border-white",
        labelColor: isDisabled ? "text-grey-stronger" : "text-white",
      }
    } else if (bg === "grey") {
      return {
        rail: "bg-white",
        track: isDisabled ? "bg-grey-stronger" : "bg-black",
        thumb: isDisabled ? "bg-grey-stronger" : "bg-black",
        thumbBorder: isDisabled ? "border-grey-stronger" : "border-black",
        labelColor: isDisabled ? "text-grey-stronger" : "text-black",
      }
    } else {
      // Default: white background
      return {
        rail: "bg-grey-lighter",
        track: isDisabled ? "bg-grey-stronger" : "bg-black",
        thumb: isDisabled ? "bg-grey-stronger" : "bg-black",
        thumbBorder: isDisabled ? "border-grey-stronger" : "border-black",
        labelColor: isDisabled ? "text-grey-stronger" : "text-black",
      }
    }
  }

  const styles = getSliderStyles()

  // Debug mode: wrapper for onValueChange with log
  const handleValueChange = React.useCallback(
    (value: number[]) => {
      if (debug) {
        console.log("[Slider ValueChange]", {
          value,
          bg,
          disabled,
          labelMin,
          labelMax,
          min: props.min,
          max: props.max,
          step: props.step,
        })
      }
      onValueChange?.(value)
    },
    [debug, bg, disabled, labelMin, labelMax, props.min, props.max, props.step, onValueChange]
  )

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 items-center py-1",
        debug && "ring-2 ring-pink ring-offset-2",
        className
      )}
      data-bg={bg || undefined}
    >
      {/* Labels */}
      {(labelMin !== undefined || labelMax !== undefined) && (
        <div className="flex items-center justify-between w-full">
          {labelMin !== undefined && (
            <p
              className={cn(
                "font-regular text-center whitespace-pre",
                styles.labelColor
              )}
            >
              {labelMin}
            </p>
          )}
          {labelMax !== undefined && (
            <p
              className={cn(
                "font-regular text-center whitespace-pre",
                styles.labelColor
              )}
            >
              {labelMax}
            </p>
          )}
        </div>
      )}

      {/* Slider */}
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-baseline", debug && "ring-1 ring-pink")}
        disabled={disabled}
        onValueChange={handleValueChange}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative h-[2px] w-full grow overflow-visible rounded-[1px]",
            styles.rail
          )}
        >
          <SliderPrimitive.Range
            className={cn("absolute h-full", styles.track)}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            "block h-[10px] w-[10px] rounded-full border-0 transition-colors",
            "absolute top-1/2 -translate-y-1/2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            styles.thumb
          )}
        />
      </SliderPrimitive.Root>

      {/* Debug indicator */}
      {debug && (
        <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap z-10">
          {bg || "no-bg"}
        </span>
      )}
    </div>
  )
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
