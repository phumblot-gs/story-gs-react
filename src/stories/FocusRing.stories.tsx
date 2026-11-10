import type { Meta, StoryObj } from "@storybook/react-vite";

import { Layout, VStack } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Bg = "white" | "grey" | "black";

const meta: Meta = {
  title: "Design System/Focus ring",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Anneau de focus clavier de la librairie (\`focus-visible:ring-ring\`), à vérifier à la touche **Tab** : il ne s'affiche pas au clic souris.

| Contexte | Couleur de l'anneau (\`--ring\`) |
| --- | --- |
| \`data-bg="white"\` / \`"grey"\` | \`#292828\` |
| \`data-bg="black"\` | \`#ffffff\` |
| sans contexte (popovers, menus portés) | \`#292828\` |

L'écart (\`ring-offset-2\`) est blanc (\`#fff\`, défaut Tailwind) quel que soit le fond.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function Controls({ id }: { id: string }) {
  return (
    <VStack gap={4} align="start">
      <Button>Button</Button>
      <label className="flex items-center gap-2">
        <Checkbox id={`${id}-checkbox`} />
        <span>Checkbox</span>
      </label>
      <Switch aria-label={`Switch ${id}`} />
      <div className="w-48">
        <Slider aria-label={`Slider ${id}`} defaultValue={[3]} min={1} max={7} step={1} />
      </div>
      <RadioGroup aria-label={`RadioGroup ${id}`} defaultValue="a" className="flex gap-4">
        <label className="flex items-center gap-2">
          <RadioGroupItem value="a" />
          <span>A</span>
        </label>
        <label className="flex items-center gap-2">
          <RadioGroupItem value="b" />
          <span>B</span>
        </label>
      </RadioGroup>
    </VStack>
  );
}

function Column({ bg }: { bg: Bg }) {
  return (
    <Layout bg={bg} padding={6} scroll="none" className={bg === "black" ? "text-white" : undefined}>
      <VStack gap={4}>
        <p className="font-bold">data-bg="{bg}"</p>
        <Controls id={bg} />
      </VStack>
    </Layout>
  );
}

export const AllBackgrounds: Story = {
  name: "Focus ring",
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-4">
      <Column bg="white" />
      <Column bg="grey" />
      <Column bg="black" />
      <Layout padding={6} scroll="none">
        <VStack gap={4}>
          <p className="font-bold">sans data-bg</p>
          <Controls id="none" />
        </VStack>
      </Layout>
    </div>
  ),
};
