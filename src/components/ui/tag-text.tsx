import * as React from "react";
import { cn } from "@/lib/utils";
import { useBgContext } from "@/components/layout/BgContext";
import { TagCross } from "./tag-cross";

export interface TagTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Texte du tag */
  children: React.ReactNode;
  
  /** Callback appelé lors du clic sur TagCross pour supprimer le tag */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Désactive le tag (et le TagCross) */
  disabled?: boolean;
  
  /** Mode debug : affiche un label et log les props dans la console */
  debug?: boolean;
}

/**
 * Composant TagText pour afficher des tags avec possibilité de suppression
 * 
 * Le composant s'adapte automatiquement selon le contexte `data-bg` du parent Layout.
 * Le TagCross est toujours présent et cliquable pour supprimer le tag.
 * 
 * @example
 * ```tsx
 * <Layout bg="white">
 *   <TagText onRemove={() => console.log('removed')}>
 *     Mon tag
 *   </TagText>
 * </Layout>
 * ```
 */
export const TagText = React.forwardRef<HTMLDivElement, TagTextProps>(
  ({ children, onRemove, disabled = false, debug = false, className, ...props }, ref) => {
    const bg = useBgContext();
    
    // Debug mode : wrapper pour onRemove avec log
    const handleRemove = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (debug) {
        console.log('[TagText Remove]', {
          bg,
          disabled,
          children,
          event: e,
        });
      }
      if (!disabled) {
        onRemove?.(e);
      }
    }, [debug, bg, disabled, children, onRemove]);

    // Debug mode : log des props au montage
    React.useEffect(() => {
      if (debug) {
        console.log('[TagText Debug]', {
          bg,
          disabled,
          children,
          onRemove: !!onRemove,
        });
      }
    }, [debug, bg, disabled, children, onRemove]);

    return (
      <div
        ref={ref}
        data-bg={bg || undefined}
        className={cn(
          "tag-text",
          "inline-flex items-center gap-1",
          "px-2 py-[2px]",
          "rounded-[10px]",
          "transition-colors",
          "max-w-[100px]",
          disabled && "tag-text-disabled",
          debug && "ring-2 ring-pink ring-offset-2 relative",
          className
        )}
        {...props}
      >
        <TagCross onClick={handleRemove} disabled={disabled} />
        <span className="tag-text-label text-[9px] leading-[16px] font-['Avenir_Next',_sans-serif] font-normal whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">
          {children}
        </span>
        {debug && (
          <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap z-10">
            TagText ({bg || 'no-bg'})
          </span>
        )}
      </div>
    );
  }
);

TagText.displayName = "TagText";

