import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";
import { Layout, VStack } from "@/components/layout";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `RadioGroup component built with the Figma design system. The RadioGroupItem automatically inherits color context via \`data-bg\` from the parent Layout.

## Features
- Automatic context-aware styling based on parent background
- Accessible with proper ARIA attributes
- Support for controlled and uncontrolled states
- Disabled state support
- Works seamlessly with Label component
- Multiple options with single selection

## Basic Usage

\`\`\`tsx
import { RadioGroup, RadioGroupItem, Label, Layout } from '@story-gs-react';

<Layout bg="white">
  <RadioGroup defaultValue="option1">
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option1" id="option1" />
      <Label htmlFor="option1">Option 1</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option2" id="option2" />
      <Label htmlFor="option2">Option 2</Label>
    </div>
  </RadioGroup>
</Layout>
\`\`\`

## Controlled State

\`\`\`tsx
const [value, setValue] = React.useState("option1");

<RadioGroup value={value} onValueChange={setValue}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
</RadioGroup>
\`\`\`

## Controlled vs Uncontrolled

The RadioGroup component supports both controlled and uncontrolled states:

### Controlled Component (using \`value\`)

Use \`value\` when you need full control over the selected value from the parent component:

- The parent component manages the state using \`useState\`
- Requires \`onValueChange\` handler to update the state
- Useful when you need to read or modify the selected value from the parent
- Required for form validation or conditional logic based on the selection

\`\`\`tsx
const [selected, setSelected] = React.useState("option1");

<RadioGroup value={selected} onValueChange={setSelected}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
</RadioGroup>
// Parent can read/modify the selection at any time
\`\`\`

### Uncontrolled Component (using \`defaultValue\`)

Use \`defaultValue\` when you only need to set an initial selection:

- Sets the initial selection only (at first render)
- React manages the state internally after the first render
- No need for state in the parent component
- Useful for simple default selections that don't need to be read from the parent

\`\`\`tsx
<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
</RadioGroup>
// Option 1 selected on load, state managed internally
\`\`\`

**When to use each:**
- Use \`defaultValue\` for simple default selections
- Use \`value\` when you need parent control or validation

## Context-Aware Styling

The RadioGroupItem automatically adapts its appearance based on the parent Layout background:
- **White background**: Grey lighter background, black when checked
- **Grey background**: White background, black when checked
- **Black background**: Black secondary background, white when checked

This is handled automatically via the \`data-bg\` attribute system.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Controlled selected value",
    },
    defaultValue: {
      control: "text",
      description: "Default selected value (uncontrolled)",
    },
    onValueChange: {
      action: "valueChange",
      description: "Function called when selection changes",
    },
    disabled: {
      control: "boolean",
      description: "Disabled radio group item",
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes",
    },
    debug: {
      control: "boolean",
      description: "Enable debug mode on RadioGroup to see value changes in console. Also works on RadioGroupItem for focus/blur events.",
    },
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <Story />
      </Layout>
    ),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "option1",
  },
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="option1" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="option2" />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="option3" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="option1-disabled" />
        <Label htmlFor="option1-disabled">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="option2-disabled" disabled />
        <Label htmlFor="option2-disabled">Option 2 (disabled)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="option3-disabled" />
        <Label htmlFor="option3-disabled">Option 3</Label>
      </div>
    </RadioGroup>
  ),
};

export const WithBackgrounds: Story = {
  render: () => (
    <VStack gap={6}>
      <div>
        <h3 className="text-sm font-medium mb-3">RadioGroup on different backgrounds</h3>
        <p className="text-xs text-grey-stronger mb-4">
          The radio buttons automatically adapt their appearance based on the parent background using the <code>data-bg</code> mechanism.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-medium mb-2">White Background</h4>
          <Layout bg="white" padding={4} className="rounded">
            <RadioGroup defaultValue="white-option1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="white-option1" id="radio-white-option1" />
                <Label htmlFor="radio-white-option1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="white-option2" id="radio-white-option2" />
                <Label htmlFor="radio-white-option2">Option 2</Label>
              </div>
            </RadioGroup>
          </Layout>
        </div>

        <div>
          <h4 className="text-xs font-medium mb-2">Grey Background</h4>
          <Layout bg="grey" padding={4} className="rounded">
            <RadioGroup defaultValue="grey-option1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grey-option1" id="radio-grey-option1" />
                <Label htmlFor="radio-grey-option1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grey-option2" id="radio-grey-option2" />
                <Label htmlFor="radio-grey-option2">Option 2</Label>
              </div>
            </RadioGroup>
          </Layout>
        </div>

        <div>
          <h4 className="text-xs font-medium mb-2">Black Background</h4>
          <Layout bg="black" padding={4} className="rounded">
            <RadioGroup defaultValue="black-option1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="black-option1" id="radio-black-option1" />
                <Label htmlFor="radio-black-option1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="black-option2" id="radio-black-option2" />
                <Label htmlFor="radio-black-option2">Option 2</Label>
              </div>
            </RadioGroup>
          </Layout>
        </div>
      </div>
    </VStack>
  ),
};

export const DebugMode: Story = {
  render: () => {
    const [debug, setDebug] = React.useState(true);
    const [value, setValue] = React.useState("option1");

    return (
      <VStack gap={6}>
        <div>
          <h3 className="text-sm font-medium mb-3">Debug Mode</h3>
          <p className="text-xs text-grey-stronger mb-4">
            Enable debug mode to see component state and events in the browser console. Check the console to see logs when interacting with the radio buttons.
          </p>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="debug-toggle"
              checked={debug}
              onChange={(e) => setDebug(e.target.checked)}
              className="h-3 w-3"
            />
            <Label htmlFor="debug-toggle">Enable debug mode</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-medium mb-2">Controlled RadioGroup</h4>
            <RadioGroup value={value} onValueChange={setValue} debug={debug}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="debug-radio-1" debug={debug} />
                <Label htmlFor="debug-radio-1">Option 1 (selected: {value === "option1" ? "yes" : "no"})</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="debug-radio-2" debug={debug} />
                <Label htmlFor="debug-radio-2">Option 2 (selected: {value === "option2" ? "yes" : "no"})</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option3" id="debug-radio-3" debug={debug} />
                <Label htmlFor="debug-radio-3">Option 3 (selected: {value === "option3" ? "yes" : "no"})</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h4 className="text-xs font-medium mb-2">Uncontrolled RadioGroup</h4>
            <RadioGroup defaultValue="uncontrolled-option1" debug={debug}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="uncontrolled-option1" id="debug-uncontrolled-1" debug={debug} />
                <Label htmlFor="debug-uncontrolled-1">Uncontrolled Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="uncontrolled-option2" id="debug-uncontrolled-2" debug={debug} />
                <Label htmlFor="debug-uncontrolled-2">Uncontrolled Option 2</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="p-4 bg-blue-primary rounded">
          <p className="text-xs font-medium mb-2 text-black">💡 Tips:</p>
          <ul className="text-xs space-y-1 list-disc list-inside text-black">
            <li>Open the browser console (F12) to see debug logs</li>
            <li>Use <code>debug</code> on <code>RadioGroup</code> to see <code>ValueChange</code> events</li>
            <li>Use <code>debug</code> on <code>RadioGroupItem</code> to see <code>Focus</code> and <code>Blur</code> events</li>
            <li>The pink ring and label show debug mode is active</li>
            <li>The label displays the <code>value</code> of each radio button item</li>
          </ul>
        </div>
      </VStack>
    );
  },
};

