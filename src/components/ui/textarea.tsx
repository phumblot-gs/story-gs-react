
import * as React from "react"
import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, disabled, ...props }, ref) => {
    const bg = useBgContext()

    // Styles basés sur Input - même logique
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

    return (
      <textarea
        className={cn(
          // Base styles - même que Input
          "flex w-full h-[90px] rounded-sm border px-2.5 py-2",
          "text-sm font-light transition-colors duration-200",
          "focus:outline-none focus:ring-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:text-grey-strongest",
          "resize-none",
          getBackgroundStyles(),
          className
        )}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
