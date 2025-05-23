
import React from "react";
import { cn } from "@/lib/utils";
import PageTitle from "./PageTitle";
import { IconName } from "@/components/ui/icons/types";
import { useThemeValues } from "@/hooks/useThemeValues";
import BrandLogo from "./BrandLogo";
import { ButtonCircle } from "@/components/ui/button-circle";

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
    <header
      className={cn(
        "box-border flex flex-row justify-between items-center px-5 py-[10px] pb-[13px] gap-5 w-full h-[53px] bg-white relative",
        className
      )}
    >
      {/* Left Side - with flex-shrink to allow truncation */}
      <div className="flex items-center gap-5 flex-shrink overflow-hidden">
        {showBackButton && (
          <ButtonCircle 
            icon="ArrowLeft" 
            size="large" 
            background="white"
            onClick={onBackButtonClick}
            className="flex-shrink-0"
          />
        )}
        {logo ? (
          <div className="w-[25px] flex-shrink-0">{logo}</div>
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
        />
      </div>
      
      {/* Center Side */}
      {centerContent && (
        <div className="flex justify-center flex-shrink-0">
          {centerContent}
        </div>
      )}
      
      {/* Right Side */}
      {rightContent && (
        <div className="flex items-center gap-3 flex-shrink-0">
          {rightContent}
        </div>
      )}

      {/* Gradient border at bottom using CSS variables for customization */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-header-gradient-start to-header-gradient-end",
        isIdle && "bg-size-200 animate-gradient-flow"
      )}></div>
    </header>
  );
};

export default PageHeader;
