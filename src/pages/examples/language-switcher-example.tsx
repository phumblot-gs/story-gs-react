
import React from "react";
import { useTranslation } from "@/contexts/TranslationContext";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

const LanguageSwitcherExample: React.FC = () => {
  const { currentLanguage, setLanguage, availableLanguages } = useTranslation();
  
  // Sample content that changes with language
  const sampleContent = {
    "EN": "This is sample content in English.",
    "FR": "Ceci est un exemple de contenu en Français.",
    "ES": "Este es un contenido de ejemplo en Español.",
    "IT": "Questo è un contenuto di esempio in Italiano."
  };

  return (
    <div className="flex flex-col items-center gap-8 p-10">
      <div className="flex items-center gap-4">
        <span className="text-sm">Current Language:</span>
        <LanguageSwitcher
          languages={availableLanguages}
          currentLanguage={currentLanguage}
          onLanguageChange={setLanguage}
          debug={true}
        />
      </div>
      
      <div className="mt-8 p-6 border rounded w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Sample Content in {currentLanguage.name}</h2>
        <p>
          {sampleContent[currentLanguage.code] || sampleContent["EN"]}
        </p>
      </div>
    </div>
  );
};

export default LanguageSwitcherExample;
