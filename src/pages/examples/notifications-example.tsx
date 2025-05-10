
import React from "react";
import PageHeader from "@/components/PageHeader";
import ButtonNotifications from "@/components/ButtonNotifications";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { EventProps } from "@/components/notifications/EventPanel";

// Example of how to use the ButtonNotifications component in a PageHeader
const NotificationsExample = () => {
  const addToast = () => {
    toast({
      title: "Notifications système",
      description: "Les notifications apparaissent à droite de l'écran en cliquant sur le bouton Bell",
      type: "info",
      duration: 5000,
    });
  };

  // Handle mark all as read
  const handleMarkAllAsRead = (events: EventProps[]) => {
    toast({
      title: "Notifications marquées comme lues",
      description: `${events.length} notification(s) mise(s) à jour`,
      duration: 3000,
    });
  };

  // Handle event click
  const handleEventClick = (eventId: string) => {
    toast({
      title: "Navigation vers la notification",
      description: `Redirection vers le détail de l'événement ${eventId}`,
      duration: 3000,
    });
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
              <strong>EventPanel</strong> : Chaque élément de notification dans le panneau,
              qui affiche les détails d'une notification.
            </li>
          </ul>
          <Button onClick={addToast}>Afficher une notification toast</Button>
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
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onEventClick={handleEventClick}
                  />
                }
              />
            </div>
          </ThemeProvider>
          <p className="mt-4 text-sm text-muted-foreground">
            Cliquez sur le bouton Bell pour afficher le panneau des notifications.
            <br />
            Les actions sur les événements et "marquer comme lu" sont connectées à des toasts de démonstration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsExample;
