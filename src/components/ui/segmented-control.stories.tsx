import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SegmentedControl, SegmentedControlList, SegmentedControlTrigger, SegmentedControlContent } from "./segmented-control";
import { Layout } from "@/components/layout";
import { Icon } from "@/components/ui/icons/Icon";

const meta: Meta<typeof SegmentedControl> = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `A segmented control component that displays multiple options in a single control, allowing users to switch between different views or states.

## Features

- Supports multiple background types (white, grey, black)
- Accessible keyboard navigation
- Customizable appearance based on background context
- Icon and text support in triggers
- Smooth transitions between states

## API

### SegmentedControl (Root)

Extends \`TabsPrimitive.TabsProps\` from Radix UI.

- \`value\`: string - The currently selected value
- \`onValueChange\`: (value: string) => void - Callback when selection changes
- \`defaultValue\`: string (optional) - Initial selected value

### SegmentedControlList

Container for all trigger buttons. Automatically handles layout and spacing.

- Extends \`TabsPrimitive.TabsListProps\`
- Adapts its appearance based on the parent \`Layout\` component's \`bg\` prop

### SegmentedControlTrigger

Individual trigger button for each option.

- \`value\`: string - Unique value for this trigger
- \`disabled\`: boolean (optional) - Whether the trigger is disabled
- Children: ReactNode - Content (icons, text, etc.)

### SegmentedControlContent

Content panel displayed when the corresponding trigger is active.

- \`value\`: string - Matches the trigger value to display
- Children: ReactNode - Content displayed when this tab is active

**Note:** You can use a \`Layout\` component inside \`SegmentedControlContent\` to create a new background context for each tab. This allows each tab to have its own background color, padding, and scroll behavior.

## Background Types

The component automatically adapts its appearance based on the nearest \`Layout\` component's \`bg\` prop:

- **\`white\`**: White background with dark active state
- **\`grey\`**: Grey background (default) with white active state
- **\`black\`**: Black background with light active state`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'The currently selected value (controlled mode)',
    },
    defaultValue: {
      control: 'text',
      description: 'Initial selected value (uncontrolled mode)',
    },
    onValueChange: {
      action: 'valueChanged',
      description: 'Callback fired when the selected value changes',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the tabs',
    },
    dir: {
      control: 'select',
      options: ['ltr', 'rtl'],
      description: 'Text direction',
    },
    activationMode: {
      control: 'select',
      options: ['automatic', 'manual'],
      description: 'When automatic, tabs are activated when receiving focus. When manual, tabs are activated when clicked.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  args: {
    defaultValue: 'tab1',
    className: 'w-[400px]',
  },
  render: (args) => (
    <Layout bg="grey" padding={6}>
      <SegmentedControl {...args}>
        <SegmentedControlList>
          <SegmentedControlTrigger value="tab1">Tab 1</SegmentedControlTrigger>
          <SegmentedControlTrigger value="tab2">Tab 2</SegmentedControlTrigger>
          <SegmentedControlTrigger value="tab3">Tab 3</SegmentedControlTrigger>
        </SegmentedControlList>
        <SegmentedControlContent value="tab1">
          <p className="text-sm">Content for Tab 1</p>
        </SegmentedControlContent>
        <SegmentedControlContent value="tab2">
          <p className="text-sm">Content for Tab 2</p>
        </SegmentedControlContent>
        <SegmentedControlContent value="tab3">
          <p className="text-sm">Content for Tab 3</p>
        </SegmentedControlContent>
      </SegmentedControl>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Basic usage of SegmentedControl with three tabs.",
      },
    },
  },
};

export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState("account");
    return (
      <Layout bg="grey" padding={6}>
        <SegmentedControl value={value} onValueChange={setValue} className="w-[500px]">
          <SegmentedControlList>
            <SegmentedControlTrigger value="account">
              <Icon name="Users" size={14} />
              Account
            </SegmentedControlTrigger>
            <SegmentedControlTrigger value="password">
              <Icon name="Alert" size={14} />
              Password
            </SegmentedControlTrigger>
            <SegmentedControlTrigger value="settings">
              <Icon name="Settings" size={14} />
              Settings
            </SegmentedControlTrigger>
          </SegmentedControlList>
          <SegmentedControlContent value="account" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Account Information</h3>
              <p className="text-sm text-muted-foreground">
                Manage your account information and preferences.
              </p>
            </div>
          </SegmentedControlContent>
          <SegmentedControlContent value="password" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Password</h3>
              <p className="text-sm text-muted-foreground">
                Change your password to secure your account.
              </p>
            </div>
          </SegmentedControlContent>
          <SegmentedControlContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure your application preferences.
              </p>
            </div>
          </SegmentedControlContent>
        </SegmentedControl>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "SegmentedControl with icons and text in triggers.",
      },
    },
  },
};

