import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./slider";
import { Layout } from "@/components/layout";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Slider Component

A slider component built on Radix UI primitives that adapts its appearance based on the parent \`data-bg\` context.

### Features

- **Context-aware styling**: Automatically adapts colors based on parent \`data-bg\` context (white, grey, black)
- **Custom labels**: Optional \`labelMin\` and \`labelMax\` props to display labels above the slider
- **Debug mode**: Visual indicators and console logs for development
- **Standard Radix props**: Supports all standard Radix UI Slider props (\`min\`, \`max\`, \`step\`, \`value\`, \`defaultValue\`, \`onValueChange\`, etc.)

### Basic Usage

\`\`\`tsx
import { Slider, Layout } from '@gs/gs-components-library';

<Layout bg="white">
  <Slider 
    defaultValue={[50]} 
    max={100} 
    labelMin="1" 
    labelMax="7" 
  />
</Layout>
\`\`\`

### Background Context Adaptation

The slider automatically adapts its colors based on the parent \`data-bg\` context:

- **White background**: Grey rail, black track/thumb
- **Grey background**: White rail, black track/thumb
- **Black background**: Black-secondary rail, white track/thumb

Disabled state uses grey-stronger color for all backgrounds.
        `
      }
    }
  },
  argTypes: {
    labelMin: {
      control: "text",
      description: "Label displayed on the left side above the slider",
    },
    labelMax: {
      control: "text",
      description: "Label displayed on the right side above the slider",
    },
    debug: {
      control: "boolean",
      description: "Enable debug mode with visual indicators and console logs",
    },
    defaultValue: {
      control: "object",
      description: "Default value(s) for uncontrolled slider",
    },
    value: {
      control: "object",
      description: "Value(s) for controlled slider",
    },
    min: {
      control: "number",
      description: "Minimum value",
    },
    max: {
      control: "number",
      description: "Maximum value",
    },
    step: {
      control: "number",
      description: "Step increment",
    },
    disabled: {
      control: "boolean",
      description: "Disable the slider",
    },
    onValueChange: {
      action: "valueChanged",
      description: "Callback fired when value changes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    labelMin: "1",
    labelMax: "7",
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-md">
          <Story />
        </div>
      </Layout>
    ),
  ],
};

export const WithLabels: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    labelMin: "Min",
    labelMax: "Max",
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-md">
          <Story />
        </div>
      </Layout>
    ),
  ],
};

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
    labelMin: "0",
    labelMax: "100",
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-md">
          <Story />
        </div>
      </Layout>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
    labelMin: "1",
    labelMax: "7",
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-md">
          <Story />
        </div>
      </Layout>
    ),
  ],
};

export const AllBackgrounds: Story = {
  render: (args) => (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">White Background</h3>
        <Layout bg="white" padding={6}>
          <div className="w-full max-w-md">
            <Slider {...args} />
          </div>
        </Layout>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Grey Background</h3>
        <Layout bg="grey" padding={6}>
          <div className="w-full max-w-md">
            <Slider {...args} />
          </div>
        </Layout>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Black Background</h3>
        <Layout bg="black" padding={6}>
          <div className="w-full max-w-md">
            <Slider {...args} />
          </div>
        </Layout>
      </div>
    </div>
  ),
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    labelMin: "1",
    labelMax: "7",
  },
};

export const DebugMode: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    labelMin: "1",
    labelMax: "7",
    debug: true,
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-md">
          <Story />
        </div>
      </Layout>
    ),
  ],
};

export const CustomRange: Story = {
  args: {
    defaultValue: [5],
    min: 1,
    max: 10,
    step: 1,
    labelMin: "1",
    labelMax: "10",
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-md">
          <Story />
        </div>
      </Layout>
    ),
  ],
};

export const WithoutLabels: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-md">
          <Story />
        </div>
      </Layout>
    ),
  ],
};
