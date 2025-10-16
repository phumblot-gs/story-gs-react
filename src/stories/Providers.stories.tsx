import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useTheme } from 'next-themes';
import { TranslationProvider, useTranslation } from '../contexts/TranslationContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const ProvidersGuide = () => {
  return (
    <div className="p-8 space-y-12">
      {/* GSComponentsRoot Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">GSComponentsRoot - Solution tout-en-un</h2>

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
          <p className="text-lg mb-4">
            Le composant <code className="font-mono bg-white px-2 py-1 rounded">GSComponentsRoot</code> combine
            tous les providers nécessaires en une seule configuration.
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { GSComponentsRoot } from '@gs/gs-components-library';

function App() {
  return (
    <GSComponentsRoot
      // Configuration du thème
      themeConfig={{
        defaultTheme: 'light',
        storageKey: 'gs-theme',
        enableSystem: true
      }}

      // Configuration de la traduction
      translationConfig={{
        defaultLanguage: 'FR',
        customTranslations: {
          welcome: {
            FR: 'Bienvenue',
            EN: 'Welcome'
          }
        }
      }}

      // Configuration des styles
      styleConfig={{
        applyGlobalStyles: true,
        loadFonts: true,
        customFontFamily: '"AvenirNextLTPro", sans-serif',
        cssVariables: {
          '--primary': '200 80 60'
        }
      }}
    >
      {/* Votre application */}
      <YourApp />
    </GSComponentsRoot>
  );
}`}</code></pre>
        </div>
      </section>

      {/* Theme Provider Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">ThemeProvider</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Configuration basique</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`import { ThemeProvider } from '@gs/gs-components-library';

function App() {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="my-app-theme"
      enableSystem={true}
    >
      <YourApp />
    </ThemeProvider>
  );
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Utilisation du hook useTheme</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`import { useTheme } from '@gs/gs-components-library';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme('light')}
        className={theme === 'light' ? 'font-bold' : ''}
      >
        Light
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={theme === 'dark' ? 'font-bold' : ''}
      >
        Dark
      </button>
      <button
        onClick={() => setTheme('system')}
        className={theme === 'system' ? 'font-bold' : ''}
      >
        System
      </button>
    </div>
  );
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Personnalisation avancée</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`import { useCustomTheme } from '@gs/gs-components-library';

function CustomThemeEditor() {
  const { customTheme, updateCustomTheme, resetCustomTheme } = useCustomTheme();

  return (
    <div>
      <input
        type="color"
        value={customTheme.primary}
        onChange={(e) => updateCustomTheme({ primary: e.target.value })}
      />
      <button onClick={resetCustomTheme}>
        Réinitialiser
      </button>
    </div>
  );
}`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* Translation Provider Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">TranslationProvider</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Configuration basique</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`import { TranslationProvider } from '@gs/gs-components-library';

