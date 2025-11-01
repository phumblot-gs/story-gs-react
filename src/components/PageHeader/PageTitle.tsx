
import React from "react";
import { Button } from "@/components/ui/button";
import { IconProvider } from "@/components/ui/icon-provider";
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
        <Button
          variant="secondary"
          className="p-0 w-6 h-6"
          onClick={handleBackButtonClick}
        >
          <IconProvider icon="ArrowLeft" />
        </Button>
      )}
      <div className="flex-1 min-w-0 overflow-hidden">
        <TruncatedText text={title} as="h2" className="gs-typo-h2 whitespace-nowrap" tooltipSide="bottom" />
      </div>
      {showButton && (
        <Button
          variant="secondary"
          className="p-0 w-6 h-6"
          onClick={onButtonClick}
        >
          <IconProvider icon={buttonIcon} />
        </Button>
      )}
    </HStack>
  );
};

export default PageTitle;
