import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { TabsWithViews, type View, type ViewVisibility } from "./tabs-with-views";
import { Button } from "./button";
import { Layout, VStack } from "@/components/layout";

const meta = {
  title: "UI/TabsWithViews",
  component: TabsWithViews,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Advanced Tabs component with:
- Fixed tabs + dynamic user-created "views" (filter snapshots of a parent tab)
- Optional right-side content per tab (primary action button + secondary link)
- Built-in modals for view creation, renaming, and deletion
- Public/private visibility per view (persisted by consumer)

## Data model

- **Fixed tabs** are declared statically via \`fixedTabs\`. A fixed tab with \`canHaveViews: true\` can own views; when it or any of its views is active, the "+ Create a view" link appears.
- **Views** are dynamic tabs owned by a parent fixed tab. They carry a filter snapshot and a visibility flag (\`public\` / \`private\`). Ordering is by \`createdAt\` ascending.

## Persistence

The component is fully controlled. Creation, renaming and deletion are delegated to the consumer via async callbacks — typically wired to a backend endpoint for public/private view storage.

## Filter snapshot

When the user creates a view, the component captures the \`currentFilters\` prop as the view's filter snapshot. The \`renderFiltersSummary\` prop lets the consumer render a readable summary inside the create/rename modals.`,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TabsWithViews>;

export default meta;
type Story = StoryObj<typeof meta>;

type FiltersState = {
  status?: string;
  brand?: string;
  period?: string;
};

const FILTER_LABELS: Record<keyof FiltersState, string> = {
  status: "Statut",
  brand: "Marque",
  period: "Période",
};

const renderFiltersSummary = (filters: Record<string, unknown>): React.ReactNode => {
  const entries = Object.entries(filters).filter(([, v]) => v !== undefined && v !== "");
  if (entries.length === 0) return null;
  return (
    <ul className="list-disc pl-5 space-y-1">
      {entries.map(([key, value]) => (
        <li key={key}>
          <strong>{FILTER_LABELS[key as keyof FiltersState] ?? key}:</strong> {String(value)}
        </li>
      ))}
    </ul>
  );
};

const INITIAL_VIEWS: View[] = [
  {
    id: "view_nouveaux",
    name: "Nouveaux",
    parentTabId: "all",
    filters: { status: "Nouveau" },
    visibility: "public",
    createdAt: "2026-01-05T10:00:00Z",
    count: 3,
  },
  {
    id: "view_traiter",
    name: "À traiter",
    parentTabId: "all",
    filters: { status: "À traiter" },
    visibility: "public",
    createdAt: "2026-02-11T14:30:00Z",
    count: 0,
  },
  {
    id: "view_urgents",
    name: "Urgents",
    parentTabId: "all",
    filters: { status: "Urgent" },
    visibility: "private",
    createdAt: "2026-03-20T09:15:00Z",
    count: 1,
  },
];

const simulateLatency = () => new Promise((r) => setTimeout(r, 400));

const Playground: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [views, setViews] = React.useState<View[]>(INITIAL_VIEWS);
  const [filters, setFilters] = React.useState<FiltersState>({
    status: "Tous les statuts",
    brand: "Toutes les marques",
    period: "Toutes les périodes",
  });
  const [log, setLog] = React.useState<string[]>([]);

  const appendLog = (msg: string) => setLog((l) => [...l.slice(-9), msg]);

  const activeView = views.find((v) => v.id === activeTab) ?? null;
  const effectiveParentTabId = activeView ? activeView.parentTabId : activeTab;
  const effectiveFilters = activeView ? (activeView.filters as FiltersState) : filters;

  const handleCreateView = async (input: {
    name: string;
    visibility: ViewVisibility;
    parentTabId: string;
    filters: Record<string, unknown>;
  }) => {
    await simulateLatency();
    const newView: View = {
      id: `view_${Date.now()}`,
      name: input.name,
      parentTabId: input.parentTabId,
      filters: input.filters,
      visibility: input.visibility,
      createdAt: new Date().toISOString(),
      count: 0,
    };
    setViews((prev) => [...prev, newView]);
    appendLog(`Created view "${input.name}" (${input.visibility}) on tab ${input.parentTabId}`);
  };

  const handleRenameView = async (id: string, name: string) => {
    await simulateLatency();
    setViews((prev) => prev.map((v) => (v.id === id ? { ...v, name } : v)));
    appendLog(`Renamed view ${id} to "${name}"`);
  };

  const handleDeleteView = async (id: string) => {
    await simulateLatency();
    setViews((prev) => prev.filter((v) => v.id !== id));
    if (activeTab === id) setActiveTab("all");
    appendLog(`Deleted view ${id}`);
  };

  const fixedTabs = [
    {
      id: "suppliers",
      label: "Fournisseurs",
      count: 8,
    },
    {
      id: "all",
      label: "Tous les projets",
      count: 8,
      canHaveViews: true,
      rightSlot: (
        <Button onClick={() => appendLog("Primary action: Nouveau projet clicked")}>
          Nouveau projet
        </Button>
      ),
    },
  ];

  return (
    <Layout bg="white" padding={6} className="min-h-screen">
      <VStack gap={6}>
        <div>
          <h3 className="gs-typo-h3 mb-2">TabsWithViews — Playground</h3>
          <p className="text-sm text-grey-stronger">
            Active tab: <strong>{activeTab}</strong>
            {activeView && (
              <>
                {" "}— Rendering content from parent{" "}
                <strong>{effectiveParentTabId}</strong> with view filters
              </>
            )}
          </p>
        </div>

        <TabsWithViews
          fixedTabs={fixedTabs}
          views={views}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          currentFilters={filters as Record<string, unknown>}
          onCreateView={handleCreateView}
          onRenameView={handleRenameView}
          onDeleteView={handleDeleteView}
          renderFiltersSummary={renderFiltersSummary}
          language="FR"
        />

        <div className="p-4 bg-grey-lighter rounded">
          <p className="text-sm font-medium mb-2">Active view filters (effective):</p>
          <pre className="text-xs">{JSON.stringify(effectiveFilters, null, 2)}</pre>
        </div>

        {effectiveParentTabId === "all" && !activeView && (
          <div className="p-4 border border-dashed rounded">
            <p className="text-xs text-grey-stronger mb-3">
              Change the filters below, then click "+ Créer une vue" to snapshot them into a new
              view.
            </p>
            <div className="flex gap-3 flex-wrap">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={filters.status ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              >
                <option>Tous les statuts</option>
                <option>Nouveau</option>
                <option>À traiter</option>
                <option>Urgent</option>
                <option>Traité</option>
              </select>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={filters.brand ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
              >
                <option>Toutes les marques</option>
                <option>ROC SKINCARE</option>
                <option>ROSEFIELD</option>
                <option>FREDERIC MALLE</option>
              </select>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={filters.period ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, period: e.target.value }))}
              >
                <option>Toutes les périodes</option>
                <option>Aujourd'hui</option>
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
              </select>
            </div>
          </div>
        )}

        <div className="p-4 bg-black text-white rounded text-xs font-mono">
          <p className="font-bold mb-2">Activity log (last 10):</p>
          {log.length === 0 ? (
            <p className="opacity-60">No activity yet.</p>
          ) : (
            <ul className="space-y-1">
              {log.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      </VStack>
    </Layout>
  );
};

export const Default: Story = {
  render: () => <Playground />,
  parameters: {
    docs: {
      description: {
        story:
          "Full playground with in-memory mock backend. Create, rename, and delete views; switch tabs; change filters and capture them in a new view.",
      },
    },
  },
};

export const EmptyViews: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState<string>("all");
    const [views, setViews] = React.useState<View[]>([]);

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <p className="text-sm text-grey-stronger">
            Initial state with no views. Click "+ Créer une vue" when "Tous les projets" is active
            to create your first view.
          </p>
          <TabsWithViews
            fixedTabs={[
              { id: "suppliers", label: "Fournisseurs", count: 8 },
              { id: "all", label: "Tous les projets", count: 8, canHaveViews: true },
            ]}
            views={views}
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            currentFilters={{ status: "Nouveau" }}
            onCreateView={async (input) => {
              await simulateLatency();
              setViews((prev) => [
                ...prev,
                {
                  id: `view_${Date.now()}`,
                  name: input.name,
                  parentTabId: input.parentTabId,
                  filters: input.filters,
                  visibility: input.visibility,
                  createdAt: new Date().toISOString(),
                  count: 0,
                },
              ]);
            }}
            onRenameView={async (id, name) => {
              await simulateLatency();
              setViews((prev) => prev.map((v) => (v.id === id ? { ...v, name } : v)));
            }}
            onDeleteView={async (id) => {
              await simulateLatency();
              setViews((prev) => prev.filter((v) => v.id !== id));
              if (activeTab === id) setActiveTab("all");
            }}
            renderFiltersSummary={renderFiltersSummary}
            language="FR"
          />
        </VStack>
      </Layout>
    );
  },
};

