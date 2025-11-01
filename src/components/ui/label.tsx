
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

const labelVariants = cva(
  "text-sm leading-[30px] peer-disabled:cursor-not-allowed peer-disabled:opacity-70 label-default",
  {
    variants: {},
    defaultVariants: {},
  }
)

export interface LabelProps extends
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => {
  const bg = useBgContext();

  return (
    <LabelPrimitive.Root
      ref={ref}
      data-bg={bg || undefined}
      className={cn(labelVariants(), className)}
      {...props}
    />
  );
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants }
