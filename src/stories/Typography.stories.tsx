import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout';

const Typography = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Police Avenir Next LT Pro</h2>
        <p className="text-gray-600 mb-6">
          La police Avenir Next est maintenant appliquée par défaut dans tout Storybook.
          Tous les composants utilisent automatiquement cette police.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-3">Poids de police disponibles</h3>

        <div className="border-l-4 border-blue-500 pl-4">
          <p className="font-ultralight text-3xl">Ultra Light (200)</p>
          <p className="text-gray-500">Font-weight: 200 - Parfait pour les grands titres élégants</p>
        </div>

        <div className="border-l-4 border-green-500 pl-4">
          <p className="font-regular text-3xl">Regular (400)</p>
          <p className="text-gray-500">Font-weight: 400 - Idéal pour le corps de texte</p>
        </div>

        <div className="border-l-4 border-yellow-500 pl-4">
          <p className="font-medium text-3xl">Medium (500)</p>
          <p className="text-gray-500">Font-weight: 500 - Pour les sous-titres et l'emphase légère</p>
        </div>

        <div className="border-l-4 border-red-500 pl-4">
          <p className="font-bold text-3xl">Bold (700)</p>
          <p className="text-gray-500">Font-weight: 700 - Pour les titres et l'emphase forte</p>
        </div>

        <div className="border-l-4 border-purple-500 pl-4">
          <p className="italic text-3xl">Italic</p>
          <p className="text-gray-500">Style italique - Pour les citations et l'emphase</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-3">Tailles de police (Figma tokens)</h3>

        <div className="space-y-2">
          <p className="text-xs">text-xs - Très petit texte (0.6875rem)</p>
          <p className="text-sm">text-sm - Petit texte (0.813rem)</p>
          <p className="text-base">text-base - Texte normal (1rem)</p>
          <p className="text-lg">text-lg - Grand texte (1.125rem)</p>
          <p className="text-xl">text-xl - Très grand texte (1.25rem)</p>
          <p className="text-2xl">text-2xl - Titre niveau 2 (1.5rem)</p>
          <p className="text-3xl">text-3xl - Titre niveau 1 (1.875rem)</p>
          <p className="text-4xl">text-4xl - Très grand titre (2.25rem)</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-3">Exemple de hiérarchie typographique</h3>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h1 className="text-4xl font-bold mb-2">Titre Principal</h1>
          <h2 className="text-2xl font-medium mb-4 text-gray-700">Sous-titre descriptif</h2>
          <p className="text-base mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris.
          </p>
          <p className="text-sm text-gray-600 italic">
            Note: Cette hiérarchie utilise la police Avenir Next avec différents poids et tailles.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-3">Exemples d'utilisation</h3>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Configuration dans votre app</h4>
            <pre className="text-sm overflow-x-auto"><code>{`import { GSComponentsRoot } from '@gs/gs-components-library';

function App() {
  return (
    <GSComponentsRoot styleConfig={{
      applyGlobalStyles: true,
      loadFonts: true,
      customFontFamily: '"AvenirNextLTPro", sans-serif'
    }}>
      {/* Votre application avec Avenir Next */}
    </GSComponentsRoot>
  );
}`}</code></pre>
          </div>

          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Classes CSS personnalisées</h4>
            <pre className="text-sm overflow-x-auto"><code>{`/* Dans votre CSS global */
.font-avenir {
  font-family: "AvenirNextLTPro", sans-serif;
}

.font-ultralight { font-weight: 200; }
.font-regular { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-bold { font-weight: 700; }

/* Utilisation avec Tailwind */
@layer utilities {
  .font-gs-base {
    font-family: "AvenirNextLTPro", system-ui, sans-serif;
  }
}`}</code></pre>
          </div>

          <div className="bg-purple-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Import direct des fonts</h4>
            <pre className="text-sm overflow-x-auto"><code>{`// Dans votre fichier principal (index.tsx ou App.tsx)
import '@gs/gs-components-library/dist/styles/fonts.css';

// Les fonts sont maintenant disponibles globalement
<h1 className="font-sans">
  Utilise Avenir Next automatiquement
</h1>`}</code></pre>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold mb-3">Test de rendu des caractères spéciaux</h3>

        <div className="space-y-2">
          <p>Français: àâäéèêëïîôùûü çœæ ÀÂÄÉÈÊËÏÎÔÙÛÜ ÇŒÆ</p>
          <p>Espagnol: áéíóúñü ¿¡ ÁÉÍÓÚÑÜ</p>
          <p>Italien: àèéìòù ÀÈÉÌÒÙ</p>
          <p>Symboles: € $ £ ¥ @ # & % © ® ™ ° × ÷ ± ≈ ≠ ∞</p>
          <p>Chiffres: 0123456789</p>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: 'Design System/Typography',
  component: Typography,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Police Avenir Next LT Pro

La police **Avenir Next LT Pro** est la police principale du design system GS Components.
Elle est automatiquement appliquée à tous les composants dans Storybook.

### Configuration

La police est configurée dans plusieurs endroits :

1. **\`.storybook/preview.tsx\`** - Via le StyleProvider
2. **\`.storybook/preview-head.html\`** - Styles CSS globaux
3. **\`src/styles/fonts.css\`** - Déclarations @font-face

### Utilisation dans votre application

\`\`\`tsx
import { GSComponentsRoot } from '@gs/gs-components-library';

function App() {
  return (
    <GSComponentsRoot styleConfig={{
      applyGlobalStyles: true,
      loadFonts: true
    }}>
      {/* Votre app avec Avenir Next */}
    </GSComponentsRoot>
  );
}
\`\`\`

### Formats disponibles

- **WOFF** - Format web optimisé
- **TTF** - Format TrueType pour compatibilité maximale
        `
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Aperçu Typographique',
};