export const AllBackgrounds: Story = {
  render: () => {
    const [whiteValue, setWhiteValue] = useState("tab1");
    const [greyValue, setGreyValue] = useState("tab1");
    const [blackValue, setBlackValue] = useState("tab1");

    return (
      <div className="space-y-8 p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">White Background</h3>
          <Layout bg="white" padding={4}>
            <SegmentedControl value={whiteValue} onValueChange={setWhiteValue} className="w-[400px]">
              <SegmentedControlList>
                <SegmentedControlTrigger value="tab1">Tab 1</SegmentedControlTrigger>
                <SegmentedControlTrigger value="tab2">Tab 2</SegmentedControlTrigger>
                <SegmentedControlTrigger value="tab3">Tab 3</SegmentedControlTrigger>
              </SegmentedControlList>
              <SegmentedControlContent value="tab1">
                <p className="text-sm">Content for Tab 1</p>
              </SegmentedControlContent>
              <SegmentedControlContent value="tab2">
                <p className="text-sm">Content for Tab 2</p>
              </SegmentedControlContent>
              <SegmentedControlContent value="tab3">
                <p className="text-sm">Content for Tab 3</p>
              </SegmentedControlContent>
            </SegmentedControl>
          </Layout>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Grey Background (Default)</h3>
          <Layout bg="grey" padding={4}>
            <SegmentedControl value={greyValue} onValueChange={setGreyValue} className="w-[400px]">
              <SegmentedControlList>
                <SegmentedControlTrigger value="tab1">Tab 1</SegmentedControlTrigger>
                <SegmentedControlTrigger value="tab2">Tab 2</SegmentedControlTrigger>
                <SegmentedControlTrigger value="tab3">Tab 3</SegmentedControlTrigger>
              </SegmentedControlList>
              <SegmentedControlContent value="tab1">
                <p className="text-sm">Content for Tab 1</p>
              </SegmentedControlContent>
              <SegmentedControlContent value="tab2">
                <p className="text-sm">Content for Tab 2</p>
              </SegmentedControlContent>
              <SegmentedControlContent value="tab3">
                <p className="text-sm">Content for Tab 3</p>
              </SegmentedControlContent>
            </SegmentedControl>
          </Layout>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Black Background</h3>
          <Layout bg="black" padding={4}>
            <SegmentedControl value={blackValue} onValueChange={setBlackValue} className="w-[400px]">
              <SegmentedControlList>
                <SegmentedControlTrigger value="tab1">Tab 1</SegmentedControlTrigger>
                <SegmentedControlTrigger value="tab2">Tab 2</SegmentedControlTrigger>
                <SegmentedControlTrigger value="tab3">Tab 3</SegmentedControlTrigger>
              </SegmentedControlList>
              <SegmentedControlContent value="tab1">
                <p className="text-sm text-white">Content for Tab 1</p>
              </SegmentedControlContent>
              <SegmentedControlContent value="tab2">
                <p className="text-sm text-white">Content for Tab 2</p>
              </SegmentedControlContent>
              <SegmentedControlContent value="tab3">
                <p className="text-sm text-white">Content for Tab 3</p>
              </SegmentedControlContent>
            </SegmentedControl>
          </Layout>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "SegmentedControl displayed on all three background types (white, grey, black) to demonstrate automatic styling adaptation.",
      },
    },
  },
};