export const EnglishLocale: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState<string>("all");
    const [views, setViews] = React.useState<View[]>(INITIAL_VIEWS);

    return (
      <Layout bg="white" padding={6}>
        <VStack gap={4}>
          <p className="text-sm text-grey-stronger">Same component, English translations.</p>
          <TabsWithViews
            fixedTabs={[
              { id: "suppliers", label: "Suppliers", count: 8 },
              {
                id: "all",
                label: "All projects",
                count: 8,
                canHaveViews: true,
                rightSlot: <Button>+ New project</Button>,
              },
            ]}
            views={views}
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            currentFilters={{ status: "New" }}
            onCreateView={async (input) => {
              await simulateLatency();
              setViews((prev) => [
                ...prev,
                {
                  id: `view_${Date.now()}`,
                  name: input.name,
                  parentTabId: input.parentTabId,
                  filters: input.filters,
                  visibility: input.visibility,
                  createdAt: new Date().toISOString(),
                  count: 0,
                },
              ]);
            }}
            onRenameView={async (id, name) => {
              await simulateLatency();
              setViews((prev) => prev.map((v) => (v.id === id ? { ...v, name } : v)));
            }}
            onDeleteView={async (id) => {
              await simulateLatency();
              setViews((prev) => prev.filter((v) => v.id !== id));
              if (activeTab === id) setActiveTab("all");
            }}
            renderFiltersSummary={renderFiltersSummary}
            language="EN"
          />
        </VStack>
      </Layout>
    );
  },
};
