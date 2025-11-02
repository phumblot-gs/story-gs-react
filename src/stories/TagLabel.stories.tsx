import type { Meta, StoryObj } from "@storybook/react";
import { TagLabel } from "@/components/ui/tag-label";
import { Layout, VStack, HStack } from "@/components/layout";

const meta = {
  title: "UI/TagLabel",
  component: TagLabel,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `TagLabel component built with the Figma design system. The TagLabel automatically inherits color context via \`data-bg\` from the parent Layout.

## Features
- Automatic context-aware styling based on parent background (white, grey, black)
- Built-in TagCross (X icon) for tag removal
- Color variants: blue, green, orange, pink, purple, red, white
- Default displays Flag icon without specific color
- Hover and pressed states with CSS transitions
- Disabled state support
- Debug mode for development

## Basic Usage

\`\`\`tsx
import { TagLabel, Layout } from '@story-gs-react';

<Layout bg="white">
  <TagLabel color="blue" onRemove={() => console.log('removed')} />
</Layout>
\`\`\`

## With Color Variants

The \`color\` prop accepts: \`blue\`, \`green\`, \`orange\`, \`pink\`, \`purple\`, \`red\`, \`white\`. If not specified, displays Flag icon without specific color.

\`\`\`tsx
<TagLabel color="blue" />
<TagLabel color="green" />
<TagLabel /> {/* Default: Flag icon without color */}
\`\`\`

## With onRemove Handler

The \`onRemove\` callback is called when the user clicks on the TagCross (X icon) to remove the tag.

\`\`\`tsx
const handleRemove = (e) => {
  console.log('Tag removed', e);
};

<TagLabel color="blue" onRemove={handleRemove} />
\`\`\`

## Disabled State

When \`disabled\` is true, the TagLabel and TagCross become non-interactive and visually disabled.

\`\`\`tsx
<TagLabel color="blue" disabled />
\`\`\`

## Context-Aware Styling

The TagLabel component adapts its appearance based on the parent Layout's \`bg\` prop:

- **White background**: Light grey tag with dark text
- **Grey background**: White tag with dark text
- **Black background**: Dark grey tag with white text (labels are white)

\`\`\`tsx
<Layout bg="white">
  <TagLabel color="blue">Tag on white</TagLabel>
</Layout>

<Layout bg="grey">
  <TagLabel color="blue">Tag on grey</TagLabel>
</Layout>

<Layout bg="black">
  <TagLabel color="blue">Tag on black</TagLabel>
</Layout>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['blue', 'green', 'orange', 'pink', 'purple', 'red', 'white', undefined],
      description: 'Color of the label (blue, green, orange, pink, purple, red, white). If undefined, displays Flag icon without specific color',
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
} satisfies Meta<typeof TagLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: undefined,
  },
  render: (args) => (
    <Layout bg="white" padding={6}>
      <TagLabel {...args} />
    </Layout>
  ),
};

export const AllColors: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <div>
          <h4 className="text-sm font-medium mb-2">Toutes les couleurs disponibles</h4>
          <HStack gap={3} flexWrap="wrap">
            <TagLabel />
            <TagLabel color="blue" />
            <TagLabel color="green" />
            <TagLabel color="orange" />
            <TagLabel color="pink" />
            <TagLabel color="purple" />
            <TagLabel color="red" />
            <TagLabel color="white" />
          </HStack>
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
          <TagLabel />
          <TagLabel color="blue" />
          <TagLabel color="green" />
          <TagLabel color="orange" />
          <TagLabel color="pink" />
          <TagLabel color="purple" />
          <TagLabel color="red" />
          <TagLabel color="white" />
        </HStack>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background Grey</h3>
        <HStack gap={3} flexWrap="wrap">
          <TagLabel />
          <TagLabel color="blue" />
          <TagLabel color="green" />
          <TagLabel color="orange" />
          <TagLabel color="pink" />
          <TagLabel color="purple" />
          <TagLabel color="red" />
          <TagLabel color="white" />
        </HStack>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3 text-white">Background Black</h3>
        <HStack gap={3} flexWrap="wrap">
          <TagLabel />
          <TagLabel color="blue" />
          <TagLabel color="green" />
          <TagLabel color="orange" />
          <TagLabel color="pink" />
          <TagLabel color="purple" />
          <TagLabel color="red" />
          <TagLabel color="white" />
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
            <TagLabel color="blue" onRemove={() => alert('Tag supprimé!')} />
            <TagLabel color="green" onRemove={() => console.log('Tag removed from console')} />
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
            <TagLabel color="blue">Default</TagLabel>
            <TagLabel color="blue" disabled>Disabled</TagLabel>
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
            <TagLabel color="blue" debug>Normal</TagLabel>
            <TagLabel color="green" debug disabled>Disabled</TagLabel>
            <TagLabel color="red" debug onRemove={() => console.log('removed')}>
              With onRemove
            </TagLabel>
          </HStack>

          <div className="p-4 bg-grey-lighter rounded">
            <p className="text-xs font-medium mb-2">Caractéristiques du mode debug :</p>
            <ul className="text-xs space-y-1 list-disc list-inside text-grey-stronger">
              <li>Bordure rose (ring-2 ring-pink) autour du tag</li>
              <li>Label au-dessus affichant le contexte bg et la couleur</li>
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
            <TagLabel color="blue" />
            <TagLabel color="green" />
          </HStack>

          {/* Niveau 2: Grey - écrase white */}
          <Layout bg="grey" padding={4} className="border-2 border-green">
            <VStack gap={3}>
              <p className="text-sm font-medium">Layout bg="grey" (niveau 2 - écrase white)</p>
              <HStack gap={2} flexWrap="wrap">
                <TagLabel color="blue" />
                <TagLabel color="green" />
              </HStack>

              {/* Niveau 3: Black - écrase grey */}
              <Layout bg="black" padding={4} className="border-2 border-yellow">
                <VStack gap={3}>
                  <p className="text-sm font-medium text-white">Layout bg="black" (niveau 3 - écrase grey)</p>
                  <HStack gap={2} flexWrap="wrap">
                    <TagLabel color="blue" />
                    <TagLabel color="green" />
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

