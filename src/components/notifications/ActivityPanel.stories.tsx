
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ActivityPanel from "./ActivityPanel";
import ActivityPanelContent from "./ActivityPanelContent";
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
          # Activity Panel
          
          Le composant ActivityPanel est un panneau latéral qui affiche les notifications et activités récentes.
          
          ## Fonctionnalités
          - Affiche les notifications regroupées par date
          - Permet de marquer toutes les notifications comme lues
          - Indique le nombre de notifications non lues
          - Utilise le système de traduction pour l'internationalisation
          
          ## Utilisation
          
          \`\`\`tsx
          import { ActivityPanel } from "@/components/notifications/ActivityPanel";
          
          function MyComponent() {
            const [isOpen, setIsOpen] = useState(false);
            const events = [/* ... vos événements ici ... */];
            
            return (
              <ActivityPanel
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                events={events}
              />
            );
          }
          \`\`\`
        `
      }
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

// Configure the parameters for iframe display
const iframeParameters = {
  chromatic: { disableSnapshot: false },
  viewport: {
    viewports: {
      activityPanel: {
        name: 'ActivityPanel Frame',
        styles: {
          width: '400px',
          height: '600px',
        },
      },
    },
    defaultViewport: 'activityPanel',
  },
  // This ensures the story is contained within its container
  layout: 'fullscreen',
};

// Regular stories for the full component
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

// Static content view stories for better Storybook visualization
export const StaticContentView: Story = {
  name: "Contenu du panneau (iframe)",
  parameters: iframeParameters,
  render: () => <ActivityPanelContent events={generateMockEvents()} />
};

export const StaticContentEmpty: Story = {
  name: "Contenu vide (iframe)",
  parameters: iframeParameters,
  render: () => <ActivityPanelContent events={[]} />
};

export const StaticContentManyEvents: Story = {
  name: "Contenu avec plusieurs événements (iframe)",
  parameters: iframeParameters,
  render: () => <ActivityPanelContent 
    events={[
      ...generateMockEvents(),
      ...generateMockEvents().map(event => ({
        ...event,
        date: new Date(new Date().setDate(new Date().getDate() - 2))
      })),
      ...generateMockEvents().map(event => ({
        ...event,
        date: new Date(new Date().setDate(new Date().getDate() - 3))
      })),
    ]} 
  />
};

export const StaticContentAllRead: Story = {
  name: "Contenu avec tout lu (iframe)",
  parameters: iframeParameters,
  render: () => <ActivityPanelContent 
    events={generateMockEvents().map(event => ({...event, unread: false}))} 
  />
};
