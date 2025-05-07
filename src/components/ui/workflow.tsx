
import React from "react";
import { cn } from "@/lib/utils";
import { WorkflowStep, WorkflowStepProps } from "./workflow-step";

export interface WorkflowProps {
  steps: (Omit<WorkflowStepProps, "className" | "bench_root_id"> & { bench_id: string })[];
  bench_root_id: number;
  className?: string;
  debug?: boolean;
}

const Workflow: React.FC<WorkflowProps> = ({ steps, bench_root_id, className, debug = false }) => {
  return (
    <div className={cn("flex flex-row items-center bg-white", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step.bench_id}>
          {index > 0 && (
            <div className="h-[1px] w-[10px] bg-black flex-shrink-0"></div>
          )}
          <WorkflowStep
            label={step.label}
            isActive={step.isActive}
            onClick={step.onClick}
            bench_id={step.bench_id}
            bench_root_id={bench_root_id}
            debug={debug}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export { Workflow };
