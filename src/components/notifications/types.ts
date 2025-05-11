
import { NotificationProps } from "./NotificationPanel";

export interface ButtonNotificationsProps {
  notifications?: NotificationProps[];
  count?: number;
  onClick?: () => void;
  onMarkAllAsRead?: (notifications: NotificationProps[]) => void;
  onNotificationClick?: (notification_id: string) => void;
  debug?: boolean;
  limit?: number; // Prop for limiting the number of notifications
}

// Define the ref interface explicitly
export interface ButtonNotificationsRef {
  addNotifications: (newNotifications: NotificationProps[]) => void;
}
