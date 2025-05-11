
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
          Click to add notifications incrementally. The component automatically manages the 100 notification limit.
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
    debug: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates adding notifications incrementally with the exposed ref method.'
      }
    }
  }
};
