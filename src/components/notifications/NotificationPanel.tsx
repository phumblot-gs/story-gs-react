
import React from "react";
import MediaStatus from "../MediaStatus";
import { MediaStatus as MediaStatusEnum } from "@/utils/mediaStatus";
import { cn } from "@/lib/utils";
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

/**
 * Props passed to `renderLink`. Spread them on the router's link and map `href`
 * to its destination prop, for example `({ href, ...props }) => <Link to={href} {...props} />`.
 * `onClick` must be kept: it blocks navigation for an empty or "#" link and marks the notification as read.
 */
export interface NotificationLinkProps {
  href: string;
  className: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
}

/** Renders the link around a notification, typically with the app router's Link. */
export type NotificationLinkRenderer = (props: NotificationLinkProps) => React.ReactNode;

const defaultRenderLink: NotificationLinkRenderer = ({ href, className, onClick, children }) => (
  <a href={href} className={className} onClick={onClick}>
    {children}
  </a>
);

interface NotificationPanelProps extends NotificationProps {
  onClick?: (notification_id: string) => void;
  /** Renders the link with the app router (client-side navigation). Defaults to a plain `<a href>`. */
  renderLink?: NotificationLinkRenderer;
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
  onClick,
  renderLink = defaultRenderLink
}) => {
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    // Si l'URL n'est pas valide, bloquer la redirection
    if (!redirectLink || redirectLink === "#" || redirectLink.trim() === "") {
      e.preventDefault();
    }
    
    // Appeler le callback avec l'ID de la notification s'il est défini
    if (onClick) {
      onClick(notification_id);
    }
  };

  const content = (
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
  );

  return (
    <>
      {renderLink({
        href: redirectLink,
        className: cn(
          "block no-underline text-white transition-all duration-200 group",
          !unread && "opacity-30 hover:opacity-100"
        ),
        onClick: handleClick,
        children: content
      })}
    </>
  );
};

export default NotificationPanel;
