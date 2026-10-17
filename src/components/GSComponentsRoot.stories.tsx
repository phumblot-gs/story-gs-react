import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import { GSComponentsRoot, type GSComponentsRootProps } from './GSComponentsRoot';
import { useTheme } from 'next-themes';
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SegmentedControl, SegmentedControlContent, SegmentedControlList, SegmentedControlTrigger } from '@/components/ui/segmented-control';

const GSComponentsRootDocumentation = () => {
  return (
    <div className="container mx-auto p-8 max-w-6xl space-y-12">
      <section>
        <h1 className="text-4xl font-bold mb-6">GSComponentsRoot</h1>
        <p className="text-lg text-muted-foreground mb-8">
          GSComponentsRoot est le composant racine tout-en-un qui combine automatiquement tous les providers
          nécessaires (Theme, Translation, Style) en une seule configuration simple et cohérente.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">💡 Recommandé pour démarrer</h3>
          <p className="text-sm">
            GSComponentsRoot est la façon la plus simple d'intégrer GS Components dans votre application.
            Il configure automatiquement tous les providers avec des valeurs par défaut optimales.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Installation rapide</h2>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">1. Installation du package</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`npm install @gs/gs-components-library`}</code>
          </pre>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">2. Configuration basique</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`import { GSComponentsRoot } from '@gs/gs-components-library';
import '@gs/gs-components-library/dist/style.css';

function App() {
  return (
    <GSComponentsRoot>
      {/* Votre application avec tous les providers configurés */}
      <YourApp />
    </GSComponentsRoot>
  );
}`}</code>
          </pre>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Configuration complète</h2>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Toutes les options disponibles</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`import { GSComponentsRoot } from '@gs/gs-components-library';

function App() {
  return (
    <GSComponentsRoot
      // Configuration du thème
      themeConfig={{
        defaultTheme: 'system',        // 'light' | 'dark' | 'system'
        storageKey: 'gs-theme',        // Clé localStorage
        enableSystem: true,            // Détecter le thème système
        disableTransitionOnChange: false,
        customization: {
          colors: {
            primary: '#3b82f6',
            secondary: '#10b981'
          }
        }
      }}

      // Configuration de la traduction
      translationConfig={{
        defaultLanguage: 'FR',         // Code de langue par défaut
        initialLanguage: {
          code: 'FR',
          name: 'Français'
        },
        customTranslations: {
          'welcome': {
            FR: 'Bienvenue',
            EN: 'Welcome',
            ES: 'Bienvenido'
          }
        },
        languages: [
          { code: 'FR', name: 'Français' },
          { code: 'EN', name: 'English' },
          { code: 'ES', name: 'Español' }
        ]
      }}

      // Configuration des styles
      styleConfig={{
        applyGlobalStyles: true,      // Appliquer les styles globaux
        loadFonts: true,              // Charger Avenir Next
        customFontFamily: '"AvenirNextLTPro", sans-serif',
        cssVariables: {
          '--primary': '59 130 246',
          '--radius': '0.5rem'
        },
        rootClassName: 'gs-app',
        classPrefix: 'gs'
      }}
    >
      <YourApp />
    </GSComponentsRoot>
  );
}`}</code>
          </pre>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Props disponibles</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">themeConfig</code>
                  <span className="text-xs text-muted-foreground">optionnel</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configuration du ThemeProvider (thème clair/sombre, persistance, personnalisation)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">translationConfig</code>
                  <span className="text-xs text-muted-foreground">optionnel</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configuration du TranslationProvider (langues, traductions personnalisées)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">styleConfig</code>
                  <span className="text-xs text-muted-foreground">optionnel</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Configuration du StyleProvider (fonts, variables CSS, styles globaux)
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">children</code>
                  <span className="text-xs text-green-600">requis</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Les composants enfants de votre application
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Configurations par environnement</h2>

        <SegmentedControl defaultValue="nextjs" className="w-full">
          <SegmentedControlList className="grid w-full grid-cols-4">
            <SegmentedControlTrigger value="nextjs">Next.js</SegmentedControlTrigger>
            <SegmentedControlTrigger value="vite">Vite</SegmentedControlTrigger>
            <SegmentedControlTrigger value="cra">Create React App</SegmentedControlTrigger>
            <SegmentedControlTrigger value="remix">Remix</SegmentedControlTrigger>
          </SegmentedControlList>

          <SegmentedControlContent value="nextjs" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Next.js App Router</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// app/layout.tsx
import { GSComponentsRoot } from '@gs/gs-components-library';
import '@gs/gs-components-library/dist/style.css';

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <GSComponentsRoot
          themeConfig={{
            defaultTheme: 'system',
            enableSystem: true
          }}
          translationConfig={{
            defaultLanguage: 'FR'
          }}
          styleConfig={{
            applyGlobalStyles: true,
            loadFonts: true
          }}
        >
          {children}
        </GSComponentsRoot>
      </body>
    </html>
  );
}`}</code>
              </pre>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Next.js Pages Router</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// pages/_app.tsx
import { GSComponentsRoot } from '@gs/gs-components-library';
import '@gs/gs-components-library/dist/style.css';

export default function App({ Component, pageProps }) {
  return (
    <GSComponentsRoot
      themeConfig={{ defaultTheme: 'system' }}
      translationConfig={{ defaultLanguage: 'FR' }}
      styleConfig={{ applyGlobalStyles: true }}
    >
      <Component {...pageProps} />
    </GSComponentsRoot>
  );
}`}</code>
              </pre>
            </Card>
          </SegmentedControlContent>

          <SegmentedControlContent value="vite">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Vite React</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GSComponentsRoot } from '@gs/gs-components-library';
import '@gs/gs-components-library/dist/style.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GSComponentsRoot
      themeConfig={{ defaultTheme: 'light' }}
      styleConfig={{
        applyGlobalStyles: true,
        loadFonts: true
      }}
    >
      <App />
    </GSComponentsRoot>
  </React.StrictMode>
);`}</code>
              </pre>
            </Card>
          </SegmentedControlContent>

          <SegmentedControlContent value="cra">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Create React App</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GSComponentsRoot } from '@gs/gs-components-library';
