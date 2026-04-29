import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonThumbnailLabels, LabelColor } from "@/components/ui/button-thumbnail-labels"
import { Layout, VStack, HStack } from "@/components/layout"
import { useState } from "react"
import { cn } from "@/lib/utils"

const meta = {
  title: "UI/ButtonThumbnailLabels",
  component: ButtonThumbnailLabels,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `ButtonThumbnailLabels component that extends Toggle with a dropdown menu for selecting label colors. The toggle displays the current selected color (or transparent with dashed border if none). The dropdown menu can display colors in two modes: normal (with labels) or compact (3x3 grid).

## Features
- Built on Toggle component (inherits all Toggle/Button features)
- Displays the current selected color when closed
- Shows transparent with dashed border if no color is selected
- Two menu display modes: normal (with labels) or compact (grid)
- Internationalization support with customizable translations
- Visual feedback when menu is open (Toggle's isActive state)
- Automatic styling based on data-bg context (white, grey, black)
- Auto-positioning menu (drops where there's space)
- Configurable menu position and alignment (menuSide, menuAlign)
- No children needed - content is predefined

## Display Behavior

### When Closed
- **No color selected**: Shows transparent square with dashed border
- **Color selected**: Shows a square with the selected color

### When Open - Normal Mode (default)
- Shows a vertical list of color options with labels
- Each option displays the color in a circle with background:
  - Selected color: white background circle
  - Other colors: grey background circle (\`--color-black-secondary\`)
- Labels are internationalized (FR/EN by default, customizable)
- Selected item has white background with black text

### When Open - Compact Mode (\`compact={true}\`)
- Shows a 3x3 grid of color options without labels
- First option is transparent (dashed border)
- Other options display solid color squares in circles
- Selected color has white background circle, others have grey background

## Available Colors

- **Transparent** (null): No color, displayed with dashed border
- **Blue**: \`var(--label-blue)\`
- **Green**: \`var(--label-green)\`
- **Orange**: \`var(--label-orange)\`
- **Pink**: \`var(--label-pink)\`
- **Purple**: \`var(--label-purple)\`
- **Red**: \`var(--label-red)\`
- **Yellow**: \`var(--color-yellow)\`
- **White**: \`var(--label-white)\`

## Basic Usage

\`\`\`tsx
import { ButtonThumbnailLabels, Layout } from '@story-gs-react';

const [color, setColor] = useState<LabelColor>(null);

<Layout bg="white">
  <ButtonThumbnailLabels 
    value={color}
    onClick={(value) => setColor(value)}
  />
</Layout>
\`\`\`

## Controlled Mode

\`\`\`tsx
const [color, setColor] = useState<LabelColor>("blue");
const [open, setOpen] = useState(false);

<ButtonThumbnailLabels 
  value={color}
  open={open}
  onOpenChange={setOpen}
  onClick={(value) => {
    setColor(value);
    setOpen(false);
  }}
/>
\`\`\`

## Internationalization

The component supports internationalization through the \`TranslationProvider\` or via props:

\`\`\`tsx
// Using TranslationProvider (automatic)
<TranslationProvider>
  <ButtonThumbnailLabels value={color} onClick={setColor} />
</TranslationProvider>

// With custom translations
<ButtonThumbnailLabels 
  value={color} 
  onClick={setColor}
  translations={{
    "label.blue": { FR: "Bleu", EN: "Blue", ES: "Azul" },
    "label.red": { FR: "Rouge", EN: "Red", ES: "Rojo" }
  }}
  language="ES"
/>
\`\`\`

Available translation keys: \`label.none\`, \`label.blue\`, \`label.green\`, \`label.orange\`, \`label.pink\`, \`label.purple\`, \`label.red\`, \`label.yellow\`, \`label.white\`

## Background Context Adaptation

The button and menu styles adapt automatically based on the parent Layout's \`data-bg\`. Use \`menuBgContext\` to force the menu to use a different background context while the button keeps adapting to the parent.

- **White/Grey backgrounds**: 
  - Menu container: black background
  - Menu items: black-secondary background
  
- **Black background**: 
  - Menu container: black-secondary background
  - Menu items: black background

## Forced Menu Background (\`menuBgContext\`)

When set, the menu is styled as if it were on that background (e.g. \`menuBgContext="white"\` on a black layout: button stays black, menu uses white/grey styling).

\`\`\`tsx
<Layout bg="black">
  <ButtonThumbnailLabels value="blue" onClick={...} menuBgContext="white" />
</Layout>
\`\`\`
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "select",
      options: [null, "blue", "green", "orange", "pink", "purple", "red", "yellow", "white"],
      description: "Selected label color (null for transparent)",
    },
    variant: {
      control: "select",
      options: ["normal", "secondary", "ghost", "outline", "destructive", "link"],
      description: "Button variant (inherited from Button)",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Button size (inherited from Button)",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
    onClick: {
      action: "colorClicked",
      description: "Callback called when a color is selected",
    },
    onFocus: {
      action: "focused",
      description: "Callback called when the button receives focus",
    },
    onBlur: {
      action: "blurred",
      description: "Callback called when the button loses focus",
    },
    open: {
      control: "boolean",
      description: "Controlled open state of the menu",
    },
    defaultOpen: {
      control: "boolean",
      description: "Initial open state of the menu (uncontrolled mode)",
    },
    onOpenChange: {
      action: "openChange",
      description: "Callback called when the menu open state changes",
    },
    debug: {
      control: "boolean",
      description: "Debug mode: logs props and actions to console",
    },
    menuMaxHeight: {
      control: "text",
      description: "Maximum height of the dropdown menu (e.g., 'max-h-[40vh]', 'max-h-96'). Default: 'max-h-[calc(100vh-2rem)]'",
    },
    menuSide: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Preferred side where the menu opens. The menu will automatically adjust if there's not enough space. Default: 'bottom'",
    },
    menuAlign: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Preferred alignment of the menu relative to the button. The menu will automatically adjust if there's not enough space. Default: 'start'",
    },
    compact: {
      control: "boolean",
      description: "Display mode: false (default) = normal menu with labels, true = compact 3x3 grid without labels",
    },
    language: {
      control: "text",
      description: "Custom language code (e.g., 'FR', 'EN', 'ES'). If not provided, uses TranslationProvider language or 'EN' by default",
    },
    menuBgContext: {
      control: "select",
      options: [undefined, "white", "grey", "black"],
      description: "Force the menu background context (button keeps adapting to parent). When set, the menu is styled as if on that background.",
    },
  },
} satisfies Meta<typeof ButtonThumbnailLabels>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [color, setColor] = useState<LabelColor>(args.value ?? null)
    return (
      <Layout bg="white" padding={6}>
        <ButtonThumbnailLabels 
          {...args} 
          value={color}
          onClick={(value) => {
            setColor(value)
            args.onClick?.(value)
          }}
        />
      </Layout>
    )
  },
  args: {
    value: null,
    variant: "normal",
    size: "medium",
  },
}

export const AllColors: Story = {
  render: () => {
    const colors: LabelColor[] = [null, "blue", "green", "orange", "pink", "purple", "red", "yellow", "white"]
    const [selectedColors, setSelectedColors] = useState<LabelColor[]>(colors)
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <h3 className="gs-typo-h3">Toutes les couleurs possibles</h3>
          <HStack gap={3} align="center" wrap>
            {colors.map((color, index) => (
              <VStack key={color ?? "transparent"} gap={2} align="center">
                <ButtonThumbnailLabels
                  value={selectedColors[index]}
                  onClick={(value) => {
                    const newColors = [...selectedColors]
                    newColors[index] = value
                    setSelectedColors(newColors)
                  }}
                />
                <span className="text-xs text-grey-stronger">
                  {color === null ? "Transparent" : color}
                </span>
              </VStack>
            ))}
          </HStack>
        </VStack>
      </Layout>
    )
  },
}

export const AllVariants: Story = {
  render: () => {
    const [colors, setColors] = useState({
      normal: "blue" as LabelColor,
      secondary: "green" as LabelColor,
      ghost: "orange" as LabelColor,
      outline: "pink" as LabelColor,
    })
    return (
      <VStack gap={6} padding={6}>
        <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3">Background White</h3>
          <HStack gap={3}>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="normal"
                value={colors.normal}
                onClick={(value) => setColors({ ...colors, normal: value })}
              />
              <span className="text-xs text-grey-stronger">Normal</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="secondary"
                value={colors.secondary}
                onClick={(value) => setColors({ ...colors, secondary: value })}
              />
              <span className="text-xs text-grey-stronger">Secondary</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="ghost"
                value={colors.ghost}
                onClick={(value) => setColors({ ...colors, ghost: value })}
              />
              <span className="text-xs text-grey-stronger">Ghost</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="outline"
                value={colors.outline}
                onClick={(value) => setColors({ ...colors, outline: value })}
              />
              <span className="text-xs text-grey-stronger">Outline</span>
            </VStack>
          </HStack>
        </VStack>

        <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3">Background Grey</h3>
          <HStack gap={3}>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="normal"
                value={colors.normal}
                onClick={(value) => setColors({ ...colors, normal: value })}
              />
              <span className="text-xs text-grey-stronger">Normal</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="secondary"
                value={colors.secondary}
                onClick={(value) => setColors({ ...colors, secondary: value })}
              />
              <span className="text-xs text-grey-stronger">Secondary</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="ghost"
                value={colors.ghost}
                onClick={(value) => setColors({ ...colors, ghost: value })}
              />
              <span className="text-xs text-grey-stronger">Ghost</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="outline"
                value={colors.outline}
                onClick={(value) => setColors({ ...colors, outline: value })}
              />
              <span className="text-xs text-grey-stronger">Outline</span>
            </VStack>
          </HStack>
        </VStack>

        <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3 text-white">Background Black</h3>
          <HStack gap={3}>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="normal"
                value={colors.normal}
                onClick={(value) => setColors({ ...colors, normal: value })}
              />
              <span className="text-xs text-white">Normal</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="secondary"
                value={colors.secondary}
                onClick={(value) => setColors({ ...colors, secondary: value })}
              />
              <span className="text-xs text-white">Secondary</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="ghost"
                value={colors.ghost}
                onClick={(value) => setColors({ ...colors, ghost: value })}
              />
              <span className="text-xs text-white">Ghost</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="outline"
                value={colors.outline}
                onClick={(value) => setColors({ ...colors, outline: value })}
              />
              <span className="text-xs text-white">Outline</span>
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    )
  },
  parameters: {
    layout: "fullscreen",
  },
}

export const DifferentSizes: Story = {
  render: () => {
    const [colors, setColors] = useState({
      small: "blue" as LabelColor,
      medium: "green" as LabelColor,
      large: "orange" as LabelColor,
    })
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <HStack gap={3} align="center">
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="normal"
                size="small"
                value={colors.small}
                onClick={(value) => setColors({ ...colors, small: value })}
              />
              <span className="text-xs text-grey-stronger">Small</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="normal"
                size="medium"
                value={colors.medium}
                onClick={(value) => setColors({ ...colors, medium: value })}
              />
              <span className="text-xs text-grey-stronger">Medium</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels
                variant="normal"
                size="large"
                value={colors.large}
                onClick={(value) => setColors({ ...colors, large: value })}
              />
              <span className="text-xs text-grey-stronger">Large</span>
            </VStack>
          </HStack>
        </VStack>
      </Layout>
    )
  },
}

export const Disabled: Story = {
  render: () => {
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <HStack gap={3} align="center">
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels value={null} disabled />
              <span className="text-xs text-grey-stronger">Transparent (disabled)</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels value="blue" disabled />
              <span className="text-xs text-grey-stronger">Blue (disabled)</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailLabels value="red" disabled />
              <span className="text-xs text-grey-stronger">Red (disabled)</span>
            </VStack>
          </HStack>
        </VStack>
      </Layout>
    )
  },
}

export const Controlled: Story = {
  render: () => {
    const [color, setColor] = useState<LabelColor>("blue")
    const [open, setOpen] = useState(false)
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <div>
            <p className="text-sm text-grey-stronger mb-2">
              Couleur actuelle: {color === null ? "Transparent" : color}
            </p>
            <p className="text-sm text-grey-stronger mb-4">
              Menu ouvert: {open ? "Oui" : "Non"}
            </p>
            <ButtonThumbnailLabels
              value={color}
              open={open}
              onOpenChange={setOpen}
              onClick={(value) => {
                setColor(value)
                setOpen(false)
              }}
            />
          </div>
        </VStack>
      </Layout>
    )
  },
}

export const DebugMode: Story = {
  render: () => {
    const [color, setColor] = useState<LabelColor>("green")
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <p className="text-sm text-grey-stronger">
            Ouvrez la console pour voir les logs de debug
          </p>
          <ButtonThumbnailLabels
            value={color}
            onClick={(value) => {
              setColor(value)
              console.log("Color changed to:", value)
            }}
            debug
          />
        </VStack>
      </Layout>
    )
  },
}

export const NormalMenu: Story = {
  render: () => {
    const [color, setColor] = useState<LabelColor>("orange")
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <p className="text-sm text-grey-stronger">
            Menu normal (par défaut) avec labels traduits
          </p>
          <ButtonThumbnailLabels
            value={color}
            onClick={(value) => setColor(value)}
            compact={false}
          />
        </VStack>
      </Layout>
    )
  },
}

export const CompactMenu: Story = {
  render: () => {
    const [color, setColor] = useState<LabelColor>("orange")
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <p className="text-sm text-grey-stronger">
            Menu compact (grille 3x3 sans labels)
          </p>
          <ButtonThumbnailLabels
            value={color}
            onClick={(value) => setColor(value)}
            compact={true}
          />
        </VStack>
      </Layout>
    )
  },
}

export const Internationalization: Story = {
  render: () => {
    const [color, setColor] = useState<LabelColor>("orange")
    const [lang, setLang] = useState<"FR" | "EN" | "ES">("FR")
    
    const customTranslations = {
      "label.none": { FR: "Aucun", EN: "None", ES: "Ninguno" },
      "label.blue": { FR: "Bleu", EN: "Blue", ES: "Azul" },
      "label.green": { FR: "Vert", EN: "Green", ES: "Verde" },
      "label.orange": { FR: "Orange", EN: "Orange", ES: "Naranja" },
      "label.pink": { FR: "Rose", EN: "Pink", ES: "Rosa" },
      "label.purple": { FR: "Violet", EN: "Purple", ES: "Morado" },
      "label.red": { FR: "Rouge", EN: "Red", ES: "Rojo" },
      "label.yellow": { FR: "Jaune", EN: "Yellow", ES: "Amarillo" },
      "label.white": { FR: "Blanc", EN: "White", ES: "Blanco" },
    }
    
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <div>
            <p className="text-sm text-grey-stronger mb-2">
              Langue actuelle: {lang}
            </p>
            <HStack gap={2} className="mb-4">
              <button
                onClick={() => setLang("FR")}
                className={cn(
                  "px-3 py-1 rounded text-sm",
                  lang === "FR" ? "bg-black text-white" : "bg-grey text-black"
                )}
              >
                FR
              </button>
              <button
                onClick={() => setLang("EN")}
                className={cn(
                  "px-3 py-1 rounded text-sm",
                  lang === "EN" ? "bg-black text-white" : "bg-grey text-black"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLang("ES")}
                className={cn(
                  "px-3 py-1 rounded text-sm",
                  lang === "ES" ? "bg-black text-white" : "bg-grey text-black"
                )}
              >
                ES
              </button>
            </HStack>
          </div>
          <ButtonThumbnailLabels
            value={color}
            onClick={(value) => setColor(value)}
            translations={customTranslations}
            language={lang}
            compact={false}
          />
        </VStack>
      </Layout>
    )
  },
}

export const MenuBgContext: Story = {
  render: () => {
    const [color, setColor] = useState<LabelColor>("blue")
    return (
      <VStack gap={6} padding={6}>
        <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3 text-white">Fond noir — menu forcé en fond clair (menuBgContext="white")</h3>
          <p className="text-sm text-white/80 mb-2">
            Le bouton reste adapté au fond noir ; le menu s&apos;affiche comme sur un fond blanc.
          </p>
          <ButtonThumbnailLabels
            value={color}
            onClick={(value) => setColor(value)}
            menuBgContext="white"
          />
        </VStack>
        <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3">Fond blanc — menu forcé en fond noir (menuBgContext="black")</h3>
          <p className="text-sm text-grey-stronger mb-2">
            Le bouton reste adapté au fond blanc ; le menu s&apos;affiche comme sur un fond noir.
          </p>
          <ButtonThumbnailLabels
            value={color}
            onClick={(value) => setColor(value)}
            menuBgContext="black"
          />
        </VStack>
      </VStack>
    )
  },
  parameters: {
    layout: "fullscreen",
  },
}

export const MenuPositioning: Story = {
  render: () => {
    const [colors, setColors] = useState({
      default: "blue" as LabelColor,
      bottomEnd: "green" as LabelColor,
      topEnd: "orange" as LabelColor,
      center: "pink" as LabelColor,
      right: "purple" as LabelColor,
      left: "red" as LabelColor,
    })
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={8}>
          <div>
            <h3 className="gs-typo-h3 mb-4">Position par défaut (bottom, start)</h3>
            <ButtonThumbnailLabels
              value={colors.default}
              onClick={(value) => setColors({ ...colors, default: value })}
            />
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">En bas, aligné à droite</h3>
            <div className="flex justify-end">
              <ButtonThumbnailLabels
                value={colors.bottomEnd}
                onClick={(value) => setColors({ ...colors, bottomEnd: value })}
                menuSide="bottom"
                menuAlign="end"
              />
            </div>
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">En haut, aligné à droite</h3>
            <div className="flex justify-end">
              <ButtonThumbnailLabels
                value={colors.topEnd}
                onClick={(value) => setColors({ ...colors, topEnd: value })}
                menuSide="top"
                menuAlign="end"
              />
            </div>
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">Centré</h3>
            <ButtonThumbnailLabels
              value={colors.center}
              onClick={(value) => setColors({ ...colors, center: value })}
              menuSide="bottom"
              menuAlign="center"
            />
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">À droite, aligné en haut</h3>
            <ButtonThumbnailLabels
              value={colors.right}
              onClick={(value) => setColors({ ...colors, right: value })}
              menuSide="right"
              menuAlign="start"
            />
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">À gauche, aligné en haut</h3>
            <ButtonThumbnailLabels
              value={colors.left}
              onClick={(value) => setColors({ ...colors, left: value })}
              menuSide="left"
              menuAlign="start"
            />
          </div>
        </VStack>
      </Layout>
    )
  },
  parameters: {
    layout: "fullscreen",
  },
}



