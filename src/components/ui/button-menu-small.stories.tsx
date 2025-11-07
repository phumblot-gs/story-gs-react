import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonMenuSmall, ButtonMenuSmallItem } from "@/components/ui/button-menu-small"
import { Layout, VStack, HStack } from "@/components/layout"
import { Icon } from "@/components/ui/icons"

const meta = {
  title: "UI/ButtonMenuSmall",
  component: ButtonMenuSmall,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `ButtonMenuSmall component that extends ButtonMenu with compact dropdown menu styling. The dropdown menu has no gap and no padding between items (\`gap-0\` and \`p-0\`), creating a more compact appearance.

## Features
- Built on Toggle component (inherits all Toggle/Button features)
- Displays a dropdown menu instead of onClick action
- Compact menu styling: no gap and no padding between items
- Automatic styling based on data-bg context (white, grey, black)
- Visual feedback when menu is open (Toggle's isActive state)
- Auto-positioning menu (drops where there's space)
- Configurable menu position and alignment (menuSide, menuAlign)
- Same props and behavior as ButtonMenu

## Differences from ButtonMenu

The main difference is the dropdown menu styling:
- **ButtonMenu**: Uses \`gap-2\` and \`p-2\` for spacing between items
- **ButtonMenuSmall**: Uses \`gap-0\` and \`p-0\` for compact spacing
- **ButtonMenuSmall**: Supports separators between menu items

## Basic Usage

\`\`\`tsx
import { ButtonMenuSmall, Layout } from '@story-gs-react';

const actions: ButtonMenuSmallItem[] = [
  { label: "Refuser", onClick: () => console.log("Refuser") },
  { label: "À valider", onClick: () => console.log("À valider") },
  { label: "Valider", onClick: () => console.log("Valider") },
];

<Layout bg="white">
  <ButtonMenuSmall variant="normal" actions={actions}>
    Actions
  </ButtonMenuSmall>
</Layout>
\`\`\`

## With Separators

You can add separators between menu items using \`{ separator: true }\`:

\`\`\`tsx
const items: ButtonMenuSmallItem[] = [
  { label: "Éditer", onClick: () => console.log("Éditer") },
  { label: "Dupliquer", onClick: () => console.log("Dupliquer") },
  { separator: true },
  { label: "Supprimer", onClick: () => console.log("Supprimer") },
  { separator: true },
  { label: "Partager", onClick: () => console.log("Partager") },
];

<ButtonMenuSmall variant="normal" actions={items}>
  Actions
</ButtonMenuSmall>
\`\`\`

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
<ButtonMenuSmall 
  menuSide="bottom" 
  menuAlign="end"
  actions={actions}
>
  Actions
</ButtonMenuSmall>

// Menu opens above, aligned to the right
<ButtonMenuSmall 
  menuSide="top" 
  menuAlign="end"
  actions={actions}
>
  Actions
</ButtonMenuSmall>
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
} satisfies Meta<typeof ButtonMenuSmall>

export default meta
type Story = StoryObj<typeof meta>

const defaultActions: ButtonMenuSmallItem[] = [
  { label: "Refuser", onClick: () => console.log("Refuser") },
  { label: "À valider", onClick: () => console.log("À valider") },
  { label: "Valider", onClick: () => console.log("Valider") },
]

export const Default: Story = {
  render: (args) => (
    <Layout bg="white" padding={6}>
      <ButtonMenuSmall {...args} actions={defaultActions}>
        Actions
      </ButtonMenuSmall>
    </Layout>
  ),
  args: {
    variant: "normal",
    size: "medium",
  },
}

export const AllBackgrounds: Story = {
  render: () => (
    <VStack gap={6} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background White</h3>
        <HStack gap={3}>
          <ButtonMenuSmall variant="normal" actions={defaultActions}>
            Normal
          </ButtonMenuSmall>
          <ButtonMenuSmall variant="secondary" actions={defaultActions}>
            Secondary
          </ButtonMenuSmall>
        </HStack>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background Grey</h3>
        <HStack gap={3}>
          <ButtonMenuSmall variant="normal" actions={defaultActions}>
            Normal
          </ButtonMenuSmall>
          <ButtonMenuSmall variant="secondary" actions={defaultActions}>
            Secondary
          </ButtonMenuSmall>
        </HStack>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3 text-white">Background Black</h3>
        <HStack gap={3}>
          <ButtonMenuSmall variant="normal" actions={defaultActions}>
            Normal
          </ButtonMenuSmall>
          <ButtonMenuSmall variant="secondary" actions={defaultActions}>
            Secondary
          </ButtonMenuSmall>
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
          <ButtonMenuSmall variant="normal" size="small" actions={defaultActions} className="p-1 w-4 h-4">
            <Icon name="MoreVertical" size={10} />
          </ButtonMenuSmall>
          <ButtonMenuSmall variant="normal" size="medium" actions={defaultActions} className="p-0 w-6 h-6">
            <Icon name="MoreVertical" size={12} />
          </ButtonMenuSmall>
          <ButtonMenuSmall variant="normal" size="large" actions={defaultActions} className="p-0 w-8 h-8">
            <Icon name="MoreVertical" size={14} />
          </ButtonMenuSmall>
        </HStack>
      </VStack>
    </Layout>
  ),
}

export const Disabled: Story = {
  render: () => {
    const actionsWithDisabled: ButtonMenuSmallItem[] = [
      { label: "Refuser", onClick: () => console.log("Refuser") },
      { label: "À valider", onClick: () => console.log("À valider"), disabled: true },
      { label: "Valider", onClick: () => console.log("Valider") },
    ]

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <ButtonMenuSmall variant="normal" actions={actionsWithDisabled}>
            Actions avec éléments désactivés
          </ButtonMenuSmall>
          <ButtonMenuSmall variant="secondary" actions={actionsWithDisabled} disabled>
            Menu désactivé (tout le bouton)
          </ButtonMenuSmall>
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
          Open the console to see debug logs
        </p>
        <ButtonMenuSmall variant="normal" actions={defaultActions} debug>
          Actions (Debug)
        </ButtonMenuSmall>
      </VStack>
    </Layout>
  ),
}

export const WithSeparators: Story = {
  render: () => {
    const itemsWithSeparators: ButtonMenuSmallItem[] = [
      { label: "Éditer", onClick: () => console.log("Éditer") },
      { label: "Dupliquer", onClick: () => console.log("Dupliquer") },
      { separator: true },
      { label: "Supprimer", onClick: () => console.log("Supprimer") },
      { separator: true },
      { label: "Partager", onClick: () => console.log("Partager") },
      { label: "Exporter", onClick: () => console.log("Exporter") },
    ]

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <div>
            <p className="text-sm text-grey-stronger mb-2">
              Menu avec séparateurs entre les groupes d'actions
            </p>
            <ButtonMenuSmall variant="normal" actions={itemsWithSeparators}>
              Actions avec séparateurs
            </ButtonMenuSmall>
          </div>
        </VStack>
      </Layout>
    )
  },
}

export const MenuPositioning: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={8}>
        <div>
          <h3 className="gs-typo-h3 mb-4">Position par défaut (bottom, start)</h3>
          <ButtonMenuSmall variant="normal" actions={defaultActions}>
            Menu par défaut
          </ButtonMenuSmall>
        </div>

        <div>
          <h3 className="gs-typo-h3 mb-4">En bas, aligné à droite</h3>
          <div className="flex justify-end">
            <ButtonMenuSmall variant="normal" actions={defaultActions} menuSide="bottom" menuAlign="end">
              Bottom + End
            </ButtonMenuSmall>
          </div>
        </div>

        <div>
          <h3 className="gs-typo-h3 mb-4">En haut, aligné à droite</h3>
          <div className="flex justify-end">
            <ButtonMenuSmall variant="normal" actions={defaultActions} menuSide="top" menuAlign="end">
              Top + End
            </ButtonMenuSmall>
          </div>
        </div>

        <div>
          <h3 className="gs-typo-h3 mb-4">Centré</h3>
          <ButtonMenuSmall variant="normal" actions={defaultActions} menuSide="bottom" menuAlign="center">
            Bottom + Center
          </ButtonMenuSmall>
        </div>

        <div>
          <h3 className="gs-typo-h3 mb-4">À droite, aligné en haut</h3>
          <ButtonMenuSmall variant="normal" actions={defaultActions} menuSide="right" menuAlign="start">
            Right + Start
          </ButtonMenuSmall>
        </div>

        <div>
          <h3 className="gs-typo-h3 mb-4">À gauche, aligné en haut</h3>
          <ButtonMenuSmall variant="normal" actions={defaultActions} menuSide="left" menuAlign="start">
            Left + Start
          </ButtonMenuSmall>
        </div>
      </VStack>
    </Layout>
  ),
  parameters: {
    layout: "fullscreen",
  },
}

