import * as React from "react"
import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"
import { Icon } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"

export interface SearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, disabled, value, defaultValue, onClear, ...props }, ref) => {
    const bg = useBgContext()
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    const [isFocused, setIsFocused] = React.useState(false)
    const currentValue = value !== undefined ? value : internalValue
    const hasValue = Boolean(currentValue)

    // Styles basés sur le Select - même logique avec ajustement selon bg
    const getBackgroundStyles = () => {
      if (disabled) {
        // État désactivé - toujours gris peu importe le fond
        return "bg-grey-lighter text-grey-stronger border-grey-lighter"
      }

      switch (bg) {
        case "white":
          // Le composant s'affiche sur fond blanc - le champ doit être grey-lighter
          return "bg-grey-lighter text-black border-grey-lighter hover:border-black focus:border-black"
        case "black":
          // Le composant s'affiche sur fond noir - le champ doit être white
          return "bg-white text-black border-grey-strongest hover:border-white focus:border-white"
        case "grey":
          // Le composant s'affiche sur fond gris - le champ doit être blanc
          return "bg-white text-black border-grey-stronger hover:border-black focus:border-black"
        default:
          return "bg-grey-lighter text-black border-grey-lighter hover:border-black focus:border-black"
      }
    }

    // Détermine la couleur de l'icône Search selon le background et l'état focus
    const getSearchIconColor = () => {
      if (disabled) {
        return "text-grey-stronger"
      }

      // Quand le composant a le focus, l'icône Search passe en bg black + fg white
      if (isFocused) {
        return "bg-black text-white"
      }

      // État par défaut selon le background
      switch (bg) {
        case "white":
          return "text-black"
        case "grey":
        case "black":
          return "text-black"
        default:
          return "text-black"
      }
    }

    const handleClear = () => {
      setInternalValue("")
      onClear?.()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value)
      }
      props.onChange?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    return (
      <div className="relative w-full">
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 pointer-events-none rounded-full transition-colors duration-200",
            "flex items-center justify-center",
            getSearchIconColor()
          )}
          style={{ left: '12px', width: '20px', height: '20px' }}
        >
          <Icon name="Search" size="small" className="p-1 w-4 h-4" />
        </div>
        <input
          type="search"
          value={currentValue}
          className={cn(
            // Base styles - même que Select avec rounded-full
            "flex h-8 w-full items-center rounded-full border py-2",
            "text-sm font-light transition-colors duration-200",
            "focus:outline-none focus:ring-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder:text-grey-stronger",
            // Masquer le bouton clear natif du navigateur
            "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
            getBackgroundStyles(),
            className
          )}
          style={{
            paddingLeft: '40px',
            paddingRight: hasValue ? '36px' : '15px'
          }}
          ref={ref}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {hasValue && !disabled && (
          <div className="absolute top-1/2 -translate-y-1/2" style={{ right: '8px' }}>
            <Button
              type="button"
              variant="ghost"
              size="small"
              className="p-0 w-5 h-5 hover:bg-transparent"
              onClick={handleClear}
            >
              <Icon name="X" size="small" className="p-1 w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    )
  }
)
Search.displayName = "Search"

export { Search }
