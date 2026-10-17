import type { ClippingMask, ClippingSegmenter } from "./clipping";

/** Côté maximal de la grille de travail : le coût est en pixels × prototypes. */
const WORK_SIDE = 320;
const MAX_PROTOTYPES = 160;

type Rgb = [number, number, number];

/**
 * Moteur de démonstration : classe chaque pixel selon sa proximité en couleur
 * avec les pixels sous les traits « Garder » et « Retirer ». Il sert aux
 * stories, aux tests et de repli hors ligne ; la qualité d'un vrai moteur de
 * détourage (cheveux, ombres, bords) n'est pas son objectif.
 *
 * Sans trait « Retirer », le pourtour de l'image est pris comme fond.
 */
export function createColorClippingSegmenter(image: { width: number; height: number; data: Uint8ClampedArray }): ClippingSegmenter {
  return async ({ marks, signal }) => {
    const scale = Math.min(1, WORK_SIDE / Math.max(image.width, image.height));
    const w = Math.max(1, Math.round(image.width * scale));
    const h = Math.max(1, Math.round(image.height * scale));
    const px = (x: number, y: number): Rgb => {
      const sx = Math.min(image.width - 1, Math.floor(x / scale));
      const sy = Math.min(image.height - 1, Math.floor(y / scale));
      const i = (sy * image.width + sx) * 4;
      return [image.data[i], image.data[i + 1], image.data[i + 2]];
    };

    // Étiquettes imposées par les traits : 1 = garder, 2 = retirer, 0 = libre.
    const forced = new Uint8Array(w * h);
    const keep: Rgb[] = [];
    const remove: Rgb[] = [];
    for (const mark of marks) {
      if (mark.tool === "scalpel") continue; // une coupe n'a pas de couleur propre
      const label = mark.tool === "remove" ? 2 : 1;
      const r = Math.max(1, (mark.size / 2) * scale);
      for (const p of mark.points) stamp(forced, w, h, p.x * scale, p.y * scale, r, label, label === 2 ? remove : keep, px);
    }
    if (remove.length === 0) {
      for (let x = 0; x < w; x++) { remove.push(px(x, 0), px(x, h - 1)); }
      for (let y = 0; y < h; y++) { remove.push(px(0, y), px(w - 1, y)); }
    }
    if (keep.length === 0) keep.push(px(w / 2, h / 2));
    const keepProto = thin(keep);
    const removeProto = thin(remove);
    if (signal.aborted) throw new DOMException("Aborted", "AbortError");

    const small = new Uint8ClampedArray(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const k = y * w + x;
        if (forced[k]) { small[k] = forced[k] === 1 ? 255 : 0; continue; }
        const c = px(x, y);
        const dk = nearest(c, keepProto);
        const dr = nearest(c, removeProto);
        small[k] = Math.round((255 * dr) / (dk + dr + 1e-6));
      }
      if ((y & 31) === 0) {
        await Promise.resolve(); // laisse la main au navigateur
        if (signal.aborted) throw new DOMException("Aborted", "AbortError");
      }
    }
    return upscale(small, w, h, image.width, image.height);
  };
}

function stamp(forced: Uint8Array, w: number, h: number, cx: number, cy: number, r: number, label: number, into: Rgb[], px: (x: number, y: number) => Rgb) {
  const x0 = Math.max(0, Math.floor(cx - r));
  const x1 = Math.min(w - 1, Math.ceil(cx + r));
  const y0 = Math.max(0, Math.floor(cy - r));
  const y1 = Math.min(h - 1, Math.ceil(cy + r));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if ((x - cx) ** 2 + (y - cy) ** 2 > r * r) continue;
      forced[y * w + x] = label;
      into.push(px(x, y));
    }
  }
}

/** Garde au plus MAX_PROTOTYPES couleurs, régulièrement espacées. */
function thin(colors: Rgb[]): Rgb[] {
  if (colors.length <= MAX_PROTOTYPES) return colors;
  const step = colors.length / MAX_PROTOTYPES;
  return Array.from({ length: MAX_PROTOTYPES }, (_, i) => colors[Math.floor(i * step)]);
}

function nearest(c: Rgb, protos: Rgb[]): number {
  let best = Infinity;
  for (const p of protos) {
    const d = (c[0] - p[0]) ** 2 + (c[1] - p[1]) ** 2 + (c[2] - p[2]) ** 2;
    if (d < best) best = d;
  }
  return Math.sqrt(best);
}

/** Agrandissement bilinéaire du masque de travail à la taille de l'image. */
function upscale(src: Uint8ClampedArray, sw: number, sh: number, dw: number, dh: number): ClippingMask {
  const alpha = new Uint8ClampedArray(dw * dh);
  for (let y = 0; y < dh; y++) {
    const fy = Math.min(sh - 1, (y + 0.5) * (sh / dh) - 0.5);
    const y0 = Math.max(0, Math.floor(fy));
    const y1 = Math.min(sh - 1, y0 + 1);
    const ty = Math.max(0, fy - y0);
    for (let x = 0; x < dw; x++) {
      const fx = Math.min(sw - 1, (x + 0.5) * (sw / dw) - 0.5);
      const x0 = Math.max(0, Math.floor(fx));
      const x1 = Math.min(sw - 1, x0 + 1);
      const tx = Math.max(0, fx - x0);
      const top = src[y0 * sw + x0] * (1 - tx) + src[y0 * sw + x1] * tx;
      const bottom = src[y1 * sw + x0] * (1 - tx) + src[y1 * sw + x1] * tx;
      alpha[y * dw + x] = top * (1 - ty) + bottom * ty;
    }
  }
  return { width: dw, height: dh, alpha };
}
