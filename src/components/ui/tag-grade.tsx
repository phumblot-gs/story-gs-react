import * as React from "react";
import { cn } from "@/lib/utils";
import { useBgContext } from "@/components/layout/BgContext";
import { TagCross } from "./tag-cross";
import { Grade, type GradeValue } from "./grade";

export interface TagGradeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Valeur du grade (A, B, C, D, ou E) */
  value: GradeValue;
  
  /** Callback appelé lors du clic sur TagCross pour supprimer le tag */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Désactive le tag (et le TagCross) */
  disabled?: boolean;
  
  /** Mode debug : affiche un label et log les props dans la console */
  debug?: boolean;
}

/**
 * Composant TagGrade pour afficher des tags avec un grade et possibilité de suppression
 * 
 * Le composant s'adapte automatiquement selon le contexte `data-bg` du parent Layout.
 * Le TagCross est toujours présent et cliquable pour supprimer le tag.
 * 
 * @example
 * ```tsx
 * <Layout bg="white">
 *   <TagGrade value="A" onRemove={() => console.log('removed')} />
 * </Layout>
 * ```
 */
export const TagGrade = React.forwardRef<HTMLDivElement, TagGradeProps>(
  ({ value, onRemove, disabled = false, debug = false, className, ...props }, ref) => {
    const bg = useBgContext();
    
    // Debug mode : wrapper pour onRemove avec log
    const handleRemove = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (debug) {
        console.log('[TagGrade Remove]', {
          bg,
          disabled,
          value,
          event: e,
        });
      }
      if (!disabled) {
        onRemove?.(e);
      }
    }, [debug, bg, disabled, value, onRemove]);

    // Debug mode : log des props au montage
    React.useEffect(() => {
      if (debug) {
        console.log('[TagGrade Debug]', {
          bg,
          disabled,
          value,
          onRemove: !!onRemove,
        });
      }
    }, [debug, bg, disabled, value, onRemove]);

    return (
      <div
        ref={ref}
        data-bg={bg || undefined}
        className={cn(
          "tag-grade",
          "inline-flex items-center gap-1",
          "pl-2 pr-1 h-4",
          "rounded-[10px]",
          "transition-colors",
          disabled && "tag-grade-disabled",
          debug && "ring-2 ring-pink ring-offset-2 relative",
          className
        )}
        {...props}
      >
        <TagCross onClick={handleRemove} disabled={disabled} />
        <Grade value={value} />
        {debug && (
          <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap z-10">
            TagGrade ({bg || 'no-bg'}) - {value}
          </span>
        )}
      </div>
    );
  }
);

TagGrade.displayName = "TagGrade";

