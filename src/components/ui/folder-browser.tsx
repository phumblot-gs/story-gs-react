"use client";

import React, { useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonCircle } from "@/components/ui/button-circle";
import { IconProvider } from "@/components/ui/icon-provider";
import { IconName } from "@/components/ui/icons/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Types réutilisés de FileBrowser
export interface FolderItem {
  id: string;
  file_name: string;
  parent_path: string | null;
  file_size: number;
  mime_type: string | null;
  is_directory: boolean;
  created_at: string;
  updated_at: string;
}

export type SortDirection = "asc" | "desc";

export interface FolderBrowserProps {
  folders: FolderItem[];
  currentPath: string;
  labelRootFolder?: string;
  debug?: boolean;
  className?: string;
  onNavigate?: (path: string) => void;
  onFolderSelect?: (folder: FolderItem) => void;
}

interface PathSegment {
  name: string;
  path: string;
}

export const FolderBrowser: React.FC<FolderBrowserProps> = ({
  folders = [],
  currentPath = "/",
  labelRootFolder = "Mes fichiers",
  debug = false,
  className,
  onNavigate,
  onFolderSelect,
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  if (debug) {
    console.log("[FolderBrowser] folders:", folders);
    console.log("[FolderBrowser] currentPath:", currentPath);
  }

  // Trier les dossiers par nom
  const sortedFolders = useMemo(() => {
    return [...folders].sort((a, b) => {
      const aValue = a.file_name?.toLowerCase() || "";
      const bValue = b.file_name?.toLowerCase() || "";

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [folders, sortDirection]);

  // Gestion du tri
  const handleSort = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  // Obtenir l'icône de tri
  const getSortIcon = (): IconName => {
    return sortDirection === "asc" ? "ArrowUp" : "ArrowDown";
  };

  // Parse le chemin actuel pour créer les segments de navigation (même logique que FileBrowser)
  const getPathSegments = useCallback((): PathSegment[] => {
    if (currentPath === "/" || currentPath === "") {
      return [{ name: labelRootFolder, path: currentPath || "" }];
    }

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

  // Double-clic sur une ligne pour naviguer
  const handleRowDoubleClick = useCallback((folder: FolderItem) => {
    const newPath = folder.parent_path
      ? `${folder.parent_path}/${folder.file_name}`.replace(/\/+/g, "/")
      : `/${folder.file_name}`;

    if (debug) console.log("[FolderBrowser] Navigate to:", newPath);
    onNavigate?.(newPath);
  }, [onNavigate, debug]);

  // Sélection d'un dossier
  const handleSelectFolder = useCallback((folder: FolderItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (debug) console.log("[FolderBrowser] Select folder:", folder);
    onFolderSelect?.(folder);
  }, [onFolderSelect, debug]);

  return (
    <TooltipProvider>
      <div className={cn("flex flex-col bg-white", className)}>
        {/* Header avec breadcrumb (même style que FileBrowser) */}
        <div className="flex items-center justify-between py-3 px-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {/* Navigation breadcrumb (même logique que FileBrowser) */}
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

        {/* Tableau (même style que FileBrowser) */}
        <div className="w-full">
          <div className="border-t border-b border-gray-200 select-none outline-none">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <button
                      onClick={handleSort}
                      className="flex items-center space-x-1 hover:text-gray-900 transition-colors uppercase"
                    >
                      <span>NOM</span>
                      <IconProvider icon={getSortIcon()} size={12} />
                    </button>
                  </th>
                  <th className="w-48"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sortedFolders.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-12 text-gray-500">
                      <IconProvider icon="Folder" size={48} className="mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">Aucun dossier</p>
                    </td>
                  </tr>
                ) : (
                  sortedFolders.map((folder) => {
                    const isHovered = hoveredRow === folder.id;

                    return (
                      <tr
                        key={folder.id}
                        className={cn(
                          "h-12 cursor-pointer transition-colors duration-150",
                          isHovered ? "bg-gray-50" : ""
                        )}
                        onDoubleClick={() => handleRowDoubleClick(folder)}
                        onMouseEnter={() => setHoveredRow(folder.id)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td className="px-4 py-2">
                          <div className="flex items-center space-x-3">
                            <IconProvider
                              icon="Folder"
                              size={16}
                              className="text-gray-500"
                            />
                            <span className="text-sm font-medium truncate text-gray-900">
                              {folder.file_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {isHovered && (
                            <div className="flex items-center justify-end space-x-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ButtonCircle
                                    size="large"
                                    icon="ArrowRight"
                                    background="white"
                                    onClick={(e) => handleSelectFolder(folder, e)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>Sélectionner</TooltipContent>
                              </Tooltip>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
