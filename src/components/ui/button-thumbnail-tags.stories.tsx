import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonThumbnailTags, TagsData } from "@/components/ui/button-thumbnail-tags"
import { Layout, VStack, HStack } from "@/components/layout"
import { useState } from "react"

const meta = {
  title: "UI/ButtonThumbnailTags",
  component: ButtonThumbnailTags,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `ButtonThumbnailTags component that extends Toggle with a dropdown menu for managing tags. The toggle displays a tag icon and an indicator when at least one tag is active. The dropdown menu shows active tags with the ability to remove them and add new ones.

## Features
- Built on Toggle component (inherits all Toggle/Button features)
- Displays a tag icon when closed
- Shows an indicator dot when at least one tag is active
- Dropdown menu with list of active tags (TagText components)
- Ability to remove tags via TagCross
- Form to add new tags at the bottom of the menu
- Optional title displayed in the menu
- Automatic styling based on data-bg context (white, grey, black)
- Auto-positioning menu (drops where there's space)
- Configurable menu position and alignment (menuSide, menuAlign)

## Display Behavior

### When Closed
- Shows a tag icon
- Shows a yellow indicator dot if at least one tag is active

### When Open
- Optional title at the top (if provided)
- List of active tags displayed as TagText components (with remove capability)
- Form at the bottom to add new tags (Input + Button)

## Basic Usage

\`\`\`tsx
import { ButtonThumbnailTags, Layout } from '@story-gs-react';

const [tags, setTags] = useState({
  "GRADED": true,
  "PACKSHOT": true,
  "NULL": false,
  "TOUCH": true,
  "TAG1": true,
  "TAG2": true
});

<Layout bg="white">
  <ButtonThumbnailTags 
    value={tags}
    onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
    onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
  />
</Layout>
\`\`\`

## Controlled Mode

\`\`\`tsx
const [tags, setTags] = useState({ "GRADED": true });
const [open, setOpen] = useState(false);

<ButtonThumbnailTags 
  value={tags}
  open={open}
  onOpenChange={setOpen}
  onAddTag={(tagName) => {
    setTags({ ...tags, [tagName]: true });
    setOpen(false);
  }}
  onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
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
      control: "object",
      description: "Tags data object { [tagName]: boolean }",
    },
    onAddTag: {
      action: "tagAdded",
      description: "Callback called when a new tag is added",
    },
    onRemoveTag: {
      action: "tagRemoved",
      description: "Callback called when a tag is removed",
    },
    title: {
      control: "text",
      description: "Optional title displayed in the menu",
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
} satisfies Meta<typeof ButtonThumbnailTags>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [tags, setTags] = useState<TagsData>(args.value ?? {
      "GRADED": true,
      "PACKSHOT": true,
      "NULL": false,
      "TOUCH": true,
      "TAG1": true,
      "TAG2": true,
    })
    return (
      <Layout bg="white" padding={6}>
        <ButtonThumbnailTags 
          {...args} 
          value={tags}
          onAddTag={(tagName) => {
            setTags({ ...tags, [tagName]: true })
            args.onAddTag?.(tagName)
          }}
          onRemoveTag={(tagName) => {
            setTags({ ...tags, [tagName]: false })
            args.onRemoveTag?.(tagName)
          }}
        />
      </Layout>
    )
  },
  args: {
    value: {
      "GRADED": true,
      "PACKSHOT": true,
      "NULL": false,
      "TOUCH": true,
      "TAG1": true,
      "TAG2": true,
    },
    variant: "normal",
    size: "medium",
    title: "Lorem ipsum",
  },
}

export const WithTitle: Story = {
  render: () => {
    const [tags, setTags] = useState<TagsData>({
      "GRADED": true,
      "PACKSHOT": true,
      "TOUCH": true,
    })
    return (
      <Layout bg="white" padding={6}>
        <ButtonThumbnailTags 
          value={tags}
          title="Lorem ipsum"
          onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
          onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
        />
      </Layout>
    )
  },
}

export const WithoutTitle: Story = {
  render: () => {
    const [tags, setTags] = useState<TagsData>({
      "GRADED": true,
      "PACKSHOT": true,
      "TOUCH": true,
    })
    return (
      <Layout bg="white" padding={6}>
        <ButtonThumbnailTags 
          value={tags}
          onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
          onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
        />
      </Layout>
    )
  },
}

export const NoActiveTags: Story = {
  render: () => {
    const [tags, setTags] = useState<TagsData>({
      "GRADED": false,
      "PACKSHOT": false,
      "NULL": false,
      "TOUCH": false,
    })
    return (
      <Layout bg="white" padding={6}>
        <ButtonThumbnailTags 
          value={tags}
          title="Tags"
          onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
          onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
        />
      </Layout>
    )
  },
}

export const AllVariants: Story = {
  render: () => {
    const [tags, setTags] = useState<TagsData>({
      normal: true,
      secondary: true,
      ghost: true,
      outline: true,
    })
    return (
      <VStack gap={6} padding={6}>
        <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3">Background White</h3>
          <HStack gap={3}>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="normal"
                value={{ normal: tags.normal }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-grey-stronger">Normal</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="secondary"
                value={{ secondary: tags.secondary }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-grey-stronger">Secondary</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="ghost"
                value={{ ghost: tags.ghost }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-grey-stronger">Ghost</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="outline"
                value={{ outline: tags.outline }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-grey-stronger">Outline</span>
            </VStack>
          </HStack>
        </VStack>

        <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3">Background Grey</h3>
          <HStack gap={3}>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="normal"
                value={{ normal: tags.normal }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-grey-stronger">Normal</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="secondary"
                value={{ secondary: tags.secondary }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-grey-stronger">Secondary</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="ghost"
                value={{ ghost: tags.ghost }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-grey-stronger">Ghost</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="outline"
                value={{ outline: tags.outline }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-grey-stronger">Outline</span>
            </VStack>
          </HStack>
        </VStack>

        <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3 text-white">Background Black</h3>
          <HStack gap={3}>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="normal"
                value={{ normal: tags.normal }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-white">Normal</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="secondary"
                value={{ secondary: tags.secondary }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-white">Secondary</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="ghost"
                value={{ ghost: tags.ghost }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-white">Ghost</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="outline"
                value={{ outline: tags.outline }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
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
    const [tags, setTags] = useState<TagsData>({
      small: true,
      medium: true,
      large: true,
    })
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <HStack gap={3} align="center">
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="normal"
                size="small"
                value={{ small: tags.small }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-grey-stronger">Small</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="normal"
                size="medium"
                value={{ medium: tags.medium }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
              <span className="text-xs text-grey-stronger">Medium</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags
                variant="normal"
                size="large"
                value={{ large: tags.large }}
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
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
              <ButtonThumbnailTags 
                value={{ "GRADED": false }} 
                disabled 
              />
              <span className="text-xs text-grey-stronger">No tags (disabled)</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailTags 
                value={{ "GRADED": true, "PACKSHOT": true }} 
                disabled 
              />
              <span className="text-xs text-grey-stronger">With tags (disabled)</span>
            </VStack>
          </HStack>
        </VStack>
      </Layout>
    )
  },
}

export const Controlled: Story = {
  render: () => {
    const [tags, setTags] = useState<TagsData>({
      "GRADED": true,
      "PACKSHOT": true,
    })
    const [open, setOpen] = useState(false)
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <div>
            <p className="text-sm text-grey-stronger mb-2">
              Tags actifs: {Object.entries(tags).filter(([_, v]) => v).map(([k]) => k).join(", ") || "Aucun"}
            </p>
            <p className="text-sm text-grey-stronger mb-4">
              Menu ouvert: {open ? 'Oui' : 'Non'}
            </p>
            <ButtonThumbnailTags
              value={tags}
              open={open}
              onOpenChange={setOpen}
              title="Tags"
              onAddTag={(tagName) => {
                setTags({ ...tags, [tagName]: true })
                setOpen(false)
              }}
              onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
            />
          </div>
        </VStack>
      </Layout>
    )
  },
}

export const DebugMode: Story = {
  render: () => {
    const [tags, setTags] = useState<TagsData>({
      "GRADED": true,
      "PACKSHOT": true,
      "TOUCH": true,
    })
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <p className="text-sm text-grey-stronger">
            Ouvrez la console pour voir les logs de debug
          </p>
          <ButtonThumbnailTags
            value={tags}
            title="Tags"
            onAddTag={(tagName) => {
              setTags({ ...tags, [tagName]: true })
              console.log("Tag added:", tagName)
            }}
            onRemoveTag={(tagName) => {
              setTags({ ...tags, [tagName]: false })
              console.log("Tag removed:", tagName)
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
    const [tags, setTags] = useState<TagsData>({
      default: true,
      bottomEnd: true,
      topEnd: true,
      center: true,
      right: true,
      left: true,
    })
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={8}>
          <div>
            <h3 className="gs-typo-h3 mb-4">Position par défaut (bottom, start)</h3>
            <ButtonThumbnailTags
              value={{ default: tags.default }}
              title="Tags"
              onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
              onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
            />
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">En bas, aligné à droite</h3>
            <div className="flex justify-end">
              <ButtonThumbnailTags
                value={{ bottomEnd: tags.bottomEnd }}
                title="Tags"
                menuSide="bottom"
                menuAlign="end"
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
            </div>
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">En haut, aligné à droite</h3>
            <div className="flex justify-end">
              <ButtonThumbnailTags
                value={{ topEnd: tags.topEnd }}
                title="Tags"
                menuSide="top"
                menuAlign="end"
                onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
                onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
              />
            </div>
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">Centré</h3>
            <ButtonThumbnailTags
              value={{ center: tags.center }}
              title="Tags"
              menuSide="bottom"
              menuAlign="center"
              onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
              onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
            />
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">À droite, aligné en haut</h3>
            <ButtonThumbnailTags
              value={{ right: tags.right }}
              title="Tags"
              menuSide="right"
              menuAlign="start"
              onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
              onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
            />
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">À gauche, aligné en haut</h3>
            <ButtonThumbnailTags
              value={{ left: tags.left }}
              title="Tags"
              menuSide="left"
              menuAlign="start"
              onAddTag={(tagName) => setTags({ ...tags, [tagName]: true })}
              onRemoveTag={(tagName) => setTags({ ...tags, [tagName]: false })}
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



