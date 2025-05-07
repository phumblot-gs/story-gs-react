
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button-default";

export interface WorkflowStepProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  debug?: boolean;
}

const WorkflowStep = React.forwardRef<HTMLButtonElement, WorkflowStepProps>(
  ({ label, isActive = false, onClick, className, debug = false }, ref) => {
    const handleClick = () => {
      if (debug) {
        console.log(`WorkflowStep clicked: ${label}${isActive ? ' (active)' : ''}`);
      }
      onClick?.();
    };

    return (
      <Button
        ref={ref}
        background={isActive ? "black" : "white"}
        className={cn(
          "h-[30px] px-5 border border-[#EAEAEA] whitespace-nowrap",
          isActive && "pointer-events-none",
          className
        )}
        onClick={isActive ? undefined : handleClick}
      >
        {label}
      </Button>
    );
  }
);

WorkflowStep.displayName = "WorkflowStep";

export { WorkflowStep };
