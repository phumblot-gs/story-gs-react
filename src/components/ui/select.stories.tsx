import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./select";
import { Layout, VStack } from "@/components/layout";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Composant Select personnalisé basé sur les maquettes Figma. Hérite automatiquement du contexte de couleur via `data-bg` du Layout parent.",
      },
    },
  },
  argTypes: {
    debug: {
      control: "boolean",
      description: "Mode debug pour afficher les logs console",
    },
    disabled: {
      control: "boolean",
      description: "État désactivé du select",
    },
    placeholder: {
      control: "text",
      description: "Texte de placeholder",
    },
    allowClear: {
      control: "boolean",
      description: "Permet d'effacer la sélection avec une icône X",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// Template de base
const SelectTemplate = (args: any) => (
  <Layout bg="white" padding={6}>
    <Select {...args}>
      <SelectTrigger debug={args.debug} disabled={args.disabled}>
        <SelectValue placeholder={args.placeholder || "Sélectionner une option"} />
      </SelectTrigger>
      <SelectContent debug={args.debug}>
        <SelectItem value="option1" debug={args.debug}>Option 1</SelectItem>
        <SelectItem value="option2" debug={args.debug}>Option 2</SelectItem>
        <SelectItem value="option3" debug={args.debug}>Option 3</SelectItem>
        <SelectItem value="option4" debug={args.debug}>Option très longue qui peut dépasser</SelectItem>
      </SelectContent>
    </Select>
  </Layout>
);

export const Default: Story = {
  args: {
    debug: false,
    disabled: false,
    placeholder: "Choisir une option",
    allowClear: false,
  },
  render: (args) => (
    <Layout bg="white" padding={6}>
      <Select debug={args.debug} disabled={args.disabled} allowClear={args.allowClear}>
        <SelectTrigger>
          <SelectValue placeholder={args.placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
          <SelectItem value="option4">Option très longue qui peut dépasser</SelectItem>
        </SelectContent>
      </Select>
    </Layout>
  ),
};

export const BackgroundVariants: Story = {
  render: () => (
    <VStack gap={6} padding={6}>
      <VStack as={Layout} bg="white" padding={6} gap={3} className="border border-grey rounded">
        <h3 className="text-sm font-medium">Background White</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select white background" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="white1">Option 1</SelectItem>
            <SelectItem value="white2">Option 2</SelectItem>
            <SelectItem value="white3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </VStack>

      <VStack as={Layout} bg="black" padding={6} gap={3} className="border border-grey rounded">
        <h3 className="text-sm font-medium text-white">Background Black</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select black background" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="black1">Option 1</SelectItem>
            <SelectItem value="black2">Option 2</SelectItem>
            <SelectItem value="black3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </VStack>

      <VStack as={Layout} bg="grey" padding={6} gap={3} className="border border-grey rounded">
        <h3 className="text-sm font-medium">Background Grey</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select grey background" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grey1">Option 1</SelectItem>
            <SelectItem value="grey2">Option 2</SelectItem>
            <SelectItem value="grey3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </VStack>
    </VStack>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: "Le Select hérite automatiquement du background du Layout parent via BgContext.",
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={6}>
        <VStack gap={3}>
          <h3 className="text-sm font-medium">État Normal</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select normal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal1">Option normale</SelectItem>
              <SelectItem value="normal2">Autre option</SelectItem>
            </SelectContent>
          </Select>
        </VStack>

        <VStack gap={3}>
          <h3 className="text-sm font-medium">État Désactivé</h3>
          <Select disabled>
            <SelectTrigger disabled>
              <SelectValue placeholder="Select désactivé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled1">Option désactivée</SelectItem>
            </SelectContent>
          </Select>
        </VStack>

        <VStack gap={3}>
          <h3 className="text-sm font-medium">Avec Valeur Sélectionnée</h3>
          <Select defaultValue="selected">
            <SelectTrigger>
              <SelectValue placeholder="Aucune sélection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="selected">Option sélectionnée</SelectItem>
              <SelectItem value="other">Autre option</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
      </VStack>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Différents états du composant Select : normal, désactivé, avec valeur sélectionnée.",
      },
    },
  },
};

export const LongContent: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select avec beaucoup d'options" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="short">Court</SelectItem>
          <SelectItem value="medium">Option moyenne</SelectItem>
          <SelectItem value="long">Option avec un texte très long qui pourrait dépasser</SelectItem>
          <SelectItem value="extra-long">Option avec un texte extrêmement long qui teste la gestion de l'overflow et du wrapping</SelectItem>
          <SelectItem value="numbers">123456789012345678901234567890</SelectItem>
          <SelectItem value="special">Caractères spéciaux: àéèïôç!</SelectItem>
          <SelectItem value="option7">Option 7</SelectItem>
          <SelectItem value="option8">Option 8</SelectItem>
          <SelectItem value="option9">Option 9</SelectItem>
          <SelectItem value="option10">Option 10</SelectItem>
        </SelectContent>
      </Select>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Test avec beaucoup d'options et du contenu long pour vérifier le scroll et l'overflow.",
      },
    },
  },
};

export const WithDebug: Story = {
  render: SelectTemplate,
  args: {
    debug: true,
    disabled: false,
    placeholder: "Select avec debug activé",
  },
  parameters: {
    docs: {
      description: {
        story: "Mode debug activé - voir la console pour les logs.",
      },
    },
  },
};

export const WithAllowClear: Story = {
  render: (args: any) => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <VStack gap={2}>
          <h3 className="text-sm font-medium">Allow Clear - Sans valeur par défaut</h3>
          <Select allowClear>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une option (effaçable)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </VStack>

        <VStack gap={2}>
          <h3 className="text-sm font-medium">Allow Clear - Avec valeur par défaut</h3>
          <Select allowClear defaultValue="option2">
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </VStack>
      </VStack>
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Select avec allowClear=true. L'icône X permet d'effacer la sélection quand une valeur est sélectionnée.",
      },
    },
  },
};
