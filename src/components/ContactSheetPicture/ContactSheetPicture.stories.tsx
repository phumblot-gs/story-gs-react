import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContactSheetPicture, type ContactSheetPictureProps } from ".";
import type { ContactSheetExport, ThumbnailChange } from "@/components/ContactSheetReference";
import { MediaStatus } from "@/utils/mediaStatus";
import { Pagination as PaginationControl } from "@/components/ui/pagination";
import { usePaginatedSelection } from "@/hooks/usePaginatedSelection";
import { useContactSheetPages, type ContactSheetPageRequest } from "@/hooks/useContactSheetPages";
import documentation from "./README.md?raw";

const exports: ContactSheetExport[] = [{
  id: "export-site",
  name: "Site e-commerce",
  thumbnails: Array.from({ length: 20 }, (_, index) => ({
    picture_id: index + 1,
    src: `https://picsum.photos/seed/contact-sheet-flat-${index}/600/750`,
    filename: `EAN_${783320428975 + index}_BD_${index % 5 + 1}.png`,
    view: `BD_${index % 5 + 1}`,
    selected: index > 1,
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    statusButtons: [
      { key: "refuse", icon: "X", label: "Refuser", status: MediaStatus.REFUSED_1 },
      { key: "validate", icon: "Check", label: "Valider", status: MediaStatus.VALIDATED },
    ],
  })),
}];

const meta = {
  title: "Components/ContactSheetPicture",
  component: ContactSheetPicture,
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: documentation } },
  },
  tags: ["autodocs"],
  args: { exports, thumbnailsPerRow: 5, language: "fr" },
} satisfies Meta<typeof ContactSheetPicture>;
export default meta;
type Story = StoryObj<typeof meta>;

function Playground(args: ContactSheetPictureProps) {
  const [groups, setGroups] = React.useState(args.exports ?? []);
  const [lastChange, setLastChange] = React.useState<ThumbnailChange | null>(null);
  return (
    <>
      <ContactSheetPicture
        {...args}
        exports={groups}
        onSelectionChange={(selected, ids) => setGroups((all) => all.map((group) => ({
          ...group,
          thumbnails: group.thumbnails.map((thumb) => ids.includes(thumb.picture_id!) ? { ...thumb, selected } : thumb),
        })))}
        onThumbnailChange={(change) => {
          setLastChange(change);
          setGroups((all) => all.map((group) => ({
            ...group,
            thumbnails: group.thumbnails.map((thumb) => {
              if (change.type === "selection") {
                return change.pictureIds.includes(thumb.picture_id!) ? { ...thumb, selected: change.selected } : thumb;
              }
              if (group.id !== change.exportId || thumb.picture_id !== change.pictureId) return thumb;
              switch (change.type) {
                case "rating": return { ...thumb, rating: change.rating };
                case "label": return { ...thumb, label: change.label };
                case "tagAdd": return { ...thumb, tags: { ...thumb.tags, [change.tag]: true } };
                case "tagRemove": return {
                  ...thumb,
                  tags: Object.fromEntries(Object.entries(thumb.tags ?? {}).filter(([tag]) => tag !== change.tag)),
                };
                case "statusButton": return {
                  ...thumb,
                  status: change.key === "validate" ? MediaStatus.VALIDATED : MediaStatus.REFUSED_1,
                  statusButtons: thumb.statusButtons?.map((button) => ({ ...button, isActive: button.key === change.key })),
                };
                default: return thumb;
              }
            }),
          })));
        }}
        onReorder={(id, _ids, slots) => setGroups((all) => all.map((group) => {
          if (group.id !== id) return group;
          const byId = new Map(group.thumbnails.map((thumb) => [thumb.picture_id, thumb]));
          return { ...group, thumbnails: slots.map((slot) => ({ ...byId.get(slot.picture_id), ...slot })) };
        }))}
      />
      {lastChange && <pre className="p-2 text-xs">{JSON.stringify(lastChange, null, 2)}</pre>}
    </>
  );
}

/** Controlled selection, Shift+click, status actions and drag & drop; no reference grouping. */
export const Default: Story = { render: (args) => <Playground {...args} /> };

