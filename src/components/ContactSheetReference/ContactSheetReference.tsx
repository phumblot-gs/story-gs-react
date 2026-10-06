import * as React from "react";
import { cn } from "@/lib/utils";
import { Layout } from "@/components/layout";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { Grade, type GradeValue } from "@/components/ui/grade";
import type { ThumbnailBench } from "@/components/Thumbnail/Thumbnail";
import { useTranslationSafe, type TranslationMap } from "@/contexts/TranslationContext";
import { ReferenceAttributes } from "./ReferenceAttributes";
import { ReferenceEditModal } from "./ReferenceEditModal";
import { ContactSheetThumbnailGrid } from "./ContactSheetThumbnailGrid";
import type {
  ContactSheetExport,
  ReferenceAttributeConfig,
  ReferenceData,
  ReferenceUpdate,
  ReorderHandler,
  ThumbnailChange,
  ThumbnailFeatures,
} from "./types";
import { isEmptySlot } from "./types";

export interface ContactSheetReferenceProps {
  /** Reference data (`/reference` endpoint). */
  reference: ReferenceData;
  /**
   * Attributes displayed under the title, in this order. Independent from the
   * data: an attribute missing from `reference` is rendered empty. No attribute
   * → no grid.
   */
  attributes?: ReferenceAttributeConfig[];
  /**
   * Exports in display order. Badges and thumbnails follow this order; within an
   * export, thumbnails are displayed in the order received.
   */
  exports?: ContactSheetExport[];
  /** Number of thumbnails per row (typically 4 to 10, driven by a slider). */
  thumbnailsPerRow?: number;
  /**
   * How several exports are laid out:
   * - "grouped" (default): export badges side by side, then a single grid with
   *   every thumbnail;
   * - "separated": exports stacked 20px apart, each with its own badge and grid.
   */
  exportsLayout?: "grouped" | "separated";

  // Référence
  /** Whether the reference is selected. */
  selected?: boolean;
  /**
   * Click on the reference checkbox (hidden when missing). `pictureIds` lists all
   * its media, to be (de)selected with it.
   */
  onSelectionChange?: (selected: boolean, pictureIds: number[]) => void;
  /** Whether the reference is flagged as urgent. */
  isUrgent?: boolean;
  /** Quality grade of the reference, displayed right of the title (before the actions). */
  grade?: GradeValue;
  /** Urgent toggle click; the toggle is hidden when missing. */
  onUrgentChange?: (isUrgent: boolean) => void;
  /**
   * Edit form submission; the Edit button is hidden when missing. May be async:
   * the form stays open until it resolves, and shows the error if it rejects.
   */
  onReferenceUpdate?: (update: ReferenceUpdate) => void | Promise<void>;
  /** Tag editor in the Edit form. */
  editableTags?: boolean;
  /**
   * Shows the Edit button (true by default). It only appears when
   * `onReferenceUpdate` is provided. With `false`, the form can still be opened
   * from `headerActions` through `openEdit`.
   */
  showEditButton?: boolean;
  /**
   * Actions placed right of the title, after the Edit button, side by side (e.g.
   * several `Button`s with different variants). May be a function receiving
   * `openEdit`, to open the Edit form from a custom button.
   */
  headerActions?: React.ReactNode | ((helpers: { openEdit: () => void }) => React.ReactNode);

  // Vignettes
  /** Any change requested on a thumbnail (selection, rating, status…). */
  onThumbnailChange?: (change: ThumbnailChange) => void | Promise<void>;
  /** Interactions enabled on the thumbnails (all by default). */
  thumbnailFeatures?: ThumbnailFeatures;
  /** Bench data passed to the thumbnails (rejection reasons). */
  bench?: ThumbnailBench;

  // Réordonnancement
  /**
   * Called on each drop (one or several thumbnails, always within one export)
   * with `(exportId, pictureIds, slots, details)`. Drag & drop is enabled as soon
   * as this callback is provided. See `ReorderHandler` for the arguments and a
   * complete data update example.
   */
  onReorder?: ReorderHandler;

  className?: string;
  language?: string;
  translations?: Partial<TranslationMap>;
}

/**
 * A reference in a contact sheet: selection checkbox in a left column, then title,
 * attributes, export badges and thumbnails.
 *
 * Controlled component: it keeps no copy of its data. Any new `reference` or
 * `exports` value (status, tags, order…) is rendered immediately.
 */
