
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button-default";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      argTypes: {
        sort: 'alpha'
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
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
type Story = StoryObj<typeof Button>;

// Standard button stories
export const Default: Story = {
  args: {
    children: "Button",
    background: "white",
    size: "large",
  },
};

export const Small: Story = {
  args: {
    children: "Small Button",
    background: "white",
    size: "small",
  },
};

export const Black: Story = {
  args: {
    children: "Black",
    background: "black",
  },
};

export const Grey: Story = {
  args: {
    children: "Grey",
    background: "grey",
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
      <Button background="white">White</Button>
      <Button background="black">Black</Button>
      <Button background="grey">Grey</Button>
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

// Stories for small buttons
export const SmallButtonVariations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button size="small" background="white">White</Button>
      <Button size="small" background="black">Black</Button>
      <Button size="small" background="grey">Grey</Button>
      <Button size="small" disabled>Disabled</Button>
    </div>
  ),
};

export const SmallWithIndicator: Story = {
  args: {
    children: "Small With Indicator",
    size: "small",
    indicator: true,
  },
};

export const SmallFeatured: Story = {
  args: {
    children: "Small Featured",
    size: "small",
    featured: true,
  },
};

export const SmallBlackBackground: Story = {
  args: {
    children: "Small Black Background",
    size: "small",
    background: "black",
  },
};

export const SmallGrayBackground: Story = {
  args: {
    children: "Small Gray Background",
    size: "small",
    background: "grey",
  },
};
