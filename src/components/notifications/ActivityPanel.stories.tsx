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
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# ActivityPanel

Un panneau de notifications qui affiche une liste d'événements regroupés par date.

## Fonctionnalités
- Affiche les notifications regroupées par date
- Marque les notifications comme lues ou non lues
- Bouton pour marquer toutes les notifications comme lues
- Compatible avec plusieurs langues via TranslationContext
- Responsive et s'adapte à différentes tailles d'écran

## Utilisation

\`\`\`tsx
import React, { useState } from 'react';
import ActivityPanel from '@/components/notifications/ActivityPanel';
import { MediaStatus } from '@/utils/mediaStatus';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Exemple d'événements
  const events = [
    {
      title: "Commentaire ajouté sur la photo",
      subtitle: "PROJET-2025-01",
      pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
      type: "comment",
      redirectLink: "/projects/123",
      date: new Date(),
      unread: true
    },
    // Autres événements...
  ];

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Afficher les notifications
      </button>
      
      <ActivityPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        events={events}
      />
    </>
  );
};
\`\`\`

## Props

| Prop | Type | Description |
|------|------|-------------|
| isOpen | boolean | Contrôle la visibilité du panneau |
| onClose | () => void | Fonction appelée quand le panneau est fermé |
| events | EventProps[] | Tableau d'événements à afficher |

## Intégration avec ButtonNotifications

Ce composant s'intègre parfaitement avec \`ButtonNotifications\` pour créer un système complet de notifications:

\`\`\`tsx
import React, { useState } from 'react';
import ActivityPanel from '@/components/notifications/ActivityPanel';
import ButtonNotifications from '@/components/ButtonNotifications';

const NotificationsSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const events = [...]; // Vos événements
  const unreadCount = events.filter(e => e.unread).length;

  return (
    <>
      <ButtonNotifications 
        count={unreadCount}
        onClick={() => setIsOpen(true)} 
      />
      
      <ActivityPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        events={events}
      />
    </>
  );
};
\`\`\`
`
      }
    }
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <TranslationProvider>
          <Story />
        </TranslationProvider>
      </MemoryRouter>
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
    events: {
      control: { type: "object" },
      description: "List of notification events",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityPanel>;

const generateMockEvents = () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return [
    {
      title: "Connect Added Comments on photos",
      subtitle: "STANDARD-2025-05-07 H02-PART-1",
      pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
      type: "comment" as NotificationType,
      redirectLink: "#",
      date: today,
      unread: true
    },
    {
      title: "Connect Added Comments on photos",
      subtitle: "STANDARD-2025-05-07 H02-PART-1",
      pictureStatus: MediaStatus.SELECTED,
      type: "comment" as NotificationType,
      redirectLink: "#",
      date: today,
      unread: true
    },
    {
      title: "Files transferred to editing team",
      subtitle: "STANDARD-2025-05-07 H02-PART-1",
      pictureStatus: MediaStatus.VALIDATED,
      type: "transfer" as NotificationType,
      redirectLink: "#",
      date: today,
      unread: true
    },
    {
      title: "Connect Added Comments on photos",
      subtitle: "STANDARD-2025-05-07 H02-PART-1",
      pictureStatus: MediaStatus.BROADCAST,
      type: "comment" as NotificationType,
      redirectLink: "#",
      date: yesterday,
      unread: false
    },
    {
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
    events: generateMockEvents(),
  },
};

export const Empty: Story = {
  args: {
    isOpen: true,
    events: [],
  },
};

export const ManyEvents: Story = {
  args: {
    isOpen: true,
    events: [
      ...generateMockEvents(),
      ...generateMockEvents().map(event => ({
        ...event,
        date: new Date(new Date().setDate(new Date().getDate() - 2))
      })),
      ...generateMockEvents().map(event => ({
        ...event,
        date: new Date(new Date().setDate(new Date().getDate() - 3))
      })),
    ],
  },
};

export const AllRead: Story = {
  args: {
    isOpen: true,
    events: generateMockEvents().map(event => ({...event, unread: false})),
  },
};
