import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

const SegmentedControl = TabsPrimitive.Root

const SegmentedControlList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const bg = useBgContext()
  const bgType = bg || 'grey'

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md p-1 gap-1",
        // White background
        bgType === 'white' && "bg-white border border-grey-stronger",
        // Grey background (default)
        bgType === 'grey' && "bg-grey border border-grey-stronger",
        // Black background
        bgType === 'black' && "bg-black border border-white/20",
        className
      )}
      data-bg={bgType}
      {...props}
    />
  )
})
SegmentedControlList.displayName = TabsPrimitive.List.displayName

const SegmentedControlTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const bg = useBgContext()
  const bgType = bg || 'grey'

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        // White background styles
        bgType === 'white' && [
          "data-[state=active]:bg-grey data-[state=active]:text-black",
          "data-[state=inactive]:bg-transparent data-[state=inactive]:text-black hover:data-[state=inactive]:bg-grey-light"
        ],
        // Grey background styles (default)
        bgType === 'grey' && [
          "data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm",
          "data-[state=inactive]:bg-transparent data-[state=inactive]:text-black hover:data-[state=inactive]:bg-white/50"
        ],
        // Black background styles
        bgType === 'black' && [
          "data-[state=active]:bg-black-secondary data-[state=active]:text-white",
          "data-[state=inactive]:bg-transparent data-[state=inactive]:text-white hover:data-[state=inactive]:bg-white/10"
        ],
        className
      )}
      {...props}
    />
  )
})
SegmentedControlTrigger.displayName = TabsPrimitive.Trigger.displayName

const SegmentedControlContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
SegmentedControlContent.displayName = TabsPrimitive.Content.displayName

export { SegmentedControl, SegmentedControlList, SegmentedControlTrigger, SegmentedControlContent }


