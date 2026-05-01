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
        <SelectValue placeholder={args?.placeholder || "Select an option"} />
      </SelectTrigger>
      <SelectContent debug={args?.debug}>
        <SelectItem value="option1" debug={args?.debug}>Option 1</SelectItem>
        <SelectItem value="option2" debug={args?.debug}>Option 2</SelectItem>
        <SelectItem value="option3" debug={args?.debug}>Option 3</SelectItem>
        <SelectItem value="option4" debug={args?.debug}>Very long option that may overflow</SelectItem>
      </SelectContent>
    </Select>
  </Layout>
);

export const Default: Story = {
  args: {
    debug: false,
    disabled: false,
    placeholder: "Choose an option",
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
            <SelectItem value="option4">Very long option that may overflow</SelectItem>
          </SelectContent>
        </Select>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: `Interactive story — all props (\`size\`, \`disabled\`, \`allowClear\`, etc.) are driven from the **Controls** panel. The other stories (\`BackgroundVariants\`, \`States\`, \`LongContent\`, \`WithAvatars\`) have a \`render\` that doesn't read \`args\`: changing a control while on those stories will have no effect (this is intentional — they show a fixed case). To compare the two sizes at a glance, see the **Sizes** story.`,
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
              <SelectValue placeholder="Select an option" />
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
              <SelectValue placeholder="Select an option" />
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
          "Side-by-side comparison of the two sizes: `size=\"normal\"` (`h-[30px]`, padding `pl-3 pr-[4px]`) and `size=\"small\"` (`h-4` = 16 px, padding `pl-2 pr-[2px]`).",
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
              <SelectValue placeholder="Choose..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
              <SelectItem value="c">Option C</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
        <VStack gap={2}>
          <p className="text-xs text-grey-strongest">discrete=true → the button blends with the trigger at idle</p>
          <Select defaultValue="b">
            <SelectTrigger discrete>
              <SelectValue placeholder="Choose..." />
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
              <SelectValue placeholder="Choose..." />
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
              <SelectValue placeholder="Choose..." />
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
              <SelectValue placeholder="Choose..." />
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
              <SelectValue placeholder="Choose..." />
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
        story: `\`discrete\` prop on \`SelectTrigger\` (default \`false\`). When \`true\`, the round button containing the arrow icon adopts the trigger background color at idle — the button visually "disappears" and only the icon remains perceptible. The hover, pressed and open states keep their usual styling (black on hover/pressed, blue primary when the dropdown is open).

Hover, click and open each \`discrete=true\` trigger to check that the active states are strictly identical to those of \`discrete=false\`.`,
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
        story: "The Select automatically inherits the parent Layout background via BgContext.",
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <VStack gap={3}>
          <h3 className="text-sm font-medium">Normal state</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Default select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal1">Normal option</SelectItem>
              <SelectItem value="normal2">Other option</SelectItem>
            </SelectContent>
          </Select>
        </VStack>

        <VStack gap={3}>
          <h3 className="text-sm font-medium">Disabled state</h3>
          <Select disabled>
            <SelectTrigger disabled>
              <SelectValue placeholder="Disabled select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled1">Disabled option</SelectItem>
            </SelectContent>
          </Select>
        </VStack>

        <VStack gap={3}>
          <h3 className="text-sm font-medium">With selected value</h3>
          <Select defaultValue="selected">
            <SelectTrigger>
              <SelectValue placeholder="No selection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="selected">Selected option</SelectItem>
              <SelectItem value="other">Other option</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
      </VStack>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "The various states of the Select component: normal, disabled, and with a selected value.",
      },
    },
  },
};

export const LongContent: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select with many options" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="short">Short</SelectItem>
          <SelectItem value="medium">Medium option</SelectItem>
          <SelectItem value="long">Option with very long text that may overflow</SelectItem>
          <SelectItem value="extra-long">Option with extremely long text to test overflow and wrapping behavior</SelectItem>
          <SelectItem value="numbers">123456789012345678901234567890</SelectItem>
          <SelectItem value="special">Special characters: àéèïôç!</SelectItem>
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
        story: "Stress test with many options and long content to verify scrolling and overflow.",
      },
    },
  },
};

export const WithDebug: Story = {
  render: SelectTemplate,
  args: {
    debug: true,
    disabled: false,
    placeholder: "Select with debug enabled",
  },
  parameters: {
    docs: {
      description: {
        story: "Debug mode enabled — check the browser console for prop logs.",
      },
    },
  },
};

export const WithAllowClear: Story = {
  render: (args) => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <VStack gap={2}>
          <h3 className="text-sm font-medium">Allow Clear — without default value</h3>
          <Select allowClear>
            <SelectTrigger>
              <SelectValue placeholder="Select an option (clearable)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </VStack>

        <VStack gap={2}>
          <h3 className="text-sm font-medium">Allow Clear — with default value</h3>
          <Select allowClear defaultValue="option2">
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
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
        story: "Select with `allowClear={true}`. The X icon lets the user clear the selection once a value is set.",
      },
    },
  },
};

// --------------------------------------------------------------------------
// Avatar inside SelectItem
// --------------------------------------------------------------------------
//
// No dedicated component needed: just compose Select + Avatar + AvatarImage +
// AvatarFallback directly inside each SelectItem.
//
// Radix trick: SelectValue (in the trigger) automatically projects the
// content of SelectPrimitive.ItemText from the selected item. Since our
// SelectItem wraps its children in ItemText, the avatar + name rendered in
// each item show up as-is in the trigger once that item is selected.

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
    // photoUrl set on this entry to showcase the image case (while the
    // others rely on the initials fallback only).
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
              <SelectValue placeholder="Select a supplier..." />
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
        story: `Pattern for showing avatars inside a Select without a dedicated component.

\`\`\`tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="pl-1">
    <SelectValue placeholder="Select a supplier..." />
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

**Why it works**: \`SelectItem\` wraps its children in \`SelectPrimitive.ItemText\`, and \`SelectValue\` (in the trigger) projects the content of that \`ItemText\` once an item is selected. The avatar + name therefore appears both in the dropdown and in the trigger, with no markup duplication.

**Visual tweaks**:
- The \`size="small"\` avatar (16 px) fits comfortably inside the 30 px standard trigger height, so no need to change it.
- \`<SelectTrigger className="pl-1">\` and \`<SelectItem className="pl-1">\` — \`padding-left\` is reduced from 12 px (default \`pl-3\`) to 4 px (\`pl-1\`), on both the trigger and the items, so the avatar sits flush with the left edge and stays aligned between the trigger and the open list.
- The default \`AvatarFallback\` uses \`bg-muted\` (a neutral shadcn token) — pass \`style\` or \`className\` for a brand color.`,
      },
    },
  },
};
