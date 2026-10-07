import React from "react";
import { cn } from "@/lib/utils";
import { Layout, HStack } from "@/components/layout";

export interface PageSearchProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  /**
   * Largeur maximale du contenu de gauche (ex: "max-w-md", "max-w-lg").
   * Aucune par défaut : le contenu de gauche occupe toute la place disponible.
   */
  leftContentMaxWidth?: string;
  /**
   * Décale le contenu de gauche de 3px vers la gauche, pour l'aligner
   * verticalement sur les cases à cocher d'une ContactSheetReference placée
   * dessous. Désactivé par défaut.
   */
  alignWithContactSheet?: boolean;
}

const PageSearch: React.FC<PageSearchProps> = ({
  leftContent,
  rightContent,
  className,
  leftContentMaxWidth,
  alignWithContactSheet = false,
}) => {
  return (
    <Layout
      bg="grey"
      className={cn(
        "border-b",
        "flex items-center justify-between gap-10",
        "px-4 py-4",
        className
      )}
      style={{ borderBottomColor: "var(--layout-w-color-border-default)" }}
    >
      {/* Left Side */}
      {leftContent && (
        <HStack 
          gap={2} 
          align="center" 
          className={cn(
            "flex-1 min-w-0",
            alignWithContactSheet && "-ml-[3px]",
            leftContentMaxWidth
          )}
        >
          {leftContent}
        </HStack>
      )}

      {/* Right Side */}
      {rightContent && (
        <HStack gap={2} align="center" className="justify-end flex-shrink-0">
          {rightContent}
        </HStack>
      )}
    </Layout>
  );
};

PageSearch.displayName = "PageSearch";

export default PageSearch;

