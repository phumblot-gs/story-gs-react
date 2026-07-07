import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icons/Icon"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { useBgContext } from "@/components/layout/BgContext"
import { useTranslationSafe, type TranslationMap } from "@/contexts/TranslationContext"

/** Vrai si la cible est un champ éditable (input/textarea/select/contenteditable). */
function isEditableElement(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true
  return el.isContentEditable
}

/**
 * Vrai si un modal/dialog est ouvert (Radix Dialog/AlertDialog ou tout élément
 * `aria-modal`). Volontairement restreint aux dialogs modaux : n'attrape pas les
 * tooltips/popovers/menus (dont le propre tooltip des flèches) pour ne pas
 * bloquer la navigation clavier à tort.
 */
function isModalOpen(): boolean {
  if (typeof document === "undefined") return false
  return (
    document.querySelector(
      '[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"], [aria-modal="true"]'
    ) !== null
  )
}

/** Marqueur posé sur l'évènement clavier pour dédupliquer entre plusieurs
 *  instances de Pagination présentes sur la même page (ex. haut + bas de liste). */
type HandledKeyboardEvent = KeyboardEvent & { __gsPaginationHandled?: boolean }

export interface PaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Callback when page changes */
  onPageChange?: (page: number) => void
  /** Maximum number of page buttons to show (excluding prev/next) */
  maxVisiblePages?: number
  /** Size of the pagination buttons */
  size?: "small" | "medium" | "large"
  /** Custom className */
  className?: string
  /** Debug mode */
  debug?: boolean
  /**
   * Active la navigation au clavier : `Shift + ←` = page précédente,
   * `Shift + →` = page suivante (appelle `onPageChange` avec la page bornée).
   * Désactivé par défaut pour ne pas modifier le comportement des consommateurs
   * existants. Quand activé, les boutons `<`/`>` affichent aussi un tooltip
   * indiquant le raccourci.
   *
   * Gardes : sans effet si le focus est dans un champ éditable
   * (input/textarea/select/contenteditable) ou si un modal est ouvert ; respecte
   * les bornes (1..totalPages). Sûr avec plusieurs `Pagination` sur une même page
   * (l'évènement n'est traité qu'une fois).
   */
  keyboardNavigation?: boolean
  /** Code de langue (ex: "fr", "en", "es", "it", "de") */
  language?: string
  /** Traductions personnalisées pour surcharger les valeurs par défaut */
  translations?: Partial<TranslationMap>
}

/**
 * Generate array of page numbers to display
 */
