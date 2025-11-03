
import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Workflow } from "./workflow";
import { Layout } from "@/components/layout";

const meta: Meta<typeof Workflow> = {
  title: "UI/Workflow",
  component: Workflow,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A workflow component that displays a series of steps with state indicators.

## Features
- Supports multiple steps with unique identifiers (bench_id)
- Three states: active (accessible), current (most advanced), inactive (not yet accessible)
- Visual indication of step state through Button variants
- Click handlers for each step that receive bench_root_id and bench_id
- Debug mode for development

## Step States
- **active**: Step is accessible and clickable (variant=secondary, disabled=false)
- **current**: Step is the most advanced active step (variant=outline, disabled=false)
- **inactive**: Step is not yet accessible (variant=secondary, disabled=true)

## Usage Example

\`\`\`tsx
import { useState } from 'react';
import { Workflow } from './workflow';

export const WorkflowExample = () => {
  const [currentStepId, setCurrentStepId] = useState(2);
  const bench_root_id = 1001; // Root ID for the workflow
  
  const handleStepClick = (rootId: number, stepId: number) => {
    console.log(\`Step clicked: rootId=\${rootId}, stepId=\${stepId}\`);
    setCurrentStepId(stepId);
  };
  
  const workflowSteps = [
    { 
      bench_id: 1, 
      label: "STEP 1", 
      state: currentStepId === 1 ? "current" : (currentStepId > 1 ? "active" : "inactive"),
      onClick: handleStepClick
    },
    { 
      bench_id: 2, 
      label: "STEP 2", 
      state: currentStepId === 2 ? "current" : (currentStepId > 2 ? "active" : "inactive"),
      onClick: handleStepClick
    },
    { 
      bench_id: 3, 
      label: "STEP 3", 
      state: currentStepId === 3 ? "current" : (currentStepId > 3 ? "active" : "inactive"),
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
        Current step: {workflowSteps.find(step => step.state === "current")?.label}
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
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <Story />
      </Layout>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Workflow>;

export const Default: Story = {
  args: {
    bench_root_id: 1001,
    steps: [
      { bench_id: 1, label: "LIVE", state: "active", onClick: (rootId, stepId) => console.log(`LIVE clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: 2, label: "PHASE 1", state: "current", onClick: (rootId, stepId) => console.log(`PHASE 1 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: 3, label: "EXPORTS", state: "active", onClick: (rootId, stepId) => console.log(`EXPORTS clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: 4, label: "VALIDATION", state: "inactive" },
    ],
  },
};

export const WithCustomSteps: Story = {
  args: {
    bench_root_id: 1002,
    steps: [
      { bench_id: 1, label: "START", state: "active", onClick: (rootId, stepId) => console.log(`START clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: 2, label: "PROCESSING", state: "active", onClick: (rootId, stepId) => console.log(`PROCESSING clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: 3, label: "COMPLETE", state: "current" },
    ],
  },
};

export const AllClickable: Story = {
  args: {
    bench_root_id: 1003,
    steps: [
      { bench_id: 1, label: "STEP 1", state: "active", onClick: (rootId, stepId) => console.log(`STEP 1 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: 2, label: "STEP 2", state: "active", onClick: (rootId, stepId) => console.log(`STEP 2 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: 3, label: "STEP 3", state: "active", onClick: (rootId, stepId) => console.log(`STEP 3 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: 4, label: "STEP 4", state: "active", onClick: (rootId, stepId) => console.log(`STEP 4 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
    ],
  },
};

export const WithDebugMode: Story = {
  args: {
    bench_root_id: 1004,
    steps: [
      { bench_id: 1, label: "LIVE", state: "active", onClick: (rootId, stepId) => console.log(`LIVE clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: 2, label: "PHASE 1", state: "active", onClick: (rootId, stepId) => console.log(`PHASE 1 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: 3, label: "EXPORTS", state: "active", onClick: (rootId, stepId) => console.log(`EXPORTS clicked - rootId: ${rootId}, stepId: ${stepId}`) },
      { bench_id: 4, label: "VALIDATION", state: "current" },
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
  const [currentStep, setCurrentStep] = React.useState(2);
  const bench_root_id = 1005;
  
  const handleStepClick = (rootId: number, stepId: number) => {
    console.log(`Step clicked: rootId=${rootId}, stepId=${stepId}`);
    setCurrentStep(stepId);
  };
  
  const steps = [
    {
      bench_id: 1,
      label: "STEP 1", 
      state: currentStep === 1 ? "current" : (currentStep > 1 ? "active" : "inactive"),
      onClick: handleStepClick
    },
    {
      bench_id: 2,
      label: "STEP 2",
      state: currentStep === 2 ? "current" : (currentStep > 2 ? "active" : "inactive"),
      onClick: handleStepClick
    },
    {
      bench_id: 3,
      label: "STEP 3",
      state: currentStep === 3 ? "current" : (currentStep > 3 ? "active" : "inactive"),
      onClick: handleStepClick
    }
  ];
  
  return (
    <div className="p-4 flex flex-col gap-4">
      <Workflow steps={steps} bench_root_id={bench_root_id} debug={true} />
      <div className="p-2 bg-gray-100 rounded text-sm">
        <p>Current step: {steps.find(s => s.state === "current")?.label}</p>
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
