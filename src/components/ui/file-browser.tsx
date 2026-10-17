"use client";

import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonMenuSmall } from "@/components/ui/button-menu-small";
import { IconProvider } from "@/components/ui/icon-provider";
import { IconName } from "@/components/ui/icons/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslationSafe } from "@/contexts/TranslationContext";
import { TranslationMap } from "@/utils/translations";
import { BgProvider } from "@/components/layout/BgContext";
import {
  INTERNAL_DRAG_TYPE,
  canDropOnItem,
  computeAutoScrollSpeed,
  getDraggedItems,
  isInternalItemsDrag,
} from "@/lib/file-browser-drag";

import { FileDropZone } from "./file-drop-zone";
import type { FileDropOptions, FileDropValidation } from "@/lib/file-drop";

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

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|avif|bmp|tiff?|svg|heic|heif|psd|raw|cr2|cr3|nef|arw|dng)$/i;

/** Image : type MIME `image/*`, ou à défaut extension d'image connue. */
export const isImageFile = (item: Pick<FileItem, "mime_type" | "file_name" | "is_directory">): boolean =>
  !item.is_directory &&
  (item.mime_type ? item.mime_type.startsWith("image/") : IMAGE_EXTENSIONS.test(item.file_name ?? ""));

export type FileBrowserAction = "rename" | "move" | "download" | "share" | "delete";

