
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
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof WorkflowStep>;

export const Default: Story = {
  args: {
    label: "STEP",
  },
};

export const Active: Story = {
  args: {
    label: "VALIDATION",
    isActive: true,
  },
};

export const Examples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <WorkflowStep label="LIVE" onClick={() => console.log("LIVE clicked")} />
        <span>Default state (clickable)</span>
      </div>
      <div className="flex items-center gap-2">
        <WorkflowStep label="VALIDATION" isActive={true} />
        <span>Active state (not clickable)</span>
      </div>
    </div>
  ),
};