export const Weights: Story = {
  name: 'Poids de Police',
  render: () => (
    <div className="p-8 space-y-4">
      <p className="font-ultralight text-3xl">Ultra Light - 200</p>
      <p className="font-regular text-3xl">Regular - 400</p>
      <p className="font-medium text-3xl">Medium - 500</p>
      <p className="font-bold text-3xl">Bold - 700</p>
    </div>
  ),
};

export const Sizes: Story = {
  name: 'Tailles de Police',
  render: () => (
    <div className="p-8 space-y-2">
      <p className="text-xs">Très petit (text-xs)</p>
      <p className="text-sm">Petit (text-sm)</p>
      <p className="text-base">Normal (text-base)</p>
      <p className="text-lg">Grand (text-lg)</p>
      <p className="text-xl">Très grand (text-xl)</p>
      <p className="text-2xl">Titre 2 (text-2xl)</p>
      <p className="text-3xl">Titre 1 (text-3xl)</p>
      <p className="text-4xl">Très grand titre (text-4xl)</p>
    </div>
  ),
};

export const AlignmentTest: Story = {
  name: 'Test d\'alignement avec Badge et Button',
  render: () => (
    <Layout bg="white" padding={6}>
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Texte inline avec Badge et Button</h3>
          <p className="text-sm text-grey-stronger mb-4">
            Vérifiez l'alignement vertical du texte avec les badges et boutons sur la même ligne.
          </p>
        </div>

        {/* Texte base avec badge et bouton */}
        <div className="space-y-4">
          <div className="border border-grey-light rounded p-4 bg-grey-lighter">
            <h4 className="text-sm font-medium mb-2">Taille base (text-base)</h4>
            <p className="text-base">
              Texte normal <Badge>Badge</Badge> suite du texte <Button size="small">Button</Button> fin du texte.
            </p>
          </div>

          <div className="border border-grey-light rounded p-4 bg-grey-lighter">
            <h4 className="text-sm font-medium mb-2">Taille base avec espacement</h4>
            <p className="text-base">
              Texte normal <Badge>Badge</Badge> suite du texte <Button size="small">Button</Button> fin du texte.
            </p>
          </div>

          {/* Texte small avec badge et bouton */}
          <div className="border border-grey-light rounded p-4 bg-grey-lighter">
            <h4 className="text-sm font-medium mb-2">Taille small (text-sm)</h4>
            <p className="text-sm">
              Texte petit <Badge>Badge</Badge> suite du texte <Button size="small">Button</Button> fin du texte.
            </p>
          </div>

          {/* Texte xs avec badge et bouton */}
          <div className="border border-grey-light rounded p-4 bg-grey-lighter">
            <h4 className="text-sm font-medium mb-2">Taille xs (text-xs)</h4>
            <p className="text-xs">
              Texte très petit <Badge>Badge</Badge> suite du texte <Button size="small">Button</Button> fin du texte.
            </p>
          </div>

          {/* Texte lg avec badge et bouton */}
          <div className="border border-grey-light rounded p-4 bg-grey-lighter">
            <h4 className="text-sm font-medium mb-2">Taille large (text-lg)</h4>
            <p className="text-lg">
              Texte grand <Badge>Badge</Badge> suite du texte <Button size="medium">Button</Button> fin du texte.
            </p>
          </div>

          {/* Test avec différentes variantes de badge */}
          <div className="border border-grey-light rounded p-4 bg-grey-lighter">
            <h4 className="text-sm font-medium mb-2">Variantes de Badge</h4>
            <p className="text-base">
              Texte normal <Badge variant="default">Default</Badge> <Badge variant="secondary">Secondary</Badge> <Badge variant="outline">Outline</Badge> suite du texte.
            </p>
          </div>

          {/* Test avec différentes tailles de bouton */}
          <div className="border border-grey-light rounded p-4 bg-grey-lighter">
            <h4 className="text-sm font-medium mb-2">Différentes tailles de Button</h4>
            <p className="text-base">
              Texte normal <Button size="small">Small</Button> <Button size="medium">Medium</Button> <Button size="large">Large</Button> suite du texte.
            </p>
          </div>

          {/* Test avec bouton outline */}
          <div className="border border-grey-light rounded p-4 bg-grey-lighter">
            <h4 className="text-sm font-medium mb-2">Bouton outline</h4>
            <p className="text-base">
              Texte normal <Badge>Badge</Badge> suite du texte <Button size="small" variant="outline">Outline</Button> fin du texte.
            </p>
          </div>
        </div>

        {/* Guide visuel avec lignes de référence */}
        <div className="mt-8 p-4 bg-blue-primary rounded">
          <p className="text-xs font-medium mb-2 text-black">💡 Guide d'évaluation :</p>
          <ul className="text-xs space-y-1 list-disc list-inside text-black">
            <li>Le texte dans le Badge et le Button doit être aligné sur la même baseline que le texte adjacent</li>
            <li>Le texte ne doit pas sembler trop haut ou trop bas dans les composants</li>
            <li>Les différents tailles de texte doivent maintenir un alignement cohérent</li>
          </ul>
        </div>
      </div>
    </Layout>
  ),
};