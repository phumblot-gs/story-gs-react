import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActivityHeatmap, type ActivityDataPoint } from "./activity-heatmap";
import { Layout, VStack, HStack } from "@/components/layout";
import { TranslationProvider } from "@/contexts/TranslationContext";

/**
 * Build deterministic pseudo-random activity data for the past `days` days,
 * ending at `endDate`. Uses a seeded LCG so the demo is stable between renders.
 */
const buildSampleData = (
  endDate: Date,
  days = 365,
  seed = 42,
  density = 0.55,
  maxCount = 12
): ActivityDataPoint[] => {
  const data: ActivityDataPoint[] = [];
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    // Lower activity on weekends, very rare days with no activity.
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const localDensity = weekend ? density * 0.4 : density;
    if (rand() > localDensity) continue;
    const burst = rand() < 0.08 ? maxCount : Math.ceil(rand() * (maxCount * 0.7));
    data.push({ date: d, count: burst });
  }
  return data;
};

const FIXED_END = new Date("2026-04-29T00:00:00");
const SAMPLE = buildSampleData(FIXED_END);

const meta: Meta<typeof ActivityHeatmap> = {
  title: "UI/ActivityHeatmap",
  component: ActivityHeatmap,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Activity heatmap. Renders a window of daily activity as a 7-row grid of colored cells, with month labels on top, weekday labels on the left, an optional legend at the bottom-left and a Less–More color scale on the bottom-right.

## When to use it

- A user / team activity panel ("files added in the last year").
- A content calendar showing publishing density over time.
- Any per-day metric where you want to surface streaks, gaps and burst patterns at a glance.

## Data model

You pass a flat list of \`{ date, count }\` points:

\`\`\`tsx
<ActivityHeatmap
  data={[
    { date: "2026-04-15", count: 3 },
    { date: "2026-04-16", count: 7 },
    // ...
  ]}
/>
\`\`\`

- \`date\` accepts an ISO string (\`YYYY-MM-DD\`) or a \`Date\` object.
- Multiple entries on the same calendar day are summed.
- Days with no data render as the level-0 (empty) cell. Days strictly after \`endDate\` are rendered as a dashed placeholder so the rightmost column always shows a full week.
- The grid spans the last \`weeks\` weeks (default \`53\`) ending on \`endDate\` (default: today).

## Color

Two ways to color the cells, ranked from simplest to most explicit:

\`\`\`tsx
// 1. Single base color — the component derives 4 intensity shades automatically.
//    Hex inputs use rgba opacity; named or HSL inputs use color-mix().
<ActivityHeatmap data={data} color="#2563eb" />

// 2. Fully explicit 5-step palette: [empty, level1, level2, level3, level4].
<ActivityHeatmap
  data={data}
  colorScale={["#f3e8ff", "#e9d5ff", "#c084fc", "#9333ea", "#581c87"]}
/>
\`\`\`

When neither prop is provided, the component falls back to a built-in green palette.

## Levels (intensity bucketing)

Each cell is mapped to one of 5 levels:

- **Level 0** — \`count <= 0\`
- **Levels 1–4** — count crosses each of four ascending thresholds.

By default, thresholds are derived from the data's max value (quartiles). Override with \`levels\` if your scale is fixed (e.g. SLA-driven) or if you want consistent buckets across multiple heatmaps:

\`\`\`tsx
<ActivityHeatmap data={data} levels={[1, 5, 10, 20]} />
\`\`\`

## Internationalization

The component is fully localized through the \`TranslationProvider\` or via props, just like \`FileBrowser\` and \`FolderBrowser\`:

\`\`\`tsx
// Wrapped in a provider — the heatmap follows the global language.
<TranslationProvider initialLanguage={{ code: "FR", name: "Français" }}>
  <ActivityHeatmap data={data} />
</TranslationProvider>

// Or set it inline (overrides the provider).
<ActivityHeatmap data={data} language="DE" />
\`\`\`

Localized pieces:

- **Weekday labels** (\`Mon\`, \`Wed\`, \`Fri\`) and **month labels** (\`Jan\`, \`Feb\`, …) come from the matching \`date-fns\` locale.
- **Legend** (\`legend\`), **Less / More** scale labels and **tooltips** are translation keys.
- **Unit** (e.g. *file*) is a translation key with built-in pluralization. The component automatically falls back to the \`_plural\` variant when the count is not 1.

Built-in unit keys: \`file\` (default), \`post\`, \`event\`, \`activity\`, \`upload\` (each with its \`_plural\` form, in EN / FR / ES / IT / DE).

### Adding a custom unit

Pass your own translation map and point \`unit\` at it:

\`\`\`tsx
<ActivityHeatmap
  data={data}
  unit="activityHeatmap.unit.review"
  translations={{
    "activityHeatmap.unit.review": {
      EN: "review", FR: "relecture", ES: "revisión", IT: "revisione", DE: "Überprüfung",
    },
    "activityHeatmap.unit.review_plural": {
      EN: "reviews", FR: "relectures", ES: "revisiones", IT: "revisioni", DE: "Überprüfungen",
    },
  }}
/>
\`\`\`

The same \`translations\` prop works for the legend (e.g. \`activityHeatmap.legendReviews\`).

## Tooltip format

On hover, every cell shows: \`{count} {unit} on {date}\` (or *No {unit} on {date}* when empty). Both the unit form and the date are localized to the active language.

## Accessibility

- The grid uses \`role="grid"\` with cells exposing \`aria-label\` containing the localized tooltip text — screen readers announce both count and date.
- The whole component is wrapped in \`role="figure"\` with the legend as its accessible name.

## Layout

The grid sizes itself naturally from \`weeks × cellSize\`. To make it span a wider container, either bump \`cellSize\` / \`cellGap\` or reduce \`weeks\`. Hide \`weekdays\`, \`months\`, \`legend\` or \`scale\` independently with the matching \`show*\` props for compact dashboards.`,
      },
    },
  },
  argTypes: {
    data: {
      control: false,
      description:
        "List of `{ date, count }` activity points. `date` can be an ISO string (`YYYY-MM-DD`) or a `Date`. Multiple entries on the same day are summed.",
    },
    endDate: {
      control: "date",
      description: "Last day shown on the right edge of the grid. Defaults to today.",
    },
    weeks: {
      control: { type: "number", min: 4, max: 80, step: 1 },
      description: "Number of weeks (columns) to display. Default: 53 (one year).",
    },
    firstDayOfWeek: {
      control: { type: "inline-radio" },
      options: [0, 1],
      description: "First day of the week. `0` = Sunday (default), `1` = Monday.",
    },
    color: {
      control: "color",
      description:
        "Single base CSS color. The four active intensities are derived from it (hex → opacity steps; named / HSL → `color-mix`). Ignored when `colorScale` is set.",
    },
    colorScale: {
      control: false,
      description:
        "Explicit 5-step color scale `[empty, level1, level2, level3, level4]`. Takes precedence over `color`.",
    },
    levels: {
      control: false,
      description:
        "Four ascending thresholds mapping a count to levels 1–4. If omitted, thresholds are computed from the data's max value (quartiles).",
    },
    unit: {
      control: "text",
      description:
        "Translation key for the unit label (singular). The plural form must exist as `${unit}_plural`. Default: `activityHeatmap.unit.file`.",
    },
    legend: {
      control: "text",
      description:
        "Translation key (or literal text) used for the bottom-left caption. Default: `activityHeatmap.legend`.",
    },
    legendHref: {
      control: "text",
      description: "When set, the legend is rendered as a link to this URL.",
    },
    cellSize: {
      control: { type: "number", min: 6, max: 20, step: 1 },
      description: "Cell size in px. Default: 11.",
    },
    cellGap: {
      control: { type: "number", min: 0, max: 6, step: 1 },
      description: "Gap between cells in px. Default: 3.",
    },
    showWeekdays: {
      control: "boolean",
      description: "Show the weekday labels on the left. Default: true.",
    },
    showMonths: {
      control: "boolean",
      description: "Show the month labels on top. Default: true.",
    },
    showLegend: {
      control: "boolean",
      description: "Show the bottom-left legend. Default: true.",
    },
    showScale: {
      control: "boolean",
      description: "Show the bottom-right Less–More color scale. Default: true.",
    },
    language: {
      control: "text",
      description:
        "Custom language code (e.g., 'FR', 'EN', 'ES', 'IT', 'DE'). If not provided, uses TranslationProvider language or 'EN' by default.",
    },
    translations: {
      control: false,
      description:
        "Custom translations to merge over the defaults. Use this to add new unit keys or override the legend / tooltip / Less / More texts.",
    },
    className: {
      control: "text",
      description: "Additional Tailwind classes appended to the root container.",
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <Story />
      </Layout>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActivityHeatmap>;

export const Default: Story = {
  args: {
    data: SAMPLE,
    endDate: FIXED_END,
    language: "EN",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default heatmap: green palette, 53 weeks ending today, English locale, `file` as the unit.",
      },
    },
  },
};