export const DisabledTab: Story = {
  render: () => (
    <Layout bg="grey" padding={6}>
      <SegmentedControl defaultValue="tab1" className="w-[400px]">
        <SegmentedControlList>
          <SegmentedControlTrigger value="tab1">Active</SegmentedControlTrigger>
          <SegmentedControlTrigger value="tab2" disabled>
            Disabled
          </SegmentedControlTrigger>
          <SegmentedControlTrigger value="tab3">Active</SegmentedControlTrigger>
        </SegmentedControlList>
        <SegmentedControlContent value="tab1">
          <p className="text-sm">Content for active tab 1</p>
        </SegmentedControlContent>
        <SegmentedControlContent value="tab2">
          <p className="text-sm">This content is not accessible</p>
        </SegmentedControlContent>
        <SegmentedControlContent value="tab3">
          <p className="text-sm">Content for active tab 3</p>
        </SegmentedControlContent>
      </SegmentedControl>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "SegmentedControl with a disabled tab. Disabled tabs cannot be selected and are visually distinct.",
      },
    },
  },
};

export const ManyTabs: Story = {
  render: () => (
    <Layout bg="grey" padding={6}>
      <SegmentedControl defaultValue="tab1" className="w-[600px]">
        <SegmentedControlList>
          <SegmentedControlTrigger value="tab1">Tab 1</SegmentedControlTrigger>
          <SegmentedControlTrigger value="tab2">Tab 2</SegmentedControlTrigger>
          <SegmentedControlTrigger value="tab3">Tab 3</SegmentedControlTrigger>
          <SegmentedControlTrigger value="tab4">Tab 4</SegmentedControlTrigger>
          <SegmentedControlTrigger value="tab5">Tab 5</SegmentedControlTrigger>
        </SegmentedControlList>
        <SegmentedControlContent value="tab1">
          <p className="text-sm">Content 1</p>
        </SegmentedControlContent>
        <SegmentedControlContent value="tab2">
          <p className="text-sm">Content 2</p>
        </SegmentedControlContent>
        <SegmentedControlContent value="tab3">
          <p className="text-sm">Content 3</p>
        </SegmentedControlContent>
        <SegmentedControlContent value="tab4">
          <p className="text-sm">Content 4</p>
        </SegmentedControlContent>
        <SegmentedControlContent value="tab5">
          <p className="text-sm">Content 5</p>
        </SegmentedControlContent>
      </SegmentedControl>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "SegmentedControl with multiple tabs to test behavior with many options.",
      },
    },
  },
};

export const WithLayoutInContent: Story = {
  render: () => {
    const [value, setValue] = useState("tab1");
    return (
      <Layout bg="grey" padding={6}>
        <SegmentedControl value={value} onValueChange={setValue} className="w-[500px]">
          <SegmentedControlList>
            <SegmentedControlTrigger value="tab1">Tab 1</SegmentedControlTrigger>
            <SegmentedControlTrigger value="tab2">Tab 2</SegmentedControlTrigger>
            <SegmentedControlTrigger value="tab3">Tab 3</SegmentedControlTrigger>
          </SegmentedControlList>
          
          <SegmentedControlContent value="tab1">
            <Layout bg="white" padding={4} className="rounded-md">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Content with White Background</h3>
                <p className="text-sm text-muted-foreground">
                  This content uses a Layout component with bg="white" inside SegmentedControlContent.
                  The Layout creates a new background context, so any child components will adapt to the white background.
                </p>
              </div>
            </Layout>
          </SegmentedControlContent>
          
          <SegmentedControlContent value="tab2">
            <Layout bg="black" padding={4} className="rounded-md">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white">Content with Black Background</h3>
                <p className="text-sm text-white/80">
                  This content uses a Layout component with bg="black" inside SegmentedControlContent.
                  The Layout creates a new background context, overriding the parent grey background.
                </p>
              </div>
            </Layout>
          </SegmentedControlContent>
          
          <SegmentedControlContent value="tab3">
            <Layout bg="grey" padding={4} className="rounded-md">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Content with Grey Background</h3>
                <p className="text-sm text-muted-foreground">
                  This content uses a Layout component with bg="grey" inside SegmentedControlContent.
                  Each tab can have its own background context, padding, and scroll behavior.
                </p>
              </div>
            </Layout>
          </SegmentedControlContent>
        </SegmentedControl>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Example showing how to use Layout component inside SegmentedControlContent. Each content panel can have its own background context, padding, and styling. The Layout component creates a new BgContext that overrides the parent context, allowing each tab to have different background colors.",
      },
    },
  },
};


