import React, { createContext, useContext, useState, useCallback } from "react";

type MenuId = string | null;

interface ThumbnailMenuContextType {
  /** ID du menu actuellement ouvert */
  openMenuId: MenuId;
  /** Ouvrir un menu (ferme automatiquement les autres) */
  openMenu: (menuId: string) => void;
  /** Fermer le menu actuellement ouvert */
  closeMenu: () => void;
  /** Vérifier si un menu spécifique est ouvert */
  isMenuOpen: (menuId: string) => boolean;
  /** Callback pour gérer le changement d'état d'un menu */
  handleMenuOpenChange: (menuId: string, open: boolean) => void;
}

const ThumbnailMenuContext = createContext<ThumbnailMenuContextType | null>(null);

export const ThumbnailMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openMenuId, setOpenMenuId] = useState<MenuId>(null);

  const openMenu = useCallback((menuId: string) => {
    setOpenMenuId(menuId);
  }, []);

  const closeMenu = useCallback(() => {
    setOpenMenuId(null);
  }, []);

  const isMenuOpen = useCallback((menuId: string) => {
    return openMenuId === menuId;
  }, [openMenuId]);

  const handleMenuOpenChange = useCallback((menuId: string, open: boolean) => {
    if (open) {
      setOpenMenuId(menuId);
    } else if (openMenuId === menuId) {
      setOpenMenuId(null);
    }
  }, [openMenuId]);

  return (
    <ThumbnailMenuContext.Provider value={{ openMenuId, openMenu, closeMenu, isMenuOpen, handleMenuOpenChange }}>
      {children}
    </ThumbnailMenuContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte de menu du Thumbnail.
 * Retourne null si utilisé en dehors d'un ThumbnailMenuProvider (mode non contrôlé).
 */
export const useThumbnailMenu = () => {
  return useContext(ThumbnailMenuContext);
};

/**
 * Hook pour connecter un composant de menu au contexte Thumbnail.
 * Si le contexte n'est pas disponible, retourne des valeurs par défaut pour le mode non contrôlé.
 */
export const useThumbnailMenuControl = (menuId: string) => {
  const context = useThumbnailMenu();

  if (!context) {
    // Mode non contrôlé - pas de contexte
    return {
      isOpen: undefined,
      onOpenChange: undefined,
    };
  }

  return {
    isOpen: context.isMenuOpen(menuId),
    onOpenChange: (open: boolean) => context.handleMenuOpenChange(menuId, open),
  };
};
