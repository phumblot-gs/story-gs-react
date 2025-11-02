import * as React from "react";
import { ReactNode } from "react";
import { Sheet, SheetClose, SheetPortal, SheetOverlay } from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { BgProvider } from "./BgContext";

type BgContext = 'white' | 'grey' | 'black';

const sidePanelVariants = cva(
  "fixed z-50 right-0 h-full border-l shadow-lg transition ease-in-out",
  {
    variants: {
      side: {
        right: "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

export interface SidePanelProps {
  /** Contrôle l'affichage du panneau (open/closed) */
  isOpen: boolean;
  
  /** Callback appelé lors de la fermeture du panneau */
  onClose: () => void;
  
  /** Contenu du body (sera dans un conteneur scrollable) */
  children: ReactNode;
  
  /** Affiche l'overlay en arrière-plan (défaut: true) */
  showOverlay?: boolean;
  
  /** Largeur du panneau (défaut: "300px") */
  width?: string | number;
  
  /** Couleur de fond du panneau (défaut: "black") */
  bg?: BgContext;
  
  /** Affiche le bouton X pour fermer (défaut: true) */
  showCloseButton?: boolean;
  
  /** Contenu personnalisé du header. Si non fourni, affiche uniquement le bouton de fermeture */
  headerContent?: ReactNode;
  
  /** Décalage depuis le haut (ex: "50px" pour PageHeader) */
  topOffset?: string | number;
  
  /** Classes Tailwind supplémentaires pour le conteneur principal */
  className?: string;
  
  /** Classes Tailwind supplémentaires pour le body */
  bodyClassName?: string;
  
  /** Mode debug */
  debug?: boolean;
}

/**
 * Composant SidePanel pour affichage d'un panneau latéral sur la droite de l'écran
 *
 * Le composant comprend :
 * - Un overlay optionnel en arrière-plan
 * - Un header fixe optionnel avec bouton de fermeture
 * - Un body scrollable qui prend le reste de l'espace
 * - Support du système data-bg pour le contexte de fond
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <SidePanel
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 * >
 *   <h2>Contenu du panneau</h2>
 * </SidePanel>
 * ```
 *
 * @example Avec header personnalisé
 * ```tsx
 * <SidePanel
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   headerContent={
 *     <h2 className="gs-typo-h2 text-white">Titre du panneau</h2>
 *   }
 * >
 *   <p>Contenu</p>
 * </SidePanel>
 * ```
 *
 * @example Panneau avec fond blanc
 * ```tsx
 * <SidePanel
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   bg="white"
 *   width="400px"
 * >
 *   <h2>Contenu</h2>
 * </SidePanel>
 * ```
 */
export function SidePanel({
  isOpen,
  onClose,
  children,
  showOverlay = true,
  width = "300px",
  bg = "black",
  showCloseButton = true,
  headerContent,
  topOffset,
  className,
  bodyClassName,
  debug = false,
}: SidePanelProps) {
  // Normaliser la largeur
  const normalizedWidth = typeof width === "number" ? `${width}px` : width;
  
  // Déterminer la couleur de fond selon bg
  const bgClass = bg === "white" ? "bg-white" : bg === "grey" ? "bg-grey" : "bg-black";
  
  // Debug mode
  React.useEffect(() => {
    if (debug) {
      console.log('[SidePanel Debug]', {
        isOpen,
        showOverlay,
        width: normalizedWidth,
        bg,
        showCloseButton,
        hasHeaderContent: !!headerContent,
        topOffset,
      });
    }
  }, [debug, isOpen, showOverlay, normalizedWidth, bg, showCloseButton, headerContent, topOffset]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetPortal>
        {showOverlay && <SheetOverlay topOffset={topOffset} />}
        <SheetPrimitive.Content
          className={cn(
            sidePanelVariants({ side: "right" }),
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:duration-300 data-[state=open]:duration-500",
            "border-none p-0",
            bgClass,
            className
          )}
          style={{
            width: normalizedWidth,
            ...(topOffset && { top: typeof topOffset === "number" ? `${topOffset}px` : topOffset }),
            ...(topOffset && { height: `calc(100% - ${typeof topOffset === "number" ? `${topOffset}px` : topOffset})` }),
          }}
          data-bg={bg}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            {(showCloseButton || headerContent) && (
              <BgProvider value={bg}>
                <div className="flex items-center justify-between shrink-0 p-2">
                  {headerContent ? (
                    <>
                      <div className="flex-1">{headerContent}</div>
                      {showCloseButton && (
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            size="medium"
                            onClick={onClose}
                            aria-label="Fermer"
                            className="p-0 w-6 h-6"
                            debug={debug}
                          >
                            <Icon name="X" size={12} />
                          </Button>
                        </SheetClose>
                      )}
                    </>
                  ) : (
                    showCloseButton && (
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          size="medium"
                          onClick={onClose}
                          aria-label="Fermer"
                          className="p-0 w-6 h-6"
                          debug={debug}
                        >
                          <Icon name="X" size={12} />
                        </Button>
                      </SheetClose>
                    )
                  )}
                </div>
              </BgProvider>
            )}

            {/* Body */}
            <BgProvider value={bg}>
              <div
                className={cn(
                  "flex-1 overflow-auto",
                  bodyClassName
                )}
              >
                {children}
              </div>
            </BgProvider>
          </div>
        </SheetPrimitive.Content>
      </SheetPortal>
    </Sheet>
  );
}

