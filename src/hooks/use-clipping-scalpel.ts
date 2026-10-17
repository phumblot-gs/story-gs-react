import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  imageToScreen, newMarkId, type ClippingMark, type ClippingPoint, type ClippingSelectionMode, type ClippingViewport,
} from '@/lib/clipping';
import {
  SCALPEL_MARK_SIZE, canSnap, closeCut, cutToMark, deleteNode, extendCut, hitTestCuts, insertNode, isEndNode, isScalpelMark, joinCuts,
  markToCut, moveNode, segmentBezier, segmentCount, toggleCorner, type ScalpelCut, type ScalpelRadii,
} from '@/lib/clipping-scalpel';

/** Dimensions des poignées, en pixels écran : elles ne grossissent pas avec le zoom. */
const PX = { node: 8, ring: 20, ringInterior: 14, segment: 7, button: 8, buttonDx: 14, buttonDy: 16, dragThreshold: 3, doubleClickMs: 400 };
const CUT_COLOR = '#74d4da';
const DELETE_COLOR = '#dd3733';

type Pane = { width: number; height: number };
type Screen = { x: number; y: number };
type NodeRef = { id: string; index: number };
type Button = 'corner' | 'delete';

const radii = (scale: number): ScalpelRadii => ({
  node: PX.node / scale, ring: PX.ring / scale, ringInterior: PX.ringInterior / scale, segment: PX.segment / scale,
});
const sameRef = (a: NodeRef | null, b: NodeRef | null) => a === b || (!!a && !!b && a.id === b.id && a.index === b.index);

/** Trace le chemin d'un tracé dans le repère image ; l'appelant choisit l'épaisseur et la couleur. */
export function traceCut(ctx: CanvasRenderingContext2D, cut: ScalpelCut) {
  const { nodes } = cut;
  if (nodes.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(nodes[0].x, nodes[0].y);
  for (let i = 0; i < segmentCount(cut); i++) {
    const [, c1, c2, p1] = segmentBezier(cut, i);
    ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p1.x, p1.y);
  }
}

/**
 * Interactions du scalpel : poser des nœuds, les déplacer, ajouter un nœud sur
 * le chemin, relier des extrémités, passer un nœud de courbe à angle, le
 * supprimer. Les modifications intermédiaires vivent dans un brouillon ; une
 * seule entrée d'historique est écrite à la fin de chaque geste.
 */
