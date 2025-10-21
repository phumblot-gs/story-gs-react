import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "@/components/ui/icons";
import { Layout, HStack, VStack } from "@/components/layout";

const meta = {
  title: "UI/Icon",
  component: Icon,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Composant Icon réutilisable pour afficher toutes les icônes du système.

### Utilisation simple

\`\`\`tsx
import { Icon } from '@story-gs-react';

<Icon name="Plus" />
\`\`\`

### Avec taille personnalisée

\`\`\`tsx
<Icon name="Settings" size={16} />
\`\`\`

### Avec couleur

\`\`\`tsx
<Icon name="Trash" className="text-red-500" />
\`\`\`

### Dans un Button

\`\`\`tsx
<Button>
  <Icon name="Plus" size={12} />
  Ajouter
</Button>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: ['Plus', 'Settings', 'Trash', 'Pencil', 'X', 'Bell', 'Mail', 'Star', 'Check', 'Alert'],
      description: 'Nom de l\'icône à afficher',
    },
    size: {
      control: { type: 'number', min: 8, max: 48, step: 2 },
      description: 'Taille de l\'icône en pixels',
    },
    className: {
      control: 'text',
      description: 'Classes CSS Tailwind additionnelles',
    },
    color: {
      control: 'color',
      description: 'Couleur de l\'icône (utilise currentColor par défaut)',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Plus',
    size: 12,
  },
  render: (args) => (
    <Layout bg="white" padding={6}>
      <Icon {...args} />
    </Layout>
  ),
};

export const AllIcons: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3 mb-2">Toutes les icônes disponibles</h3>
          <p className="text-sm text-grey-stronger">
            Liste complète des icônes avec leur nom. Taille par défaut : 12px
          </p>
        </div>

        <VStack gap={4}>
          <div>
            <h4 className="text-sm font-medium mb-2">Actions</h4>
            <HStack gap={4} wrap className="items-center">
              <div className="flex flex-col items-center gap-1">
                <Icon name="Plus" />
                <span className="text-xs">Plus</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Icon name="Pencil" />
                <span className="text-xs">Pencil</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Icon name="X" />
                <span className="text-xs">X</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Icon name="Trash" />
                <span className="text-xs">Trash</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Icon name="Settings" />
                <span className="text-xs">Settings</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Icon name="Refresh" />
                <span className="text-xs">Refresh</span>
              </div>
            </HStack>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Notifications</h4>
            <HStack gap={4} wrap className="items-center">
              <div className="flex flex-col items-center gap-1">
                <Icon name="Bell" />
                <span className="text-xs">Bell</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Icon name="Mail" />
                <span className="text-xs">Mail</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Icon name="Alert" />
                <span className="text-xs">Alert</span>
              </div>
            </HStack>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Status</h4>
            <HStack gap={4} wrap className="items-center">
              <div className="flex flex-col items-center gap-1">
                <Icon name="Check" />
                <span className="text-xs">Check</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Icon name="Star" />
                <span className="text-xs">Star</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Icon name="StarFilled" />
                <span className="text-xs">StarFilled</span>
              </div>
            </HStack>
          </div>
        </VStack>
      </VStack>
    </Layout>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <h3 className="gs-typo-h3">Différentes tailles</h3>
        <HStack gap={4} align="center">
          <div className="flex flex-col items-center gap-2">
            <Icon name="Settings" size={8} />
            <span className="text-xs">8px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="Settings" size={12} />
            <span className="text-xs">12px (défaut)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="Settings" size={16} />
            <span className="text-xs">16px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="Settings" size={24} />
            <span className="text-xs">24px</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="Settings" size={32} />
            <span className="text-xs">32px</span>
          </div>
        </HStack>
      </VStack>
    </Layout>
  ),
};

export const Colors: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <h3 className="gs-typo-h3">Différentes couleurs</h3>
        <HStack gap={4} align="center">
          <div className="flex flex-col items-center gap-2">
            <Icon name="Star" size={16} className="text-yellow" />
            <span className="text-xs">Yellow</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="Star" size={16} className="text-red-strong" />
            <span className="text-xs">Red</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="Star" size={16} className="text-blue-primary" />
            <span className="text-xs">Blue</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="Star" size={16} className="text-green" />
            <span className="text-xs">Green</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="Star" size={16} className="text-grey-strongest" />
            <span className="text-xs">Grey</span>
          </div>
        </HStack>
      </VStack>
    </Layout>
  ),
};

export const Clickable: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <h3 className="gs-typo-h3">Icônes cliquables</h3>
        <p className="text-sm text-grey-stronger">
          Les icônes peuvent être cliquables avec un handler onClick
        </p>
        <HStack gap={3}>
          <Icon
            name="Bell"
            size={16}
            onClick={() => alert('Notifications!')}
            className="cursor-pointer hover:text-blue-primary"
          />
          <Icon
            name="Star"
            size={16}
            onClick={() => alert('Favoris!')}
            className="cursor-pointer hover:text-yellow"
          />
          <Icon
            name="Settings"
            size={16}
            onClick={() => alert('Paramètres!')}
            className="cursor-pointer hover:text-grey-strongest"
          />
        </HStack>
      </VStack>
    </Layout>
  ),
};
