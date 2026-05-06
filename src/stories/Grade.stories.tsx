import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Grade } from "@/components/ui/grade";
import { Layout, VStack, HStack } from "@/components/layout";

const meta: Meta<typeof Grade> = {
  title: "UI/Grade",
  component: Grade,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Grade component for displaying grade values (A, B, C, D, E) with appropriate background colors.

## Features
- Five grade values: A (green), B (blue), C (yellow), D (red), E (dark grey)
- Debug mode for development
- Customizable styling with className
- Accessible with title attribute support`,
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
    size: {
      control: { type: "inline-radio" },
      options: ["small", "medium", "large"],
      description:
        "Badge size. `small` (default) = ~14×14 px historical look. `medium` = 20×20 round. `large` = 50×50 round.",
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes",
    },
    debug: {
      control: "boolean",
      description: "Debug mode: displays a label and logs props to the console",
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
type Story = StoryObj<typeof Grade>;

export const Default: Story = {
  args: {
    value: "A",
  },
};

export const AllGrades: Story = {
  render: () => (
    <HStack gap={4} align="center">
      <Grade value="A" />
      <Grade value="B" />
      <Grade value="C" />
      <Grade value="D" />
      <Grade value="E" />
    </HStack>
  ),
};

export const Sizes: Story = {
  render: () => (
    <VStack gap={6} align="start">
      <VStack gap={2} align="start">
        <p className="text-xs uppercase tracking-wider text-grey-strongest">size="small" — default, historical look</p>
        <HStack gap={4} align="center">
          <Grade value="A" />
          <Grade value="B" />
          <Grade value="C" />
          <Grade value="D" />
          <Grade value="E" />
        </HStack>
      </VStack>
      <VStack gap={2} align="start">
        <p className="text-xs uppercase tracking-wider text-grey-strongest">size="medium" — 20×20 round</p>
        <HStack gap={4} align="center">
          <Grade value="A" size="medium" />
          <Grade value="B" size="medium" />
          <Grade value="C" size="medium" />
          <Grade value="D" size="medium" />
          <Grade value="E" size="medium" />
        </HStack>
      </VStack>
      <VStack gap={2} align="start">
        <p className="text-xs uppercase tracking-wider text-grey-strongest">size="large" — 50×50 round</p>
        <HStack gap={4} align="center">
          <Grade value="A" size="large" />
          <Grade value="B" size="large" />
          <Grade value="C" size="large" />
          <Grade value="D" size="large" />
          <Grade value="E" size="large" />
        </HStack>
      </VStack>
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Three sizes side-by-side. `small` (default) preserves the historical 14×14 look — passing no `size` prop yields the same render as before. `medium` and `large` are perfect circles (20×20 / 50×50) with proportionally scaled font.",
      },
    },
  },
};

export const AllBackgrounds: Story = {
  render: () => (
    <VStack gap={4} align="start">
      <div>
        <h3 className="text-sm font-semibold mb-2">White background</h3>
        <Layout bg="white" padding={4}>
          <HStack gap={4} align="center">
            <Grade value="A" />
            <Grade value="B" />
            <Grade value="C" />
            <Grade value="D" />
            <Grade value="E" />
          </HStack>
        </Layout>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Grey background</h3>
        <Layout bg="grey" padding={4}>
          <HStack gap={4} align="center">
            <Grade value="A" />
            <Grade value="B" />
            <Grade value="C" />
            <Grade value="D" />
            <Grade value="E" />
          </HStack>
        </Layout>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Black background</h3>
        <Layout bg="black" padding={4}>
          <HStack gap={4} align="center">
            <Grade value="A" />
            <Grade value="B" />
            <Grade value="C" />
            <Grade value="D" />
            <Grade value="E" />
          </HStack>
        </Layout>
      </div>
    </VStack>
  ),
};

export const DebugMode: Story = {
  render: () => (
    <HStack gap={4} align="center">
      <Grade value="A" debug />
      <Grade value="B" debug />
      <Grade value="C" debug />
      <Grade value="D" debug />
      <Grade value="E" debug />
    </HStack>
  ),
};

export const InText: Story = {
  render: () => (
    <VStack gap={4} align="start">
      <p className="text-base">
        This image has a grade of <Grade value="A" /> which is excellent.
      </p>
      <p className="text-base">
        This image has a grade of <Grade value="B" /> which is good.
      </p>
      <p className="text-base">
        This image has a grade of <Grade value="C" /> which is average.
      </p>
      <p className="text-base">
        This image has a grade of <Grade value="D" /> which needs improvement.
      </p>
      <p className="text-base">
        This image has a grade of <Grade value="E" /> which is poor.
      </p>
    </VStack>
  ),
};

