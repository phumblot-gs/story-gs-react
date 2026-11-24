
import { NotificationLinkRenderer, NotificationProps } from "./NotificationPanel";

export interface ButtonNotificationsProps {
  notifications?: NotificationProps[];
  count?: number;
  onClick?: () => void;
  onMarkAllAsRead?: (notifications: NotificationProps[]) => void;
  onNotificationClick?: (notification_id: string) => void;
  debug?: boolean;
  limit?: number; // Prop for limiting the number of notifications
  /**
   * Renders each notification's link with the app router, for client-side navigation:
   * `renderLink={({ href, ...props }) => <Link to={href} {...props} />}`.
   * Defaults to a plain `<a href>` (full page load).
   */
  renderLink?: NotificationLinkRenderer;
}

// Define the ref interface explicitly
export interface ButtonNotificationsRef {
  addNotifications: (newNotifications: NotificationProps[]) => void;
}
