
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WorkflowTestSection from "./test/WorkflowTestSection";

const WorkflowPage: React.FC = () => {
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workflow Test</h1>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
      <WorkflowTestSection />
    </div>
  );
};

export default WorkflowPage;
