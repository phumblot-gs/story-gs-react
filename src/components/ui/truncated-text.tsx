
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
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const isInteractingWithContent = useRef(false);

  // Global drag prevention when interacting with tooltip content
  useEffect(() => {
    const handleGlobalDragStart = (e: DragEvent) => {
      if (isInteractingWithContent.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('dragstart', handleGlobalDragStart, true);
    return () => {
      document.removeEventListener('dragstart', handleGlobalDragStart, true);
    };
  }, []);

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
        className={cn("block truncate w-full", className)}
      >
        {text}
      </Component>
    );
  }

  // Handlers to prevent drag when tooltip is open
  const preventDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const stopPropagation = (e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation();
  };

  // If truncated, wrap it with a tooltip
  return (
    <TooltipProvider>
      <Tooltip
        open={isTooltipOpen}
        onOpenChange={(open) => {
          // Don't close if we're interacting with the content
          if (!open && isInteractingWithContent.current) {
            return;
          }
          setIsTooltipOpen(open);
        }}
      >
        <TooltipTrigger asChild>
          <Component
            ref={textRef}
            className={cn("block truncate w-full", className)}
            draggable={isTooltipOpen ? false : undefined}
            onDragStart={(e: React.DragEvent) => {
              if (isTooltipOpen) preventDrag(e);
            }}
            onMouseDown={(e: React.MouseEvent) => {
              if (isTooltipOpen) stopPropagation(e);
            }}
            onPointerDown={(e: React.PointerEvent) => {
              if (isTooltipOpen) stopPropagation(e);
            }}
          >
            {text}
          </Component>
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            "bg-black text-white border border-black-secondary rounded-[2px] break-all select-text cursor-text",
            tooltipMaxWidth,
            tooltipClassName
          )}
          side={tooltipSide}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onMouseLeave={() => {
            isInteractingWithContent.current = false;
            setIsTooltipOpen(false);
          }}
          onMouseDown={(e) => {
            isInteractingWithContent.current = true;
            e.stopPropagation();
          }}
          onPointerDown={(e) => {
            isInteractingWithContent.current = true;
            e.stopPropagation();
          }}
          onMouseUp={() => {
            setTimeout(() => {
              isInteractingWithContent.current = false;
            }, 100);
          }}
          onPointerUp={() => {
            setTimeout(() => {
              isInteractingWithContent.current = false;
            }, 100);
          }}
        >
          <span
            draggable={false}
            onDragStart={preventDrag}
            onMouseDown={(e) => {
              isInteractingWithContent.current = true;
              stopPropagation(e);
            }}
            onMouseUp={() => {
              setTimeout(() => {
                isInteractingWithContent.current = false;
              }, 100);
            }}
            onPointerDown={(e) => {
              isInteractingWithContent.current = true;
              stopPropagation(e);
            }}
            onPointerUp={() => {
              setTimeout(() => {
                isInteractingWithContent.current = false;
              }, 100);
            }}
          >
            {text}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { TruncatedText };
