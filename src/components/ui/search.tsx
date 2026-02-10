import * as React from "react"
import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"
import { Icon } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"

export interface SearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void
  /** Classes CSS pour le conteneur wrapper */
  containerClassName?: string
  /**
   * Si true, le champ s'élargit automatiquement selon le contenu saisi.
   * Défaut: false.
   * En mode textarea, la largeur suit la ligne la plus longue.
   */
  growWithContent?: boolean
  /** Largeur minimale (ex: "120px", 120). Pris en compte au démarrage et pour la croissance. */
  minWidth?: string | number
  /** Largeur maximale (ex: "400px", 400). Le champ ne dépasse pas cette largeur quand growWithContent est true. */
  maxWidth?: string | number
  /** Nombre maximum de lignes affichées en mode textarea (après collage avec retours à la ligne). Défaut: 10. */
  maxRows?: number
}

const Search = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, SearchProps>(
  (
    {
      className,
      containerClassName,
      disabled,
      value,
      defaultValue,
      onClear,
      growWithContent = false,
      minWidth,
      maxWidth,
      maxRows = 10,
      ...props
    },
    ref
  ) => {
    const bg = useBgContext()
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    const [isFocused, setIsFocused] = React.useState(false)
    const currentValue = value !== undefined ? value : internalValue
    const hasValue = Boolean(currentValue)
    // Détecter tous les types de retours à la ligne : \n, \r\n, \r
    const hasNewlines = typeof currentValue === 'string' && /\r\n|\r|\n/.test(currentValue)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)
    const mirrorRef = React.useRef<HTMLSpanElement>(null)
    
    // Exposer le ref approprié
    React.useImperativeHandle(ref, () => {
      if (hasNewlines && textareaRef.current) {
        return textareaRef.current as any
      }
      return inputRef.current as any
    }, [hasNewlines])

    // Styles basés sur le Select - même logique avec ajustement selon bg
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
          return "bg-white text-black border-white hover:border-white/50 focus:border-white/50 hover:border-[0.5px] focus:border-[0.5px]"
        case "grey":
          // Le composant s'affiche sur fond gris - bordure invisible (même couleur que bg)
          return "bg-white text-black border-white hover:border-black/50 focus:border-black/50 hover:border-[0.5px] focus:border-[0.5px]"
        default:
          return "bg-grey-lighter text-black border-grey-lighter hover:border-black/50 focus:border-black/50 hover:border-[0.5px] focus:border-[0.5px]"
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value)
      }
      // Type assertion pour compatibilité avec les deux types d'événements
      props.onChange?.(e as React.ChangeEvent<HTMLInputElement>)
    }
    
    // Intercepter le collage pour détecter les retours à la ligne avant qu'ils ne soient supprimés
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData('text')
      
      // Détecter les retours à la ligne dans le texte collé
      if (/\r\n|\r|\n/.test(pastedText)) {
        e.preventDefault()
        
        // Obtenir la position du curseur
        const input = e.currentTarget
        const start = input.selectionStart || 0
        const end = input.selectionEnd || 0
        const currentText = typeof currentValue === 'string' ? currentValue : ''
        
        // Construire la nouvelle valeur avec le texte collé
        const newValue = currentText.slice(0, start) + pastedText + currentText.slice(end)
        
        // Mettre à jour la valeur
        if (value === undefined) {
          setInternalValue(newValue)
        }
        
        // Créer un événement de changement synthétique
        const syntheticEvent = {
          ...e,
          target: { ...input, value: newValue },
          currentTarget: { ...input, value: newValue }
        } as React.ChangeEvent<HTMLInputElement>
        
        props.onChange?.(syntheticEvent)
        
        // Basculer vers textarea en forçant le re-render
        // Le hasNewlines sera mis à jour automatiquement avec la nouvelle valeur
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus()
            // Positionner le curseur à la fin du texte collé
            const newCursorPos = start + pastedText.length
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
          }
        }, 0)
      } else {
        // Pas de retours à la ligne, laisser le comportement par défaut
        props.onPaste?.(e)
      }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true)
      props.onFocus?.(e as React.FocusEvent<HTMLInputElement>)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false)
      props.onBlur?.(e as React.FocusEvent<HTMLInputElement>)
    }

    // Texte utilisé pour mesurer la largeur : valeur entière (input) ou ligne la plus longue (textarea)
    const measureText = React.useMemo(() => {
      const str = typeof currentValue === 'string' ? currentValue : ''
      if (hasNewlines) {
        const lines = str.split(/\r\n|\r|\n/)
        return lines.reduce((longest, line) => (line.length > longest.length ? line : longest), '')
      }
      return str
    }, [currentValue, hasNewlines])

    // Appliquer largeur min/max (normaliser number -> "Npx")
    const minWidthStyle = minWidth != null ? (typeof minWidth === 'number' ? `${minWidth}px` : minWidth) : undefined
    const maxWidthStyle = maxWidth != null ? (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth) : undefined

    // Valeurs numériques en px pour le clamp (quand min/max sont en px)
    const minWidthPx = minWidth != null
      ? (typeof minWidth === 'number' ? minWidth : (typeof minWidth === 'string' && minWidth.endsWith('px') ? parseFloat(minWidth) : null))
      : null
    const maxWidthPx = maxWidth != null
      ? (typeof maxWidth === 'number' ? maxWidth : (typeof maxWidth === 'string' && maxWidth.endsWith('px') ? parseFloat(maxWidth) : null))
      : null

    // Mesurer et appliquer la largeur quand growWithContent est true (clamp entre min et max)
    React.useLayoutEffect(() => {
      if (!growWithContent || !mirrorRef.current) return
      const el = hasNewlines ? textareaRef.current : inputRef.current
      if (!el) return

      if (measureText === '') {
        el.style.width = minWidthStyle ?? ''
        return
      }

      const mirror = mirrorRef.current
      mirror.textContent = measureText
      const rawMeasured = mirror.scrollWidth + (hasNewlines ? 16 : 2)
      let widthPx = rawMeasured
      if (minWidthPx != null) widthPx = Math.max(widthPx, minWidthPx)
      if (maxWidthPx != null) widthPx = Math.min(widthPx, maxWidthPx)
      el.style.width = `${widthPx}px`
    }, [growWithContent, measureText, hasNewlines, minWidthStyle, minWidthPx, maxWidthPx])

    
    // Styles communs pour input et textarea
    const commonStyles = cn(
      // Base styles - même que Select avec rounded-full
      "flex items-center rounded-full border py-1",
      "text-sm font-light transition-colors duration-200",
      "focus:outline-none focus:ring-0",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "placeholder:text-grey-strongest",
      // Padding - toujours pr-6 pour éviter le changement de taille quand le bouton clear apparaît
      "pl-6 pr-6",
      getBackgroundStyles(),
      className
    )
    
    // Styles spécifiques pour textarea (padding droit accru pour la scrollbar)
    const textareaStyles = cn(
      commonStyles,
      "rounded-lg", // Pas rounded-full pour textarea
      "min-h-[2rem] max-h-[10rem] resize-none",
      "items-start py-1", // Ajustement du padding vertical
      "pr-5", // Plus que pr-6 pour laisser la place à la scrollbar
    )

    const sizeStyle: React.CSSProperties = { ...(props.style ?? {}) }
    if (minWidthStyle) sizeStyle.minWidth = minWidthStyle
    if (maxWidthStyle) sizeStyle.maxWidth = maxWidthStyle

    return (
      <div className={cn("relative w-fit", containerClassName)}>
        {/* Miroir invisible pour mesurer la largeur du contenu (même police et padding que l'input) */}
        {growWithContent && (
          <span
            ref={mirrorRef}
            aria-hidden
            className={cn(
              "absolute left-0 top-0 whitespace-pre text-sm font-light pointer-events-none invisible",
              "pl-6 pr-6"
            )}
            style={{ visibility: 'hidden', position: 'absolute', left: -9999 }}
          />
        )}
        {/* Icône Search */}
        <div
          className={cn(
            "absolute pointer-events-none rounded-full transition-colors duration-200 z-10",
            "flex items-center justify-center",
            "w-4 h-4 left-[5px]",
            hasNewlines ? "top-1" : "top-1/2 -translate-y-1/2",
            getSearchIconColor()
          )}
        >
          <Icon name="Search" size={12} />
        </div>
        
        {hasNewlines ? (
          <textarea
            value={currentValue}
            className={textareaStyles}
            style={sizeStyle}
            ref={textareaRef}
            disabled={disabled}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            rows={Math.max(1, Math.min((currentValue as string).split(/\r\n|\r|\n/).length, maxRows))}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            type="search"
            value={currentValue}
            className={cn(
              commonStyles,
              "h-6",
              // Masquer le bouton clear natif du navigateur
              "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
            )}
            style={sizeStyle}
            ref={inputRef}
            disabled={disabled}
            onChange={handleChange}
            onPaste={handlePaste}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        )}
        
        {/* Bouton clear positionné en absolu par rapport au wrapper (décalé à gauche en textarea pour éviter la scrollbar) */}
        {hasValue && !disabled && (
          <div className={cn(
            "absolute flex items-center justify-center z-10",
            hasNewlines ? "right-4 top-1" : "right-1 top-1/2 -translate-y-1/2"
          )}>
            <Button
              type="button"
              variant="ghost"
              size="small"
              className="p-0 w-4 h-4 hover:bg-transparent [&_svg]:h-[10px] [&_svg]:w-[10px]"
              onClick={handleClear}
            >
              <Icon name="X" size={10} />
            </Button>
          </div>
        )}
      </div>
    )
  }
)
Search.displayName = "Search"

export { Search }
