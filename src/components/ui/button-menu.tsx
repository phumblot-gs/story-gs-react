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
import { cn } from "@/lib/utils"

export interface ButtonMenuAction {
  label: string
  onClick: () => void
  disabled?: boolean
}

export interface ButtonMenuProps extends Omit<ToggleProps, "onClick" | "isActive"> {
  actions: ButtonMenuAction[]
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

export const ButtonMenu = React.forwardRef<HTMLButtonElement, ButtonMenuProps>(
  (
    {
      actions,
      children,
      className,
      disabled,
      onOpenChange,
      debug = false,
      menuMaxHeight = "max-h-[calc(100vh-2rem)]",
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

    if (debug) {
      console.log("[ButtonMenu]", {
        bg,
        isOpen,
        actionsCount: actions.length,
        buttonProps,
      })
    }

    return (
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Toggle
            ref={ref}
            disabled={disabled}
            className={className}
            isActive={isOpen}
            {...buttonProps}
            onClick={(e) => {
              // Empêcher l'action onClick par défaut du Toggle
              e.preventDefault()
            }}
          >
            {children}
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
            {actions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                disabled={action.disabled || disabled}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm whitespace-nowrap rounded-sm cursor-pointer popup-action-item"
                )}
                onClick={() => {
                  if (debug) {
                    console.log("[ButtonMenu] Action clicked:", action.label)
                  }
                  action.onClick()
                  handleOpenChange(false)
                }}
              >
                {action.label}
              </DropdownMenuItem>
            ))}
          </VStack>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

ButtonMenu.displayName = "ButtonMenu"

