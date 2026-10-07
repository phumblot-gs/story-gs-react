import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { useTranslationSafe, type TranslationMap } from "@/contexts/TranslationContext"
import { hasOpenOverlay, isEditableTarget, isSelectAllShortcut } from "@/lib/keyboard-shortcuts"

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
  /**
   * Cmd+A (macOS) / Ctrl+A (elsewhere) checks this checkbox instead of selecting the page text.
   * Left to the browser when the focus is in a text field, textarea, select, combobox, listbox or
   * editable element, or when a dialog or menu is open. When everything is already selected, the
   * shortcut does nothing (it never deselects). Enable it on a single CheckAll per page.
   * Default: false.
   */
  captureSelectAllShortcut?: boolean
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
    {
      selectedCount,
      totalCount,
      onCheckedChange,
      disabled,
      captureSelectAllShortcut = false,
      className,
      "aria-label": ariaLabel,
      language,
      translations,
    },
    ref,
  ) => {
    const { t } = useTranslationSafe(translations, language)
    const state = getCheckAllState(selectedCount, totalCount)
    const inactive = disabled || totalCount <= 0

    // Cmd/Ctrl+A coche la case — sauf là où le raccourci a déjà un sens.
    const innerRef = React.useRef<HTMLButtonElement>(null)
    React.useImperativeHandle(ref, () => innerRef.current as HTMLButtonElement)
    const latest = React.useRef({ state, onCheckedChange })
    latest.current = { state, onCheckedChange }
    React.useEffect(() => {
      if (!captureSelectAllShortcut || inactive) return
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.defaultPrevented || !isSelectAllShortcut(event)) return
        if (isEditableTarget(document.activeElement) || isEditableTarget(event.target as Element)) return
        if (hasOpenOverlay()) return
        // Case masquée (démontée, display: none…) : on laisse le navigateur.
        const box = innerRef.current
        if (!box || box.getClientRects().length === 0) return
        // Bloque aussi la sélection du texte de la page quand tout est déjà coché.
        event.preventDefault()
        if (latest.current.state !== true) latest.current.onCheckedChange(true)
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [captureSelectAllShortcut, inactive])
    const label = ariaLabel ?? t(state === true ? "checkAll.deselectAll" : "checkAll.selectAll")

    return (
      <Checkbox
        ref={innerRef}
        checked={state}
        disabled={inactive}
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