function App() {
  return (
    <TranslationProvider
      defaultLanguage="FR"
      languages={[
        { code: 'FR', name: 'Français' },
        { code: 'EN', name: 'English' },
        { code: 'ES', name: 'Español' }
      ]}
    >
      <YourApp />
    </TranslationProvider>
  );
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Traductions personnalisées</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`const customTranslations = {
  'welcome.title': {
    FR: 'Bienvenue sur notre plateforme',
    EN: 'Welcome to our platform',
    ES: 'Bienvenido a nuestra plataforma'
  },
  'button.submit': {
    FR: 'Envoyer',
    EN: 'Submit',
    ES: 'Enviar'
  }
};

<TranslationProvider
  defaultLanguage="FR"
  customTranslations={customTranslations}
>
  <App />
</TranslationProvider>`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Utilisation du hook useTranslation</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`import { useTranslation } from '@gs/gs-components-library';

function MyComponent() {
  const { t, language, setLanguage, availableLanguages } = useTranslation();

  return (
    <div>
      {/* Afficher une traduction */}
      <h1>{t('welcome.title')}</h1>

      {/* Sélecteur de langue */}
      <select
        value={language.code}
        onChange={(e) => {
          const lang = availableLanguages.find(l => l.code === e.target.value);
          if (lang) setLanguage(lang);
        }}
      >
        {availableLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>

      {/* Traduction avec paramètres */}
      <p>{t('user.greeting', { name: 'John' })}</p>
    </div>
  );
}`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* Style Provider Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">StyleProvider</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Configuration complète</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`import { StyleProvider } from '@gs/gs-components-library';

function App() {
  return (
    <StyleProvider
      config={{
        // Appliquer les styles globalement
        applyGlobalStyles: true,

        // Charger les fonts Avenir Next
        loadFonts: true,

        // Police personnalisée avec fallbacks
        customFontFamily: '"AvenirNextLTPro", -apple-system, sans-serif',

        // Variables CSS personnalisées
        cssVariables: {
          '--primary': '200 80 60',
          '--radius': '0.375rem',
          '--spacing-custom': '24px'
        },

        // Classes CSS racine
        rootClassName: 'gs-app',

        // Préfixe pour les classes
        classPrefix: 'gs'
      }}
    >
      <YourApp />
    </StyleProvider>
  );
}`}</code></pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Hook useGlobalStyles</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`import { useGlobalStyles } from '@gs/gs-components-library';

function App() {
  // Applique les styles sans wrapper
  useGlobalStyles({
    applyGlobalStyles: true,
    loadFonts: true,
    customFontFamily: '"AvenirNextLTPro", sans-serif'
  });

  return <YourApp />;
}`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* Combining Providers Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Combinaison de Providers</h2>

        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-6">
          <p className="text-lg mb-4">
            Si vous préférez configurer les providers séparément, vous pouvez les imbriquer manuellement.
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import {
  ThemeProvider,
  TranslationProvider,
  StyleProvider
} from '@gs/gs-components-library';

function App() {
  return (
    <StyleProvider config={{ applyGlobalStyles: true }}>
      <ThemeProvider defaultTheme="system">
        <TranslationProvider defaultLanguage="FR">
          <YourApp />
        </TranslationProvider>
      </ThemeProvider>
    </StyleProvider>
  );
}

// Ou utilisez simplement GSComponentsRoot qui fait tout cela pour vous !`}</code></pre>
        </div>
      </section>

      {/* Next.js Integration */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Intégration Next.js</h2>

        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`// app/layout.tsx (App Router)
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
          themeConfig={{ defaultTheme: 'system' }}
          translationConfig={{ defaultLanguage: 'FR' }}
          styleConfig={{ applyGlobalStyles: true, loadFonts: true }}
        >
          {children}
        </GSComponentsRoot>
      </body>
    </html>
  );
}

// pages/_app.tsx (Pages Router)
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
}`}</code></pre>
        </div>
      </section>
    </div>
  );
};

// Demo component
const InteractiveDemo = () => {
  return (
    <ThemeProvider>
      <TranslationProvider defaultLanguage="FR">
        <div className="p-8">
          <Card className="p-6 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Démo Interactive</h3>
            <ThemeDemo />
            <hr className="my-6" />
            <TranslationDemo />
          </Card>
        </div>
      </TranslationProvider>
    </ThemeProvider>
  );
};

const ThemeDemo = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Thème actuel: {theme}</h4>
      <div className="flex gap-2">
        <Button
          onClick={() => setTheme('light')}
          variant={theme === 'light' ? 'default' : 'outline'}
        >
          Light
        </Button>
        <Button
          onClick={() => setTheme('dark')}
          variant={theme === 'dark' ? 'default' : 'outline'}
        >
          Dark
        </Button>
        <Button
          onClick={() => setTheme('system')}
          variant={theme === 'system' ? 'default' : 'outline'}
        >
          System
        </Button>
      </div>
    </div>
  );
};

const TranslationDemo = () => {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Langue: {language.name}</h4>
      <div className="flex gap-2">
        <Button
          onClick={() => setLanguage({ code: 'FR', name: 'Français' })}
          variant={language.code === 'FR' ? 'default' : 'outline'}
        >
          FR
        </Button>
        <Button
          onClick={() => setLanguage({ code: 'EN', name: 'English' })}
          variant={language.code === 'EN' ? 'default' : 'outline'}
        >
          EN
        </Button>
      </div>
      <p className="text-sm text-gray-600">
        {t('fileBrowser.refresh')} | {t('fileBrowser.columnName')}
      </p>
    </div>
  );
};

const meta = {
  title: 'Design System/Providers',
  component: ProvidersGuide,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Providers du Design System

Les providers sont des composants React Context qui fournissent des fonctionnalités globales à votre application.

### Providers disponibles

1. **GSComponentsRoot** - Combine tous les providers en un seul
2. **ThemeProvider** - Gestion des thèmes (light/dark/system)
3. **TranslationProvider** - Gestion multilingue
4. **StyleProvider** - Application des styles et fonts globaux

### Installation

\`\`\`bash
npm install @gs/gs-components-library
\`\`\`

### Import des styles

\`\`\`tsx
import '@gs/gs-components-library/dist/style.css';
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProvidersGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Guide: Story = {
  name: 'Guide des Providers',
};

export const Demo: Story = {
  name: 'Démo Interactive',
  render: () => <InteractiveDemo />,
};