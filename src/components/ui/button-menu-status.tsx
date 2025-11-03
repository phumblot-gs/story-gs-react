import * as React from "react"
import { Toggle, ToggleProps } from "@/components/ui/toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBgContext } from "@/components/layout/BgContext"
import { VStack } from "@/components/layout"
import { Icon } from "@/components/ui/icons"
import MediaStatus from "@/components/MediaStatus"
import { MediaStatus as MediaStatusEnum } from "@/utils/mediaStatus"
import { cn } from "@/lib/utils"

export interface ButtonMenuStatusOption {
  status: MediaStatusEnum
  label: string
  disabled?: boolean
}

export interface ButtonMenuStatusProps extends Omit<ToggleProps, "onClick" | "isActive" | "children"> {
  currentStatus: MediaStatusEnum
  statusOptions: ButtonMenuStatusOption[]
  onOpenChange?: (open: boolean) => void
  debug?: boolean
  /**
   * Hauteur maximale du menu déroulant.
   * Par défaut: `max-h-[calc(100vh-2rem)]` pour s'adapter à l'espace disponible.
   * Vous pouvez personnaliser avec des classes Tailwind comme `max-h-[40vh]`, `max-h-96`, etc.
   * Le menu activera automatiquement le scroll vertical si le contenu dépasse cette hauteur.
   */
  menuMaxHeight?: string
}

export const ButtonMenuStatus = React.forwardRef<HTMLButtonElement, ButtonMenuStatusProps>(
  (
    {
      currentStatus,
      statusOptions,
      className,
      disabled,
      onOpenChange,
      debug = false,
      menuMaxHeight = "max-h-[calc(100vh-2rem)]",
      size = "medium",
      ...buttonProps
    },
    ref
  ) => {
    const bg = useBgContext()
    const [isOpen, setIsOpen] = React.useState(false)

    const handleOpenChange = React.useCallback(
      (open: boolean) => {
        setIsOpen(open)
        onOpenChange?.(open)
      },
      [onOpenChange]
    )

    // Classes pour le toggle selon la taille
    const getToggleClassName = () => {
      switch (size) {
        case "small":
          return "p-1 w-4 h-4"
        case "medium":
          return "p-0 w-6 h-6"
        case "large":
          return "p-0 w-8 h-8"
        default:
          return "p-0 w-6 h-6"
      }
    }

    // Taille de l'icône selon la taille du toggle
    const getIconSize = () => {
      switch (size) {
        case "small":
          return 10
        case "medium":
          return 12
        case "large":
          return 14
        default:
          return 12
      }
    }

    // Couleur de fond du menu selon data-bg
    const getMenuBackgroundClass = () => {
      switch (bg) {
        case "white":
        case "grey":
          return "bg-black"
        case "black":
          return "bg-black-secondary"
        default:
          return "bg-black"
      }
    }

    // Debug log uniquement quand isOpen change pour éviter les doubles logs
    React.useEffect(() => {
      if (debug) {
        console.log("[ButtonMenuStatus] State changed", {
          bg,
          isOpen,
          currentStatus,
          statusOptionsCount: statusOptions.length,
        })
      }
    }, [debug, isOpen, bg, currentStatus, statusOptions.length])

    return (
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Toggle
            ref={ref}
            disabled={disabled}
            className={cn(getToggleClassName(), className)}
            isActive={isOpen}
            size={size}
            {...buttonProps}
            onClick={(e) => {
              // Empêcher l'action onClick par défaut du Toggle
              e.preventDefault()
            }}
          >
            <Icon name="Status" size={getIconSize()} />
          </Toggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn(
            "min-w-[8rem] rounded-sm border-0 popup-action overflow-y-auto",
            menuMaxHeight,
            getMenuBackgroundClass()
          )}
          align="start"
          sideOffset={5}
          collisionPadding={8}
          data-bg={bg || undefined}
        >
          <VStack gap={2} padding={2}>
            {statusOptions.map((option, index) => (
              <DropdownMenuItem
                key={index}
                disabled={option.disabled || disabled}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm whitespace-nowrap rounded-sm cursor-pointer popup-action-item"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  if (debug) {
                    console.log("[ButtonMenuStatus] Status clicked:", option.status, option.label)
                  }
                  handleOpenChange(false)
                }}
              >
                <div className="flex items-center gap-2">
                  <MediaStatus status={option.status} width={12} height={3} />
                  <span>{option.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </VStack>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

ButtonMenuStatus.displayName = "ButtonMenuStatus"

