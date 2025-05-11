
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex w-full h-[90px] border-none px-2.5 py-2 text-sm ring-offset-background placeholder:text-grey-stronger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      background: {
        white: "bg-grey-lighter text-black",
        black: "bg-black text-white",
        grey: "bg-grey text-black",
      },
    },
    defaultVariants: {
      background: "white",
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  background?: "white" | "black" | "grey"
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, background, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ background, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
