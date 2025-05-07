
import React, { useState } from "react";
import { Workflow } from "../ui/workflow";

export const WorkflowExample: React.FC = () => {
  const [activeStep, setActiveStep] = useState("4");
  const bench_root_id = 1001; // Example bench_root_id

  const handleStepClick = (bench_root_id: number, bench_id: string) => {
    console.log(`Step clicked: bench_root_id=${bench_root_id}, bench_id=${bench_id}`);
    setActiveStep(bench_id);
  };

  const steps = [
    { 
      bench_id: "1", 
      label: "LIVE", 
      isActive: activeStep === "1",
      onClick: handleStepClick
    },
    { 
      bench_id: "2", 
      label: "PHASE 1", 
      isActive: activeStep === "2",
      onClick: handleStepClick
    },
    { 
      bench_id: "3", 
      label: "EXPORTS", 
      isActive: activeStep === "3",
      onClick: handleStepClick
    },
    { 
      bench_id: "4", 
      label: "VALIDATION", 
      isActive: activeStep === "4",
      onClick: handleStepClick
    },
  ];

  return (
    <div className="p-6 bg-white">
      <h2 className="text-lg font-medium mb-4">Workflow Example</h2>
      <Workflow steps={steps} bench_root_id={bench_root_id} debug={true} />
      
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-sm">Current active step: {steps.find(step => step.isActive)?.label}</p>
        <p className="text-xs text-gray-500 mt-1">Debug mode is enabled. Check the console when clicking steps.</p>
        <p className="text-xs text-gray-500">bench_root_id: {bench_root_id}</p>
      </div>
    </div>
  );
};
