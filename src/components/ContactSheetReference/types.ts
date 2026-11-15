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
  /** Short label of the reference; when not blank, it is the displayed title (see `getReferenceDisplayName`). */
  smalltext?: string | null;
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
 *
 * `imagePending` / `imageFadeIn` are driven by the grid (`imageLoading="grouped"`).
 *
 * `statusButtons` (the buttons under the thumbnail: ✗ / ✓, broadcast, restore…) is
 * passed per thumbnail, usually 0 to 2 (3 still fit), decided by the application. A
 * click is reported as a `statusButton` change. As soon as one thumbnail of the
 * reference has `statusButtons`, the button row is reserved for all of them so
 * that the rows stay aligned.
 */
export type ContactSheetThumbnail = Omit<
  ThumbnailProps,
  | "picture_id"
  | "size"
  | "draggable"
  | "isDragged"
  | "isDragOver"
  | "imagePending"
  | "imageFadeIn"
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
  /**
   * Media whose view code changed, only. A media moved between two slots carrying the
   * same view code is not listed: to detect pure position changes, compare `slots` (or
   * `pictureIds`) with the previous order, or use `movedPictureIds`.
   */
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

/** See `ThumbnailChange` (`type: "selection"`). */
export type SelectionMode = "single" | "toggle" | "range" | "clear";

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
      /**
       * How to apply the change. `applySelectionChange` does it for you:
       * - `"single"`: click on the thumbnail footer. The clicked thumbnail becomes the
       *   only selected one; if it already was, the selection is emptied.
       * - `"toggle"`: checkbox, or Ctrl+click (Cmd+click on Mac). Adds or removes the
       *   clicked thumbnail, the rest of the selection is kept (other references included).
       * - `"range"`: Shift+click. Adds `pictureIds`, the range from the anchor (last click
       *   without Shift, in the same grid) to the clicked thumbnail; removes
       *   `deselectPictureIds`, the part of the previous range from the same anchor that
       *   the new range no longer covers. Without an anchor in this grid: `"single"`.
       * - `"clear"`: Escape, nothing else handled the key. Empty the whole selection.
       */
      mode: SelectionMode;
      /**
       * New state of the clicked thumbnail as a plain toggle would give it (`true` for a
       * range, `false` for clear). Kept for applications that set `selected` on
       * `pictureIds` without reading `mode`: they keep the previous toggle behaviour.
       */
      selected: boolean;
      modifiers: SelectionModifiers;
      /**
       * Thumbnails concerned: the clicked one, the range with Shift, the selected
       * thumbnails of this grid for `"clear"`.
       */
      pictureIds: number[];
      /** `"range"` only: thumbnails of the previous range to deselect (may be empty). */
      deselectPictureIds?: number[];
    }
  | { type: "rating"; rating: number }
  | { type: "label"; label: LabelColor }
  | { type: "tagAdd"; tag: string }
  | { type: "tagRemove"; tag: string }
  /**
   * Comment typed in the thumbnail's comment menu. Return a promise from
   * `onThumbnailChange` to keep the field disabled until it settles: if it
   * rejects, the text and the menu stay open with an error message.
   */
  | { type: "comment"; comment: string }
  /** Click on a status button (`statusButtons`); `reason` = rejection reason picked in the menu. */
  | { type: "statusButton"; key: string; reason?: string }
  /** @deprecated Legacy validate button; use `statusButtons` and the `statusButton` change. */
  | { type: "validate" }
  /** @deprecated Legacy reject button; use `statusButtons` and the `statusButton` change. */
  | { type: "reject"; reason?: string }
  /**
   * Click on the image (`features.open`). Also sent, whatever `features.open`, by a click on a thumbnail without a
   * preview (no `src`, or image in error): the application can fetch the thumbnail again.
   */
  | { type: "open" }
);

/** Interactions enabled on the thumbnails (all by default). */
export interface ThumbnailFeatures {
  selection?: boolean;
  rating?: boolean;
  label?: boolean;
  tags?: boolean;
  comments?: boolean;
  /**
   * Legacy validate / reject buttons (onValidate / onReject) on thumbnails without
   * `statusButtons`. Status buttons given as data (`statusButtons`) are shown
   * regardless of this flag.
   * @deprecated Pass `statusButtons` per thumbnail instead.
   */
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
