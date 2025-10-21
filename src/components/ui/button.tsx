import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Types
export type ButtonVariant = "normal" | "secondary" | "ghost" | "outline" | "destructive" | "link";
export type ButtonSize = "small" | "large";

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
    case "large":
    case "default":
    case undefined:
      return "large";

    default:
      return "large";
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
        link: "btn-link",
      },
      size: {
        small: "p-1 text-sm gap-1",  // 5px padding, gap 5px, font 11px
        large: "p-1 text-base gap-2", // 5px padding, gap 10px, font 13px
      },
    },
    defaultVariants: {
      variant: "normal",
      size: "large",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant | ShadcnVariant;
  size?: ButtonSize | ShadcnSize;
  indicator?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, indicator, className, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const normalizedVariant = normalizeVariant(variant);
    const normalizedSize = normalizeSize(size);

    return (
      <div className="relative inline-flex">
        <Comp
          ref={ref}
          className={cn(
            buttonVariants({
              variant: normalizedVariant,
              size: normalizedSize
            }),
            className
          )}
          {...props}
        >
          {children}
        </Comp>

        {indicator && (
          <div className="absolute bottom-0 right-0 w-1 h-1 rounded-full bg-yellow" />
        )}
      </div>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
