import type { Meta, StoryObj } from "@storybook/react-vite";
import { TagGrade } from "@/components/ui/tag-grade";
import { Layout, VStack, HStack } from "@/components/layout";

const meta = {
  title: "UI/TagGrade",
  component: TagGrade,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `TagGrade component built with the Figma design system. The TagGrade automatically inherits color context via \`data-bg\` from the parent Layout.

## Features
- Automatic context-aware styling based on parent background (white, grey, black)
- Built-in TagCross (X icon) for tag removal
- Displays a Grade component (A, B, C, D, E) with appropriate colors
- Hover and pressed states with CSS transitions
- Disabled state support
- Debug mode for development

## Basic Usage

\`\`\`tsx
import { TagGrade, Layout } from '@story-gs-react';

<Layout bg="white">
  <TagGrade value="A" onRemove={() => console.log('removed')} />
</Layout>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`value\` | \`"A" \| "B" \| "C" \| "D" \| "E"\` | Required | Grade value to display |
| \`onRemove\` | \`(e: MouseEvent) => void\` | \`undefined\` | Callback called when TagCross is clicked |
| \`disabled\` | \`boolean\` | \`false\` | Disables the tag and TagCross |
| \`debug\` | \`boolean\` | \`false\` | Debug mode: displays a label and logs props to console |
| \`className\` | \`string\` | \`undefined\` | Additional Tailwind CSS classes |

## Grade Colors

- **A**: Green (#89cc52)
- **B**: Blue (#74d4da)
- **C**: Yellow (#ffd331)
- **D**: Red (#dd3733)
- **E**: Dark grey (#595959)
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "select",
      options: ["A", "B", "C", "D", "E"],
      description: "Grade value (A, B, C, D, or E)",
    },
    onRemove: {
      action: "removed",
      description: "Callback called when TagCross is clicked to remove the tag",
    },
    disabled: {
      control: "boolean",
      description: "Disables the tag and TagCross",
    },
    debug: {
      control: "boolean",
      description: "Debug mode: displays a label and logs props to the console",
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
type Story = StoryObj<typeof TagGrade>;

export const Default: Story = {
  args: {
    value: "A",
  },
};

export const AllGrades: Story = {
  render: () => (
    <HStack gap={4} align="center">
      <TagGrade value="A" />
      <TagGrade value="B" />
      <TagGrade value="C" />
      <TagGrade value="D" />
      <TagGrade value="E" />
    </HStack>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <VStack gap={4} align="start">
      <div>
        <h3 className="text-sm font-semibold mb-2">White background</h3>
        <Layout bg="white" padding={4}>
          <HStack gap={4} align="center">
            <TagGrade value="A" />
            <TagGrade value="B" />
            <TagGrade value="C" />
            <TagGrade value="D" />
            <TagGrade value="E" />
          </HStack>
        </Layout>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Grey background</h3>
        <Layout bg="grey" padding={4}>
          <HStack gap={4} align="center">
            <TagGrade value="A" />
            <TagGrade value="B" />
            <TagGrade value="C" />
            <TagGrade value="D" />
            <TagGrade value="E" />
          </HStack>
        </Layout>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Black background</h3>
        <Layout bg="black" padding={4}>
          <HStack gap={4} align="center">
            <TagGrade value="A" />
            <TagGrade value="B" />
            <TagGrade value="C" />
            <TagGrade value="D" />
            <TagGrade value="E" />
          </HStack>
        </Layout>
      </div>
    </VStack>
  ),
};

export const WithOnRemove: Story = {
  render: () => (
    <HStack gap={4} align="center">
      <TagGrade value="A" onRemove={() => alert("Removed grade A")} />
      <TagGrade value="B" onRemove={() => alert("Removed grade B")} />
      <TagGrade value="C" onRemove={() => alert("Removed grade C")} />
    </HStack>
  ),
};

export const States: Story = {
  render: () => (
    <VStack gap={4} align="start">
      <div>
        <h3 className="text-sm font-semibold mb-2">Default</h3>
        <HStack gap={4} align="center">
          <TagGrade value="A" />
          <TagGrade value="B" />
          <TagGrade value="C" />
        </HStack>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Disabled</h3>
        <HStack gap={4} align="center">
          <TagGrade value="A" disabled />
          <TagGrade value="B" disabled />
          <TagGrade value="C" disabled />
        </HStack>
      </div>
    </VStack>
  ),
};

export const DebugMode: Story = {
  render: () => (
    <HStack gap={4} align="center">
      <TagGrade value="A" debug />
      <TagGrade value="B" debug />
      <TagGrade value="C" debug />
    </HStack>
  ),
};

export const NestedLayouts: Story = {
  render: () => (
    <VStack gap={4} align="start">
      <div>
        <h3 className="text-sm font-semibold mb-2">Nested in white Layout</h3>
        <Layout bg="white" padding={4}>
          <HStack gap={4} align="center">
            <TagGrade value="A" />
            <TagGrade value="B" />
          </HStack>
        </Layout>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Nested in grey Layout</h3>
        <Layout bg="grey" padding={4}>
          <HStack gap={4} align="center">
            <TagGrade value="A" />
            <TagGrade value="B" />
          </HStack>
        </Layout>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Nested in black Layout</h3>
        <Layout bg="black" padding={4}>
          <HStack gap={4} align="center">
            <TagGrade value="A" />
            <TagGrade value="B" />
          </HStack>
        </Layout>
      </div>
    </VStack>
  ),
};

