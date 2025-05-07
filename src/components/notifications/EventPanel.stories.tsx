
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import EventPanel from "./EventPanel";
import { MediaStatus } from "@/utils/mediaStatus";

const meta: Meta<typeof EventPanel> = {
  title: "Components/Notifications/EventPanel",
  component: EventPanel,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: { type: "text" },
      description: "Title of the event",
    },
    subtitle: {
      control: { type: "text" },
      description: "Subtitle of the event",
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
      description: "Link to redirect when clicking on the event",
    },
    date: {
      control: { type: "date" },
      description: "Date of the event",
    },
    unread: {
      control: { type: "boolean" },
      description: "Whether the notification has been read",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EventPanel>;

export const Default: Story = {
  args: {
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

export const WithLongSubtitle: Story = {
  args: {
    ...Default.args,
    subtitle: "STANDARD-2025-05-07 H02-PART-1 This is a very long subtitle that should be truncated",
  },
};

export const DifferentStatus: Story = {
  args: {
    ...Default.args,
    pictureStatus: MediaStatus.VALIDATED,
  },
};
