
import React, { useState } from "react";
import { Workflow } from "../ui/workflow";

export const WorkflowExample: React.FC = () => {
  const [activeStep, setActiveStep] = useState("4");

  const steps = [
    { 
      id: "1", 
      label: "LIVE", 
      isActive: activeStep === "1",
      onClick: () => setActiveStep("1") 
    },
    { 
      id: "2", 
      label: "PHASE 1", 
      isActive: activeStep === "2",
      onClick: () => setActiveStep("2") 
    },
    { 
      id: "3", 
      label: "EXPORTS", 
      isActive: activeStep === "3",
      onClick: () => setActiveStep("3") 
    },
    { 
      id: "4", 
      label: "VALIDATION", 
      isActive: activeStep === "4",
      onClick: () => setActiveStep("4") 
    },
  ];

  return (
    <div className="p-6 bg-white">
      <h2 className="text-lg font-medium mb-4">Workflow Example</h2>
      <Workflow steps={steps} debug={true} />
      
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <p className="text-sm">Current active step: {steps.find(step => step.isActive)?.label}</p>
        <p className="text-xs text-gray-500 mt-1">Debug mode is enabled. Check the console when clicking steps.</p>
      </div>
    </div>
  );
};
