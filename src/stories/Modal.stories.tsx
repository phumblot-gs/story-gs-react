import type { Meta, StoryObj } from "@storybook/react";
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
        component: `Composant modal générique construit avec les composants Layout (VStack, HStack) et intégré au design system. Le footer est automatiquement wrappé dans un HStack avec justify="end", align="center", gap={3}, et padding={4}.

### Utilisation simple

\`\`\`tsx
import { Modal, Button } from '@story-gs-react';
import { useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Ouvrir
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="p-6">
          <h2>Titre de la modale</h2>
          <p>Contenu de la modale</p>
        </div>
      </Modal>
    </>
  );
}
\`\`\`

### Avec footer (auto-wrapped dans HStack)

\`\`\`tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
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
    <h2>Formulaire</h2>
    <input type="text" className="w-full border border-grey rounded px-3 py-2" />
  </div>
</Modal>
\`\`\`

### Dimensions personnalisées

\`\`\`tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  maxHeight="80vh"
  maxWidth="1200px"
>
  <div className="p-8">
    <h2>Grande modale</h2>
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
      description: "État d'ouverture du modal",
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Fermer au clic sur overlay',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Fermer à la touche Escape',
    },
    maxHeight: {
      control: 'text',
      description: 'Hauteur maximale (CSS)',
    },
    maxWidth: {
      control: 'text',
      description: 'Largeur maximale (CSS)',
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
