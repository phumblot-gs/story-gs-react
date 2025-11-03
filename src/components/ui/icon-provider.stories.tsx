import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconProvider } from "./icon-provider";
import { AVAILABLE_ICONS } from "./icons/constants";

const meta: Meta<typeof IconProvider> = {
  title: "Context/IconProvider",
  component: IconProvider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Composant pour afficher les icônes personnalisées et Lucide React avec un style uniforme.",
      },
    },
  },
  argTypes: {
    icon: {
      control: { type: "select" },
      options: AVAILABLE_ICONS,
      description: "Nom de l'icône à afficher",
    },
    size: {
      control: { type: "number", min: 8, max: 48, step: 2 },
      description: "Taille de l'icône en pixels",
    },
    className: {
      control: "text",
      description: "Classes CSS supplémentaires",
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconProvider>;

export const Default: Story = {
  args: {
    icon: "Check",
    size: 16,
  },
};

export const CustomIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 p-4">
      <div className="text-center">
        <IconProvider icon="Check" size={24} />
        <p className="text-xs mt-1">Check</p>
      </div>
      <div className="text-center">
        <IconProvider icon="X" size={24} />
        <p className="text-xs mt-1">X</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Alert" size={24} />
        <p className="text-xs mt-1">Alert</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Plus" size={24} />
        <p className="text-xs mt-1">Plus</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Pencil" size={24} />
        <p className="text-xs mt-1">Pencil</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Refresh" size={24} />
        <p className="text-xs mt-1">Refresh</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Galerie des icônes personnalisées disponibles.",
      },
    },
  },
};

export const FolderIcons: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-6 p-4">
      <div className="text-center">
        <IconProvider icon="Folder" size={32} />
        <p className="text-sm mt-2 font-medium">Folder</p>
        <p className="text-xs text-gray-500">Dossier standard (Lucide)</p>
      </div>
      <div className="text-center">
        <IconProvider icon="FolderOpened" size={32} />
        <p className="text-sm mt-2 font-medium">FolderOpened</p>
        <p className="text-xs text-gray-500">Dossier ouvert (Custom)</p>
      </div>
      <div className="text-center">
        <IconProvider icon="FolderMoved" size={32} />
        <p className="text-sm mt-2 font-medium">FolderMoved</p>
        <p className="text-xs text-gray-500">Dossier à déplacer (Custom)</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comparaison des différentes icônes de dossier disponibles.",
      },
    },
  },
};

export const LucideIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4 p-4">
      <div className="text-center">
        <IconProvider icon="Download" size={24} />
        <p className="text-xs mt-1">Download</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Share" size={24} />
        <p className="text-xs mt-1">Share</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Trash" size={24} />
        <p className="text-xs mt-1">Trash</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Move" size={24} />
        <p className="text-xs mt-1">Move</p>
      </div>
      <div className="text-center">
        <IconProvider icon="File" size={24} />
        <p className="text-xs mt-1">File</p>
      </div>
      <div className="text-center">
        <IconProvider icon="MoreHorizontal" size={24} />
        <p className="text-xs mt-1">MoreHorizontal</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Exemples d'icônes Lucide React utilisées dans le FileBrowser.",
      },
    },
  },
};

export const AllAvailableIcons: Story = {
  render: () => (
    <div className="grid grid-cols-8 gap-3 p-4 max-w-4xl">
      {AVAILABLE_ICONS.map((iconName) => (
        <div key={iconName} className="text-center">
          <div className="border rounded p-2 hover:bg-gray-50">
            <IconProvider icon={iconName} size={20} />
          </div>
          <p className="text-xs mt-1 truncate" title={iconName}>
            {iconName}
          </p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Toutes les icônes disponibles dans le système IconProvider.",
      },
    },
  },
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-4">
      <div className="text-center">
        <IconProvider icon="Star" size={12} />
        <p className="text-xs mt-1">12px</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Star" size={16} />
        <p className="text-xs mt-1">16px</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Star" size={20} />
        <p className="text-xs mt-1">20px</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Star" size={24} />
        <p className="text-xs mt-1">24px</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Star" size={32} />
        <p className="text-xs mt-1">32px</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Différentes tailles d'icônes disponibles.",
      },
    },
  },
};

export const WithColors: Story = {
  render: () => (
    <div className="flex items-center gap-6 p-4">
      <div className="text-center">
        <IconProvider icon="Check" size={24} className="text-green-500" />
        <p className="text-xs mt-1">Success</p>
      </div>
      <div className="text-center">
        <IconProvider icon="X" size={24} className="text-red-500" />
        <p className="text-xs mt-1">Error</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Alert" size={24} className="text-yellow-500" />
        <p className="text-xs mt-1">Warning</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Bell" size={24} className="text-blue-500" />
        <p className="text-xs mt-1">Info</p>
      </div>
      <div className="text-center">
        <IconProvider icon="Help" size={24} className="text-gray-500" />
        <p className="text-xs mt-1">Help</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Icônes avec différentes couleurs pour indiquer des états.",
      },
    },
  },
};