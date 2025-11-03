import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch";
import { useState } from "react";
import { Layout, VStack } from "@/components/layout";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Switch component built with the Figma design system. The Switch automatically inherits color context via \`data-bg\` from the parent Layout.

## Features
- Toggle switch component with sliding pill indicator
- Customizable text labels (onText, offText)
- Automatic context-aware styling based on parent background
- Event handlers (onClick, onFocus, onBlur)
- Debug mode for development
- Disabled state support

## Basic Usage

\`\`\`tsx
import { Switch, Layout } from '@story-gs-react';

<Layout bg="white">
  <Switch 
    value={isEnabled}
    onValueChange={setIsEnabled}
  />
</Layout>
\`\`\`

## Controlled State

The Switch component can be used in controlled or uncontrolled mode.

**Controlled (recommended):**

Use \`value\` and \`onValueChange\` props to control the switch state from your component:

\`\`\`tsx
import { useState } from 'react';
import { Switch } from '@story-gs-react';

function MyComponent() {
  const [enabled, setEnabled] = useState(false);
  
  return (
    <Switch 
      value={enabled}
      onValueChange={setEnabled}
    />
  );
}
\`\`\`

**Uncontrolled:**

Use \`defaultValue\` for simple forms where state is only needed internally:

\`\`\`tsx
<Switch defaultValue={false} />
\`\`\`

**When to use each:**
- **Controlled**: When you need to read or update the state from outside the component, or when the state is shared with other components
- **Uncontrolled**: When the switch state is only needed internally, or for simple forms

## Context-Aware Styling

The Switch automatically adapts its appearance based on the parent Layout background using the \`data-bg\` mechanism. No props needed!

\`\`\`tsx
<Layout bg="white">
  <Switch value={true} />
</Layout>

<Layout bg="black">
  <Switch value={true} />
</Layout>

<Layout bg="grey">
  <Switch value={true} />
</Layout>
\`\`\``,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "boolean",
      description: "The current toggle state (true = ON, false = OFF)",
    },
    onValueChange: {
      action: "value changed",
      description: "Callback when the toggle state changes",
    },
    onText: {
      control: "text",
      description: "Text to display when toggle is ON",
    },
    offText: {
      control: "text",
      description: "Text to display when toggle is OFF",
    },
    disabled: {
      control: "boolean",
      description: "Whether the toggle is disabled",
    },
    debug: {
      control: "boolean",
      description: "Enable debug mode to see component state and events in console",
    },
    onClick: {
      action: "clicked",
      description: "Function called on click (inherits from ButtonHTMLAttributes)",
    },
    onFocus: {
      action: "focused",
      description: "Function called when the switch receives focus (inherits from ButtonHTMLAttributes)",
    },
    onBlur: {
      action: "blurred",
      description: "Function called when the switch loses focus (inherits from ButtonHTMLAttributes)",
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes",
    },
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <Story />
      </Layout>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: false,
    onText: "On",
    offText: "Off",
    disabled: false,
    debug: false,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Switch
        {...args}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

