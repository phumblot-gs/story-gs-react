import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./progress";
import { useState } from "react";
import { Layout, VStack } from "@/components/layout";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Progress component built with the Figma design system. The Progress automatically inherits color context via \`data-bg\` from the parent Layout.

## Features
- Progress indicator with customizable value and max
- Automatic state detection (complete, indeterminate, loading)
- Context-aware styling based on parent background
- State change callback for programmatic control
- Built on Radix UI Progress primitive

## Background Context Adaptation

The Progress component styles adapt automatically based on the parent Layout's \`data-bg\`:

- **White background**: 
  - Progress bar: default secondary background
  - Progress indicator: black color

- **Grey background**: 
  - Progress bar: white background
  - Progress indicator: black color

- **Black background**: 
  - Progress bar: black-secondary background
  - Progress indicator: white color

## Basic Usage

\`\`\`tsx
import { Progress, Layout } from '@story-gs-react';

<Layout bg="white">
  <Progress value={33} />
</Layout>
\`\`\`

## With Custom Max

The \`max\` prop allows you to define a custom maximum value (default: 100).

\`\`\`tsx
// Progress value 75 out of 200 (37.5%)
<Progress value={75} max={200} />
\`\`\`

## Progress States

The component automatically calculates its state based on the \`value\` and \`max\` props:

- **\`indeterminate\`**: When \`value\` is \`undefined\` or \`null\` (no progress value available)
- **\`loading\`**: When \`value\` is defined but less than \`max\` (progress in progress)
- **\`complete\`**: When \`value >= max\` (progress completed)

\`\`\`tsx
// Indeterminate state (no value)
<Progress value={undefined} />

// Loading state (value < max)
<Progress value={45} max={100} />

// Complete state (value >= max)
<Progress value={100} max={100} />
\`\`\`

## State Change Callback

Use the \`onStateChange\` callback to be notified when the progress state changes:

\`\`\`tsx
const [state, setState] = useState<ProgressState | undefined>();

<Progress 
  value={progressValue} 
  max={100}
  onStateChange={(newState) => {
    setState(newState);
    if (newState === 'complete') {
      console.log('Progress completed!');
    }
  }}
/>
\`\`\`

## Custom Height

You can customize the height of the Progress component using the \`className\` prop with Tailwind height classes:

\`\`\`tsx
// Thin progress bar (4px)
<Progress value={50} className="h-1" />

// Default height (16px)
<Progress value={50} />

// Thick progress bar (32px)
<Progress value={50} className="h-8" />
\`\`\`

**Available height classes:**
- \`h-1\` (4px)
- \`h-2\` (8px)
- \`h-3\` (12px)
- \`h-4\` (16px) - Default
- \`h-6\` (24px)
- \`h-8\` (32px)
- Or any custom Tailwind height class

## Calculation Details

The component automatically calculates the percentage for display:
- Percentage = \`(value / max) * 100\`
- Percentage is clamped between 0 and 100
- The percentage is passed to Radix UI (which expects 0-100)

**Example with custom max:**
- \`value={75}\`, \`max={200}\` → Percentage = \`(75 / 200) * 100 = 37.5%\` → Displayed as 37.5%`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 100, step: 1 },
      description: "The current progress value (0 to max)",
    },
    max: {
      control: { type: "number", min: 1, step: 1 },
      description: "The maximum progress value (default: 100)",
    },
    onStateChange: {
      action: "stateChanged",
      description: "Callback function that receives the current progress state (complete, indeterminate, loading)",
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const WithCustomMax: Story = {
  args: {
    value: 75,
    max: 200,
  },
  render: (args) => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <Progress {...args} />
        <p className="text-sm text-muted-foreground">
          Progress: {args.value} / {args.max} ({(args.value! / args.max! * 100).toFixed(1)}%)
        </p>
      </VStack>
    </Layout>
  ),
};

export const Indeterminate: Story = {
  args: {
    value: undefined,
  },
  render: (args) => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <Progress {...args} />
        <p className="text-sm text-muted-foreground">
          State: indeterminate (no value provided)
        </p>
      </VStack>
    </Layout>
  ),
};

