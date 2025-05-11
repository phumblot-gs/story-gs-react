
import React from "react";
import { ButtonCircle } from "@/components/ui/button-circle";
import { IconName } from "@/components/ui/icons/types";
import { cn } from "@/lib/utils";
import { TruncatedText } from "@/components/ui/truncated-text";

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
      {/* Remplacé h2 par TruncatedText */}
      <TruncatedText 
        text={title}
        as="h2" 
        className="text-base font-light text-black whitespace-nowrap max-w-[250px]"
        tooltipSide="bottom"
      />
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
