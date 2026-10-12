import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { PageFillLayout } from "./PageFillLayout";
import { TabsWithViews } from "@/components/ui/tabs-with-views";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { NATIVE_SCROLL_ATTRIBUTE } from "@/hooks/usePageFirstScroll";

const meta: Meta<typeof PageFillLayout> = {
  title: "Layout/PageFillLayout",
  component: PageFillLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Page layout with a **collapsible top part** and a **panel that fills the screen**:

\`\`\`
┌──────────────────────────────┐
│ App header (sticky top-0)     │  outside the component
├──────────────────────────────┤
│ collapsible (KPIs, activity…) │  scrolls with the page and folds away
├──────────────────────────────┤
│ panel: tabs + content         │  height = window − stickyTop − stickyBottom;
│ (content scrolls INSIDE)      │  once folded, it sits right under the header
└──────────────────────────────┘
\`\`\`

\`\`\`tsx
const headerRef = useRef<HTMLDivElement>(null);

<PageHeader ref={headerRef} className="sticky top-0 z-10" title="Home" />
<PageFillLayout stickyTop={headerRef} hidePageScrollbar collapsible={<Kpis />}>
  <TabsWithViews fillHeight {...tabs}>
    <div className="flex-1 min-h-0 overflow-y-auto">…</div>
  </TabsWithViews>
</PageFillLayout>
\`\`\`

- **Panel height**: \`--page-panel-height\` on the root, \`max(minPanelHeight, 100dvh − stickyTop − stickyBottom)\`.
  \`stickyTop\` / \`stickyBottom\` accept a number (px), a CSS value (\`"var(--app-header-height)"\`) or a
  ref of an element to measure (e.g. \`PageHeader\`, which forwards its ref).
- **\`pageFirstScroll\`** (default true): mouse wheel down over the panel scrolls the **page** first, until
  the collapsible part is folded, then the panel content scrolls. Wheel up is native (the content scrolls
  back to its top, then the page brings the top part back). Exclude a zone with \`data-native-scroll\`.
- **\`hidePageScrollbar\`** (default false): hides the window scrollbar, which doubles the content's one.
  Scrolling still works (wheel, trackpad, keyboard).
- **\`onCollapsedChange\`**: the collapsible part is fully folded / visible again (e.g. compact title in the header).
- **\`TabsWithViews fillHeight\`**: the tab bar keeps its height, the content takes the rest in a
  \`flex-1 min-h-0\` column; each tab chooses its own scrolling (\`overflow-y-auto\`, \`overflow-hidden\`…).
- \`usePageFirstScroll(ref, options)\` is exported for pages that cannot use the component.

**Scrolling element:** by default the **window** scrolls — no ancestor with \`overflow\` or a fixed height (the
root of the component sets none). Inside a **scroll container** (e.g. the body of a \`FullFrame\`, which provides
it through \`ScrollContainerProvider\`), the component uses that container automatically: the panel height is the
container's visible height minus its bottom padding (\`100cqh\`, the container has \`container-type: size\`), the
folded panel sits against the top of the container, and the wheel, \`onCollapsedChange\` and
\`hidePageScrollbar\` act on the container. \`scrollContainer={ref}\` sets it explicitly, \`scrollContainer={null}\`
forces the window. See *Layout/FullFrame → Project wizard*.

**Known limits:** touch scrolling scrolls the content first (the top part only folds when swiping outside
the panel); keyboard is not handled; a content with \`overscroll-behavior: contain\` prevents wheel-up from
bringing the top part back.
`,
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

// --- Demo building blocks --------------------------------------------------------

const FakeHeader = React.forwardRef<HTMLDivElement, { title: string }>(({ title }, ref) => (
  <div ref={ref} className="sticky top-0 z-10 flex h-[60px] items-center border-b border-grey-strong bg-white px-4 text-sm font-medium">
    {title}
  </div>
));
FakeHeader.displayName = "FakeHeader";

const Kpis = () => (
  <div className="flex flex-col gap-4 pb-6">
    <h2 className="m-0 text-xl">Welcome back</h2>
    <div className="grid grid-cols-3 gap-4">
      {["Projects", "Pictures", "To validate"].map((label, i) => (
        <div key={label} className="rounded-sm bg-white p-4">
          <div className="text-xs opacity-70">{label}</div>
          <div className="text-2xl font-bold">{[24, 1830, 57][i]}</div>
        </div>
      ))}
    </div>
    <div className="h-40 rounded-sm bg-white p-4 text-sm opacity-80">Activity block</div>
  </div>
);

const ROWS = Array.from({ length: 80 }, (_, i) => ({ id: i + 1, name: `Project ${i + 1}`, pictures: (i * 37) % 400 }));

const ProjectsTable = () => {
  const [page, setPage] = React.useState(1);
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="min-h-0 flex-1 overflow-y-auto rounded-sm bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {["#", "Project", "Pictures"].map((h) => (
                <th key={h} className="sticky top-0 bg-grey-lighter px-3 py-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.id} className="border-t border-grey-light">
                <td className="px-3 py-2">{row.id}</td>
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2">{row.pictures}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={4} onPageChange={setPage} size="small" className="w-auto shrink-0" />
    </div>
  );
};

