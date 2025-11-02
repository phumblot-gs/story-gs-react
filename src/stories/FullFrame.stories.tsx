import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FullFrame } from "@/components/layout/FullFrame";
import { Button } from "@/components/ui/button";
import { VStack, HStack } from "@/components/layout";

const meta = {
  title: "Layout/FullFrame",
  component: FullFrame,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `FullFrame component built with the Figma design system. The FullFrame displays a full-screen popup overlay with a fixed header and scrollable body.

## Features
- Full-screen overlay popup (fixed positioning, z-index 50)
- Fixed header with customizable background (white, grey, black)
- Customizable body background (white, grey, black)
- Built-in close button (X icon) in the header
- Custom header content support (add titles, buttons, etc.)
- Scrollable body using VStack
- Automatic context-aware styling via \`data-bg\` mechanism
- VStack props customization for body layout

## Basic Usage

\`\`\`tsx
import { FullFrame, Button } from '@story-gs-react';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Ouvrir FullFrame
      </Button>

      {isOpen && (
        <FullFrame onClose={() => setIsOpen(false)}>
          <div className="p-6">
            <h2>Titre du contenu</h2>
            <p>Contenu du body</p>
          </div>
        </FullFrame>
      )}
    </>
  );
}
\`\`\`

## Header and Body Backgrounds

You can customize the background colors of the header and body independently:

\`\`\`tsx
<FullFrame
  headerBg="white"
  bodyBg="grey"
  onClose={() => setIsOpen(false)}
>
  <div className="p-6">
    <h2>Header blanc, body gris</h2>
  </div>
</FullFrame>
\`\`\`

**Available background values:**
- \`white\`: White background (#ffffff)
- \`grey\`: Grey background (#eaeaea)
- \`black\`: Black background (#292828)

## Custom Header Content

The \`headerContent\` prop allows you to add custom components to the header (titles, buttons, etc.). The close button (X) will automatically be positioned on the right side.

\`\`\`tsx
<FullFrame
  headerContent={
    <HStack gap={4} align="center">
      <h2 className="gs-typo-h2">Titre du header</h2>
      <Button variant="secondary" onClick={handleAction}>
        Action
      </Button>
    </HStack>
  }
  onClose={() => setIsOpen(false)}
>
  <div className="p-6">
    <h2>Contenu</h2>
  </div>
</FullFrame>
\`\`\`

**Header layout:**
- Custom content is positioned on the left (with \`flex-1\` to take available space)
- Close button (X) is always positioned on the right
- Header uses \`justify-between\` layout when custom content is provided
- Header uses \`justify-end\` layout when only close button is displayed

## Customizing Body Layout

You can customize the body layout using \`bodyProps\` which accepts all VStack props:

\`\`\`tsx
<FullFrame
  onClose={() => setIsOpen(false)}
  bodyProps={{
    gap: 6,
    align: "center",
    padding: 8,
  }}
>
  <h2>Titre</h2>
  <p>Contenu</p>
</FullFrame>
\`\`\`

**Available bodyProps:**
- \`gap\`: Spacing between children (0-100)
- \`align\`: Horizontal alignment (\`start\`, \`center\`, \`end\`, \`baseline\`, \`stretch\`)
- \`justify\`: Vertical alignment (\`start\`, \`center\`, \`end\`, \`between\`, \`around\`, \`evenly\`)
- \`padding\`: Padding value (0-100)
- \`bg\`: Background context (\`white\`, \`grey\`, \`black\`)
- \`scroll\`: Scroll behavior (\`none\`, \`auto\`, \`always\`, \`vertical\`, \`horizontal\`, \`both\`)

## Header Specifications

- **Height**: 60px (using Tailwind \`h-12\` class)
- **Padding**: Horizontal \`px-3\` (15px), Vertical \`py-2\` (10px)
- **Close button**: Large size, ghost variant, 32x32px (w-8 h-8), X icon size 14px
- **Vertical alignment**: Elements are centered vertically using \`align="center"\`

## Body Specifications

- **Layout**: Uses VStack component (flex column)
- **Height**: Takes remaining screen height (\`flex-1\`)
- **Scroll**: Automatic overflow handling (\`overflow-auto\`)
- **Background**: Inherits from \`bodyBg\` prop (default: \`white\`)

## Context-Aware Styling

The FullFrame automatically adapts its appearance based on the header and body background contexts:

- **White background**: Components inside will use white background styles
- **Grey background**: Components inside will use grey background styles  
- **Black background**: Components inside will use black background styles

This is handled automatically via the \`data-bg\` attribute system inherited from Layout components.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onClose: {
      action: 'closed',
      description: 'Callback called when the close button (X) is clicked',
    },
    headerBg: {
      control: 'select',
      options: ['white', 'grey', 'black'],
      description: 'Background color of the header (default: "white")',
    },
    bodyBg: {
      control: 'select',
      options: ['white', 'grey', 'black'],
      description: 'Background color of the body (default: "white")',
    },
    headerContent: {
      control: false,
      description: 'Custom content to display in the header. If provided, content will be positioned on the left and the close button will remain on the right.',
    },
    bodyProps: {
      control: false,
      description: 'Props passed to the VStack component for the body. Allows customization of gap, align, justify, padding, bg, scroll, etc.',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes for the main container',
    },
  },
} satisfies Meta<typeof FullFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>
              Ouvrir FullFrame
            </Button>
          </div>
        )}
        {isOpen && (
          <FullFrame onClose={() => setIsOpen(false)}>
            <div className="p-6">
              <h2 className="gs-typo-h1 mb-4">Titre du contenu</h2>
              <p className="text-sm text-grey-stronger">
                Ceci est le contenu du body. Le header avec le bouton X est toujours visible en haut.
              </p>
            </div>
          </FullFrame>
        )}
      </>
    );
  },
};

export const WithDifferentBackgrounds: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>
              Ouvrir avec backgrounds différents
            </Button>
          </div>
        )}
        {isOpen && (
          <FullFrame
            headerBg="white"
            bodyBg="grey"
            onClose={() => setIsOpen(false)}
          >
            <div className="p-6">
              <h2 className="gs-typo-h1 mb-4">Header blanc, body gris</h2>
              <p className="text-sm text-grey-stronger">
                Le header a un fond blanc et le body a un fond gris.
              </p>
            </div>
          </FullFrame>
        )}
      </>
    );
  },
};

export const WithCustomHeader: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>
              Ouvrir avec header personnalisé
            </Button>
          </div>
        )}
        {isOpen && (
          <FullFrame
            headerContent={
              <HStack gap={4} align="center">
                <h2 className="gs-typo-h2">Titre du header</h2>
                <Button variant="secondary" onClick={() => alert('Action cliquée')}>
                  Action
                </Button>
              </HStack>
            }
            onClose={() => setIsOpen(false)}
          >
            <div className="p-6">
              <h2 className="gs-typo-h1 mb-4">Contenu</h2>
              <p className="text-sm text-grey-stronger">
                Le header contient maintenant un titre et un bouton d'action en plus du bouton de fermeture.
              </p>
            </div>
          </FullFrame>
        )}
      </>
    );
  },
};

export const WithScroll: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>
              Ouvrir avec scroll
            </Button>
          </div>
        )}
        {isOpen && (
          <FullFrame onClose={() => setIsOpen(false)}>
            <div className="p-6">
              <h2 className="gs-typo-h1 mb-4">FullFrame avec scroll</h2>
              <div className="space-y-4 text-sm text-grey-stronger">
                {Array.from({ length: 30 }).map((_, i) => (
                  <p key={i}>
                    Paragraphe {i + 1} - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                ))}
              </div>
            </div>
          </FullFrame>
        )}
      </>
    );
  },
};

export const WithVStackProps: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>
              Ouvrir avec VStack personnalisé
            </Button>
          </div>
        )}
        {isOpen && (
          <FullFrame
            onClose={() => setIsOpen(false)}
            bodyProps={{
              gap: 6,
              align: "center",
              padding: 8,
            }}
          >
            <h2 className="gs-typo-h1">Titre centré</h2>
            <p className="text-sm text-grey-stronger text-center max-w-md">
              Ce contenu utilise un VStack avec gap={6}, align="center" et padding={8}.
            </p>
            <HStack gap={4}>
              <Button variant="secondary">Action 1</Button>
              <Button variant="normal">Action 2</Button>
            </HStack>
          </FullFrame>
        )}
      </>
    );
  },
};

export const ComplexContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>
              Ouvrir contenu complexe
            </Button>
          </div>
        )}
        {isOpen && (
          <FullFrame
            onClose={() => setIsOpen(false)}
            bodyProps={{
              gap: 8,
              padding: 8,
            }}
          >
            <div>
              <h1 className="gs-typo-h1 mb-2">Titre principal</h1>
              <p className="text-sm text-grey-stronger">
                Description du contenu complexe
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-grey rounded flex items-center justify-center"
                >
                  Carte {i + 1}
                </div>
              ))}
            </div>

            <div className="border-t border-grey-strong pt-6">
              <HStack gap={4} justify="end">
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  Annuler
                </Button>
                <Button variant="normal">
                  Confirmer
                </Button>
              </HStack>
            </div>
          </FullFrame>
        )}
      </>
    );
  },
};