/** Read-only: no selection toolbar or interactive thumbnail controls. */
export const ReadOnly: Story = {};

/** Several exports share one continuous grid, with no badges or forced row break. */
export const MultipleExports: Story = {
  args: {
    exports: [
      { ...exports[0], thumbnails: exports[0].thumbnails.slice(0, 3) },
      { id: "export-marketplace", name: "Marketplace", thumbnails: exports[0].thumbnails.slice(3) },
    ],
  },
  render: (args) => <Playground {...args} />,
};

/** Optional application-owned controls beside Select all. */
export const ToolbarActions: Story = {
  args: { toolbarActions: <span className="text-sm">20 médias</span> },
  render: (args) => <Playground {...args} />,
};

const manyExports: ContactSheetExport[] = [{
  id: "site",
  thumbnails: Array.from({ length: 1000 }, (_, index) => ({
    ...exports[0].thumbnails[index % 20],
    picture_id: index + 1,
    filename: `media_${index + 1}.png`,
    selected: false,
  })),
}];

/** 1,000 records, but only viewport rows and two extra rows per side are mounted.
 * Scroll down and back up: decoded images do not replay their fade-in. */
export const Virtualized: Story = {
  args: { exports: manyExports, virtualized: true },
  render: (args) => <Playground {...args} />,
};

/** Same windowing inside a fixed-height scrolling container. */
export const VirtualizedScrollContainer: Story = {
  ...Virtualized,
  render: (args) => <div className="h-[600px] overflow-y-auto"><Playground {...args} /></div>,
};

function PaginatedDemo() {
  const [page, setPage] = React.useState(1);
  const pageSize = 30;
  const all = manyExports[0].thumbnails;
  const selection = usePaginatedSelection<number>({ totalCount: all.length });
  const pageExports = [{
    ...manyExports[0],
    thumbnails: all.slice((page - 1) * pageSize, page * pageSize).map((thumb) => ({
      ...thumb, selected: selection.isSelected(thumb.picture_id!),
    })),
  }];
  return (
    <>
      <PaginationControl currentPage={page} totalPages={Math.ceil(all.length / pageSize)} onPageChange={setPage} />
      <ContactSheetPicture
        key={page}
        exports={pageExports}
        virtualized
        language="fr"
        toolbarActions={<span className="text-sm">{selection.count} sélectionnés sur {all.length} médias</span>}
        onSelectionChange={(selected, ids) => selection.setMany(ids, selected)}
        thumbnailFeatures={{ rating: false, label: false, tags: false, comments: false, validation: false, open: false }}
        onThumbnailChange={(change) => {
          if (change.type === "selection") selection.setMany(change.pictureIds, change.selected);
        }}
      />
    </>
  );
}

/** 30 media per page; selection is kept by id when changing pages. */
export const Pagination: Story = { render: () => <PaginatedDemo /> };

function BoundedPagesDemo() {
  const [page, setPage] = React.useState(1);
  const loadPage = React.useCallback(async ({ page, pageSize, signal }: ContactSheetPageRequest) => {
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
    return { totalCount: 10000, exports: [{ id: "site", thumbnails: Array.from({ length: pageSize }, (_, i) => {
      const id = (page - 1) * pageSize + i + 1;
      return { ...exports[0].thumbnails[i % 20], picture_id: id, filename: `media_${id}.png`, selected: false };
    }) }] };
  }, []);
  const data = useContactSheetPages({ page, pageSize: 60, maxCachedPages: 3, loadPage });
  return (
    <div aria-busy={data.loading}>
      <PaginationControl currentPage={page} totalPages={Math.ceil(10000 / 60)} onPageChange={setPage} />
      {data.error && <p role="alert">{data.error.message}</p>}
      <ContactSheetPicture key={page} exports={data.exports} virtualized imageCache={{ maxImages: 48, keepAroundRows: 2 }} />
    </div>
  );
}

/** Simulated server: only 3 pages of 60 records are retained by the data hook. */
export const BoundedServerPages: Story = { render: () => <BoundedPagesDemo /> };
