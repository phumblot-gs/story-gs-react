import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

/**
 * Montage différé des menus, popovers et infobulles.
 *
 * Dans une zone « différée » (`DeferredOverlaysProvider` avec `deferred`),
 * `DropdownMenu`, `Popover` et `Tooltip` ne montent pas leur machinerie Radix
 * (racine, popper, écouteurs du document) : seul leur déclencheur est rendu,
 * avec les mêmes attributs qu'un déclencheur fermé — l'aspect est identique
 * et les boutons restent dans le DOM avec leurs libellés accessibles. La zone
 * s'active au premier survol ou focus clavier (`useDeferredOverlayScope`) ;
 * un appui sur un déclencheur encore différé active la zone et ouvre son menu.
 *
 * Hors d'une zone différée (cas par défaut), rien ne change.
 */

interface DeferredOverlaysValue {
  /** Machinerie pas encore montée. */
  deferred: boolean;
  /** Monte la machinerie de toute la zone. */
  activate: () => void;
}

const DeferredOverlaysContext = React.createContext<DeferredOverlaysValue>({
  deferred: false,
  activate: () => {},
});

export const DeferredOverlaysProvider = DeferredOverlaysContext.Provider;

export const useDeferredOverlays = () => React.useContext(DeferredOverlaysContext);

/** Racine différée la plus proche (menu, popover ou infobulle), pour son déclencheur et son contenu. */
export interface DeferredRootValue {
  /** Active la zone et demande l'ouverture (onOpenChange(true), ou ouverture initiale si non contrôlé). */
  requestOpen: () => void;
  activate: () => void;
}

/**
 * Racine différée : `requested` garde une demande d'ouverture faite avant le
 * montage de la racine Radix (racine non contrôlée).
 */
export function useDeferredRoot({
  open,
  defaultOpen,
  onOpenChange,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}): { deferredRoot: DeferredRootValue | null; requested: boolean } {
  const { deferred, activate } = useDeferredOverlays();
  const [requested, setRequested] = React.useState(false);
  const onOpenChangeRef = React.useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const value = React.useMemo<DeferredRootValue>(
    () => ({
      activate,
      requestOpen: () => {
        setRequested(true);
        activate();
        onOpenChangeRef.current?.(true);
      },
    }),
    [activate],
  );
  const isDeferred = deferred && !open && !defaultOpen && !requested;
  return { deferredRoot: isDeferred ? value : null, requested };
}

function compose<E extends React.SyntheticEvent>(
  theirs: ((event: E) => void) | undefined,
  ours: (event: E) => void,
): (event: E) => void {
  return (event) => {
    theirs?.(event);
    if (!event.defaultPrevented) ours(event);
  };
}

const isDisabled = (event: React.SyntheticEvent, disabled?: boolean) =>
  !!disabled || !!(event.currentTarget as HTMLButtonElement).disabled;

export interface DeferredTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  /** Comme le déclencheur Radix remplacé : menu (appui / clavier), dialog (clic), infobulle. */
  kind: "menu" | "dialog" | "tooltip";
  root: DeferredRootValue;
}

/**
 * Déclencheur rendu à la place du déclencheur Radix tant que la racine est
 * différée : mêmes attributs qu'un déclencheur fermé, et les gestes qui
 * ouvriraient le menu l'ouvrent après avoir monté la zone.
 */
export const DeferredTrigger = React.forwardRef<HTMLButtonElement, DeferredTriggerProps>(
  ({ asChild, kind, root, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    let handlers: Partial<React.ButtonHTMLAttributes<HTMLButtonElement>> = {};
    if (kind === "menu") {
      handlers = {
        // Comme DropdownMenu.Trigger : bouton principal sans Ctrl, ou Entrée / Espace / Flèche bas.
        onPointerDown: compose(props.onPointerDown, (event) => {
          if (isDisabled(event, disabled) || event.button !== 0 || event.ctrlKey) return;
          root.requestOpen();
          event.preventDefault();
        }),
        onKeyDown: compose(props.onKeyDown, (event) => {
          if (isDisabled(event, disabled) || !["Enter", " ", "ArrowDown"].includes(event.key)) return;
          root.requestOpen();
          event.preventDefault();
        }),
      };
    } else if (kind === "dialog") {
      handlers = {
        onClick: compose(props.onClick, (event) => {
          if (!isDisabled(event, disabled)) root.requestOpen();
        }),
      };
    }
    return (
      <Comp
        ref={ref}
        {...(kind === "tooltip"
          ? {}
          : { type: "button" as const, "aria-haspopup": kind, "aria-expanded": false })}
        data-state="closed"
        data-deferred-overlay=""
        data-disabled={kind !== "tooltip" && disabled ? "" : undefined}
        disabled={kind === "tooltip" ? undefined : disabled}
        {...props}
        {...handlers}
      />
    );
  },
);
DeferredTrigger.displayName = "DeferredTrigger";

const INTERACTIVE = "button, a[href], input, select, textarea, [role='button'], [tabindex]:not([tabindex='-1'])";
const FOCUSABLE = "button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex='-1'])";

/**
 * Zone différée (ex. une vignette) : la machinerie se monte au premier survol
 * de la zone hors d'un bouton, ou au premier focus clavier. Le focus clavier
 * est rendu à l'élément équivalent après le montage (le déclencheur est
 * remplacé). Un focus venu d'un clic n'active pas la zone pendant le geste :
 * le déclencheur différé gère lui-même l'appui.
 *
 * Poser `ref` et `handlers` sur l'élément racine de la zone, et `value` sur un
 * `DeferredOverlaysProvider` qui l'englobe.
 */
export function useDeferredOverlayScope<T extends HTMLElement>(enabled = true) {
  const ref = React.useRef<T>(null);
  const [active, setActive] = React.useState(!enabled);
  const restoreFocusRef = React.useRef<number | null>(null);
  const lastPointerDownRef = React.useRef(0);

  const activate = React.useCallback(() => setActive(true), []);
  const value = React.useMemo<DeferredOverlaysValue>(() => ({ deferred: !active, activate }), [active, activate]);

  React.useLayoutEffect(() => {
    const index = restoreFocusRef.current;
    restoreFocusRef.current = null;
    if (!active || index === null || !ref.current) return;
    const target = ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)[index];
    if (target && document.activeElement !== target) target.focus({ preventScroll: true });
  }, [active]);

  const handlers = active
    ? {}
    : {
        onPointerOver: (event: React.PointerEvent) => {
          if (!(event.target as Element).closest?.(INTERACTIVE)) setActive(true);
        },
        onPointerDownCapture: () => {
          lastPointerDownRef.current = Date.now();
        },
        onFocus: (event: React.FocusEvent) => {
          if (Date.now() - lastPointerDownRef.current < 1000) return;
          const root = ref.current;
          if (!root) return;
          const index = Array.from(root.querySelectorAll(FOCUSABLE)).indexOf(event.target as Element);
          restoreFocusRef.current = index >= 0 ? index : null;
          setActive(true);
        },
      };

  return { ref, value, handlers, active };
}
