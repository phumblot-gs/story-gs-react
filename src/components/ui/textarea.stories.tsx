import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";
import { Layout, VStack } from "@/components/layout";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here.",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "This is a textarea with some content.",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled textarea",
    disabled: true,
  },
};

export const AllBackgrounds: Story = {
  render: () => (
    <VStack gap={4} className="w-[400px]">
      <Layout bg="white" padding={4} className="w-full">
        <VStack gap={2} className="w-full">
          <p className="text-sm font-medium">Background: White</p>
          <Textarea placeholder="Textarea sur fond blanc" />
        </VStack>
      </Layout>

      <Layout bg="grey" padding={4} className="w-full">
        <VStack gap={2} className="w-full">
          <p className="text-sm font-medium">Background: Grey</p>
          <Textarea placeholder="Textarea sur fond gris" />
        </VStack>
      </Layout>

      <Layout bg="black" padding={4} className="w-full">
        <VStack gap={2} className="w-full">
          <p className="text-sm font-medium text-white">Background: Black</p>
          <Textarea placeholder="Textarea sur fond noir" />
        </VStack>
      </Layout>
    </VStack>
  ),
};
