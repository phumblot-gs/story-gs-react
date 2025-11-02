import * as React from "react";
import { cn } from "@/lib/utils";
import { useBgContext } from "@/components/layout/BgContext";
import { TagCross } from "./tag-cross";
import { CustomFlagIcon, CustomFlagEmptyIcon } from "@/components/ui/icons/action-icons";

export type TagLabelColor = "blue" | "green" | "orange" | "pink" | "purple" | "red" | "white";

export interface TagLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Couleur du label (blue, green, orange, pink, purple, red, white). Si undefined, affiche l'icône Flag sans couleur spécifique */
  color?: TagLabelColor;
  
  /** Callback appelé lors du clic sur TagCross pour supprimer le tag */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  
  /** Désactive le tag (et le TagCross) */
  disabled?: boolean;
  
  /** Mode debug : affiche un label et log les props dans la console */
  debug?: boolean;
}

/**
 * Composant TagLabel pour afficher des tags avec un label coloré
 * 
 * Le composant s'adapte automatiquement selon le contexte `data-bg` du parent Layout.
 * Le TagCross est toujours présent et cliquable pour supprimer le tag.
 * Par défaut, affiche l'icône Flag sans couleur spécifique.
 * 
 * @example
 * ```tsx
 * <Layout bg="white">
 *   <TagLabel color="blue" onRemove={() => console.log('removed')} />
 * </Layout>
 * ```
 */
export const TagLabel = React.forwardRef<HTMLDivElement, TagLabelProps>(
  ({ color, onRemove, disabled = false, debug = false, className, ...props }, ref) => {
    const bg = useBgContext();
    
    // Debug mode : wrapper pour onRemove avec log
    const handleRemove = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (debug) {
        console.log('[TagLabel Remove]', {
          bg,
          color,
          disabled,
          event: e,
        });
      }
      if (!disabled) {
        onRemove?.(e);
      }
    }, [debug, bg, color, disabled, onRemove]);

    // Debug mode : log des props au montage
    React.useEffect(() => {
      if (debug) {
        console.log('[TagLabel Debug]', {
          bg,
          color,
          disabled,
          onRemove: !!onRemove,
        });
      }
    }, [debug, bg, color, disabled, onRemove]);

    return (
      <div
        ref={ref}
        data-bg={bg || undefined}
        className={cn(
          "tag-label",
          "inline-flex items-center gap-1",
          "px-2 py-1",
          "rounded-[10px]",
          "transition-colors",
          disabled && "tag-label-disabled",
          debug && "ring-2 ring-pink ring-offset-2 relative",
          className
        )}
        {...props}
      >
        <TagCross onClick={handleRemove} disabled={disabled} />
        <div
          className={cn(
            "tag-label-icon",
            "h-2",
            "flex items-center justify-center",
            "shrink-0",
            bg === "grey" && color === "white" && "tag-label-white-on-grey",
            bg === "black" && color === "white" && "tag-label-white-on-black",
            color && `tag-label-color-${color}`
          )}
          style={
            color
              ? {
                  ["--tag-label-color" as string]: `var(--label-${color})`,
                }
              : undefined
          }
        >
          {color ? (
            <CustomFlagIcon />
          ) : (
            <CustomFlagEmptyIcon />
          )}
        </div>
        {debug && (
          <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap z-10">
            TagLabel ({bg || 'no-bg'}, {color || 'default'})
          </span>
        )}
      </div>
    );
  }
);

TagLabel.displayName = "TagLabel";

