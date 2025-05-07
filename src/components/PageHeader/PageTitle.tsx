
import React from "react";
import { ButtonCircle } from "@/components/ui/button-circle";
import { AllowedPictogram } from "@/components/ui/button-circle/types";
import { cn } from "@/lib/utils";

export interface PageTitleProps {
  title: string;
  showButton?: boolean;
  buttonIcon?: AllowedPictogram;
  onButtonClick?: () => void;
  className?: string;
  featured?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  showButton = true,
  buttonIcon = "Pencil",
  onButtonClick,
  className,
  featured = false,
}) => {
  return (
    <div className={cn(
      "flex items-center gap-2", 
      featured && "pl-5 border-l border-[#EAEAEA]", 
      className
    )}>
      <h2 className="text-base font-light text-black">{title}</h2>
      {showButton && (
        <ButtonCircle 
          icon={buttonIcon} 
          size="small" 
          onClick={onButtonClick}
          featured={featured}
        />
      )}
    </div>
  );
};

export default PageTitle;