export const FrenchFiles: Story = {
  args: {
    ...Default.args,
    language: "FR",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Same data, French locale: weekdays, months, unit (`fichier` / `fichiers`) and legend are translated.",
      },
    },
  },
};

export const GermanPosts: Story = {
  args: {
    ...Default.args,
    language: "DE",
    unit: "activityHeatmap.unit.post",
    color: "#4f46e5",
  },
  parameters: {
    docs: {
      description: {
        story:
          "German locale, custom indigo color and `post` unit. The tooltip switches between `Beitrag` and `Beiträge` based on the daily count.",
      },
    },
  },
};

export const CustomBlue: Story = {
  args: {
    ...Default.args,
    color: "#2563eb",
  },
  parameters: {
    docs: { description: { story: "Single base color → the component derives 4 intensity shades automatically." } },
  },
};

export const ExplicitScale: Story = {
  args: {
    ...Default.args,
    colorScale: ["#f3e8ff", "#e9d5ff", "#c084fc", "#9333ea", "#581c87"],
  },
  parameters: {
    docs: { description: { story: "Pass a fully explicit 5-step color scale via `colorScale`." } },
  },
};

export const ManualThresholds: Story = {
  args: {
    ...Default.args,
    levels: [1, 5, 10, 20],
  },
  parameters: {
    docs: { description: { story: "Override the auto-computed quartile thresholds with `levels`." } },
  },
};

