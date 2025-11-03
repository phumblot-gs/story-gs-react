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

export const WithCustomSize: Story = {
  render: () => (
    <VStack gap={4} align="start">
      <HStack gap={4} align="center">
        <Grade value="A" className="w-4 h-4" />
        <Grade value="B" className="w-6 h-6" />
        <Grade value="C" className="w-8 h-8" />
        <Grade value="D" className="w-10 h-10" />
        <Grade value="E" className="w-12 h-12" />
      </HStack>
    </VStack>
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

