# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [Non publié]

> Section à fusionner dans `1.12.11` (non encore publiée) ou à renommer en
> `1.12.12` selon la décision de release.

### 🐛 Corrigé

- **`Badge` : centrage vertical du texte.** Deux causes cumulées, toutes deux
  dans la librairie :
  - Les classes de base portaient `self-start`, qui annulait le
    `align-items: center` du conteneur parent : un Badge placé dans un en-tête
    flex plus haut que lui se collait en haut (mesuré ~5px de décalage dans un
    en-tête de 52px). Remplacé par `w-fit h-fit`, qui protège toujours le Badge
    de l'étirement (`align-items: stretch`, la valeur par défaut) **sans**
    confisquer l'alignement décidé par le parent — une cross-size non-`auto`
    fait dégrader `stretch` en `flex-start`. Un Badge dans un conteneur
    `items-center` est donc désormais réellement centré, et dans un `flex-col`
    il reste collé à gauche et à sa largeur de contenu.
  - Le Badge n'avait aucune classe `leading-*`. Le `font-size` venait du preset
    GS (`--font-size-xs` = 9px) mais la `line-height` restait celle de la règle
    Tailwind stock `.text-xs` (16px), qui survit à même spécificité : texte de
    9px dans une line-box de 16px, décalé vers le haut d'environ 1px du fait de
    l'asymétrie d'AvenirNextLTPro. Ajout de `leading-tight`, comme le fait déjà
    `Button size="small"`.
  - Ajout de `min-h-4` (20px) pour aligner la hauteur minimale du Badge sur
    celle de `Button size="small"`. `min-height` et non `height` : un
    consommateur qui surcharge le padding (`py-1`) peut toujours dépasser.
- **`Badge` : les 4 variantes n'avaient plus aucun style.** Les classes
  `badge-normal`, `badge-secondary`, `badge-destructive` et `badge-outline`
  appliquées par `badgeVariants` n'existaient nulle part : le bloc CSS avait été
  écrit dans `src/styles/figma-tokens.css` (commit `6c3af9d`) puis effacé une
  heure plus tard par une régénération de ce fichier (`08d4809`). Les quatre
  variantes étaient donc visuellement identiques et sans fond. Le bloc est
  restauré dans `src/styles/custom-styles.css`, qui n'est pas généré, et corrigé
  au passage : `border-color: transparent` au lieu du raccourci
  `border: transparent`, qui remettait `border-style` à `none` et retirait donc
  les 2px de bordure haut/bas du Badge.

  ⚠️ **Impact visuel côté consommateurs** : les variantes reprennent un fond.
  Les sélecteurs `[data-bg="…"].badge-*` ont une spécificité (0,2,0) supérieure
  à celle d'un utilitaire Tailwind comme `.bg-white` (0,1,0) ; un consommateur
  qui surchargeait le fond d'un Badge par un utilitaire devra passer par `!` ou
  par une règle plus spécifique. Cas connu : `gs_w`,
  `src/pages/validation/components/HeaderContainer/HeaderContainerPresentation.js`
  (`className='… bg-white'`).

### 📚 Documentation

- Story de non-régression `Design System/Typography › Alignement vertical
  Badge / Button` : Badge et `Button size="small"` dans des conteneurs flex plus
  hauts qu'eux, avec repère de centre, plus les cas `items-stretch`, `flex-col`,
  `items-end`, `flex-wrap` et surcharge `py-1`. Elle remet et étend la story
  `AlignmentTest` de `6c3af9d`, disparue avec `08d4809`.
- `badge.stories.tsx` : correction d'une affirmation fausse qui prétendait que
  « Icons align perfectly with text using `items-center` ». `items-center`
  centre les boîtes des enfants sur la hauteur du Badge, pas le bloc de glyphes
  dans sa line-box — c'était précisément l'hypothèse à l'origine du bug.

## [1.12.11] - 2026-09-01

### ✨ Ajouté

