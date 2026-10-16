import React, { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Brush, Columns2, Download, Eraser, Hand, Maximize, Minus, Plus, Redo2, Scissors, Square, Undo2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Slider } from './slider';
import { Spinner } from './spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { BgProvider } from '@/components/layout/BgContext';
import { useTranslationSafe } from '@/contexts/TranslationContext';
import { traceCut, useClippingScalpel } from '@/hooks/use-clipping-scalpel';
import { isScalpelMark, markToCut } from '@/lib/clipping-scalpel';
import type { TranslationMap } from '@/utils/translations';
import {
  applyAlphaMask, clippingHistoryReducer, createClippingHistory, densifyPoints, fitViewport, isMarkTool, newMarkId, panViewport,
  screenToImage, imageToScreen, zoomViewport,
  type ClippingMark, type ClippingMask, type ClippingPoint, type ClippingSegmenter, type ClippingTool, type ClippingViewport,
} from '@/lib/clipping';

export type { ClippingMark, ClippingMask, ClippingSegmenter, ClippingTool } from '@/lib/clipping';

export interface ClippingEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  /** Image à détourer. Une URL d'un autre domaine doit autoriser CORS (le détourage lit ses pixels). */
  src: string;
  /** Nom du fichier affiché sous l'image et base du nom exporté. */
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
  language?: string;
  translations?: Partial<TranslationMap>;
}

type Status = 'idle' | 'working' | 'ready' | 'error';
type Source = { img: HTMLImageElement; pixels: ImageData };
type PaneSize = { width: number; height: number };
type PaneEvent = { x: number; y: number; size: PaneSize; event: React.PointerEvent<HTMLCanvasElement> };

/** Couleurs des traits : valeurs des tokens figma (green, red-strong, pastel-blue) ; un canvas ne lit pas les variables CSS. */
const MARK_COLORS: Record<ClippingMark['tool'], string> = { keep: '#89cc52', remove: '#dd3733', hair: '#f5c518', scalpel: '#74d4da' };
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
  keep: <Plus size={14} aria-hidden="true" />,
  remove: <Minus size={14} aria-hidden="true" />,
  hair: <Brush size={14} aria-hidden="true" />,
  eraser: <Eraser size={14} aria-hidden="true" />,
  scalpel: <Scissors size={14} aria-hidden="true" />,
  pan: <Hand size={14} aria-hidden="true" />,
};
const TOOL_KEYS: Record<ClippingTool, string> = { keep: '␣', remove: '␣', hair: 'V', eraser: 'X', scalpel: 'S', pan: 'C' };
const TOOL_ORDER: ClippingTool[] = ['keep', 'remove', 'hair', 'eraser', 'scalpel', 'pan'];

