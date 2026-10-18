import React, { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Columns2, Download, Maximize, PanelRight, Redo2, Square, Undo2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import '@/styles/clipping-editor.css';
import { Button } from './button';
import { IconProvider } from './icon-provider';
import { Slider } from './slider';
import { Spinner } from './spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { BgProvider } from '@/components/layout/BgContext';
import { useTranslationSafe } from '@/contexts/TranslationContext';
import { traceCut, useClippingScalpel } from '@/hooks/use-clipping-scalpel';
import { isScalpelMark, markToCut } from '@/lib/clipping-scalpel';
import type { TranslationMap } from '@/utils/translations';
import {
  applyAlphaMask, clippingHistoryReducer, shouldSegment, createClippingHistory, densifyPoints, fitViewport, isBrushTool, isPencilTool, newMarkId, panViewport,
  pencilMode, selectionState, screenToImage, imageToScreen, zoomViewport, clampScale,
  type ClippingMark, type ClippingMask, type ClippingPoint, type ClippingSegmenter, type ClippingTool, type ClippingViewport,
} from '@/lib/clipping';

export type { ClippingMark, ClippingMask, ClippingNode, ClippingPoint, ClippingSegmentRequest, ClippingSegmenter, ClippingSelectionMode, ClippingTool } from '@/lib/clipping';

export interface ClippingEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  /** Image à détourer. Une URL d'un autre domaine doit autoriser CORS (le détourage lit ses pixels). */
  src: string;
  /** Nom du fichier affiché dans le header et base du nom exporté. */
  fileName?: string;
  /** Moteur de détourage : reçoit les traits, renvoie le masque alpha. Appelé après chaque modification des traits. */
  onSegment: ClippingSegmenter;
  /** Traits initiaux (par exemple repris d'une session précédente). */
  defaultMarks?: ClippingMark[];
  onMarksChange?: (marks: ClippingMark[]) => void;
  /** Reçoit le PNG détouré à la taille de l'image source. Sans cette prop, le navigateur télécharge le fichier. */
  onDownload?: (blob: Blob, fileName: string) => void | Promise<void>;
  /** Affiche le bouton de fermeture quand il est fourni. */
  onClose?: () => void;
  defaultTool?: ClippingTool;
  /** Diamètre initial du pinceau, en pixels de l'image source. */
  defaultBrushSize?: number;
  defaultView?: 'single' | 'split';
  /** Affiche les réglages contextuels et les informations du fichier (défaut true). */
  defaultSettingsOpen?: boolean;
  /**
   * Also calls `onSegment` with an empty list of marks, so the engine's automatic cut-out is shown as soon as the
   * image opens (and after every mark is undone). The user then corrects it with strokes. Default false.
   */
  autoSegment?: boolean;
  language?: string;
  translations?: Partial<TranslationMap>;
}

type Status = 'idle' | 'working' | 'ready' | 'error';
type Source = { img: HTMLImageElement; pixels: ImageData };
type PaneSize = { width: number; height: number };
type PaneEvent = { x: number; y: number; size: PaneSize; event: React.PointerEvent<HTMLCanvasElement> };

/** Pixels écran par pixel CSS (2 sur un écran Retina) : « 100 % » est un pixel image pour un pixel écran, comme dans Photoshop. */
const devicePixelRatio = () => (typeof window !== 'undefined' && window.devicePixelRatio) || 1;

/**
 * Place le repère image dans le canvas. À un zoom entier en pixels écran (100 %, 200 %…), l'image est calée sur la grille de
 * pixels écran et dessinée sans lissage : sinon un décalage d'un demi-pixel flouterait tout le bord (Photoshop cale aussi
 * l'image sur les pixels à 100 %). Entre deux, le lissage reste actif.
 */
function applyViewTransform(ctx: CanvasRenderingContext2D, size: PaneSize, vp: ClippingViewport) {
  const dpr = devicePixelRatio();
  const device = vp.scale * dpr;
  const whole = device >= 1 && Math.abs(device - Math.round(device)) < 1e-3;
  let tx = size.width / 2 - vp.center.x * vp.scale;
  let ty = size.height / 2 - vp.center.y * vp.scale;
  if (whole) { tx = Math.round(tx * dpr) / dpr; ty = Math.round(ty * dpr) / dpr; }
  ctx.translate(tx, ty); ctx.scale(vp.scale, vp.scale);
  ctx.imageSmoothingEnabled = !whole && device < 2; // pixels francs aux zooms entiers (100 % inclus) et dès 200 %, lissé entre deux
}

