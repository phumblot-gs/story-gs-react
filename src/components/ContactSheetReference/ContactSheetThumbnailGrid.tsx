import * as React from "react";
import { cn } from "@/lib/utils";
import { Thumbnail, type ThumbnailBench } from "@/components/Thumbnail/Thumbnail";
import type { TranslationMap } from "@/contexts/TranslationContext";
import {
  computeDropTarget,
  getSelectionRange,
  reorderSlots,
  type CellRect,
  type DropTarget,
} from "@/lib/contact-sheet-reorder";
import type {
  ContactSheetExport,
  ContactSheetThumbnail,
  ReorderHandler,
  ThumbnailChange,
  ThumbnailFeatures,
} from "./types";
import { isEmptySlot } from "./types";

/**
 * Clé d'une cellule : l'id du média, ou la position pour un emplacement vide
 * (qui n'a pas d'id). Les emplacements vides ne se déplaçant pas, leur
 * position est une identité stable.
 */
type CellKey = number | string;
const cellKey = (thumb: ContactSheetThumbnail, exportId: string | number, index: number): CellKey =>
  isEmptySlot(thumb) ? `empty:${exportId}:${index}` : (thumb.picture_id as number);

export interface ContactSheetThumbnailGridProps {
  /** Exports dans l'ordre d'affichage ; leurs vignettes s'enchaînent dans une seule grille. */
  exports: ContactSheetExport[];
  /** Nombre de vignettes par ligne ; leur largeur s'adapte, l'interstice est fixe (15px). */
  thumbnailsPerRow: number;
  features?: ThumbnailFeatures;
  onThumbnailChange?: (change: ThumbnailChange) => void | Promise<void>;
  /**
   * Nouvel ordre des vignettes d'un export après un drag & drop. Le drag & drop
   * est actif dès que ce callback est fourni. Déposer un média sur un
   * emplacement vide, ou juste devant, le remplit. Les vues restent attachées
   * aux positions (voir `reorderSlots`).
   */
  onReorder?: ReorderHandler;
  /**
   * "grouped" (défaut) : toutes les vignettes dans une seule grille.
   * "separated" : une section par export, empilées (20px), chacune avec son
   * en-tête (`renderExportHeader`) et sa propre grille.
   */
  exportsLayout?: "grouped" | "separated";
  /** En-tête d'un export en mode "separated" (son badge). */
  renderExportHeader?: (exportData: ContactSheetExport) => React.ReactNode;
  /** Survol d'une vignette : export concerné, ou `null` en sortie. */
  onExportHover?: (exportId: string | number | null) => void;
  bench?: ThumbnailBench;
  language?: string;
  translations?: Partial<TranslationMap>;
}

interface DragState {
  exportId: string | number;
  /** Index de la vignette saisie dans son export */
  from: number;
  /**
   * Index (dans l'export, ordre d'affichage) de toutes les vignettes déplacées :
   * la sélection de l'export si la vignette saisie en fait partie, sinon elle seule.
   */
  indexes: number[];
  target: DropTarget | null;
}

const DRAG_TYPE = "application/x-gs-contact-sheet-thumbnail";

const ALL_FEATURES: Required<ThumbnailFeatures> = {
  selection: true,
  rating: true,
  label: true,
  tags: true,
  comments: true,
  validation: true,
  open: true,
};

function toCellRect(rect: DOMRect): CellRect {
  return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
}

function sameTarget(a: DropTarget | null, b: DropTarget | null): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Identité d'un emplacement après déplacement : média et vue. */
const slotSignature = (list: readonly ContactSheetThumbnail[]) =>
  list.map((t) => `${isEmptySlot(t) ? "" : t.picture_id}:${t.view ?? ""}`).join("|");

/**
 * Nouvel état de l'export pour un drop, ou `null` s'il ne change rien. Les vues
 * restent attachées aux positions : seuls les médias bougent (`reorderSlots`).
 */
function computeReorder(
  thumbnails: readonly ContactSheetThumbnail[],
  state: Pick<DragState, "indexes">,
  target: DropTarget,
): ContactSheetThumbnail[] | null {
  const next = reorderSlots(thumbnails, state.indexes, target, isEmptySlot);
  return slotSignature(next) === slotSignature(thumbnails) ? null : next;
}

