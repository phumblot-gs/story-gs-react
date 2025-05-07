
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
        <h2 className="text-xl font-semibold mb-4">Theme Provider Demo</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Current Theme</h3>
            <p><strong>Mode:</strong> {theme}</p>
            <p><strong>Brand Name:</strong> {customization.text.brandName}</p>
            
            <div className="mt-4 flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-2"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                Toggle Theme
              </Button>
              
              <Button variant="outline" onClick={resetCustomization}>
                Reset Customization
              </Button>
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
              {/* Background colors */}
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
              
              {/* Status colors */}
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
          
          <div>
            <h3 className="text-lg font-medium mb-2">Example UI Elements</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Default Button</Button>
              <Button variant="destructive">Destructive Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
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

/**
 * The ThemeProvider component is a context provider that manages theme state and customization
 * throughout your application. It provides support for light/dark mode switching and
 * customizing colors, assets, and text.
 * 
 * ## Key Features
 * 
 * - Light/dark mode support with system preference detection
 * - Theme customization including colors, assets and text properties
 * - Persistent theme settings using localStorage
 * - Automatic CSS variable application
 * 
 * ## Usage
 * 
 * Wrap your application with the ThemeProvider at the root level:
 * 
 * ```tsx
 * import { ThemeProvider } from "./contexts/ThemeContext";
 * 
 * const App = () => {
 *   return (
 *     <ThemeProvider>
 *       <YourApplication />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 * 
 * ## Customization
 * 
 * You can provide initial customization options:
 * 
 * ```tsx
 * <ThemeProvider
 *   defaultTheme="dark"
 *   initialCustomization={{
 *     colors: {
 *       statusValidated: "#00FF00",
 *       bgWhite: "#F8F8F8"
 *     },
 *     text: {
 *       brandName: "My Brand"
 *     }
 *   }}
 * >
 *   <YourApplication />
 * </ThemeProvider>
 * ```
 * 
 * ## Accessing Theme Values
 * 
 * You can access theme values in your components using the `useCustomTheme` hook:
 * 
 * ```tsx
 * import { useCustomTheme } from "./contexts/ThemeContext";
 * 
 * const MyComponent = () => {
 *   const { theme, setTheme, customization } = useCustomTheme();
 *   
 *   return (
 *     <div>
 *       <p>Current theme: {theme}</p>
 *       <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
 *         Toggle Theme
 *       </button>
 *       <p>Brand name: {customization.text.brandName}</p>
 *     </div>
 *   );
 * }
 * ```
 */
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
      description: "The initial theme mode to use",
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
 * Default configuration of the ThemeProvider with no customizations.
 */
export const Default: Story = {
  render: () => (
    <ThemeProviderWrapper>
      <ThemeDemo />
    </ThemeProviderWrapper>
  )
};

/**
 * ThemeProvider with dark mode enabled by default.
 */
export const DarkMode: Story = {
  render: () => (
    <ThemeProviderWrapper initialTheme="dark">
      <ThemeDemo />
    </ThemeProviderWrapper>
  )
};

/**
 * ThemeProvider with custom branded colors for the theme.
 */
export const CustomColors: Story = {
  render: () => (
    <ThemeProviderWrapper 
      initialCustomization={{
        colors: {
          statusValidated: "#9b87f5", // Custom purple for validated status
          statusSelected: "#7E69AB", // Custom secondary purple for selected status
          statusError: "#D946EF", // Magenta pink for error status
          bgWhite: "#F1F0FB", // Soft gray for background
          bgBlack: "#1A1F2C", // Dark purple for black background
          textBlue: "#0EA5E9" // Ocean blue for text
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
 */
export const BrandCustomization: Story = {
  render: () => (
    <ThemeProviderWrapper
      initialCustomization={{
        text: {
          brandName: "Acme Corporation"
        },
        colors: {
          statusValidated: "#89CC52",
          statusError: "#DD3733",
          statusSelected: "#74D4DA",
          bgWhite: "#FFFFFF",
          bgBlack: "#222222"
        }
      }}
    >
      <ThemeDemo />
    </ThemeProviderWrapper>
  )
};
