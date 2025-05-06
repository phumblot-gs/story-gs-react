
import { cva } from "class-variance-authority"

// Create a size variant using CVA for circle buttons
export const sizeVariants = cva('', {
  variants: {
    size: {
      small: "w-[20px] h-[20px]",
      large: "w-[30px] h-[30px]",
    },
  },
  defaultVariants: { size: "large" },
});
