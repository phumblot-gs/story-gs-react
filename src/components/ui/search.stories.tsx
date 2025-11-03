import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "./search";
import { Layout, VStack } from "@/components/layout";
import { useState } from "react";

const meta: Meta<typeof Search> = {
  title: "UI/Search",
  component: Search,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Composant Search avec icône de recherche. S'adapte automatiquement au background du Layout parent (white/grey/black) via BgContext.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {
  render: () => (
    <Layout bg="white" padding={4}>
      <Search placeholder="Rechercher..." className="w-[300px]" />
    </Layout>
  ),
};

export const WithValue: Story = {
  render: () => (
    <Layout bg="white" padding={4}>
      <Search defaultValue="Mon texte de recherche" className="w-[300px]" />
    </Layout>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Layout bg="white" padding={4}>
      <Search placeholder="Recherche désactivée" disabled className="w-[300px]" />
    </Layout>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <VStack gap={4} className="w-[400px]">
      <Layout bg="white" padding={4} className="w-full">
        <VStack gap={2} className="w-full">
          <p className="text-sm font-medium">Background: White</p>
          <Search placeholder="Rechercher sur fond blanc" />
        </VStack>
      </Layout>

      <Layout bg="grey" padding={4} className="w-full">
        <VStack gap={2} className="w-full">
          <p className="text-sm font-medium">Background: Grey</p>
          <Search placeholder="Rechercher sur fond gris" />
        </VStack>
      </Layout>

      <Layout bg="black" padding={4} className="w-full">
        <VStack gap={2} className="w-full">
          <p className="text-sm font-medium text-white">Background: Black</p>
          <Search placeholder="Rechercher sur fond noir" />
        </VStack>
      </Layout>
    </VStack>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");

    return (
      <Layout bg="white" padding={4}>
        <VStack gap={3} className="w-[400px]">
          <Search
            placeholder="Rechercher..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {value && (
            <div className="text-sm">
              Recherche: <strong>{value}</strong>
            </div>
          )}
        </VStack>
      </Layout>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <Layout bg="white" padding={4}>
      <VStack gap={3} className="w-full">
        <Search placeholder="Taille par défaut (w-full)" />
        <Search placeholder="Petite taille" className="w-[200px]" />
        <Search placeholder="Moyenne taille" className="w-[300px]" />
        <Search placeholder="Grande taille" className="w-[400px]" />
      </VStack>
    </Layout>
  ),
};
