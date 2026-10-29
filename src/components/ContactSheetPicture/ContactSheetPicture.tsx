import * as React from "react";
import { Layout } from "@/components/layout";
import { CheckAll } from "@/components/ui/check-all";
import { cn } from "@/lib/utils";
import { useTranslationSafe } from "@/contexts/TranslationContext";
import { ContactSheetThumbnailGrid } from "@/components/ContactSheetReference/ContactSheetThumbnailGrid";
import type { ContactSheetReferenceProps } from "@/components/ContactSheetReference/ContactSheetReference";
import { isEmptySlot } from "@/components/ContactSheetReference/types";

export interface ContactSheetPictureProps extends Pick<
  ContactSheetReferenceProps,
  | "exports"
  | "thumbnailsPerRow"
  | "onThumbnailChange"
  | "thumbnailFeatures"
  | "imageCache"
  | "bench"
  | "onReorder"
  | "className"
  | "language"
  | "translations"
> {
  /** Default: "grouped". Images near the viewport are loaded and decoded in
   * blocks, with visible blocks first. A block is revealed together, or after
   * 2 seconds with the remainder following as it arrives. "native" opts out.
   */
  imageLoading?: ContactSheetReferenceProps["imageLoading"];
  /** Select/deselect all supplied media; empty slots are excluded.
   * The checkbox is hidden when omitted or when thumbnail selection is disabled.
   * Selection is derived from `exports[].thumbnails[].selected`.
   */
  onSelectionChange?: (selected: boolean, pictureIds: number[]) => void;
  /** Filters or actions displayed beside Select all. Filtering is handled by the parent. */
  toolbarActions?: React.ReactNode;
  /** Enable on one contact sheet per page. Default: false. */
  captureSelectAllShortcut?: boolean;
  /** Mount only viewport rows, with two extra rows on either side. Default: false.
   * Works with onReorder: the dragged thumbnail stays mounted until the drop.
   * Selection and image loading state remain independent of mounted rows.
   */
  virtualized?: boolean;
}

/**
 * Ungrouped contact sheet: exports follow one another in a continuous grid,
 * without reference headers or export badges. Uses the same thumbnail data,
 * change events and export-scoped reordering as ContactSheetReference.
 * Controlled: the parent applies changes and passes updated exports back.
 */
export const ContactSheetPicture: React.FC<ContactSheetPictureProps> = ({
  exports = [],
  thumbnailsPerRow = 6,
  onThumbnailChange,
  thumbnailFeatures,
  bench,
  imageLoading = "grouped",
  imageCache,
  onReorder,
  onSelectionChange,
  toolbarActions,
  captureSelectAllShortcut = false,
  virtualized = false,
  className,
  language,
  translations,
}) => {
  const { t } = useTranslationSafe(translations, language);
  const media = exports.flatMap((group) => group.thumbnails.filter((thumb) => !isEmptySlot(thumb)));
  const pictureIds = [...new Set(media.map((thumb) => thumb.picture_id as number))];
  const selectedIds = new Set(media.filter((thumb) => thumb.selected).map((thumb) => thumb.picture_id));
  const showSelection = !!onSelectionChange && thumbnailFeatures?.selection !== false;

  return (
    <Layout bg="grey" as="section" className={cn("w-full min-w-0", className)}>
      {(showSelection || toolbarActions) && (
        <div className="border-b border-grey-strong px-2 py-3">
          {/* Same inset as Thumbnail's fixed-width viewport: its border
              (0.25px), then checkbox padding (pl-2). Shared outer px-2 below. */}
          <div className="flex flex-wrap items-center gap-6 border-l-[0.25px] border-transparent pl-2">
            {showSelection && (
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                <CheckAll
                  selectedCount={selectedIds.size}
                  totalCount={pictureIds.length}
                  onCheckedChange={(checked) => onSelectionChange(checked, pictureIds)}
                  captureSelectAllShortcut={captureSelectAllShortcut}
                  language={language}
                  translations={translations}
                />
                <span>{t("checkAll.selectAll")}</span>
              </label>
            )}
            {toolbarActions}
          </div>
        </div>
      )}
      <div className="p-2">
        <ContactSheetThumbnailGrid
          exports={exports}
          thumbnailsPerRow={thumbnailsPerRow}
          virtualized={virtualized}
          features={thumbnailFeatures}
          onThumbnailChange={onThumbnailChange}
          onReorder={onReorder}
          bench={bench}
          imageLoading={imageLoading}
          imageCache={imageCache}
          language={language}
          translations={translations}
        />
      </div>
    </Layout>
  );
};

ContactSheetPicture.displayName = "ContactSheetPicture";

/**
 * @deprecated Renommé en `ContactSheetPicture` (1.39.0). Alias conservé pour ne
 * pas casser les projets qui l'importent depuis la 1.38.0.
 */
export const ContactSheetThumbnails = ContactSheetPicture;
/** @deprecated Renommé en `ContactSheetPictureProps` (1.39.0). */
export type ContactSheetThumbnailsProps = ContactSheetPictureProps;
