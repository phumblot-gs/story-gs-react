
import type { Meta, StoryObj } from "@storybook/react";
import { ButtonSmall } from "./button-small";

const meta: Meta<typeof ButtonSmall> = {
  title: "UI/ButtonSmall",
  component: ButtonSmall,
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
type Story = StoryObj<typeof ButtonSmall>;

export const Default: Story = {
  args: {
    children: "Button Small",
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
      <ButtonSmall variant="primary">Primary</ButtonSmall>
      <ButtonSmall variant="secondary">Secondary</ButtonSmall>
      <ButtonSmall variant="black">Black</ButtonSmall>
      <ButtonSmall variant="blue">Blue</ButtonSmall>
      <ButtonSmall variant="grey">Grey</ButtonSmall>
      <ButtonSmall disabled>Disabled</ButtonSmall>
    </div>
  ),
};
