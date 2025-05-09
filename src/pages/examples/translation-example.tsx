
import React from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import ButtonNotifications from "@/components/ButtonNotifications";

const TranslationExample = () => {
  const { currentLanguage, setLanguage, availableLanguages } = useTranslation();

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
          <ButtonNotifications />
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationExample;