function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | "ellipsis")[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | "ellipsis")[] = []
  const halfVisible = Math.floor(maxVisible / 2)

  if (currentPage <= halfVisible + 1) {
    // Show first pages
    for (let i = 1; i <= maxVisible - 1; i++) {
      pages.push(i)
    }
    pages.push("ellipsis")
    pages.push(totalPages)
  } else if (currentPage >= totalPages - halfVisible) {
    // Show last pages
    pages.push(1)
    pages.push("ellipsis")
    for (let i = totalPages - maxVisible + 2; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Show middle pages
    pages.push(1)
    pages.push("ellipsis")
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      pages.push(i)
    }
    pages.push("ellipsis")
    pages.push(totalPages)
  }

  return pages
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      maxVisiblePages = 5,
      size = "medium",
      className,
      debug,
      keyboardNavigation = false,
      language,
      translations,
    },
    ref
  ) => {
    const bg = useBgContext()
    const { t } = useTranslationSafe(translations, language)
    const pageNumbers = generatePageNumbers(currentPage, totalPages, maxVisiblePages)

    // Calculate button dimensions and icon size based on size prop
    const getButtonSizeClasses = () => {
      switch (size) {
        case "small":
          return "!p-1 !w-4 !h-4 items-baseline"
        case "large":
          return "!p-1 !w-8 !h-8"
        default: // medium
          return "!p-1 !w-6 !h-6"
      }
    }

    const getIconSize = () => {
      switch (size) {
        case "small":
          return 10
        case "large":
          return 14
        default: // medium
          return 12
      }
    }

    const getEllipsisSizeClasses = () => {
      switch (size) {
        case "small":
          return "w-4 h-4 text-xs"
        case "large":
          return "w-8 h-8 text-lg"
        default: // medium
          return "w-6 h-6 text-base"
      }
    }

    const handlePageChange = React.useCallback(
      (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
          onPageChange?.(page)
          if (debug) {
            console.log("[Pagination PageChange]", {
              page,
              currentPage,
              totalPages,
              bg,
            })
          }
        }
      },
      [currentPage, totalPages, onPageChange, debug, bg]
    )

    const handlePrevious = React.useCallback(() => {
      handlePageChange(currentPage - 1)
    }, [currentPage, handlePageChange])

    const handleNext = React.useCallback(() => {
      handlePageChange(currentPage + 1)
    }, [currentPage, handlePageChange])

    // Navigation au clavier : Shift+← / Shift+→
    React.useEffect(() => {
      if (!keyboardNavigation || totalPages <= 1) return

      const onKeyDown = (event: HandledKeyboardEvent) => {
        if (!event.shiftKey || event.defaultPrevented) return
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
        // Déjà traité par une autre instance de Pagination pour ce même évènement.
        if (event.__gsPaginationHandled) return
        // Ne pas voler la frappe dans un champ éditable ni sous un modal ouvert.
        if (isEditableElement(event.target) || isEditableElement(document.activeElement)) return
        if (isModalOpen()) return

        const target = event.key === "ArrowLeft" ? currentPage - 1 : currentPage + 1
        if (target < 1 || target > totalPages) return

        event.__gsPaginationHandled = true
        event.preventDefault()
        handlePageChange(target)
      }

      window.addEventListener("keydown", onKeyDown)
      return () => window.removeEventListener("keydown", onKeyDown)
    }, [keyboardNavigation, currentPage, totalPages, handlePageChange])

    if (totalPages <= 1) {
      return null
    }

    // Determine text color based on background context
    const textColorClass = bg === "black" ? "text-white" : "text-black"

    // Rendu d'un bouton de navigation (précédent/suivant), avec tooltip de
    // raccourci quand la navigation clavier est active.
    const renderNavButton = (direction: "prev" | "next") => {
      const isPrev = direction === "prev"
      const label = isPrev ? t("pagination.previousPage") : t("pagination.nextPage")
      const button = (
        <Button
          variant="secondary"
          size={size}
          className={getButtonSizeClasses()}
          onClick={isPrev ? handlePrevious : handleNext}
          disabled={isPrev ? currentPage === 1 : currentPage === totalPages}
          aria-label={label}
          aria-keyshortcuts={
            keyboardNavigation ? (isPrev ? "Shift+ArrowLeft" : "Shift+ArrowRight") : undefined
          }
        >
          <Icon name={isPrev ? "ArrowLeft" : "ArrowRight"} size={getIconSize()} />
        </Button>
      )

      if (!keyboardNavigation) return button

      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="top">
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <kbd className="inline-flex items-center justify-center rounded-[2px] border border-white/30 px-1 py-0.5 font-sans text-[10px] font-medium leading-none">
                ⇧
              </kbd>
              <kbd className="inline-flex items-center justify-center rounded-[2px] border border-white/30 px-1 py-0.5 font-sans text-[10px] font-medium leading-none">
                {isPrev ? "←" : "→"}
              </kbd>
            </span>
          </TooltipContent>
        </Tooltip>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-end w-full",
          debug && "ring-2 ring-pink ring-offset-2 relative",
          className
        )}
        data-bg={bg || undefined}
      >
        {/* Pagination controls */}
        <TooltipProvider delayDuration={300}>
        <div className="flex items-center gap-1">
          {/* Previous button */}
          {renderNavButton("prev")}

          {/* Page number buttons */}
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={cn(
                    "flex items-center justify-center font-regular",
                    getEllipsisSizeClasses(),
                    textColorClass
                  )}
                  aria-hidden="true"
                >
                  ...
                </span>
              )
            }

            const isActive = page === currentPage

            return (
              <Button
                key={page}
                variant={isActive ? "normal" : "ghost"}
                size={size}
                className={cn(
                  getButtonSizeClasses(),
                  isActive && "pagination-active"
                )}
                onClick={() => handlePageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={isActive ? "page" : undefined}
              >
                {page}
              </Button>
            )
          })}

          {/* Next button */}
          {renderNavButton("next")}
        </div>
        </TooltipProvider>

        {/* Debug indicator */}
        {debug && (
          <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap z-10">
            {bg || "no-bg"} | Page {currentPage}/{totalPages}
          </span>
        )}
      </div>
    )
  }
)

Pagination.displayName = "Pagination"

export { Pagination }
