import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icons/Icon"
import { useBgContext } from "@/components/layout/BgContext"

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
    },
    ref
  ) => {
    const bg = useBgContext()
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

    if (totalPages <= 1) {
      return null
    }

    // Determine text color based on background context
    const textColorClass = bg === "black" ? "text-white" : "text-black"

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
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <Button
            variant="secondary"
            size={size}
            className={getButtonSizeClasses()}
            onClick={handlePrevious}
            disabled={currentPage === 1}
            aria-label="Page précédente"
          >
            <Icon name="ArrowLeft" size={getIconSize()} />
          </Button>

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
          <Button
            variant="secondary"
            size={size}
            className={getButtonSizeClasses()}
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-label="Page suivante"
          >
            <Icon name="ArrowRight" size={getIconSize()} />
          </Button>
        </div>

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
