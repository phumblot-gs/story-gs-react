import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type TableColumn } from "./data-table";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof DataTable> = {
  title: "UI/DataTable/Column sizing",
  component: DataTable,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Columns can take fixed widths and be resized by the user. Everything is opt-in: a table without \`width\` on its columns and without \`resizableColumns\` renders exactly as before (automatic layout, no handle).

## API

| Prop | Purpose / default |
| --- | --- |
| \`column.width\` | Width in px. Default: automatic. |
| \`column.minWidth\` / \`column.maxWidth\` | Bounds of a resize, in px. Default: 48 / none. |
| \`column.resizable\` | Overrides \`resizableColumns\` for one column. |
| \`resizableColumns\` | Adds a drag handle on the right edge of each header. Default: \`false\`. |
| \`columnWidths\` | Controlled widths, keyed by column id. Takes precedence over \`column.width\`. |
| \`defaultColumnWidths\` | Initial widths in uncontrolled mode; read only on mount. |
| \`onColumnWidthsChange(widths)\` | Requests the next widths of all sized columns, on every step of a resize. |

## Layout

- **Some columns sized**: the table keeps the browser's automatic layout; the widths act as hints.
- **Every column sized**: the table switches to \`table-layout: fixed\` and is exactly as wide as its columns (plus the selection and expansion columns, 56 px and 40 px). Cell content that does not fit is clipped, so long texts should wrap or use an ellipsis. Several tables given the same widths line up, which is how a board split into groups stays aligned; see **Aligned Groups**.
- **First resize of an automatic table**: the columns are frozen at their rendered widths, then the dragged one changes. Double-click then restores that rendered width.

## Interaction and accessibility

The handle is a focusable \`role="separator"\` with \`aria-valuenow\`, \`aria-valuemin\` and \`aria-valuemax\`, labelled "Resize column …" in the current language.

- Drag with the mouse, a pen or a finger.
- With the keyboard, focus the handle (Tab) and use ←/→ for 10 px steps, Shift+←/→ for 50 px.
- Double-click resets the column to \`column.width\`, otherwise \`defaultColumnWidths\`, otherwise its width before the first resize.
- Using the handle never sorts the column nor triggers \`onRowClick\`.

## Controlled and uncontrolled state

Without \`columnWidths\`, the table keeps the widths itself. With it, the parent owns them: the table only emits \`onColumnWidthsChange\` and renders the props, which lets an application persist the widths per user or share them between tables.

\`\`\`tsx
const [widths, setWidths] = React.useState(() => JSON.parse(localStorage.getItem("widths") ?? "{}"));
<DataTable
  data={rows}
  columns={columns}            // each with a default width
  getRowId={row => row.id}
  resizableColumns
  columnWidths={widths}
  onColumnWidthsChange={next => { setWidths(next); localStorage.setItem("widths", JSON.stringify(next)); }}
/>
\`\`\`
`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Sample data: retouching batches
// ---------------------------------------------------------------------------

interface Batch {
  id: string;
  name: string;
  client: string;
  owner: string;
  status: "Urgent" | "Important" | "Started" | "Waiting";
  images: number;
}

const BATCHES: Batch[] = [
  { id: "1", name: "B1 Galeries Lafayette - MKP: standard-2026-10-19 H23-PART-1 7610", client: "Galeries Lafayette", owner: "Alba Martin", status: "Urgent", images: 420 },
  { id: "2", name: "REDO B1 The Kooples Connect: Détourage - batch 14 297", client: "The Kooples", owner: "Bruno Keller", status: "Important", images: 12 },
  { id: "3", name: "B1 Monoprix MKP Connect: Détourage - batch 89 1320", client: "Monoprix", owner: "Chloé Durand", status: "Started", images: 284 },
  { id: "4", name: "B1 Printemps Marketplace: standard-2026-10-20 H10-PART-1 2490", client: "Printemps", owner: "Dario Rossi", status: "Waiting", images: 134 },
  { id: "5", name: "B1 Printemps FNR: VAN LAACK 20261020 6153", client: "Printemps", owner: "Eva Nowak", status: "Started", images: 7 },
];

const columns: TableColumn<Batch>[] = [
  { id: "name", header: "Batch", sortable: true, cell: (b) => <span className="font-medium">{b.name}</span> },
  { id: "client", header: "Client", sortable: true, cell: (b) => b.client },
  { id: "owner", header: "Owner", sortable: true, cell: (b) => b.owner },
  { id: "status", header: "Status", sortable: true, cell: (b) => b.status },
  { id: "images", header: "Images", align: "right", sortable: true, cell: (b) => b.images },
];

const DEFAULT_WIDTHS: Record<string, number> = { name: 320, client: 160, owner: 140, status: 110, images: 90 };
const sizedColumns = columns.map((col) => ({ ...col, width: DEFAULT_WIDTHS[col.id] }));

const Widths = ({ widths }: { widths: Record<string, number> | null }) => (
  <pre className="mt-4 text-xs text-grey-strongest" data-testid="widths">{widths ? JSON.stringify(widths) : "No resize yet"}</pre>
);

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Resizable: Story = {
  parameters: { docs: { description: { story: "Automatic widths and `resizableColumns`. Drag a header's right edge, or focus its handle with Tab and use the arrow keys. The first resize freezes every column at its rendered width. Double-click a handle to restore it. The latest `onColumnWidthsChange` request is shown below." } } },
  render: function Example() {
    const [widths, setWidths] = React.useState<Record<string, number> | null>(null);
    return (
      <Layout bg="white" padding={6}>
        <DataTable<Batch> data={BATCHES} columns={columns} getRowId={(b) => b.id} pageSize={0} resizableColumns onColumnWidthsChange={setWidths} />
        <Widths widths={widths} />
      </Layout>
    );
  },
};

export const FixedWidths: Story = {
  parameters: { docs: { description: { story: "Every column has a `width` and nothing is resizable: the table uses a fixed layout and is exactly as wide as its columns. Long batch names wrap inside their 320 px." } } },
  render: () => (
    <Layout bg="white" padding={6}>
      <DataTable<Batch> data={BATCHES} columns={sizedColumns} getRowId={(b) => b.id} pageSize={0} selectable />
    </Layout>
  ),
};

export const Constraints: Story = {
  parameters: { docs: { description: { story: "Batch can shrink to 200 px and grow to 480 px, Images is not resizable (`resizable: false`), the others keep the 48 px minimum. Resize beyond the bounds to see the clamp." } } },
  render: function Example() {
    const [widths, setWidths] = React.useState<Record<string, number> | null>(null);
    const constrained = sizedColumns.map((col) =>
      col.id === "name" ? { ...col, minWidth: 200, maxWidth: 480 } : col.id === "images" ? { ...col, resizable: false } : col,
    );
    return (
      <Layout bg="white" padding={6}>
        <DataTable<Batch> data={BATCHES} columns={constrained} getRowId={(b) => b.id} pageSize={0} resizableColumns onColumnWidthsChange={setWidths} />
        <Widths widths={widths} />
      </Layout>
    );
  },
};

export const ControlledWidths: Story = {
  parameters: { docs: { description: { story: "The parent owns the widths (`columnWidths` + `onColumnWidthsChange`), as an application persisting them per user would. **Reset** gives every column its default width back." } } },
  render: function Example() {
    const [widths, setWidths] = React.useState<Record<string, number>>(DEFAULT_WIDTHS);
    return (
      <Layout bg="white" padding={6}>
        <div className="mb-4">
          <Button variant="secondary" size="small" onClick={() => setWidths(DEFAULT_WIDTHS)}>Reset</Button>
        </div>
        <DataTable<Batch> data={BATCHES} columns={sizedColumns} getRowId={(b) => b.id} pageSize={0} resizableColumns columnWidths={widths} onColumnWidthsChange={setWidths} />
        <Widths widths={widths} />
      </Layout>
    );
  },
};

export const AlignedGroups: Story = {
  parameters: { docs: { description: { story: "A board split into groups renders one table per group. Sharing the same controlled widths keeps their columns aligned: resizing a column in any group resizes it in all of them. On a grey `Layout`, each table becomes a white card." } } },
  render: function Example() {
    const [widths, setWidths] = React.useState<Record<string, number>>(DEFAULT_WIDTHS);
    const groups = [
      { title: "Urgent", rows: BATCHES.filter((b) => b.status === "Urgent" || b.status === "Important") },
      { title: "In progress", rows: BATCHES.filter((b) => b.status === "Started") },
      { title: "Waiting", rows: BATCHES.filter((b) => b.status === "Waiting") },
    ];
    return (
      <Layout bg="grey" padding={6}>
        <div className="space-y-6">
          {groups.map((group) => (
            <section key={group.title} className="space-y-2">
              <h3 className="text-sm font-semibold">{group.title}</h3>
              <DataTable<Batch> data={group.rows} columns={sizedColumns} getRowId={(b) => b.id} pageSize={0} selectable resizableColumns columnWidths={widths} onColumnWidthsChange={setWidths} />
            </section>
          ))}
        </div>
      </Layout>
    );
  },
};
