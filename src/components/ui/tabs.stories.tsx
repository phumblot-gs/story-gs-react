import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Layout, VStack, HStack } from "@/components/layout";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Tabs component built with the Figma design system. The Tabs automatically inherits color context via \`data-bg\` from the parent Layout.

## Features
- Multiple tabs with automatic navigation buttons ("<" and ">") when needed
- Automatic context-aware styling based on parent background (white, grey, black)
- Uncontrolled component support (defaultValue, value/onValueChange)
- Event handlers (onValueChange)
- Debug mode for development
- Scroll to active tab automatically
- Radix UI primitives for accessibility

## Basic Usage

\`\`\`tsx
import { Tabs, TabsList, TabsTrigger, TabsContent, Layout } from '@story-gs-react';

<Layout bg="white">
  <Tabs defaultValue="plans">
    <TabsList>
      <TabsTrigger value="plans">Plans</TabsTrigger>
      <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
      <TabsTrigger value="pricing">Tarifs</TabsTrigger>
    </TabsList>
    <TabsContent value="plans">
      <div className="p-8">
        <p>Contenu Plans</p>
      </div>
    </TabsContent>
    <TabsContent value="features">
      <div className="p-8">
        <p>Contenu Fonctionnalités</p>
      </div>
    </TabsContent>
    <TabsContent value="pricing">
      <div className="p-8">
        <p>Contenu Tarifs</p>
      </div>
    </TabsContent>
  </Tabs>
</Layout>
\`\`\`

## Controlled vs Uncontrolled

Tabs supports both controlled and uncontrolled modes, similar to SegmentedControl:

**Uncontrolled (default):**
\`\`\`tsx
<Tabs defaultValue="plans">
  {/* ... */}
</Tabs>
\`\`\`

**Controlled:**
\`\`\`tsx
const [value, setValue] = useState("plans");

<Tabs value={value} onValueChange={setValue}>
  {/* ... */}
</Tabs>
\`\`\`

## Navigation Buttons

When tabs don't fit in the available width, navigation buttons ("<" and ">") automatically appear on the right side of the tabs to allow scrolling through them.

\`\`\`tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    {/* ... many more tabs ... */}
  </TabsList>
  {/* ... */}
</Tabs>
\`\`\`

## Debug Mode

The \`debug\` prop enables development mode with visual indicators and console logging:

\`\`\`tsx
<Tabs debug defaultValue="plans" onValueChange={(value) => console.log('Changed:', value)}>
  <TabsList debug>
    {/* ... */}
  </TabsList>
  {/* ... */}
</Tabs>
\`\`\`

When \`debug\` is enabled:
- A pink border appears around the Tabs component
- A label shows the currently active tab above TabsList
- All value changes are logged to the console with context information`,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <Story />
      </Layout>
    ),
  ],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'The default value of the tab to activate (uncontrolled mode)',
    },
    value: {
      control: 'text',
      description: 'The controlled value of the tab to activate',
    },
    onValueChange: {
      action: 'value changed',
      description: 'Callback function called when the active tab changes',
    },
    debug: {
      control: 'boolean',
      description: 'Debug mode: displays a label and logs value changes to the console',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes applied to the div.tabs-header (in TabsList, not on TabsPrimitive.Root)',
    },
  },
  args: {
    defaultValue: 'plans',
  },
  render: (args) => (
    <Tabs {...args} className="w-[403px]">
      <TabsList>
        <TabsTrigger value="plans">Plans</TabsTrigger>
        <TabsTrigger value="fonctionnalites">Fonctionnalités</TabsTrigger>
        <TabsTrigger value="tarifs">Tarifs</TabsTrigger>
      </TabsList>
      <TabsContent value="plans">
        <div className="p-8 space-y-4">
          <h3 className="text-[15px] font-bold uppercase">Gestion des plans</h3>
          <p className="text-[14px]">Gérer les plans, leurs fonctionnalités et leurs tarifs</p>
          <p className="text-[13px] leading-[19.5px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="fonctionnalites">
        <div className="p-8 space-y-4">
          <h3 className="text-[15px] font-bold uppercase">Fonctionnalités</h3>
          <p className="text-[13px] leading-[19.5px]">
            Contenu des fonctionnalités ici.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="tarifs">
        <div className="p-8 space-y-4">
          <h3 className="text-[15px] font-bold uppercase">Tarifs</h3>
          <p className="text-[13px] leading-[19.5px]">
            Contenu des tarifs ici.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 'plans',
  },
  render: (args) => (
    <Layout bg="white" padding={6}>
      <Tabs {...args} className="w-[403px]">
        <TabsList>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="fonctionnalites">Fonctionnalités</TabsTrigger>
          <TabsTrigger value="tarifs">Tarifs</TabsTrigger>
        </TabsList>
        <TabsContent value="plans">
          <div className="p-8 space-y-4">
            <h3 className="text-[15px] font-bold uppercase">Gestion des plans</h3>
            <p className="text-[14px]">Gérer les plans, leurs fonctionnalités et leurs tarifs</p>
            <p className="text-[13px] leading-[19.5px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="fonctionnalites">
          <div className="p-8 space-y-4">
            <h3 className="text-[15px] font-bold uppercase">Fonctionnalités</h3>
            <p className="text-[13px] leading-[19.5px]">
              Contenu des fonctionnalités ici.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="tarifs">
          <div className="p-8 space-y-4">
            <h3 className="text-[15px] font-bold uppercase">Tarifs</h3>
            <p className="text-[13px] leading-[19.5px]">
              Contenu des tarifs ici.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <VStack gap={8} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background White</h3>
        <Tabs defaultValue="plans" className="w-[403px]">
          <TabsList>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="fonctionnalites">Fonctionnalités</TabsTrigger>
            <TabsTrigger value="tarifs">Tarifs</TabsTrigger>
          </TabsList>
          <TabsContent value="plans">
            <div className="p-8">
              <p className="text-[13px]">Contenu Plans</p>
            </div>
          </TabsContent>
          <TabsContent value="fonctionnalites">
            <div className="p-8">
              <p className="text-[13px]">Contenu Fonctionnalités</p>
            </div>
          </TabsContent>
          <TabsContent value="tarifs">
            <div className="p-8">
              <p className="text-[13px]">Contenu Tarifs</p>
            </div>
          </TabsContent>
        </Tabs>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background Grey</h3>
        <Tabs defaultValue="plans" className="w-[403px]">
          <TabsList>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="fonctionnalites">Fonctionnalités</TabsTrigger>
            <TabsTrigger value="tarifs">Tarifs</TabsTrigger>
          </TabsList>
          <TabsContent value="plans">
            <div className="p-8">
              <p className="text-[13px]">Contenu Plans</p>
            </div>
          </TabsContent>
          <TabsContent value="fonctionnalites">
            <div className="p-8">
              <p className="text-[13px]">Contenu Fonctionnalités</p>
            </div>
          </TabsContent>
          <TabsContent value="tarifs">
            <div className="p-8">
              <p className="text-[13px]">Contenu Tarifs</p>
            </div>
          </TabsContent>
        </Tabs>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3 text-white">Background Black</h3>
        <Tabs defaultValue="plans" className="w-[403px]">
          <TabsList>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="fonctionnalites">Fonctionnalités</TabsTrigger>
            <TabsTrigger value="tarifs">Tarifs</TabsTrigger>
          </TabsList>
          <TabsContent value="plans">
            <div className="p-8">
              <p className="text-[13px] text-white">Contenu Plans</p>
            </div>
          </TabsContent>
          <TabsContent value="fonctionnalites">
            <div className="p-8">
              <p className="text-[13px] text-white">Contenu Fonctionnalités</p>
            </div>
          </TabsContent>
          <TabsContent value="tarifs">
            <div className="p-8">
              <p className="text-[13px] text-white">Contenu Tarifs</p>
            </div>
          </TabsContent>
        </Tabs>
      </VStack>
    </VStack>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const WithManyTabs: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3 mb-2">Navigation avec boutons</h3>
          <p className="text-sm text-grey-stronger mb-4">
            Quand tous les onglets ne peuvent pas être affichés simultanément, des boutons de navigation (&quot;&lt;&quot; et &quot;&gt;&quot;) apparaissent automatiquement à droite des onglets.
          </p>
        </div>
        <Tabs defaultValue="tab1" className="w-[403px]">
          <TabsList>
            <TabsTrigger value="tab1">Plans</TabsTrigger>
            <TabsTrigger value="tab2">Fonctionnalités</TabsTrigger>
            <TabsTrigger value="tab3">Tarifs</TabsTrigger>
            <TabsTrigger value="tab4">Tab 4</TabsTrigger>
            <TabsTrigger value="tab5">Tab 5</TabsTrigger>
            <TabsTrigger value="tab6">Tab 6</TabsTrigger>
            <TabsTrigger value="tab7">Tab 7</TabsTrigger>
            <TabsTrigger value="tab8">Tab 8</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="p-8">
              <p className="text-[13px]">Contenu de l'onglet 1</p>
            </div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="p-8">
              <p className="text-[13px]">Contenu de l'onglet 2</p>
            </div>
          </TabsContent>
          <TabsContent value="tab3">
            <div className="p-8">
              <p className="text-[13px]">Contenu de l'onglet 3</p>
            </div>
          </TabsContent>
          <TabsContent value="tab4">
            <div className="p-8">
              <p className="text-[13px]">Contenu de l'onglet 4</p>
            </div>
          </TabsContent>
          <TabsContent value="tab5">
            <div className="p-8">
              <p className="text-[13px]">Contenu de l'onglet 5</p>
            </div>
          </TabsContent>
          <TabsContent value="tab6">
            <div className="p-8">
              <p className="text-[13px]">Contenu de l'onglet 6</p>
            </div>
          </TabsContent>
          <TabsContent value="tab7">
            <div className="p-8">
              <p className="text-[13px]">Contenu de l'onglet 7</p>
            </div>
          </TabsContent>
          <TabsContent value="tab8">
            <div className="p-8">
              <p className="text-[13px]">Contenu de l'onglet 8</p>
            </div>
          </TabsContent>
        </Tabs>
      </VStack>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Tabs avec plusieurs onglets pour tester la navigation avec boutons.",
      },
    },
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState("plans");
    
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={6}>
          <div>
            <h3 className="gs-typo-h3 mb-2">Mode contrôlé</h3>
            <p className="text-sm text-grey-stronger mb-4">
              Utilisez <code>value</code> et <code>onValueChange</code> pour contrôler l'onglet actif.
            </p>
            <p className="text-sm text-grey-stronger mb-2">
              Onglet actif actuel : <strong>{value}</strong>
            </p>
          </div>
          <Tabs value={value} onValueChange={setValue} className="w-[403px]">
            <TabsList>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="fonctionnalites">Fonctionnalités</TabsTrigger>
              <TabsTrigger value="tarifs">Tarifs</TabsTrigger>
            </TabsList>
            <TabsContent value="plans">
              <div className="p-8">
                <p className="text-[13px]">Contenu Plans</p>
              </div>
            </TabsContent>
            <TabsContent value="fonctionnalites">
              <div className="p-8">
                <p className="text-[13px]">Contenu Fonctionnalités</p>
              </div>
            </TabsContent>
            <TabsContent value="tarifs">
              <div className="p-8">
                <p className="text-[13px]">Contenu Tarifs</p>
              </div>
            </TabsContent>
          </Tabs>
        </VStack>
      </Layout>
    );
  },
};

