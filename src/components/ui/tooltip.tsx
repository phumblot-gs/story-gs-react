import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { BgProvider, useBgContext } from "@/components/layout/BgContext"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

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
  const contextBg = useBgContext()
  const surface = (bg ?? contextBg) === "black" ? "light" : "dark"
  // Fond propre du tooltip, transmis à son contenu (icônes, boutons…) pour
  // qu'il s'affiche comme sur une surface de cette couleur.
  const surfaceBg: TooltipBg = surface === "light" ? "white" : "black"

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
