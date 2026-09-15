import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "./dropdown-menu"
import type { ButtonMenuAction } from "./button-menu"
import { IconProvider } from "./icon-provider"
import { VStack } from "@/components/layout"
import { cn } from "@/lib/utils"

interface MenuItemsProps {
  actions: (ButtonMenuAction | { separator: true })[]
  small?: boolean
  disabled?: boolean
  bg?: "white" | "grey" | "black"
  menuClassName: string
  onAction: (action: ButtonMenuAction, event: Event) => void
}

function ActionLabel({ action }: { action: ButtonMenuAction }) {
  return <>
    {action.icon && <span className="flex-shrink-0 flex items-center justify-center">{action.icon}</span>}
    <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">{action.label}</span>
  </>
}

function Submenu({ action, itemClassName, ...props }: Omit<MenuItemsProps, "actions"> & {
  action: ButtonMenuAction
  itemClassName: string
}) {
  const [side, setSide] = React.useState<"left" | "right">("right")
  const [content, setContent] = React.useState<HTMLDivElement | null>(null)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const [sideOffset, setSideOffset] = React.useState(4)

  // SubTrigger is inset by the menu's padding. Anchor beyond the panel edge,
  // not just beyond the row, so the two menu surfaces do not overlap.
  React.useLayoutEffect(() => {
    const trigger = triggerRef.current
    const menu = trigger?.closest('[role="menu"]')
    if (!trigger || !menu) return
    const updateOffset = () => {
      const row = trigger.getBoundingClientRect()
      const panel = menu.getBoundingClientRect()
      setSideOffset(Math.max(row.left - panel.left, panel.right - row.right, 0) + 4)
    }
    updateOffset()
    const observer = new ResizeObserver(updateOffset)
    observer.observe(trigger)
    observer.observe(menu)
    return () => observer.disconnect()
  }, [])

  // Radix chooses the actual side after collision detection. Observe that
  // result, including repositioning on resize, instead of guessing a width.
  React.useLayoutEffect(() => {
    if (!content) return
    const updateSide = () => {
      const next = content.getAttribute("data-side")
      if (next === "left" || next === "right") setSide(next)
    }
    updateSide()
    const observer = new MutationObserver(updateSide)
    observer.observe(content, { attributes: true, attributeFilter: ["data-side"] })
    return () => observer.disconnect()
  }, [content])

  return (
    <DropdownMenuSub>
      <DropdownMenuPrimitive.SubTrigger
        ref={triggerRef}
        disabled={action.disabled || props.disabled}
        className={itemClassName}
        textValue={action.label}
      >
        <ActionLabel action={action} />
        <span aria-hidden="true" className="ml-auto flex items-center">
          <IconProvider icon={side === "left" ? "ChevronLeft" : "ChevronRight"} size={12} />
        </span>
      </DropdownMenuPrimitive.SubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent
          ref={setContent}
          className={cn("p-2", props.menuClassName)}
          data-bg={props.bg || undefined}
          sideOffset={sideOffset}
          collisionPadding={8}
          avoidCollisions
        >
          <ButtonMenuItems {...props} actions={action.children ?? []} />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

export function ButtonMenuItems({ actions, ...props }: MenuItemsProps) {
  const itemClassName = cn(
    "relative select-none outline-none w-full px-4 h-6 text-left text-sm whitespace-nowrap rounded-sm cursor-pointer popup-action-item",
    props.small ? "popup-action-item-small" : "popup-action-item-menu",
    "flex items-center gap-2",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
  )
  return (
    <VStack gap={props.small ? 0 : 2} padding={props.small ? 0 : 2}>
      {actions.map((action, index) => {
        if ("separator" in action) return <DropdownMenuSeparator key={`separator-${index}`} className="bg-black-secondary m-0" />
        if (action.children?.length) return <Submenu key={action.value ?? index} {...props} action={action} itemClassName={itemClassName} />
        return (
          <DropdownMenuItem
            key={action.value ?? index}
            disabled={action.disabled || props.disabled}
            data-selected={action.selected ? "true" : "false"}
            className={itemClassName}
            onClick={props.small ? event => event.stopPropagation() : undefined}
            onSelect={event => props.onAction(action, event)}
          >
            <ActionLabel action={action} />
          </DropdownMenuItem>
        )
      })}
    </VStack>
  )
}
