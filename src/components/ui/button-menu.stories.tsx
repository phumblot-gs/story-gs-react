import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonMenu, ButtonMenuAction } from "@/components/ui/button-menu"
import { Layout, VStack, HStack } from "@/components/layout"
import { Icon } from "@/components/ui/icons"

const meta = {
  title: "UI/ButtonMenu",
  component: ButtonMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `ButtonMenu component that extends Toggle with dropdown menu functionality. Instead of triggering an onClick action, it displays a dropdown menu with actions. The Toggle component provides visual feedback when the menu is open (isActive state).

## Features
- Built on Toggle component (inherits all Toggle/Button features)
- Displays a dropdown menu instead of onClick action
- Automatic styling based on data-bg context (white, grey, black)
- Visual feedback when menu is open (Toggle's isActive state)
- Auto-positioning menu (drops where there's space)
- Configurable menu position and alignment (menuSide, menuAlign)
- Similar pattern to LanguageSwitcher component

## Background Context Adaptation

The menu styles adapt automatically based on the parent Layout's \`data-bg\`:

- **White/Grey backgrounds**: 
  - Menu container: black background
  - Menu items: black-secondary background
  
- **Black background**: 
  - Menu container: black-secondary background
  - Menu items: black background

## Basic Usage

\`\`\`tsx
import { ButtonMenu, Layout } from '@story-gs-react';

const actions: ButtonMenuAction[] = [
  { label: "Éditer", onClick: () => console.log("Éditer") },
  { label: "Supprimer", onClick: () => console.log("Supprimer") },
  { label: "Partager", onClick: () => console.log("Partager") },
];

<Layout bg="white">
  <ButtonMenu variant="normal" actions={actions}>
    Actions
  </ButtonMenu>
</Layout>
\`\`\`

## With Icon

\`\`\`tsx
<ButtonMenu variant="normal" actions={actions}>
  <Icon name="MoreVertical" size={12} />
</ButtonMenu>
\`\`\`

## With Disabled Actions

\`\`\`tsx
const actions: ButtonMenuAction[] = [
  { label: "Éditer", onClick: () => console.log("Éditer") },
  { label: "Supprimer", onClick: () => console.log("Supprimer"), disabled: true },
  { label: "Partager", onClick: () => console.log("Partager") },
];

<ButtonMenu variant="normal" actions={actions}>
  Actions
</ButtonMenu>
\`\`\`

## Limiting Menu Height and Enabling Scroll

When you have many actions, you can limit the menu height and enable scrolling:

\`\`\`tsx
// Limiter la hauteur à 40vh et activer le scroll
<ButtonMenu 
  variant="normal" 
  actions={manyActions}
  menuMaxHeight="max-h-[40vh]"
>
  Menu avec beaucoup d'actions
</ButtonMenu>
\`\`\`

The menu will automatically:
- Position itself where there's the most space (handled by Radix UI)
- Limit its height to the specified value
- Enable vertical scrolling when content exceeds the max height

**Common max-height values:**
- \`max-h-[40vh]\` - 40% of viewport height
- \`max-h-[50vh]\` - 50% of viewport height
- \`max-h-96\` - Fixed height (384px)
- \`max-h-[calc(100vh-2rem)]\` - Viewport height minus 2rem (default)

## Menu Position and Alignment

You can control the preferred position and alignment of the dropdown menu using \`menuSide\` and \`menuAlign\` props. The menu will automatically adjust if there's not enough space.

### Menu Side

Controls which side of the button the menu opens on:
- \`"bottom"\` (default): Menu opens below the button
- \`"top"\`: Menu opens above the button
- \`"left"\`: Menu opens to the left of the button
- \`"right"\`: Menu opens to the right of the button

### Menu Align

Controls the alignment of the menu relative to the button:
- \`"start"\` (default): Aligned to the left (or top) edge
- \`"center"\`: Centered relative to the button
- \`"end"\`: Aligned to the right (or bottom) edge

\`\`\`tsx
// Menu opens below, aligned to the right
<ButtonMenu 
  menuSide="bottom" 
  menuAlign="end"
  actions={actions}
>
  Actions
</ButtonMenu>

// Menu opens above, aligned to the right
<ButtonMenu 
  menuSide="top" 
  menuAlign="end"
  actions={actions}
>
  Actions
</ButtonMenu>
\`\`\`

**Note:** The menu will automatically reposition itself if the preferred position doesn't fit on screen (e.g., if the button is at the bottom-right corner, the menu will open above and align to the right).
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["normal", "secondary", "ghost", "outline", "destructive", "link"],
      description: "Button variant (inherited from Button)",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Button size (inherited from Button)",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button and all actions",
    },
    onClick: {
      action: "clicked",
      description: "Callback called when the button is clicked",
    },
    onFocus: {
      action: "focused",
      description: "Callback called when the button receives focus",
    },
    onBlur: {
      action: "blurred",
      description: "Callback called when the button loses focus",
    },
    open: {
      control: "boolean",
      description: "Controlled open state of the menu",
    },
    defaultOpen: {
      control: "boolean",
      description: "Initial open state of the menu (uncontrolled mode)",
    },
    onOpenChange: {
      action: "openChange",
      description: "Callback called when the menu open state changes",
    },
    debug: {
      control: "boolean",
      description: "Debug mode: logs props and actions to console",
    },
    menuMaxHeight: {
      control: "text",
      description: "Maximum height of the dropdown menu (e.g., 'max-h-[40vh]', 'max-h-96'). Default: 'max-h-[calc(100vh-2rem)]'",
    },
    menuSide: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Preferred side where the menu opens. The menu will automatically adjust if there's not enough space. Default: 'bottom'",
    },
    menuAlign: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Preferred alignment of the menu relative to the button. The menu will automatically adjust if there's not enough space. Default: 'start'",
    },
  },
} satisfies Meta<typeof ButtonMenu>

export default meta
type Story = StoryObj<typeof meta>

const defaultActions: ButtonMenuAction[] = [
  { label: "Éditer", onClick: () => console.log("Éditer") },
  { label: "Dupliquer", onClick: () => console.log("Dupliquer") },
  { label: "Supprimer", onClick: () => console.log("Supprimer") },
  { label: "Partager", onClick: () => console.log("Partager") },
]

export const Default: Story = {
  render: (args) => (
    <Layout bg="white" padding={6}>
      <ButtonMenu {...args} actions={defaultActions}>
        Actions
      </ButtonMenu>
    </Layout>
  ),
  args: {
    variant: "normal",
    size: "medium",
  },
}

export const AllVariants: Story = {
  render: () => (
    <VStack gap={6} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background White</h3>
        <HStack gap={3}>
          <ButtonMenu variant="normal" actions={defaultActions}>
            Normal
          </ButtonMenu>
          <ButtonMenu variant="secondary" actions={defaultActions}>
            Secondary
          </ButtonMenu>
          <ButtonMenu variant="ghost" actions={defaultActions}>
            Ghost
          </ButtonMenu>
          <ButtonMenu variant="outline" actions={defaultActions}>
            Outline
          </ButtonMenu>
        </HStack>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background Grey</h3>
        <HStack gap={3}>
          <ButtonMenu variant="normal" actions={defaultActions}>
            Normal
          </ButtonMenu>
          <ButtonMenu variant="secondary" actions={defaultActions}>
            Secondary
          </ButtonMenu>
          <ButtonMenu variant="ghost" actions={defaultActions}>
            Ghost
          </ButtonMenu>
          <ButtonMenu variant="outline" actions={defaultActions}>
            Outline
          </ButtonMenu>
        </HStack>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3 text-white">Background Black</h3>
        <HStack gap={3}>
          <ButtonMenu variant="normal" actions={defaultActions}>
            Normal
          </ButtonMenu>
          <ButtonMenu variant="secondary" actions={defaultActions}>
            Secondary
          </ButtonMenu>
          <ButtonMenu variant="ghost" actions={defaultActions}>
            Ghost
          </ButtonMenu>
          <ButtonMenu variant="outline" actions={defaultActions}>
            Outline
          </ButtonMenu>
        </HStack>
      </VStack>
    </VStack>
  ),
  parameters: {
    layout: "fullscreen",
  },
}

export const WithIcon: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <HStack gap={3}>
          <ButtonMenu variant="normal" size="small" actions={defaultActions} className="p-1 w-4 h-4">
            <Icon name="MoreVertical" size={10} />
          </ButtonMenu>
          <ButtonMenu variant="normal" size="medium" actions={defaultActions} className="p-0 w-6 h-6">
            <Icon name="MoreVertical" size={12} />
          </ButtonMenu>
          <ButtonMenu variant="normal" size="large" actions={defaultActions} className="p-0 w-8 h-8">
            <Icon name="MoreVertical" size={14} />
          </ButtonMenu>
        </HStack>
        <HStack gap={3}>
          <ButtonMenu variant="secondary" size="small" actions={defaultActions} className="p-1 w-4 h-4">
            <Icon name="MoreVertical" size={10} />
          </ButtonMenu>
          <ButtonMenu variant="secondary" size="medium" actions={defaultActions} className="p-0 w-6 h-6">
            <Icon name="MoreVertical" size={12} />
          </ButtonMenu>
          <ButtonMenu variant="secondary" size="large" actions={defaultActions} className="p-0 w-8 h-8">
            <Icon name="MoreVertical" size={14} />
          </ButtonMenu>
        </HStack>
      </VStack>
    </Layout>
  ),
}

export const WithDisabledActions: Story = {
  render: () => {
    const actionsWithDisabled: ButtonMenuAction[] = [
      { label: "Éditer", onClick: () => console.log("Éditer") },
      { label: "Dupliquer", onClick: () => console.log("Dupliquer"), disabled: true },
      { label: "Supprimer", onClick: () => console.log("Supprimer") },
      { label: "Archiver", onClick: () => console.log("Archiver"), disabled: true },
    ]

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <ButtonMenu variant="normal" actions={actionsWithDisabled}>
            Actions avec éléments désactivés
          </ButtonMenu>
          <ButtonMenu variant="secondary" actions={actionsWithDisabled} disabled>
            Menu désactivé (tout le bouton)
          </ButtonMenu>
        </VStack>
      </Layout>
    )
  },
}

export const DifferentSizes: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <HStack gap={3} align="center">
          <ButtonMenu variant="normal" size="small" actions={defaultActions}>
            Small
          </ButtonMenu>
          <ButtonMenu variant="normal" size="medium" actions={defaultActions}>
            Medium
          </ButtonMenu>
          <ButtonMenu variant="normal" size="large" actions={defaultActions}>
            Large
          </ButtonMenu>
        </HStack>
      </VStack>
    </Layout>
  ),
}

export const WithManyActions: Story = {
  render: () => {
    const manyActions: ButtonMenuAction[] = [
      { label: "Éditer", onClick: () => console.log("Éditer") },
      { label: "Dupliquer", onClick: () => console.log("Dupliquer") },
      { label: "Renommer", onClick: () => console.log("Renommer") },
      { label: "Déplacer", onClick: () => console.log("Déplacer") },
      { label: "Copier", onClick: () => console.log("Copier") },
      { label: "Coller", onClick: () => console.log("Coller") },
      { label: "Partager", onClick: () => console.log("Partager") },
      { label: "Exporter", onClick: () => console.log("Exporter") },
      { label: "Importer", onClick: () => console.log("Importer") },
      { label: "Supprimer", onClick: () => console.log("Supprimer") },
    ]

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <div>
            <p className="text-sm text-grey-stronger mb-2">
              Menu avec hauteur limitée à 40vh et scroll automatique
            </p>
            <ButtonMenu variant="normal" actions={manyActions} menuMaxHeight="max-h-[40vh]">
              Menu avec beaucoup d'actions
            </ButtonMenu>
          </div>
        </VStack>
      </Layout>
    )
  },
}

export const DebugMode: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <p className="text-sm text-grey-stronger">
          Ouvrez la console pour voir les logs de debug
        </p>
        <ButtonMenu variant="normal" actions={defaultActions} debug>
          Actions (Debug)
        </ButtonMenu>
      </VStack>
    </Layout>
  ),
}

export const MenuPositioning: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={8}>
        <div>
          <h3 className="gs-typo-h3 mb-4">Position par défaut (bottom, start)</h3>
          <ButtonMenu variant="normal" actions={defaultActions}>
            Menu par défaut
          </ButtonMenu>
        </div>

        <div>
          <h3 className="gs-typo-h3 mb-4">En bas, aligné à droite</h3>
          <div className="flex justify-end">
            <ButtonMenu variant="normal" actions={defaultActions} menuSide="bottom" menuAlign="end">
              Bottom + End
            </ButtonMenu>
          </div>
        </div>

        <div>
          <h3 className="gs-typo-h3 mb-4">En haut, aligné à droite</h3>
          <div className="flex justify-end">
            <ButtonMenu variant="normal" actions={defaultActions} menuSide="top" menuAlign="end">
              Top + End
            </ButtonMenu>
          </div>
        </div>

        <div>
          <h3 className="gs-typo-h3 mb-4">Centré</h3>
          <ButtonMenu variant="normal" actions={defaultActions} menuSide="bottom" menuAlign="center">
            Bottom + Center
          </ButtonMenu>
        </div>

        <div>
          <h3 className="gs-typo-h3 mb-4">À droite, aligné en haut</h3>
          <ButtonMenu variant="normal" actions={defaultActions} menuSide="right" menuAlign="start">
            Right + Start
          </ButtonMenu>
        </div>

        <div>
          <h3 className="gs-typo-h3 mb-4">À gauche, aligné en haut</h3>
          <ButtonMenu variant="normal" actions={defaultActions} menuSide="left" menuAlign="start">
            Left + Start
          </ButtonMenu>
        </div>
      </VStack>
    </Layout>
  ),
  parameters: {
    layout: "fullscreen",
  },
}

