
import type { Meta, StoryObj } from "@storybook/react";
import { ButtonTextSmall } from "./button-text-small";

const meta: Meta<typeof ButtonTextSmall> = {
  title: "UI/ButtonTextSmall",
  component: ButtonTextSmall,
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
    indicator: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    featured: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonTextSmall>;

export const Default: Story = {
  args: {
    children: "Button Text Small",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Black: Story = {
  args: {
    children: "Black",
    variant: "black",
  },
};

export const Blue: Story = {
  args: {
    children: "Blue",
    variant: "blue",
  },
};

export const WithIndicator: Story = {
  args: {
    children: "With Indicator",
    indicator: true,
  },
};

export const Featured: Story = {
  args: {
    children: "Featured",
    featured: true,
  },
};

export const BlackBackground: Story = {
  args: {
    children: "Black Background",
    background: "black",
  },
};

export const GrayBackground: Story = {
  args: {
    children: "Gray Background",
    background: "grey",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const ButtonVariations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <ButtonTextSmall variant="primary">Primary</ButtonTextSmall>
      <ButtonTextSmall variant="secondary">Secondary</ButtonTextSmall>
      <ButtonTextSmall variant="black">Black</ButtonTextSmall>
      <ButtonTextSmall variant="blue">Blue</ButtonTextSmall>
      <ButtonTextSmall variant="grey">Grey</ButtonTextSmall>
      <ButtonTextSmall disabled>Disabled</ButtonTextSmall>
    </div>
  ),
};
