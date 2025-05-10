
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ActivityPanel from "./ActivityPanel";
import { MediaStatus } from "@/utils/mediaStatus";
import { NotificationType } from "./EventPanel";
import { MemoryRouter } from "react-router-dom";
import { TranslationProvider } from "@/contexts/TranslationContext";

const meta: Meta<typeof ActivityPanel> = {
  title: "Components/Notifications/ActivityPanel",
  component: ActivityPanel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `

Le composant ActivityPanel est un panneau latéral qui affiche les notifications et activités récentes.
Il est nativement instancié par le composant ButtonNotifications.

## Fonctionnalités
- Affiche les notifications regroupées par date
- Permet de marquer toutes les notifications comme lues
- Indique le nombre de notifications non lues
- Utilise le système de traduction pour l'internationalisation
- Mode debug disponible pour afficher les données des notifications dans la console
- Possibilité d'être notifié quand toutes les notifications sont marquées comme lues via onMarkAllAsRead

## Utilisation

\`\`\`tsx
import { ActivityPanel } from "@/components/notifications/ActivityPanel";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = [/* ... vos notifications ici ... */];
  
  const handleMarkAllAsRead = (updatedNotifications) => {
    console.log('Toutes les notifications ont été marquées comme lues', updatedNotifications);
    // Faire quelque chose avec les notifications mises à jour
  };
  
  return (
    <ActivityPanel
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      notifications={notifications}
      debug={true} // Optionnel: activer le mode debug
      onMarkAllAsRead={handleMarkAllAsRead} // Optionnel: callback quand tout est marqué comme lu
    />
  );
}
\`\`\`
        `,
      },
      canvas: { disable: true }
    }
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TranslationProvider initialLanguage={{ code: "FR", name: "Français" }}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </TranslationProvider>
    ),
  ],
  argTypes: {
    isOpen: {
      control: { type: "boolean" },
      description: "Whether the panel is visible",
    },
    onClose: {
      action: "closed",
      description: "Called when the panel is closed",
    },
    notifications: { // Changed from events
      control: { type: "object" },
      description: "List of notification items", // Changed from events
    },
    debug: {
      control: { type: "boolean" },
      description: "Enable debug mode to log notification data to console on click", // Changed from event
    },
    onMarkAllAsRead: {
      action: "marked all as read",
      description: "Called when all notifications are marked as read",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityPanel>;

const generateMockNotifications = () => { // Changed from Events
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return [
    {
      notification_id: "activity-story-1", // Changed from event_id
      title: "Connect Added Comments on photos",
      subtitle: "STANDARD-2025-05-07 H02-PART-1",
      pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
      type: "comment" as NotificationType,
      redirectLink: "#",
      date: today,
      unread: true
    },
    {
      notification_id: "activity-story-2", // Changed from event_id
      title: "Connect Added Comments on photos",
      subtitle: "STANDARD-2025-05-07 H02-PART-1",
      pictureStatus: MediaStatus.SELECTED,
      type: "comment" as NotificationType,
      redirectLink: "#",
      date: today,
      unread: true
    },
    {
      notification_id: "activity-story-3", // Changed from event_id
      title: "Files transferred to editing team",
      subtitle: "STANDARD-2025-05-07 H02-PART-1",
      pictureStatus: MediaStatus.VALIDATED,
      type: "transfer" as NotificationType,
      redirectLink: "#",
      date: today,
      unread: true
    },
    {
      notification_id: "activity-story-4", // Changed from event_id
      title: "Connect Added Comments on photos",
      subtitle: "STANDARD-2025-05-07 H02-PART-1",
      pictureStatus: MediaStatus.BROADCAST,
      type: "comment" as NotificationType,
      redirectLink: "#",
      date: yesterday,
      unread: false
    },
    {
      notification_id: "activity-story-5", // Changed from event_id
      title: "Files published to website",
      subtitle: "STANDARD-2025-05-07 H02-PART-1",
      pictureStatus: MediaStatus.BROADCAST,
      type: "other" as NotificationType,
      redirectLink: "#",
      date: yesterday,
      unread: false
    },
  ];
}

export const Default: Story = {
  args: {
    isOpen: true,
    notifications: generateMockNotifications(), // Changed from events
    debug: false,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: { disable: true }
  }
};

export const DebugMode: Story = {
  args: {
    isOpen: true,
    notifications: generateMockNotifications(), // Changed from events
    debug: true,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: { disable: true }
  }
};

export const Empty: Story = {
  args: {
    isOpen: true,
    notifications: [], // Changed from events
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: { disable: true }
  }
};

export const ManyNotifications: Story = { // Changed from ManyEvents
  args: {
    isOpen: true,
    notifications: [ // Changed from events
      ...generateMockNotifications(),
      ...generateMockNotifications().map(notification => ({ // Changed from event
        ...notification,
        notification_id: `many-${notification.notification_id}`, // Changed from event_id
        date: new Date(new Date().setDate(new Date().getDate() - 2))
      })),
      ...generateMockNotifications().map(notification => ({ // Changed from event
        ...notification,
        notification_id: `many-older-${notification.notification_id}`, // Changed from event_id
        date: new Date(new Date().setDate(new Date().getDate() - 3))
      })),
    ],
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: { disable: true }
  }
};

export const AllRead: Story = {
  args: {
    isOpen: true,
    notifications: generateMockNotifications().map(notification => ({...notification, unread: false})), // Changed from event
  },
  parameters: {
    chromatic: { disableSnapshot: true },
    docs: { disable: true }
  }
};
