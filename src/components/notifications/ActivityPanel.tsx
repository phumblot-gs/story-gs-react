
import React, { useState } from "react";
import { Sheet, SheetContent, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ButtonCircle } from "@/components/ui/button-circle";
import EventPanel, { EventProps } from "./EventPanel";
import { format } from "date-fns";
export interface ActivityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventProps[];
}
const ActivityPanel: React.FC<ActivityPanelProps> = ({
  isOpen,
  onClose,
  events
}) => {
  const [localEvents, setLocalEvents] = useState<EventProps[]>(events);
  const unreadCount = localEvents.filter(event => event.unread).length;

  // Group events by date (using date string as key)
  const eventsByDate = localEvents.reduce((acc: Record<string, EventProps[]>, event) => {
    const dateStr = format(event.date, 'EEEE d MMMM yyyy');
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
  return <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent side="right" className="w-[400px] bg-black border-none p-0 top-[50px] h-[calc(100%-50px)]" topOffset="50px">
        <SheetTitle className="sr-only">Notifications Panel</SheetTitle>
        <SheetDescription className="sr-only">Liste des notifications et événements récents</SheetDescription>
        
        <div className="flex flex-col h-full">
          {/* ButtonCircle moved to its own line with p-2 class */}
          <div className="p-2">
            <SheetClose asChild>
              <ButtonCircle icon="X" size="large" background="black" aria-label="Close" />
            </SheetClose>
          </div>
          
          {/* Header with adjusted paddings - removed pt-[50px] */}
          <div className="flex items-center justify-between pl-[50px] pr-[20px]">
            <div className="flex items-center">
              <h3 className="text-white text-base font-normal m-0">
                {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}
              </h3>
            </div>
            
            {unreadCount > 0 && <button onClick={markAllAsRead} className="text-white hover:underline text-xs">
                marquer lu
              </button>}
          </div>
          
          {/* Event list with flexbox layout */}
          <div className="flex-1 overflow-auto pl-[50px] pr-[20px] pt-[20px] pb-[50px]">
            {Object.entries(eventsByDate).map(([dateStr, dateEvents]) => <div key={dateStr} className="mb-4">
                <div className="py-2 text-grey-stronger text-sm opacity-75">
                  {dateStr}
                </div>
                <div className="flex flex-col gap-[10px]">
                  {dateEvents.map((event, index) => <EventPanel key={`${dateStr}-${index}`} {...event} />)}
                </div>
              </div>)}
          </div>
        </div>
      </SheetContent>
    </Sheet>;
};
export default ActivityPanel;
