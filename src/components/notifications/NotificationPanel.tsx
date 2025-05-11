
import React from "react";
import MediaStatus from "../MediaStatus";
import { MediaStatus as MediaStatusEnum } from "@/utils/mediaStatus";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { TruncatedText } from "@/components/ui/truncated-text";

export type NotificationType = "comment" | "transfer" | "other";

export interface NotificationProps {
  notification_id: string;
  title: string;
  subtitle: string;
  pictureStatus: MediaStatusEnum;
  type: NotificationType;
  redirectLink: string;
  date: Date;
  unread: boolean;
}

interface NotificationPanelProps extends NotificationProps {
  onClick?: (notification_id: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notification_id,
  title,
  subtitle,
  pictureStatus,
  type,
  redirectLink,
  date,
  unread,
  onClick
}) => {
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });

  const handleClick = (e: React.MouseEvent) => {
    // Si l'URL n'est pas valide, bloquer la redirection
    if (!redirectLink || redirectLink === "#" || redirectLink.trim() === "") {
      e.preventDefault();
    }
    
    // Appeler le callback avec l'ID de la notification s'il est défini
    if (onClick) {
      onClick(notification_id);
    }
  };

  return (
    <Link 
      to={redirectLink} 
      className={cn(
        "block no-underline text-white transition-all duration-200 group", 
        !unread && "opacity-30 hover:opacity-100"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start p-2.5 gap-2.5 bg-black-secondary">
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 max-w-full">
              <MediaStatus status={pictureStatus} />
              <TruncatedText
                as="h4"
                text={title}
                className="text-white text-sm font-medium leading-tight m-0"
                tooltipClassName="bg-black-secondary border border-grey-stronger"
              />
            </div>
          </div>
          <div className="flex justify-between items-end mt-1 pl-5">
            <TruncatedText
              text={subtitle}
              className="text-white text-xs font-light m-0 group-hover:underline"
              tooltipClassName="bg-black-secondary border border-grey-stronger"
              tooltipSide="bottom"
            />
            <span className="text-grey-stronger text-xs whitespace-nowrap ml-2 shrink-0">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NotificationPanel;
