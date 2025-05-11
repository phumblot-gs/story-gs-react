
import React, { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ButtonNotifications, { ButtonNotificationsRef } from "./ButtonNotifications";
import { MediaStatus } from "@/utils/mediaStatus";
import { NotificationType } from "./notifications/NotificationPanel";
import { action } from "@storybook/addon-actions";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { MemoryRouter } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationProps } from "./notifications/NotificationPanel";

const meta: Meta<typeof ButtonNotifications> = {
  title: "Components/ButtonNotifications",
  component: ButtonNotifications,
  parameters: {
    layout: "centered",
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
    onMarkAllAsRead: { action: "marked all as read" },
    onNotificationClick: { action: "notification clicked" },
    debug: { 
      control: 'boolean',
      description: 'Enable debug mode to log events to console'
    },
    limit: {
      control: { type: 'number', min: 5, max: 200, step: 5 },
      description: 'Maximum number of notifications to display (default: 100)'
    }
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
        story: 'This variant enables debug mode, which logs component actions to the console.'
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
        story: 'Demonstrates limiting the number of notifications to 10. When new notifications are added, older ones are automatically removed.'
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
      title: "Incrementally Added Notification",
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
          Click to add notifications incrementally. The component automatically manages the notification limit.
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
        story: 'Demonstrates adding notifications incrementally with the exposed ref method and a custom limit of 20.'
      }
    }
  }
};
