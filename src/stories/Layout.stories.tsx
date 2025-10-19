import type { Meta, StoryObj } from '@storybook/react';
import { Layout, HStack, VStack } from '../components/layout';

const meta = {
  title: 'Layout/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Composant Layout pour gérer les contextes de couleurs et la disposition. Permet de définir le contexte de couleur (white/grey/black) pour les composants shadcn enfants.',
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
    scroll: {
      control: 'select',
      options: ['none', 'auto', 'always', 'vertical', 'horizontal', 'both'],
      description: 'Comportement du scroll',
    },
    padding: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 28, 30, 32, 36, 40, 44, 48, 50, 52, 56, 60, 64, 68, 70, 72, 80, 90, 100],
      description: 'Padding du layout (utilise les primitives spacing)',
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'main', 'aside', 'header', 'footer'],
      description: 'Élément HTML à rendre',
    },
  },
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    bg: 'white',
    padding: 6,
    children: (
      <div className="text-center">
        <h2 className="gs-typo-h2 mb-4">Layout par défaut</h2>
        <p className="text-sm text-grey-stronger">
          Fond blanc avec padding de 30px (spacing6)
        </p>
      </div>
    ),
  },
};

export const BackgroundContexts: Story = {
  render: () => (
    <VStack gap={0}>
      <Layout bg="white" padding={8}>
        <div className="text-center">
          <h2 className="gs-typo-h2 mb-2">Contexte White</h2>
          <p className="text-sm text-grey-stronger">
            Fond blanc (#ffffff)
          </p>
        </div>
      </Layout>

      <Layout bg="grey" padding={8}>
        <div className="text-center">
          <h2 className="gs-typo-h2 mb-2">Contexte Grey</h2>
          <p className="text-sm text-grey-stronger">
            Fond gris (#eaeaea)
          </p>
        </div>
      </Layout>

      <Layout bg="black" padding={8}>
        <div className="text-center">
          <h2 className="gs-typo-h2 text-white mb-2">Contexte Black</h2>
          <p className="text-sm text-grey-light">
            Fond noir (#292828)
          </p>
        </div>
      </Layout>
    </VStack>
  ),
};

export const WithScroll: Story = {
  render: () => (
    <HStack gap={4} padding={4}>
      {/* Vertical scroll */}
      <Layout
        bg="white"
        scroll="vertical"
        padding={4}
        className="h-64 border border-grey-strong rounded-lg"
      >
        <h3 className="gs-typo-h3 mb-4">Scroll Vertical</h3>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-sm mb-2">
            Ligne {i + 1}
          </p>
        ))}
      </Layout>

      {/* Horizontal scroll */}
      <Layout
        bg="white"
        scroll="horizontal"
        padding={4}
        className="w-64 border border-grey-strong rounded-lg"
      >
        <h3 className="gs-typo-h3 mb-4">Scroll Horizontal</h3>
        <HStack gap={2}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[100px] h-20 bg-grey rounded flex items-center justify-center"
            >
              {i + 1}
            </div>
          ))}
        </HStack>
      </Layout>

      {/* No scroll (hidden) */}
      <Layout
        bg="white"
        scroll="none"
        padding={4}
        className="h-64 w-64 border border-grey-strong rounded-lg"
      >
        <h3 className="gs-typo-h3 mb-4">Pas de scroll</h3>
        <p className="text-sm">
          Le contenu qui dépasse est masqué (overflow-hidden)
        </p>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-xs">
            Ligne masquée {i + 1}
          </p>
        ))}
      </Layout>
    </HStack>
  ),
};

export const NestedLayouts: Story = {
  render: () => (
    <Layout bg="grey" className="min-h-screen">
      {/* Header white */}
      <Layout
        bg="white"
        as="header"
        padding={4}
        className="border-b border-grey-strong"
      >
        <HStack justify="between" align="center">
          <h1 className="gs-typo-h1">Mon Application</h1>
          <HStack gap={2}>
            <div className="px-4 py-2 bg-grey-light rounded">Notifications</div>
            <div className="px-4 py-2 bg-grey-light rounded">Profil</div>
          </HStack>
        </HStack>
      </Layout>

      {/* Main content grey */}
      <Layout bg="grey" as="main" padding={8}>
        <VStack gap={6}>
          {/* Hero black */}
          <Layout bg="black" padding={8} className="rounded-lg">
            <VStack gap={4} align="center">
              <h2 className="gs-typo-h1 text-white">Section Hero</h2>
              <p className="text-grey-light">Sur fond noir</p>
            </VStack>
          </Layout>

          {/* Cards grid white */}
          <Layout bg="white" padding={6} className="rounded-lg">
            <h3 className="gs-typo-h3 mb-4">Grille de cartes</h3>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 bg-grey-light rounded text-center"
                >
                  Carte {i + 1}
                </div>
              ))}
            </div>
          </Layout>
        </VStack>
      </Layout>

      {/* Footer black */}
      <Layout
        bg="black"
        as="footer"
        padding={6}
        className="border-t border-grey-strongest"
      >
        <HStack justify="between" align="center">
          <p className="text-white text-sm">© 2025 Mon Application</p>
          <HStack gap={4}>
            <a href="#" className="text-grey-light text-sm hover:text-white">
              À propos
            </a>
            <a href="#" className="text-grey-light text-sm hover:text-white">
              Contact
            </a>
          </HStack>
        </HStack>
      </Layout>
    </Layout>
  ),
};

export const FlexboxExamples: Story = {
  render: () => (
    <VStack gap={4} padding={4}>
      {/* Flex row with justify-between */}
      <Layout bg="white" padding={4} className="flex justify-between items-center border border-grey-strong rounded-lg">
        <span>Gauche</span>
        <span>Centre</span>
        <span>Droite</span>
      </Layout>

      {/* Flex col with align-center */}
      <Layout bg="white" padding={4} className="flex flex-col items-center gap-2 border border-grey-strong rounded-lg">
        <div className="w-20 h-20 bg-grey-light rounded" />
        <span className="text-sm">Centré verticalement</span>
      </Layout>

      {/* Grid */}
      <Layout bg="white" padding={4} className="grid grid-cols-4 gap-2 border border-grey-strong rounded-lg">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 bg-grey-light rounded flex items-center justify-center">
            {i + 1}
          </div>
        ))}
      </Layout>
    </VStack>
  ),
};
