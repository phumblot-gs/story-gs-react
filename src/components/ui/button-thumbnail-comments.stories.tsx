import type { Meta, StoryObj } from "@storybook/react-vite"
import { ButtonThumbnailComments, CommentData } from "@/components/ui/button-thumbnail-comments"
import { Layout, VStack, HStack } from "@/components/layout"
import { useState } from "react"

const meta = {
  title: "UI/ButtonThumbnailComments",
  component: ButtonThumbnailComments,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `ButtonThumbnailComments component that extends Toggle with a dropdown menu for adding comments. The toggle displays a comment icon and an indicator when there's at least one comment of type "Comment". The dropdown menu shows a textarea for adding new comments.

## Features
- Built on Toggle component (inherits all Toggle/Button features)
- Displays a comment icon when closed
- Shows an indicator (yellow dot) when there's at least one comment of type "Comment"
- Dropdown menu with a textarea for adding comments
- Visual feedback when menu is open (Toggle's isActive state)
- Automatic styling based on data-bg context (white, grey, black)
- Auto-positioning menu (drops where there's space)
- Configurable menu position and alignment (menuSide, menuAlign)

## Display Behavior

### When Closed
- Shows a comment icon
- If there's at least one comment of type "Comment", displays a yellow indicator dot

### When Open
- Shows an optional title
- Shows a textarea for entering a new comment
- Shows a "Valider" button to submit the comment

## Basic Usage

\`\`\`tsx
import { ButtonThumbnailComments, Layout } from '@story-gs-react';

const [comments, setComments] = useState([]);

<Layout bg="white">
  <ButtonThumbnailComments 
    value={comments}
    onAddComment={(comment) => {
      // Add comment logic
    }}
  />
</Layout>
\`\`\`

## Controlled Mode

\`\`\`tsx
const [comments, setComments] = useState([]);
const [open, setOpen] = useState(false);

<ButtonThumbnailComments 
  value={comments}
  open={open}
  onOpenChange={setOpen}
  onAddComment={(comment) => {
    // Add comment logic
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
      control: false,
      description: "Array of comments",
    },
    onAddComment: {
      action: "commentAdded",
      description: "Callback called when a comment is added",
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
} satisfies Meta<typeof ButtonThumbnailComments>

export default meta
type Story = StoryObj<typeof meta>

// Helper function to create a comment
const createComment = (
  type: string,
  comment: string,
  login: string = "Laurent",
  firstname: string = "Laurent",
  lastname: string = "Salieres"
): CommentData => ({
  type,
  picture_id: 4624474,
  source_picture_id: 4624474,
  login,
  firstname,
  lastname,
  date: new Date().toISOString(),
  benchsteptype: 40,
  comment,
  avatar: "https://app-19.grand-shooting.com/dynimage/102/300/direct_87ad7117d8e96cdab7f93fcf3d97e865580b195d.jpg/2023_03_PORTRAITS13963_light%20300.jpg",
  access: "admin",
  versionIndex: 1,
})

export const Default: Story = {
  render: (args) => {
    const [comments, setComments] = useState<CommentData[]>(args.value || [])
    return (
      <Layout bg="white" padding={6}>
        <ButtonThumbnailComments 
          {...args} 
          value={comments}
          onAddComment={(comment) => {
            const newComment = createComment("Comment", comment)
            setComments([...comments, newComment])
            args.onAddComment?.(comment)
          }}
        />
      </Layout>
    )
  },
  args: {
    value: [],
    variant: "normal",
    size: "medium",
  },
}

export const WithComments: Story = {
  render: () => {
    const [comments, setComments] = useState<CommentData[]>([
      createComment("Technical", "::@colorTag:ORANGE"),
      createComment("Comment", "test"),
    ])
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <p className="text-sm text-grey-stronger">
            Ce bouton a {comments.filter(c => c.type === "Comment").length} commentaire(s) de type "Comment"
          </p>
          <ButtonThumbnailComments
            value={comments}
            onAddComment={(comment) => {
              const newComment = createComment("Comment", comment)
              setComments([...comments, newComment])
            }}
          />
        </VStack>
      </Layout>
    )
  },
}

export const WithTitle: Story = {
  render: () => {
    const [comments, setComments] = useState<CommentData[]>([])
    return (
      <Layout bg="white" padding={6}>
        <ButtonThumbnailComments
          value={comments}
          title="Ajouter un commentaire"
          onAddComment={(comment) => {
            const newComment = createComment("Comment", comment)
            setComments([...comments, newComment])
          }}
        />
      </Layout>
    )
  },
}

export const AllVariants: Story = {
  render: () => {
    const [comments, setComments] = useState<CommentData[]>({
      normal: [],
      secondary: [createComment("Comment", "test")],
      ghost: [],
      outline: [],
    })
    return (
      <VStack gap={6} padding={6}>
        <VStack as={Layout} bg="white" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3">Background White</h3>
          <HStack gap={3}>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="normal"
                value={comments.normal}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, normal: [...comments.normal, newComment] })
                }}
              />
              <span className="text-xs text-grey-stronger">Normal</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="secondary"
                value={comments.secondary}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, secondary: [...comments.secondary, newComment] })
                }}
              />
              <span className="text-xs text-grey-stronger">Secondary</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="ghost"
                value={comments.ghost}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, ghost: [...comments.ghost, newComment] })
                }}
              />
              <span className="text-xs text-grey-stronger">Ghost</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="outline"
                value={comments.outline}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, outline: [...comments.outline, newComment] })
                }}
              />
              <span className="text-xs text-grey-stronger">Outline</span>
            </VStack>
          </HStack>
        </VStack>

        <VStack as={Layout} bg="grey" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3">Background Grey</h3>
          <HStack gap={3}>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="normal"
                value={comments.normal}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, normal: [...comments.normal, newComment] })
                }}
              />
              <span className="text-xs text-grey-stronger">Normal</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="secondary"
                value={comments.secondary}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, secondary: [...comments.secondary, newComment] })
                }}
              />
              <span className="text-xs text-grey-stronger">Secondary</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="ghost"
                value={comments.ghost}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, ghost: [...comments.ghost, newComment] })
                }}
              />
              <span className="text-xs text-grey-stronger">Ghost</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="outline"
                value={comments.outline}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, outline: [...comments.outline, newComment] })
                }}
              />
              <span className="text-xs text-grey-stronger">Outline</span>
            </VStack>
          </HStack>
        </VStack>

        <VStack as={Layout} bg="black" padding={6} gap={4} className="border border-grey rounded">
          <h3 className="gs-typo-h3 text-white">Background Black</h3>
          <HStack gap={3}>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="normal"
                value={comments.normal}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, normal: [...comments.normal, newComment] })
                }}
              />
              <span className="text-xs text-white">Normal</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="secondary"
                value={comments.secondary}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, secondary: [...comments.secondary, newComment] })
                }}
              />
              <span className="text-xs text-white">Secondary</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="ghost"
                value={comments.ghost}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, ghost: [...comments.ghost, newComment] })
                }}
              />
              <span className="text-xs text-white">Ghost</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="outline"
                value={comments.outline}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, outline: [...comments.outline, newComment] })
                }}
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
    const [comments, setComments] = useState<CommentData[]>({
      small: [],
      medium: [createComment("Comment", "test")],
      large: [],
    })
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <HStack gap={3} align="center">
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="normal"
                size="small"
                value={comments.small}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, small: [...comments.small, newComment] })
                }}
              />
              <span className="text-xs text-grey-stronger">Small</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="normal"
                size="medium"
                value={comments.medium}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, medium: [...comments.medium, newComment] })
                }}
              />
              <span className="text-xs text-grey-stronger">Medium</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments
                variant="normal"
                size="large"
                value={comments.large}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, large: [...comments.large, newComment] })
                }}
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
              <ButtonThumbnailComments value={[]} disabled />
              <span className="text-xs text-grey-stronger">Sans commentaires (disabled)</span>
            </VStack>
            <VStack gap={2} align="center">
              <ButtonThumbnailComments value={[createComment("Comment", "test")]} disabled />
              <span className="text-xs text-grey-stronger">Avec commentaires (disabled)</span>
            </VStack>
          </HStack>
        </VStack>
      </Layout>
    )
  },
}

export const Controlled: Story = {
  render: () => {
    const [comments, setComments] = useState<CommentData[]>([createComment("Comment", "test")])
    const [open, setOpen] = useState(false)
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <div>
            <p className="text-sm text-grey-stronger mb-2">
              Nombre de commentaires: {comments.filter(c => c.type === "Comment").length}
            </p>
            <p className="text-sm text-grey-stronger mb-4">
              Menu ouvert: {open ? 'Oui' : 'Non'}
            </p>
            <ButtonThumbnailComments
              value={comments}
              open={open}
              onOpenChange={setOpen}
              onAddComment={(comment) => {
                const newComment = createComment("Comment", comment)
                setComments([...comments, newComment])
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
    const [comments, setComments] = useState<CommentData[]>([createComment("Comment", "test")])
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <p className="text-sm text-grey-stronger">
            Ouvrez la console pour voir les logs de debug
          </p>
          <ButtonThumbnailComments
            value={comments}
            onAddComment={(comment) => {
              const newComment = createComment("Comment", comment)
              setComments([...comments, newComment])
              console.log("Comment added:", comment)
            }}
            debug
          />
        </VStack>
      </Layout>
    )
  },
}

export const IndicatorBehavior: Story = {
  render: () => {
    const [comments1, setComments1] = useState<CommentData[]>([])
    const [comments2, setComments2] = useState<CommentData[]>([
      createComment("Technical", "::@colorTag:ORANGE"),
    ])
    const [comments3, setComments3] = useState<CommentData[]>([
      createComment("Comment", "test"),
    ])
    const [comments4, setComments4] = useState<CommentData[]>([
      createComment("Technical", "::@colorTag:ORANGE"),
      createComment("Comment", "test"),
      createComment("Comment", "autre commentaire"),
    ])
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <h3 className="gs-typo-h3">Comportement de l'indicateur</h3>
          <VStack gap={3}>
            <HStack gap={3} align="center">
              <ButtonThumbnailComments
                value={comments1}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments1([...comments1, newComment])
                }}
              />
              <span className="text-xs text-grey-stronger">
                Aucun commentaire - pas d'indicateur
              </span>
            </HStack>
            <HStack gap={3} align="center">
              <ButtonThumbnailComments
                value={comments2}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments2([...comments2, newComment])
                }}
              />
              <span className="text-xs text-grey-stronger">
                Seulement Technical - pas d'indicateur
              </span>
            </HStack>
            <HStack gap={3} align="center">
              <ButtonThumbnailComments
                value={comments3}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments3([...comments3, newComment])
                }}
              />
              <span className="text-xs text-grey-stronger">
                1 commentaire type "Comment" - indicateur visible
              </span>
            </HStack>
            <HStack gap={3} align="center">
              <ButtonThumbnailComments
                value={comments4}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments4([...comments4, newComment])
                }}
              />
              <span className="text-xs text-grey-stronger">
                2 commentaires type "Comment" - indicateur visible
              </span>
            </HStack>
          </VStack>
        </VStack>
      </Layout>
    )
  },
}

export const MenuPositioning: Story = {
  render: () => {
    const [comments, setComments] = useState<CommentData[]>({
      default: [],
      bottomEnd: [],
      topEnd: [],
      center: [],
      right: [],
      left: [],
    })
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={8}>
          <div>
            <h3 className="gs-typo-h3 mb-4">Position par défaut (bottom, start)</h3>
            <ButtonThumbnailComments
              value={comments.default}
              onAddComment={(comment) => {
                const newComment = createComment("Comment", comment)
                setComments({ ...comments, default: [...comments.default, newComment] })
              }}
            />
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">En bas, aligné à droite</h3>
            <div className="flex justify-end">
              <ButtonThumbnailComments
                value={comments.bottomEnd}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, bottomEnd: [...comments.bottomEnd, newComment] })
                }}
                menuSide="bottom"
                menuAlign="end"
              />
            </div>
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">En haut, aligné à droite</h3>
            <div className="flex justify-end">
              <ButtonThumbnailComments
                value={comments.topEnd}
                onAddComment={(comment) => {
                  const newComment = createComment("Comment", comment)
                  setComments({ ...comments, topEnd: [...comments.topEnd, newComment] })
                }}
                menuSide="top"
                menuAlign="end"
              />
            </div>
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">Centré</h3>
            <ButtonThumbnailComments
              value={comments.center}
              onAddComment={(comment) => {
                const newComment = createComment("Comment", comment)
                setComments({ ...comments, center: [...comments.center, newComment] })
              }}
              menuSide="bottom"
              menuAlign="center"
            />
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">À droite, aligné en haut</h3>
            <ButtonThumbnailComments
              value={comments.right}
              onAddComment={(comment) => {
                const newComment = createComment("Comment", comment)
                setComments({ ...comments, right: [...comments.right, newComment] })
              }}
              menuSide="right"
              menuAlign="start"
            />
          </div>

          <div>
            <h3 className="gs-typo-h3 mb-4">À gauche, aligné en haut</h3>
            <ButtonThumbnailComments
              value={comments.left}
              onAddComment={(comment) => {
                const newComment = createComment("Comment", comment)
                setComments({ ...comments, left: [...comments.left, newComment] })
              }}
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

