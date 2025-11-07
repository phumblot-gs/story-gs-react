import * as React from "react"
import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Élément HTML à rendre (par défaut: span) */
  as?: 'span' | 'p' | 'div' | 'strong' | 'em' | 'small';
}

type TextElement = HTMLSpanElement | HTMLParagraphElement | HTMLDivElement | HTMLElement;

/**
 * Composant Text qui adapte automatiquement la couleur du texte selon le contexte data-bg
 * - data-bg="white" ou "grey" → texte noir
 * - data-bg="black" → texte blanc
 */
const Text = React.forwardRef<TextElement, TextProps>(
  ({ className, as: Component = 'span', children, ...props }, ref) => {
    const parentBg = useBgContext();

    // Détermine la couleur du texte selon le contexte
    const textColorClass = parentBg === 'black' 
      ? 'text-white' 
      : 'text-black';

    return (
      <Component
        ref={ref as React.Ref<HTMLElement>}
        className={cn("text-base", textColorClass, className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text"

export { Text }

