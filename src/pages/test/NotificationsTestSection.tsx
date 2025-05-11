import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MediaStatus } from "@/utils/mediaStatus";
import NotificationPanel from "@/components/notifications/NotificationPanel";
import ActivityPanel from "@/components/notifications/ActivityPanel";
import ButtonNotifications from "@/components/ButtonNotifications";
import { ButtonNotificationsRef } from "@/components/notifications/types";
import { useGlobalActivityStatus } from "@/hooks/useGlobalActivityStatus";
import { NotificationProps } from "@/components/notifications/NotificationPanel";
import { toast } from "@/components/ui/sonner";
import { mockNotifications } from "@/components/notifications/mockNotifications";

const NotificationsTestSection: React.FC = () => {
  const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [notificationLimit, setNotificationLimit] = useState(100);
  const { setActivityStatus } = useGlobalActivityStatus();
  const notificationsRef = useRef<ButtonNotificationsRef>(null);
  // État local pour stocker les notifications pour le bouton avec count fixe
  const [countButtonNotifications, setCountButtonNotifications] = useState<NotificationProps[]>(mockNotifications.slice(0, 5));
  
  // Generate notifications for activity panel
  const generateMockNotifications = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return [
      {
        notification_id: "notification-1",
        title: "charles@grand-shooting.com added comments on photos",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "comment" as const,
        redirectLink: "#",
        date: today,
        unread: true
      },
      {
        notification_id: "notification-2",
        title: "Files transferred to editing team",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.VALIDATED,
        type: "transfer" as const,
        redirectLink: "/examples",
        date: today,
        unread: true
      },
      {
        notification_id: "notification-3",
        title: "charles@grand-shooting.com added comments on photos",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.BROADCAST,
        type: "comment" as const,
        redirectLink: "#",
        date: yesterday,
        unread: false
      },
      {
        notification_id: "notification-4",
        title: "Files published to website",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.BROADCAST,
        type: "other" as const,
        redirectLink: "#",
        date: yesterday,
        unread: false
      },
    ];
  };

  const toggleActivityPanel = () => {
    setIsActivityPanelOpen(!isActivityPanelOpen);
  };
  
  // Handler pour le callback onMarkAllAsRead
  const handleMarkAllAsRead = (updatedNotifications: NotificationProps[]) => {
    console.log("NotificationsTestSection: All notifications marked as read", updatedNotifications);
    toast({
      title: "Toutes les notifications marquées comme lues",
      description: `${updatedNotifications.length} notifications mises à jour`,
      duration: 3000,
    });
    
    // Mettre à jour les notifications du bouton avec compteur fixe
    if (notificationsRef.current) {
      setCountButtonNotifications(updatedNotifications);
    }
  };
  
  // Handler pour le callback onNotificationClick
  const handleNotificationClick = (notification_id: string) => {
    console.log("NotificationsTestSection: Notification clicked with ID", notification_id);
    toast({
      title: "Notification cliquée",
      description: `Vous avez cliqué sur la notification avec l'ID: ${notification_id}`,
      duration: 3000,
    });
  };

  // Add a single notification
  const addSingleNotification = () => {
    if (!notificationsRef.current) return;
    
    const newNotification: NotificationProps = {
      notification_id: `test-${Date.now()}`,
      title: "charles@grand-shooting.com added comments on photos",
      subtitle: `Added at ${new Date().toLocaleTimeString()}`,
      pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
      type: "comment" as const,
      redirectLink: "#",
      date: new Date(),
      unread: true
    };
    
    notificationsRef.current.addNotifications([newNotification]);
    
    // Mettre à jour les notifications du bouton avec compteur fixe
    setCountButtonNotifications(prev => [newNotification, ...prev]);
    
    toast({
      title: "Notification ajoutée",
      description: "Une nouvelle notification a été ajoutée",
      duration: 2000,
    });
  };
  
  // Add many notifications at once to test limit handling
  const addManyNotifications = () => {
    if (!notificationsRef.current) return;
    
    const statuses = Object.values(MediaStatus).filter(value => typeof value === "number") as MediaStatus[];
    const types = ["comment", "transfer", "other"] as const;
    
    const bulkNotifications: NotificationProps[] = Array.from({ length: 20 }, (_, i) => ({
      notification_id: `bulk-${Date.now()}-${i}`,
      title: `Bulk notification #${i + 1}`,
      subtitle: `Testing notification limit - batch ${new Date().toLocaleTimeString()}`,
      pictureStatus: statuses[i % statuses.length],
      type: types[i % types.length],
      redirectLink: "#",
      date: new Date(),
      unread: i % 2 === 0 // alternate between read and unread
    }));
    
    notificationsRef.current.addNotifications(bulkNotifications);
    
    // Mettre à jour les notifications du bouton avec compteur fixe
    setCountButtonNotifications(prev => [...bulkNotifications.slice(0, 5), ...prev].slice(0, 5));
    
    toast({
      title: "Notifications multiples ajoutées",
      description: `${bulkNotifications.length} notifications ont été ajoutées`,
      duration: 3000,
    });
  };

  // Toggle notification limit between 10 and 100
  const toggleNotificationLimit = () => {
    const newLimit = notificationLimit === 100 ? 10 : 100;
    setNotificationLimit(newLimit);
    
    toast({
      title: "Limite de notifications modifiée",
      description: `Nouvelle limite: ${newLimit} notifications`,
      duration: 2000,
    });
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ButtonNotifications</CardTitle>
          <CardDescription>A button that displays notification count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 border rounded-md">
                <p className="mb-2 font-medium">With count</p>
                <ButtonNotifications 
                  ref={notificationsRef}
                  count={5} 
                  notifications={countButtonNotifications} 
                  onClick={() => {
                    toast({
                      title: "Button Clicked",
                      description: "Notification button with count clicked",
                      duration: 2000,
                    });
                  }} 
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onNotificationClick={handleNotificationClick}
                  debug={debugMode}
                  limit={notificationLimit}
                />
              </div>
              <div className="flex flex-col items-center p-4 border rounded-md">
                <p className="mb-2 font-medium">No count</p>
                <ButtonNotifications 
                  count={0} 
                  onClick={() => {
                    toast({
                      title: "Button Clicked",
                      description: "Notification button without count clicked",
                      duration: 2000,
                    });
                  }}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onNotificationClick={handleNotificationClick}
                  debug={debugMode}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button onClick={addSingleNotification}>
                Add Single Notification
              </Button>
              <Button onClick={addManyNotifications} variant="outline">
                Add 20 Notifications
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button onClick={() => {
                setActivityStatus(true);
                toast({
                  title: "Activity Status Changed",
                  description: "Global activity status set to: Active",
                  duration: 2000,
                });
              }}>
                Set Has Activity (Global)
              </Button>
              <Button variant="outline" onClick={() => {
                setActivityStatus(false);
                toast({
                  title: "Activity Status Changed",
                  description: "Global activity status set to: Inactive",
                  duration: 2000,
                });
              }}>
                Set No Activity (Global)
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button 
                variant={debugMode ? "default" : "outline"} 
                onClick={() => setDebugMode(!debugMode)}
              >
                {debugMode ? "Debug Mode: ON" : "Debug Mode: OFF"}
              </Button>
              <Button 
                variant={notificationLimit === 10 ? "default" : "outline"} 
                onClick={toggleNotificationLimit}
              >
                {`Limit: ${notificationLimit}`}
              </Button>
              {debugMode && (
                <p className="text-sm text-muted-foreground mt-1 text-center col-span-2">
                  Debug mode enabled. Check browser console for logs.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ActivityPanel</CardTitle>
          <CardDescription>Panel displaying activity notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center flex-col gap-4">
            <div className="flex gap-4 justify-center">
              <Button onClick={toggleActivityPanel}>
                {isActivityPanelOpen ? "Close Activity Panel" : "Open Activity Panel"}
              </Button>
              <Button 
                variant={debugMode ? "default" : "outline"} 
                onClick={() => setDebugMode(!debugMode)}
              >
                {debugMode ? "Debug Mode: ON" : "Debug Mode: OFF"}
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {debugMode && "Debug mode enabled. Click on notifications to see details in console."}
            </div>
          </div>
          <ActivityPanel 
            isOpen={isActivityPanelOpen}
            onClose={() => setIsActivityPanelOpen(false)}
            notifications={generateMockNotifications()}
            debug={debugMode}
            onMarkAllAsRead={handleMarkAllAsRead}
            onNotificationClick={handleNotificationClick}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>NotificationPanel</CardTitle>
          <CardDescription>Individual notification event panels</CardDescription>
        </CardHeader>
        <CardContent className="bg-black p-6 space-y-4">
          <NotificationPanel
            notification_id="demo-1"
            title="charles@grand-shooting.com added comments on photos"
            subtitle="STANDARD-2025-05-07 H02-PART-1"
            pictureStatus={MediaStatus.SUBMITTED_FOR_APPROVAL}
            type="comment"
            redirectLink="#"
            date={new Date()}
            unread={true}
            onClick={(id) => toast({
              title: "Notification cliquée",
              description: `Vous avez cliqué sur la notification avec l'ID: ${id}`,
              duration: 3000,
            })}
          />
          
          <NotificationPanel
            notification_id="demo-long-title"
            title="This is an extremely long title that should demonstrate the text truncation functionality and show a tooltip when hovering over it"
            subtitle="STANDARD-2025-05-07 H02-PART-1"
            pictureStatus={MediaStatus.VALIDATED}
            type="transfer"
            redirectLink="#"
            date={new Date()}
            unread={true}
          />
          
          <NotificationPanel
            notification_id="demo-long-subtitle"
            title="charles@grand-shooting.com added comments"
            subtitle="This is a very long subtitle that should demonstrate the text truncation functionality and show a tooltip when hovering over it - STANDARD-2025-05-07 H02-PART-1"
            pictureStatus={MediaStatus.BROADCAST}
            type="comment"
            redirectLink="#"
            date={new Date(new Date().setDate(new Date().getDate() - 1))}
            unread={false}
          />
          
          <NotificationPanel
            notification_id="demo-both-long"
            title="This is another extremely long notification title that should demonstrate the text truncation functionality with a tooltip on hover"
            subtitle="This is also a very long subtitle that should demonstrate the text truncation functionality with a tooltip on hover - PROJECT-ID-2025-VERY-LONG-IDENTIFIER"
            pictureStatus={MediaStatus.SELECTED}
            type="other"
            redirectLink="#"
            date={new Date(new Date().setDate(new Date().getDate() - 1))}
            unread={false}
          />
          
          <NotificationPanel
            notification_id="demo-3"
            title="charles@grand-shooting.com added comments on photos"
            subtitle="STANDARD-2025-05-07 H02-PART-1"
            pictureStatus={MediaStatus.BROADCAST}
            type="comment"
            redirectLink="#"
            date={new Date(new Date().setDate(new Date().getDate() - 1))}
            unread={false}
          />
          <NotificationPanel
            notification_id="demo-4"
            title="Files published to website"
            subtitle="STANDARD-2025-05-07 H02-PART-1"
            pictureStatus={MediaStatus.BROADCAST}
            type="other"
            redirectLink="#"
            date={new Date(new Date().setDate(new Date().getDate() - 1))}
            unread={false}
          />
          <NotificationPanel
            notification_id="demo-5"
            title="Project review completed"
            subtitle="STANDARD-2025-05-07 H03-PART-2"
            pictureStatus={MediaStatus.SELECTED}
            type="comment"
            redirectLink="#"
            date={new Date(new Date().setDate(new Date().getDate() - 2))}
            unread={false}
          />
          <NotificationPanel
            notification_id="demo-6"
            title="Image collection updated"
            subtitle="STANDARD-2025-05-08 H01-PART-1"
            pictureStatus={MediaStatus.SUBMITTED_FOR_APPROVAL}
            type="other"
            redirectLink="#"
            date={new Date(new Date().setDate(new Date().getDate() - 2))}
            unread={false}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default NotificationsTestSection;
