import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { ButtonCircle } from "@/components/ui/button-circle";
import ActivityPanel from "./notifications/ActivityPanel";
import { NotificationProps, NotificationType } from "./notifications/NotificationPanel";
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
  debug?: boolean;
}

// Define the ref interface explicitly
export interface ButtonNotificationsRef {
  addNotifications: (newNotifications: NotificationProps[]) => void;
}

const ButtonNotifications = forwardRef<ButtonNotificationsRef, ButtonNotificationsProps>(({
  notifications = mockNotifications,
  count,
  onClick,
  onMarkAllAsRead,
  onNotificationClick,
  debug = false
}, ref) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<NotificationProps[]>(notifications);
  const { t } = useTranslation();
  
  // Update local notifications when prop changes
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);
  
  // Use provided count or calculate from local notifications
  const unreadCount = count !== undefined ? count : localNotifications.filter(notification => notification.unread).length;
  
  const togglePanel = () => {
    if (debug) console.log("ButtonNotifications: Panel toggled", { isPanelOpen: !isPanelOpen, unreadCount });
    setIsPanelOpen(prev => !prev);
    if (onClick) {
      onClick();
    }
  };

  const handleMarkAllAsRead = (updatedNotifications: NotificationProps[]) => {
    if (debug) console.log("ButtonNotifications: All notifications marked as read", updatedNotifications);
    setLocalNotifications(updatedNotifications);
    if (onMarkAllAsRead) {
      onMarkAllAsRead(updatedNotifications);
    }
  };

  const handleNotificationClick = (notificationId: string) => {
    // Update the local notification to mark as read
    const updatedNotifications = localNotifications.map(notification => 
      notification.notification_id === notificationId && notification.unread 
        ? { ...notification, unread: false } 
        : notification
    );
    
    setLocalNotifications(updatedNotifications);
    
    if (debug) console.log("ButtonNotifications: Notification clicked", { 
      notificationId,
      updatedNotifications
    });
    
    // Pass to parent callback
    if (onNotificationClick) {
      onNotificationClick(notificationId);
    }
  };

  /**
   * Adds new notifications to the panel while maintaining a maximum of 100 items
   * Removes oldest read notifications first, then oldest unread if necessary
   * @param newNotifications Array of new notifications to add
   */
  const addNotifications = (newNotifications: NotificationProps[]) => {
    if (newNotifications.length === 0) return;
    
    if (debug) console.log("ButtonNotifications: Adding new notifications", newNotifications);
    
    setLocalNotifications(current => {
      // Combine current notifications with new ones
      const combinedNotifications = [...current, ...newNotifications];
      
      // If we're under the limit, no need to remove any
      if (combinedNotifications.length <= 100) {
        return combinedNotifications;
      }
      
      // We need to trim the list to 100 items
      // First, separate read and unread notifications
      const read = combinedNotifications.filter(n => !n.unread);
      const unread = combinedNotifications.filter(n => n.unread);
      
      // Sort both arrays by date (oldest first)
      const sortByDate = (a: NotificationProps, b: NotificationProps) => 
        new Date(a.date).getTime() - new Date(b.date).getTime();
      
      const sortedRead = [...read].sort(sortByDate);
      const sortedUnread = [...unread].sort(sortByDate);
      
      // Calculate how many items we need to remove
      const excessCount = combinedNotifications.length - 100;
      
      let result: NotificationProps[] = [];
      
      // If we have enough read notifications to remove
      if (sortedRead.length >= excessCount) {
        // Remove oldest read notifications
        const remainingRead = sortedRead.slice(excessCount);
        result = [...remainingRead, ...sortedUnread];
      } else {
        // Remove all read notifications and some unread ones if necessary
        const unreadToRemove = excessCount - sortedRead.length;
        const remainingUnread = sortedUnread.slice(unreadToRemove);
        result = [...remainingUnread];
      }
      
      // Sort the final array by date (newest first) for display
      return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
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

  // Expose the addNotifications method to parent components via ref
  useImperativeHandle(ref, () => ({
    addNotifications,
  }), []);

  return (
    <>
      <ButtonCircle 
        icon="Bell" 
        size="large" 
        background="white" 
        indicator={unreadCount > 0}
        featured={true}
        onClick={togglePanel}
        debug={debug}
        aria-label={`${t("notifications.title")}${unreadCount > 0 ? ` (${unreadCount} ${t("notifications.unread")})` : ''}`}
      />
      
      <ActivityPanel 
        isOpen={isPanelOpen} 
        onClose={() => {
          if (debug) console.log("ButtonNotifications: Panel closed");
          setIsPanelOpen(false);
        }} 
        notifications={localNotifications}
        onMarkAllAsRead={handleMarkAllAsRead}
        onNotificationClick={handleNotificationClick}
        debug={debug}
      />
    </>
  );
});

ButtonNotifications.displayName = "ButtonNotifications";

export default ButtonNotifications;
