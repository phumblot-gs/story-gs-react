import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Composant Tabs basé sur Radix UI pour créer des interfaces à onglets.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Onglet 1</TabsTrigger>
        <TabsTrigger value="tab2">Onglet 2</TabsTrigger>
        <TabsTrigger value="tab3">Onglet 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm">Contenu de l'onglet 1</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm">Contenu de l'onglet 2</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm">Contenu de l'onglet 3</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithRichContent: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="account">Compte</TabsTrigger>
        <TabsTrigger value="password">Mot de passe</TabsTrigger>
        <TabsTrigger value="settings">Paramètres</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Informations du compte</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos informations de compte et vos préférences.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Mot de passe</h3>
          <p className="text-sm text-muted-foreground">
            Modifiez votre mot de passe pour sécuriser votre compte.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="settings" className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Paramètres</h3>
          <p className="text-sm text-muted-foreground">
            Configurez vos préférences d'application.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: "Tabs avec du contenu enrichi dans chaque onglet.",
      },
    },
  },
};

export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[600px]">
      <TabsList>
        <TabsTrigger value="tab1">Onglet 1</TabsTrigger>
        <TabsTrigger value="tab2">Onglet 2</TabsTrigger>
        <TabsTrigger value="tab3">Onglet 3</TabsTrigger>
        <TabsTrigger value="tab4">Onglet 4</TabsTrigger>
        <TabsTrigger value="tab5">Onglet 5</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm">Contenu 1</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm">Contenu 2</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm">Contenu 3</p>
      </TabsContent>
      <TabsContent value="tab4">
        <p className="text-sm">Contenu 4</p>
      </TabsContent>
      <TabsContent value="tab5">
        <p className="text-sm">Contenu 5</p>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: "Tabs avec plusieurs onglets pour tester le comportement avec beaucoup d'options.",
      },
    },
  },
};

export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="tab1">Actif</TabsTrigger>
        <TabsTrigger value="tab2" disabled>
          Désactivé
        </TabsTrigger>
        <TabsTrigger value="tab3">Actif</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p className="text-sm">Contenu de l'onglet actif 1</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p className="text-sm">Ce contenu n'est pas accessible</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p className="text-sm">Contenu de l'onglet actif 3</p>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: "Tabs avec un onglet désactivé.",
      },
    },
  },
};
