
import React from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ButtonNotifications from "@/components/ButtonNotifications";
import { toast } from "@/components/ui/sonner";
import { NotificationProps } from "@/components/notifications/EventPanel";

const TranslationExample = () => {
  const { currentLanguage, setLanguage, availableLanguages, t } = useTranslation();

  // Handlers for ButtonNotifications
  const handleMarkAllAsRead = (notifications: NotificationProps[]) => { // Changed from events
    toast({
      title: t("notifications.allMarkedAsRead"),
      description: `${notifications.length} ${notifications.length > 1 ? t("notifications.multipleEvents") : t("notifications.oneEvent")}`, // Changed from events
      duration: 3000,
    });
  };

  const handleNotificationClick = (notification_id: string) => { // Changed from eventId
    toast({
      title: t("notifications.eventClicked"),
      description: `${t("notifications.eventId")}: ${notification_id}`, // Changed from eventId
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
        <CardContent className="flex justify-center">
          <ButtonNotifications 
            onMarkAllAsRead={handleMarkAllAsRead}
            onNotificationClick={handleNotificationClick} // Changed from onEventClick
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationExample;