- **`Thumbnail` : désactivation externe des actions de validation / refus** via les
  props `validateDisabled` et `rejectDisabled` (optionnelles, `false` par défaut,
  non-breaking).
  - Permet à l'application hôte de verrouiller les boutons ✓ / ✗ pendant une
    écriture en cours (changement de statut en lot, par exemple) au lieu de laisser
    des boutons d'apparence active dont le clic est rejeté en aval.
  - Les boutons restent **affichés** : plus besoin de passer `onValidate` /
    `onReject` à `undefined`, qui faisait disparaître le bloc d'actions et
    provoquait un saut de layout.
  - **Granularité par action** : `validateDisabled` ne désactive que ✓,
    `rejectDisabled` que ✗. Pour verrouiller tout le bloc, passer les deux.
  - **Combinaison** avec les désactivations internes existantes liées au `status`
    (OU logique, jamais un remplacement) : ✓ reste désactivé si le média est déjà
    validé (statut 50), ✗ s'il est déjà refusé / à refaire (statuts 31 / 35).
  - Accessibilité : attribut `disabled` natif réel (clic et focus bloqués par le
    navigateur), pas seulement une classe ; opacité réduite et
    `cursor: not-allowed` uniquement dans le cas de la désactivation externe, pour
    ne rien changer à l'apparence de la désactivation liée au statut.
  - Avec un menu de motifs de refus configuré
    (`bench.config.validation.rejection_options`), `rejectDisabled` empêche
    l'ouverture du menu et le referme s'il était ouvert, sans le réouvrir à la
    levée de la désactivation : aucun motif n'est cliquable pendant le verrouillage.
  - Nouvelles stories `Components/Thumbnail › DisabledValidationActions` et
    `DisabledDuringWrite`, et tests
    `src/__tests__/thumbnail-validation-disabled.test.tsx`.
  - Non-breaking : en l'absence des deux props, le comportement est strictement
    identique à 1.12.10.

## [1.12.10] - 2026-07-07

### ✨ Ajouté

