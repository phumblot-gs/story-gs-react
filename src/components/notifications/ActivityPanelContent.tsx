
import React, { useState } from "react";
import { ButtonCircle } from "@/components/ui/button-circle";
import EventPanel, { EventProps } from "./EventPanel";
import { useTranslation } from "@/contexts/TranslationContext";
import { formatDateForLocale } from "@/utils/translations";

interface ActivityPanelContentProps {
  events: EventProps[];
  onClose?: () => void;
}

/**
 * A component that shows only the content of the ActivityPanel without the Sheet wrapper.
 * Intended for use in Storybook to avoid the Sheet overlay taking the full screen.
 */
const ActivityPanelContent: React.FC<ActivityPanelContentProps> = ({
  events,
  onClose,
}) => {
  const [localEvents, setLocalEvents] = useState<EventProps[]>(events);
  const unreadCount = localEvents.filter(event => event.unread).length;
  const { t, currentLanguage } = useTranslation();

  // Group events by date (using date string as key)
  const eventsByDate = localEvents.reduce((acc: Record<string, EventProps[]>, event) => {
    // Format date based on current language
    const dateStr = formatDateForLocale(event.date, 'EEEE d MMMM yyyy', currentLanguage.code);
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(event);
    return acc;
  }, {});

  const markAllAsRead = () => {
    const updatedEvents = localEvents.map(event => ({
      ...event,
      unread: false
    }));
    setLocalEvents(updatedEvents);
  };

  return (
    <div className="w-[400px] bg-black border-none p-0 h-[600px] overflow-hidden">
      <div className="flex flex-col h-full">
        {/* ButtonCircle in its own line with p-2 class */}
        <div className="p-2">
          <ButtonCircle 
            icon="X" 
            size="large" 
            background="black" 
            aria-label="Close" 
            onClick={onClose}
          />
        </div>
        
        {/* Header with adjusted paddings */}
        <div className="flex items-center justify-between pl-[50px] pr-[20px]">
          <div className="flex items-center">
            <h3 className="text-white text-base font-normal m-0">
              {unreadCount === 0 
                ? t("notifications.upToDate")
                : unreadCount === 1
                  ? t("notifications.oneUnread")
                  : t("notifications.multipleUnread", { count: unreadCount })
              }
            </h3>
          </div>
          
          {unreadCount > 0 && 
            <button 
              onClick={markAllAsRead} 
              className="text-white hover:underline text-xs"
            >
              {t("notifications.markAsRead")}
            </button>
          }
        </div>
        
        {/* Event list with flexbox layout */}
        <div className="flex-1 overflow-auto pl-[50px] pr-[20px] pt-[20px] pb-[50px]">
          {Object.entries(eventsByDate).map(([dateStr, dateEvents]) => (
            <div key={dateStr} className="mb-4">
              <div className="py-2 text-grey-stronger text-sm opacity-75">
                {dateStr}
              </div>
              <div className="flex flex-col gap-[10px]">
                {dateEvents.map((event, index) => (
                  <EventPanel key={`${dateStr}-${index}`} {...event} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityPanelContent;
