
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
    },
    docs: {
      description: {
        component: `ButtonStatus component for displaying media status with approve/reject actions.

## Features
- Media status display with color-coded appearance
- Approve (Check) or Reject (X) icon support
- Active state management via \`isActive\` prop
- Three sizes (small, medium, large)
- Disabled state support
- Event handlers (onClick, onFocus, onBlur)
- Debug mode for development

## Active State with isActive

The \`isActive\` prop allows you to control the active state of the button. When \`isActive\` is \`true\`, the button displays an active appearance (applies hover styles).

**Important:** The ButtonStatus component does not automatically toggle the \`isActive\` state. You must implement the toggle logic yourself in the \`onClick\` handler.

\`\`\`tsx
// Controlled active state - YOU must handle the toggle logic
const [isActive, setIsActive] = useState(false);

<ButtonStatus
  status={MediaStatus.SUBMITTED_FOR_APPROVAL}
  icon="Check"
  isActive={isActive}
  onClick={() => setIsActive(!isActive)} // Toggle logic is YOUR responsibility
/>
\`\`\`

**Behavior:**
- When \`isActive\` is \`true\`, the button applies styles similar to the hover state
- The active state is managed entirely by the parent component via \`isActive\` and \`onClick\`
- You must implement the toggle logic (\`setIsActive(!isActive)\`) in your \`onClick\` handler
- This gives you full control over when and how the button state changes

## Basic Usage

\`\`\`tsx
import { ButtonStatus, MediaStatus } from '@story-gs-react';

<ButtonStatus
  status={MediaStatus.SUBMITTED_FOR_APPROVAL}
  icon="Check"
/>
\`\`\`

## Sizes

The ButtonStatus component supports three sizes:

\`\`\`tsx
<ButtonStatus status={MediaStatus.VALIDATED} icon="Check" size="small" />
<ButtonStatus status={MediaStatus.VALIDATED} icon="Check" size="medium" />
<ButtonStatus status={MediaStatus.VALIDATED} icon="Check" size="large" />
\`\`\`

## Status Colors

Each media status has a specific color associated with it:

- **Validated**: Green
- **Rejected**: Red
- **Pending**: Yellow/Orange
- **Ignored**: Grey
- And more...

The button automatically applies the correct color based on the \`status\` prop.`,
      },
    },
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
      description: "Icon to display (Check for approve, X for reject)",
    },
    isActive: {
      control: "boolean",
      description: "Active state. When true, applies active styles (hover state). You must implement the toggle logic yourself in onClick.",
    },
    disabled: {
      control: "boolean",
      description: "Disable the button",
    },
    size: {
      options: ["small", "medium", "large"],
      control: { type: "select" },
      description: "Button size (small, medium, large)",
    },
    onClick: {
      action: "clicked",
      description: "Function called on click. You must implement the toggle logic (setIsActive(!isActive)) if you want toggle behavior.",
    },
    onFocus: {
      action: "focused",
      description: "Function called when the button receives focus",
    },
    onBlur: {
      action: "blurred",
      description: "Function called when the button loses focus",
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
