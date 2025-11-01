import React, { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ButtonNotifications from "./ButtonNotifications";
import { MediaStatus } from "@/utils/mediaStatus";
import { NotificationType } from "./notifications/NotificationPanel";
import { action } from "@storybook/addon-actions";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { MemoryRouter } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationProps } from "./notifications/NotificationPanel";
import type { ButtonNotificationsRef } from "./notifications/types";
import { Layout } from "@/components/layout";

const meta: Meta<typeof ButtonNotifications> = {
  title: "Components/ButtonNotifications",
  component: ButtonNotifications,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A component that manages the display and interaction with notifications.

## Features
- Integrates ActivityPanel: Opens/closes the side notification panel
- Multilingual support: Uses the TranslationProvider context to adapt texts to the selected language
- Limit management: Limits the display to a configurable number of notifications (100 by default)
- Ref API: Exposes methods to add notifications programmatically
- onClick callback: Called when the user clicks on the notification button, in parallel with opening/closing the panel

## Notification Limit Management Rules

When the limit is reached, the oldest notifications are removed by prioritizing:
1. First, already read notifications (oldest first)
2. Then only unread notifications (oldest first)
- Notifications are sorted by date (newest first)
        `
      }
    }
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TranslationProvider>
        <MemoryRouter>
          <Layout bg="white" padding={6}>
            <Story />
          </Layout>
        </MemoryRouter>
      </TranslationProvider>
    ),
  ],
  argTypes: {
    onClick: { 
      action: "clicked",
      description: 'Callback called when the user clicks on the notification button to open/close the panel',
      table: {
        type: { summary: '() => void' }
      }
    },
    onMarkAllAsRead: { 
      action: "marked all as read",
      description: 'Callback called when the user clicks on "Mark all as read"',
      table: {
        type: { summary: '(notifications: NotificationProps[]) => void' }
      }
    },
    onNotificationClick: { 
      action: "notification clicked",
      description: 'Callback called when the user clicks on a notification',
      table: {
        type: { summary: '(notification_id: string) => void' }
      }
    },
    debug: { 
      control: 'boolean',
      description: 'Enables debug mode to display events in the console',
      table: {
        defaultValue: { summary: false }
      }
    },
    limit: {
      control: { type: 'number', min: 5, max: 200, step: 5 },
      description: 'Maximum number of notifications to display (default: 100)',
      table: {
        defaultValue: { summary: 100 }
      }
    },
    notifications: {
      description: 'Initial list of notifications to display',
      control: 'object',
      table: {
        type: { summary: 'NotificationProps[]' }
      }
    },
    count: {
      description: 'Number of unread notifications to display on the badge (automatically calculated if not specified)',
      control: 'number',
      table: {
        type: { summary: 'number' }
      }
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Default configuration with simulated notifications (mockNotifications)'
      }
    }
  }
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
  parameters: {
    docs: {
      description: {
        story: 'Without unread notifications - the button does not display a badge'
      }
    }
  }
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
  parameters: {
    docs: {
      description: {
        story: 'With unread notifications - the button displays a badge'
      }
    }
  }
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
        story: 'With debug mode enabled - actions are logged in the console. Useful for development and debugging.'
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
        story: `
### Limit management (10 notifications max)

This mode demonstrates the limitation to 10 notifications. Deletion rules:
1. Oldest notifications are removed first
2. Already read notifications are removed before unread ones
3. When new notifications arrive, the oldest ones are automatically removed
        `
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
      title: "Dynamic notification addition (Ref API)",
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
          Click to add notifications dynamically. The component automatically manages limits.
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
        story: `
This mode demonstrates incremental notification addition via the \`addNotifications\` method exposed by the component.

**Example code:**

\`\`\`tsx
// Create a reference to the ButtonNotifications component
const notificationsRef = useRef<ButtonNotificationsRef>(null);

// Later in the code, add a notification
if (notificationsRef.current) {
  const newNotification = {
    notification_id: \`notification-\${Date.now()}\`,
    title: "New notification",
    subtitle: "Notification details",
    pictureStatus: MediaStatus.VALIDATED,
    type: "comment",
    redirectLink: "/path-to-page",
    date: new Date(),
    unread: true
  };
  
  notificationsRef.current.addNotifications([newNotification]);
}
\`\`\`
        `
      }
    }
  }
};

// Add story for multilingual support
const MultilingualTemplate = (args) => {
  const notificationsRef = useRef<ButtonNotificationsRef>(null);
  
  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm text-center mb-4">
        Change the language in Storybook's sidebar to see automatic translation of component texts.
      </p>
      <ButtonNotifications {...args} ref={notificationsRef} />
    </div>
  );
};

export const MultilingualSupport: Story = {
  render: MultilingualTemplate,
  args: {
    notifications: [
      {
        notification_id: "multilingual-1",
        title: "Support multilingue",
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
        story: `
The component uses the \`TranslationContext\` to automatically translate:
- Button text and its aria-label
- Notification panel titles and descriptions
- Status messages ("You're up to date", "X unread notifications", etc.)
- The "mark as read" button
- Date format (according to locale)

**How it works:**

1. The component is wrapped with a \`TranslationProvider\`:

\`\`\`tsx
<TranslationProvider>
  <ButtonNotifications />
</TranslationProvider>
\`\`\`

2. It uses the useTranslation hook to access translations:

\`\`\`tsx
const { t, currentLanguage } = useTranslation();
\`\`\`

3. Translation keys are used via the \`t()\` function:

\`\`\`tsx
aria-label={t("notifications.title")}
\`\`\`

4. Dates are formatted according to the current language:

\`\`\`tsx
formatDateForLocale(date, 'format', currentLanguage.code)
\`\`\`
        `
      }
    }
  }
};

