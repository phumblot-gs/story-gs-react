
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ButtonNotifications from "./ButtonNotifications";
import { MediaStatus } from "@/utils/mediaStatus";
import { NotificationType } from "./notifications/EventPanel";
import { action } from "@storybook/addon-actions";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { MemoryRouter } from "react-router-dom";

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
    onNotificationClick: { action: "notification clicked" }, // Changed from onEventClick
  },
};

export default meta;
type Story = StoryObj<typeof ButtonNotifications>;

export const Default: Story = {
  args: {
    onMarkAllAsRead: action("marked all as read"),
    onNotificationClick: action("notification clicked"), // Changed from onEventClick
  },
};

export const WithoutUnreadNotifications: Story = {
  args: {
    notifications: [ // Changed from events
      {
        notification_id: "story-notification-1", // Changed from event_id
        title: "Connect Added Comments on photos",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "comment" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: false
      },
      {
        notification_id: "story-notification-2", // Changed from event_id
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
    onNotificationClick: action("notification clicked"), // Changed from onEventClick
  },
};

export const WithUnreadNotifications: Story = {
  args: {
    notifications: [ // Changed from events
      {
        notification_id: "story-notification-3", // Changed from event_id
        title: "Connect Added Comments on photos",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "comment" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: true
      },
      {
        notification_id: "story-notification-4", // Changed from event_id
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
    onNotificationClick: action("notification clicked"), // Changed from onEventClick
  },
};
