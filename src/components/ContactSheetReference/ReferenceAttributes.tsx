import * as React from "react";
import { cn } from "@/lib/utils";
import { TruncatedText } from "@/components/ui/truncated-text";
import type { ReferenceAttributeConfig, ReferenceData } from "./types";
import { formatAttributeValue, getAttributeValue } from "./attribute-values";

/** Largeur max du tooltip d'un libellé ou d'une valeur coupés. */
const TOOLTIP_MAX_WIDTH = "max-w-[320px]";

export interface ReferenceAttributesProps {
  reference: ReferenceData;
  attributes: ReferenceAttributeConfig[];
  className?: string;
}

/**
 * Grille d'attributs « libellé | valeur ». Trois colonnes au plus — au-delà la
 * lecture devient difficile — puis empilement selon la largeur disponible : la
 * largeur minimale d'une colonne est le tiers du conteneur (moins 1px pour
 * absorber les arrondis), sans descendre sous 240px. Dans une case, le libellé
 * prend 1/3 de la largeur, la valeur 2/3 ; coupés par « … », ils affichent le
 * texte complet en tooltip au survol.
 */
export const ReferenceAttributes: React.FC<ReferenceAttributesProps> = ({
  reference,
  attributes,
  className,
}) => {
  if (attributes.length === 0) return null;

  // Lignes jointives séparées par une simple bordure : chaque attribut porte
  // une bordure haute, et celle de la première ligne est rognée (-mt-px dans
  // un conteneur overflow-hidden) — on ne peut pas cibler « la première ligne »
  // en CSS, le nombre de colonnes dépendant de la largeur.
  return (
    <div className={cn("overflow-hidden max-w-[1224px]", className)}>
      <dl
        // Interstice entre colonnes : token gap-2 (10px), exposé en variable pour le calcul des colonnes.
        className="grid -mt-px mb-0 mx-0 [--attr-gap:theme(spacing.2)] gap-x-[var(--attr-gap)] gap-y-0"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(max(240px, calc((100% - 2 * var(--attr-gap)) / 3 - 1px)), 1fr))",
        }}
      >
        {attributes.map((attribute) => {
          const raw = getAttributeValue(reference, attribute.key);
          const value = attribute.format ? attribute.format(raw, reference) : formatAttributeValue(raw);
          return (
            <div
              key={attribute.key}
              // minmax(0, …) : une valeur très longue est coupée, elle n'élargit pas sa colonne.
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] bg-grey-lighter border-t border-grey-light text-sm min-w-0"
              data-attribute={attribute.key}
            >
              <TruncatedText
                as="dt"
                text={attribute.label}
                className="px-3 py-2 font-medium border-r border-grey-light"
                tooltipMaxWidth={TOOLTIP_MAX_WIDTH}
              />
              {typeof value === "string" || typeof value === "number" ? (
                <TruncatedText
                  as="dd"
                  text={String(value)}
                  className="px-3 py-2 m-0 opacity-70"
                  tooltipMaxWidth={TOOLTIP_MAX_WIDTH}
                />
              ) : (
                // Rendu personnalisé (format renvoie un nœud) : coupé, sans tooltip.
                <dd className="px-3 py-2 m-0 opacity-70 truncate">{value}</dd>
              )}
            </div>
          );
        })}
      </dl>
    </div>
  );
};

ReferenceAttributes.displayName = "ReferenceAttributes";
