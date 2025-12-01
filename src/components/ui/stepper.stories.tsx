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
- **Completed step clicks**: Optional ability to make completed steps clickable without explicit onClick handlers
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

## Completed Step Clicks

By default, completed steps are only clickable if they have an explicit \`onClick\` handler. You can enable clicking on all completed steps using the \`allowCompletedClick\` prop:

\`\`\`tsx
<Stepper
  steps={steps}
  variant="normal"
  allowCompletedClick={true}
  onStepClick={(index, step) => {
    // Handle click on completed step
    console.log("Clicked step", index, step)
  }}
/>
\`\`\`

When \`allowCompletedClick\` is enabled:
- Completed steps without explicit \`onClick\` become clickable
- The \`onStepClick\` callback is called when clicking these steps
- Steps with explicit \`onClick\` handlers still use their own handlers
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
    allowCompletedClick: {
      description: "Allow clicking on completed steps even without explicit onClick handlers",
      control: "boolean",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    onStepClick: {
      description: "Callback called when clicking on a completed step without explicit onClick",
      control: false,
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

// With allowCompletedClick - completed steps are clickable without explicit onClick
export const WithCompletedClick: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(3)

    const steps: StepperStep[] = [
      {
        label: 1,
        state: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "future",
        title: "Step 1",
        // Pas d'onClick explicite, mais cliquable grâce à allowCompletedClick
      },
      {
        label: 2,
        state: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "future",
        title: "Step 2",
        // Pas d'onClick explicite, mais cliquable grâce à allowCompletedClick
      },
      {
        label: 3,
        state: currentStep > 3 ? "completed" : currentStep === 3 ? "active" : "future",
        title: "Step 3",
        onClick: () => setCurrentStep(3), // onClick explicite pour l'étape active
      },
      {
        label: 4,
        state: currentStep > 4 ? "completed" : currentStep === 4 ? "active" : "future",
        title: "Step 4",
        // Pas d'onClick explicite
      },
    ]

    return (
      <div className="flex flex-col gap-4">
        <Stepper
          steps={steps}
          variant="normal"
          allowCompletedClick={true}
          onStepClick={(index, step) => {
            console.log("Clicked on completed step:", index, step)
            setCurrentStep(index + 1)
          }}
        />
        <p className="text-sm text-grey-strongest">
          Current step: {currentStep} (click on completed steps to navigate back)
        </p>
        <p className="text-xs text-grey-stronger">
          Completed steps are clickable thanks to allowCompletedClick prop
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "With allowCompletedClick enabled, completed steps become clickable even without explicit onClick handlers. Use onStepClick to handle these clicks.",
      },
    },
  },
}

// Comparison: with and without allowCompletedClick
export const Comparison: Story = {
  render: () => {
    const [currentStep1, setCurrentStep1] = useState(3)
    const [currentStep2, setCurrentStep2] = useState(3)

    const steps1: StepperStep[] = [
      { label: 1, state: currentStep1 > 1 ? "completed" : currentStep1 === 1 ? "active" : "future", title: "Step 1" },
      { label: 2, state: currentStep1 > 2 ? "completed" : currentStep1 === 2 ? "active" : "future", title: "Step 2" },
      { label: 3, state: currentStep1 > 3 ? "completed" : currentStep1 === 3 ? "active" : "future", title: "Step 3" },
    ]

    const steps2: StepperStep[] = [
      { label: 1, state: currentStep2 > 1 ? "completed" : currentStep2 === 1 ? "active" : "future", title: "Step 1" },
      { label: 2, state: currentStep2 > 2 ? "completed" : currentStep2 === 2 ? "active" : "future", title: "Step 2" },
      { label: 3, state: currentStep2 > 3 ? "completed" : currentStep2 === 3 ? "active" : "future", title: "Step 3" },
    ]

    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Without allowCompletedClick (default)</h3>
          <Stepper steps={steps1} variant="normal" />
          <p className="text-xs text-grey-stronger">
            Completed steps are not clickable
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">With allowCompletedClick</h3>
          <Stepper
            steps={steps2}
            variant="normal"
            allowCompletedClick={true}
            onStepClick={(index) => setCurrentStep2(index + 1)}
          />
          <p className="text-xs text-grey-stronger">
            Completed steps are clickable (try clicking Step 1 or 2)
          </p>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: "Comparison between default behavior (completed steps not clickable) and with allowCompletedClick enabled.",
      },
    },
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

