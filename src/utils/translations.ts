
import { format as formatDate } from "date-fns";
import { fr, enUS, es, it } from "date-fns/locale";

// Type for translation entries
export interface TranslationMap {
  [key: string]: {
    [languageCode: string]: string;
  };
}

// Get date-fns locale based on language code
export const getDateLocale = (langCode: string) => {
  switch (langCode) {
    case "FR":
      return fr;
    case "ES":
      return es;
    case "IT":
      return it;
    case "EN":
    default:
      return enUS;
  }
};

// Format date according to the current language
export const formatDateForLocale = (date: Date, formatStr: string, langCode: string) => {
  return formatDate(date, formatStr, {
    locale: getDateLocale(langCode)
  });
};

// Default translations for all components
export const defaultTranslations: TranslationMap = {
  // ActivityPanel translations
  "notifications.upToDate": {
    EN: "You are up to date",
    FR: "Vous êtes à jour",
    ES: "Estás al día",
    IT: "Sei aggiornato"
  },
  "notifications.oneUnread": {
    EN: "1 unread notification",
    FR: "1 notification non lue",
    ES: "1 notificación no leída",
    IT: "1 notifica non letta"
  },
  "notifications.multipleUnread": {
    EN: "{count} unread notifications",
    FR: "{count} notifications non lues",
    ES: "{count} notificaciones no leídas",
    IT: "{count} notifiche non lette"
  },
  "notifications.markAsRead": {
    EN: "mark as read",
    FR: "marquer lu",
    ES: "marcar como leído",
    IT: "segna come letto"
  },
  "notifications.title": {
    EN: "Notifications",
    FR: "Notifications",
    ES: "Notificaciones",
    IT: "Notifiche"
  },
  "notifications.unread": {
    EN: "unread",
    FR: "non lues",
    ES: "no leídas",
    IT: "non lette"
  },
  "notifications.panelDescription": {
    EN: "List of recent notifications and events",
    FR: "Liste des notifications et événements récents",
    ES: "Lista de notificaciones y eventos recientes",
    IT: "Elenco delle notifiche ed eventi recenti"
  }
};