import '@gs/gs-components-library/dist/style.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GSComponentsRoot
      styleConfig={{
        applyGlobalStyles: true,
        loadFonts: true
      }}
    >
      <App />
    </GSComponentsRoot>
  </React.StrictMode>
);`}</code>
              </pre>
            </Card>
          </SegmentedControlContent>

          <SegmentedControlContent value="remix">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Remix</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`// app/root.tsx
import { GSComponentsRoot } from '@gs/gs-components-library';
import gsStyles from '@gs/gs-components-library/dist/style.css';

export const links = () => [
  { rel: 'stylesheet', href: gsStyles }
];

export default function App() {
  return (
    <html lang="fr">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <GSComponentsRoot
          themeConfig={{ defaultTheme: 'system' }}
          styleConfig={{ applyGlobalStyles: true }}
        >
          <Outlet />
        </GSComponentsRoot>
        <Scripts />
      </body>
    </html>
  );
}`}</code>
              </pre>
            </Card>
          </SegmentedControlContent>
        </SegmentedControl>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Accès aux contextes</h2>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Utilisation des hooks dans les composants enfants</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`import { useTheme } from '@gs/gs-components-library';
import { useTranslation } from '@gs/gs-components-library';
import { useStyles } from '@gs/gs-components-library';

function MyComponent() {
  // Accès au thème
  const { theme, setTheme } = useTheme();

  // Accès aux traductions
  const { t, language, setLanguage } = useTranslation();

  // Accès aux styles
  const { config: styleConfig } = useStyles();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>Thème actuel: {theme}</p>
      <p>Langue: {language.name}</p>
      <button onClick={() => setTheme('dark')}>
        Mode sombre
      </button>
    </div>
  );
}`}</code>
          </pre>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Personnalisation avancée</h2>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Configuration dynamique</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`function App() {
  const [config, setConfig] = useState({
    theme: 'light',
    language: 'FR',
    primaryColor: '#3b82f6'
  });

  return (
    <GSComponentsRoot
      themeConfig={{
        defaultTheme: config.theme,
        customization: {
          colors: {
            primary: config.primaryColor
          }
        }
      }}
      translationConfig={{
        defaultLanguage: config.language
      }}
      styleConfig={{
        applyGlobalStyles: true,
        cssVariables: {
          '--primary': hexToRgb(config.primaryColor)
        }
      }}
    >
      <YourApp onConfigChange={setConfig} />
    </GSComponentsRoot>
  );
}`}</code>
          </pre>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Avec état global (Redux, Zustand, etc.)</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`import { Provider } from 'react-redux';
import { GSComponentsRoot } from '@gs/gs-components-library';

function App() {
  return (
    <Provider store={store}>
      <GSComponentsRoot
        themeConfig={{ defaultTheme: 'system' }}
        styleConfig={{ applyGlobalStyles: true }}
      >
        <RouterProvider router={router} />
      </GSComponentsRoot>
    </Provider>
  );
}`}</code>
          </pre>
        </Card>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Migration depuis les providers individuels</h2>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Avant (providers séparés)</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`// Configuration complexe avec providers imbriqués
<StyleProvider config={{ applyGlobalStyles: true }}>
  <ThemeProvider defaultTheme="system">
    <TranslationProvider defaultLanguage="FR">
      <App />
    </TranslationProvider>
  </ThemeProvider>
</StyleProvider>`}</code>
          </pre>

          <h3 className="text-lg font-semibold mb-4 mt-6">Après (GSComponentsRoot)</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{`// Configuration simplifiée avec GSComponentsRoot
