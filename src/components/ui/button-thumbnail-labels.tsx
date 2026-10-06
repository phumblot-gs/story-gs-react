import * as React from "react"
import { Toggle, ToggleProps } from "@/components/ui/toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBgContext, BgProvider } from "@/components/layout/BgContext"
import { useIsInActionBar } from "@/components/layout/ActionBar"
import { VStack } from "@/components/layout"
import { cn } from "@/lib/utils"
import { useTranslationSafe, TranslationMap } from "@/contexts/TranslationContext"

export type LabelColor = "blue" | "green" | "orange" | "pink" | "purple" | "red" | "yellow" | "white" | "transparent"

export interface ButtonThumbnailLabelsProps extends Omit<ToggleProps, "onClick" | "isActive" | "value"> {
  /** Couleur du label sélectionnée */
  value?: LabelColor
  /** Callback appelé lorsqu'une couleur est sélectionnée */
  onClick?: (value: LabelColor) => void
  /** Callback appelé lorsque le bouton reçoit le focus */
  onFocus?: React.FocusEventHandler<HTMLButtonElement>
  /** Callback appelé lorsque le bouton perd le focus */
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
  /**
   * Mode d'affichage du menu
   * - `false` (défaut) : Menu normal avec labels à côté des couleurs
   * - `true` : Menu compact (grille 3x3 sans labels)
   */
  compact?: boolean
  /**
   * Mode d'affichage du bouton déclencheur. Le menu n'est pas affecté.
   *
   * - `"value"` (défaut) : le bouton affiche la couleur courante — pastille de la
   *   couleur, ou rectangle pointillé si aucune. C'est l'usage vignette, où voir la
   *   couleur de la photo est toute la fonction du bouton.
   * - `"neutral"` : le bouton reprend le dessin et les couleurs de
   *   `ButtonMenuStatus` — rond aux mêmes dimensions, `variant="secondary"` par
   *   défaut, et le **rectangle à bordure pointillée** « pas de couleur » à la place
   *   de la valeur : c'est le vocabulaire déjà utilisé par la librairie pour une
   *   pastille sans valeur, et la même forme que les pastilles du menu. Pour une
   *   barre d'action qui pose une couleur sur une sélection potentiellement
   *   hétérogène : afficher une pastille colorée laisserait croire à un état commun
   *   à toute la sélection.
   *
   * `value` continue de servir dans les deux modes à cocher la bonne ligne du menu.
   */
  buttonDisplay?: "value" | "neutral"
  /**
   * Traductions personnalisées pour les noms de couleurs
   * Format : { [key]: { FR: string, EN: string, ... } }
   * Clés disponibles : 'label.none', 'label.blue', 'label.green', 'label.orange', 'label.pink', 'label.purple', 'label.red', 'label.yellow', 'label.white'
   */
  translations?: Partial<TranslationMap>
  /**
   * Langue personnalisée (code ISO, ex: 'FR', 'EN')
   * Si non fournie, utilise la langue du TranslationProvider ou 'EN' par défaut
   */
  language?: string
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
   * Contexte de fond forcé pour le menu uniquement.
   * Si défini, le menu utilise ces couleurs comme s'il était sur ce fond (ex. toujours fond clair).
   * Le bouton continue d'utiliser le bgContext du parent.
   */
  menuBgContext?: "white" | "grey" | "black"
}

// Définition des couleurs disponibles dans l'ordre de la grille (3x3)
const LABEL_COLORS: Array<{ value: LabelColor; translationKey: string; cssVar: string }> = [
  { value: "transparent", translationKey: "label.none", cssVar: "transparent" }, // Transparent avec bordure pointillée
  { value: "blue", translationKey: "label.blue", cssVar: "var(--label-blue)" },
  { value: "green", translationKey: "label.green", cssVar: "var(--label-green)" },
  { value: "orange", translationKey: "label.orange", cssVar: "var(--label-orange)" },
  { value: "pink", translationKey: "label.pink", cssVar: "var(--label-pink)" },
  { value: "purple", translationKey: "label.purple", cssVar: "var(--label-purple)" },
  { value: "red", translationKey: "label.red", cssVar: "var(--label-red)" },
  { value: "yellow", translationKey: "label.yellow", cssVar: "var(--color-yellow)" },
  { value: "white", translationKey: "label.white", cssVar: "var(--label-white)" },
]

