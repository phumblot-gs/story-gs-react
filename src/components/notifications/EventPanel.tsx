
import React from "react";
import MediaStatus from "../MediaStatus";
import { MediaStatus as MediaStatusEnum } from "@/utils/mediaStatus";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  unread,
}) => {
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link 
      href={redirectLink}
      className="block no-underline text-white hover:bg-bg-black-secondary transition-all duration-200"
    >
      <div className="flex flex-row items-start p-2.5 gap-2.5 bg-bg-black">
        <MediaStatus 
          status={pictureStatus} 
          className={cn(!unread && "opacity-30")}
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-[1rem] font-light italic leading-tight m-0">{title}</h4>
          <p className="text-white text-sm font-light m-0 mt-1 truncate">{subtitle}</p>
        </div>
        <span className="text-white text-sm whitespace-nowrap">{formattedTime}</span>
      </div>
    </Link>
  );
};

export default EventPanel;
