
import type { Meta, StoryObj } from "@storybook/react";
import { ButtonStatus } from "./ButtonStatus";
import { MediaStatus } from "../utils/mediaStatus";

const meta: Meta<typeof ButtonStatus> = {
  title: "Components/ButtonStatus",
  component: ButtonStatus,
  parameters: {
    layout: "centered",
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
      options: ["small", "large"],
      control: { type: "radio" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonStatus>;

export const Default: Story = {
  args: {
    status: MediaStatus.FOR_APPROVAL,
    icon: "Check",
  },
};

export const Approve: Story = {
  args: {
    status: MediaStatus.FOR_APPROVAL,
    icon: "Check",
  },
};

export const Reject: Story = {
  args: {
    status: MediaStatus.FOR_APPROVAL,
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
    status: MediaStatus.FOR_APPROVAL,
    icon: "Check",
    size: "small",
  },
};

// Show all status variations
export const StatusButtonMatrix: Story = {
  render: () => (
    <div className="p-4 bg-white">
      <h3 className="text-lg font-bold mb-4">Status Button Matrix</h3>
      <div className="grid grid-cols-6 gap-4">
        <div></div>
        <div className="font-medium">Default</div>
        <div className="font-medium">Active</div>
        <div className="font-medium">Disabled</div>
        <div className="font-medium">Small</div>
        <div className="font-medium">Small Active</div>
        
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
            </React.Fragment>
          ))}
      </div>
    </div>
  ),
};
