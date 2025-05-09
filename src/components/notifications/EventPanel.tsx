import React from "react";
import MediaStatus from "../MediaStatus";
import { MediaStatus as MediaStatusEnum } from "@/utils/mediaStatus";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
export type NotificationType = "comment" | "transfer" | "other";
export interface EventProps {
  title: string;
  subtitle: string;
  pictureStatus: MediaStatusEnum;
  type: NotificationType;
  redirectLink: string;
  date: Date;
  unread: boolean;
}
const EventPanel: React.FC<EventProps> = ({
  title,
  subtitle,
  pictureStatus,
  type,
  redirectLink,
  date,
  unread
}) => {
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });
  return <Link to={redirectLink} className="block no-underline text-white transition-all duration-200 group">
      <div className="flex items-start p-2.5 gap-2.5 bg-black-secondary">
        <MediaStatus status={pictureStatus} className={cn(!unread && "opacity-30")} />
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex justify-between items-start">
            <h4 className="text-white text-sm font-medium leading-tight m-0 truncate">{title}</h4>
          </div>
          <div className="flex justify-between items-end mt-1">
            <p className="text-white text-xs font-light m-0 truncate group-hover:underline">{subtitle}</p>
            <span className="text-grey-stronger text-xs whitespace-nowrap ml-2 shrink-0">
              {formattedTime}
            </span>
          </div>
        </div>
      </div>
    </Link>;
};
export default EventPanel;