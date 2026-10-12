import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { BgProvider } from "./BgContext";
import { useTranslationSafe } from "@/contexts/TranslationContext";

type ModalBg = "white" | "grey" | "black";
type ModalPadding = 4 | 6 | 8;

export interface ModalProps {
  isOpen: boolean;
  /** Appelé quand la modale demande à se fermer (Échap, clic sur l'overlay). */
  onClose: () => void;
  /** Corps : la seule zone qui défile. */
  children: React.ReactNode;
  /** Zone fixe en haut, séparée du corps par un trait. Ne défile jamais. */
  header?: React.ReactNode | (() => React.ReactNode);
  /** Zone fixe en bas, alignée à droite. Ne défile jamais. */
  footer?: React.ReactNode | (() => React.ReactNode);
  /** Titre pour les lecteurs d'écran (masqué visuellement). Défaut : « Fenêtre » traduit. */
  title?: string;
  /** Fond de la fenêtre, transmis (BgProvider) au header, au corps et au footer. Défaut "white". */
  bg?: ModalBg;
  /**
   * Padding commun au header, au corps et au footer. Sans valeur, le corps n'a
   * pas de padding (comportement historique : le contenu pose le sien) et le
   * header et le footer gardent 4.
   */
  padding?: ModalPadding;
  /** Élément qui reçoit le focus à l'ouverture. Défaut : le premier élément focusable. */
  initialFocus?: React.RefObject<HTMLElement>;
  /** Classes de la fenêtre. */
  className?: string;
  /** Classes de l'overlay (qui centre la fenêtre). */
  overlayClassName?: string;
  /** Classes du corps (zone qui défile). */
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  maxHeight?: string;
  maxWidth?: string;
}

const PADDING_CLASSES: Record<ModalPadding, string> = { 4: "p-4", 6: "p-6", 8: "p-8" };

const BG_CLASSES: Record<ModalBg, string> = {
  white: "bg-white",
  grey: "bg-grey",
  black: "bg-black text-white",
};

const SEPARATOR_CLASSES: Record<ModalBg, string> = {
  white: "border-grey",
  grey: "border-grey-strong",
  black: "border-grey-strongest",
};

const render = (node: React.ReactNode | (() => React.ReactNode)) =>
  typeof node === "function" ? node() : node;

/**
 * Fenêtre modale centrée, construite sur Radix Dialog.
 *
 * Ouverte par-dessus un SidePanel (ou tout autre dialog Radix), elle se comporte
 * en dialog imbriqué : affichée au-dessus, corps défilable, focus piégé, Échap et
 * clic sur l'overlay ne ferment qu'elle. Que la modale soit rendue dans l'arbre
 * React du SidePanel ou à côté, la pile de calques de Radix est globale.
 *
 * Structure : header (fixe) / corps (seule zone qui défile) / footer (fixe).
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  header,
  footer,
  title,
  bg = "white",
  padding,
  initialFocus,
  className,
  overlayClassName,
  contentClassName,
  headerClassName,
  footerClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  maxHeight = "90vh",
  maxWidth = "90vw",
}) => {
  const { t } = useTranslationSafe();
  const separator = SEPARATOR_CLASSES[bg];
  const edgePadding = padding ?? 4;

  const preventOutside = (event: Event) => {
    if (!closeOnOverlayClick) event.preventDefault();
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* L'overlay contient la fenêtre et la centre (même structure que l'ancien
            Modal). Son verrou de défilement n'autorise que la fenêtre ; c'est le
            dernier verrou posé qui s'applique, d'où un corps défilable même au-dessus
            d'un SidePanel. Superposition : dernier portail ouvert devant, à z-50 égal. */}
        <DialogPrimitive.Overlay
          data-modal-overlay
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            bg === "black" ? "bg-[rgba(41,40,40,0.8)]" : "bg-overlay-20",
            overlayClassName,
          )}
        >
          <DialogPrimitive.Content
            data-modal
            data-bg={bg}
            aria-describedby={undefined}
            onEscapeKeyDown={(event) => {
              if (!closeOnEscape) event.preventDefault();
            }}
            onPointerDownOutside={preventOutside}
            onInteractOutside={preventOutside}
            onOpenAutoFocus={(event) => {
              if (!initialFocus?.current) return;
              event.preventDefault();
              initialFocus.current.focus();
            }}
            className={cn("relative flex flex-col shadow-lg outline-none", BG_CLASSES[bg], className)}
            style={{ maxHeight, maxWidth }}
          >
            <DialogPrimitive.Title className="sr-only">{title ?? t("modal.accessibilityTitle")}</DialogPrimitive.Title>
            <BgProvider value={bg}>
              {header && (
                <div
                  data-modal-header
                  className={cn("shrink-0 border-b", separator, PADDING_CLASSES[edgePadding], headerClassName)}
                >
                  {render(header)}
                </div>
              )}

              <div
                data-modal-body
                className={cn(
                  "flex-1 min-h-0 overflow-y-auto overflow-x-hidden",
                  padding !== undefined && PADDING_CLASSES[padding],
                  contentClassName,
                )}
              >
                {children}
              </div>

              {footer && (
                <div
                  data-modal-footer
                  className={cn(
                    "flex shrink-0 items-center justify-end gap-3 border-t",
                    separator,
                    PADDING_CLASSES[edgePadding],
                    footerClassName,
                  )}
                >
                  {render(footer)}
                </div>
              )}
            </BgProvider>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
