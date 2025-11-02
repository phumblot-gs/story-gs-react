import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";
import { Layout, VStack, HStack } from "@/components/layout";
import { Icon } from "@/components/ui/icons";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Button component built with the Figma design system. The Button automatically inherits color context via \`data-bg\` from the parent Layout.

## Features
- Multiple visual variants (normal, secondary, ghost, outline, destructive, link)
- Three sizes (small, medium, large)
- Automatic context-aware styling based on parent background
- Icon support with Icon component
- Indicator badge for notifications and alerts
- Polymorphic component support via \`asChild\` prop
- Event handlers (onClick, onFocus, onBlur)
- Debug mode for development
- Shadcn UI compatibility

## Basic Usage

\`\`\`tsx
import { Button, Layout } from '@story-gs-react';

<Layout bg="white">
  <Button variant="normal">
    Save
  </Button>
</Layout>
\`\`\`

## With Icon

\`\`\`tsx
import { Icon } from '@story-gs-react';

<Button variant="secondary">
  <Icon name="Plus" />
  Add
</Button>
\`\`\`

**Tailles d'icônes recommandées selon la taille du bouton :**
- **Bouton \`small\`** : Utilisez \`size={10}\` pour l'icône
- **Bouton \`medium\`** (défaut) : Utilisez \`size={12}\` pour l'icône
- **Bouton \`large\`** : Utilisez \`size={14}\` pour l'icône

\`\`\`tsx
// Exemples
<Button size="small">
  <Icon name="Plus" size={10} />
  Small Button
</Button>

<Button size="medium">
  <Icon name="Plus" size={12} />
  Medium Button
</Button>

<Button size="large">
  <Icon name="Plus" size={14} />
  Large Button
</Button>
\`\`\`

## With Indicator

\`\`\`tsx
<Button variant="normal" indicator>
  Notifications
</Button>
\`\`\`

## With asChild (Polymorphic Component)

The \`asChild\` prop allows you to apply Button styles to another element (like a link \`<a>\`) instead of creating a \`<button>\` element.

**How it works:**

Without \`asChild\`, the Button always creates a \`<button>\`:
\`\`\`tsx
<Button variant="normal">Save</Button>
\`\`\`
→ HTML Result: \`<button>Save</button>\`

With \`asChild={true}\`, the Button transfers its styles to the first child:
\`\`\`tsx
<Button asChild variant="normal">
  <a href="/page">Go to page</a>
</Button>
\`\`\`
→ HTML Result: \`<a href="/page" className="...Button styles">Go to page</a>\`

**Use case: Create a button that is a link**
\`\`\`tsx
// With react-router-dom
import { Link } from 'react-router-dom';

<Button asChild variant="secondary">
  <Link to="/dashboard">Dashboard</Link>
</Button>
\`\`\`

**Advantages:**
- ✅ Correct HTML semantics (uses \`<a>\` for links, \`<button>\` for actions)
- ✅ Better accessibility (screen readers correctly interpret the element)
- ✅ Native functionality (links work with right-click, Ctrl+click, etc.)`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['normal', 'secondary', 'ghost', 'outline', 'destructive', 'link'],
      description: 'Button variant (normal, secondary, ghost, outline, destructive, link)',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Button size (small, medium, large)',
    },
    indicator: {
      control: 'boolean',
      description: 'Displays a yellow indicator badge',
    },
    debug: {
      control: 'boolean',
      description: 'Debug mode: displays a label and logs props to the console',
    },
    asChild: {
      control: 'boolean',
      description: 'If true, transfers Button styles and props to the first direct child instead of creating a <button> element. Useful for creating buttons that are actually links or other components.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled button',
    },
    onClick: {
      action: 'clicked',
      description: 'Function called on click (inherits from ButtonHTMLAttributes)',
    },
    onFocus: {
      action: 'focused',
      description: 'Function called when the button receives focus (inherits from ButtonHTMLAttributes)',
    },
    onBlur: {
      action: 'blurred',
      description: 'Function called when the button loses focus (inherits from ButtonHTMLAttributes)',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes (e.g., "p-0 w-6 h-6" for icon-only buttons)',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'normal',
    size: 'medium',
    children: 'Save',
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
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3 mb-2">Boutons avec icônes</h3>
          <p className="text-sm text-grey-stronger mb-4">
            Les boutons peuvent inclure des icônes. Utilisez les tailles d'icônes recommandées selon la taille du bouton pour un rendu optimal.
          </p>
          <div className="p-4 bg-blue-primary rounded">
            <p className="text-sm font-medium mb-2">💡 Tailles d'icônes recommandées :</p>
            <ul className="text-xs space-y-1 list-disc list-inside">
              <li><strong>Bouton <code>small</code></strong> : <code>size={10}</code></li>
              <li><strong>Bouton <code>medium</code></strong> (défaut) : <code>size={12}</code></li>
              <li><strong>Bouton <code>large</code></strong> : <code>size={14}</code></li>
            </ul>
          </div>
        </div>

        <VStack gap={4}>
          <div>
            <h4 className="text-sm font-medium mb-2">Taille Medium (défaut) - Icon size={12}</h4>
            <HStack gap={3}>
              <Button variant="normal">
                <Icon name="Plus" size={12} />
                Ajouter
              </Button>
              <Button variant="secondary">
                <Icon name="Settings" size={12} />
                Paramètres
              </Button>
              <Button variant="ghost">
                <Icon name="Trash" size={12} />
                Supprimer
              </Button>
            </HStack>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Taille Small - Icon size={10}</h4>
            <HStack gap={3}>
              <Button variant="normal" size="small">
                <Icon name="Plus" size={10} />
                Ajouter
              </Button>
              <Button variant="secondary" size="small">
                <Icon name="Settings" size={10} />
                Paramètres
              </Button>
              <Button variant="ghost" size="small">
                <Icon name="Trash" size={10} />
                Supprimer
              </Button>
            </HStack>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Taille Large - Icon size={14}</h4>
            <HStack gap={3}>
              <Button variant="normal" size="large">
                <Icon name="Plus" size={14} />
                Ajouter
              </Button>
              <Button variant="secondary" size="large">
                <Icon name="Settings" size={14} />
                Paramètres
              </Button>
              <Button variant="ghost" size="large">
                <Icon name="Trash" size={14} />
                Supprimer
              </Button>
            </HStack>
          </div>
        </VStack>
      </VStack>
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
              <li><code>size="small"</code> : Ajouter <code>className="p-1 w-4 h-4"</code> + Icon <code>size={10}</code></li>
              <li><code>size="medium"</code> : Ajouter <code>className="p-0 w-6 h-6"</code> + Icon <code>size={12}</code></li>
              <li><code>size="large"</code> : Ajouter <code>className="p-0 w-8 h-8"</code> + Icon <code>size={14}</code></li>
            </ul>
          </div>
        </div>

        {/* Size Medium */}
        <VStack gap={3}>
          <h4 className="text-sm font-medium">Size Medium (défaut) - Recommandé : className="p-0 w-6 h-6"</h4>
          <HStack gap={3} align="center">
            <Button variant="normal" className="p-0 w-6 h-6"><Icon name="Plus" size={12} /></Button>
            <Button variant="secondary" className="p-0 w-6 h-6"><Icon name="Settings" size={12} /></Button>
            <Button variant="ghost" className="p-0 w-6 h-6"><Icon name="Trash" size={12} /></Button>
            <Button variant="outline" className="p-0 w-6 h-6"><Icon name="Pencil" size={12} /></Button>
            <Button variant="destructive" className="p-0 w-6 h-6"><Icon name="X" size={12} /></Button>
          </HStack>
        </VStack>

        {/* Size Large */}
        <VStack gap={3}>
          <h4 className="text-sm font-medium">Size Large - Recommandé : className="p-0 w-8 h-8"</h4>
          <HStack gap={3} align="center">
            <Button variant="normal" size="large" className="p-0 w-8 h-8"><Icon name="Plus" size={14} /></Button>
            <Button variant="secondary" size="large" className="p-0 w-8 h-8"><Icon name="Settings" size={14} /></Button>
            <Button variant="ghost" size="large" className="p-0 w-8 h-8"><Icon name="Trash" size={14} /></Button>
            <Button variant="outline" size="large" className="p-0 w-8 h-8"><Icon name="Pencil" size={14} /></Button>
            <Button variant="destructive" size="large" className="p-0 w-8 h-8"><Icon name="X" size={14} /></Button>
          </HStack>
          <div className="text-xs text-grey-stronger mt-2">
            💡 Note : La taille large utilise <code>py-[15px]</code> (vs <code>py-1</code> pour medium), donc les boutons sont plus hauts.
          </div>
        </VStack>

        {/* Size Small */}
        <VStack gap={3}>
          <h4 className="text-sm font-medium">Size Small - Recommandé : className="p-1 w-4 h-4"</h4>
          <HStack gap={3} align="center">
            <Button variant="normal" size="small" className="p-1 w-4 h-4"><Icon name="Plus" size={10} /></Button>
            <Button variant="secondary" size="small" className="p-1 w-4 h-4"><Icon name="Settings" size={10} /></Button>
            <Button variant="ghost" size="small" className="p-1 w-4 h-4"><Icon name="Trash" size={10} /></Button>
            <Button variant="outline" size="small" className="p-1 w-4 h-4"><Icon name="Pencil" size={10} /></Button>
            <Button variant="destructive" size="small" className="p-1 w-4 h-4"><Icon name="X" size={10} /></Button>
          </HStack>
        </VStack>

        {/* Avec Indicator */}
        <VStack gap={3}>
          <h4 className="text-sm font-medium">Avec Indicator (notifications, alertes)</h4>
          <HStack gap={3} align="center">
            <Button variant="normal" indicator className="p-0 w-6 h-6"><Icon name="Bell" size={12} /></Button>
            <Button variant="secondary" indicator className="p-0 w-6 h-6"><Icon name="Mail" size={12} /></Button>
            <Button variant="ghost" indicator size="small" className="p-1 w-4 h-4"><Icon name="Bell" size={10} /></Button>
            <Button variant="outline" indicator size="small" className="p-1 w-4 h-4"><Icon name="Mail" size={10} /></Button>
          </HStack>
        </VStack>

        {/* Disabled */}
        <VStack gap={3}>
          <h4 className="text-sm font-medium">États désactivés</h4>
          <HStack gap={3} align="center">
            <Button variant="normal" disabled className="p-0 w-6 h-6"><Icon name="Plus" size={12} /></Button>
            <Button variant="secondary" disabled className="p-0 w-6 h-6"><Icon name="Settings" size={12} /></Button>
            <Button variant="ghost" disabled className="p-0 w-6 h-6"><Icon name="Trash" size={12} /></Button>
            <Button variant="normal" size="small" disabled className="p-1 w-4 h-4"><Icon name="Plus" size={10} /></Button>
          </HStack>
        </VStack>

        {/* Différents backgrounds */}
        <VStack gap={3}>
          <h4 className="text-sm font-medium">Sur différents backgrounds</h4>
          <HStack gap={4}>
            <Layout bg="white" padding={3} className="border border-grey rounded">
              <HStack gap={2}>
                <Button variant="normal" className="p-0 w-6 h-6"><Icon name="Plus" size={12} /></Button>
                <Button variant="ghost" className="p-0 w-6 h-6"><Icon name="Settings" size={12} /></Button>
              </HStack>
            </Layout>
            <Layout bg="grey" padding={3} className="border border-grey rounded">
              <HStack gap={2}>
                <Button variant="normal" className="p-0 w-6 h-6"><Icon name="Plus" size={12} /></Button>
                <Button variant="ghost" className="p-0 w-6 h-6"><Icon name="Settings" size={12} /></Button>
              </HStack>
            </Layout>
            <Layout bg="black" padding={3} className="border border-grey rounded">
              <HStack gap={2}>
                <Button variant="normal" className="p-0 w-6 h-6"><Icon name="Plus" size={12} /></Button>
                <Button variant="ghost" className="p-0 w-6 h-6"><Icon name="Settings" size={12} /></Button>
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

export const AsChild: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3 mb-2">Utilisation de asChild</h3>
          <p className="text-sm text-grey-stronger mb-4">
            La prop <code>asChild</code> permet de transférer les styles du Button au premier enfant direct, 
            au lieu de créer un élément <code>&lt;button&gt;</code>. C'est utile pour créer des boutons qui sont 
            en réalité des liens ou d'autres composants.
          </p>
        </div>

        <VStack gap={4}>
          <div>
            <h4 className="text-sm font-medium mb-2">Bouton normal (sans asChild)</h4>
            <p className="text-xs text-grey-stronger mb-2">Résultat : &lt;button&gt;</p>
            <Button variant="normal">Bouton normal</Button>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Bouton avec asChild (lien HTML)</h4>
            <p className="text-xs text-grey-stronger mb-2">Résultat : &lt;a&gt; avec les styles du Button</p>
            <Button asChild variant="normal">
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                Lien externe
              </a>
            </Button>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Comparaison visuelle</h4>
            <p className="text-xs text-grey-stronger mb-2">Les deux boutons ont le même style, mais des éléments HTML différents</p>
            <HStack gap={3}>
              <Button variant="secondary">Bouton standard</Button>
              <Button asChild variant="secondary">
                <a href="#example">Lien stylisé</a>
              </Button>
            </HStack>
          </div>

          <div className="p-4 bg-blue-primary rounded">
            <p className="text-xs font-medium mb-2">💡 Avantages de asChild :</p>
            <ul className="text-xs space-y-1 list-disc list-inside text-grey-stronger">
              <li>Sémantique HTML correcte (utilise &lt;a&gt; pour les liens, &lt;button&gt; pour les actions)</li>
              <li>Meilleure accessibilité (les lecteurs d'écran interprètent correctement l'élément)</li>
              <li>Fonctionnalités natives (les liens fonctionnent avec clic droit, Ctrl+clic, etc.)</li>
              <li>Réutilisabilité des styles Button sur n'importe quel composant</li>
            </ul>
          </div>
        </VStack>
      </VStack>
    </Layout>
  ),
};

