
import React from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ButtonNotifications from "@/components/ButtonNotifications";
import { toast } from "@/components/ui/sonner";
import { EventProps } from "@/components/notifications/EventPanel";

const TranslationExample = () => {
  const { currentLanguage, setLanguage, availableLanguages, t } = useTranslation();

  // Handlers for ButtonNotifications
  const handleMarkAllAsRead = (events: EventProps[]) => {
    toast({
      title: t("notifications.allMarkedAsRead"),
      description: `${events.length} ${events.length > 1 ? t("notifications.multipleEvents") : t("notifications.oneEvent")}`,
      duration: 3000,
    });
  };

  const handleEventClick = (eventId: string) => {
    toast({
      title: t("notifications.eventClicked"),
      description: `${t("notifications.eventId")}: ${eventId}`,
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
            onEventClick={handleEventClick}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationExample;
