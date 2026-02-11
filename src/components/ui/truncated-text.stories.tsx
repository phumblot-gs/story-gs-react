import type { Meta, StoryObj } from "@storybook/react-vite";
import { TruncatedText } from "./truncated-text";
import { Layout, HStack, VStack } from "@/components/layout";

const meta = {
  title: "UI/TruncatedText",
  component: TruncatedText,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Composant pour afficher du texte tronqué avec un tooltip automatique.

### Fonctionnement

Le composant détecte automatiquement si le texte est tronqué (dépasse le conteneur).
Si le texte est tronqué, un tooltip affiche le texte complet au survol.

### Utilisation simple

\`\`\`tsx
import { TruncatedText } from '@story-gs-react';

<div style={{ width: 100 }}>
  <TruncatedText text="Ceci est un texte très long qui sera tronqué" />
</div>
\`\`\`

### Avec position du tooltip

\`\`\`tsx
<TruncatedText
  text="Texte tronqué"
  tooltipSide="bottom"
/>
\`\`\`

### Comme élément différent

\`\`\`tsx
<TruncatedText
  text="Titre tronqué"
  as="h2"
/>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Le texte à afficher',
    },
    className: {
      control: 'text',
      description: 'Classes CSS Tailwind additionnelles',
    },
    as: {
      control: 'select',
      options: ['span', 'p', 'div', 'h1', 'h2', 'h3', 'h4', 'label'],
      description: 'Élément HTML à utiliser',
    },
    tooltipSide: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Position du tooltip',
    },
    tooltipMaxWidth: {
      control: 'text',
      description: 'Largeur maximale du tooltip (classe Tailwind)',
    },
    tooltipClassName: {
      control: 'text',
      description: 'Classes CSS additionnelles pour le tooltip',
    },
  },
} satisfies Meta<typeof TruncatedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Ceci est un texte très long qui sera tronqué automatiquement quand il dépasse la largeur du conteneur',
  },
  render: (args) => (
    <Layout bg="white" padding={6}>
      <div style={{ width: 200 }}>
        <TruncatedText {...args} />
      </div>
    </Layout>
  ),
};

export const NotTruncated: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <h3 className="gs-typo-h3">Texte non tronqué</h3>
        <p className="text-sm text-grey-stronger">
          Si le texte tient dans le conteneur, aucun tooltip n'est affiché.
        </p>
        <div style={{ width: 300 }} className="border border-grey-light p-2 rounded">
          <TruncatedText text="Texte court" />
        </div>
      </VStack>
    </Layout>
  ),
};

export const Truncated: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <h3 className="gs-typo-h3">Texte tronqué avec tooltip</h3>
        <p className="text-sm text-grey-stronger">
          Survolez le texte pour voir le tooltip avec le contenu complet.
        </p>
        <div style={{ width: 150 }} className="border border-grey-light p-2 rounded">
          <TruncatedText text="Ceci est un texte très très long qui sera forcément tronqué" />
        </div>
      </VStack>
    </Layout>
  ),
};

export const TooltipPositions: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3">Positions du tooltip</h3>
          <p className="text-sm text-grey-stronger mt-1">
            Le tooltip peut être positionné en haut, à droite, en bas ou à gauche.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium mb-2">Top (défaut)</p>
            <div style={{ width: 120 }} className="border border-grey-light p-2 rounded">
              <TruncatedText
                text="Tooltip en haut - survolez pour voir"
                tooltipSide="top"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium mb-2">Bottom</p>
            <div style={{ width: 120 }} className="border border-grey-light p-2 rounded">
              <TruncatedText
                text="Tooltip en bas - survolez pour voir"
                tooltipSide="bottom"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium mb-2">Left</p>
            <div style={{ width: 120 }} className="border border-grey-light p-2 rounded">
              <TruncatedText
                text="Tooltip à gauche - survolez pour voir"
                tooltipSide="left"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium mb-2">Right</p>
            <div style={{ width: 120 }} className="border border-grey-light p-2 rounded">
              <TruncatedText
                text="Tooltip à droite - survolez pour voir"
                tooltipSide="right"
              />
            </div>
          </div>
        </div>
      </VStack>
    </Layout>
  ),
};

export const DifferentElements: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3">Différents éléments HTML</h3>
          <p className="text-sm text-grey-stronger mt-1">
            Le composant peut rendre différents éléments HTML via la prop "as".
          </p>
        </div>

        <VStack gap={4}>
          <div style={{ width: 200 }}>
            <p className="text-xs font-medium mb-1">as="span" (défaut)</p>
            <div className="border border-grey-light p-2 rounded">
              <TruncatedText
                text="Texte dans un span par défaut qui sera tronqué"
                as="span"
              />
            </div>
          </div>

          <div style={{ width: 200 }}>
            <p className="text-xs font-medium mb-1">as="p"</p>
            <div className="border border-grey-light p-2 rounded">
              <TruncatedText
                text="Texte dans un paragraphe qui sera tronqué"
                as="p"
              />
            </div>
          </div>

          <div style={{ width: 200 }}>
            <p className="text-xs font-medium mb-1">as="h4"</p>
            <div className="border border-grey-light p-2 rounded">
              <TruncatedText
                text="Titre H4 qui sera tronqué car très long"
                as="h4"
                className="font-bold"
              />
            </div>
          </div>

          <div style={{ width: 200 }}>
            <p className="text-xs font-medium mb-1">as="label"</p>
            <div className="border border-grey-light p-2 rounded">
              <TruncatedText
                text="Label de formulaire qui sera tronqué automatiquement"
                as="label"
                className="text-sm"
              />
            </div>
          </div>
        </VStack>
      </VStack>
    </Layout>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3">Styles personnalisés</h3>
          <p className="text-sm text-grey-stronger mt-1">
            Le texte et le tooltip peuvent être stylés avec des classes Tailwind.
          </p>
        </div>

        <VStack gap={4}>
          <div style={{ width: 180 }}>
            <p className="text-xs font-medium mb-1">Texte coloré</p>
            <div className="border border-grey-light p-2 rounded">
              <TruncatedText
                text="Texte bleu qui sera tronqué automatiquement"
                className="text-blue-primary font-medium"
              />
            </div>
          </div>

          <div style={{ width: 180 }}>
            <p className="text-xs font-medium mb-1">Tooltip large</p>
            <div className="border border-grey-light p-2 rounded">
              <TruncatedText
                text="Ce texte a un tooltip plus large pour afficher plus de contenu"
                tooltipMaxWidth="max-w-[300px]"
              />
            </div>
          </div>

          <div style={{ width: 180 }}>
            <p className="text-xs font-medium mb-1">Fond sélectionné</p>
            <div className="bg-blue-primary p-2 rounded">
              <TruncatedText
                text="Texte blanc sur fond bleu sélectionné"
                className="text-white"
              />
            </div>
          </div>
        </VStack>
      </VStack>
    </Layout>
  ),
};

export const InFileList: Story = {
  render: () => {
    const files = [
      "document.pdf",
      "photo_vacances_ete_2024_plage.jpg",
      "rapport_annuel_entreprise_2024.docx",
      "notes.txt",
      "presentation_projet_client_final_v2.pptx",
    ];

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <div>
            <h3 className="gs-typo-h3">Exemple : Liste de fichiers</h3>
            <p className="text-sm text-grey-stronger mt-1">
              Cas d'usage typique dans une liste de fichiers avec noms longs.
            </p>
          </div>

          <div className="border border-grey-light rounded overflow-hidden" style={{ width: 250 }}>
            {files.map((filename, index) => (
              <div
                key={filename}
                className={`p-2 flex items-center gap-2 ${index !== files.length - 1 ? 'border-b border-grey-light' : ''}`}
              >
                <span className="text-grey-stronger">📄</span>
                <TruncatedText
                  text={filename}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </VStack>
      </Layout>
    );
  },
};

export const ResponsiveBehavior: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <div>
          <h3 className="gs-typo-h3">Comportement responsive</h3>
          <p className="text-sm text-grey-stronger mt-1">
            Le composant détecte automatiquement les changements de taille du conteneur.
            Redimensionnez la fenêtre pour voir le comportement.
          </p>
        </div>

        <div className="w-full border border-grey-light p-4 rounded">
          <TruncatedText
            text="Ce texte s'adapte à la largeur du conteneur. Réduisez la fenêtre pour voir le tooltip apparaître automatiquement quand le texte est tronqué."
            className="text-sm"
          />
        </div>
      </VStack>
    </Layout>
  ),
};