export const DebugMode: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3 mb-3">Mode Debug</h3>
          <p className="text-sm text-grey-stronger mb-4">
            La prop <code>debug</code> affiche un label au-dessus de TabsList et log les changements de valeur dans la console.
          </p>
        </div>

        <VStack gap={4}>
          <Tabs debug defaultValue="plans" onValueChange={(value) => console.log('Value changed:', value)} className="w-[403px]">
            <TabsList debug>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="fonctionnalites">Fonctionnalités</TabsTrigger>
              <TabsTrigger value="tarifs">Tarifs</TabsTrigger>
            </TabsList>
            <TabsContent value="plans">
              <div className="p-8">
                <p className="text-[13px]">Contenu Plans</p>
              </div>
            </TabsContent>
            <TabsContent value="fonctionnalites">
              <div className="p-8">
                <p className="text-[13px]">Contenu Fonctionnalités</p>
              </div>
            </TabsContent>
            <TabsContent value="tarifs">
              <div className="p-8">
                <p className="text-[13px]">Contenu Tarifs</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="p-4 bg-grey-lighter rounded">
            <p className="text-xs font-medium mb-2">Caractéristiques du mode debug :</p>
            <ul className="text-xs space-y-1 list-disc list-inside text-grey-stronger">
              <li>Bordure rose (ring-2 ring-pink) autour du composant Tabs</li>
              <li>Label au-dessus de TabsList affichant l'onglet actif</li>
              <li>Log dans la console avec toutes les informations de contexte lors du changement d'onglet</li>
              <li>onValueChange fonctionne normalement</li>
            </ul>
          </div>
        </VStack>
      </VStack>
    </Layout>
  ),
};

