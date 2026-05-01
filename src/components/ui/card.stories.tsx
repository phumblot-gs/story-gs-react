import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';
import { Layout } from '../layout/Layout';
import { Button } from './button';
import { StatusIndicator } from '../StatusIndicator';
import { MediaStatus } from '@/utils/mediaStatus';
import { ActivityHeatmap, type ActivityDataPoint } from './activity-heatmap';

const meta = {
  title: 'Layout/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Card component built with the Figma design system. Displays a card with optional header, content, and footer sections.

## Features
- **Context-aware styling**: Automatically adapts to parent Layout background context
- **Two variants**: \`filled\` (default, contrasting background) and \`outline\` (same background as parent + 1px border)
- **Optional sections**: Header and footer are optional, allowing flexible content structure
- **Shadcn compatible**: Follows the same API structure as shadcn/ui Card component
- **Automatic context propagation**: Exposes its own \`data-bg\` context for child components

## Background Context Mapping

The Card component automatically determines its appearance based on the parent Layout's \`data-bg\` context **and** the \`variant\` prop:

### Variant \`"filled"\` (default — historical behavior)
- **Parent \`data-bg="white"\`** → Card displays with **grey** background (exposes \`data-bg="grey"\` for children)
- **Parent \`data-bg="grey"\`** → Card displays with **white** background (exposes \`data-bg="white"\` for children)
- **Parent \`data-bg="black"\`** → Card displays with **black** background (exposes \`data-bg="black"\` for children)

### Variant \`"outline"\`
The Card keeps the **same** background as its parent (no swap). The visual separation is provided by a 1px border whose color adapts to the parent context. \`data-bg\` exposed to children matches the parent's. Use this when you want a KPI card or summary block to feel like part of a uniform surface, separated only by a hairline.

## Basic Usage

\`\`\`tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@story-gs-react';
import { Layout } from '@story-gs-react';

<Layout bg="white">
  <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card description text</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Card content goes here</p>
    </CardContent>
    <CardFooter>
      <Button>Action</Button>
    </CardFooter>
  </Card>
</Layout>
\`\`\`

## Component Structure

- **Card**: Root container component
- **CardHeader**: Optional header section (contains title and description)
- **CardTitle**: Title text (uppercase, bold)
- **CardDescription**: Description text (regular weight)
- **CardContent**: Main content area
- **CardFooter**: Optional footer section (typically for actions)

## Context Propagation

The Card component creates a new background context for its children, allowing nested components to adapt correctly:

\`\`\`tsx
<Layout bg="white">
  {/* Card detects white context and displays grey */}
  <Card>
    {/* Card exposes grey context for children */}
    <CardContent>
      <Button>Button adapts to grey context</Button>
    </CardContent>
  </Card>
</Layout>
\`\`\`

## Shadow Effect

The Card component supports an optional shadow effect with smooth hover transition:

\`\`\`tsx
<Card cardShadow={true}>
  <CardHeader>
    <CardTitle>Card with Shadow</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Hover over this card to see the shadow effect</p>
  </CardContent>
</Card>
\`\`\`

When \`cardShadow={true}\`, the Card automatically applies:
- \`shadow-md\` by default
- \`hover:shadow-lg\` on hover
- \`transition-shadow\` for smooth transition

## Examples

### Card with all sections
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Complete Card</CardTitle>
    <CardDescription>With header, content, and footer</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content area</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
\`\`\`

### Card without header
\`\`\`tsx
<Card>
  <CardContent>
    <p>Content without header</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
\`\`\`

### Card without footer
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content without footer</p>
  </CardContent>
</Card>
\`\`\`

### Custom content
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Custom Card</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Any custom content */}
    <div className="custom-content">
      <CustomComponent />
    </div>
  </CardContent>
</Card>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes',
    },
    cardShadow: {
      control: 'boolean',
      description: 'Enable shadow effect with hover transition (shadow-md by default, shadow-lg on hover)',
    },
    variant: {
      control: { type: 'inline-radio' },
      options: ['filled', 'outline'],
      description:
        'Visual variant. `"filled"` (default, historical behavior) uses a contrasting background relative to the parent. `"outline"` keeps the parent background and is separated by a 1px border — ideal for KPI cards on a uniform surface.',
    },
    footer: {
      control: false,
      description: 'Optional footer content to display below the Card',
    },
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <Story />
      </Layout>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des plans</CardTitle>
        <CardDescription>
          Gérer les plans, leurs fonctionnalités et leurs tarifs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex gap-5 items-center">
          <Button variant="link">Annuler</Button>
          <Button size="medium">Enregistrer</Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold mb-4">White Background</h3>
        <Layout bg="white" padding={6}>
          <Card>
            <CardHeader>
              <CardTitle>Card on White</CardTitle>
              <CardDescription>Card displays with grey background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[13px] leading-[19.5px]">
                This card is displayed on a white background, so it uses the grey variant.
              </p>
            </CardContent>
          </Card>
        </Layout>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-4">Grey Background</h3>
        <Layout bg="grey" padding={6}>
          <Card>
            <CardHeader>
              <CardTitle>Card on Grey</CardTitle>
              <CardDescription>Card displays with white background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[13px] leading-[19.5px]">
                This card is displayed on a grey background, so it uses the white variant.
              </p>
            </CardContent>
          </Card>
        </Layout>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-4">Black Background</h3>
        <Layout bg="black" padding={6}>
          <Card>
            <CardHeader>
              <CardTitle>Card on Black</CardTitle>
              <CardDescription>Card displays with black background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[13px] leading-[19.5px]">
                This card is displayed on a black background, so it uses the black variant.
              </p>
            </CardContent>
          </Card>
        </Layout>
      </div>
    </div>
  ),
};

export const WithoutHeader: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">
          Card content without header section.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="medium">Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">
          Card content without footer section.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithButtons: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card with Actions</CardTitle>
        <CardDescription>Example with multiple buttons in footer</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">
          This card demonstrates how buttons adapt to the card's context.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex gap-5 items-center">
          <Button variant="link">Annuler</Button>
          <Button size="medium" variant="secondary">Secondary</Button>
          <Button size="medium">Primary</Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const WithShadow: Story = {
  render: () => (
    <Card cardShadow={true}>
      <CardHeader>
        <CardTitle>Card with Shadow</CardTitle>
        <CardDescription>Hover over this card to see the shadow effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">
          This card has the shadow effect enabled. Move your mouse over it to see the shadow transition.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex gap-5 items-center">
          <Button variant="link">Annuler</Button>
          <Button size="medium">Enregistrer</Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Outline Card</CardTitle>
        <CardDescription>Same background as parent, separated by a 1px border.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">
          Use this variant for KPI cards or summary blocks placed directly on a uniform
          surface — the border keeps the visual separation without introducing a contrasting fill.
        </p>
      </CardContent>
    </Card>
  ),
};

export const OutlineKpi: Story = {
  args: {
    variant: 'outline',
  },
  render: (args) => (
    <div className="grid grid-cols-3 gap-4 w-[720px]">
      {[
        { label: 'PROJETS URGENTS', status: MediaStatus.ERROR_DURING_BROADCAST, value: 3, hint: '+1 cette semaine' },
        { label: 'NOUVEAUX PROJETS', status: MediaStatus.SUBMITTED_FOR_APPROVAL, value: 7, hint: '+3 cette semaine' },
        { label: 'PROJETS EN COURS', status: MediaStatus.SELECTED, value: 12, hint: '+2 cette semaine' },
      ].map((kpi) => (
        <Card key={kpi.label} {...args} className="!p-5 !gap-3 min-h-[180px]">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-grey-strongest">
            <StatusIndicator status={kpi.status} size="small" />
            {kpi.label}
          </div>
          <div className="flex-1" />
          <div className="flex items-end justify-between">
            <span className="text-[44px] leading-none font-bold text-black">{kpi.value}</span>
            <span className="text-xs text-grey-strongest">{kpi.hint}</span>
          </div>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Reproduction of the home-page KPI cards from the design — `variant="outline"` with a colored dot, an uppercase label, and a large counter.',
      },
    },
  },
};

export const OutlineWithActivityHeatmap: Story = {
  args: {
    variant: 'outline',
  },
  render: (args) => {
    const endDate = new Date('2026-05-01T00:00:00');
    const weeks = 26;
    const days = weeks * 7;
    let s = 1337;
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xffffffff;
    };
    const data: ActivityDataPoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(d.getDate() - i);
      const weekend = d.getDay() === 0 || d.getDay() === 6;
      const density = weekend ? 0.3 : 0.7;
      if (rand() > density) continue;
      const v = rand();
      const count = v < 0.08 ? 14 : Math.ceil(v * 8);
      data.push({ date: d, count });
    }

    return (
      <Card {...args} className="w-fit !p-5 !gap-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-grey-strongest">
          Activité - 6 derniers mois
        </div>
        <ActivityHeatmap
          data={data}
          endDate={endDate}
          weeks={weeks}
          cellSize={10}
          cellGap={2}
          language="FR"
        />
      </Card>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Outline card embedding an `ActivityHeatmap` over 6 months (26 weeks), with `cellSize={10}`, `cellGap={2}` and the French locale. The card title sits above the grid in a `CardHeader`/`CardTitle`.',
      },
    },
  },
};

export const OutlineOnGrey: Story = {
  args: {
    variant: 'outline',
  },
  decorators: [
    (Story) => (
      <Layout bg="grey" padding={6}>
        <Story />
      </Layout>
    ),
  ],
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Outline on grey</CardTitle>
        <CardDescription>The card stays grey; the border is what makes it stand out.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">
          Compare with the default <code>variant="filled"</code> on a grey parent — the latter would flip
          the card to white.
        </p>
      </CardContent>
    </Card>
  ),
};

export const OutlineOnBlack: Story = {
  args: {
    variant: 'outline',
  },
  decorators: [
    (Story) => (
      <Layout bg="black" padding={6}>
        <Story />
      </Layout>
    ),
  ],
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Outline on black</CardTitle>
        <CardDescription>Border switches to a darker grey so it stays visible on the dark surface.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">Same data, dark surface.</p>
      </CardContent>
    </Card>
  ),
};

export const FilledVsOutline: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[720px]">
      <Card>
        <CardHeader>
          <CardTitle>Filled (default)</CardTitle>
          <CardDescription>Contrasting background — current behavior.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[13px] leading-[19.5px]">No change vs. existing usage.</p>
        </CardContent>
      </Card>
      <Card variant="outline">
        <CardHeader>
          <CardTitle>Outline</CardTitle>
          <CardDescription>Same background as parent + 1px border.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[13px] leading-[19.5px]">Opt-in via <code>variant="outline"</code>.</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Side-by-side. The `filled` variant is unchanged from the historical behavior; `outline` is the new opt-in.',
      },
    },
  },
};

export const NestedCards: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Parent Card</CardTitle>
        <CardDescription>Card containing another card</CardDescription>
      </CardHeader>
      <CardContent>
        <Card>
          <CardHeader>
            <CardTitle>Nested Card</CardTitle>
            <CardDescription>This card is nested inside another card</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[13px] leading-[19.5px]">
              The nested card adapts to the parent card's context.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  ),
};

