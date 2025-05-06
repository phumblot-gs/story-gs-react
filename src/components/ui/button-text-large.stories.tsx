
import type { Meta, StoryObj } from "@storybook/react";
import { ButtonTextLarge } from "./button-text-large";

const meta: Meta<typeof ButtonTextLarge> = {
  title: "UI/ButtonTextLarge",
  component: ButtonTextLarge,
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
type Story = StoryObj<typeof ButtonTextLarge>;

export const Default: Story = {
  args: {
    children: "Button Text Large",
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
      <ButtonTextLarge variant="primary">Primary</ButtonTextLarge>
      <ButtonTextLarge variant="secondary">Secondary</ButtonTextLarge>
      <ButtonTextLarge variant="black">Black</ButtonTextLarge>
      <ButtonTextLarge variant="blue">Blue</ButtonTextLarge>
      <ButtonTextLarge variant="grey">Grey</ButtonTextLarge>
      <ButtonTextLarge disabled>Disabled</ButtonTextLarge>
    </div>
  ),
};
