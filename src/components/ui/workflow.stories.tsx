
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Workflow } from "./workflow";

const meta: Meta<typeof Workflow> = {
  title: "UI/Workflow",
  component: Workflow,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
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
