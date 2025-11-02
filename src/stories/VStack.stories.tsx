import type { Meta, StoryObj } from '@storybook/react';
import { VStack, HStack } from '../components/layout';

const meta = {
  title: 'Layout/VStack',
  component: VStack,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `VStack component built with the Figma design system. VStack is a vertical flexbox container that arranges children in a column with configurable spacing.

## Features
- Vertical flexbox layout (flex-col)
- Configurable spacing between children (gap)
- Horizontal alignment control (align items)
- Vertical distribution control (justify content)
- Background context support (white, grey, black)
- Padding support using spacing primitives
- Scroll support for overflow content
- Automatic context-aware styling via \`data-bg\` mechanism

## Basic Usage

\`\`\`tsx
import { VStack } from '@story-gs-react';

<VStack gap={6}>
  <h1>Title</h1>
  <p>Description</p>
  <Button>Action</Button>
</VStack>
\`\`\`

## Gap Spacing

The \`gap\` prop controls the vertical spacing between children. Values correspond to spacing primitives (0-100):

\`\`\`tsx
<VStack gap={2}>  {/* 10px spacing */}
  <Button>Item 1</Button>
  <Button>Item 2</Button>
</VStack>

<VStack gap={4}>  {/* 20px spacing */}
  <Button>Item 1</Button>
  <Button>Item 2</Button>
</VStack>

<VStack gap={8}>  {/* 40px spacing */}
  <Button>Item 1</Button>
  <Button>Item 2</Button>
</VStack>
\`\`\`

**Available gap values:** 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 28, 30, 32, 36, 40, 44, 48, 50, 52, 56, 60, 64, 68, 70, 72, 80, 90, 100

## Horizontal Alignment (align)

The \`align\` prop controls how children are aligned horizontally (cross-axis):

\`\`\`tsx
<VStack align="start">    {/* Left alignment */}
<VStack align="center">   {/* Center alignment */}
<VStack align="end">      {/* Right alignment */}
<VStack align="stretch">  {/* Stretch to fill width (default) */}
<VStack align="baseline"> {/* Baseline alignment */}
\`\`\`

**Available align values:** \`start\`, \`center\`, \`end\`, \`baseline\`, \`stretch\` (default: \`stretch\`)

## Vertical Distribution (justify)

The \`justify\` prop controls how children are distributed vertically (main axis):

\`\`\`tsx
<VStack justify="start">    {/* Top alignment */}
<VStack justify="center">   {/* Center alignment */}
<VStack justify="end">      {/* Bottom alignment */}
<VStack justify="between"> {/* Space between items */}
<VStack justify="around">   {/* Space around items */}
<VStack justify="evenly">   {/* Equal space between items */}
\`\`\`

**Available justify values:** \`start\` (default), \`center\`, \`end\`, \`between\`, \`around\`, \`evenly\`

## Background Contexts

VStack supports background contexts that automatically adapt child component styling:

\`\`\`tsx
<VStack bg="white" gap={4}>
  <Button>White background</Button>
</VStack>

<VStack bg="grey" gap={4}>
  <Button>Grey background</Button>
</VStack>

<VStack bg="black" gap={4}>
  <Button>Black background</Button>
</VStack>
\`\`\`

**Available background values:** \`white\`, \`grey\`, \`black\`

## Scroll Support

VStack inherits scroll behavior from Layout. Use the \`scroll\` prop for overflow content:

\`\`\`tsx
<VStack gap={2} scroll="vertical" className="h-64">
  {items.map(item => (
    <Card key={item.id} {...item} />
  ))}
</VStack>
\`\`\`

**Available scroll values:** \`none\`, \`auto\`, \`always\`, \`vertical\`, \`horizontal\`, \`both\`

## Common Use Cases

### Card Layout
\`\`\`tsx
<VStack bg="white" padding={6} gap={4} className="rounded-lg shadow-md">
  <h2 className="gs-typo-h2">Card Title</h2>
  <p>Card description</p>
  <HStack gap={2} justify="end">
    <Button variant="secondary">Cancel</Button>
    <Button variant="normal">Save</Button>
  </HStack>
</VStack>
\`\`\`

### Form Layout
\`\`\`tsx
<VStack gap={6} padding={8}>
  <h2 className="gs-typo-h2">Form Title</h2>
  <VStack gap={4}>
    <Input label="Name" />
    <Input label="Email" />
    <Textarea label="Message" />
  </VStack>
  <Button variant="normal">Submit</Button>
</VStack>
\`\`\`

### Scrollable List
\`\`\`tsx
<VStack gap={2} scroll="vertical" className="h-screen">
  {items.map(item => (
    <ListItem key={item.id} {...item} />
  ))}
</VStack>
\`\`\`

### Hero Section
\`\`\`tsx
<VStack
  bg="black"
  padding={16}
  gap={6}
  align="center"
  justify="center"
  className="min-h-[400px]"
>
  <h1 className="gs-typo-h1 text-white">Welcome</h1>
  <p className="text-grey-light">Description</p>
  <HStack gap={4}>
    <Button variant="normal">Get Started</Button>
    <Button variant="outline">Learn More</Button>
  </HStack>
</VStack>
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
      description: 'Horizontal alignment of children (cross-axis). Default: stretch',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Vertical distribution of children (main axis). Default: start',
    },
    padding: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 28, 30, 32, 36, 40, 44, 48, 50, 52, 56, 60, 64, 68, 70, 72, 80, 90, 100],
      description: 'Padding value (uses spacing primitives: 0-100)',
    },
    scroll: {
      control: 'select',
      options: ['none', 'auto', 'always', 'vertical', 'horizontal', 'both'],
      description: 'Scroll behavior for overflow content',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes',
    },
  },
} satisfies Meta<typeof VStack>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component for demo boxes
const Box = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-4 py-2 bg-green-primary rounded text-center ${className}`}>
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
    <HStack gap={4}>
      <div>
        <p className="text-sm text-grey-stronger mb-2">Gap 0</p>
        <VStack gap={0} bg="white" padding={2} className="border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </VStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Gap 2 (10px)</p>
        <VStack gap={2} bg="white" padding={2} className="border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </VStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Gap 4 (20px)</p>
        <VStack gap={4} bg="white" padding={2} className="border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </VStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Gap 8 (40px)</p>
        <VStack gap={8} bg="white" padding={2} className="border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </VStack>
      </div>
    </HStack>
  ),
};

