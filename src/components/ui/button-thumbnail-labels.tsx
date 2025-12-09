import * as React from "react"
import { Toggle, ToggleProps } from "@/components/ui/toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBgContext } from "@/components/layout/BgContext"
import { useIsInActionBar } from "@/components/layout/ActionBar"
import { VStack } from "@/components/layout"
import { cn } from "@/lib/utils"

export type LabelColor = "blue" | "green" | "orange" | "pink" | "purple" | "red" | "yellow" | "white" | null

export interface ButtonThumbnailLabelsProps extends Omit<ToggleProps, "onClick" | "isActive" | "value"> {
  /** Couleur du label sélectionnée (null pour transparent) */
  value?: LabelColor
  /** Callback appelé lorsqu'une couleur est sélectionnée */
  onClick?: (value: LabelColor) => void
  /** Callback appelé lorsque le bouton reçoit le focus */
  onFocus?: React.FocusEventHandler<HTMLButtonElement>
  /** Callback appelé lorsque le bouton perd le focus */
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
  /**
   * État contrôlé d'ouverture du menu.
   * 
   * **Mode contrôlé** : Lorsque cette prop est fournie, le composant devient contrôlé et utilise cette valeur pour déterminer l'état d'ouverture.
   * Vous devez gérer l'état dans le composant parent et utiliser `onOpenChange` pour mettre à jour cet état.
   * 
   * **Mode non contrôlé** : Lorsque cette prop n'est pas fournie, le composant gère son propre état interne.
   * Dans ce cas, utilisez `defaultOpen` pour définir l'état initial.
   */
  open?: boolean
  /**
   * État initial d'ouverture du menu (mode non contrôlé uniquement).
   * 
   * Cette prop n'est utilisée que lorsque `open` n'est pas fournie.
   * Elle définit l'état initial du menu lors du montage du composant.
   * 
   * Par défaut : `false` (menu fermé)
   */
  defaultOpen?: boolean
  /**
   * Callback appelé lorsque l'état d'ouverture du menu change.
   * 
   * Cette fonction est appelée chaque fois que l'état d'ouverture change (ouverture ou fermeture),
   * que le composant soit en mode contrôlé ou non contrôlé.
   * 
   * En mode contrôlé, vous devez utiliser ce callback pour mettre à jour l'état `open`.
   * 
   * @param open - Nouvel état d'ouverture (`true` = ouvert, `false` = fermé)
   */
  onOpenChange?: (open: boolean) => void
  debug?: boolean
  /**
   * Hauteur maximale du menu déroulant.
   * Par défaut : `max-h-[calc(100vh-2rem)]` pour s'adapter à l'espace disponible.
   */
  menuMaxHeight?: string
  /**
   * Côté préféré du déclencheur où le menu doit s'ouvrir.
   * Le menu s'ajustera automatiquement s'il n'y a pas assez d'espace.
   * 
   * Par défaut : `"bottom"` (menu s'ouvre en dessous du bouton)
   */
  menuSide?: "top" | "right" | "bottom" | "left"
  /**
   * Alignement préféré du menu par rapport au déclencheur.
   * Le menu s'ajustera automatiquement s'il n'y a pas assez d'espace.
   * 
   * Par défaut : `"start"` (menu aligné à gauche)
   */
  menuAlign?: "start" | "center" | "end"
}

// Définition des couleurs disponibles dans l'ordre de la grille (3x3)
const LABEL_COLORS: Array<{ value: LabelColor; label: string; cssVar: string }> = [
  { value: null, label: "Aucune couleur", cssVar: "transparent" }, // Transparent avec bordure pointillée
  { value: "blue", label: "Bleu", cssVar: "var(--label-blue)" },
  { value: "green", label: "Vert", cssVar: "var(--label-green)" },
  { value: "orange", label: "Orange", cssVar: "var(--label-orange)" },
  { value: "pink", label: "Rose", cssVar: "var(--label-pink)" },
  { value: "purple", label: "Violet", cssVar: "var(--label-purple)" },
  { value: "red", label: "Rouge", cssVar: "var(--label-red)" },
  { value: "yellow", label: "Jaune", cssVar: "var(--color-yellow)" },
  { value: "white", label: "Blanc", cssVar: "var(--label-white)" },
]

