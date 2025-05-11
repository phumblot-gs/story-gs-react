import React, { useRef } from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ButtonNotifications from "@/components/ButtonNotifications";
import type { ButtonNotificationsRef } from "@/components/notifications/types";
import { toast } from "@/components/ui/sonner";
import { NotificationProps } from "@/components/notifications/NotificationPanel";
import { Button } from "@/components/ui/button";
import { MediaStatus } from "@/utils/mediaStatus";

// Example of how to use the ButtonNotifications component in a PageHeader
const NotificationsExample = () => {
  // Ref to ButtonNotifications component for adding notifications
  const notificationsRef = useRef<ButtonNotificationsRef>(null);

  const addToast = () => {
    toast({
      title: "Notifications système",
      description: "Les notifications apparaissent à droite de l'écran en cliquant sur le bouton Bell",
      type: "info",
      duration: 5000,
    });
  };

  // Handle mark all as read
  const handleMarkAllAsRead = (notifications: NotificationProps[]) => {
    toast({
      title: "Notifications marquées comme lues",
      description: `${notifications.length} notification(s) mise(s) à jour`,
      duration: 3000,
    });
  };

  // Handle notification click
  const handleNotificationClick = (notification_id: string) => {
    toast({
      title: "Navigation vers la notification",
      description: `Redirection vers le détail de la notification ${notification_id}`,
      duration: 3000,
    });
  };

  // Add new notifications example
  const handleAddNotification = () => {
    const newNotification: NotificationProps = {
      notification_id: `new-${Date.now()}`,
      title: "Nouvelle notification ajoutée",
      subtitle: `Notification ajoutée le ${new Date().toLocaleTimeString()}`,
      pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
      type: "comment",
      redirectLink: "#",
      date: new Date(),
      unread: true
    };

    if (notificationsRef.current) {
      notificationsRef.current.addNotifications([newNotification]);
      
      toast({
        title: "Notification ajoutée",
        description: "Une nouvelle notification a été ajoutée au panneau",
        duration: 3000,
      });
    }
  };

  // Add multiple notifications example
  const handleAddMultipleNotifications = () => {
    const statuses = [
      MediaStatus.SELECTED, 
      MediaStatus.VALIDATED, 
      MediaStatus.BROADCAST, 
      MediaStatus.REFUSED_1
    ];
    
    const types: ("comment" | "transfer" | "other")[] = ["comment", "transfer", "other"];
    
    const newNotifications: NotificationProps[] = Array.from({ length: 5 }, (_, i) => ({
      notification_id: `bulk-${Date.now()}-${i}`,
      title: `Notification groupée #${i + 1}`,
      subtitle: `Groupe de notifications ${new Date().toLocaleDateString()}`,
      pictureStatus: statuses[i % statuses.length],
      type: types[i % types.length],
      redirectLink: "#",
      date: new Date(),
      unread: true
    }));

    if (notificationsRef.current) {
      notificationsRef.current.addNotifications(newNotifications);
      
      toast({
        title: "Notifications ajoutées",
        description: `${newNotifications.length} nouvelles notifications ont été ajoutées`,
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-2xl font-medium">Exemple de système de notifications</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Explication</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Ce système comprend trois composants principaux :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>ButtonNotifications</strong> : Le bouton qui s'intègre dans le PageHeader
              et qui permet d'ouvrir/fermer le panneau de notifications.
            </li>
            <li>
              <strong>ActivityPanel</strong> : Le panneau latéral qui apparaît sur la droite et
              qui affiche la liste des notifications regroupées par date.
            </li>
            <li>
              <strong>NotificationPanel</strong> : Chaque élément de notification dans le panneau,
              qui affiche les détails d'une notification.
            </li>
          </ul>
          <div className="flex gap-4">
            <Button onClick={addToast}>Afficher une notification toast</Button>
            <Button onClick={handleAddNotification} variant="outline">Ajouter une notification</Button>
            <Button onClick={handleAddMultipleNotifications} variant="outline">Ajouter 5 notifications</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Démonstration : PageHeader avec bouton de notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeProvider>
            <div className="border rounded">
              <PageHeader 
                title="Collection Printemps 2025" 
                rightContent={
                  <ButtonNotifications 
                    ref={notificationsRef}
                    limit={50} // Set a custom limit of 50 notifications
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onNotificationClick={handleNotificationClick}
                  />
                }
              />
            </div>
          </ThemeProvider>
          <p className="mt-4 text-sm text-muted-foreground">
            Cliquez sur le bouton Bell pour afficher le panneau des notifications.
            <br />
            Les actions sur les notifications et "marquer comme lu" sont connectées à des toasts de démonstration.
            <br />
            Ce composant limite le panneau à 50 notifications maximum.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsExample;
