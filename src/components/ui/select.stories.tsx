import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./select";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { Layout, VStack } from "@/components/layout";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Select component built with the Figma design system. The Select automatically inherits color context via \`data-bg\` from the parent Layout.

## Features
- Two sizes (normal, small)
- Automatic context-aware styling based on parent background
- Allow clear functionality with X icon
- Controlled and uncontrolled modes
- Disabled state support
- Debug mode for development
- Radix UI primitives (accessibility, keyboard navigation)
- Shadcn UI compatibility

## Basic Usage

\`\`\`tsx
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, Layout } from '@story-gs-react';

<Layout bg="white">
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select an option" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="option1">Option 1</SelectItem>
      <SelectItem value="option2">Option 2</SelectItem>
      <SelectItem value="option3">Option 3</SelectItem>
    </SelectContent>
  </Select>
</Layout>
\`\`\`

## Sizes

The Select component supports two sizes: \`normal\` (default) and \`small\`.

**Normal size (default):**
- Height: 30px
- Padding: \`py-1 pl-3 pr-[4px]\`
- Icon button: \`w-4 h-4\`
- Icon size: 10px

**Small size:**
- Height: 16px (\`h-4\`)
- Padding: \`py-0 pl-2 pr-[2px]\`
- Icon button: \`w-3 h-3\`
- Icon size: 5px

\`\`\`tsx
// Normal size (default)
<Select size="normal">
  <SelectTrigger>
    <SelectValue placeholder="Normal select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opt1">Option 1</SelectItem>
  </SelectContent>
</Select>

// Small size
<Select size="small">
  <SelectTrigger>
    <SelectValue placeholder="Small select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opt1">Option 1</SelectItem>
  </SelectContent>
</Select>
\`\`\`

## With Allow Clear

The \`allowClear\` prop enables an X icon that appears when a value is selected, allowing users to clear the selection.

\`\`\`tsx
<Select allowClear>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
\`\`\`

**Behavior:**
- The X icon appears only when a value is selected
- Clicking the X icon clears the selection and calls \`onValueChange\` with an empty string
- The icon changes to ArrowUp/ArrowDown when the dropdown is open

## Controlled vs Uncontrolled

The Select component supports both controlled and uncontrolled modes.

**Uncontrolled (default):**
\`\`\`tsx
<Select defaultValue="option1">
  <SelectTrigger>
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
\`\`\`

**Controlled:**
\`\`\`tsx
const [value, setValue] = useState("option1");

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
\`\`\`

## Background Context Adaptation

The Select component automatically adapts its appearance based on the parent Layout's \`data-bg\` context:

- **White background**: Grey input field (\`bg-grey-lighter\`)
- **Grey background**: White input field (\`bg-white\`)
- **Black background**: Black-secondary input field (\`bg-black-secondary\`) with white text

The dropdown menu also adapts:
- **White/Grey backgrounds**: Black dropdown menu
- **Black background**: White dropdown menu`,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['normal', 'small'],
      description: 'Select size (normal, small). Normal is 30px height, small is 16px height.',
    },
    allowClear: {
      control: 'boolean',
      description: 'If true, displays an X icon when a value is selected, allowing users to clear the selection.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state - the select cannot be interacted with',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when no value is selected',
    },
    value: {
      control: 'text',
      description: 'Controlled mode: the selected value',
    },
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled mode: the default selected value',
    },
    onValueChange: {
      action: 'valueChanged',
      description: 'Callback function called when the selected value changes',
    },
    debug: {
      control: 'boolean',
      description: 'Debug mode: logs component props and state to the console',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// Template de base
const SelectTemplate = (args: Story['args']) => (
  <Layout bg="white" padding={6}>
    <Select {...args}>
      <SelectTrigger debug={args?.debug} disabled={args?.disabled}>
        <SelectValue placeholder={args?.placeholder || "Sélectionner une option"} />
      </SelectTrigger>
      <SelectContent debug={args?.debug}>
        <SelectItem value="option1" debug={args?.debug}>Option 1</SelectItem>
        <SelectItem value="option2" debug={args?.debug}>Option 2</SelectItem>
        <SelectItem value="option3" debug={args?.debug}>Option 3</SelectItem>
        <SelectItem value="option4" debug={args?.debug}>Option très longue qui peut dépasser</SelectItem>
      </SelectContent>
    </Select>
  </Layout>
);

export const Default: Story = {
  args: {
    debug: false,
    disabled: false,
    placeholder: "Choisir une option",
    allowClear: false,
    size: "normal",
  },
  render: (args) => {
    const { placeholder, ...selectProps } = args;
    return (
      <Layout bg="white" padding={6}>
        <Select {...selectProps}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
            <SelectItem value="option4">Option très longue qui peut dépasser</SelectItem>
          </SelectContent>
        </Select>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Story interactive — toutes les props (\`size\`, \`disabled\`, \`allowClear\`, etc.) sont pilotées via le panneau **Controls**. Les autres stories (\`BackgroundVariants\`, \`States\`, \`LongContent\`, \`WithAvatars\`) ont un \`render\` qui ne lit pas \`args\` : changer un control en étant sur ces stories n'aura aucun effet (c'est voulu, elles servent à montrer un cas figé). Pour comparer les tailles d'un coup d'œil, voir la story **Sizes**.`,
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <VStack gap={2}>
          <p className="text-xs uppercase tracking-wider text-grey-strongest">size="normal" (30 px)</p>
          <Select size="normal" defaultValue="b">
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
        <VStack gap={2}>
          <p className="text-xs uppercase tracking-wider text-grey-strongest">size="small" (16 px)</p>
          <Select size="small" defaultValue="b">
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
      </VStack>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Comparaison côte à côte des deux tailles : `size=\"normal\"` (`h-[30px]`, padding `pl-3 pr-[4px]`) et `size=\"small\"` (`h-4` = 16 px, padding `pl-2 pr-[2px]`).",
      },
    },
  },
};

export const Discrete: Story = {
  render: () => (
    <VStack gap={6} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="text-sm font-medium">Background White</h3>
        <VStack gap={2}>
          <p className="text-xs text-grey-strongest">discrete=false (default)</p>
          <Select defaultValue="b">
            <SelectTrigger>
              <SelectValue placeholder="Choisir..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
        <VStack gap={2}>
          <p className="text-xs text-grey-strongest">discrete=true → le rond se confond avec le trigger au repos</p>
          <Select defaultValue="b">
            <SelectTrigger discrete>
              <SelectValue placeholder="Choisir..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="text-sm font-medium">Background Grey</h3>
        <VStack gap={2}>
          <p className="text-xs text-grey-strongest">discrete=false</p>
          <Select defaultValue="b">
            <SelectTrigger>
              <SelectValue placeholder="Choisir..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
        <VStack gap={2}>
          <p className="text-xs text-grey-strongest">discrete=true</p>
          <Select defaultValue="b">
            <SelectTrigger discrete>
              <SelectValue placeholder="Choisir..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
        <h3 className="text-sm font-medium text-white">Background Black</h3>
        <VStack gap={2}>
          <p className="text-xs text-grey-stronger">discrete=false</p>
          <Select defaultValue="b">
            <SelectTrigger>
              <SelectValue placeholder="Choisir..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
        <VStack gap={2}>
          <p className="text-xs text-grey-stronger">discrete=true</p>
          <Select defaultValue="b">
            <SelectTrigger discrete>
              <SelectValue placeholder="Choisir..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
      </VStack>
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story: `Prop \`discrete\` sur le \`SelectTrigger\` (défaut \`false\`). Quand \`true\`, le rond contenant la flèche prend la couleur de fond du trigger au repos — le bouton "disparaît" visuellement et seule l'icône est perceptible. Les états hover, pressed et open conservent le styling habituel (noir, bleu primaire à l'ouverture, etc.).

Survole, clique et déroule chaque trigger \`discrete=true\` pour vérifier que les états actifs sont bien identiques à ceux de \`discrete=false\`.`,
      },
    },
  },
};

