
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
  tooltipMaxWidth = "max-w-[200px]",
}: TruncatedTextProps) => {
  const textRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLElement | null>(null);
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

    // Setup ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      // Re-check truncation when container size changes
      checkTruncation();
    });

    // Start observing the element
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
      
      // If we have a parent container, observe that too
      if (textRef.current.parentElement) {
        containerRef.current = textRef.current.parentElement;
        resizeObserver.observe(containerRef.current);
      }
    }
    
    // Check on window resize as well
    window.addEventListener("resize", checkTruncation);
    
    // Cleanup
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkTruncation);
    };
  }, [text]); // Re-check when text changes

  // If not truncated, just render the text
  if (!isTruncated) {
    return (
      <Component 
        ref={textRef} 
        className={cn("truncate w-full", className)}
      >
        {text}
      </Component>
    );
  }

  // If truncated, wrap it with a tooltip
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Component 
            ref={textRef} 
            className={cn("truncate w-full", className)}
          >
            {text}
          </Component>
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            "bg-black text-white border border-black-secondary rounded-[2px]", 
            tooltipMaxWidth, 
            tooltipClassName
          )}
          side={tooltipSide}
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { TruncatedText };
