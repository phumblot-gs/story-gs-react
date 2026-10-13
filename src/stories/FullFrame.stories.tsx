import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "@/components/ui/stepper";
import { PageFillLayout } from "@/components/layout/PageFillLayout";
import { FileBrowser, type FileItem } from "@/components/ui/file-browser";
import { useState } from "react";
import { Modal } from "@/components/layout/Modal";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { FullFrame, type FullFrameProps } from "@/components/layout/FullFrame";
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
- Escape calls the same onClose callback on the uppermost FullFrame only; closeOnEscape defaults to true
- Custom header content support (add titles, buttons, etc.)
- Scrollable body using VStack
- Mouse wheel over the fixed header/footer scrolls the visible body, including nested panels
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
- \`grey\`: Grey background (#efefef)
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

- **Height**: at least 60px (\`min-h-12\`), grows with taller content
- **Padding**: Horizontal \`px-3\` (15px) by default, or the shared \`padding\`; vertical \`py-2\` (10px)
- **Close button**: Large size, ghost variant, 32x32px (w-8 h-8), X icon size 14px
- **Vertical alignment**: Elements are centered vertically using \`align="center"\`

## Shared padding

\`padding={4 | 6 | 8}\` (20 / 30 / 40 px) sets the header's horizontal padding **and** the body's padding, so
the header content (e.g. the project name) is aligned with the body content (stepper, title…). Without it, the
historical rendering is kept (header \`px-3\`, body without padding). See *Project wizard*:

\`\`\`tsx
<FullFrame headerBg="grey" bodyBg="grey" padding={6} headerContent={<span>Projet TEST DECAT</span>} onClose={close}>
  <Stepper layout="inline" steps={steps} />
  <h1 className="gs-typo-h1">Choisir les images du projet</h1>
</FullFrame>
\`\`\`

## Footer

\`footer\` adds a fixed area at the bottom (Previous / Next buttons…), outside the scrolling body, with the same
horizontal padding as the header (\`padding\`). \`footerBg\` defaults to \`bodyBg\`; \`footerClassName\` adds e.g. a
separator (\`border-t border-grey\`).

## Page fill layout inside the FullFrame

The body is a **scroll container** (provided through \`ScrollContainerProvider\`, with \`container-type: size\`).
A \`PageFillLayout\` placed in it behaves as on a page: the collapsible part (stepper, title…) folds first with the
mouse wheel, then the panel fills the body height and its content scrolls inside it. See *Project wizard*.

\`\`\`tsx
<FullFrame padding={6} headerBg="grey" bodyBg="grey" headerContent={projectName} footer={<WizardButtons />} onClose={close}>
  <PageFillLayout as="div" bg="grey" hidePageScrollbar collapsibleClassName="pb-6"
    collapsible={<><Stepper layout="inline" steps={steps} /><h1 className="gs-typo-h1">Choisir les images</h1></>}>
    <FileBrowser heightMode="fill-container" {...fileBrowserProps} />
  </PageFillLayout>
</FullFrame>
\`\`\`

Known limits (same as PageFillLayout): touch scrolling scrolls the list first (the top part folds when swiping on
it, or when the list reaches its end); keyboard scrolling is native (no page-first sequence).

## Wheel over header and footer

Vertical wheel gestures over the fixed header or footer are forwarded to the visible body. With PageFillLayout,
the collapsible top part folds first, then the inner list scrolls. Upward gestures scroll the list back before
revealing the top part. Zoom gestures, horizontal gestures and scrollable header/footer controls keep their
native behavior. An explicit \`data-native-scroll\` region also keeps its native wheel behavior.

## Escape key

Escape calls the same onClose callback as the X button. FullFrame listens after Radix and React handlers,
and ignores events already handled (defaultPrevented). A modal, menu, select or tooltip above the wizard
therefore closes alone. Only the uppermost FullFrame reacts; a disabled or non-closable frame shields
those beneath it. Auto-repeat is ignored so holding Escape does not dismiss the whole stack.

Set \`closeOnEscape={false}\` to disable the shortcut. The X button still calls onClose. To request confirmation
for both X and Escape, implement that confirmation in the shared onClose callback.

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
    closeOnEscape: {
      control: 'boolean',
      description: 'Escape closes only the uppermost frame when the event was not already handled. X is unaffected.',
      table: { defaultValue: { summary: 'true' } },
    },
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

const WIZARD_FILES: FileItem[] = Array.from({ length: 80 }, (_, i) => ({
  id: `wf-${i}`,
  file_name: i % 8 === 0 ? `Séance ${i / 8 + 1}` : `visuel-${String(i).padStart(3, "0")}.jpg`,
  parent_path: "/",
  file_size: i % 8 === 0 ? 0 : 2_000_000 + i * 1000,
  mime_type: i % 8 === 0 ? null : "image/jpeg",
  is_directory: i % 8 === 0,
  created_at: new Date(2024, 0, (i % 28) + 1).toISOString(),
  updated_at: new Date(2024, 1, (i % 28) + 1).toISOString(),
}));

/**
 * Project creation wizard, same layout as `PageFillLayout` inside the FullFrame:
 * - fixed header (project name, close button) and fixed footer (Previous / Next);
 * - collapsible top part in the body (stepper, title, description);
 * - a panel that fills the body height (here a `FileBrowser heightMode="fill-container"`).
 *
 * Mouse wheel over the list: the top part folds first, then the list scrolls inside the panel. Wheel up:
 * the list goes back to its top, then the top part comes back. `padding={6}` aligns the header, the body
 * and the footer.
 */
export const ProjectWizard: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        {!isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-grey">
            <Button onClick={() => setIsOpen(true)}>Ouvrir l'assistant</Button>
          </div>
        )}
        {isOpen && (
          <FullFrame
            headerBg="grey"
            bodyBg="grey"
            padding={6}
            headerContent={<span className="text-sm text-grey-strongest">Projet TEST DECAT</span>}
            onClose={() => setIsOpen(false)}
            footer={
              <div className="flex w-full items-center justify-between">
                <Button variant="secondary" disabled>Précédent</Button>
                <Button>Suivant</Button>
              </div>
            }
          >
            <PageFillLayout
              as="div"
              bg="grey"
              hidePageScrollbar
              collapsibleClassName="pb-6"
              collapsible={
                <div className="flex flex-col gap-6">
                  <Stepper
                    layout="inline"
                    steps={[
                      { label: 1, title: "Images", state: "active" },
                      { label: 2, title: "Catalogue" },
                      { label: 3, title: "Rapprochement" },
                      { label: 4, title: "Validation" },
                    ]}
                  />
                  <div className="flex flex-col gap-2">
                    <h1 className="gs-typo-h1 m-0">Choisir les images du projet</h1>
                    <p className="m-0 text-base text-grey-strongest">
                      Sélectionnez des fichiers, puis ajoutez-les au projet. Vous pourrez ensuite les rapprocher du catalogue.
                    </p>
                  </div>
                </div>
              }
            >
              <FileBrowser files={WIZARD_FILES} currentPath="/" heightMode="fill-container" language="FR" />
            </PageFillLayout>
          </FullFrame>
        )}
      </>
    );
  },
};


/** Native wheel verification: point at either fixed bar, or at the body. */
export const WheelOverHeaderAndFooter: Story = {
  args: {
    headerContent: <span>Survolez ce header avec la souris, puis faites défiler.</span>,
    footer: <span>La molette fonctionne aussi au-dessus de ce footer.</span>,
    headerBg: 'grey', bodyBg: 'white', footerBg: 'grey', padding: 6,
    children: <div>{Array.from({ length: 50 }, (_, index) => <p key={index} className="py-3">Ligne {index + 1} — contenu du body</p>)}</div>,
  },
};


function EscapeDemo(props: FullFrameProps) {
  const [open, setOpen] = useState(true);
  const [nested, setNested] = useState(false);
  const [modal, setModal] = useState(false);
  if (!open) return <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-grey"><p>FullFrame fermé.</p><Button onClick={() => setOpen(true)}>Rouvrir FullFrame</Button></div>;
  return <TooltipProvider delayDuration={0}>
    <FullFrame {...props} padding={6} headerBg="grey" headerContent={<span>Wizard · gestion d’Échap</span>} onClose={() => setOpen(false)}>
      <h2 className="text-lg font-medium">Tester les fenêtres au-dessus du wizard</h2>
      <p>Échap ferme la fenêtre du dessus. Un second Échap ferme le wizard.</p>
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={() => setModal(true)}>Remplacer les données</Button>
        <DropdownMenu><DropdownMenuTrigger asChild><Button>Ouvrir le menu</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Une action</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        <Select><SelectTrigger aria-label="Liste déroulante" className="w-[220px]"><SelectValue placeholder="Choisir une option" /></SelectTrigger><SelectContent><SelectItem value="one">Option 1</SelectItem><SelectItem value="two">Option 2</SelectItem></SelectContent></Select>
        <Tooltip><TooltipTrigger asChild><Button>Afficher une aide</Button></TooltipTrigger><TooltipContent>Aide au-dessus du wizard</TooltipContent></Tooltip>
        <Button onClick={() => setNested(true)}>Ouvrir un second FullFrame</Button>
      </div>
      {nested && <FullFrame padding={6} headerBg="grey" headerContent={<span>Second FullFrame</span>} onClose={() => setNested(false)}><p>Échap ferme uniquement ce FullFrame.</p></FullFrame>}
      <Modal isOpen={modal} title="Remplacer les données" header={<span>Remplacer les données</span>} onClose={() => setModal(false)}><p>Échap ferme cette popup et conserve le wizard.</p></Modal>
    </FullFrame>
  </TooltipProvider>;
}
export const EscapeHandling: Story = {
  args: { closeOnEscape: true, children: null },
  render: args => <EscapeDemo {...args} />,
};
export const EscapeDisabled: Story = {
  args: { closeOnEscape: false, children: null },
  render: args => <EscapeDemo {...args} />,
};