export const ButtonThumbnailLabels = React.forwardRef<HTMLButtonElement, ButtonThumbnailLabelsProps>(
  (
    {
      value = null,
      className,
      disabled,
      onClick,
      onFocus,
      onBlur,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      debug = false,
      menuMaxHeight = "max-h-[calc(100vh-2rem)]",
      menuSide = "bottom",
      menuAlign = "start",
      ...buttonProps
    },
    ref
  ) => {
    const bg = useBgContext()
    const isInActionBar = useIsInActionBar()
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    
    // Extraire size de buttonProps
    const size = buttonProps.size || "medium"
    
    // Mode contrôlé si open est fourni, sinon mode non-contrôlé
    const isControlled = openProp !== undefined
    const isOpen = isControlled ? openProp : internalOpen

    const handleOpenChange = React.useCallback(
      (open: boolean) => {
        if (!isControlled) {
          setInternalOpen(open)
        }
        onOpenChange?.(open)
      },
      [isControlled, onOpenChange]
    )

    // Couleur de fond du menu selon data-bg
    const effectiveBg = isInActionBar ? "white" : bg
    const getMenuBackgroundClass = () => {
      switch (effectiveBg) {
        case "white":
        case "grey":
          return "bg-black"
        case "black":
          return "bg-black-secondary"
        default:
          return "bg-black"
      }
    }

    // Dans ActionBar, forcer l'ouverture vers le haut
    const effectiveMenuSide = isInActionBar ? "top" : menuSide
    
    const getSideOffset = () => {
      if (isInActionBar) {
        return 15
      }
      return 5
    }

    // Déterminer les dimensions du bouton selon le size
    const buttonSizeClasses = size === "small" ? "p-1 w-5 h-4" : size === "large" ? "p-0 w-10 h-8" : "p-0 w-8 h-6"
    const colorSize = size === "small" ? 10 : size === "large" ? 14 : 12

    // Gérer le clic sur une couleur
    const handleColorClick = React.useCallback(
      (colorValue: LabelColor) => {
        if (debug) {
          console.log("[ButtonThumbnailLabels] Color clicked:", colorValue)
        }
        onClick?.(colorValue)
        handleOpenChange(false)
      },
      [debug, onClick, handleOpenChange]
    )

    // Rendre une couleur pour le menu
    const renderColorSwatch = (color: LabelColor, cssVar: string, size: number) => {
      if (color === null) {
        // Transparent avec bordure pointillée
        return (
          <div
            className="rounded-sm border border-dotted border-white/50"
            style={{
              width: `${size}px`,
              height: `${size * 0.8}px`,
              backgroundColor: "transparent",
              borderWidth: "1px",
            }}
          />
        )
      }
      return (
        <div
          className="rounded-sm border border-transparent"
          style={{
            width: `${size}px`,
            height: `${size * 0.8}px`,
            backgroundColor: cssVar,
            borderWidth: "1px",
          }}
        />
      )
    }

    // Contenu du bouton (menu fermé) - affiche la couleur actuelle
    const buttonContent = React.useMemo(() => {
      const currentColor = LABEL_COLORS.find((c) => c.value === value)
      if (!currentColor || currentColor.value === null) {
        // Si pas de couleur définie, afficher transparent avec bordure pointillée
        // Utiliser une couleur de bordure qui s'adapte au contexte bg
        const borderColorClass = bg === "black" 
          ? "border-white/50" 
          : bg === "grey"
          ? "border-black/50"
          : "border-black/50"
        
        return (
          <div
            className={cn("rounded-sm border border-dotted", borderColorClass)}
            style={{
              width: `${colorSize}px`,
              height: `${colorSize * 0.8}px`,
              backgroundColor: "transparent",
              borderWidth: "1px",
            }}
          />
        )
      }
      // Afficher la couleur sélectionnée sans bordure visible
      return (
        <div
          className="rounded-sm border border-transparent"
          style={{
            width: `${colorSize}px`,
            height: `${colorSize * 0.8}px`,
            backgroundColor: currentColor.cssVar,
            borderWidth: "1px",
          }}
        />
      )
    }, [value, colorSize, bg])

    React.useEffect(() => {
      if (debug) {
        console.log("[ButtonThumbnailLabels] State changed", {
          bg,
          isOpen,
          value,
        })
      }
    }, [debug, isOpen, bg, value])

    return (
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Toggle
            ref={ref}
            disabled={disabled}
            className={cn(buttonSizeClasses, className)}
            isActive={isOpen}
            onClick={(e) => {
              e.preventDefault()
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            {...buttonProps}
          >
            {buttonContent}
          </Toggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn(
            "rounded-sm border-0 popup-action overflow-y-auto",
            menuMaxHeight,
            getMenuBackgroundClass()
          )}
          align={menuAlign}
          side={effectiveMenuSide}
          sideOffset={getSideOffset()}
          collisionPadding={8}
          data-bg={effectiveBg || undefined}
        >
          <VStack gap={2} padding={2}>
            {/* Grille 3x3 des couleurs */}
            <div className="grid grid-cols-3 gap-2">
              {LABEL_COLORS.map((colorOption) => (
                <DropdownMenuItem
                  key={colorOption.value ?? "transparent"}
                  disabled={disabled}
                  className={cn(
                    "w-full h-auto p-0 text-left rounded-sm cursor-pointer",
                    "flex items-center justify-center",
                    "bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent",
                    "data-[highlighted]:bg-transparent",
                    "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (debug) {
                      console.log("[ButtonThumbnailLabels] Color option clicked:", colorOption.value)
                    }
                    handleColorClick(colorOption.value)
                  }}
                >
                  {renderColorSwatch(colorOption.value, colorOption.cssVar, colorSize)}
                </DropdownMenuItem>
              ))}
            </div>
          </VStack>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

ButtonThumbnailLabels.displayName = "ButtonThumbnailLabels"

