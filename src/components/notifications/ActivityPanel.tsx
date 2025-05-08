
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

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* No SheetOverlay here - it's handled in SheetContent */}
      
      <SheetContent 
        side="right" 
        className="w-[350px] bg-[#000000e6] border-none p-0 top-[50px] h-[calc(100%-50px)]"
        topOffset="50px" // Pass topOffset to SheetContent
      >
        {/* Add SheetTitle for accessibility */}
        <SheetTitle className="sr-only">Notifications Panel</SheetTitle>
        {/* Add SheetDescription for accessibility */}
        <SheetDescription className="sr-only">Liste des notifications et événements récents</SheetDescription>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <SheetClose asChild>
                <ButtonCircle 
                  icon="X" 
                  size="large" 
                  background="black" 
                  aria-label="Close"
                />
              </SheetClose>
              <h3 className="text-white text-base font-normal m-0">
                {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}
              </h3>
            </div>
            
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-white hover:underline text-sm"
              >
                marquer lu
              </button>
            )}
          </div>
          
          {/* Event list - Apply padding: 50px top, left, bottom and 20px right */}
          <div className="flex-1 overflow-auto pl-[50px] pr-[20px] pt-[50px] pb-[50px]">
            {Object.entries(eventsByDate).map(([dateStr, dateEvents]) => (
              <div key={dateStr} className="mb-4">
                <div className="py-2 text-white text-sm">
                  {dateStr}
                </div>
                <div className="space-y-[10px]"> {/* Increased spacing between EventPanels to 10px */}
                  {dateEvents.map((event, index) => (
                    <EventPanel
                      key={`${dateStr}-${index}`}
                      {...event}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ActivityPanel;
