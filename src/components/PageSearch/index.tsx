import React from "react";
import { cn } from "@/lib/utils";
import { Layout, HStack } from "@/components/layout";

export interface PageSearchProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
}

const PageSearch: React.FC<PageSearchProps> = ({
  leftContent,
  rightContent,
  className,
}) => {
  return (
    <Layout
      bg="grey"
      className={cn(
        "border-b border-grey-stronger",
        "flex items-center justify-between gap-10",
        "px-4 py-0",
        className
      )}
    >
      {/* Left Side */}
      {leftContent && (
        <HStack gap={2} align="center" className="py-3.5">
          {leftContent}
        </HStack>
      )}

      {/* Right Side */}
      {rightContent && (
        <HStack gap={2} align="center" className="justify-end">
          {rightContent}
        </HStack>
      )}
    </Layout>
  );
};

PageSearch.displayName = "PageSearch";

export default PageSearch;

