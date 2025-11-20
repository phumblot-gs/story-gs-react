import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./link";
import { Layout, HStack, VStack } from "@/components/layout";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { MemoryRouter } from "react-router-dom";

const meta: Meta<typeof Link> = {
  title: "UI/Link",
  component: Link,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Composant Link qui s'adapte automatiquement au contexte de fond (black/white/grey).

## Caractéristiques
- **text-sm italic** par défaut
- Barre sous le texte séparée de 2px (pas un underline classique)
- Couleur adaptée au fond (blanc sur noir, noir sur blanc/gris)
- Peut être utilisé comme lien (\`href\`) ou comme bouton (\`asButton\` avec \`onClick\`)

## Usage

\`\`\`tsx
// Comme lien
<Link href="/page">Aller à la page</Link>

// Comme bouton
<Link asButton onClick={handleClick}>Action</Link>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TranslationProvider>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </TranslationProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  render: () => (
    <VStack gap={4}>
      <div>
        <h3 className="text-sm font-semibold mb-2">Sur fond blanc (par défaut)</h3>
        <Layout bg="white" padding={4}>
          <Link href="#test">Lien de test</Link>
        </Layout>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Sur fond gris</h3>
        <Layout bg="grey" padding={4}>
          <Link href="#test">Lien de test</Link>
        </Layout>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Sur fond noir</h3>
        <Layout bg="black" padding={4}>
          <Link href="#test">Lien de test</Link>
        </Layout>
      </div>
    </VStack>
  ),
};

export const AsButton: Story = {
  render: () => (
    <VStack gap={4}>
      <div>
        <h3 className="text-sm font-semibold mb-2">Comme bouton sur fond blanc</h3>
        <Layout bg="white" padding={4}>
          <Link asButton onClick={() => alert("Clic !")}>
            Cliquer ici
          </Link>
        </Layout>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Comme bouton sur fond gris</h3>
        <Layout bg="grey" padding={4}>
          <Link asButton onClick={() => alert("Clic !")}>
            Cliquer ici
          </Link>
        </Layout>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Comme bouton sur fond noir</h3>
        <Layout bg="black" padding={4}>
          <Link asButton onClick={() => alert("Clic !")}>
            Cliquer ici
          </Link>
        </Layout>
      </div>
    </VStack>
  ),
};

export const InActionBar: Story = {
  render: () => (
    <VStack gap={4}>
      <div>
        <h3 className="text-sm font-semibold mb-2">Dans ActionBar (fond noir)</h3>
        <Layout bg="black" padding={4} className="h-[50px]">
          <HStack gap={3} align="center">
            <span className="text-white text-sm">3 fichiers sélectionnés</span>
            <Link asButton onClick={() => alert("Tout désélectionner")}>
              Tout désélectionner
            </Link>
          </HStack>
        </Layout>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Dans ActionBar (fond blanc)</h3>
        <Layout bg="white" padding={4} className="h-[50px] border border-grey">
          <HStack gap={3} align="center">
            <span className="text-black text-sm">3 fichiers sélectionnés</span>
            <Link asButton onClick={() => alert("Tout désélectionner")}>
              Tout désélectionner
            </Link>
          </HStack>
        </Layout>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2">Dans ActionBar (fond gris)</h3>
        <Layout bg="grey" padding={4} className="h-[50px]">
          <HStack gap={3} align="center">
            <span className="text-black text-sm">3 fichiers sélectionnés</span>
            <Link asButton onClick={() => alert("Tout désélectionner")}>
              Tout désélectionner
            </Link>
          </HStack>
        </Layout>
      </div>
    </VStack>
  ),
};

