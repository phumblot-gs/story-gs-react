
import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const switchVariants = cva(
  "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      background: {
        white: "data-[state=checked]:bg-black data-[state=unchecked]:bg-grey-light [&>span]:bg-white [&>span]:data-[state=checked]:border-black",
        black: "data-[state=checked]:bg-blue-primary data-[state=unchecked]:bg-grey-strongest [&>span]:bg-black [&>span]:data-[state=checked]:border-blue-primary",
        grey: "data-[state=checked]:bg-black data-[state=unchecked]:bg-grey-stronger [&>span]:bg-grey [&>span]:data-[state=checked]:border-black",
      },
    },
    defaultVariants: {
      background: "white",
    },
  }
)

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {
  background?: "white" | "black" | "grey"  
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, background, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchVariants({ background, className }))}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch, switchVariants }
