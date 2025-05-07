
import React from "react";
import { cn } from "@/lib/utils";
import { WorkflowStep, WorkflowStepProps } from "./workflow-step";

export interface WorkflowProps {
  steps: (Omit<WorkflowStepProps, "className"> & { id: string })[];
  className?: string;
}

const Workflow: React.FC<WorkflowProps> = ({ steps, className }) => {
  return (
    <div className={cn("flex flex-row items-center bg-white", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {index > 0 && (
            <div className="h-[1px] w-[10px] bg-black flex-shrink-0"></div>
          )}
          <WorkflowStep
            label={step.label}
            isActive={step.isActive}
            onClick={step.onClick}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

export { Workflow };