export const AllVariants: Story = {
  render: () => {
    const [values, setValues] = useState({
      whiteOn: true,
      whiteOff: false,
      blackOn: true,
      blackOff: false,
      greyOn: true,
      greyOff: false,
    });
    
    return (
      <VStack gap={6} padding={6}>
        <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3">Background White</h3>
          <div className="flex gap-4 items-center">
            <Switch
              value={values.whiteOn}
              onValueChange={(v) => setValues({...values, whiteOn: v})}
            />
            <Switch
              value={values.whiteOff}
              onValueChange={(v) => setValues({...values, whiteOff: v})}
            />
            <Switch
              value={true}
              disabled
            />
            <Switch
              value={false}
              disabled
            />
          </div>
        </VStack>

        <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3">Background Grey</h3>
          <div className="flex gap-4 items-center">
            <Switch
              value={values.greyOn}
              onValueChange={(v) => setValues({...values, greyOn: v})}
            />
            <Switch
              value={values.greyOff}
              onValueChange={(v) => setValues({...values, greyOff: v})}
            />
            <Switch
              value={true}
              disabled
            />
            <Switch
              value={false}
              disabled
            />
          </div>
        </VStack>

        <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3 text-white">Background Black</h3>
          <div className="flex gap-4 items-center">
            <Switch
              value={values.blackOn}
              onValueChange={(v) => setValues({...values, blackOn: v})}
            />
            <Switch
              value={values.blackOff}
              onValueChange={(v) => setValues({...values, blackOff: v})}
            />
            <Switch
              value={true}
              disabled
            />
            <Switch
              value={false}
              disabled
            />
          </div>
        </VStack>
      </VStack>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const ControlledState: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoSave, setAutoSave] = useState(true);
    
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={6}>
          <div>
            <h3 className="gs-typo-h3 mb-2">Controlled State</h3>
            <p className="text-sm text-grey-stronger mb-4">
              The Switch state is managed by React state. Use the <code>value</code> prop to control the state and <code>onValueChange</code> to update it.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between w-64">
              <span className="text-sm">Notifications</span>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                onText="On"
                offText="Off"
              />
            </div>
            <div className="flex items-center justify-between w-64">
              <span className="text-sm">Dark Mode</span>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                onText="Dark"
                offText="Light"
              />
            </div>
            <div className="flex items-center justify-between w-64">
              <span className="text-sm">Auto-save</span>
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                onText="Yes"
                offText="No"
              />
            </div>
          </div>
        </VStack>
      </Layout>
    );
  },
};

export const CustomLabels: Story = {
  render: () => {
    const [value1, setValue1] = useState(true);
    const [value2, setValue2] = useState(false);
    const [value3, setValue3] = useState(true);
    
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={6}>
          <div>
            <h3 className="gs-typo-h3 mb-2">Custom Labels</h3>
            <p className="text-sm text-grey-stronger mb-4">
              Customize the text displayed when the switch is ON or OFF using <code>onText</code> and <code>offText</code> props.
            </p>
          </div>
          
          <div className="flex gap-4 items-center">
            <Switch
              value={value1}
              onValueChange={setValue1}
              onText="Active"
              offText="Inactive"
            />
            <Switch
              value={value2}
              onValueChange={setValue2}
              onText="Enabled"
              offText="Disabled"
            />
            <Switch
              value={value3}
              onValueChange={setValue3}
              onText="Published"
              offText="Draft"
            />
          </div>
        </VStack>
      </Layout>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={6}>
          <div>
            <h3 className="gs-typo-h3 mb-2">Disabled States</h3>
            <p className="text-sm text-grey-stronger mb-4">
              Disabled switches cannot be interacted with and show a muted appearance.
            </p>
          </div>
          
          <div className="flex gap-4 items-center">
            <Switch
              value={false}
              disabled
            />
            <Switch
              value={true}
              disabled
            />
          </div>
        </VStack>
      </Layout>
    );
  },
};