export const AlignmentHorizontal: Story = {
  render: () => (
    <HStack gap={4}>
      <div className="flex-1">
        <p className="text-sm text-grey-stronger mb-2">Align: start</p>
        <VStack gap={2} align="start" bg="white" padding={4} className="border border-grey-strong">
          <Box className="px-8">Small</Box>
          <Box className="px-16">Medium</Box>
          <Box className="px-24">Large</Box>
        </VStack>
      </div>

      <div className="flex-1">
        <p className="text-sm text-grey-stronger mb-2">Align: center</p>
        <VStack gap={2} align="center" bg="white" padding={4} className="border border-grey-strong">
          <Box className="px-8">Small</Box>
          <Box className="px-16">Medium</Box>
          <Box className="px-24">Large</Box>
        </VStack>
      </div>

      <div className="flex-1">
        <p className="text-sm text-grey-stronger mb-2">Align: end</p>
        <VStack gap={2} align="end" bg="white" padding={4} className="border border-grey-strong">
          <Box className="px-8">Small</Box>
          <Box className="px-16">Medium</Box>
          <Box className="px-24">Large</Box>
        </VStack>
      </div>

      <div className="flex-1">
        <p className="text-sm text-grey-stronger mb-2">Align: stretch</p>
        <VStack gap={2} align="stretch" bg="white" padding={4} className="border border-grey-strong">
          <Box>Small</Box>
          <Box>Medium</Box>
          <Box>Large</Box>
        </VStack>
      </div>
    </HStack>
  ),
};

export const JustifyContent: Story = {
  render: () => (
    <HStack gap={4}>
      <div>
        <p className="text-sm text-grey-stronger mb-2">Justify: start</p>
        <VStack gap={2} justify="start" bg="white" padding={4} className="h-64 border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </VStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Justify: center</p>
        <VStack gap={2} justify="center" bg="white" padding={4} className="h-64 border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </VStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Justify: end</p>
        <VStack gap={2} justify="end" bg="white" padding={4} className="h-64 border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </VStack>
      </div>

      <div>
        <p className="text-sm text-grey-stronger mb-2">Justify: between</p>
        <VStack gap={2} justify="between" bg="white" padding={4} className="h-64 border border-grey-strong">
          <Box>A</Box>
          <Box>B</Box>
          <Box>C</Box>
        </VStack>
      </div>
    </HStack>
  ),
};

