import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import PageWelcome from "./index";
import { Layout, VStack } from "@/components/layout";
import { TranslationProvider, useTranslationSafe } from "@/contexts/TranslationContext";

const meta: Meta<typeof PageWelcome> = {
  title: "Components/PageWelcome",
  component: PageWelcome,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Welcome banner for a homepage / dashboard. Renders a small **eyebrow**, a personalized **greeting** ("\`{greeting}, {userName}.\`") and a free-form **subtitle** slot.

## When to use it

- On a homepage, just under the global \`PageHeader\`, to greet the signed-in user and surface a few high-level stats.
- As an opening block on any tab where context matters more than action ("Welcome to the project view…").

## Anatomy

- **Eyebrow** — small, uppercase, tracked label ("HOME"). Optional. Defaults to a localized translation; pass an empty string to hide.
- **Greeting + name** — \`h1\` like "\`Bonjour, Pierre.\`". The greeting word is auto-derived from the local time of day and the active language; pass \`greeting\` to override.
- **Subtitle** — \`ReactNode\`. The component does **not** localize it; the consumer is expected to assemble localized strings (with pluralization) and pass them in.

## Internationalization

Same convention as \`FileBrowser\` / \`ActivityHeatmap\`:

\`\`\`tsx
// Inside a TranslationProvider (FR / EN / ES / IT / DE).
<PageWelcome userName="Pierre" subtitle={<>10 projects · 2 new files</>} />

// Or set inline (overrides the provider).
<PageWelcome userName="Pierre" language="DE" subtitle="..." />
\`\`\`

The auto-greeting picks one of three buckets based on \`new Date().getHours()\`:

| Period       | Hours        | EN              | FR        | ES               | IT                 | DE             |
|--------------|--------------|-----------------|-----------|------------------|--------------------|----------------|
| morning      | 0:00–11:59   | Good morning    | Bonjour   | Buenos días      | Buongiorno         | Guten Morgen   |
| afternoon    | 12:00–17:59  | Good afternoon  | Bonjour   | Buenas tardes    | Buon pomeriggio    | Guten Tag      |
| evening      | 18:00–23:59  | Good evening    | Bonsoir   | Buenas noches    | Buonasera          | Guten Abend    |

For testing, pass a fixed \`now\` Date.

## Localizing the subtitle (responsibility model)

The subtitle is intentionally a \`ReactNode\` — full flexibility for icons, links, custom layout. **The caller owns translation and pluralization.** Use the existing \`t()\` helper which already handles the \`_plural\` convention:

\`\`\`tsx
const { t } = useTranslationSafe(translations, language);

<PageWelcome
  userName="Pierre"
  subtitle={
    <>
      {t("home.projectsTracked", { count: 10 })}
      {" · "}
      {t("home.filesReceivedToday", { count: 2 })}
    </>
  }
/>
\`\`\`

…with the matching keys in your project's translation map:

\`\`\`ts
"home.projectsTracked":         { EN: "{count} project tracked",  FR: "{count} projet en suivi",   ... }
"home.projectsTracked_plural":  { EN: "{count} projects tracked", FR: "{count} projets en suivi",  ... }
"home.filesReceivedToday":         { EN: "{count} new file received today", FR: "{count} nouveau fichier reçu aujourd'hui", ... }
"home.filesReceivedToday_plural":  { EN: "{count} new files received today", FR: "{count} nouveaux fichiers reçus aujourd'hui", ... }
\`\`\`

If you need richer markup (links, badges, icons inline), just put it inside the \`<>…</>\` — the component renders the node verbatim.`,
      },
    },
  },
  argTypes: {
    userName: {
      control: "text",
      description: "First name shown after the greeting (e.g. `Pierre`). Required.",
    },
    eyebrow: {
      control: "text",
      description:
        "Small uppercase label above the heading. Defaults to the localized `pageWelcome.defaultEyebrow` key (e.g. `HOME` / `ACCUEIL`). Pass an empty string to hide.",
    },
    greeting: {
      control: "text",
      description:
        "Greeting word(s) prefixed to the user name. If omitted, the component picks a time-of-day greeting from `pageWelcome.greeting.{morning|afternoon|evening}` localized via the active language.",
    },
    subtitle: {
      control: false,
      description:
        "Free-form `ReactNode` rendered below the greeting. Translation and pluralization are the caller's responsibility.",
    },
    now: {
      control: "date",
      description:
        "Fixed date used to derive the auto-greeting. Mostly useful for tests / Storybook so the rendered output is deterministic.",
    },
    language: {
      control: "text",
      description:
        "Custom language code (e.g., 'FR', 'EN', 'ES', 'IT', 'DE'). If not provided, uses TranslationProvider language or 'EN' by default.",
    },
    translations: {
      control: false,
      description:
        "Custom translations to merge over the defaults (overrides `pageWelcome.*` keys, or adds new ones).",
    },
    className: {
      control: "text",
      description: "Additional Tailwind classes appended to the root.",
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Layout bg="white" padding={8}>
        <Story />
      </Layout>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PageWelcome>;

const MORNING = new Date("2026-05-01T09:00:00");
const AFTERNOON = new Date("2026-05-01T15:00:00");
const EVENING = new Date("2026-05-01T20:00:00");

export const Default: Story = {
  args: {
    userName: "Pierre",
    now: MORNING,
    language: "FR",
    subtitle: "10 projets en suivi · 2 nouveaux fichiers reçus aujourd'hui de vos fournisseurs.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Reproduction of the home-page mock: French locale, morning greeting, plain-string subtitle. The subtitle is hand-built by the consumer (no auto-pluralization at the component level).",
      },
    },
  },
};

