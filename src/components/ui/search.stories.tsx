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
        component:
          "Composant Search avec icône de recherche. S'adapte automatiquement au background du Layout parent (white/grey/black) via BgContext. Optionnel : le champ peut s'élargir avec le contenu (growWithContent) avec minWidth/maxWidth.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    growWithContent: {
      control: "boolean",
      description:
        "Si true, le champ s'élargit automatiquement selon le texte saisi (largeur = ligne la plus longue en textarea). Défaut: false.",
    },
    minWidth: {
      control: "text",
      description: "Largeur minimale (ex: 120, \"8rem\"). Utilisée au démarrage et pour borner la croissance.",
    },
    maxWidth: {
      control: "text",
      description: "Largeur maximale (ex: 400, \"100%\"). Le champ ne dépasse pas cette largeur quand growWithContent est true.",
    },
    maxRows: {
      control: { type: "number", min: 1, max: 20 },
      description: "Nombre maximum de lignes affichées en mode textarea (après collage avec retours à la ligne). Défaut: 10.",
    },
  },
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

export const GrowWithContent: Story = {
  args: {
    growWithContent: true,
    minWidth: 120,
    maxWidth: 400,
    placeholder: "Tapez pour voir le champ s'élargir...",
  },
  render: (args) => (
    <Layout bg="white" padding={4}>
      <VStack gap={4} className="w-full max-w-md">
        <p className="text-sm text-grey-stronger">
          Le champ démarre à la largeur min (120px) et s'agrandit avec le texte, sans dépasser 400px.
        </p>
        <Search {...args} />
        <Search
          growWithContent
          minWidth={80}
          maxWidth="100%"
          placeholder="min 80px, max 100%"
        />
      </VStack>
    </Layout>
  ),
};

export const GrowWithContentControlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Layout bg="white" padding={4}>
        <VStack gap={3} className="w-full max-w-md">
          <Search
            growWithContent
            minWidth={120}
            maxWidth={360}
            placeholder="Rechercher..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {value && (
            <p className="text-xs text-grey-stronger">
              Longueur: {value.length} caractères · Ligne la plus longue:{" "}
              {Math.max(...value.split(/\r\n|\r|\n/).map((l) => l.length))} caractères
            </p>
          )}
        </VStack>
      </Layout>
    );
  },
};
