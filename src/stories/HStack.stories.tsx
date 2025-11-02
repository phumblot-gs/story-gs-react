import type { Meta, StoryObj } from '@storybook/react';
import { HStack } from '../components/layout';

const meta = {
  title: 'Layout/HStack',
  component: HStack,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `HStack component built with the Figma design system. HStack is a horizontal flexbox container that arranges children side by side with configurable spacing.

## Features
- Horizontal flexbox layout (flex-row)
- Configurable spacing between children (gap)
- Vertical alignment control (align items)
- Horizontal distribution control (justify content)
- Background context support (white, grey, black)
- Padding support using spacing primitives
- Wrap support for responsive layouts
- Automatic context-aware styling via \`data-bg\` mechanism

## Basic Usage

\`\`\`tsx
import { HStack } from '@story-gs-react';

<HStack gap={4}>
  <Button>Action 1</Button>
  <Button>Action 2</Button>
  <Button>Action 3</Button>
</HStack>
\`\`\`

## Gap Spacing

The \`gap\` prop controls the horizontal spacing between children. Values correspond to spacing primitives (0-100):

\`\`\`tsx
<HStack gap={2}>  {/* 10px spacing */}
  <Button>Item 1</Button>
  <Button>Item 2</Button>
</HStack>

<HStack gap={4}>  {/* 20px spacing */}
  <Button>Item 1</Button>
  <Button>Item 2</Button>
</HStack>

<HStack gap={8}>  {/* 40px spacing */}
  <Button>Item 1</Button>
  <Button>Item 2</Button>
</HStack>
\`\`\`

**Available gap values:** 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 28, 30, 32, 36, 40, 44, 48, 50, 52, 56, 60, 64, 68, 70, 72, 80, 90, 100

## Vertical Alignment (align)

The \`align\` prop controls how children are aligned vertically (cross-axis):

\`\`\`tsx
<HStack align="start">    {/* Top alignment */}
<HStack align="center">   {/* Center alignment */}
<HStack align="end">      {/* Bottom alignment */}
<HStack align="stretch">  {/* Stretch to fill height */}
<HStack align="baseline"> {/* Baseline alignment */}
\`\`\`

**Available align values:** \`start\`, \`center\`, \`end\`, \`baseline\`, \`stretch\` (default: \`stretch\`)

## Horizontal Distribution (justify)

The \`justify\` prop controls how children are distributed horizontally (main axis):

\`\`\`tsx
<HStack justify="start">    {/* Left alignment */}
<HStack justify="center">   {/* Center alignment */}
<HStack justify="end">      {/* Right alignment */}
<HStack justify="between"> {/* Space between items */}
<HStack justify="around">   {/* Space around items */}
<HStack justify="evenly">   {/* Equal space between items */}
\`\`\`

**Available justify values:** \`start\` (default), \`center\`, \`end\`, \`between\`, \`around\`, \`evenly\`

## Background Contexts

HStack supports background contexts that automatically adapt child component styling:

\`\`\`tsx
<HStack bg="white" gap={4}>
  <Button>White background</Button>
</HStack>

<HStack bg="grey" gap={4}>
  <Button>Grey background</Button>
</HStack>

<HStack bg="black" gap={4}>
  <Button>Black background</Button>
</HStack>
\`\`\`

**Available background values:** \`white\`, \`grey\`, \`black\`

## Wrap Support

Use the \`wrap\` prop to allow items to wrap to the next line on smaller screens:

\`\`\`tsx
<HStack gap={2} wrap>
  {items.map(item => (
    <Button key={item.id}>{item.label}</Button>
  ))}
</HStack>
\`\`\`

## Common Use Cases

### Header Navigation
\`\`\`tsx
<HStack
  bg="white"
  padding={4}
  justify="between"
  align="center"
>
  <Logo />
  <Navigation />
  <UserMenu />
</HStack>
\`\`\`

### Button Group
\`\`\`tsx
<HStack gap={2}>
  <Button variant="secondary">Cancel</Button>
  <Button variant="normal">Save</Button>
</HStack>
\`\`\`

### Responsive Card Row
\`\`\`tsx
<HStack gap={4} wrap className="w-full">
  {cards.map(card => <Card key={card.id} {...card} />)}
</HStack>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    bg: {
      control: 'select',
      options: ['white', 'grey', 'black'],
      description: 'Background color context (white, grey, black). Automatically sets data-bg attribute for child components.',
    },
    gap: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 28, 30, 32, 36, 40, 44, 48, 50, 52, 56, 60, 64, 68, 70, 72, 80, 90, 100],
      description: 'Spacing between children (uses spacing primitives: 0-100)',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'baseline', 'stretch'],
      description: 'Vertical alignment of children (cross-axis). Default: stretch',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Horizontal distribution of children (main axis). Default: start',
    },
    padding: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 28, 30, 32, 36, 40, 44, 48, 50, 52, 56, 60, 64, 68, 70, 72, 80, 90, 100],
      description: 'Padding value (uses spacing primitives: 0-100)',
    },
    wrap: {
      control: 'boolean',
      description: 'Allow items to wrap to the next line (flex-wrap)',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes',
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
