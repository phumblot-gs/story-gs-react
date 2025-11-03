import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

const TokensDisplay = () => {
  return (
    <div className="p-8 space-y-12">
      {/* Colors Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Couleurs Figma</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Couleurs Principales</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <ColorCard name="Blue Primary" variable="--text-blue-primary" className="bg-[rgb(205_237_255)]" />
              <ColorCard name="Green" variable="--text-green" className="bg-[rgb(137_204_82)]" />
              <ColorCard name="Yellow" variable="--text-yellow" className="bg-[rgb(255_211_49)]" />
              <ColorCard name="Orange" variable="--text-orange" className="bg-[rgb(255_153_0)]" />
              <ColorCard name="Red Strong" variable="--text-red-strong" className="bg-[rgb(221_55_51)]" />
              <ColorCard name="Purple" variable="--text-purple" className="bg-[rgb(164_76_159)]" />
              <ColorCard name="Pink" variable="--text-pink" className="bg-[rgb(170_77_157)]" />
              <ColorCard name="Khaki" variable="--text-khaki" className="bg-[rgb(183_187_40)]" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Exemple d'utilisation</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`// Dans votre CSS
.my-element {
  color: rgb(var(--text-blue-primary));
  background: rgb(var(--bg-grey-lighter));
}

// Avec Tailwind (après configuration)
<div className="text-[rgb(var(--text-green))] bg-[rgb(var(--bg-white))]">
  Texte vert sur fond blanc
</div>

// En React avec styles inline
<div style={{
  color: \`rgb(\${getComputedStyle(document.documentElement)
    .getPropertyValue('--text-yellow')})\`
}}>
  Texte jaune
</div>`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Espacements</h2>

        <div className="space-y-4">
          <SpacingExample size="xs" value="5px" />
          <SpacingExample size="sm" value="10px" />
          <SpacingExample size="md" value="15px" />
          <SpacingExample size="lg" value="20px" />
          <SpacingExample size="xl" value="30px" />
          <SpacingExample size="2xl" value="40px" />
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Exemple d'utilisation</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto"><code>{`// Variables CSS
.card {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

// Avec Tailwind custom utilities
@layer utilities {
  .p-gs-md { padding: var(--spacing-md); }
  .m-gs-lg { margin: var(--spacing-lg); }
}

// En React
<div style={{ padding: 'var(--spacing-xl)' }}>
  Contenu avec padding XL
</div>`}</code></pre>
          </div>
        </div>
      </section>

      {/* Font Sizes Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Tailles de Police</h2>

        <div className="space-y-3">
          <div className="flex items-baseline gap-4">
            <span className="text-xs">XS (0.6875rem)</span>
            <code className="text-xs text-gray-600">var(--font-size-xs)</code>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-sm">SM (0.813rem)</span>
            <code className="text-xs text-gray-600">var(--font-size-sm)</code>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-base">Base (1rem)</span>
            <code className="text-xs text-gray-600">var(--font-size-base)</code>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-lg">LG (1.125rem)</span>
            <code className="text-xs text-gray-600">var(--font-size-lg)</code>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-xl">XL (1.25rem)</span>
            <code className="text-xs text-gray-600">var(--font-size-xl)</code>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Exemple d'utilisation</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto"><code>{`// CSS
.title {
  font-size: var(--font-size-xl);
}

.body-text {
  font-size: var(--font-size-base);
}

// Tailwind avec arbitrary values
<h1 className="text-[length:var(--font-size-xl)]">
  Titre XL
</h1>

// React inline styles
<p style={{ fontSize: 'var(--font-size-sm)' }}>
  Petit texte
</p>`}</code></pre>
          </div>
        </div>
      </section>

      {/* Status Colors Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Couleurs de Statut</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatusColorCard
            name="Ignoré"
            variable="--status-ignored-color"
            color="#EAEAEA"
          />
          <StatusColorCard
            name="Sélectionné"
            variable="--status-selected-color"
            color="#74D4DA"
          />
          <StatusColorCard
            name="Reshoot"
            variable="--status-reshoot-color"
            color="#A44C9F"
          />
          <StatusColorCard
            name="Pour Approbation"
            variable="--status-for-approval-color"
            color="#FFD331"
          />
          <StatusColorCard
            name="Refusé"
            variable="--status-refused-color"
            color="#595959"
          />
          <StatusColorCard
            name="Validé"
            variable="--status-validated-color"
            color="#89CC52"
          />
          <StatusColorCard
            name="À Publier"
            variable="--status-to-publish-color"
            color="#B7BB28"
          />
          <StatusColorCard
            name="Publié"
            variable="--status-published-color"
            color="#8B4513"
          />
          <StatusColorCard
            name="Erreur"
            variable="--status-error-color"
            color="#DD3733"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Exemple d'utilisation avec StatusIndicator</h3>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto"><code>{`import { StatusIndicator } from '@gs/gs-components-library';

// Utilisation du composant StatusIndicator
<StatusIndicator
  status="validated"
  size="lg"
  showLabel
/>

// Utilisation directe des variables CSS
<div
  className="w-4 h-4 rounded-full"
  style={{
    backgroundColor: 'var(--status-validated-color)'
  }}
/>

// Configuration personnalisée
<StatusIndicator
  status="custom"
  customColor="var(--status-error-color)"
  customLabel="Urgent"
/>`}</code></pre>
          </div>
        </div>
      </section>

      {/* Configuration Tailwind Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Configuration Tailwind</h2>

        <div className="bg-gray-100 p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`// tailwind.config.js
import gsTokens from '@gs/gs-components-library/dist/styles/tailwind-tokens.json';

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@gs/gs-components-library/dist/**/*.{js,mjs}'
  ],
  theme: {
    extend: {
      colors: {
        // Import des couleurs depuis les tokens
        ...gsTokens.colors,

        // Ou définition manuelle
        'gs-blue': 'rgb(var(--text-blue-primary) / <alpha-value>)',
        'gs-green': 'rgb(var(--text-green) / <alpha-value>)',
      },
      spacing: {
        // Import des espacements
        ...gsTokens.spacing,

        // Ou définition manuelle
        'gs-xs': 'var(--spacing-xs)',
        'gs-sm': 'var(--spacing-sm)',
      },
      fontSize: {
        // Import des tailles
        ...gsTokens.fontSize,

        // Ou définition manuelle
        'gs-xs': 'var(--font-size-xs)',
        'gs-base': 'var(--font-size-base)',
      }
    }
  }
}`}</code></pre>
        </div>
      </section>

      {/* Import Global Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Import Global des Tokens</h2>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Option 1: Via GSComponentsRoot</h3>
            <pre className="text-sm"><code>{`import { GSComponentsRoot } from '@gs/gs-components-library';

function App() {
  return (
    <GSComponentsRoot styleConfig={{
      applyGlobalStyles: true
    }}>
      {/* Tous les tokens sont disponibles */}
    </GSComponentsRoot>
  );
}`}</code></pre>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Option 2: Import CSS direct</h3>
            <pre className="text-sm"><code>{`// Dans votre fichier CSS principal ou index.tsx
import '@gs/gs-components-library/dist/styles/figma-tokens.css';
import '@gs/gs-components-library/dist/styles/theme-variables.css';`}</code></pre>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Option 3: Via StyleProvider</h3>
            <pre className="text-sm"><code>{`import { StyleProvider } from '@gs/gs-components-library';

function App() {
  return (
    <StyleProvider config={{
      applyGlobalStyles: true,
      cssVariables: {
        // Override de tokens spécifiques
        '--text-green': '0 255 0',
      }
    }}>
      {/* Application */}
    </StyleProvider>
  );
}`}</code></pre>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper components
const ColorCard: React.FC<{ name: string; variable: string; className: string }> = ({
  name,
  variable,
  className
}) => (
  <div className="space-y-2">
    <div className={`${className} h-20 rounded-lg border border-gray-300`} />
    <div className="text-sm">
      <p className="font-medium">{name}</p>
      <code className="text-xs text-gray-600">{variable}</code>
    </div>
  </div>
);

const SpacingExample: React.FC<{ size: string; value: string }> = ({ size, value }) => (
  <div className="flex items-center gap-4">
    <span className="text-sm font-medium w-12">{size.toUpperCase()}</span>
    <div
      className="bg-blue-500 h-4 rounded"
      style={{ width: `var(--spacing-${size})` }}
    />
    <code className="text-sm text-gray-600">var(--spacing-{size}) = {value}</code>
  </div>
);

const StatusColorCard: React.FC<{ name: string; variable: string; color: string }> = ({
  name,
  variable,
  color
}) => (
  <div className="flex items-center gap-3 p-3 border rounded-lg">
    <div
      className="w-8 h-8 rounded-full"
      style={{ backgroundColor: color }}
    />
    <div>
      <p className="text-sm font-medium">{name}</p>
      <code className="text-xs text-gray-600">{variable}</code>
    </div>
  </div>
);

const meta = {
  title: 'Design System/Tokens',
  component: TokensDisplay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Tokens du Design System

Les tokens sont des variables CSS qui définissent les valeurs de base du design system.
Ils sont générés automatiquement depuis les tokens Figma et peuvent être utilisés de plusieurs manières.

### Structure des Tokens

- **Couleurs** : Format RGB pour compatibilité avec les utilitaires d'opacité Tailwind
- **Espacements** : Valeurs en pixels avec variables CSS
- **Tailles de police** : Valeurs en rem pour l'accessibilité
- **Couleurs de statut** : Pour les indicateurs d'état

### Import dans votre projet

\`\`\`bash
npm install @gs/gs-components-library
\`\`\`

### Fichiers disponibles

- \`dist/styles/figma-tokens.css\` - Tokens Figma bruts
- \`dist/styles/theme-variables.css\` - Variables shadcn/ui + tokens
- \`dist/styles/tailwind-tokens.json\` - Configuration pour Tailwind
        `
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TokensDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Vue d\'ensemble des Tokens',
};

