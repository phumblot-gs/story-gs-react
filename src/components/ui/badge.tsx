import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 relative",
  {
    variants: {
      variant: {
        default: "badge-normal",
        secondary: "badge-secondary",
        destructive: "badge-destructive",
        outline: "badge-outline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  debug?: boolean;
}

function Badge({ className, variant, debug, onClick, onFocus, onBlur, ...props }: BadgeProps) {
  const bg = useBgContext();

  // Debug mode : wrapper pour onClick avec log
  const handleClick = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (debug) {
      console.log('[Badge Click]', {
        variant,
        bg,
        event: e,
      });
    }
    onClick?.(e);
  }, [debug, variant, bg, onClick]);

  // Debug mode : wrapper pour onFocus avec log
  const handleFocus = React.useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (debug) {
      console.log('[Badge Focus]', {
        variant,
        bg,
        event: e,
      });
    }
    onFocus?.(e);
  }, [debug, variant, bg, onFocus]);

  // Debug mode : wrapper pour onBlur avec log
  const handleBlur = React.useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (debug) {
      console.log('[Badge Blur]', {
        variant,
        bg,
        event: e,
      });
    }
    onBlur?.(e);
  }, [debug, variant, bg, onBlur]);

  return (
    <div 
      data-bg={bg || undefined}
      className={cn(
        badgeVariants({ variant }), 
        debug && "ring-2 ring-pink ring-offset-2",
        className
      )}
      onClick={debug ? handleClick : onClick}
      onFocus={debug ? handleFocus : onFocus}
      onBlur={debug ? handleBlur : onBlur}
      {...props}
    >
      {props.children}
      {debug && (
        <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap">
          {variant || 'default'}
        </span>
      )}
    </div>
  );
}

export { Badge, badgeVariants }
