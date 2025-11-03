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
   * <ButtonMenuStatus open={open} onOpenChange={setOpen} ... />
   * 
   * @example
   * // Uncontrolled mode
   * <ButtonMenuStatus defaultOpen={false} ... />
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
   * <ButtonMenuStatus defaultOpen={true} ... />
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
   * <ButtonMenuStatus 
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

export const ButtonMenuStatus = React.forwardRef<HTMLButtonElement, ButtonMenuStatusProps>(
  (
    {
      currentStatus,
      statusOptions,
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
      size = "medium",
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
                  "w-full px-4 py-2 text-left text-sm whitespace-nowrap rounded-sm cursor-pointer popup-action-item",
                  "flex items-center gap-2 text-white hover:text-black active:text-black",
                  "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  if (debug) {
                    console.log("[ButtonMenuStatus] Status clicked:", option.status, option.label)
                  }
                  handleOpenChange(false)
                }}
              >
                <MediaStatus status={option.status} width={12} height={3} />
                <span>{option.label}</span>
              </DropdownMenuItem>
            ))}
          </VStack>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

ButtonMenuStatus.displayName = "ButtonMenuStatus"

