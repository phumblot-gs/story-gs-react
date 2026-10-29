# ContactSheetPicture

Planche contact sans regroupement par référence. Les exports s'enchaînent dans une
seule grille ; les données et événements sont ceux de `ContactSheetReference`.
Le parent conserve les données et applique les changements.

## Chargement et apparition des images

`imageLoading="grouped"` est **activé par défaut** dans ce composant.

- Les blocs approchant du viewport ou du conteneur défilant sont préchargés à
  300 px de distance. Les blocs réellement visibles passent avant ceux seulement
  proches dans la file partagée ; leurs requêtes reçoivent une priorité haute.
- Les images sont décodées puis révélées ensemble par blocs de
  `max(thumbnailsPerRow × 4, 24)` images, sans attendre toute la planche.
- Un fondu discret de 150 ms adoucit la révélation, y compris avec `virtualized`.
  Il respecte la préférence de réduction des animations et ne se rejoue pas
  lorsqu'une image encore en cache est remontée pendant le scroll.
- Après 2 secondes, les images prêtes apparaissent, les autres suivent à leur
  arrivée : le mode réduit l'apparition désordonnée sans bloquer sur une image lente.
  Une image en erreur ne bloque pas les autres.
- Une image dont l'URL change conserve son ancienne version jusqu'à ce que la
  nouvelle soit prête. Les blocs déjà chargés ne sont pas masqués à nouveau.
- La file limite normalement les images en vol à 32, toutes grilles confondues.
  Un bloc plus grand peut dépasser ce nombre lorsqu'aucune image n'est en vol.
  Une requête déjà démarrée n'est pas interrompue au profit d'une nouvelle image visible.
- `imageLoading="native"` désactive cette coordination. Sans
  `IntersectionObserver`, toutes les images sont considérées proches.

## Montage selon le scroll

```tsx
<ContactSheetPicture
  exports={exports}
  thumbnailsPerRow={6}
  virtualized
  onThumbnailChange={handleThumbnailChange}
/>
```

`virtualized` monte uniquement les lignes visibles et deux lignes supplémentaires
de chaque côté. Par défaut (`"auto"`), il ne s'active qu'au-delà de **100
vignettes** dans la grille ; `true` le force, `false` le désactive. Les autres lignes sont remplacées par un
espace de même hauteur ; leurs composants `Thumbnail` et leurs cellules DOM ne
sont pas montés. La hauteur des lignes est mesurée, puis réajustée au changement
de largeur. Le scroll de la fenêtre et celui d'un conteneur sont pris en charge.

Les données, la sélection avec Maj et le cache de chargement restent au niveau de
la grille. Revenir sur une image déjà décodée ne relance pas son fondu d'apparition.
Les contrôles démontés perdent leur état local (par exemple un menu ouvert).