/** Couleurs des traits : valeurs des tokens figma (green, red-strong, pastel-blue) ; un canvas ne lit pas les variables CSS. */
const MARK_COLORS: Partial<Record<ClippingMark['tool'], string>> = { keep: '#89cc52', remove: '#dd3733', hair: '#f5c518', scalpel: '#74d4da', pencil: '#74d4da' };
/** Couleur du tracé de sélection selon son mode : remplace (cyan), Pencil+ (vert), Pencil− (rouge). */
const PENCIL_COLORS = { replace: '#74d4da', add: '#89cc52', subtract: '#dd3733' } as const;
const FEATHER_MAX = 60;
const BRUSH_MIN = 2;
const BRUSH_MAX = 200;
/** Pas de zoom des boutons et de PageUp / PageDown, et déplacement d'une flèche (Maj : 1 px), en pixels écran. */
const ZOOM_STEP = 1.2;
const ARROW_STEP = 50;
/** Épaisseurs du tracé de scalpel, en pixels écran : contour noir + trait de couleur. */
const CUT_OUTER = 6;
const CUT_INNER = 3.5;
const CHECKER: React.CSSProperties = {
  backgroundColor: '#fff',
  backgroundImage: 'conic-gradient(#e6e6e6 25%, transparent 0 50%, #e6e6e6 0 75%, transparent 0)',
  backgroundSize: '16px 16px',
};

const TOOL_ICONS: Record<ClippingTool, React.ReactNode> = {
  keep: <IconProvider icon="Plus" size={20} />,
  remove: <IconProvider icon="Minus" size={20} />,
  hair: <IconProvider icon="Highlighter" size={20} />,
  eraser: <IconProvider icon="Eraser" size={20} />,
  pencil: <IconProvider icon="Selection" size={20} />,
  pencilAdd: <IconProvider icon="SelectionAdd" size={20} />,
  pencilSub: <IconProvider icon="SelectionSubtract" size={20} />,
  scalpel: <IconProvider icon="Selection" size={20} />,
  pan: <IconProvider icon="Hand" size={20} />,
};
const TOOL_KEYS: Record<ClippingTool, string> = { keep: '␣', remove: '␣', hair: 'V', eraser: 'X', pencil: 'S', pencilAdd: 'A', pencilSub: 'D', scalpel: 'S', pan: 'C' };

