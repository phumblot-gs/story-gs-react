
import React from "react";
import { ButtonCircle } from "@/components/ui/button-circle";
import { IconName } from "@/components/ui/icons/types";
import { cn } from "@/lib/utils";
import { TruncatedText } from "@/components/ui/truncated-text";
import { HStack } from "@/components/layout";

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
  const handleBackButtonClick = () => {
    if (onBackButtonClick) {
      onBackButtonClick();
    } else {
      window.history.back();
    }
  };

  return (
    <HStack
      gap={2}
      align="center"
      className={cn(
        featured && "pl-5 border-l border-grey",
        className
      )}
    >
      {showBackButton && (
        <ButtonCircle
          icon="ArrowLeft"
          size="large"
          onClick={handleBackButtonClick}
          featured={featured}
          background="white"
        />
      )}
      <div className="flex-1 min-w-0 overflow-hidden">
        <TruncatedText text={title} as="h2" className="gs-typo-h2 whitespace-nowrap" tooltipSide="bottom" />
      </div>
      {showButton && <ButtonCircle icon={buttonIcon} size="large" onClick={onButtonClick} featured={featured} />}
    </HStack>
  );
};

export default PageTitle;
