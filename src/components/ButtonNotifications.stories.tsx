
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ButtonNotifications from "./ButtonNotifications";
import { MediaStatus } from "@/utils/mediaStatus";

const meta: Meta<typeof ButtonNotifications> = {
  title: "Components/ButtonNotifications",
  component: ButtonNotifications,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-6 bg-white rounded-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ButtonNotifications>;

export const Default: Story = {
  args: {},
};

export const WithoutUnreadNotifications: Story = {
  args: {
    events: [
      {
        title: "Connect Added Comments on photos",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "comment",
        redirectLink: "#",
        date: new Date(),
        unread: false
      },
      {
        title: "Files transferred to editing team",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SELECTED,
        type: "transfer",
        redirectLink: "#",
        date: new Date(),
        unread: false
      },
    ],
  },
};

export const WithUnreadNotifications: Story = {
  args: {
    events: [
      {
        title: "Connect Added Comments on photos",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "comment",
        redirectLink: "#",
        date: new Date(),
        unread: true
      },
      {
        title: "Files transferred to editing team",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SELECTED,
        type: "transfer",
        redirectLink: "#",
        date: new Date(),
        unread: false
      },
    ],
  },
};
