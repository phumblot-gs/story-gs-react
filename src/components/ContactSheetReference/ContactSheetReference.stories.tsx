import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Layout } from "@/components/layout";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { MediaStatus } from "@/utils/mediaStatus";
import { ContactSheetReference, type ContactSheetReferenceProps } from "./ContactSheetReference";
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

Interactions are opt-in: each one appears when its callback is provided — \`onSelectionChange\`
(checkbox), \`onUrgentChange\` (urgent toggle), \`onReferenceUpdate\` (Edit form),
\`onThumbnailChange\` (thumbnail selection, rating, label, tags, comments, validation),
\`onReorder\` (drag & drop).

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
}: {
  refName?: string;
  count?: number;
  exportsCount?: number;
  attributes?: ReferenceAttributeConfig[];
  thumbnailsPerRow?: number;
  exportsLayout?: "grouped" | "separated";
  showControls?: boolean;
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
