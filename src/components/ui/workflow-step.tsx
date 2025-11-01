
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type WorkflowStepState = "active" | "current" | "inactive";

export interface WorkflowStepProps {
  label: string;
  state?: WorkflowStepState;
  onClick?: (bench_root_id: number, bench_id: number) => void;
  onFocus?: (bench_root_id: number, bench_id: number) => void;
  onBlur?: (bench_root_id: number, bench_id: number) => void;
  bench_root_id?: number;
  bench_id?: number;
  className?: string;
  debug?: boolean;
}

const WorkflowStep = React.forwardRef<HTMLButtonElement, WorkflowStepProps>(
  ({ label, state = "inactive", onClick, onFocus, onBlur, bench_root_id, bench_id, className, debug = false }, ref) => {
    const handleClick = () => {
      if (debug) {
        console.log(`WorkflowStep clicked: ${label} (state: ${state}), bench_id: ${bench_id}, bench_root_id: ${bench_root_id}`);
      }
      if (onClick && bench_root_id !== undefined && bench_id !== undefined) {
        onClick(bench_root_id, bench_id);
      }
    };

    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
      if (debug) {
        console.log(`WorkflowStep focused: ${label} (state: ${state}), bench_id: ${bench_id}, bench_root_id: ${bench_root_id}`);
      }
      if (onFocus && bench_root_id !== undefined && bench_id !== undefined) {
        onFocus(bench_root_id, bench_id);
      }
    }, [debug, label, state, bench_id, bench_root_id, onFocus]);

    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
      if (debug) {
        console.log(`WorkflowStep blurred: ${label} (state: ${state}), bench_id: ${bench_id}, bench_root_id: ${bench_root_id}`);
      }
      if (onBlur && bench_root_id !== undefined && bench_id !== undefined) {
        onBlur(bench_root_id, bench_id);
      }
    }, [debug, label, state, bench_id, bench_root_id, onBlur]);

    // Déterminer le variant et disabled selon state
    const getVariant = (): "secondary" | "outline" => {
      switch (state) {
        case "active":
        case "inactive":
          return "secondary";
        case "current":
          return "outline";
        default:
          return "secondary";
      }
    };

    const isDisabled = state === "inactive";

    return (
      <Button
        ref={ref}
        variant={getVariant()}
        size="medium"
        disabled={isDisabled}
        className={cn(
          "whitespace-nowrap",
          className
        )}
        onClick={handleClick}
        onFocus={onFocus || debug ? handleFocus : undefined}
        onBlur={onBlur || debug ? handleBlur : undefined}
      >
        {label}
      </Button>
    );
  }
);

WorkflowStep.displayName = "WorkflowStep";

export { WorkflowStep };
