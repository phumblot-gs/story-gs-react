import type { Meta, StoryObj } from "@storybook/react"
import { Animated } from "./Animated"
import { Layout } from "@/components/layout/Layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const meta: Meta<typeof Animated> = {
  title: "UI/Animated",
  component: Animated,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The \`Animated\` component displays animations to illustrate application behavior.
Similar to the \`Icon\` component, but for animations.

## Features

- **Name-based system** : Uses a \`name\` prop to select the animation, similar to \`Icon\`
- **Customization** : Control colors and animation timing
- **Size control** : Use Tailwind classes (\`w-x\` and \`h-x\`) to control size
- **Reusable** : Extensible structure to easily add new animations

## Available animations

- \`success\` : Success animation with badge and checkmark

## Color tokens

The \`bgColor\` prop accepts color tokens from the design system or hex values. Available color tokens:

- \`green\` : Green (#89cc52)
- \`green-primary\` : Primary green (#9edeab)
- \`blue\` : Blue (#74d4da)
- \`blue-primary\` : Primary blue (#cdedff)
- \`red-strong\` : Strong red (#dd3733)
- \`yellow\` : Yellow (#ffd331)
- \`orange\` : Orange (#ff9900)
- \`pink\` : Pink (#ffaad4)
- \`purple\` : Purple (#a44c9f)
- \`khaki\` : Khaki (#b7bb28)
- \`pastel-blue\` : Pastel blue (#74d4da)
- \`pastel-green\` : Pastel green (#a0e0ad)
- \`pastel-yellow\` : Pastel yellow (#ebed8c)

You can also use hex values directly (e.g., \`#2196F3\`).

## Usage

\`\`\`tsx
// Default success animation (use className for size)
<Animated name="success" className="w-11 h-11" />

// Custom size using Tailwind classes
<Animated name="success" className="w-16 h-16" />

// Custom colors using color tokens
<Animated name="success" className="w-16 h-16" color="white" bgColor="blue-primary" />

// Custom colors using hex values (still supported)
<Animated name="success" className="w-16 h-16" color="white" bgColor="#2196F3" />

// Custom timing
<Animated 
  name="success" 
  className="w-20 h-20"
  duration={1.2} 
  checkDelay={1.0} 
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "select",
      options: ["success"],
      description: "Nom de l'animation à afficher",
      table: {
        type: { summary: "AnimatedName" },
        defaultValue: { summary: "success" },
      },
    },
    color: {
      control: "color",
      description: "Badge/icon color",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "white" },
      },
    },
    bgColor: {
      control: "text",
      description: "Circle background color. Can be a color token (green, blue-primary, red-strong, etc.) or hex value",
      table: {
        type: { summary: "ColorToken | string" },
        defaultValue: { summary: "green (for success)" },
      },
    },
    duration: {
      control: { type: "number", min: 0.1, max: 3, step: 0.1 },
      description: "Badge animation duration in seconds",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "0.8" },
      },
    },
    checkDelay: {
      control: { type: "number", min: 0, max: 3, step: 0.1 },
      description: "Delay before checkmark appears in seconds",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "0.8" },
      },
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes. Use w-x and h-x to control size",
    },
    debug: {
      control: "boolean",
      description: "Debug mode: displays pink border and logs clicks",
    },
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
type Story = StoryObj<typeof Animated>

/**
 * Default success animation with standard values.
 */
export const Default: Story = {
  args: {
    name: "success",
    className: "w-11 h-11",
    color: "white",
    bgColor: "green",
    duration: 0.8,
    checkDelay: 0.8,
  },
}

/**
 * Different sizes of success animation using Tailwind classes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Animated name="success" className="w-8 h-8" />
        <span className="text-xs text-grey-strongest">w-8 h-8 (32px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Animated name="success" className="w-11 h-11" />
        <span className="text-xs text-grey-strongest">w-11 h-11 (44px, default)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Animated name="success" className="w-16 h-16" />
        <span className="text-xs text-grey-strongest">w-16 h-16 (64px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Animated name="success" className="w-20 h-20" />
        <span className="text-xs text-grey-strongest">w-20 h-20 (80px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Animated name="success" className="w-24 h-24" />
        <span className="text-xs text-grey-strongest">w-24 h-24 (96px)</span>
      </div>
    </div>
  ),
}

/**
 * Different color variants for the success animation.
 */
export const ColorVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Success (green token)</h3>
        <Animated name="success" className="w-16 h-16" color="white" bgColor="green" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Info (blue-primary token)</h3>
        <Animated name="success" className="w-16 h-16" color="white" bgColor="blue-primary" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Warning (orange token)</h3>
        <Animated name="success" className="w-16 h-16" color="white" bgColor="orange" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Error (red-strong token)</h3>
        <Animated name="success" className="w-16 h-16" color="white" bgColor="red-strong" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Purple/Gold (hex values)</h3>
        <Animated name="success" className="w-16 h-16" color="#FFD700" bgColor="#764ba2" />
      </div>
    </div>
  ),
}

/**
 * Animation with custom timing.
 */
export const CustomTiming: Story = {
  render: () => {
    const [key, setKey] = useState(0)

    const restart = () => {
      setKey((prev) => prev + 1)
    }

    return (
      <div className="flex flex-col items-center gap-4">
        <Animated
          key={key}
          name="success"
          className="w-20 h-20"
          duration={1.2}
          checkDelay={1.0}
        />
        <Button onClick={restart} variant="secondary" size="small">
          Replay animation
        </Button>
      </div>
    )
  },
}

/**
 * Fast and slow animations to compare timings.
 */
export const TimingComparison: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Fast</h3>
        <Animated name="success" className="w-16 h-16" duration={0.4} checkDelay={0.4} />
        <p className="text-xs text-grey-strongest mt-2">
          duration: 0.4s
          <br />
          checkDelay: 0.4s
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Normal</h3>
        <Animated name="success" className="w-16 h-16" duration={0.8} checkDelay={0.8} />
        <p className="text-xs text-grey-strongest mt-2">
          duration: 0.8s
          <br />
          checkDelay: 0.8s
        </p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-sm font-medium mb-2">Slow</h3>
        <Animated name="success" className="w-16 h-16" duration={1.5} checkDelay={1.5} />
        <p className="text-xs text-grey-strongest mt-2">
          duration: 1.5s
          <br />
          checkDelay: 1.5s
        </p>
      </div>
    </div>
  ),
}

/**
 * Animation on different backgrounds to test visibility.
 */
export const AllBackgrounds: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">White Background</h3>
        <Layout bg="white" padding={6}>
          <div className="flex items-center gap-4">
            <Animated name="success" className="w-16 h-16" />
            <Animated name="success" className="w-16 h-16" bgColor="blue-primary" />
            <Animated name="success" className="w-16 h-16" bgColor="orange" />
          </div>
        </Layout>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Grey Background</h3>
        <Layout bg="grey" padding={6}>
          <div className="flex items-center gap-4">
            <Animated name="success" className="w-16 h-16" />
            <Animated name="success" className="w-16 h-16" bgColor="blue-primary" />
            <Animated name="success" className="w-16 h-16" bgColor="orange" />
          </div>
        </Layout>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Black Background</h3>
        <Layout bg="black" padding={6}>
          <div className="flex items-center gap-4">
            <Animated name="success" className="w-16 h-16" />
            <Animated name="success" className="w-16 h-16" bgColor="blue-primary" />
            <Animated name="success" className="w-16 h-16" bgColor="orange" />
          </div>
        </Layout>
      </div>
    </div>
  ),
}

/**
 * Debug mode enabled to see interactions.
 */
export const DebugMode: Story = {
  args: {
    name: "success",
    className: "w-16 h-16",
    debug: true,
  },
}

