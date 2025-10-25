import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { componentTranslations } from './utils/component-translations';

// Convert old format to i18next format with pluralization support
const convertTranslations = (translations: Record<string, Record<string, string>>) => {
  const result: Record<string, any> = {
    translation: {}
  };

  Object.entries(translations).forEach(([key, langs]) => {
    // Handle nested keys (e.g., "fileBrowser.dateFilter.all" -> nested object)
    const parts = key.split('.');
    let current = result.translation;

    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // Last part - set the value
        current[part] = langs;
      } else {
        // Intermediate part - create nested object
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    });
  });

  return result;
};

// Build translations for each language
const buildLanguageResources = () => {
  const languages = ['EN', 'FR', 'ES', 'IT', 'DE'];
  const resources: Record<string, any> = {};

  languages.forEach(lang => {
    resources[lang.toLowerCase()] = {
      translation: {}
    };
  });

  // Process all translations
  const allTranslations = {
    ...componentTranslations,
    // Additional translations
    "notifications.upToDate": {
      EN: "You are up to date",
      FR: "Vous êtes à jour",
      ES: "Estás al día",
      IT: "Sei aggiornato",
      DE: "Sie sind auf dem neuesten Stand"
    },
    "notifications.oneUnread": {
      EN: "{{count}} unread notification",
      FR: "{{count}} notification non lue",
      ES: "{{count}} notificación no leída",
      IT: "{{count}} notifica non letta",
      DE: "{{count}} ungelesene Benachrichtigung"
    },
    "notifications.multipleUnread": {
      EN: "{{count}} unread notifications",
      FR: "{{count}} notifications non lues",
      ES: "{{count}} notificaciones no leídas",
      IT: "{{count}} notifiche non lette",
      DE: "{{count}} ungelesene Benachrichtigungen"
    },
    "notifications.markAsRead": {
      EN: "mark as read",
      FR: "marquer lu",
      ES: "marcar como leído",
      IT: "segna come letto",
      DE: "als gelesen markieren"
    },
    "notifications.title": {
      EN: "Notifications",
      FR: "Notifications",
      ES: "Notificaciones",
      IT: "Notifiche",
      DE: "Benachrichtigungen"
    },
    "notifications.unread": {
      EN: "unread",
      FR: "non lues",
      ES: "no leídas",
      IT: "non lette",
      DE: "ungelesen"
    },
    "notifications.panelDescription": {
      EN: "List of recent notifications and events",
      FR: "Liste des notifications et événements récents",
      ES: "Lista de notificaciones y eventos recientes",
      IT: "Elenco delle notifiche ed eventi recenti",
      DE: "Liste der letzten Benachrichtigungen und Ereignisse"
    }
  };

  // Build nested structure for each language
  Object.entries(allTranslations).forEach(([key, langs]) => {
    const parts = key.split('.');

    languages.forEach(lang => {
      const langCode = lang.toLowerCase();
      let current = resources[langCode].translation;

      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          // Last part - set the translation value
          current[part] = langs[lang] || langs['EN']; // Fallback to EN
        } else {
          // Intermediate part - create nested object
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
      });
    });
  });

  return resources;
};

const resources = buildLanguageResources();

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes
    },
    // Enable pluralization
    pluralSeparator: '_',
    contextSeparator: '_',
    // Namespace
    defaultNS: 'translation',
    ns: ['translation'],
    // Debug in development
    debug: false,
    // Return key if translation not found
    returnEmptyString: false,
    returnNull: false,
  });

export default i18n;
