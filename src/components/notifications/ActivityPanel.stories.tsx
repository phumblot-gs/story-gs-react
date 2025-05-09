
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