/**
 * Marges de l'aperçu de groupe : le badge du nombre d'images se pose à cheval
 * sur le coin haut droit, hors de la vignette, pour ne pas masquer le code de vue.
 */
const GROUP_IMAGE_TOP = 10;
const GROUP_IMAGE_RIGHT = 24;

/**
 * Aperçu de drag d'un groupe : la vignette saisie sur une pile de deux cartes
 * décalées, et un badge avec le nombre d'images. Construit hors écran pour
 * `setDragImage` (qui exige un nœud rendu), puis retiré à la frame suivante.
 * Styles en ligne : le nœud est créé hors de React, sans garantie que les
 * classes utilitaires correspondantes existent dans la feuille compilée.
 */
function buildGroupDragImage(cell: HTMLElement, count: number): HTMLElement {
  const { width, height } = cell.getBoundingClientRect();
  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    position: "fixed",
    top: "-10000px",
    left: "-10000px",
    width: `${width + GROUP_IMAGE_RIGHT}px`,
    height: `${height + 12 + GROUP_IMAGE_TOP}px`,
    pointerEvents: "none",
  });
  for (const offset of [12, 6]) {
    const card = document.createElement("div");
    Object.assign(card.style, {
      position: "absolute",
      left: `${offset}px`,
      top: `${offset + GROUP_IMAGE_TOP}px`,
      width: `${width}px`,
      height: `${height}px`,
      background: "#fff",
      border: "1px solid #C1C1C1",
      borderRadius: "2px",
    });
    wrapper.appendChild(card);
  }
  const clone = cell.cloneNode(true) as HTMLElement;
  Object.assign(clone.style, {
    position: "absolute",
    left: "0",
    top: `${GROUP_IMAGE_TOP}px`,
    width: `${width}px`,
    transform: "",
  });
  wrapper.appendChild(clone);
  const badge = document.createElement("div");
  badge.textContent = String(count);
  badge.setAttribute("data-drag-count", String(count));
  Object.assign(badge.style, {
    position: "absolute",
    right: "0",
    top: "0",
    minWidth: "24px",
    height: "24px",
    padding: "0 6px",
    borderRadius: "12px",
    background: "#000",
    color: "#fff",
    font: "600 13px/24px AvenirNextLTPro, sans-serif",
    textAlign: "center",
    boxSizing: "border-box",
  });
  wrapper.appendChild(badge);
  document.body.appendChild(wrapper);
  return wrapper;
}

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export const ContactSheetThumbnailGrid: React.FC<ContactSheetThumbnailGridProps> = ({
  exports,
  thumbnailsPerRow,
  features,
  onThumbnailChange,
  onReorder,
  onExportHover,
  exportsLayout = "grouped",
  renderExportHeader,
  bench,
  language,
  translations,
}) => {
  const columns = Math.max(1, Math.round(thumbnailsPerRow));
  const enabled = onThumbnailChange ? { ...ALL_FEATURES, ...features } : null;
  const reorderable = !!onReorder;

  // --- Largeur des vignettes -------------------------------------------------
  // Le Thumbnail reçoit une largeur en px : sa zone image est alors carrée,
  // donc toutes les vignettes d'une ligne ont la même hauteur quel que soit le
  // ratio des images. L'interstice vient du token de la charte (gap-3, 15px) :
  // on le relit dans le style calculé plutôt que de le dupliquer ici.
  // Avant la première mesure, "auto" remplit la cellule. En mode "separated",
  // on mesure la grille du premier export : toutes ont la même largeur.
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = React.useState<{ width: number; gap: number } | null>(null);
  React.useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      const width = grid.clientWidth;
      const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
      setMetrics(width ? { width, gap } : null);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [exportsLayout]);
  const gap = metrics?.gap ?? 0;
  const cellWidth = metrics ? Math.floor((metrics.width - gap * (columns - 1)) / columns) : null;
  const thumbnailSize = cellWidth && cellWidth > 0 ? `${cellWidth}px` : "auto";

  // --- Cellules et rectangles ------------------------------------------------
  const cellRefs = React.useRef(new Map<CellKey, HTMLDivElement>());
  const exportsRef = React.useRef(exports);
  exportsRef.current = exports;

  const getRects = React.useCallback((exportId: string | number): CellRect[] => {
    const group = exportsRef.current.find((e) => e.id === exportId);
    return (group?.thumbnails ?? []).map((thumb, index) => {
      const node = cellRefs.current.get(cellKey(thumb, exportId, index));
      return node ? toCellRect(node.getBoundingClientRect()) : { left: 0, top: 0, right: 0, bottom: 0 };
    });
  }, []);

  // --- Animation des décalages après un drop (FLIP) --------------------------
  // Les positions sont photographiées juste avant onReorder ; quand le nouvel
  // ordre arrive, chaque vignette part de son ancienne position et glisse vers
  // la nouvelle. Sans photo récente (mise à jour venue d'ailleurs), pas d'animation.
  const flipSnapshot = React.useRef<{ at: number; rects: Map<CellKey, DOMRect> } | null>(null);
  const orderKey = exports
    .map((e) => `${e.id}:${e.thumbnails.map((t, i) => cellKey(t, e.id, i)).join(",")}`)
    .join("|");
  React.useLayoutEffect(() => {
    const snapshot = flipSnapshot.current;
    if (!snapshot || Date.now() - snapshot.at > 2000) return;
    flipSnapshot.current = null;
    snapshot.rects.forEach((before, key) => {
      const node = cellRefs.current.get(key);
      if (!node) return;
      const after = node.getBoundingClientRect();
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (!dx && !dy) return;
      node.style.transition = "none";
      node.style.transform = `translate(${dx}px, ${dy}px)`;
      void node.offsetWidth; // force le reflow avant de lancer la transition
      node.style.transition = "transform 220ms cubic-bezier(0.2, 0, 0, 1)";
      node.style.transform = "";
    });
  }, [orderKey]);

  // --- Drag & drop (HTML5, aperçu natif du navigateur) --------------------------
  const dragRef = React.useRef<DragState | null>(null);
  const [drag, setDragState] = React.useState<DragState | null>(null);
  const setDrag = (next: DragState | null) => {
    dragRef.current = next;
    setDragState(next);
  };

  // Après un drag natif, Chrome ne recalcule pas :hover avant le prochain
  // mouvement de souris : il le laisse à l'élément qui occupe la position de
  // départ du drag — après réordonnancement, une autre vignette. On neutralise
  // donc le survol jusqu'au prochain pointermove, qui le recalcule au bon endroit.
  const [hoverLocked, setHoverLocked] = React.useState(false);
  React.useEffect(() => {
    if (!hoverLocked) return;
    const unlock = () => setHoverLocked(false);
    window.addEventListener("pointermove", unlock, { once: true });
    return () => window.removeEventListener("pointermove", unlock);
  }, [hoverLocked]);
  const endDrag = () => {
    if (dragRef.current) setHoverLocked(true);
    setDrag(null);
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    exportId: string | number,
    pictureId: number,
    from: number,
  ) => {
    const cell = event.currentTarget;
    // Les événements React traversent les portails : un drag né dans un menu
    // de la vignette (texte d'un commentaire…) ne doit pas déplacer la vignette.
    if (!(event.target instanceof Node) || !cell.contains(event.target)) return;
    const rect = cell.getBoundingClientRect();
    // Vignette saisie sélectionnée : toute la sélection de son export part avec
    // elle (jamais celle des autres exports). Sinon, elle seule.
    const thumbnails = exportsRef.current.find((e) => e.id === exportId)?.thumbnails ?? [];
    const indexes = thumbnails[from]?.selected
      ? thumbnails.flatMap((t, i) => (t.selected && !isEmptySlot(t) ? [i] : []))
      : [from];
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(DRAG_TYPE, String(pictureId));
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    if (indexes.length > 1 && event.dataTransfer.setDragImage) {
      const image = buildGroupDragImage(cell, indexes.length);
      event.dataTransfer.setDragImage(image, offsetX, offsetY + GROUP_IMAGE_TOP);
      requestAnimationFrame(() => image.remove());
    } else {
      event.dataTransfer.setDragImage?.(cell, offsetX, offsetY);
    }
    const state: DragState = { exportId, from, indexes, target: null };
    dragRef.current = state;
    // Le navigateur photographie la cellule après ce handler : on attend la
    // frame suivante pour l'estomper, sinon l'aperçu serait estompé aussi.
    requestAnimationFrame(() => dragRef.current === state && setDragState(state));
  };

  const handleDragOver = (event: React.DragEvent) => {
    const state = dragRef.current;
    if (!state) return;
    event.preventDefault();
    const group = exportsRef.current.find((e) => e.id === state.exportId);
    const multiple = state.indexes.length > 1;
    let target = computeDropTarget(
      { x: event.clientX, y: event.clientY },
      getRects(state.exportId),
      // Groupe : pas de détection de no-op par index, on compare le résultat.
      multiple ? -1 : state.from,
      {
        gap,
        previous: state.target,
        // Groupe : pas de permutation, chaque moitié de vignette vaut insertion.
        edgeRatio: multiple ? 0.5 : undefined,
        isEmpty: (index) => !!group && isEmptySlot(group.thumbnails[index]),
      },
    );
    if (target && group && !computeReorder(group.thumbnails, state, target)) target = null;
    event.dataTransfer.dropEffect = target ? "move" : "none";
    if (!sameTarget(target, state.target)) setDrag({ ...state, target });
  };

  const handleDrop = (event: React.DragEvent) => {
    const state = dragRef.current;
    if (!state) return;
    event.preventDefault();
    const group = exportsRef.current.find((e) => e.id === state.exportId);
    if (state.target && group && onReorder) {
      const rects = new Map<CellKey, DOMRect>();
      cellRefs.current.forEach((node, key) => rects.set(key, node.getBoundingClientRect()));
      flipSnapshot.current = { at: Date.now(), rects };
      const reordered = computeReorder(group.thumbnails, state, state.target);
      if (reordered) {
        const previousViews = new Map(
          group.thumbnails.filter((t) => !isEmptySlot(t)).map((t) => [t.picture_id as number, t.view]),
        );
        onReorder(
          state.exportId,
          reordered.filter((t) => !isEmptySlot(t)).map((t) => t.picture_id as number),
          reordered.map((t) =>
            isEmptySlot(t) ? { view: t.view } : { picture_id: t.picture_id as number, view: t.view },
          ),
          {
            movedPictureIds: state.indexes.map((i) => group.thumbnails[i].picture_id as number),
            viewChanges: reordered
              .filter((t) => !isEmptySlot(t) && previousViews.get(t.picture_id as number) !== t.view)
              .map((t) => ({
                picture_id: t.picture_id as number,
                previousView: previousViews.get(t.picture_id as number),
                view: t.view,
              })),
          },
        );
      }
    }
    endDrag();
  };

  // --- Sélection : Maj+clic sélectionne une plage ------------------------------
  // L'ancre est la dernière vignette cliquée. Avec Maj, toutes les vignettes
  // entre l'ancre et la vignette cliquée (ordre d'affichage, tous exports
  // confondus) prennent le nouvel état de la vignette cliquée.
  const anchorRef = React.useRef<number | null>(null);
  const displayOrder = exports.flatMap((e) =>
    e.thumbnails.filter((t) => !isEmptySlot(t)).map((t) => t.picture_id as number),
  );

  // --- Rendu -----------------------------------------------------------------
  const emit = (thumb: ContactSheetThumbnail, exportId: string | number) =>
    (change: DistributiveOmit<ThumbnailChange, "pictureId" | "exportId">) =>
      onThumbnailChange?.({ ...change, pictureId: thumb.picture_id as number, exportId } as ThumbnailChange);

  const renderThumbnail = (thumb: ContactSheetThumbnail, exportId: string | number) => {
    const send = emit(thumb, exportId);
    return (
      <Thumbnail
        filenameTruncation="middle"
        bench={bench}
        language={language}
        translations={translations}
        {...thumb}
        size={thumbnailSize}
        onSelectionChange={
          enabled?.selection
            ? (selected, modifiers) => {
                const pictureIds = modifiers.shiftKey
                  ? getSelectionRange(displayOrder, anchorRef.current, thumb.picture_id as number)
                  : [thumb.picture_id as number];
                anchorRef.current = thumb.picture_id as number;
                send({ type: "selection", selected, modifiers, pictureIds });
              }
            : undefined
        }
        onRatingChange={enabled?.rating ? (rating) => send({ type: "rating", rating }) : undefined}
        onLabelChange={enabled?.label ? (label) => send({ type: "label", label }) : undefined}
        onTagAdd={enabled?.tags ? (tag) => send({ type: "tagAdd", tag }) : undefined}
        onTagRemove={enabled?.tags ? (tag) => send({ type: "tagRemove", tag }) : undefined}
        onCommentAdd={enabled?.comments ? async (comment) => { await send({ type: "comment", comment }); } : undefined}
        onValidate={enabled?.validation ? () => send({ type: "validate" }) : undefined}
        onReject={enabled?.validation ? (reason) => send({ type: "reject", reason }) : undefined}
        onImageClick={enabled?.open ? () => send({ type: "open" }) : undefined}
      />
    );
  };

  const renderCell = (group: ContactSheetExport, thumb: ContactSheetThumbnail, index: number) => {
    const sameExport = drag?.exportId === group.id;
    const isSource = sameExport && drag.indexes.includes(index);
    const target = sameExport ? drag.target : null;
    const isSwapTarget = target?.kind === "swap" && target.index === index;
    const insertSide = target?.kind === "insert" && target.anchor === index ? target.side : null;
    const key = cellKey(thumb, group.id, index);
    const empty = isEmptySlot(thumb);
    const draggable = reorderable && !empty;

    return (
      <div
        key={`${group.id}-${key}`}
        ref={(node) => {
          if (node) cellRefs.current.set(key, node);
          else cellRefs.current.delete(key);
        }}
        className={cn(
          "relative min-w-0 transition-opacity duration-150",
          // Pendant un drag, les autres exports s'effacent : on ne peut
          // déposer que dans l'export de la vignette déplacée.
          drag && !sameExport && "opacity-20",
        )}
        onMouseEnter={onExportHover ? () => onExportHover(group.id) : undefined}
        onMouseLeave={onExportHover ? () => onExportHover(null) : undefined}
        data-picture-id={empty ? undefined : thumb.picture_id}
        data-empty-view={empty ? thumb.view ?? "" : undefined}
        data-export-id={group.id}
        draggable={draggable}
        onDragStart={draggable ? (e) => handleDragStart(e, group.id, thumb.picture_id as number, index) : undefined}
        onDragEnd={reorderable ? endDrag : undefined}
      >
        <div
          className={cn(
            "transition-opacity duration-150",
            isSource && "opacity-30",
            hoverLocked && "pointer-events-none",
          )}
        >
          {renderThumbnail(thumb, group.id)}
        </div>

        {isSwapTarget && (
          <div
            className="pointer-events-none absolute -inset-1 rounded-sm border border-dashed border-grey-strongest animate-in fade-in-0 duration-100"
            data-testid="swap-indicator"
          />
        )}
        {insertSide && (
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-[3px] rounded-full bg-black animate-in fade-in-0 duration-100"
            style={{ [insertSide === "before" ? "left" : "right"]: -(gap / 2) - 1.5 }}
            data-testid="insert-indicator"
            data-side={insertSide}
          />
        )}
      </div>
    );
  };

  const gridStyle = { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` };
  const dropHandlers = {
    onDragOver: reorderable ? handleDragOver : undefined,
    onDrop: reorderable ? handleDrop : undefined,
  };

  // Exports séparés : une section par export (en-tête puis grille), empilées.
  // Le drag & drop reste géré ici, à l'échelle de toutes les sections : les
  // autres exports s'estompent pendant un drag comme en mode groupé.
  if (exportsLayout === "separated") {
    return (
      <div className="flex flex-col gap-4 w-full" data-exports-layout="separated" {...dropHandlers}>
        {exports.map((group, i) => (
          <div key={group.id} className="flex flex-col gap-2 min-w-0" data-export-section={group.id}>
            {renderExportHeader?.(group)}
            <div ref={i === 0 ? gridRef : undefined} className="grid w-full gap-3" style={gridStyle}>
              {group.thumbnails.map((thumb, index) => renderCell(group, thumb, index))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid w-full gap-3"
      style={gridStyle}
      data-exports-layout="grouped"
      {...dropHandlers}
    >
      {exports.flatMap((group) => group.thumbnails.map((thumb, index) => renderCell(group, thumb, index)))}
    </div>
  );
};

ContactSheetThumbnailGrid.displayName = "ContactSheetThumbnailGrid";
