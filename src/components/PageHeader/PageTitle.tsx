
import React from "react";
import { ButtonCircle } from "@/components/ui/button-circle";
import { IconName } from "@/components/ui/icons/types";
import { cn } from "@/lib/utils";

export interface PageTitleProps {
  title: string;
  showButton?: boolean;
  buttonIcon?: IconName;
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
          size="large" 
          onClick={onButtonClick}
          featured={featured}
        />
      )}
    </div>
  );
};

export default PageTitle;