export const BackgroundVariants: Story = {
  render: () => (
    <VStack gap={6} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={3} className="border border-grey rounded">
        <h3 className="text-sm font-medium">Background White</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select white background" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="white1">Option 1</SelectItem>
            <SelectItem value="white2">Option 2</SelectItem>
            <SelectItem value="white3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={3} className="border border-grey rounded">
        <h3 className="text-sm font-medium text-white">Background Black</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select black background" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="black1">Option 1</SelectItem>
            <SelectItem value="black2">Option 2</SelectItem>
            <SelectItem value="black3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={3} className="border border-grey rounded">
        <h3 className="text-sm font-medium">Background Grey</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select grey background" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grey1">Option 1</SelectItem>
            <SelectItem value="grey2">Option 2</SelectItem>
            <SelectItem value="grey3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </VStack>
    </VStack>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: "Le Select hérite automatiquement du background du Layout parent via BgContext.",
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <VStack gap={3}>
          <h3 className="text-sm font-medium">État Normal</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select normal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal1">Option normale</SelectItem>
              <SelectItem value="normal2">Autre option</SelectItem>
            </SelectContent>
          </Select>
        </VStack>

        <VStack gap={3}>
          <h3 className="text-sm font-medium">État Désactivé</h3>
          <Select disabled>
            <SelectTrigger disabled>
              <SelectValue placeholder="Select désactivé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled1">Option désactivée</SelectItem>
            </SelectContent>
          </Select>
        </VStack>

        <VStack gap={3}>
          <h3 className="text-sm font-medium">Avec Valeur Sélectionnée</h3>
          <Select defaultValue="selected">
            <SelectTrigger>
              <SelectValue placeholder="Aucune sélection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="selected">Option sélectionnée</SelectItem>
              <SelectItem value="other">Autre option</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
      </VStack>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Différents états du composant Select : normal, désactivé, avec valeur sélectionnée.",
      },
    },
  },
};

