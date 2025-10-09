import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ModalLayer } from "./modal-layer";
import { Button } from "./button";

const meta: Meta<typeof ModalLayer> = {
  title: "Components/ModalLayer",
  component: ModalLayer,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Composant modal générique avec overlay et footer optionnel.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModalLayer>;

// Wrapper pour gérer l'état d'ouverture
const ModalWrapper = ({
  children,
  footer,
  contentClassName,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Ouvrir la modale</Button>
      <ModalLayer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        footer={footer}
        contentClassName={contentClassName}
      >
        {children}
      </ModalLayer>
    </>
  );
};

export const Default: Story = {
  render: () => (
    <ModalWrapper>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Titre de la modale</h2>
        <p className="text-gray-600">
          Ceci est le contenu de la modale. Vous pouvez y placer n'importe quel composant.
        </p>
      </div>
    </ModalWrapper>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <ModalWrapper
      footer={
        <>
          <Button size="large" background="white">
            Annuler
          </Button>
          <Button size="large" background="black">
            Enregistrer
          </Button>
        </>
      }
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Modale avec footer</h2>
        <p className="text-gray-600 mb-4">
          Cette modale contient un footer avec des boutons d'action.
        </p>
        <input
          type="text"
          placeholder="Saisissez du texte..."
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
    </ModalWrapper>
  ),
};

export const LargeContent: Story = {
  render: () => (
    <ModalWrapper contentClassName="max-h-[500px]">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Modale avec contenu long</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </p>
        </div>
      </div>
    </ModalWrapper>
  ),
};

export const CustomWidth: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Ouvrir la modale large</Button>
        <ModalLayer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className="w-[1000px]"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Modale personnalisée</h2>
            <p className="text-gray-600">
              Cette modale a une largeur personnalisée de 1000px.
            </p>
          </div>
        </ModalLayer>
      </>
    );
  },
};