export const English: Story = {
  args: {
    userName: "Pierre",
    now: AFTERNOON,
    language: "EN",
    subtitle: "10 projects tracked · 2 new files received today from your suppliers.",
  },
};

export const German: Story = {
  args: {
    userName: "Pierre",
    now: EVENING,
    language: "DE",
    subtitle: "10 verfolgte Projekte · 2 heute erhaltene neue Dateien von Ihren Lieferanten.",
  },
};

export const NoEyebrow: Story = {
  args: {
    userName: "Pierre",
    eyebrow: "",
    now: MORNING,
    language: "FR",
    subtitle: "Aucun nouveau fichier aujourd'hui.",
  },
  parameters: {
    docs: {
      description: {
        story: "Pass an empty string to `eyebrow` to hide the overline entirely.",
      },
    },
  },
};

export const CustomEyebrow: Story = {
  args: {
    userName: "Pierre",
    eyebrow: "DASHBOARD",
    now: AFTERNOON,
    language: "EN",
    subtitle: "All systems nominal.",
  },
};

export const ExplicitGreeting: Story = {
  args: {
    userName: "Pierre",
    greeting: "Hey",
    language: "EN",
    subtitle: "Welcome back — you have unfinished business.",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `greeting` to override the auto-derived time-of-day greeting (here: a casual `Hey` regardless of the hour).",
      },
    },
  },
};

export const TimeOfDayBuckets: Story = {
  render: () => (
    <VStack gap={8}>
      {([
        ["Morning (09:00)", MORNING],
        ["Afternoon (15:00)", AFTERNOON],
        ["Evening (20:00)", EVENING],
      ] as const).map(([label, when]) => (
        <VStack key={label} gap={2}>
          <p className="text-xs uppercase tracking-wider text-grey-strongest">{label}</p>
          <PageWelcome
            userName="Pierre"
            now={when}
            language="FR"
            subtitle="10 projets en suivi · 2 nouveaux fichiers reçus aujourd'hui."
          />
        </VStack>
      ))}
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Same data, three different times of day — note the FR locale collapses morning + afternoon into `Bonjour` while EN/ES/IT/DE distinguish all three.",
      },
    },
  },
};

export const AllLanguages: Story = {
  render: () => (
    <VStack gap={8}>
      {(["EN", "FR", "ES", "IT", "DE"] as const).map((lng) => (
        <VStack key={lng} gap={2}>
          <p className="text-xs uppercase tracking-wider text-grey-strongest">{lng}</p>
          <PageWelcome
            userName="Pierre"
            now={MORNING}
            language={lng}
            subtitle="10 projects · 2 new files today"
          />
        </VStack>
      ))}
    </VStack>
  ),
};

