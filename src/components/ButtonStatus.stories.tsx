
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ButtonStatus } from "./ButtonStatus";
import { MediaStatus } from "../utils/mediaStatus";

const meta: Meta<typeof ButtonStatus> = {
  title: "UI/ButtonStatus",
  component: ButtonStatus,
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
      table: {
        type: { summary: "MediaStatus" },
      },
    },
    icon: {
      options: ["Check", "X"],
      control: { type: "radio" },
    },
    isActive: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    size: {
      options: ["small", "medium", "large"],
      control: { type: "select" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonStatus>;

export const Default: Story = {
  args: {
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    icon: "Check",
  },
};

export const Approve: Story = {
  args: {
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    icon: "Check",
  },
};

export const Reject: Story = {
  args: {
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    icon: "X",
  },
};

export const Active: Story = {
  args: {
    status: MediaStatus.VALIDATED,
    icon: "Check",
    isActive: true,
  },
};

export const Disabled: Story = {
  args: {
    status: MediaStatus.IGNORED,
    icon: "Check",
    disabled: true,
  },
};

export const SmallSize: Story = {
  args: {
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    icon: "Check",
    size: "small",
  },
};

export const MediumSize: Story = {
  args: {
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    icon: "Check",
    size: "medium",
  },
};

export const LargeSize: Story = {
  args: {
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    icon: "Check",
    size: "large",
  },
};

// Show all status variations
export const StatusButtonMatrix: Story = {
  render: () => (
    <div className="p-4 bg-white">
      <h3 className="text-lg font-bold mb-4">Status Button Matrix</h3>
      <div className="grid grid-cols-8 gap-4">
        <div></div>
        <div className="font-medium">Default</div>
        <div className="font-medium">Active</div>
        <div className="font-medium">Disabled</div>
        <div className="font-medium">Small</div>
        <div className="font-medium">Small Active</div>
        <div className="font-medium">Medium</div>
        <div className="font-medium">Large</div>
        
        {Object.entries(MediaStatus)
          .filter(([key, value]) => typeof value === 'number')
          .map(([statusName, statusValue]) => (
            <React.Fragment key={statusName}>
              <div className="font-medium self-center">{statusName}</div>
              <div className="flex gap-2">
                <ButtonStatus status={statusValue as MediaStatus} icon="Check" />
                <ButtonStatus status={statusValue as MediaStatus} icon="X" />
              </div>
              <div className="flex gap-2">
                <ButtonStatus status={statusValue as MediaStatus} icon="Check" isActive={true} />
                <ButtonStatus status={statusValue as MediaStatus} icon="X" isActive={true} />
              </div>
              <div className="flex gap-2">
                <ButtonStatus status={statusValue as MediaStatus} icon="Check" disabled={true} />
                <ButtonStatus status={statusValue as MediaStatus} icon="X" disabled={true} />
              </div>
              <div className="flex gap-2">
                <ButtonStatus status={statusValue as MediaStatus} icon="Check" size="small" />
                <ButtonStatus status={statusValue as MediaStatus} icon="X" size="small" />
              </div>
              <div className="flex gap-2">
                <ButtonStatus status={statusValue as MediaStatus} icon="Check" size="small" isActive={true} />
                <ButtonStatus status={statusValue as MediaStatus} icon="X" size="small" isActive={true} />
              </div>
              <div className="flex gap-2">
                <ButtonStatus status={statusValue as MediaStatus} icon="Check" size="medium" />
                <ButtonStatus status={statusValue as MediaStatus} icon="X" size="medium" />
              </div>
              <div className="flex gap-2">
                <ButtonStatus status={statusValue as MediaStatus} icon="Check" size="large" />
                <ButtonStatus status={statusValue as MediaStatus} icon="X" size="large" />
              </div>
            </React.Fragment>
          ))}
      </div>
    </div>
  ),
};
