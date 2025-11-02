import type { Meta, StoryObj } from "@storybook/react";
import { TagText } from "@/components/ui/tag-text";
import { Layout, VStack, HStack } from "@/components/layout";

const meta = {
  title: "UI/TagText",
  component: TagText,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `TagText component built with the Figma design system. The TagText automatically inherits color context via \`data-bg\` from the parent Layout.

## Features
- Automatic context-aware styling based on parent background (white, grey, black)
- Built-in TagCross (X icon) for tag removal
- Hover and pressed states with CSS transitions
- Disabled state support
- Debug mode for development
- Maximum width of 100px with text ellipsis

## Basic Usage

\`\`\`tsx
import { TagText, Layout } from '@story-gs-react';

<Layout bg="white">
  <TagText onRemove={() => console.log('removed')}>
    Mon tag
  </TagText>
</Layout>
\`\`\`

## With onRemove Handler

The \`onRemove\` callback is called when the user clicks on the TagCross (X icon) to remove the tag.

\`\`\`tsx
const handleRemove = (e) => {
  console.log('Tag removed', e);
};

<TagText onRemove={handleRemove}>
  Tag à supprimer
</TagText>
\`\`\`

## Disabled State

When \`disabled\` is true, the TagText and TagCross become non-interactive and visually disabled.

\`\`\`tsx
<TagText disabled>
  Tag désactivé
</TagText>
\`\`\`

## Context-Aware Styling

The TagText component adapts its appearance based on the parent Layout's \`bg\` prop:

- **White background**: Light grey tag with dark text
- **Grey background**: White tag with dark text
- **Black background**: Dark grey tag with white text

\`\`\`tsx
<Layout bg="white">
  <TagText>Tag on white</TagText>
</Layout>

<Layout bg="grey">
  <TagText>Tag on grey</TagText>
</Layout>

<Layout bg="black">
  <TagText>Tag on black</TagText>
</Layout>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Text content of the tag',
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
} satisfies Meta<typeof TagText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'ipsum',
  },
  render: (args) => (
    <Layout bg="white" padding={6}>
      <TagText {...args} />
    </Layout>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <VStack gap={6} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background White</h3>
        <HStack gap={3} flexWrap="wrap">
          <TagText>Tag 1</TagText>
          <TagText>Tag 2</TagText>
          <TagText>Tag très long qui dépasse</TagText>
        </HStack>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background Grey</h3>
        <HStack gap={3} flexWrap="wrap">
          <TagText>Tag 1</TagText>
          <TagText>Tag 2</TagText>
          <TagText>Tag très long qui dépasse</TagText>
        </HStack>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3 text-white">Background Black</h3>
        <HStack gap={3} flexWrap="wrap">
          <TagText>Tag 1</TagText>
          <TagText>Tag 2</TagText>
          <TagText>Tag très long qui dépasse</TagText>
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
            <TagText onRemove={() => alert('Tag supprimé!')}>
              Cliquable
            </TagText>
            <TagText onRemove={() => console.log('Tag removed from console')}>
              Log console
            </TagText>
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
            <TagText>Default</TagText>
            <TagText disabled>Disabled</TagText>
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

export const LongText: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <div>
          <h4 className="text-sm font-medium mb-2">Tags avec texte long</h4>
          <p className="text-xs text-grey-stronger mb-3">
            Les tags ont une largeur maximale de 100px avec text-ellipsis pour les textes trop longs.
          </p>
          <HStack gap={3} flexWrap="wrap">
            <TagText>Court</TagText>
            <TagText>Texte moyen</TagText>
            <TagText>Texte très très long qui dépasse la largeur maximale</TagText>
          </HStack>
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
            <TagText debug>Normal</TagText>
            <TagText debug disabled>Disabled</TagText>
            <TagText debug onRemove={() => console.log('removed')}>
              With onRemove
            </TagText>
          </HStack>

          <div className="p-4 bg-grey-lighter rounded">
            <p className="text-xs font-medium mb-2">Caractéristiques du mode debug :</p>
            <ul className="text-xs space-y-1 list-disc list-inside text-grey-stronger">
              <li>Bordure rose (ring-2 ring-pink) autour du tag</li>
              <li>Label au-dessus affichant le contexte bg</li>
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
            <TagText>Tag 1</TagText>
            <TagText>Tag 2</TagText>
          </HStack>

          {/* Niveau 2: Grey - écrase white */}
          <Layout bg="grey" padding={4} className="border-2 border-green">
            <VStack gap={3}>
              <p className="text-sm font-medium">Layout bg="grey" (niveau 2 - écrase white)</p>
              <HStack gap={2} flexWrap="wrap">
                <TagText>Tag 1</TagText>
                <TagText>Tag 2</TagText>
              </HStack>

              {/* Niveau 3: Black - écrase grey */}
              <Layout bg="black" padding={4} className="border-2 border-yellow">
                <VStack gap={3}>
                  <p className="text-sm font-medium text-white">Layout bg="black" (niveau 3 - écrase grey)</p>
                  <HStack gap={2} flexWrap="wrap">
                    <TagText>Tag 1</TagText>
                    <TagText>Tag 2</TagText>
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