export function useClippingScalpel({ marks, commit, mode = 'replace', visible }: {
  marks: ClippingMark[]; commit: (marks: ClippingMark[]) => void;
  /** Mode des nouveaux tracés (Pencil, Pencil+, Pencil−). */
  mode?: ClippingSelectionMode;
  /** Tracés montrés et modifiables (ceux de la sélection en vigueur) ; tous par défaut. */
  visible?: (mark: ClippingMark) => boolean;
}) {
  const [draft, setDraft] = useState<ClippingMark | null>(null);
  const [connecting, setConnecting] = useState<NodeRef | null>(null);
  const [selected, setSelected] = useState<NodeRef | null>(null);
  const [hot, setHot] = useState<NodeRef | null>(null);
  const [cursor, setCursor] = useState('crosshair');
  const drag = useRef<{ id: string; index: number; origin: ScalpelCut; cut: ScalpelCut; offset: ClippingPoint; start: Screen; moved: boolean; inserted: boolean } | null>(null);
  const lastNodeClick = useRef<(NodeRef & { time: number }) | null>(null);

  /** Traits affichés : ceux de l'historique, avec le brouillon à la place de son original. */
  const view = useMemo(() => {
    if (!draft) return marks;
    return marks.some((m) => m.id === draft.id) ? marks.map((m) => (m.id === draft.id ? draft : m)) : [...marks, draft];
  }, [marks, draft]);

  const latest = useRef({ view, marks, connecting, hot, selected, mode, visible });
  latest.current = { view, marks, connecting, hot, selected, mode, visible };

  // Un annuler / rétablir peut supprimer le tracé en cours d'édition.
  useEffect(() => {
    const exists = (r: NodeRef | null) => !r || view.some((m) => m.id === r.id && isScalpelMark(m) && r.index < m.nodes.length);
    if (!exists(connecting)) setConnecting(null);
    if (!exists(selected)) setSelected(null);
    if (!exists(hot)) setHot(null);
  }, [view, connecting, selected, hot]);

  const targets = () => latest.current.view.filter(isScalpelMark).filter((m) => latest.current.visible?.(m) ?? true).map((m) => ({ id: m.id, cut: markToCut(m) }));
  const cutOf = (id: string) => targets().find((t) => t.id === id)?.cut ?? null;

  /** Écrit un tracé (ou le supprime avec `null`). Un tracé d'un seul nœud reste brouillon : il n'entre dans l'historique qu'à son deuxième nœud. */
  const write = (id: string, cut: ScalpelCut | null, removeIds: string[] = []) => {
    const { marks: current } = latest.current;
    const old = current.find((m) => m.id === id);
    const tool = old?.tool === 'scalpel' ? 'scalpel' : 'pencil';
    const make = (c: ScalpelCut) => cutToMark(id, c, old?.mode ?? latest.current.mode, tool);
    if (cut && cut.nodes.length < 2) { setDraft(make(cut)); return; }
    setDraft(null);
    if (!cut && !old && removeIds.length === 0) return;
    let next = cut ? (old ? current.map((m) => (m.id === id ? make(cut) : m)) : [...current, make(cut)]) : current.filter((m) => m.id !== id);
    if (removeIds.length) next = next.filter((m) => !removeIds.includes(m.id));
    commit(next);
  };

  /** Brouillon d'un tracé en cours de modification : garde l'outil et le mode de l'original. */
  const draftOf = (id: string, cut: ScalpelCut): ClippingMark => {
    const m = latest.current.view.find((x) => x.id === id);
    return { id, tool: m?.tool === 'scalpel' ? 'scalpel' : 'pencil', size: SCALPEL_MARK_SIZE, nodes: cut.nodes, closed: cut.closed, points: [], ...(m?.mode ? { mode: m.mode } : {}) };
  };

  const finish = useCallback(() => {
    setConnecting(null);
    setDraft((d) => (d && (d.nodes?.length ?? 0) < 2 ? null : d));
  }, []);

  const reset = useCallback(() => {
    drag.current = null; lastNodeClick.current = null;
    setHot(null); setSelected(null); setCursor('crosshair');
    finish();
  }, [finish]);

  const buttonAt = (node: NodeRef | null, vp: ClippingViewport, pane: Pane, s: Screen): Button | null => {
    if (!node) return null;
    const cut = cutOf(node.id);
    const n = cut?.nodes[node.index];
    if (!n) return null;
    const c = imageToScreen(vp, pane, n);
    const reach = PX.button + 2;
    if (Math.hypot(s.x - (c.x - PX.buttonDx), s.y - (c.y - PX.buttonDy)) <= reach) return 'corner';
    if (Math.hypot(s.x - (c.x + PX.buttonDx), s.y - (c.y - PX.buttonDy)) <= reach) return 'delete';
    return null;
  };

  const applyButton = (node: NodeRef, button: Button) => {
    const cut = cutOf(node.id);
    if (!cut) return;
    if (button === 'corner') { write(node.id, toggleCorner(cut, node.index)); return; }
    write(node.id, deleteNode(cut, node.index));
    setSelected(null); setHot(null);
    if (latest.current.connecting?.id === node.id) setConnecting(null);
  };

  const down = (p: ClippingPoint, s: Screen, vp: ClippingViewport, pane: Pane): void => {
    const r = radii(vp.scale);
    const { connecting: link, hot: hotNode, selected: selectedNode } = latest.current;
    const active = hotNode ?? selectedNode;
    const button = buttonAt(active, vp, pane, s);
    if (active && button) { applyButton(active, button); return; }

    const all = targets();
    const found = hitTestCuts(all, p, r);

    if (link) {
      const cut = cutOf(link.id);
      if (!cut) { setConnecting(null); return; }
      if (found?.hit.zone === 'node' && found.id === link.id && found.hit.index === link.index) { finish(); return; } // second clic sur le dernier nœud
      if (found?.hit.zone === 'node') {
        const other = all.find((t) => t.id === found.id)!.cut;
        const target = other.nodes[found.hit.index];
        if (canSnap(cut, link.index, other, found.hit.index, 1)) {
          const ext = extendCut(cut, link.index, target);
          if (found.id === link.id) {
            const into = ext.index === 0 ? found.hit.index + 1 : found.hit.index;
            write(link.id, closeCut(ext.cut, ext.index, into));
          } else {
            write(link.id, joinCuts(ext.cut, ext.index, other, found.hit.index), [found.id]);
          }
          setConnecting(null);
        }
        return; // nœud intérieur : une connexion n'y est pas possible
      }
      const ext = extendCut(cut, link.index, p);
      write(link.id, ext.cut);
      setConnecting({ id: link.id, index: ext.index });
      return;
    }

    if (found?.hit.zone === 'node') {
      const { id, hit } = found;
      const now = Date.now();
      const prev = lastNodeClick.current;
      lastNodeClick.current = { id, index: hit.index, time: now };
      const cut = all.find((t) => t.id === id)!.cut;
      if (prev && prev.id === id && prev.index === hit.index && now - prev.time < PX.doubleClickMs) {
        lastNodeClick.current = null;
        write(id, toggleCorner(cut, hit.index));
        setSelected({ id, index: hit.index });
        return;
      }
      const n = cut.nodes[hit.index];
      drag.current = { id, index: hit.index, origin: cut, cut, offset: { x: n.x - p.x, y: n.y - p.y }, start: s, moved: false, inserted: false };
      setSelected({ id, index: hit.index });
      return;
    }
    if (found?.hit.zone === 'ring') {
      const { id, hit } = found;
      const cut = all.find((t) => t.id === id)!.cut;
      if (isEndNode(cut, hit.index) || cut.nodes.length === 1) { setConnecting({ id, index: hit.index }); setSelected(null); return; }
      // Nœud intérieur : on démarre un nouveau tracé depuis ce point.
      const n = cut.nodes[hit.index];
      const newId = newMarkId();
      setDraft(cutToMark(newId, { nodes: [{ x: n.x, y: n.y, corner: n.corner }], closed: false }, latest.current.mode));
      setConnecting({ id: newId, index: 0 }); setSelected(null);
      return;
    }
    if (found?.hit.zone === 'segment') {
      const { id, hit } = found;
      const cut = all.find((t) => t.id === id)!.cut;
      const ins = insertNode(cut, hit.index, hit.point);
      setDraft(draftOf(id, ins.cut));
      drag.current = { id, index: ins.index, origin: ins.cut, cut: ins.cut, offset: { x: 0, y: 0 }, start: s, moved: false, inserted: true };
      setSelected({ id, index: ins.index });
      return;
    }
    // Zone vide : premier nœud d'un nouveau tracé, que les clics suivants prolongent.
    const id = newMarkId();
    setDraft(cutToMark(id, { nodes: [{ x: p.x, y: p.y }], closed: false }, latest.current.mode));
    setConnecting({ id, index: 0 }); setSelected({ id, index: 0 });
  };

  const move = (p: ClippingPoint, s: Screen, vp: ClippingViewport, pane: Pane): void => {
    const d = drag.current;
    if (d) {
      if (!d.moved && Math.hypot(s.x - d.start.x, s.y - d.start.y) < PX.dragThreshold) return;
      d.moved = true;
      d.cut = moveNode(d.origin, d.index, { x: p.x + d.offset.x, y: p.y + d.offset.y });
      setDraft(draftOf(d.id, d.cut));
      setCursor('move');
      return;
    }
    const { hot: hotNode, selected: selectedNode, connecting: link } = latest.current;
    const active = hotNode ?? selectedNode;
    if (buttonAt(active, vp, pane, s)) { setCursor('pointer'); return; } // on garde le nœud actif pour atteindre ses boutons
    const found = hitTestCuts(targets(), p, radii(vp.scale));
    const next = found && found.hit.zone !== 'segment' ? { id: found.id, index: found.hit.index } : null;
    setHot((current) => (sameRef(current, next) ? current : next));
    setCursor(found?.hit.zone === 'node' ? 'move' : found?.hit.zone === 'ring' ? 'cell' : found?.hit.zone === 'segment' ? 'copy' : link ? 'crosshair' : 'crosshair');
  };

  const up = (vp: ClippingViewport): void => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved && !d.inserted) { setDraft(null); return; }
    const cut = d.cut;
    // Déposer une extrémité sur une autre extrémité les soude.
    if (isEndNode(cut, d.index)) {
      const here = cut.nodes[d.index];
      for (const t of targets()) {
        const other = t.id === d.id ? cut : t.cut;
        for (let j = 0; j < other.nodes.length; j++) {
          if ((t.id === d.id && j === d.index) || !isEndNode(other, j)) continue;
          if (Math.hypot(other.nodes[j].x - here.x, other.nodes[j].y - here.y) > PX.node / vp.scale) continue;
          if (!canSnap(cut, d.index, other, j)) continue;
          if (t.id === d.id) write(d.id, closeCut(cut, d.index, j));
          else write(d.id, joinCuts(cut, d.index, other, j), [t.id]);
          return;
        }
      }
    }
    write(d.id, cut);
  };

  const key = (k: string): boolean => {
    const { connecting: link, hot: hotNode, selected: selectedNode } = latest.current;
    if (k === 'Escape' || k === 'Enter') {
      if (!link && !selectedNode) return false;
      finish(); if (k === 'Escape') setSelected(null);
      return true;
    }
    if (k === 'Delete' || k === 'Backspace') {
      const node = selectedNode ?? hotNode;
      if (!node) return false;
      applyButton(node, 'delete');
      return true;
    }
    return false;
  };

  const drawOverlay = (ctx: CanvasRenderingContext2D, vp: ClippingViewport, pane: Pane, pointer: ClippingPoint | null) => {
    ctx.save();
    ctx.setLineDash([]); ctx.lineJoin = 'round';
    const active = hot ?? selected;
    for (const mark of view) {
      if (!isScalpelMark(mark) || !(visible?.(mark) ?? true)) continue;
      mark.nodes.forEach((n, i) => {
        const c = imageToScreen(vp, pane, n);
        const isSelected = selected?.id === mark.id && selected.index === i;
        ctx.beginPath();
        if (n.corner) ctx.rect(c.x - 5, c.y - 5, 10, 10); else ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? CUT_COLOR : '#fff'; ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = '#000'; ctx.stroke();
      });
    }
    if (connecting && pointer) {
      const cut = cutOf(connecting.id);
      const from = cut?.nodes[connecting.index];
      if (from) {
        const a = imageToScreen(vp, pane, from);
        const b = imageToScreen(vp, pane, pointer);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.setLineDash([6, 5]); ctx.stroke();
        ctx.lineWidth = 1.5; ctx.strokeStyle = '#000'; ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    const activeCut = active ? cutOf(active.id) : null;
    const node = activeCut?.nodes[active!.index];
    if (activeCut && node && !drag.current?.moved) {
      const c = imageToScreen(vp, pane, node);
      const ring = isEndNode(activeCut, active!.index) || activeCut.nodes.length === 1 ? PX.ring : PX.ringInterior;
      ctx.beginPath(); ctx.arc(c.x, c.y, ring, 0, Math.PI * 2);
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
      // Bouton « courbe / angle » : montre la forme vers laquelle le nœud va basculer.
      const bx = c.x - PX.buttonDx, by = c.y - PX.buttonDy;
      ctx.beginPath(); ctx.arc(bx, by, PX.button, 0, Math.PI * 2);
      ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = '#000'; ctx.stroke();
      ctx.beginPath();
      if (node.corner) ctx.arc(bx, by, 3.5, 0, Math.PI * 2); else ctx.rect(bx - 3.5, by - 3.5, 7, 7);
      ctx.fillStyle = '#000'; ctx.fill();
      // Bouton « supprimer ».
      const dx = c.x + PX.buttonDx, dy = c.y - PX.buttonDy;
      ctx.beginPath(); ctx.arc(dx, dy, PX.button, 0, Math.PI * 2);
      ctx.fillStyle = DELETE_COLOR; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = '#000'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(dx - 3.5, dy - 3.5); ctx.lineTo(dx + 3.5, dy + 3.5); ctx.moveTo(dx + 3.5, dy - 3.5); ctx.lineTo(dx - 3.5, dy + 3.5);
      ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
    }
    ctx.restore();
  };

  return { view, cursor, connecting: !!connecting, down, move, up, key, reset, finish, drawOverlay, cutColor: CUT_COLOR };
}
