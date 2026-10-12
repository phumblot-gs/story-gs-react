import * as React from "react";
import type { Decorator } from "@storybook/react-vite";
import { REDUCED_MOTION_ATTRIBUTE } from "@/components/ui/spinner";

/**
 * Decorator : animations réduites pendant la story, comme la préférence
 * système `prefers-reduced-motion: reduce`. Pose `data-gs-reduced-motion` sur
 * <html>, ce qui couvre aussi les éléments en portail (toasts).
 */
function ReducedMotion({ children }: { children: React.ReactNode }) {
  React.useLayoutEffect(() => {
    document.documentElement.setAttribute(REDUCED_MOTION_ATTRIBUTE, "");
    return () => document.documentElement.removeAttribute(REDUCED_MOTION_ATTRIBUTE);
  }, []);
  return <>{children}</>;
}

export const withReducedMotion: Decorator = (Story) => (
  <ReducedMotion>
    <Story />
  </ReducedMotion>
);
