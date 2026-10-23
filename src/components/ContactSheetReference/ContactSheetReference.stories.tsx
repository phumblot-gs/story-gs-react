import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Layout } from "@/components/layout";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { VedetteIndicator } from "@/components/Thumbnail/VedetteIndicator";
import { MediaStatus } from "@/utils/mediaStatus";
import { ContactSheetReference, type ContactSheetReferenceProps } from "./ContactSheetReference";
import type { ThumbnailStatusButton } from "@/components/Thumbnail/Thumbnail";
import type {
  ContactSheetExport,
  ContactSheetThumbnail,
  ReferenceAttributeConfig,
  ReferenceData,
  ThumbnailChange,
} from "./types";

const meta: Meta<typeof ContactSheetReference> = {
  title: "Components/ContactSheetReference",
  component: ContactSheetReference,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A reference in a contact sheet: selection checkbox, urgent toggle, title, grade, header actions,
attributes, export badges and thumbnails.

The component is **controlled**: it keeps no copy of its data. Any new \`reference\` or \`exports\`
value (status, tags, order…) is rendered immediately — update your state, pass it back, done.

### Thumbnails without a preview

A media with no \`src\` (thumbnail not generated yet) or whose image fails shows the BrokenFile icon with the
"Preview unavailable" tooltip. A click on it sends the \`open\` change even when \`thumbnailFeatures.open\` is off:
fetch the thumbnail again and pass the new \`src\` back (**PreviewUnavailable** story).

### Memory during long sessions

In grouped loading mode, \`imageCache={{ maxImages: 120, keepAroundRows: 4 }}\`
is the default per-grid budget. Nearby blocks may exceed it; a grid entirely
outside the preload zone releases its images. Evicted images reload on return.
\`virtualized\` (default \`"auto"\`: only above 100 thumbnails; \`false\` mounts everything)
mounts only viewport rows and two surrounding rows, in both exports
layouts and with \`onReorder\`. In \`"separated"\`, export headers stay mounted and each
export grid is windowed on its own. While dragging, the grabbed thumbnail stays mounted
even when scrolled out of view. Callback caches retain only mounted thumbnails.

To also bound server data, use the exported \`useContactSheetPages\` hook with
\`pageSize: 60\`, \`maxCachedPages: 3\`, a stable \`loadPage({ page, pageSize, signal })\`
returning \`{ exports, totalCount }\`, and a \`cacheKey\` reflecting filters/sort.
Pass its current-page exports to the component; call \`reload()\` after mutations.
Paginate reference objects in the parent too. Data retained by the parent cannot
be freed by this component. Native loading mode uses the browser's image cache.

### Basic usage

Pass one reference, the attributes to display, and its exports with their thumbnails. This is the
**Basic** story below.

\`\`\`tsx
import { ContactSheetReference } from "@gs/gs-components-library";
import type {
  ReferenceData,
  ReferenceAttributeConfig,
  ContactSheetExport,
} from "@gs/gs-components-library";

// 1. The reference, as returned by the \`/reference\` endpoint.
//    Only \`reference_id\` and \`ref\` are guaranteed; any other field may be missing.
const reference: ReferenceData = {
  reference_id: 467825,
  ref: "5238694",
  ean: "810177861393",
  brand: "OLAPLEX",
  extra: { supplier_ref: "HYDRATION HEROS SE ND" },
};

// 2. The attributes to display, in this order — independent from the data:
//    a configured attribute missing from \`reference\` is rendered empty.
//    \`key\` accepts a dotted path for nested fields.
const attributes: ReferenceAttributeConfig[] = [
  { key: "ref", label: "Reference" },
  { key: "ean", label: "EAN" },
  { key: "brand", label: "Brand" },
  { key: "extra.supplier_ref", label: "Supplier ref." },
  { key: "color", label: "Color" }, // not in the data → empty value
];

// 3. The exports, in display order, each with its thumbnails in display order.
//    A thumbnail takes the Thumbnail display props (src, filename, view, status…).
//    A thumbnail without \`picture_id\` is an empty slot: an expected view with no media yet.
const exports: ContactSheetExport[] = [
  {
    id: "export-site",
    name: "E-commerce website",
    thumbnails: [
      { picture_id: 423986, src: "https://…/423986.jpg", filename: "5238694_F.tif", view: "F" },
      { picture_id: 423987, src: "https://…/423987.jpg", filename: "5238694_B.tif", view: "B" },
      { view: "L" }, // empty slot
    ],
  },
  {
    id: "export-marketplace",
    name: "Marketplace",
    thumbnails: [
      { picture_id: 423988, src: "https://…/423988.jpg", filename: "5238694_Z.tif", view: "Z" },
    ],
  },
];

<ContactSheetReference
  reference={reference}
  attributes={attributes}
  exports={exports}
  thumbnailsPerRow={6}
/>;
\`\`\`

With several exports, \`exportsLayout\` chooses how they are laid out: \`"grouped"\` (default) shows
the export badges side by side then a single grid; \`"separated"\` stacks the exports 20px apart,
each with its own badge and grid.

### Status buttons

The buttons under each thumbnail are data: give each thumbnail \`statusButtons\` (0, 1 or 2
\`ThumbnailStatusButton\`, decided from the image state) and handle the \`statusButton\` change of
\`onThumbnailChange\` (\`{ type: "statusButton", key, reason?, pictureId, exportId }\`). As soon as one
thumbnail of the reference has \`statusButtons\`, the row is reserved for all of them, so the
thumbnails stay aligned. See the **Status Buttons** story.

\`\`\`tsx
thumbnails: images.map((image) => ({ picture_id: image.id, src: image.url, statusButtons: statusButtonsOf(image) }))

onThumbnailChange={(change) => {
  if (change.type === "statusButton") updateStatus(change.pictureId, change.key, change.reason);
}}
\`\`\`

**Deprecated:** \`thumbnailFeatures.validation\` and the \`validate\` / \`reject\` changes only drive the
legacy buttons (\`onValidate\` / \`onReject\`) of thumbnails without \`statusButtons\`.

Interactions are opt-in: each one appears when its callback is provided — \`onSelectionChange\`
(checkbox), \`onUrgentChange\` (urgent toggle), \`onReferenceUpdate\` (Edit form),
\`onThumbnailChange\` (thumbnail selection, rating, label, tags, comments, validation),
\`onReorder\` (drag & drop).

### Image loading

On a contact sheet with many references, pass \`imageLoading="grouped"\` (default \`"native"\`: each
\`<img>\` loads on its own). Nothing is requested until a reference comes within 300px of the viewport
(or of the scrolling container), visible references first; its images are preloaded and decoded, then
the whole reference appears at once with a short fade. After 2s, what is ready appears and the rest
follows one by one. References of more than \`max(thumbnailsPerRow × 4, 24)\` images are split by rows.
A 404 or undecodable image shows the broken file icon without holding the others back. See the
**Grouped Image Loading** story.

\`\`\`tsx
<ContactSheetReference reference={reference} exports={exports} imageLoading="grouped" />
\`\`\`

### Reordering (drag & drop)

Drag & drop is enabled as soon as \`onReorder\` is provided. A drop never leaves its export.

**View codes are attached to positions: they never move, the images do.** Every image takes the
view code of the position it lands on — the sequence of view codes of the export never changes.

| Gesture | Result |
|---|---|
| One image onto the center of another | Swap: \`A.jpg\` (view A) and \`B.jpg\` (view B) exchange places, so \`A.jpg\` takes view B and \`B.jpg\` view A |
| One image between two others (vertical bar) | Insertion: the following images shift, each taking the view of its new position |
| One image onto an empty slot, or right before it | The image fills the slot and takes its view (e.g. P → L); its former position (P) becomes an empty slot |
| The grabbed image is **selected** | The whole selection of the export moves with it (stacked preview + image count). Placed one by one from the drop point: empty slots met are filled, otherwise insertion |

\`onReorder(exportId, pictureIds, slots, details)\` is called **once per drop**:

- \`pictureIds\` — new order of the media only;
- \`slots\` — complete final state of the export (\`{ picture_id?, view }\` per slot, empty slots
  included): the source of truth to rebuild \`exports\`;
- \`details.movedPictureIds\` — the group that was moved;
- \`details.viewChanges\` — \`{ picture_id, previousView, view }\` for each media whose view changed,
  i.e. every image that changed position.

\`\`\`tsx
const handleReorder: ReorderHandler = async (exportId, pictureIds, slots, details) => {
  // 1. Local (optimistic) update: rebuild the export from \`slots\`.
  setExports((all) =>
    all.map((e) => {
      if (e.id !== exportId) return e;
      const byId = new Map(e.thumbnails.map((t) => [t.picture_id, t]));
      return {
        ...e,
        thumbnails: slots.map((slot) =>
          slot.picture_id !== undefined
            ? { ...byId.get(slot.picture_id)!, view: slot.view } // media, with the view of its new position
            : { view: slot.view },                                // empty slot
        ),
      };
    }),
  );

  // 2. Persistence: the order, then the views that changed.
  await api.setExportOrder(exportId, pictureIds);
  for (const { picture_id, view } of details.viewChanges) {
    await api.setPictureView(picture_id, view);
  }
};
\`\`\`

The **Reorder Payload** story shows live the arguments received on each drop.
`,
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ContactSheetReference>;

// --- Données ----------------------------------------------------------------

const ATTRIBUTES: ReferenceAttributeConfig[] = [
  { key: "ref", label: "Référence", editable: true },
  { key: "extra.ean_alternative", label: "EAN alternative", editable: true },
  { key: "category_name", label: "Catégorie" },
  { key: "ean", label: "EAN", editable: true },
  { key: "color", label: "Couleur", editable: true },
];

const makeReference = (ref: string, id: number): ReferenceData => ({
  reference_id: id,
  ref,
  category_name: "default",
  smalltext: "NO26 COF HYDRATATION HEROS SET",
  tags: ["FW26"],
});

const makeThumbnails = (ref: string, count: number, offset = 0): ContactSheetThumbnail[] =>
  Array.from({ length: count }, (_, i) => ({
    picture_id: offset + i + 1,
    src: `https://picsum.photos/seed/${ref}-${offset + i}/600/750`,
    filename: `${ref.toUpperCase()}_worn_${offset + i + 1}.tif`,
    view: "worn",
    status: MediaStatus.SUBMITTED_FOR_APPROVAL,
    rating: 0,
    tags: {},
    comments: [],
  }));

// --- Banc d'essai : état local qui joue le rôle de l'application parente ----

function useReferenceState(initial: { reference: ReferenceData; exports: ContactSheetExport[] }) {
  const [reference, setReference] = useState(initial.reference);
  const [exports, setExports] = useState(initial.exports);
  const [selected, setSelected] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  const patchThumbnail = (pictureId: number, patch: Partial<ContactSheetThumbnail>) =>
    setExports((all) =>
      all.map((e) => ({
        ...e,
        thumbnails: e.thumbnails.map((t) => (t.picture_id === pictureId ? { ...t, ...patch } : t)),
      })),
    );
  const findThumbnail = (pictureId: number) =>
    exports.flatMap((e) => e.thumbnails).find((t) => t.picture_id === pictureId);

  const onThumbnailChange = (change: ThumbnailChange) => {
    console.log("[onThumbnailChange]", change);
    const current = findThumbnail(change.pictureId);
    switch (change.type) {
      case "selection":
        // Maj+clic : toute la plage passe au nouvel état.
        return setExports((all) =>
          all.map((e) => ({
            ...e,
            thumbnails: e.thumbnails.map((t) =>
              t.picture_id !== undefined && change.pictureIds.includes(t.picture_id)
                ? { ...t, selected: change.selected }
                : t,
            ),
          })),
        );
      case "rating":
        return patchThumbnail(change.pictureId, { rating: change.rating });
      case "label":
        return patchThumbnail(change.pictureId, { label: change.label });
      case "validate":
        return patchThumbnail(change.pictureId, { status: MediaStatus.VALIDATED });
      case "reject":
        return patchThumbnail(change.pictureId, { status: MediaStatus.REFUSED_1 });
      case "tagAdd":
        return patchThumbnail(change.pictureId, {
          tags: { ...current?.tags, [change.tag]: true },
        });
      case "tagRemove": {
        const { [change.tag]: _removed, ...rest } = current?.tags ?? {};
        return patchThumbnail(change.pictureId, { tags: rest });
      }
    }
  };

  const props: Partial<ContactSheetReferenceProps> = {
    reference,
    exports,
    selected,
    isUrgent,
    onUrgentChange: setIsUrgent,
    onSelectionChange: (value) => {
      setSelected(value);
      setExports((all) =>
        all.map((e) => ({ ...e, thumbnails: e.thumbnails.map((t) => ({ ...t, selected: value })) })),
      );
    },
    onThumbnailChange,
    onReorder: (exportId, pictureIds, slots) => {
      console.log("[onReorder]", exportId, pictureIds, slots);
      setExports((all) =>
        all.map((e) =>
          e.id !== exportId
            ? e
            : {
                ...e,
                // `slots` porte l'ordre complet et les vues (un média qui remplit
                // un emplacement vide prend sa vue).
                thumbnails: slots.map((slot) => {
                  const media = e.thumbnails.find((t) => slot.picture_id !== undefined && t.picture_id === slot.picture_id);
                  return media ? { ...media, view: slot.view } : { view: slot.view };
                }),
              },
        ),
      );
    },
    onReferenceUpdate: async (update) => {
      console.log("[onReferenceUpdate]", update);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setReference((r) => {
        const next: ReferenceData = { ...r, extra: { ...(r.extra as object) } };
        Object.entries(update.values).forEach(([key, value]) => {
          const path = key.split(".");
          let node = next as Record<string, unknown>;
          path.slice(0, -1).forEach((segment) => {
            node[segment] = { ...(node[segment] as object) };
            node = node[segment] as Record<string, unknown>;
          });
          node[path[path.length - 1]] = value;
        });
        if (update.tags) next.tags = update.tags;
        return next;
      });
    },
  };
  return props;
}

const Playground = ({
  refName = "7e0125de91",
  count = 6,
  exportsCount = 1,
  attributes = ATTRIBUTES,
  thumbnailsPerRow: initialPerRow = 6,
  exportsLayout: initialLayout = "grouped",
  showControls = true,
  virtualized = "auto",
}: {
  refName?: string;
  count?: number;
  exportsCount?: number;
  attributes?: ReferenceAttributeConfig[];
  thumbnailsPerRow?: number;
  exportsLayout?: "grouped" | "separated";
  showControls?: boolean;
  virtualized?: boolean | "auto";
}) => {
  const props = useReferenceState({
    reference: makeReference(refName, 1),
    exports: Array.from({ length: exportsCount }, (_, i) => ({
      id: `export-${i}`,
      name: ["Place des tendances", "Site e-commerce", "Marketplace"][i],
      thumbnails: makeThumbnails(refName, count, i * 100),
    })),
  });
  const [perRow, setPerRow] = useState(initialPerRow);
  const [layout, setLayout] = useState(initialLayout);

  return (
    <Layout bg="grey" className="min-h-screen">
      {showControls && (
        <div className="flex flex-wrap items-center gap-6 px-6 py-3 border-b border-grey-strong text-sm">
          <label className="flex items-center gap-3 w-72">
            <span className="whitespace-nowrap">{perRow} per row</span>
            <Slider min={4} max={10} step={1} value={[perRow]} onValueChange={([v]) => setPerRow(v)} />
          </label>
          {exportsCount > 1 && (
            <label className="flex items-center gap-2">
              Exports layout
              <select
                value={layout}
                onChange={(e) => setLayout(e.target.value as "grouped" | "separated")}
                className="border border-grey-strong rounded-sm px-1"
              >
                <option value="grouped">grouped</option>
                <option value="separated">separated</option>
              </select>
            </label>
          )}
        </div>
      )}
      <ContactSheetReference
        {...props}
        reference={props.reference!}
        attributes={attributes}
        thumbnailsPerRow={perRow}
        exportsLayout={layout}
        virtualized={virtualized}
        grade="B"
      />
    </Layout>
  );
};

// --- Stories ----------------------------------------------------------------

/**
 * Basic usage: one reference with its attributes and two exports, display only (no callback,
 * hence no checkbox, urgent toggle, Edit button or drag & drop). Same data as the example at
 * the top of this page.
 */
export const Basic: Story = {
  render: () => (
    <Layout bg="grey" className="min-h-screen">
      <ContactSheetReference
        reference={{
          reference_id: 467825,
          ref: "5238694",
          ean: "810177861393",
          brand: "OLAPLEX",
          extra: { supplier_ref: "HYDRATION HEROS SE ND" },
        }}
        attributes={[
          { key: "ref", label: "Reference" },
          { key: "ean", label: "EAN" },
          { key: "brand", label: "Brand" },
          { key: "extra.supplier_ref", label: "Supplier ref." },
          { key: "color", label: "Color" },
        ]}
        exports={[
          {
            id: "export-site",
            name: "E-commerce website",
            thumbnails: [
              { picture_id: 423986, src: "https://picsum.photos/seed/5238694-F/600/750", filename: "5238694_F.tif", view: "F" },
              { picture_id: 423987, src: "https://picsum.photos/seed/5238694-B/600/750", filename: "5238694_B.tif", view: "B" },
              { view: "L" },
            ],
          },
          {
            id: "export-marketplace",
            name: "Marketplace",
            thumbnails: [
              { picture_id: 423988, src: "https://picsum.photos/seed/5238694-Z/600/750", filename: "5238694_Z.tif", view: "Z" },
            ],
          },
        ]}
        thumbnailsPerRow={6}
      />
    </Layout>
  ),
};

/** Mockup: 6 thumbnails, 5 attributes, one export. Every interaction is wired (state kept in the story). */
export const Default: Story = {
  render: () => <Playground />,
};

/** Selected reference: all its thumbnails are rendered selected. */
export const Selected: Story = {
  render: () => {
    const Selected = () => {
      const props = useReferenceState({
        reference: makeReference("7e0127dr0x", 2),
        exports: [
          {
            id: "e",
            name: "Place des tendances",
            thumbnails: makeThumbnails("7e0127dr0x", 6).map((t) => ({ ...t, selected: true })),
          },
        ],
      });
      return (
        <Layout bg="grey" className="min-h-screen">
          <ContactSheetReference {...props} reference={props.reference!} attributes={ATTRIBUTES} selected />
        </Layout>
      );
    };
    return <Selected />;
  },
};

/**
 * Drag & drop, always enabled. Drag a thumbnail:
 * - onto the middle third of another → dashed outline, the two are swapped;
 * - between two thumbnails, or at the start / end → vertical bar, the thumbnail is inserted.
 *
 * Selection: check a thumbnail, then Shift+click another one to select (or deselect) every
 * thumbnail in between. Dragging a selected thumbnail moves the whole selection of its export.
 */
export const DragAndDropAndRangeSelection: Story = {
  render: () => <Playground count={12} />,
};

/**
 * Several exports: badges side by side, then a single grid. Hovering a thumbnail darkens its
 * export badge; while dragging, the other exports fade out — a drop never leaves its export.
 */
export const MultipleExports: Story = {
  render: () => <Playground count={4} exportsCount={3} />,
};

/**
 * Several exports with `exportsLayout="separated"`: exports are stacked 20px apart, each with its
 * own badge (10px above its thumbnails) and its own grid. Drag & drop, badge hover and Shift+click
 * range selection behave as in the grouped layout. The selector above switches between layouts.
 */
export const SeparatedExports: Story = {
  render: () => <Playground count={4} exportsCount={3} exportsLayout="separated" />,
};

/**
 * Custom header actions: several buttons with different variants, side by side. The built-in
 * Edit button is hidden (`showEditButton={false}`) and replaced by a custom one that opens the
 * same form through `openEdit`.
 */
export const CustomHeaderActions: Story = {
  render: () => {
    const Custom = () => {
      const props = useReferenceState({
        reference: makeReference("7e0125de91", 4),
        exports: [{ id: "e", name: "Place des tendances", thumbnails: makeThumbnails("7e0125de91", 6) }],
      });
      return (
        <Layout bg="grey" className="min-h-screen">
          <ContactSheetReference
            {...props}
            reference={props.reference!}
            attributes={ATTRIBUTES}
            showEditButton={false}
            headerActions={({ openEdit }) => (
              <>
                <Button variant="secondary" size="small" onClick={openEdit}>
                  <Icon name="Pencil" size={12} />
                  Modifier
                </Button>
                <Button variant="outline" size="small" onClick={() => console.log("dupliquer")}>
                  Dupliquer
                </Button>
                <Button variant="ghost" size="small" onClick={() => console.log("historique")}>
                  Historique
                </Button>
              </>
            )}
          />
        </Layout>
      );
    };
    return <Custom />;
  },
};

/** More thumbnails than columns: they wrap onto several rows. */
export const ManyThumbnails: Story = {
  render: () => <Playground count={17} thumbnailsPerRow={8} />,
};

/**
 * Thumbnails without a preview: media with no `src` (a version whose thumbnail the server has not generated yet), or
 * whose image fails (`hasError`). They show the BrokenFile icon with the "Preview unavailable" tooltip instead of a
 * blank frame. A click on one sends the `open` change even with the `open` feature off: here the application "fetches"
 * the thumbnail again and passes it back after one second.
 */
export const PreviewUnavailable: Story = {
  render: () => {
    const Unavailable = () => {
      const [thumbnails, setThumbnails] = useState<ContactSheetThumbnail[]>(() =>
        makeThumbnails("5238694", 6).map((t, i) => (i === 1 || i === 4 ? { ...t, src: undefined } : t)));
      const onThumbnailChange = (change: ThumbnailChange) => {
        console.log("[onThumbnailChange]", change);
        if (change.type !== "open") return;
        setTimeout(() => setThumbnails((all) => all.map((t) => (t.picture_id === change.pictureId
          ? { ...t, src: `https://picsum.photos/seed/refetched-${change.pictureId}/600/750` } : t))), 1000);
      };
      return (
        <Layout bg="grey" className="min-h-screen">
          <ContactSheetReference reference={{ reference_id: 3, ref: "5238694" }} exports={[{ id: "e", thumbnails }]}
            onThumbnailChange={onThumbnailChange} thumbnailFeatures={{ selection: true, open: false }} />
        </Layout>
      );
    };
    return <Unavailable />;
  },
};

/** No attribute configured and an unnamed export: only the title and the thumbnails remain. */
export const Minimal: Story = {
  render: () => {
    const Minimal = () => {
      const props = useReferenceState({
        reference: { reference_id: 3, ref: "5238694" },
        exports: [{ id: "e", thumbnails: makeThumbnails("5238694", 5) }],
      });
      return (
        <Layout bg="grey" className="min-h-screen">
          <ContactSheetReference {...props} reference={props.reference!} />
        </Layout>
      );
    };
    return <Minimal />;
  },
};

/**
 * Reference title: `smalltext` when not blank, otherwise `ref` (`getReferenceDisplayName`, same
 * rule as gs_node and gs_w). Hover the title for "smalltext — ref". `ref` stays visible as an
 * attribute. `title` replaces the title with any node; `titleText` then gives its text for the
 * tooltip, the checkbox label and the Edit form title.
 */
export const ReferenceDisplayName: Story = {
  args: { onSelectionChange: fn() },
  render: (args) => {
    const thumbnails = (ref: string) => [{ id: "e", thumbnails: makeThumbnails(ref, 3) }];
    return (
      <Layout bg="grey" className="min-h-screen">
        <ContactSheetReference
          reference={{ reference_id: 11, ref: "5238694", smalltext: "Hydration heroes set" }}
          attributes={[{ key: "ref", label: "Reference" }]}
          exports={thumbnails("5238694")}
          onSelectionChange={args.onSelectionChange}
        />
        <ContactSheetReference
          reference={{ reference_id: 12, ref: "7e0125de91", smalltext: "  " }}
          attributes={[{ key: "ref", label: "Reference" }]}
          exports={thumbnails("7e0125de91")}
          onSelectionChange={args.onSelectionChange}
        />
        <ContactSheetReference
          reference={{ reference_id: 13, ref: "7e0127dr0x", smalltext: "Repair shampoo" }}
          title={
            <>
              Repair shampoo <span className="font-normal normal-case">(200 ml)</span>
            </>
          }
          titleText="Repair shampoo (200 ml)"
          attributes={[{ key: "ref", label: "Reference" }]}
          exports={thumbnails("7e0127dr0x")}
          onSelectionChange={args.onSelectionChange}
        />
      </Layout>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const [withSmalltext, withoutSmalltext, custom] = canvas.getAllByRole("heading", { level: 3 });
    await expect(withSmalltext).toHaveTextContent("Hydration heroes set");
    await expect(withSmalltext).toHaveAttribute("title", "Hydration heroes set — 5238694");
    await expect(withoutSmalltext).toHaveTextContent("7e0125de91");
    await expect(withoutSmalltext).toHaveAttribute("title", "7e0125de91");
    await expect(custom).toHaveAttribute("title", "Repair shampoo (200 ml)");
    await userEvent.click(canvas.getByRole("checkbox", { name: /Hydration heroes set/ }));
    await expect(args.onSelectionChange).toHaveBeenCalledWith(true, [1, 2, 3]);
  },
};

/**
 * Pictures without a reference: pass `reference={null}`. The title becomes a "Missing reference"
 * error badge; there is no urgent toggle, Edit button nor attribute grid, since they all need a
 * reference. Thumbnails, selection and exports work as usual.
 */
export const MissingReference: Story = {
  args: { onSelectionChange: fn(), onUrgentChange: fn(), onReferenceUpdate: fn(), onThumbnailChange: fn() },
  render: (args) => (
    <Layout bg="grey" className="min-h-screen">
      <ContactSheetReference
        {...args}
        reference={null}
        attributes={ATTRIBUTES}
        exports={[{ id: "e", name: "Place des tendances", thumbnails: makeThumbnails("orphan", 4) }]}
      />
      <ContactSheetReference
        {...args}
        reference={makeReference("7e0125de91", 21)}
        attributes={ATTRIBUTES}
        exports={[{ id: "e", name: "Place des tendances", thumbnails: makeThumbnails("7e0125de91", 4, 10) }]}
      />
    </Layout>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 3, name: "Missing reference" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("button", { name: /Edit/ })).toHaveLength(1);
    await userEvent.click(canvas.getByRole("checkbox", { name: "Select pictures without reference" }));
    await expect(args.onSelectionChange).toHaveBeenCalledWith(true, [1, 2, 3, 4]);
  },
};

/**
 * `titleContent` is rendered right after the title, before the grade and the actions. Here, the
 * featured ("vedette") indicator: hover or focus it to preview the featured picture.
 */
export const TitleContent: Story = {
  render: () => {
    const TitleContentStory = () => {
      const props = useReferenceState({
        reference: makeReference("7e0125de91", 31),
        exports: [{ id: "e", name: "Place des tendances", thumbnails: makeThumbnails("7e0125de91", 6) }],
      });
      return (
        <Layout bg="grey" className="min-h-screen">
          <ContactSheetReference
            {...props}
            reference={props.reference!}
            attributes={ATTRIBUTES}
            grade="B"
            titleContent={
              <HoverCard openDelay={150}>
                <HoverCardTrigger asChild>
                  <button type="button" aria-label="Featured picture" className="flex rounded-sm">
                    <VedetteIndicator />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent side="bottom" align="start" className="w-auto p-2">
                  <img
                    src="https://picsum.photos/seed/7e0125de91-0/600/750"
                    alt="Featured picture of 7e0125de91"
                    className="block w-40 h-auto rounded-sm"
                  />
                </HoverCardContent>
              </HoverCard>
            }
          />
        </Layout>
      );
    };
    return <TitleContentStory />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole("heading", { level: 3 });
    const vedette = canvas.getByRole("button", { name: "Featured picture" });
    await expect(title.compareDocumentPosition(vedette) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await userEvent.hover(vedette);
    // HoverCard content is portalled outside the story canvas.
    await expect(await within(document.body).findByAltText("Featured picture of 7e0125de91")).toBeInTheDocument();
  },
};

/**
 * Reference without attributes, with an unnamed export: no attribute grid nor badge, the
 * thumbnails follow the title. Thumbnails mix media and empty slots ("Empty with view": an
 * expected view with no media yet). An empty slot can be neither selected nor dragged, but
 * dropping an image onto it (or right before it) fills it: the image takes its view code, and its
 * former position becomes an empty slot. View codes never move, images do.
 */
export const WithoutExportsAndAttributes: Story = {
  render: () => {
    const Bare = () => {
      // Vues F, B, L, R, D, Z, P : 4 médias et 3 emplacements vides.
      const media = makeThumbnails("5238694", 4).map((t, i) => ({ ...t, view: ["F", "D", "Z", "P"][i] }));
      const props = useReferenceState({
        reference: { reference_id: 5, ref: "5238694" },
        exports: [
          {
            id: "e",
            thumbnails: [
              media[0],
              { view: "B" },
              media[1],
              media[2],
              { view: "L" },
              { view: "R" },
              media[3],
            ],
          },
        ],
      });
      return (
        <Layout bg="grey" className="min-h-screen">
          <ContactSheetReference {...props} reference={props.reference!} grade="C" />
        </Layout>
      );
    };
    return <Bare />;
  },
};

/**
 * Shows live the arguments received by `onReorder` on each drop. Try moving a single image, then
 * select several images and drop them onto an empty slot (B, L or R).
 */
export const ReorderPayload: Story = {
  render: () => {
    const Payload = () => {
      const media = makeThumbnails("5238694", 5).map((t, i) => ({ ...t, view: ["F", "D", "Z", "P", "S"][i] }));
      const props = useReferenceState({
        reference: { reference_id: 7, ref: "5238694" },
        exports: [
          { id: "export-site", name: "Site e-commerce", thumbnails: [media[0], { view: "B" }, media[1], media[2], { view: "L" }, { view: "R" }, media[3], media[4]] },
        ],
      });
      const [payload, setPayload] = useState<unknown>(null);
      return (
        <Layout bg="grey" className="min-h-screen">
          <ContactSheetReference
            {...props}
            reference={props.reference!}
            thumbnailsPerRow={8}
            onReorder={(exportId, pictureIds, slots, details) => {
              setPayload({ exportId, pictureIds, slots, details });
              props.onReorder?.(exportId, pictureIds, slots, details);
            }}
          />
          <pre className="m-4 p-4 bg-white text-xs overflow-auto" data-testid="reorder-payload">
            {payload ? JSON.stringify(payload, null, 2) : "Drop one or more thumbnails to see the arguments of onReorder."}
          </pre>
        </Layout>
      );
    };
    return <Payload />;
  },
};

// --- Status buttons ------------------------------------------------------------

type ImageState =
  | "unmatched"
  | "suggestion"
  | "associated"
  | "selected"
  | "processing"
  | "toValidate"
  | "validated"
  | "refused";

/** The application decides the buttons from the image state (here: the mediagrade rules). */
const statusButtonsOf = (state: ImageState): ThumbnailStatusButton[] => {
  if (state === "unmatched" || state === "suggestion") return [];
  if (state === "associated" || state === "selected") {
    return [{ key: "select", icon: "Check", status: MediaStatus.SELECTED, isActive: state === "selected", label: state === "selected" ? "Deselect" : "Select" }];
  }
  const processing = state === "processing";
  return [
    { key: "refuse", icon: "X", status: MediaStatus.REFUSED_1, isActive: state === "refused", disabled: processing || state === "refused", rejectionReasons: true, label: "Refuse" },
    { key: "validate", icon: "Check", status: MediaStatus.VALIDATED, isActive: state === "validated", disabled: processing || state === "validated", label: "Validate" },
  ];
};

const STATUS_OF: Record<ImageState, MediaStatus | undefined> = {
  unmatched: undefined,
  suggestion: undefined,
  associated: MediaStatus.NOT_SELECTED,
  selected: MediaStatus.SELECTED,
  processing: MediaStatus.SUBMITTED_FOR_APPROVAL,
  toValidate: MediaStatus.SUBMITTED_FOR_APPROVAL,
  validated: MediaStatus.VALIDATED,
  refused: MediaStatus.REFUSED_1,
};

/** Transitions triggered by a click: associated ↔ selected, to validate → validated / refused… */
const nextState = (state: ImageState, key: string): ImageState => {
  if (key === "select") return state === "selected" ? "associated" : "selected";
  if (key === "validate") return "validated";
  if (key === "refuse") return "refused";
  return state;
};

const REJECTION_BENCH = {
  config: { validation: { rejection_options: { active: true, main: ["Blurry", "Wrong framing"], secondary: ["Other"] } } },
};

/**
 * Status buttons decided from the image state (`statusButtons`), with local state: click a button
 * to move the image to its next state — associated ↔ selected, to validate → validated / refused,
 * validated → refused, refused → validated. The filename shows the current state; the last change
 * is printed below.
 */
export const StatusButtons: Story = {
  render: () => {
    const StatusDemo = () => {
      const initial: ImageState[] = ["unmatched", "suggestion", "associated", "selected", "processing", "toValidate", "validated", "refused"];
      const [states, setStates] = useState<ImageState[]>(initial);
      const [last, setLast] = useState<string>("");
      const exports: ContactSheetExport[] = [
        {
          id: "e",
          name: "Status buttons",
          thumbnails: states.map((state, i) => ({
            picture_id: i + 1,
            src: `https://picsum.photos/seed/status-${i}/600/750`,
            filename: `${state}.tif`,
            status: STATUS_OF[state],
            statusButtons: statusButtonsOf(state),
          })),
        },
      ];
      return (
        <Layout bg="grey" className="min-h-screen">
          <ContactSheetReference
            reference={{ reference_id: 9, ref: "STATUS-DEMO" }}
            exports={exports}
            thumbnailsPerRow={8}
            bench={REJECTION_BENCH}
            thumbnailFeatures={{ validation: false }}
            onThumbnailChange={(change) => {
              if (change.type !== "statusButton") return;
              setLast(JSON.stringify({ pictureId: change.pictureId, key: change.key, reason: change.reason }));
              setStates((all) => all.map((state, i) => (i + 1 === change.pictureId ? nextState(state, change.key) : state)));
            }}
          />
          <pre className="m-4 p-3 bg-white text-xs" data-testid="last-status-change">
            {last || "Click a status button."}
          </pre>
        </Layout>
      );
    };
    return <StatusDemo />;
  },
};

/** Contact sheet: several stacked references, adjustable number of thumbnails per row. */
export const ContactSheet: Story = {
  render: () => {
    const Sheet = () => {
      const [perRow, setPerRow] = useState(6);
      return (
        <Layout bg="grey" className="min-h-screen">
          <div className="flex items-center gap-6 px-6 py-3 border-b border-grey-strong text-sm">
            <label className="flex items-center gap-3 w-72">
              <span className="whitespace-nowrap">{perRow} per row</span>
              <Slider min={4} max={10} step={1} value={[perRow]} onValueChange={([v]) => setPerRow(v)} />
            </label>
          </div>
          {["7e0125de91", "7e0127dr0x", "5238694"].map((ref, i) => (
            <SheetRow key={ref} refName={ref} index={i} perRow={perRow} />
          ))}
        </Layout>
      );
    };
    const SheetRow = ({ refName, index, perRow }: { refName: string; index: number; perRow: number }) => {
      const props = useReferenceState({
        reference: makeReference(refName, index),
        exports: [{ id: "e", name: "Place des tendances", thumbnails: makeThumbnails(refName, 6 + index * 3) }],
      });
      return (
        <ContactSheetReference
          {...props}
          reference={props.reference!}
          attributes={ATTRIBUTES}
          thumbnailsPerRow={perRow}
        />
      );
    };
    return <Sheet />;
  },
};

// --- Chargement groupé des images ---------------------------------------------

/** Images de démonstration : quelques URLs cassées (404, image corrompue) et une image lente. */
const BROKEN_404 = "/missing/contact-sheet-404.jpg";
const BROKEN_CORRUPT = "data:image/jpeg;base64,AAAAAAAAAAAA";
// Très grande image (plusieurs Mo) : arrive après les autres.
const SLOW_IMAGE = "https://picsum.photos/seed/slow-image/5000/6250";

const loadingThumbnails = (ref: string, count: number, index: number): ContactSheetThumbnail[] =>
  makeThumbnails(ref, count).map((thumb, i) => {
    if (index === 1 && i === 2) return { ...thumb, src: BROKEN_404, filename: `${ref.toUpperCase()}_404.tif` };
    if (index === 1 && i === 4) return { ...thumb, src: BROKEN_CORRUPT, filename: `${ref.toUpperCase()}_corrupt.tif` };
    if (index === 2 && i === 1) return { ...thumb, src: SLOW_IMAGE, filename: `${ref.toUpperCase()}_slow.tif` };
    return thumb;
  });

/**
 * `imageLoading="grouped"`: nothing is requested until a reference comes within 300px of the viewport;
 * each reference then appears at once (short fade) when all its images are loaded and decoded. Scroll
 * down: references load as they approach, visible ones first.
 *
 * - Reference 2 has a 404 and a corrupt image: they show the broken file icon without holding the
 *   others back.
 * - Reference 3 has a very large (slow) image: after 2s the rest of the reference appears, the slow
 *   image follows on its own.
 * - The last reference has 100 thumbnails: it is split by rows (`max(columns × 4, 24)` per block), so
 *   its first rows do not wait for the 100 images.
 *
 * Switch to "native" to compare with the default behaviour; "Reload" replays the loading.
 */
export const GroupedImageLoading: Story = {
  render: () => {
    const Sheet = () => {
      const [mode, setMode] = useState<"native" | "grouped">("grouped");
      const [run, setRun] = useState(0);
      const [perRow, setPerRow] = useState(6);
      const refs = Array.from({ length: 10 }, (_, i) => `loading-${run}-${i}`);
      return (
        <Layout bg="grey" className="min-h-screen">
          <div className="sticky top-0 z-20 flex flex-wrap items-center gap-6 px-6 py-3 border-b border-grey-strong text-sm bg-grey-lighter">
            <label className="flex items-center gap-2">
              imageLoading
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "native" | "grouped")}
                className="border border-grey-strong rounded-sm px-1"
              >
                <option value="grouped">grouped</option>
                <option value="native">native</option>
              </select>
            </label>
            <label className="flex items-center gap-3 w-72">
              <span className="whitespace-nowrap">{perRow} per row</span>
              <Slider min={4} max={10} step={1} value={[perRow]} onValueChange={([v]) => setPerRow(v)} />
            </label>
            <Button variant="secondary" size="small" onClick={() => setRun((r) => r + 1)}>
              Reload
            </Button>
          </div>
          {refs.map((ref, i) => (
            <LoadingRow
              key={`${mode}-${ref}`}
              refName={ref}
              index={i}
              count={i === refs.length - 1 ? 100 : 6 + (i % 3) * 3}
              perRow={perRow}
              mode={mode}
            />
          ))}
        </Layout>
      );
    };
    const LoadingRow = ({
      refName,
      index,
      count,
      perRow,
      mode,
    }: {
      refName: string;
      index: number;
      count: number;
      perRow: number;
      mode: "native" | "grouped";
    }) => {
      const props = useReferenceState({
        reference: makeReference(`REF ${index + 1}`, index),
        exports: [{ id: "e", name: "Place des tendances", thumbnails: loadingThumbnails(refName, count, index) }],
      });
      return (
        <ContactSheetReference
          {...props}
          reference={props.reference!}
          attributes={ATTRIBUTES.slice(0, 2)}
          thumbnailsPerRow={perRow}
          imageLoading={mode}
        />
      );
    };
    return <Sheet />;
  },
};

/** Read-only window with a bounded image cache: old images are evicted while scrolling. */
export const VirtualizedImageCache: Story = {
  render: () => (
    <ContactSheetReference
      reference={{ reference_id: 100, ref: "CACHE-DEMO" }}
      exports={[{ id: "site", thumbnails: makeThumbnails("cache", 240) }]}
      imageLoading="grouped"
      virtualized
      imageCache={{ maxImages: 48, keepAroundRows: 2 }}
    />
  ),
};

/**
 * 3 exports of 300 images, `virtualized` with drag & drop, in the `"separated"` layout (switch to
 * `"grouped"` with the control). Only rows near the viewport are mounted; export headers stay.
 * Grab an image, scroll far away with the wheel and drop it: the drag still ends normally.
 */
export const VirtualizedReorder: Story = {
  render: () => <Playground count={300} exportsCount={3} exportsLayout="separated" virtualized />,
};
