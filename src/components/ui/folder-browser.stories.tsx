import type { Meta, StoryObj } from "@storybook/react";
import { FolderBrowser, FolderItem } from "./folder-browser";

const meta: Meta<typeof FolderBrowser> = {
  title: "Components/FolderBrowser",
  component: FolderBrowser,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Composant de navigation dans les dossiers. Version simplifiée de FileBrowser qui affiche uniquement les dossiers avec un bouton de sélection.",
      },
    },
  },
  argTypes: {
    currentPath: {
      control: "text",
      description: "Chemin du dossier actuel",
    },
    labelRootFolder: {
      control: "text",
      description: "Libellé du dossier racine",
    },
    debug: {
      control: "boolean",
      description: "Mode debug pour afficher les logs",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FolderBrowser>;

// Mock data
const mockFolders: FolderItem[] = [
  {
    id: "1",
    file_name: "CLAUDIE PIERLOT",
    parent_path: "/clients",
    file_size: 0,
    mime_type: null,
    is_directory: true,
    created_at: "2024-10-01T10:00:00Z",
    updated_at: "2024-10-03T10:00:00Z",
  },
  {
    id: "2",
    file_name: "CONFORAMA",
    parent_path: "/clients",
    file_size: 0,
    mime_type: null,
    is_directory: true,
    created_at: "2024-10-01T10:00:00Z",
    updated_at: "2024-10-03T10:00:00Z",
  },
  {
    id: "3",
    file_name: "COURRÈGES",
    parent_path: "/clients",
    file_size: 0,
    mime_type: null,
    is_directory: true,
    created_at: "2024-10-01T10:00:00Z",
    updated_at: "2024-10-03T10:00:00Z",
  },
  {
    id: "4",
    file_name: "CULTURA",
    parent_path: "/clients",
    file_size: 0,
    mime_type: null,
    is_directory: true,
    created_at: "2024-10-01T10:00:00Z",
    updated_at: "2024-10-03T10:00:00Z",
  },
  {
    id: "5",
    file_name: "DAIMLER",
    parent_path: "/clients",
    file_size: 0,
    mime_type: null,
    is_directory: true,
    created_at: "2024-10-01T10:00:00Z",
    updated_at: "2024-10-03T10:00:00Z",
  },
];

export const Default: Story = {
  args: {
    folders: mockFolders,
    currentPath: "/clients",
    labelRootFolder: "Mes fichiers",
    debug: false,
  },
  render: (args) => (
    <div className="w-[600px]">
      <FolderBrowser {...args} />
    </div>
  ),
};

export const AtRoot: Story = {
  args: {
    folders: mockFolders,
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    debug: false,
  },
  render: (args) => (
    <div className="w-[600px]">
      <FolderBrowser {...args} />
    </div>
  ),
};

export const EmptyFolder: Story = {
  args: {
    folders: [],
    currentPath: "/empty",
    labelRootFolder: "Mes fichiers",
    debug: false,
  },
  render: (args) => (
    <div className="w-[600px]">
      <FolderBrowser {...args} />
    </div>
  ),
};

export const DeepPath: Story = {
  args: {
    folders: mockFolders,
    currentPath: "/clients/conforama/projets/2024",
    labelRootFolder: "Mes fichiers",
    debug: false,
  },
  render: (args) => (
    <div className="w-[600px]">
      <FolderBrowser {...args} />
    </div>
  ),
};

export const WithCallbacks: Story = {
  args: {
    folders: mockFolders,
    currentPath: "/clients",
    labelRootFolder: "Mes fichiers",
    debug: true,
    onNavigate: (path: string) => {
      console.log("Navigate to:", path);
      alert(`Navigation vers: ${path}`);
    },
    onFolderSelect: (folder: FolderItem) => {
      console.log("Folder selected:", folder);
      alert(`Dossier sélectionné: ${folder.file_name}`);
    },
  },
  render: (args) => (
    <div className="w-[600px]">
      <FolderBrowser {...args} />
    </div>
  ),
};

export const InModal: Story = {
  render: () => {
    return (
      <div className="bg-white rounded-lg shadow-lg w-[800px] max-w-[90vw]">
        <div className="p-[30px]">
          <FolderBrowser
            folders={mockFolders}
            currentPath="/clients"
            labelRootFolder="Mes fichiers"
            debug={false}
            onNavigate={(path) => console.log("Navigate to:", path)}
            onFolderSelect={(folder) =>
              console.log("Folder selected:", folder)
            }
          />
        </div>
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50">
            Annuler
          </button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Exemple d'utilisation dans un contexte modal.",
      },
    },
  },
};