- **`Pagination` : navigation au clavier** via la prop `keyboardNavigation`
  (désactivée par défaut, non-breaking).
  - `Shift + ←` = page précédente, `Shift + →` = page suivante (appelle
    `onPageChange` avec la page bornée à `1..totalPages`).
  - Gardes : sans effet si le focus est dans un champ éditable
    (`input`/`textarea`/`select`/`contenteditable`) ou si un modal est ouvert.
  - Sûr avec plusieurs `Pagination` sur une même page (haut/bas d'une liste) :
    l'évènement clavier n'est traité qu'une seule fois (pas de double saut).
  - Accessibilité : ajout de `aria-keyshortcuts` sur les boutons `<`/`>`.
  - Nouvelles stories `Components/Pagination › KeyboardNavigation` et
    `KeyboardNavigationDualInstances`.
- **`Pagination` : tooltips de raccourci** sur les boutons `<`/`>` (affichés
  uniquement quand `keyboardNavigation` est actif). Le tooltip montre les touches
  du raccourci (badges `⇧` et `←`/`→`), via le `Tooltip` de la librairie.

## [1.12.9] - 2026-07-07

### 🔒 Sécurité

- **Reclassement d'outils de build en `devDependencies`** : `vite-plugin-dts`,
  `@storybook/addon-mcp` et `@tmcp/session-manager` étaient déclarés dans
  `dependencies` alors qu'ils ne servent qu'au build / à Storybook (jamais
  exécutés par les consommateurs, les `.d.ts` étant déjà générés dans `dist/`).
  - Leur sous-arbre transitif n'est plus imposé aux projets consommateurs :
    les vulnérabilités `npm audit` associées (chaîne `vite-plugin-dts →
    @microsoft/api-extractor → lodash/minimatch`, etc.) disparaissent de
    l'arbre des consommateurs.
  - Aucun impact sur le paquet publié : `build:lib` génère toujours les types,
    et les `dependencies` restantes sont exclusivement des dépendances runtime.

## [1.12.8] - 2026-07-07

### 🎯 Amélioré

- **`Slider` : zones cliquables élargies (sans changement d'apparence)**. La
  surface de prise en compte des clics est agrandie via des pseudo-éléments
  transparents ; l'apparence (piste 2px, thumb 10px) reste identique.
  - La piste est cliquable sur **±10px** (10px au-dessus et 10px en dessous de
    la barre) grâce au `::before` du Root Radix.
  - **Toute la longueur** de la barre est cliquable : Radix repositionne sur le
    point le plus proche du clic (comportement natif, désormais accessible sur
    toute la zone élargie).
  - Zone de **préhension du thumb** élargie de 10px tout autour pour faciliter le
    drag.
  - En mode `debug`, les zones de hit sont légèrement teintées (rose) pour les
    visualiser.

## [1.12.7] - 2026-07-06

### ✨ Ajouté

- **`Thumbnail` : taille `size="auto"`**. Le composant occupe désormais toute la
  largeur disponible de son conteneur (`containerWidth: 100%`).
  - L'image conserve son ratio (`object-contain`, `w-full`) et pilote sa hauteur ;
    aucune hauteur fixe n'est imposée à la box de l'image.
  - Le conteneur de l'image reçoit `height: stretch` pour remplir la hauteur
    disponible du `Layout` parent.
  - Repli de hauteur (`200px`) pour les états placeholder (chargement / erreur /
    vue vide) afin d'éviter l'effondrement de la box.
  - Non-breaking : `small` / `large` et les tailles personnalisées (`"400px"`, …)
    conservent leur comportement. Nouvelles stories `Components/Thumbnail ›
    AutoSize` et `AutoSizeGrid`.

- **`Slider` : prop `steps`** (paliers discrets). Liste de valeurs autorisées
  (ex. `[2, 3, 6, 10]`) : le slider n'accepte que ces valeurs.
  - En interne le slider est piloté sur des index (0…n-1) ; `value` /
    `defaultValue` et `onValueChange` s'expriment en valeurs réelles.
  - Les paliers sont répartis régulièrement à l'écran quelle que soit leur valeur ;
    `min` / `max` / `step` sont ignorés dans ce mode.
  - Nouvelles stories `UI/Slider › DiscreteSteps` et `CurrentLabelDiscrete`.

- **`Slider` : prop `labelCurrent`**. Label positionné au-dessus du point de la
  valeur sélectionnée (suit le thumb).
  - Masqué au min si `labelMin` est défini, et au max si `labelMax` est défini,
    pour éviter le chevauchement.
  - Nouvelle story `UI/Slider › CurrentLabel`.

### 🐛 Corrigé

- **`Slider` : centrage des labels sur leur point**. `labelMin`, `labelMax` et
  `labelCurrent` sont désormais centrés précisément sur le centre réel du thumb
  (prise en compte de l'« in-bounds offset » de Radix : `offset = 5·(1 − P/50)`).
  - Le thumb est recentré horizontalement (`-translate-x-1/2`) : il ne déborde
    plus de la piste aux extrémités et son positionnement devient symétrique.

## [1.12.6] - 2026-07-02

### ✨ Ajouté

- **`Thumbnail` : prop `viewportBgColor`**. Nouvelle prop pour colorer le fond du
  **viewport** (le conteneur qui entoure l'image, letterboxing compris), distincte
  de `imageBgColor` qui ne colore que la content-box de l'`<img>` (pixels
  transparents / letterboxing interne).
  - Accepte toute valeur CSS (ex. palette du raccourci `D` : `#FFFFFF`, `#D0D0D0`,
    `#777777`, `#333333`).
  - Par défaut le viewport reste blanc ; le cas « vue vide » garde `bg-grey-middle`.
  - Non-breaking : `imageBgColor` conserve son comportement, les deux surfaces
    restent réglables indépendamment.
  - Nouvelle story `Components/Thumbnail › WithViewportBackground`.

## [1.12.5] - 2026-06-24

### 🎨 Modifié

- **Scrollbars : héritage du contexte `data-bg` le plus proche**. Les couleurs
  de scrollbar sont désormais exposées via des custom properties héritables
  (`--sb-thumb` / `--sb-thumb-hover`) posées sur chaque conteneur `data-bg`.
  - Un conteneur scrollable **sans `data-bg` propre** (ex. un `overflow:auto`
    applicatif non géré par la librairie) hérite automatiquement de la couleur
    de scrollbar du contexte `data-bg` **ancêtre le plus proche**.
  - L'imbrication (`grey > black > scroller`) est résolue par l'héritage des
    variables, sans conflit de spécificité ni dépendance à l'ordre des règles.
  - WebKit : ciblage de `[data-bg]` et `[data-bg] *` via `var(--sb-thumb)`.
    Firefox : héritage natif de `scrollbar-color`.
  - Nouvelle story `Layout/Layout › ScrollbarInheritedByNestedScroller`.

## [1.12.4] - 2026-06-24

### 🎨 Modifié

- **Scrollbars adaptées au contexte de fond (`data-bg`)**. La scrollbar native
  s'adapte désormais à la couleur du conteneur scrollable, avec un thumb dédié
  par contexte (couleurs issues des variables du design system) :
  - `data-bg="white"` → thumb `--color-grey-strong` (discret), hover `--color-grey-stronger`.
  - `data-bg="grey"` → thumb `--color-grey-stronger`, hover `--color-grey-strongest`.
  - `data-bg="black"` → thumb `--color-grey-strongest`, hover `--color-grey-stronger`.
  - Support WebKit (`::-webkit-scrollbar-*`) et Firefox (`scrollbar-color` /
    `scrollbar-width: thin`). Thumb fin arrondi avec marge
    (`border` transparent + `background-clip: padding-box`).
  - `SidePanel` et `ActivityPanel` posent désormais `data-bg` sur leur conteneur
    scrollable interne pour bénéficier du style sur tous les navigateurs.
  - Nouvelle story `Layout/Layout › ScrollbarByBackground`.

## [1.12.3] - 2026-06-22

### 🌐 Internationalisation

- **Externalisation des textes en dur** : tous les textes utilisateur (libellés,
  placeholders, `aria-label`, `title`, `alt`) qui étaient codés en dur dans les
  composants passent désormais par la fonction de traduction `t()`
  (`useTranslationSafe`), avec traductions EN / FR / ES / IT / DE.
  - Composants concernés : `ActionBar`, `FullFrame`, `SidePanel`, `ActivityPanel`,
    `Thumbnail`, `ButtonThumbnailComments`, `ButtonThumbnailTags`, `TagCross`,
    `ButtonStatus`, `MediaStatus`, `StatusIndicator`, `SelectAutocomplete`,
    `Pagination`, `FolderBrowser`, `BrandLogo`, `ThemeSwitcher`.
  - Nouvelles clés de traduction ajoutées dans `component-translations.ts`
    (`thumbnail.*`, `tag.remove`, `buttonStatus.*`, `mediaStatus.*`,
    `statusIndicator.label`, `select.noResults`, `select.searching`,
    `pagination.previousPage`, `pagination.nextPage`, `folderBrowser.rootFolder`,
    `brandLogo.alt`, `themeSwitcher.*`, `sidePanel.accessibilityTitle`,
    `notifications.panelTitle`).
  - Nouvelles props optionnelles `language` / `translations` sur `Thumbnail`,
    `SelectAutocomplete` et `Pagination` (alignées sur `FolderBrowser` /
    `DataTable`), pour fonctionner avec ou sans `TranslationProvider`.

Aucun changement cassant : les valeurs par défaut textuelles restent
surchargeables et le rendu est identique en langue par défaut.

## [1.12.2] - 2026-05-12

### 🔧 Modifié

- Mise à jour de la configuration Tailwind.

## [1.12.1] - 2026-05-12

### ✨ Ajouté

- **SegmentedControl — restyle pill + prop `size` + indicateur animé**.
  - Look pill complètement arrondi (`rounded-full`) au lieu du rectangle
    historique. Sur fond white / grey, le trigger actif devient une pill
    noire (texte blanc) ; sur fond black, la pill devient blanche (texte
    noir). Bordures supprimées, fond de la list adapté au contexte parent.
  - Les triggers acceptent texte seul, icône seule, ou icône + texte —
    rien à faire de spécial, on met le contenu dans `children` et le `gap`
    intégré gère l'espacement.
  - Nouvelle prop `size?: "small" | "medium" | "large"` sur
    `<SegmentedControlList>` (défaut `"large"` → comportement historique
    inchangé). Hauteurs respectives 30 / 40 / 50 px. La taille est
    propagée en interne aux triggers via un React Context — pas besoin
    de la répéter sur chaque trigger.
  - Indicateur (la pill noire active) **animé en slide** quand on change
    de trigger — même mécanique que `Tabs`, réutilisant le helper
    `computeActiveTabIndicator` déjà exporté. `transition-all duration-200
    ease-out` sur `left`/`width`. Recalcul automatique via
    `MutationObserver` (changements de `data-state`) et `ResizeObserver`
    (changements de taille du conteneur).
- **Stories** : nouvelle story `Default` reproduisant le mock (Tableau /
  Vignettes), nouvelle story `TextOnlyIconOnlyAndBoth` démontrant les
  trois compositions valides de triggers, nouvelle story `Sizes` pour
  comparer les trois tailles côte à côte. Panneau Controls nettoyé
  (retrait de `orientation` et `dir` qui n'avaient aucun effet visuel,
  ajout de `size` en `inline-radio`).

Aucun changement d'API publique — les usages existants
`<SegmentedControl>...</SegmentedControl>` rendent à l'identique.

## [1.12.0] - 2026-05-06

### ✨ Ajouté

- **Grade — prop `size`** (`"small" | "medium" | "large"`, défaut `"small"`).
  - `"small"` : taille historique (~14×14 px, texte 8 px). Les usages
    existants `<Grade value="A" />` rendent **strictement à l'identique**,
    aucun changement visuel.
  - `"medium"` : 20×20 px, parfaitement rond, texte 11 px en weight medium.
  - `"large"` : 50×50 px, parfaitement rond, texte 26 px en bold.
  - La story `WithCustomSize` (qui faisait du redimensionnement à la main
    via `className="w-X h-Y"`) est remplacée par une story `Sizes` qui
    démontre directement le prop sur les trois variantes × les cinq
    valeurs de grade.

## [1.11.2] - 2026-05-01

### 🐛 Corrigé

- **TabsWithViews — indicateur actif coincé sous le premier onglet quand une
  saved view est sélectionnée** (rapporté par Sourcing). Le calcul de la
  position de la barre noire active utilisait `offsetLeft` / `offsetWidth`,
  relatifs au plus proche `offsetParent`. Or `ViewTabTrigger` wrappe chaque
  vue dans un `<div className="tabs-view-wrapper">` qui porte
  `position: relative` (pour le hover du bouton kebab). Ce wrapper
  devenait l'`offsetParent` du trigger interne → `offsetLeft = 0`,
  l'indicateur sautait au début de la liste.
  - Le calcul est désormais basé sur `getBoundingClientRect()` relatif à la
    `TabsList` (+ `scrollLeft` pour le mode `showNavButtons`), donc
    indépendant de la chaîne d'`offsetParent`. Fonctionne pour les onglets
    fixes comme pour les saved views.
  - Helper pur `computeActiveTabIndicator(list, activeTab)` extrait pour
    permettre un test unitaire dédié (`src/__tests__/tabs-indicator.test.tsx`),
    couvrant le cas du trigger wrappé, du `TabsList` non aligné sur `x=0`,
    et du scroll horizontal.

### ✨ Ajouté

- **Tabs / TabsWithViews — preview de l'indicateur au survol**. Quand le
  curseur passe sur un onglet (fixe ou saved view), la barre noire active
  glisse jusqu'à cet onglet en preview ; lorsqu'on quitte la liste sans
  cliquer, elle revient à l'onglet actif. Implémenté en event delegation
  (`onPointerOver` + `onPointerLeave` sur la `TabsList`) → aucun listener
  par trigger, ne perturbe pas le bouton kebab des saved views (qui n'a
  pas `role="tab"`). Aucun changement d'API publique.

## [1.11.1] - 2026-05-01

### 🐛 Corrigé

- **Packaging CSS** : `package.json` référençait `dist/style.css` qui n'est pas
  produit par le build (le fichier réel s'appelle `dist/lib.css`). Les
  consumers qui suivaient le champ `style` ou importaient
  `@gs/gs-components-library/style.css` recevaient un 404 silencieux et
  étaient obligés d'ajouter le path de la lib à leur `content` Tailwind
  pour que les classes utilitaires fonctionnent. Le champ `style` et
  l'export `./style.css` pointent désormais sur `dist/lib.css` (qui contient
  bien toutes les classes utilisées par les composants, y compris les
  arbitrary values comme `w-[7px]` / `h-[15px]`).

### ✨ Ajouté

- **Tailwind preset** : nouveau fichier `tailwind-preset.cjs` exporté via
  `"./tailwind-preset"` dans `package.json`. Les projets consumers qui
  écrivent leurs propres composants avec les tokens GS (couleurs, spacing
  5 px, polices, animations…) peuvent désormais étendre le preset au lieu
  de dupliquer la config :

  ```js
  module.exports = {
    presets: [require('@gs/gs-components-library/tailwind-preset')],
    content: ['./src/**/*.{ts,tsx,js,jsx}'],
  };
  ```

  Le `tailwind.config.ts` interne consomme également ce preset, ce qui
  élimine tout risque de drift entre la config de la lib et celle des
  consumers.
- **Documentation** : `README.md` et la page Storybook `Introduction.mdx`
  ont été réécrits pour expliquer correctement comment installer et
  utiliser la lib (import du CSS via `@gs/gs-components-library/styles`,
  usage du preset Tailwind, comportement intentionnel du `StatusIndicator`
  dans un `<button disabled>`, conventions i18n, workflow de release).

## [1.11.0] - 2026-05-01

### ✨ Ajouté

- **DataTable** : nouveau composant générique de tableau, posé sur les
  primitives shadcn (`Table`, `TableHeader`, `TableRow`...). Le primitif
  reste exporté et utilisable pour les layouts 100 % custom.
  - Colonnes déclaratives (`header`, `cell`, `sortable`, `sortAccessor`,
    `sortCompare`, `align`, `interactive`, `headerClassName`, `className`).
  - Tri (interne ou contrôlé) avec ordre stable et indicateur de direction.
  - Pagination (interne ou contrôlée), `pageSize` par défaut à 50, `pageSizeOptions`
    optionnel pour afficher un `Select` "Lignes par page" dans le footer.
  - Sélection multi-lignes avec checkbox tri-state sur le header (page
    courante), dropdown `Select page` / `Select all pages` /
    `Clear selection`, et **shift-click** pour sélectionner un range
    (modèle Gmail/GitHub : ancre + snapshot, le range se rétracte
    proprement quand on clique vers une ligne plus proche de l'ancre).
  - `ActionBar` bulk câblé automatiquement quand au moins une ligne est
    sélectionnée — le slot reçoit `{ selectedRows, selectedCount, clearSelection }`.
  - `onRowClick` + `interactive: true` sur les cellules avec widgets pour
    arrêter la propagation.
  - État vide localisé, `emptyState` overridable, `rowClassName` calculé
    par ligne.
  - S'adapte au `BgContext` parent : white → header gris-clair ; grey →
    carte blanche avec header blanc ; black → carte sombre.
  - Conventions i18n alignées sur `FileBrowser` / `ActivityHeatmap`
    (`language` + `translations` props), avec `itemLabel` configurable
    pour le compteur du footer ("1–25 sur 247 *items*"). Traductions
    en EN/FR/ES/IT/DE livrées par défaut.
  - Le filtrage est volontairement externe : la `DataTable` rend `data`
    déjà filtré par le consumer.
- **PageWelcome** : nouveau composant de bandeau d'accueil (eyebrow +
  greeting personnalisé + subtitle libre). Le greeting est auto-déduit
  de l'heure locale, localisé en EN/FR/ES/IT/DE.
- **Card** : nouveau prop `variant?: "filled" | "outline"` (défaut
  `filled`, totalement rétrocompatible). En mode `outline`, la Card
  conserve le fond du parent et est séparée par une bordure 1px.
  Idéal pour les KPI cards posées sur fond uniforme.
- **Select** : nouveau prop `discrete?: boolean` sur `SelectTrigger`
  (défaut `false`). Au repos, le rond contenant la flèche prend la
  couleur de fond du trigger pour devenir visuellement transparent ;
  les états hover, pressed et open conservent le styling habituel.

### 🐛 Corrigé

- **Card** : les `<p>` et `<h1..h4>` natifs à l'intérieur d'une `Card`
  héritent désormais correctement de la couleur d'avant-plan définie
  par la Card (le `typography.css` global imposait `color: black` ce qui
  rendait le texte invisible sur la variante black).
- **Select** : la couleur du placeholder s'adapte désormais au contexte
  `data-bg`. Sur fond noir, le placeholder utilise `grey-stronger`
  (#c1c1c1) au lieu du `grey-strongest` (#595959) qui était illisible
  sur le trigger sombre.

### 📝 Notes

- La date-fns locale `de` (allemand) est désormais incluse dans
  `getDateLocale`, ce qui permet aux `ActivityHeatmap` et autres
  composants localisés de formater correctement les dates en allemand.
- La page `Docs` Storybook du `Select` est intégralement passée en
  anglais pour s'aligner sur les autres composants.

## [1.10.0] - 2026-04-29

### ✨ Ajouté

- **ActivityHeatmap** : nouveau composant graphique inspiré des
  heatmaps de contributions. Affiche une fenêtre d'activité
  quotidienne sur une grille 7 lignes × N semaines, avec libellés
  des mois et des jours, légende et échelle Less / More.
  - Couleurs configurables : prop `color` (couleur de base, 4 nuances
    dérivées automatiquement) ou `colorScale` (5 couleurs explicites).
  - Seuils d'intensité auto-calculés (quartiles) ou fournis via
    `levels`.
  - Unité paramétrable via `unit` (clé de traduction) avec gestion du
    pluriel par convention `_plural`. Unités fournies : `file`
    (défaut), `post`, `event`, `activity`, `upload` en EN/FR/ES/IT/DE.
  - Légende et tooltip localisés ; libellés de jours / mois issus
    des locales `date-fns`.
  - Support du `TranslationProvider` ainsi que des props `language` /
    `translations` (même convention que `FileBrowser` / `FolderBrowser`).
  - Ajout de la locale `de` à `getDateLocale` pour un formatage de
    date allemand cohérent.

## [1.9.2] - 2026-04-27

### 🐛 Corrigé

- **FileBrowser i18n** : substitution du placeholder `{plural}` dans
  `fileBrowser.filesLimitReached`, `fileBrowser.filesAndMore` et
  `fileBrowser.showMoreItems` (FR/ES/IT). Le compteur affichait
  `"1 000 fichier{plural} et plus..."` au lieu de
  `"1 000 fichiers et plus..."`.
- **FolderBrowser i18n** : ajout des clés `folderBrowser.columnName`,
  `folderBrowser.emptyFolder` et `folderBrowser.select` qui étaient
  consommées par le composant mais absentes de `componentTranslations`,
  ce qui faisait apparaître les clés brutes (ex.
  `"folderBrowser.emptyFolder"`) dans le DOM.
- Renommage `folderBrowser.empty` → `folderBrowser.emptyFolder` pour
  s'aligner sur l'usage du composant.
- Suppression des clés mortes `folderBrowser.back`,
  `folderBrowser.rootFolder` et `folderBrowser.uploadHint` (vérifié par
  grep complet : plus aucune utilisation interne).

### 🧪 Tests

- Ajout de Vitest + happy-dom + Testing Library.
- Suite `src/__tests__/file-browser-i18n.test.tsx` couvrant la non-fuite
  de `{plural}` / `{count}` dans le DOM (FR/ES/IT) et la présence des
  copies localisées du FolderBrowser vide (EN/FR/ES/IT/DE).

### 📝 Notes

- La convention `{plural}: "s"|""` ne couvre proprement que EN/FR/ES/IT.
  À terme, migrer vers les pluriels i18next natifs (`_one`/`_other`)
  pour DE et les langues à pluriels complexes.

## [1.0.0-beta.1] - 2025-01-16

### 🚨 BREAKING CHANGES

- **Exports modulaires** : Refonte complète du système d'exports pour optimiser le tree-shaking
  - Migration obligatoire : tous les imports doivent être mis à jour
  - Les exports default ont été supprimés au profit d'exports nommés uniquement
  - Économie de ~80% sur la taille du bundle avec les imports modulaires

### ✨ Ajouté

- **Imports modulaires** pour tous les composants
  ```typescript
  // Nouveau (recommandé)
  import { Button } from '@gs/gs-components-library/button';

  // Ancien (toujours supporté)
  import { Button } from '@gs/gs-components-library';
  ```

- **Documentation complète** dans `/docs`
  - Guide des imports modulaires
  - Architecture de la librairie
  - Intégration Figma
  - Documentation des providers
  - API Reference complète

- **Tokens Figma** : Support des primitives et tokens importés depuis Figma
  - `src/styles/figma-primitives.json`
  - `src/styles/figma-tokens.json`

- **Nouvelles icônes** : AlertTriangle, Loader, ChevronDown/Up/Left/Right, Globe, Menu, Search, Upload, Users

### 🔄 Modifié

- **Configuration Vite** : Support des multiple entry points pour le build modulaire
- **Package.json** : Ajout du champ `exports` pour déclarer tous les chemins d'import
- **TypeScript** : Configuration améliorée pour la génération de types par module

### 🐛 Corrigé

- Correction du `triggerRef` dans Select.tsx
- Correction des exports mixtes (named + default) causant des warnings
- Ajout des icônes manquantes dans le système d'icônes

### 📦 Dépendances

- Ajout de `terser` pour la minification
- Ajout de `glob` pour la configuration Vite

### 📝 Migration

Pour migrer depuis la version 0.x :

1. **Mettre à jour les exports default** :
   ```typescript
   // Avant
   import FileBrowser from '@gs/gs-components-library/file-browser';
   import ColorInput from '@gs/gs-components-library/ColorInput';

   // Après
   import { FileBrowser } from '@gs/gs-components-library/file-browser';
   import { ColorInput } from '@gs/gs-components-library/ColorInput';
   ```

2. **Utiliser les imports modulaires** (optionnel mais recommandé) :
   ```typescript
   // Pour optimiser la taille du bundle
   import { Button } from '@gs/gs-components-library/button';
   import { ThemeProvider } from '@gs/gs-components-library/providers/theme';
   ```

3. **Vérifier les composants suivants** qui n'ont plus d'export default :
   - FileBrowser
   - IconProvider
   - ButtonStatus
   - StatusIndicator
   - ThemeCustomizer
   - ColorInput

---

## [0.3.0-beta.18] - 2025-01-16

Version précédente avant la refonte des exports.