export const NestedLayouts: Story = {
  render: () => (
    <VStack gap={4} padding={6}>
      <h2 className="gs-typo-h2">Layouts imbriqués - Chaque niveau écrase le contexte parent</h2>

      {/* Niveau 1: White */}
      <Layout bg="white" padding={4} className="border-2 border-blue">
        <VStack gap={3}>
          <p className="text-sm font-medium">Layout bg="white" (niveau 1)</p>
          <Tabs defaultValue="tab1" className="w-[403px]">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">
              <div className="p-8">
                <p className="text-[13px]">Contenu Tab 1</p>
              </div>
            </TabsContent>
            <TabsContent value="tab2">
              <div className="p-8">
                <p className="text-[13px]">Contenu Tab 2</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Niveau 2: Grey - écrase white */}
          <Layout bg="grey" padding={4} className="border-2 border-green">
            <VStack gap={3}>
              <p className="text-sm font-medium">Layout bg="grey" (niveau 2 - écrase white)</p>
              <Tabs defaultValue="tab1" className="w-[403px]">
                <TabsList>
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">
                  <div className="p-8">
                    <p className="text-[13px]">Contenu Tab 1</p>
                  </div>
                </TabsContent>
                <TabsContent value="tab2">
                  <div className="p-8">
                    <p className="text-[13px]">Contenu Tab 2</p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Niveau 3: Black - écrase grey */}
              <Layout bg="black" padding={4} className="border-2 border-yellow">
                <VStack gap={3}>
                  <p className="text-sm font-medium text-white">Layout bg="black" (niveau 3 - écrase grey)</p>
                  <Tabs defaultValue="tab1" className="w-[403px]">
                    <TabsList>
                      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">
                      <div className="p-8">
                        <p className="text-[13px] text-white">Contenu Tab 1</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="tab2">
                      <div className="p-8">
                        <p className="text-[13px] text-white">Contenu Tab 2</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </VStack>
              </Layout>

              <p className="text-sm text-grey-stronger">↑ Tabs ci-dessus utilisent styles BLACK (contexte le plus proche)</p>
            </VStack>
          </Layout>

          <p className="text-sm text-grey-stronger">↑ Zone grise utilise styles GREY</p>
        </VStack>
      </Layout>

      <div className="p-4 bg-blue-primary rounded">
        <p className="text-sm font-medium">💡 Règle importante :</p>
        <ul className="text-xs mt-2 space-y-1 list-disc list-inside">
          <li>Chaque Layout avec <code>bg</code> crée un nouveau BgProvider React</li>
          <li>Le contexte enfant <strong>écrase</strong> toujours le contexte parent</li>
          <li>CSS utilise <code>[data-bg="..."]</code> de l'ancêtre le plus proche</li>
          <li>Aucun héritage en cascade - chaque niveau est isolé</li>
        </ul>
      </div>
    </VStack>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const CustomStyling: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3 mb-2">Personnalisation avec className</h3>
          <p className="text-sm text-grey-stronger mb-4">
            Le prop <code>className</code> sur <code>Tabs</code> s'applique à la <code>div.tabs-header</code> (dans TabsList).
            Le prop <code>className</code> sur <code>TabsList</code> s'applique au <code>TabsPrimitive.List</code>.
          </p>
        </div>

        <VStack gap={8}>
          {/* Exemple 1: Grid layout */}
          <div>
            <h4 className="text-sm font-medium mb-2">Exemple 1 : Grid layout sur tabs-list</h4>
            <p className="text-xs text-grey-stronger mb-3">
              <code>className="w-full"</code> sur Tabs (appliqué à div.tabs-header) + 
              <code>className="grid grid-cols-3 gap-4"</code> sur TabsList (appliqué à TabsPrimitive.List)
            </p>
            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="grid grid-cols-3 gap-4">
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="p-8">
                  <p className="text-[13px]">Contenu Tab 1</p>
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="p-8">
                  <p className="text-[13px]">Contenu Tab 2</p>
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="p-8">
                  <p className="text-[13px]">Contenu Tab 3</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Exemple 2: Padding sur tabs-list */}
          <div>
            <h4 className="text-sm font-medium mb-2">Exemple 2 : Padding vertical sur tabs-list</h4>
            <p className="text-xs text-grey-stronger mb-3">
              <code>className="py-5"</code> sur TabsList appliqué au TabsPrimitive.List
            </p>
            <Tabs defaultValue="tab1" className="w-[403px]">
              <TabsList className="py-5">
                <TabsTrigger value="tab1">Plans</TabsTrigger>
                <TabsTrigger value="tab2">Fonctionnalités</TabsTrigger>
                <TabsTrigger value="tab3">Tarifs</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="p-8">
                  <p className="text-[13px]">Contenu Plans</p>
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="p-8">
                  <p className="text-[13px]">Contenu Fonctionnalités</p>
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="p-8">
                  <p className="text-[13px]">Contenu Tarifs</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Exemple 3: Combinaison des deux */}
          <div>
            <h4 className="text-sm font-medium mb-2">Exemple 3 : Combinaison className sur Tabs et TabsList</h4>
            <p className="text-xs text-grey-stronger mb-3">
              <code>className="border-2 border-blue rounded p-4"</code> sur Tabs (appliqué à div.tabs-header) + 
              <code>className="bg-grey-lighter rounded px-2"</code> sur TabsList (appliqué à TabsPrimitive.List)
            </p>
            <Tabs defaultValue="tab1" className="border-2 border-blue rounded p-4">
              <TabsList className="bg-grey-lighter rounded px-2">
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="p-8">
                  <p className="text-[13px]">Contenu Tab 1</p>
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="p-8">
                  <p className="text-[13px]">Contenu Tab 2</p>
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="p-8">
                  <p className="text-[13px]">Contenu Tab 3</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="p-4 bg-grey-lighter rounded">
            <p className="text-xs font-medium mb-2">📝 Notes importantes :</p>
            <ul className="text-xs space-y-1 list-disc list-inside text-grey-stronger">
              <li><code>className</code> sur <code>Tabs</code> s'applique à la <code>div.tabs-header</code> (dans TabsList, pas sur TabsPrimitive.Root)</li>
              <li><code>className</code> sur <code>TabsList</code> s'applique au <code>TabsPrimitive.List</code> (la liste d'onglets)</li>
              <li>Chaque composant a sa propre prop <code>className</code> pour un contrôle précis du styling</li>
            </ul>
          </div>
        </VStack>
      </VStack>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Documentation de l'application de classes CSS personnalisées avec `className` et `listClassName`.",
      },
    },
  },
};
