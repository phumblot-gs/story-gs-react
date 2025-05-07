
import React from "react";
import { cn } from "@/lib/utils";
import PageTitle from "./PageTitle";
import { AllowedPictogram } from "@/components/ui/button-circle/types";

export interface PageHeaderProps {
  logo?: React.ReactNode;
  title: string;
  showTitleButton?: boolean;
  titleButtonIcon?: AllowedPictogram;
  onTitleButtonClick?: () => void;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
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
}) => {
  return (
    <header
      className={cn(
        "box-border flex flex-row justify-between items-center px-5 py-[10px] pb-[13px] gap-5 w-full min-w-[1280px] h-[53px] bg-white relative",
        className
      )}
    >
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {logo && <div className="w-[25px]">{logo}</div>}
        <PageTitle 
          title={title} 
          showButton={showTitleButton} 
          buttonIcon={titleButtonIcon}
          onButtonClick={onTitleButtonClick}
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

      {/* Gradient border at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#74D2D8] to-[#EBED8C]"></div>
    </header>
  );
};

export default PageHeader;
