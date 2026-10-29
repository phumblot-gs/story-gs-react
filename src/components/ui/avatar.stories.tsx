import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Button } from "./button";
import { Layout, HStack, VStack } from "@/components/layout";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Avatar component for displaying user profile pictures or initials.

## Features
- Three sizes (small, medium, large) matching Button component heights
- Image fallback support when image fails to load
- Customizable fallback text/initials
- Radix UI primitives for accessibility
- Can be wrapped with Button for clickable avatars

## Basic Usage

\`\`\`tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
\`\`\`

## With Button

The Avatar component can be wrapped with a Button to create clickable avatars:

\`\`\`tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

<Button variant="ghost" className="p-0 w-6 h-6">
  <Avatar size="medium">
    <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
</Button>
\`\`\`

**Important notes:**

- Use \`className="p-0"\` on the Button to remove padding and let Avatar control its size
- Match the Avatar size with Button dimensions: \`className="p-0 w-4 h-4"\` for small (20px), \`className="p-0 w-6 h-6"\` for medium (30px), \`className="p-0 w-10 h-10"\` for large (50px)
- The Avatar maintains its circular shape while inheriting Button's hover/focus states
- **Note:** Cannot use \`asChild\` prop because Avatar contains multiple children (AvatarImage + AvatarFallback). \`asChild\` requires a single React element child.
        `
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
        size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Avatar size (small: 20px, medium: 30px, large: 50px) - using Tailwind spacing variables",
    },
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <Story />
      </Layout>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    size: "medium",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  args: {
    size: "medium",
  },
  render: (args) => (
    <Avatar {...args}>
      {/* Image invalide sans requête réseau : le fallback s'affiche. */}
      <AvatarImage src="data:image/png;base64," alt="@user" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <VStack gap={6}>
      <div>
        <h3 className="gs-typo-h3 mb-3">All Sizes</h3>
        <p className="text-sm text-grey-stronger mb-4">
          Avatar sizes match Button component sizes for consistency across the design system.
        </p>
      </div>
      <HStack gap={4} align="center">
        <VStack gap={2} align="center">
          <Avatar size="small">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-xs text-grey-stronger">Small (20px)</span>
        </VStack>
        <VStack gap={2} align="center">
          <Avatar size="medium">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-xs text-grey-stronger">Medium (30px)</span>
        </VStack>
        <VStack gap={2} align="center">
          <Avatar size="large">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="text-xs text-grey-stronger">Large (50px)</span>
        </VStack>
      </HStack>
    </VStack>
  ),
};

const INITIALS = ["BK", "MJ", "AL", "WQ"];

/**
 * Initials are sized at 40% of the avatar's diameter (9px minimum) and trimmed
 * to the cap height (`gs-text-trim`), so they scale with any size and sit at
 * the optical centre of the circle.
 */
export const InitialsCentering: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Initials scale with the avatar: 40% of its diameter, 9px minimum (20px → 9px, 30px → 12px, 50px → 20px), including custom sizes set with `className`. A `text-*` class on `AvatarFallback` still overrides it. The text is wrapped in a `gs-text-trim` span (`text-box: trim-both cap alphabetic`) so capitals are centred on the cap height rather than on the font's full line box, which leaves them about 0.1em too high. Elements passed as children (icons, custom spans) are not wrapped.",
      },
    },
  },
  render: () => (
    <VStack gap={4}>
      {(["small", "medium", "large"] as const).map((size) => (
        <HStack key={size} gap={3} align="center">
          {INITIALS.map((initials) => (
            <Avatar key={initials} size={size}>
              <AvatarFallback className="bg-grey-light text-black">
                {initials}
              </AvatarFallback>
            </Avatar>
          ))}
          <span className="text-xs text-grey-stronger">{size}</span>
        </HStack>
      ))}
      {[28, 40, 80].map((px) => (
        <HStack key={px} gap={3} align="center">
          {INITIALS.map((initials) => (
            <Avatar key={initials} style={{ width: px, height: px }}>
              <AvatarFallback className="bg-grey-light text-black">{initials}</AvatarFallback>
            </Avatar>
          ))}
          <span className="text-xs text-grey-stronger">custom {px}px</span>
        </HStack>
      ))}
    </VStack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const initials = await canvas.findAllByText("BK");
    // small, medium, large, then the 28 / 40 / 80px custom avatars.
    const expectedSizes = [9, 12, 20, 11.2, 16, 32];
    initials.forEach((el, i) => {
      expect(el).toHaveClass("gs-text-trim");
      expect(parseFloat(getComputedStyle(el).fontSize)).toBeCloseTo(expectedSizes[i], 1);
    });
  },
};

