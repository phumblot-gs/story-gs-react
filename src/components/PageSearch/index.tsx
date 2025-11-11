import React from "react";
import { cn } from "@/lib/utils";
import { Layout, HStack } from "@/components/layout";

export interface PageSearchProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  /** Largeur maximale du contenu de gauche (ex: "max-w-md", "max-w-lg", etc.) */
  leftContentMaxWidth?: string;
}

const PageSearch: React.FC<PageSearchProps> = ({
  leftContent,
  rightContent,
  className,
  leftContentMaxWidth = "max-w-lg",
}) => {
  return (
    <Layout
      bg="grey"
      className={cn(
        "border-b",
        "flex items-center justify-between gap-10",
        "px-4 py-0",
        className
      )}
      style={{ borderBottomColor: "var(--layout-w-color-border-default)" }}
    >
      {/* Left Side */}
      {leftContent && (
        <HStack 
          gap={2} 
          align="center" 
          className={cn("py-2 flex-1 min-w-0", leftContentMaxWidth)}
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

