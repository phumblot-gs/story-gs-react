
import React, { useState } from "react";
import { ButtonCircle } from "@/components/ui/button-circle";
import ActivityPanel from "./notifications/ActivityPanel";
import { EventProps } from "./notifications/EventPanel";
import { MediaStatus } from "@/utils/mediaStatus";

// Mock data for demonstration, in a real app this would come from props or a data fetching hook
const mockEvents: EventProps[] = [
  {
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
    type: "comment",
    redirectLink: "#",
    date: new Date(2022, 11, 2, 10, 30), // December 2, 2022 10:30
    unread: true
  },
  {
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.SELECTED,
    type: "comment",
    redirectLink: "#",
    date: new Date(2022, 11, 2, 10, 30),
    unread: true
  },
  {
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.REFUSED_1,
    type: "transfer",
    redirectLink: "#",
    date: new Date(2022, 11, 2, 10, 30),
    unread: true
  },
  {
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.VALIDATED,
    type: "comment",
    redirectLink: "#",
    date: new Date(2022, 11, 2, 10, 30),
    unread: true
  },
  {
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.TO_RESHOOT,
    type: "other",
    redirectLink: "#",
    date: new Date(2022, 11, 2, 10, 30),
    unread: true
  },
  {
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.READY_TO_BROADCAST,
    type: "other",
    redirectLink: "#",
    date: new Date(2022, 11, 1, 10, 30), // December 1, 2022 10:30
    unread: false
  },
  {
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.BROADCAST,
    type: "transfer",
    redirectLink: "#",
    date: new Date(2022, 11, 1, 10, 30),
    unread: false
  },
  {
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.ERROR_DURING_BROADCAST,
    type: "comment",
    redirectLink: "#",
    date: new Date(2022, 11, 1, 10, 30),
    unread: false
  },
];

interface ButtonNotificationsProps {
  events?: EventProps[];
}

const ButtonNotifications: React.FC<ButtonNotificationsProps> = ({
  events = mockEvents // Use mock data by default, but allow overriding via props
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const unreadCount = events.filter(event => event.unread).length;
  
  const togglePanel = () => {
    setIsPanelOpen(prev => !prev);
  };

  return (
    <>
      <ButtonCircle 
        icon="Bell" 
        size="large" 
        background="white" 
        indicator={unreadCount > 0}
        onClick={togglePanel}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
      />
      
      <ActivityPanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        events={events}
      />
    </>
  );
};

export default ButtonNotifications;