export const WithButton: Story = {
  args: {
    size: "medium",
  },
  render: (args) => {
    const [debug, setDebug] = React.useState(false);
    
    const handleSmallClick = () => {
      console.log('[Avatar Button Click] Small avatar button clicked');
    };
    
    const handleMediumClick = () => {
      console.log('[Avatar Button Click] Medium avatar button clicked');
    };
    
    const handleLargeClick = () => {
      console.log('[Avatar Button Click] Large avatar button clicked');
    };

    return (
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3 mb-3">Avatar with Button</h3>
          <p className="text-sm text-grey-stronger mb-4">
            Wrap Avatar with Button to create clickable avatars. Since Avatar contains multiple children (AvatarImage and AvatarFallback), we cannot use \`asChild\`. Instead, wrap Avatar inside Button normally.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="debug-toggle"
              checked={debug}
              onChange={(e) => setDebug(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="debug-toggle" className="text-sm text-grey-stronger">
              Enable Button debug mode (shows visual indicators and console logs)
            </label>
          </div>
        </div>
        <VStack gap={4}>
          <div>
            <h4 className="text-sm font-medium mb-2">Small Avatar Button</h4>
            <Button 
              variant="ghost" 
              className="p-0 w-4 h-4" 
              debug={debug}
              onClick={handleSmallClick}
            >
              <Avatar size="small">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Medium Avatar Button</h4>
            <Button 
              variant="ghost" 
              className="p-0 w-6 h-6" 
              debug={debug}
              onClick={handleMediumClick}
            >
              <Avatar size="medium">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Large Avatar Button</h4>
            <Button 
              variant="ghost" 
              className="p-0 w-10 h-10" 
              debug={debug}
              onClick={handleLargeClick}
            >
              <Avatar size="large">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Button>
          </div>
          <div className="p-4 bg-blue-primary rounded">
            <p className="text-xs font-medium mb-2 text-black">💡 Tips:</p>
            <ul className="text-xs space-y-1 list-disc list-inside text-black">
              <li>Use <code>className="p-0"</code> on Button to remove padding</li>
              <li>Match Button dimensions with Avatar size: w-4 h-4 for small (20px), w-6 h-6 for medium (30px), w-10 h-10 for large (50px)</li>
              <li>Avatar maintains its circular shape while inheriting Button's hover/focus states</li>
              <li>Use <code>variant="ghost"</code> for subtle interactive avatars</li>
              <li><strong>Note:</strong> Cannot use <code>asChild</code> because Avatar contains multiple children (AvatarImage + AvatarFallback)</li>
              <li><strong>Debug mode:</strong> Toggle the checkbox above to see visual debug indicators and console logs from the Button component</li>
            </ul>
          </div>
        </VStack>
      </VStack>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find all avatar buttons (excluding the checkbox)
    const buttons = canvas.getAllByRole('button');
    
    // Filter out any non-avatar buttons if needed (should be 3 avatar buttons)
    const avatarButtons = buttons.filter((button) => {
      // Check if button contains an avatar (has img or fallback text)
      return button.querySelector('img') !== null || button.textContent?.trim() !== '';
    });
    
    // Click on each avatar button to test interactions
    for (let i = 0; i < avatarButtons.length; i++) {
      await userEvent.click(avatarButtons[i]);
      // Small delay between clicks
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Verify we found the avatar buttons
    await expect(avatarButtons.length).toBeGreaterThanOrEqual(3);
  },
};

export const WithDifferentVariants: Story = {
  render: () => (
    <VStack gap={6}>
      <div>
        <h3 className="gs-typo-h3 mb-3">Avatar Buttons with Different Variants</h3>
        <p className="text-sm text-grey-stronger mb-4">
          Avatar buttons can use different Button variants for different visual styles.
        </p>
      </div>
      <HStack gap={4} align="center">
        <VStack gap={2} align="center">
          <Button variant="ghost" className="p-0 w-6 h-6">
            <Avatar size="medium">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
          <span className="text-xs text-grey-stronger">Ghost</span>
        </VStack>
        <VStack gap={2} align="center">
          <Button variant="secondary" className="p-0 w-6 h-6">
            <Avatar size="medium">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
          <span className="text-xs text-grey-stronger">Secondary</span>
        </VStack>
        <VStack gap={2} align="center">
          <Button variant="outline" className="p-0 w-6 h-6">
            <Avatar size="medium">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
          <span className="text-xs text-grey-stronger">Outline</span>
        </VStack>
      </HStack>
    </VStack>
  ),
};
