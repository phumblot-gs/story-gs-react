import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonMenuStatus, ButtonMenuStatusOption } from "@/components/ui/button-menu-status"
import { Layout, VStack, HStack } from "@/components/layout"
import { MediaStatus } from "@/utils/mediaStatus"

const meta = {
  title: "UI/ButtonMenuStatus",
  component: ButtonMenuStatus,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `ButtonMenuStatus component that extends Toggle with a dropdown menu for changing media status. The toggle displays a Status icon and the menu shows MediaStatus indicators with labels.

## Features
- Built on Toggle component (inherits all Toggle/Button features)
- Displays a Status icon in a round toggle button
- Dropdown menu with MediaStatus indicators and customizable labels
- Visual feedback when menu is open (Toggle's isActive state)
- Size variants (small, medium, large) with appropriate icon sizes
- Automatic styling based on data-bg context (white, grey, black)
- Auto-positioning menu (drops where there's space)
- Customizable status options list (for workflow-specific statuses)

## Basic Usage

\`\`\`tsx
import { ButtonMenuStatus, MediaStatus } from '@story-gs-react';

const statusOptions: ButtonMenuStatusOption[] = [
  { status: MediaStatus.SELECTED, label: "Sélectionné" },
  { status: MediaStatus.VALIDATED, label: "Validé" },
  { status: MediaStatus.BROADCAST, label: "Diffusé" },
];

<Layout bg="white">
  <ButtonMenuStatus 
    currentStatus={MediaStatus.SELECTED}
    statusOptions={statusOptions}
  />
</Layout>
\`\`\`

## Size Variants

The toggle automatically adapts its size and icon size:
- **small**: \`p-1 w-4 h-4\` + Icon \`size={10}\`
- **medium**: \`p-0 w-6 h-6\` + Icon \`size={12}\` (default)
- **large**: \`p-0 w-8 h-8\` + Icon \`size={14}\`

## Customizable Labels

Labels can be customized for translation purposes:

\`\`\`tsx
const statusOptions: ButtonMenuStatusOption[] = [
  { status: MediaStatus.SELECTED, label: t("status.selected") },
  { status: MediaStatus.VALIDATED, label: t("status.validated") },
];
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
      description: "Toggle variant (inherited from Toggle)",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Toggle size (inherited from Toggle)",
    },
    disabled: {
      control: "boolean",
      description: "Disables the toggle and all status options",
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
} satisfies Meta<typeof ButtonMenuStatus>

export default meta
type Story = StoryObj<typeof meta>

const allStatusOptions: ButtonMenuStatusOption[] = [
  { status: MediaStatus.IGNORED, label: "Ignoré" },
  { status: MediaStatus.TO_RESHOOT, label: "À refaire" },
  { status: MediaStatus.NOT_SELECTED, label: "Non sélectionné" },
  { status: MediaStatus.SELECTED, label: "Sélectionné" },
  { status: MediaStatus.REFUSED_1, label: "Refusé" },
  { status: MediaStatus.SUBMITTED_FOR_APPROVAL, label: "Soumis pour approbation" },
  { status: MediaStatus.VALIDATED, label: "Validé" },
  { status: MediaStatus.READY_TO_BROADCAST, label: "Prêt à diffuser" },
  { status: MediaStatus.BROADCAST, label: "Diffusé" },
  { status: MediaStatus.ARCHIVED, label: "Archivé" },
]

const workflowStatusOptions: ButtonMenuStatusOption[] = [
  { status: MediaStatus.SELECTED, label: "Sélectionné" },
  { status: MediaStatus.SUBMITTED_FOR_APPROVAL, label: "Soumis pour approbation" },
  { status: MediaStatus.VALIDATED, label: "Validé" },
]

export const Default: Story = {
  render: (args) => (
    <Layout bg="white" padding={6}>
      <ButtonMenuStatus {...args} currentStatus={MediaStatus.SELECTED} statusOptions={allStatusOptions} />
    </Layout>
  ),
  args: {
    variant: "normal",
    size: "medium",
  },
}

export const AllSizes: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <HStack gap={3} align="center">
          <ButtonMenuStatus
            currentStatus={MediaStatus.SELECTED}
            statusOptions={allStatusOptions}
            size="small"
          />
          <ButtonMenuStatus
            currentStatus={MediaStatus.VALIDATED}
            statusOptions={allStatusOptions}
            size="medium"
          />
          <ButtonMenuStatus
            currentStatus={MediaStatus.BROADCAST}
            statusOptions={allStatusOptions}
            size="large"
          />
        </HStack>
      </VStack>
    </Layout>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <VStack gap={6} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background White</h3>
        <HStack gap={3}>
          <ButtonMenuStatus
            currentStatus={MediaStatus.SELECTED}
            statusOptions={workflowStatusOptions}
            variant="normal"
          />
          <ButtonMenuStatus
            currentStatus={MediaStatus.SELECTED}
            statusOptions={workflowStatusOptions}
            variant="secondary"
          />
          <ButtonMenuStatus
            currentStatus={MediaStatus.SELECTED}
            statusOptions={workflowStatusOptions}
            variant="ghost"
          />
          <ButtonMenuStatus
            currentStatus={MediaStatus.SELECTED}
            statusOptions={workflowStatusOptions}
            variant="outline"
          />
        </HStack>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background Grey</h3>
        <HStack gap={3}>
          <ButtonMenuStatus
            currentStatus={MediaStatus.VALIDATED}
            statusOptions={workflowStatusOptions}
            variant="normal"
          />
          <ButtonMenuStatus
            currentStatus={MediaStatus.VALIDATED}
            statusOptions={workflowStatusOptions}
            variant="secondary"
          />
          <ButtonMenuStatus
            currentStatus={MediaStatus.VALIDATED}
            statusOptions={workflowStatusOptions}
            variant="ghost"
          />
          <ButtonMenuStatus
            currentStatus={MediaStatus.VALIDATED}
            statusOptions={workflowStatusOptions}
            variant="outline"
          />
        </HStack>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3 text-white">Background Black</h3>
        <HStack gap={3}>
          <ButtonMenuStatus
            currentStatus={MediaStatus.BROADCAST}
            statusOptions={workflowStatusOptions}
            variant="normal"
          />
          <ButtonMenuStatus
            currentStatus={MediaStatus.BROADCAST}
            statusOptions={workflowStatusOptions}
            variant="secondary"
          />
          <ButtonMenuStatus
            currentStatus={MediaStatus.BROADCAST}
            statusOptions={workflowStatusOptions}
            variant="ghost"
          />
          <ButtonMenuStatus
            currentStatus={MediaStatus.BROADCAST}
            statusOptions={workflowStatusOptions}
            variant="outline"
          />
        </HStack>
      </VStack>
    </VStack>
  ),
  parameters: {
    layout: "fullscreen",
  },
}

export const WithManyStatuses: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <div>
          <p className="text-sm text-grey-stronger mb-2">
            Menu avec tous les statuts disponibles (hauteur limitée à 40vh)
          </p>
          <ButtonMenuStatus
            currentStatus={MediaStatus.SELECTED}
            statusOptions={allStatusOptions}
            menuMaxHeight="max-h-[40vh]"
          />
        </div>
      </VStack>
    </Layout>
  ),
}

export const WorkflowSpecific: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <div>
          <p className="text-sm text-grey-stronger mb-2">
            Exemple avec statuts spécifiques à un workflow
          </p>
          <ButtonMenuStatus
            currentStatus={MediaStatus.SELECTED}
            statusOptions={workflowStatusOptions}
          />
        </div>
      </VStack>
    </Layout>
  ),
}

export const WithDisabledStatuses: Story = {
  render: () => {
    const optionsWithDisabled: ButtonMenuStatusOption[] = [
      { status: MediaStatus.SELECTED, label: "Sélectionné" },
      { status: MediaStatus.SUBMITTED_FOR_APPROVAL, label: "Soumis pour approbation", disabled: true },
      { status: MediaStatus.VALIDATED, label: "Validé" },
      { status: MediaStatus.BROADCAST, label: "Diffusé", disabled: true },
    ]

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <ButtonMenuStatus
            currentStatus={MediaStatus.SELECTED}
            statusOptions={optionsWithDisabled}
          />
          <ButtonMenuStatus
            currentStatus={MediaStatus.SELECTED}
            statusOptions={optionsWithDisabled}
            disabled
          />
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
        <ButtonMenuStatus
          currentStatus={MediaStatus.SELECTED}
          statusOptions={allStatusOptions}
          debug
        />
      </VStack>
    </Layout>
  ),
}

