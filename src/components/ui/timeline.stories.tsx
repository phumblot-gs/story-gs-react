import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline, type TimelineItem } from "./timeline";
import { Layout } from "@/components/layout";
import { Card } from "./card";

const items: TimelineItem[] = [
  { id: "a", timestamp: "2026-09-14T23:01:00.000Z", title: "FOUR1", description: "100 files" },
  { id: "b", timestamp: "2026-09-14T21:46:00.000Z", title: "FOUR1", description: "3 files" },
  { id: "c", timestamp: "2026-09-14T21:01:00.000Z", title: "FOUR_A", description: "3 files" },
  { id: "d", timestamp: "2026-09-14T20:46:00.000Z", title: "FOUR_A", description: "4 files" },
  { id: "e", timestamp: "2026-09-08T07:01:00.000Z", title: "FOUR1", description: "5 files" },
  { id: "f", timestamp: "2026-09-08T05:31:00.000Z", title: "TEST STAGING", description: "12 files" },
];
const meta = {
  title: "UI/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: { layout: "padded", docs: { description: { component: `A grouped chronological list with optional single selection. Use it for uploads, activity history, or other events. The surrounding Card and the detail view remain separate components.

### Appearance and background
Entries are rectangular, without a border or rounded corners. They reuse Button's **ghost** variant and **hasActiveElement** state. Layout and Card provide the background context automatically. With no provider, Timeline uses white.

| State | White / grey background | Black background |
| --- | --- | --- |
| Rest | Same background, dark text | Black background, white text |
| Hover | Black background, white text | White background, dark text |
| Pressed (unselected) | Black background, light-blue text | Secondary black background, light-blue text |
| Selected | Black background, light-blue text | Light-blue background, dark text |

Keyboard focus and disabled colors are inherited from Button. The selected marker and chevron provide additional visual cues. Background means the immediate container: a filled Card on a grey Layout provides a white context to its children.

### Uncontrolled selection
Use defaultSelectedId to choose the initial selection. Omit it to start without a selection. Clicking the current entry keeps it selected and does not fire another callback.

\`\`\`tsx
import { Timeline, Layout } from '@gs/gs-components-library';

<Layout bg="white">
  <Timeline items={items} defaultSelectedId="a"
    onSelectionChange={(id, item) => console.log(id, item)} />
</Layout>
\`\`\`

### Controlled selection and external details
Pass selectedId and onSelectionChange. Use null for a controlled empty selection; undefined enables internal state. The callback requests a selection, and the parent must update selectedId. Selection is independent of loading the detail view. Fetch and cache details in the application, keyed by item ID.

\`\`\`tsx
const [selectedId, setSelectedId] = useState<string | null>(null);
<Timeline items={items} language="EN" timeZone="Europe/Paris" selectedId={selectedId}
  onSelectionChange={id => setSelectedId(id)} />
\`\`\`

### Data and composition
Pass a flat items array. Timeline converts each timestamp to the target timezone, sorts newest first and groups by local calendar day. Equal timestamps retain input order. Source objects are not modified; callbacks receive the original item. Missing items do not clear selection.

### Timestamp data example

\`\`\`tsx
import { Timeline, type TimelineItem } from '@gs/gs-components-library';

const items: TimelineItem[] = [
  {
    id: 'upload-1',
    timestamp: '2026-09-16T15:00:54.037Z',
    title: 'Studio North',
    description: '100 files',
  },
  {
    id: 'upload-2',
    timestamp: '2026-09-16T23:30:00.000Z',
    title: 'Studio South',
    description: '3 files',
  },
];

<Timeline items={items} language="FR" timeZone="Europe/Paris" />
\`\`\`

The first entry appears on September 16 at **17:00** in Paris. The second appears on **September 17 at 01:30** in Paris, but on **September 16 at 19:30** in New York. Grouping therefore changes with the timezone. The input array does not need to be pre-grouped or sorted.

### Language and timezone
- language accepts EN, FR, ES, IT and DE (case-insensitive). It overrides TranslationProvider; without either, English is used. Unknown language codes fall back to English.
- timeZone accepts an IANA identifier such as Europe/Paris, America/New_York or UTC. Omit it to use the browser's configured timezone, not a geolocation lookup. Language and timezone are independent.
- Dates use localized weekday, day, month and year. Hours use a consistent 24-hour HH:mm display. Seconds and milliseconds remain in the original timestamp; the native time tooltip includes seconds and the timezone abbreviation, useful during repeated daylight-saving hours.
- Intl.DateTimeFormat handles summer/winter offsets for the event date. No manual offset arithmetic is required.
- Titles, descriptions and emptyContent are application-owned and are not translated automatically. Today and Yesterday headings are localized automatically, with the full date underneath. Both the current day and event day are calculated in the display timezone. Other days show the full date. Relative headings refresh every minute and when the page regains focus or visibility.
- Invalid timestamps or timezone identifiers raise RangeError. Supply real UTC calendar dates with seconds and a trailing uppercase Z; milliseconds are optional (1–3 digits). Offsets such as +02:00, dates without Z and impossible dates are rejected.
- For server rendering, pass the same explicit timeZone and language on server and client to avoid timezone-dependent hydration differences. To use a detected user timezone, resolve it on the client before rendering or provide the user's saved preference.

\`\`\`tsx
// Browser timezone, French date labels:
<Timeline items={items} language="FR" />

// Same instant and French labels, displayed in New York:
<Timeline items={items} language="FR" timeZone="America/New_York" />

// Inherit the active TranslationProvider language:
<Timeline items={items} timeZone="Europe/Paris" />
\`\`\`

Use title and description for inline React content, or renderItem(item, { selected, disabled }) for a custom inline layout. Do not nest buttons, links or form fields in interactive entries. Custom content should inherit its text color to preserve hover and selection contrast.

### Accessibility and other states
Entries are native buttons: Tab moves between enabled entries, Enter or Space selects one. aria-pressed exposes selection; accessible names include the group and time. Disabled items remain visible and cannot be selected. Set selectable={false} for a read-only history with no buttons or selection. Supply emptyContent for an empty list. Use density="comfortable" for more vertical spacing.
` } } },
  args: { items, defaultSelectedId: "a", language: "EN", timeZone: "Europe/Paris" },
  argTypes: {
    items: { control: false, description: "Flat entries with unique IDs and UTC timestamps ending in Z." },
    language: { control: "select", options: ["EN", "FR", "ES", "IT", "DE"], description: "Overrides the TranslationProvider language." },
    timeZone: { control: "text", description: "IANA timezone. Omit for the browser timezone." },
    selectedId: { control: false, description: "Controlled selection. null means no selection." },
    defaultSelectedId: { control: "text", description: "Initial uncontrolled selection." },
    onSelectionChange: { control: false, description: "Called with (id, item) when requesting a different selection." },
    selectable: { control: "boolean", description: "Enable selection, or render a read-only history." },
    disabled: { control: "boolean", description: "Disable every interactive entry." },
    density: { control: "select", options: ["compact", "comfortable"] },
    renderItem: { control: false }, emptyContent: { control: false },
  },
} satisfies Meta<typeof Timeline>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WhiteBackground: Story = {
  render: args => <Layout bg="white" padding={6} className="max-w-sm"><Timeline {...args} /></Layout>,
};
export const GreyBackground: Story = {
  render: args => <Layout bg="grey" padding={6} className="max-w-sm"><Timeline {...args} /></Layout>,
};
export const BlackBackground: Story = {
  render: args => <Layout bg="black" padding={6} className="max-w-sm"><Timeline {...args} /></Layout>,
};
export const AllBackgrounds: Story = {
  render: args => <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{(["white", "grey", "black"] as const).map(bg =>
    <Layout key={bg} bg={bg} padding={6}><h2 className="mb-6 capitalize" style={{ color: bg === "black" ? "var(--color-white)" : "var(--color-black)" }}>{bg} background</h2><Timeline {...args} /></Layout>)}</div>,
};

