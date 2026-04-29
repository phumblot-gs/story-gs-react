import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonThumbnailStars } from "@/components/ui/button-thumbnail-stars"
import { Layout, VStack, HStack } from "@/components/layout"
import { useState } from "react"

const meta = {
  title: "UI/ButtonThumbnailStars",
  component: ButtonThumbnailStars,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `ButtonThumbnailStars component that extends Toggle with a dropdown menu for selecting star ratings (0 to 5). The toggle displays a star icon and the current rating value. The dropdown menu can display ratings in two modes: normal (with labels) or compact (2x3 grid).

## Features
- Built on Toggle component (inherits all Toggle/Button features)
- Displays a star icon and rating value when closed
- Two menu display modes: normal (with labels) or compact (grid)
- Visual feedback when menu is open (Toggle's isActive state)
- Automatic styling based on data-bg context (white, grey, black)
- Auto-positioning menu (drops where there's space)
- Configurable menu position and alignment (menuSide, menuAlign)
- No children needed - content is predefined

## Display Behavior

### When Closed
- **0 stars**: Shows an empty star icon (no number)
- **1-5 stars**: Shows a filled yellow star icon + the number

### When Open - Normal Mode (default)
- Shows a vertical list of 6 options (0 to 5 stars)
- Each option displays 5 stars: yellow for selected value, black for remaining
- Labels show the numerical value
- Selected item has visual feedback

### When Open - Compact Mode (\`compact={true}\`)
- Shows a 2x3 grid of star rating options
- Each option displays a single star (black for 0, yellow for 1-5) and the number
- Options have rounded grey background
- Selected option has darker background

## Basic Usage

\`\`\`tsx
import { ButtonThumbnailStars, Layout } from '@story-gs-react';

const [rating, setRating] = useState(0);

<Layout bg="white">
  <ButtonThumbnailStars 
    value={rating}
    onClick={(value) => setRating(value)}
  />
</Layout>
\`\`\`

## Controlled Mode

\`\`\`tsx
const [rating, setRating] = useState(3);
const [open, setOpen] = useState(false);

<ButtonThumbnailStars 
  value={rating}
  open={open}
  onOpenChange={setOpen}
  onClick={(value) => {
    setRating(value);
    setOpen(false);
  }}
/>
\`\`\`

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
  <ButtonThumbnailStars value={3} onClick={...} menuBgContext="white" />
</Layout>
\`\`\`
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 5, step: 1 },
      description: "Number of stars selected (0 to 5)",
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
      action: "starClicked",
      description: "Callback called when a star rating is selected",
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
      description: "Display mode: false (default) = normal menu with labels, true = compact 2x3 grid without labels",
    },
    menuBgContext: {
      control: "select",
      options: [undefined, "white", "grey", "black"],
      description: "Force the menu background context (button keeps adapting to parent). When set, the menu is styled as if on that background.",
    },
  },
} satisfies Meta<typeof ButtonThumbnailStars>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [rating, setRating] = useState(args.value ?? 0)
    return (
      <Layout bg="white" padding={6}>
        <ButtonThumbnailStars 
          {...args} 
          value={rating}
          onClick={(value) => {
            setRating(value)
            args.onClick?.(value)
          }}
        />
      </Layout>
    )
  },
  args: {
    value: 0,
    variant: "normal",
    size: "medium",
  },
}

export const AllRatings: Story = {
  render: () => {
    const [ratings, setRatings] = useState([0, 1, 2, 3, 4, 5])
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <h3 className="gs-typo-h3">Toutes les valeurs possibles</h3>
          <HStack gap={3} align="center">
            {ratings.map((rating, index) => (
              <VStack key={rating} gap={2} align="center">
                <ButtonThumbnailStars
                  value={rating}
                  onClick={(value) => {
                    const newRatings = [...ratings]
                    newRatings[index] = value
                    setRatings(newRatings)
                  }}
                />
                <span className="text-xs text-grey-stronger">{rating} étoile{rating > 1 ? 's' : ''}</span>
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
    const [ratings, setRatings] = useState({
      normal: 3,
      secondary: 2,
      ghost: 4,
      outline: 1,
    })
    return (
      <VStack gap={6} padding={6}>
        <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3">Background White</h3>
          <HStack gap={3}>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="normal"
                value={ratings.normal}
                onClick={(value) => setRatings({ ...ratings, normal: value })}
              />
              <span className="text-xs text-grey-stronger">Normal</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="secondary"
                value={ratings.secondary}
                onClick={(value) => setRatings({ ...ratings, secondary: value })}
              />
              <span className="text-xs text-grey-stronger">Secondary</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="ghost"
                value={ratings.ghost}
                onClick={(value) => setRatings({ ...ratings, ghost: value })}
              />
              <span className="text-xs text-grey-stronger">Ghost</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="outline"
                value={ratings.outline}
                onClick={(value) => setRatings({ ...ratings, outline: value })}
              />
              <span className="text-xs text-grey-stronger">Outline</span>
            </VStack>
          </HStack>
        </VStack>

        <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3">Background Grey</h3>
          <HStack gap={3}>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="normal"
                value={ratings.normal}
                onClick={(value) => setRatings({ ...ratings, normal: value })}
              />
              <span className="text-xs text-grey-stronger">Normal</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="secondary"
                value={ratings.secondary}
                onClick={(value) => setRatings({ ...ratings, secondary: value })}
              />
              <span className="text-xs text-grey-stronger">Secondary</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="ghost"
                value={ratings.ghost}
                onClick={(value) => setRatings({ ...ratings, ghost: value })}
              />
              <span className="text-xs text-grey-stronger">Ghost</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="outline"
                value={ratings.outline}
                onClick={(value) => setRatings({ ...ratings, outline: value })}
              />
              <span className="text-xs text-grey-stronger">Outline</span>
            </VStack>
          </HStack>
        </VStack>

        <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3 text-white">Background Black</h3>
          <HStack gap={3}>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="normal"
                value={ratings.normal}
                onClick={(value) => setRatings({ ...ratings, normal: value })}
              />
              <span className="text-xs text-white">Normal</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="secondary"
                value={ratings.secondary}
                onClick={(value) => setRatings({ ...ratings, secondary: value })}
              />
              <span className="text-xs text-white">Secondary</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="ghost"
                value={ratings.ghost}
                onClick={(value) => setRatings({ ...ratings, ghost: value })}
              />
              <span className="text-xs text-white">Ghost</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="outline"
                value={ratings.outline}
                onClick={(value) => setRatings({ ...ratings, outline: value })}
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
    const [ratings, setRatings] = useState({
      small: 2,
      medium: 3,
      large: 4,
    })
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <HStack gap={3} align="center">
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="normal"
                size="small"
                value={ratings.small}
                onClick={(value) => setRatings({ ...ratings, small: value })}
              />
              <span className="text-xs text-grey-stronger">Small</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="normal"
                size="medium"
                value={ratings.medium}
                onClick={(value) => setRatings({ ...ratings, medium: value })}
              />
              <span className="text-xs text-grey-stronger">Medium</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars
                variant="normal"
                size="large"
                value={ratings.large}
                onClick={(value) => setRatings({ ...ratings, large: value })}
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
              <ButtonThumbnailStars value={0} disabled />
              <span className="text-xs text-grey-stronger">0 stars (disabled)</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars value={3} disabled />
              <span className="text-xs text-grey-stronger">3 stars (disabled)</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailStars value={5} disabled />
              <span className="text-xs text-grey-stronger">5 stars (disabled)</span>
            </VStack>
          </HStack>
        </VStack>
      </Layout>
    )
  },
}

export const Controlled: Story = {
  render: () => {
    const [rating, setRating] = useState(2)
    const [open, setOpen] = useState(false)
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <div>
            <p className="text-sm text-grey-stronger mb-2">
              Rating actuel: {rating} étoile{rating > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-grey-stronger mb-4">
              Menu ouvert: {open ? 'Oui' : 'Non'}
            </p>
            <ButtonThumbnailStars
              value={rating}
              open={open}
              onOpenChange={setOpen}
              onClick={(value) => {
                setRating(value)
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
    const [rating, setRating] = useState(3)
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <p className="text-sm text-grey-stronger">
            Ouvrez la console pour voir les logs de debug
          </p>
          <ButtonThumbnailStars
            value={rating}
            onClick={(value) => {
              setRating(value)
              console.log("Rating changed to:", value)
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
    const [rating, setRating] = useState(3)
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <p className="text-sm text-grey-stronger">
            Menu normal (par défaut) avec labels
          </p>
          <ButtonThumbnailStars
            value={rating}
            onClick={(value) => setRating(value)}
            compact={false}
          />
        </VStack>
      </Layout>
    )
  },
}

export const CompactMenu: Story = {
  render: () => {
    const [rating, setRating] = useState(3)
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <p className="text-sm text-grey-stronger">
            Menu compact (grille 2x3 sans labels)
          </p>
          <ButtonThumbnailStars
            value={rating}
            onClick={(value) => setRating(value)}
            compact={true}
          />
        </VStack>
      </Layout>
    )
  },
}

export const MenuBgContext: Story = {
  render: () => {
    const [rating, setRating] = useState(3)
    return (
      <VStack gap={6} padding={6}>
        <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3 text-white">Fond noir — menu forcé en fond clair (menuBgContext="white")</h3>
          <p className="text-sm text-white/80 mb-2">
            Le bouton reste adapté au fond noir ; le menu s&apos;affiche comme sur un fond blanc.
          </p>
          <ButtonThumbnailStars
            value={rating}
            onClick={(value) => setRating(value)}
            menuBgContext="white"
          />
        </VStack>
        <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3">Fond blanc — menu forcé en fond noir (menuBgContext="black")</h3>
          <p className="text-sm text-grey-stronger mb-2">
            Le bouton reste adapté au fond blanc ; le menu s&apos;affiche comme sur un fond noir.
          </p>
          <ButtonThumbnailStars
            value={rating}
            onClick={(value) => setRating(value)}
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
    const [ratings, setRatings] = useState({
      default: 2,
      bottomEnd: 3,
      topEnd: 4,
      center: 1,
      right: 5,
      left: 0,
    })
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={8}>
          <div>
            <h3 className="gs-typo-h3 mb-4">Position par défaut (bottom, start)</h3>
            <ButtonThumbnailStars
              value={ratings.default}
              onClick={(value) => setRatings({ ...ratings, default: value })}
            />
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">En bas, aligné à droite</h3>
            <div className="flex justify-end">
              <ButtonThumbnailStars
                value={ratings.bottomEnd}
                onClick={(value) => setRatings({ ...ratings, bottomEnd: value })}
                menuSide="bottom"
                menuAlign="end"
              />
            </div>
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">En haut, aligné à droite</h3>
            <div className="flex justify-end">
              <ButtonThumbnailStars
                value={ratings.topEnd}
                onClick={(value) => setRatings({ ...ratings, topEnd: value })}
                menuSide="top"
                menuAlign="end"
              />
            </div>
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">Centré</h3>
            <ButtonThumbnailStars
              value={ratings.center}
              onClick={(value) => setRatings({ ...ratings, center: value })}
              menuSide="bottom"
              menuAlign="center"
            />
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">À droite, aligné en haut</h3>
            <ButtonThumbnailStars
              value={ratings.right}
              onClick={(value) => setRatings({ ...ratings, right: value })}
              menuSide="right"
              menuAlign="start"
            />
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">À gauche, aligné en haut</h3>
            <ButtonThumbnailStars
              value={ratings.left}
              onClick={(value) => setRatings({ ...ratings, left: value })}
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

