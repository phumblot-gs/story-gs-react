import type { ReactNode } from "react";
import type { ThumbnailProps } from "@/components/Thumbnail/Thumbnail";
import type { LabelColor } from "@/components/ui/button-thumbnail-labels";

/**
 * A reference as returned by the `/reference` endpoint. Only `reference_id` and
 * `ref` are guaranteed: any other field may be missing depending on the account
 * and the reference.
 */
export interface ReferenceData {
  reference_id: number;
  ref: string;
  tags?: string[];
  [key: string]: unknown;
}

/**
 * Attribute displayed under the title. The configuration is independent from the
 * data: an attribute configured but missing from the reference is rendered empty.
 */
export interface ReferenceAttributeConfig {
  /**
   * Path of the field in the reference. Dotted notation for nested fields:
   * "brand", "extra.supplier_ref", "eans.0".
   */
  key: string;
  /** Displayed label */
  label: string;
  /** Value formatting (default: arrays joined with ", "). */
  format?: (value: unknown, reference: ReferenceData) => ReactNode;
  /** Field editable in the Edit form. */
  editable?: boolean;
}

/**
 * Thumbnail data: the Thumbnail display props, without its callbacks (replaced by
 * `onThumbnailChange`) nor the props driven by the contact sheet (size, drag).
 */
export type ContactSheetThumbnail = Omit<
  ThumbnailProps,
  | "picture_id"
  | "size"
  | "draggable"
  | "isDragged"
  | "isDragOver"
  | `on${string}`
> & {
  /**
   * Media id. Missing (or -1): empty slot of an expected view ("Empty with view",
   * with `view`). An empty slot can be neither selected nor dragged.
   */
  picture_id?: number;
};

/** One slot of an export after reordering, in display order. */
export interface ContactSheetSlot {
  /** Media in the slot; missing for an empty slot. */
  picture_id?: number;
  /** View code of the slot. View codes are attached to positions and never move. */
  view?: string;
}

/** View change of a media: it moved to a position carrying another view code. */
export interface ReorderViewChange {
  picture_id: number;
  previousView?: string;
  view?: string;
}

/** Summary of a reordering: what has to be applied to the data. */
export interface ReorderDetails {
  /** Media moved by the user (the grabbed group), in display order. */
  movedPictureIds: number[];
  /** Media whose view changed, i.e. every media that changed position. */
  viewChanges: ReorderViewChange[];
}

/**
 * Reordering of an export, called once per drop (one or several thumbnails moved).
 * View codes are attached to positions: they never move, the media do, and each
 * media takes the view code of the position it lands on. The component is
 * controlled: nothing moves on screen until the application passes updated
 * `exports` back.
 *
 * @param exportId The export concerned (a drop never leaves its export).
 * @param pictureIds New order of the media only, empty slots excluded.
 * @param slots Complete final state of the export: every slot, empty ones
 *   included, in display order, with its view. Enough to rebuild `exports`: this
 *   is the source of truth.
 * @param details What changed: moved media and view changes — handy to call the
 *   API only for what is needed.
 *
 * @example
 * ```tsx
 * const handleReorder: ReorderHandler = async (exportId, pictureIds, slots, details) => {
 *   // 1. Local (optimistic) update: rebuild the export from `slots`.
 *   setExports((all) =>
 *     all.map((e) => {
 *       if (e.id !== exportId) return e;
 *       const byId = new Map(e.thumbnails.map((t) => [t.picture_id, t]));
 *       return {
 *         ...e,
 *         thumbnails: slots.map((slot) =>
 *           slot.picture_id !== undefined
 *             ? { ...byId.get(slot.picture_id)!, view: slot.view } // media, with the view of its new position
 *             : { view: slot.view },                                // empty slot
 *         ),
 *       };
 *     }),
 *   );
 *
 *   // 2. Persistence: the order, then the views that changed.
 *   await api.setExportOrder(exportId, pictureIds);
 *   for (const { picture_id, view } of details.viewChanges) {
 *     await api.setPictureView(picture_id, view);
 *   }
 * };
 * ```
 */
export type ReorderHandler = (
  exportId: string | number,
  pictureIds: number[],
  slots: ContactSheetSlot[],
  details: ReorderDetails,
) => void;

/** Empty slot: expected view without media. */
export function isEmptySlot(thumbnail: ContactSheetThumbnail): boolean {
  return !thumbnail.picture_id || thumbnail.picture_id === -1;
}

/** An export and its thumbnails, in display order. */
export interface ContactSheetExport {
  id: string | number;
  /** Name displayed in the badge ("TEST HERMES"); no badge when missing. */
  name?: string;
  thumbnails: ContactSheetThumbnail[];
}

export interface SelectionModifiers {
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

/**
 * Change requested on a thumbnail. A single callback for every case: the parent
 * application switches on `type`.
 */
export type ThumbnailChange = { pictureId: number; exportId: string | number } & (
  | {
      type: "selection";
      selected: boolean;
      modifiers: SelectionModifiers;
      /**
       * Thumbnails to set to `selected`: the clicked one alone, or with Shift the
       * whole range from the last clicked thumbnail (display order).
       */
      pictureIds: number[];
    }
  | { type: "rating"; rating: number }
  | { type: "label"; label: LabelColor }
  | { type: "tagAdd"; tag: string }
  | { type: "tagRemove"; tag: string }
  | { type: "comment"; comment: string }
  | { type: "validate" }
  | { type: "reject"; reason?: string }
  | { type: "open" }
);

/** Interactions enabled on the thumbnails (all by default). */
export interface ThumbnailFeatures {
  selection?: boolean;
  rating?: boolean;
  label?: boolean;
  tags?: boolean;
  comments?: boolean;
  validation?: boolean;
  open?: boolean;
}

/** Changes submitted by the Edit form. */
export interface ReferenceUpdate {
  /** Changed values only, keyed by attribute `key`. */
  values: Record<string, string>;
  /** Full list of tags, when it changed. */
  tags?: string[];
}
