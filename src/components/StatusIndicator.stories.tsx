
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StatusIndicator } from "./StatusIndicator";
import { MediaStatus } from "../utils/mediaStatus";

const meta: Meta<typeof StatusIndicator> = {
  title: "Components/StatusIndicator",
  component: StatusIndicator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      options: Object.values(MediaStatus).filter(value => typeof value === 'number'),
      control: { type: "select" },
      description: "The media status to display",
    },
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "radio" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StatusIndicator>;

export const Default: Story = {
  args: {
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
  },
};

export const Small: Story = {
  args: {
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    size: "md",
  },
};

export const Large: Story = {
  args: {
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    size: "lg",
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {Object.entries(MediaStatus)
        .filter(([key, value]) => typeof value === 'number')
        .map(([statusName, statusValue]) => (
          <div key={statusName} className="flex items-center gap-4">
            <div className="w-32 font-medium">{statusName}</div>
            <StatusIndicator status={statusValue as MediaStatus} size="sm" />
            <StatusIndicator status={statusValue as MediaStatus} size="md" />
            <StatusIndicator status={statusValue as MediaStatus} size="lg" />
          </div>
        ))}
    </div>
  ),
};
