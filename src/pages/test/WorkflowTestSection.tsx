
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow } from "@/components/ui/workflow";
import { WorkflowStep } from "@/components/ui/workflow-step";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const WorkflowTestSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState("2");
  const [benchRootId, setBenchRootId] = useState(1001);
  const [debugMode, setDebugMode] = useState(true);

  const handleStepClick = (bench_root_id: number, bench_id: string) => {
    console.log(`Step clicked: bench_root_id=${bench_root_id}, bench_id=${bench_id}`);
    setActiveStep(bench_id);
  };

  const workflowSteps = [
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

  const resetToStep = (stepId: string) => {
    setActiveStep(stepId);
  };

  return (
    <div className="space-y-6">
      {/* Workflow Component Test */}
      <Card>
        <CardHeader>
          <CardTitle>Workflow Component Test</CardTitle>
          <CardDescription>Test the complete Workflow component with multiple steps</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Workflow Preview */}
            <div className="border rounded-lg p-6 bg-white">
              <Workflow 
                steps={workflowSteps} 
                bench_root_id={benchRootId} 
                debug={debugMode} 
              />
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bench-root-id">Bench Root ID</Label>
                <Input 
                  id="bench-root-id"
                  type="number" 
                  value={benchRootId} 
                  onChange={(e) => setBenchRootId(Number(e.target.value))} 
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="debug-mode"
                  checked={debugMode}
                  onCheckedChange={(checked) => setDebugMode(!!checked)}
                />
                <Label htmlFor="debug-mode">Debug Mode</Label>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" onClick={() => resetToStep("1")}>Set LIVE Active</Button>
              <Button size="sm" onClick={() => resetToStep("2")}>Set PHASE 1 Active</Button>
              <Button size="sm" onClick={() => resetToStep("3")}>Set EXPORTS Active</Button>
              <Button size="sm" onClick={() => resetToStep("4")}>Set VALIDATION Active</Button>
            </div>

            {/* Status Display */}
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-sm font-medium">Current Active Step: {workflowSteps.find(step => step.isActive)?.label}</p>
              <p className="text-xs text-gray-500 mt-1">Bench Root ID: {benchRootId}</p>
              <p className="text-xs text-gray-500">Debug Mode: {debugMode ? 'Enabled' : 'Disabled'}</p>
              {debugMode && <p className="text-xs text-gray-500">Check the console for click events</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual WorkflowStep Component Test */}
      <Card>
        <CardHeader>
          <CardTitle>Individual WorkflowStep Component Test</CardTitle>
          <CardDescription>Test individual WorkflowStep components in different states</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Default State */}
              <div className="space-y-2">
                <Label>Default State (Clickable)</Label>
                <WorkflowStep 
                  label="DEFAULT" 
                  bench_id="default" 
                  bench_root_id={benchRootId}
                  onClick={(rootId, stepId) => console.log(`Default clicked - rootId: ${rootId}, stepId: ${stepId}`)}
                  debug={debugMode}
                />
              </div>

              {/* Active State */}
              <div className="space-y-2">
                <Label>Active State (Not Clickable)</Label>
                <WorkflowStep 
                  label="ACTIVE" 
                  isActive={true}
                  bench_id="active" 
                  bench_root_id={benchRootId}
                  debug={debugMode}
                />
              </div>

              {/* Long Label Test */}
              <div className="space-y-2">
                <Label>Long Label Test</Label>
                <WorkflowStep 
                  label="VERY LONG LABEL TEST" 
                  bench_id="long" 
                  bench_root_id={benchRootId}
                  onClick={(rootId, stepId) => console.log(`Long label clicked - rootId: ${rootId}, stepId: ${stepId}`)}
                  debug={debugMode}
                />
              </div>

              {/* Custom Styling Test */}
              <div className="space-y-2">
                <Label>Custom Styling</Label>
                <WorkflowStep 
                  label="CUSTOM" 
                  bench_id="custom" 
                  bench_root_id={benchRootId}
                  onClick={(rootId, stepId) => console.log(`Custom clicked - rootId: ${rootId}, stepId: ${stepId}`)}
                  debug={debugMode}
                  className="border-blue-500 hover:border-blue-600"
                />
              </div>
            </div>

            {/* Dynamic Test */}
            <div className="mt-6 p-4 border rounded-lg">
              <h4 className="text-sm font-medium mb-2">Dynamic Step Test</h4>
              <p className="text-xs text-gray-500 mb-3">Click to toggle between active/inactive states</p>
              <DynamicWorkflowStepTest benchRootId={benchRootId} debugMode={debugMode} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Component for dynamic testing
const DynamicWorkflowStepTest: React.FC<{ benchRootId: number; debugMode: boolean }> = ({ benchRootId, debugMode }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = (rootId: number, stepId: string) => {
    console.log(`Dynamic step clicked - rootId: ${rootId}, stepId: ${stepId}, was active: ${isActive}`);
    setIsActive(!isActive);
  };

  return (
    <div className="flex items-center gap-4">
      <WorkflowStep 
        label="DYNAMIC" 
        isActive={isActive}
        bench_id="dynamic" 
        bench_root_id={benchRootId}
        onClick={handleClick}
        debug={debugMode}
      />
      <span className="text-sm text-gray-600">
        State: {isActive ? 'Active' : 'Inactive'} - Click to toggle
      </span>
    </div>
  );
};

export default WorkflowTestSection;
