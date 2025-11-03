import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { Icon } from "@/components/ui/icons"
import { useBgContext } from "@/components/layout/BgContext"
import { cn } from "@/lib/utils"

export interface ButtonPlusProps extends Omit<ButtonProps, "children" | "size" | "variant"> {
  /** Label text displayed in the pill (can be translated) */
  label: string
  /** Debug mode */
  debug?: boolean
}

export const ButtonPlus = React.forwardRef<HTMLButtonElement, ButtonPlusProps>(
  (
    {
      label,
      className,
      disabled,
      onClick,
      onFocus,
      onBlur,
      debug = false,
      ...props
    },
    ref
  ) => {
    const bg = useBgContext()
    const [isHovered, setIsHovered] = React.useState(false)
    
    // Determine the bg context for the inner button
    // If Layout = white or grey → button internal has data-bg="black"
    // If Layout = black → button internal has data-bg="white"
    const innerButtonBg = bg === "black" ? "white" : "black"

    // Debug mode : wrapper pour onClick avec log
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (debug) {
          console.log("[ButtonPlus Click]", {
            label,
            bg,
            innerButtonBg,
            event: e,
          })
        }
        onClick?.(e)
      },
      [debug, label, bg, innerButtonBg, onClick]
    )

    // Debug mode : wrapper pour onFocus avec log
    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (debug) {
          console.log("[ButtonPlus Focus]", {
            label,
            bg,
            innerButtonBg,
            event: e,
          })
        }
        onFocus?.(e)
      },
      [debug, label, bg, innerButtonBg, onFocus]
    )

    // Debug mode : wrapper pour onBlur avec log
    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLButtonElement>) => {
        if (debug) {
          console.log("[ButtonPlus Blur]", {
            label,
            bg,
            innerButtonBg,
            event: e,
          })
        }
        onBlur?.(e)
      },
      [debug, label, bg, innerButtonBg, onBlur]
    )

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        data-bg={bg || undefined}
        className={cn(
          // Pill container styles - 40px height with py-1
          "inline-flex items-center gap-2 rounded-full pl-2 pr-4 py-1 h-10 relative",
          "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Use btn-plus class for styling
          "btn-plus",
          debug && "ring-2 ring-pink ring-offset-2",
          className
        )}
        onClick={debug ? handleClick : onClick}
        onFocus={debug ? handleFocus : onFocus}
        onBlur={debug ? handleBlur : onBlur}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Inner button with Plus icon - always size medium */}
        <div 
          data-bg={innerButtonBg}
          className="pointer-events-none"
        >
          <Button
            variant="normal"
            size="medium"
            disabled={disabled}
            className={cn(
              "relative rounded-full p-0 flex items-center justify-center pointer-events-none h-6 w-6",
              // Icon rotation animation based on hover state
              "[&_svg]:transition-transform [&_svg]:duration-300",
              isHovered ? "[&_svg]:rotate-90" : "[&_svg]:rotate-0"
            )}
            asChild={false}
          >
            <Icon name="Plus" size={12} />
          </Button>
        </div>

        {/* Label */}
        <span className="text-lg font-medium whitespace-nowrap">{label}</span>

        {debug && (
          <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap">
            {bg}/{innerButtonBg}
          </span>
        )}
      </button>
    )
  }
)

ButtonPlus.displayName = "ButtonPlus"

