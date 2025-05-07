
import React from "react";
import { Workflow } from "../ui/workflow";

export const WorkflowExample: React.FC = () => {
  return (
    <div className="p-6 bg-white">
      <h2 className="text-lg font-medium mb-4">Workflow Example</h2>
      <Workflow
        steps={[
          { id: "1", label: "LIVE", onClick: () => console.log("LIVE clicked") },
          { id: "2", label: "PHASE 1", onClick: () => console.log("PHASE 1 clicked") },
          { id: "3", label: "EXPORTS", onClick: () => console.log("EXPORTS clicked") },
          { id: "4", label: "VALIDATION", isActive: true },
        ]}
      />
    </div>
  );
};
