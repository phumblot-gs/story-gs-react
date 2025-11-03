
import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { WorkflowStep } from "./workflow-step";
import { Layout } from "@/components/layout";

const meta: Meta<typeof WorkflowStep> = {
  title: "UI/WorkflowStep",
  component: WorkflowStep,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "select",
      options: ["active", "current", "inactive"],
      description: "State of the workflow step: active (accessible), current (most advanced), inactive (not yet accessible)",
    },
    debug: {
      control: "boolean",
      description: "Enables debug logging to the console",
    },
    onClick: { action: "clicked" },
    bench_id: {
      control: "number",
      description: "Unique identifier for the step",
    },
    bench_root_id: {
      control: "number",
      description: "Root ID of the parent workflow",
    },
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
type Story = StoryObj<typeof WorkflowStep>;

export const Active: Story = {
  args: {
    label: "STEP",
    state: "active",
    bench_id: 1,
    bench_root_id: 1001,
  },
};

export const Current: Story = {
  args: {
    label: "CURRENT STEP",
    state: "current",
    bench_id: 2,
    bench_root_id: 1001,
  },
};

export const Inactive: Story = {
  args: {
    label: "FUTURE STEP",
    state: "inactive",
    bench_id: 3,
    bench_root_id: 1001,
  },
};

export const WithDebug: Story = {
  args: {
    label: "DEBUG",
    state: "active",
    debug: true,
    bench_id: 4,
    bench_root_id: 1001,
  },
};

export const Examples: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <WorkflowStep 
            label="LIVE" 
            state="active"
            bench_id={1} 
            bench_root_id={1001}
            onClick={(rootId, stepId) => console.log(`LIVE clicked - rootId: ${rootId}, stepId: ${stepId}`)} 
          />
          <span>Active state (variant=secondary, disabled=false) - accessible and clickable</span>
        </div>
        <div className="flex items-center gap-2">
          <WorkflowStep 
            label="VALIDATION" 
            state="current"
            bench_id={2} 
            bench_root_id={1001}
            onClick={(rootId, stepId) => console.log(`VALIDATION clicked - rootId: ${rootId}, stepId: ${stepId}`)} 
          />
          <span>Current state (variant=outline, disabled=false) - most advanced step</span>
        </div>
        <div className="flex items-center gap-2">
          <WorkflowStep 
            label="FUTURE" 
            state="inactive"
            bench_id={3} 
            bench_root_id={1001}
          />
          <span>Inactive state (variant=secondary, disabled=true) - not yet accessible</span>
        </div>
        <div className="flex items-center gap-2">
          <WorkflowStep 
            label="HOVER ME" 
            state="active"
            bench_id={4} 
            bench_root_id={1001}
            onClick={(rootId, stepId) => console.log(`Hover clicked - rootId: ${rootId}, stepId: ${stepId}`)} 
            onFocus={(rootId, stepId) => console.log(`Hover focused - rootId: ${rootId}, stepId: ${stepId}`)}
            onBlur={(rootId, stepId) => console.log(`Hover blurred - rootId: ${rootId}, stepId: ${stepId}`)}
          />
          <span>Hover over this button to see secondary variant behavior and test onFocus/onBlur</span>
        </div>
      </div>
    </Layout>
  ),
};