export const LongContent: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select avec beaucoup d'options" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="short">Court</SelectItem>
          <SelectItem value="medium">Option moyenne</SelectItem>
          <SelectItem value="long">Option avec un texte très long qui pourrait dépasser</SelectItem>
          <SelectItem value="extra-long">Option avec un texte extrêmement long qui teste la gestion de l'overflow et du wrapping</SelectItem>
          <SelectItem value="numbers">123456789012345678901234567890</SelectItem>
          <SelectItem value="special">Caractères spéciaux: àéèïôç!</SelectItem>
          <SelectItem value="option7">Option 7</SelectItem>
          <SelectItem value="option8">Option 8</SelectItem>
          <SelectItem value="option9">Option 9</SelectItem>
          <SelectItem value="option10">Option 10</SelectItem>
        </SelectContent>
      </Select>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Test avec beaucoup d'options et du contenu long pour vérifier le scroll et l'overflow.",
      },
    },
  },
};

export const WithDebug: Story = {
  render: SelectTemplate,
  args: {
    debug: true,
    disabled: false,
    placeholder: "Select avec debug activé",
  },
  parameters: {
    docs: {
      description: {
        story: "Mode debug activé - voir la console pour les logs.",
      },
    },
  },
};

export const WithAllowClear: Story = {
  render: (args) => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <VStack gap={2}>
          <h3 className="text-sm font-medium">Allow Clear - Sans valeur par défaut</h3>
          <Select allowClear>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une option (effaçable)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </VStack>

        <VStack gap={2}>
          <h3 className="text-sm font-medium">Allow Clear - Avec valeur par défaut</h3>
          <Select allowClear defaultValue="option2">
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
      </VStack>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Select avec allowClear=true. L'icône X permet d'effacer la sélection quand une valeur est sélectionnée.",
      },
    },
  },
};

// --------------------------------------------------------------------------
// Avatar inside SelectItem
// --------------------------------------------------------------------------
//
// Pas besoin d'un composant dédié : on utilise Select + Avatar + AvatarImage +
// AvatarFallback directement à l'intérieur de chaque SelectItem.
//
// Astuce Radix : SelectValue (dans le trigger) projette automatiquement le
// contenu de SelectPrimitive.ItemText de l'item sélectionné. Comme notre
// SelectItem wrappe ses children dans ItemText, l'avatar + nom rendus dans
// l'item apparaissent tels quels dans le trigger.

interface AvatarOption {
  value: string;
  name: string;
  initials: string;
  /** URL absolue d'une image — laisser undefined pour forcer le fallback initiales. */
  photoUrl?: string;
  /** Couleur de fond du fallback (CSS color). */
  fallbackBg: string;
  /** Couleur du texte du fallback. Default: white. */
  fallbackFg?: string;
}

