import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Layout, VStack } from "@/components/layout";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Composant Input qui s'adapte automatiquement au background du Layout parent (white/grey/black) via BgContext.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => (
    <Layout bg="white" padding={4}>
      <Input placeholder="Tapez quelque chose..." className="w-[300px]" />
    </Layout>
  ),
};

export const WithValue: Story = {
  render: () => (
    <Layout bg="white" padding={4}>
      <Input value="Texte pré-rempli" className="w-[300px]" />
    </Layout>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Layout bg="white" padding={4}>
      <Input placeholder="Input désactivé" disabled className="w-[300px]" />
    </Layout>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <VStack gap={4} className="w-[400px]">
      <Layout bg="white" padding={4} className="w-full">
        <VStack gap={2} className="w-full">
          <p className="text-sm font-medium">Background: White</p>
          <Input placeholder="Input sur fond blanc" />
        </VStack>
      </Layout>

      <Layout bg="grey" padding={4} className="w-full">
        <VStack gap={2} className="w-full">
          <p className="text-sm font-medium">Background: Grey</p>
          <Input placeholder="Input sur fond gris" />
        </VStack>
      </Layout>

      <Layout bg="black" padding={4} className="w-full">
        <VStack gap={2} className="w-full">
          <p className="text-sm font-medium text-white">Background: Black</p>
          <Input placeholder="Input sur fond noir" />
        </VStack>
      </Layout>
    </VStack>
  ),
};

export const Types: Story = {
  render: () => (
    <Layout bg="white" padding={4}>
      <VStack gap={3} className="w-[400px]">
        <Input type="text" placeholder="Type: text" />
        <Input type="email" placeholder="Type: email" />
        <Input type="password" placeholder="Type: password" />
        <Input type="number" placeholder="Type: number" />
        <Input type="search" placeholder="Type: search" />
        <Input type="tel" placeholder="Type: tel" />
        <Input type="url" placeholder="Type: url" />
      </VStack>
    </Layout>
  ),
};
