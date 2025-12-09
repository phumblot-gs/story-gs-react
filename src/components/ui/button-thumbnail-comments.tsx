import * as React from "react"
import { Toggle, ToggleProps } from "@/components/ui/toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBgContext } from "@/components/layout/BgContext"
import { useIsInActionBar } from "@/components/layout/ActionBar"
import { VStack } from "@/components/layout"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icons"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export interface CommentData {
  type: string
  picture_id: number
  source_picture_id: number
  login: string
  firstname: string
  lastname: string
  date: string
  benchsteptype: number
  comment: string
  avatar: string
  access: string
  versionIndex: number
}

export interface ButtonThumbnailCommentsProps extends Omit<ToggleProps, "onClick" | "isActive" | "value"> {
  /** Tableau des commentaires */
  value?: CommentData[]
  /** Callback appelé lorsqu'un commentaire est ajouté */
  onAddComment?: (comment: string) => void
  /** Titre optionnel affiché dans le menu */
  title?: string
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

export const ButtonThumbnailComments = React.forwardRef<HTMLButtonElement, ButtonThumbnailCommentsProps>(
  (
    {
      value = [],
      className,
      disabled,
      onAddComment,
      title,
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
    const [newComment, setNewComment] = React.useState("")
    
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
    const iconSize = size === "small" ? 10 : size === "large" ? 14 : 12

    // Compter les commentaires de type "Comment"
    const commentCount = React.useMemo(() => {
      return value.filter((comment) => comment.type === "Comment").length
    }, [value])

    // Vérifier s'il y a au moins un commentaire de type "Comment"
    const hasComments = commentCount > 0

    // Gérer l'ajout d'un commentaire
    const handleAddComment = React.useCallback(
      (e: React.FormEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const trimmedComment = newComment.trim()
        if (trimmedComment && onAddComment) {
          if (debug) {
            console.log("[ButtonThumbnailComments] Comment added:", trimmedComment)
          }
          onAddComment(trimmedComment)
          setNewComment("")
          handleOpenChange(false)
        }
      },
      [newComment, debug, onAddComment, handleOpenChange]
    )

    // Contenu du bouton (menu fermé)
    const buttonContent = React.useMemo(() => {
      return (
        <div className="relative">
          <Icon name="Comment" size={iconSize} />
          {hasComments && (
            <span className="absolute bottom-0 right-0 w-[7px] h-[7px] rounded-full bg-yellow" />
          )}
        </div>
      )
    }, [iconSize, hasComments])

    React.useEffect(() => {
      if (debug) {
        console.log("[ButtonThumbnailComments] State changed", {
          bg,
          isOpen,
          value,
          commentCount,
        })
      }
    }, [debug, isOpen, bg, value, commentCount])

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
            "rounded-sm border-0 popup-action overflow-y-auto w-[320px]",
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
            {/* Titre optionnel */}
            {title && (
              <div className="px-2 py-1">
                <span className="text-sm text-white font-medium">{title}</span>
              </div>
            )}

            {/* Formulaire pour ajouter un commentaire */}
            {onAddComment && (
              <form 
                onSubmit={handleAddComment} 
                className={cn("mt-1", title ? "" : "pt-1")}
                onClick={(e) => e.stopPropagation()}
              >
                <VStack gap={2} align="end">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire"
                    disabled={disabled}
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button
                    type="submit"
                    size="small"
                    variant="normal"
                    disabled={disabled || !newComment.trim()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Valider
                  </Button>
                </VStack>
              </form>
            )}
          </VStack>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

ButtonThumbnailComments.displayName = "ButtonThumbnailComments"

