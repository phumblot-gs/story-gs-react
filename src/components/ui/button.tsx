
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-light ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      background: {
        white: "bg-white text-black border-grey-lighter hover:bg-black hover:text-white active:bg-black active:text-blue-primary",
        black: "bg-black text-white border-grey-strongest hover:bg-white hover:text-black active:bg-black active:text-blue-primary",
        grey: "bg-grey text-black border-grey-stronger hover:bg-black hover:text-white active:bg-black active:text-blue-primary",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      background: "white",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  className?: string
  background?: "white" | "black" | "grey"
  featured?: boolean
  indicator?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, background, asChild = false, featured = false, indicator = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Apply featured styles if needed
    let buttonClasses = buttonVariants({ variant, size, background, className });
    
    if (featured) {
      if (background === "white") {
        buttonClasses = cn(buttonClasses, "bg-grey-lighter");
      } else if (background === "black") {
        buttonClasses = cn(buttonClasses, "bg-grey-strongest");
      } else if (background === "grey") {
        buttonClasses = cn(buttonClasses, "bg-white");
      }
    }
    
    if (indicator) {
      // For indicator, we'll wrap the button in a relative div
      // and add the indicator as an absolute div
      return (
        <div className="relative">
          <Comp
            className={buttonClasses}
            ref={ref}
            {...props}
          />
          <div className="absolute bottom-0 right-0 w-[7px] h-[7px] rounded-full bg-yellow"></div>
        </div>
      )
    }
    
    return (
      <Comp
        className={buttonClasses}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