export const Loading: Story = {
  args: {
    value: 45,
  },
  render: (args) => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <Progress {...args} />
        <p className="text-sm text-muted-foreground">
          State: loading (value &lt; max)
        </p>
      </VStack>
    </Layout>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <VStack gap={6} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background White</h3>
        <VStack gap={4} className="w-full">
          <Progress value={33} />
          <Progress value={66} />
          <Progress value={100} />
        </VStack>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background Grey</h3>
        <VStack gap={4} className="w-full">
          <Progress value={33} />
          <Progress value={66} />
          <Progress value={100} />
        </VStack>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3 text-white">Background Black</h3>
        <VStack gap={4} className="w-full">
          <Progress value={33} />
          <Progress value={66} />
          <Progress value={100} />
        </VStack>
      </VStack>
    </VStack>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const WithStateChange: Story = {
  render: () => {
    const [state, setState] = useState<string>("");
    const [value, setValue] = useState(0);

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4} className="w-full max-w-md">
          <div>
            <label className="block mb-2 text-sm font-medium">Progress value: {value}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <Progress value={value} onStateChange={setState} />
          <div className="text-sm text-muted-foreground">
            Current state: <strong>{state || "none"}</strong>
          </div>
          <div className="p-4 bg-blue-primary rounded">
            <p className="text-xs font-medium mb-2">💡 State calculation:</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li><strong>indeterminate</strong>: value is undefined/null</li>
              <li><strong>loading</strong>: value &lt; max</li>
              <li><strong>complete</strong>: value &gt;= max</li>
            </ul>
          </div>
        </VStack>
      </Layout>
    );
  },
};

export const StateTransitions: Story = {
    render: () => {
      const [value, setValue] = useState(0);
      const [state, setState] = useState<string>("");
      const [max] = useState(100);

      return (
        <Layout bg="white" padding={6}>
          <VStack gap={6} className="w-full max-w-md">
            <div>
              <h3 className="gs-typo-h3 mb-2">State Transitions</h3>
              <p className="text-sm text-muted-foreground">
                Watch how the state changes as the progress value increases.
              </p>
            </div>

            <VStack gap={4}>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Progress: {value} / {max}
                </label>
                <input
                  type="range"
                  min="0"
                  max={max}
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <Progress value={value} max={max} onStateChange={setState} />

              <div className="p-4 bg-grey-lighter rounded">
                <p className="text-sm font-medium mb-2">Current State:</p>
                <p className="text-lg font-bold">{state || "indeterminate"}</p>
                <div className="mt-2 text-xs text-muted-foreground">
                  {value === 0 && "💡 Set value &gt; 0 to transition to 'loading'"}
                  {value > 0 && value < max && `💡 Progress: ${value}% (loading state)`}
                  {value >= max && "✅ Progress complete!"}
                </div>
              </div>

              <div className="p-4 bg-blue-primary rounded">
                <p className="text-xs font-medium mb-2">State Logic:</p>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>value = undefined/null → <strong>indeterminate</strong></li>
                  <li>value &lt; max → <strong>loading</strong></li>
                  <li>value &gt;= max → <strong>complete</strong></li>
                </ul>
              </div>
            </VStack>
          </VStack>
        </Layout>
      );
    },
  };

  export const CustomHeights: Story = {
    render: () => (
      <Layout bg="white" padding={6}>
        <VStack gap={6} className="w-full max-w-md">
          <div>
            <h3 className="gs-typo-h3 mb-2">Custom Heights</h3>
            <p className="text-sm text-muted-foreground">
              You can customize the height of the Progress component using the \`className\` prop with Tailwind height classes.
            </p>
          </div>

          <VStack gap={4} className="w-full">
            <div>
              <p className="text-sm font-medium mb-2">h-1 (4px)</p>
              <Progress value={50} className="h-1" />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">h-2 (8px)</p>
              <Progress value={50} className="h-2" />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">h-3 (12px)</p>
              <Progress value={50} className="h-3" />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">h-4 (16px) - Default</p>
              <Progress value={50} />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">h-6 (24px)</p>
              <Progress value={50} className="h-6" />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">h-8 (32px)</p>
              <Progress value={50} className="h-8" />
            </div>
          </VStack>
        </VStack>
      </Layout>
    ),
  };
