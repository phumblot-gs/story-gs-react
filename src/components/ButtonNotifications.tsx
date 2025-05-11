
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { ButtonCircle } from "@/components/ui/button-circle";
import ActivityPanel from "./notifications/ActivityPanel";
import { NotificationProps } from "./notifications/NotificationPanel";
import { useTranslation } from "@/contexts/TranslationContext";
import { mockNotifications } from "./notifications/mockNotifications";
import { enforceNotificationLimit } from "@/utils/notificationUtils";
import { ButtonNotificationsProps, ButtonNotificationsRef } from "./notifications/types";

// Export the ref type for use in other files
export type { ButtonNotificationsRef };

const ButtonNotifications = forwardRef<ButtonNotificationsRef, ButtonNotificationsProps>(({
  notifications = mockNotifications,
  count,
  onClick,
  onMarkAllAsRead,
  onNotificationClick,
  debug = false,
  limit = 100 // Default limit is 100
}, ref) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [localNotifications, setLocalNotifications] = useState<NotificationProps[]>([]);
  const { t } = useTranslation();
  
  // Update local notifications when prop changes or limit changes
  useEffect(() => {
    if (debug) console.log("ButtonNotifications: Notifications updated or limit changed", { notificationsCount: notifications.length, limit });
    // Apply limit when setting initial notifications
    setLocalNotifications(enforceNotificationLimit(notifications, limit));
  }, [notifications, limit, debug]);
  
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
   * Adds new notifications to the panel while maintaining the maximum limit
   * Removes oldest read notifications first, then oldest unread if necessary
   * @param newNotifications Array of new notifications to add
   */
  const addNotifications = (newNotifications: NotificationProps[]) => {
    if (newNotifications.length === 0) return;
    
    if (debug) console.log("ButtonNotifications: Adding new notifications", { 
      newCount: newNotifications.length, 
      currentCount: localNotifications.length,
      limit
    });
    
    setLocalNotifications(current => {
      // Combine current notifications with new ones
      const combinedNotifications = [...current, ...newNotifications];
      
      // Apply the limit using the utility function
      return enforceNotificationLimit(combinedNotifications, limit);
    });
  };

  // Debug logging for component mount and prop changes
  React.useEffect(() => {
    if (debug) {
      console.log("ButtonNotifications: Component mounted/updated", { 
        notificationsCount: localNotifications.length,
        unreadCount,
        isPanelOpen,
        limit
      });
    }
  }, [debug, localNotifications, unreadCount, isPanelOpen, limit]);

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
