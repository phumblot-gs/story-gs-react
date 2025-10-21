import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";
import { Layout, VStack, HStack } from "@/components/layout";
import { renderIcon } from "@/components/ui/icons";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Composant Button construit avec le design system Figma. Le Button hérite automatiquement du contexte de couleur via \`data-bg\` du Layout parent.

### Utilisation simple

\`\`\`tsx
import { Button, Layout } from '@story-gs-react';

<Layout bg="white">
  <Button variant="normal">
    Enregistrer
  </Button>
</Layout>
\`\`\`

### Avec icône

\`\`\`tsx
import { renderIcon } from '@story-gs-react';

<Button variant="secondary">
  {renderIcon("Plus")}
  Ajouter
</Button>
\`\`\`

### Avec indicator

\`\`\`tsx
<Button variant="normal" indicator>
  Notifications
</Button>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['normal', 'secondary', 'ghost', 'outline', 'destructive', 'link'],
      description: 'Variant du bouton (normal, secondary, ghost, outline, destructive, link)',
    },
    size: {
      control: 'select',
      options: ['small', 'large'],
      description: 'Taille du bouton (small = 5px padding, large = 5px padding)',
    },
    indicator: {
      control: 'boolean',
      description: 'Affiche une pastille jaune indicateur',
    },
    debug: {
      control: 'boolean',
      description: 'Mode debug : affiche un label et log les props dans la console',
    },
    disabled: {
      control: 'boolean',
      description: 'Bouton désactivé',
    },
    onClick: {
      action: 'clicked',
      description: 'Fonction appelée au clic (hérite de ButtonHTMLAttributes)',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'normal',
    size: 'large',
    children: 'Enregistrer',
  },
  render: (args) => (
    <Layout bg="white" padding={6}>
      <Button {...args} />
    </Layout>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <VStack gap={6} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background White</h3>
        <HStack gap={3}>
          <Button variant="normal">Normal</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </HStack>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3">Background Grey</h3>
        <HStack gap={3}>
          <Button variant="normal">Normal</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </HStack>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="gs-typo-h3 text-white">Background Black</h3>
        <HStack gap={3}>
          <Button variant="normal">Normal</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </HStack>
      </VStack>
    </VStack>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const WithIcon: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <HStack gap={3}>
        <Button variant="normal">
          {renderIcon("Plus")}
          Ajouter
        </Button>
        <Button variant="secondary">
          {renderIcon("Settings")}
          Paramètres
        </Button>
        <Button variant="ghost">
          {renderIcon("Trash")}
          Supprimer
        </Button>
      </HStack>
    </Layout>
  ),
};

export const IconsOnly: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3 mb-2">Boutons icône uniquement</h3>
          <p className="text-sm text-grey-stronger mb-3">
            Boutons sans texte, utilisant uniquement des icônes. Idéal pour les barres d'outils et interfaces compactes.
          </p>
          <div className="p-4 bg-blue-primary rounded">
            <p className="text-sm font-medium mb-2">💡 Dimensions recommandées pour icône uniquement :</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li><code>size="large"</code> : Ajouter <code>className="p-0 w-6 h-6"</code></li>
              <li><code>size="small"</code> : Ajouter <code>className="p-1 w-4 h-4"</code></li>
            </ul>
          </div>
        </div>

        {/* Size Large */}
        <VStack gap={3}>
          <h4 className="text-sm font-medium">Size Large (défaut) - Recommandé : className="p-0 w-6 h-6"</h4>
          <HStack gap={3} align="center">
            <Button variant="normal" className="p-0 w-6 h-6">{renderIcon("Plus")}</Button>
            <Button variant="secondary" className="p-0 w-6 h-6">{renderIcon("Settings")}</Button>
            <Button variant="ghost" className="p-0 w-6 h-6">{renderIcon("Trash")}</Button>
            <Button variant="outline" className="p-0 w-6 h-6">{renderIcon("Pencil")}</Button>
            <Button variant="destructive" className="p-0 w-6 h-6">{renderIcon("X")}</Button>
          </HStack>
        </VStack>

        {/* Size Small */}
        <VStack gap={3}>
          <h4 className="text-sm font-medium">Size Small - Recommandé : className="p-1 w-4 h-4"</h4>
          <HStack gap={3} align="center">
            <Button variant="normal" size="small" className="p-1 w-4 h-4">{renderIcon("Plus")}</Button>
            <Button variant="secondary" size="small" className="p-1 w-4 h-4">{renderIcon("Settings")}</Button>
            <Button variant="ghost" size="small" className="p-1 w-4 h-4">{renderIcon("Trash")}</Button>
            <Button variant="outline" size="small" className="p-1 w-4 h-4">{renderIcon("Pencil")}</Button>
            <Button variant="destructive" size="small" className="p-1 w-4 h-4">{renderIcon("X")}</Button>
          </HStack>
        </VStack>

        {/* Avec Indicator */}
        <VStack gap={3}>
          <h4 className="text-sm font-medium">Avec Indicator (notifications, alertes)</h4>
          <HStack gap={3} align="center">
            <Button variant="normal" indicator className="p-0 w-6 h-6">{renderIcon("Bell")}</Button>
            <Button variant="secondary" indicator className="p-0 w-6 h-6">{renderIcon("Mail")}</Button>
            <Button variant="ghost" indicator size="small" className="p-1 w-4 h-4">{renderIcon("Bell")}</Button>
            <Button variant="outline" indicator size="small" className="p-1 w-4 h-4">{renderIcon("Mail")}</Button>
          </HStack>
        </VStack>

        {/* Disabled */}
        <VStack gap={3}>
          <h4 className="text-sm font-medium">États désactivés</h4>
          <HStack gap={3} align="center">
            <Button variant="normal" disabled className="p-0 w-6 h-6">{renderIcon("Plus")}</Button>
            <Button variant="secondary" disabled className="p-0 w-6 h-6">{renderIcon("Settings")}</Button>
            <Button variant="ghost" disabled className="p-0 w-6 h-6">{renderIcon("Trash")}</Button>
            <Button variant="normal" size="small" disabled className="p-1 w-4 h-4">{renderIcon("Plus")}</Button>
          </HStack>
        </VStack>

        {/* Différents backgrounds */}
        <VStack gap={3}>
          <h4 className="text-sm font-medium">Sur différents backgrounds</h4>
          <HStack gap={4}>
            <Layout bg="white" padding={3} className="border border-grey rounded">
              <HStack gap={2}>
                <Button variant="normal" className="p-0 w-6 h-6">{renderIcon("Plus")}</Button>
                <Button variant="ghost" className="p-0 w-6 h-6">{renderIcon("Settings")}</Button>
              </HStack>
            </Layout>
            <Layout bg="grey" padding={3} className="border border-grey rounded">
              <HStack gap={2}>
                <Button variant="normal" className="p-0 w-6 h-6">{renderIcon("Plus")}</Button>
                <Button variant="ghost" className="p-0 w-6 h-6">{renderIcon("Settings")}</Button>
              </HStack>
            </Layout>
            <Layout bg="black" padding={3} className="border border-grey rounded">
              <HStack gap={2}>
                <Button variant="normal" className="p-0 w-6 h-6">{renderIcon("Plus")}</Button>
                <Button variant="ghost" className="p-0 w-6 h-6">{renderIcon("Settings")}</Button>
              </HStack>
            </Layout>
          </HStack>
        </VStack>
      </VStack>
    </Layout>
  ),
};

export const WithIndicator: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <HStack gap={3}>
        <Button variant="normal" indicator>
          Normal
        </Button>
        <Button variant="secondary" indicator>
          Secondary
        </Button>
        <Button variant="ghost" indicator>
          Ghost
        </Button>
      </HStack>
    </Layout>
  ),
};

export const Small: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <HStack gap={3} align="center">
        <Button size="small">Small Button</Button>
        <Button size="small">
          {renderIcon("Plus")}
          Avec icon
        </Button>
      </HStack>
    </Layout>
  ),
};

export const Large: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <HStack gap={3} align="center">
        <Button size="large">Large Button</Button>
        <Button size="large">
          {renderIcon("Plus")}
          Avec icon
        </Button>
      </HStack>
    </Layout>
  ),
};

export const States: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <HStack gap={3}>
          <Button variant="normal">Default</Button>
          <Button variant="normal" className="hover">Hover (forcé)</Button>
          <Button variant="normal" disabled>Disabled</Button>
        </HStack>
        <HStack gap={3}>
          <Button variant="destructive">Default</Button>
          <Button variant="destructive" disabled>Disabled</Button>
        </HStack>
      </VStack>
    </Layout>
  ),
};

export const ShadcnCompatibility: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <p className="text-sm text-grey-stronger">Test de compatibilité shadcn (mapping automatique)</p>
        <HStack gap={3}>
          <Button variant="default">Default (→ normal)</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </HStack>
        <HStack gap={3}>
          <Button size="sm">Small (sm)</Button>
          <Button size="lg">Large (lg)</Button>
          <Button size="default">Default</Button>
        </HStack>
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
          <HStack gap={2}>
            <Button variant="normal">Normal</Button>
            <Button variant="ghost">Ghost</Button>
          </HStack>

          {/* Niveau 2: Grey - écrase white */}
          <Layout bg="grey" padding={4} className="border-2 border-green">
            <VStack gap={3}>
              <p className="text-sm font-medium">Layout bg="grey" (niveau 2 - écrase white)</p>
              <HStack gap={2}>
                <Button variant="normal">Normal</Button>
                <Button variant="ghost">Ghost</Button>
              </HStack>

              {/* Niveau 3: Black - écrase grey */}
              <Layout bg="black" padding={4} className="border-2 border-yellow">
                <VStack gap={3}>
                  <p className="text-sm font-medium text-white">Layout bg="black" (niveau 3 - écrase grey)</p>
                  <HStack gap={2}>
                    <Button variant="normal">Normal (styles black)</Button>
                    <Button variant="ghost">Ghost (styles black)</Button>
                  </HStack>
                </VStack>
              </Layout>

              <p className="text-sm text-grey-stronger">↑ Buttons ci-dessus utilisent styles BLACK (contexte le plus proche)</p>
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

export const DebugMode: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3 mb-3">Mode Debug</h3>
          <p className="text-sm text-grey-stronger mb-4">
            La prop <code>debug</code> affiche un label au-dessus du bouton et log les props dans la console.
          </p>
        </div>

        <VStack gap={4}>
          <HStack gap={3}>
            <Button variant="normal" size="large" debug onClick={() => alert('Clicked!')}>
              Normal Large
            </Button>
            <Button variant="secondary" size="small" debug onClick={() => console.log('Secondary clicked')}>
              Secondary Small
            </Button>
            <Button variant="ghost" debug indicator>
              Ghost + Indicator
            </Button>
          </HStack>

          <div className="p-4 bg-grey-lighter rounded">
            <p className="text-xs font-medium mb-2">Caractéristiques du mode debug :</p>
            <ul className="text-xs space-y-1 list-disc list-inside text-grey-stronger">
              <li>Bordure rose (ring-2 ring-pink) autour du bouton</li>
              <li>Label au-dessus affichant variant/size normalisés</li>
              <li>Log dans la console avec toutes les props</li>
              <li>onClick fonctionne normalement (hérite de ButtonHTMLAttributes)</li>
            </ul>
          </div>
        </VStack>
      </VStack>
    </Layout>
  ),
};
