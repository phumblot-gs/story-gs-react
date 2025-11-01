"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IconProvider } from "@/components/ui/icon-provider";
import { IconName } from "@/components/ui/icons/types";

// Types basés sur le schéma BDD
export interface FileItem {
  id: string;
  file_name: string;
  parent_path: string | null;
  file_size: number;
  mime_type: string | null;
  is_directory: boolean;
  created_at: string;
  updated_at: string;
}

export interface FileBrowserProps {
  files: FileItem[];
  currentPath: string;
  labelRootFolder?: string;
  showUploadButton?: boolean;
  debug?: boolean;
  className?: string;
  onNavigate?: (path: string) => void;
  onRefresh?: () => void;
  onUpload?: () => void;
  onRename?: (items: FileItem[]) => void;
  onMove?: (items: FileItem[]) => void;
  onDownload?: (items: FileItem[]) => void;
  onShare?: (items: FileItem[]) => void;
  onDelete?: (items: FileItem[]) => void;
}

interface PathSegment {
  name: string;
  path: string;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({
  files = [],
  currentPath = "/",
  labelRootFolder = "Mes fichiers",
  showUploadButton = false,
  debug = false,
  className,
  onNavigate,
  onRefresh,
  onUpload,
  onRename,
  onMove,
  onDownload,
  onShare,
  onDelete,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // Parse le chemin actuel pour créer les segments de navigation
  const getPathSegments = useCallback((): PathSegment[] => {
    if (currentPath === "/" || currentPath === "") {
      return [{ name: labelRootFolder, path: "/" }];
    }

    const parts = currentPath.split("/").filter(Boolean);
    const segments: PathSegment[] = [{ name: labelRootFolder, path: "/" }];

    let buildPath = "";
    parts.forEach((part) => {
      buildPath += `/${part}`;
      segments.push({ name: part, path: buildPath });
    });

    return segments;
  }, [currentPath, labelRootFolder]);

  const pathSegments = getPathSegments();

  // Détermine l'icône de dossier appropriée selon le contexte
  const getFolderIcon = (item: FileItem): IconName => {
    if (!item.is_directory) return "File";

    // Si le dossier est sélectionné, utiliser FolderMoved pour indiquer qu'il peut être déplacé
    if (selectedItems.has(item.id)) return "FolderMoved";

    // Utiliser Folder standard pour tous les dossiers par défaut
    return "Folder";
  };

  // Formate la taille des fichiers
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Formate la date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Gestion de la sélection
  const handleItemSelect = useCallback((item: FileItem, index: number, shiftKey: boolean, ctrlKey: boolean) => {
    setSelectedItems(prev => {
      const newSelection = new Set(prev);

      if (shiftKey && lastSelectedIndex !== null) {
        // Sélection en plage avec Shift
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);

        for (let i = start; i <= end; i++) {
          if (files[i]) {
            newSelection.add(files[i].id);
          }
        }
      } else if (ctrlKey) {
        // Toggle avec Ctrl
        if (newSelection.has(item.id)) {
          newSelection.delete(item.id);
        } else {
          newSelection.add(item.id);
        }
      } else {
        // Sélection simple
        newSelection.clear();
        newSelection.add(item.id);
      }

      return newSelection;
    });

    if (!shiftKey) {
      setLastSelectedIndex(index);
    }
  }, [files, lastSelectedIndex]);

  // Raccourci Ctrl+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "a" && !e.target ||
          (e.target as HTMLElement)?.tagName !== "INPUT") {
        e.preventDefault();
        setSelectedItems(new Set(files.map(f => f.id)));
      }
    };

    if (tableRef.current) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [files]);

  // Actions sur un item
  const handleAction = (action: string, items: FileItem[]) => {
    switch (action) {
      case "rename":
        onRename?.(items);
        break;
      case "move":
        onMove?.(items);
        break;
      case "download":
        onDownload?.(items);
        break;
      case "share":
        onShare?.(items);
        break;
      case "delete":
        onDelete?.(items);
        break;
    }
  };

  const getSelectedItems = () => files.filter(f => selectedItems.has(f.id));
  const hasSelection = selectedItems.size > 0;

  if (debug) {
    console.log("FileBrowser Debug:", {
      files,
      currentPath,
      selectedItems: Array.from(selectedItems),
      pathSegments,
    });
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Breadcrumb et actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Navigation breadcrumb */}
          {pathSegments.length === 1 ? (
            // Racine uniquement
            <span className="text-sm font-medium text-gray-900">
              {pathSegments[0].name}
            </span>
          ) : pathSegments.length === 2 ? (
            // Parent + Courant
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.(pathSegments[0].path)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {pathSegments[0].name}
              </Button>
              <span className="text-gray-400">/</span>
              <span className="text-sm font-medium text-gray-900">
                {pathSegments[pathSegments.length - 1].name}
              </span>
            </>
          ) : (
            // Grand-parent + Parent + Courant
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.(pathSegments[pathSegments.length - 3]?.path || "/")}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                <IconProvider icon="MoreHorizontal" size={16} />
              </Button>
              <span className="text-gray-400">/</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate?.(pathSegments[pathSegments.length - 2].path)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {pathSegments[pathSegments.length - 2].name}
              </Button>
              <span className="text-gray-400">/</span>
              <span className="text-sm font-medium text-gray-900">
                {pathSegments[pathSegments.length - 1].name}
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="text-gray-600 hover:text-gray-900"
          >
            <IconProvider icon="Refresh" size={16} />
          </Button>
          {showUploadButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onUpload}
              className="text-gray-600 hover:text-gray-900"
            >
              <IconProvider icon="Plus" size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Barre d'outils contextuelle */}
      {hasSelection && (
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border">
          <span className="text-sm text-gray-600">
            {selectedItems.size} élément{selectedItems.size > 1 ? "s" : ""} sélectionné{selectedItems.size > 1 ? "s" : ""}
          </span>
          <div className="flex space-x-1 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("rename", getSelectedItems())}
            >
              <IconProvider icon="Pencil" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("move", getSelectedItems())}
            >
              <IconProvider icon="Move" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("download", getSelectedItems())}
            >
              <IconProvider icon="Download" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("share", getSelectedItems())}
            >
              <IconProvider icon="Share" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleAction("delete", getSelectedItems())}
            >
              <IconProvider icon="Trash" size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="border rounded-lg overflow-hidden" ref={tableRef}>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière modification
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taille
              </th>
              <th className="w-40"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((item, index) => {
              const isSelected = selectedItems.has(item.id);
              const isHovered = hoveredRow === item.id;

              return (
                <tr
                  key={item.id}
                  className={cn(
                    "hover:bg-gray-50 cursor-pointer transition-colors",
                    isSelected && "bg-blue-50 hover:bg-blue-100"
                  )}
                  onClick={(e) => handleItemSelect(item, index, e.shiftKey, e.ctrlKey || e.metaKey)}
                  onMouseEnter={() => setHoveredRow(item.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <IconProvider
                        icon={getFolderIcon(item)}
                        size={16}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {item.file_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(item.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {item.is_directory ? "-" : formatFileSize(item.file_size)}
                  </td>
                  <td className="px-4 py-3">
                    {isHovered && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction("rename", [item]);
                          }}
                        >
                          <IconProvider icon="Pencil" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction("move", [item]);
                          }}
                        >
                          <IconProvider icon="Move" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction("download", [item]);
                          }}
                        >
                          <IconProvider icon="Download" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction("share", [item]);
                          }}
                        >
                          <IconProvider icon="Share" size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction("delete", [item]);
                          }}
                        >
                          <IconProvider icon="Trash" size={14} />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun fichier dans ce dossier
        </div>
      )}
    </div>
  );
};

export default FileBrowser;