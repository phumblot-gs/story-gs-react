import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonThumbnailLabels, LabelColor } from "@/components/ui/button-thumbnail-labels"
import { Layout, VStack, HStack } from "@/components/layout"
import { useState } from "react"

const meta = {
  title: "UI/ButtonThumbnailLabels",
  component: ButtonThumbnailLabels,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `ButtonThumbnailLabels component that extends Toggle with a dropdown menu for selecting label colors. The toggle displays the current selected color (or transparent with dashed border if none). The dropdown menu shows a 3x3 grid of available colors.

## Features
- Built on Toggle component (inherits all Toggle/Button features)
- Displays the current selected color when closed
- Shows transparent with dashed border if no color is selected
- Dropdown menu with a 3x3 grid of color options
- Visual feedback when menu is open (Toggle's isActive state)
- Automatic styling based on data-bg context (white, grey, black)
- Auto-positioning menu (drops where there's space)
- Configurable menu position and alignment (menuSide, menuAlign)
- No children needed - content is predefined

## Display Behavior

### When Closed
- **No color selected**: Shows transparent square with dashed border
- **Color selected**: Shows a square with the selected color

### When Open
- Shows a 3x3 grid of color options
- First option is transparent (dashed border)
- Other options display solid color squares
- Clicking an option triggers \`onClick(value)\` with the selected color (or null for transparent)

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

## Background Context Adaptation

The menu styles adapt automatically based on the parent Layout's \`data-bg\`:

- **White/Grey backgrounds**: 
  - Menu container: black background
  - Menu items: black-secondary background
  
- **Black background**: 
  - Menu container: black-secondary background
  - Menu items: black background
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

