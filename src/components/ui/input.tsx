
import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disabled, ...props }, ref) => {
    const bg = useBgContext()
    const innerRef = React.useRef<HTMLInputElement>(null)
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || innerRef

    // Styles basés sur le Select - même logique
    const getBackgroundStyles = () => {
      if (disabled) {
        // État désactivé - toujours gris peu importe le fond
        return "bg-grey-lighter text-grey-stronger border-grey-lighter"
      }

      switch (bg) {
        case "white":
          // Le composant s'affiche sur fond blanc - bordure invisible (même couleur que bg)
          return "bg-grey-lighter text-black border-grey-lighter hover:border-black/50 focus:border-black/50 hover:border-[0.5px] focus:border-[0.5px]"
        case "black":
          // Le composant s'affiche sur fond noir - bordure invisible (même couleur que bg)
          return "bg-black-secondary text-white border-black-secondary hover:border-white/50 focus:border-white/50 hover:border-[0.5px] focus:border-[0.5px]"
        case "grey":
          // Le composant s'affiche sur fond gris - bordure invisible (même couleur que bg)
          return "bg-white text-black border-white hover:border-black/50 focus:border-black/50 hover:border-[0.5px] focus:border-[0.5px]"
        default:
          return "bg-grey-lighter text-black border-grey-lighter hover:border-black/50 focus:border-black/50 hover:border-[0.5px] focus:border-[0.5px]"
      }
    }

    const handleStep = (direction: "up" | "down") => {
      const input = inputRef.current
      if (!input || disabled) return
      if (direction === "up") {
        input.stepUp()
      } else {
        input.stepDown()
      }
      input.dispatchEvent(new Event("input", { bubbles: true }))
      input.dispatchEvent(new Event("change", { bubbles: true }))
    }

    const getSpinnerButtonStyles = () => {
      switch (bg) {
        case "black":
          return "bg-black hover:bg-white text-white hover:text-black"
        case "white":
          return "bg-white hover:bg-black text-black hover:text-white"
        case "grey":
          return "bg-grey-lighter hover:bg-black text-black hover:text-grey-lighter"
        default:
          return "bg-grey-lighter hover:bg-grey-strongest/20 text-grey-stronger hover:text-black"
      }
    }

    if (type === "number") {
      return (
        <div className={cn("group relative flex items-center", className)}>
          <input
            type={type}
            className={cn(
              "flex h-8 w-full items-center rounded-sm border px-3 py-2 pr-9",
              "text-sm font-light transition-colors duration-200",
              "focus:outline-none focus:ring-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "placeholder:text-grey-strongest",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              "peer",
              getBackgroundStyles()
            )}
            ref={inputRef}
            disabled={disabled}
            {...props}
          />
          <div className="absolute right-1 top-1.25 bottom-1.25 flex flex-col gap-0.5 opacity-0 peer-focus:opacity-100 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => handleStep("up")}
              className={cn(
                "flex flex-1 items-center justify-center w-5 rounded-sm transition-colors duration-200",
                "disabled:cursor-not-allowed disabled:opacity-50",
                getSpinnerButtonStyles()
              )}
            >
              <ChevronUp className="h-[12px]" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => handleStep("down")}
              className={cn(
                "flex flex-1 items-center justify-center w-5 rounded-sm transition-colors duration-200",
                "disabled:cursor-not-allowed disabled:opacity-50",
                getSpinnerButtonStyles()
              )}
            >
              <ChevronDown className="h-[12px]" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          // Base styles - même que Select sans le rounded-full
          "flex h-8 w-full items-center rounded-sm border px-3 py-2",
          "text-sm font-light transition-colors duration-200",
          "focus:outline-none focus:ring-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:text-grey-strongest",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          getBackgroundStyles(),
          className
        )}
        ref={inputRef}
        disabled={disabled}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
