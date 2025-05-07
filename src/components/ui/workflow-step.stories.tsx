
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { WorkflowStep } from "./workflow-step";

const meta: Meta<typeof WorkflowStep> = {
  title: "UI/WorkflowStep",
  component: WorkflowStep,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isActive: {
      control: "boolean",
    },
    debug: {
      control: "boolean",
      description: "Enables debug logging to the console",
    },
    onClick: { action: "clicked" },
    bench_id: {
      control: "text",
      description: "Unique identifier for the step",
    },
    bench_root_id: {
      control: "number",
      description: "Root ID of the parent workflow",
    },
  },
};

export default meta;
type Story = StoryObj<typeof WorkflowStep>;

export const Default: Story = {
  args: {
    label: "STEP",
    bench_id: "step1",
    bench_root_id: 1001,
  },
};

export const Active: Story = {
  args: {
    label: "VALIDATION",
    isActive: true,
    bench_id: "step2",
    bench_root_id: 1001,
  },
};

export const WithDebug: Story = {
  args: {
    label: "DEBUG",
    debug: true,
    bench_id: "step3",
    bench_root_id: 1001,
  },
};

export const Examples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <WorkflowStep 
          label="LIVE" 
          bench_id="live" 
          bench_root_id={1001}
          onClick={(rootId, stepId) => console.log(`LIVE clicked - rootId: ${rootId}, stepId: ${stepId}`)} 
        />
        <span>Default state (clickable)</span>
      </div>
      <div className="flex items-center gap-2">
        <WorkflowStep 
          label="VALIDATION" 
          isActive={true} 
          bench_id="validation" 
          bench_root_id={1001}
        />
        <span>Active state (not clickable)</span>
      </div>
      <div className="flex items-center gap-2">
        <WorkflowStep 
          label="DEBUG" 
          bench_id="debug" 
          bench_root_id={1001}
          onClick={(rootId, stepId) => console.log(`Debug clicked - rootId: ${rootId}, stepId: ${stepId}`)} 
          debug={true} 
        />
        <span>With debug mode (check console)</span>
      </div>
    </div>
  ),
};
