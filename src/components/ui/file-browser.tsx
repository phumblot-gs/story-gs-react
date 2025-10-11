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
  disabled?: boolean;
}

export type HeightMode = "auto" | "fill-container" | "max-height";

export interface FileBrowserProps {
  files: FileItem[];
  currentPath: string;
  labelRootFolder?: string;
  showUploadButton?: boolean;
  debug?: boolean;
  className?: string;
  initialSort?: SortConfig;
  heightMode?: HeightMode;
  maxHeight?: string;
  // Pagination
  totalFiles?: number | null;    // Nombre total de fichiers (null si inconnu)
  hasMore?: boolean;             // Indique s'il y a plus de fichiers à charger
  isLoadingMore?: boolean;       // Indique si un chargement est en cours
  onLoadMore?: () => void;       // Callback appelé quand l'utilisateur demande plus de fichiers
  maxFilesLimit?: number;        // Limite maximale de fichiers (défaut: 10000)
  onNavigate?: (path: string) => void;
  onRefresh?: () => void;
  onUpload?: () => void;
  onCreateFolder?: () => void;
  onImportFiles?: () => void;
  onImportFolders?: () => void;
  onFileDrop?: (files: FileList) => void;
  onRename?: (items: FileItem[]) => void;
  onMove?: (items: FileItem[]) => void;
  onDownload?: (items: FileItem[]) => void;
  onShare?: (items: FileItem[]) => void;
  onDelete?: (items: FileItem[]) => void;
  onDateFilterChange?: (filter: string) => void;
  onSortChange?: (sortConfig: SortConfig) => void;
  onSelectionChange?: (selectedItems: FileItem[]) => void;
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
  heightMode = "auto",
  maxHeight = "600px",
  // Pagination
  totalFiles = null,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  maxFilesLimit = 10000,
  onNavigate,
  onRefresh,
  onUpload,
  onCreateFolder,
  onImportFiles,
  onImportFolders,
  onFileDrop,
  onRename,
  onMove,
  onDownload,
  onShare,
  onDelete,
  onDateFilterChange,
  onSortChange,
  onSelectionChange,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const dragCounter = useRef(0);
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Parse le chemin actuel pour créer les segments de navigation
  const getPathSegments = useCallback((): PathSegment[] => {
    if (currentPath === "/" || currentPath === "") {
      return [{ name: labelRootFolder, path: currentPath || "" }];
    }

    // Détecter si le chemin commence par "/"
    const startsWithSlash = currentPath.startsWith("/");
    const parts = currentPath.split("/").filter(Boolean);
    const segments: PathSegment[] = [{ name: labelRootFolder, path: startsWithSlash ? "/" : "" }];

    let buildPath = "";
    parts.forEach((part, index) => {
      if (index === 0) {
        buildPath = startsWithSlash ? `/${part}` : part;
      } else {
        buildPath += `/${part}`;
      }
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

  // Formate un nombre avec des espaces pour les milliers
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Génère le texte du compteur de fichiers selon la logique demandée
  const getFileCountText = (): string => {
    const currentCount = sortedFiles.length;
    const isLimitReached = currentCount >= maxFilesLimit;

    if (currentCount === 0) {
      return "Aucun fichier";
    }

    if (isLimitReached) {
      return `${formatNumber(currentCount)} fichier${currentCount > 1 ? "s" : ""} (limite atteinte)`;
    }

    if (hasMore && (totalFiles === null || totalFiles === undefined || totalFiles > currentCount)) {
      return `${formatNumber(currentCount)} fichier${currentCount > 1 ? "s" : ""} et plus...`;
    }

    if (totalFiles !== null && totalFiles !== undefined && totalFiles !== currentCount) {
      return `${formatNumber(totalFiles)} fichier${totalFiles > 1 ? "s" : ""}`;
    }

    return `${formatNumber(currentCount)} fichier${currentCount > 1 ? "s" : ""}`;
  };

  // Formate la date avec validation
  const formatDate = (dateString: string): string => {
    if (!dateString) {
      console.error("[FileBrowser] Date invalide: valeur vide ou null");
      return "Date invalide";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error(`[FileBrowser] Date invalide: impossible de parser "${dateString}"`);
      return "Date invalide";
    }

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
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      switch (sortConfig.field) {
        case "file_name":
          aValue = a.file_name?.toLowerCase() || "";
          bValue = b.file_name?.toLowerCase() || "";
          break;
        case "updated_at":
          const aDate = new Date(a.updated_at || 0);
          const bDate = new Date(b.updated_at || 0);

          if (isNaN(aDate.getTime())) {
            console.error(`[FileBrowser] Date invalide lors du tri pour le fichier "${a.file_name}": "${a.updated_at}"`);
            aValue = 0;
          } else {
            aValue = aDate.getTime();
          }

          if (isNaN(bDate.getTime())) {
            console.error(`[FileBrowser] Date invalide lors du tri pour le fichier "${b.file_name}": "${b.updated_at}"`);
            bValue = 0;
          } else {
            bValue = bDate.getTime();
          }
          break;
        case "file_size":
          aValue = a.file_size || 0;
          bValue = b.file_size || 0;
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

  // Gestion du double-clic pour naviguer dans les dossiers
  const handleItemDoubleClick = useCallback((item: FileItem) => {
    if (item.is_directory && onNavigate) {
      // Construire le nouveau chemin en préservant le format (avec ou sans "/" au début)
      let newPath: string;

      console.log('[FileBrowser] handleItemDoubleClick - currentPath:', currentPath, 'file_name:', item.file_name);

      if (!currentPath || currentPath === "") {
        newPath = item.file_name;
      } else if (currentPath === "/") {
        newPath = `/${item.file_name}`;
      } else {
        newPath = `${currentPath}/${item.file_name}`;
      }

      console.log('[FileBrowser] handleItemDoubleClick - constructed newPath:', newPath);
      onNavigate(newPath);

      // Désélectionner tous les items après navigation
      setSelectedItems(new Set());
    }
  }, [onNavigate, currentPath]);

  // Gestion de la sélection
  const handleItemSelect = useCallback((item: FileItem, index: number, shiftKey: boolean, ctrlKey: boolean) => {
    // Donner le focus au tableau pour activer la navigation clavier
    tableRef.current?.focus();

    // Définir l'index actif pour la navigation clavier
    setActiveIndex(index);

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

  // Notifier le parent du changement de sélection
  useEffect(() => {
    if (onSelectionChange) {
      const selected = sortedFiles.filter(f => selectedItems.has(f.id));
      onSelectionChange(selected);
    }
  }, [selectedItems, sortedFiles, onSelectionChange]);

  // Navigation clavier : Cmd+A, flèches haut/bas, Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si la touche est pressée dans un input
      if ((e.target as HTMLElement)?.tagName === "INPUT") {
        return;
      }

      const isSelectAll = (e.metaKey || e.ctrlKey) && e.key === "a";

      // Cmd+A / Ctrl+A : Sélectionner tout
      if (isSelectAll) {
        e.preventDefault();
        setSelectedItems(new Set(sortedFiles.map(f => f.id)));
        return;
      }

      // Navigation avec les flèches et Enter uniquement si le tableau a le focus
      if (document.activeElement !== tableRef.current) {
        return;
      }

      // Flèche bas : Descendre
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(prev => {
          const newIndex = prev === null ? 0 : Math.min(prev + 1, sortedFiles.length - 1);
          if (sortedFiles[newIndex]) {
            if (e.shiftKey && lastSelectedIndex !== null) {
              // Shift+Flèche : Étendre la sélection
              const start = Math.min(lastSelectedIndex, newIndex);
              const end = Math.max(lastSelectedIndex, newIndex);
              const newSelection = new Set<string>();
              for (let i = start; i <= end; i++) {
                newSelection.add(sortedFiles[i].id);
              }
              setSelectedItems(newSelection);
            } else {
              // Sans Shift : Remplacer la sélection
              setSelectedItems(new Set([sortedFiles[newIndex].id]));
              setLastSelectedIndex(newIndex);
            }
          }
          return newIndex;
        });
      }

      // Flèche haut : Monter
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(prev => {
          const newIndex = prev === null ? 0 : Math.max(prev - 1, 0);
          if (sortedFiles[newIndex]) {
            if (e.shiftKey && lastSelectedIndex !== null) {
              // Shift+Flèche : Étendre la sélection
              const start = Math.min(lastSelectedIndex, newIndex);
              const end = Math.max(lastSelectedIndex, newIndex);
              const newSelection = new Set<string>();
              for (let i = start; i <= end; i++) {
                newSelection.add(sortedFiles[i].id);
              }
              setSelectedItems(newSelection);
            } else {
              // Sans Shift : Remplacer la sélection
              setSelectedItems(new Set([sortedFiles[newIndex].id]));
              setLastSelectedIndex(newIndex);
            }
          }
          return newIndex;
        });
      }

      // Enter : Naviguer dans le dossier si c'est un dossier
      if (e.key === "Enter" && activeIndex !== null) {
        e.preventDefault();
        const activeItem = sortedFiles[activeIndex];
        if (activeItem) {
          handleItemDoubleClick(activeItem);
        }
      }
    };

    if (tableRef.current) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [sortedFiles, activeIndex, handleItemDoubleClick]);

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

  // Fermer le menu d'ajout quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
    };

    if (isAddMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isAddMenuOpen]);

  // Validation des données en mode debug
  useEffect(() => {
    if (debug && files.length > 0) {
      console.log("[FileBrowser] Debug: Validation des données");

      files.forEach((file, index) => {
        const errors: string[] = [];

        if (!file.file_name) errors.push("file_name manquant");
        if (!file.updated_at) errors.push("updated_at manquant");
        if (file.file_size === undefined) errors.push("file_size manquant");
        if (file.is_directory === undefined) errors.push("is_directory manquant");

        if (errors.length > 0) {
          console.error(`[FileBrowser] Fichier invalide à l'index ${index}:`, {
            fichier: file,
            erreurs: errors,
            format_attendu: {
              id: "string",
              file_name: "string",
              parent_path: "string | null",
              file_size: "number",
              mime_type: "string | null",
              is_directory: "boolean",
              created_at: "string (ISO 8601)",
              updated_at: "string (ISO 8601)"
            }
          });
        }
      });
    }
  }, [files, debug]);

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

  // Calculer les classes CSS selon le heightMode
  const containerClasses = cn(
    "w-full relative",
    heightMode === "fill-container" && "flex flex-col h-full",
    className
  );

  const tableWrapperClasses = cn(
    "w-full",
    heightMode === "fill-container" && "flex-1 overflow-hidden",
    heightMode === "max-height" && "overflow-hidden"
  );

  const tableContainerClasses = cn(
    heightMode === "auto" && "overflow-x-auto",
    heightMode === "fill-container" && "h-full overflow-auto",
    heightMode === "max-height" && "overflow-auto"
  );

  const tableContainerStyle = heightMode === "max-height" ? { maxHeight } : undefined;

  return (
    <TooltipProvider>
      <div
        className={containerClasses}
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
                onClick={() => onNavigate?.(pathSegments[pathSegments.length - 3]?.path || "")}
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
            {getFileCountText()}
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
            <div className="relative" ref={addMenuRef}>
              <ButtonCircle
                size="large"
                icon="Plus"
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                background="white"
                featured
                isActive={isAddMenuOpen}
              />
              {isAddMenuOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 overflow-hidden rounded-none border shadow-lg bg-black text-white border-grey-strongest">
                  <div className="p-0">
                    <button
                      onClick={() => {
                        onCreateFolder?.();
                        setIsAddMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm whitespace-nowrap bg-black-secondary text-white hover:bg-white hover:text-black active:bg-white active:text-blue-primary transition-colors duration-200"
                    >
                      Nouveau dossier
                    </button>
                    <button
                      onClick={() => {
                        onImportFiles?.();
                        setIsAddMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm whitespace-nowrap bg-black-secondary text-white hover:bg-white hover:text-black active:bg-white active:text-blue-primary transition-colors duration-200"
                    >
                      Importer des fichiers
                    </button>
                    <button
                      onClick={() => {
                        onImportFolders?.();
                        setIsAddMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm whitespace-nowrap bg-black-secondary text-white hover:bg-white hover:text-black active:bg-white active:text-blue-primary transition-colors duration-200"
                    >
                      Importer des dossiers
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions en masse (visible uniquement avec sélection) */}
          {hasSelection && (
            <Select
              value=""
              onValueChange={(value) => {
                if (value !== "placeholder" && value !== "") {
                  handleAction(value, getSelectedItems());
                }
              }}
            >
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

      {/* Bandeau limite atteinte */}
      {sortedFiles.length >= maxFilesLimit && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3">
          <div className="flex items-center">
            <IconProvider icon="AlertTriangle" size={16} className="text-yellow-600 mr-3" />
            <p className="text-sm text-yellow-800">
              Limite de {formatNumber(maxFilesLimit)} fichiers atteinte. Utilisez la recherche ou les filtres pour affiner les résultats.
            </p>
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className={tableWrapperClasses}>
        <div
          className={cn("border-t border-b border-gray-200 select-none outline-none", tableContainerClasses)}
          style={tableContainerStyle}
          ref={tableRef}
          tabIndex={0}
        >
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
              const isActive = activeIndex === index;
              const isDisabled = item.disabled === true;

              return (
                <tr
                  key={item.id}
                  className={cn(
                    "h-12 transition-colors duration-150",
                    isDisabled
                      ? "cursor-not-allowed"
                      : "cursor-pointer",
                    !isDisabled && isSelected
                      ? "bg-blue-primary text-black hover:bg-blue-primary"
                      : !isDisabled && "hover:bg-gray-50",
                    !isDisabled && isActive && !isSelected && "ring-2 ring-inset ring-blue-400"
                  )}
                  onClick={(e) => !isDisabled && handleItemSelect(item, index, e.shiftKey, e.ctrlKey || e.metaKey)}
                  onDoubleClick={() => !isDisabled && handleItemDoubleClick(item)}
                  onMouseEnter={() => !isDisabled && setHoveredRow(item.id)}
                  onMouseLeave={() => !isDisabled && setHoveredRow(null)}
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <IconProvider
                        icon={getFolderIcon(item)}
                        size={16}
                        className={cn(
                          isDisabled ? "text-[#c1c1c1]" :
                          isSelected ? "text-black" : "text-gray-500"
                        )}
                      />
                      <span className={cn(
                        "text-sm font-medium truncate",
                        isDisabled ? "text-[#c1c1c1]" :
                        isSelected ? "text-black" : "text-gray-900"
                      )}>
                        {item.file_name}
                      </span>
                    </div>
                  </td>
                  <td className={cn(
                    "px-4 py-2 text-sm",
                    isDisabled ? "text-[#c1c1c1]" :
                    isSelected ? "text-black" : "text-gray-600"
                  )}>
                    {formatDate(item.updated_at)}
                  </td>
                  <td className={cn(
                    "px-4 py-2 text-sm",
                    isDisabled ? "text-[#c1c1c1]" :
                    isSelected ? "text-black" : "text-gray-600"
                  )}>
                    {item.is_directory ? "—" : formatFileSize(item.file_size)}
                  </td>
                  <td className="px-4 py-2">
                    {isHovered && !isDisabled && (
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
                              icon="FolderMoved"
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
      </div>

      {/* Bouton "Afficher les éléments suivants" */}
      {hasMore && sortedFiles.length < maxFilesLimit && (
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex justify-center">
          <Button
            size="large"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="min-w-[200px]"
          >
            {isLoadingMore ? (
              <span className="flex items-center space-x-2">
                <IconProvider icon="Loader" size={16} className="animate-spin" />
                <span>Chargement...</span>
              </span>
            ) : (
              "Afficher les éléments suivants"
            )}
          </Button>
        </div>
      )}

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