import * as React from "react";

/** Viewport strips (px) covered by the host page, that popovers and menus must not overlap. */
export interface CollisionInsets {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

type Side = "top" | "right" | "bottom" | "left";
export type CollisionPadding = number | Partial<Record<Side, number>>;

const NO_INSETS: CollisionInsets = {};
const CollisionInsetsContext = React.createContext<CollisionInsets>(NO_INSETS);

export interface CollisionInsetsProviderProps {
  insets?: CollisionInsets;
  children: React.ReactNode;
}

/**
 * Reserves viewport strips for every popover, dropdown, select, tooltip and menu of the library below it:
 * each side's inset is added to that menu's effective `collisionPadding` (the caller's value, else the Radix
 * default: 0, or 10 for `SelectContent`), so it neither opens nor flips into the strip.
 * A nested provider replaces its parent's insets for its subtree (no merge); `insets` omitted resets them to 0.
 *
 * Use it when the app runs under a fixed header drawn by a host page, e.g. an iframe whose top 60 px are
 * covered by the host's header:
 * ```tsx
 * <CollisionInsetsProvider insets={{ top: 60 }}>
 *   <App />
 * </CollisionInsetsProvider>
 * ```
 * Also available as `GSComponentsRoot`'s `collisionInsets` prop, so a nested `GSComponentsRoot` without it
 * resets the insets to 0 for its subtree. Without a provider, nothing changes.
 */
export function CollisionInsetsProvider({ insets, children }: CollisionInsetsProviderProps) {
  const { top, right, bottom, left } = insets ?? NO_INSETS;
  const value = React.useMemo(() => ({ top, right, bottom, left }), [top, right, bottom, left]);
  return <CollisionInsetsContext.Provider value={value}>{children}</CollisionInsetsContext.Provider>;
}

export function useCollisionInsets(): CollisionInsets {
  return React.useContext(CollisionInsetsContext);
}

const SIDES: Side[] = ["top", "right", "bottom", "left"];

function hasInsets(insets: CollisionInsets) {
  return SIDES.some((side) => (insets[side] ?? 0) > 0);
}

/**
 * A menu's `collisionPadding` plus the reserved insets; returned unchanged when no inset is set.
 * A partial object keeps Radix's semantics: missing sides count as 0 before the inset is added.
 */
export function useCollisionPadding(padding: CollisionPadding | undefined): CollisionPadding | undefined {
  const insets = useCollisionInsets();
  if (!hasInsets(insets)) return padding;
  const base = (side: Side) => (typeof padding === "number" ? padding : padding?.[side] ?? 0);
  return Object.fromEntries(SIDES.map((side) => [side, base(side) + Math.max(0, insets[side] ?? 0)]));
}

// Within insets, also bounded by Radix's available height, which accounts for collisionPadding (hence the insets).
const MENU_MAX_HEIGHT = {
  "dropdown-menu": {
    default: "max-h-[calc(100vh-2rem)]",
    withinInsets: "max-h-[min(calc(100vh-2rem),var(--radix-dropdown-menu-content-available-height))]",
  },
  popover: {
    default: "max-h-[calc(100vh-2rem)]",
    withinInsets: "max-h-[min(calc(100vh-2rem),var(--radix-popover-content-available-height))]",
  },
  select: {
    default: "max-h-96",
    withinInsets: "max-h-[min(24rem,var(--radix-select-content-available-height))]",
  },
} as const;

/** Default max-height class of a library menu, unless `custom` is given. */
export function useMenuMaxHeight(custom: string | undefined, kind: keyof typeof MENU_MAX_HEIGHT) {
  const insets = useCollisionInsets();
  if (custom !== undefined) return custom;
  return MENU_MAX_HEIGHT[kind][hasInsets(insets) ? "withinInsets" : "default"];
}
