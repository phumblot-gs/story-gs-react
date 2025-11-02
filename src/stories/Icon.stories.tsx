import type { Meta, StoryObj } from "@storybook/react";
import { Icon } from "@/components/ui/icons";
import { Layout, HStack, VStack } from "@/components/layout";
import { AVAILABLE_ICONS } from "@/components/ui/icons/constants";
import { IconName } from "@/components/ui/icons/types";

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
      options: AVAILABLE_ICONS,
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
    debug: {
      control: 'boolean',
      description: 'Mode debug : affiche un border rose et log les clics dans la console',
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
  render: () => {
    // Organiser les icônes par catégories selon icon-renderer.tsx
    const statusIcons: IconName[] = ["Check", "X", "Alert", "Status", "Urgent"];
    const actionIcons: IconName[] = ["Plus", "Pencil", "Sort", "Filter", "Eye", "Logout", "Refresh", "Search", "Flag", "Switch", "Scroll"];
    const itemIcons: IconName[] = ["Tag", "Bell", "Star", "Vedette", "Comment", "FolderOpened", "FolderMoved"];
    const navigationIcons: IconName[] = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"];
    const utilityIcons: IconName[] = ["Help", "Settings", "User"];
    const customIcons: IconName[] = ["ToastSuccessIcon", "ToastErrorIcon"];
    const lucideIcons: IconName[] = [
      "AlertTriangle", "Loader", "ChevronDown", "ChevronLeft", "ChevronRight", "ChevronUp",
      "Download", "File", "Folder", "Globe", "Grip", "Mail", "Menu", "Minus",
      "MoreHorizontal", "MoreVertical", "Move", "RotateCcw", "Share",
      "StarFilled", "Trash", "Upload", "Users"
    ];

    const renderIconGrid = (icons: IconName[], title: string) => (
      <div key={title}>
        <h4 className="text-sm font-medium mb-2">{title}</h4>
        <HStack gap={4} wrap className="items-center">
          {icons.map((iconName) => (
            <div key={iconName} className="flex flex-col items-center gap-1">
              <Icon name={iconName} />
              <span className="text-xs">{iconName}</span>
            </div>
          ))}
        </HStack>
      </div>
    );

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={6}>
          <div>
            <h3 className="gs-typo-h3 mb-2">Toutes les icônes disponibles</h3>
            <p className="text-sm text-grey-stronger">
              Liste complète des {AVAILABLE_ICONS.length} icônes avec leur nom. Taille par défaut : 12px
            </p>
          </div>

          <VStack gap={4}>
            {renderIconGrid(statusIcons, "Status")}
            {renderIconGrid(actionIcons, "Actions")}
            {renderIconGrid(itemIcons, "Items")}
            {renderIconGrid(navigationIcons, "Navigation")}
            {renderIconGrid(utilityIcons, "Utility")}
            {renderIconGrid(customIcons, "Custom")}
            {renderIconGrid(lucideIcons, "Lucide Icons")}
          </VStack>
        </VStack>
      </Layout>
    );
  },
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

export const DebugMode: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <h3 className="gs-typo-h3">Mode Debug</h3>
        <p className="text-sm text-grey-stronger">
          Le mode debug affiche un border rose et log les clics dans la console
        </p>
        <HStack gap={3}>
          <Icon
            name="Plus"
            size={16}
            debug
            onClick={() => console.log('Plus clicked')}
          />
          <Icon
            name="Settings"
            size={16}
            debug
            onClick={() => console.log('Settings clicked')}
          />
          <Icon
            name="Trash"
            size={16}
            debug
            onClick={() => console.log('Trash clicked')}
          />
        </HStack>
      </VStack>
    </Layout>
  ),
};
