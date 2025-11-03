import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonPlus } from "@/components/ui/button-plus"
import { Layout, VStack, HStack } from "@/components/layout"
import { action } from "storybook/actions"

const meta = {
  title: "UI/ButtonPlus",
  component: ButtonPlus,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `ButtonPlus component - A special button designed to highlight important creation actions (e.g., loading new images, creating a new production). 

Visually, it appears as a pill containing a normal-sized button with a Plus icon, wrapped together with a label text.

## Features
- Pill-shaped container with inner button and label (40px height)
- Automatic styling adaptation based on Layout background (white, grey, black)
- Inner button is always size="medium" with variant="normal"
- Inner button adapts to inverted background context
- Plus icon rotates 90° clockwise on hover (smooth animation)
- Entire pill is clickable
- Inherits all standard button props (onClick, disabled, etc.)

## Background Context Adaptation

The pill container adapts its appearance based on the parent Layout's \`data-bg\`:

- **White background**: Pill has white background with grey border
- **Grey background**: Pill has grey background with grey-stronger border
- **Black background**: Pill has black-secondary background with grey-strongest border

The **inner button** uses an inverted background context:
- **Layout = white or grey** → Inner button uses \`data-bg="black"\` (black styles)
- **Layout = black** → Inner button uses \`data-bg="white"\` (white styles)

## Icon Animation

The Plus icon smoothly rotates 90° clockwise when hovering over the pill, and rotates back counter-clockwise when the mouse leaves.

## Basic Usage

\`\`\`tsx
import { ButtonPlus, Layout } from '@story-gs-react';

<Layout bg="white">
  <ButtonPlus label="Load images" onClick={() => console.log('Clicked')} />
</Layout>
\`\`\`

## With Translation

\`\`\`tsx
<ButtonPlus label={t('button.plus.loadImages')} onClick={handleClick} />
\`\`\`
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text displayed in the pill (can be translated)",
    },
    disabled: {
      control: "boolean",
      description: "Disables the entire pill button",
    },
    onClick: {
      action: "clicked",
      description: "Callback called when the pill is clicked",
    },
    onFocus: {
      action: "focused",
      description: "Callback called when the pill receives focus",
    },
    onBlur: {
      action: "blurred",
      description: "Callback called when the pill loses focus",
    },
    debug: {
      control: "boolean",
      description: "Debug mode: logs props and actions to console",
    },
  },
} satisfies Meta<typeof ButtonPlus>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Layout bg="white" padding={6}>
      <ButtonPlus {...args} label="Load images" onClick={action("clicked")} />
    </Layout>
  ),
  args: {},
}

export const AllBackgrounds: Story = {
  render: () => (
    <VStack gap={6} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background White</h3>
        <HStack gap={3}>
          <ButtonPlus label="Load images" onClick={action("clicked")} />
          <ButtonPlus label="Create production" onClick={action("clicked")} />
          <ButtonPlus label="Add new item" onClick={action("clicked")} />
        </HStack>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background Grey</h3>
        <HStack gap={3}>
          <ButtonPlus label="Load images" onClick={action("clicked")} />
          <ButtonPlus label="Create production" onClick={action("clicked")} />
          <ButtonPlus label="Add new item" onClick={action("clicked")} />
        </HStack>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3 text-white">Background Black</h3>
        <HStack gap={3}>
          <ButtonPlus label="Load images" onClick={action("clicked")} />
          <ButtonPlus label="Create production" onClick={action("clicked")} />
          <ButtonPlus label="Add new item" onClick={action("clicked")} />
        </HStack>
      </VStack>
    </VStack>
  ),
  parameters: {
    layout: "fullscreen",
  },
}

export const Disabled: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <HStack gap={3}>
          <ButtonPlus label="Enabled" onClick={action("clicked")} />
          <ButtonPlus label="Disabled" disabled onClick={action("clicked")} />
        </HStack>
      </VStack>
    </Layout>
  ),
}

export const WithLongLabels: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <HStack gap={3}>
          <ButtonPlus label="Load new images" onClick={action("clicked")} />
          <ButtonPlus label="Create a new production" onClick={action("clicked")} />
          <ButtonPlus label="Add multiple items to the collection" onClick={action("clicked")} />
        </HStack>
      </VStack>
    </Layout>
  ),
}

export const IconAnimation: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <div>
          <p className="text-sm text-grey-stronger mb-2">
            Hover over the button to see the Plus icon rotate 90° clockwise
          </p>
          <ButtonPlus label="Hover me" onClick={action("clicked")} />
        </div>
      </VStack>
    </Layout>
  ),
}

export const DebugMode: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <p className="text-sm text-grey-stronger">
          Open the console to see debug logs
        </p>
        <ButtonPlus label="Debug button" debug onClick={action("clicked")} />
      </VStack>
    </Layout>
  ),
}