export const Colors: Story = {
  name: 'Couleurs',
  render: () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Palette de Couleurs</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ColorCard name="Blue Primary" variable="--text-blue-primary" className="bg-[rgb(205_237_255)]" />
        <ColorCard name="Green" variable="--text-green" className="bg-[rgb(137_204_82)]" />
        <ColorCard name="Yellow" variable="--text-yellow" className="bg-[rgb(255_211_49)]" />
        <ColorCard name="Orange" variable="--text-orange" className="bg-[rgb(255_153_0)]" />
        <ColorCard name="Red Strong" variable="--text-red-strong" className="bg-[rgb(221_55_51)]" />
        <ColorCard name="Purple" variable="--text-purple" className="bg-[rgb(164_76_159)]" />
        <ColorCard name="Grey" variable="--bg-grey" className="bg-[rgb(234_234_234)]" />
        <ColorCard name="Black" variable="--bg-black" className="bg-[rgb(41_40_40)]" />
      </div>
    </div>
  ),
};

export const StatusColors: Story = {
  name: 'Couleurs de Statut',
  render: () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Couleurs de Statut</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatusColorCard name="Ignoré" variable="--status-ignored-color" color="#EAEAEA" />
        <StatusColorCard name="Sélectionné" variable="--status-selected-color" color="#74D4DA" />
        <StatusColorCard name="Validé" variable="--status-validated-color" color="#89CC52" />
        <StatusColorCard name="Pour Approbation" variable="--status-for-approval-color" color="#FFD331" />
        <StatusColorCard name="Refusé" variable="--status-refused-color" color="#595959" />
        <StatusColorCard name="Erreur" variable="--status-error-color" color="#DD3733" />
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  name: 'Espacements',
  render: () => (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Système d'Espacements</h2>
      <SpacingExample size="xs" value="5px" />
      <SpacingExample size="sm" value="10px" />
      <SpacingExample size="md" value="15px" />
      <SpacingExample size="lg" value="20px" />
      <SpacingExample size="xl" value="30px" />
      <SpacingExample size="2xl" value="40px" />
    </div>
  ),
};