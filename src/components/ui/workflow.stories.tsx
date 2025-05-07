
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Workflow } from "./workflow";

const meta: Meta<typeof Workflow> = {
  title: "UI/Workflow",
  component: Workflow,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A workflow component that displays a series of steps with active state indicators.

## Features
- Supports multiple steps with unique identifiers (bench_id)
- Visual indication of active step
- Click handlers for each step that receive bench_root_id and bench_id
- Debug mode for development

## Usage Example

\`\`\`tsx
import { useState } from 'react';
import { Workflow } from './workflow';

export const WorkflowExample = () => {
  const [activeStepId, setActiveStepId] = useState('1');
  const bench_root_id = 1001; // Root ID for the workflow
  
  const handleStepClick = (rootId: number, stepId: string) => {
    console.log(\`Step clicked: rootId=\${rootId}, stepId=\${stepId}\`);
    setActiveStepId(stepId);
  };
  
  const workflowSteps = [
    { 
      bench_id: "1", 
      label: "STEP 1", 
      isActive: activeStepId === '1',
      onClick: handleStepClick
    },
    { 
      bench_id: "2", 
      label: "STEP 2", 
      isActive: activeStepId === '2',
      onClick: handleStepClick
    },
    { 
      bench_id: "3", 
      label: "STEP 3", 
      isActive: activeStepId === '3',
      onClick: handleStepClick
    },
  ];

  return (
    <div className="p-4 bg-white">
      <Workflow 
        steps={workflowSteps}
        bench_root_id={bench_root_id}
        debug={true} // Enable console logging for development
      />
      <div className="mt-4 p-2 bg-gray-100 rounded">
        Current active step: {workflowSteps.find(step => step.isActive)?.label}
      </div>
    </div>
  );
};
\`\`\`
`
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
    debug: {
      control: "boolean",
      description: "Enables debug logging to the console",
    },
    steps: {
      description: "Array of workflow step options",
    },
    className: {
      description: "Additional CSS class names",
    },
    bench_root_id: {
      control: "number",
      description: "Root ID of the workflow (required)",
    }
  },
};

export default meta;
type Story = StoryObj<typeof Workflow>;

export const Default: Story = {
  args: {
    bench_root_id: 1001,
    steps: [
      { bench_id: "1", label: "LIVE", onClick: (rootId, stepId) => console.log(`LIVE clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: "2", label: "PHASE 1", onClick: (rootId, stepId) => console.log(`PHASE 1 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: "3", label: "EXPORTS", onClick: (rootId, stepId) => console.log(`EXPORTS clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: "4", label: "VALIDATION", isActive: true },
    ],
  },
};

export const WithCustomSteps: Story = {
  args: {
    bench_root_id: 1002,
    steps: [
      { bench_id: "1", label: "START", onClick: (rootId, stepId) => console.log(`START clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: "2", label: "PROCESSING", onClick: (rootId, stepId) => console.log(`PROCESSING clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: "3", label: "COMPLETE", isActive: true },
    ],
  },
};

export const AllClickable: Story = {
  args: {
    bench_root_id: 1003,
    steps: [
      { bench_id: "1", label: "STEP 1", onClick: (rootId, stepId) => console.log(`STEP 1 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: "2", label: "STEP 2", onClick: (rootId, stepId) => console.log(`STEP 2 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: "3", label: "STEP 3", onClick: (rootId, stepId) => console.log(`STEP 3 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: "4", label: "STEP 4", onClick: (rootId, stepId) => console.log(`STEP 4 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
    ],
  },
};

export const WithDebugMode: Story = {
  args: {
    bench_root_id: 1004,
    steps: [
      { bench_id: "1", label: "LIVE", onClick: (rootId, stepId) => console.log(`LIVE clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: "2", label: "PHASE 1", onClick: (rootId, stepId) => console.log(`PHASE 1 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: "3", label: "EXPORTS", onClick: (rootId, stepId) => console.log(`EXPORTS clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: "4", label: "VALIDATION", isActive: true },
    ],
    debug: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'This example has debug mode enabled. Check the console for log messages when clicking steps.'
      }
    }
  }
};

// Add an interactive example that demonstrates a state-driven workflow
const InteractiveExample = () => {
  const [activeStep, setActiveStep] = React.useState("2");
  const bench_root_id = 1005;
  
  const handleStepClick = (rootId: number, stepId: string) => {
    console.log(`Step clicked: rootId=${rootId}, stepId=${stepId}`);
    setActiveStep(stepId);
  };
  
  const steps = [
    {
      bench_id: "1",
      label: "STEP 1", 
      isActive: activeStep === "1",
      onClick: handleStepClick
    },
    {
      bench_id: "2",
      label: "STEP 2",
      isActive: activeStep === "2",
      onClick: handleStepClick
    },
    {
      bench_id: "3",
      label: "STEP 3",
      isActive: activeStep === "3",
      onClick: handleStepClick
    }
  ];
  
  return (
    <div className="p-4 flex flex-col gap-4">
      <Workflow steps={steps} bench_root_id={bench_root_id} debug={true} />
      <div className="p-2 bg-gray-100 rounded text-sm">
        <p>Current step: {steps.find(s => s.isActive)?.label}</p>
        <p className="text-xs text-gray-500">bench_root_id: {bench_root_id}</p>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveExample />,
  parameters: {
    docs: {
      description: {
        story: 'An interactive example showing state management with the Workflow component.'
      }
    }
  }
};