const SubtitleWithLocalizedPlurals: React.FC<{
  language: string;
  projectCount: number;
  fileCount: number;
}> = ({ language, projectCount, fileCount }) => {
  const { t } = useTranslationSafe(
    {
      "home.projectsTracked": {
        EN: "{count} project tracked",
        FR: "{count} projet en suivi",
        ES: "{count} proyecto seguido",
        IT: "{count} progetto monitorato",
        DE: "{count} verfolgtes Projekt",
      },
      "home.projectsTracked_plural": {
        EN: "{count} projects tracked",
        FR: "{count} projets en suivi",
        ES: "{count} proyectos seguidos",
        IT: "{count} progetti monitorati",
        DE: "{count} verfolgte Projekte",
      },
      "home.filesReceivedToday": {
        EN: "{count} new file received today from your suppliers",
        FR: "{count} nouveau fichier reçu aujourd'hui de vos fournisseurs",
        ES: "{count} nuevo archivo recibido hoy de sus proveedores",
        IT: "{count} nuovo file ricevuto oggi dai vostri fornitori",
        DE: "{count} neue Datei heute von Ihren Lieferanten erhalten",
      },
      "home.filesReceivedToday_plural": {
        EN: "{count} new files received today from your suppliers",
        FR: "{count} nouveaux fichiers reçus aujourd'hui de vos fournisseurs",
        ES: "{count} nuevos archivos recibidos hoy de sus proveedores",
        IT: "{count} nuovi file ricevuti oggi dai vostri fornitori",
        DE: "{count} neue Dateien heute von Ihren Lieferanten erhalten",
      },
    },
    language,
  );

  return (
    <>
      {t("home.projectsTracked", { count: projectCount })}
      {" · "}
      {t("home.filesReceivedToday", { count: fileCount })}
    </>
  );
};

export const SubtitleWithPluralization: Story = {
  render: () => (
    <VStack gap={8}>
      {([
        ["FR · counts (10, 2)", "FR", 10, 2],
        ["FR · counts (1, 1) — singular", "FR", 1, 1],
        ["FR · counts (0, 0)", "FR", 0, 0],
        ["EN · counts (10, 2)", "EN", 10, 2],
        ["EN · counts (1, 1) — singular", "EN", 1, 1],
      ] as const).map(([label, lng, projects, files]) => (
        <VStack key={label} gap={2}>
          <p className="text-xs uppercase tracking-wider text-grey-strongest">{label}</p>
          <PageWelcome
            userName="Pierre"
            now={MORNING}
            language={lng}
            subtitle={
              <SubtitleWithLocalizedPlurals language={lng} projectCount={projects} fileCount={files} />
            }
          />
        </VStack>
      ))}
    </VStack>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Real-world recipe for a localized, pluralized subtitle. The consumer defines its own translation keys with the `_plural` suffix, calls `t(key, { count })` for each segment, and joins them with the separator of its choice. The component itself stays unaware of the content.",
      },
    },
  },
};

export const InTranslationProvider: Story = {
  render: () => (
    <TranslationProvider initialLanguage={{ code: "IT", name: "Italiano" }}>
      <PageWelcome
        userName="Pierre"
        now={MORNING}
        subtitle="10 progetti monitorati · 2 nuovi file ricevuti oggi"
      />
    </TranslationProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Wrapped in a `TranslationProvider` with `IT` — no `language` prop on the component, the provider drives the locale.",
      },
    },
  },
};

export const RichSubtitle: Story = {
  args: {
    userName: "Pierre",
    now: MORNING,
    language: "EN",
    subtitle: (
      <>
        <strong className="text-black">10 projects</strong> tracked ·{" "}
        <a href="#" className="text-blue-primary hover:underline">
          2 new files
        </a>{" "}
        received today.
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Because `subtitle` is a `ReactNode`, you can mix bold text, links, badges, icons — anything React can render.",
      },
    },
  },
};
