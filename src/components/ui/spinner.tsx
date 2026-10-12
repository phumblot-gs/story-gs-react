import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslationSafe } from "@/contexts/TranslationContext";

/** Taille extérieure du spinner, en px. */
export type SpinnerSize = 12 | 16 | 24 | 32;

/**
 * Attribut qui force les animations réduites sous un ancêtre (rotation arrêtée,
 * transitions supprimées), comme la préférence système `prefers-reduced-motion`.
 * Point d'accroche des stories et des tests.
 */
export const REDUCED_MOTION_ATTRIBUTE = "data-gs-reduced-motion";

/** Épaisseur du trait par taille (spécification graphique). */
const STROKE_WIDTH: Record<SpinnerSize, number> = { 12: 1.5, 16: 2, 24: 2, 32: 3 };

export interface SpinnerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Taille extérieure en px. Défaut 16. */
  size?: SpinnerSize;
  /** Nom accessible quand le spinner est seul. Défaut : « Chargement en cours » traduit. */
  label?: string;
  /**
   * Décoratif : un texte voisin décrit déjà le chargement (bouton, toast, bas
   * de liste). Le spinner est alors masqué aux technologies d'assistance.
   */
  decorative?: boolean;
}

/**
 * Indicateur de chargement : anneau avec un arc de 270° sur une piste à 18 %
 * d'opacité, couleur héritée du texte (`currentColor`), un tour en 900 ms.
 *
 * Seul, il est une région de statut nommée (« Chargement en cours ») ; à côté
 * d'un texte qui décrit déjà le chargement, passer `decorative`.
 * Animations réduites (préférence système ou `data-gs-reduced-motion` sur un
 * ancêtre) : la rotation s'arrête, l'anneau reste visible.
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = 16, label, decorative = false, className, style, ...props }, ref) => {
    const { t } = useTranslationSafe();
    const strokeWidth = STROKE_WIDTH[size];
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    return (
      <span
        ref={ref}
        data-spinner
        data-size={size}
        {...(decorative ? { "aria-hidden": true } : { role: "status" })}
        className={cn("inline-flex shrink-0 items-center justify-center", className)}
        style={{ width: size, height: size, ...style }}
        {...props}
      >
        <svg
          className="gs-spinner block"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} opacity={0.18} />
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference * 0.75} ${circumference}`}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </svg>
        {!decorative && <span className="sr-only">{label ?? t("spinner.loading")}</span>}
      </span>
    );
  },
);

Spinner.displayName = "Spinner";
