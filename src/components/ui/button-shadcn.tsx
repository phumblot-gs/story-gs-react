import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom variants for our design system
        white: "bg-white text-black border border-border hover:bg-muted",
        black: "bg-[rgb(var(--bg-black))] text-white hover:bg-[rgb(var(--bg-black-secondary))]",
        grey: "bg-[rgb(var(--bg-grey))] text-black hover:bg-[rgb(var(--bg-grey-lighter))]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        // Custom sizes matching our design system
        small: "h-6 px-3 py-2 text-xs",
        large: "h-[30px] px-[15px] py-[10px] text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  featured?: boolean
  isActive?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, featured, isActive, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Apply active state styles
    const activeStyles = isActive ? "bg-[rgb(var(--bg-black-secondary))] text-white" : ""

    // Apply featured styles
    const featuredStyles = featured && !props.disabled
      ? "hover:bg-accent hover:text-accent-foreground active:bg-primary active:text-primary-foreground"
      : ""

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          activeStyles,
          featuredStyles,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }