import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MultiSelect, type MultiSelectProps } from "./multi-select";
import type { SelectAutocompleteOption, SelectedOption } from "./select-autocomplete";
import { Layout, Modal, VStack } from "@/components/layout";
import { Button } from "./button";

const COLLECTIONS: SelectAutocompleteOption[] = [
  { value: "col-pe27", label: "PE27" },
  { value: "col-ah26", label: "AH26" },
  { value: "col-pe26", label: "PE26" },
  { value: "col-ah25", label: "AH25" },
  { value: "col-pe25", label: "PE25" },
  { value: "col-ah24", label: "AH24", disabled: true },
  { value: "col-capsule", label: "Capsule Noël 2026" },
  { value: "col-permanent", label: "Permanent" },
];

const MANY: SelectAutocompleteOption[] = Array.from({ length: 1000 }, (_, i) => ({
  value: `ref-${i}`,
  label: `Référence ${String(i).padStart(4, "0")}`,
}));

const meta: Meta<typeof MultiSelect> = {
  title: "UI/MultiSelect",
  component: MultiSelect,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Liste déroulante à choix multiples. Les valeurs cochées s'affichent en \`TagText\` dans le déclencheur (résumé « +N » quand elles ne tiennent plus sur une ligne), le menu propose une recherche, une case par option et « Tout sélectionner » / « Tout désélectionner » sur les options visibles.

## Utilisation

\`\`\`tsx
import { MultiSelect } from "@gs/gs-components-library";

<MultiSelect
  options={[
    { value: "col-pe27", label: "PE27" },
    { value: "col-ah26", label: "AH26" },
  ]}
  value={values}
  onChange={(values, selected) => {
    // values : ["col-pe27", "col-ah26"] (les value, jamais les labels)
    // selected : [{ value: "col-pe27", label: "PE27" }, …]
    setValues(values);
  }}
  allowClear
/>
\`\`\`

## Clavier
- Déclencheur : Entrée, Espace, ↓ ou ↑ ouvrent le menu ; Retour arrière retire la dernière valeur.
- Menu (le focus reste dans la recherche) : ↓ / ↑ parcourent « Tout sélectionner » et les options, Entrée coche, Espace coche quand la recherche est vide, Retour arrière dans une recherche vide retire la dernière valeur, Tab et Échap ferment et rendent le focus au déclencheur.
- Dans une \`Modal\`, un \`SidePanel\` ou un \`FullFrame\`, Échap ferme d'abord le menu seul.

## Portée de la v1
Mode local uniquement : pas de \`searchMode="remote"\`, pas d'\`allowCustomValue\`, \`group\` n'est pas affiché. Une valeur présente dans \`value\` mais absente des \`options\` s'affiche avec sa propre valeur comme label.`,
      },
    },
  },
  argTypes: {
    size: { control: "radio", options: ["normal", "small"] },
    disabled: { control: "boolean" },
    allowClear: { control: "boolean" },
    discrete: { control: "boolean" },
    maxSelected: { control: "number" },
    language: { control: "select", options: [undefined, "fr", "en", "es", "it", "de"] },
  },
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

/** Wrapper contrôlé, avec l'affichage de ce que reçoit onChange. */
function Demo({ initial = [], width = 320, ...props }: Partial<MultiSelectProps> & { initial?: string[]; width?: number }) {
  const [values, setValues] = useState<string[]>(initial);
  const [selected, setSelected] = useState<SelectedOption[]>([]);
  return (
    <VStack gap={2} padding={0} style={{ width }}>
      <MultiSelect
        options={COLLECTIONS}
        aria-label="Collections"
        {...props}
        value={values}
        onChange={(next, nextSelected) => {
          setValues(next);
          setSelected(nextSelected);
          props.onChange?.(next, nextSelected);
        }}
      />
      <pre style={{ fontSize: 11, margin: 0, whiteSpace: "pre-wrap" }}>
        values: {JSON.stringify(values)}
        {selected.length > 0 && `\nselected: ${JSON.stringify(selected)}`}
      </pre>
    </VStack>
  );
}

export const Default: Story = {
  render: (args) => (
    <Layout bg="white" padding={4}>
      <Demo {...args} />
    </Layout>
  ),
  args: { placeholder: "Collections" },
};