// Callback handling example
const CallbackHandlingTemplate = (args) => {
  const [lastAction, setLastAction] = React.useState<string>("No action");
  const [lastId, setLastId] = React.useState<string>("");
  
  const handleMarkAllAsRead = (notifications: NotificationProps[]) => {
    setLastAction(`Mark all as read (${notifications.length} notifications)`);
    action("marked all as read")(notifications);
  };

  const handleNotificationClick = (id: string) => {
    setLastAction(`Notification clicked`);
    setLastId(id);
    action("notification clicked")(id);
  };
  
  return (
    <div className="flex flex-col items-center gap-6">
      <ButtonNotifications 
        {...args} 
        onMarkAllAsRead={handleMarkAllAsRead}
        onNotificationClick={handleNotificationClick}
      />
      <div className="border rounded p-4 mt-4 w-full max-w-md">
        <h4 className="font-semibold mb-2">Action log:</h4>
        <p>Last action: {lastAction}</p>
        {lastId && <p className="text-sm text-muted-foreground">ID: {lastId}</p>}
      </div>
      <p className="text-sm text-center">
        Click on the notification button, then test the actions in the panel that opens.
      </p>
    </div>
  );
};

export const CallbackHandling: Story = {
  render: CallbackHandlingTemplate,
  args: {
    notifications: [
      {
        notification_id: "callback-1",
        title: "Notification with callback",
        subtitle: "Click me to trigger callback",
        pictureStatus: MediaStatus.VALIDATED,
        type: "comment" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: true
      },
      {
        notification_id: "callback-2",
        title: "Another notification",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.SUBMITTED_FOR_APPROVAL,
        type: "transfer" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: true
      }
    ],
    debug: true
  },
  parameters: {
    docs: {
      description: {
        story: `
This component exposes two main callbacks:

**1. onNotificationClick**

Called when the user clicks on an individual notification:

\`\`\`tsx
const handleNotificationClick = (notificationId: string) => {
  // Navigate to the page linked to the notification
  navigate(\`/details/\${notificationId}\`);
  
  // Or update a state in your application
  markAsReadInDatabase(notificationId);
}
\`\`\`

**2. onMarkAllAsRead**

Called when the user clicks on "mark all as read":

\`\`\`tsx
const handleMarkAllAsRead = (notifications: NotificationProps[]) => {
  // Update in database
  updateAllNotificationsStatus(notifications);
  
  // Display a confirmation toast
  toast({
    title: "Notifications updated",
    description: "All notifications have been marked as read"
  });
}
\`\`\`
        `
      }
    }
  }
};

// Add an example demonstrating the onClick callback functionality
const OnClickCallbackTemplate = (args) => {
  const [clickCount, setClickCount] = React.useState<number>(0);
  const [panelState, setPanelState] = React.useState<string>("closed");
  
  const handleButtonClick = () => {
    setClickCount(prevCount => prevCount + 1);
    setPanelState(prev => prev === "closed" ? "open" : "closed");
    action("button clicked")();
  };
  
  return (
    <div className="flex flex-col items-center gap-6">
      <ButtonNotifications 
        {...args} 
        onClick={handleButtonClick}
      />
      <div className="border rounded p-4 mt-4 w-full max-w-md">
        <h4 className="font-semibold mb-2">onClick callback demonstration:</h4>
        <p>Click count: {clickCount}</p>
        <p>Panel state: {panelState}</p>
      </div>
      <p className="text-sm text-center max-w-md">
        This example illustrates how the onClick callback is called on each click on the notification button, 
        in parallel with opening or closing the panel. The callback can be used to perform 
        additional actions such as logging, analytics tracking, or state updates.
      </p>
    </div>
  );
};

export const OnClickCallbackExample: Story = {
  render: OnClickCallbackTemplate,
  args: {
    notifications: [
      {
        notification_id: "onclick-1",
        title: "Notification avec callback onClick",
        subtitle: "STANDARD-2025-05-07 H02-PART-1",
        pictureStatus: MediaStatus.VALIDATED,
        type: "comment" as NotificationType,
        redirectLink: "#",
        date: new Date(),
        unread: true
      }
    ],
    debug: true
  },
  parameters: {
    docs: {
      description: {
        story: `
**Using the onClick callback**

The \`ButtonNotifications\` component accepts an \`onClick\` prop that is called every time the user clicks on the notification button, in parallel with opening/closing the panel.

**Use cases:**
- Logging user interactions
- Triggering analytics
- Updating external states
- Any other action that should occur when clicking the button

**Example code:**

\`\`\`tsx
// In your parent component
const handleNotificationButtonClick = () => {
  console.log("User interacted with notifications");
  logUserInteraction("notifications_panel_toggle");
  
  // Other possible actions like displaying a toast, updating a state, etc.
};

// Then in the render
<ButtonNotifications 
  onClick={handleNotificationButtonClick}
  notifications={myNotifications}
/>
\`\`\`

**Important note:** This callback is independent of the panel opening/closing functionality that occurs automatically. The callback is simply a way for the parent component to be informed and react to the button click.
        `
      }
    }
  }
};
