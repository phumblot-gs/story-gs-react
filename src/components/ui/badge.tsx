import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useBgContext } from "@/components/layout/BgContext"

// Alignement vertical et taille du Badge — voir la story Typography >
// AlignmentTest.
//
// `text-badge-label` (10px, --badge-fs-label) : 9px (`text-xs`) était juge trop
// petit. 10px est la plus grande taille qui n'aggrave pas le décalage vertical
// du texte — mesuré dans Chrome sur AvenirNextLTPro : 1,625px à 9px, 1,578px à
// 10px, mais 3,531px à 11px. Écart délibéré à l'échelle Figma, documenté dans
// src/styles/custom-styles.css.
//
// `leading-tight` : indispensable. Sans classe `leading-*`, la line-box du
// Badge retombait sur celle de la règle Tailwind stock `.text-xs`
// (line-height: 1rem = 16px) alors que le font-size venait du preset GS. Le
// texte flottait dans une line-box de 16px. `leading-tight`
// (--font-lh-tight = 1.25) rend l'interlignage explicite, comme le fait déjà
// Button size="small".
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
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-badge-label leading-tight font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 relative w-fit h-fit min-h-4",
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
 * Enveloppe le texte du Badge dans un `<span class="gs-text-trim">` afin de
 * rogner sa boîte sur la hauteur de capitale et la ligne de base
 * (`text-box: trim-both cap alphabetic`), ce qui supprime le décalage vertical
 * optique au lieu de le compenser. Mesuré : le décalage résiduel tombe de
 * 1,578px à ~0 à 10px.
 *
 * Pourquoi un `<span>` et pas la règle sur le Badge lui-même : `text-box-trim`
 * n'est pas héritée et ne s'applique qu'aux « block containers » et « inline
 * boxes ». Le Badge étant `inline-flex`, son texte vit dans un élément flex
 * ANONYME qui prend la valeur initiale `none` : la règle posée sur le Badge est
 * silencieusement inopérante (vérifié dans Chrome — la propriété est bien
 * calculée sur l'élément, mais la hauteur ne bouge pas d'un pixel).
 *
 * LIMITE ASSUMÉE : seuls les enfants `string` et `number` sont enveloppés. Le
 * texte niché dans un élément enfant — `<Badge><Text>x</Text></Badge>`, ou le
 * `<span>` que passe gs_w — n'est PAS rogné et garde le rendu actuel. C'est
 * volontaire : envelopper les éléments enfants changerait leur structure flex.
 * Un consommateur qui veut le rognage sur son propre texte peut poser la classe
 * `gs-text-trim` lui-même.
 *
 * Les suites d'enfants textuels adjacents sont regroupées dans UN SEUL span :
 * `<Badge>Vue {code}</Badge>` produit deux enfants string, et un span par
 * enfant aurait fait deux éléments flex, donc un `gap-1` de 5px parasite au
 * milieu du texte.
 *
 * Amélioration progressive : un moteur sans `text-box` ignore la déclaration et
 * garde exactement le rendu précédent (la classe ne pose rien d'autre), donc
 * pas de `@supports` ni de saut de layout.
 */
function trimTextChildren(children: React.ReactNode): React.ReactNode {
  const items = React.Children.toArray(children);
  const out: React.ReactNode[] = [];
  let run: (string | number)[] = [];
  let runStart = 0;

  const flush = () => {
    if (run.length === 0) return;
    const text = run.join("");
    run = [];
    if (text === "") return;
    out.push(
      <span key={`gs-trim-${runStart}`} className="gs-text-trim">
        {text}
      </span>
    );
  };

  items.forEach((child, i) => {
    if (typeof child === "string" || typeof child === "number") {
      if (run.length === 0) runStart = i;
      run.push(child);
    } else {
      flush();
      out.push(child);
    }
  });
  flush();

  return out;
}

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

function Badge({ className, variant, debug, onClick, onFocus, onBlur, children, ...props }: BadgeProps) {
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
      {trimTextChildren(children)}
      {debug && (
        <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap">
          {variant || 'default'}
        </span>
      )}
    </span>
  );
}

export { Badge, badgeVariants }