export const WithValues: Story = {
  name: "Avec valeurs et +N",
  render: (args) => (
    <Layout bg="white" padding={4}>
      <Demo {...args} initial={["col-pe27", "col-ah26", "col-pe26", "col-capsule", "col-permanent"]} />
    </Layout>
  ),
  args: { allowClear: true },
};

export const Search: Story = {
  name: "Recherche (searchText)",
  render: (args) => (
    <Layout bg="white" padding={4}>
      <Demo
        {...args}
        options={[
          { value: "1", label: "Printemps-été 2027", searchText: "PE27 printemps été 2027" },
          { value: "2", label: "Automne-hiver 2026", searchText: "AH26 automne hiver 2026" },
          { value: "3", label: "Printemps-été 2026", searchText: "PE26 printemps été 2026" },
          { value: "4", label: "Automne-hiver 2025", searchText: "AH25 automne hiver 2025" },
        ]}
      />
      <p style={{ fontSize: 12, marginTop: 8 }}>
        Taper « AH » puis « Tout sélectionner » : seules les options visibles sont cochées.
      </p>
    </Layout>
  ),
};

export const ManyOptions: Story = {
  name: "1 000 options",
  render: (args) => (
    <Layout bg="white" padding={4}>
      <Demo {...args} options={MANY} />
    </Layout>
  ),
};

export const MaxSelected: Story = {
  name: "maxSelected",
  render: (args) => (
    <Layout bg="white" padding={4}>
      <Demo {...args} initial={["col-pe27", "col-ah26"]} />
    </Layout>
  ),
  args: { maxSelected: 3 },
};

export const Small: Story = {
  name: "Taille small",
  render: (args) => (
    <Layout bg="white" padding={4}>
      <VStack gap={4} padding={0}>
        <Demo {...args} size="small" width={200} />
        <Demo {...args} size="small" width={200} initial={["col-pe27", "col-ah26"]} allowClear />
      </VStack>
    </Layout>
  ),
};

export const Disabled: Story = {
  name: "Désactivé",
  render: (args) => (
    <Layout bg="white" padding={4}>
      <VStack gap={4} padding={0}>
        <Demo {...args} disabled />
        <Demo {...args} disabled initial={["col-pe27", "col-ah26"]} />
      </VStack>
    </Layout>
  ),
};

function InModal(props: Partial<MultiSelectProps>) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Ouvrir la fenêtre</Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Recherche catalogue"
        header={<span>Recherche catalogue</span>}
        footer={<Button onClick={() => setOpen(false)}>Fermer</Button>}
      >
        <VStack gap={2} padding={0}>
          <label id="collections-label" style={{ fontSize: 12 }}>
            Collections
          </label>
          <Demo {...props} aria-label={undefined} aria-labelledby="collections-label" options={MANY.slice(0, 200)} />
          <p style={{ fontSize: 12 }}>Échap ferme d'abord le menu, puis la fenêtre. La liste défile à la molette.</p>
        </VStack>
      </Modal>
    </>
  );
}

export const InsideModal: Story = {
  name: "Dans une Modal",
  render: (args) => <InModal {...args} />,
  args: { allowClear: true },
};

export const DarkBackground: Story = {
  name: "Fond sombre",
  render: (args) => (
    <Layout bg="black" padding={4}>
      <Demo {...args} initial={["col-pe27", "col-ah26"]} />
    </Layout>
  ),
  args: { allowClear: true },
};

export const AllBackgrounds: Story = {
  name: "Tous les fonds",
  render: (args) => (
    <VStack gap={0} padding={0}>
      {(["white", "grey", "black"] as const).map((bg) => (
        <Layout key={bg} bg={bg} padding={4}>
          <VStack gap={2} padding={0}>
            <span style={{ fontSize: 11 }}>bg="{bg}"</span>
            <Demo {...args} initial={["col-pe27", "col-ah26", "col-capsule"]} allowClear />
            <Demo {...args} discrete />
          </VStack>
        </Layout>
      ))}
    </VStack>
  ),
};

export const French: Story = {
  name: "Français",
  render: (args) => (
    <Layout bg="white" padding={4}>
      <Demo {...args} language="fr" initial={["col-pe27"]} allowClear />
    </Layout>
  ),
};
