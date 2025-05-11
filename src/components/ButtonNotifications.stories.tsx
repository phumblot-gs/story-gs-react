import React, { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ButtonNotifications from "./ButtonNotifications";
import { MediaStatus } from "@/utils/mediaStatus";
import { NotificationType } from "./notifications/NotificationPanel";
import { action } from "@storybook/addon-actions";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { MemoryRouter } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationProps } from "./notifications/NotificationPanel";
import type { ButtonNotificationsRef } from "./notifications/types";

const meta: Meta<typeof ButtonNotifications> = {
  title: "Components/ButtonNotifications",
  component: ButtonNotifications,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `

Un composant qui gère l'affichage et l'interaction avec les notifications. Ce composant:

- **Intègre ActivityPanel** : Ouvre/ferme le panneau latéral de notifications
- **Support multilingue** : Utilise le contexte TranslationProvider pour adapter les textes à la langue sélectionnée
- **Gestion de limite** : Limite l'affichage à un nombre configurable de notifications (100 par défaut)
- **API Ref** : Expose des méthodes pour ajouter des notifications programmatiquement
- **Callback onClick** : Appelé lorsque l'utilisateur clique sur le bouton de notifications, en parallèle de l'ouverture/fermeture du panneau

#### Règles de gestion des limites de notifications :
- Lorsque la limite est atteinte, les notifications les plus anciennes sont supprimées en priorisant:
  1. D'abord les notifications déjà lues (les plus anciennes)
  2. Ensuite seulement les notifications non lues (les plus anciennes)
- Le tri des notifications se fait par date (plus récentes en haut)
        `
      }
    }
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TranslationProvider>
        <MemoryRouter>
          <div className="p-6 bg-white rounded-md">
            <Story />
          </div>
        </MemoryRouter>
      </TranslationProvider>
    ),
  ],
  argTypes: {
    onClick: { 
      action: "clicked",
      description: 'Callback appelé lorsque l\'utilisateur clique sur le bouton de notifications pour ouvrir/fermer le panneau',
      table: {
        type: { summary: '() => void' }
      }
    },
    onMarkAllAsRead: { 
      action: "marked all as read",
      description: 'Callback appelé lorsque l\'utilisateur clique sur "Marquer tout comme lu"',
      table: {
        type: { summary: '(notifications: NotificationProps[]) => void' }
      }
    },
    onNotificationClick: { 
      action: "notification clicked",
      description: 'Callback appelé lorsque l\'utilisateur clique sur une notification',
      table: {
        type: { summary: '(notification_id: string) => void' }
      }
    },
    debug: { 
      control: 'boolean',
      description: 'Active le mode debug pour afficher les événements dans la console',
      table: {
        defaultValue: { summary: false }
      }
    },
    limit: {
      control: { type: 'number', min: 5, max: 200, step: 5 },
      description: 'Nombre maximum de notifications à afficher (défaut: 100)',
      table: {
        defaultValue: { summary: 100 }
      }
    },
    notifications: {
      description: 'Liste initiale des notifications à afficher',
      control: 'object',
      table: {
        type: { summary: 'NotificationProps[]' }
      }
    },
    count: {
      description: 'Nombre de notifications non lues à afficher sur le badge (calculé automatiquement si non spécifié)',
      control: 'number',
      table: {
        type: { summary: 'number' }
      }
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonNotifications>;

export const Default: Story = {
  args: {
    onMarkAllAsRead: action("marked all as read"),
    onNotificationClick: action("notification clicked"),
    debug: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Configuration par défaut avec des notifications simulées (mockNotifications)'
      }
    }
  }
};

export const WithoutUnreadNotifications: Story = {
  args: {
    notifications: [
      {
        notification_id: "story-notification-1",
        title: "Connect Added Comments on photos",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "comment" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: false
      },
      {
        notification_id: "story-notification-2",
        title: "Files transferred to editing team",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SELECTED,
        type: "transfer" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: false
      },
    ],
    onMarkAllAsRead: action("marked all as read"),
    onNotificationClick: action("notification clicked"),
  },
  parameters: {
    docs: {
      description: {
        story: 'Sans notifications non lues - le bouton n\'affiche pas de badge'
      }
    }
  }
};

