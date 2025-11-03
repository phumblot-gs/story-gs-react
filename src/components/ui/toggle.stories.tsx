import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Toggle } from "./toggle";
import { Icon } from "./icons";
import { Layout, HStack, VStack } from "@/components/layout";
import { SidePanel } from "@/components/layout/SidePanel";

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Toggle component built on top of the Button component. The Toggle inherits all Button styles, variants, and behaviors, adding toggle-specific functionality including an \`isActive\` state mechanism similar to ButtonStatus.

## Features
- Built on Button component (inherits all Button features)
- Multiple visual variants (normal, secondary, ghost, outline, destructive, link)
- Three sizes (small, medium, large)
- Automatic context-aware styling based on parent background
- Icon support with Icon component
- Default Switch icon when no children provided
- Active state management via \`isActive\` prop (similar to ButtonStatus)
- Event handlers (onClick, onFocus, onBlur)
- Debug mode for development
- Shadcn UI compatibility

## Built on Button Component

The Toggle component is built on top of the Button component, meaning it inherits all Button features and styling:

\`\`\`tsx
import { Toggle, Layout } from '@story-gs-react';

// Toggle uses Button internally
<Toggle variant="secondary" size="medium">
  Toggle Button
</Toggle>
\`\`\`

**What Toggle adds to Button:**
- \`isActive\` prop for active state management (similar to ButtonStatus)
- Default Switch icon when no children provided
- Active styles applied when \`isActive\` is \`true\`

## Basic Usage

\`\`\`tsx
import { Toggle, Layout } from '@story-gs-react';

<Layout bg="white">
  <Toggle variant="secondary">
    Toggle Button
  </Toggle>
</Layout>
\`\`\`

## Active State with isActive

The \`isActive\` prop allows you to control the active state of the toggle, similar to ButtonStatus. When \`isActive\` is \`true\`, the toggle displays an active appearance (applies hover styles).

**Important:** The Toggle component does not automatically toggle the \`isActive\` state. You must implement the toggle logic yourself in the \`onClick\` handler.

\`\`\`tsx
// Controlled active state - YOU must handle the toggle logic
const [isActive, setIsActive] = useState(false);

<Toggle 
  isActive={isActive}
  onClick={() => setIsActive(!isActive)} // Toggle logic is YOUR responsibility
>
  {isActive ? "ON" : "OFF"}
</Toggle>
\`\`\`

**Behavior:**
- When \`isActive\` is \`true\`, the toggle applies styles similar to Button's hover state
- The toggle state is managed entirely by the parent component via \`isActive\` and \`onClick\`
- You must implement the toggle logic (\`setIsActive(!isActive)\`) in your \`onClick\` handler
- This approach is consistent with ButtonStatus component

## Default Switch Icon

When no \`children\` are provided, the Toggle automatically displays a Switch icon with appropriate size based on the button size:

\`\`\`tsx
// No children - displays Switch icon automatically
<Toggle variant="secondary" size="medium" />

// Icon size adapts to button size:
// - small → icon size={10}
// - medium → icon size={12}
// - large → icon size={14}
\`\`\`

## With Custom Icon

You can provide your own children, including icons:

\`\`\`tsx
import { Icon } from '@story-gs-react';

<Toggle variant="secondary" size="medium" className="p-0 w-6 h-6">
  <Icon name="Switch" size={12} />
</Toggle>
\`\`\`

**Recommended icon sizes:**
- **Toggle \`small\`** : Use \`size={10}\` for the icon
- **Toggle \`medium\`** (default) : Use \`size={12}\` for the icon
- **Toggle \`large\`** : Use \`size={14}\` for the icon

## Icon Only Toggle

For icon-only toggles, use the recommended className:

\`\`\`tsx
<Toggle 
  variant="secondary" 
  size="medium"
  className="p-0 w-6 h-6"
>
  <Icon name="Switch" size={12} />
</Toggle>
\`\`\`

## Context-Aware Styling

The Toggle automatically adapts its appearance based on the parent Layout background:

\`\`\`tsx
<Layout bg="white">
  <Toggle variant="secondary">White bg</Toggle>
</Layout>

<Layout bg="grey">
  <Toggle variant="secondary">Grey bg</Toggle>
</Layout>

<Layout bg="black">
  <Toggle variant="secondary">Black bg</Toggle>
</Layout>
\`\`\`

## Differences from Button

The Toggle component adds the following features beyond Button:

1. **Active State Management**: \`isActive\` prop for controlling active appearance (similar to ButtonStatus)
2. **Default Icon**: Automatically displays Switch icon when no children provided
3. **Active Styles**: Applies hover styles when \`isActive\` is \`true\`

All other Button features (variants, sizes, event handlers, debug mode, etc.) work the same way.`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["normal", "secondary", "ghost", "outline", "destructive", "link"],
      description: "Button variant (inherited from Button component)",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Button size (inherited from Button component)",
    },
    isActive: {
      control: "boolean",
      description: "Active state (similar to ButtonStatus.isActive). When true, applies active styles (hover state). You must implement the toggle logic yourself in onClick.",
    },
    disabled: {
      control: "boolean",
      description: "Disable the toggle",
    },
    debug: {
      control: "boolean",
      description: "Debug mode: displays a label and logs props to the console",
    },
    onClick: {
      action: "clicked",
      description: "Function called on click. You must implement the toggle logic (setIsActive(!isActive)) if you want toggle behavior.",
    },
    onFocus: {
      action: "focused",
      description: "Function called when the toggle receives focus (inherits from ButtonHTMLAttributes)",
    },
    onBlur: {
      action: "blurred",
      description: "Function called when the toggle loses focus (inherits from ButtonHTMLAttributes)",
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes (e.g., \"p-0 w-6 h-6\" for icon-only toggles)",
    },
    children: {
      control: false,
      description: "Toggle content. If not provided, displays Switch icon automatically.",
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
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    children: "Toggle",
  },
};