Le glisser-déposer (`onReorder`) fonctionne avec `virtualized`. La vignette saisie
reste montée pendant tout le drag, même si on fait défiler loin d'elle : sans
cela, le navigateur perdrait la fin du drag. La cible de dépôt est mesurée sur les
vignettes montées (le pointeur est toujours au-dessus d'elles) ; les autres sont
placées par calcul, toutes les lignes ayant la même hauteur. Dans
`ContactSheetReference`, la virtualisation s'applique aussi à
`exportsLayout="separated"` : les en-têtes d'export restent montés et chaque grille
d'export est fenêtrée séparément. La règle `"auto"` est la même pour
`ContactSheetReference` (qui garde par ailleurs le chargement natif par défaut).

Passer `virtualized={false}` quand toutes les vignettes doivent être dans la page :
recherche du navigateur (Ctrl+F) et impression, défilement vers une image par son
nœud DOM (`scrollIntoView` sur `[data-picture-id=…]`), état local à conserver hors
de l'écran (menu ouvert, commentaire en cours), tests sans moteur de rendu (jsdom),
où seules les premières lignes sont montées.

## Mémoire et cache borné (les deux composants)

En mode `imageLoading="grouped"`, `imageCache` limite les images conservées :

```tsx
<ContactSheetPicture
  exports={exports}
  virtualized
  imageCache={{ maxImages: 120, keepAroundRows: 4 }}
/>
<ContactSheetReference
  reference={reference}
  exports={exports}
  imageLoading="grouped"
  virtualized
  imageCache={{ maxImages: 120, keepAroundRows: 4 }}
/>
```

Ces valeurs sont les valeurs par défaut. Le budget est **par grille**. Les blocs
proches et les lignes protégées peuvent le dépasser : les images visibles ne
sont pas évincées. Quand la grille quitte entièrement la zone de préchargement,
ses images sont libérées, même si le budget n'est pas atteint. Sinon, les images
les moins récemment utilisées hors de la zone protégée sont évincées en premier.
Revenir sur une image évincée déclenche un nouveau chargement groupé. Les données
métier, dont la sélection, ne sont pas supprimées.

Les callbacks et actions mis en cache sont supprimés dès que leurs vignettes ne
sont plus montées. Sans virtualisation, ils restent proportionnels au nombre de
vignettes montées ; il faut alors paginer pour les borner.

En mode natif, le chargement et le cache des images appartiennent au navigateur :
`imageCache` ne les contrôle pas. Sans `IntersectionObserver`, toutes les images
sont considérées proches et protégées. La libération retire nos références et
les sources des images préchargées ; elle ne garantit pas une baisse immédiate
de la mémoire du processus ni ne vide le cache du navigateur.

Les données reçues dans `exports` appartiennent au parent : une bibliothèque ne
peut pas libérer un tableau encore retenu par celui-ci. Utiliser
`useContactSheetPages` pour charger un nombre limité de pages côté serveur.

## Pagination

La pagination appartient au parent : fournir seulement les exports de la page
courante. `thumbnailsPerRow` contrôle la densité, **pas** la taille d'une page.
`Pagination` utilise des numéros commençant à 1.

### Pagination locale

Si toutes les données sont déjà disponibles, aplatir les exports dans leur ordre
d'affichage, prendre `slice((page - 1) * pageSize, page * pageSize)`, puis reconstruire
les exports de la page en conservant leurs identifiants et leur ordre. Ne pas
appliquer `slice` séparément à chaque export : cela multiplie la taille de page.
Conserver la sélection par identifiant dans le parent, et non dans les objets de la page.

La story **Pagination** montre ce cas avec une sélection persistante entre pages.

### Pagination serveur

L'API de l'application retourne `{ exports, totalCount }` pour la page demandée.
L'exemple ci-dessous utilise une fonction `loadPage` fournie par l'application,
stable entre les rendus (par exemple avec `useCallback`). Elle doit vérifier les
erreurs HTTP, appliquer les filtres et retourner un ordre stable, avec l'identifiant
comme départage en cas d'égalité.

```tsx
import * as React from "react";
import {
  ContactSheetPicture, Pagination, useContactSheetPages, usePaginatedSelection,
  type ContactSheetPageRequest,
} from "@gs/gs-components-library";

function PaginatedContactSheet({ filters }: { filters: string }) {
  const [page, setPage] = React.useState(1);
  const loadPage = React.useCallback(async ({ page, pageSize, signal }: ContactSheetPageRequest) => {
    // Endpoint d'exemple, à adapter à l'application.
    const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize), filters });
    const response = await fetch(`/api/contact-sheet?${query}`, { signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json(); // { exports: ContactSheetExport[], totalCount: number }
  }, [filters]);
  const data = useContactSheetPages({
    page, pageSize: 60, maxCachedPages: 3, loadPage, cacheKey: filters,
  });
  const selection = usePaginatedSelection<number>({ totalCount: data.totalCount, resetKey: filters });
  const pageExports = data.exports.map((group) => ({
    ...group,
    thumbnails: group.thumbnails.map((thumb) => ({
      ...thumb, selected: thumb.picture_id ? selection.isSelected(thumb.picture_id) : false,
    })),
  }));
  return (
    <div aria-busy={data.loading}>
      {data.error && <p role="alert">{data.error.message}</p>}
      {data.loading ? <p>Chargement…</p> : !data.error && (
        <ContactSheetPicture
          key={page}
          exports={pageExports}
          virtualized
          imageCache={{ maxImages: 120, keepAroundRows: 4 }}
          onSelectionChange={(selected, ids) => selection.setMany(ids, selected)}
          thumbnailFeatures={{ rating: false, label: false, tags: false,
            comments: false, validation: false, open: false }}
          onThumbnailChange={(change) => {
            if (change.type === "selection") selection.setMany(change.pictureIds, change.selected);
          }}
        />
      )}
      <Pagination currentPage={page}
        totalPages={Math.max(1, Math.ceil(data.totalCount / 60))} onPageChange={setPage} />
    </div>
  );
}
// Remonter avec key={filters} au changement de filtres pour revenir aussi à la page 1.
```

`useContactSheetPages` conserve par défaut **3 pages de 60 emplacements**, tous
exports confondus. Le serveur doit respecter `pageSize` ; une réponse trop grande
est rejetée. Une page évincée est rechargée à la demande. Les requêtes obsolètes
sont annulées et leurs réponses tardives ignorées. `loadPage` doit être stable
(`useCallback`) ; `cacheKey`, la fonction ou la taille de page modifiées vident
le cache. `reload()` invalide toutes les pages après une modification métier.
Le cache n'est pas partagé entre instances et ne survit pas à leur démontage.
Ne pas conserver parallèlement toutes les pages dans un autre tableau parent.
La sélection par identifiant, elle, reste indépendante du cache des pages.

Le hook fonctionne aussi pour `ContactSheetReference` : fournir les exports de la
page courante au composant, avec les informations de la référence associée. Pour
une planche de plusieurs références, le parent doit également paginer les objets
référence ; le hook ne devine ni ne supprime leurs données métier.

Au changement de recherche, filtres ou tri, revenir à la page 1 et remettre la
sélection à zéro. On peut remonter cet exemple avec une `key` représentant les
filtres, ou gérer explicitement ces états dans le parent. Si le total diminue,
borner la page courante au nouveau nombre de pages.

**Portée de la sélection :** « Tout sélectionner » concerne tous les médias de
`exports`, donc toute la page fournie, y compris ses lignes non montées. Pour
« Toutes les pages », associer `CheckAllPages` à `usePaginatedSelection` et placer
le contrôle dans `toolbarActions`. `selection.selectAll()` produit un état
`{ mode: "exclude", keys: [...] }` utilisable sans charger tous les identifiants ;
l'API doit comprendre cet état et l'appliquer aux mêmes filtres. Une plage Maj
ne traverse pas les pages. Les emplacements vides ne sont pas sélectionnables.

**Réordonnancement :** `onReorder` ne reçoit que les médias et emplacements fournis
dans l'export de la page courante. Avec une pagination serveur, ne pas interpréter
ce résultat comme l'ordre complet de l'export ; l'application doit le replacer
dans l'ordre global (offset ou identifiants voisins) avant de le persister, ou
désactiver le réordonnancement pour la liste paginée.
