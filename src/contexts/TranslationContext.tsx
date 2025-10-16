
import React, { createContext, useContext, useState, useMemo } from "react";
import { defaultTranslations, TranslationMap } from "@/utils/translations";
import { Language } from "@/components/ui/language-switcher";

// Re-export Language for convenience
export type { Language } from "@/components/ui/language-switcher";

export interface TranslationContextType {
  currentLanguage: Language;
  language: Language; // Alias for backward compatibility
  setLanguage: (language: Language) => void;
  availableLanguages: Language[];
  t: (key: string, params?: Record<string, string | number>) => string;
}

export interface TranslationProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
  defaultLanguage?: string; // For backward compatibility
  customTranslations?: TranslationMap;
  languages?: Language[];
}

const defaultLanguages: Language[] = [
  { code: "FR", name: "Français" },
  { code: "EN", name: "English" },
  { code: "ES", name: "Español" },
  { code: "IT", name: "Italiano" },
];

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  initialLanguage,
  defaultLanguage, // For backward compatibility
  customTranslations = {},
  languages = defaultLanguages
}) => {
  // Handle backward compatibility for defaultLanguage prop
  const effectiveInitialLanguage = initialLanguage ||
    (defaultLanguage ? languages.find(l => l.code === defaultLanguage) : undefined);

  // Get initial language from localStorage or use provided initialLanguage or default to first language
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Try to get from localStorage
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("preferredLanguage");
      if (savedLanguage) {
        try {
          const parsed = JSON.parse(savedLanguage);
          if (languages.some((lang) => lang.code === parsed.code)) {
            return parsed;
          }
        } catch (e) {
          console.error("Failed to parse saved language", e);
        }
      }
    }

    return effectiveInitialLanguage || languages[0];
  });

  // Merge default translations with custom translations
  const translations = useMemo(() => {
    const merged: TranslationMap = { ...defaultTranslations };
    
    // Deep merge custom translations
    Object.keys(customTranslations).forEach(key => {
      if (!merged[key]) {
        merged[key] = { ...customTranslations[key] };
      } else {
        merged[key] = { ...merged[key], ...customTranslations[key] };
      }
    });
    
    return merged;
  }, [customTranslations]);

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    // Get translation for current language or fall back to English or key itself
    const langTranslations = translations[key];
    let text = langTranslations[currentLanguage.code] || 
               langTranslations["EN"] || 
               key;
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        const regex = new RegExp(`{${paramKey}}`, 'g');
        text = text.replace(regex, String(paramValue));
      });
    }
    
    return text;
  };

  // Save language preference to localStorage when it changes
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredLanguage", JSON.stringify(currentLanguage));
    }
  }, [currentLanguage]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const contextValue = {
    currentLanguage,
    language: currentLanguage, // Alias for backward compatibility
    setLanguage,
    availableLanguages: languages,
    t
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use the translation context
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  
  return context;
};
