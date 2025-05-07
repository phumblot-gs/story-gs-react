
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
- Supports multiple steps with unique identifiers
- Visual indication of active step
- Click handlers for each step
- Debug mode for development

## Usage Example

\`\`\`tsx
import { useState } from 'react';
import { Workflow } from './workflow';

export const WorkflowExample = () => {
  const [activeStepId, setActiveStepId] = useState('1');
  
  const workflowSteps = [
    { 
      id: "1", 
      label: "STEP 1", 
      isActive: activeStepId === '1',
      onClick: () => setActiveStepId('1')
    },
    { 
      id: "2", 
      label: "STEP 2", 
      isActive: activeStepId === '2',
      onClick: () => setActiveStepId('2')
    },
    { 
      id: "3", 
      label: "STEP 3", 
      isActive: activeStepId === '3',
      onClick: () => setActiveStepId('3')
    },
  ];

  return (
    <div className="p-4 bg-white">
      <Workflow 
        steps={workflowSteps}
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
    }
  },
};

export default meta;
type Story = StoryObj<typeof Workflow>;

export const Default: Story = {
  args: {
    steps: [
      { id: "1", label: "LIVE", onClick: () => console.log("LIVE clicked") },
      { id: "2", label: "PHASE 1", onClick: () => console.log("PHASE 1 clicked") },
      { id: "3", label: "EXPORTS", onClick: () => console.log("EXPORTS clicked") },
      { id: "4", label: "VALIDATION", isActive: true },
    ],
  },
};

export const WithCustomSteps: Story = {
  args: {
    steps: [
      { id: "1", label: "START", onClick: () => console.log("START clicked") },
      { id: "2", label: "PROCESSING", onClick: () => console.log("PROCESSING clicked") },
      { id: "3", label: "COMPLETE", isActive: true },
    ],
  },
};

export const AllClickable: Story = {
  args: {
    steps: [
      { id: "1", label: "STEP 1", onClick: () => console.log("STEP 1 clicked") },
      { id: "2", label: "STEP 2", onClick: () => console.log("STEP 2 clicked") },
      { id: "3", label: "STEP 3", onClick: () => console.log("STEP 3 clicked") },
      { id: "4", label: "STEP 4", onClick: () => console.log("STEP 4 clicked") },
    ],
  },
};

// Add a new interactive example with debug mode enabled
export const WithDebugMode: Story = {
  args: {
    steps: [
      { id: "1", label: "LIVE", onClick: () => console.log("LIVE clicked") },
      { id: "2", label: "PHASE 1", onClick: () => console.log("PHASE 1 clicked") },
      { id: "3", label: "EXPORTS", onClick: () => console.log("EXPORTS clicked") },
      { id: "4", label: "VALIDATION", isActive: true },
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
  
  const steps = [
    {
      id: "1",
      label: "STEP 1", 
      isActive: activeStep === "1",
      onClick: () => setActiveStep("1")
    },
    {
      id: "2",
      label: "STEP 2",
      isActive: activeStep === "2",
      onClick: () => setActiveStep("2")
    },
    {
      id: "3",
      label: "STEP 3",
      isActive: activeStep === "3",
      onClick: () => setActiveStep("3")
    }
  ];
  
  return (
    <div className="p-4 flex flex-col gap-4">
      <Workflow steps={steps} debug={true} />
      <div className="p-2 bg-gray-100 rounded text-sm">
        Current step: {steps.find(s => s.isActive)?.label}
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
