import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"
import { computeActiveTabIndicator } from "@/components/ui/tabs"

export type SegmentedControlSize = "small" | "medium" | "large"

// The `size` prop lives on the List but every Trigger needs to know it to
// pick its own height / padding / typography. We use a tiny context to
// avoid forcing the consumer to repeat the size on every trigger.
const SegmentedControlSizeContext = React.createContext<SegmentedControlSize>("large")

const SegmentedControl = TabsPrimitive.Root

interface SegmentedControlListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /**
   * Overall size of the control. Default: `"large"` (preserves the historical
   * h-10 / px-4 / text-sm look, so existing usages render unchanged).
   * - `"small"`: 30 px tall (`h-6`), `text-xs`, smaller icons. Good for dense toolbars.
   * - `"medium"`: 40 px tall (`h-8`), `text-xs`.
   * - `"large"`: 50 px tall (`h-10`), `text-sm` — same as before this prop existed.
   */
  size?: SegmentedControlSize
}

// Container styles per size. Heights match the lib's 5 px spacing scale:
//   h-6 = 30 px (small), h-8 = 40 px (medium), h-10 = 50 px (large).
const listSizeClasses: Record<SegmentedControlSize, string> = {
  small: "h-6",
  medium: "h-8",
  large: "h-10",
}

const SegmentedControlList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  SegmentedControlListProps
>(({ className, size = "large", children, ...props }, ref) => {
  const bg = useBgContext()
  const bgType = bg || 'grey'

  // We render an absolutely-positioned "indicator pill" inside the list and
  // animate its `left` / `width` to slide it from the previous active trigger
  // to the next one (same pattern as `Tabs`, reusing the same helper).
  // Triggers themselves stay transparent; the indicator provides the active
  // fill colour underneath.
  const innerListRef = React.useRef<HTMLDivElement | null>(null)
  const setListRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      innerListRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref],
  )

  const [indicatorStyle, setIndicatorStyle] = React.useState<
    { left: number; width: number } | null
  >(null)

  const updateIndicator = React.useCallback(() => {
    const list = innerListRef.current
    if (!list) return
    const activeTab = list.querySelector(
      '[role="tab"][data-state="active"]',
    ) as HTMLElement | null
    if (!activeTab) {
      setIndicatorStyle(null)
      return
    }
    setIndicatorStyle(computeActiveTabIndicator(list, activeTab))
  }, [])

  React.useEffect(() => {
    const list = innerListRef.current
    if (!list) return
    updateIndicator()

    // Observe data-state on every trigger so the indicator slides when the
    // user picks a different option.
    const stateObserver = new MutationObserver(updateIndicator)
    list.querySelectorAll('[role="tab"]').forEach((trigger) => {
      stateObserver.observe(trigger, {
        attributes: true,
        attributeFilter: ["data-state"],
      })
    })

    // Also re-measure when the list (or any trigger) is resized — e.g. font
    // loaded after first paint, container width changed, etc.
    const resizeObserver = new ResizeObserver(updateIndicator)
    resizeObserver.observe(list)

    return () => {
      stateObserver.disconnect()
      resizeObserver.disconnect()
    }
  }, [updateIndicator, children])

  return (
    <SegmentedControlSizeContext.Provider value={size}>
      <TabsPrimitive.List
        ref={setListRef}
        className={cn(
          // Pill container — the list is a rounded-full track. The active
          // trigger's background is provided by an animated pill positioned
          // absolutely behind the triggers.
          "relative inline-flex items-center justify-center rounded-full p-0 gap-0",
          listSizeClasses[size],
          // White parent → list is grey-lighter (#f3f3f3)
          bgType === 'white' && "bg-grey-lighter",
          // Grey parent → list is white (the parent surface already provides the contrast)
          bgType === 'grey' && "bg-white",
          // Black parent → list is black-secondary
          bgType === 'black' && "bg-black-secondary",
          className
        )}
        data-bg={bgType}
        data-size={size}
        {...props}
      >
        {/* Sliding indicator pill — sits behind the triggers, animated via
            `transition-all`. Hidden when no active trigger has been measured
            yet (first paint, or no tab active). */}
        <span
          aria-hidden
          className={cn(
            "absolute top-0 bottom-0 rounded-full transition-all duration-200 ease-out pointer-events-none",
            // On white / grey parents the active pill is black. On black it
            // flips to white for legibility.
            bgType === "black" ? "bg-white" : "bg-black",
            indicatorStyle ? "opacity-100" : "opacity-0",
          )}
          style={{
            left: indicatorStyle?.left ?? 0,
            width: indicatorStyle?.width ?? 0,
          }}
        />
        {children}
      </TabsPrimitive.List>
    </SegmentedControlSizeContext.Provider>
  )
})
SegmentedControlList.displayName = TabsPrimitive.List.displayName

// Trigger styles per size. `large` keeps the historical look (px-4, text-sm,
// gap-2). Smaller sizes shrink padding, font and gap proportionally.
const triggerSizeClasses: Record<SegmentedControlSize, string> = {
  small: "px-2 text-xs gap-1 [&_svg]:h-3 [&_svg]:w-3",
  medium: "px-3 text-xs gap-1.5 [&_svg]:h-3.5 [&_svg]:w-3.5",
  large: "px-4 text-sm gap-2 [&_svg]:h-3.5 [&_svg]:w-3.5",
}

const SegmentedControlTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const bg = useBgContext()
  const bgType = bg || 'grey'
  const size = React.useContext(SegmentedControlSizeContext)

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        // Each trigger sits ABOVE the sliding indicator pill (via `relative
        // z-10`). The size-dependent classes come from `triggerSizeClasses`.
        // The active background is provided by the indicator, not by the
        // trigger itself, so the bg here is always transparent. Only the
        // text colour changes between active / inactive.
        "relative z-10 inline-flex h-full items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        triggerSizeClasses[size],
        // White parent → active text white (on the black pill), inactive black.
        bgType === 'white' && [
          "data-[state=active]:text-white",
          "data-[state=inactive]:text-black hover:data-[state=inactive]:bg-grey-light"
        ],
        // Grey parent → same as white.
        bgType === 'grey' && [
          "data-[state=active]:text-white",
          "data-[state=inactive]:text-black hover:data-[state=inactive]:bg-grey-lighter"
        ],
        // Black parent → inverted: active text black (on the white pill),
        // inactive white.
        bgType === 'black' && [
          "data-[state=active]:text-black",
          "data-[state=inactive]:text-white hover:data-[state=inactive]:bg-white/10"
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
