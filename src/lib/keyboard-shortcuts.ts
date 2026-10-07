/** Plateforme Apple : le modificateur des raccourcis y est Cmd, pas Ctrl. */
export const isMacPlatform = (): boolean =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);

/**
 * Raccourci de recherche du navigateur : Cmd+F sur macOS, Ctrl+F ailleurs,
 * sans autre modificateur. Sur macOS, Ctrl+F n'est pas pris : dans un champ de
 * texte, il avance le curseur d'un caractère.
 */
export function isFindShortcut(event: KeyboardEvent, mac = isMacPlatform()): boolean {
  if (event.key.toLowerCase() !== "f" || event.altKey || event.shiftKey) return false;
  return mac ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
}

/**
 * Raccourci « tout sélectionner » : Cmd+A sur macOS, Ctrl+A ailleurs, sans
 * autre modificateur.
 */
export function isSelectAllShortcut(event: KeyboardEvent, mac = isMacPlatform()): boolean {
  if (event.key.toLowerCase() !== "a" || event.altKey || event.shiftKey) return false;
  return mac ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey;
}

// Types d'<input> où l'on saisit du texte (Ctrl+A y sélectionne le texte).
const TEXT_INPUT_TYPES = new Set([
  "text", "search", "email", "url", "tel", "password", "number",
  "date", "datetime-local", "month", "time", "week",
]);

// Rôles ARIA dont l'élément gère lui-même la saisie ou la navigation au clavier.
const KEYBOARD_ROLES = "[role='textbox'],[role='searchbox'],[role='combobox'],[role='listbox'],[role='spinbutton'],[role='grid']";

/**
 * Le focus est sur un élément où Ctrl+A a déjà un sens : champ de saisie,
 * zone de texte, select, autocomplétion, liste, élément éditable.
 */
export function isEditableTarget(element: Element | null): boolean {
  if (!element || !(element instanceof HTMLElement)) return false;
  if (element.isContentEditable) return true;
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) return true;
  if (element instanceof HTMLInputElement) return TEXT_INPUT_TYPES.has(element.type || "text");
  return element.closest(KEYBOARD_ROLES) !== null;
}

/** Une modale, un menu ou une liste déroulante est ouvert : la page derrière n'a pas la main. */
export function hasOpenOverlay(root: ParentNode = document): boolean {
  return (
    root.querySelector(
      "[role='dialog'][data-state='open'],[role='alertdialog'][data-state='open'],[role='dialog'][aria-modal='true'],[role='menu'],[role='listbox']",
    ) !== null
  );
}
