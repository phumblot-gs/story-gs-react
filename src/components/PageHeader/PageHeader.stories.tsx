
import type { Meta, StoryObj } from "@storybook/react";
import PageHeader from "./index";
import { Button } from "@/components/ui/button";
import { IconProvider } from "@/components/ui/icon-provider";
import { useState, useEffect } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { MemoryRouter } from "react-router-dom";
import { ActivityStatusProvider, useActivityStatusContext } from "@/contexts/ActivityStatusContext";
import { Workflow } from "@/components/ui/workflow";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import ButtonNotifications from "@/components/ButtonNotifications";

const meta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A header component for application pages with customizable sections for logo, title, central content, and right side actions.

## Features
- Brand logo integration with ThemeProvider support
- Customizable logo display (default, custom, or theme-based)
- Activity state animation with gradient border indicator
- Flexible content areas (left, center, right sections)
- Back button and title button support
- Workflow integration in center section
- Button integration in right section
- Context-aware styling via Layout component

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

## Activity State Animation

The PageHeader component includes a gradient border animation that can be triggered to indicate loading or background activity in the application.

**How the animation works:**

- **\`isIdle={true}\`** → Animation **ACTIVATED** (animated gradient) - Indicates a request is in progress
- **\`isIdle={false}\`** → Animation **DEACTIVATED** (static gradient) - Indicates no request is in progress

**Important note**: The name \`isIdle\` can be misleading. In this context, \`isIdle={true}\` means "activity in progress" and activates the animation.

**Implementation with ActivityStatusContext:**

To use the activity state animation throughout your application:

1. **Wrap your application with \`ActivityStatusProvider\`**:

\`\`\`tsx
// In your App.tsx
import { ActivityStatusProvider } from '@/contexts/ActivityStatusContext';

const App = () => (
  <ActivityStatusProvider>
    {/* Your app components */}
  </ActivityStatusProvider>
);
\`\`\`

2. **Use the \`useActivityStatusContext\` hook in your component**:

\`\`\`tsx
import { useActivityStatusContext } from '@/contexts/ActivityStatusContext';
import PageHeader from '@/components/PageHeader';

const YourComponent = () => {
  const { isIdle } = useActivityStatusContext();
  
  // Pass isIdle to PageHeader
  return <PageHeader title="Your Page" isIdle={isIdle} />;
};
\`\`\`

3. **Trigger the animation when starting and ending requests**:

\`\`\`tsx
import { useActivityStatusContext } from '@/contexts/ActivityStatusContext';

const YourComponent = () => {
  const { startRequest, endRequest } = useActivityStatusContext();
  
  const handleFetchData = async () => {
    startRequest(); // Start animation (isIdle becomes true)
    try {
      await fetchSomeData();
    } finally {
      endRequest(); // Stop animation (isIdle becomes false when all requests are finished)
    }
  };
  
  return <button onClick={handleFetchData}>Load data</button>;
};
\`\`\`

**Example with multiple simultaneous requests:**

\`ActivityStatusContext\` automatically handles multiple simultaneous requests:

\`\`\`tsx
const handleMultipleRequests = async () => {
  // Start 3 requests
  startRequest(); // pendingRequests = 1
  startRequest(); // pendingRequests = 2
  startRequest(); // pendingRequests = 3
  
  // Animation stays active as long as pendingRequests > 0
  
  await Promise.all([
    fetchData1().finally(() => endRequest()), // pendingRequests = 2
    fetchData2().finally(() => endRequest()), // pendingRequests = 1
    fetchData3().finally(() => endRequest()), // pendingRequests = 0 → animation stops
  ]);
};
\`\`\`

**Manual usage (without ActivityStatusContext):**

If you prefer to manage the state manually:

\`\`\`tsx
import { useState } from 'react';
import PageHeader from '@/components/PageHeader';

const YourComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFetchData = async () => {
    setIsLoading(true); // Activate animation
    try {
      await fetchSomeData();
    } finally {
      setIsLoading(false); // Deactivate animation
    }
  };
  
  return (
    <>
      <PageHeader title="Your Page" isIdle={isLoading} />
      <button onClick={handleFetchData}>Load</button>
    </>
  );
};
\`\`\`

This approach provides a visual indication when background operations are in progress.

## Buttons in rightContent

The \`rightContent\` prop allows you to add custom buttons and components to the right side of the header. You can pass any React node, including buttons, language switchers, notifications, etc.

\`\`\`tsx
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { IconProvider } from '@/components/ui/icon-provider';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import ButtonNotifications from '@/components/ButtonNotifications';

<PageHeader
  title="My Page"
  rightContent={
    <>
      <LanguageSwitcher 
        languages={languages} 
        currentLanguage={currentLanguage} 
        onLanguageChange={setCurrentLanguage} 
      />
      <Button variant="ghost" className="p-0 w-6 h-6">
        <IconProvider icon="User" />
      </Button>
      <Button variant="ghost" className="p-0 w-6 h-6">
        <IconProvider icon="Settings" />
      </Button>
      <Button variant="ghost" className="p-0 w-6 h-6">
        <IconProvider icon="Help" />
      </Button>
      <Button variant="ghost" className="p-0 w-6 h-6">
        <IconProvider icon="Logout" />
      </Button>
      <ButtonNotifications />
    </>
  }
/>
\`\`\`

**Recommended Button Variants:**

- **Left side buttons** (back button and title button): Use \`variant="secondary"\`
- **Right side buttons** (excluding ButtonNotifications and LanguageSwitcher): Use \`variant="ghost"\`
- **ButtonNotifications**: Uses \`variant="secondary"\` internally
- **LanguageSwitcher**: Uses \`variant="ghost"\` internally

**Icon-Only Buttons:**

For icon-only buttons, use the following className pattern:

\`\`\`tsx
<Button variant="ghost" className="p-0 w-6 h-6">
  <IconProvider icon="Settings" />
</Button>
\`\`\`

## Workflow in centerContent

The \`centerContent\` prop allows you to add a workflow component (or any other content) in the center section of the header. The workflow component displays a series of steps with state indicators.

\`\`\`tsx
import PageHeader from '@/components/PageHeader';
import { Workflow } from '@/components/ui/workflow';

<PageHeader
  title="My Page"
  centerContent={
    <Workflow
      bench_root_id={1001}
      steps={[
        { bench_id: 1, label: "LIVE", state: "active", onClick: (rootId, stepId) => console.log(\`LIVE clicked - rootId: \${rootId}, stepId: \${stepId}\`) },
        { bench_id: 2, label: "PHASE 1", state: "current", onClick: (rootId, stepId) => console.log(\`PHASE 1 clicked - rootId: \${rootId}, stepId: \${stepId}\`) },
        { bench_id: 3, label: "EXPORTS", state: "active", onClick: (rootId, stepId) => console.log(\`EXPORTS clicked - rootId: \${rootId}, stepId: \${stepId}\`) },
        { bench_id: 4, label: "VALIDATION", state: "inactive" },
      ]}
    />
  }
/>
\`\`\`

**Workflow Step States:**

The workflow steps can have three states:

- **\`state="active"\`**: Step is accessible and clickable (variant=secondary, disabled=false)
- **\`state="current"\`**: Step is the most advanced active step (variant=outline, disabled=false)
- **\`state="inactive"\`**: Step is not yet accessible (variant=secondary, disabled=true)

**Dynamic Workflow Example:**

\`\`\`tsx
import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Workflow } from '@/components/ui/workflow';

const YourComponent = () => {
  const [currentStepId, setCurrentStepId] = useState(2);
  const bench_root_id = 1001;
  
  const handleStepClick = (rootId: number, stepId: number) => {
    console.log(\`Step clicked: rootId=\${rootId}, stepId=\${stepId}\`);
    setCurrentStepId(stepId);
  };
  
  const workflowSteps = [
    { 
      bench_id: 1, 
      label: "STEP 1", 
      state: currentStepId === 1 ? "current" : (currentStepId > 1 ? "active" : "inactive"),
      onClick: handleStepClick
    },
    { 
      bench_id: 2, 
      label: "STEP 2", 
      state: currentStepId === 2 ? "current" : (currentStepId > 2 ? "active" : "inactive"),
      onClick: handleStepClick
    },
    { 
      bench_id: 3, 
      label: "STEP 3", 
      state: currentStepId === 3 ? "current" : (currentStepId > 3 ? "active" : "inactive"),
      onClick: handleStepClick
    },
  ];

  return (
    <PageHeader
      title="My Page"
      centerContent={
        <Workflow 
          steps={workflowSteps}
          bench_root_id={bench_root_id}
        />
      }
    />
  );
};
\`\`\`

For more details about the Workflow component, see the [Workflow documentation](/iframe.html?id=ui-workflow--default).
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
    showBackButton: {
      control: "boolean",
      description: "Whether to show the back button before the title"
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
      description: "When true, activates the loading animation on the bottom border (indicates a request is in progress). When false, the animation is deactivated.",
    }
  },
  decorators: [
    (Story) => (
      <TranslationProvider>
        <MemoryRouter>
          <ThemeProvider>
            <div className="w-full">
              <Story />
            </div>
          </ThemeProvider>
        </MemoryRouter>
      </TranslationProvider>
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
const RightSideButtons = () => {
  const languages = [
    { code: "FR", name: "Français" },
    { code: "EN", name: "English" },
    { code: "ES", name: "Español" },
  ];
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);

  return (
    <>
      <LanguageSwitcher 
        languages={languages} 
        currentLanguage={currentLanguage} 
        onLanguageChange={setCurrentLanguage} 
      />
      <Button variant="ghost" className="p-0 w-6 h-6"><IconProvider icon="User" /></Button>
      <Button variant="ghost" className="p-0 w-6 h-6"><IconProvider icon="Settings" /></Button>
      <Button variant="ghost" className="p-0 w-6 h-6"><IconProvider icon="Help" /></Button>
      <Button variant="ghost" className="p-0 w-6 h-6"><IconProvider icon="Logout" /></Button>
      <ButtonNotifications />
    </>
  );
};

export const Default: Story = {
  args: {
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
    showBackButton: false,
  }
};

export const WithLogo: Story = {
  args: {
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
    showBackButton: false,
  },
  render: (args) => (
    <PageHeader
      {...args}
      logo={<GsLogo />}
    />
  )
};

export const Complete: Story = {
  args: {
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
    showBackButton: false,
  },
  render: (args) => (
    <PageHeader
      {...args}
      logo={<GsLogo />}
      rightContent={<RightSideButtons />}
    />
  )
};

export const NoTitleButton: Story = {
  args: {
    title: "Collection Femme Printemps 2025",
    showTitleButton: false,
    showBackButton: false,
  },
  render: (args) => (
    <PageHeader
      {...args}
      logo={<GsLogo />}
      rightContent={<RightSideButtons />}
    />
  )
};

export const CustomTitleButton: Story = {
  args: {
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
    showBackButton: false,
    titleButtonIcon: "Plus",
  },
  render: (args) => (
    <PageHeader
      {...args}
      logo={<GsLogo />}
      rightContent={<RightSideButtons />}
    />
  )
};

// Add a story with workflow (same as Workflow Default story)
export const WithWorkflow: Story = {
  args: {
    title: "Collection Femme Printemps 2025",
    showTitleButton: true,
    showBackButton: false,
  },
  render: (args) => (
    <PageHeader
      {...args}
      logo={<GsLogo />}
      centerContent={
        <Workflow
          bench_root_id={1001}
          steps={[
            { bench_id: 1, label: "LIVE", state: "active", onClick: (rootId, stepId) => console.log(`LIVE clicked - rootId: ${rootId}, stepId: ${stepId}`) },
            { bench_id: 2, label: "PHASE 1", state: "current", onClick: (rootId, stepId) => console.log(`PHASE 1 clicked - rootId: ${rootId}, stepId: ${stepId}`) },
            { bench_id: 3, label: "EXPORTS", state: "active", onClick: (rootId, stepId) => console.log(`EXPORTS clicked - rootId: ${rootId}, stepId: ${stepId}`) },
            { bench_id: 4, label: "VALIDATION", state: "inactive" },
          ]}
        />
      }
      rightContent={<RightSideButtons />}
    />
  )
};

// Add a story with active loading animation
export const WithActivityAnimation: Story = {
  args: {
    title: "Loading Status Demonstration",
    showTitleButton: true,
    showBackButton: false,
  },
  render: (args) => {
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
          {...args}
          logo={<GsLogo />}
          rightContent={<RightSideButtons />}
          isIdle={isIdle}
        />
        <div className="p-4">
          <p className="mb-2 text-center">
            {isIdle 
              ? "✅ Animation ACTIVÉE (isIdle=true) - Requête en cours - bordure gradient animée" 
              : "⏸️ Animation DÉSACTIVÉE (isIdle=false) - Aucune requête - bordure gradient statique"}
          </p>
          <p className="text-sm text-gray-500 text-center">
            L'animation bascule automatiquement toutes les 3 secondes pour la démonstration.
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Cette story démontre l\'animation de la bordure gradient. Quand `isIdle=true`, l\'animation est activée (requête en cours). Quand `isIdle=false`, l\'animation est désactivée (aucune requête).'
      }
    }
  }
};

// Add a story with the default theme logo
export const WithThemeLogo: Story = {
  args: {
    title: "Using Default Logo from Theme",
    showTitleButton: true,
    showBackButton: false,
  },
  render: (args) => {
    return (
      <ThemeProvider
        initialCustomization={{
          text: {
            brandName: "Theme Logo Demo"
          }
        }}
      >
        <PageHeader 
          {...args}
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
  args: {
    title: "Using Custom Logo from Theme",
    showTitleButton: true,
    showBackButton: false,
  },
  render: (args) => {
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
          {...args}
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
