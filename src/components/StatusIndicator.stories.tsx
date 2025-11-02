
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StatusIndicator } from "./StatusIndicator";
import { MediaStatus } from "../utils/mediaStatus";

const meta: Meta<typeof StatusIndicator> = {
  title: "UI/StatusIndicator",
  component: StatusIndicator,
  parameters: {
    layout: "centered",
    controls: {
      sort: 'alpha'
    }
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      options: Object.values(MediaStatus).filter(value => typeof value === 'number'),
      control: { type: "select" },
      description: "The media status to display",
    },
    size: {
      options: ["small", "medium", "large"],
      control: { type: "select" },
      description: "Size of the status indicator (small, medium, large)",
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
    size: "small",
  },
};

export const Medium: Story = {
  args: {
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    size: "large",
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
            <StatusIndicator status={statusValue as MediaStatus} size="small" />
            <StatusIndicator status={statusValue as MediaStatus} size="medium" />
            <StatusIndicator status={statusValue as MediaStatus} size="large" />
          </div>
        ))}
    </div>
  ),
};
