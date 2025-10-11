import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { FileBrowser, type FileItem } from "./file-browser";

const meta: Meta<typeof FileBrowser> = {
  title: "Components/FileBrowser",
  component: FileBrowser,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Un composant de navigation de fichiers avec breadcrumb, sélection multiple et actions contextuelles.",
      },
    },
  },
  argTypes: {
    currentPath: {
      control: "text",
      description: "Chemin actuel affiché dans le breadcrumb",
    },
    labelRootFolder: {
      control: "text",
      description: "Libellé affiché pour le dossier racine",
    },
    showUploadButton: {
      control: "boolean",
      description: "Affiche le bouton d'upload (+)",
    },
    debug: {
      control: "boolean",
      description: "Active le mode debug avec logs console",
    },
    onNavigate: { action: "navigate" },
    onRefresh: { action: "refresh" },
    onUpload: { action: "upload" },
    onCreateFolder: { action: "createFolder" },
    onImportFiles: { action: "importFiles" },
    onImportFolders: { action: "importFolders" },
    onFileDrop: { action: "fileDrop" },
    onRename: { action: "rename" },
    onMove: { action: "move" },
    onDownload: { action: "download" },
    onShare: { action: "share" },
    onDelete: { action: "delete" },
    onDateFilterChange: { action: "dateFilterChange" },
    onSortChange: { action: "sortChange" },
    onSelectionChange: { action: "selectionChange" },
    onLoadMore: { action: "loadMore" },
    totalFiles: {
      control: "number",
      description: "Nombre total de fichiers (null si inconnu)",
    },
    hasMore: {
      control: "boolean",
      description: "Indique s'il y a plus de fichiers à charger",
    },
    isLoadingMore: {
      control: "boolean",
      description: "Indique si un chargement est en cours",
    },
    maxFilesLimit: {
      control: "number",
      description: "Limite maximale de fichiers",
    },
  },
  args: {
    onNavigate: fn(),
    onRefresh: fn(),
    onUpload: fn(),
    onCreateFolder: fn(),
    onImportFiles: fn(),
    onImportFolders: fn(),
    onFileDrop: fn(),
    onRename: fn(),
    onMove: fn(),
    onDownload: fn(),
    onShare: fn(),
    onDelete: fn(),
    onDateFilterChange: fn(),
    onSortChange: fn(),
    onSelectionChange: fn(),
    onLoadMore: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof FileBrowser>;

// Données de test
const mockFiles: FileItem[] = [
  {
    id: "1",
    file_name: "Documents",
    parent_path: "/",
    file_size: 0,
    mime_type: null,
    is_directory: true,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-20T14:45:00Z",
  },
  {
    id: "2",
    file_name: "Images",
    parent_path: "/",
    file_size: 0,
    mime_type: null,
    is_directory: true,
    created_at: "2024-01-10T09:15:00Z",
    updated_at: "2024-01-25T16:20:00Z",
  },
  {
    id: "3",
    file_name: "rapport.pdf",
    parent_path: "/",
    file_size: 2048576,
    mime_type: "application/pdf",
    is_directory: false,
    created_at: "2024-01-18T11:22:00Z",
    updated_at: "2024-01-18T11:22:00Z",
  },
  {
    id: "4",
    file_name: "presentation.pptx",
    parent_path: "/",
    file_size: 5242880,
    mime_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    is_directory: false,
    created_at: "2024-01-12T13:45:00Z",
    updated_at: "2024-01-19T15:30:00Z",
  },
  {
    id: "5",
    file_name: "data.xlsx",
    parent_path: "/",
    file_size: 1048576,
    mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    is_directory: false,
    created_at: "2024-01-14T08:00:00Z",
    updated_at: "2024-01-22T10:15:00Z",
  },
];

const subFolderFiles: FileItem[] = [
  {
    id: "6",
    file_name: "vacation.jpg",
    parent_path: "/Images",
    file_size: 3145728,
    mime_type: "image/jpeg",
    is_directory: false,
    created_at: "2024-01-16T12:30:00Z",
    updated_at: "2024-01-16T12:30:00Z",
  },
  {
    id: "7",
    file_name: "screenshot.png",
    parent_path: "/Images",
    file_size: 524288,
    mime_type: "image/png",
    is_directory: false,
    created_at: "2024-01-20T14:15:00Z",
    updated_at: "2024-01-20T14:15:00Z",
  },
  {
    id: "8",
    file_name: "Archives",
    parent_path: "/Images",
    file_size: 0,
    mime_type: null,
    is_directory: true,
    created_at: "2024-01-05T16:00:00Z",
    updated_at: "2024-01-21T09:45:00Z",
  },
];

export const Default: Story = {
  args: {
    files: mockFiles,
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    debug: false,
  },
};

export const EmptyFolder: Story = {
  args: {
    files: [],
    currentPath: "/Vide",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    debug: false,
  },
};

export const SubFolder: Story = {
  args: {
    files: subFolderFiles,
    currentPath: "/Images",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    debug: false,
  },
};

export const DeepFolder: Story = {
  args: {
    files: [
      {
        id: "9",
        file_name: "old_photo.jpg",
        parent_path: "/Images/Archives",
        file_size: 1572864,
        mime_type: "image/jpeg",
        is_directory: false,
        created_at: "2023-12-01T10:00:00Z",
        updated_at: "2023-12-01T10:00:00Z",
      },
    ],
    currentPath: "/Images/Archives",
    labelRootFolder: "Mes fichiers",
    showUploadButton: false,
    debug: false,
  },
};

export const WithoutUploadButton: Story = {
  args: {
    files: mockFiles,
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: false,
    debug: false,
  },
};

export const CustomRootLabel: Story = {
  args: {
    files: mockFiles,
    currentPath: "/",
    labelRootFolder: "Mon espace",
    showUploadButton: true,
    debug: false,
  },
};

export const DebugMode: Story = {
  args: {
    files: mockFiles.slice(0, 3),
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    debug: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Mode debug activé - consultez la console pour voir les logs.",
      },
    },
  },
};