export const MondayStart: Story = {
  args: {
    ...Default.args,
    firstDayOfWeek: 1,
    language: "FR",
  },
  parameters: {
    docs: {
      description: {
        story:
          "European-style week starting on Monday (`firstDayOfWeek={1}`). Weekday labels shift accordingly: `Mar`, `Jeu`, `Sam` are highlighted instead of `Lun`, `Mer`, `Ven`.",
      },
    },
  },
};

export const DenseSixMonths: Story = {
  args: {
    data: buildSampleData(FIXED_END, 180, 7, 0.85, 20),
    endDate: FIXED_END,
    weeks: 27,
    cellSize: 14,
    cellGap: 4,
    language: "EN",
    color: "#10b981",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A denser, larger 6-month variant — handy on dashboards where you want the cells to be more readable than the standard 11px size.",
      },
    },
  },
};

export const CustomUnit: Story = {
  render: (args) => (
    <ActivityHeatmap
      {...args}
      unit="activityHeatmap.unit.upload_review"
      translations={{
        "activityHeatmap.unit.upload_review": {
          EN: "review",
          FR: "relecture",
          ES: "revisión",
          IT: "revisione",
          DE: "Überprüfung",
        },
        "activityHeatmap.unit.upload_review_plural": {
          EN: "reviews",
          FR: "relectures",
          ES: "revisiones",
          IT: "revisioni",
          DE: "Überprüfungen",
        },
      }}
    />
  ),
  args: {
    data: SAMPLE,
    endDate: FIXED_END,
    color: "#f97316",
    legend: "activityHeatmap.legendReviews",
    language: "FR",
    translations: {
      "activityHeatmap.legendReviews": {
        EN: "Learn how reviews are counted",
        FR: "Comment les relectures sont comptées",
        ES: "Cómo se cuentan las revisiones",
        IT: "Come vengono contate le revisioni",
        DE: "So werden Überprüfungen gezählt",
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Custom unit and legend with locale-aware singular / plural forms via the `_plural` key suffix.",
      },
    },
  },
};

export const AllLanguages: Story = {
  render: () => (
    <VStack gap={8}>
      {(["EN", "FR", "ES", "IT", "DE"] as const).map((lng) => (
        <VStack key={lng} gap={2}>
          <h3 className="text-sm font-medium">{lng}</h3>
          <ActivityHeatmap data={SAMPLE} endDate={FIXED_END} language={lng} legendHref="#" />
        </VStack>
      ))}
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison of the five built-in locales. Hover any cell to see the localized tooltip and date format.",
      },
    },
  },
};

export const InTranslationProvider: Story = {
  render: () => (
    <TranslationProvider initialLanguage={{ code: "IT", name: "Italiano" }}>
      <VStack gap={4}>
        <p className="text-xs text-grey-stronger">
          Wrapped in a <code>TranslationProvider</code> with <code>IT</code> — no <code>language</code> prop on the component.
        </p>
        <ActivityHeatmap data={SAMPLE} endDate={FIXED_END} legendHref="#" />
      </VStack>
    </TranslationProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "When the heatmap lives inside a `TranslationProvider`, it follows the global language automatically. The `language` prop, when set, overrides the provider.",
      },
    },
  },
};

export const WithoutDecorations: Story = {
  args: {
    data: SAMPLE,
    endDate: FIXED_END,
    showMonths: false,
    showWeekdays: false,
    showLegend: false,
    showScale: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Bare grid — month, weekday, legend and scale are all hidden. Useful inside compact widgets where the surrounding UI provides the context.",
      },
    },
  },
};

export const VariantsRow: Story = {
  render: () => (
    <VStack gap={6}>
      <HStack gap={6} align="start">
        <VStack gap={2}>
          <h4 className="text-xs font-medium">Green (default)</h4>
          <ActivityHeatmap data={SAMPLE} endDate={FIXED_END} language="EN" legendHref="#" />
        </VStack>
      </HStack>
      <HStack gap={6} align="start">
        <VStack gap={2}>
          <h4 className="text-xs font-medium">Blue</h4>
          <ActivityHeatmap data={SAMPLE} endDate={FIXED_END} color="#2563eb" language="EN" legendHref="#" />
        </VStack>
      </HStack>
      <HStack gap={6} align="start">
        <VStack gap={2}>
          <h4 className="text-xs font-medium">Pink</h4>
          <ActivityHeatmap data={SAMPLE} endDate={FIXED_END} color="#ec4899" language="EN" legendHref="#" />
        </VStack>
      </HStack>
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Three palettes from a single base color. Same data, three different `color` values — the four active intensity steps are derived automatically.",
      },
    },
  },
};
