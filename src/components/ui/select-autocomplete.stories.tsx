import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectAutocomplete, SelectAutocompleteOption } from "./select-autocomplete";
import { Layout, VStack } from "@/components/layout";
import { useState } from "react";

const meta: Meta<typeof SelectAutocomplete> = {
  title: "UI/SelectAutocomplete",
  component: SelectAutocomplete,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `SelectAutocomplete component avec recherche et autocomplétion. Basé sur Input + Popover pour une meilleure flexibilité.

## Features
- Mode local : Filtre les options fournies côté client
- Mode remote : Recherche serveur avec debounce
- Navigation clavier complète (flèches, Enter, Escape)
- Support des valeurs personnalisées
- Taille normal/small
- Adaptation automatique selon le background context

## Basic Usage

\`\`\`tsx
import { SelectAutocomplete } from '@story-gs-react';

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
];

<SelectAutocomplete
  options={options}
  onSelect={(option) => console.log(option)}
/>
\`\`\`

## Mode Remote

\`\`\`tsx
<SelectAutocomplete
  searchMode="remote"
  onSearch={async (term) => {
    const response = await fetch(\`/api/search?q=\${term}\`);
    return response.json();
  }}
  onSelect={(option) => console.log(option)}
/>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['normal', 'small'],
      description: 'Taille du composant',
    },
    searchMode: {
      control: 'select',
      options: ['local', 'remote'],
      description: 'Mode de recherche (local ou remote)',
    },
    openOnFocus: {
      control: 'boolean',
      description: 'Ouvre automatiquement le popover au focus',
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Ferme automatiquement après sélection',
    },
    allowCustomValue: {
      control: 'boolean',
      description: 'Permet de sélectionner une valeur personnalisée',
    },
    disabled: {
      control: 'boolean',
      description: 'État désactivé',
    },
    debug: {
      control: 'boolean',
      description: 'Mode debug pour les logs',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectAutocomplete>;

// Options de test
const basicOptions: SelectAutocompleteOption[] = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
  { value: "4", label: "Option 4" },
];

const manyOptions: SelectAutocompleteOption[] = Array.from({ length: 50 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
}));

const groupedOptions: SelectAutocompleteOption[] = [
  { value: "fr-paris", label: "Paris", group: "France" },
  { value: "fr-lyon", label: "Lyon", group: "France" },
  { value: "fr-marseille", label: "Marseille", group: "France" },
  { value: "uk-london", label: "London", group: "UK" },
  { value: "uk-manchester", label: "Manchester", group: "UK" },
  { value: "us-ny", label: "New York", group: "USA" },
  { value: "us-la", label: "Los Angeles", group: "USA" },
];

export const Default: Story = {
  args: {
    options: basicOptions,
    placeholder: "Rechercher une option...",
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <SelectAutocomplete
            {...args}
            value={value}
            onChange={setValue}
            onSelect={(option) => {
              console.log("Selected:", option);
              setValue(option.label);
            }}
          />
          <p className="text-sm text-grey-stronger">
            Valeur sélectionnée : {value || "Aucune"}
          </p>
        </VStack>
      </Layout>
    );
  },
};

export const WithManyOptions: Story = {
  args: {
    options: manyOptions,
    placeholder: "Rechercher parmi 50 options...",
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <SelectAutocomplete
            {...args}
            value={value}
            onChange={setValue}
            onSelect={(option) => {
              console.log("Selected:", option);
              setValue(option.label);
            }}
          />
          <p className="text-sm text-grey-stronger">
            Valeur sélectionnée : {value || "Aucune"}
          </p>
        </VStack>
      </Layout>
    );
  },
};

export const RemoteSearch: Story = {
  args: {
    searchMode: "remote",
    placeholder: "Rechercher sur le serveur...",
    searchDebounceMs: 500,
  },
  render: (args) => {
    const [value, setValue] = useState("");
    const [searchCount, setSearchCount] = useState(0);

    // Simulation d'une recherche serveur
    const mockSearch = async (term: string): Promise<SelectAutocompleteOption[]> => {
      setSearchCount((prev) => prev + 1);
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simule la latence

      if (!term.trim()) {
        return [];
      }

      // Simule des résultats basés sur le terme
      return Array.from({ length: 5 }, (_, i) => ({
        value: `result-${term}-${i}`,
        label: `Résultat ${i + 1} pour "${term}"`,
      }));
    };

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <SelectAutocomplete
            {...args}
            value={value}
            onChange={setValue}
            onSearch={mockSearch}
            onSelect={(option) => {
              console.log("Selected:", option);
              setValue(option.label);
            }}
          />
          <VStack gap={2}>
            <p className="text-sm text-grey-stronger">
              Valeur sélectionnée : {value || "Aucune"}
            </p>
            <p className="text-xs text-grey-strongest">
              Recherches effectuées : {searchCount}
            </p>
          </VStack>
        </VStack>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Mode remote avec recherche serveur. Le debounce est configuré à 500ms pour limiter les requêtes.",
      },
    },
  },
};

export const WithCustomValue: Story = {
  args: {
    options: basicOptions,
    allowCustomValue: true,
    placeholder: "Rechercher ou saisir une valeur...",
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <SelectAutocomplete
            {...args}
            value={value}
            onChange={setValue}
            onSelect={(option) => {
              console.log("Selected:", option);
              setValue(option.label);
            }}
          />
          <p className="text-sm text-grey-stronger">
            Valeur sélectionnée : {value || "Aucune"}
          </p>
          <p className="text-xs text-grey-strongest">
            Vous pouvez sélectionner une option ou taper une valeur personnalisée et appuyer sur Enter.
          </p>
        </VStack>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Avec allowCustomValue=true, vous pouvez sélectionner une valeur qui n'est pas dans les options en appuyant sur Enter.",
      },
    },
  },
};

export const SmallSize: Story = {
  args: {
    options: basicOptions,
    size: "small",
    placeholder: "Petit select...",
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <SelectAutocomplete
            {...args}
            value={value}
            onChange={setValue}
            onSelect={(option) => {
              console.log("Selected:", option);
              setValue(option.label);
            }}
          />
          <p className="text-xs text-grey-stronger">
            Valeur sélectionnée : {value || "Aucune"}
          </p>
        </VStack>
      </Layout>
    );
  },
};

export const BackgroundVariants: Story = {
  render: () => {
    const [valueWhite, setValueWhite] = useState("");
    const [valueBlack, setValueBlack] = useState("");
    const [valueGrey, setValueGrey] = useState("");

    return (
      <VStack gap={6} padding={6}>
        <VStack as={Layout} bg="white" padding={6} gap={3} className="border border-grey rounded">
          <h3 className="text-sm font-medium">Background White</h3>
          <SelectAutocomplete
            options={basicOptions}
            value={valueWhite}
            onChange={setValueWhite}
            onSelect={(option) => setValueWhite(option.label)}
            placeholder="Rechercher..."
          />
        </VStack>

        <VStack as={Layout} bg="black" padding={6} gap={3} className="border border-grey rounded">
          <h3 className="text-sm font-medium text-white">Background Black</h3>
          <SelectAutocomplete
            options={basicOptions}
            value={valueBlack}
            onChange={setValueBlack}
            onSelect={(option) => setValueBlack(option.label)}
            placeholder="Rechercher..."
          />
        </VStack>

        <VStack as={Layout} bg="grey" padding={6} gap={3} className="border border-grey rounded">
          <h3 className="text-sm font-medium">Background Grey</h3>
          <SelectAutocomplete
            options={basicOptions}
            value={valueGrey}
            onChange={setValueGrey}
            onSelect={(option) => setValueGrey(option.label)}
            placeholder="Rechercher..."
          />
        </VStack>
      </VStack>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: "Le SelectAutocomplete s'adapte automatiquement au background du Layout parent.",
      },
    },
  },
};

export const States: Story = {
  render: () => {
    const [value1, setValue1] = useState("");
    const [value2, setValue2] = useState("Option 2");
    const [value3, setValue3] = useState("");

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={6}>
          <VStack gap={3}>
            <h3 className="text-sm font-medium">État Normal</h3>
            <SelectAutocomplete
              options={basicOptions}
              value={value1}
              onChange={setValue1}
              onSelect={(option) => setValue1(option.label)}
              placeholder="Rechercher..."
            />
          </VStack>

          <VStack gap={3}>
            <h3 className="text-sm font-medium">Avec Valeur Sélectionnée</h3>
            <SelectAutocomplete
              options={basicOptions}
              value={value2}
              onChange={setValue2}
              onSelect={(option) => setValue2(option.label)}
              placeholder="Rechercher..."
            />
          </VStack>

          <VStack gap={3}>
            <h3 className="text-sm font-medium">État Désactivé</h3>
            <SelectAutocomplete
              options={basicOptions}
              value={value3}
              onChange={setValue3}
              onSelect={(option) => setValue3(option.label)}
              placeholder="Rechercher..."
              disabled
            />
          </VStack>
        </VStack>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Différents états du composant : normal, avec valeur sélectionnée, désactivé.",
      },
    },
  },
};

export const WithFilterFunction: Story = {
  args: {
    options: groupedOptions,
    placeholder: "Rechercher une ville...",
  },
  render: (args) => {
    const [value, setValue] = useState("");

    // Filtre personnalisé qui cherche dans le label ET le groupe
    const customFilter = (option: SelectAutocompleteOption, searchTerm: string) => {
      const term = searchTerm.toLowerCase();
      return (
        option.label.toLowerCase().includes(term) ||
        option.group?.toLowerCase().includes(term) ||
        false
      );
    };

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <SelectAutocomplete
            {...args}
            value={value}
            onChange={setValue}
            filterFunction={customFilter}
            onSelect={(option) => {
              console.log("Selected:", option);
              setValue(option.label);
            }}
          />
          <p className="text-sm text-grey-stronger">
            Valeur sélectionnée : {value || "Aucune"}
          </p>
          <p className="text-xs text-grey-strongest">
            Essayez de rechercher "France", "UK" ou "USA" pour filtrer par groupe.
          </p>
        </VStack>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Exemple avec une fonction de filtrage personnalisée qui recherche dans le label ET le groupe.",
      },
    },
  },
};

export const WithManyOptionsAndScroll: Story = {
  render: () => {
    const manyOptions: SelectAutocompleteOption[] = [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
      { value: "3", label: "Option 3" },
      { value: "4", label: "Option 4" },
      { value: "5", label: "Option 5" },
      { value: "6", label: "Option 6" },
      { value: "7", label: "Option 7" },
      { value: "8", label: "Option 8" },
      { value: "9", label: "Option 9" },
      { value: "10", label: "Option 10" },
      { value: "11", label: "Option 11" },
      { value: "12", label: "Option 12" },
      { value: "13", label: "Option 13" },
      { value: "14", label: "Option 14" },
      { value: "15", label: "Option 15" },
      { value: "16", label: "Option 16" },
      { value: "17", label: "Option 17" },
      { value: "18", label: "Option 18" },
      { value: "19", label: "Option 19" },
      { value: "20", label: "Option 20" },
      { value: "21", label: "Option 21" },
      { value: "22", label: "Option 22" },
      { value: "23", label: "Option 23" },
      { value: "24", label: "Option 24" },
      { value: "25", label: "Option 25" },
    ];

    const [value, setValue] = useState("");

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <div>
            <p className="text-sm text-grey-stronger mb-2">
              SelectAutocomplete avec hauteur limitée à 40vh et scroll automatique
            </p>
            <SelectAutocomplete
              options={manyOptions}
              value={value}
              onChange={setValue}
              onSelect={(option) => {
                console.log("Selected:", option);
                setValue(option.label);
              }}
              placeholder="Rechercher parmi 25 options..."
              menuMaxHeight="max-h-[40vh]"
            />
          </div>
          <p className="text-sm text-grey-stronger">
            Valeur sélectionnée : {value || "Aucune"}
          </p>
          <p className="text-xs text-grey-strongest">
            Le menu déroulant a une hauteur maximale de 40vh. Quand toutes les options ne rentrent pas,
            un scroll vertical apparaît automatiquement.
          </p>
        </VStack>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Exemple avec beaucoup d'options (25) et hauteur limitée à 40vh pour tester le scroll vertical. Le menu déroulant affiche un scroll automatique quand le contenu dépasse la hauteur maximale.",
      },
    },
  },
};

export const WithDebug: Story = {
  args: {
    options: basicOptions,
    placeholder: "Select avec debug activé",
    debug: true,
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <SelectAutocomplete
            {...args}
            value={value}
            onChange={setValue}
            onSelect={(option) => {
              console.log("Selected:", option);
              setValue(option.label);
            }}
          />
          <p className="text-sm text-grey-stronger">
            Valeur sélectionnée : {value || "Aucune"}
          </p>
          <p className="text-xs text-grey-strongest">
            Ouvrez la console pour voir les logs de debug.
          </p>
        </VStack>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Mode debug activé - voir la console pour les logs.",
      },
    },
  },
};

