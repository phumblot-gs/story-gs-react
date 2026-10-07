import type { Meta, StoryObj } from "@storybook/react-vite"
import { useMemo, useState } from "react"

import { Layout } from "@/components/layout"
import { Pagination } from "./pagination"
import { CheckAll } from "./check-all"
import { CheckAllPages } from "./check-all-pages"
import { Checkbox } from "./checkbox"
import { usePaginatedSelection } from "@/hooks/usePaginatedSelection"

const meta: Meta<typeof CheckAll> = {
  title: "Components/CheckAll",
  component: CheckAll,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
## CheckAll, CheckAllPages and usePaginatedSelection

Selection controls for **paginated lists, whatever the items** (images, references, files…).
The components never see the items: they take **counts** and emit **intents**. The application
applies them to its own data — with its own state, or with the \`usePaginatedSelection\` hook.

- **\`CheckAll\`** — the "select all" checkbox of the current page. Unchecked when nothing is
  selected, checked when everything is, **indeterminate** in between. A click selects
  (from unchecked or indeterminate) or deselects (from checked).
- **\`CheckAllPages\`** — the scope menu next to it: *Current page (n)*, *All pages (n)*,
  *Deselect all*. It shows the current scope, including a *Custom* selection (read-only).
  *Current page* is hidden when there is only one page.
- **\`usePaginatedSelection<K>()\`** — the selection state, keyed by item keys only. "All pages"
  is stored as **"everything except…"**, so it works with server-side pagination without
  loading every key.

### Basic usage

\`\`\`tsx
import { CheckAll, CheckAllPages, usePaginatedSelection } from "@gs/gs-components-library";

const selection = usePaginatedSelection<string>({ totalCount, resetKey: filters });
const pageKeys = pageItems.map((item) => item.id);
const page = selection.pageState(pageKeys);

<CheckAll {...page} onCheckedChange={(checked) => selection.setMany(pageKeys, checked)} />
<CheckAllPages
  selectedCount={selection.count}
  pageCount={pageKeys.length}
  pageSelectedCount={page.selectedCount}
  totalCount={totalCount}
  onSelectPage={() => selection.selectOnly(pageKeys)}
  onSelectAll={selection.selectAll}
  onDeselectAll={selection.clear}
/>

// Each row
<Checkbox checked={selection.isSelected(item.id)} onCheckedChange={() => selection.toggle(item.id)} />
\`\`\`

### The selection state

\`selection.value\` is serializable:

- \`{ mode: "include", keys: ["a", "b"] }\` — only these items;
- \`{ mode: "exclude", keys: ["x"] }\` — every item **except** these (after *All pages*).

| Pagination | How to use the selection |
|---|---|
| Client side (every key in memory) | \`selection.resolve(allKeys)\` returns the selected keys |
| Server side | send \`selection.value\` with the current filters; the API applies "all except…" |

\`resetKey\` clears the selection when the list changes (filters, search): "all except x"
must never silently apply to another set of items. A change of \`totalCount\` alone keeps it.

### Hook API

| Member | Description |
|---|---|
| \`count\`, \`totalCount\`, \`isAllSelected\` | counters |
| \`isSelected(key)\`, \`toggle(key)\` | one item |
| \`setMany(keys, selected)\` | several items (a page, a Shift+click range) |
| \`selectOnly(keys)\`, \`selectAll()\`, \`clear()\` | scope |
| \`pageState(pageKeys)\` | \`{ selectedCount, totalCount }\` for \`CheckAll\` |
| \`resolve(allKeys)\` | selected keys among \`allKeys\` |
| \`value\` | \`{ mode, keys }\` to send to an API |
`,
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof CheckAll>

// --- CheckAll alone ----------------------------------------------------------

/** The three states, driven only by counts. */
export const States: Story = {
  render: () => (
    <Layout bg="white" className="flex items-center gap-6 p-4 text-sm">
      {[
        { label: "Nothing selected", selectedCount: 0 },
        { label: "Some (indeterminate)", selectedCount: 7 },
        { label: "Everything", selectedCount: 20 },
      ].map(({ label, selectedCount }) => (
        <label key={label} className="flex items-center gap-2">
          <CheckAll selectedCount={selectedCount} totalCount={20} onCheckedChange={() => undefined} />
          {label}
        </label>
      ))}
    </Layout>
  ),
}

// --- Paginated list (client side) -------------------------------------------

const ITEMS = Array.from({ length: 51 }, (_, i) => ({ id: `ref-${String(i + 1).padStart(2, "0")}`, name: `Reference ${i + 1}` }))
const PAGE_SIZE = 20

const ClientSideList = () => {
  const [page, setPage] = useState(1)
  const selection = usePaginatedSelection<string>({ totalCount: ITEMS.length })
  const pageItems = ITEMS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pageKeys = pageItems.map((item) => item.id)
  const pageState = selection.pageState(pageKeys)

  return (
    <Layout bg="grey" className="flex flex-col gap-3 p-4 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* w-10 column: aligned above the row checkboxes, as in a contact sheet. */}
          <div className="flex w-10 justify-center">
            <CheckAll {...pageState} onCheckedChange={(checked) => selection.setMany(pageKeys, checked)} />
          </div>
          <CheckAllPages
            selectedCount={selection.count}
            pageCount={pageKeys.length}
            pageSelectedCount={pageState.selectedCount}
            totalCount={ITEMS.length}
            onSelectPage={() => selection.selectOnly(pageKeys)}
            onSelectAll={selection.selectAll}
            onDeselectAll={selection.clear}
          />
        </div>
        <Pagination currentPage={page} totalPages={Math.ceil(ITEMS.length / PAGE_SIZE)} onPageChange={setPage} size="small" className="w-auto" />
      </div>
      <ul className="m-0 flex list-none flex-col p-0">
        {pageItems.map((item) => (
          <li key={item.id} className="flex items-center border-b border-grey-strong py-1">
            <div className="flex w-10 justify-center">
              <Checkbox checked={selection.isSelected(item.id)} onCheckedChange={() => selection.toggle(item.id)} aria-label={item.name} />
            </div>
            {item.name}
          </li>
        ))}
      </ul>
      <p className="m-0">
        {selection.count} selected — resolved keys: {selection.resolve(ITEMS.map((item) => item.id)).slice(0, 6).join(", ")}
        {selection.count > 6 ? "…" : ""}
      </p>
    </Layout>
  )
}

/**
 * 51 items, 20 per page, every key in memory. Check a page, change page, pick *All pages*,
 * then uncheck a few rows: the menu switches to *Custom*.
 */
export const PaginatedList: Story = {
  render: () => <ClientSideList />,
}

// --- Server side ------------------------------------------------------------

const ServerSideList = () => {
  const total = 12_480
  const [filter, setFilter] = useState("FW26")
  const selection = usePaginatedSelection<number>({ totalCount: total, resetKey: filter })
  // Only the current page is loaded.
  const pageKeys = useMemo(() => Array.from({ length: 20 }, (_, i) => i + 1), [])
  const pageState = selection.pageState(pageKeys)

  return (
    <Layout bg="white" className="flex flex-col gap-3 p-4 text-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <div className="flex w-10 justify-center">
            <CheckAll {...pageState} onCheckedChange={(checked) => selection.setMany(pageKeys, checked)} />
          </div>
          <CheckAllPages
            selectedCount={selection.count}
            pageCount={pageKeys.length}
            pageSelectedCount={pageState.selectedCount}
            totalCount={total}
            onSelectPage={() => selection.selectOnly(pageKeys)}
            onSelectAll={selection.selectAll}
            onDeselectAll={selection.clear}
          />
        </div>
        <label className="flex items-center gap-2">
          Filter
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-grey-strong px-1">
            <option>FW26</option>
            <option>SS27</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {pageKeys.map((key) => (
          <label key={key} className="flex items-center gap-1">
            <Checkbox checked={selection.isSelected(key)} onCheckedChange={() => selection.toggle(key)} />#{key}
          </label>
        ))}
      </div>
      <pre className="m-0 bg-grey p-2 text-xs">{JSON.stringify({ filter, selection: selection.value, count: selection.count }, null, 2)}</pre>
    </Layout>
  )
}

/**
 * 12,480 items on the server, one page loaded. *All pages* is stored as "everything except…":
 * the JSON is what you would send to the API with the filter. Changing the filter clears the
 * selection (`resetKey`).
 */
export const ServerSidePagination: Story = {
  render: () => <ServerSideList />,
}

/** Labels in French (`language="fr"`); every GS language is supported. */
export const Translated: Story = {
  render: () => (
    <Layout bg="white" className="flex items-center p-4">
      <div className="flex w-10 justify-center">
        <CheckAll selectedCount={7} totalCount={20} onCheckedChange={() => undefined} language="fr" />
      </div>
      <CheckAllPages
        selectedCount={51}
        pageCount={20}
        totalCount={51}
        onSelectPage={() => undefined}
        onSelectAll={() => undefined}
        onDeselectAll={() => undefined}
        language="fr"
      />
    </Layout>
  ),
}
