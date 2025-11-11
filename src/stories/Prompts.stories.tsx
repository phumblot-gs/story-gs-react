import type { Meta, StoryObj } from "@storybook/react-vite"
import { Layout } from "@/components/layout"

const meta: Meta = {
  title: "Prompts/Pagination",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Prompts réutilisables pour guider l'implémentation de fonctionnalités dans d'autres projets utilisant la librairie.
Copiez-collez le contenu markdown dans votre conversation avec un agent.
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const promptMarkdown = `# Implémentation d'un composant de sélection avec pagination

## Contexte

Nous avons une liste paginée utilisant le composant \`Pagination\` de la librairie \`@gs/gs-components-library\`. Cette liste contient :
- Des lignes avec des \`Checkbox\` individuelles pour sélectionner chaque ligne
- Une \`Checkbox\` générale (header) pour sélectionner toutes les lignes de la page courante

## Comportement actuel

Actuellement, lorsqu'on clique sur la \`Checkbox\` générale, toutes les lignes de la page courante sont sélectionnées.

## Nouvelle fonctionnalité à implémenter

Ajouter un composant \`Select\` à côté de la \`Checkbox\` générale avec le comportement suivant :

### États et transitions

#### État initial
- \`Checkbox\` générale : **unchecked** (non cochée)
- \`Select\` : **disabled** (désactivée)
- Aucune ligne sélectionnée

#### Transition 1 : Sélection d'une ligne individuelle
**Action** : Clic sur une \`Checkbox\` d'une ligne de la liste

**Résultat** :
- \`Checkbox\` générale : passe à **indeterminate** (état indéterminé)
- \`Select\` : devient **enabled** (activée)
- \`Select\` : affiche la valeur **"Personnalisé"** (pour indiquer qu'une sélection partielle existe)

#### Transition 2 : Sélection de toutes les lignes de la page courante
**Action** : Clic sur la \`Checkbox\` générale (depuis l'état indeterminate)

**Résultat** :
- Toutes les lignes de la page courante sont sélectionnées
- \`Checkbox\` générale : passe de **indeterminate** à **checked** (cochée)
- \`Select\` : reste **enabled**
- \`Select\` : reste à la valeur **"Personnalisé"** (car il y a d'autres pages avec des lignes non sélectionnées)

#### Transition 3 : Sélection de toutes les pages
**Action** : Sélection de l'option **"Toutes les pages"** dans le \`Select\`

**Résultat** :
- Toutes les lignes de toutes les pages sont sélectionnées
- \`Checkbox\` générale : reste **checked**
- \`Select\` : reste **enabled**
- \`Select\` : affiche la valeur **"Toutes les pages"**

#### Transition 4 : Désélection complète
**Action** : Sélection de l'option **"Tout désélectionner"** dans le \`Select\`

**Résultat** :
- Toutes les sélections sont effacées (toutes les pages)
- \`Checkbox\` générale : passe à **unchecked**
- \`Select\` : redevient **disabled**
- Retour à l'état initial

### Options du Select

Le \`Select\` doit contenir les options suivantes :
1. **"Personnalisé"** (affichée automatiquement quand une sélection partielle existe)
2. **"Toutes les pages"** (sélectionne toutes les lignes de toutes les pages)
3. **"Tout désélectionner"** (efface toutes les sélections)

## Composants disponibles de la librairie

Utiliser les composants suivants de \`@gs/gs-components-library\` :
- \`Select\` : composant de sélection déroulante
- \`Checkbox\` : composant de case à cocher (avec support de l'état \`indeterminate\`)

## Structure suggérée

\`\`\`tsx
// Exemple de structure suggérée
const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
const [selectValue, setSelectValue] = useState<string>("");

// Calculer les états
const currentPageSelectedCount = /* nombre d'items sélectionnés sur la page courante */;
const currentPageTotalCount = /* nombre total d'items sur la page courante */;
const allPagesSelectedCount = /* nombre total d'items sélectionnés sur toutes les pages */;
const allPagesTotalCount = /* nombre total d'items sur toutes les pages */;

const isAllCurrentPageSelected = currentPageSelectedCount === currentPageTotalCount;
const isAllPagesSelected = allPagesSelectedCount === allPagesTotalCount;
const hasPartialSelection = selectedItems.size > 0 && !isAllPagesSelected;

// État de la Checkbox générale
const checkboxState = 
  isAllPagesSelected ? "checked" :
  hasPartialSelection ? "indeterminate" :
  "unchecked";

// État du Select
const isSelectDisabled = selectedItems.size === 0;
const selectValue = 
  isAllPagesSelected ? "all-pages" :
  hasPartialSelection ? "custom" :
  "";

// Handlers
const handleSelectAllCurrentPage = () => {
  // Sélectionner toutes les lignes de la page courante
};

const handleSelectAllPages = () => {
  // Sélectionner toutes les lignes de toutes les pages
};

const handleDeselectAll = () => {
  // Désélectionner toutes les lignes
};

const handleSelectChange = (value: string) => {
  if (value === "all-pages") {
    handleSelectAllPages();
  } else if (value === "deselect-all") {
    handleDeselectAll();
  }
};
\`\`\`

## Points d'attention

1. **Gestion de l'état \`indeterminate\`** : S'assurer que le composant \`Checkbox\` supporte bien l'état \`indeterminate\` via la prop appropriée
2. **Synchronisation** : La \`Checkbox\` générale et le \`Select\` doivent rester synchronisés avec l'état réel des sélections
3. **Performance** : Si la liste est très grande, optimiser la gestion des sélections (utiliser des \`Set\` ou des structures de données efficaces)
4. **Navigation entre pages** : S'assurer que les sélections persistent lors de la navigation entre les pages de la pagination

## Questions à clarifier (si nécessaire)

- Le \`Select\` doit-il être visible uniquement quand il y a une sélection partielle, ou toujours visible (mais disabled) ?
- Faut-il afficher le nombre d'éléments sélectionnés quelque part dans l'interface ?
- Y a-t-il d'autres actions possibles sur les éléments sélectionnés (suppression en masse, export, etc.) ?`

export const PaginationSelect: Story = {
  render: () => {
    return (
      <Layout bg="white" padding={8}>
        <div className="max-w-4xl">
          <pre className="bg-grey-light p-6 rounded overflow-x-auto text-sm whitespace-pre-wrap font-mono">
            {promptMarkdown}
          </pre>
        </div>
      </Layout>
    )
  },
}