function ControlledExample() {
  const [selectedId, setSelectedId] = useState<string | null>("a");
  const selected = items.find(item => item.id === selectedId);
  return <Layout bg="grey" padding={6} className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
    <Card><h2>Recent uploads</h2><Timeline items={items} language="EN" timeZone="Europe/Paris" selectedId={selectedId} onSelectionChange={id => setSelectedId(id)} /></Card>
    <Card><section aria-live="polite"><h2>{selected?.title ?? "Select an upload"}</h2>
      {selected && <><p className="mt-2 mb-6">{selected.description}</p>
        <h3>Files in this upload</h3><ul>{Array.from({ length: 3 }, (_, i) => <li key={i} className="py-4 border-b">{selected.id}_image_{i + 1}.jpg</li>)}</ul>
        <p className="mt-4 text-sm">Illustrative file preview.</p></>}
    </section></Card>
  </Layout>;
}
export const ControlledSelection: Story = {
  render: () => <ControlledExample />,
  parameters: { docs: { description: { story: "The parent controls selection and displays external details. The Timeline inherits a white background from the filled Card on a grey Layout." } } },
};
export const Comfortable: Story = { ...WhiteBackground, args: { density: "comfortable" } };
export const DisabledEntries: Story = {
  ...WhiteBackground,
  args: { items: items.map(item => ({ ...item, disabled: item.id === "c" })) },
  parameters: { docs: { description: { story: "The 23:01 entry is unavailable. Disabled entries cannot be selected by pointer or keyboard." } } },
};
export const ReadOnly: Story = { ...WhiteBackground, args: { selectable: false } };
export const Empty: Story = { ...WhiteBackground, args: { items: [], emptyContent: <p>No activity yet.</p> } };
export const CustomContent: Story = {
  ...WhiteBackground,
  args: { renderItem: (item, { selected }) => <><span className="block">{item.title} {selected ? "· Viewing" : ""}</span><span className="block text-xs">{item.description}</span></> },
};

