import { isValidElement } from "react";

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

/**
 * Égalité de données : tableaux et objets simples comparés par contenu,
 * tout le reste (fonctions, éléments React, dates, instances) par identité.
 * Une fonction recréée compte donc comme un changement : c'est au parent de
 * passer des callbacks stables (ce que fait la grille de la planche contact).
 */
export function dataEqual(a: unknown, b: unknown, depth = 0): boolean {
  if (Object.is(a, b)) return true;
  if (depth > 5 || isValidElement(a) || isValidElement(b)) return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, index) => dataEqual(item, b[index], depth + 1));
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    return keys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && dataEqual(a[key], b[key], depth + 1));
  }
  return false;
}

/**
 * Comparateur du `React.memo` de Thumbnail : une vignette ne se redessine que
 * si une de ses props change vraiment. Les tableaux et objets reconstruits à
 * chaque rendu par l'application (`actions`, `statusButtons`, `tags`,
 * `comments`, `bench`, `translations`) sont comparés par contenu — clés,
 * libellés, états actif / désactivé ; les callbacks, par identité.
 */
export function areThumbnailPropsEqual<P extends object>(prev: Readonly<P>, next: Readonly<P>): boolean {
  return dataEqual(prev, next);
}
