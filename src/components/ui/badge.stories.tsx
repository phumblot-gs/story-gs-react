import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Badge } from "./badge";
import { Layout, VStack, HStack } from "@/components/layout";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Badge component for displaying labels, status indicators, or tags.
        
## Features
- Multiple visual variants (default, secondary, destructive, outline)
- Debug mode for development
- Event handlers (onClick, onFocus, onBlur)
- Customizable styling with className
- Accessible with title attribute support`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
      description: "Badge variant (default, secondary, destructive, outline)",
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes",
    },
    debug: {
      control: "boolean",
      description: "Debug mode: displays a label and logs props to the console",
    },
    onClick: {
      action: "clicked",
      description: "Function called on click",
    },
    onFocus: {
      action: "focused",
      description: "Function called when the badge receives focus",
    },
    onBlur: {
      action: "blurred",
      description: "Function called when the badge loses focus",
    },
    children: {
      control: "text",
      description: "Badge content (text, icons, etc.)",
    },
    title: {
      control: "text",
      description: "Tooltip text displayed on hover",
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
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const AllVariants: Story = {
  render: () => (
    <VStack gap={4}>
      <div>
        <h3 className="text-sm font-medium mb-3">All Variants</h3>
      </div>
      <HStack gap={3} align="center">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </HStack>
    </VStack>
  ),
};

export const WithEvents: Story = {
  render: () => (
    <VStack gap={6}>
      <div>
        <h3 className="text-sm font-medium mb-3">Badge with Event Handlers</h3>
        <p className="text-xs text-grey-stronger mb-4">
          Click, focus, or blur the badges to see events logged in the Actions panel.
        </p>
      </div>
      <HStack gap={3} align="center">
        <Badge 
          variant="default"
          onClick={() => console.log('Default badge clicked')}
          onFocus={() => console.log('Default badge focused')}
          onBlur={() => console.log('Default badge blurred')}
        >
          Clickable Badge
        </Badge>
        <Badge 
          variant="secondary"
          onClick={() => console.log('Secondary badge clicked')}
          onFocus={() => console.log('Secondary badge focused')}
          onBlur={() => console.log('Secondary badge blurred')}
        >
          Secondary Badge
        </Badge>
      </HStack>
    </VStack>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <VStack gap={4}>
      <div>
        <h3 className="text-sm font-medium mb-3">Badge with Title (Tooltip)</h3>
        <p className="text-xs text-grey-stronger mb-4">
          Hover over the badges to see the tooltip.
        </p>
      </div>
      <HStack gap={3} align="center">
        <Badge variant="default" title="This is a default badge">
          Hover me
        </Badge>
        <Badge variant="secondary" title="This is a secondary badge">
          Hover me
        </Badge>
        <Badge variant="destructive" title="This is a destructive badge">
          Hover me
        </Badge>
      </HStack>
    </VStack>
  ),
};

export const DebugMode: Story = {
  render: () => {
    const [debug, setDebug] = React.useState(false);
    
    return (
      <VStack gap={6}>
        <div>
          <h3 className="text-sm font-medium mb-3">Debug Mode</h3>
          <p className="text-xs text-grey-stronger mb-4">
            The <code>debug</code> prop displays a label above the badge and logs props to the console.
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
              Enable debug mode
            </label>
          </div>
        </div>
        <VStack gap={4}>
          <HStack gap={3} align="center">
            <Badge 
              variant="default" 
              debug={debug}
              onClick={() => console.log('Default badge clicked')}
              onFocus={() => console.log('Default badge focused')}
              onBlur={() => console.log('Default badge blurred')}
            >
              Default Badge
            </Badge>
            <Badge 
              variant="secondary" 
              debug={debug}
              onClick={() => console.log('Secondary badge clicked')}
            >
              Secondary Badge
            </Badge>
            <Badge 
              variant="destructive" 
              debug={debug}
              onClick={() => console.log('Destructive badge clicked')}
            >
              Destructive Badge
            </Badge>
            <Badge 
              variant="outline" 
              debug={debug}
              onClick={() => console.log('Outline badge clicked')}
            >
              Outline Badge
            </Badge>
          </HStack>
          <div className="p-4 bg-blue-primary rounded">
            <p className="text-xs font-medium mb-2 text-black">💡 Debug mode features:</p>
            <ul className="text-xs space-y-1 list-disc list-inside text-black">
              <li>Pink border (ring-2 ring-pink) around the badge</li>
              <li>Label above displaying variant</li>
              <li>Log to console with all props</li>
              <li>onClick, onFocus and onBlur work normally</li>
            </ul>
          </div>
        </VStack>
      </VStack>
    );
  },
};

export const CustomClassName: Story = {
  render: () => (
    <VStack gap={4}>
      <div>
        <h3 className="text-sm font-medium mb-3">Badge with Custom Classes</h3>
        <p className="text-xs text-grey-stronger mb-4">
          Use className prop to add custom styling.
        </p>
      </div>
      <HStack gap={3} align="center">
        <Badge variant="default" className="px-4 py-1">
          Extra Padding
        </Badge>
        <Badge variant="secondary" className="text-sm">
          Small Text
        </Badge>
        <Badge variant="outline" className="border-2 border-blue-primary">
          Thick Border
        </Badge>
      </HStack>
    </VStack>
  ),
};

export const WithBackgrounds: Story = {
  render: () => (
    <VStack gap={6}>
      <div>
        <h3 className="text-sm font-medium mb-3">Badge with Different Backgrounds</h3>
        <p className="text-xs text-grey-stronger mb-4">
          Badges adapt their colors based on the parent Layout background using the same mechanism as Buttons.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-medium mb-2">White Background</h4>
          <Layout bg="white" padding={3} className="rounded">
            <HStack gap={3} align="center">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </HStack>
          </Layout>
        </div>

        <div>
          <h4 className="text-xs font-medium mb-2">Grey Background</h4>
          <Layout bg="grey" padding={3} className="rounded">
            <HStack gap={3} align="center">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </HStack>
          </Layout>
        </div>

        <div>
          <h4 className="text-xs font-medium mb-2">Black Background</h4>
          <Layout bg="black" padding={3} className="rounded">
            <HStack gap={3} align="center">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </HStack>
          </Layout>
        </div>
      </div>
    </VStack>
  ),
};

export const WithCustomBackground: Story = {
  render: () => (
    <VStack gap={6}>
      <div>
        <h3 className="text-sm font-medium mb-3">Badge with Custom Background Colors</h3>
        <p className="text-xs text-grey-stronger mb-4">
          Use <code>!bg-yellow</code> (with <code>!important</code>) to override the default badge background colors.
          Note: The <code>!</code> prefix is required due to CSS specificity of badge styles.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-medium mb-2">Yellow Backgrounds</h4>
          <HStack gap={3} align="center">
            <Badge className="!bg-yellow text-black">!bg-yellow</Badge>
            <Badge className="!bg-pastel-yellow text-black">!bg-pastel-yellow</Badge>
            <Badge className="!bg-pastel-yellow-secondary text-black">!bg-pastel-yellow-secondary</Badge>
            <Badge className="!bg-yellow/80 text-black">!bg-yellow/80 (80% opacity)</Badge>
          </HStack>
        </div>

        <div>
          <h4 className="text-xs font-medium mb-2">Other Custom Backgrounds</h4>
          <HStack gap={3} align="center">
            <Badge className="!bg-blue-primary text-white">!bg-blue-primary</Badge>
            <Badge className="!bg-green-primary text-white">!bg-green-primary</Badge>
            <Badge className="!bg-orange text-white">!bg-orange</Badge>
            <Badge className="!bg-pink text-white">!bg-pink</Badge>
          </HStack>
        </div>

        <div>
          <h4 className="text-xs font-medium mb-2">With Variants + Custom Background</h4>
          <HStack gap={3} align="center">
            <Badge variant="default" className="!bg-yellow text-black">Default + Yellow</Badge>
            <Badge variant="outline" className="!bg-yellow border-yellow text-black">Outline + Yellow</Badge>
            <Badge variant="secondary" className="!bg-pastel-yellow text-black">Secondary + Pastel</Badge>
          </HStack>
        </div>
      </div>

      <div className="p-4 bg-blue-primary rounded">
        <p className="text-xs font-medium mb-2 text-black">💡 Tips:</p>
        <ul className="text-xs space-y-1 list-disc list-inside text-black">
          <li>Use <code>!</code> prefix before Tailwind classes to apply <code>!important</code></li>
          <li>Available yellow colors: <code>yellow</code>, <code>pastel-yellow</code>, <code>pastel-yellow-secondary</code></li>
          <li>Add opacity with <code>/80</code> suffix: <code>!bg-yellow/80</code></li>
          <li>Adjust text color if needed: <code>text-black</code> or <code>text-white</code></li>
          <li>Combine with outline variant: <code>variant="outline" className="!bg-yellow border-yellow"</code></li>
        </ul>
      </div>
    </VStack>
  ),
};
