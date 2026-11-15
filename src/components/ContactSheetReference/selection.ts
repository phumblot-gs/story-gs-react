import type { ThumbnailChange } from "./types";

type SelectionChange = Extract<ThumbnailChange, { type: "selection" }>;

/**
 * New selection after a `selection` change of a contact sheet (`ContactSheetReference`,
 * `ContactSheetPicture`). Pure: returns a new set, `selected` is not modified.
 *
 * `toId` maps a `picture_id` to the identifier the application stores (default: the
 * `picture_id` itself); return `undefined` to ignore a media.
 *
 * ```ts
 * onThumbnailChange={(change) => {
 *   if (change.type === "selection") setSelected((current) => applySelectionChange(current, change));
 * }}
 * ```
 */
export function applySelectionChange<Id = number>(
  selected: ReadonlySet<Id>,
  change: SelectionChange,
  toId: (pictureId: number) => Id | undefined = (pictureId) => pictureId as unknown as Id,
): Set<Id> {
  const ids = (pictureIds: readonly number[] = []) =>
    pictureIds.map(toId).filter((id): id is Id => id !== undefined);
  const next = new Set(selected);

  switch (change.mode) {
    case "clear":
      return new Set();
    case "single": {
      const id = toId(change.pictureId);
      if (id === undefined) return next;
      // Clicked again while it is the only selected one: the selection is emptied.
      return selected.size === 1 && selected.has(id) ? new Set() : new Set([id]);
    }
    case "range":
      ids(change.deselectPictureIds).forEach((id) => next.delete(id));
      ids(change.pictureIds).forEach((id) => next.add(id));
      return next;
    case "toggle":
    default:
      // Without `mode` (older event): the previous behaviour, `selected` on `pictureIds`.
      ids(change.pictureIds).forEach((id) => (change.selected ? next.add(id) : next.delete(id)));
      return next;
  }
}
