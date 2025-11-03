import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonMenuSmall, ButtonMenuAction } from "@/components/ui/button-menu-small"
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
- Same props and behavior as ButtonMenu

## Differences from ButtonMenu

The main difference is the dropdown menu styling:
- **ButtonMenu**: Uses \`gap-2\` and \`p-2\` for spacing between items
- **ButtonMenuSmall**: Uses \`gap-0\` and \`p-0\` for compact spacing

## Basic Usage

\`\`\`tsx
import { ButtonMenuSmall, Layout } from '@story-gs-react';

const actions: ButtonMenuAction[] = [
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
  },
} satisfies Meta<typeof ButtonMenuSmall>

export default meta
type Story = StoryObj<typeof meta>

const defaultActions: ButtonMenuAction[] = [
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
    const actionsWithDisabled: ButtonMenuAction[] = [
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