const midnightItems: TimelineItem[] = [
  { id: "day", timestamp: "2026-09-16T15:00:54.037Z", title: "Studio North", description: "100 files" },
  { id: "midnight", timestamp: "2026-09-16T23:30:00.000Z", title: "Studio South", description: "3 files" },
];
export const TimezoneComparison: Story = {
  args: { items: midnightItems, defaultSelectedId: "midnight" },
  render: args => <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{["UTC", "Europe/Paris", "America/New_York"].map(timeZone =>
    <Layout key={timeZone} bg="grey" padding={6}><h2 className="mb-6">{timeZone}</h2><Timeline {...args} timeZone={timeZone} /></Layout>)}</div>,
  parameters: { docs: { description: { story: "Identical UTC inputs, three display timezones. Studio South crosses midnight in Paris and is grouped on September 17. In UTC and New York, both entries belong to September 16. Input: 2026-09-16T15:00:54.037Z and 2026-09-16T23:30:00.000Z." } } },
};
export const AllLanguages: Story = {
  args: { items: midnightItems },
  render: args => <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{["EN", "FR", "ES", "IT", "DE"].map(language =>
    <Layout key={language} bg="grey" padding={6}><h2 className="mb-6">{language} · Europe/Paris</h2><Timeline {...args} language={language} timeZone="Europe/Paris" /></Layout>)}</div>,
  parameters: { docs: { description: { story: "Only generated dates and hours are localized. The application-owned titles and descriptions remain unchanged." } } },
};
export const BrowserTimezone: Story = {
  ...WhiteBackground, args: { items: midnightItems, timeZone: undefined },
  parameters: { docs: { description: { story: "No timeZone is passed: dates and groups follow the browser's configured timezone. language remains EN, independent of the timezone." } } },
};
export const DaylightSaving: Story = {
  ...WhiteBackground,
  args: { timeZone: "Europe/Paris", items: [
    { id: "winter", timestamp: "2026-01-16T15:00:00.000Z", title: "Winter upload", description: "15:00 UTC → 16:00 in Paris" },
    { id: "summer", timestamp: "2026-07-16T15:00:00.000Z", title: "Summer upload", description: "15:00 UTC → 17:00 in Paris" },
  ] },
  parameters: { docs: { description: { story: "The timezone offset is calculated for each event date. The input is intentionally unsorted; Timeline displays the most recent event first." } } },
};

export const TodayAndYesterday: Story = {
  render: args => {
    const now = new Date();
    const recentItems: TimelineItem[] = [
      { id: "today", timestamp: now.toISOString(), title: "Latest upload", description: "12 files" },
      { id: "yesterday", timestamp: new Date(now.getTime() - 86400000).toISOString(), title: "Previous upload", description: "5 files" },
      { id: "older", timestamp: new Date(now.getTime() - 3 * 86400000).toISOString(), title: "Earlier upload", description: "8 files" },
    ];
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{["EN", "FR", "ES", "IT", "DE"].map(language =>
      <Layout key={language} bg="grey" padding={6}><h2 className="mb-6">{language} · UTC</h2><Timeline {...args} items={recentItems} language={language} timeZone="UTC" defaultSelectedId="today" /></Layout>)}</div>;
  },
  parameters: { docs: { description: { story: "Live data generated with new Date().toISOString(). Today and Yesterday use the display timezone (UTC here) and keep the full date underneath. All five supported languages are shown. The older entry keeps its absolute date heading." } } },
};
