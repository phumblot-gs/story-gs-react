
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

const TranslationExample = () => {
  const { currentLanguage, setLanguage, availableLanguages, t } = useTranslation();
  const notificationsRef = useRef<ButtonNotificationsRef>(null);

  // Handlers for ButtonNotifications
  const handleMarkAllAsRead = (notifications: NotificationProps[]) => {
    toast({
      title: t("notifications.allMarkedAsRead"),
      description: `${notifications.length} ${notifications.length > 1 ? t("notifications.multipleEvents") : t("notifications.oneEvent")}`,
      duration: 3000,
    });
  };

  const handleNotificationClick = (notification_id: string) => {
    toast({
      title: t("notifications.eventClicked"),
      description: `${t("notifications.eventId")}: ${notification_id}`,
      duration: 3000,
    });
  };

  // Add new notification with current language
  const handleAddNotification = () => {
    if (!notificationsRef.current) return;
    
    const newNotification: NotificationProps = {
      notification_id: `lang-${Date.now()}`,
      title: t("examples.newNotification"),
      subtitle: `${currentLanguage.name} - ${new Date().toLocaleTimeString()}`,
      pictureStatus: MediaStatus.VALIDATED,
      type: "comment",
      redirectLink: "#",
      date: new Date(),
      unread: true
    };

    notificationsRef.current.addNotifications([newNotification]);
    
    toast({
      title: t("examples.notificationAdded"),
      description: t("examples.notificationAddedDesc"),
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      <h1 className="text-2xl font-medium">Translation System Example</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Language Switcher</CardTitle>
          <CardDescription>
            Select a language to see translations across components
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <LanguageSwitcher
            languages={availableLanguages}
            currentLanguage={currentLanguage}
            onLanguageChange={setLanguage}
          />
          <p className="text-center">
            Current Language: <strong>{currentLanguage.name}</strong>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Component with Translation</CardTitle>
          <CardDescription>
            The notifications button below uses the translation system
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <ButtonNotifications 
            ref={notificationsRef}
            onMarkAllAsRead={handleMarkAllAsRead}
            onNotificationClick={handleNotificationClick}
          />
          <Button onClick={handleAddNotification}>
            {t("examples.addNotification")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationExample;