export interface FileBrowserProps {
  files: FileItem[];
  currentPath: string;
  /** Libellé du dossier racine. Défaut : « Mes fichiers » traduit (`fileBrowser.rootFolder`). */
  labelRootFolder?: string;
  showUploadButton?: boolean;
  debug?: boolean;
  className?: string;
  initialSort?: SortConfig;
  heightMode?: HeightMode;
  /**
   * Décalage de l'en-tête de colonnes collant quand c'est la page qui défile
   * (`heightMode="auto"`) : hauteur du header collant de l'application (px ou
   * valeur CSS). Défaut 0. Sans effet dans les autres modes, où l'en-tête
   * colle en haut de la zone qui défile.
   */
  stickyHeaderOffset?: number | string;
  maxHeight?: string;
  // Translation props (optional - works without TranslationProvider)
  language?: string;                          // Language code (e.g., "fr", "en", "es", "it")
  translations?: Partial<TranslationMap>;     // Custom translations to override defaults
  // Pagination
  totalFiles?: number | null;    // Nombre total de fichiers (null si inconnu)
  hasMore?: boolean;             // Indique s'il y a plus de fichiers à charger
  isLoadingMore?: boolean;       // Indique si un chargement est en cours
  onLoadMore?: () => void;       // Callback appelé quand l'utilisateur demande plus de fichiers
  maxFilesLimit?: number;        // Limite maximale de fichiers (défaut: 10000)
  onNavigate?: (path: string) => void;
  /** @deprecated Le bouton « Actualiser » a été retiré : prop ignorée, conservée pour la compatibilité. */
  onRefresh?: () => void;
  /** @deprecated Non utilisé (l'import passe par onImportFiles / onImportFolders). */
  onUpload?: () => void;
  onCreateFolder?: () => void;
  onImportFiles?: () => void;
  onImportFolders?: () => void;
  /** Optional eligibility rules for external imports; internal row moves are unaffected. */
  fileDropOptions?: FileDropOptions;
  onFilesDrop?: (files: File[]) => void | Promise<void>;
  onFileDropRejected?: (validation: FileDropValidation) => void;
  onFileDropError?: (error: unknown) => void;
  onFileDrop?: (event: React.DragEvent<HTMLDivElement>) => void | Promise<void>;
  onRename?: (items: FileItem[]) => void;
  onMove?: (items: FileItem[]) => void;
  onDownload?: (items: FileItem[]) => void;
  onShare?: (items: FileItem[]) => void;
  onDelete?: (items: FileItem[]) => void;
  onDateFilterChange?: (filter: string) => void;
  onSortChange?: (sortConfig: SortConfig) => void;
  onSelectionChange?: (selectedItems: FileItem[]) => void;
  /**
   * Déplacement des lignes sélectionnées vers un sous-dossier par glisser-déposer.
   *
   * Fournir ce callback rend les lignes déplaçables ; sans lui, le glisser-déposer
   * interne reste désactivé. Le composant ne possède pas les données : il signale
   * le déplacement, à charge de l'appelant de l'effectuer puis de re-rendre avec
   * les nouveaux `files` (et de vider la sélection via `selectionResetKey`).
   *
   * `targetFolder` est toujours un dossier, actif, hors des lignes déplacées.
   * Le composant ne voit que le dossier courant : il ne peut pas détecter qu'on
   * déplace un dossier dans l'un de ses propres descendants, ce qui reste à
   * valider côté appelant.
   */
  onMoveItems?: (items: FileItem[], targetFolder: FileItem) => void;
  /**
   * Vide la sélection à chaque changement de valeur (pas au premier rendu).
   * Permet à un parent de désélectionner depuis l'extérieur — par exemple un
   * bouton « Tout désélectionner » — sans rendre la sélection contrôlée :
   * il suffit d'incrémenter la clé. `onSelectionChange` remonte alors `[]`.
   */
  selectionResetKey?: number | string;
  /**
   * Boutons supplémentaires de la barre d'actions en masse, rendus à gauche des
   * actions natives (ex. « Ajouter au projet »). Appelé avec les éléments
   * sélectionnés ; masqués, comme les actions natives, sans sélection. Rester
   * homogène avec les actions natives : `Button variant="secondary"` en `w-6 h-6`,
   * icône de 14 px et `Tooltip`.
   */
  renderBulkActions?: (selectedItems: FileItem[]) => React.ReactNode;
  // Action control
  disabledActions?: FileBrowserAction[];  // Actions grisées (visibles mais non cliquables)
  hiddenActions?: FileBrowserAction[];    // Actions masquées complètement
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

/**
 * Dernier segment du breadcrumb : le dossier courant.
 *
 * Rendu dans la boîte d'un bouton `outline` plutôt qu'en texte nu : il occupe
 * ainsi la même place que les segments navigables (même hauteur, même padding
 * horizontal), et son cadre évite au libellé de flotter à côté des pastilles
 * pleines des segments parents. Sans cette boîte, la racine n'a aucun padding
 * et se décale dès qu'on entre dans un sous-dossier, où elle devient un bouton.
 *
 * Le dossier courant n'est pas une destination : `asChild` le rend en `<span>`
 * — ni focusable, ni annoncé comme bouton — et `pointer-events-none` supprime
 * clic et survol. `aria-current="page"` signale la position courante.
 */
const CurrentFolderSegment: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Button
    asChild
    variant="outline"
    size="medium"
    // `!` obligatoire : dans la feuille compilée, la règle `.font-regular` du
    // bouton est déclarée après `.font-medium`, et gagnerait à spécificité égale.
    className="h-6 !font-medium pointer-events-none"
  >
    <span aria-current="page">{children}</span>
  </Button>
);

/**
 * Vignette affichée sous le curseur pendant un déplacement de lignes.
 *
 * Construite en DOM impératif, et stylée en `style` inline plutôt qu'en
 * classes Tailwind : `setDragImage` photographie le nœud à l'instant du
 * `dragstart`, donc il doit être rendu et stylé immédiatement, sans dépendre
 * du cycle de rendu React ni de la feuille Tailwind de l'application hôte.
 * Le nœud est placé hors écran — `display: none` empêcherait la capture.
 */
