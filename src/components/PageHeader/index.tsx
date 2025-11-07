
import React from "react";
import { cn } from "@/lib/utils";
import PageTitle from "./PageTitle";
import { IconName } from "@/components/ui/icons/types";
import { useThemeValues } from "@/hooks/useThemeValues";
import BrandLogo from "./BrandLogo";
import { Layout, HStack } from "@/components/layout";

export interface PageHeaderProps {
  logo?: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  showTitleButton?: boolean;
  titleButtonIcon?: IconName;
  onTitleButtonClick?: () => void;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  isIdle?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  logo,
  title,
  showBackButton = false,
  onBackButtonClick,
  showTitleButton = true,
  titleButtonIcon = "Pencil",
  onTitleButtonClick,
  centerContent,
  rightContent,
  className,
  isIdle = false,
}) => {
  const { logo: themeLogo } = useThemeValues();

  return (
    <Layout
      bg="white"
      as="header"
      className={cn(
        "box-border w-full relative",
        className
      )}
    >
      <HStack
        justify="between"
        align="center"
        className="px-4 py-3"
      >
        {/* Left Side - with flex-shrink to allow truncation */}
        <HStack gap={4} align="center" className="flex-shrink overflow-hidden">
          {logo ? (
            <div className="w-5 flex-shrink-0">{logo}</div>
          ) : (
            <BrandLogo logo={themeLogo} width={25} height={14} className="flex-shrink-0" />
          )}
          <PageTitle
            title={title}
            showButton={showTitleButton}
            buttonIcon={titleButtonIcon}
            onButtonClick={onTitleButtonClick}
            featured={true}
            className="flex-shrink min-w-0"
            showBackButton={showBackButton}
            onBackButtonClick={onBackButtonClick}
          />
        </HStack>

        {/* Center Side */}
        {centerContent && (
          <div className="flex justify-center flex-shrink-0">
            {centerContent}
          </div>
        )}

        {/* Right Side */}
        {rightContent && (
          <HStack gap={2} align="center" className="flex-shrink-0">
            {rightContent}
          </HStack>
        )}
      </HStack>

      {/* Gradient border at bottom using CSS variables for customization */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-header-gradient-start to-header-gradient-end",
        isIdle && "bg-size-200 animate-gradient-flow"
      )} />
    </Layout>
  );
};

export default PageHeader;
