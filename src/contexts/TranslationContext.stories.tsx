
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TranslationProvider, useTranslation } from "./TranslationContext";
import { Language } from "@/components/ui/language-switcher";
import { Button } from "@/components/ui/button";

// Define our story meta
const meta: Meta = {
  title: "Context/TranslationProvider", // Changed from "Contexts" to "Context"
  component: TranslationProvider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
        
A context provider that handles internationalization for components in the library.
        
## Features
- Supports multiple languages (FR, EN, ES, IT by default)
- Allows parent applications to override default translations
- Persists language selection in localStorage
- Provides a simple translation hook with parameter interpolation

## Usage
        
Wrap your application or component with the TranslationProvider:
        
\`\`\`tsx
import { TranslationProvider } from "@/contexts/TranslationContext";

// Simple usage with defaults
<TranslationProvider>
  <YourApp />
</TranslationProvider>

// With custom settings
<TranslationProvider 
  initialLanguage={{ code: "EN", name: "English" }}
  languages={[
    { code: "EN", name: "English" },
    { code: "FR", name: "Français" }
  ]}
  customTranslations={{
    "myKey": {
      "EN": "My custom translation",
      "FR": "Ma traduction personnalisée"
    }
  }}
>
  <YourApp />
</TranslationProvider>
\`\`\`
        
Then use the translation hook in your components:
        
\`\`\`tsx
import { useTranslation } from "@/contexts/TranslationContext";

const MyComponent = () => {
  const { t, currentLanguage, setLanguage, availableLanguages } = useTranslation();
  
  return (
    <div>
      <p>{t("myKey")}</p>
      <p>{t("welcome", { name: "John" })}</p>
      
      {/* Language switcher */}
      <select 
        value={currentLanguage.code}
        onChange={(e) => {
          const newLang = availableLanguages.find(lang => lang.code === e.target.value);
          if (newLang) setLanguage(newLang);
        }}
      >
        {availableLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
\`\`\`
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof TranslationProvider>;

// Demo component to show translation in action
const TranslationDemo: React.FC = () => {
  const { t, currentLanguage, setLanguage, availableLanguages } = useTranslation();
  const [name, setName] = useState("User");
  const [count, setCount] = useState(3);
  
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-medium">Translation Example</h2>
        <p>Current Language: <strong>{currentLanguage.name} ({currentLanguage.code})</strong></p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {availableLanguages.map(lang => (
          <Button 
            key={lang.code}
            variant={lang.code === currentLanguage.code ? "default" : "outline"}
            onClick={() => setLanguage(lang)}
          >
            {lang.name}
          </Button>
        ))}
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium">Translation Result Examples:</h3>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">notifications.upToDate:</p>
          <p className="bg-gray-50 p-2 rounded">{t("notifications.upToDate")}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">notifications.multipleUnread with count = {count}:</p>
          <div className="flex gap-2 items-center">
            <Button size="sm" variant="outline" onClick={() => setCount(prev => Math.max(1, prev - 1))}>-</Button>
            <p className="bg-gray-50 p-2 rounded flex-1">{t("notifications.multipleUnread", { count })}</p>
            <Button size="sm" variant="outline" onClick={() => setCount(prev => prev + 1)}>+</Button>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Custom greeting with parameter:</p>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-1 rounded"
            />
            <p className="bg-gray-50 p-2 rounded flex-1">{t("custom.greeting", { name })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Basic story with default translations
export const Default: Story = {
  render: () => (
    <TranslationProvider>
      <TranslationDemo />
    </TranslationProvider>
  )
};

// Story with custom translations
export const WithCustomTranslations: Story = {
  render: () => (
    <TranslationProvider
      customTranslations={{
        "custom.greeting": {
          "EN": "Hello, {name}! Welcome to our application.",
          "FR": "Bonjour, {name} ! Bienvenue dans notre application.",
          "ES": "¡Hola, {name}! Bienvenido a nuestra aplicación.",
          "IT": "Ciao, {name}! Benvenuto nella nostra applicazione."
        },
        // Override existing translations
        "notifications.upToDate": {
          "EN": "All caught up!",
          "FR": "Tout est à jour !",
          "ES": "¡Todo al día!",
          "IT": "Tutto aggiornato!"
        }
      }}
    >
      <TranslationDemo />
    </TranslationProvider>
  )
};

// Story with specific initial language
export const WithInitialLanguage: Story = {
  render: () => (
    <TranslationProvider initialLanguage={{ code: "ES", name: "Español" }}>
      <TranslationDemo />
    </TranslationProvider>
  )
};
