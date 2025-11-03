import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SidePanel } from "@/components/layout/SidePanel";
import { Button } from "@/components/ui/button";
import { VStack, HStack } from "@/components/layout";

const meta = {
  title: "Components/SidePanel",
  component: SidePanel,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `SidePanel component built with the Figma design system. The SidePanel displays a side panel on the right side of the screen, similar to ActivityPanel, but as a reusable component that can be controlled externally.

## Features
- Side panel positioned on the right side of the screen (full height)
- Optional overlay background (default: shown)
- Customizable width (default: 300px)
- Customizable background color (white, grey, black) - default: black
- Optional header with close button (X)
- Custom header content support
- Scrollable body content
- Automatic context-aware styling via \`data-bg\` mechanism
- Top offset support (e.g., for PageHeader)

## Basic Usage

\`\`\`tsx
import { SidePanel, Button } from '@story-gs-react';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Ouvrir SidePanel
      </Button>

      <SidePanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="p-6">
          <h2 className="gs-typo-h2 text-white">Titre du contenu</h2>
          <p className="text-white">Contenu du body</p>
        </div>
      </SidePanel>
    </>
  );
}
\`\`\`

## Width and Background

You can customize the width and background color:

\`\`\`tsx
<SidePanel
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  width="400px"
  bg="white"
>
  <div className="p-6">
    <h2>Contenu</h2>
  </div>
</SidePanel>
\`\`\`

**Available background values:**
- \`white\`: White background (#ffffff)
- \`grey\`: Grey background (#eaeaea)
- \`black\`: Black background (#292828) - default

**Width:**
- Can be a string (e.g., \`"300px"\`, \`"50%"\`) or a number (e.g., \`400\` which becomes \`"400px"\`)
- Default: \`"300px"\`

## Overlay

The overlay can be shown or hidden:

\`\`\`tsx
// With overlay (default)
<SidePanel
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  showOverlay={true}
>
  <div className="p-6">Contenu</div>
</SidePanel>

// Without overlay
<SidePanel
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  showOverlay={false}
>
  <div className="p-6">Contenu</div>
</SidePanel>
\`\`\`

## Custom Header Content

The \`headerContent\` prop allows you to add custom components to the header (titles, buttons, etc.). The close button (X) will automatically be positioned on the right side.

\`\`\`tsx
<SidePanel
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  headerContent={
    <h2 className="gs-typo-h2 text-white">Titre du panneau</h2>
  }
>
  <div className="p-6">
    <p>Contenu</p>
  </div>
</SidePanel>
\`\`\`

**Header layout:**
- Custom content is positioned on the left (with \`flex-1\` to take available space)
- Close button (X) is always positioned on the right if \`showCloseButton={true}\`
- Header uses \`justify-between\` layout when custom content is provided
- Header uses default layout when only close button is displayed

## Close Button

The close button can be shown or hidden:

\`\`\`tsx
// With close button (default)
<SidePanel
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  showCloseButton={true}
>
  <div className="p-6">Contenu</div>
</SidePanel>

// Without close button
<SidePanel
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  showCloseButton={false}
>
  <div className="p-6">Contenu</div>
</SidePanel>
\`\`\`

## Top Offset

You can add a top offset (e.g., for PageHeader):

\`\`\`tsx
<SidePanel
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  topOffset="50px"
>
  <div className="p-6">
    <p>Contenu avec décalage depuis le haut</p>
  </div>
</SidePanel>
\`\`\`

## Context-Aware Styling

The SidePanel automatically adapts its appearance based on the \`bg\` prop:

- **White background**: Components inside will use white background styles
- **Grey background**: Components inside will use grey background styles  
- **Black background**: Components inside will use black background styles

This is handled automatically via the \`data-bg\` attribute system inherited from Layout components.`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controls the panel visibility (open/closed)",
    },
    onClose: {
      action: "closed",
      description: "Callback called when the panel is closed",
    },
    showOverlay: {
      control: "boolean",
      description: "Show overlay background (default: true)",
    },
    width: {
      control: "text",
      description: "Panel width (default: \"300px\"). Can be a string (e.g., \"400px\", \"50%\") or a number (e.g., 400 which becomes \"400px\")",
    },
    bg: {
      control: "select",
      options: ["white", "grey", "black"],
      description: "Background color of the panel (default: \"black\")",
    },
    showCloseButton: {
      control: "boolean",
      description: "Show close button (X) in header (default: true)",
    },
    headerContent: {
      control: false,
      description: "Custom content to display in the header. If provided, content will be positioned on the left and the close button will remain on the right.",
    },
    topOffset: {
      control: "text",
      description: "Offset from the top (e.g., \"50px\" for PageHeader). Can be a string or a number.",
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes for the main container",
    },
    bodyClassName: {
      control: "text",
      description: "Additional Tailwind CSS classes for the body",
    },
    debug: {
      control: "boolean",
      description: "Debug mode: logs props to the console",
    },
  },
} satisfies Meta<typeof SidePanel>;

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
              Ouvrir SidePanel
            </Button>
          </div>
        )}
        <SidePanel isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="p-6">
            <h2 className="gs-typo-h2 text-white mb-4">Titre du contenu</h2>
            <p className="text-white text-sm">
              Ceci est le contenu du panneau latéral. Le header avec le bouton X est toujours visible en haut.
            </p>
          </div>
        </SidePanel>
      </>
    );
  },
};

