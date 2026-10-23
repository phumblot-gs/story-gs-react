import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { BgProvider, useBgContext } from "@/components/layout/BgContext"
import { DeferredTrigger, useDeferredRoot, type DeferredRootValue } from "@/components/ui/deferred-overlays"

// Racine différée (voir deferred-overlays) : lue par le déclencheur et le contenu.
const DeferredTooltipContext = React.createContext<DeferredRootValue | null>(null)

// Le Provider n'est jamais différé : une infobulle ouverte (open) doit le trouver.
const TooltipProvider = TooltipPrimitive.Provider

/** Racine Radix ; dans une zone différée, seuls les enfants (le déclencheur) sont rendus jusqu'à l'activation. */
const Tooltip = ({ children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) => {
  const { deferredRoot } = useDeferredRoot(props)
  if (deferredRoot) {
    return <DeferredTooltipContext.Provider value={deferredRoot}>{children}</DeferredTooltipContext.Provider>
  }
  return (
    <TooltipPrimitive.Root {...props}>
      <DeferredTooltipContext.Provider value={null}>{children}</DeferredTooltipContext.Provider>
    </TooltipPrimitive.Root>
  )
}
Tooltip.displayName = "Tooltip"

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>((props, ref) => {
  const deferredRoot = React.useContext(DeferredTooltipContext)
  if (deferredRoot) return <DeferredTrigger ref={ref} kind="tooltip" root={deferredRoot} {...props} />
  return <TooltipPrimitive.Trigger ref={ref} {...props} />
})
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName

type TooltipBg = "white" | "grey" | "black"

// Apparence selon le fond sur lequel le tooltip s'affiche (contexte `data-bg`
// du Layout parent) :
// - fond blanc, gris ou inconnu : tooltip noir, texte blanc, bordure
//   black-secondary (style par défaut) ;
// - fond noir : tooltip inversé — blanc, texte noir, bordure grise — sans quoi
//   un tooltip #292828 sur une page #292828 ne se détache que par sa bordure.
const tooltipContentVariants = cva(
  "z-50 overflow-hidden rounded-[2px] border px-3 py-1.5 text-sm shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      surface: {
        dark: "bg-black text-white border-black-secondary",
        light: "bg-white text-black border-grey-strong",
      },
    },
    defaultVariants: {
      surface: "dark",
    },
  }
)

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /**
   * Fond sur lequel le tooltip s'affiche. Par défaut, celui du contexte
   * `data-bg` (Layout parent). À préciser quand le déclencheur n'est pas dans
   * un Layout, ou pour forcer un rendu.
   */
  bg?: TooltipBg
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, bg, children, ...props }, ref) => {
  const deferredRoot = React.useContext(DeferredTooltipContext)
  const contextBg = useBgContext()
  const surface = (bg ?? contextBg) === "black" ? "light" : "dark"
  // Fond propre du tooltip, transmis à son contenu (icônes, boutons…) pour
  // qu'il s'affiche comme sur une surface de cette couleur.
  const surfaceBg: TooltipBg = surface === "light" ? "white" : "black"

  // Racine différée : infobulle fermée, rien à rendre.
  if (deferredRoot) return null

  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      data-bg={surfaceBg}
      data-surface={surface}
      className={cn(tooltipContentVariants({ surface }), className)}
      {...props}
    >
      <BgProvider value={surfaceBg}>{children}</BgProvider>
    </TooltipPrimitive.Content>
  )
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
