import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useBgContext } from "@/components/layout/BgContext";

// Types
export type ButtonVariant = "normal" | "secondary" | "ghost" | "outline" | "destructive" | "link";
export type ButtonSize = "small" | "medium" | "large";

// Mapping pour compatibilité shadcn
type ShadcnVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ShadcnSize = "sm" | "lg" | "default" | "icon";

/**
 * Normalise les variants shadcn vers notre design system
 */
function normalizeVariant(variant?: ButtonVariant | ShadcnVariant): ButtonVariant {
  switch (variant) {
    case "default":
    case "normal":
    case undefined:
      return "normal";

    case "secondary":
      return "secondary";

    case "ghost":
      return "ghost";

    case "outline":
      return "outline";

    case "destructive":
      return "destructive";

    case "link":
      return "link";

    default:
      return "normal";
  }
}

/**
 * Normalise les sizes shadcn vers notre design system
 */
function normalizeSize(size?: ButtonSize | ShadcnSize): ButtonSize {
  switch (size) {
    case "sm":
    case "small":
    case "icon":
      return "small";

    case "lg":
    case "default":
    case undefined:
      return "medium"; // lg et default → medium (ancien comportement de "large")

    case "medium":
      return "medium";

    case "large":
      return "large"; // "large" explicite → nouvelle taille large

    default:
      return "medium";
  }
}

// CVA variants
const buttonVariants = cva(
  "rounded-full font-regular inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        normal: "btn-normal",
        secondary: "btn-secondary",
        ghost: "btn-ghost",
        outline: "btn-outline",
        destructive: "btn-destructive",
        link: "btn-link hover:underline active:underline",
      },
      size: {
        small: "px-2 py-[4px] h-4 text-xs leading-tight gap-1 [&_svg]:h-[12px] [&_svg]:w-[12px]",      // 8px horizontal, 4px vertical, 20px height (h-4), gap 4px, font 9px avec leading-tight (11.25px), icônes 12px
        medium: "px-4 py-1 text-base gap-2",            // 16px horizontal, 4px vertical, gap 8px, font 16px (anciennement large)
        large: "px-5 py-[15px] text-base gap-[5px]",     // 20px horizontal, 15px vertical, gap 5px, font 16px (nouvelle taille depuis Figma)
      },
    },
    compoundVariants: [
      {
        variant: "outline",
        size: "small",
        class: "py-[2px]",
      },
      {
        variant: "outline",
        size: "medium",
        class: "py-[2px]",
      },
      {
        variant: "outline",
        size: "large",
        class: "py-[13px]",
      },
    ],
    defaultVariants: {
      variant: "normal",
      size: "medium",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant | ShadcnVariant;
  size?: ButtonSize | ShadcnSize;
  indicator?: boolean;
  asChild?: boolean;
  debug?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, indicator, debug, className, children, asChild = false, onClick, onFocus, onBlur, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const normalizedVariant = normalizeVariant(variant);
    const normalizedSize = normalizeSize(size);
    const bg = useBgContext();

    // Debug mode : wrapper pour onClick avec log
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (debug) {
        console.log('[Button Click]', {
          variant: variant,
          normalizedVariant,
          size: size,
          normalizedSize,
          indicator,
          bg,
          event: e,
        });
      }
      // Appelle le onClick original s'il existe
      onClick?.(e);
    }, [debug, variant, normalizedVariant, size, normalizedSize, indicator, bg, onClick]);

    // Debug mode : wrapper pour onFocus avec log
    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
      if (debug) {
        console.log('[Button Focus]', {
          variant: variant,
          normalizedVariant,
          size: size,
          normalizedSize,
          indicator,
          bg,
          event: e,
        });
      }
      // Appelle le onFocus original s'il existe
      onFocus?.(e);
    }, [debug, variant, normalizedVariant, size, normalizedSize, indicator, bg, onFocus]);

    // Debug mode : wrapper pour onBlur avec log
    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
      if (debug) {
        console.log('[Button Blur]', {
          variant: variant,
          normalizedVariant,
          size: size,
          normalizedSize,
          indicator,
          bg,
          event: e,
        });
      }
      // Appelle le onBlur original s'il existe
      onBlur?.(e);
    }, [debug, variant, normalizedVariant, size, normalizedSize, indicator, bg, onBlur]);

    return (
      <Comp
        ref={ref}
        data-bg={bg || undefined}
        className={cn(
          buttonVariants({
            variant: normalizedVariant,
            size: normalizedSize
          }),
          indicator && "relative", // Position relative seulement si indicator
          debug && "ring-2 ring-pink ring-offset-2", // Bordure visuelle en debug
          className
        )}
        onClick={debug ? handleClick : onClick}
        onFocus={debug ? handleFocus : onFocus}
        onBlur={debug ? handleBlur : onBlur}
        {...props}
      >
        {children}
        {indicator && (
          <span className="absolute bottom-0 right-0 w-[7px] h-[7px] rounded-full bg-yellow" />
        )}
        {debug && (
          <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap">
            {normalizedVariant}/{normalizedSize}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
