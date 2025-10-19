import type { Meta, StoryObj } from '@storybook/react';
import { HStack } from '../components/layout';

const meta = {
  title: 'Layout/HStack',
  component: HStack,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Stack horizontal (Flexbox row) - Correspond à Figma Auto Layout horizontal. Dispose les enfants horizontalement côte à côte avec un espacement défini.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    bg: {
      control: 'select',
      options: ['white', 'grey', 'black'],
      description: 'Contexte de couleur de fond',
    },
    gap: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 28, 30, 32, 36, 40, 44, 48, 50, 52, 56, 60, 64, 68, 70, 72, 80, 90, 100],
      description: 'Espacement entre les enfants',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'baseline', 'stretch'],
      description: 'Alignement vertical (axe secondaire)',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Alignement horizontal (axe principal)',
    },
    padding: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 28, 30, 32, 36, 40, 44, 48, 50, 52, 56, 60, 64, 68, 70, 72, 80, 90, 100],
      description: 'Padding du stack',
    },
  },
} satisfies Meta<typeof HStack>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component for demo boxes
const Box = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-4 py-2 bg-blue-primary rounded text-center ${className}`}>
    {children}
  </div>
);

export const Default: Story = {
  args: {
    gap: 4,
    children: (
      <>
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
      </>
    ),
  },
};

export const WithGap: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-grey-stronger mb-2">Gap 0 (pas d'espacement)</p>
        <HStack gap={0} bg="white" padding={2}>
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Gap 2 (10px)</p>
        <HStack gap={2} bg="white" padding={2}>
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Gap 4 (20px)</p>
        <HStack gap={4} bg="white" padding={2}>
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Gap 8 (40px)</p>
        <HStack gap={8} bg="white" padding={2}>
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </HStack>
      </div>
    </div>
  ),
};

export const AlignmentVertical: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-grey-stronger mb-2">Align: start</p>
        <HStack gap={4} align="start" bg="white" padding={4} className="h-32 border border-grey-strong">
          <Box>Small</Box>
          <Box className="py-8">Medium</Box>
          <Box className="py-12">Large</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Align: center</p>
        <HStack gap={4} align="center" bg="white" padding={4} className="h-32 border border-grey-strong">
          <Box>Small</Box>
          <Box className="py-8">Medium</Box>
          <Box className="py-12">Large</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Align: end</p>
        <HStack gap={4} align="end" bg="white" padding={4} className="h-32 border border-grey-strong">
          <Box>Small</Box>
          <Box className="py-8">Medium</Box>
          <Box className="py-12">Large</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Align: stretch (étire tous les items)</p>
        <HStack gap={4} align="stretch" bg="white" padding={4} className="h-32 border border-grey-strong">
          <Box className="flex items-center">Small</Box>
          <Box className="flex items-center">Medium</Box>
          <Box className="flex items-center">Large</Box>
        </HStack>
      </div>
    </div>
  ),
};

export const JustifyContent: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-grey-stronger mb-2">Justify: start</p>
        <HStack gap={2} justify="start" bg="white" padding={4} className="border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Justify: center</p>
        <HStack gap={2} justify="center" bg="white" padding={4} className="border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Justify: end</p>
        <HStack gap={2} justify="end" bg="white" padding={4} className="border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Justify: between (espace entre les items)</p>
        <HStack gap={2} justify="between" bg="white" padding={4} className="border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Justify: around (espace autour des items)</p>
        <HStack gap={2} justify="around" bg="white" padding={4} className="border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </HStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Justify: evenly (espace uniforme)</p>
        <HStack gap={2} justify="evenly" bg="white" padding={4} className="border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </HStack>
      </div>
    </div>
  ),
};

export const BackgroundContexts: Story = {
  render: () => (
    <div className="space-y-4">
      <HStack gap={4} bg="white" padding={4}>
        <Box>White</Box>
        <Box>Background</Box>
        <Box>Context</Box>
      </HStack>

      <HStack gap={4} bg="grey" padding={4}>
        <Box>Grey</Box>
        <Box>Background</Box>
        <Box>Context</Box>
      </HStack>

      <HStack gap={4} bg="black" padding={4}>
        <Box className="bg-grey-light">Black</Box>
        <Box className="bg-grey-light">Background</Box>
        <Box className="bg-grey-light">Context</Box>
      </HStack>
    </div>
  ),
};

export const WithWrap: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-grey-stronger mb-2">Sans wrap (déborde)</p>
        <HStack gap={2} bg="white" padding={4} className="w-96 border border-grey-strong">
          {Array.from({ length: 10 }).map((_, i) => (
            <Box key={i}>Item {i + 1}</Box>
          ))}
        </HStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Avec wrap (retour à la ligne)</p>
        <HStack gap={2} wrap bg="white" padding={4} className="w-96 border border-grey-strong">
          {Array.from({ length: 10 }).map((_, i) => (
            <Box key={i}>Item {i + 1}</Box>
          ))}
        </HStack>
      </div>
    </div>
  ),
};

export const HeaderExample: Story = {
  render: () => (
    <HStack
      bg="white"
      padding={4}
      justify="between"
      align="center"
      className="border-b border-grey-strong"
    >
      <div className="gs-typo-h2">Mon Application</div>
      <HStack gap={2}>
        <Box>Notifications</Box>
        <Box>Profil</Box>
      </HStack>
    </HStack>
  ),
};

export const ButtonGroup: Story = {
  render: () => (
    <HStack gap={2} bg="grey" padding={4}>
      <button className="px-4 py-2 bg-white rounded hover:bg-grey-light">
        Annuler
      </button>
      <button className="px-4 py-2 bg-black text-white rounded hover:bg-grey-strongest">
        Confirmer
      </button>
    </HStack>
  ),
};
