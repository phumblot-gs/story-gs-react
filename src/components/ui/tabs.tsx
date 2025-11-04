import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  debug?: boolean
}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ debug, className, onValueChange, ...props }, ref) => {
  const bg = useBgContext()

  // Debug mode : wrapper pour onValueChange avec log
  const handleValueChange = React.useCallback((value: string) => {
    if (debug) {
      console.log('[Tabs Value Change]', {
        value,
        bg,
        previousValue: props.defaultValue || props.value,
      });
    }
    onValueChange?.(value);
  }, [debug, bg, onValueChange, props.defaultValue, props.value]);

  return (
    <TabsPrimitive.Root
      ref={ref}
      className={cn(debug && "ring-2 ring-pink ring-offset-2", className)}
      onValueChange={debug ? handleValueChange : onValueChange}
      {...props}
    />
  )
})
Tabs.displayName = TabsPrimitive.Root.displayName

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  className?: string
  debug?: boolean
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, debug, ...props }, ref) => {
  const bg = useBgContext()
  const listRef = React.useRef<HTMLDivElement>(null)
  const [showNavButtons, setShowNavButtons] = React.useState(false)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)
  const [activeTabLabel, setActiveTabLabel] = React.useState<string>('none')

  // Combiner les refs
  React.useEffect(() => {
    if (typeof ref === 'function') {
      ref(listRef.current)
    } else if (ref) {
      ref.current = listRef.current
    }
  }, [ref])

  // Vérifier si le scroll est nécessaire et gérer les états des boutons
  React.useEffect(() => {
    const checkScrollability = () => {
      if (!listRef.current) return

      const { scrollWidth, clientWidth, scrollLeft } = listRef.current
      const needsScroll = scrollWidth > clientWidth
      
      setShowNavButtons(needsScroll)
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }

    checkScrollability()
    window.addEventListener('resize', checkScrollability)
    
    // Observer les changements dans le contenu
    const observer = new ResizeObserver(checkScrollability)
    if (listRef.current) {
      observer.observe(listRef.current)
    }

    return () => {
      window.removeEventListener('resize', checkScrollability)
      observer.disconnect()
    }
  }, [])

  // Observer les changements d'attribut data-state pour mettre à jour le label debug
  React.useEffect(() => {
    if (!debug || !listRef.current) return

    const updateActiveTabLabel = () => {
      const activeTab = listRef.current?.querySelector('[data-state="active"]')
      setActiveTabLabel(activeTab?.textContent || 'none')
    }

    // Initialiser le label
    updateActiveTabLabel()

    // Observer les changements d'attribut data-state
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
          updateActiveTabLabel()
        }
      })
    })

    // Observer tous les triggers dans la liste
    const triggers = listRef.current.querySelectorAll('[data-state]')
    triggers.forEach((trigger) => {
      observer.observe(trigger, { attributes: true, attributeFilter: ['data-state'] })
    })

    return () => {
      observer.disconnect()
    }
  }, [debug, props.children])

  // Gérer le scroll lors du changement d'onglet actif
  React.useEffect(() => {
    if (!listRef.current || !showNavButtons) return

    const scrollToActiveTab = () => {
      const activeTab = listRef.current?.querySelector('[data-state="active"]') as HTMLElement
      if (!activeTab || !listRef.current) return

      const container = listRef.current
      const containerRect = container.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()

      // Si l'onglet actif est hors de vue, scroll pour le rendre visible
      if (tabRect.left < containerRect.left) {
        container.scrollBy({ left: tabRect.left - containerRect.left - 20, behavior: 'smooth' })
      } else if (tabRect.right > containerRect.right) {
        container.scrollBy({ left: tabRect.right - containerRect.right + 20, behavior: 'smooth' })
      }
    }

    // Observer les changements d'attribut data-state pour détecter le changement d'onglet actif
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
          scrollToActiveTab()
        }
      })
    })

    // Observer tous les triggers dans la liste
    if (listRef.current) {
      const triggers = listRef.current.querySelectorAll('[data-state]')
      triggers.forEach((trigger) => {
        observer.observe(trigger, { attributes: true, attributeFilter: ['data-state'] })
      })
    }

    // Scroll initial au montage
    setTimeout(scrollToActiveTab, 100)

    return () => {
      observer.disconnect()
    }
  }, [showNavButtons])

  const handleScroll = () => {
    if (!listRef.current) return
    
    const { scrollWidth, clientWidth, scrollLeft } = listRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  const scrollLeft = () => {
    if (!listRef.current) return
    listRef.current.scrollBy({ left: -200, behavior: 'smooth' })
  }

  const scrollRight = () => {
    if (!listRef.current) return
    listRef.current.scrollBy({ left: 200, behavior: 'smooth' })
  }

  return (
    <div className={cn("tabs-header", debug && "relative", className)} data-bg={bg || undefined}>
      {debug && (
        <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap z-10">
          Active: {activeTabLabel}
        </span>
      )}
      <TabsPrimitive.List
        ref={listRef}
        className={cn("tabs-list", className)}
        onScroll={handleScroll}
        {...props}
      />
      {showNavButtons && (
        <>
          <button
            type="button"
            className="tabs-nav-button"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="tabs-nav-button"
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn("tabs-trigger", className)}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => {
  const bg = useBgContext()
  return (
    <div className="tabs-body" data-bg={bg || undefined}>
      <TabsPrimitive.Content
        ref={ref}
        className={cn("tabs-content", className)}
        {...props}
      />
    </div>
  )
})
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