export function ClippingEditor({
  src, fileName, onSegment, defaultMarks, onMarksChange, onDownload, onClose, defaultTool = 'keep', defaultBrushSize = 20,
  defaultView = 'split', defaultSettingsOpen = true, autoSegment = false, language, translations, className, onKeyDown, ...props
}: ClippingEditorProps) {
  const { t } = useTranslationSafe(translations, language);
  const [history, dispatch] = useReducer(clippingHistoryReducer, defaultMarks, createClippingHistory);
  const [tool, setTool] = useState<ClippingTool>(defaultTool === 'scalpel' ? 'pencil' : defaultTool);
  const [feather, setFeather] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(defaultSettingsOpen);
  const [brush, setBrush] = useState(Math.min(BRUSH_MAX, Math.max(BRUSH_MIN, defaultBrushSize)));
  const [view, setView] = useState<'single' | 'split'>(defaultView);
  const [showPreview, setShowPreview] = useState(false);
  const [viewport, setViewport] = useState<ClippingViewport | null>(null); // null = ajusté à la fenêtre
  const [source, setSource] = useState<Source | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [mask, setMask] = useState<ClippingMask | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [downloadFailed, setDownloadFailed] = useState(false);
  const [stroke, setStroke] = useState<ClippingPoint[] | null>(null);
  const [hover, setHover] = useState<ClippingPoint | null>(null);
  const [panning, setPanning] = useState(false);
  const [shiftHeld, setShiftHeld] = useState(false);
  const [peekOriginal, setPeekOriginal] = useState(false);
  const selection = useMemo(() => selectionState(history.present), [history.present]);
  const liveIds = useMemo(() => new Set(selection.ops.map((m) => m.id)), [selection]);
  const scalpel = useClippingScalpel({
    marks: history.present, commit: (marks) => dispatch({ type: 'set', marks }), mode: pencilMode(tool),
    // Seuls les tracés de la sélection en vigueur (après le dernier « désélectionner ») sont montrés et modifiables ; l'ancien scalpel reste visible.
    visible: (mark) => mark.tool === 'scalpel' || liveIds.has(mark.id) || !history.present.some((m) => m.id === mark.id),
  });

  const paneSize = useRef<PaneSize>({ width: 1, height: 1 });
  const [, setMeasured] = useState(''); // re-render once the panes are measured: the zoom readout depends on their size
  const drag = useRef<{ kind: 'pan'; x: number; y: number } | { kind: 'stroke'; tool: ClippingTool; points: ClippingPoint[] } | null>(null);
  const onSegmentRef = useRef(onSegment);
  onSegmentRef.current = onSegment;
  const onMarksChangeRef = useRef(onMarksChange);
  onMarksChangeRef.current = onMarksChange;

  // --- Chargement de l'image ------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    setSource(null); setLoadFailed(false); setMask(null); setStatus('idle');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('2d context unavailable');
        ctx.drawImage(img, 0, 0);
        setSource({ img, pixels: ctx.getImageData(0, 0, canvas.width, canvas.height) });
      } catch {
        setLoadFailed(true);
      }
    };
    img.onerror = () => { if (!cancelled) setLoadFailed(true); };
    img.src = src;
    return () => { cancelled = true; };
  }, [src]);

  // --- Détourage : une demande par état de traits, la précédente est annulée -
  useEffect(() => {
    if (!source) return;
    const marks = history.present;
    if (!shouldSegment(marks, autoSegment)) { setMask(null); setStatus('idle'); return; }
    const controller = new AbortController();
    setStatus('working');
    const timer = setTimeout(() => {
      onSegmentRef.current({ marks, width: source.pixels.width, height: source.pixels.height, signal: controller.signal })
        .then((result) => {
          if (controller.signal.aborted) return;
          if (result.width !== source.pixels.width || result.height !== source.pixels.height) throw new RangeError('Mask size mismatch');
          setMask(result); setStatus('ready');
        })
        .catch(() => { if (!controller.signal.aborted) setStatus('error'); });
    }, 120);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [history.present, source, autoSegment]);

  const firstMarks = useRef(true);
  useEffect(() => {
    if (firstMarks.current) { firstMarks.current = false; return; }
    onMarksChangeRef.current?.(history.present);
  }, [history.present]);

  // --- Image détourée (RGBA × masque) ---------------------------------------
  const cutout = useMemo(() => {
    if (!source) return null;
    const canvas = document.createElement('canvas');
    canvas.width = source.pixels.width; canvas.height = source.pixels.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const rgba = mask ? applyAlphaMask(source.pixels.data, mask) : source.pixels.data;
    ctx.putImageData(new ImageData(new Uint8ClampedArray(rgba), canvas.width, canvas.height), 0, 0);
    return canvas;
  }, [source, mask]);

  useEffect(() => { if (!isPencilTool(tool)) scalpel.reset(); }, [tool]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Viewport -------------------------------------------------------------
  const imageSize = useMemo(() => (source ? { width: source.pixels.width, height: source.pixels.height } : null), [source]);
  const resolveViewport = useCallback((size: PaneSize): ClippingViewport => viewport ?? fitViewport(size, imageSize ?? { width: 1, height: 1 }), [viewport, imageSize]);
  /** Zoom en pourcentage de pixels écran (100 % : un pixel image pour un pixel écran), centré sur le milieu de la vue actuelle. */
  const zoomTo = (percent: number, size: PaneSize = paneSize.current) =>
    setViewport({ scale: clampScale(percent / 100 / devicePixelRatio()), center: resolveViewport(size).center });
  const zoomBy = (factor: number, size: PaneSize = paneSize.current, x?: number, y?: number) =>
    setViewport(zoomViewport(resolveViewport(size), size, factor, x, y));

  // --- Dessin ---------------------------------------------------------------
  const drawMarks = (ctx: CanvasRenderingContext2D, size: PaneSize) => {
    if (!source) return;
    const vp = resolveViewport(size);
    ctx.save();
    applyViewTransform(ctx, size, vp);
    ctx.drawImage(source.img, 0, 0);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const paint = (points: ClippingPoint[], width: number, color: string, alpha: number, dash?: number[]) => {
      ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash ?? []);
      if (points.length === 1) { ctx.beginPath(); ctx.arc(points[0].x, points[0].y, width / 2, 0, Math.PI * 2); ctx.fill(); return; }
      ctx.beginPath(); points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))); ctx.stroke();
    };
    const view = scalpel.view;
    const erases = view.some((m) => m.tool === 'erase');
    // La gomme efface l'effet des traits précédents : on les compose sur un calque pour pouvoir les « percer ».
    let layer: CanvasRenderingContext2D = ctx;
    let off: HTMLCanvasElement | null = null;
    if (erases) {
      off = document.createElement('canvas'); off.width = ctx.canvas.width; off.height = ctx.canvas.height;
      const octx = off.getContext('2d');
      if (octx) { octx.setTransform(ctx.getTransform()); octx.lineCap = 'round'; octx.lineJoin = 'round'; layer = octx; }
    }
    const paintOn = (target: CanvasRenderingContext2D, points: ClippingPoint[], width: number, color: string, alpha: number) => {
      target.globalAlpha = alpha; target.strokeStyle = color; target.fillStyle = color; target.lineWidth = width; target.setLineDash([]);
      if (points.length === 1) { target.beginPath(); target.arc(points[0].x, points[0].y, width / 2, 0, Math.PI * 2); target.fill(); return; }
      target.beginPath(); points.forEach((p, i) => (i === 0 ? target.moveTo(p.x, p.y) : target.lineTo(p.x, p.y))); target.stroke();
    };
    for (const mark of view) {
      if (mark.tool === 'erase') { layer.globalCompositeOperation = 'destination-out'; paintOn(layer, mark.points, mark.size, '#000', 1); layer.globalCompositeOperation = 'source-over'; continue; }
      const color = MARK_COLORS[mark.tool];
      if (color && (mark.tool === 'keep' || mark.tool === 'remove' || mark.tool === 'hair')) paintOn(layer, mark.points, mark.size, color, 0.55);
    }
    if (off) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.drawImage(off, 0, 0); ctx.restore(); }
    const selectionOutline = (mark: ClippingMark & { nodes: NonNullable<ClippingMark['nodes']> }) => {
      if (!(mark.tool === 'scalpel' || liveIds.has(mark.id) || !history.present.some((m) => m.id === mark.id))) return;
      // Contour du tracé : courbe lissée, contour noir puis trait de couleur (cyan, vert pour Pencil+, rouge pour Pencil−).
      traceCut(ctx, markToCut(mark));
      if (mark.closed || (mark.tool === 'pencil' && mark.nodes.length >= 3)) ctx.closePath(); // la sélection se referme en ligne droite, comme dans le moteur
      ctx.globalAlpha = 1; ctx.setLineDash([]);
      ctx.lineWidth = CUT_OUTER / vp.scale; ctx.strokeStyle = '#000'; ctx.stroke();
      ctx.lineWidth = CUT_INNER / vp.scale; ctx.strokeStyle = mark.tool === 'pencil' ? PENCIL_COLORS[mark.mode ?? 'replace'] : scalpel.cutColor; ctx.stroke();
    };
    for (const mark of view) {
      if (isScalpelMark(mark)) selectionOutline(mark);
      else if (mark.tool === 'scalpel') paint(mark.points, CUT_INNER / vp.scale, MARK_COLORS.scalpel ?? '#74d4da', 1);
    }
    if (stroke && stroke.length > 0 && (isBrushTool(tool) || tool === 'eraser')) {
      if (tool === 'eraser') paint(stroke, brush, 'rgba(255,255,255,0.8)', 0.5);
      else paint(stroke, brush, MARK_COLORS[tool] ?? '#fff', 0.55);
    }
    const viewTransform = ctx.getTransform();
    ctx.restore();
    if (selection.active) {
      // Hors de la sélection : voile sombre (le calque de sélection est recomposé à chaque rendu : union, soustraction, inversion).
      const w = ctx.canvas.width, h = ctx.canvas.height;
      const sel = document.createElement('canvas'); sel.width = w; sel.height = h;
      const sctx = sel.getContext('2d');
      if (sctx) {
        const tf = viewTransform;
        for (const op of selection.ops) {
          if (op.tool === 'invert') { sctx.save(); sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.globalCompositeOperation = 'xor'; sctx.fillStyle = '#000'; sctx.fillRect(0, 0, w, h); sctx.restore(); continue; }
          const mode = op.mode ?? 'replace';
          const live = view.find((m) => m.id === op.id) ?? op;
          if (live.points.length < 3) continue;
          if (mode === 'replace') { sctx.save(); sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.clearRect(0, 0, w, h); sctx.restore(); }
          sctx.setTransform(tf); sctx.globalCompositeOperation = mode === 'subtract' ? 'destination-out' : 'source-over'; sctx.fillStyle = '#000';
          sctx.beginPath(); live.points.forEach((p, i) => (i === 0 ? sctx.moveTo(p.x, p.y) : sctx.lineTo(p.x, p.y))); sctx.closePath(); sctx.fill();
        }
        const dim = document.createElement('canvas'); dim.width = w; dim.height = h;
        const dctx = dim.getContext('2d');
        if (dctx) {
          dctx.fillStyle = 'rgba(0,0,0,0.38)'; dctx.fillRect(0, 0, w, h);
          dctx.globalCompositeOperation = 'destination-out'; dctx.drawImage(sel, 0, 0);
          ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(dim, 0, 0); ctx.restore();
        }
      }
    }
    if (isPencilTool(effectiveTool)) scalpel.drawOverlay(ctx, vp, size, hover);
    if (hover && !panning && !shiftHeld && tool !== 'pan' && !isPencilTool(tool)) {
      const c = imageToScreen(vp, size, hover);
      ctx.beginPath(); ctx.arc(c.x, c.y, Math.max(2, (brush / 2) * vp.scale), 0, Math.PI * 2);
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.stroke();
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(41,40,40,0.9)'; ctx.stroke();
    }
  };
  const drawPreview = (ctx: CanvasRenderingContext2D, size: PaneSize) => {
    if (!source || !cutout) return;
    const vp = resolveViewport(size);
    ctx.save();
    applyViewTransform(ctx, size, vp);
    ctx.drawImage(peekOriginal && view === 'split' ? source.img : cutout, 0, 0);
    ctx.restore();
  };

  // --- Interactions ---------------------------------------------------------
  const effectiveTool: ClippingTool = shiftHeld ? 'pan' : tool;
  const onPointerDown = (pane: 'marks' | 'preview') => ({ x, y, size, event }: PaneEvent) => {
    if (!source) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    rootRef.current?.focus({ preventScroll: true });
    const drawing = pane === 'marks' && event.button === 0 && effectiveTool !== 'pan';
    if (!drawing) {
      drag.current = { kind: 'pan', x, y }; setPanning(true);
      setViewport(resolveViewport(size));
      return;
    }
    const vp = resolveViewport(size);
    const p = screenToImage(vp, size, x, y);
    if (isPencilTool(effectiveTool)) { scalpel.down(p, { x, y }, vp, size); return; }
    drag.current = { kind: 'stroke', tool: effectiveTool, points: [p] };
    setStroke([p]);
  };
  const onPointerMove = (pane: 'marks' | 'preview') => ({ x, y, size }: PaneEvent) => {
    const d = drag.current;
    if (d?.kind === 'pan') {
      setViewport((vp) => panViewport(vp ?? resolveViewport(size), x - d.x, y - d.y));
      d.x = x; d.y = y;
      return;
    }
    if (pane !== 'marks') return;
    const vp = resolveViewport(size);
    const p = screenToImage(vp, size, x, y);
    setHover(p);
    if (isPencilTool(effectiveTool)) { scalpel.move(p, { x, y }, vp, size); return; }
    if (d?.kind === 'stroke') { d.points.push(p); setStroke([...d.points]); }
  };
  const endPointer = ({ event, size }: PaneEvent) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    const d = drag.current;
    drag.current = null; setPanning(false);
    if (isPencilTool(effectiveTool) && d?.kind !== 'pan') { scalpel.up(resolveViewport(size)); return; }
    if (d?.kind !== 'stroke') return;
    setStroke(null);
    const points = densifyPoints(d.points, Math.max(1, brush / 2));
    // Sans sélection, la gomme supprime les traits touchés ; dans une sélection, elle ne défait que ce qui s'y trouve (marque `erase`).
    if (d.tool === 'eraser') {
      if (selection.active) dispatch({ type: 'add', mark: { id: newMarkId(), tool: 'erase', size: brush, points } });
      else dispatch({ type: 'erase', points, size: brush });
    } else if (isBrushTool(d.tool)) dispatch({ type: 'add', mark: { id: newMarkId(), tool: d.tool, size: brush, points } });
  };
  const onWheel = ({ x, y, size, deltaY }: { x: number; y: number; size: PaneSize; deltaY: number }) =>
    zoomBy(Math.exp(-deltaY * 0.0015), size, x, y);

  const rootRef = useRef<HTMLDivElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'Shift') { setShiftHeld(true); return; }
    const target = e.target as HTMLElement;
    // Le curseur du pinceau (role slider) garde ses flèches ; les boutons gardent Espace et Entrée.
    if (target.getAttribute('role') === 'slider') return;
    const onButton = target !== e.currentTarget && !(target instanceof HTMLCanvasElement);
    const key = e.key.toLowerCase();
    const mod = e.metaKey || e.ctrlKey;
    if (mod && key === 'z') { e.preventDefault(); dispatch({ type: e.shiftKey ? 'redo' : 'undo' }); return; }
    // Alt est requis pour taper [ et ] sur un clavier AZERTY : il ne doit pas bloquer ces touches.
    if (mod || (e.altKey && key !== '[' && key !== ']')) return;
    const pan = (dx: number, dy: number) => {
      e.preventDefault();
      const step = e.shiftKey ? 1 : ARROW_STEP;
      setViewport(panViewport(resolveViewport(paneSize.current), dx * step, dy * step));
    };
    switch (e.key) {
      case 'ArrowLeft': return pan(1, 0);
      case 'ArrowRight': return pan(-1, 0);
      case 'ArrowUp': return pan(0, 1);
      case 'ArrowDown': return pan(0, -1);
      case 'PageUp': e.preventDefault(); return zoomBy(ZOOM_STEP);
      case 'PageDown': e.preventDefault(); return zoomBy(1 / ZOOM_STEP);
      case 'Home': e.preventDefault(); return setViewport(null);
      case 'Escape': case 'Enter': case 'Delete': case 'Backspace':
        if (!onButton && isPencilTool(effectiveTool) && scalpel.key(e.key)) e.preventDefault();
        return;
    }
    switch (key) {
      case ' ': if (onButton) return; e.preventDefault(); setTool((current) => (current === 'keep' ? 'remove' : 'keep')); break;
      case 'v': setTool('hair'); break;
      case 'x': setTool('eraser'); break;
      case 's': setTool('pencil'); break;
      case 'a': setTool('pencilAdd'); break;
      case 'd': setTool('pencilSub'); break;
      case 'c': setTool('pan'); break;
      case 'z': dispatch({ type: e.shiftKey ? 'redo' : 'undo' }); break;
      case 'y': dispatch({ type: 'redo' }); break;
      case 'q': setPeekOriginal(true); break;
      case '0': zoomTo(100); break;
      case '-': case '[': setBrush((b) => Math.max(BRUSH_MIN, Math.min(b - 1, Math.round(b / ZOOM_STEP)))); break;
      case '+': case '=': case ']': setBrush((b) => Math.min(BRUSH_MAX, Math.max(b + 1, Math.round(b * ZOOM_STEP)))); break;
      case '1': setView('single'); break;
      case '2': setView('split'); break;
    }
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Shift') setShiftHeld(false);
    if (e.key.toLowerCase() === 'q') setPeekOriginal(false);
  };

  const download = async () => {
    if (!cutout) return;
    setDownloadFailed(false);
    try {
      const blob = await new Promise<Blob>((resolve, reject) => cutout.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/png'));
      const name = `${(fileName ?? 'image').replace(/\.[^./\\]+$/, '')}-clipped.png`;
      if (onDownload) await onDownload(blob, name);
      else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = name; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 0);
      }
    } catch {
      setDownloadFailed(true);
    }
  };

  // --- Rendu ----------------------------------------------------------------
  const withKey = (tk: ClippingTool) => {
    const key = tk === 'keep' || tk === 'remove' ? t('clipping.shortcut.space') : TOOL_KEYS[tk];
    return t('clipping.shortcut', { label: t(`clipping.tool.${tk}`), key });
  };
  /** Actions sur la sélection : marques sans trait, rejouées dans l'ordre par le moteur (Supprimer garde l'adoucissement choisi). */
  const addSelectionMark = (kind: 'invert' | 'deselect' | 'delete') =>
    dispatch({ type: 'add', mark: { id: newMarkId(), tool: kind, size: 1, points: [], ...(kind === 'delete' && feather > 0 ? { feather } : {}) } });
  const zoomLevel = resolveViewport(paneSize.current).scale * devicePixelRatio() * 100;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  // Vue simple : Q maintenu affiche l'autre image. Vue partagée : l'aperçu montre l'original (voir drawPreview).
  const previewShown = view === 'single' && peekOriginal ? !showPreview : showPreview;
  const showMarksPane = view === 'split' || !previewShown;
  const showPreviewPane = view === 'split' || previewShown;
  const cursor = panning ? 'grabbing' : effectiveTool === 'pan' ? 'grab' : isPencilTool(effectiveTool) ? scalpel.cursor : 'none';
  const statusText = loadFailed ? t('clipping.loadError') : !source ? t('clipping.loading')
    : downloadFailed ? t('clipping.downloadError')
      : status === 'working' ? t('clipping.working') : status === 'error' ? t('clipping.segmentError') : status === 'ready' ? t('clipping.ready') : '';

  const toolSetting = (tk: ClippingTool) => {
    const selectionSetting = isPencilTool(tk);
    const label = t(selectionSetting ? 'clipping.selection.feather' : 'clipping.brushSize');
    const value = selectionSetting ? feather : brush;
    return <label className="gs-clipping-setting">
      <span className="gs-clipping-setting-label"><span>{label}</span><output className="tabular-nums">{value}px</output></span>
      <Slider min={selectionSetting ? 0 : BRUSH_MIN} max={selectionSetting ? FEATHER_MAX : BRUSH_MAX} step={1} value={[value]} aria-label={label} onValueChange={([v]) => selectionSetting ? setFeather(v) : setBrush(v)} />
    </label>;
  };
  const iconButton = (label: string, icon: React.ReactNode, onClick: () => void, opts: { pressed?: boolean; disabled?: boolean; selectionIcon?: boolean; rail?: boolean } = {}) => <Tooltip>
    <TooltipTrigger asChild>
      <Button type="button" variant={opts.pressed ? 'inverse' : opts.rail ? 'ghost' : 'secondary'} size="medium" className={cn('h-[40px] w-[40px] shrink-0 p-0 [&_svg]:!h-[20px] [&_svg]:!w-[20px]', opts.rail && 'rounded-none')} aria-label={label} aria-pressed={opts.pressed} disabled={opts.disabled} onClick={onClick}>{icon}</Button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>;

  const selectionToolActive = isPencilTool(effectiveTool);
  const downloadButton = <Button type="button" size="medium" disabled={!cutout || status === 'working' || status === 'error' || loadFailed} onClick={() => void download()}>
    <Download size={16} aria-hidden="true" />{t('clipping.download')}
  </Button>;
  const toolButton = (tk: ClippingTool) => <div key={tk} className="gs-clipping-tool">
    {iconButton(withKey(tk), TOOL_ICONS[tk], () => setTool(tk), { pressed: effectiveTool === tk, selectionIcon: isPencilTool(tk), rail: true })}
    {(tk === 'keep' || tk === 'remove') && <span className={cn('gs-clipping-tool-dot', tk === 'keep' ? 'bg-green' : 'bg-red-strong')} aria-hidden="true" />}
  </div>;

  return (
    <TooltipProvider delayDuration={300}>
      <BgProvider value="white">
        <div
          ref={rootRef} tabIndex={0} data-bg="white" data-gs-clipping-editor
          className={cn('gs-clipping-editor relative flex h-full w-full flex-col bg-white outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
          onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onBlur={() => { setShiftHeld(false); setPeekOriginal(false); }}
          onPointerEnter={() => { if (!document.activeElement || document.activeElement === document.body) rootRef.current?.focus({ preventScroll: true }); }} {...props}
        >
          <div className="gs-clipping-header" role="toolbar" aria-label={t('clipping.displayToolbar')}>
            <div className="gs-clipping-heading"><h2 className="m-0 text-lg font-medium">{t('clipping.title')}</h2>{fileName && <span className="gs-clipping-file-name text-grey-strongest" title={fileName}>{fileName}</span>}</div>
            <div className="gs-clipping-control-group">
              {iconButton(t('clipping.zoomOut'), <ZoomOut size={20} aria-hidden="true" />, () => zoomBy(1 / ZOOM_STEP))}
              <span className="gs-clipping-zoom tabular-nums" role="status" aria-label={t('clipping.zoomLevel')} data-testid="clipping-zoom">{zoomLevel < 10 ? zoomLevel.toFixed(1) : Math.round(zoomLevel)}%</span>
              {iconButton(t('clipping.zoomIn'), <ZoomIn size={20} aria-hidden="true" />, () => zoomBy(ZOOM_STEP))}
              <Button type="button" variant="secondary" aria-label={`${t('clipping.zoomFit')} (Home)`} onClick={() => setViewport(null)}><Maximize size={16} aria-hidden="true" />{t('clipping.fit')}</Button>
              <Button type="button" variant={Math.abs(zoomLevel - 100) < 0.5 ? 'inverse' : 'secondary'} aria-label={`${t('clipping.zoomActual')} (0)`} aria-pressed={Math.abs(zoomLevel - 100) < 0.5} onClick={() => zoomTo(100)}>1:1</Button>
            </div>
            <div className="gs-clipping-control-group">
              {iconButton(t('clipping.shortcut', { label: t('clipping.view.single'), key: '1' }), <Square size={20} aria-hidden="true" />, () => setView('single'), { pressed: view === 'single' })}
              {iconButton(t('clipping.shortcut', { label: t('clipping.view.split'), key: '2' }), <Columns2 size={20} aria-hidden="true" />, () => setView('split'), { pressed: view === 'split' })}
              {view === 'single' && <Button type="button" variant="secondary" onClick={() => setShowPreview(v => !v)}>{showPreview ? t('clipping.showOriginal') : t('clipping.showPreview')}</Button>}
              {iconButton(t('clipping.settings'), <PanelRight size={20} aria-hidden="true" />, () => setSettingsOpen(v => !v), { pressed: settingsOpen })}
              {onClose && iconButton(t('clipping.close'), <X size={20} aria-hidden="true" />, onClose)}
            </div>
          </div>

          <div className="gs-clipping-workspace">
            <div className="gs-clipping-stage">
              <div role="toolbar" aria-label={t('clipping.toolbar')} aria-orientation="vertical" className="gs-clipping-tools">
                <div className="gs-clipping-main-tool">{toolButton('pan')}</div>
                <div className="gs-clipping-tool-group">{(['keep', 'remove', 'hair', 'eraser'] as const).map(toolButton)}</div>
                <div className="gs-clipping-tool-group">{(['pencil', 'pencilAdd', 'pencilSub'] as const).map(toolButton)}
                  {selectionToolActive && <div className="gs-clipping-selection-actions" role="group" aria-label={t('clipping.selection.actions')}>
                    {iconButton(t('clipping.selection.invert'), <IconProvider icon="SelectionInvert" size={20} />, () => addSelectionMark('invert'), { disabled: !selection.active, selectionIcon: true, rail: true })}
                    {iconButton(t('clipping.selection.delete'), <IconProvider icon="SelectionDelete" size={20} />, () => addSelectionMark('delete'), { disabled: !selection.active, selectionIcon: true, rail: true })}
                    {iconButton(t('clipping.selection.deselect'), <IconProvider icon="SelectionDeselect" size={20} />, () => addSelectionMark('deselect'), { disabled: !selection.active, selectionIcon: true, rail: true })}
                  </div>}
                </div>
                <div className="gs-clipping-history">
                  {iconButton(`${t('clipping.undo')} (Z)`, <Undo2 size={20} aria-hidden="true" />, () => dispatch({ type: 'undo' }), { disabled: !canUndo, rail: true })}
                  {iconButton(`${t('clipping.redo')} (Y)`, <Redo2 size={20} aria-hidden="true" />, () => dispatch({ type: 'redo' }), { disabled: !canRedo, rail: true })}
                </div>
              </div>
              <div className={cn('gs-clipping-panes', view === 'single' && 'gs-clipping-panes-single')}>
                {showMarksPane && <Pane title={t('clipping.pane.marks')} ariaLabel={t('clipping.canvas.marks')} cursor={cursor}
                  action={(effectiveTool === 'hair' || effectiveTool === 'eraser' || selectionToolActive) ? <div className="gs-clipping-pane-setting">{toolSetting(effectiveTool)}</div> : undefined}
                  draw={drawMarks} sizeRef={paneSize} onMeasure={sz => setMeasured(`${sz.width}x${sz.height}`)} onPointerDown={onPointerDown('marks')} onPointerMove={onPointerMove('marks')}
                  onPointerUp={endPointer} onPointerLeave={() => setHover(null)} onWheel={onWheel} />}
                {showPreviewPane && <Pane title={t('clipping.pane.preview')} ariaLabel={t('clipping.canvas.preview')} action={downloadButton}
                  cursor={panning ? 'grabbing' : 'grab'} checker draw={drawPreview} sizeRef={paneSize} onMeasure={sz => setMeasured(`${sz.width}x${sz.height}`)}
                  onPointerDown={onPointerDown('preview')} onPointerMove={onPointerMove('preview')} onPointerUp={endPointer} onWheel={onWheel} />}
              </div>
              {(!source || status === 'working' || status === 'error' || downloadFailed) && <div className="gs-clipping-notice" role={loadFailed || status === 'error' || downloadFailed ? 'alert' : 'status'}>
                {!loadFailed && status !== 'error' && !downloadFailed && <Spinner size={16} decorative />}{statusText}
              </div>}
            </div>
            {settingsOpen && <aside className="gs-clipping-settings" aria-label={t('clipping.settings')}>
              <div className="gs-clipping-tool-settings">
                <h3 className="m-0 text-base font-medium">{t('clipping.activeTool')}</h3>
                <span>{t(`clipping.tool.${effectiveTool}`)}</span>
                {(effectiveTool === 'keep' || effectiveTool === 'remove') && toolSetting(effectiveTool)}
              </div>
              <details className="gs-clipping-file-info"><summary>{t('clipping.fileInfo')}</summary><dl>
                {fileName && <div><dt>{t('clipping.fileName')}</dt><dd className="break-all">{fileName}</dd></div>}
                {imageSize && <div><dt>{t('clipping.fileDimensions')}</dt><dd>{t('clipping.dimensions', imageSize)}</dd></div>}
                <div><dt>{t('clipping.output')}</dt><dd>{t('clipping.outputFormat')}</dd></div>
              </dl></details>
            </aside>}
          </div>
          <span role="status" aria-live="polite" className="sr-only">{status === 'ready' ? statusText : ''}</span>
        </div>
      </BgProvider>
    </TooltipProvider>
  );
}

interface PaneProps {
  title: string;
  ariaLabel: string;
  action?: React.ReactNode;
  cursor: string;
  checker?: boolean;
  draw: (ctx: CanvasRenderingContext2D, size: PaneSize) => void;
  sizeRef: React.MutableRefObject<PaneSize>;
  onMeasure?: (size: PaneSize) => void;
  onPointerDown: (e: PaneEvent) => void;
  onPointerMove: (e: PaneEvent) => void;
  onPointerUp: (e: PaneEvent) => void;
  onPointerLeave?: () => void;
  onWheel: (e: { x: number; y: number; size: PaneSize; deltaY: number }) => void;
}

/** Volet à canvas : mesure son conteneur, redessine à chaque rendu et traduit les événements en pixels du volet. */
function Pane({ title, ariaLabel, action, cursor, checker, draw, sizeRef, onMeasure, onPointerDown, onPointerMove, onPointerUp, onPointerLeave, onWheel }: PaneProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<PaneSize>({ width: 1, height: 1 });
  const wheelRef = useRef(onWheel);
  wheelRef.current = onWheel;

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    // Taille mesurée en pixels écran entiers : si le canvas avait un pixel de moins ou de plus que sa boîte CSS, le navigateur
    // l'étirerait (rééchantillonnage) et flouterait toute l'image d'une fraction de pixel, surtout visible à 100 %.
    const measure = (entry?: ResizeObserverEntry) => {
      const r = el.getBoundingClientRect();
      const dpr = devicePixelRatio();
      const box = entry?.devicePixelContentBoxSize?.[0];
      // The exact device-pixel box when the browser reports one that agrees with the layout box (emulated densities may not).
      const exact = (reported: number | undefined, css: number) => (reported !== undefined && Math.abs(reported - css * dpr) <= 2 ? reported : css * dpr);
      const dw = Math.max(1, Math.round(exact(box?.inlineSize, r.width)));
      const dh = Math.max(1, Math.round(exact(box?.blockSize, r.height)));
      const next = { width: dw / dpr, height: dh / dpr };
      setSize((prev) => (prev.width === next.width && prev.height === next.height ? prev : next));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => measure(entries[0]));
    try { observer.observe(el, { box: 'device-pixel-content-box' }); } catch { observer.observe(el); }
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    sizeRef.current = size;
    onMeasure?.(size);
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    if (el.width !== Math.round(size.width * dpr) || el.height !== Math.round(size.height * dpr)) {
      el.width = Math.round(size.width * dpr); el.height = Math.round(size.height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size.width, size.height);
    draw(ctx, size);
  });

  // La molette doit pouvoir annuler le défilement de la page : écouteur non passif.
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const listener = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      wheelRef.current({ x: e.clientX - r.left, y: e.clientY - r.top, size: { width: r.width, height: r.height }, deltaY: e.deltaY });
    };
    el.addEventListener('wheel', listener, { passive: false });
    return () => el.removeEventListener('wheel', listener);
  }, []);

  const local = (event: React.PointerEvent<HTMLCanvasElement>): PaneEvent => {
    const r = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - r.left, y: event.clientY - r.top, size: { width: r.width, height: r.height }, event };
  };

  return (
    <div className="gs-clipping-pane">
      <div className="gs-clipping-pane-header"><span>{title}</span>{action}</div>
      <div ref={host} className="gs-clipping-pane-canvas" style={checker ? CHECKER : undefined}>
        <canvas
          ref={canvas} role="img" aria-label={ariaLabel} className="absolute inset-0 h-full w-full touch-none" style={{ cursor }}
          onPointerDown={(e) => onPointerDown(local(e))} onPointerMove={(e) => onPointerMove(local(e))}
          onPointerUp={(e) => onPointerUp(local(e))} onPointerCancel={(e) => onPointerUp(local(e))} onPointerLeave={onPointerLeave}
        />
      </div>
    </div>
  );
}