export const WithUnreadNotifications: Story = {
  args: {
    notifications: [
      {
        notification_id: "story-notification-3",
        title: "Connect Added Comments on photos",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "comment" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: true
      },
      {
        notification_id: "story-notification-4",
        title: "Files transferred to editing team",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SELECTED,
        type: "transfer" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: false
      },
    ],
    onMarkAllAsRead: action("marked all as read"),
    onNotificationClick: action("notification clicked"),
  },
  parameters: {
    docs: {
      description: {
        story: 'Avec notifications non lues - le bouton affiche un badge'
      }
    }
  }
};

// Add a new story for debug mode
export const DebugMode: Story = {
  args: {
    notifications: [
      {
        notification_id: "debug-notification-1",
        title: "Debug Notification",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "comment" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: true
      },
      {
        notification_id: "debug-notification-2",
        title: "Another Debug Notification",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SELECTED,
        type: "transfer" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: false
      },
    ],
    onMarkAllAsRead: action("marked all as read"),
    onNotificationClick: action("notification clicked"),
    debug: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Avec mode debug activé - les actions sont enregistrées dans la console. Utile pour développement et débogage.'
      }
    }
  }
};

// Add story to demonstrate notification limit
export const WithSmallLimit: Story = {
  args: {
    notifications: Array.from({ length: 20 }, (_, i) => ({
      notification_id: `limit-${i}`,
      title: `Notification ${i+1}`,
      subtitle: `Test notification ${i+1}`,
      pictureStatus: i % 2 === 0 ? MediaStatus.VALIDATED : MediaStatus.SUBMITTED_FOR_APPROVAL,
      type: i % 3 === 0 ? "comment" : i % 3 === 1 ? "transfer" : "other",
      redirectLink: "#",
      date: new Date(Date.now() - i * 3600000), // Each 1 hour apart
      unread: i < 5 // First 5 are unread
    })),
    onMarkAllAsRead: action("marked all as read"),
    onNotificationClick: action("notification clicked"),
    debug: true,
    limit: 10 // Show only 10 notifications maximum
  },
  parameters: {
    docs: {
      description: {
        story: `
### Gestion des limites (10 notifications max)

Ce mode démontre la limitation à 10 notifications. Règles de suppression :
1. Les notifications les plus anciennes sont supprimées en premier
2. Les notifications déjà lues sont supprimées avant les non lues
3. Quand de nouvelles notifications arrivent, les plus anciennes sont supprimées automatiquement
        `
      }
    }
  }
};

// Add example with notification addition
const IncrementalNotificationsTemplate = (args) => {
  const notificationsRef = useRef<ButtonNotificationsRef>(null);
  
  const addNotification = () => {
    if (!notificationsRef.current) return;
    
    const newNotification = {
      notification_id: `story-add-${Date.now()}`,
      title: "Ajout dynamique de notifications (Ref API)",
      subtitle: `Added at ${new Date().toLocaleTimeString()}`,
      pictureStatus: MediaStatus.VALIDATED,
      type: "comment" as NotificationType,
      redirectLink: "#",
      date: new Date(),
      unread: true
    };
    
    notificationsRef.current.addNotifications([newNotification]);
    action("notification added")(newNotification);
  };
  
  return (
    <div className="flex flex-col items-center gap-6">
      <ButtonNotifications {...args} ref={notificationsRef} />
      <div className="flex flex-col gap-2 items-center">
        <Button onClick={addNotification}>Add New Notification</Button>
        <p className="text-sm text-muted-foreground text-center max-w-xs mt-2">
          Cliquez pour ajouter des notifications dynamiquement. Le composant gère automatiquement les limites.
        </p>
      </div>
    </div>
  );
};

