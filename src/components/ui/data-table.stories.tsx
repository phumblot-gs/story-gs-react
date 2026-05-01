import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, type TableColumn } from "./data-table";
import { Layout, VStack, ActionBarProvider } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

interface Project {
  id: string;
  name: string;
  brand: string | null;
  status: "new" | "in-progress" | "done" | "archived";
  createdAt: string;
  assignee: string | null;
  images: number;
  products: number;
  progress: number;
}

const STATUSES: Project["status"][] = ["new", "in-progress", "done", "archived"];
const STATUS_LABEL: Record<Project["status"], string> = {
  new: "New",
  "in-progress": "In progress",
  done: "Done",
  archived: "Archived",
};
const STATUS_BG: Record<Project["status"], string> = {
  new: "!bg-pastel-yellow text-black",
  "in-progress": "!bg-pastel-blue text-black",
  done: "!bg-pastel-green text-black",
  archived: "!bg-grey text-black",
};
const BRANDS = ["Lacoste", "Cassini", "Maison Lou", "Flora & Co", null];

const PROJECTS: Project[] = Array.from({ length: 247 }, (_, i) => {
  const seed = (i + 1) * 9301 + 49297;
  const r = (k: number) => ((seed * k) % 233280) / 233280;
  const status = STATUSES[Math.floor(r(7) * STATUSES.length)];
  const brand = BRANDS[Math.floor(r(3) * BRANDS.length)];
  const assignee = r(11) > 0.6 ? null : r(13) > 0.5 ? "Laurent Salières" : "me";
  const images = Math.floor(r(5) * 200);
  const products = Math.floor(r(17) * 1600);
  const progress =
    status === "done"
      ? 100
      : status === "archived"
      ? Math.floor(r(19) * 100)
      : Math.floor(r(23) * 100);
  const days = Math.floor(r(29) * 365);
  const created = new Date(2026, 4, 1);
  created.setDate(created.getDate() - days);
  return {
    id: `prj-${i + 1}`,
    name: `Project ${i + 1}`,
    brand,
    status,
    createdAt: created.toISOString().slice(0, 10),
    assignee,
    images,
    products,
    progress,
  };
});

// ---------------------------------------------------------------------------
// Reusable column definitions
// ---------------------------------------------------------------------------

