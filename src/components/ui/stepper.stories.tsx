import type { Meta, StoryObj } from "@storybook/react"
import { Stepper, type StepperStep } from "./stepper"
import { Layout } from "@/components/layout/Layout"
import { useState } from "react"

const meta: Meta<typeof Stepper> = {
  title: "UI/Stepper",
  component: Stepper,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The \`Stepper\` component displays progress through multiple steps in a wizard or multi-step process.

## Features

- **Visual states**: Three states for each step (future, active, completed)
- **Variants**: Support for Button variants (normal, secondary, outline, ghost)
- **Connecting lines**: Lines automatically adapt based on variant and state
- **Optional titles**: Ability to add titles under each step
- **Interactive clicks**: Optional onClick callbacks support for each step
- **Context adaptation**: Automatically adapts to parent \`data-bg\` context

## Step States

- **future**: Step not yet reached (default variant style)
- **active**: Currently active step (variant "pressed" style)
- **completed**: Completed step (variant "hover" style with Check icon)

## Variants

The component supports the same variants as the Button component:
- \`normal\` : Default style (colored background)
- \`secondary\` : Secondary style
- \`outline\` : Style with border
- \`ghost\` : Transparent style

Connecting lines automatically adapt:
- Completed/active lines: variant "hover" or "pressed" color
- Future lines: light grey color

## Basic Usage

\`\`\`tsx
import { Stepper } from "@/components/ui/stepper"

const steps: StepperStep[] = [
  { label: 1, state: "completed", title: "Step 1" },
  { label: 2, state: "active", title: "Step 2" },
  { label: 3, state: "future", title: "Step 3" },
]

<Stepper steps={steps} variant="normal" />
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    steps: {
      description: "List of steps to display",
      control: "object",
    },
    variant: {
      description: "Button variant (normal, secondary, outline, ghost)",
      control: "select",
      options: ["normal", "secondary", "outline", "ghost"],
      table: {
        defaultValue: { summary: "normal" },
      },
    },
    className: {
      description: "Additional CSS classes",
      control: "text",
    },
    debug: {
      description: "Debug mode to display logs",
      control: "boolean",
    },
  },
  args: {
    variant: "normal",
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <Story />
      </Layout>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Stepper>

// Default example
export const Default: Story = {
  args: {
    steps: [
      { label: 1, state: "completed", title: "Step 1" },
      { label: 2, state: "active", title: "Step 2" },
      { label: 3, state: "future", title: "Step 3" },
    ],
    variant: "normal",
  },
  render: (args) => <Stepper {...args} />,
}

// All variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Normal</h3>
        <Stepper
          steps={[
            { label: 1, state: "completed", title: "Step 1" },
            { label: 2, state: "active", title: "Step 2" },
            { label: 3, state: "future", title: "Step 3" },
          ]}
          variant="normal"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Secondary</h3>
        <Stepper
          steps={[
            { label: 1, state: "completed", title: "Step 1" },
            { label: 2, state: "active", title: "Step 2" },
            { label: 3, state: "future", title: "Step 3" },
          ]}
          variant="secondary"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Outline</h3>
        <Stepper
          steps={[
            { label: 1, state: "completed", title: "Step 1" },
            { label: 2, state: "active", title: "Step 2" },
            { label: 3, state: "future", title: "Step 3" },
          ]}
          variant="outline"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Ghost</h3>
        <Stepper
          steps={[
            { label: 1, state: "completed", title: "Step 1" },
            { label: 2, state: "active", title: "Step 2" },
            { label: 3, state: "future", title: "Step 3" },
          ]}
          variant="ghost"
        />
      </div>
    </div>
  ),
}

// All backgrounds
export const AllBackgrounds: Story = {
  args: {
    steps: [
      { label: 1, state: "completed", title: "Step 1" },
      { label: 2, state: "active", title: "Step 2" },
      { label: 3, state: "future", title: "Step 3" },
    ],
    variant: "normal",
  },
  render: (args) => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">White Background</h3>
        <Layout bg="white" padding={6}>
          <Stepper {...args} />
        </Layout>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Grey Background</h3>
        <Layout bg="grey" padding={6}>
          <Stepper {...args} />
        </Layout>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Black Background</h3>
        <Layout bg="black" padding={6}>
          <Stepper {...args} />
        </Layout>
      </div>
    </div>
  ),
}

// Without titles
export const WithoutTitles: Story = {
  args: {
    steps: [
      { label: 1, state: "completed" },
      { label: 2, state: "active" },
      { label: 3, state: "future" },
    ],
    variant: "normal",
  },
}

// With onClick callbacks
export const WithClickHandlers: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(2)

    const steps: StepperStep[] = [
      {
        label: 1,
        state: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "future",
        title: "Step 1",
        onClick: () => setCurrentStep(1),
      },
      {
        label: 2,
        state: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "future",
        title: "Step 2",
        onClick: () => setCurrentStep(2),
      },
      {
        label: 3,
        state: currentStep > 3 ? "completed" : currentStep === 3 ? "active" : "future",
        title: "Step 3",
        onClick: () => setCurrentStep(3),
      },
    ]

    return (
      <div className="flex flex-col gap-4">
        <Stepper steps={steps} variant="normal" />
        <p className="text-sm text-grey-strongest">
          Current step: {currentStep} (click on a step to navigate)
        </p>
      </div>
    )
  },
}

// Many steps
export const ManySteps: Story = {
  args: {
    steps: [
      { label: 1, state: "completed", title: "Step 1" },
      { label: 2, state: "completed", title: "Step 2" },
      { label: 3, state: "completed", title: "Step 3" },
      { label: 4, state: "active", title: "Step 4" },
      { label: 5, state: "future", title: "Step 5" },
      { label: 6, state: "future", title: "Step 6" },
    ],
    variant: "normal",
  },
}

// Debug mode
export const DebugMode: Story = {
  args: {
    steps: [
      { label: 1, state: "completed", title: "Step 1" },
      { label: 2, state: "active", title: "Step 2" },
      { label: 3, state: "future", title: "Step 3" },
    ],
    variant: "normal",
    debug: true,
  },
}