export const BackgroundContexts: Story = {
  render: () => (
    <HStack gap={4}>
      <VStack gap={2} bg="white" padding={4} className="flex-1">
        <Box>White</Box>
        <Box>Background</Box>
        <Box>Context</Box>
      </VStack>

      <VStack gap={2} bg="grey" padding={4} className="flex-1">
        <Box>Grey</Box>
        <Box>Background</Box>
        <Box>Context</Box>
      </VStack>

      <VStack gap={2} bg="black" padding={4} className="flex-1">
        <Box className="bg-grey-light">Black</Box>
        <Box className="bg-grey-light">Background</Box>
        <Box className="bg-grey-light">Context</Box>
      </VStack>
    </HStack>
  ),
};

export const CardExample: Story = {
  render: () => (
    <VStack
      bg="white"
      padding={6}
      gap={4}
      className="max-w-sm rounded-lg shadow-md"
    >
      <div className="gs-typo-h2">Titre de la carte</div>
      <p className="text-sm text-grey-stronger">
        Description de la carte avec du contenu intéressant.
      </p>
      <HStack gap={2} justify="end">
        <button className="px-4 py-2 text-sm bg-grey-light rounded hover:bg-grey-strong">
          Annuler
        </button>
        <button className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-grey-strongest">
          Confirmer
        </button>
      </HStack>
    </VStack>
  ),
};

export const FormExample: Story = {
  render: () => (
    <VStack
      bg="white"
      padding={8}
      gap={6}
      className="max-w-md rounded-lg shadow-md"
    >
      <div className="gs-typo-h2">Formulaire</div>

      <VStack gap={2}>
        <label className="text-sm font-medium">Nom</label>
        <input
          type="text"
          placeholder="Votre nom"
          className="px-3 py-2 border border-grey-strong rounded focus:outline-none focus:border-black"
        />
      </VStack>

      <VStack gap={2}>
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="votre@email.com"
          className="px-3 py-2 border border-grey-strong rounded focus:outline-none focus:border-black"
        />
      </VStack>

      <VStack gap={2}>
        <label className="text-sm font-medium">Message</label>
        <textarea
          rows={4}
          placeholder="Votre message"
          className="px-3 py-2 border border-grey-strong rounded focus:outline-none focus:border-black resize-none"
        />
      </VStack>

      <button className="w-full py-2 bg-black text-white rounded hover:bg-grey-strongest">
        Envoyer
      </button>
    </VStack>
  ),
};

export const WithScroll: Story = {
  render: () => (
    <VStack
      bg="white"
      padding={4}
      gap={2}
      scroll="vertical"
      className="h-64 border border-grey-strong rounded-lg"
    >
      <div className="gs-typo-h3">Liste scrollable</div>
      {Array.from({ length: 30 }).map((_, i) => (
        <Box key={i}>Item {i + 1}</Box>
      ))}
    </VStack>
  ),
};

export const HeroSection: Story = {
  render: () => (
    <VStack
      bg="black"
      padding={16}
      gap={6}
      align="center"
      className="min-h-[400px]"
      justify="center"
    >
      <h1 className="gs-typo-h1 text-white text-4xl">
        Bienvenue sur notre plateforme
      </h1>
      <p className="text-grey-light text-lg max-w-2xl text-center">
        Découvrez une nouvelle façon de gérer vos projets avec des outils
        puissants et intuitifs.
      </p>
      <HStack gap={4}>
        <button className="px-6 py-3 bg-white text-black rounded hover:bg-grey-light">
          Commencer
        </button>
        <button className="px-6 py-3 border border-white text-white rounded hover:bg-white hover:text-black">
          En savoir plus
        </button>
      </HStack>
    </VStack>
  ),
};

export const CombinedWithHStack: Story = {
  render: () => (
    <VStack bg="grey" padding={8} gap={6} className="min-h-screen">
      <div className="gs-typo-h1">Dashboard</div>

      {/* Stats row */}
      <HStack gap={4}>
        {['Total', 'En cours', 'Terminés'].map((label) => (
          <VStack
            key={label}
            bg="white"
            padding={6}
            gap={2}
            align="center"
            className="flex-1 rounded-lg"
          >
            <span className="text-sm text-grey-stronger">{label}</span>
            <span className="text-2xl font-bold">1,234</span>
          </VStack>
        ))}
      </HStack>

      {/* Content */}
      <VStack bg="white" padding={6} gap={4} className="rounded-lg">
        <div className="gs-typo-h3">Activité récente</div>
        <VStack gap={2}>
          {Array.from({ length: 5 }).map((_, i) => (
            <HStack
              key={i}
              gap={4}
              justify="between"
              padding={3}
              className="border-b border-grey-light last:border-0"
            >
              <span>Action {i + 1}</span>
              <span className="text-sm text-grey-stronger">Il y a 2h</span>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </VStack>
  ),
};
