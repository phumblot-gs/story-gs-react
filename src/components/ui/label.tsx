
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-[30px] peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      background: {
        white: "text-black",
        black: "text-white",
        grey: "text-black",
      },
    },
    defaultVariants: {
      background: "white",
    },
  }
)

export interface LabelProps extends
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
  VariantProps<typeof labelVariants> {
  background?: "white" | "black" | "grey"
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, background, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ background, className }))}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants }
