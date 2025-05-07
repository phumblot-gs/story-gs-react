
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ThemeProvider, ThemeProviderProps, useCustomTheme } from "./ThemeContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sun, Moon } from "lucide-react";

// Create a demo component to show theme usage
const ThemeDemo = () => {
  const { theme, setTheme, customization, updateCustomization, resetCustomization } = useCustomTheme();
  
  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">ThemeProvider</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Current Theme</h3>
            <p><strong>Mode:</strong> {theme}</p>
            <p><strong>Brand Name:</strong> {customization.text.brandName}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium mb-2">Overview</h3>
            <p>
              The <code>ThemeProvider</code> manages theme customization throughout your application:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Application colors (background, text, UI elements)</li>
              <li>System colors (status indicators, grades)</li>
              <li>Brand identity (name, logo)</li>
              <li>Light/dark mode preferences</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Implementation Guide</h3>
            
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="text-base font-medium mb-1">1. Set up ThemeProvider</h4>
                <div className="bg-muted rounded-md p-4 overflow-auto">
                  <pre className="text-sm">
{`// In your main application file (App.tsx)
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeProvider as NextThemeProvider } from "next-themes";

function App() {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeProvider>
        // Your application components
      </ThemeProvider>
    </NextThemeProvider>
  );
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium mb-1">2. Customize theme colors (optional)</h4>
                <div className="bg-muted rounded-md p-4 overflow-auto">
                  <pre className="text-sm">
{`// Provide initial customization
<ThemeProvider 
  initialCustomization={{
    colors: {
      // Background colors
      bgWhite: "#FFFFFF",
      bgBlack: "#222222",
      
      // Status colors
      statusValidated: "#89CC52",
      statusError: "#DD3733",
      
      // Header gradient
      headerGradientStart: "#74D2D8",
      headerGradientEnd: "#EBED8C",
    },
    text: {
      brandName: "My Application"
    }
  }}
>
  // Your application components
</ThemeProvider>`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium mb-1">3. Access theme values in components</h4>
                <div className="bg-muted rounded-md p-4 overflow-auto">
                  <pre className="text-sm">
{`import { useThemeValues } from "@/hooks/useThemeValues";

function MyComponent() {
  const { 
    cssVars,       // CSS variables as React.CSSProperties
    brandName,     // Current brand name
    isDarkMode,    // Boolean indicating dark mode
    defaultColors  // Default colors object
  } = useThemeValues();
  
  return (
    <div style={cssVars as React.CSSProperties}>
      <h1>{brandName}</h1>
      <p>Current mode: {isDarkMode ? "Dark" : "Light"}</p>
      
      // Elements will now use your theme colors
      <div className="bg-background text-foreground">
        Theme-aware content
      </div>
    </div>
  );
}`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium mb-1">4. Modify theme at runtime</h4>
                <div className="bg-muted rounded-md p-4 overflow-auto">
                  <pre className="text-sm">
{`import { useCustomTheme } from "@/contexts/ThemeContext";

function ThemeControls() {
  const { 
    theme,              // Current theme (light/dark/system)
    setTheme,           // Function to change theme
    customization,      // Current customization values
    updateCustomization, // Function to update customization
    resetCustomization  // Function to reset all customizations
  } = useCustomTheme();
  
  const setCustomColors = () => {
    updateCustomization({
      colors: {
        statusValidated: "#9b87f5",  // Custom purple
        bgWhite: "#F1F0FB",         // Custom background
      },
      text: {
        brandName: "Custom Theme Example"
      }
    });
  };
  
  return (
    <div className="space-y-4">
      <div>
        <button onClick={() => setTheme("light")}>Light Mode</button>
        <button onClick={() => setTheme("dark")}>Dark Mode</button>
      </div>
      
      <div>
        <button onClick={setCustomColors}>
          Apply Custom Colors
        </button>
        <button onClick={resetCustomization}>
          Reset Customizations
        </button>
      </div>
    </div>
  );
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Current Customizations</h3>
            <div className="bg-muted rounded-md p-4">
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(customization, null, 2)}
              </pre>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Color Samples</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="w-full h-12 rounded" style={{ backgroundColor: "var(--bg-white)" }}></div>
                <p className="text-xs text-center">bg-white</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 rounded" style={{ backgroundColor: "var(--bg-black)" }}></div>
                <p className="text-xs text-center">bg-black</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 rounded" style={{ backgroundColor: "var(--bg-grey)" }}></div>
                <p className="text-xs text-center">bg-grey</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-full h-12 rounded" style={{ backgroundColor: "var(--status-validated-color)" }}></div>
                <p className="text-xs text-center">status-validated</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 rounded" style={{ backgroundColor: "var(--status-error-color)" }}></div>
                <p className="text-xs text-center">status-error</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 rounded" style={{ backgroundColor: "var(--status-selected-color)" }}></div>
                <p className="text-xs text-center">status-selected</p>
              </div>
            </div>
          </div>
          
        </div>
      </Card>
    </div>
  );
};

