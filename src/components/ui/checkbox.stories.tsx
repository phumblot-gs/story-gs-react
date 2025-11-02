import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { action } from "@storybook/addon-actions";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { Layout, VStack } from "@/components/layout";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Checkbox component built with the Figma design system. The Checkbox automatically inherits color context via \`data-bg\` from the parent Layout.

## Features
- Automatic context-aware styling based on parent background
- Accessible with proper ARIA attributes
- Support for controlled and uncontrolled states
- Disabled state support
- Works seamlessly with Label component

## Basic Usage

\`\`\`tsx
import { Checkbox, Label, Layout } from '@story-gs-react';

<Layout bg="white">
  <div className="flex items-center space-x-2">
    <Checkbox id="terms" />
    <Label htmlFor="terms">Accept terms and conditions</Label>
  </div>
</Layout>
\`\`\`

## Controlled State

\`\`\`tsx
const [checked, setChecked] = React.useState(false);

<Checkbox 
  id="controlled" 
  checked={checked} 
  onCheckedChange={setChecked} 
/>
\`\`\`

## Controlled vs Uncontrolled

The Checkbox component supports both controlled and uncontrolled states:

### Controlled Component (using \`checked\`)

Use \`checked\` when you need full control over the checkbox state from the parent component:

- The parent component manages the state using \`useState\`
- Requires \`onCheckedChange\` handler to update the state
- Useful when you need to read or modify the checkbox state from the parent
- Required for form validation or conditional logic based on the checkbox state

\`\`\`tsx
const [accepted, setAccepted] = React.useState(false);

<Checkbox 
  checked={accepted} 
  onCheckedChange={setAccepted} 
/>
// Parent can read/modify the state at any time
\`\`\`

### Uncontrolled Component (using \`defaultChecked\`)

Use \`defaultChecked\` when you only need to set an initial value:

- Sets the initial state only (at first render)
- React manages the state internally after the first render
- No need for state in the parent component
- Useful for simple default values that don't need to be read from the parent

\`\`\`tsx
<Checkbox defaultChecked={true} />
// Already checked on load, state managed internally
\`\`\`

**When to use each:**
- Use \`defaultChecked\` for simple default values
- Use \`checked\` when you need parent control or validation

## Context-Aware Styling

The Checkbox automatically adapts its appearance based on the parent Layout background:
- **White background**: Grey lighter background, black when checked
- **Grey background**: White background, black when checked
- **Black background**: Black secondary background, white when checked

This is handled automatically via the \`data-bg\` attribute system.

## Indeterminate State

The Checkbox supports an indeterminate state, useful for parent checkboxes in hierarchical lists where some children are checked and others are not:

\`\`\`tsx
const [checked, setChecked] = React.useState<boolean | "indeterminate">("indeterminate");

<Checkbox 
  checked={checked} 
  onCheckedChange={setChecked} 
/>
\`\`\`

The indeterminate state displays a minus icon instead of a checkmark and uses the same styling as the checked state.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "select",
      options: [false, true, "indeterminate"],
      description: "Controlled checked state (can be true, false, or 'indeterminate')",
    },
    defaultChecked: {
      control: "boolean",
      description: "Default checked state (uncontrolled)",
    },
    disabled: {
      control: "boolean",
      description: "Disabled checkbox",
    },
    onCheckedChange: {
      action: "checkedChange",
      description: "Function called when checked state changes",
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes",
    },
    debug: {
      control: "boolean",
      description: "Enable debug mode to see component state and events in console",
    },
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <Story />
      </Layout>
    ),
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(true);
    const handleCheckedChange = (newChecked: boolean | "indeterminate") => {
      setChecked(newChecked);
      args.onCheckedChange?.(newChecked);
    };
    return (
      <Checkbox 
        {...args}
        checked={checked} 
        onCheckedChange={handleCheckedChange}
      />
    );
  },
};

export const Indeterminate: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState<boolean | "indeterminate">("indeterminate");
    const handleCheckedChange = (newChecked: boolean | "indeterminate") => {
      setChecked(newChecked);
      args.onCheckedChange?.(newChecked);
    };
    return (
      <Checkbox 
        {...args}
        checked={checked} 
        onCheckedChange={handleCheckedChange}
      />
    );
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithBackgrounds: Story = {
  render: () => {
    const [whiteUnchecked, setWhiteUnchecked] = React.useState(false);
    const [whiteChecked, setWhiteChecked] = React.useState(true);
    const [whiteIndeterminate, setWhiteIndeterminate] = React.useState<boolean | "indeterminate">("indeterminate");
    
    const [greyUnchecked, setGreyUnchecked] = React.useState(false);
    const [greyChecked, setGreyChecked] = React.useState(true);
    const [greyIndeterminate, setGreyIndeterminate] = React.useState<boolean | "indeterminate">("indeterminate");
    
    const [blackUnchecked, setBlackUnchecked] = React.useState(false);
    const [blackChecked, setBlackChecked] = React.useState(true);
    const [blackIndeterminate, setBlackIndeterminate] = React.useState<boolean | "indeterminate">("indeterminate");
    
    return (
      <VStack gap={6}>
        <div>
          <h3 className="text-sm font-medium mb-3">Checkbox on different backgrounds</h3>
          <p className="text-xs text-grey-stronger mb-4">
            The checkbox automatically adapts its appearance based on the parent background using the <code>data-bg</code> mechanism.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-medium mb-2">White Background</h4>
            <Layout bg="white" padding={4} className="rounded">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="checkbox-white-unchecked" 
                  checked={whiteUnchecked}
                  onCheckedChange={setWhiteUnchecked}
                />
                <Label htmlFor="checkbox-white-unchecked">Unchecked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="checkbox-white-checked" 
                  checked={whiteChecked}
                  onCheckedChange={setWhiteChecked}
                />
                <Label htmlFor="checkbox-white-checked">Checked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="checkbox-white-indeterminate" 
                  checked={whiteIndeterminate}
                  onCheckedChange={setWhiteIndeterminate}
                />
                <Label htmlFor="checkbox-white-indeterminate">Indeterminate</Label>
              </div>
            </Layout>
          </div>

          <div>
            <h4 className="text-xs font-medium mb-2">Grey Background</h4>
            <Layout bg="grey" padding={4} className="rounded">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="checkbox-grey-unchecked" 
                  checked={greyUnchecked}
                  onCheckedChange={setGreyUnchecked}
                />
                <Label htmlFor="checkbox-grey-unchecked">Unchecked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="checkbox-grey-checked" 
                  checked={greyChecked}
                  onCheckedChange={setGreyChecked}
                />
                <Label htmlFor="checkbox-grey-checked">Checked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="checkbox-grey-indeterminate" 
                  checked={greyIndeterminate}
                  onCheckedChange={setGreyIndeterminate}
                />
                <Label htmlFor="checkbox-grey-indeterminate">Indeterminate</Label>
              </div>
            </Layout>
          </div>

          <div>
            <h4 className="text-xs font-medium mb-2">Black Background</h4>
            <Layout bg="black" padding={4} className="rounded">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="checkbox-black-unchecked" 
                  checked={blackUnchecked}
                  onCheckedChange={setBlackUnchecked}
                />
                <Label htmlFor="checkbox-black-unchecked">Unchecked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="checkbox-black-checked" 
                  checked={blackChecked}
                  onCheckedChange={setBlackChecked}
                />
                <Label htmlFor="checkbox-black-checked">Checked</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="checkbox-black-indeterminate" 
                  checked={blackIndeterminate}
                  onCheckedChange={setBlackIndeterminate}
                />
                <Label htmlFor="checkbox-black-indeterminate">Indeterminate</Label>
              </div>
            </Layout>
          </div>
        </div>
      </VStack>
    );
  },
};

export const DebugMode: Story = {
  render: () => {
    const [debug, setDebug] = React.useState(true);
    const [checked, setChecked] = React.useState(false);

    return (
      <VStack gap={6}>
        <div>
          <h3 className="text-sm font-medium mb-3">Debug Mode</h3>
          <p className="text-xs text-grey-stronger mb-4">
            Enable debug mode to see component state and events in the browser console. Check the console to see logs when interacting with the checkbox.
          </p>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="debug-toggle"
              checked={debug}
              onCheckedChange={setDebug}
            />
            <Label htmlFor="debug-toggle">Enable debug mode</Label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-medium mb-2">Controlled Checkbox</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="debug-controlled"
                checked={checked}
                onCheckedChange={setChecked}
                debug={debug}
              />
              <Label htmlFor="debug-controlled">
                Controlled (checked: {checked ? 'true' : 'false'})
              </Label>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium mb-2">Uncontrolled Checkbox</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="debug-uncontrolled"
                defaultChecked={false}
                debug={debug}
              />
              <Label htmlFor="debug-uncontrolled">Uncontrolled</Label>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium mb-2">Uncontrolled Checkbox (default checked)</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="debug-uncontrolled-checked"
                defaultChecked={true}
                debug={debug}
              />
              <Label htmlFor="debug-uncontrolled-checked">Uncontrolled (default checked)</Label>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-primary rounded">
          <p className="text-xs font-medium mb-2 text-black">💡 Tips:</p>
          <ul className="text-xs space-y-1 list-disc list-inside text-black">
            <li>Open the browser console (F12) to see debug logs</li>
            <li>Interact with the checkboxes to see <code>CheckedChange</code>, <code>Focus</code>, and <code>Blur</code> events</li>
            <li>The pink ring and label show debug mode is active</li>
            <li>The label displays: <code>controlled/uncontrolled</code> and <code>checked/unchecked</code></li>
          </ul>
        </div>
      </VStack>
    );
  },
};
