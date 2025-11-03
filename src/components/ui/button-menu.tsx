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
  icon?: React.ReactNode
}

export interface ButtonMenuProps extends Omit<ToggleProps, "onClick" | "isActive"> {
  actions: ButtonMenuAction[]
  /** Callback called when the button is clicked */
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  /** Callback called when the button receives focus */
  onFocus?: React.FocusEventHandler<HTMLButtonElement>
  /** Callback called when the button loses focus */
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
  /**
   * Controlled open state of the menu.
   * 
   * **Controlled mode**: When this prop is provided, the component becomes controlled and uses this value to determine the open state.
   * You must manage the state in the parent component and use `onOpenChange` to update this state.
   * 
   * **Uncontrolled mode**: When this prop is not provided, the component manages its own internal state.
   * In this case, use `defaultOpen` to set the initial state.
   * 
   * @example
   * // Controlled mode
   * const [open, setOpen] = useState(false);
   * <ButtonMenu open={open} onOpenChange={setOpen} ... />
   * 
   * @example
   * // Uncontrolled mode
   * <ButtonMenu defaultOpen={false} ... />
   */
  open?: boolean
  /**
   * Initial open state of the menu (uncontrolled mode only).
   * 
   * This prop is only used when `open` is not provided.
   * It sets the initial state of the menu when the component mounts.
   * 
   * Default: `false` (menu closed)
   * 
   * @example
   * // Menu open by default
   * <ButtonMenu defaultOpen={true} ... />
   */
  defaultOpen?: boolean
  /**
   * Callback called when the menu open state changes.
   * 
   * This function is called whenever the open state changes (opening or closing),
   * whether the component is in controlled or uncontrolled mode.
   * 
   * In controlled mode, you must use this callback to update the `open` state.
   * 
   * @param open - New open state (`true` = open, `false` = closed)
   * 
   * @example
   * <ButtonMenu 
   *   open={isOpen} 
   *   onOpenChange={(open) => {
   *     setIsOpen(open);
   *     console.log('Menu is now', open ? 'open' : 'closed');
   *   }} 
   * />
   */
  onOpenChange?: (open: boolean) => void
  debug?: boolean
  /**
   * Maximum height of the dropdown menu.
   * Default: `max-h-[calc(100vh-2rem)]` to adapt to available space.
   * You can customize with Tailwind classes like `max-h-[40vh]`, `max-h-96`, etc.
   * The menu will automatically enable vertical scrolling when content exceeds this height.
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
      onClick,
      onFocus,
      onBlur,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      debug = false,
      menuMaxHeight = "max-h-[calc(100vh-2rem)]",
      ...buttonProps
    },
    ref
  ) => {
    const bg = useBgContext()
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    
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
        console.log("[ButtonMenu] State changed", {
          bg,
          isOpen,
          actionsCount: actions.length,
        })
      }
    }, [debug, isOpen, bg, actions.length])

    return (
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Toggle
            ref={ref}
            disabled={disabled}
            className={className}
            isActive={isOpen}
            onClick={(e) => {
              // Empêcher l'action onClick par défaut du Toggle pour l'ouverture du menu
              e.preventDefault()
              // Appeler le onClick personnalisé si fourni
              onClick?.(e)
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            {...buttonProps}
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
                  "w-full px-4 py-2 text-left text-sm whitespace-nowrap rounded-sm cursor-pointer popup-action-item",
                  "flex items-center gap-2",
                  "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  if (debug) {
                    console.log("[ButtonMenu] Action clicked:", action.label)
                  }
                  action.onClick()
                  handleOpenChange(false)
                }}
              >
                {action.icon && (
                  <span className="flex-shrink-0 flex items-center justify-center">
                    {action.icon}
                  </span>
                )}
                <span>{action.label}</span>
              </DropdownMenuItem>
            ))}
          </VStack>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

ButtonMenu.displayName = "ButtonMenu"

