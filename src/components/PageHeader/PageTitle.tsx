
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
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  showButton = true,
  buttonIcon = "Pencil",
  onButtonClick,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <h2 className="text-base font-light text-black">{title}</h2>
      {showButton && (
        <ButtonCircle 
          icon={buttonIcon} 
          size="small" 
          onClick={onButtonClick}
        />
      )}
    </div>
  );
};

export default PageTitle;