<GSComponentsRoot
  themeConfig={{ defaultTheme: 'system' }}
  translationConfig={{ defaultLanguage: 'FR' }}
  styleConfig={{ applyGlobalStyles: true }}
>
  <App />
</GSComponentsRoot>`}</code>
          </pre>
        </Card>
      </section>
    </div>
  );
};

// Démo interactive
const InteractiveDemo = () => {
  const [rootConfig, setRootConfig] = useState<GSComponentsRootProps>({
    themeConfig: {
      defaultTheme: 'light',
      enableSystem: true
    },
    translationConfig: {
      defaultLanguage: 'FR'
    },
    styleConfig: {
      applyGlobalStyles: true,
      loadFonts: true
    }
  });

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Démo Interactive</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Configuration</h3>

            <div className="space-y-4">
              <div>
                <Label>Thème par défaut</Label>
                <Select
                  value={rootConfig.themeConfig?.defaultTheme || 'system'}
                  onValueChange={(value) => setRootConfig({
                    ...rootConfig,
                    themeConfig: {
                      ...rootConfig.themeConfig,
                      defaultTheme: value as 'light' | 'dark' | 'system'
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Langue par défaut</Label>
                <Select
                  value={rootConfig.translationConfig?.defaultLanguage || 'FR'}
                  onValueChange={(value) => setRootConfig({
                    ...rootConfig,
                    translationConfig: {
                      ...rootConfig.translationConfig,
                      defaultLanguage: value
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FR">Français</SelectItem>
                    <SelectItem value="EN">English</SelectItem>
                    <SelectItem value="ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="apply-global"
                    checked={rootConfig.styleConfig?.applyGlobalStyles || false}
                    onChange={(e) => setRootConfig({
                      ...rootConfig,
                      styleConfig: {
                        ...rootConfig.styleConfig,
                        applyGlobalStyles: e.target.checked
                      }
                    })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="apply-global">Appliquer les styles globaux</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="load-fonts"
                    checked={rootConfig.styleConfig?.loadFonts || false}
                    onChange={(e) => setRootConfig({
                      ...rootConfig,
                      styleConfig: {
                        ...rootConfig.styleConfig,
                        loadFonts: e.target.checked
                      }
                    })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="load-fonts">Charger les fonts Avenir</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Configuration JSON</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                <code>{JSON.stringify(rootConfig, null, 2)}</code>
              </pre>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Aperçu</h3>

            <GSComponentsRoot {...rootConfig}>
              <DemoContent />
            </GSComponentsRoot>
          </div>
        </div>
      </Card>
    </div>
  );
};

const DemoContent = () => {
  const { theme, setTheme } = useTheme();
  const { t, language, setLanguage } = useTranslation();

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">
          {language.code === 'FR' ? 'Application de démonstration' :
           language.code === 'EN' ? 'Demo Application' :
           'Aplicación de demostración'}
        </h4>

        <p className="text-sm text-muted-foreground">
          {t('fileBrowser.noFiles')}
        </p>

        <div className="flex gap-2">
          <Button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            variant="outline"
          >
            {theme === 'dark' ? '☀️' : '🌙'} {theme}
          </Button>

          <Button
            onClick={() => setLanguage({
              code: language.code === 'FR' ? 'EN' : 'FR',
              name: language.code === 'FR' ? 'English' : 'Français'
            })}
            variant="outline"
          >
            🌍 {language.code}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Theme: {theme}</p>
          <p>Language: {language.name}</p>
          <p>Font: AvenirNextLTPro</p>
        </div>
      </div>
    </Card>
  );
};

const meta = {
  title: 'Context/GSComponentsRoot',
  component: GSComponentsRootDocumentation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
GSComponentsRoot est le composant racine tout-en-un pour initialiser GS Components dans votre application.

## 🚀 Avantages

- **Configuration simplifiée** : Un seul composant au lieu de multiples providers imbriqués
- **Valeurs par défaut optimales** : Configuré avec les meilleures pratiques GS
- **TypeScript intégré** : Autocomplétion et vérification de types
- **Performance optimisée** : Chargement intelligent des ressources

## 📦 Ce qui est inclus

- **ThemeProvider** : Gestion des thèmes clair/sombre
- **TranslationProvider** : Support multilingue
- **StyleProvider** : Styles globaux et fonts Avenir Next

## 🎯 Utilisation recommandée

GSComponentsRoot doit être placé au niveau le plus haut de votre application,
typiquement dans votre fichier racine (App.tsx, layout.tsx, _app.tsx, etc.).

\`\`\`tsx
<GSComponentsRoot>
  <App />
</GSComponentsRoot>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GSComponentsRootDocumentation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Documentation: Story = {
};

export const Demo: Story = {
  name: 'Démo Interactive',
  render: () => <InteractiveDemo />,
};