function createRowsDragPreview(items: FileItem[]): HTMLElement {
  const card = document.createElement("div");
  card.style.cssText = [
    "position:fixed",
    "top:-1000px",
    "left:-1000px",
    "pointer-events:none",
    "display:inline-flex",
    "align-items:center",
    "gap:8px",
    "max-width:320px",
    "padding:10px 16px",
    "border-radius:10px",
    "background:#ffffff",
    "box-shadow:0 4px 14px rgba(0,0,0,0.18)",
    "font-size:13px",
    "line-height:1",
    "color:#111111",
  ].join(";");

  const label = document.createElement("span");
  label.style.cssText = "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
  label.textContent = items[0]?.file_name ?? "";
  card.appendChild(label);

  if (items.length > 1) {
    const badge = document.createElement("span");
    badge.style.cssText = [
      "position:absolute",
      "top:-10px",
      "right:-10px",
      "min-width:22px",
      "height:22px",
      "padding:0 6px",
      "border-radius:9999px",
      "background:var(--color-blue-primary,#9ed7f5)",
      "color:#000000",
      "font-size:11px",
      "font-weight:600",
      "display:flex",
      "align-items:center",
      "justify-content:center",
    ].join(";");
    badge.textContent = String(items.length);
    card.appendChild(badge);
  }

  document.body.appendChild(card);
  return card;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({
  files = [],
  currentPath = "/",
  labelRootFolder: labelRootFolderProp,
  showUploadButton = false,
  debug = false,
  className,
  initialSort = { field: "file_name", direction: "asc" },
  heightMode = "auto",
  stickyHeaderOffset = 0,
  maxHeight = "600px",
  // Translation props
  language,
  translations,
  // Pagination
  totalFiles = null,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  maxFilesLimit = 10000,
  onNavigate,
  onUpload,
  onCreateFolder,
  onImportFiles,
  onImportFolders,
  onFileDrop,
  fileDropOptions,
  onFilesDrop,
  onFileDropRejected,
  onFileDropError,
  onRename,
  onMove,
  onDownload,
  onShare,
  onDelete,
  onDateFilterChange,
  onSortChange,
  onSelectionChange,
  onMoveItems,
  selectionResetKey,
  renderBulkActions,
  disabledActions = [],
  hiddenActions = [],
}) => {
  const { t } = useTranslationSafe(translations, language);
  const labelRootFolder = labelRootFolderProp ?? t('fileBrowser.rootFolder');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);
  const tableRef = useRef<HTMLDivElement>(null);
  // Glisser-déposer interne : lignes en cours de déplacement et cible survolée.
  const [isDraggingRows, setIsDraggingRows] = useState(false);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const draggedItemsRef = useRef<FileItem[]>([]);
  const draggedIdsRef = useRef<Set<string>>(new Set());
  // Dernière position verticale du curseur, lue par la boucle d'auto-scroll.
  const dragPointerYRef = useRef<number | null>(null);
  const dragPreviewRef = useRef<HTMLElement | null>(null);

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
    if (!item.is_directory) return isImageFile(item) ? "FileImage" : "File";

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

  // Texte du compteur d'éléments : fichiers ET dossiers (les dossiers sont des
  // lignes de `files`). `totalFiles` doit compter les deux aussi.
  const getFileCountText = (): string => {
    const currentCount = sortedFiles.length;
    const isLimitReached = currentCount >= maxFilesLimit;

    if (currentCount === 0) {
      return t('fileBrowser.noItems');
    }

    if (isLimitReached) {
      return t('fileBrowser.itemsLimitReached', { count: formatNumber(currentCount) });
    }

    if (hasMore && (totalFiles === null || totalFiles === undefined || totalFiles > currentCount)) {
      return t('fileBrowser.itemsAndMore', { count: formatNumber(currentCount) });
    }

    if (totalFiles !== null && totalFiles !== undefined && totalFiles !== currentCount) {
      return t('fileBrowser.itemsCount', { count: formatNumber(totalFiles) });
    }

    return t('fileBrowser.itemsCount', { count: formatNumber(currentCount) });
  };

  // Formate la date avec validation
  const formatDate = (dateString: string): string => {
    if (!dateString) {
      console.error("[FileBrowser] Date invalide: valeur vide ou null");
      return t('common.invalidDate');
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error(`[FileBrowser] Date invalide: impossible de parser "${dateString}"`);
      return t('common.invalidDate');
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
        case "updated_at": {
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
        }
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

      if (!currentPath || currentPath === "") {
        newPath = item.file_name;
      } else if (currentPath === "/") {
        newPath = `/${item.file_name}`;
      } else {
        newPath = `${currentPath}/${item.file_name}`;
      }

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

  // Reset externe de la sélection : le parent change `selectionResetKey` pour
  // vider la sélection. Le ref garde la valeur précédente pour ne rien faire au
  // premier rendu, et ne réagir qu'aux changements réels. Pas d'appel à
  // `onSelectionChange` ici : l'effet de notification ci-dessous le fait de
  // lui-même quand `selectedItems` devient vide.
  const previousSelectionResetKey = useRef(selectionResetKey);
  useEffect(() => {
    if (previousSelectionResetKey.current === selectionResetKey) return;
    previousSelectionResetKey.current = selectionResetKey;

    setSelectedItems(new Set());
    setLastSelectedIndex(null);
    setActiveIndex(null);
  }, [selectionResetKey]);

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
  }, [sortedFiles, activeIndex, lastSelectedIndex, handleItemDoubleClick]);

  // Obtenez le label pour le filtre de date sélectionné avec années dynamiques
  const getDateFilterLabel = (filter: DateFilter): string => {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    switch (filter) {
      case "all":
        return t('fileBrowser.dateFilter.all');
      case "today":
        return t('fileBrowser.dateFilter.today');
      case "7days":
        return t('fileBrowser.dateFilter.last7Days');
      case "30days":
        return t('fileBrowser.dateFilter.last30Days');
      case "thisYear":
        return t('fileBrowser.dateFilter.thisYear', { year: currentYear.toString() });
      case "lastYear":
        return t('fileBrowser.dateFilter.lastYear', { year: lastYear.toString() });
      case "beforeLastYear":
        return t('fileBrowser.dateFilter.beforeYear', { year: lastYear.toString() });
      default:
        return t('fileBrowser.dateFilter.all');
    }
  };

  const getSelectedItems = () => sortedFiles.filter(f => selectedItems.has(f.id));
  const hasSelection = selectedItems.size > 0;

  // Calculer les actions disponibles, désactivées et masquées
  const actionConfig = useMemo(() => {
    const allActions: FileBrowserAction[] = ["rename", "move", "download", "share", "delete"];
    const disabledSet = new Set(disabledActions);
    const hiddenSet = new Set(hiddenActions);
    
    // Actions disponibles (non masquées)
    const availableActions = allActions.filter(action => !hiddenSet.has(action));
    
    return {
      availableActions,
      isDisabled: (action: FileBrowserAction) => disabledSet.has(action) || hiddenSet.has(action),
      isHidden: (action: FileBrowserAction) => hiddenSet.has(action),
    };
  }, [disabledActions, hiddenActions]);

  // Actions sur un item
  const handleAction = (action: string, items: FileItem[]) => {
    // Empêcher l'exécution si l'action est désactivée ou masquée
    if (actionConfig.isDisabled(action as FileBrowserAction)) {
      return;
    }

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

  // --- Glisser-déposer interne : déplacement de lignes vers un sous-dossier ---

  const canDragRows = Boolean(onMoveItems);

  const resetRowDrag = useCallback(() => {
    // La vignette est retirée au plus tard à la fin du drag : le setTimeout du
    // dragstart suffit en pratique, mais pas si le composant est démonté avant.
    dragPreviewRef.current?.remove();
    dragPreviewRef.current = null;
    draggedItemsRef.current = [];
    draggedIdsRef.current = new Set();
    dragPointerYRef.current = null;
    setDropTargetId(null);
    setIsDraggingRows(false);
  }, []);

  const handleRowDragStart = useCallback((e: React.DragEvent, item: FileItem, index: number) => {
    if (!canDragRows || item.disabled) {
      e.preventDefault();
      return;
    }

    const items = getDraggedItems(item, selectedItems, sortedFiles);
    if (items.length === 0) {
      e.preventDefault();
      return;
    }

    draggedItemsRef.current = items;
    draggedIdsRef.current = new Set(items.map(i => i.id));

    e.dataTransfer.effectAllowed = "move";
    // La charge utile sert à typer le drag ; les lignes elles-mêmes sont lues
    // depuis la ref, car le contenu du dataTransfer n'est pas lisible pendant
    // le survol, seulement au drop.
    e.dataTransfer.setData(INTERNAL_DRAG_TYPE, JSON.stringify(items.map(i => i.id)));

    const preview = createRowsDragPreview(items);
    dragPreviewRef.current = preview;
    e.dataTransfer.setDragImage(preview, 16, 16);
    window.setTimeout(() => preview.remove(), 0);

    // Glisser une ligne hors sélection la sélectionne, comme dans un explorateur.
    if (!selectedItems.has(item.id)) {
      setSelectedItems(new Set([item.id]));
      setLastSelectedIndex(index);
      setActiveIndex(index);
    }

    setIsDraggingRows(true);
  }, [canDragRows, selectedItems, sortedFiles]);

  const handleRowDragOver = useCallback((e: React.DragEvent, item: FileItem) => {
    if (!isInternalItemsDrag(e.dataTransfer?.types)) return;
    // Cible invalide : pas de preventDefault, donc le drop reste refusé.
    if (!canDropOnItem(item, draggedIdsRef.current)) return;

    e.preventDefault();
    // Sans cela, le gestionnaire du conteneur reprendrait la main sur dropEffect.
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";

    setDropTargetId(prev => (prev === item.id ? prev : item.id));
  }, []);

  const handleRowDragLeave = useCallback((e: React.DragEvent, item: FileItem) => {
    // Passer sur un enfant de la ligne émet un dragleave : ne pas l'écouter.
    const related = e.relatedTarget as Node | null;
    if (related && e.currentTarget.contains(related)) return;

    setDropTargetId(prev => (prev === item.id ? null : prev));
  }, []);

  const handleRowDrop = useCallback((e: React.DragEvent, item: FileItem) => {
    if (!isInternalItemsDrag(e.dataTransfer?.types)) return;
    if (!canDropOnItem(item, draggedIdsRef.current)) return;

    e.preventDefault();
    e.stopPropagation();

    const items = draggedItemsRef.current;
    resetRowDrag();

    if (items.length > 0) {
      onMoveItems?.(items, item);
    }
  }, [onMoveItems, resetRowDrag]);

  // Défilement automatique quand le curseur atteint le haut ou le bas de la
  // liste, pour atteindre un dossier hors de la zone visible. Piloté par une
  // boucle d'animation : les événements `dragover` cessent dès que le curseur
  // s'immobilise, alors que le défilement, lui, doit continuer.
  useEffect(() => {
    if (!isDraggingRows) return;

    const trackPointer = (event: DragEvent) => {
      dragPointerYRef.current = event.clientY;
    };
    // En phase de capture : les lignes arrêtent la propagation de leur dragover.
    document.addEventListener("dragover", trackPointer, true);

    let frame = requestAnimationFrame(function step() {
      const container = tableRef.current;
      const pointerY = dragPointerYRef.current;

      if (container && pointerY !== null && container.scrollHeight > container.clientHeight) {
        const speed = computeAutoScrollSpeed(container.getBoundingClientRect(), pointerY);
        if (speed !== 0) {
          container.scrollTop += speed;
        }
      }

      frame = requestAnimationFrame(step);
    });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("dragover", trackPointer, true);
    };
  }, [isDraggingRows]);

  // Obtenir le nom du dossier courant pour l'overlay
  const getCurrentFolderName = useCallback(() => {
    const segments = getPathSegments();
    return segments[segments.length - 1].name;
  }, [getPathSegments]);


  // Bouton d'action : partagé par les lignes (survol) et la barre d'actions en
  // masse, pour que les deux aient exactement les mêmes icônes, infobulles,
  // dimensions et règles (hiddenActions / disabledActions).
  const actionButtons: Record<FileBrowserAction, { icon: IconName; tooltip: string }> = {
    rename: { icon: "Pencil", tooltip: t('fileBrowser.rename') },
    move: { icon: "FolderMoved", tooltip: t('fileBrowser.moveTo') },
    download: { icon: "Download", tooltip: t('fileBrowser.download') },
    share: { icon: "Share", tooltip: t('fileBrowser.share') },
    delete: { icon: "Trash", tooltip: t('fileBrowser.delete') },
  };
  const renderActionButton = (
    action: FileBrowserAction,
    items: FileItem[],
    extraDisabled = false,
    variant: "ghost" | "secondary" = "ghost",
  ) => {
    const isActionDisabled = actionConfig.isDisabled(action) || extraDisabled;
    const config = actionButtons[action];
    return (
      <Tooltip key={action}>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size="medium"
            className="p-0 w-6 h-6"
            disabled={isActionDisabled}
            aria-disabled={isActionDisabled}
            aria-label={config.tooltip}
            data-action={action}
            onClick={(e) => {
              e.stopPropagation();
              if (!isActionDisabled) {
                handleAction(action, items);
              }
            }}
          >
            <IconProvider icon={config.icon} size={14} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{config.tooltip}</TooltipContent>
      </Tooltip>
    );
  };

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
    // `clip` et non `auto` : un conteneur `overflow-x-auto` devient une zone de
    // défilement, et l'en-tête de colonnes collerait à lui au lieu de la page.
    heightMode === "auto" && "overflow-x-clip",
    heightMode === "fill-container" && "h-full overflow-auto",
    heightMode === "max-height" && "overflow-auto",
    // Dossier vide : la colonne flex laisse le message occuper la hauteur
    // restante sous l'en-tête, pour l'y centrer verticalement.
    sortedFiles.length === 0 && "flex flex-col"
  );

  // En-tête de colonnes collant : en haut de la zone qui défile (tableau), ou
  // sous le header de l'application quand c'est la page qui défile. Le trait
  // du bas est une ombre : la bordure du <tr> ne suivrait pas les cellules.
  const stickyHeaderCell = "sticky z-10 bg-gray-50 shadow-[inset_0_-1px_0_rgb(229,231,235)]";
  const stickyHeaderStyle: React.CSSProperties = {
    top: heightMode === "auto"
      ? (typeof stickyHeaderOffset === "number" ? `${stickyHeaderOffset}px` : stickyHeaderOffset)
      : 0,
  };

  // Gouttière de barre de défilement réservée (aussi sur la barre d'actions en
  // masse) : les boutons des lignes restent alignés sur ceux de la barre, que
  // la barre de défilement soit affichée ou non.
  const tableContainerStyle: React.CSSProperties = {
    scrollbarGutter: "stable",
    ...(heightMode === "max-height" ? { maxHeight } : {}),
  };

  return (
    <TooltipProvider>
      <div
        className={containerClasses}
        onDragOver={event => {
          if (Array.from(event.dataTransfer.types).includes("Files") && !isInternalItemsDrag(event.dataTransfer.types)) {
            event.preventDefault(); event.dataTransfer.dropEffect = "none";
          }
        }}
        onDrop={event => {
          // File drops outside the list must not open a file in the browser.
          if (Array.from(event.dataTransfer.types).includes("Files") && !isInternalItemsDrag(event.dataTransfer.types)) event.preventDefault();
        }}
      >
      {/* Header avec breadcrumb et actions */}
      <BgProvider value="white">
        <div className="flex items-center justify-between py-3 px-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {/* Navigation breadcrumb */}
            {pathSegments.length === 1 ? (
              // Racine uniquement
              <CurrentFolderSegment>{pathSegments[0].name}</CurrentFolderSegment>
            ) : pathSegments.length === 2 ? (
              // Parent + Courant
              <>
                <Button
                  variant="secondary"
                  size="medium"
                  className="h-6"
                  onClick={() => onNavigate?.(pathSegments[0].path)}
                >
                  {pathSegments[0].name}
                </Button>
                <span className="text-gray-400">/</span>
                <CurrentFolderSegment>
                  {pathSegments[pathSegments.length - 1].name}
                </CurrentFolderSegment>
              </>
            ) : (
              // Grand-parent + Parent + Courant
              <>
                <Button
                  variant="secondary"
                  size="medium"
                  className="h-6"
                  onClick={() => onNavigate?.(pathSegments[pathSegments.length - 3]?.path || "")}
                >
                  <IconProvider icon="MoreHorizontal" size={16} />
                </Button>
                <span className="text-gray-400">/</span>
                <Button
                  variant="secondary"
                  size="medium"
                  className="h-6"
                  onClick={() => onNavigate?.(pathSegments[pathSegments.length - 2].path)}
                >
                  {pathSegments[pathSegments.length - 2].name}
                </Button>
                <span className="text-gray-400">/</span>
                <CurrentFolderSegment>
                  {pathSegments[pathSegments.length - 1].name}
                </CurrentFolderSegment>
              </>
            )}
          </div>

          {/* Compteur d'éléments (fichiers et dossiers) et menu « Ajouter » */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600" data-item-count>
              {getFileCountText()}
            </span>
            {showUploadButton && (
              <ButtonMenuSmall
                variant="normal"
                size="medium"
                menuAlign="end"
                actions={[
                  { value: "new-folder", label: t('fileBrowser.newFolder'), onClick: () => onCreateFolder?.() },
                  { value: "import-files", label: t('fileBrowser.importFiles'), onClick: () => onImportFiles?.() },
                  { value: "import-folders", label: t('fileBrowser.importFolders'), onClick: () => onImportFolders?.() },
                ]}
              >
                <IconProvider icon="Plus" size={14} />
                {t('fileBrowser.add')}
              </ButtonMenuSmall>
            )}
          </div>
        </div>
      </BgProvider>

      {/* Barre de sélection fixe */}
      <BgProvider value="white">
        <div
          className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 overflow-hidden"
          // Même gouttière que le tableau quand il défile lui-même.
          style={heightMode === "auto" ? undefined : { scrollbarGutter: "stable" }}
        >
          <div className="flex items-center space-x-4">
            {/* Filtre par date */}
            <Select value={dateFilter} onValueChange={handleDateFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('fileBrowser.filterByDate')} />
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
          </div>

          {/* Actions en masse, masquées sans sélection : nombre d'éléments
              sélectionnés, boutons de l'appelant, puis les mêmes boutons que
              sur les lignes, alignés sur eux (même marge droite, et même
              gouttière de barre de défilement que le tableau). */}
          {hasSelection && (actionConfig.availableActions.length > 0 || renderBulkActions) && (
            <div className="flex items-center space-x-1" data-bulk-actions>
              <span className="mr-3 text-sm text-gray-600" data-selection-count>
                {t('fileBrowser.selected', {
                  count: selectedItems.size.toString(),
                  plural: selectedItems.size > 1 ? 's' : ''
                })}
              </span>
              {renderBulkActions?.(getSelectedItems())}
              {actionConfig.availableActions.map((action) =>
                // Renommer ne s'applique qu'à un seul élément.
                renderActionButton(action, getSelectedItems(), action === "rename" && selectedItems.size > 1, "secondary")
              )}
            </div>
          )}
        </div>
      </BgProvider>

      {/* Bandeau limite atteinte */}
      {sortedFiles.length >= maxFilesLimit && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3">
          <div className="flex items-center">
            <IconProvider icon="AlertTriangle" size={16} className="text-yellow-600 mr-3" />
            <p className="text-sm text-yellow-800">
              {t('fileBrowser.limitWarning', { limit: formatNumber(maxFilesLimit) })}
            </p>
          </div>
        </div>
      )}

      {/* Tableau */}
      <BgProvider value="grey">
        <FileDropZone
          mode="overlay"
          className={tableWrapperClasses}
          data-file-drop-target
          options={fileDropOptions}
          disabled={!onFileDrop && !onFilesDrop}
          resetKey={currentPath}
          // Legacy event-based imports may handle directories themselves.
          validateDrop={Boolean(fileDropOptions || onFilesDrop)}
          onFilesDrop={(droppedFiles, event) => {
            if (onFilesDrop) return onFilesDrop(droppedFiles);
            if (event) return onFileDrop?.(event);
          }}
          onDropRejected={onFileDropRejected}
          onDropError={onFileDropError}
          destination={getCurrentFolderName()}
          language={language}
          translations={translations}
        >
          <div
            className={cn("border-t border-b border-gray-200 select-none outline-none", tableContainerClasses)}
            style={tableContainerStyle}
            ref={tableRef}
            tabIndex={0}
          >
            <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className={cn(stickyHeaderCell, "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider")} style={stickyHeaderStyle}>
                  <button
                    onClick={() => handleSort("file_name")}
                    className="flex items-center space-x-1 hover:text-gray-900 transition-colors uppercase"
                  >
                    <span>{t('fileBrowser.columnName')}</span>
                    {getSortIcon("file_name") && (
                      <IconProvider icon={getSortIcon("file_name")!} size={12} />
                    )}
                  </button>
                </th>
                <th className={cn(stickyHeaderCell, "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider")} style={stickyHeaderStyle}>
                  <button
                    onClick={() => handleSort("updated_at")}
                    className="flex items-center space-x-1 hover:text-gray-900 transition-colors uppercase"
                  >
                    <span>{t('fileBrowser.columnModified')}</span>
                    {getSortIcon("updated_at") && (
                      <IconProvider icon={getSortIcon("updated_at")!} size={12} />
                    )}
                  </button>
                </th>
                <th className={cn(stickyHeaderCell, "px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider")} style={stickyHeaderStyle}>
                  <button
                    onClick={() => handleSort("file_size")}
                    className="flex items-center space-x-1 hover:text-gray-900 transition-colors uppercase"
                  >
                    <span>{t('fileBrowser.columnSize')}</span>
                    {getSortIcon("file_size") && (
                      <IconProvider icon={getSortIcon("file_size")!} size={12} />
                    )}
                  </button>
                </th>
                <th className={cn(stickyHeaderCell, "w-48")} style={stickyHeaderStyle}></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedFiles.map((item, index) => {
                const isSelected = selectedItems.has(item.id);
                const isHovered = hoveredRow === item.id;
                const isActive = activeIndex === index;
                const isDisabled = item.disabled === true;
                const isDropTarget = dropTargetId === item.id;

                return (
                  <tr
                    key={item.id}
                    data-bg="grey"
                    className={cn(
                      "h-10 transition-colors duration-150",
                      isDisabled
                        ? "cursor-not-allowed"
                        : "cursor-pointer",
                      !isDisabled && isSelected
                        ? "bg-blue-primary text-black hover:bg-blue-primary"
                        : !isDisabled && "hover:bg-gray-50",
                      !isDisabled && isActive && !isSelected && "ring-2 ring-inset ring-blue-400",
                      // Cible de déplacement survolée : encadrement noir.
                      isDropTarget && "ring-2 ring-inset ring-black"
                    )}
                    draggable={canDragRows && !isDisabled}
                    onDragStart={(e) => handleRowDragStart(e, item, index)}
                    onDragEnd={resetRowDrag}
                    onDragOver={(e) => handleRowDragOver(e, item)}
                    onDragLeave={(e) => handleRowDragLeave(e, item)}
                    onDrop={(e) => handleRowDrop(e, item)}
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
                          {actionConfig.availableActions.map((action) => renderActionButton(action, [item]))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {sortedFiles.length === 0 && (
            <div className="flex-1 flex items-center justify-center bg-white py-12 text-gray-500">
              <p className="text-sm">{t('fileBrowser.noFilesInFolder')}</p>
            </div>
          )}
          </div>
        </FileDropZone>
      </BgProvider>

      {/* Show more items button */}
      {hasMore && sortedFiles.length < maxFilesLimit && (
        <div className="bg-white border-t border-gray-200 px-4 pt-3 flex justify-center">
          <Button
            size="medium"
            onClick={onLoadMore}
            loading={isLoadingMore}
            loadingLabel={t('fileBrowser.loading')}
            className="min-w-[200px]"
          >
            {(() => {
                // Calculer le nombre d'éléments restants à charger
                const remainingCount = totalFiles !== null && totalFiles !== undefined
                  ? totalFiles - sortedFiles.length  // Nombre exact restant si totalFiles est connu
                  : maxFilesLimit - sortedFiles.length;  // Nombre maximum restant sinon
                return t('fileBrowser.showMoreItems', {
                  count: formatNumber(remainingCount),
                  plural: remainingCount > 1 ? 's' : '',
                });
              })()}
          </Button>
        </div>
      )}

    </div>
    </TooltipProvider>
  );
};