export const ContactSheetReference: React.FC<ContactSheetReferenceProps> = ({
  reference,
  attributes = [],
  exports = [],
  thumbnailsPerRow = 6,
  exportsLayout = "grouped",
  selected = false,
  onSelectionChange,
  isUrgent = false,
  grade,
  onUrgentChange,
  onReferenceUpdate,
  editableTags = true,
  showEditButton = true,
  headerActions,
  onThumbnailChange,
  thumbnailFeatures,
  bench,
  onReorder,
  className,
  language,
  translations,
}) => {
  const { t } = useTranslationSafe(translations, language);
  const [editing, setEditing] = React.useState(false);
  // Export de la vignette survolée : son badge fonce légèrement, pour
  // rattacher visuellement les vignettes à leur export.
  const [hoveredExportId, setHoveredExportId] = React.useState<string | number | null>(null);
  // Sans onReferenceUpdate il n'y a pas de formulaire : openEdit ne fait rien.
  const openEdit = React.useCallback(() => {
    if (onReferenceUpdate) setEditing(true);
  }, [onReferenceUpdate]);
  const actions = typeof headerActions === "function" ? headerActions({ openEdit }) : headerActions;

  // Seuls les médias comptent : les emplacements vides ne se sélectionnent pas.
  const media = exports.flatMap((e) => e.thumbnails.filter((th) => !isEmptySlot(th)));
  const pictureIds = media.map((th) => th.picture_id as number);
  const selectedCount = media.filter((th) => th.selected).length;
  const hasThumbnails = exports.some((e) => e.thumbnails.length > 0);
  // Cochée : la référence et toutes ses vignettes. Intermédiaire : sélection
  // partielle (vignettes décochées une à une, ou vignettes seules cochées).
  const checkState: boolean | "indeterminate" =
    selected && selectedCount === pictureIds.length
      ? true
      : selected || selectedCount > 0
        ? "indeterminate"
        : false;

  const namedExports = exports.filter((e) => e.name);
  const separated = exportsLayout === "separated";

  // Badge d'un export ; il fonce légèrement au survol d'une de ses vignettes.
  const renderBadge = (e: ContactSheetExport) => (
    <span
      key={e.id}
      className={cn(
        "inline-flex w-fit items-center px-4 py-1 rounded-sm bg-grey-stronger text-white text-sm font-normal transition-[filter] duration-150",
        hoveredExportId === e.id && "brightness-90",
      )}
      data-export-badge={e.id}
      data-hovered={hoveredExportId === e.id || undefined}
    >
      {e.name}
    </span>
  );

  const grid = (
    <ContactSheetThumbnailGrid
      exports={exports}
      thumbnailsPerRow={thumbnailsPerRow}
      exportsLayout={exportsLayout}
      renderExportHeader={(e) => (e.name ? renderBadge(e) : null)}
      features={thumbnailFeatures}
      onThumbnailChange={onThumbnailChange}
      onReorder={onReorder}
      onExportHover={setHoveredExportId}
      bench={bench}
      language={language}
      translations={translations}
    />
  );
  const editableAttributes = attributes.filter((a) => a.editable);

  return (
    <Layout
      bg="grey"
      // Ligne de séparation sous la référence, colonne de sélection comprise.
      className={cn("flex w-full border-b border-grey-strong", className)}
      as="section"
    >
      {/* Colonne de sélection */}
      {/* Même padding haut et même hauteur (h-6, 30px) que la ligne de titre,
          contenu centré : la case est alignée sur le bouton urgent et le titre. */}
      <div className="flex justify-center w-10 shrink-0 pt-3 border-r border-grey-strong">
        {onSelectionChange && (
          <div className="flex items-center h-6">
            <Checkbox
              checked={checkState}
              onCheckedChange={(checked) => onSelectionChange(checked === true, pictureIds)}
              aria-label={t("contactSheet.selectReference", { ref: reference.ref })}
            />
          </div>
        )}
      </div>

      {/* Contenu. Espacements de la maquette : 20px entre titre, attributs et
          badges d'export ; 10px entre les badges et les vignettes. */}
      <div className="flex flex-col flex-1 min-w-0 px-4 py-3">
        <div className="flex items-center gap-2 min-w-0 h-6">
          {onUrgentChange && (
            <Toggle
              variant="secondary"
              size="small"
              isActive={isUrgent}
              onClick={() => onUrgentChange(!isUrgent)}
              aria-label={t(isUrgent ? "contactSheet.unmarkUrgent" : "contactSheet.markUrgent")}
              title={t(isUrgent ? "contactSheet.unmarkUrgent" : "contactSheet.markUrgent")}
              className={cn(
                "p-1 w-4 h-4 shrink-0",
                // Actif, et au survol : la couleur urgente (comme UrgentIndicator).
                "hover:!bg-orange hover:!text-white hover:!border-orange",
                isUrgent && "!bg-orange !text-white !border-orange",
              )}
            >
              <Icon name="Urgent" size={10} />
            </Toggle>
          )}
          <h3 className="m-0 text-base font-bold uppercase truncate" title={reference.ref}>
            {reference.ref}
          </h3>
          {grade && <Grade value={grade} size="medium" />}
          {((onReferenceUpdate && showEditButton) || actions) && (
            <div className="flex items-center gap-1 shrink-0">
              {onReferenceUpdate && showEditButton && (
                <Button variant="ghost" size="small" onClick={openEdit}>
                  <Icon name="Pencil" size={12} />
                  {t("contactSheet.edit")}
                </Button>
              )}
              {actions}
            </div>
          )}
        </div>

        <ReferenceAttributes reference={reference} attributes={attributes} className="mt-4" />

        {separated ? (
          // Exports séparés : chaque section porte son badge (rendu par la grille).
          exports.length > 0 && (
            <div className="mt-4">{grid}</div>
          )
        ) : (
          <>
            {namedExports.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">{namedExports.map(renderBadge)}</div>
            )}
            {hasThumbnails && <div className={namedExports.length > 0 ? "mt-2" : "mt-4"}>{grid}</div>}
          </>
        )}
      </div>

      {onReferenceUpdate && (
        <ReferenceEditModal
          isOpen={editing}
          onClose={() => setEditing(false)}
          reference={reference}
          attributes={editableAttributes}
          editableTags={editableTags}
          onSubmit={onReferenceUpdate}
          language={language}
          translations={translations}
        />
      )}
    </Layout>
  );
};

ContactSheetReference.displayName = "ContactSheetReference";
