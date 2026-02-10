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
import { Icon } from "@/components/ui/icons"

export interface ButtonThumbnailStarsProps extends Omit<ToggleProps, "onClick" | "isActive"> {
  /** Nombre d'étoiles sélectionnées (0 à 5) */
  value?: number
  /** Callback appelé lorsqu'une étoile est sélectionnée */
  onClick?: (value: number) => void
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
  /**
   * Mode d'affichage du menu
   * - `false` (défaut) : Menu normal avec labels à côté des étoiles
   * - `true` : Menu compact (grille 2x3 sans labels)
   */
  compact?: boolean
  /**
   * Contexte de fond forcé pour le menu uniquement.
   * Si défini, le menu utilise ces couleurs comme s'il était sur ce fond (ex. toujours fond clair).
   * Le bouton continue d'utiliser le bgContext du parent.
   */
  menuBgContext?: "white" | "grey" | "black"
}

export const ButtonThumbnailStars = React.forwardRef<HTMLButtonElement, ButtonThumbnailStarsProps>(
  (
    {
      value = 0,
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
      compact = false,
      menuBgContext,
      ...buttonProps
    },
    ref
  ) => {
    const bg = useBgContext()
    const isInActionBar = useIsInActionBar()
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    
    // Extraire size de buttonProps
    const size = buttonProps.size || "medium"
    
    // Normaliser value entre 0 et 5
    const normalizedValue = Math.max(0, Math.min(5, Math.floor(value)))
    
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

    // Contexte du bouton : suit le parent (pas de data-bg sur le bouton, il hérite)
    // Contexte du menu : menuBgContext si fourni, sinon même logique qu'avant
    const effectiveBg = isInActionBar ? "white" : bg
    const menuEffectiveBg = menuBgContext ?? effectiveBg
    const getMenuBackgroundClass = (menuBg: typeof menuEffectiveBg) => {
      switch (menuBg) {
        case "white":
        case "grey":
          return "bg-black"
        case "black":
          return "bg-white"
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
    // - small: p-1 w-4 h-4 + icon size={10}
    // - medium: p-0 w-6 h-6 + icon size={12}
    // - large: p-0 w-8 h-8 + icon size={14}
    const buttonSizeClasses = size === "small" ? "p-1 w-5 h-4" : size === "large" ? "p-0 w-10 h-8" : "p-0 w-8 h-6"
    const iconSize = size === "small" ? 10 : size === "large" ? 14 : 12
    const gapClass = size === "small" ? "gap-[1px]" : size === "large" ? "gap-[3px]" : "gap-[2px]"

    // Créer les actions prédéfinies (0 à 5 étoiles)
    const starActions = React.useMemo(() => {
      return Array.from({ length: 6 }, (_, index) => ({
        value: index,
        label: `${index}`,
      }))
    }, [])

    // Gérer le clic sur une étoile
    const handleStarClick = React.useCallback(
      (starValue: number) => {
        if (debug) {
          console.log("[ButtonThumbnailStars] Star clicked:", starValue)
        }
        onClick?.(starValue)
        handleOpenChange(false)
      },
      [debug, onClick, handleOpenChange]
    )

    // Rendre les étoiles pour le menu : toujours 5 étoiles pleines (jaunes pour la valeur, noires pour compléter)
    const renderStars = (count: number) => {
      return (
        <div className={cn("flex items-center", gapClass)}>
          {Array.from({ length: 5 }).map((_, index) => {
            const isFilled = index < count
            return (
              <Icon
                key={index}
                name="StarFilled"
                size={iconSize}
                className={isFilled ? "text-yellow" : "text-black"}
              />
            )
          })}
        </div>
      )
    }

    // Contenu du bouton (menu fermé)
    const buttonContent = React.useMemo(() => {
      const textSizeClass = size === "small" ? "text-[9px] mt-0.5" : "text-xs"
      if (normalizedValue === 0) {
        // Si 0 étoile, afficher une étoile vide sans numéro
        return <Icon name="Star" size={iconSize} />
      }
      // Sinon, afficher une étoile et le nombre
      return (
        <div className={"flex items-center" + (size === "small" ? "" : " gap-1")}>
          <span className="text-yellow">
            <Icon name="StarFilled" size={iconSize} className="mt-0.5" />
          </span>
          <span className={textSizeClass}>{normalizedValue}</span>
        </div>
      )
    }, [normalizedValue, iconSize, size])

    React.useEffect(() => {
      if (debug) {
        console.log("[ButtonThumbnailStars] State changed", {
          bg,
          isOpen,
          value: normalizedValue,
        })
      }
    }, [debug, isOpen, bg, normalizedValue])

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
            data-open={isOpen ? "true" : "false"}
          >
            {buttonContent}
          </Toggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn(
            "rounded-sm border-0 overflow-y-auto",
            menuMaxHeight,
            getMenuBackgroundClass(menuEffectiveBg)
          )}
          align={menuAlign}
          side={effectiveMenuSide}
          sideOffset={getSideOffset()}
          collisionPadding={8}
        >
          <div className="popup-action w-full h-full" data-bg={menuEffectiveBg || undefined}>
            <VStack gap={2} padding={2}>
            {compact ? (
              /* Menu compact : Grille 2x3 des étoiles avec nombres */
              <div className="grid grid-cols-3 gap-2 justify-items-center">
                {starActions.map((action) => {
                  const isSelected = normalizedValue === action.value
                  return (
                    <DropdownMenuItem
                      key={action.value}
                      disabled={disabled}
                      data-selected={isSelected ? "true" : "false"}
                      className={cn(
                        "w-auto h-auto p-1 gap-1 rounded-full cursor-pointer",
                        "flex flex-row items-center justify-center",
                        "transition-colors",
                        "popup-action-item popup-action-item-menu popup-action-item-stars",
                        isSelected ? "" : "bg-black-secondary/50 hover:bg-black-secondary",
                        "data-[highlighted]:bg-transparent",
                        "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (debug) {
                          console.log("[ButtonThumbnailStars] Action clicked:", action.value)
                        }
                        handleStarClick(action.value)
                      }}
                    >
                      <span className={(action.value === 0 ? "text-black" : "text-yellow") + " inline-flex"}>
                        <Icon name="StarFilled" size={iconSize} />
                      </span>
                      <span className="text-sm leading-none label-menu-text">{action.label}</span>
                    </DropdownMenuItem>
                  )
                })}
              </div>
            ) : (
              /* Menu normal : Liste verticale avec étoiles et labels */
              <VStack gap={2} padding={0}>
                {starActions.map((action) => {
                  const isSelected = normalizedValue === action.value
                  return (
                    <DropdownMenuItem
                      key={action.value}
                      disabled={disabled}
                      data-selected={isSelected ? "true" : "false"}
                      className={cn(
                        "w-full px-4 h-6 text-left text-sm whitespace-nowrap rounded-sm cursor-pointer popup-action-item popup-action-item-menu popup-action-item-stars",
                        "flex items-center gap-2",
                        "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (debug) {
                          console.log("[ButtonThumbnailStars] Action clicked:", action.value)
                        }
                        handleStarClick(action.value)
                      }}
                    >
                      <span className="flex-shrink-0 flex items-center justify-center">
                        {renderStars(action.value)}
                      </span>
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0 label-menu-text">
                        {action.label}
                      </span>
                    </DropdownMenuItem>
                  )
                })}
              </VStack>
            )}
          </VStack>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

ButtonThumbnailStars.displayName = "ButtonThumbnailStars"

