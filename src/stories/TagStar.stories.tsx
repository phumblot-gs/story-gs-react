import type { Meta, StoryObj } from "@storybook/react-vite";
import { TagStar } from "@/components/ui/tag-star";
import { Layout, VStack, HStack } from "@/components/layout";

const meta = {
  title: "UI/TagStar",
  component: TagStar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `TagStar component built with the Figma design system. The TagStar automatically inherits color context via \`data-bg\` from the parent Layout.

## Features
- Automatic context-aware styling based on parent background (white, grey, black)
- Built-in TagCross (X icon) for tag removal
- Star rating display (0 to 5 stars)
- Hover and pressed states with CSS transitions
- Disabled state support
- Debug mode for development

## Basic Usage

\`\`\`tsx
import { TagStar, Layout } from '@story-gs-react';

<Layout bg="white">
  <TagStar value={4} onRemove={() => console.log('removed')} />
</Layout>
\`\`\`

## Star Display

- **value = 0**: Displays one outline star (Star icon)
- **value > 0**: Displays \`value\` filled stars (StarFilled icon)

\`\`\`tsx
<TagStar value={0} />  // 1 outline star
<TagStar value={3} />  // 3 filled stars
<TagStar value={5} />  // 5 filled stars
\`\`\`

## With onRemove Handler

The \`onRemove\` callback is called when the user clicks on the TagCross (X icon) to remove the tag.

\`\`\`tsx
const handleRemove = (e) => {
  console.log('Tag removed', e);
};

<TagStar value={4} onRemove={handleRemove} />
\`\`\`

## Disabled State

When \`disabled\` is true, the TagStar and TagCross become non-interactive and visually disabled.

\`\`\`tsx
<TagStar value={3} disabled />
\`\`\`

## Context-Aware Styling

The TagStar component adapts its appearance based on the parent Layout's \`bg\` prop:

- **White background**: Light grey tag with yellow stars
- **Grey background**: White tag with yellow stars
- **Black background**: Dark grey tag with yellow stars

\`\`\`tsx
<Layout bg="white">
  <TagStar value={4} />
</Layout>

<Layout bg="grey">
  <TagStar value={4} />
</Layout>

<Layout bg="black">
  <TagStar value={4} />
</Layout>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 5, step: 1 },
      description: 'Number of stars to display (0 to 5)',
    },
    onRemove: {
      action: 'removed',
      description: 'Callback function called when the TagCross (X icon) is clicked',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the tag and makes it non-interactive',
    },
    debug: {
      control: 'boolean',
      description: 'Debug mode: displays a label and logs props to the console',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes',
    },
  },
} satisfies Meta<typeof TagStar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 5,
  },
  render: (args) => (
    <Layout bg="white" padding={6}>
      <TagStar {...args} />
    </Layout>
  ),
};

export const AllValues: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <div>
          <h4 className="text-sm font-medium mb-2">Toutes les valeurs (0 à 5)</h4>
          <HStack gap={3} flexWrap="wrap">
            <TagStar value={0} />
            <TagStar value={1} />
            <TagStar value={2} />
            <TagStar value={3} />
            <TagStar value={4} />
            <TagStar value={5} />
          </HStack>
        </div>
        <div className="p-4 bg-grey-lighter rounded">
          <p className="text-xs text-grey-stronger mb-2">
            💡 <strong>value=0</strong> affiche une étoile outline (Star), <strong>value &gt; 0</strong> affiche <strong>value</strong> étoiles pleines (StarFilled).
          </p>
        </div>
      </VStack>
    </Layout>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <VStack gap={6} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background White</h3>
        <HStack gap={3} flexWrap="wrap">
          <TagStar value={0} />
          <TagStar value={1} />
          <TagStar value={2} />
          <TagStar value={3} />
          <TagStar value={4} />
          <TagStar value={5} />
        </HStack>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background Grey</h3>
        <HStack gap={3} flexWrap="wrap">
          <TagStar value={0} />
          <TagStar value={1} />
          <TagStar value={2} />
          <TagStar value={3} />
          <TagStar value={4} />
          <TagStar value={5} />
        </HStack>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3 text-white">Background Black</h3>
        <HStack gap={3} flexWrap="wrap">
          <TagStar value={0} />
          <TagStar value={1} />
          <TagStar value={2} />
          <TagStar value={3} />
          <TagStar value={4} />
          <TagStar value={5} />
        </HStack>
      </VStack>
    </VStack>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const WithOnRemove: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <div>
          <h4 className="text-sm font-medium mb-2">Tags avec callback onRemove</h4>
          <p className="text-xs text-grey-stronger mb-3">
            Cliquez sur le X pour supprimer le tag. Vérifiez la console pour voir les logs.
          </p>
          <HStack gap={3} flexWrap="wrap">
            <TagStar value={5} onRemove={() => alert('Tag supprimé!')} />
            <TagStar value={4} onRemove={() => console.log('Tag removed from console')} />
            <TagStar value={3} onRemove={() => console.log('3 stars removed')} />
          </HStack>
        </div>
      </VStack>
    </Layout>
  ),
};

export const States: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <div>
          <h4 className="text-sm font-medium mb-2">États du composant</h4>
          <HStack gap={3} flexWrap="wrap">
            <TagStar value={5} />
            <TagStar value={4} disabled />
          </HStack>
        </div>
        <div className="p-4 bg-grey-lighter rounded">
          <p className="text-xs text-grey-stronger mb-2">
            💡 Survolez les tags pour voir l'état hover, et cliquez pour voir l'état pressed.
          </p>
        </div>
      </VStack>
    </Layout>
  ),
};

export const DebugMode: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3 mb-3">Mode Debug</h3>
          <p className="text-sm text-grey-stronger mb-4">
            La prop <code>debug</code> affiche un label au-dessus du tag et log les props dans la console.
          </p>
        </div>

        <VStack gap={4}>
          <HStack gap={3} flexWrap="wrap">
            <TagStar value={5} debug />
            <TagStar value={4} debug disabled />
            <TagStar value={3} debug onRemove={() => console.log('removed')} />
            <TagStar value={0} debug />
          </HStack>

          <div className="p-4 bg-grey-lighter rounded">
            <p className="text-xs font-medium mb-2">Caractéristiques du mode debug :</p>
            <ul className="text-xs space-y-1 list-disc list-inside text-grey-stronger">
              <li>Bordure rose (ring-2 ring-pink) autour du tag</li>
              <li>Label au-dessus affichant le contexte bg et la valeur</li>
              <li>Log dans la console avec toutes les props</li>
              <li>onRemove fonctionne normalement</li>
            </ul>
          </div>
        </VStack>
      </VStack>
    </Layout>
  ),
};

export const NestedLayouts: Story = {
  render: () => (
    <VStack gap={4} padding={6}>
      <h2 className="gs-typo-h2">Layouts imbriqués - Chaque niveau écrase le contexte parent</h2>

      {/* Niveau 1: White */}
      <Layout bg="white" padding={4} className="border-2 border-blue">
        <VStack gap={3}>
          <p className="text-sm font-medium">Layout bg="white" (niveau 1)</p>
          <HStack gap={2} flexWrap="wrap">
            <TagStar value={5} />
            <TagStar value={3} />
          </HStack>

          {/* Niveau 2: Grey - écrase white */}
          <Layout bg="grey" padding={4} className="border-2 border-green">
            <VStack gap={3}>
              <p className="text-sm font-medium">Layout bg="grey" (niveau 2 - écrase white)</p>
              <HStack gap={2} flexWrap="wrap">
                <TagStar value={5} />
                <TagStar value={3} />
              </HStack>

              {/* Niveau 3: Black - écrase grey */}
              <Layout bg="black" padding={4} className="border-2 border-yellow">
                <VStack gap={3}>
                  <p className="text-sm font-medium text-white">Layout bg="black" (niveau 3 - écrase grey)</p>
                  <HStack gap={2} flexWrap="wrap">
                    <TagStar value={5} />
                    <TagStar value={3} />
                  </HStack>
                </VStack>
              </Layout>

              <p className="text-sm text-grey-stronger">↑ Tags ci-dessus utilisent styles BLACK (contexte le plus proche)</p>
            </VStack>
          </Layout>

          <p className="text-sm text-grey-stronger">↑ Zone grise utilise styles GREY</p>
        </VStack>
      </Layout>

      <div className="p-4 bg-blue-primary rounded">
        <p className="text-sm font-medium">💡 Règle importante :</p>
        <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
          <li>Chaque Layout avec <code>bg</code> crée un nouveau BgProvider React</li>
          <li>Le contexte enfant <strong>écrase</strong> toujours le contexte parent</li>
          <li>CSS utilise <code>[data-bg="..."]</code> de l'ancêtre le plus proche</li>
          <li>Aucun héritage en cascade - chaque niveau est isolé</li>
        </ul>
      </div>
    </VStack>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