const baseColumns: TableColumn<Project>[] = [
  {
    id: "status",
    header: "Status",
    sortable: true,
    sortAccessor: "status",
    cell: (p) => (
      <Badge className={STATUS_BG[p.status]}>{STATUS_LABEL[p.status]}</Badge>
    ),
  },
  {
    id: "name",
    header: "Project name",
    sortable: true,
    sortAccessor: "name",
    cell: (p) => <span className="font-medium">{p.name}</span>,
  },
  {
    id: "brand",
    header: "Brand",
    sortable: true,
    sortAccessor: (p) => p.brand ?? "",
    cell: (p) => p.brand ?? <span className="text-grey-strongest">—</span>,
  },
  {
    id: "createdAt",
    header: "Created",
    sortable: true,
    sortAccessor: (p) => new Date(p.createdAt),
    cell: (p) => p.createdAt,
  },
  {
    id: "assignee",
    header: "Assignee",
    sortable: true,
    sortAccessor: (p) => p.assignee ?? "",
    cell: (p) =>
      p.assignee ? p.assignee : <span className="text-grey-strongest">—</span>,
  },
  {
    id: "images",
    header: "Images",
    align: "right",
    sortable: true,
    sortAccessor: "images",
    cell: (p) => p.images.toLocaleString(),
  },
  {
    id: "products",
    header: "Products",
    align: "right",
    sortable: true,
    sortAccessor: "products",
    cell: (p) => p.products.toLocaleString(),
  },
  {
    id: "progress",
    header: "Progress",
    align: "right",
    sortable: true,
    sortAccessor: "progress",
    cell: (p) => `${p.progress}%`,
  },
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof DataTable> = {
  title: "UI/DataTable",
  component: DataTable as never,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Generic data table built on top of the shadcn \`Table\` primitives. Renders rows from a typed \`data\` array using a declarative \`columns\` config; handles sort, pagination, row selection (single or multi-page), and bulk actions via \`ActionBar\`.

## When to use it

- A list of domain entities (projects, files, users, orders…) with ≥ 1 sortable column.
- Bulk actions on a subset of rows (delete, change status, assign…).
- Anywhere you'd write a \`<table>\` with the shadcn primitives but also need standard interactions.

## Filtering — external, never internal

The \`DataTable\` never filters itself. Filter UI (text fields, dropdowns, dateranges, saved views…) lives in the consumer and feeds an already-filtered \`data: T[]\`. Three benefits:

1. **Decoupled UI / data** — the table is purely presentational.
2. **Multi-source** — the consumer can filter server-side or client-side; the table doesn't care.
3. **Persisted views** — the consumer owns the filter snapshot and can save it.

\`\`\`tsx
const [filters, setFilters] = useState<MyFilters>(DEFAULT_FILTERS);
const filteredData = useMemo(() => applyFilters(allData, filters), [allData, filters]);

return (
  <>
    <MyFiltersUI filters={filters} onChange={setFilters} />
    <DataTable data={filteredData} columns={columns} getRowId={(r) => r.id} />
  </>
);
\`\`\`

## Selection

Set \`selectable\` to add a leftmost checkbox column. The header checkbox is **tri-state** based on the **current page**: \`true\` (whole page selected), \`false\` (none), \`indeterminate\` (some). A small chevron next to it opens a menu with three "super-power" actions: select page, select all pages (across pagination), or clear the entire selection.

Selection persists across page and sort changes. When \`data\` shrinks (e.g. the consumer applies a stricter filter), ids that are no longer in \`data\` are simply ignored for display and bulk actions — they remain in the \`selectedIds\` Set in case the filter is loosened. The DataTable does **not** mutate the Set when the data changes.

### Shift-click range selection

Standard Gmail / GitHub / Finder pattern, scoped to the **current page**:

1. Click a checkbox without modifier → toggles that row and sets it as the **anchor**.
2. Shift-click another checkbox → selects (or deselects) the contiguous range from the anchor to the target. The state applied to every row in the range matches the anchor's state — selected if the anchor is selected, deselected otherwise.
3. Shift-click again to extend or narrow the range — rows that were extended by the previous shift-click but no longer fall in the new range automatically revert to their pre-shift state. The anchor stays put until the next non-shift click.

The anchor is reset when the user navigates to another page (the range never crosses page boundaries — users only act on what they actually see).

## ActionBar

When \`actionBar\` is provided AND there is at least one visible selected row, the DataTable wraps your slot inside \`<ActionBar selectedCount onDeselectAll />\`. The slot receives \`{ selectedRows, selectedCount, clearSelection }\` so you can wire bulk actions:

\`\`\`tsx
<DataTable
  data={projects}
  columns={columns}
  getRowId={(p) => p.id}
  selectable
  actionBar={({ selectedRows, clearSelection }) => (
    <Button onClick={() => bulkArchive(selectedRows, clearSelection)}>Archive</Button>
  )}
/>
\`\`\`

## Pagination

Default \`pageSize\` is **50**. Pass \`pageSizeOptions\` (e.g. \`[10, 25, 50, 100]\`) to render a "Rows per page" \`Select\` in the footer that lets the user change the size at runtime. Set \`pageSize={0}\` (or \`Infinity\`) to disable pagination entirely.

Both \`currentPage\` and \`sort\` can be **controlled** (pass the value + on…Change) or **uncontrolled** (omit and the DataTable manages its own state).

## Cells with interactive widgets

When a cell renders an interactive widget (\`Select\`, \`Button\`, \`DropdownMenu\`, secondary \`Checkbox\`…), set \`interactive: true\` on its column. The DataTable will stop \`onRowClick\` from firing when that cell is clicked.

\`\`\`tsx
{
  id: "status",
  header: "Status",
  cell: (p) => <StatusSelect project={p} />,
  interactive: true,
}
\`\`\`

## What's intentionally NOT included

Inline editing, drag-and-drop reorder, virtualization, CSV export, sticky header, column resize. These belong in a follow-up or stay in the consumer.`,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <DataTable<Project>
        data={PROJECTS}
        columns={baseColumns}
        getRowId={(p) => p.id}
        defaultSort={{ columnId: "createdAt", direction: "desc" }}
        pageSize={10}
        pageSizeOptions={[10, 25, 50, 100]}
        itemLabel="dataTable.item"
      />
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Default table — 247 generated rows, sortable columns, default sort by `createdAt` desc, 10 rows per page with a `Rows per page` selector in the footer.",
      },
    },
  },
};

