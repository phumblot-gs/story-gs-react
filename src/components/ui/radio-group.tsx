
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const radioGroupItemVariants = cva(
  "aspect-square h-3 w-3 rounded-full align-baseline border-none ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      background: {
        white: "bg-grey-lighter [&>span>svg]:fill-black [&>span>svg]:text-black data-[state=checked]:bg-black data-[state=checked]:text-white [&>span>svg]:data-[state=checked]:fill-white [&>span>svg]:data-[state=checked]:text-white",
        black: "bg-black [&>span>svg]:fill-white [&>span>svg]:text-white",
        grey: "bg-grey [&>span>svg]:fill-black [&>span>svg]:text-black data-[state=checked]:bg-black data-[state=checked]:text-white [&>span>svg]:data-[state=checked]:fill-white [&>span>svg]:data-[state=checked]:text-white",
      },
    },
    defaultVariants: {
      background: "white",
    },
  }
)

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioGroupItemVariants> {
  background?: "white" | "black" | "grey"
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, background, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioGroupItemVariants({ background, className }))}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <svg 
          className="h-2 w-2 fill-current text-current" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="6"></circle>
        </svg>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem, radioGroupItemVariants }
