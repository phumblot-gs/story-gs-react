import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import { StyleProvider, useStyles, useGlobalStyles, type StyleConfig } from './StyleProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const StyleProviderDocumentation = () => {
  return (
    <div className="container mx-auto p-8 max-w-6xl space-y-12">
      <section>
        <h1 className="text-4xl font-bold mb-6">StyleProvider</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Le StyleProvider permet d'appliquer les styles et fonts GS Components à votre application.
          Il gère le chargement des fonts Avenir Next, l'application de styles globaux et la personnalisation
          des variables CSS.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Configuration de base</h2>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Import et utilisation</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`import { StyleProvider } from '@gs/gs-components-library';

function App() {
  return (
    <StyleProvider
      config={{
        applyGlobalStyles: true,
        loadFonts: true,
        customFontFamily: '"AvenirNextLTPro", sans-serif'
      }}
    >
      {/* Votre application */}
    </StyleProvider>
  );
}`}</code>
          </pre>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Options de configuration</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">applyGlobalStyles</code>
                <p className="text-sm text-muted-foreground">
                  Applique les styles GS globalement à toute l'application
                </p>
              </div>
              <div className="space-y-2">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">loadFonts</code>
                <p className="text-sm text-muted-foreground">
                  Charge automatiquement les fonts Avenir Next
                </p>
              </div>
              <div className="space-y-2">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">customFontFamily</code>
                <p className="text-sm text-muted-foreground">
                  Police personnalisée avec fallbacks
                </p>
              </div>
              <div className="space-y-2">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">cssVariables</code>
                <p className="text-sm text-muted-foreground">
                  Variables CSS personnalisées à appliquer
                </p>
              </div>
              <div className="space-y-2">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">rootClassName</code>
                <p className="text-sm text-muted-foreground">
                  Classe CSS à appliquer à l'élément racine
                </p>
              </div>
              <div className="space-y-2">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">classPrefix</code>
                <p className="text-sm text-muted-foreground">
                  Préfixe pour toutes les classes CSS générées
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Configuration avancée</h2>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Configuration complète</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`const styleConfig: StyleConfig = {
  // Styles globaux
  applyGlobalStyles: true,

  // Fonts
  loadFonts: true,
  customFontFamily: '"AvenirNextLTPro", -apple-system, BlinkMacSystemFont, sans-serif',

  // Variables CSS personnalisées
  cssVariables: {
    '--primary': '221 83 53',
    '--secondary': '210 40 96',
    '--radius': '0.375rem',
    '--spacing-custom': '24px',
    '--font-size-hero': '3.5rem'
  },

  // Classes et préfixes
  rootClassName: 'gs-app',
  classPrefix: 'gs',

  // Styles additionnels
  additionalStyles: \`
    .gs-app {
      min-height: 100vh;
      background: linear-gradient(to bottom, #f0f0f0, #ffffff);
    }

    .gs-app h1 {
      letter-spacing: -0.02em;
    }
  \`
};

<StyleProvider config={styleConfig}>
  <App />
</StyleProvider>`}</code>
          </pre>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Variables CSS personnalisées</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`// Définir des variables CSS personnalisées
<StyleProvider
  config={{
    cssVariables: {
      // Couleurs (format RGB pour compatibilité Tailwind)
      '--primary': '200 80 60',
      '--secondary': '150 60 80',
      '--accent': '100 200 250',

      // Espacements
      '--spacing-xs': '4px',
      '--spacing-sm': '8px',
      '--spacing-md': '16px',

      // Tailles de police
      '--font-size-xs': '0.75rem',
      '--font-size-sm': '0.875rem',
      '--font-size-base': '1rem',

      // Autres
      '--border-radius': '8px',
      '--transition-speed': '200ms'
    }
  }}
>
  {/* Les variables sont disponibles partout */}
  <div style={{ padding: 'var(--spacing-md)' }}>
    Content
  </div>
</StyleProvider>`}</code>
          </pre>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Hooks disponibles</h2>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">useStyles</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Hook pour accéder à la configuration des styles dans les composants enfants.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`import { useStyles } from '@gs/gs-components-library';

function MyComponent() {
  const { config, updateConfig } = useStyles();

  return (
    <div>
      <p>Fonts chargées: {config.loadFonts ? 'Oui' : 'Non'}</p>
      <p>Police: {config.customFontFamily}</p>

      <button onClick={() => updateConfig({
        cssVariables: {
          '--primary': '255 0 0'
        }
      })}>
        Changer la couleur primaire
      </button>
    </div>
  );
}`}</code>
          </pre>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">useGlobalStyles</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Hook pour appliquer les styles globaux sans utiliser de wrapper Provider.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`import { useGlobalStyles } from '@gs/gs-components-library';

function App() {
  // Applique les styles directement sans wrapper
  useGlobalStyles({
    applyGlobalStyles: true,
    loadFonts: true,
    customFontFamily: '"AvenirNextLTPro", sans-serif',
    cssVariables: {
      '--primary': '200 80 60'
    }
  });

  return <YourApp />;
}`}</code>
          </pre>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Intégration avec Tailwind</h2>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Configuration Tailwind</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`// tailwind.config.js
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@gs/gs-components-library/dist/**/*.{js,mjs}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--gs-font-sans)', 'system-ui', 'sans-serif'],
        avenir: ['"AvenirNextLTPro"', 'sans-serif']
      },
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)'
      },
      spacing: {
        'gs-xs': 'var(--spacing-xs)',
        'gs-sm': 'var(--spacing-sm)',
        'gs-md': 'var(--spacing-md)'
      }
    }
  }
}`}</code>
          </pre>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Utilisation avec Tailwind</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`// Les variables CSS sont disponibles dans Tailwind