export const Small: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <HStack gap={3} align="center">
        <Button size="small">Small Button</Button>
        <Button size="small">
          <Icon name="Plus" size={10} />
          Avec icon
        </Button>
      </HStack>
    </Layout>
  ),
};

export const Medium: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <HStack gap={3} align="center">
        <Button size="medium">Medium Button</Button>
        <Button size="medium">
          <Icon name="Plus" size={12} />
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
          <Icon name="Plus" size={14} />
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
          <Button size="medium">Medium</Button>
          <Button size="lg">Medium (lg - compatibilité shadcn)</Button>
          <Button size="large">Large</Button>
          <Button size="default">Medium (default)</Button>
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
            <Button variant="normal" size="medium" debug onClick={() => alert('Clicked!')}>
              Normal Medium
            </Button>
            <Button variant="normal" size="large" debug onClick={() => alert('Clicked!')}>
              Normal Large
            </Button>
            <Button 
              variant="secondary" 
              size="small" 
              debug 
              onClick={() => console.log('Secondary clicked')}
              onFocus={(e) => console.log('Secondary focused')}
              onBlur={(e) => console.log('Secondary blurred')}
            >
              Secondary Small (avec onFocus/onBlur)
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
              <li>onClick, onFocus et onBlur fonctionnent normalement (hérite de ButtonHTMLAttributes)</li>
            </ul>
          </div>
        </VStack>
      </VStack>
    </Layout>
  ),
};
