# FileBrowser

Le composant `FileBrowser` fournit une interface complète de navigation de fichiers avec support du tri, sélection multiple, et drag & drop.

## 📸 Aperçu

![FileBrowser Preview](../assets/file-browser-preview.png)

## 🚀 Utilisation de base

```tsx
import { FileBrowser } from '@gs/gs-components-library';
import type { FileItem } from '@gs/gs-components-library';

const files: FileItem[] = [
  {
    id: '1',
    file_name: 'Document.pdf',
    file_type: 'file',
    file_size: 1024000,
    modification_date: new Date('2025-09-29'),
    path: '/documents/Document.pdf'
  },
  {
    id: '2',
    file_name: 'Images',
    file_type: 'folder',
    file_size: null,
    modification_date: new Date('2025-09-28'),
    path: '/documents/Images'
  }
];

function MyApp() {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);

  return (
    <FileBrowser
      files={files}
      selectedFiles={selectedFiles}
      onFilesSelected={setSelectedFiles}
      onUpload={(files) => console.log('Fichiers uploadés:', files)}
    />
  );
}
```

## 🎛️ Props

### FileBrowserProps

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `files` | `FileItem[]` | `[]` | Liste des fichiers et dossiers à afficher |
| `selectedFiles` | `FileItem[]` | `[]` | Fichiers actuellement sélectionnés |
| `onFilesSelected` | `(files: FileItem[]) => void` | - | Callback appelé lors du changement de sélection |
| `onUpload` | `(files: FileList) => void` | - | Callback appelé lors de l'upload de fichiers |
| `allowDragDrop` | `boolean` | `true` | Active/désactive le drag & drop |
| `className` | `string` | - | Classes CSS supplémentaires |

### FileItem

```tsx
interface FileItem {
  id: string;
  file_name: string;
  file_type: 'file' | 'folder';
  file_size: number | null; // en bytes, null pour les dossiers
  modification_date: Date;
  path: string;
}
```

## ✨ Fonctionnalités

### 🗂️ Navigation par breadcrumb

- Affichage du chemin actuel
- Navigation jusqu'à 2 niveaux parent
- Boutons cliquables pour remonter dans l'arborescence

```tsx
// La navigation se base sur la prop `path` des FileItem
const currentPath = "/documents/projets/2025";
// Affichera: Accueil > projets > 2025
```

### 📊 Tri des colonnes

Colonnes triables :
- **NOM** - Tri alphabétique des noms de fichiers
- **DERNIÈRE MODIFICATION** - Tri chronologique
- **TAILLE** - Tri par taille de fichier

```tsx
// Le tri est géré automatiquement par le composant
// Cliquez sur les en-têtes pour changer le tri
```

### 🎯 Sélection multiple

- **Clic simple** : Sélection/désélection d'un élément
- **Shift + Clic** : Sélection en range
- **Ctrl/Cmd + Clic** : Sélection multiple non contiguë
- **Ctrl/Cmd + A** : Sélectionner tous les fichiers

```tsx
const handleSelection = (files: FileItem[]) => {
  console.log(`${files.length} fichier(s) sélectionné(s)`);
  // Traiter la sélection...
};
```

### 📥 Drag & Drop

- Glissez des fichiers depuis l'explorateur système
- Overlay visuel pendant le drag
- Message contextualisé avec le nom du dossier

```tsx
const handleUpload = (files: FileList) => {
  Array.from(files).forEach(file => {
    console.log(`Upload: ${file.name}, ${file.size} bytes`);
    // Traiter l'upload...
  });
};
```

### 🔧 Actions sur les fichiers

Actions disponibles au survol de chaque ligne :
- **Renommer** - Édition du nom de fichier
- **Déplacer** - Déplacement vers un autre dossier
- **Télécharger** - Téléchargement du fichier
- **Partager** - Partage avec lien
- **Supprimer** - Suppression du fichier

### 📋 Barre d'actions groupées

Quand des fichiers sont sélectionnés :
- Affichage du nombre de fichiers sélectionnés
- Actions de groupe (déplacer, supprimer, télécharger)
- Filtres par date (Aujourd'hui, Cette semaine, etc.)

## 🎨 Exemples avancés

### Avec gestion d'état complète

```tsx
import { useState, useCallback } from 'react';
import { FileBrowser } from '@gs/gs-components-library';
import type { FileItem } from '@gs/gs-components-library';

function AdvancedFileBrowser() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('/');

  const handleUpload = useCallback((uploadedFiles: FileList) => {
    Array.from(uploadedFiles).forEach(file => {
      const newFile: FileItem = {
        id: crypto.randomUUID(),
        file_name: file.name,
        file_type: 'file',
        file_size: file.size,
        modification_date: new Date(),
        path: currentPath + file.name
      };

      setFiles(prev => [...prev, newFile]);
    });

    // Notification de succès
    toast.success(`${uploadedFiles.length} fichier(s) uploadé(s)`);
  }, [currentPath]);

  const handleFileAction = useCallback((action: string, file: FileItem) => {
    switch (action) {
      case 'rename':
        // Logique de renommage
        break;
      case 'delete':
        setFiles(prev => prev.filter(f => f.id !== file.id));
        setSelectedFiles(prev => prev.filter(f => f.id !== file.id));
        break;
      case 'download':
        // Logique de téléchargement
        break;
    }
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <FileBrowser
          files={files}
          selectedFiles={selectedFiles}
          onFilesSelected={setSelectedFiles}
          onUpload={handleUpload}
          allowDragDrop
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="p-4 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">
            {selectedFiles.length} fichier(s) sélectionné(s)
          </p>
        </div>
      )}
    </div>
  );
}
```

### Intégration avec API

```tsx
import { useQuery, useMutation } from '@tanstack/react-query';

function ApiFileBrowser() {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);

  // Récupération des fichiers
  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: () => fetch('/api/files').then(res => res.json())
  });

  // Upload de fichiers
  const uploadMutation = useMutation({
    mutationFn: (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      return fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <FileBrowser
      files={files}
      selectedFiles={selectedFiles}
      onFilesSelected={setSelectedFiles}
      onUpload={(files) => uploadMutation.mutate(files)}
    />
  );
}
```

## 🎯 Bonnes pratiques

### Performance

- Utilisez la virtualisation pour de grandes listes de fichiers
- Mémorisez les callbacks avec `useCallback`
- Implementez la pagination côté serveur si nécessaire

```tsx
const handleFilesSelected = useCallback((files: FileItem[]) => {
  setSelectedFiles(files);
}, []);
```

### Gestion d'erreurs

```tsx
const handleUpload = useCallback((files: FileList) => {
  try {
    // Validation des fichiers
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/', 'application/pdf', 'text/'];

    Array.from(files).forEach(file => {
      if (file.size > maxSize) {
        throw new Error(`Fichier trop volumineux: ${file.name}`);
      }

      const isAllowed = allowedTypes.some(type =>
        file.type.startsWith(type)
      );

      if (!isAllowed) {
        throw new Error(`Type de fichier non autorisé: ${file.name}`);
      }
    });

    // Procéder à l'upload
    uploadFiles(files);

  } catch (error) {
    toast.error(error.message);
  }
}, []);
```

### Accessibilité

- Le composant gère automatiquement les attributs ARIA
- Navigation au clavier supportée
- Support des lecteurs d'écran

## 🔗 Voir aussi

- [Button](./button.md) - Utilisé dans les actions de fichiers
- [Select](./select.md) - Utilisé dans les filtres
- [Guide de développement](../development-guide.md)