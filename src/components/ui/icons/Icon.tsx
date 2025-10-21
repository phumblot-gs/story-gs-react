import React from "react";
import { IconName } from "./types";
import { renderIcon } from "./icon-renderer";
import { cn } from "@/lib/utils";

export interface IconProps {
  /** Nom de l'icône à afficher */
  name: IconName;

  /** Taille de l'icône en pixels (défaut: 12) */
  size?: number;

  /** Classes CSS Tailwind additionnelles */
  className?: string;

  /** Couleur de l'icône (utilise currentColor par défaut) */
  color?: string;

  /** Handler pour le clic */
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;

  /** Mode debug : affiche un border rose et log les clics dans la console */
  debug?: boolean;
}

/**
 * Composant Icon réutilisable
 *
 * Permet d'afficher n'importe quelle icône du système avec contrôle
 * de la taille, couleur, et classes CSS.
 *
 * @example
 * ```tsx
 * // Icône simple
 * <Icon name="Plus" />
 *
 * // Icône avec taille personnalisée
 * <Icon name="Settings" size={16} />
 *
 * // Icône avec couleur
 * <Icon name="Trash" className="text-red-500" />
 *
 * // Icône cliquable
 * <Icon name="Bell" onClick={() => console.log('clicked')} />
 *
 * // Dans un Button
 * <Button>
 *   <Icon name="Plus" size={12} />
 *   Ajouter
 * </Button>
 * ```
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 12,
  className,
  color,
  onClick,
  debug = false,
}) => {
  const iconElement = renderIcon(name, size);

  if (!iconElement) {
    console.warn(`[Icon] Icon "${name}" not found`);
    return null;
  }

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLSpanElement>) => {
      if (debug) {
        console.log("[Icon Click]", {
          name,
          size,
          className,
          color,
          event: e,
        });
      }
      onClick?.(e);
    },
    [debug, name, size, className, color, onClick]
  );

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center flex-shrink-0 [&_svg]:w-full [&_svg]:h-full",
        onClick && "cursor-pointer",
        debug && "ring-2 ring-pink",
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        color: color || undefined,
      }}
      onClick={debug || onClick ? handleClick : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {iconElement}
    </span>
  );
};

Icon.displayName = "Icon";
