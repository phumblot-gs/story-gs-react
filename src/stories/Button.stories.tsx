import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";
import { Layout, VStack, HStack } from "@/components/layout";
import { renderIcon } from "@/components/ui/icons";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Composant Button construit avec le design system Figma. Le Button hérite automatiquement du contexte de couleur via \`data-bg\` du Layout parent.

### Utilisation simple

\`\`\`tsx
import { Button, Layout } from '@story-gs-react';

<Layout bg="white">
  <Button variant="normal">
    Enregistrer
  </Button>
</Layout>
\`\`\`

### Avec icône

\`\`\`tsx
import { renderIcon } from '@story-gs-react';

<Button variant="secondary">
  {renderIcon("Plus")}
  Ajouter
</Button>
\`\`\`

### Avec indicator

\`\`\`tsx
<Button variant="normal" indicator>
  Notifications
</Button>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['normal', 'secondary', 'ghost', 'outline', 'destructive', 'link'],
      description: 'Variant du bouton (normal, secondary, ghost, outline, destructive, link)',
    },
    size: {
      control: 'select',
      options: ['small', 'large'],
      description: 'Taille du bouton (small = 5px padding, large = 5px padding)',
    },
    indicator: {
      control: 'boolean',
      description: 'Affiche une pastille jaune indicateur',
    },
    disabled: {
      control: 'boolean',
      description: 'Bouton désactivé',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <Button variant="normal">Enregistrer</Button>
    </Layout>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <VStack gap={6} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background White</h3>
        <HStack gap={3}>
          <Button variant="normal">Normal</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </HStack>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background Grey</h3>
        <HStack gap={3}>
          <Button variant="normal">Normal</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </HStack>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3 text-white">Background Black</h3>
        <HStack gap={3}>
          <Button variant="normal">Normal</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </HStack>
      </VStack>
    </VStack>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const WithIcon: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <HStack gap={3}>
        <Button variant="normal">
          {renderIcon("Plus")}
          Ajouter
        </Button>
        <Button variant="secondary">
          {renderIcon("Settings")}
          Paramètres
        </Button>
        <Button variant="ghost">
          {renderIcon("Trash")}
          Supprimer
        </Button>
      </HStack>
    </Layout>
  ),
};

export const WithIndicator: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <HStack gap={3}>
        <Button variant="normal" indicator>
          Normal
        </Button>
        <Button variant="secondary" indicator>
          Secondary
        </Button>
        <Button variant="ghost" indicator>
          Ghost
        </Button>
      </HStack>
    </Layout>
  ),
};

export const Small: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <HStack gap={3} align="center">
        <Button size="small">Small Button</Button>
        <Button size="small">
          {renderIcon("Plus")}
          Avec icon
        </Button>
      </HStack>
    </Layout>
  ),
};

export const Large: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <HStack gap={3} align="center">
        <Button size="large">Large Button</Button>
        <Button size="large">
          {renderIcon("Plus")}
          Avec icon
        </Button>
      </HStack>
    </Layout>
  ),
};

export const States: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <HStack gap={3}>
          <Button variant="normal">Default</Button>
          <Button variant="normal" className="hover">Hover (forcé)</Button>
          <Button variant="normal" disabled>Disabled</Button>
        </HStack>
        <HStack gap={3}>
          <Button variant="destructive">Default</Button>
          <Button variant="destructive" disabled>Disabled</Button>
        </HStack>
      </VStack>
    </Layout>
  ),
};

export const ShadcnCompatibility: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <p className="text-sm text-grey-stronger">Test de compatibilité shadcn (mapping automatique)</p>
        <HStack gap={3}>
          <Button variant="default">Default (→ normal)</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </HStack>
        <HStack gap={3}>
          <Button size="sm">Small (sm)</Button>
          <Button size="lg">Large (lg)</Button>
          <Button size="default">Default</Button>
        </HStack>
      </VStack>
    </Layout>
  ),
};
