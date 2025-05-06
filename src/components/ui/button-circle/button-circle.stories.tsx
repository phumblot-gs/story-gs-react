
import type { Meta, StoryObj } from "@storybook/react";
import { ButtonCircle } from "./index";
import { AllowedPictogram } from "./types";

const meta: Meta<typeof ButtonCircle> = {
  title: "UI/ButtonCircle",
  component: ButtonCircle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["primary", "secondary", "black", "blue", "grey", "disabled"],
      control: { type: "select" },
    },
    background: {
      options: ["white", "black", "grey"],
      control: { type: "radio" },
    },
    size: {
      options: ["small", "large"],
      control: { type: "radio" },
    },
    icon: {
      options: [
        "Check", "X", "Plus", "Alert", "Status", "Urgent",
        "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown",
        "Bell", "Tag", "Star", "Vedette", "Comment",
        "Help", "Settings", "User", "Pencil", "Sort", "Filter", "Eye", "Logout"
      ],
      control: { type: "select" },
      description: "Icon to display (optional if letter or children are provided)"
    },
    letter: {
      control: "text",
      description: "Single letter to display (optional if icon or children are provided)"
    },
    indicator: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    featured: {
      control: "boolean",
    },
    children: {
      description: "Content to display (optional if icon or letter are provided)"
    }
  },
};

export default meta;
type Story = StoryObj<typeof ButtonCircle>;

export const Default: Story = {
  args: {
    size: "large",
    children: "BC"
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

export const WithLetter: Story = {
  args: {
    letter: "A",
    size: "large",
  },
};

export const NoIconNoLetter: Story = {
  args: {
    children: "Button",
    size: "large"
  },
};

export const BlackBackground: Story = {
  args: {
    icon: "Check" as AllowedPictogram,
    background: "black",
  },
};

export const FeaturedButton: Story = {
  args: {
    icon: "Star" as AllowedPictogram,
    featured: true,
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
    icon: "Settings" as AllowedPictogram,
    disabled: true,
  },
};

export const IconGrid: Story = {
  render: () => (
    <div className="grid grid-cols-5 gap-4">
      {[
        "Check", "X", "Plus", "Alert", "Status", 
        "ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Eye", 
        "Bell", "Tag", "Star", "Vedette", "Comment",
        "Help", "Settings", "User", "Pencil", "Sort"
      ].map((icon) => (
        <div key={icon} className="flex flex-col items-center gap-2">
          <ButtonCircle icon={icon as AllowedPictogram} />
          <span className="text-xs">{icon}</span>
        </div>
      ))}
    </div>
  ),
};
