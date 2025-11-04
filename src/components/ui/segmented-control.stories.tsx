import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl, SegmentedControlList, SegmentedControlTrigger, SegmentedControlContent } from "./segmented-control";

const meta: Meta<typeof SegmentedControl> = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Composant SegmentedControl basé sur Radix UI pour créer des interfaces à onglets.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  render: () => (
    <SegmentedControl defaultValue="tab1" className="w-[400px]">
      <SegmentedControlList>
        <SegmentedControlTrigger value="tab1">Onglet 1</SegmentedControlTrigger>
        <SegmentedControlTrigger value="tab2">Onglet 2</SegmentedControlTrigger>
        <SegmentedControlTrigger value="tab3">Onglet 3</SegmentedControlTrigger>
      </SegmentedControlList>
      <SegmentedControlContent value="tab1">
        <p className="text-sm">Contenu de l'onglet 1</p>
      </SegmentedControlContent>
      <SegmentedControlContent value="tab2">
        <p className="text-sm">Contenu de l'onglet 2</p>
      </SegmentedControlContent>
      <SegmentedControlContent value="tab3">
        <p className="text-sm">Contenu de l'onglet 3</p>
      </SegmentedControlContent>
    </SegmentedControl>
  ),
};

export const WithRichContent: Story = {
  render: () => (
    <SegmentedControl defaultValue="account" className="w-[500px]">
      <SegmentedControlList>
        <SegmentedControlTrigger value="account">Compte</SegmentedControlTrigger>
        <SegmentedControlTrigger value="password">Mot de passe</SegmentedControlTrigger>
        <SegmentedControlTrigger value="settings">Paramètres</SegmentedControlTrigger>
      </SegmentedControlList>
      <SegmentedControlContent value="account" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Informations du compte</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos informations de compte et vos préférences.
          </p>
        </div>
      </SegmentedControlContent>
      <SegmentedControlContent value="password" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Mot de passe</h3>
          <p className="text-sm text-muted-foreground">
            Modifiez votre mot de passe pour sécuriser votre compte.
          </p>
        </div>
      </SegmentedControlContent>
      <SegmentedControlContent value="settings" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Paramètres</h3>
          <p className="text-sm text-muted-foreground">
            Configurez vos préférences d'application.
          </p>
        </div>
      </SegmentedControlContent>
    </SegmentedControl>
  ),
  parameters: {
    docs: {
      description: {
        story: "SegmentedControl avec du contenu enrichi dans chaque onglet.",
      },
    },
  },
};

export const ManyTabs: Story = {
  render: () => (
    <SegmentedControl defaultValue="tab1" className="w-[600px]">
      <SegmentedControlList>
        <SegmentedControlTrigger value="tab1">Onglet 1</SegmentedControlTrigger>
        <SegmentedControlTrigger value="tab2">Onglet 2</SegmentedControlTrigger>
        <SegmentedControlTrigger value="tab3">Onglet 3</SegmentedControlTrigger>
        <SegmentedControlTrigger value="tab4">Onglet 4</SegmentedControlTrigger>
        <SegmentedControlTrigger value="tab5">Onglet 5</SegmentedControlTrigger>
      </SegmentedControlList>
      <SegmentedControlContent value="tab1">
        <p className="text-sm">Contenu 1</p>
      </SegmentedControlContent>
      <SegmentedControlContent value="tab2">
        <p className="text-sm">Contenu 2</p>
      </SegmentedControlContent>
      <SegmentedControlContent value="tab3">
        <p className="text-sm">Contenu 3</p>
      </SegmentedControlContent>
      <SegmentedControlContent value="tab4">
        <p className="text-sm">Contenu 4</p>
      </SegmentedControlContent>
      <SegmentedControlContent value="tab5">
        <p className="text-sm">Contenu 5</p>
      </SegmentedControlContent>
    </SegmentedControl>
  ),
  parameters: {
    docs: {
      description: {
        story: "SegmentedControl avec plusieurs onglets pour tester le comportement avec beaucoup d'options.",
      },
    },
  },
};

export const DisabledTab: Story = {
  render: () => (
    <SegmentedControl defaultValue="tab1" className="w-[400px]">
      <SegmentedControlList>
        <SegmentedControlTrigger value="tab1">Actif</SegmentedControlTrigger>
        <SegmentedControlTrigger value="tab2" disabled>
          Désactivé
        </SegmentedControlTrigger>
        <SegmentedControlTrigger value="tab3">Actif</SegmentedControlTrigger>
      </SegmentedControlList>
      <SegmentedControlContent value="tab1">
        <p className="text-sm">Contenu de l'onglet actif 1</p>
      </SegmentedControlContent>
      <SegmentedControlContent value="tab2">
        <p className="text-sm">Ce contenu n'est pas accessible</p>
      </SegmentedControlContent>
      <SegmentedControlContent value="tab3">
        <p className="text-sm">Contenu de l'onglet actif 3</p>
      </SegmentedControlContent>
    </SegmentedControl>
  ),
  parameters: {
    docs: {
      description: {
        story: "SegmentedControl avec un onglet désactivé.",
      },
    },
  },
};

