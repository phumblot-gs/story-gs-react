import * as React from "react"

import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslationSafe, type TranslationMap } from "@/contexts/TranslationContext"

/** Scope of a selection across the pages of a list. */
export type CheckAllPagesScope = "none" | "page" | "all" | "custom"

/**
 * Scope derived from counts: everything, exactly the current page, nothing, or
 * a mix ("custom": some items, possibly on several pages).
 */
export function getCheckAllPagesScope({
  selectedCount,
  pageCount,
  pageSelectedCount,
  totalCount,
}: {
  selectedCount: number
  pageCount: number
  pageSelectedCount?: number
  totalCount: number
}): CheckAllPagesScope {
  if (selectedCount <= 0) return "none"
  if (totalCount > 0 && selectedCount >= totalCount) return "all"
  // Without pageSelectedCount, the same count could be another set of items.
  if (pageSelectedCount !== undefined && pageCount > 0 && pageSelectedCount === pageCount && selectedCount === pageCount) {
    return "page"
  }
  return "custom"
}

export interface CheckAllPagesProps {
  /** Number of selected items across all pages. */
  selectedCount: number
  /** Number of items on the current page. */
  pageCount: number
  /**
   * Number of selected items on the current page. Needed to show the "Current
   * page" scope; without it a selection of the page size shows as custom.
   */
  pageSelectedCount?: number
  /** Number of items across all pages (after filters). */
  totalCount: number
  /** Select only the items of the current page. */
  onSelectPage: () => void
  /** Select every item of every page. */
  onSelectAll: () => void
  /** Deselect everything. */
  onDeselectAll: () => void
  /** Forces the displayed scope (by default derived from the counts). */
  scope?: CheckAllPagesScope
  /** Select size (default: `small`). */
  size?: "normal" | "small"
  disabled?: boolean
  className?: string
  /** Code de langue (ex: "fr", "en", "es", "it", "de") */
  language?: string
  /** Traductions personnalisées pour surcharger les valeurs par défaut */
  translations?: Partial<TranslationMap>
}

/**
 * Selection scope menu of a paginated list, next to `CheckAll`: current page,
 * all pages, or nothing. Shows the current scope, including a custom selection
 * (read-only). Item agnostic: it only knows counts and emits intents; pair it
 * with `usePaginatedSelection` to handle "all pages" without loading every key.
 */
const CheckAllPages: React.FC<CheckAllPagesProps> = ({
  selectedCount,
  pageCount,
  pageSelectedCount,
  totalCount,
  onSelectPage,
  onSelectAll,
  onDeselectAll,
  scope,
  size = "small",
  disabled,
  className,
  language,
  translations,
}) => {
  const { t } = useTranslationSafe(translations, language)
  const current = scope ?? getCheckAllPagesScope({ selectedCount, pageCount, pageSelectedCount, totalCount })
  // A single page: "Current page" would duplicate "All pages".
  const showPage = pageCount > 0 && pageCount < totalCount

  const handleChange = (value: string) => {
    if (value === "page") onSelectPage()
    else if (value === "all") onSelectAll()
    else if (value === "none") onDeselectAll()
  }

  return (
    <Select
      // Controlled: "" shows the placeholder when nothing is selected.
      value={current === "none" ? "" : current}
      onValueChange={handleChange}
      size={size}
      disabled={disabled || totalCount <= 0}
    >
      <SelectTrigger size={size} className={cn("w-auto min-w-[140px]", className)} aria-label={t("checkAllPages.label")}>
        <SelectValue placeholder={t("checkAllPages.placeholder")} />
      </SelectTrigger>
      <SelectContent>
        {current === "custom" && (
          <SelectItem value="custom" disabled>
            {t("checkAllPages.custom", { count: selectedCount })}
          </SelectItem>
        )}
        {showPage && <SelectItem value="page">{t("checkAllPages.page", { count: pageCount })}</SelectItem>}
        <SelectItem value="all">{t("checkAllPages.all", { count: totalCount })}</SelectItem>
        <SelectItem value="none">{t("checkAll.deselectAll")}</SelectItem>
      </SelectContent>
    </Select>
  )
}
CheckAllPages.displayName = "CheckAllPages"

export { CheckAllPages }
