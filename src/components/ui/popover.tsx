
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"
import { DeferredTrigger, useDeferredRoot, type DeferredRootValue } from "@/components/ui/deferred-overlays"

// Racine différée (voir deferred-overlays) : lue par le déclencheur et le contenu.
const DeferredPopoverContext = React.createContext<DeferredRootValue | null>(null)

/** Racine Radix ; dans une zone différée, seuls les enfants (le déclencheur) sont rendus jusqu'à l'activation. */
const Popover = ({ children, ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) => {
  const { deferredRoot, requested } = useDeferredRoot(props)
  if (deferredRoot) {
    return <DeferredPopoverContext.Provider value={deferredRoot}>{children}</DeferredPopoverContext.Provider>
  }
  return (
    <PopoverPrimitive.Root {...props} defaultOpen={props.defaultOpen ?? (requested || undefined)}>
      <DeferredPopoverContext.Provider value={null}>{children}</DeferredPopoverContext.Provider>
    </PopoverPrimitive.Root>
  )
}
Popover.displayName = "Popover"

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>((props, ref) => {
  const deferredRoot = React.useContext(DeferredPopoverContext)
  if (deferredRoot) return <DeferredTrigger ref={ref} kind="dialog" root={deferredRoot} {...props} />
  return <PopoverPrimitive.Trigger ref={ref} {...props} />
})
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) =>
  // Racine différée : popover fermé, rien à rendre.
  React.useContext(DeferredPopoverContext) ? null : (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
  )
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
