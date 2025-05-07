
import type { Meta, StoryObj } from "@storybook/react";
import PageHeader from "./index";
import { ButtonCircle } from "@/components/ui/button-circle";
import { useState, useEffect } from "react";

const meta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
# PageHeader Component

A header component for application pages with customizable sections for logo, title, central content, and right side actions.

## Activity State Animation

The PageHeader component includes a gradient border animation that can be triggered to indicate loading or background activity in the application.

### Implementation with ActivityStatusContext

To use the activity state animation throughout your application:

1. Wrap your application with the \`ActivityStatusProvider\`:

\`\`\`tsx
// In your App.tsx
import { ActivityStatusProvider } from '@/contexts/ActivityStatusContext';

const App = () => (
  <ActivityStatusProvider>
    {/* Your app components */}
  </ActivityStatusProvider>
);
\`\`\`

2. Use the \`useActivityStatusContext\` hook in your components:

\`\`\`tsx
import { useActivityStatusContext } from '@/contexts/ActivityStatusContext';

const YourComponent = () => {
  const { isIdle, startRequest, endRequest } = useActivityStatusContext();
  
  // Pass the isIdle state to PageHeader
  return <PageHeader title="Your Page" isIdle={isIdle} />;
};
\`\`\`

3. Trigger the animation when starting and ending requests:

\`\`\`tsx
const handleFetchData = async () => {
  startRequest(); // Start animation
  try {
    await fetchSomeData();
  } finally {
    endRequest(); // End animation
  }
};
\`\`\`

This provides a visual indication when background operations are in progress.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Title text displayed in the header"
    },
    showTitleButton: {
      control: "boolean",
      description: "Whether to show the edit button next to the title"
    },
    titleButtonIcon: {
      control: "select",
      options: ["Pencil", "Edit", "Settings", "Plus"],
      description: "Icon to use for the title button"
    },
    logo: {
      control: "object",
      description: "Custom logo component to display"
    },
    centerContent: {
      control: "object",
      description: "Content to display in the center section"
    },
    rightContent: {
      control: "object",
      description: "Content to display in the right section"
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply"
    },
    isIdle: {
      control: "boolean",
      description: "When true, activates the loading animation on the bottom border"
    }
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

// Custom logo component for the stories
const GsLogo = () => (
  <div className="flex items-center justify-center font-bold text-black text-lg">
    <span>GS</span>
  </div>
);

// Example workflow tabs for center content
const WorkflowTabs = () => (
  <div className="flex items-center gap-4">
    <div className="px-3 py-1">LIVE</div>
    <div className="px-3 py-1">PHASE 1</div>
    <div className="px-3 py-1">EXPORTS</div>
    <div className="px-3 py-1 bg-black text-white rounded-full">VALIDATION</div>
  </div>
);

// Right side content with buttons
const RightSideButtons = () => (
  <>
    <span className="text-sm font-medium">FR</span>
    <ButtonCircle icon="User" />
    <ButtonCircle icon="Settings" />
    <ButtonCircle icon="Help" />
    <ButtonCircle icon="Bell" indicator={true} />
    <ButtonCircle icon="Logout" />
  </>
);

export const Default: Story = {
  args: {
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
  },
};

export const WithLogo: Story = {
  args: {
    logo: <GsLogo />,
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
  },
};

export const Complete: Story = {
  args: {
    logo: <GsLogo />,
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
    centerContent: <WorkflowTabs />,
    rightContent: <RightSideButtons />,
  },
};

export const NoTitleButton: Story = {
  args: {
    logo: <GsLogo />,
    title: "Collection Femme Printemps 2025",
    showTitleButton: false,
    centerContent: <WorkflowTabs />,
    rightContent: <RightSideButtons />,
  },
};

export const CustomTitleButton: Story = {
  args: {
    logo: <GsLogo />,
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
    titleButtonIcon: "Plus",
    centerContent: <WorkflowTabs />,
    rightContent: <RightSideButtons />,
  },
};

// Add a story with active loading animation
export const WithActivityAnimation: Story = {
  render: () => {
    // Use useState to simulate activity status
    const [isIdle, setIsIdle] = useState(false);
    
    // Toggle animation every 3 seconds for demonstration
    useEffect(() => {
      const interval = setInterval(() => {
        setIsIdle(prev => !prev);
      }, 3000);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div>
        <PageHeader 
          logo={<GsLogo />}
          title="Loading Status Demonstration"
          showTitleButton={true}
          centerContent={<WorkflowTabs />}
          rightContent={<RightSideButtons />}
          isIdle={isIdle}
        />
        <div className="p-4">
          <p className="mb-2 text-center">
            {isIdle 
              ? "Activity in progress - notice the animated gradient border at the bottom" 
              : "Idle state - border gradient is static"}
          </p>
        </div>
      </div>
    );
  },
};
