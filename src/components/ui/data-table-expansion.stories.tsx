import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type TableColumn, type DataTableSortState } from "./data-table";
import { Layout, ActionBarProvider } from "@/components/layout";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof DataTable> = {
  title: "UI/DataTable/Expansion",
  component: DataTable,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Expandable rows reveal full-width detail content beneath a main row. Details can contain text, a form, or another DataTable with its own columns. Without \`renderExpandedRow\`, the table behaves as before.

## API

| Prop | Purpose / default |
| --- | --- |
| \`renderExpandedRow(row)\` | Renders the detail content. |
| \`getRowCanExpand(row)\` | Enables expansion per row; all rows are eligible when a renderer is provided. |
| \`expandedIds\` | Controlled \`Set<string>\`, keyed by \`getRowId\`. |
| \`defaultExpandedIds\` | Initial uncontrolled expansion state; read only on mount. |
| \`onExpandedChange(ids)\` | Requests the next complete expansion state. |
| \`onRowExpand(row, expanded)\` | Reports the same request for the affected row. |
| \`expandOnRowClick\` | Defaults to \`false\`; when enabled, row clicks expand/collapse instead of calling \`onRowClick\`. |
| \`showExpandButton\` | Defaults to \`true\`; set to \`false\` when providing your own cell button. |

## Triggers and accessibility

An accessible chevron button is included by default. It supports keyboard activation and exposes \`aria-expanded\`.
Selection checkboxes and cells marked \`interactive: true\` never trigger row expansion. In row-click mode, embedded buttons, links and inputs are excluded too. Rows that cannot expand ignore row clicks in this mode. Without \`expandOnRowClick\`, \`onRowClick\` keeps its original behavior.

A custom \`cell(row, context)\` renderer receives \`isExpanded\`, \`canExpand\`, \`toggleExpanded\` and \`expandedContentId\` (for \`aria-controls\`). Existing single-argument \`cell(row)\` renderers remain compatible. Mark the custom button column \`interactive: true\` and expose \`aria-expanded\` on the button.

## Controlled and uncontrolled state

Without \`expandedIds\`, DataTable manages expansion internally. With this prop, the parent owns the display state: interactions emit both callbacks without mutating the supplied Set. Prop updates do not emit callbacks. For one open detail at a time, normalize the Set in \`onExpandedChange\`; see **Accordion**.

### Controlled example

\`\`\`tsx
const [expandedIds, setExpandedIds] = React.useState(new Set<string>());
<DataTable
  data={rows}
  columns={columns}
  getRowId={row => row.id}
  renderExpandedRow={row => <Detail id={row.id} />}
  expandedIds={expandedIds}
  onExpandedChange={setExpandedIds}
  onRowExpand={(row, expanded) => console.log(row.id, expanded)}
  expandOnRowClick
/>
\`\`\`

### Custom cell button

Use this column with \`showExpandButton={false}\` to replace the built-in chevron.

\`\`\`tsx
{
  id: "details",
  header: "Details",
  interactive: true,
  cell: (row, { isExpanded, canExpand, toggleExpanded, expandedContentId }) => (
    <Button
      onClick={toggleExpanded}
      disabled={!canExpand}
      aria-expanded={isExpanded}
      aria-controls={isExpanded ? expandedContentId : undefined}
    >
      {isExpanded ? "Hide" : "Show"}
    </Button>
  ),
}
\`\`\`

## Compatibility and lifecycle

- Sorting and pagination apply only to main rows. Details follow their stable row ID and do not count as additional paginated items.
- Selection and expansion are independent, including Shift-click and ActionBar. Nested tables have separate selection states.
- Expanded IDs are preserved when rows leave the current page or are filtered out. They take effect again when the rows return; the parent can clear them explicitly.
- Details mount only while visible. Collapsing, filtering or changing pages unmounts them. Preserve detail state in the parent or an external cache when needed; see **Nested Table**.
- Loading, errors, empty results and caching belong to the supplied detail component. **Async Content** demonstrates these states.
- Controlled state does not turn sorting or pagination into server-side operations.
- Avoid competing ActionBars when both the main and nested tables offer bulk actions.
`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Expansion examples deliberately use a generic model: details need not share
// the main row's schema, nor even be a table.
const expansionRows = [
  { id: "a", label: "Item A", expandable: true },
  { id: "b", label: "Item B", expandable: true },
  { id: "c", label: "Item C — no details", expandable: false },
  { id: "d", label: "Item D", expandable: true },
  { id: "e", label: "Item E", expandable: true },
];
type ExpansionRow = (typeof expansionRows)[number];
const expansionColumns: TableColumn<ExpansionRow>[] = [
  { id: "label", header: "Item", sortable: true, cell: row => row.label },
  { id: "id", header: "Reference", cell: row => row.id.toUpperCase() },
];
const expansionId = (row: ExpansionRow) => row.id;
const canExpand = (row: ExpansionRow) => row.expandable;
const renderDetail = (row: ExpansionRow) => <p>Details for {row.label}</p>;

export const ExpandOnRowClick: Story = {
  name: "Row Click",
  parameters: { docs: { description: { story: "Uncontrolled expansion: A starts expanded. Click a row or its chevron to toggle details. C cannot expand. Multiple rows can stay open. The latest onRowExpand request is displayed below the table." } } },
  render: function Example() {
    const [lastEvent, setLastEvent] = React.useState("No requests yet");
    return <Layout bg="white" padding={6}>
      <DataTable data={expansionRows} columns={expansionColumns} getRowId={expansionId}
        pageSize={0} language="EN" renderExpandedRow={renderDetail} getRowCanExpand={canExpand}
        defaultExpandedIds={new Set(["a"])} expandOnRowClick
        onRowExpand={(row, expanded) => setLastEvent(`${row.label} : ${expanded ? "expanded" : "collapsed"}`)} />
      <p role="status" className="mt-4 text-sm">{lastEvent}</p>
    </Layout>;
  },
};

export const ExpandWithCellButton: Story = {
  name: "Custom Cell Button",
  parameters: { docs: { description: { story: "The custom button uses the cell context and interactive: true. The built-in chevron is hidden. Clicking elsewhere on a row still calls onRowClick without expanding it. The custom button does not call onRowClick." } } },
  render: function Example() {
    const [clicked, setClicked] = React.useState("No row clicked");
    const columns: TableColumn<ExpansionRow>[] = [...expansionColumns, {
      id: "details", header: "Details", interactive: true,
      cell: (_row, { isExpanded, canExpand, toggleExpanded, expandedContentId }) => (
        <Button onClick={toggleExpanded} disabled={!canExpand} aria-expanded={isExpanded}
          aria-controls={isExpanded ? expandedContentId : undefined}>
          {isExpanded ? "Hide" : "Show"}
        </Button>
      ),
    }];
    return <Layout bg="white" padding={6}>
      <DataTable data={expansionRows} columns={columns} getRowId={expansionId}
        pageSize={0} language="EN" renderExpandedRow={renderDetail} getRowCanExpand={canExpand}
        showExpandButton={false} onRowClick={row => setClicked(`Clicked ${row.label}`)} />
      <p role="status" className="mt-4 text-sm">{clicked}</p>
    </Layout>;
  },
};

export const ControlledExpansion: Story = {
  name: "Controlled State",
  parameters: { docs: { description: { story: "Expansion, selection, sorting and pagination are controlled independently. Hide A, change pages or sort, then return: its expansion state is preserved by ID. Counters and bulk selection include only main rows. Selecting rows displays the ActionBar." } } },
  render: function Example() {
    const [expandedIds, setExpandedIds] = React.useState(new Set<string>(["a"]));
    const [selectedIds, setSelectedIds] = React.useState(new Set<string>());
    const [sort, setSort] = React.useState<DataTableSortState | null>(null);
    const [page, setPage] = React.useState(1);
    const [hideA, setHideA] = React.useState(false);
    return <ActionBarProvider><Layout bg="white" padding={6} className="pb-24">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={() => setExpandedIds(new Set(expansionRows.filter(canExpand).map(expansionId)))}>Expand all</Button>
        <Button onClick={() => setExpandedIds(new Set())}>Collapse all</Button>
        <Button onClick={() => { setHideA(!hideA); setPage(1); }}>{hideA ? "Show A" : "Hide A"}</Button>
      </div>
      <DataTable data={expansionRows.filter(row => !hideA || row.id !== "a")}
        columns={expansionColumns} getRowId={expansionId} language="EN"
        renderExpandedRow={renderDetail} getRowCanExpand={canExpand} expandOnRowClick
        expandedIds={expandedIds} onExpandedChange={setExpandedIds}
        selectable selectedIds={selectedIds} onSelectionChange={setSelectedIds}
        actionBar={({ selectedCount, clearSelection }) => (
          <Button onClick={clearSelection}>Done ({selectedCount})</Button>
        )}
        sort={sort} onSortChange={setSort} pageSize={2} currentPage={page} onPageChange={setPage} />
      <p role="status" className="mt-4 text-sm">Expanded: {[...expandedIds].join(", ") || "none"} · Selected: {[...selectedIds].join(", ") || "none"}</p>
    </Layout></ActionBarProvider>;
  },
};

export const AccordionExpansion: Story = {
  name: "Accordion",
  parameters: { docs: { description: { story: "The parent implements accordion behavior without an extra DataTable option. Keep only the newly expanded ID, or an empty Set when the current row is collapsed." } } },
  render: function Example() {
    const [expandedIds, setExpandedIds] = React.useState(new Set<string>());
    return <Layout bg="white" padding={6}>
      <DataTable data={expansionRows} columns={expansionColumns} getRowId={expansionId}
        pageSize={0} language="EN" renderExpandedRow={renderDetail} getRowCanExpand={canExpand}
        expandOnRowClick expandedIds={expandedIds} onExpandedChange={next => {
          const opened = [...next].find(id => !expandedIds.has(id));
          setExpandedIds(opened ? new Set([opened]) : new Set());
        }} />
    </Layout>;
  },
};

const detailRows = [
  { id: "one", format: "JPEG", size: "2.4 MB" },
  { id: "two", format: "PNG", size: "4.1 MB" },
  { id: "three", format: "TIFF", size: "18 MB" },
];
const detailColumns: TableColumn<(typeof detailRows)[number]>[] = [
  { id: "format", header: "Format", sortable: true, cell: row => row.format },
  { id: "size", header: "Size", cell: row => row.size },
];

export const ExpandedNestedTable: Story = {
  name: "Nested Table",
  parameters: { docs: { description: { story: "The detail contains another DataTable with its own model and columns. Child selection is stored in the parent, keyed by main-row ID: select a format, collapse and reopen the detail. Main-row selection stays independent. Details unmount when collapsed, so uncontrolled child state such as sorting resets." } } },
  render: function Example() {
    const [selectionByRow, setSelectionByRow] = React.useState<Record<string, Set<string>>>({});
    return <Layout bg="white" padding={6}>
      <DataTable data={expansionRows} columns={expansionColumns} getRowId={expansionId}
        selectable pageSize={0} language="EN" getRowCanExpand={canExpand} expandOnRowClick
        defaultExpandedIds={new Set(["a"])} renderExpandedRow={row => (
          <section aria-label={`Formats for ${row.label}`}>
            <p className="mb-3 font-medium">Formats for {row.label}</p>
            <DataTable data={detailRows} columns={detailColumns} getRowId={detail => detail.id}
              selectable pageSize={0} language="EN" selectedIds={selectionByRow[row.id] ?? new Set()}
              onSelectionChange={next => setSelectionByRow(previous => ({ ...previous, [row.id]: next }))} />
          </section>
        )} />
    </Layout>;
  },
};

function AsyncExpandedDetail({ scenario }: { scenario: "success" | "empty" | "error" }) {
  const [attempt, setAttempt] = React.useState(0);
  const [state, setState] = React.useState<"loading" | "success" | "empty" | "error">("loading");
  React.useEffect(() => {
    setState("loading");
    const timer = setTimeout(() => setState(attempt > 0 ? "success" : scenario), 600);
    return () => clearTimeout(timer);
  }, [scenario, attempt]);
  if (state === "loading") return <p role="status">Loading details…</p>;
  if (state === "error") return <div role="alert">
    <p>Could not load details.</p>
    <Button onClick={() => setAttempt(value => value + 1)}>Retry</Button>
  </div>;
  if (state === "empty") return <p role="status">No details available.</p>;
  return <p role="status">Details loaded. Content can be any React component.</p>;
}

export const AsyncExpansion: Story = {
  name: "Async Content",
  parameters: { docs: { description: { story: "A simulation without network requests. The detail component handles loading, errors, retries and empty results, and cancels its timer on unmount. In a real app, use your usual data-loading and caching layer keyed by row ID; do not start requests directly inside renderExpandedRow." } } },
  render: function Example() {
    const [scenario, setScenario] = React.useState<"success" | "empty" | "error">("success");
    return <Layout bg="white" padding={6}>
      <label className="block mb-4">Simulated result: {" "}
        <select value={scenario} onChange={event => setScenario(event.target.value as typeof scenario)}>
          <option value="success">Success</option><option value="empty">Empty</option><option value="error">Error</option>
        </select>
      </label>
      <DataTable data={expansionRows.slice(0, 2)} columns={expansionColumns} getRowId={expansionId}
        pageSize={0} language="EN" expandOnRowClick defaultExpandedIds={new Set(["a"])}
        renderExpandedRow={row => <AsyncExpandedDetail key={`${row.id}-${scenario}`} scenario={scenario} />} />
    </Layout>;
  },
};