export const IconOnly: Story = {
  render: () => {
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);

    return (
      <>
        <Toggle
          variant="secondary"
          size="medium"
          className="p-0 w-6 h-6"
          isActive={isPanelOpen}
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          aria-label="Toggle side panel"
        >
          <Icon name="Switch" size={12} />
        </Toggle>
        <SidePanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
        >
          <div className="p-6">
            <h2 className="gs-typo-h2 text-white mb-4">Side Panel</h2>
            <p className="text-white text-sm">
              Ce panneau s'ouvre et se ferme en cliquant sur le toggle ci-dessus.
            </p>
          </div>
        </SidePanel>
      </>
    );
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const IsActive: Story = {
  render: () => {
    const [isActive, setIsActive] = React.useState(false);
    return (
      <VStack gap={4} align="start">
        <div>
          <h3 className="text-sm font-semibold mb-2">isActive controlled</h3>
          <HStack gap={4} align="center">
            <Toggle isActive={isActive} onClick={() => setIsActive(!isActive)}>
              Toggle {isActive ? "ON" : "OFF"}
            </Toggle>
            <Toggle variant="secondary" isActive={isActive} onClick={() => setIsActive(!isActive)}>
              Secondary
            </Toggle>
            <Toggle variant="ghost" isActive={isActive} onClick={() => setIsActive(!isActive)}>
              Ghost
            </Toggle>
          </HStack>
        </div>
      </VStack>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <VStack gap={4} align="start">
      <div>
        <h3 className="text-sm font-semibold mb-2">All variants</h3>
        <HStack gap={4} align="center">
          <Toggle variant="normal">Normal</Toggle>
          <Toggle variant="secondary">Secondary</Toggle>
          <Toggle variant="ghost">Ghost</Toggle>
          <Toggle variant="outline">Outline</Toggle>
          <Toggle variant="destructive">Destructive</Toggle>
        </HStack>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">All variants (active)</h3>
        <HStack gap={4} align="center">
          <Toggle variant="normal" isActive>Normal</Toggle>
          <Toggle variant="secondary" isActive>Secondary</Toggle>
          <Toggle variant="ghost" isActive>Ghost</Toggle>
          <Toggle variant="outline" isActive>Outline</Toggle>
          <Toggle variant="destructive" isActive>Destructive</Toggle>
        </HStack>
      </div>
    </VStack>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <VStack gap={4} align="start">
      <div>
        <h3 className="text-sm font-semibold mb-2">All sizes</h3>
        <HStack gap={4} align="center">
          <Toggle size="small">Small</Toggle>
          <Toggle size="medium">Medium</Toggle>
          <Toggle size="large">Large</Toggle>
        </HStack>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">All sizes (active)</h3>
        <HStack gap={4} align="center">
          <Toggle size="small" isActive>Small</Toggle>
          <Toggle size="medium" isActive>Medium</Toggle>
          <Toggle size="large" isActive>Large</Toggle>
        </HStack>
      </div>
    </VStack>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <VStack gap={4} align="start">
      <div>
        <h3 className="text-sm font-semibold mb-2">White background</h3>
        <Layout bg="white" padding={4}>
          <HStack gap={4} align="center">
            <Toggle>Toggle</Toggle>
            <Toggle isActive>Active</Toggle>
            <Toggle variant="secondary">Secondary</Toggle>
            <Toggle variant="secondary" isActive>Secondary Active</Toggle>
          </HStack>
        </Layout>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Grey background</h3>
        <Layout bg="grey" padding={4}>
          <HStack gap={4} align="center">
            <Toggle>Toggle</Toggle>
            <Toggle isActive>Active</Toggle>
            <Toggle variant="secondary">Secondary</Toggle>
            <Toggle variant="secondary" isActive>Secondary Active</Toggle>
          </HStack>
        </Layout>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Black background</h3>
        <Layout bg="black" padding={4}>
          <HStack gap={4} align="center">
            <Toggle>Toggle</Toggle>
            <Toggle isActive>Active</Toggle>
            <Toggle variant="secondary">Secondary</Toggle>
            <Toggle variant="secondary" isActive>Secondary Active</Toggle>
          </HStack>
        </Layout>
      </div>
    </VStack>
  ),
};

export const DebugMode: Story = {
  render: () => (
    <VStack gap={4} align="start">
      <HStack gap={4} align="center">
        <Toggle debug>Debug</Toggle>
        <Toggle debug isActive>Debug Active</Toggle>
        <Toggle debug variant="secondary">Debug Secondary</Toggle>
      </HStack>
    </VStack>
  ),
};
