// Exemple d'utilisation du FileBrowser avec navigation fonctionnelle et gestion du déplacement
import React, { useState, useEffect } from 'react';
import { FileBrowser, type FileItem } from './file-browser';
import { FolderBrowser } from './folder-browser';
import { ModalLayer } from './modal-layer';
import { Button } from './button';

// Simuler une API ou une source de données
async function fetchFiles(path: string): Promise<FileItem[]> {
  // Remplacez ceci par votre vraie logique de récupération de fichiers
  // Par exemple, un appel API :
  // const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
  // return response.json();

  // Pour l'exemple, on retourne des données mockées
  const mockData: Record<string, FileItem[]> = {
    '/': [
      {
        id: '1',
        file_name: 'Documents',
        parent_path: '/',
        file_size: 0,
        mime_type: null,
        is_directory: true,
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-20T14:45:00Z',
      },
      // ... autres fichiers
    ],
    '/Documents': [
      {
        id: '10',
        file_name: 'Contrats',
        parent_path: '/Documents',
        file_size: 0,
        mime_type: null,
        is_directory: true,
        created_at: '2024-01-10T09:15:00Z',
        updated_at: '2024-01-25T16:20:00Z',
      },
      // ... autres fichiers
    ],
  };

  return mockData[path] || [];
}

export function FileBrowserExample() {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  // State pour le FolderBrowser modal
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [itemsToMove, setItemsToMove] = useState<FileItem[]>([]);
  const [folderBrowserPath, setFolderBrowserPath] = useState<string>('/');

  // Charger les fichiers quand le chemin change
  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true);
      try {
        const newFiles = await fetchFiles(currentPath);
        setFiles(newFiles);
        console.log('[Example] Fichiers chargés pour', currentPath, ':', newFiles);
      } catch (error) {
        console.error('[Example] Erreur lors du chargement des fichiers:', error);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [currentPath]); // Se déclenche à chaque changement de currentPath

  // Handler pour la navigation - CRUCIAL pour que le double-clic fonctionne
  const handleNavigate = (newPath: string) => {
    console.log('[Example] Navigation de', currentPath, 'vers', newPath);
    setCurrentPath(newPath);
    // Les fichiers seront automatiquement rechargés grâce au useEffect
  };

  // Handler pour l'actualisation
  const handleRefresh = async () => {
    console.log('[Example] Actualisation des fichiers');
    const newFiles = await fetchFiles(currentPath);
    setFiles(newFiles);
  };

  // Autres handlers selon vos besoins
  const handleDelete = (items: FileItem[]) => {
    console.log('[Example] Suppression de:', items.map(i => i.file_name).join(', '));
    // Implémenter la suppression
    // Après suppression, actualiser la liste
    handleRefresh();
  };

  // Handler pour le déplacement - ouvre le modal FolderBrowser
  const handleMove = (items: FileItem[]) => {
    console.log('[Example] Déplacement de:', items.map(i => i.file_name).join(', '));
    setItemsToMove(items);
    setFolderBrowserPath(currentPath);
    setIsMoveModalOpen(true);
  };

  // Navigation dans le FolderBrowser
  const handleFolderBrowserNavigate = (path: string) => {
    setFolderBrowserPath(path);
  };

  // Sélection du dossier de destination
  const handleFolderSelect = async (folder: FileItem) => {
    console.log('[Example] Dossier de destination sélectionné:', folder);
    console.log('[Example] Déplacer les items:', itemsToMove.map(i => i.file_name).join(', '));

    // Implémenter l'API de déplacement ici
    // Par exemple: await moveFiles(itemsToMove.map(i => i.id), folder.id);

    // Fermer le modal
    setIsMoveModalOpen(false);
    setItemsToMove([]);

    // Actualiser la liste
    handleRefresh();
  };

  // Fermer le modal sans déplacer
  const handleCloseMoveModal = () => {
    setIsMoveModalOpen(false);
    setItemsToMove([]);
  };

  const handleRename = (items: FileItem[]) => {
    if (items.length !== 1) return;
    const newName = prompt('Nouveau nom:', items[0].file_name);
    if (newName) {
      console.log('[Example] Renommage de', items[0].file_name, 'en', newName);
      // Implémenter le renommage
      handleRefresh();
    }
  };

  if (loading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <h1 className="p-4 text-xl font-bold">Explorateur de fichiers</h1>

      <div className="flex-1">
        <FileBrowser
          files={files}
          currentPath={currentPath}
          labelRootFolder="Mon espace"
          showUploadButton={true}
          debug={true} // Activer pour voir les logs dans la console
          heightMode="fill-container" // Pour que le composant remplisse la hauteur disponible

          // IMPORTANT: Ces callbacks doivent être définis pour que les interactions fonctionnent
          onNavigate={handleNavigate} // ← Crucial pour la navigation par double-clic
          onRefresh={handleRefresh}
          onDelete={handleDelete}
          onMove={handleMove}
          onRename={handleRename}

          // Callbacks optionnels
          onUpload={() => console.log('[Example] Upload')}
          onCreateFolder={() => console.log('[Example] Créer dossier')}
          onImportFiles={() => console.log('[Example] Importer fichiers')}
          onImportFolders={() => console.log('[Example] Importer dossiers')}
          onDownload={(items) => console.log('[Example] Télécharger:', items)}
          onShare={(items) => console.log('[Example] Partager:', items)}
          onFileDrop={(event) => {
            const files = event.dataTransfer.files;
            const items = event.dataTransfer.items;
            console.log('[Example] Fichiers déposés:', Array.from(files).map(f => f.name));
            console.log('[Example] Items:', items);
            // Exemple de détection de dossiers
            const hasDirectories = Array.from(items).some(item => {
              const entry = item.webkitGetAsEntry();
              return entry?.isDirectory;
            });
            if (hasDirectories) {
              console.log('[Example] Des dossiers ont été déposés - vous pouvez les traiter via webkitGetAsEntry()');
            }
          }}
          onDateFilterChange={(filter) => console.log('[Example] Filtre date:', filter)}
          onSortChange={(config) => console.log('[Example] Tri:', config)}
          onSelectionChange={(items) => console.log('[Example] Sélection:', items)}
        />
      </div>

      {/* Modal pour le déplacement avec FolderBrowser */}
      <ModalLayer
        isOpen={isMoveModalOpen}
        onClose={handleCloseMoveModal}
        className="w-[800px] max-w-[90vw]"
        footer={
          <Button
            size="large"
            background="white"
            onClick={handleCloseMoveModal}
          >
            Annuler
          </Button>
        }
      >
        <div className="p-[30px]">
          <h2 className="text-lg font-semibold mb-4">
            Déplacer {itemsToMove.length} élément{itemsToMove.length > 1 ? 's' : ''}
          </h2>
          <FolderBrowser
            folders={files.filter(f => f.is_directory)}
            currentPath={folderBrowserPath}
            labelRootFolder="Mon espace"
            debug={true}
            onNavigate={handleFolderBrowserNavigate}
            onFolderSelect={handleFolderSelect}
          />
        </div>
      </ModalLayer>
    </div>
  );
}

// Points importants pour que la navigation fonctionne :
//
// 1. **onNavigate DOIT être défini** : C'est le callback appelé lors du double-clic
// 2. **currentPath DOIT être mis à jour** : Le composant doit recevoir le nouveau chemin
// 3. **files DOIT être mis à jour** : Les fichiers du nouveau dossier doivent être chargés
// 4. **Utilisez un état local** : currentPath et files doivent être dans le state du parent
// 5. **Debug activé** : Mettez debug={true} pour voir les logs dans la console