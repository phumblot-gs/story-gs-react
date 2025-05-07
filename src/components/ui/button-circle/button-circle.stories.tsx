import type { Meta, StoryObj } from "@storybook/react";
import { ButtonCircle } from "./index";
import { AllowedPictogram } from "./types";

const meta: Meta<typeof ButtonCircle> = {
  title: "UI/ButtonCircle",
  component: ButtonCircle,
  parameters: {
    layout: "centered",
    controls: {
      sort: 'alpha'
    }
  },
  tags: ["autodocs"],
  argTypes: {
    background: {
      options: ["white", "black", "grey"],
      control: { type: "radio" },
    },
    children: {
      description: "Content to display (optional if icon is provided)"
    },
    disabled: {
      control: "boolean",
    },
    featured: {
      control: "boolean",
    },
    icon: {
      options: [
        "Alert", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp",
        "Bell", "Check", "Comment", "Eye", "Filter",
        "Help", "Logout", "Pencil", "Plus", "Settings", 
        "Sort", "Star", "Status", "Tag", "Urgent",
        "User", "Vedette", "X"
      ],
      control: { type: "select" },
      description: "Icon to display (optional if children is provided)"
    },
    indicator: {
      control: "boolean",
    },
    size: {
      options: ["small", "large"],
      control: { type: "radio" },
    },
    debug: {
      control: "boolean",
      description: "Enable debug mode to log events to console",
    },
    onClick: {
      action: "clicked",
    },
    onFocus: {
      action: "focused",
    },
    onBlur: {
      action: "blurred",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonCircle>;

export const Default: Story = {
  args: {
    children: "BC",
    size: "large",
  },
};

export const WithIcon: Story = {
  args: {
    icon: "Plus" as AllowedPictogram,
    size: "large",
  },
};

export const WithIndicator: Story = {
  args: {
    icon: "Bell" as AllowedPictogram,
    indicator: true,
  },
};

export const WithChildren: Story = {
  args: {
    children: "B",
    size: "large",
  },
};

export const BlackBackground: Story = {
  args: {
    background: "black",
    icon: "Check" as AllowedPictogram,
  },
};

export const FeaturedButton: Story = {
  args: {
    featured: true,
    icon: "Star" as AllowedPictogram,
  },
};

export const SmallSize: Story = {
  args: {
    icon: "ArrowRight" as AllowedPictogram,
    size: "small",
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
    icon: "Settings" as AllowedPictogram,
  },
};

export const IconGrid: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-4">
      {[
        "Alert", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp",
        "Bell", "Check", "Comment", "Eye", "Filter", 
        "Help", "Logout", "Pencil", "Plus", "Settings", 
        "Sort", "Star", "Status", "Tag", "User"
      ].map((icon) => (
        <div key={icon} className="flex flex-col items-center gap-2">
          <ButtonCircle icon={icon as AllowedPictogram} />
          <span className="text-xs">{icon}</span>
        </div>
      ))}
    </div>
  ),
};
