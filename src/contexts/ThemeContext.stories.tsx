
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
        <h2 className="text-xl font-semibold mb-4">Theme Provider</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Current Theme</h3>
            <p><strong>Mode:</strong> {theme}</p>
            <p><strong>Brand Name:</strong> {customization.text.brandName}</p>
          </div>

          <div>
            <p>The ThemeProvider overrides theme-related information:
              <ul>
                <li>Application colours</li>
                <li>System colours (statuses, grades)</li>
                <li>Brand name and logo</li>
              </ul>
            </p>
          </div>

          <div>
            <p>
              The ThemeProvider is a context component that manages the state
              of the theme and customisations in your application. It supports
              switching between light/dark modes and  customising colours,
              resources and text.
            </p>
            <p>Note: only light mode is currently implemented</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Integration</h3>
            <p>If you integrate this component library into your application, you must:</p>
            <p>1. Wrap your application with the necessary providers</p>
            <div class="bg-muted rounded-md p-4">
              <pre class="whitespace-pre-wrap text-sm">
                {`
// In your main file (e.g. App.tsx)
import { ThemeProvider } from ‘./contexts/ThemeContext’;
import { ThemeProvider as NextThemeProvider } from ‘next-themes’;
 
function App() {
 return (
 <NextThemeProvider attribute=‘class’ defaultTheme=‘system’ enableSystem>
 <ThemeProvider>
  // The rest of your application
 </ThemeProvider>
 </NextThemeProvider>
 );
}
                `}
              </pre>
            </div>
            <p>2. Customise the default colours (optional)</p>
            <div class="bg-muted rounded-md p-4">
              <pre class="whitespace-pre-wrap text-sm">
                {`
<ThemeProvider initialCustomization={{
    colours: {
    bgWhite: ‘#FFFFFF’,
    statusValidated: ‘#89CC52’,
    // Other custom colours...
  },
  text: {
    brandName: ‘My Application’
  }
}}>
 // The rest of your application
</ThemeProvider>
                `}
              </pre>
            </div>
            <p>3. Integrate the ThemeCustomizer component into your application</p>
            <div class="bg-muted rounded-md p-4">
              <pre class="whitespace-pre-wrap text-sm">
                {`
import { ThemeCustomizer } from “@/components/ThemeCustomizer”;

function Header() {
  return (
    <header className=‘bg-background p-4 flex justify-between’>
      <h1>My Application</h1>
      <ThemeCustomizer />
    </header>
  );
}
                `}
              </pre>
            </div>
            <p>4. Use the useThemeValues hook to apply styles</p>
            <div class="bg-muted rounded-md p-4">
              <pre class="whitespace-pre-wrap text-sm">
                {`
import { useThemeValues } from ‘@/hooks/useThemeValues’;

function MyComponent() {
  const { cssVars, brandName, isDarkMode } = useThemeValues();
   
  return (
    <div style={cssVars as React.CSSProperties}>
    // Your content here will benefit from custom CSS variables
    <h1>{brandName}</h1>
    <p>Current mode: {isDarkMode ? ‘Dark’ : ‘Light’}</p>
    </div>
  );
}
                `}
              </pre>
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

/**
 * Le ThemeProvider est un composant de contexte qui gère l'état du thème et des personnalisations
 * dans votre application. Il prend en charge le basculement entre les modes clair/sombre et 
 * la personnalisation des couleurs, des ressources et du texte.
 * 
 * ## Intégration
 * 
 * Si vous intégrez cette librairie de composants à votre application, vous devez :
 * 
 * ### 1. Envelopper votre application avec les providers nécessaires
 * 
 * ```jsx
 * // Dans votre fichier principal (ex: App.tsx)
 * import { ThemeProvider } from "./contexts/ThemeContext";
 * import { ThemeProvider as NextThemeProvider } from "next-themes";
 * 
 * function App() {
 *   return (
 *     <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
 *       <ThemeProvider>
 *         // Le reste de votre application
 *       </ThemeProvider>
 *     </NextThemeProvider>
 *   );
 * }
 * ```
 * 
 * ### 2. Personnaliser les couleurs par défaut (optionnel)
 * 
 * ```jsx
 * <ThemeProvider
 *   initialCustomization={{
 *     colors: {
 *       bgWhite: "#FFFFFF",
 *       statusValidated: "#89CC52",
 *       // Autres couleurs personnalisées...
 *     },
 *     text: {
 *       brandName: "Mon Application"
 *     }
 *   }}
 * >
 *   // Le reste de votre application
 * </ThemeProvider>
 * ```
 * 
 * ### 3. Intégrer le composant ThemeCustomizer dans votre application
 * 
 * ```jsx
 * import { ThemeCustomizer } from '@/components/ThemeCustomizer';
 * 
 * function Header() {
 *   return (
 *     <header className="bg-background p-4 flex justify-between">
 *       <h1>Mon Application</h1>
 *       <ThemeCustomizer />
 *     </header>
 *   );
 * }
 * ```
 * 
 * ### 4. Utiliser le hook useThemeValues pour appliquer les styles
 * 
 * ```jsx
 * import { useThemeValues } from '@/hooks/useThemeValues';
 * 
 * function MyComponent() {
 *   const { cssVars, brandName, isDarkMode } = useThemeValues();
 * 
 *   return (
 *     <div style={cssVars as React.CSSProperties}>
 *       // Votre contenu ici bénéficiera des variables CSS personnalisées
 *       <h1>{brandName}</h1>
 *       <p>Mode actuel: {isDarkMode ? 'Sombre' : 'Clair'}</p>
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
        component: "ThemeProvider gère l'état du thème et les personnalisations dans votre application."
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
    initialTheme: {
      description: "Le mode de thème initial à utiliser",
      control: "select",
      options: ["light", "dark", "system"],
      defaultValue: "light"
    },
    initialCustomization: {
      description: "Options de personnalisation initiales du thème",
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
 * Configuration par défaut du ThemeProvider sans personnalisations.
 */
export const Default: Story = {
  render: () => (
    <ThemeProviderWrapper>
      <ThemeDemo />
    </ThemeProviderWrapper>
  )
};

/**
 * ThemeProvider avec le mode sombre activé par défaut.
 */
export const DarkMode: Story = {
  render: () => (
    <ThemeProviderWrapper initialTheme="dark">
      <ThemeDemo />
    </ThemeProviderWrapper>
  )
};

/**
 * ThemeProvider avec des couleurs personnalisées pour le thème.
 */
export const CustomColors: Story = {
  render: () => (
    <ThemeProviderWrapper 
      initialCustomization={{
        colors: {
          statusValidated: "#9b87f5", // Violet personnalisé pour le statut validé
          statusSelected: "#7E69AB", // Violet secondaire personnalisé pour le statut sélectionné
          statusError: "#D946EF", // Rose magenta pour le statut d'erreur
          bgWhite: "#F1F0FB", // Gris doux pour l'arrière-plan
          bgBlack: "#1A1F2C", // Violet foncé pour l'arrière-plan noir
          textBlue: "#0EA5E9" // Bleu océan pour le texte
        },
        text: {
          brandName: "Démo Thème Violet"
        }
      }}
    >
      <ThemeDemo />
    </ThemeProviderWrapper>
  )
};

/**
 * Exemple montrant une configuration de marque personnalisée.
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
