
import React, { createContext, useContext, useState, useMemo } from "react";
import { defaultTranslations, TranslationMap } from "@/utils/translations";
import { Language } from "@/components/ui/language-switcher";

// Re-export for convenience
export type { Language } from "@/components/ui/language-switcher";
export type { TranslationMap } from "@/utils/translations";

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
    // Handle pluralization if count parameter exists
    let effectiveKey = key;
    if (params?.count !== undefined) {
      effectiveKey = getPluralKey(key, Number(params.count), translations);
    }

    if (!translations[effectiveKey]) {
      console.warn(`Translation key not found: ${effectiveKey}`);
      return effectiveKey;
    }

    // Get translation for current language or fall back to English or key itself
    const langTranslations = translations[effectiveKey];
    let text = langTranslations[currentLanguage.code] ||
               langTranslations["EN"] ||
               effectiveKey;

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

// Helper function to handle pluralization
// Simple FR/EN rules: count === 0 or 1 → singular, else → plural
const getPluralKey = (
  baseKey: string,
  count: number,
  translations: TranslationMap
): string => {
  const zeroKey = `${baseKey}_zero`;
  const pluralKey = `${baseKey}_plural`;

  // DEBUG: Log for filesCount
  if (baseKey === "fileBrowser.filesCount") {
    console.log("[getPluralKey] Debug:", {
      baseKey,
      count,
      zeroKey,
      pluralKey,
      hasZeroKey: !!translations[zeroKey],
      hasPluralKey: !!translations[pluralKey],
      allKeysWithFilesCount: Object.keys(translations).filter(k => k.includes("filesCount"))
    });
  }

  // Check for explicit _zero key
  if (count === 0 && translations[zeroKey]) {
    return zeroKey;
  }

  // Check for _plural key
  if (count !== 1 && translations[pluralKey]) {
    return pluralKey;
  }

  // Return base key (singular form)
  return baseKey;
};

// Safe hook that works with or without TranslationProvider
// Priority: Props (customTranslations/customLanguage) > Context > Default EN
export const useTranslationSafe = (
  customTranslations?: Partial<TranslationMap>,
  customLanguage?: string
) => {
  const context = useContext(TranslationContext);

  // If props are provided, they take priority over context
  const hasCustomProps = customTranslations !== undefined || customLanguage !== undefined;

  if (hasCustomProps) {
    // Use props with higher priority
    const propsLanguage: Language = {
      code: customLanguage?.toUpperCase() || context?.currentLanguage.code || "EN",
      name: customLanguage || context?.currentLanguage.name || "English"
    };

    // Merge translations: customTranslations > context translations (if exists) > defaultTranslations
    const mergedTranslations = useMemo(() => {
      const base = { ...defaultTranslations };

      // Add context custom translations if context exists
      // Note: context already has merged translations from TranslationProvider

      // Add custom translations from props (highest priority)
      if (customTranslations) {
        Object.keys(customTranslations).forEach(key => {
          if (!base[key]) {
            base[key] = { ...customTranslations[key] };
          } else {
            base[key] = { ...base[key], ...customTranslations[key] };
          }
        });
      }

      return base;
    }, [customTranslations]);

    const t = (key: string, params?: Record<string, string | number>): string => {
      // Handle pluralization if count parameter exists
      let effectiveKey = key;
      if (params?.count !== undefined) {
        effectiveKey = getPluralKey(key, Number(params.count), mergedTranslations);
      }

      if (!mergedTranslations[effectiveKey]) {
        console.warn(`Translation key not found: ${effectiveKey}`);
        return effectiveKey;
      }

      // Get translation for current language or fall back to English or key itself
      const langTranslations = mergedTranslations[effectiveKey];
      let text = langTranslations[propsLanguage.code] ||
                 langTranslations["EN"] ||
                 effectiveKey;

      // Replace parameters
      if (params) {
        Object.entries(params).forEach(([paramKey, paramValue]) => {
          const regex = new RegExp(`{${paramKey}}`, 'g');
          text = text.replace(regex, String(paramValue));
        });
      }

      return text;
    };

    return {
      currentLanguage: propsLanguage,
      language: propsLanguage,
      setLanguage: context?.setLanguage || (() => {
        console.warn("setLanguage is not available without TranslationProvider");
      }),
      availableLanguages: context?.availableLanguages || [propsLanguage],
      t
    };
  }

  // If no props and context exists, use context
  if (context) {
    return context;
  }

  // Fallback: No props, no context - use default EN
  const fallbackLanguage: Language = {
    code: "EN",
    name: "English"
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    // Handle pluralization if count parameter exists
    let effectiveKey = key;
    if (params?.count !== undefined) {
      effectiveKey = getPluralKey(key, Number(params.count), defaultTranslations);
    }

    if (!defaultTranslations[effectiveKey]) {
      console.warn(`Translation key not found: ${effectiveKey}`);
      return effectiveKey;
    }

    // Get translation for EN or key itself
    let text = defaultTranslations[effectiveKey]["EN"] || effectiveKey;

    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        const regex = new RegExp(`{${paramKey}}`, 'g');
        text = text.replace(regex, String(paramValue));
      });
    }

    return text;
  };

  return {
    currentLanguage: fallbackLanguage,
    language: fallbackLanguage,
    setLanguage: () => {
      console.warn("setLanguage is not available without TranslationProvider");
    },
    availableLanguages: [fallbackLanguage],
    t
  };
};
