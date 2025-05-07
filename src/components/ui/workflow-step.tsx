
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button-default";

export interface WorkflowStepProps {
  label: string;
  isActive?: boolean;
  onClick?: (bench_root_id: number, bench_id: string) => void;
  bench_root_id?: number;
  bench_id?: string;
  className?: string;
  debug?: boolean;
}

const WorkflowStep = React.forwardRef<HTMLButtonElement, WorkflowStepProps>(
  ({ label, isActive = false, onClick, bench_root_id, bench_id, className, debug = false }, ref) => {
    const handleClick = () => {
      if (debug) {
        console.log(`WorkflowStep clicked: ${label}${isActive ? ' (active)' : ''}, bench_id: ${bench_id}, bench_root_id: ${bench_root_id}`);
      }
      if (onClick && bench_root_id !== undefined && bench_id !== undefined) {
        onClick(bench_root_id, bench_id);
      }
    };

    return (
      <Button
        ref={ref}
        background={isActive ? "black" : "white"}
        className={cn(
          "h-[30px] px-5 border border-[#EAEAEA] whitespace-nowrap text-xs",
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
