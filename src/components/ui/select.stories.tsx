import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Composant Select personnalisé basé sur les maquettes Figma avec variants de background.",
      },
    },
  },
  argTypes: {
    background: {
      control: { type: "select" },
      options: ["white", "black", "grey"],
      description: "Variant de background selon le design system",
    },
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
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// Template de base
const SelectTemplate = (args: any) => (
  <Select {...args}>
    <SelectTrigger background={args.background} debug={args.debug} disabled={args.disabled}>
      <SelectValue placeholder={args.placeholder || "Sélectionner une option"} />
    </SelectTrigger>
    <SelectContent background={args.background} debug={args.debug}>
      <SelectItem value="option1" background={args.background} debug={args.debug}>Option 1</SelectItem>
      <SelectItem value="option2" background={args.background} debug={args.debug}>Option 2</SelectItem>
      <SelectItem value="option3" background={args.background} debug={args.debug}>Option 3</SelectItem>
      <SelectItem value="option4" background={args.background} debug={args.debug}>Option très longue qui peut dépasser</SelectItem>
    </SelectContent>
  </Select>
);

export const Default: Story = {
  render: SelectTemplate,
  args: {
    background: "white",
    debug: false,
    disabled: false,
    placeholder: "Choisir une option",
  },
};

export const BackgroundVariants: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 p-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Background White</h3>
        <Select background="white">
          <SelectTrigger background="white">
            <SelectValue placeholder="Select white background" />
          </SelectTrigger>
          <SelectContent background="white">
            <SelectItem value="white1" background="white">Option 1</SelectItem>
            <SelectItem value="white2" background="white">Option 2</SelectItem>
            <SelectItem value="white3" background="white">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 p-4 bg-white rounded">
        <h3 className="text-sm font-medium text-white">Background Black</h3>
        <Select background="black">
          <SelectTrigger background="black">
            <SelectValue placeholder="Select black background" />
          </SelectTrigger>
          <SelectContent background="black">
            <SelectItem value="black1" background="black">Option 1</SelectItem>
            <SelectItem value="black2" background="black">Option 2</SelectItem>
            <SelectItem value="black3" background="black">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Background Grey</h3>
        <Select background="grey">
          <SelectTrigger background="grey">
            <SelectValue placeholder="Select grey background" />
          </SelectTrigger>
          <SelectContent background="grey">
            <SelectItem value="grey1" background="grey">Option 1</SelectItem>
            <SelectItem value="grey2" background="grey">Option 2</SelectItem>
            <SelectItem value="grey3" background="grey">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comparaison des différents variants de background disponibles.",
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col space-y-6 p-4">
      <div className="space-y-2">
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
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">État Désactivé</h3>
        <Select disabled>
          <SelectTrigger disabled>
            <SelectValue placeholder="Select désactivé" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="disabled1">Option désactivée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
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
      </div>
    </div>
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
    background: "white",
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
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Allow Clear - Sans valeur par défaut</h3>
        <Select allowClear background={args.background}>
          <SelectTrigger background={args.background}>
            <SelectValue placeholder="Sélectionner une option (effaçable)" />
          </SelectTrigger>
          <SelectContent background={args.background}>
            <SelectItem value="option1" background={args.background}>Option 1</SelectItem>
            <SelectItem value="option2" background={args.background}>Option 2</SelectItem>
            <SelectItem value="option3" background={args.background}>Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Allow Clear - Avec valeur par défaut</h3>
        <Select allowClear defaultValue="option2" background={args.background}>
          <SelectTrigger background={args.background}>
            <SelectValue placeholder="Sélectionner une option" />
          </SelectTrigger>
          <SelectContent background={args.background}>
            <SelectItem value="option1" background={args.background}>Option 1</SelectItem>
            <SelectItem value="option2" background={args.background}>Option 2</SelectItem>
            <SelectItem value="option3" background={args.background}>Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
  args: {
    background: "white",
  },
  parameters: {
    docs: {
      description: {
        story: "Select avec allowClear=true. L'icône X permet d'effacer la sélection quand une valeur est sélectionnée.",
      },
    },
  },
};