// Create a wrapper component to provide context for stories
const ThemeProviderWrapper = ({
  children,
  initialTheme = "light",
  initialCustomization = {}
}: {
  children: React.ReactNode;
  initialTheme?: string;
  initialCustomization?: Partial<ThemeProviderProps["initialCustomization"]>;
}) => {
  return (
    <ThemeProvider defaultTheme={initialTheme} initialCustomization={initialCustomization}>
      {children}
    </ThemeProvider>
  );
};


const meta = {
  title: "Context/ThemeProvider",
  component: ThemeProviderWrapper,
  parameters: {
    layout: "centered",
    controls: {
      sort: 'alpha'
    },
    docs: {
      description: {
        component: "ThemeProvider manages theme state and customization across your application."
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
    initialTheme: {
      description: "Initial theme mode to use",
      control: "select",
      options: ["light", "dark", "system"],
      defaultValue: "light"
    },
    initialCustomization: {
      description: "Initial theme customization options",
      control: "object"
    }
  },
  decorators: [
    (Story) => (
      <div className="min-h-[500px]">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof ThemeProviderWrapper>;

export default meta;
type Story = StoryObj<typeof ThemeProviderWrapper>;

/**
 * Default configuration with no customizations.
 * 
 * This example shows the ThemeProvider with its default settings and no additional customization.
 */
export const Default: Story = {
  render: () => (
    <ThemeProviderWrapper>
      <ThemeDemo />
    </ThemeProviderWrapper>
  )
};

/**
 * ThemeProvider with dark mode activated by default.
 * 
 * This example demonstrates how to initialize the ThemeProvider with dark mode enabled.
 */
export const DarkMode: Story = {
  render: () => (
    <ThemeProviderWrapper initialTheme="dark">
      <ThemeDemo />
    </ThemeProviderWrapper>
  )
};

/**
 * ThemeProvider with custom color palette.
 * 
 * This example shows how to customize the theme colors with a purple-focused color scheme.
 */
export const CustomColors: Story = {
  render: () => (
    <ThemeProviderWrapper 
      initialCustomization={{
        colors: {
          statusValidated: "#9b87f5", // Custom purple for validated status
          statusSelected: "#7E69AB",  // Secondary purple for selected status
          statusError: "#D946EF",     // Magenta pink for error status
          bgWhite: "#F1F0FB",         // Soft gray background
          bgBlack: "#1A1F2C",         // Dark purple-gray background
          textBlue: "#0EA5E9"         // Ocean blue for text accents
        },
        text: {
          brandName: "Purple Theme Demo"
        }
      }}
    >
      <ThemeDemo />
    </ThemeProviderWrapper>
  )
};

/**
 * Example showing a custom brand configuration.
 * 
 * This example demonstrates how to customize the application with brand-specific colors and name.
 */
export const BrandCustomization: Story = {
  render: () => (
    <ThemeProviderWrapper
      initialCustomization={{
        text: {
          brandName: "Acme Corporation"
        },
        colors: {
          statusValidated: "#89CC52", // Bright green for validated status
          statusError: "#DD3733",     // Red for error status
          statusSelected: "#74D4DA",  // Teal for selected status
          bgWhite: "#FFFFFF",         // Pure white background
          bgBlack: "#222222",         // Dark gray-black background
          headerGradientStart: "#3B82F6", // Blue gradient start
          headerGradientEnd: "#2DD4BF"   // Teal gradient end
        }
      }}
    >
      <ThemeDemo />
    </ThemeProviderWrapper>
  )
};
