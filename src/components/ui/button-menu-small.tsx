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
import { ButtonMenuAction } from "./button-menu"

export interface ButtonMenuSmallProps extends Omit<ToggleProps, "onClick" | "isActive"> {
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
   * <ButtonMenuSmall open={open} onOpenChange={setOpen} ... />
   * 
   * @example
   * // Uncontrolled mode
   * <ButtonMenuSmall defaultOpen={false} ... />
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
   * <ButtonMenuSmall defaultOpen={true} ... />
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
   * <ButtonMenuSmall 
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

export const ButtonMenuSmall = React.forwardRef<HTMLButtonElement, ButtonMenuSmallProps>(
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
        console.log("[ButtonMenuSmall] State changed", {
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
            "min-w-[8rem] rounded-sm border-0 popup-action overflow-y-auto p-0",
            menuMaxHeight,
            getMenuBackgroundClass()
          )}
          align="start"
          sideOffset={5}
          collisionPadding={8}
          data-bg={bg || undefined}
        >
          <VStack gap={0} padding={0}>
            {actions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                disabled={action.disabled || disabled}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm whitespace-nowrap rounded-sm cursor-pointer popup-action-item"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  if (debug) {
                    console.log("[ButtonMenuSmall] Action clicked:", action.label)
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

ButtonMenuSmall.displayName = "ButtonMenuSmall"

