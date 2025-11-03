
import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import NotificationPanel from "./NotificationPanel";
import { MediaStatus } from "@/utils/mediaStatus";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof NotificationPanel> = {
  title: "Components/NotificationPanel",
  component: NotificationPanel,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    title: {
      control: { type: "text" },
      description: "Title of the notification",
    },
    subtitle: {
      control: { type: "text" },
      description: "Subtitle of the notification",
    },
    pictureStatus: {
      control: {
        type: "select",
        options: Object.values(MediaStatus).filter(value => typeof value === 'number'),
      },
      description: "Status of the related picture",
    },
    type: {
      control: {
        type: "select",
        options: ["comment", "transfer", "other"],
      },
      description: "Type of notification",
    },
    redirectLink: {
      control: { type: "text" },
      description: "Link to redirect when clicking on the notification",
    },
    date: {
      control: { type: "date" },
      description: "Date of the notification",
    },
    unread: {
      control: { type: "boolean" },
      description: "Whether the notification has been read",
    },
  },
};

export default meta;
type Story = StoryObj<typeof NotificationPanel>;

export const Default: Story = {
  args: {
    notification_id: "story-notification-default",
    title: "Connect Added Comments on photos",
    subtitle: "STANDARD-2025-05-07 H02-PART-1",
    pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
    type: "comment",
    redirectLink: "#",
    date: new Date(),
    unread: true,
  },
};

export const Read: Story = {
  args: {
    ...Default.args,
    unread: false,
  },
};

export const WithLongTitle: Story = {
  args: {
    ...Default.args,
    title: "This is an extremely long notification title that should demonstrate the text truncation functionality with a tooltip when hovering over it",
  },
};

export const WithLongSubtitle: Story = {
  args: {
    ...Default.args,
    subtitle: "STANDARD-2025-05-07 H02-PART-1 This is a very long subtitle that should be truncated and show tooltip on hover",
  },
};

export const WithBothLong: Story = {
  args: {
    ...Default.args,
    title: "This is a very long notification title that should demonstrate the text truncation functionality",
    subtitle: "This is also a very long subtitle that should demonstrate the text truncation functionality - PROJECT-ID-2025-VERY-LONG-IDENTIFIER",
  },
};

export const DifferentStatus: Story = {
  args: {
    ...Default.args,
    pictureStatus: MediaStatus.VALIDATED,
  },
};
