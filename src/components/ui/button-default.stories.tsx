
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button-default";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
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
    size: {
      options: ["small", "large"],
      control: { type: "radio" },
      description: "Size of the button (small or large)",
      defaultValue: "large",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "large",
  },
};

export const Small: Story = {
  args: {
    children: "Small Button",
    variant: "primary",
    size: "small",
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
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="black">Black</Button>
      <Button variant="blue">Blue</Button>
      <Button variant="grey">Grey</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};

export const ButtonSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="small">Small Button</Button>
      <Button size="large">Large Button</Button>
    </div>
  ),
};
