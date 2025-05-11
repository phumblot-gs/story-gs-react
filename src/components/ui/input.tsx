
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      background: {
        white: "bg-white text-black border-grey-lighter",
        black: "bg-black text-white border-grey-strongest",
        grey: "bg-grey text-black border-grey-stronger",
      },
    },
    defaultVariants: {
      background: "white",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  background?: "white" | "black" | "grey"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, background, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ background, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
