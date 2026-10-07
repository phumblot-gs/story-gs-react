import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { useTranslationSafe, type TranslationMap } from "@/contexts/TranslationContext"

export type CheckAllState = boolean | "indeterminate"

/** State of a "select all" checkbox: none, all, or some of the items. */
export function getCheckAllState(selectedCount: number, totalCount: number): CheckAllState {
  if (totalCount <= 0 || selectedCount <= 0) return false
  if (selectedCount >= totalCount) return true
  return "indeterminate"
}

export interface CheckAllProps {
  /** Number of selected items among the items this checkbox governs (e.g. the current page). */
  selectedCount: number
  /** Number of items this checkbox governs. */
  totalCount: number
  /**
   * Click: `true` to select every governed item (from unchecked or
   * indeterminate), `false` to deselect them (from checked).
   */
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  /** Accessible label; defaults to "Select all" / "Deselect all". */
  "aria-label"?: string
  /** Code de langue (ex: "fr", "en", "es", "it", "de") */
  language?: string
  /** Traductions personnalisées pour surcharger les valeurs par défaut */
  translations?: Partial<TranslationMap>
}

/**
 * Checkbox selecting every item of a list (typically the current page of a
 * paginated list), whatever the items. It only knows counts: unchecked when
 * nothing is selected, checked when everything is, indeterminate in between.
 * Pairs with `CheckAllPages` and `usePaginatedSelection`.
 */
const CheckAll = React.forwardRef<React.ElementRef<typeof Checkbox>, CheckAllProps>(
  (
    { selectedCount, totalCount, onCheckedChange, disabled, className, "aria-label": ariaLabel, language, translations },
    ref,
  ) => {
    const { t } = useTranslationSafe(translations, language)
    const state = getCheckAllState(selectedCount, totalCount)
    const label = ariaLabel ?? t(state === true ? "checkAll.deselectAll" : "checkAll.selectAll")

    return (
      <Checkbox
        ref={ref}
        checked={state}
        disabled={disabled || totalCount <= 0}
        // Checkbox applies the rule itself: false / indeterminate → true, true → false.
        onCheckedChange={(checked) => onCheckedChange(checked === true)}
        aria-label={label}
        title={label}
        className={className}
        data-check-all={state === "indeterminate" ? "indeterminate" : state ? "checked" : "unchecked"}
      />
    )
  },
)
CheckAll.displayName = "CheckAll"

export { CheckAll }