export const WithSelection: Story = {
  render: () => (
    <ActionBarProvider>
      <Layout bg="white" padding={6}>
        <DataTable<Project>
          data={PROJECTS}
          columns={baseColumns}
          getRowId={(p) => p.id}
          defaultSort={{ columnId: "createdAt", direction: "desc" }}
          pageSize={10}
          pageSizeOptions={[10, 25, 50]}
          selectable
          actionBar={({ selectedRows, clearSelection }) => (
            <>
              <Button
                variant="default"
                onClick={() => {
                  console.log("Archive", selectedRows);
                  clearSelection();
                }}
              >
                Archive {selectedRows.length}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  console.log("Delete", selectedRows);
                  clearSelection();
                }}
              >
                Delete
              </Button>
            </>
          )}
        />
      </Layout>
    </ActionBarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`selectable` enables the checkbox column. Click the header checkbox to toggle the current page; use the dropdown next to it for `Select page` / `Select all pages` / `Clear selection`. The `ActionBar` appears at the bottom once at least one row is selected.",
      },
    },
  },
};

export const ClickableRows: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <DataTable<Project>
        data={PROJECTS.slice(0, 50)}
        columns={baseColumns}
        getRowId={(p) => p.id}
        onRowClick={(p) => alert(`Open ${p.name}`)}
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
      />
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "When `onRowClick` is provided, rows become clickable (hover + cursor). Cells flagged `interactive: true` would stop click propagation — see `WithInteractiveCells`.",
      },
    },
  },
};

export const WithInteractiveCells: Story = {
  render: () => {
    const ColumnsWithInteractive: TableColumn<Project>[] = [
      ...baseColumns.slice(0, 1),
      {
        id: "actions",
        header: "Actions",
        align: "center",
        interactive: true,
        cell: (p) => (
          <Button
            size="medium"
            onClick={() => alert(`Quick edit ${p.name}`)}
          >
            Edit
          </Button>
        ),
      },
      ...baseColumns.slice(1),
    ];
    return (
      <Layout bg="white" padding={6}>
        <DataTable<Project>
          data={PROJECTS.slice(0, 30)}
          columns={ColumnsWithInteractive}
          getRowId={(p) => p.id}
          onRowClick={(p) => alert(`Row clicked → ${p.name}`)}
          pageSize={10}
        />
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Mixing `onRowClick` with cells that contain buttons. The `Edit` button doesn't trigger the row click thanks to `interactive: true` on its column.",
      },
    },
  },
};

