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

export const Colors: Story = {
  name: 'Colors',
  render: () => {
    // Base colors from figma-tokens.css
    const baseColors = [
      { name: 'Black', variable: '--color-black', hex: '#292828', description: 'Primary black color' },
      { name: 'Black Secondary', variable: '--color-black-secondary', hex: '#3a3a3a', description: 'Secondary black color' },
      { name: 'White', variable: '--color-white', hex: '#ffffff', description: 'Primary white color' },
      { name: 'Grey', variable: '--color-grey', hex: '#eaeaea', description: 'Primary grey color' },
      { name: 'Grey Light', variable: '--color-grey-light', hex: '#efefef', description: 'Light grey color' },
      { name: 'Grey Lighter', variable: '--color-grey-lighter', hex: '#f3f3f3', description: 'Lighter grey color' },
      { name: 'Grey Strong', variable: '--color-grey-strong', hex: '#d9d7d7', description: 'Strong grey color' },
      { name: 'Grey Stronger', variable: '--color-grey-stronger', hex: '#c1c1c1', description: 'Stronger grey color' },
      { name: 'Grey Strongest', variable: '--color-grey-strongest', hex: '#595959', description: 'Strongest grey color' },
      { name: 'Blue Primary', variable: '--color-blue-primary', hex: '#cdedff', description: 'Primary blue color' },
      { name: 'Blue', variable: '--color-blue', hex: '#74d4da', description: 'Standard blue color' },
      { name: 'Green Primary', variable: '--color-green-primary', hex: '#9edeab', description: 'Primary green color' },
      { name: 'Green', variable: '--color-green', hex: '#89cc52', description: 'Standard green color' },
      { name: 'Red Strong', variable: '--color-red-strong', hex: '#dd3733', description: 'Strong red color' },
      { name: 'Yellow', variable: '--color-yellow', hex: '#ffd331', description: 'Standard yellow color' },
      { name: 'Orange', variable: '--color-orange', hex: '#ff9900', description: 'Standard orange color' },
      { name: 'Pink', variable: '--color-pink', hex: '#ffaad4', description: 'Standard pink color' },
      { name: 'Purple', variable: '--color-purple', hex: '#a44c9f', description: 'Standard purple color' },
      { name: 'Khaki', variable: '--color-khaki', hex: '#b7bb28', description: 'Khaki color' },
      { name: 'Braun', variable: '--color-braun', hex: '#b8802a', description: 'Braun/brown color' },
      { name: 'Pastel Yellow', variable: '--color-pastel-yellow', hex: '#ebed8c', description: 'Pastel yellow color' },
      { name: 'Pastel Yellow Secondary', variable: '--color-pastel-yellow-secondary', hex: '#fff8d0', description: 'Secondary pastel yellow color' },
      { name: 'Pastel Blue', variable: '--color-pastel-blue', hex: '#74d4da', description: 'Pastel blue color' },
      { name: 'Pastel Blue Secondary', variable: '--color-pastel-blue-secondary', hex: '#92d6c9', description: 'Secondary pastel blue color' },
      { name: 'Pastel Green', variable: '--color-pastel-green', hex: '#a0e0ad', description: 'Pastel green color' },
    ];

    // MediaStatus colors mapping
    const mediaStatusColors = [
      { status: 'IGNORED', code: 1, variable: '--status-ignored-color', hex: '#c1c1c1', description: 'Grey stronger - for ignored media' },
      { status: 'TO_RESHOOT', code: 5, variable: '--status-reshoot-color', hex: '#ff9900', description: 'Orange - for media that needs to be reshot' },
      { status: 'NOT_SELECTED', code: 10, variable: '--status-not-selected-color', hex: '#eaeaea', description: 'Grey - for non-selected media' },
      { status: 'SELECTED', code: 30, variable: '--status-selected-color', hex: '#89cc52', description: 'Green - for selected media' },
      { status: 'REFUSED_1', code: 31, variable: '--status-refused-color', hex: '#dd3733', description: 'Red strong - for refused media (variant 1)' },
      { status: 'REFUSED_2', code: 35, variable: '--status-refused-color', hex: '#dd3733', description: 'Red strong - for refused media (variant 2)' },
      { status: 'SUBMITTED_FOR_APPROVAL', code: 40, variable: '--status-for-approval-color', hex: '#ffd331', description: 'Yellow - for media submitted for approval' },
      { status: 'VALIDATED', code: 50, variable: '--status-validated-color', hex: '#9edeab', description: 'Green primary - for validated media' },
      { status: 'READY_TO_BROADCAST', code: 51, variable: '--status-to-publish-color', hex: '#74d4da', description: 'Pastel blue - for media ready to broadcast' },
      { status: 'ERROR_DURING_BROADCAST', code: 52, variable: '--status-error-color', hex: '#dd3733', description: 'Red strong - for broadcast errors' },
      { status: 'BROADCAST', code: 55, variable: '--status-published-color', hex: '#74d4da', description: 'Blue - for broadcasted media' },
      { status: 'ARCHIVED', code: 80, variable: '--status-published-color', hex: '#74d4da', description: 'Blue - for archived media' },
    ];

    return (
      <div className="p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Color Tokens</h2>
          <p className="text-gray-600 mb-6">
            Color tokens define consistent colors used throughout the design system.
            These colors can be used directly in Tailwind CSS utility classes via the <code>className</code> prop.
          </p>
        </div>

        {/* Base Colors */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Base Colors</h3>
            <p className="text-sm text-gray-600 mb-4">
              Complete list of base colors available in the design system. These colors can be used for backgrounds, text, borders, and other UI elements.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Color Name</th>
                    <th className="px-4 py-2 text-left font-semibold">CSS Variable</th>
                    <th className="px-4 py-2 text-left font-semibold">Hex Value</th>
                    <th className="px-4 py-2 text-left font-semibold">Description</th>
                    <th className="px-4 py-2 text-left font-semibold">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {baseColors.map((color) => (
                    <tr key={color.variable} className="border-t border-gray-200">
                      <td className="px-4 py-2 font-semibold">{color.name}</td>
                      <td className="px-4 py-2 font-mono text-xs">{color.variable}</td>
                      <td className="px-4 py-2 font-mono text-xs">{color.hex}</td>
                      <td className="px-4 py-2 text-gray-600">{color.description}</td>
                      <td className="px-4 py-2">
                        <div 
                          className="w-12 h-8 rounded border border-gray-300" 
                          style={{ backgroundColor: color.hex }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Background Colors */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Background Colors</h3>
            <p className="text-sm text-gray-600 mb-4">
              Apply background colors to layouts and components. The <code>Layout</code> component provides three main background contexts: <code>white</code>, <code>grey</code>, and <code>black</code>.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Using Layout Component</h4>
                <pre className="text-sm overflow-x-auto"><code>{`import { Layout } from '@gs/gs-components-library';

// White background
<Layout bg="white">
  <div>Content on white background</div>
</Layout>

// Grey background
<Layout bg="grey">
  <div>Content on grey background</div>
</Layout>

// Black background
<Layout bg="black">
  <div>Content on black background</div>
</Layout>`}</code></pre>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Using Tailwind Classes</h4>
                <pre className="text-sm overflow-x-auto"><code>{`// Base colors
<div className="bg-white">...</div>        // White background
<div className="bg-black">...</div>        // Black background
<div className="bg-grey">...</div>        // Grey background
<div className="bg-grey-lighter">...</div> // Lighter grey background

// Color tokens
<div className="bg-blue-primary">...</div>  // Blue primary background
<div className="bg-green">...</div>        // Green background
<div className="bg-red-strong">...</div>   // Red strong background

// Available background classes:
bg-white, bg-black, bg-black-secondary,
bg-grey, bg-grey-light, bg-grey-lighter, bg-grey-strong, bg-grey-stronger, bg-grey-strongest,
bg-blue-primary, bg-blue,
bg-green-primary, bg-green,
bg-red-strong,
bg-yellow, bg-orange, bg-pink, bg-purple, bg-khaki, bg-braun,
bg-pastel-yellow, bg-pastel-yellow-secondary,
bg-pastel-blue, bg-pastel-blue-secondary, bg-pastel-green`}</code></pre>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Using CSS Variables</h4>
                <pre className="text-sm overflow-x-auto"><code>{`// In CSS
.my-element {
  background-color: var(--color-white);
  background-color: var(--color-grey);
  background-color: var(--color-blue-primary);
}

// In React inline styles
<div style={{ backgroundColor: 'var(--color-green)' }}>
  Content with green background
</div>`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* Text Colors */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Text Colors</h3>
            <p className="text-sm text-gray-600 mb-4">
              Apply text colors to content. Text colors automatically adapt to the parent background context when using the <code>Text</code> component, or can be applied directly with Tailwind classes.
            </p>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Using Text Component (Context-Aware)</h4>
                <pre className="text-sm overflow-x-auto"><code>{`import { Text, Layout } from '@gs/gs-components-library';

// Text automatically adapts to background context
<Layout bg="white">
  <Text>Black text on white background</Text>
</Layout>

<Layout bg="black">
  <Text>White text on black background</Text>
</Layout>

<Layout bg="grey">
  <Text>Black text on grey background</Text>
</Layout>`}</code></pre>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Using Tailwind Classes</h4>
                <pre className="text-sm overflow-x-auto"><code>{`// Base colors
<p className="text-white">...</p>        // White text
<p className="text-black">...</p>        // Black text
<p className="text-grey-strongest">...</p> // Grey strongest text

// Color tokens
<p className="text-blue-primary">...</p>  // Blue primary text
<p className="text-green">...</p>          // Green text
<p className="text-red-strong">...</p>     // Red strong text

// Available text classes:
text-white, text-black,
text-grey-stronger, text-grey-strongest,
text-blue-primary, text-blue,
text-green-primary, text-green,
text-red-strong,
text-yellow, text-orange, text-pink, text-purple, text-khaki, text-braun,
text-pastel-yellow, text-pastel-yellow-secondary,
text-pastel-blue, text-pastel-blue-secondary, text-pastel-green`}</code></pre>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Using CSS Variables</h4>
                <pre className="text-sm overflow-x-auto"><code>{`// In CSS
.my-text {
  color: rgb(var(--text-white));
  color: rgb(var(--text-black));
  color: rgb(var(--text-blue-primary));
}

// In React inline styles
<p style={{ color: 'rgb(var(--text-green))' }}>
  Green text
</p>`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* MediaStatus Colors */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">MediaStatus Colors</h3>
            <p className="text-sm text-gray-600 mb-4">
              Complete list of colors available for the <code>MediaStatus</code> component. Each status has a specific color associated with it.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Status Name</th>
                    <th className="px-4 py-2 text-left font-semibold">Code</th>
                    <th className="px-4 py-2 text-left font-semibold">CSS Variable</th>
                    <th className="px-4 py-2 text-left font-semibold">Hex Value</th>
                    <th className="px-4 py-2 text-left font-semibold">Description</th>
                    <th className="px-4 py-2 text-left font-semibold">Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaStatusColors.map((status) => (
                    <tr key={status.status} className="border-t border-gray-200">
                      <td className="px-4 py-2 font-semibold">{status.status}</td>
                      <td className="px-4 py-2 font-mono text-xs">{status.code}</td>
                      <td className="px-4 py-2 font-mono text-xs">{status.variable}</td>
                      <td className="px-4 py-2 font-mono text-xs">{status.hex}</td>
                      <td className="px-4 py-2 text-gray-600">{status.description}</td>
                      <td className="px-4 py-2">
                        <div 
                          className="w-12 h-8 rounded border border-gray-300" 
                          style={{ backgroundColor: status.hex }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg mt-4">
              <h4 className="font-semibold mb-2">Usage Example</h4>
              <pre className="text-sm overflow-x-auto"><code>{`import { MediaStatus } from '@gs/gs-components-library';
import { MediaStatus as MediaStatusEnum } from '@gs/gs-components-library';

// Using MediaStatus component
<MediaStatus status={MediaStatusEnum.SELECTED} />
<MediaStatus status={MediaStatusEnum.VALIDATED} />
<MediaStatus status={MediaStatusEnum.SUBMITTED_FOR_APPROVAL} />

// Available status values:
MediaStatusEnum.IGNORED (1)
MediaStatusEnum.TO_RESHOOT (5)
MediaStatusEnum.NOT_SELECTED (10)
MediaStatusEnum.SELECTED (30)
MediaStatusEnum.REFUSED_1 (31)
MediaStatusEnum.REFUSED_2 (35)
MediaStatusEnum.SUBMITTED_FOR_APPROVAL (40)
MediaStatusEnum.VALIDATED (50)
MediaStatusEnum.READY_TO_BROADCAST (51)
MediaStatusEnum.ERROR_DURING_BROADCAST (52)
MediaStatusEnum.BROADCAST (55)
MediaStatusEnum.ARCHIVED (80)`}</code></pre>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Complete Usage Examples</h3>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto"><code>{`// Layout with background and text colors
<Layout bg="white" padding={6}>
  <h1 className="text-black">Title</h1>
  <p className="text-grey-strongest">Subtitle</p>
</Layout>

<Layout bg="black" padding={6}>
  <h1 className="text-white">Title</h1>
  <p className="text-blue-primary">Subtitle</p>
</Layout>

// Component with custom colors
<Animated name="success" className="w-16 h-16" bgColor="green" />
<Button className="bg-blue-primary text-black">Click me</Button>

// MediaStatus usage
<MediaStatus status={MediaStatusEnum.VALIDATED} />
<StatusIndicator status={MediaStatusEnum.SELECTED} size="medium" />`}</code></pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  },
};

export const Spacing: Story = {
  name: 'Spacing Tokens',
  render: () => {
    // All available spacing values from tailwind.config.ts
    const spacingValues = [
      { value: '0', px: '0px', description: 'No spacing' },
      { value: '1', px: '5px', description: 'Extra small spacing' },
      { value: '2', px: '10px', description: 'Small spacing' },
      { value: '3', px: '15px', description: 'Medium-small spacing' },
      { value: '4', px: '20px', description: 'Medium spacing' },
      { value: '5', px: '25px', description: 'Medium-large spacing' },
      { value: '6', px: '30px', description: 'Large spacing' },
      { value: '8', px: '40px', description: 'Extra large spacing' },
      { value: '10', px: '50px', description: '2XL spacing' },
      { value: '12', px: '60px', description: '3XL spacing' },
      { value: '16', px: '80px', description: '4XL spacing' },
      { value: '20', px: '100px', description: '5XL spacing' },
      { value: '24', px: '120px', description: '6XL spacing' },
      { value: '28', px: '140px', description: '7XL spacing' },
      { value: '30', px: '150px', description: '8XL spacing' },
      { value: '32', px: '160px', description: '9XL spacing' },
      { value: '36', px: '180px', description: '10XL spacing' },
      { value: '40', px: '200px', description: '11XL spacing' },
      { value: '44', px: '220px', description: '12XL spacing' },
      { value: '48', px: '240px', description: '13XL spacing' },
      { value: '50', px: '250px', description: '14XL spacing' },
      { value: '52', px: '260px', description: '15XL spacing' },
      { value: '56', px: '280px', description: '16XL spacing' },
      { value: '60', px: '300px', description: '17XL spacing' },
      { value: '64', px: '320px', description: '18XL spacing' },
      { value: '68', px: '340px', description: '19XL spacing' },
      { value: '70', px: '350px', description: '20XL spacing' },
      { value: '72', px: '360px', description: '21XL spacing' },
      { value: '80', px: '400px', description: '22XL spacing' },
      { value: '90', px: '450px', description: '23XL spacing' },
      { value: '100', px: '500px', description: '24XL spacing' },
    ];

    return (
      <div className="p-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Spacing Tokens</h2>
          <p className="text-gray-600 mb-6">
            Spacing tokens define consistent spacing values used throughout the design system.
            These values can be used directly in Tailwind CSS utility classes via the <code>className</code> prop.
          </p>
        </div>

        {/* Width & Height */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Width & Height</h3>
            <p className="text-sm text-gray-600 mb-4">
              Control element width and height. Use <code>w-{'{x}'}</code> for width and <code>h-{'{x}'}</code> for height.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
                {spacingValues.map(({ value, px }) => {
                  // Get the actual pixel value for inline styles
                  const pixelValue = parseInt(px);
                  return (
                    <div key={value} className="flex flex-col items-center gap-1">
                      <div 
                        className="bg-blue-500 rounded" 
                        style={{ width: `${pixelValue}px`, height: `${pixelValue}px` }}
                      />
                      <code className="text-gray-600">w-{value}</code>
                      <code className="text-gray-600">h-{value}</code>
                      <span className="text-gray-500">{px}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`// Examples
<Animated name="success" className="w-10 h-10" />  // 50px × 50px
<div className="w-20 h-20">...</div>                // 100px × 100px
<Button className="w-16 h-16">...</Button>          // 80px × 80px

// Available values: ${spacingValues.map(s => s.value).join(', ')}`}</code></pre>
            </div>
          </div>
        </section>

        {/* Padding */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Padding</h3>
            <p className="text-sm text-gray-600 mb-4">
              Control internal spacing inside elements. Use <code>p-{'{x}'}</code> for all sides, 
              <code>px-{'{x}'}</code> for horizontal, <code>py-{'{x}'}</code> for vertical, 
              or <code>pt-{'{x}'}</code>, <code>pr-{'{x}'}</code>, <code>pb-{'{x}'}</code>, <code>pl-{'{x}'}</code> for individual sides.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`// Examples
<div className="p-4">...</div>        // padding: 20px (all sides)
<div className="px-6 py-2">...</div>  // padding: 30px horizontal, 10px vertical
<div className="pt-8 pb-4">...</div>  // padding: 40px top, 20px bottom
<div className="pl-3 pr-5">...</div>   // padding: 15px left, 25px right

// Available values: ${spacingValues.map(s => s.value).join(', ')}`}</code></pre>
            </div>
          </div>
        </section>

        {/* Margin */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Margin</h3>
            <p className="text-sm text-gray-600 mb-4">
              Control external spacing around elements. Use <code>m-{'{x}'}</code> for all sides, 
              <code>mx-{'{x}'}</code> for horizontal, <code>my-{'{x}'}</code> for vertical, 
              or <code>mt-{'{x}'}</code>, <code>mr-{'{x}'}</code>, <code>mb-{'{x}'}</code>, <code>ml-{'{x}'}</code> for individual sides.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`// Examples
<div className="m-4">...</div>        // margin: 20px (all sides)
<div className="mx-auto">...</div>    // margin: auto horizontal (centering)
<div className="my-6">...</div>       // margin: 30px vertical
<div className="mt-8 mb-2">...</div>  // margin: 40px top, 10px bottom

// Available values: ${spacingValues.map(s => s.value).join(', ')}`}</code></pre>
            </div>
          </div>
        </section>

        {/* Gap */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Gap</h3>
            <p className="text-sm text-gray-600 mb-4">
              Control spacing between flexbox or grid children. Use <code>gap-{'{x}'}</code> for both axes, 
              <code>gap-x-{'{x}'}</code> for horizontal, or <code>gap-y-{'{x}'}</code> for vertical.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`// Examples
<div className="flex gap-4">...</div>      // gap: 20px between flex children
<div className="grid gap-6">...</div>      // gap: 30px between grid items
<div className="flex gap-x-8 gap-y-2">...</div>  // gap: 40px horizontal, 10px vertical

// Available values: ${spacingValues.map(s => s.value).join(', ')}`}</code></pre>
            </div>
          </div>
        </section>

        {/* Space Between */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Space Between</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add spacing between child elements. Use <code>space-x-{'{x}'}</code> for horizontal spacing 
              or <code>space-y-{'{x}'}</code> for vertical spacing.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto"><code>{`// Examples
<div className="space-x-4">
  <span>Item 1</span>
  <span>Item 2</span>  {/* 20px margin-left */}
</div>

<div className="space-y-6">
  <div>Row 1</div>
  <div>Row 2</div>  {/* 30px margin-top */}
</div>

// Available values: ${spacingValues.map(s => s.value).join(', ')}`}</code></pre>
            </div>
          </div>
        </section>

        {/* Complete Values Reference */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Complete Values Reference</h3>
            <p className="text-sm text-gray-600 mb-4">
              All spacing values available for use in utility classes:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">Value (x)</th>
                    <th className="px-4 py-2 text-left font-semibold">Pixels</th>
                    <th className="px-4 py-2 text-left font-semibold">Rem</th>
                    <th className="px-4 py-2 text-left font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {spacingValues.map(({ value, px, description }) => {
                    const remValue = parseFloat(px) / 16;
                    return (
                      <tr key={value} className="border-t border-gray-200">
                        <td className="px-4 py-2 font-mono font-semibold">{value}</td>
                        <td className="px-4 py-2 font-mono">{px}</td>
                        <td className="px-4 py-2 font-mono">{remValue.toFixed(4)}rem</td>
                        <td className="px-4 py-2 text-gray-600">{description}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Usage Examples</h3>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto"><code>{`// Component sizing
<Animated name="success" className="w-16 h-16" />
<Button className="w-20 h-20">Click me</Button>

// Layout spacing
<div className="p-6">
  <div className="mb-4">Content with bottom margin</div>
  <div className="mt-8">Content with top margin</div>
</div>

// Flexbox spacing
<div className="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

// Grid spacing
<div className="grid grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>`}</code></pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  },
};