export const ContextAwareStyling: Story = {
  render: () => {
    const [value1, setValue1] = useState(false);
    const [value2, setValue2] = useState(false);
    const [value3, setValue3] = useState(false);
    
    return (
      <VStack gap={6} padding={6}>
        <div>
          <h3 className="gs-typo-h3 mb-2">Context-Aware Styling</h3>
          <p className="text-sm text-grey-stronger mb-4">
            The Switch automatically adapts its colors based on the parent Layout background. No props needed!
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
          <Layout bg="white" padding={4} className="rounded border border-grey">
            <Switch
              value={value1}
              onValueChange={setValue1}
            />
          </Layout>
          <Layout bg="black" padding={4} className="rounded border border-grey">
            <Switch
              value={value2}
              onValueChange={setValue2}
            />
          </Layout>
          <Layout bg="grey" padding={4} className="rounded border border-grey">
            <Switch
              value={value3}
              onValueChange={setValue3}
            />
          </Layout>
        </div>
      </VStack>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export const Examples: Story = {
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoSave, setAutoSave] = useState(true);
    
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={6}>
          <div>
            <h3 className="gs-typo-h3 mb-2">Real-World Examples</h3>
            <p className="text-sm text-grey-stronger mb-4">
              Common use cases for the Switch component.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between w-64">
              <span className="text-sm">Notifications</span>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                onText="On"
                offText="Off"
              />
            </div>
            <div className="flex items-center justify-between w-64">
              <span className="text-sm">Dark Mode</span>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                onText="Dark"
                offText="Light"
              />
            </div>
            <div className="flex items-center justify-between w-64">
              <span className="text-sm">Auto-save</span>
              <Switch
                value={autoSave}
                onValueChange={setAutoSave}
                onText="Yes"
                offText="No"
              />
            </div>
          </div>
        </VStack>
      </Layout>
    );
  },
};

export const DebugMode: Story = {
  render: () => {
    const [value, setValue] = useState(false);
    
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={6}>
          <div>
            <h3 className="gs-typo-h3 mb-3">Debug Mode</h3>
            <p className="text-sm text-grey-stronger mb-4">
              The <code>debug</code> prop displays a label above the switch and logs component state and events to the console.
            </p>
          </div>

          <VStack gap={4}>
            <Switch
              value={value}
              onValueChange={setValue}
              debug
            />
            <Switch
              value={true}
              debug
              onText="Active"
              offText="Inactive"
            />

            <div className="p-4 bg-grey-lighter rounded">
              <p className="text-xs font-medium mb-2">Debug mode features:</p>
              <ul className="text-xs space-y-1 list-disc list-inside text-grey-stronger">
                <li>Pink border (ring-2 ring-pink) around the switch</li>
                <li>Label above displaying current state and background context</li>
                <li>Console logs for Click, Focus, and Blur events</li>
                <li>All event handlers work normally (inherits from ButtonHTMLAttributes)</li>
              </ul>
            </div>
          </VStack>
        </VStack>
      </Layout>
    );
  },
};

export const NestedLayouts: Story = {
  render: () => (
    <VStack gap={4} padding={6}>
      <h2 className="gs-typo-h2">Nested Layouts - Each level overrides parent context</h2>

      {/* Level 1: White */}
      <Layout bg="white" padding={4} className="border-2 border-blue">
        <VStack gap={3}>
          <p className="text-sm font-medium">Layout bg="white" (level 1)</p>
          <Switch value={true} />

          {/* Level 2: Grey - overrides white */}
          <Layout bg="grey" padding={4} className="border-2 border-green">
            <VStack gap={3}>
              <p className="text-sm font-medium">Layout bg="grey" (level 2 - overrides white)</p>
              <Switch value={true} />

              {/* Level 3: Black - overrides grey */}
              <Layout bg="black" padding={4} className="border-2 border-yellow">
                <VStack gap={3}>
                  <p className="text-sm font-medium text-white">Layout bg="black" (level 3 - overrides grey)</p>
                  <Switch value={true} />
                </VStack>
              </Layout>

              <p className="text-sm text-grey-stronger">↑ Switch above uses BLACK styles (closest context)</p>
            </VStack>
          </Layout>

          <p className="text-sm text-grey-stronger">↑ Grey area uses GREY styles</p>
        </VStack>
      </Layout>

      <div className="p-4 bg-blue-primary rounded">
        <p className="text-sm font-medium">💡 Important rule:</p>
        <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
          <li>Each Layout with <code>bg</code> creates a new BgProvider React context</li>
          <li>Child context always <strong>overrides</strong> parent context</li>
          <li>CSS uses <code>[data-bg="..."]</code> from the closest ancestor</li>
          <li>No cascading inheritance - each level is isolated</li>
        </ul>
      </div>
    </VStack>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
