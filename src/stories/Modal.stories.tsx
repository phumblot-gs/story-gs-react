import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Modal } from "@/components/layout/Modal";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Layout/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Modal component built with the Figma design system. Modal displays a centered overlay dialog with customizable content and footer.

## Features
- Centered overlay dialog (fixed positioning, z-index 50)
- Automatic body scroll lock when open
- Close on overlay click (configurable)
- Close on Escape key (configurable)
- Customizable maximum dimensions (maxHeight, maxWidth)
- Footer automatically wrapped in HStack with proper styling
- Scrollable content area
- Customizable overlay and content styling
- Built with Layout components (VStack, HStack) for consistency

## Basic Usage

\`\`\`tsx
import { Modal, Button } from '@story-gs-react';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="p-6">
          <h2 className="gs-typo-h1 mb-4">Modal Title</h2>
          <p className="text-sm text-grey-stronger">
            Modal content goes here.
          </p>
        </div>
      </Modal>
    </>
  );
}
\`\`\`

## With Footer

The \`footer\` prop accepts React nodes that are automatically wrapped in an HStack with \`justify="end"\`, \`align="center"\`, \`gap={3}\`, and \`padding={4}\`:

\`\`\`tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="normal" onClick={handleSave}>
        Save
      </Button>
    </>
  }
>
  <div className="p-6">
    <h2 className="gs-typo-h1 mb-4">Form Title</h2>
    <input
      type="text"
      className="w-full border border-grey rounded px-3 py-2"
      placeholder="Enter text..."
    />
  </div>
</Modal>
\`\`\`

**Footer styling:**
- Automatically wrapped in \`HStack\`
- Right-aligned (\`justify="end"\`)
- Vertically centered (\`align="center"\`)
- Gap of 3 (15px) between items
- Padding of 4 (20px)
- Border-top separator (\`border-t border-grey\`)

## Custom Dimensions

Control the maximum size of the modal using \`maxHeight\` and \`maxWidth\` props:

\`\`\`tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  maxHeight="80vh"
  maxWidth="1200px"
>
  <div className="p-8">
    <h2 className="gs-typo-h1 mb-4">Large Modal</h2>
    <p>This modal has custom dimensions.</p>
  </div>
</Modal>
\`\`\`

**Default values:**
- \`maxHeight\`: \`"90vh"\` (90% of viewport height)
- \`maxWidth\`: \`"90vw"\` (90% of viewport width)

## Close Behavior

Configure how the modal closes:

\`\`\`tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  closeOnOverlayClick={true}   {/* Close when clicking overlay */}
  closeOnEscape={true}          {/* Close when pressing Escape */}
>
  <div className="p-6">Content</div>
</Modal>
\`\`\`

**Close behavior defaults:**
- \`closeOnOverlayClick\`: \`true\` (clicking the overlay closes the modal)
- \`closeOnEscape\`: \`true\` (pressing Escape closes the modal)

## Scrollable Content

The modal content area automatically handles overflow with vertical scrolling:

\`\`\`tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  contentClassName="max-h-[400px]"
>
  <div className="p-6">
    <h2 className="gs-typo-h1 mb-4">Scrollable Content</h2>
    <div className="space-y-4">
      {Array.from({ length: 15 }).map((_, i) => (
        <p key={i}>Paragraph {i + 1}</p>
      ))}
    </div>
  </div>
</Modal>
\`\`\`

## Custom Styling

Customize overlay, content, and footer styling using className props:

\`\`\`tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  overlayClassName="bg-black/50"        {/* Custom overlay */}
  contentClassName="rounded-lg"           {/* Custom content */}
  footerClassName="bg-grey-light"         {/* Custom footer */}
  className="shadow-2xl"                   {/* Custom modal container */}
>
  <div className="p-6">Content</div>
</Modal>
\`\`\`

**Available className props:**
- \`overlayClassName\`: Styles for the overlay backdrop
- \`contentClassName\`: Styles for the scrollable content area
- \`footerClassName\`: Styles for the footer HStack
- \`className\`: Styles for the modal VStack container

## Body Scroll Lock

When the modal is open, the body scroll is automatically locked to prevent background scrolling. This is handled internally and restored when the modal closes.

## Common Use Cases

### Confirmation Dialog
\`\`\`tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleConfirm}>
        Delete
      </Button>
    </>
  }
>
  <div className="p-6">
    <h2 className="gs-typo-h1 mb-4">Confirm Deletion</h2>
    <p>Are you sure you want to delete this item?</p>
  </div>
</Modal>
\`\`\`

### Form Modal
\`\`\`tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  maxWidth="600px"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="normal" onClick={handleSubmit}>
        Submit
      </Button>
    </>
  }
>
  <div className="p-6">
    <h2 className="gs-typo-h1 mb-6">Create Account</h2>
    <VStack gap={4}>
      <Input label="Name" />
      <Input label="Email" />
      <Textarea label="Message" />
    </VStack>
  </div>
</Modal>
\`\`\`

### Full-Screen Modal
\`\`\`tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  maxHeight="100vh"
  maxWidth="100vw"
  className="rounded-none"
>
  <div className="p-8">
    <h2 className="gs-typo-h1 mb-4">Full Screen Modal</h2>
    <p>Content that takes the full viewport</p>
  </div>
</Modal>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the modal is visible or hidden',
    },
    onClose: {
      action: 'closed',
      description: 'Callback function called when the modal should close (via overlay click, Escape key, or programmatically)',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Whether clicking the overlay backdrop closes the modal. Default: true',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether pressing the Escape key closes the modal. Default: true',
    },
    maxHeight: {
      control: 'text',
      description: 'Maximum height of the modal (CSS value, e.g., "80vh", "600px"). Default: "90vh"',
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width of the modal (CSS value, e.g., "1200px", "90vw"). Default: "90vw"',
    },
    footer: {
      control: false,
      description: 'React nodes to display in the footer. Automatically wrapped in an HStack with right alignment.',
    },
    overlayClassName: {
      control: 'text',
      description: 'Additional Tailwind CSS classes for the overlay backdrop',
    },
    contentClassName: {
      control: 'text',
      description: 'Additional Tailwind CSS classes for the scrollable content area',
    },
    footerClassName: {
      control: 'text',
      description: 'Additional Tailwind CSS classes for the footer HStack',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes for the modal VStack container',
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Ouvrir la modale</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="p-6">
            <h2 className="gs-typo-h1 mb-4">Titre de la modale</h2>
            <p className="text-sm text-grey-stronger">
              Ceci est le contenu de la modale. Vous pouvez y placer n'importe quel composant.
            </p>
          </div>
        </Modal>
      </>
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Ouvrir avec footer</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          footer={
            <>
              <Button size="large" background="white" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button size="large" background="black">
                Enregistrer
              </Button>
            </>
          }
        >
          <div className="p-6">
            <h2 className="gs-typo-h1 mb-4">Modale avec footer</h2>
            <p className="text-sm text-grey-stronger mb-4">
              Le footer est automatiquement wrappé dans un HStack avec justify="end", align="center", gap={3}, padding={4}.
            </p>
            <input
              type="text"
              placeholder="Saisissez du texte..."
              className="w-full border border-grey rounded px-3 py-2"
            />
          </div>
        </Modal>
      </>
    );
  },
};

export const WithScroll: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Ouvrir avec scroll</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          contentClassName="max-h-[400px]"
        >
          <div className="p-6">
            <h2 className="gs-typo-h1 mb-4">Modale avec scroll</h2>
            <div className="space-y-4 text-sm text-grey-stronger">
              {Array.from({ length: 15 }).map((_, i) => (
                <p key={i}>
                  Paragraphe {i + 1} - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              ))}
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

export const CustomSize: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Ouvrir grande modale</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          maxHeight="80vh"
          maxWidth="1200px"
        >
          <div className="p-8">
            <h2 className="gs-typo-h1 mb-4">Modale personnalisée</h2>
            <p className="text-sm text-grey-stronger mb-6">
              Cette modale utilise maxHeight="80vh" et maxWidth="1200px".
            </p>
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-32 bg-grey rounded flex items-center justify-center">
                  Carte {i + 1}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </>
    );
  },
};

export const CompleteExample: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleSave = () => {
      console.log('Saving:', formData);
      setIsOpen(false);
    };

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Formulaire complet</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          maxWidth="600px"
          footer={
            <>
              <Button background="white" onClick={() => setIsOpen(false)}>
                Annuler
              </Button>
              <Button background="black" onClick={handleSave}>
                Enregistrer
              </Button>
            </>
          }
        >
          <div className="p-6">
            <h2 className="gs-typo-h1 mb-6">Créer un compte</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-grey rounded px-3 py-2"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-grey rounded px-3 py-2"
                  placeholder="email@exemple.com"
                />
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  },
};