export function ClippingEditor({
  src, fileName, onSegment, defaultMarks, onMarksChange, onDownload, onClose, defaultTool = 'keep', defaultBrushSize = 20,
  defaultView = 'split', language, translations, className, onKeyDown, ...props
}: ClippingEditorProps) {
  const { t } = useTranslationSafe(translations, language);
  const [history, dispatch] = useReducer(clippingHistoryReducer, defaultMarks, createClippingHistory);
  const [tool, setTool] = useState<ClippingTool>(defaultTool);
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
  const scalpel = useClippingScalpel({ marks: history.present, commit: (marks) => dispatch({ type: 'set', marks }) });

  const paneSize = useRef<PaneSize>({ width: 1, height: 1 });
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
    if (marks.length === 0) { setMask(null); setStatus('idle'); return; }
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
  }, [history.present, source]);

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

  useEffect(() => { if (tool !== 'scalpel') scalpel.reset(); }, [tool]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Viewport -------------------------------------------------------------
  const imageSize = useMemo(() => (source ? { width: source.pixels.width, height: source.pixels.height } : null), [source]);
  const resolveViewport = useCallback((size: PaneSize): ClippingViewport => viewport ?? fitViewport(size, imageSize ?? { width: 1, height: 1 }), [viewport, imageSize]);
  const zoomBy = (factor: number, size: PaneSize = paneSize.current, x?: number, y?: number) =>
    setViewport(zoomViewport(resolveViewport(size), size, factor, x, y));

  // --- Dessin ---------------------------------------------------------------
  const drawMarks = (ctx: CanvasRenderingContext2D, size: PaneSize) => {
    if (!source) return;
    const vp = resolveViewport(size);
    ctx.save();
    ctx.translate(size.width / 2, size.height / 2); ctx.scale(vp.scale, vp.scale); ctx.translate(-vp.center.x, -vp.center.y);
    ctx.imageSmoothingEnabled = vp.scale < 2;
    ctx.drawImage(source.img, 0, 0);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const paint = (points: ClippingPoint[], width: number, color: string, alpha: number, dash?: number[]) => {
      ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash ?? []);
      if (points.length === 1) { ctx.beginPath(); ctx.arc(points[0].x, points[0].y, width / 2, 0, Math.PI * 2); ctx.fill(); return; }
      ctx.beginPath(); points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))); ctx.stroke();
    };
    for (const mark of scalpel.view) {
      if (isScalpelMark(mark)) {
        // Tracé de scalpel : courbe lissée, contour noir puis trait de couleur.
        traceCut(ctx, markToCut(mark));
        ctx.globalAlpha = 1; ctx.setLineDash([]);
        ctx.lineWidth = CUT_OUTER / vp.scale; ctx.strokeStyle = '#000'; ctx.stroke();
        ctx.lineWidth = CUT_INNER / vp.scale; ctx.strokeStyle = scalpel.cutColor; ctx.stroke();
      } else if (mark.tool === 'scalpel') paint(mark.points, CUT_INNER / vp.scale, MARK_COLORS.scalpel, 1);
      else paint(mark.points, mark.size, MARK_COLORS[mark.tool], 0.55);
    }
    if (stroke && stroke.length > 0 && isMarkTool(tool) && tool !== 'scalpel') paint(stroke, brush, MARK_COLORS[tool], 0.55);
    ctx.restore();
    if (effectiveTool === 'scalpel') scalpel.drawOverlay(ctx, vp, size, hover);
    if (hover && !panning && !shiftHeld && tool !== 'pan' && tool !== 'scalpel') {
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
    ctx.translate(size.width / 2, size.height / 2); ctx.scale(vp.scale, vp.scale); ctx.translate(-vp.center.x, -vp.center.y);
    ctx.imageSmoothingEnabled = vp.scale < 2;
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
    if (effectiveTool === 'scalpel') { scalpel.down(p, { x, y }, vp, size); return; }
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
    if (effectiveTool === 'scalpel') { scalpel.move(p, { x, y }, vp, size); return; }
    if (d?.kind === 'stroke') { d.points.push(p); setStroke([...d.points]); }
  };
  const endPointer = ({ event, size }: PaneEvent) => {
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    const d = drag.current;
    drag.current = null; setPanning(false);
    if (effectiveTool === 'scalpel' && d?.kind !== 'pan') { scalpel.up(resolveViewport(size)); return; }
    if (d?.kind !== 'stroke') return;
    setStroke(null);
    const points = densifyPoints(d.points, Math.max(1, brush / 2));
    if (d.tool === 'eraser') dispatch({ type: 'erase', points, size: brush });
    else if (isMarkTool(d.tool)) dispatch({ type: 'add', mark: { id: newMarkId(), tool: d.tool, size: brush, points } });
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
        if (!onButton && effectiveTool === 'scalpel' && scalpel.key(e.key)) e.preventDefault();
        return;
    }
    switch (key) {
      case ' ': if (onButton) return; e.preventDefault(); setTool((current) => (current === 'keep' ? 'remove' : 'keep')); break;
      case 'v': setTool('hair'); break;
      case 'x': setTool('eraser'); break;
      case 's': setTool('scalpel'); break;
      case 'c': setTool('pan'); break;
      case 'z': dispatch({ type: e.shiftKey ? 'redo' : 'undo' }); break;
      case 'y': dispatch({ type: 'redo' }); break;
      case 'q': setPeekOriginal(true); break;
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
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;
  // Vue simple : Q maintenu affiche l'autre image. Vue partagée : l'aperçu montre l'original (voir drawPreview).
  const previewShown = view === 'single' && peekOriginal ? !showPreview : showPreview;
  const showMarksPane = view === 'split' || !previewShown;
  const showPreviewPane = view === 'split' || previewShown;
  const cursor = panning ? 'grabbing' : effectiveTool === 'pan' ? 'grab' : effectiveTool === 'scalpel' ? scalpel.cursor : 'none';
  const statusText = loadFailed ? t('clipping.loadError') : !source ? t('clipping.loading')
    : downloadFailed ? t('clipping.downloadError')
      : status === 'working' ? t('clipping.working') : status === 'error' ? t('clipping.segmentError') : status === 'ready' ? t('clipping.ready') : '';

  const iconButton = (label: string, icon: React.ReactNode, onClick: () => void, opts: { pressed?: boolean; disabled?: boolean } = {}) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" variant={opts.pressed ? 'inverse' : 'secondary'} size="medium" className="h-6 w-6 p-0" aria-label={label} aria-pressed={opts.pressed} disabled={opts.disabled} onClick={onClick}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider delayDuration={300}>
      <BgProvider value="white">
        <div
          ref={rootRef} tabIndex={0} data-bg="white" data-gs-clipping-editor
          className={cn('relative flex h-full min-h-[420px] w-full flex-col bg-white outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
          onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onBlur={() => { setShiftHeld(false); setPeekOriginal(false); }}
          onPointerEnter={() => { if (!document.activeElement || document.activeElement === document.body) rootRef.current?.focus({ preventScroll: true }); }} {...props}
        >
          <div role="toolbar" aria-label={t('clipping.toolbar')} className="flex h-[50px] shrink-0 items-center gap-1 overflow-x-auto border-b border-grey px-3">
            {TOOL_ORDER.map((tk) => <React.Fragment key={tk}>{iconButton(withKey(tk), TOOL_ICONS[tk], () => setTool(tk), { pressed: effectiveTool === tk })}</React.Fragment>)}
            <span className="mx-1 h-5 w-px shrink-0 bg-grey" aria-hidden="true" />
            {iconButton(`${t('clipping.undo')} (Z)`, <Undo2 size={14} aria-hidden="true" />, () => dispatch({ type: 'undo' }), { disabled: !canUndo })}
            {iconButton(`${t('clipping.redo')} (Y)`, <Redo2 size={14} aria-hidden="true" />, () => dispatch({ type: 'redo' }), { disabled: !canRedo })}
            <span className="mx-1 h-5 w-px shrink-0 bg-grey" aria-hidden="true" />
            {iconButton(t('clipping.zoomIn'), <ZoomIn size={14} aria-hidden="true" />, () => zoomBy(ZOOM_STEP))}
            {iconButton(t('clipping.zoomOut'), <ZoomOut size={14} aria-hidden="true" />, () => zoomBy(1 / ZOOM_STEP))}
            {iconButton(`${t('clipping.zoomFit')} (Home)`, <Maximize size={14} aria-hidden="true" />, () => setViewport(null))}
            <span className="mx-1 h-5 w-px shrink-0 bg-grey" aria-hidden="true" />
            {iconButton(t('clipping.shortcut', { label: t('clipping.view.single'), key: '1' }), <Square size={14} aria-hidden="true" />, () => setView('single'), { pressed: view === 'single' })}
            {iconButton(t('clipping.shortcut', { label: t('clipping.view.split'), key: '2' }), <Columns2 size={14} aria-hidden="true" />, () => setView('split'), { pressed: view === 'split' })}
            {view === 'single' && (
              <Button type="button" variant="secondary" size="medium" className="shrink-0" onClick={() => setShowPreview((v) => !v)}>
                {showPreview ? t('clipping.showOriginal') : t('clipping.showPreview')}
              </Button>
            )}
            <div className="ml-auto flex shrink-0 items-center gap-1">
              <Button type="button" size="medium" className="shrink-0" disabled={!cutout || status === 'working'} onClick={() => void download()}>
                <Download size={14} aria-hidden="true" />{t('clipping.download')}
              </Button>
              {onClose && iconButton(t('clipping.close'), <X size={14} aria-hidden="true" />, onClose)}
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1">
            {showMarksPane && (
              <Pane title={t('clipping.pane.marks')} ariaLabel={t('clipping.canvas.marks')} caption={fileName} cursor={cursor}
                draw={drawMarks} sizeRef={paneSize} onPointerDown={onPointerDown('marks')} onPointerMove={onPointerMove('marks')}
                onPointerUp={endPointer} onPointerLeave={() => setHover(null)} onWheel={onWheel} />
            )}
            {view === 'split' && <div className="w-px bg-black" aria-hidden="true" />}
            {showPreviewPane && (
              <Pane title={t('clipping.pane.preview')} ariaLabel={t('clipping.canvas.preview')} caption={imageSize ? t('clipping.dimensions', imageSize) : undefined}
                cursor={panning ? 'grabbing' : 'grab'} checker draw={drawPreview} sizeRef={paneSize}
                onPointerDown={onPointerDown('preview')} onPointerMove={onPointerMove('preview')} onPointerUp={endPointer} onWheel={onWheel} />
            )}
            {!source && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                {!loadFailed && <Spinner size={24} decorative />}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-grey px-3 py-2 text-sm">
            <label className="flex min-w-[220px] items-center gap-3">
              <span title={t('clipping.brushShortcut')}>{t('clipping.brush')}</span>
              <Slider className="w-32" min={BRUSH_MIN} max={BRUSH_MAX} step={1} value={[brush]} aria-label={t('clipping.brushSize')} onValueChange={([v]) => setBrush(v)} />
              <span className="w-12 tabular-nums">{brush}px</span>
            </label>
            {effectiveTool === 'scalpel' && <span className="text-grey-strongest">{t(scalpel.connecting ? 'clipping.scalpelHint.connecting' : 'clipping.scalpelHint')}</span>}
            <span role="status" aria-live="polite" className="ml-auto flex items-center gap-2 text-grey-strongest">
              {status === 'working' && <Spinner size={12} decorative />}
              {statusText}
            </span>
          </div>
        </div>
      </BgProvider>
    </TooltipProvider>
  );
}

interface PaneProps {
  title: string;
  ariaLabel: string;
  caption?: string;
  cursor: string;
  checker?: boolean;
  draw: (ctx: CanvasRenderingContext2D, size: PaneSize) => void;
  sizeRef: React.MutableRefObject<PaneSize>;
  onPointerDown: (e: PaneEvent) => void;
  onPointerMove: (e: PaneEvent) => void;
  onPointerUp: (e: PaneEvent) => void;
  onPointerLeave?: () => void;
  onWheel: (e: { x: number; y: number; size: PaneSize; deltaY: number }) => void;
}

/** Volet à canvas : mesure son conteneur, redessine à chaque rendu et traduit les événements en pixels du volet. */
function Pane({ title, ariaLabel, caption, cursor, checker, draw, sizeRef, onPointerDown, onPointerMove, onPointerUp, onPointerLeave, onWheel }: PaneProps) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<PaneSize>({ width: 1, height: 1 });
  const wheelRef = useRef(onWheel);
  wheelRef.current = onWheel;

  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const next = { width: Math.max(1, Math.round(r.width)), height: Math.max(1, Math.round(r.height)) };
      setSize((prev) => (prev.width === next.width && prev.height === next.height ? prev : next));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    sizeRef.current = size;
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
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="py-2 text-center text-base">{title}</div>
      <div ref={host} className="relative min-h-0 flex-1" style={checker ? CHECKER : undefined}>
        <canvas
          ref={canvas} role="img" aria-label={ariaLabel} className="absolute inset-0 h-full w-full touch-none" style={{ cursor }}
          onPointerDown={(e) => onPointerDown(local(e))} onPointerMove={(e) => onPointerMove(local(e))}
          onPointerUp={(e) => onPointerUp(local(e))} onPointerCancel={(e) => onPointerUp(local(e))} onPointerLeave={onPointerLeave}
        />
      </div>
      <div className="min-h-[2.25rem] truncate py-2 text-center text-base">{caption}</div>
    </div>
  );
}
