import React, { useState } from "react";
import { Sheet, SheetContent, SheetClose, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ButtonCircle } from "@/components/ui/button-circle";
import NotificationPanel, { NotificationProps } from "./NotificationPanel";
import { useTranslation } from "@/contexts/TranslationContext";
import { formatDateForLocale } from "@/utils/translations";

export interface ActivityPanelProps {
  isOpen?: boolean;
  onClose: () => void;
  notifications: NotificationProps[];
  debug?: boolean;
  onMarkAllAsRead?: (notifications: NotificationProps[]) => void;
  onNotificationClick?: (notification_id: string) => void;
}

const ActivityPanel: React.FC<ActivityPanelProps> = ({
  isOpen = false,
  onClose,
  notifications,
  debug = false,
  onMarkAllAsRead,
  onNotificationClick
}) => {
  const [localNotifications, setLocalNotifications] = useState<NotificationProps[]>(notifications);
  const unreadCount = localNotifications.filter(notification => notification.unread).length;
  const { t, currentLanguage } = useTranslation();

  // Group notifications by date (using date string as key)
  const notificationsByDate = localNotifications.reduce((acc: Record<string, NotificationProps[]>, notification) => {
    // Format date based on current language
    const dateStr = formatDateForLocale(notification.date, 'EEEE d MMMM yyyy', currentLanguage.code);
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(notification);
    return acc;
  }, {});

  const markAllAsRead = () => {
    const updatedNotifications = localNotifications.map(notification => ({
      ...notification,
      unread: false
    }));
    setLocalNotifications(updatedNotifications);
    
    // Log dans la console en mode debug
    if (debug) {
      console.log('Debug: All notifications marked as read', updatedNotifications);
    }
    
    // Appel de la fonction de callback si elle est définie
    if (onMarkAllAsRead) {
      onMarkAllAsRead(updatedNotifications);
    }
  };

  // Fonction de gestion des clics sur les notifications
  const handleNotificationClick = (notification_id: string) => {
    // Mark the clicked notification as read
    const updatedNotifications = localNotifications.map(notification => {
      if (notification.notification_id === notification_id) {
        // Only update if currently unread
        if (notification.unread) {
          if (debug) {
            console.log('Debug: Marking notification as read:', notification_id);
          }
          return { ...notification, unread: false };
        }
      }
      return notification;
    });
    
    // Update local state
    setLocalNotifications(updatedNotifications);
    
    // En mode debug, on log la notification
    if (debug) {
      const clickedNotification = updatedNotifications.find(n => n.notification_id === notification_id);
      console.log('Notification clicked in debug mode:', clickedNotification);
    }
    
    // Transmettre le notification_id au callback parent s'il existe
    if (onNotificationClick) {
      onNotificationClick(notification_id);
    }
  };

  return <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent side="right" className="w-[400px] bg-black border-none p-0 top-[50px] h-[calc(100%-50px)]" topOffset="50px">
        <SheetTitle className="sr-only">Notifications Panel</SheetTitle>
        <SheetDescription className="sr-only">{t('notifications.panelDescription')}</SheetDescription>
        
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
                {unreadCount === 0 
                  ? t("notifications.upToDate")
                  : unreadCount === 1
                    ? t("notifications.oneUnread")
                    : t("notifications.multipleUnread", { count: unreadCount })
                }
              </h3>
            </div>
            
            {unreadCount > 0 && <button onClick={markAllAsRead} className="text-white hover:underline text-xs">
                {t("notifications.markAsRead")}
              </button>}
          </div>
          
          {/* Notification list with flexbox layout */}
          <div className="flex-1 overflow-auto pl-[50px] pr-[20px] pt-[20px] pb-[50px]">
            {Object.entries(notificationsByDate).map(([dateStr, dateNotifications]) => <div key={dateStr} className="mb-4">
                <div className="py-2 text-grey-stronger text-sm opacity-75">
                  {dateStr}
                </div>
                <div className="flex flex-col gap-[10px]">
                  {dateNotifications.map((notification, index) => (
                    <div key={`${dateStr}-${index}`}>
                      <NotificationPanel 
                        {...notification} 
                        onClick={handleNotificationClick} 
                      />
                    </div>
                  ))}
                </div>
              </div>)}
          </div>
        </div>
      </SheetContent>
    </Sheet>;
};

export default ActivityPanel;