/**
 * Rectangle à bordure pointillée de la face du bouton : le vocabulaire de la librairie
 * pour « une pastille de couleur sans valeur », à la même forme que les pastilles du menu.
 *
 * Partagé par la branche « pas de couleur définie » et par le mode neutre, qui n'affiche
 * jamais la valeur. Un seul rendu, pour que les deux ne puissent pas diverger.
 *
 * Défini au niveau module : il ne dépend que de sa taille, donc il ne réinvalide pas le
 * `useMemo` du contenu du bouton.
 */
const renderEmptySwatch = (swatchSize: number) => (
  <div
    className="border border-dotted border-adaptive"
    style={{
      width: `${swatchSize}px`,
      height: `${swatchSize * 0.7}px`,
      backgroundColor: "transparent",
      borderWidth: "1px",
    }}
  />
)

export const ButtonThumbnailLabels = React.forwardRef<HTMLButtonElement, ButtonThumbnailLabelsProps>(
  (
    {
      value = "transparent",
      className,
      disabled,
      onClick,
      onFocus,
      onBlur,
      compact = false,
      buttonDisplay = "value",
      variant,
      translations,
      language,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      debug = false,
      menuMaxHeight = "max-h-[calc(100vh-2rem)]",
      menuSide = "bottom",
      menuAlign = "start",
      menuBgContext,
      ...buttonProps
    },
    ref
  ) => {
    const bg = useBgContext()
    const isInActionBar = useIsInActionBar()
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    
    // Utiliser useTranslationSafe pour obtenir la fonction de traduction (pattern aligné avec FileBrowser/FolderBrowser)
    const { t } = useTranslationSafe(translations, language)
    
    // Extraire size de buttonProps
    const size = buttonProps.size || "medium"
    
    // Mode contrôlé si open est fourni, sinon mode non-contrôlé
    const isControlled = openProp !== undefined
    const isOpen = isControlled ? openProp : internalOpen

    // Normaliser la valeur en minuscules pour les comparaisons (case-insensitive)
    const normalizedValue = value?.toLowerCase() as LabelColor

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

    // Mode neutre : le déclencheur reprend la recette exacte de ButtonMenuStatus
    // (rond, mêmes dimensions, mêmes couleurs), seule l'icône change.
    const isNeutralButton = buttonDisplay === "neutral"

    // Déterminer les dimensions du bouton selon le size
    // - mode "value" : plus large que haut, il faut la place pour la pastille
    // - mode "neutral" : carré, dimensions identiques à ButtonMenuStatus
    //   (small: p-1 w-4 h-4, medium: p-0 w-6 h-6, large: p-0 w-8 h-8)
    const valueButtonSizeClasses = size === "small" ? "p-1 w-5 h-4" : size === "large" ? "p-0 w-10 h-8" : "p-0 w-8 h-6"
    const neutralButtonSizeClasses = size === "small" ? "p-1 w-4 h-4" : size === "large" ? "p-0 w-8 h-8" : "p-0 w-6 h-6"
    const buttonSizeClasses = isNeutralButton ? neutralButtonSizeClasses : valueButtonSizeClasses
    // 10 / 12 / 14 : les tailles d'icône de ButtonMenuStatus.getIconSize(). En mode
    // neutre le rectangle pointillé occupe donc exactement la place qu'y prend l'icône
    // du bouton statut, dans un rond de mêmes dimensions.
    const colorSize = size === "small" ? 10 : size === "large" ? 14 : 12

    // Couleurs : dans les barres d'action, ButtonMenuStatus est appelé en
    // `variant="secondary"` là où ce bouton tomberait sur "normal". En mode neutre on
    // prend donc "secondary" par défaut pour que les deux boutons soient identiques
    // sans que l'appelant ait à le savoir, tout en restant surchargeable.
    const effectiveVariant = isNeutralButton ? variant ?? "secondary" : variant

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

    // Rendre une couleur pour le menu. En mode compact : cercle avec fond. En mode normal : rectangle seul (sans disque).
    const renderColorSwatch = (color: LabelColor, cssVar: string, size: number, isSelected: boolean, compactMode: boolean) => {
      const colorInnerSize = size
      const circleSize = 24

      if (color === "transparent") {
        const transparentRect = (
          <div
            className={`border border-dotted border-adaptive ${isSelected ? "border-black hover:border-black" : "hover:border-black"}`}
            style={{
              width: `${colorInnerSize}px`,
              height: `${colorInnerSize * 0.7}px`,
              backgroundColor: "transparent",
              borderWidth: "1px",
            }}
          />
        )
        if (!compactMode) return transparentRect
        return (
          <div
            className={cn(
              "rounded-full flex items-center justify-center",
              menuEffectiveBg === "black" ? "bg-grey hover:bg-white" : "bg-black-secondary/50 hover:bg-white",
              isSelected && "bg-white"
            )}
            style={{ width: `${circleSize}px`, height: `${circleSize}px` }}
          >
            {transparentRect}
          </div>
        )
      }

      const colorRect = (
        <div
          style={{
            width: `${colorInnerSize}px`,
            height: `${colorInnerSize * 0.7}px`,
            backgroundColor: cssVar,
          }}
        />
      )
      if (!compactMode) return colorRect
      return (
        <div
          className={cn(
            "rounded-full flex items-center justify-center",
            menuEffectiveBg === "black" ? "bg-grey hover:bg-white" : "bg-black-secondary/50 hover:bg-white",
            isSelected && "bg-white"
          )}
          style={{ width: `${circleSize}px`, height: `${circleSize}px` }}
        >
          {colorRect}
        </div>
      )
    }

    // Contenu du bouton (menu fermé) - affiche la couleur actuelle
    const buttonContent = React.useMemo(() => {
      // Mode neutre : la valeur ne pilote jamais la face du bouton. On réutilise le
      // rectangle pointillé « pas de couleur » — même rendu que la branche ci-dessous.
      if (isNeutralButton) {
        return renderEmptySwatch(colorSize)
      }
      const currentColor = LABEL_COLORS.find((c) => c.value === normalizedValue)
      if (!currentColor || currentColor.value === "transparent") {
        // Si pas de couleur définie, afficher transparent avec bordure pointillée
        // La bordure s'adapte automatiquement au hover et à l'état ouvert via CSS
        return renderEmptySwatch(colorSize)
      }
      // Afficher la couleur sélectionnée sans bordure visible
      return (
        <div
          className="border border-transparent"
          style={{
            width: `${colorSize}px`,
            height: `${colorSize * 0.7}px`,
            backgroundColor: currentColor.cssVar,
            borderWidth: "1px",
          }}
        />
      )
    }, [isNeutralButton, normalizedValue, colorSize, bg])

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
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange} modal={false}>
        <DropdownMenuTrigger asChild>
          <Toggle
            ref={ref}
            disabled={disabled}
            className={cn(buttonSizeClasses, className)}
            isActive={isOpen}
            variant={effectiveVariant}
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
            "border-0 overflow-y-auto",
            menuMaxHeight,
            getMenuBackgroundClass(menuEffectiveBg)
          )}
          align={menuAlign}
          side={effectiveMenuSide}
          sideOffset={getSideOffset()}
          collisionPadding={8}
        >
          <BgProvider value={menuEffectiveBg}>
          <div className="popup-action w-full h-full" data-bg={menuEffectiveBg || undefined}>
            <VStack gap={2} padding={2}>
            {compact ? (
              /* Menu compact : Grille 3x3 des couleurs sans labels */
              <div className="grid grid-cols-3 gap-2 justify-items-center">
                {LABEL_COLORS.map((colorOption) => {
                  const isSelected = normalizedValue === colorOption.value
                  return (
                    <DropdownMenuItem
                      key={colorOption.value ?? "transparent"}
                      disabled={disabled}
                      className={cn(
                        "w-auto h-auto p-0 rounded-full cursor-pointer",
                        "flex items-center justify-center",
                        "popup-action-item popup-action-item-menu popup-action-item-compact popup-action-item-labels",
                        "bg-transparent",
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
                      {renderColorSwatch(colorOption.value, colorOption.cssVar, colorSize, isSelected, true)}
                    </DropdownMenuItem>
                  )
                })}
              </div>
            ) : (
              /* Menu normal : Liste verticale avec labels */
              <VStack gap={2} padding={0}>
                {LABEL_COLORS.map((colorOption) => {
                  const isSelected = normalizedValue === colorOption.value
                  const labelText = t(colorOption.translationKey)
                  return (
                    <DropdownMenuItem
                      key={colorOption.value ?? "transparent"}
                      disabled={disabled}
                      data-selected={isSelected ? "true" : "false"}
                      className={cn(
                        "w-full px-4 h-6 text-left text-sm whitespace-nowrap rounded-sm cursor-pointer popup-action-item popup-action-item-menu popup-action-item-labels",
                        "flex items-center gap-2",
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
                      <span className="flex-shrink-0 flex items-center justify-center">
                        {renderColorSwatch(colorOption.value, colorOption.cssVar, colorSize, isSelected, false)}
                      </span>
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0 label-menu-text">
                        {labelText}
                      </span>
                    </DropdownMenuItem>
                  )
                })}
              </VStack>
            )}
          </VStack>
          </div>
          </BgProvider>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

ButtonThumbnailLabels.displayName = "ButtonThumbnailLabels"

