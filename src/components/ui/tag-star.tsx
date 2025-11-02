import * as React from "react";
import { cn } from "@/lib/utils";
import { useBgContext } from "@/components/layout/BgContext";
import { Icon } from "@/components/ui/icons";
import { TagCross } from "./tag-cross";

export interface TagStarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Nombre d'étoiles à afficher (0 à 5) */
  value?: number;
  
  /** Callback appelé lors du clic sur TagCross pour supprimer le tag */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Désactive le tag (et le TagCross) */
  disabled?: boolean;
  
  /** Mode debug : affiche un label et log les props dans la console */
  debug?: boolean;
}

/**
 * Composant TagStar pour afficher des tags de notation avec des étoiles
 * 
 * Le composant s'adapte automatiquement selon le contexte `data-bg` du parent Layout.
 * Le TagCross est toujours présent et cliquable pour supprimer le tag.
 * 
 * @example
 * ```tsx
 * <Layout bg="white">
 *   <TagStar value={4} onRemove={() => console.log('removed')} />
 * </Layout>
 * ```
 */
export const TagStar = React.forwardRef<HTMLDivElement, TagStarProps>(
  ({ value = 0, onRemove, disabled = false, debug = false, className, ...props }, ref) => {
    const bg = useBgContext();
    
    // Normaliser value entre 0 et 5
    const normalizedValue = Math.max(0, Math.min(5, Math.floor(value)));
    
    // Debug mode : wrapper pour onRemove avec log
    const handleRemove = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (debug) {
        console.log('[TagStar Remove]', {
          bg,
          disabled,
          value: normalizedValue,
          event: e,
        });
      }
      if (!disabled) {
        onRemove?.(e);
      }
    }, [debug, bg, disabled, normalizedValue, onRemove]);

    // Debug mode : log des props au montage
    React.useEffect(() => {
      if (debug) {
        console.log('[TagStar Debug]', {
          bg,
          disabled,
          value: normalizedValue,
          onRemove: !!onRemove,
        });
      }
    }, [debug, bg, disabled, normalizedValue, onRemove]);

    return (
      <div
        ref={ref}
        data-bg={bg || undefined}
        className={cn(
          "tag-star",
          "inline-flex items-center gap-1",
          "px-2 py-1",
          "rounded-[10px]",
          "transition-colors",
          disabled && "tag-star-disabled",
          debug && "ring-2 ring-pink ring-offset-2 relative",
          className
        )}
        {...props}
      >
        <TagCross onClick={handleRemove} disabled={disabled} />
        <div className="tag-star-stars inline-flex items-center gap-[2px]">
          {normalizedValue === 0 ? (
            // Pour value=0, afficher une étoile outline (Star) avec trait plus épais
            <Icon name="Star" size={10} className="tag-star-outline" />
          ) : (
            // Pour value > 0, afficher value étoiles pleines (StarFilled)
            Array.from({ length: normalizedValue }).map((_, index) => (
              <Icon key={index} name="StarFilled" size={10} />
            ))
          )}
        </div>
        {debug && (
          <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap z-10">
            TagStar ({bg || 'no-bg'}) - {normalizedValue}⭐
          </span>
        )}
      </div>
    );
  }
);

TagStar.displayName = "TagStar";

