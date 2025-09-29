"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonCircle } from "@/components/ui/button-circle";
import { IconProvider } from "@/components/ui/icon-provider";
import { IconName } from "@/components/ui/icons/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  initialSort?: SortConfig;
  onNavigate?: (path: string) => void;
  onRefresh?: () => void;
  onUpload?: () => void;
  onFileDrop?: (files: FileList) => void;
  onRename?: (items: FileItem[]) => void;
  onMove?: (items: FileItem[]) => void;
  onDownload?: (items: FileItem[]) => void;
  onShare?: (items: FileItem[]) => void;
  onDelete?: (items: FileItem[]) => void;
  onDateFilterChange?: (filter: string) => void;
  onSortChange?: (sortConfig: SortConfig) => void;
}

export type DateFilter = "all" | "today" | "7days" | "30days" | "thisYear" | "lastYear" | "beforeLastYear";

export type SortField = "file_name" | "updated_at" | "file_size";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
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
  initialSort = { field: "file_name", direction: "asc" },
  onNavigate,
  onRefresh,
  onUpload,
  onFileDrop,
  onRename,
  onMove,
  onDownload,
  onShare,
  onDelete,
  onDateFilterChange,
  onSortChange,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);

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

    // Utiliser Folder standard pour tous les dossiers
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


  // Gestion du filtre de date
  const handleDateFilterChange = (value: string) => {
    setDateFilter(value as DateFilter);
    onDateFilterChange?.(value);
  };

  // Trier les fichiers selon la configuration actuelle
  const sortedFiles = useMemo(() => {
    const sorted = [...files].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.field) {
        case "file_name":
          aValue = a.file_name.toLowerCase();
          bValue = b.file_name.toLowerCase();
          break;
        case "updated_at":
          aValue = new Date(a.updated_at).getTime();
          bValue = new Date(b.updated_at).getTime();
          break;
        case "file_size":
          aValue = a.file_size;
          bValue = b.file_size;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [files, sortConfig]);

  // Gestion du tri
  const handleSort = (field: SortField) => {
    const newDirection: SortDirection =
      sortConfig.field === field && sortConfig.direction === "asc" ? "desc" : "asc";

    const newSortConfig = { field, direction: newDirection };
    setSortConfig(newSortConfig);
    onSortChange?.(newSortConfig);
  };

  // Obtenir l'icône de tri pour une colonne
  const getSortIcon = (field: SortField): IconName | null => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === "asc" ? "ArrowUp" : "ArrowDown";
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
          if (sortedFiles[i]) {
            newSelection.add(sortedFiles[i].id);
          }
        }
      } else if (ctrlKey) {
        // Ctrl+Clic : Toggle l'élément dans la sélection (garde le reste)
        if (newSelection.has(item.id)) {
          newSelection.delete(item.id);
        } else {
          newSelection.add(item.id);
        }
      } else {
        // Clic simple : Toggle l'élément (vide la sélection puis toggle)
        if (newSelection.has(item.id) && newSelection.size === 1) {
          // Si c'est le seul élément sélectionné, le désélectionner
          newSelection.clear();
        } else {
          // Sinon, sélectionner uniquement cet élément
          newSelection.clear();
          newSelection.add(item.id);
        }
      }

      return newSelection;
    });

    if (!shiftKey) {
      setLastSelectedIndex(index);
    }
  }, [sortedFiles, lastSelectedIndex]);

  // Raccourci Cmd+A (macOS) et Ctrl+A (Windows/Linux)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isSelectAll = (e.metaKey || e.ctrlKey) && e.key === "a";

      if (isSelectAll && (!e.target ||
          (e.target as HTMLElement)?.tagName !== "INPUT")) {
        e.preventDefault();
        setSelectedItems(new Set(sortedFiles.map(f => f.id)));
      }
    };

    if (tableRef.current) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [sortedFiles]);

  // Obtenez le label pour le filtre de date sélectionné avec années dynamiques
  const getDateFilterLabel = (filter: DateFilter): string => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    switch (filter) {
      case "all":
        return "Toutes les dates";
      case "today":
        return "Aujourd'hui";
      case "7days":
        return "7 derniers jours";
      case "30days":
        return "30 derniers jours";
      case "thisYear":
        return `Cette année (${currentYear})`;
      case "lastYear":
        return `Année dernière (${lastYear})`;
      case "beforeLastYear":
        return `Avant ${lastYear}`;
      default:
        return "Toutes les dates";
    }
  };

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

  const getSelectedItems = () => sortedFiles.filter(f => selectedItems.has(f.id));
  const hasSelection = selectedItems.size > 0;

  // Gestionnaires drag & drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Vérifier qu'il y a des fichiers dans le drag
    if (e.dataTransfer.types.includes("Files")) {
      dragCounter.current++;
      if (dragCounter.current === 1) {
        setIsDraggingOver(true);
      }
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Indiquer que le drop est autorisé
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dragCounter.current = 0;
    setIsDraggingOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && onFileDrop) {
      onFileDrop(files);
    }
  }, [onFileDrop]);

  // Obtenir le nom du dossier courant pour l'overlay
  const getCurrentFolderName = useCallback(() => {
    const segments = getPathSegments();
    return segments[segments.length - 1].name;
  }, [getPathSegments]);

  if (debug) {
    console.log("FileBrowser Debug:", {
      files,
      sortedFiles,
      sortConfig,
      currentPath,
      selectedItems: Array.from(selectedItems),
      pathSegments,
    });
  }

  return (
    <TooltipProvider>
      <div
        className={cn("w-full relative", className)}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Overlay drag & drop */}
        {isDraggingOver && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-primary/80 backdrop-blur-sm">
            <div className="bg-black rounded-lg p-6 shadow-lg">
              <div className="flex flex-col items-center space-y-3">
                <IconProvider icon="Plus" size={48} className="text-white" />
                <div className="text-base font-normal text-white text-center">
                  Déposez les fichiers pour les importer dans {getCurrentFolderName()}
                </div>
              </div>
            </div>
          </div>
        )}
      {/* Header avec breadcrumb et actions */}
      <div className="flex items-center justify-between py-3 px-4 bg-white border-b border-gray-200">
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
                size="large"
                onClick={() => onNavigate?.(pathSegments[0].path)}
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
                size="large"
                onClick={() => onNavigate?.(pathSegments[pathSegments.length - 3]?.path || "/")}
              >
                <IconProvider icon="MoreHorizontal" size={16} />
              </Button>
              <span className="text-gray-400">/</span>
              <Button
                size="large"
                onClick={() => onNavigate?.(pathSegments[pathSegments.length - 2].path)}
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

      </div>

      {/* Barre de sélection fixe */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Filtre par date */}
          <Select value={dateFilter} onValueChange={handleDateFilterChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{getDateFilterLabel("all")}</SelectItem>
              <SelectItem value="today">{getDateFilterLabel("today")}</SelectItem>
              <SelectItem value="7days">{getDateFilterLabel("7days")}</SelectItem>
              <SelectItem value="30days">{getDateFilterLabel("30days")}</SelectItem>
              <SelectItem value="thisYear">{getDateFilterLabel("thisYear")}</SelectItem>
              <SelectItem value="lastYear">{getDateFilterLabel("lastYear")}</SelectItem>
              <SelectItem value="beforeLastYear">{getDateFilterLabel("beforeLastYear")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Compteur de fichiers */}
          <span className="text-sm text-gray-600">
            {sortedFiles.length === 0
              ? "Aucun fichier"
              : `${sortedFiles.length} fichier${sortedFiles.length > 1 ? "s" : ""}`
            }
          </span>
        </div>

        {/* Partie droite : Boutons + Actions en masse */}
        <div className="flex items-center space-x-2">
          {/* Boutons d'actions */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ButtonCircle
                size="large"
                icon="Refresh"
                onClick={onRefresh}
                background="white"
              />
            </TooltipTrigger>
            <TooltipContent>Actualiser</TooltipContent>
          </Tooltip>
          {showUploadButton && (
            <Tooltip>
              <TooltipTrigger asChild>
                <ButtonCircle
                  size="large"
                  icon="Plus"
                  onClick={onUpload}
                  background="white"
                  featured
                />
              </TooltipTrigger>
              <TooltipContent>Ajouter des fichiers</TooltipContent>
            </Tooltip>
          )}

          {/* Actions en masse (visible uniquement avec sélection) */}
          {hasSelection && (
            <Select onValueChange={(value) => {
              if (value !== "placeholder") {
                handleAction(value, getSelectedItems());
              }
            }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={`${selectedItems.size} sélectionné${selectedItems.size > 1 ? "s" : ""}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="rename"
                  disabled={selectedItems.size > 1}
                  className={selectedItems.size > 1 ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Renommer
                </SelectItem>
                <SelectItem value="move">Déplacer vers</SelectItem>
                <SelectItem value="download">Télécharger</SelectItem>
                <SelectItem value="share">Partager</SelectItem>
                <SelectItem value="delete">Supprimer</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden border-t border-b border-gray-200 select-none" ref={tableRef}>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("file_name")}
                  className="flex items-center space-x-1 hover:text-gray-900 transition-colors uppercase"
                >
                  <span>NOM</span>
                  {getSortIcon("file_name") && (
                    <IconProvider icon={getSortIcon("file_name")!} size={12} />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("updated_at")}
                  className="flex items-center space-x-1 hover:text-gray-900 transition-colors uppercase"
                >
                  <span>DERNIÈRE MODIFICATION</span>
                  {getSortIcon("updated_at") && (
                    <IconProvider icon={getSortIcon("updated_at")!} size={12} />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <button
                  onClick={() => handleSort("file_size")}
                  className="flex items-center space-x-1 hover:text-gray-900 transition-colors uppercase"
                >
                  <span>TAILLE</span>
                  {getSortIcon("file_size") && (
                    <IconProvider icon={getSortIcon("file_size")!} size={12} />
                  )}
                </button>
              </th>
              <th className="w-48"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sortedFiles.map((item, index) => {
              const isSelected = selectedItems.has(item.id);
              const isHovered = hoveredRow === item.id;

              return (
                <tr
                  key={item.id}
                  className={cn(
                    "h-12 cursor-pointer transition-colors duration-150",
                    isSelected
                      ? "bg-blue-primary text-black hover:bg-blue-primary"
                      : "hover:bg-gray-50"
                  )}
                  onClick={(e) => handleItemSelect(item, index, e.shiftKey, e.ctrlKey || e.metaKey)}
                  onMouseEnter={() => setHoveredRow(item.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <IconProvider
                        icon={getFolderIcon(item)}
                        size={16}
                        className={isSelected ? "text-black" : "text-gray-500"}
                      />
                      <span className={cn(
                        "text-sm font-medium truncate",
                        isSelected ? "text-black" : "text-gray-900"
                      )}>
                        {item.file_name}
                      </span>
                    </div>
                  </td>
                  <td className={cn(
                    "px-4 py-2 text-sm",
                    isSelected ? "text-black" : "text-gray-600"
                  )}>
                    {formatDate(item.updated_at)}
                  </td>
                  <td className={cn(
                    "px-4 py-2 text-sm",
                    isSelected ? "text-black" : "text-gray-600"
                  )}>
                    {item.is_directory ? "—" : formatFileSize(item.file_size)}
                  </td>
                  <td className="px-4 py-2">
                    {isHovered && (
                      <div className="flex items-center justify-end space-x-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ButtonCircle
                              size="large"
                              icon="Pencil"
                              background="white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction("rename", [item]);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>Renommer</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ButtonCircle
                              size="large"
                              icon="Move"
                              background="white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction("move", [item]);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>Déplacer vers</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ButtonCircle
                              size="large"
                              icon="Download"
                              background="white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction("download", [item]);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>Télécharger</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ButtonCircle
                              size="large"
                              icon="Share"
                              background="white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction("share", [item]);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>Partager</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ButtonCircle
                              size="large"
                              icon="Trash"
                              background="white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction("delete", [item]);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>Supprimer</TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedFiles.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white border-t border-b border-gray-200">
          <IconProvider icon="Folder" size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-sm">Aucun fichier dans ce dossier</p>
        </div>
      )}
      </div>
    </TooltipProvider>
  );
};

export default FileBrowser;