import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useState } from "react";
import { useClippingScalpel } from "@/hooks/use-clipping-scalpel";
import type { ClippingMark } from "@/lib/clipping";
import { cutToMark } from "@/lib/clipping-scalpel";

// Zoom 1, volet 200×200 centré sur (100,100) : coordonnées écran = coordonnées image.
const vp = { scale: 1, center: { x: 100, y: 100 } };
const pane = { width: 200, height: 200 };

function setup(initial: ClippingMark[] = []) {
  let commits = 0;
  const hook = renderHook(() => {
    const [marks, setMarks] = useState(initial);
    const s = useClippingScalpel({ marks, commit: (next) => { commits++; setMarks(next); } });
    return { marks, s };
  });
  const pt = (x: number, y: number) => ({ p: { x, y }, s: { x, y } });
  return {
    hook,
    commits: () => commits,
    marks: () => hook.result.current.marks,
    cut: (i = 0) => hook.result.current.marks[i] as Required<ClippingMark>,
    click: (x: number, y: number) => act(() => { const { p, s } = pt(x, y); hook.result.current.s.down(p, s, vp, pane); hook.result.current.s.up(vp); }),
    hoverAt: (x: number, y: number) => act(() => { const { p, s } = pt(x, y); hook.result.current.s.move(p, s, vp, pane); }),
    drag: (from: [number, number], to: [number, number]) => {
      act(() => { const { p, s } = pt(...from); hook.result.current.s.down(p, s, vp, pane); });
      act(() => { const { p, s } = pt(...to); hook.result.current.s.move(p, s, vp, pane); });
      act(() => { hook.result.current.s.up(vp); });
    },
    key: (k: string) => act(() => { hook.result.current.s.key(k); }),
  };
}
const line = (id: string, ...xs: number[]) => cutToMark(id, { nodes: xs.map((x) => ({ x, y: 100 })), closed: false });

