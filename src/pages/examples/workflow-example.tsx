
import React, { useState } from "react";
import { Workflow } from "@/components/ui/workflow";
import { WorkflowStepState } from "@/components/ui/workflow-step";

export const WorkflowExample: React.FC = () => {
  const [activeStep, setActiveStep] = useState(4);
  const bench_root_id = 1001; // Example bench_root_id

  const handleStepClick = (bench_root_id: number, bench_id: number) => {
    console.log(`Step clicked: bench_root_id=${bench_root_id}, bench_id=${bench_id}`);
    setActiveStep(bench_id);
  };

  const steps = [
    { 
      bench_id: 1, 
      label: "LIVE", 
      state: (activeStep === 1 ? "current" : (activeStep > 1 ? "active" : "inactive")) as WorkflowStepState,
      onClick: handleStepClick
    },
    { 
      bench_id: 2, 
      label: "PHASE 1", 
      state: (activeStep === 2 ? "current" : (activeStep > 2 ? "active" : "inactive")) as WorkflowStepState,
      onClick: handleStepClick
    },
    { 
      bench_id: 3, 
      label: "EXPORTS", 
      state: (activeStep === 3 ? "current" : (activeStep > 3 ? "active" : "inactive")) as WorkflowStepState,
      onClick: handleStepClick
    },
    { 
      bench_id: 4, 
      label: "VALIDATION", 
      state: (activeStep === 4 ? "current" : (activeStep > 4 ? "active" : "inactive")) as WorkflowStepState,
      onClick: handleStepClick
    },
  ];

  return (
    <div className="p-6 bg-white">
      <h2 className="text-lg font-medium mb-4">Workflow Example</h2>
      <Workflow steps={steps} bench_root_id={bench_root_id} debug={true} />
      
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-sm">Current step: {steps.find(step => step.state === "current")?.label}</p>
        <p className="text-xs text-gray-500 mt-1">Debug mode is enabled. Check the console when clicking steps.</p>
        <p className="text-xs text-gray-500">bench_root_id: {bench_root_id}</p>
      </div>
    </div>
  );
};

export default WorkflowExample;