export const WithCustomWidth: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>
              Ouvrir SidePanel (400px)
            </Button>
          </div>
        )}
        <SidePanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          width="400px"
        >
          <div className="p-6">
            <h2 className="gs-typo-h2 text-white mb-4">Panneau large</h2>
            <p className="text-white text-sm">
              Ce panneau a une largeur de 400px.
            </p>
          </div>
        </SidePanel>
      </>
    );
  },
};

export const WithCustomBackground: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>
              Ouvrir SidePanel (fond blanc)
            </Button>
          </div>
        )}
        <SidePanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          bg="white"
        >
          <div className="p-6">
            <h2 className="gs-typo-h2 text-black mb-4">Panneau fond blanc</h2>
            <p className="text-black text-sm">
              Ce panneau a un fond blanc. Les composants à l'intérieur s'adaptent automatiquement.
            </p>
          </div>
        </SidePanel>
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
              Ouvrir SidePanel avec header
            </Button>
          </div>
        )}
        <SidePanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          headerContent={
            <h2 className="gs-typo-h2 text-white">Titre du panneau</h2>
          }
        >
          <div className="p-6">
            <p className="text-white text-sm">
              Ce panneau a un header personnalisé avec un titre et le bouton X à droite.
            </p>
          </div>
        </SidePanel>
      </>
    );
  },
};

export const WithoutOverlay: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>
              Ouvrir SidePanel sans overlay
            </Button>
          </div>
        )}
        <SidePanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          showOverlay={false}
        >
          <div className="p-6">
            <h2 className="gs-typo-h2 text-white mb-4">Panneau sans overlay</h2>
            <p className="text-white text-sm">
              Ce panneau n'a pas d'overlay en arrière-plan.
            </p>
          </div>
        </SidePanel>
      </>
    );
  },
};

export const WithoutCloseButton: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>
              Ouvrir SidePanel sans bouton X
            </Button>
          </div>
        )}
        <SidePanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          showCloseButton={false}
        >
          <div className="p-6">
            <h2 className="gs-typo-h2 text-white mb-4">Panneau sans bouton X</h2>
            <p className="text-white text-sm">
              Ce panneau n'a pas de bouton X. Vous devez fermer via un autre moyen (ex: clic sur overlay).
            </p>
          </div>
        </SidePanel>
      </>
    );
  },
};

export const WithTopOffset: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex flex-col">
            <div className="h-[50px] bg-white border-b border-grey-strongest flex items-center px-4">
              <span className="text-sm">PageHeader simulé (50px)</span>
            </div>
            <div className="flex-1 flex items-center justify-center bg-grey">
              <Button onClick={() => setIsOpen(true)}>
                Ouvrir SidePanel avec topOffset
              </Button>
            </div>
          </div>
        )}
        <SidePanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          topOffset="50px"
        >
          <div className="p-6">
            <h2 className="gs-typo-h2 text-white mb-4">Panneau avec topOffset</h2>
            <p className="text-white text-sm">
              Ce panneau a un décalage de 50px depuis le haut pour laisser place au PageHeader.
            </p>
          </div>
        </SidePanel>
      </>
    );
  },
};

export const WithScrollableContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>
              Ouvrir SidePanel avec contenu scrollable
            </Button>
          </div>
        )}
        <SidePanel isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="p-6">
            <h2 className="gs-typo-h2 text-white mb-4">Contenu scrollable</h2>
            {Array.from({ length: 50 }).map((_, i) => (
              <p key={i} className="text-white text-sm mb-4">
                Paragraphe {i + 1}: Le body est scrollable automatiquement lorsque le contenu dépasse la hauteur disponible.
              </p>
            ))}
          </div>
        </SidePanel>
      </>
    );
  },
};

export const WithContextAwareComponents: Story = {
  render: () => {
    const [isOpenWhite, setIsOpenWhite] = useState(false);
    const [isOpenBlack, setIsOpenBlack] = useState(false);

    return (
      <>
        {!isOpenWhite && !isOpenBlack && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <VStack gap={4} align="center">
              <Button onClick={() => setIsOpenWhite(true)}>
                Ouvrir SidePanel blanc
              </Button>
              <Button onClick={() => setIsOpenBlack(true)}>
                Ouvrir SidePanel noir
              </Button>
            </VStack>
          </div>
        )}
        <SidePanel
          isOpen={isOpenWhite}
          onClose={() => setIsOpenWhite(false)}
          bg="white"
        >
          <div className="p-6">
            <h2 className="gs-typo-h2 text-black mb-4">Composants context-aware (fond blanc)</h2>
            <p className="text-black text-sm mb-4">
              Les composants à l'intérieur s'adaptent automatiquement au fond blanc.
            </p>
            <HStack gap={4} align="center">
              <Button variant="normal">Normal</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </HStack>
          </div>
        </SidePanel>
        <SidePanel
          isOpen={isOpenBlack}
          onClose={() => setIsOpenBlack(false)}
          bg="black"
        >
          <div className="p-6">
            <h2 className="gs-typo-h2 text-white mb-4">Composants context-aware (fond noir)</h2>
            <p className="text-white text-sm mb-4">
              Les composants à l'intérieur s'adaptent automatiquement au fond noir.
            </p>
            <HStack gap={4} align="center">
              <Button variant="normal">Normal</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </HStack>
          </div>
        </SidePanel>
      </>
    );
  },
};

export const DebugMode: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>
              Ouvrir SidePanel (Debug)
            </Button>
          </div>
        )}
        <SidePanel
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          debug={true}
        >
          <div className="p-6">
            <h2 className="gs-typo-h2 text-white mb-4">Mode Debug</h2>
            <p className="text-white text-sm">
              Ouvrez la console pour voir les logs de debug.
            </p>
          </div>
        </SidePanel>
      </>
    );
  },
};