describe("useClippingScalpel", () => {
  it("un premier clic ne crée qu'un brouillon ; le deuxième écrit le tracé dans l'historique", () => {
    const t = setup();
    t.click(20, 100);
    expect(t.marks()).toHaveLength(0);
    expect(t.hook.result.current.s.view).toHaveLength(1); // le brouillon est visible
    expect(t.hook.result.current.s.connecting).toBe(true);
    t.click(80, 100);
    expect(t.marks()).toHaveLength(1);
    expect(t.cut().nodes).toHaveLength(2);
    expect(t.commits()).toBe(1);
    t.click(150, 60);
    expect(t.cut().nodes).toHaveLength(3);
    expect(t.marks()).toHaveLength(1);
  });

  it("Entrée termine le tracé : le clic suivant en démarre un autre", () => {
    const t = setup();
    t.click(20, 100); t.click(80, 100);
    t.key("Enter");
    expect(t.hook.result.current.s.connecting).toBe(false);
    t.click(20, 30); t.click(80, 30);
    expect(t.marks()).toHaveLength(2);
  });

  it("Échap abandonne un tracé d'un seul point", () => {
    const t = setup();
    t.click(20, 100);
    t.key("Escape");
    expect(t.hook.result.current.s.view).toHaveLength(0);
    expect(t.commits()).toBe(0);
  });

  it("cliquer le dernier nœud (second clic d'un double-clic) termine sans doublon", () => {
    const t = setup();
    t.click(20, 100); t.click(80, 100); t.click(80, 100);
    expect(t.cut().nodes).toHaveLength(2);
    expect(t.hook.result.current.s.connecting).toBe(false);
  });

  it("glisser un nœud le déplace en une seule entrée d'historique", () => {
    const t = setup([line("a", 20, 80, 140)]);
    t.drag([80, 100], [90, 60]);
    expect(t.cut().nodes[1]).toMatchObject({ x: 90, y: 60 });
    expect(t.commits()).toBe(1);
    expect(t.cut().points.length).toBeGreaterThan(3); // points recalculés pour le moteur
  });

  it("un simple clic sur un nœud le sélectionne sans écrire", () => {
    const t = setup([line("a", 20, 80, 140)]);
    t.click(80, 100);
    expect(t.commits()).toBe(0);
  });

  it("le déplacement ne saute pas : le nœud garde son décalage avec le pointeur", () => {
    const t = setup([line("a", 20, 80, 140)]);
    t.drag([84, 100], [94, 100]); // saisi 4 px à droite du centre
    expect(t.cut().nodes[1].x).toBeCloseTo(90);
  });

  it("cliquer sur le chemin crée un nœud qu'on peut déplacer dans le même geste", () => {
    const t = setup([line("a", 20, 140)]);
    t.drag([80, 100], [80, 50]);
    expect(t.cut().nodes).toHaveLength(3);
    expect(t.cut().nodes[1]).toMatchObject({ x: 80, y: 50 });
    expect(t.commits()).toBe(1);
  });

  it("un simple clic sur le chemin ajoute le nœud", () => {
    const t = setup([line("a", 20, 140)]);
    t.click(80, 101);
    expect(t.cut().nodes).toHaveLength(3);
  });

  it("un double-clic sur un nœud le fait passer de courbe à angle, et inversement", () => {
    const t = setup([line("a", 20, 80, 140)]);
    t.click(80, 100); t.click(80, 100);
    expect(t.cut().nodes[1].corner).toBe(true);
    t.click(80, 100); t.click(80, 100);
    expect(t.cut().nodes[1].corner).toBeFalsy();
  });

  it("le bouton en haut à gauche du nœud bascule courbe / angle, celui de droite le supprime", () => {
    const t = setup([line("a", 20, 80, 140)]);
    t.hoverAt(80, 100); // le nœud devient actif : ses boutons apparaissent
    t.click(80 - 14, 100 - 16);
    expect(t.cut().nodes[1].corner).toBe(true);
    t.hoverAt(80, 100);
    t.click(80 + 14, 100 - 16);
    expect(t.cut().nodes.map((n) => n.x)).toEqual([20, 140]);
  });

  it("le bouton reste atteignable : survoler le bouton garde le nœud actif", () => {
    const t = setup([line("a", 20, 80, 140)]);
    t.hoverAt(80, 100);
    t.hoverAt(80 + 14, 100 - 16);
    t.click(80 + 14, 100 - 16);
    expect(t.cut().nodes).toHaveLength(2);
  });

  it("Suppr supprime le nœud sélectionné ; le dernier nœud d'un tracé de deux le supprime entièrement", () => {
    const t = setup([line("a", 20, 140)]);
    t.click(20, 100);
    t.key("Delete");
    expect(t.marks()).toHaveLength(0);
  });

  it("l'anneau d'une extrémité démarre une connexion qui prolonge le tracé", () => {
    const t = setup([line("a", 20, 80)]);
    t.click(80 + 14, 100); // entre le nœud (8 px) et le bord de l'anneau (20 px)
    expect(t.hook.result.current.s.connecting).toBe(true);
    t.click(130, 40);
    expect(t.cut().nodes.map((n) => [n.x, n.y])).toEqual([[20, 100], [80, 100], [130, 40]]);
  });

  it("l'anneau d'un nœud intérieur démarre un nouveau tracé depuis ce point", () => {
    const t = setup([line("a", 20, 80, 140)]);
    t.click(80, 100 + 11); // dans l'anneau serré (8–14 px) du nœud intérieur
    t.click(80, 170);
    expect(t.marks()).toHaveLength(2);
    expect(t.cut(1).nodes[0]).toMatchObject({ x: 80, y: 100 });
  });

  it("relier deux tracés : cliquer l'extrémité d'un autre tracé les soude", () => {
    const t = setup([line("a", 20, 60), { ...line("b", 140, 180) }]);
    t.click(60 + 14, 100); // anneau de l'extrémité droite de a
    t.click(140, 100); // extrémité gauche de b
    expect(t.marks()).toHaveLength(1);
    expect(t.cut().nodes.map((n) => n.x)).toEqual([20, 60, 140, 180]);
  });

  it("fermer un tracé : cliquer sa propre extrémité opposée le referme", () => {
    const t = setup([cutToMark("a", { nodes: [{ x: 40, y: 60 }, { x: 120, y: 60 }, { x: 120, y: 140 }], closed: false })]);
    t.click(120 + 14, 140); // anneau de l'extrémité (120,140)
    t.click(40, 60);
    expect(t.cut().closed).toBe(true);
    expect(t.cut().nodes).toHaveLength(3); // le segment de fermeture relie les deux extrémités, sans nœud en double
  });

  it("déposer une extrémité sur l'extrémité d'un autre tracé les soude", () => {
    const t = setup([line("a", 20, 60), line("b", 140, 180)]);
    t.drag([60, 100], [140, 100]);
    expect(t.marks()).toHaveLength(1);
    expect(t.cut().nodes).toHaveLength(3);
  });

  it("une soudure par glisser-déposer n'écrit qu'une seule entrée d'historique", () => {
    const t = setup([line("a", 20, 60), line("b", 140, 180)]);
    t.drag([60, 100], [140, 100]);
    expect(t.commits()).toBe(1);
  });

  it("zone vide : un clic loin de tout tracé en démarre un nouveau", () => {
    const t = setup([line("a", 20, 80)]);
    t.click(100, 10);
    expect(t.hook.result.current.s.view).toHaveLength(2);
  });

  it("les traits qui ne sont pas des scalpels éditables sont ignorés par les clics", () => {
    const keep: ClippingMark = { id: "k", tool: "keep", size: 20, points: [{ x: 80, y: 100 }] };
    const t = setup([keep]);
    t.click(80, 100);
    expect(t.marks()).toEqual([keep]);
    expect(t.hook.result.current.s.view).toHaveLength(2);
  });
});
