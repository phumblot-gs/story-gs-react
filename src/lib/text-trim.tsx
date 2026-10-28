import * as React from "react"

/**
 * Enveloppe les enfants texte dans un `<span class="gs-text-trim">` afin de
 * rogner leur boîte sur la hauteur de capitale et la ligne de base
 * (`text-box: trim-both cap alphabetic`), ce qui supprime le décalage vertical
 * optique au lieu de le compenser. Mesuré : le décalage résiduel tombe de
 * 1,578px à ~0 à 10px dans le Badge, et de 1 à 1,75px à ~0 (arrondi au pixel)
 * pour des initiales de 11 à 16px dans un Avatar.
 *
 * Utilisé par `Badge` et `AvatarFallback`.
 *
 * Pourquoi un `<span>` et pas la règle sur le composant lui-même :
 * `text-box-trim` n'est pas héritée et ne s'applique qu'aux « block
 * containers » et « inline boxes ». Dans un conteneur flex, le texte vit dans
 * un élément flex ANONYME qui prend la valeur initiale `none` : la règle posée
 * sur le conteneur est silencieusement inopérante (vérifié dans Chrome — la
 * propriété est bien calculée sur l'élément, mais la hauteur ne bouge pas d'un
 * pixel).
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
export function trimTextChildren(children: React.ReactNode): React.ReactNode {
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
