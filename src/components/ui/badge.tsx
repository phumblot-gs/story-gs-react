import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

// Alignement vertical du Badge — voir la story Typography > AlignmentTest.
//
// `leading-tight` : indispensable. Sans classe `leading-*`, la line-box du
// Badge reste celle de la règle Tailwind stock `.text-xs` (line-height: 1rem =
// 16px) alors que le font-size vient du preset GS (--font-size-xs = 9px). Le
// texte flottait donc dans une line-box de 16px et, AvenirNextLTPro étant
// asymétrique (ascent .778em / descent .222em), le bloc de glyphes finissait
// ~1px trop haut. `leading-tight` (--font-lh-tight = 1.25 → 11.25px) rend
// l'interlignage explicite, comme le fait déjà Button size="small".
//
// `w-fit h-fit` remplace l'ancien `self-start` : même protection contre
// l'étirement (une cross-size non-`auto` neutralise `align-self: stretch`, qui
// se comporte alors comme `flex-start`) mais SANS confisquer l'alignement
// choisi par le parent. Un Badge dans un conteneur `items-center` est
// désormais réellement centré, et dans un `flex-col` il reste collé à gauche.
//
// `min-h-4` (20px) aligne la hauteur mini du Badge sur celle de Button
// size="small", sans figer la hauteur : un consommateur qui surcharge le
// padding (ex. `py-1`) reste libre de dépasser cette valeur.
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs leading-tight font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 relative w-fit h-fit min-h-4",
  {
    variants: {
      variant: {
        default: "badge-normal",
        secondary: "badge-secondary",
        destructive: "badge-destructive",
        outline: "badge-outline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Le Badge rend un `<span>` et non un `<div>`.
 *
 * Raison : un Badge est régulièrement posé à l'intérieur d'un élément
 * interactif (en-tête de section rendu cliquable par un vrai `<button>`, par
 * exemple), et le modèle de contenu de `<button>` n'accepte que du *phrasing
 * content*. Un `<div>` y était du HTML invalide : React ne s'en plaint pas,
 * mais le parseur du navigateur peut réarranger l'arbre et les validateurs
 * d'accessibilité le signalent.
 *
 * Aucun effet visuel : les classes de base portent déjà `inline-flex`, qui
 * écrase le `display` par défaut des deux balises.
 *
 * Conséquence de typage : les props dérivent de `HTMLSpanElement` et non plus
 * de `HTMLDivElement`. Ce n'est **pas** un breaking change — vérifié :
 * `HTMLAttributes<T>` n'utilise `T` que dans ses handlers d'événements, et les
 * types de handlers de React (`EventHandler`) sont bivariants par construction
 * (« bivariance hack »). Un consommateur qui avait annoté son handler
 * `(e: React.MouseEvent<HTMLDivElement>) => …` compile toujours, et les deux
 * formes de props restent mutuellement assignables.
 *
 * `Badge` n'est pas un `forwardRef` : la prop `ref` n'était pas acceptée avant
 * ce changement et ne l'est toujours pas.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  debug?: boolean;
}

function Badge({ className, variant, debug, onClick, onFocus, onBlur, ...props }: BadgeProps) {
  const bg = useBgContext();

  // Debug mode : wrapper pour onClick avec log
  const handleClick = React.useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    if (debug) {
      console.log('[Badge Click]', {
        variant,
        bg,
        event: e,
      });
    }
    onClick?.(e);
  }, [debug, variant, bg, onClick]);

  // Debug mode : wrapper pour onFocus avec log
  const handleFocus = React.useCallback((e: React.FocusEvent<HTMLSpanElement>) => {
    if (debug) {
      console.log('[Badge Focus]', {
        variant,
        bg,
        event: e,
      });
    }
    onFocus?.(e);
  }, [debug, variant, bg, onFocus]);

  // Debug mode : wrapper pour onBlur avec log
  const handleBlur = React.useCallback((e: React.FocusEvent<HTMLSpanElement>) => {
    if (debug) {
      console.log('[Badge Blur]', {
        variant,
        bg,
        event: e,
      });
    }
    onBlur?.(e);
  }, [debug, variant, bg, onBlur]);

  return (
    <span
      data-bg={bg || undefined}
      className={cn(
        badgeVariants({ variant }), 
        debug && "ring-2 ring-pink ring-offset-2",
        className
      )}
      onClick={debug ? handleClick : onClick}
      onFocus={debug ? handleFocus : onFocus}
      onBlur={debug ? handleBlur : onBlur}
      {...props}
    >
      {props.children}
      {debug && (
        <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap">
          {variant || 'default'}
        </span>
      )}
    </span>
  );
}

export { Badge, badgeVariants }
