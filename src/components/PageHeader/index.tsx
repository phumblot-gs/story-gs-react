
import React from "react";
import { cn } from "@/lib/utils";
import PageTitle from "./PageTitle";
import { IconName } from "@/components/ui/icons/types";
import { useThemeValues } from "@/hooks/useThemeValues";
import BrandLogo from "./BrandLogo";

export interface PageHeaderProps {
  logo?: React.ReactNode;
  title: string;
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
      {/* Removed : min-w-[1280px] */}
      className={cn(
        "box-border flex flex-row justify-between items-center px-5 py-[10px] pb-[13px] gap-5 w-full h-[53px] bg-white relative",
        className
      )}
    >
      {/* Left Side */}
      <div className="flex items-center gap-5">
        {logo ? (
          <div className="w-[25px]">{logo}</div>
        ) : (
          <BrandLogo logo={themeLogo} width={25} height={14} />
        )}
        <PageTitle 
          title={title} 
          showButton={showTitleButton} 
          buttonIcon={titleButtonIcon}
          onButtonClick={onTitleButtonClick}
          featured={true}
        />
      </div>
      
      {/* Center Side */}
      {centerContent && (
        <div className="flex justify-center">
          {centerContent}
        </div>
      )}
      
      {/* Right Side */}
      {rightContent && (
        <div className="flex items-center gap-3">
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
