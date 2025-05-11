
import { NotificationProps } from "@/components/notifications/NotificationPanel";

/**
 * Enforces the notification limit by removing older notifications
 * @param notifications The current notifications array
 * @param limit Maximum number of notifications to keep
 * @returns Filtered notifications array respecting the limit
 */
export const enforceNotificationLimit = (
  notifications: NotificationProps[], 
  limit: number
): NotificationProps[] => {
  if (notifications.length <= limit) {
    return notifications;
  }
  
  // Separate read and unread notifications
  const read = notifications.filter(n => !n.unread);
  const unread = notifications.filter(n => n.unread);
  
  // Sort both arrays by date (oldest first)
  const sortByDate = (a: NotificationProps, b: NotificationProps) => 
    new Date(a.date).getTime() - new Date(b.date).getTime();
  
  const sortedRead = [...read].sort(sortByDate);
  const sortedUnread = [...unread].sort(sortByDate);
  
  // Calculate how many items we need to remove
  const excessCount = notifications.length - limit;
  
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
};
