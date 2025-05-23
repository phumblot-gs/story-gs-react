
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
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
}
const PageTitle: React.FC<PageTitleProps> = ({
  title,
  showButton = true,
  buttonIcon = "Pencil",
  onButtonClick,
  className,
  featured = false,
  showBackButton = false,
  onBackButtonClick
}) => {
  return <div className={cn("flex items-center gap-2", featured && "pl-5 border-l border-[#EAEAEA]", className)}>
      {showBackButton && <ButtonCircle icon="ArrowLeft" size="large" onClick={onBackButtonClick} featured={featured} />}
      <div className="flex-1 min-w-0 overflow-hidden">
        <TruncatedText text={title} as="h2" className="text-base font-light text-black whitespace-nowrap" tooltipSide="bottom" />
      </div>
      {showButton && <ButtonCircle icon={buttonIcon} size="large" onClick={onButtonClick} featured={featured} />}
    </div>;
};
export default PageTitle;
