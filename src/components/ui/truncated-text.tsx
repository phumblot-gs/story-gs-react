
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TruncatedTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
  tooltipClassName?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  tooltipMaxWidth?: string;
}

const TruncatedText = ({
  text,
  className,
  as: Component = "span",
  tooltipClassName,
  tooltipSide = "top",
  tooltipMaxWidth = "max-w-[200px]", // Default max width for tooltip
}: TruncatedTextProps) => {
  const textRef = useRef<HTMLElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        // Compare scrollWidth (the full content width) with clientWidth (visible width)
        const isTrunc = element.scrollWidth > element.clientWidth;
        setIsTruncated(isTrunc);
      }
    };

    // Check on initial render
    checkTruncation();

    // Check on window resize
    window.addEventListener("resize", checkTruncation);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", checkTruncation);
    };
  }, [text]); // Re-check when text changes

  // If not truncated, just render the text
  if (!isTruncated) {
    return (
      <Component ref={textRef} className={cn("truncate", className)}>
        {text}
      </Component>
    );
  }

  // If truncated, wrap it with a tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Component ref={textRef} className={cn("truncate", className)}>
            {text}
          </Component>
        </TooltipTrigger>
        <TooltipContent
          className={cn("bg-black text-white", tooltipMaxWidth, tooltipClassName)}
          side={tooltipSide}
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { TruncatedText };
