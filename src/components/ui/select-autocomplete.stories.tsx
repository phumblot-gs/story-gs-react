import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectAutocomplete, SelectAutocompleteOption, SelectedOption } from "./select-autocomplete";
import { Layout, VStack } from "@/components/layout";
import { useState } from "react";

const meta: Meta<typeof SelectAutocomplete> = {
  title: "UI/SelectAutocomplete",
  component: SelectAutocomplete,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `SelectAutocomplete component with search and autocomplete functionality. Based on Input + Popover for better flexibility.

## Features
- Local mode: Filters options provided client-side
- Remote mode: Server search with debounce
- Full keyboard navigation (arrows, Enter, Escape)
- Custom value support
- Normal/small size
- Automatic adaptation based on background context
- **Returns an object { value, label } in onChange, giving access to both ID and display text**
- Search on searchText if provided, otherwise on label

## Basic Usage

\`\`\`tsx
import { SelectAutocomplete } from '@story-gs-react';

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
];

<SelectAutocomplete
  options={options}
  onChange={(selected) => {
    // selected contains { value: "1", label: "Option 1" }
    console.log(selected.value); // "1"
    console.log(selected.label); // "Option 1"
  }}
  onSelect={(option) => {
    // option contains the full SelectAutocompleteOption
    console.log(option);
  }}
/>
\`\`\`

## Value vs Label Behavior

The component displays the label in the input field and returns an object with both value (ID) and label in the onChange callback. This ensures you always have access to both the unique identifier and the display text, even when multiple items share the same label:

\`\`\`tsx
const options = [
  { value: "12345", label: "Production A (30/11/2024)" },
  { value: "67890", label: "Production B (01/12/2024)" },
];

<SelectAutocomplete
  value={selectedId}  // Contains the ID: "12345"
  onChange={(selected) => {
    // selected.value is "12345"
    // selected.label is "Production A (30/11/2024)"
    setSelectedId(selected.value);
  }}
  options={options}
/>
// Input displays: "Production A (30/11/2024)" (label)
// onChange receives: { value: "12345", label: "Production A (30/11/2024)" }
\`\`\`

## Search with searchText

You can provide an optional searchText to improve search:

\`\`\`tsx
const options = [
  { 
    value: "12345", 
    label: "Production A (30/11/2024)",
    searchText: "Production A 30/11/2024" // Text used for search
  },
];
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
      description: 'Component size',
    },
    searchMode: {
      control: 'select',
      options: ['local', 'remote'],
      description: 'Search mode (local or remote)',
    },
    openOnFocus: {
      control: 'boolean',
      description: 'Automatically opens popover on focus',
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'Automatically closes after selection',
    },
    allowCustomValue: {
      control: 'boolean',
      description: 'Allows selecting a custom value',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    debug: {
      control: 'boolean',
      description: 'Debug mode for logs',
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
    placeholder: "Search for an option...",
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <SelectAutocomplete
            {...args}
            value={value}
            onChange={(selected) => {
              console.log("Selected:", selected);
              // onChange retourne maintenant un objet { value, label }
              setValue(selected.value);
            }}
            onSelect={(option) => {
              console.log("Option:", option);
            }}
          />
          <p className="text-sm text-grey-stronger">
            Selected value: {value || "None"}
          </p>
        </VStack>
      </Layout>
    );
  },
};

export const WithManyOptions: Story = {
  args: {
    options: manyOptions,
    placeholder: "Search among 50 options...",
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <SelectAutocomplete
            {...args}
            value={value}
            onChange={(selected) => {
              console.log("Selected:", selected);
              // onChange retourne maintenant un objet { value, label }
              setValue(selected.value);
            }}
            onSelect={(option) => {
              console.log("Option:", option);
            }}
          />
          <p className="text-sm text-grey-stronger">
            Selected value: {value || "None"}
          </p>
        </VStack>
      </Layout>
    );
  },
};

export const RemoteSearch: Story = {
  args: {
    searchMode: "remote",
    placeholder: "Search on server...",
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
            onChange={(selected) => setValue(selected.value)}
            onSearch={mockSearch}
            onSelect={(option) => {
              console.log("Selected:", option);
              // Note: onChange already handles the value, onSelect is just for logging
            }}
          />
          <VStack gap={2}>
            <p className="text-sm text-grey-stronger">
              Selected value: {value || "None"}
            </p>
            <p className="text-xs text-grey-strongest">
              Searches performed: {searchCount}
            </p>
          </VStack>
        </VStack>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Remote mode with server search. Debounce is set to 500ms to limit requests.",
      },
    },
  },
};

export const WithCustomValue: Story = {
  args: {
    options: basicOptions,
    allowCustomValue: true,
    placeholder: "Search or enter a value...",
  },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <SelectAutocomplete
            {...args}
            value={value}
            onChange={(selected) => {
              console.log("Selected:", selected);
              // onChange retourne maintenant un objet { value, label }
              setValue(selected.value);
            }}
            onSelect={(option) => {
              console.log("Option:", option);
            }}
          />
          <p className="text-sm text-grey-stronger">
            Selected value: {value || "None"}
          </p>
          <p className="text-xs text-grey-strongest">
            You can select an option or type a custom value and press Enter.
          </p>
        </VStack>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "With allowCustomValue=true, you can select a value that is not in the options by pressing Enter.",
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
            onChange={(selected) => {
              console.log("Selected:", selected);
              // onChange retourne maintenant un objet { value, label }
              setValue(selected.value);
            }}
            onSelect={(option) => {
              console.log("Option:", option);
            }}
          />
          <p className="text-xs text-grey-stronger">
            Selected value: {value || "None"}
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
            onChange={(selected) => setValueWhite(selected.value)}
            placeholder="Search..."
          />
        </VStack>

        <VStack as={Layout} bg="black" padding={6} gap={3} className="border border-grey rounded">
          <h3 className="text-sm font-medium text-white">Background Black</h3>
          <SelectAutocomplete
            options={basicOptions}
            value={valueBlack}
            onChange={(selected) => setValueBlack(selected.value)}
            placeholder="Search..."
          />
        </VStack>

        <VStack as={Layout} bg="grey" padding={6} gap={3} className="border border-grey rounded">
          <h3 className="text-sm font-medium">Background Grey</h3>
          <SelectAutocomplete
            options={basicOptions}
            value={valueGrey}
            onChange={(selected) => setValueGrey(selected.value)}
            placeholder="Search..."
          />
        </VStack>
      </VStack>
    );
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: "SelectAutocomplete automatically adapts to the background of the parent Layout.",
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
            <h3 className="text-sm font-medium">Normal State</h3>
            <SelectAutocomplete
              options={basicOptions}
              value={value1}
              onChange={(selected) => setValue1(selected.value)}
              placeholder="Search..."
            />
          </VStack>

          <VStack gap={3}>
            <h3 className="text-sm font-medium">With Selected Value</h3>
            <SelectAutocomplete
              options={basicOptions}
              value={value2}
              onChange={(selected) => setValue2(selected.value)}
              placeholder="Search..."
            />
          </VStack>

          <VStack gap={3}>
            <h3 className="text-sm font-medium">Disabled State</h3>
            <SelectAutocomplete
              options={basicOptions}
              value={value3}
              onChange={(selected) => setValue3(selected.value)}
              placeholder="Search..."
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
        story: "Different component states: normal, with selected value, disabled.",
      },
    },
  },
};

export const WithFilterFunction: Story = {
  args: {
    options: groupedOptions,
    placeholder: "Search for a city...",
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
            onChange={(selected) => setValue(selected.value)}
            filterFunction={customFilter}
            onSelect={(option) => {
              console.log("Selected:", option);
              // Note: onChange already handles the value, onSelect is just for logging
            }}
          />
          <p className="text-sm text-grey-stronger">
            Selected value: {value || "None"}
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
        story: "Example with a custom filter function that searches in both the label AND the group.",
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
              SelectAutocomplete with height limited to 40vh and automatic scrolling
            </p>
            <SelectAutocomplete
              options={manyOptions}
              value={value}
              onChange={(selected) => {
                console.log("Selected:", selected);
                setValue(selected.value);
              }}
              placeholder="Search among 25 options..."
              menuMaxHeight="max-h-[40vh]"
            />
          </div>
          <p className="text-sm text-grey-stronger">
            Selected value: {value || "None"}
          </p>
            <p className="text-xs text-grey-strongest">
              The dropdown menu has a maximum height of 40vh. When all options don't fit,
              vertical scrolling appears automatically.
            </p>
        </VStack>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Example with many options (25) and height limited to 40vh to test vertical scrolling. The dropdown menu displays automatic scrolling when content exceeds the maximum height.",
      },
    },
  },
};

export const WithDebug: Story = {
  args: {
    options: basicOptions,
    placeholder: "Select with debug enabled",
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
            onChange={(selected) => {
              console.log("Selected:", selected);
              // onChange retourne maintenant un objet { value, label }
              setValue(selected.value);
            }}
            onSelect={(option) => {
              console.log("Option:", option);
            }}
          />
          <p className="text-sm text-grey-stronger">
            Selected value: {value || "None"}
          </p>
          <p className="text-xs text-grey-strongest">
            Open the console to see debug logs.
          </p>
        </VStack>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Debug mode enabled - see console for logs.",
      },
    },
  },
};