const SUPPLIER_OPTIONS: AvatarOption[] = [
  {
    value: "ls",
    name: "Laurent Salières",
    initials: "LS",
    fallbackBg: "#8b5e3c", // brun, comme le mock
    fallbackFg: "#ffffff",
  },
  {
    value: "mg",
    name: "Marie Gauthier",
    initials: "MG",
    fallbackBg: "#2563eb",
    fallbackFg: "#ffffff",
  },
  {
    value: "pf",
    name: "Pierre Fournier",
    initials: "PF",
    fallbackBg: "#16a34a",
    fallbackFg: "#ffffff",
  },
  {
    value: "an",
    name: "Aurore Nguyen",
    initials: "AN",
    // photoUrl renseigné pour démontrer le cas image (alors que d'autres
    // utilisent uniquement le fallback initiales).
    photoUrl: "https://i.pravatar.cc/64?img=47",
    fallbackBg: "#9333ea",
    fallbackFg: "#ffffff",
  },
];

const SupplierItem: React.FC<{ option: AvatarOption }> = ({ option }) => (
  <span className="flex items-center gap-2 min-w-0">
    <Avatar size="small" className="shrink-0">
      {option.photoUrl ? <AvatarImage src={option.photoUrl} alt={option.name} /> : null}
      <AvatarFallback
        size="small"
        style={{ backgroundColor: option.fallbackBg, color: option.fallbackFg ?? "#ffffff" }}
      >
        {option.initials}
      </AvatarFallback>
    </Avatar>
    <span className="truncate">{option.name}</span>
  </span>
);

export const WithAvatars: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <div>
          <h3 className="text-sm font-medium mb-2">Select with avatars</h3>
          <p className="text-xs text-grey-strongest mb-4">
            Each <code>SelectItem</code> embeds an <code>Avatar</code> + the user's name.
            When an item is selected, Radix automatically projects the same content into
            the trigger via <code>SelectValue</code> — no custom component required.
          </p>
        </div>
        <div className="w-[280px]">
          <Select defaultValue="ls">
            <SelectTrigger className="pl-1">
              <SelectValue placeholder="Sélectionner un fournisseur..." />
            </SelectTrigger>
            <SelectContent>
              {SUPPLIER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="pl-1">
                  <SupplierItem option={opt} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </VStack>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: `Pattern pour afficher des avatars dans un Select sans composant dédié.

\`\`\`tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="pl-1">
    <SelectValue placeholder="Sélectionner un fournisseur..." />
  </SelectTrigger>
  <SelectContent>
    {users.map((u) => (
      <SelectItem key={u.id} value={u.id} className="pl-1">
        <span className="flex items-center gap-2">
          <Avatar size="small">
            <AvatarImage src={u.photoUrl} alt={u.name} />
            <AvatarFallback style={{ backgroundColor: u.color }}>
              {u.initials}
            </AvatarFallback>
          </Avatar>
          {u.name}
        </span>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
\`\`\`

**Pourquoi ça marche** : \`SelectItem\` wrappe ses enfants dans \`SelectPrimitive.ItemText\`, et \`SelectValue\` (dans le trigger) projette le contenu de cet \`ItemText\` une fois sélectionné. L'avatar + le nom apparaissent donc à la fois dans le dropdown et dans le trigger, sans duplication de markup.

**Tweaks visuels** :
- L'avatar \`size="small"\` (16 px) tient parfaitement dans la hauteur 30 px du trigger standard, donc pas besoin de la modifier.
- \`<SelectTrigger className="pl-1">\` et \`<SelectItem className="pl-1">\` — le \`padding-left\` est ramené de 12 px (\`pl-3\` par défaut) à 4 px (\`pl-1\`), à la fois sur le trigger et sur les items, pour caler l'avatar près du bord gauche et garder l'alignement entre le trigger et la liste déroulée.
- L'\`AvatarFallback\` par défaut a \`bg-muted\` (token shadcn neutre) ; passe \`style\` ou \`className\` pour une couleur de marque.`,
      },
    },
  },
};