export const ControlledMode: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    const [sort, setSort] = React.useState<{
      columnId: string;
      direction: "asc" | "desc";
    } | null>({
      columnId: "createdAt",
      direction: "desc",
    });
    const [selected, setSelected] = React.useState<Set<string>>(new Set());

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={2}>
          <p className="text-xs text-grey-strongest">
            page = <strong>{page}</strong>, sort = <strong>{sort?.columnId} {sort?.direction}</strong>, selected = <strong>{selected.size}</strong>
          </p>
          <DataTable<Project>
            data={PROJECTS}
            columns={baseColumns}
            getRowId={(p) => p.id}
            currentPage={page}
            onPageChange={setPage}
            sort={sort}
            onSortChange={setSort}
            selectable
            selectedIds={selected}
            onSelectionChange={setSelected}
            pageSize={25}
          />
        </VStack>
      </Layout>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Fully controlled — page, sort and selection live in the parent. Useful for syncing with the URL, persisting to a backend, or driving a server-side query.",
      },
    },
  },
};

export const OnGrey: Story = {
  render: () => (
    <Layout bg="grey" padding={6}>
      <DataTable<Project>
        data={PROJECTS}
        columns={baseColumns}
        getRowId={(p) => p.id}
        defaultSort={{ columnId: "createdAt", direction: "desc" }}
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
      />
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Same component on a grey parent surface — the `BgContext` propagates so child components (Select, Pagination buttons, Checkbox) adapt their styling automatically.",
      },
    },
  },
};

export const EmptyState: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <DataTable<Project>
        data={[]}
        columns={baseColumns}
        getRowId={(p) => p.id}
        pageSize={10}
      />
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Empty state — defaults to a localized message. Override via `emptyState` prop.",
      },
    },
  },
};

export const CustomEmptyState: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <DataTable<Project>
        data={[]}
        columns={baseColumns}
        getRowId={(p) => p.id}
        emptyState={
          <div className="py-12 flex flex-col items-center gap-3">
            <p className="font-medium text-black">No project matches your filters.</p>
            <Button variant="default">Clear filters</Button>
          </div>
        }
      />
    </Layout>
  ),
};

export const WithoutPagination: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <DataTable<Project>
        data={PROJECTS.slice(0, 8)}
        columns={baseColumns}
        getRowId={(p) => p.id}
        pageSize={0}
      />
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story: "Pass `pageSize={0}` (or `Infinity`) to disable pagination entirely — every row renders.",
      },
    },
  },
};

export const FrenchLocale: Story = {
  render: () => (
    <ActionBarProvider>
      <Layout bg="white" padding={6}>
        <DataTable<Project>
          data={PROJECTS}
          columns={baseColumns}
          getRowId={(p) => p.id}
          defaultSort={{ columnId: "createdAt", direction: "desc" }}
          pageSize={10}
          pageSizeOptions={[10, 25, 50]}
          language="FR"
          itemLabel="dataTable.item"
          selectable
          actionBar={({ selectedRows }) => (
            <Button>Action sur {selectedRows.length} ligne{selectedRows.length > 1 ? "s" : ""}</Button>
          )}
        />
      </Layout>
    </ActionBarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'French locale. Footer counter, dropdown items, "Lignes par page" label and ActionBar copy all switch to French via the standard `language` prop.',
      },
    },
  },
};

export const CustomItemLabel: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <DataTable<Project>
        data={PROJECTS}
        columns={baseColumns}
        getRowId={(p) => p.id}
        defaultSort={{ columnId: "createdAt", direction: "desc" }}
        pageSize={10}
        pageSizeOptions={[10, 25, 50]}
        language="EN"
        itemLabel="myApp.project"
        translations={{
          "myApp.project": {
            EN: "project",
            FR: "projet",
            ES: "proyecto",
            IT: "progetto",
            DE: "Projekt",
          },
          "myApp.project_plural": {
            EN: "projects",
            FR: "projets",
            ES: "proyectos",
            IT: "progetti",
            DE: "Projekte",
          },
        }}
      />
    </Layout>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Custom `itemLabel` translation key passed through `translations`. The footer counter now reads `1–10 / 247 projects` (or `projets` / `proyectos`…) instead of the generic `items`.",
      },
    },
  },
};
