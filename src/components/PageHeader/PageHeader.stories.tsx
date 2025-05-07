
import type { Meta, StoryObj } from "@storybook/react";
import PageHeader from "./index";
import { ButtonCircle } from "@/components/ui/button-circle";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";

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

## Brand Logo Integration

The PageHeader component can display a logo in one of these ways:

1. **Default Logo**: If no logo is specified, it will use the logo from ThemeProvider if available
2. **Custom Logo**: Pass a custom React node to the \`logo\` prop
3. **ThemeProvider Logo**: Customize the logo in the theme settings to apply across all headers

\`\`\`tsx
// With default theme logo (defined in ThemeProvider)
<PageHeader title="My Application" />

// With custom inline logo
<PageHeader 
  title="My Application"
  logo={<YourCustomLogoComponent />}
/>
\`\`\`
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
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="w-full">
          <Story />
        </div>
      </ThemeProvider>
    )
  ]
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

// Add a story with the default theme logo
export const WithThemeLogo: Story = {
  render: () => {
    return (
      <ThemeProvider
        initialCustomization={{
          text: {
            brandName: "Theme Logo Demo"
          }
        }}
      >
        <PageHeader 
          title="Using Default Logo from Theme"
          showTitleButton={true}
          centerContent={<WorkflowTabs />}
          rightContent={<RightSideButtons />}
        />
        <div className="p-4">
          <p className="mb-2 text-center">
            This header uses the default SVG logo from ThemeProvider
          </p>
        </div>
      </ThemeProvider>
    );
  },
};

// Add a story with a custom theme logo
export const WithCustomThemeLogo: Story = {
  render: () => {
    return (
      <ThemeProvider
        initialCustomization={{
          text: {
            brandName: "Custom Logo Demo"
          },
          assets: {
            logo: `<svg width="25" height="14" viewBox="0 0 25 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.32271 0.519775C4.47411 0.519775 0.784544 3.41519 0.106003 6.96598C-0.233268 8.7267 0.212025 10.37 1.33586 11.6123C2.43849 12.8253 4.07123 13.4904 5.93722 13.4904C7.50634 13.4904 9.07547 13.0209 10.475 12.1405C10.581 12.0819 10.6446 11.9743 10.6658 11.8667L11.4186 7.93437L10.4219 8.7267L9.87063 11.6123C8.66198 12.3362 7.3155 12.7177 5.99023 12.7177C4.36809 12.7177 2.94739 12.1405 1.9932 11.0939C1.01779 10.0179 0.636113 8.57997 0.932975 7.04423C1.5479 3.87493 4.83459 1.29254 8.2697 1.29254C9.62678 1.29254 10.8354 1.69359 11.7578 2.43701L12.1077 2.72068L12.2773 1.80119L12.1607 1.71315C11.1217 0.940392 9.78582 0.519775 8.32271 0.519775Z" fill="#D946EF"/>
              <path d="M15.4369 4.39315C14.9598 6.85816 17.4513 7.65049 19.2643 8.22761C20.7168 8.68736 21.7346 9.05907 21.6285 9.60685C21.5119 10.2231 20.4835 10.898 19.19 10.898C18.204 10.898 17.3134 10.585 16.6667 10.0079L14.3342 11.8567L14.4933 12.0132C15.5641 12.9718 17.059 13.5 18.6917 13.5C21.4483 13.5 24.0246 11.7588 24.4381 9.60685C24.9152 7.13205 22.4237 6.33973 20.6107 5.7626C19.1688 5.30286 18.151 4.93115 18.257 4.39315C18.3737 3.7769 19.4021 3.10196 20.6956 3.10196H24.5123L25.0106 0.509781H21.1939C18.4373 0.509781 15.8609 2.25094 15.4475 4.40293L15.4369 4.39315Z" fill="#9b87f5"/>
            </svg>`
          }
        }}
      >
        <PageHeader 
          title="Using Custom Logo from Theme"
          showTitleButton={true}
          centerContent={<WorkflowTabs />}
          rightContent={<RightSideButtons />}
        />
        <div className="p-4">
          <p className="mb-2 text-center">
            This header uses a custom colored logo from ThemeProvider
          </p>
        </div>
      </ThemeProvider>
    );
  },
};
