import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { BgProvider } from "@/components/layout/BgContext"

const HoverCard = HoverCardPrimitive.Root

const HoverCardTrigger = HoverCardPrimitive.Trigger

const hoverCardContentVariants = cva(
  "z-50 rounded-sm border p-2 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      surface: {
        light: "bg-white text-black border-grey-strong",
        dark: "bg-black text-white border-black-secondary",
      },
    },
    defaultVariants: {
      surface: "light",
    },
  }
)

export interface HoverCardContentProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> {
  /** Card surface: "light" (default, white with a grey-strong border) or "dark" (black). */
  surface?: "light" | "dark"
}

/**
 * Card shown while the trigger is hovered or focused, after the Root's `openDelay`.
 * Portalled to `document.body`, so a scrolling or `overflow: hidden` parent does not clip it.
 */
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardContentProps
>(({ className, align = "center", sideOffset = 5, surface = "light", children, ...props }, ref) => {
  const surfaceBg = surface === "light" ? "white" : "black"
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        data-bg={surfaceBg}
        data-surface={surface}
        className={cn(hoverCardContentVariants({ surface }), className)}
        {...props}
      >
        <BgProvider value={surfaceBg}>{children}</BgProvider>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  )
})
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export { HoverCard, HoverCardTrigger, HoverCardContent }