const Column = ({ label, count }: { label: string; count: number }) => (
  <div className="min-h-0 overflow-y-auto rounded-sm bg-white p-3 text-sm">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="border-b border-grey-light py-2">{label} {i + 1}</div>
    ))}
  </div>
);

const HomeTabs = () => {
  const [activeTab, setActiveTab] = React.useState("projects");
  return (
    <TabsWithViews
      fillHeight
      fixedTabs={[
        { id: "projects", label: "Projects", count: 80 },
        { id: "deposits", label: "Deposits" },
        { id: "suppliers", label: "Suppliers" },
      ]}
      views={[]}
      activeTab={activeTab}
      onActiveTabChange={setActiveTab}
      onCreateView={() => {}}
      onRenameView={() => {}}
      onDeleteView={() => {}}
    >
      <div className={cn("flex min-h-0 flex-1 flex-col pt-4", activeTab !== "projects" && "hidden")}>
        <ProjectsTable />
      </div>
      <div className={cn("grid min-h-0 flex-1 grid-cols-2 gap-4 overflow-hidden pt-4", activeTab !== "deposits" && "hidden")}>
        <Column label="Folder" count={40} />
        <Column label="File" count={120} />
      </div>
      <div className={cn("min-h-0 flex-1 overflow-y-auto pt-4", activeTab !== "suppliers" && "hidden")}>
        <Column label="Supplier" count={60} />
      </div>
    </TabsWithViews>
  );
};

// --- Stories --------------------------------------------------------------------

/**
 * Home page: sticky header, collapsible KPIs and activity, then `TabsWithViews fillHeight` (a table of
 * 80 rows with sticky headers and pagination, two independent columns, a simple list).
 * **Try it:** put the mouse over the table and scroll down — the top part folds first, then the table
 * scrolls. Scroll up: the table goes back to its top, then the top part comes back.
 */
export const Home: Story = {
  render: () => {
    const Page = () => {
      const headerRef = React.useRef<HTMLDivElement>(null);
      return (
        <div className="flex min-h-screen flex-col">
          <FakeHeader ref={headerRef} title="Application header (sticky)" />
          <PageFillLayout stickyTop={headerRef} hidePageScrollbar className="flex-1 px-4 pt-6" panelClassName="pb-4" collapsible={<Kpis />}>
            <HomeTabs />
          </PageFillLayout>
        </div>
      );
    };
    return <Page />;
  },
};

/** Without collapsible part: the panel simply fills the screen under the header (e.g. a file browser). */
export const WithoutCollapsible: Story = {
  name: "Without top",
  render: () => (
    <div className="flex min-h-screen flex-col">
      <FakeHeader title="Drive" />
      <PageFillLayout stickyTop={60} pageFirstScroll={false} className="flex-1 p-4">
        <div className="grid min-h-0 flex-1 grid-cols-[240px_1fr] gap-4">
          <Column label="Folder" count={30} />
          <Column label="File" count={200} />
        </div>
      </PageFillLayout>
    </div>
  ),
};

/** `onCollapsedChange`: the header shows a compact title once the top part is folded. */
export const CollapsedCallback: Story = {
  render: () => {
    const Page = () => {
      const [collapsed, setCollapsed] = React.useState(false);
      return (
        <div className="flex min-h-screen flex-col">
          <FakeHeader title={collapsed ? "Hello, Marie — 57 pictures to validate" : "Application header"} />
          <PageFillLayout stickyTop={60} onCollapsedChange={setCollapsed} className="flex-1 px-4 pt-6" panelClassName="pb-4" collapsible={<Kpis />}>
            <HomeTabs />
          </PageFillLayout>
        </div>
      );
    };
    return <Page />;
  },
};

/**
 * A zone marked `data-native-scroll` keeps its own scrolling: wheel over the grey list scrolls it right
 * away, even while the top part is visible. Elsewhere in the panel, the page scrolls first.
 */
export const NativeScrollZone: Story = {
  render: () => (
    <div className="flex min-h-screen flex-col">
      <FakeHeader title="Native scroll zone" />
      <PageFillLayout stickyTop={60} className="flex-1 px-4 pt-6" panelClassName="pb-4" collapsible={<Kpis />}>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
          <div {...{ [NATIVE_SCROLL_ATTRIBUTE]: "" }} className="min-h-0 overflow-y-auto rounded-sm bg-grey-strong p-3 text-sm">
            <div className="pb-2 font-medium">data-native-scroll: scrolls immediately</div>
            {Array.from({ length: 80 }, (_, i) => (
              <div key={i} className="py-1">Native item {i + 1}</div>
            ))}
          </div>
          <Column label="Page-first item" count={80} />
        </div>
      </PageFillLayout>
    </div>
  ),
};