<div className="text-primary bg-secondary/10 p-gs-md rounded-[var(--border-radius)]">
  <h1 className="font-avenir text-[var(--font-size-hero)]">
    Titre avec Avenir Next
  </h1>
  <p className="text-[rgb(var(--text-green))]">
    Texte en vert GS
  </p>
</div>`}</code>
          </pre>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Exemples d'utilisation</h2>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Next.js App Router</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`// app/layout.tsx
import { StyleProvider } from '@gs/gs-components-library';
import '@gs/gs-components-library/dist/styles/fonts.css';
import '@gs/gs-components-library/dist/style.css';

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <StyleProvider
          config={{
            applyGlobalStyles: true,
            loadFonts: true
          }}
        >
          {children}
        </StyleProvider>
      </body>
    </html>
  );
}`}</code>
          </pre>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Vite React</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`// main.tsx
import { StyleProvider } from '@gs/gs-components-library';
import '@gs/gs-components-library/dist/style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyleProvider
      config={{
        applyGlobalStyles: true,
        loadFonts: true,
        customFontFamily: '"AvenirNextLTPro", sans-serif'
      }}
    >
      <App />
    </StyleProvider>
  </React.StrictMode>
);`}</code>
          </pre>
        </Card>
      </section>
    </div>
  );
};

// Démo interactive
const InteractiveDemo = () => {
  const [config, setConfig] = useState<StyleConfig>({
    applyGlobalStyles: true,
    loadFonts: true,
    customFontFamily: '"AvenirNextLTPro", sans-serif',
    cssVariables: {
      '--demo-color': '59 130 246'
    }
  });

  const [customColor, setCustomColor] = useState('#3b82f6');

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setCustomColor(hex);

    // Convertir hex en RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    setConfig({
      ...config,
      cssVariables: {
        ...config.cssVariables,
        '--demo-color': `${r} ${g} ${b}`
      }
    });
  };

  return (
    <StyleProvider config={config}>
      <div className="container mx-auto p-8 max-w-4xl">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Démo Interactive</h2>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuration</h3>

              <div className="flex items-center space-x-4">
                <Label htmlFor="global-styles">Styles globaux</Label>
                <input
                  id="global-styles"
                  type="checkbox"
                  checked={config.applyGlobalStyles}
                  onChange={(e) => setConfig({ ...config, applyGlobalStyles: e.target.checked })}
                  className="h-4 w-4"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Label htmlFor="load-fonts">Charger les fonts</Label>
                <input
                  id="load-fonts"
                  type="checkbox"
                  checked={config.loadFonts}
                  onChange={(e) => setConfig({ ...config, loadFonts: e.target.checked })}
                  className="h-4 w-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-family">Police personnalisée</Label>
                <Input
                  id="font-family"
                  value={config.customFontFamily || ''}
                  onChange={(e) => setConfig({ ...config, customFontFamily: e.target.value })}
                  placeholder="Font family CSS"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-color">Couleur personnalisée</Label>
                <div className="flex items-center space-x-4">
                  <input
                    id="custom-color"
                    type="color"
                    value={customColor}
                    onChange={handleColorChange}
                    className="h-10 w-20"
                  />
                  <code className="text-sm">{customColor}</code>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Résultat</h3>

              <div
                className="p-4 rounded-lg border"
                style={{
                  fontFamily: config.customFontFamily,
                  backgroundColor: `rgb(var(--demo-color) / 0.1)`,
                  borderColor: `rgb(var(--demo-color))`,
                }}
              >
                <h4
                  className="text-xl font-bold mb-2"
                  style={{ color: `rgb(var(--demo-color))` }}
                >
                  Texte avec styles appliqués
                </h4>
                <p className="text-muted-foreground">
                  Ce conteneur utilise la configuration du StyleProvider.
                  La police est {config.loadFonts ? 'Avenir Next' : 'par défaut'}.
                </p>
                <Button
                  className="mt-4"
                  style={{
                    backgroundColor: `rgb(var(--demo-color))`,
                    color: 'white'
                  }}
                >
                  Bouton personnalisé
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Configuration actuelle</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{JSON.stringify(config, null, 2)}</code>
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </StyleProvider>
  );
};

const meta = {
  title: 'Context/StyleProvider',
  component: StyleProviderDocumentation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Le StyleProvider est un composant Context qui gère l'application des styles et fonts globaux dans votre application.

## Caractéristiques principales

- 🎨 **Styles globaux** : Applique les styles GS Components à toute l'application
- 🔤 **Gestion des fonts** : Charge automatiquement Avenir Next LT Pro
- 🎯 **Variables CSS** : Personnalisation via CSS custom properties
- 🔧 **Configuration flexible** : Options multiples pour différents besoins
- 🪝 **Hooks React** : useStyles et useGlobalStyles pour l'intégration

## Installation

\`\`\`bash
npm install @gs/gs-components-library
\`\`\`

## Import des styles

\`\`\`tsx
import '@gs/gs-components-library/dist/style.css';
import '@gs/gs-components-library/dist/styles/fonts.css';
\`\`\`

## Utilisation basique

\`\`\`tsx
import { StyleProvider } from '@gs/gs-components-library';

<StyleProvider config={{ applyGlobalStyles: true, loadFonts: true }}>
  <App />
</StyleProvider>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StyleProviderDocumentation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Documentation: Story = {
  name: 'Documentation',
};

export const Demo: Story = {
  name: 'Démo Interactive',
  render: () => <InteractiveDemo />,
};