export const IncrementalNotifications: Story = {
  render: IncrementalNotificationsTemplate,
  args: {
    notifications: [
      {
        notification_id: "incremental-1",
        title: "Initial Notification",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "comment" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: true
      }
    ],
    onMarkAllAsRead: action("marked all as read"),
    onNotificationClick: action("notification clicked"),
    debug: true,
    limit: 20
  },
  parameters: {
    docs: {
      description: {
        story: `
Ce mode démontre l'ajout incrémental de notifications via la méthode \`addNotifications\` exposée par le composant.

#### Code d'exemple:

\`\`\`tsx
// Créer une référence au composant ButtonNotifications
const notificationsRef = useRef<ButtonNotificationsRef>(null);

// Plus tard dans le code, ajouter une notification
if (notificationsRef.current) {
  const newNotification = {
    notification_id: \`notification-\${Date.now()}\`,
    title: "Nouvelle notification",
    subtitle: "Détails de la notification",
    pictureStatus: MediaStatus.VALIDATED,
    type: "comment",
    redirectLink: "/chemin-vers-page",
    date: new Date(),
    unread: true
  };
  
  notificationsRef.current.addNotifications([newNotification]);
}
\`\`\`
        `
      }
    }
  }
};

// Add story for multilingual support
const MultilingualTemplate = (args) => {
  const notificationsRef = useRef<ButtonNotificationsRef>(null);
  
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-center mb-4">
        Changez de langue dans la barre latérale de Storybook pour voir la traduction automatique des textes du composant.
      </p>
      <ButtonNotifications {...args} ref={notificationsRef} />
    </div>
  );
};

export const MultilingualSupport: Story = {
  render: MultilingualTemplate,
  args: {
    notifications: [
      {
        notification_id: "multilingual-1",
        title: "Support multilingue",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "comment" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: true
      }
    ],
    onMarkAllAsRead: action("marked all as read"),
    onNotificationClick: action("notification clicked"),
    debug: true
  },
  parameters: {
    docs: {
      description: {
        story: `
Le composant utilise le contexte \`TranslationContext\` pour traduire automatiquement :
- Le texte du bouton et son aria-label
- Les titres et descriptions du panneau de notifications
- Les messages d'état ("Vous êtes à jour", "X notifications non lues", etc.)
- Le bouton "marquer comme lu"
- Le format des dates (selon la locale)

#### Comment ça fonctionne

1. Le composant s'entoure d'un \`TranslationProvider\` :
\`\`\`tsx
<TranslationProvider>
  <ButtonNotifications />
</TranslationProvider>
\`\`\`

2. Il utilise le hook useTranslation pour accéder aux traductions :
\`\`\`tsx
const { t, currentLanguage } = useTranslation();
\`\`\`

3. Les clés de traduction sont utilisées via la fonction \`t()\` :
\`\`\`tsx
aria-label={t("notifications.title")}
\`\`\`

4. Les dates sont formatées selon la langue courante :
\`\`\`tsx
formatDateForLocale(date, 'format', currentLanguage.code)
\`\`\`
        `
      }
    }
  }
};

// Callback handling example
const CallbackHandlingTemplate = (args) => {
  const [lastAction, setLastAction] = React.useState<string>("Aucune action");
  const [lastId, setLastId] = React.useState<string>("");
  
  const handleMarkAllAsRead = (notifications: NotificationProps[]) => {
    setLastAction(`Marquer tout comme lu (${notifications.length} notifications)`);
    action("marked all as read")(notifications);
  };

  const handleNotificationClick = (id: string) => {
    setLastAction(`Notification cliquée`);
    setLastId(id);
    action("notification clicked")(id);
  };
  
  return (
    <div className="flex flex-col items-center gap-6">
      <ButtonNotifications 
        {...args} 
        onMarkAllAsRead={handleMarkAllAsRead}
        onNotificationClick={handleNotificationClick}
      />
      <div className="border rounded p-4 mt-4 w-full max-w-md">
        <h4 className="font-semibold mb-2">Journal d'actions :</h4>
        <p>Dernière action : {lastAction}</p>
        {lastId && <p className="text-sm text-muted-foreground">ID: {lastId}</p>}
      </div>
      <p className="text-sm text-center">
        Cliquez sur le bouton de notification, puis testez les actions dans le panneau qui s'ouvre.
      </p>
    </div>
  );
};