export const LargeFileList: Story = {
  args: {
    files: Array.from({ length: 20 }, (_, i) => ({
      id: `file-${i}`,
      file_name: `fichier-${i.toString().padStart(2, "0")}.txt`,
      parent_path: "/",
      file_size: Math.floor(Math.random() * 10000000),
      mime_type: "text/plain",
      is_directory: i % 5 === 0,
      created_at: new Date(2024, 0, i + 1).toISOString(),
      updated_at: new Date(2024, 0, i + 5).toISOString(),
    })),
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    debug: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Liste avec 20 fichiers pour tester les performances et la sélection multiple.",
      },
    },
  },
};

export const WithDragAndDrop: Story = {
  args: {
    files: mockFiles,
    currentPath: "/Documents/Projets",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    debug: false,
    onFileDrop: (files: FileList) => {
      console.log("Fichiers déposés:", Array.from(files).map(f => f.name));
      alert(`${files.length} fichier(s) déposé(s): ${Array.from(files).map(f => f.name).join(", ")}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Story pour tester le drag & drop. Déposez des fichiers depuis votre explorateur pour voir l'overlay et déclencher l'action onFileDrop.",
      },
    },
  },
};

// Structure simulée du système de fichiers
const fileSystem: Record<string, FileItem[]> = {
  "/": mockFiles,
  "/Documents": [
    {
      id: "10",
      file_name: "Contrats",
      parent_path: "/Documents",
      file_size: 0,
      mime_type: null,
      is_directory: true,
      created_at: "2024-01-10T09:15:00Z",
      updated_at: "2024-01-25T16:20:00Z",
    },
    {
      id: "11",
      file_name: "Factures",
      parent_path: "/Documents",
      file_size: 0,
      mime_type: null,
      is_directory: true,
      created_at: "2024-01-10T09:15:00Z",
      updated_at: "2024-01-25T16:20:00Z",
    },
    {
      id: "12",
      file_name: "contrat-2024.pdf",
      parent_path: "/Documents",
      file_size: 245760,
      mime_type: "application/pdf",
      is_directory: false,
      created_at: "2024-01-10T09:15:00Z",
      updated_at: "2024-01-25T16:20:00Z",
    },
  ],
  "/Images": subFolderFiles,
  "/Images/Archives": [
    {
      id: "13",
      file_name: "old_photo.jpg",
      parent_path: "/Images/Archives",
      file_size: 1572864,
      mime_type: "image/jpeg",
      is_directory: false,
      created_at: "2023-12-01T10:00:00Z",
      updated_at: "2023-12-01T10:00:00Z",
    },
    {
      id: "14",
      file_name: "vintage.png",
      parent_path: "/Images/Archives",
      file_size: 892864,
      mime_type: "image/png",
      is_directory: false,
      created_at: "2023-11-15T10:00:00Z",
      updated_at: "2023-11-15T10:00:00Z",
    },
  ],
};

export const InteractiveNavigation: Story = {
  render: (args) => {
    const [currentPath, setCurrentPath] = React.useState("/");
    const [files, setFiles] = React.useState(fileSystem["/"] || []);

    const handleNavigate = (newPath: string) => {
      console.log("[Story] Navigation vers:", newPath);
      setCurrentPath(newPath);
      // Simuler le chargement des fichiers du nouveau dossier
      const newFiles = fileSystem[newPath] || [];
      setFiles(newFiles);
      console.log("[Story] Nouveaux fichiers:", newFiles);
    };

    return (
      <FileBrowser
        {...args}
        files={files}
        currentPath={currentPath}
        onNavigate={handleNavigate}
        debug={true}
      />
    );
  },
  args: {
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    onRefresh: fn(),
    onUpload: fn(),
    onCreateFolder: fn(),
    onImportFiles: fn(),
    onImportFolders: fn(),
    onRename: fn(),
    onMove: fn(),
    onDownload: fn(),
    onShare: fn(),
    onDelete: fn(),
    onDateFilterChange: fn(),
    onSortChange: fn(),
    onSelectionChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "Navigation interactive avec double-clic sur les dossiers. Double-cliquez sur un dossier pour naviguer dedans et utilisez le breadcrumb pour remonter.",
      },
    },
  },
};

export const WithDisabledItems: Story = {
  args: {
    files: [
      ...mockFiles.slice(0, 2),
      {
        ...mockFiles[2],
        disabled: true,
      },
      mockFiles[3],
      {
        ...mockFiles[4],
        disabled: true,
      },
    ],
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    debug: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Certains items sont désactivés (disabled). Ils apparaissent en gris clair et ne sont pas cliquables. Les boutons d'action ne s'affichent pas au survol.",
      },
    },
  },
};

// Stories pour la pagination
export const PaginationWithKnownTotal: Story = {
  args: {
    files: Array.from({ length: 1000 }, (_, i) => ({
      id: `file-${i}`,
      file_name: `fichier-${i.toString().padStart(4, "0")}.txt`,
      parent_path: "/",
      file_size: Math.floor(Math.random() * 10000000),
      mime_type: "text/plain",
      is_directory: i % 10 === 0,
      created_at: new Date(2024, 0, i + 1).toISOString(),
      updated_at: new Date(2024, 0, i + 5).toISOString(),
    })),
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    totalFiles: 5432,
    hasMore: true,
    isLoadingMore: false,
    maxFilesLimit: 10000,
  },
  parameters: {
    docs: {
      description: {
        story: "Pagination avec total connu : 1000 fichiers chargés sur 5432 au total. Le compteur affiche '5432 fichiers' et un bouton 'Afficher les éléments suivants' est présent.",
      },
    },
  },
};

export const PaginationWithUnknownTotal: Story = {
  args: {
    files: Array.from({ length: 1000 }, (_, i) => ({
      id: `file-${i}`,
      file_name: `fichier-${i.toString().padStart(4, "0")}.txt`,
      parent_path: "/",
      file_size: Math.floor(Math.random() * 10000000),
      mime_type: "text/plain",
      is_directory: i % 10 === 0,
      created_at: new Date(2024, 0, i + 1).toISOString(),
      updated_at: new Date(2024, 0, i + 5).toISOString(),
    })),
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    totalFiles: null,
    hasMore: true,
    isLoadingMore: false,
    maxFilesLimit: 10000,
  },
  parameters: {
    docs: {
      description: {
        story: "Pagination avec total inconnu : 1000 fichiers chargés, total inconnu. Le compteur affiche '1 000 fichiers et plus...' et un bouton 'Afficher les éléments suivants' est présent.",
      },
    },
  },
};

export const PaginationLoading: Story = {
  args: {
    files: Array.from({ length: 847 }, (_, i) => ({
      id: `file-${i}`,
      file_name: `fichier-${i.toString().padStart(4, "0")}.txt`,
      parent_path: "/",
      file_size: Math.floor(Math.random() * 10000000),
      mime_type: "text/plain",
      is_directory: i % 10 === 0,
      created_at: new Date(2024, 0, i + 1).toISOString(),
      updated_at: new Date(2024, 0, i + 5).toISOString(),
    })),
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    totalFiles: null,
    hasMore: true,
    isLoadingMore: true,
    maxFilesLimit: 10000,
  },
  parameters: {
    docs: {
      description: {
        story: "Pagination en cours de chargement : 847 fichiers chargés, chargement en cours. Le bouton affiche 'Chargement...' avec un spinner.",
      },
    },
  },
};

export const PaginationLimitReached: Story = {
  args: {
    files: Array.from({ length: 10000 }, (_, i) => ({
      id: `file-${i}`,
      file_name: `fichier-${i.toString().padStart(5, "0")}.txt`,
      parent_path: "/",
      file_size: Math.floor(Math.random() * 10000000),
      mime_type: "text/plain",
      is_directory: i % 10 === 0,
      created_at: new Date(2024, 0, i + 1).toISOString(),
      updated_at: new Date(2024, 0, i + 5).toISOString(),
    })),
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    totalFiles: 15000,
    hasMore: true,
    isLoadingMore: false,
    maxFilesLimit: 10000,
  },
  parameters: {
    docs: {
      description: {
        story: "Limite atteinte : 10000 fichiers chargés (limite maximale). Le compteur affiche '10 000 fichiers (limite atteinte)' avec un bandeau d'avertissement, mais PAS de bouton 'Afficher les éléments suivants'.",
      },
    },
  },
};

export const PaginationComplete: Story = {
  args: {
    files: Array.from({ length: 543 }, (_, i) => ({
      id: `file-${i}`,
      file_name: `fichier-${i.toString().padStart(3, "0")}.txt`,
      parent_path: "/",
      file_size: Math.floor(Math.random() * 10000000),
      mime_type: "text/plain",
      is_directory: i % 10 === 0,
      created_at: new Date(2024, 0, i + 1).toISOString(),
      updated_at: new Date(2024, 0, i + 5).toISOString(),
    })),
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    totalFiles: 543,
    hasMore: false,
    isLoadingMore: false,
    maxFilesLimit: 10000,
  },
  parameters: {
    docs: {
      description: {
        story: "Pagination terminée : 543 fichiers chargés, tous les fichiers sont affichés. Le compteur affiche '543 fichiers' et aucun bouton 'Afficher les éléments suivants'.",
      },
    },
  },
};

export const InteractivePagination: Story = {
  render: (args) => {
    const BATCH_SIZE = 500;
    const TOTAL_FILES = 5432;

    const [files, setFiles] = React.useState<FileItem[]>(
      Array.from({ length: BATCH_SIZE }, (_, i) => ({
        id: `file-${i}`,
        file_name: `fichier-${i.toString().padStart(5, "0")}.txt`,
        parent_path: "/",
        file_size: Math.floor(Math.random() * 10000000),
        mime_type: "text/plain",
        is_directory: i % 10 === 0,
        created_at: new Date(2024, 0, i + 1).toISOString(),
        updated_at: new Date(2024, 0, i + 5).toISOString(),
      }))
    );
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);

    const handleLoadMore = () => {
      setIsLoadingMore(true);

      // Simuler un délai de chargement
      setTimeout(() => {
        const currentLength = files.length;
        const newFiles = Array.from({ length: BATCH_SIZE }, (_, i) => ({
          id: `file-${currentLength + i}`,
          file_name: `fichier-${(currentLength + i).toString().padStart(5, "0")}.txt`,
          parent_path: "/",
          file_size: Math.floor(Math.random() * 10000000),
          mime_type: "text/plain",
          is_directory: (currentLength + i) % 10 === 0,
          created_at: new Date(2024, 0, currentLength + i + 1).toISOString(),
          updated_at: new Date(2024, 0, currentLength + i + 5).toISOString(),
        }));

        setFiles([...files, ...newFiles]);
        setIsLoadingMore(false);
      }, 1500);
    };

    const hasMore = files.length < TOTAL_FILES;

    return (
      <FileBrowser
        {...args}
        files={files}
        totalFiles={TOTAL_FILES}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={handleLoadMore}
      />
    );
  },
  args: {
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    maxFilesLimit: 10000,
    onRefresh: fn(),
    onUpload: fn(),
    onCreateFolder: fn(),
    onImportFiles: fn(),
    onImportFolders: fn(),
    onRename: fn(),
    onMove: fn(),
    onDownload: fn(),
    onShare: fn(),
    onDelete: fn(),
    onDateFilterChange: fn(),
    onSortChange: fn(),
    onSelectionChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "Pagination interactive : Cliquez sur 'Afficher les éléments suivants' pour charger plus de fichiers par lots de 500. Le total est de 5432 fichiers.",
      },
    },
  },
};