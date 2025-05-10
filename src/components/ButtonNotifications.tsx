
import React, { useState } from "react";
import { ButtonCircle } from "@/components/ui/button-circle";
import ActivityPanel from "./notifications/ActivityPanel";
import { NotificationProps, NotificationType } from "./notifications/EventPanel";
import { MediaStatus } from "@/utils/mediaStatus";
import { useTranslation } from "@/contexts/TranslationContext";

// Mock data for demonstration
const mockNotifications: NotificationProps[] = [
  {
    notification_id: "mock-notification-1",
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
    type: "comment",
    redirectLink: "#",
    date: new Date(2022, 11, 2, 10, 30), // December 2, 2022 10:30
    unread: true
  },
  {
    notification_id: "mock-notification-2",
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.SELECTED,
    type: "comment",
    redirectLink: "#",
    date: new Date(2022, 11, 2, 10, 30),
    unread: true
  },
  {
    notification_id: "mock-notification-3",
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.REFUSED_1,
    type: "transfer",
    redirectLink: "#",
    date: new Date(2022, 11, 2, 10, 30),
    unread: true
  },
  {
    notification_id: "mock-notification-4",
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.VALIDATED,
    type: "comment",
    redirectLink: "#",
    date: new Date(2022, 11, 2, 10, 30),
    unread: true
  },
  {
    notification_id: "mock-notification-5",
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.TO_RESHOOT,
    type: "other",
    redirectLink: "#",
    date: new Date(2022, 11, 2, 10, 30),
    unread: true
  },
  {
    notification_id: "mock-notification-6",
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.READY_TO_BROADCAST,
    type: "other",
    redirectLink: "#",
    date: new Date(2022, 11, 1, 10, 30), // December 1, 2022 10:30
    unread: false
  },
  {
    notification_id: "mock-notification-7",
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.BROADCAST,
    type: "transfer",
    redirectLink: "#",
    date: new Date(2022, 11, 1, 10, 30),
    unread: false
  },
  {
    notification_id: "mock-notification-8",
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
  notifications?: NotificationProps[];
  count?: number;
  onClick?: () => void;
  onMarkAllAsRead?: (notifications: NotificationProps[]) => void;
  onNotificationClick?: (notification_id: string) => void;
  debug?: boolean; // Added debug prop
}

const ButtonNotifications: React.FC<ButtonNotificationsProps> = ({
  notifications = mockNotifications,
  count,
  onClick,
  onMarkAllAsRead,
  onNotificationClick,
  debug = false // Default to false
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { t } = useTranslation();
  
  // Use provided count or calculate from notifications
  const unreadCount = count !== undefined ? count : notifications.filter(notification => notification.unread).length;
  
  const togglePanel = () => {
    if (debug) console.log("ButtonNotifications: Panel toggled", { isPanelOpen: !isPanelOpen, unreadCount });
    setIsPanelOpen(prev => !prev);
    if (onClick) {
      onClick();
    }
  };

  // Debug logging for component mount and prop changes
  React.useEffect(() => {
    if (debug) {
      console.log("ButtonNotifications: Component mounted/updated", { 
        notificationsCount: notifications.length,
        unreadCount,
        isPanelOpen
      });
    }
  }, [debug, notifications, unreadCount, isPanelOpen]);

  return (
    <>
      <ButtonCircle 
        icon="Bell" 
        size="large" 
        background="white" 
        indicator={unreadCount > 0}
        featured={true}
        onClick={togglePanel}
        debug={debug} // Pass debug mode to ButtonCircle
        aria-label={`${t("notifications.title")}${unreadCount > 0 ? ` (${unreadCount} ${t("notifications.unread")})` : ''}`}
      />
      
      <ActivityPanel 
        isOpen={isPanelOpen} 
        onClose={() => {
          if (debug) console.log("ButtonNotifications: Panel closed");
          setIsPanelOpen(false);
        }} 
        notifications={notifications}
        onMarkAllAsRead={(updatedNotifications) => {
          if (debug) console.log("ButtonNotifications: All notifications marked as read", updatedNotifications);
          onMarkAllAsRead?.(updatedNotifications);
        }}
        onNotificationClick={(notificationId) => {
          if (debug) console.log("ButtonNotifications: Notification clicked", { notificationId });
          onNotificationClick?.(notificationId);
        }}
        debug={debug} // Pass debug mode to ActivityPanel
      />
    </>
  );
};

export default ButtonNotifications;