export const CallbackHandling: Story = {
  render: CallbackHandlingTemplate,
  args: {
    notifications: [
      {
        notification_id: "callback-1",
        title: "Notification with callback",
        subtitle: "Click me to trigger callback",
        pictureStatus: MediaStatus.VALIDATED,
        type: "comment" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: true
      },
      {
        notification_id: "callback-2",
        title: "Another notification",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "transfer" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: true
      }
    ],
    debug: true
  },
  parameters: {
    docs: {
      description: {
        story: `
Ce composant expose deux callbacks principaux :

#### 1. onNotificationClick
Appelé lorsque l'utilisateur clique sur une notification individuelle :
\`\`\`tsx
const handleNotificationClick = (notificationId: string) => {
  // Navigation vers la page liée à la notification
  navigate(\`/details/\${notificationId}\`);
  
  // Ou mise à jour d'un état dans votre application
  markAsReadInDatabase(notificationId);
}
\`\`\`

#### 2. onMarkAllAsRead
Appelé lorsque l'utilisateur clique sur "marquer tout comme lu" :
\`\`\`tsx
const handleMarkAllAsRead = (notifications: NotificationProps[]) => {
  // Mise à jour dans la base de données
  updateAllNotificationsStatus(notifications);
  
  // Affichage d'un toast de confirmation
  toast({
    title: "Notifications mises à jour",
    description: "Toutes les notifications ont été marquées comme lues"
  });
}
\`\`\`
        `
      }
    }
  }
};

// Add an example demonstrating the onClick callback functionality
const OnClickCallbackTemplate = (args) => {
  const [clickCount, setClickCount] = React.useState<number>(0);
  const [panelState, setPanelState] = React.useState<string>("fermé");
  
  const handleButtonClick = () => {
    setClickCount(prevCount => prevCount + 1);
    setPanelState(prev => prev === "fermé" ? "ouvert" : "fermé");
    action("button clicked")();
  };
  
  return (
    <div className="flex flex-col items-center gap-6">
      <ButtonNotifications 
        {...args} 
        onClick={handleButtonClick}
      />
      <div className="border rounded p-4 mt-4 w-full max-w-md">
        <h4 className="font-semibold mb-2">Démonstration du callback onClick :</h4>
        <p>Nombre de clics : {clickCount}</p>
        <p>État du panneau : {panelState}</p>
      </div>
      <p className="text-sm text-center max-w-md">
        Cet exemple illustre comment le callback onClick est appelé à chaque clic sur le bouton de notifications, 
        parallèlement à l'ouverture ou la fermeture du panneau. Le callback peut être utilisé pour effectuer 
        des actions supplémentaires comme la journalisation, le suivi analytique, ou la mise à jour d'états.
      </p>
    </div>
  );
};

export const OnClickCallbackExample: Story = {
  render: OnClickCallbackTemplate,
  args: {
    notifications: [
      {
        notification_id: "onclick-1",
        title: "Notification avec callback onClick",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.VALIDATED,
        type: "comment" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: true
      }
    ],
    debug: true
  },
  parameters: {
    docs: {
      description: {
        story: `
### Utilisation du callback onClick

Le composant \`ButtonNotifications\` accepte un prop \`onClick\` qui est appelé à chaque fois que l'utilisateur clique sur le bouton de notifications, en parallèle de l'ouverture/fermeture du panneau.

#### Cas d'utilisation
- Journalisation des interations utilisateur
- Déclenchement d'analyses (analytics)
- Mise à jour d'états externes
- Toute autre action qui doit se produire lors du clic sur le bouton

#### Exemple de code
\`\`\`tsx
// Dans votre composant parent
const handleNotificationButtonClick = () => {
  console.log("L'utilisateur a interagi avec les notifications");
  logUserInteraction("notifications_panel_toggle");
  
  // Autres actions possibles comme afficher un toast, mettre à jour un état, etc.
};

// Puis dans le rendu
<ButtonNotifications 
  onClick={handleNotificationButtonClick}
  notifications={myNotifications}
/>
\`\`\`

**Note importante**: Ce callback est indépendant de la fonctionnalité d'ouverture/fermeture du panneau qui se produit automatiquement. Le callback est simplement une façon pour le composant parent d'être informé et de réagir au clic sur le bouton.
        `
      }
    }
  }
};
