# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.39.0] - 2026-10-29

### Modifié

- `ContactSheetThumbnails` est renommé `ContactSheetPicture` (et `ContactSheetThumbnailsProps` en
  `ContactSheetPictureProps`). Les anciens noms restent exportés comme alias dépréciés ; la story passe à
  `Components/ContactSheetPicture`.
- `ContactSheetReference` et `ContactSheetPicture` : `virtualized` vaut maintenant `"auto"` par défaut. La grille
  n'est fenêtrée qu'au-delà de 100 vignettes ; en dessous, rien ne change. `true` force la virtualisation, `false`
  monte toutes les vignettes. **À vérifier dans les applications** : au-delà de 100 vignettes, les vignettes hors
  écran ne sont plus dans le DOM (recherche Ctrl+F, impression, `scrollIntoView` sur `[data-picture-id=…]`, état
  local d'un menu ouvert, tests jsdom qui cherchent une vignette lointaine). Passer `virtualized={false}` dans ces
  cas.
- `AvatarFallback` : les initiales font 40 % du diamètre de l'Avatar (9px minimum), tailles personnalisées
  comprises : 20px → 9px, 30px → 12px, 50px → 20px (avant : 10px, 9px et 11px, le `medium` plus petit que le
  `small`). Un `text-*` passé en `className` reste prioritaire. La prop `size` de `AvatarFallback` est dépréciée
  et sans effet. Story `InitialsCentering`.

### Ajouté

- Virtualisation avec le glisser-déposer (`onReorder`) et en `exportsLayout="separated"`. En `separated`, les
  en-têtes d'export restent montés et chaque grille d'export est fenêtrée séparément. La vignette saisie reste
  montée pendant tout le drag, même hors de la fenêtre ; la cible de dépôt est mesurée sur les vignettes montées
  et calculée pour les autres (lignes de hauteur identique). Story `VirtualizedReorder`.

### Corrigé

- Safari : avec `virtualized`, la page atteignait 33 millions de px de haut et la fenêtre ne suivait plus le
  défilement (planche vide en bas). En cause, la hauteur `-webkit-fill-available` de la racine du `Thumbnail`,
  que seul Safari applique.
- Safari : dans toutes les grilles de planche contact, les vignettes faisaient 859px de haut au lieu de 256px
  (même cause). Elles ont maintenant la hauteur de Chrome et Firefox.
- Safari : avec la grille fenêtrée, un drop pouvait être annulé ou viser la cible précédente ; `dragenter`
  calcule maintenant la cible comme `dragover`.

## [1.38.0] - 2026-10-29

### Ajouté

- `ContactSheetThumbnails` : planche contact sans regroupement par référence, avec une grille continue, sélection
  globale alignée sur les cases des vignettes, actions de barre et API de changements commune à `ContactSheetReference`.
- `virtualized` sur les deux planches : montage des lignes visibles et de deux lignes de réserve de chaque côté.
  Le rendu reste complet avec `onReorder` ou des exports séparés pour préserver le glisser-déposer.
- `imageCache` : budget de 120 images par grille et quatre lignes protégées par défaut, configurable en chargement
  groupé. Éviction des images éloignées les moins récemment utilisées et libération des images d'une grille entièrement
  hors de la zone de préchargement. Les blocs proches restent protégés et peuvent dépasser le budget.
- `useContactSheetPages` : chargement serveur avec cache de pages borné (3 pages de 60 emplacements par défaut),
  annulation des demandes obsolètes, invalidation et rejet des réponses dépassant la taille de page. Documentation et
  stories de pagination, sélection persistante, virtualisation et cache borné.
- `ClippingEditor` : `historyLimit` (100 étapes par défaut) et `imageKey` pour réinitialiser une session lorsque l'URL
  source est réutilisée pour une nouvelle image ou révision.

### Corrigé

- Les caches de callbacks et d'actions des vignettes démontées sont supprimés. La priorité des images visibles prend
  en compte les cellules montées par la virtualisation et ignore les ancêtres qui ne défilent pas réellement.
- `ClippingEditor` : changer de source démarre une nouvelle session et libère l'historique et les états de l'ancienne.
  Les handlers et sources d'images, les canvas de lecture, d'aperçu, temporaires et des volets sont nettoyés ; les
  calculs précédents sont annulés et leurs résultats tardifs ignorés. Les téléchargements obsolètes sont écartés.

### Modifié

- `ContactSheetThumbnails` utilise le chargement groupé par défaut. La révélation des images bénéficie d'un fondu de
  150 ms, y compris en mode virtualisé, sans rejouer le fondu au remontage d'une image encore en cache et en respectant
  la préférence de réduction des animations. Le chargement natif reste le défaut de `ContactSheetReference`.

## [1.37.1] - 2026-10-28

### Corrigé

- `AvatarFallback` : les initiales sont centrées sur la hauteur des capitales. Avenir Next réserve de la place pour les
  jambages, et les majuscules s'affichaient environ 0,1 em au-dessus du centre (1 px à 13 px, 2 à 2,5 px vers 20 px). Le
  texte est rogné par `gs-text-trim`, comme dans le Badge ; les éléments passés en enfants (icônes, spans) et le mode
  `asChild` ne sont pas modifiés. Story `InitialsCentering`.

### Modifié

- `trimTextChildren`, qui enveloppe le texte dans un span `gs-text-trim`, passe de `badge.tsx` à `src/lib/text-trim.tsx`
  pour être partagé. Le Badge ne change pas.

## [1.37.0] - 2026-10-23

### Ajouté

- `ContactSheetReference` et `ContactSheetThumbnailGrid` : prop `imageLoading` (`"native"` | `"grouped"`). Avec
  `"grouped"`, rien n'est demandé avant que les vignettes approchent de l'écran (300px, ou du conteneur qui défile) ; les
  références visibles passent d'abord, une file partagée limite les images en vol, et un bloc sorti de la zone avant
  d'avoir démarré ne démarre pas. Les images sont préchargées et décodées en JS (`fetchPriority="high"` si visibles), puis
  toute la référence apparaît d'un coup avec un fondu de 150 ms (sans fondu si `prefers-reduced-motion`). Au bout de 2 s,
  ce qui est prêt apparaît et le reste suit image par image. Les très grandes références sont découpées par lignes
  (`max(colonnes × 4, 24)` images par bloc). Une 404 ou une image indécodable ne retarde pas les autres et affiche l'icône
  de fichier cassé, nom de fichier visible. Une `src` changée se charge comme une nouvelle image, l'ancienne restant
  affichée jusqu'à ce qu'elle soit prête. Sans la prop (`"native"`), rien ne change. Story `GroupedImageLoading`.
- `Thumbnail` : props `imagePending` (cadre à sa taille, sans `<img>` ni requête) et `imageFadeIn` (fondu à l'apparition
  de l'image), pilotées par la grille en chargement groupé.

### Performances

- `Thumbnail` est mémoïsé : une vignette ne se redessine que si ses props changent. Les tableaux et objets reconstruits à
  chaque rendu (`actions`, `statusButtons`, `tags`, `comments`, `bench`, `translations`) sont comparés par contenu, les
  callbacks par identité. La grille de la planche contact passe des callbacks stables par vignette et des actions stables
  à contenu égal (chaque action appelle sa dernière version) : sélectionner une vignette ne redessine plus ses voisines.
- `Thumbnail` : les menus (étoiles, couleurs, tags, commentaires, actions, motifs de refus) et les infobulles des boutons de
  statut ne montent leur machinerie Radix qu'au premier survol de la vignette ou au premier focus clavier (le focus est
  conservé). Les boutons restent dans le DOM, identiques, avec leurs libellés accessibles ; un appui direct sur un bouton
  ouvre son menu. Mécanisme générique dans `DropdownMenu`, `Popover` et `Tooltip` (zone `DeferredOverlaysProvider`) :
  hors d'une telle zone, rien ne change.

## [1.36.1] - 2026-10-23

### Ajouté

- `PageHeader` : prop `titleContent`, rendue juste après le titre et avant le bouton du titre (ex. un Badge de statut), et
  prop `titleButtonTooltip`, infobulle et libellé accessible du bouton du titre. Sans ces props, rien ne change. Story
  `TitleContentAndTooltip`.

## [1.36.0] - 2026-10-22

### Ajouté

- `ButtonMenu` et `ButtonMenuSmall` : prop `menuBgContext` (`"white"` | `"grey"` | `"black"`), comme `ButtonMenuStatus` et les
  `ButtonThumbnail*` : le menu et ses actions sont dessinés pour ce fond, le bouton garde celui de son parent (ex. un menu
  ouvert depuis une ActionBar noire au-dessus d'une page grise). Sans la prop, rien ne change. Stories `MenuBgContext`.

## [1.35.0] - 2026-10-22

### Ajouté

- `ButtonMenuStatus` : options aux couleurs propres, pour des statuts qui ne sont pas des statuts de média (lots, tâches…) :
  `color` (toute couleur CSS, dessinée à la place de la couleur du statut média) et `value` (identifiant), rendus par le
  nouveau callback `onOptionSelect(option)`. `status` et `currentStatus` deviennent facultatifs (une barre d'actions sur
  une sélection n'a pas de statut courant). Story `CustomStatuses`.

### Corrigé

- Stories `ButtonMenuStatus` sans `args` : erreurs de typage TypeScript.

## [1.34.2] - 2026-10-22

### Corrigé

- `ButtonMenu` dans une `ActionBar` : le menu suit le fond noir de la barre et prend le rendu « fond noir » de la charte
  (menu clair, actions grises au texte foncé, action survolée en noir). Il était traité comme sur fond blanc alors que ses
  actions restaient dans le contexte noir de la barre : texte foncé sur gris foncé, illisible (visible dans la story
  « ActionBar with Menu Components »).

## [1.34.1] - 2026-10-22

### Corrigé

- `CommentComposer` dans une fenêtre modale (`SidePanel`, `Sheet`, `Dialog`) : la liste des personnes à mentionner est rendue
  dans la fenêtre qui contient le champ, et non plus en fin de page où la fenêtre bloquait la souris ; on peut à nouveau
  choisir une personne au clic (le clavier fonctionnait déjà). Hors d'une fenêtre, rien ne change.

## [1.34.0] - 2026-10-22

### Ajouté

- `CommentComposer` : champ de commentaire enrichi avec mentions `@` et autocomplétion locale ou asynchrone,
  sélecteur d’emojis chargé à la demande, gras et italique avec raccourcis clavier et conventions Markdown.
- Contenu JSON contrôlé ou non, texte brut et identifiants uniques des personnes mentionnées dans `onChange` ;
  bouton de publication et validation gérés par le formulaire parent, avec rappel `onSubmitShortcut` optionnel.
- Libellés anglais et français, navigation clavier des suggestions, états de recherche vide ou en erreur et
  adaptation aux fonds blanc, gris et noir. Export dédié `@gs/gs-components-library/comment-composer`.
- Storybook : dix stories en anglais sous **UI / CommentComposer**, dont l’intégration dans un formulaire.
- Dix tests couvrant le contenu, les mentions, les recherches asynchrones, le formatage, les emojis,
  la remise à zéro, le raccourci de soumission et l’état désactivé.

## [1.33.2] - 2026-10-22

### Corrigé

- `SelectAutocomplete` sur fond noir : le menu des options prend la couleur de ses lignes (`black-secondary`) ; il gardait
  un cadre blanc qui laissait une bande blanche au-dessus et au-dessous de la liste. Fonds blanc et gris inchangés.

## [1.33.1] - 2026-10-21

### Corrigé

- `DataTable` sur fond gris : le survol des lignes passe en `grey-lighter` (le `grey-light` habituel se confondait avec le fond).
- `DataTable`, colonnes rétrécies : l'en-tête ne dépasse plus de sa colonne et reste centré ou aligné à droite selon `align` ;
  l'indicateur de tri reste visible, le libellé se coupe avec « … » (titre complet au survol) ; sous 80 px, la colonne passe
  à 8 px de marge latérale au lieu de 16.

## [1.33.0] - 2026-10-21

### Ajouté

- `TruncatedText` : les autres attributs HTML (`data-*`, `aria-*`, `style`, gestionnaires) sont transmis à l'élément
  du texte ; type `TruncatedTextProps` exporté.
- Storybook : page **UI / TruncatedText** rédigée en anglais (API, comportement), story `InTableCell` (colonne de
  DataTable redimensionnable avec un pictogramme toujours visible à droite).

### Corrigé

- Stories `TruncatedText` sans `args` : erreurs de typage TypeScript.

## [1.32.0] - 2026-10-21

### Ajouté

- `DataTable` : largeur des colonnes et redimensionnement, sans changement pour les tables existantes.
  `column.width` (px), `minWidth` / `maxWidth` et `resizable` ; `resizableColumns` ajoute une poignée entre les colonnes,
  pas sur le bord droit de la table (souris, stylet ou doigt ; flèches au clavier, Maj pour 50 px ; double-clic pour
  revenir à la largeur déclarée). Sur fond gris, les séparateurs prennent un gris plus clair. Largeurs contrôlées (`columnWidths` + `onColumnWidthsChange`) ou non (`defaultColumnWidths`).
  Quand toutes les colonnes ont une largeur, la table passe en mise en page fixe : plusieurs tables aux mêmes largeurs
  restent alignées.
- Traduction `dataTable.resizeColumn` (EN, FR, ES, IT, DE).
- Storybook : page **UI / DataTable / Column sizing** (Resizable, Fixed Widths, Constraints, Controlled Widths,
  Aligned Groups).

## [1.31.4] - 2026-10-19

### Ajouté

- `ClippingEditor` : `initialMask` affiche immédiatement un masque déjà calculé pour `defaultMarks` (par exemple le résultat
  d'une image validée) et n'appelle pas `onSegment` tant que les traits ne changent pas ; revenir par annulation aux traits de
  départ le réaffiche sans nouveau calcul. Ignoré si ses dimensions ne sont pas celles de l'image.
- `ClippingEditor` : `onSettingsOpenChange`, `defaultFileInfoOpen` et `onFileInfoOpenChange` permettent de retrouver le panneau
  « Réglages et informations » (et son bloc « Informations du fichier ») dans l'état où l'opérateur l'a laissé.
- Storybook : story `WithInitialMask` (avec compteur d'appels au moteur) et `RememberedPanelState`, section « Reopening finished
  work » de la page Docs.

### Corrigé

- `ClippingEditor` : le bouton `primaryAction` a la même hauteur (40 px) que les autres boutons du header.

## [1.31.3] - 2026-10-19

### Ajouté

- `ClippingEditor` : `titleAccessory` pour insérer un contrôle hôte à côté du titre et `primaryAction`
  pour afficher une action avant la fermeture. Gestion des promesses, chargement et raccourci Cmd/Ctrl+Entrée.
- `IconProvider` : pictogrammes fins `ViewSingle` et `ViewSplit`.

### Modifié

- `ClippingEditor` : pictogrammes GS pour fermer, zoomer et afficher les réglages ; boutons de zoom et de bascule
  original/résultat de 40 px de haut, séparateurs dans le header et espace de 50 px avant la fermeture.
- « Ajuster » remplit la hauteur ou la largeur disponible sans marge ajoutée, en conservant les proportions.
  Le zoom 1:1 est inchangé.

## [1.31.2] - 2026-10-19

### Modifié

- `IconProvider` : ajout du pictogramme `Hand`, au trait fin harmonisé avec la Gomme et le surligneur.
- `ClippingEditor` : l'outil Déplacer utilise ce pictogramme en 20 px dans un bouton de 40 px.

## [1.31.1] - 2026-10-19

### Modifié

- `ClippingEditor` : ergonomie harmonisée avec la charte GS, outils dans une colonne de 40 px,
  actions de sélection contextuelles, téléchargement dans le bandeau Résultat et panneau de réglages repliable.
- Taille du pinceau Cheveux et Gomme et adoucissement des sélections accessibles dans le bandeau Zone de travail,
  sans modification du fonctionnement des outils ni du traitement alpha.
- `IconProvider` : pictogrammes de sélection, surligneur (`Highlighter`) et gomme (`Eraser`) ;
  `Minus` reprend la largeur et la finesse du trait horizontal de `Plus`.

### Corrigé

- `Slider` : transmission du nom accessible à la poignée du curseur.

## [1.31.0] - 2026-10-17

### Ajouté

- `ClippingEditor` : l'outil **Scalpel** devient le **Crayon** (`pencil`) et trace une sélection fermée au lieu de couper.
  **Crayon +** et **Crayon −** ajoutent à la sélection ou en soustraient ; **Inverser**, **Supprimer** (avec un
  adoucissement réglable) et **Désélectionner** agissent sur elle. **Garder**, **Retirer**, **Cheveux** et la **Gomme**
  n'agissent qu'à l'intérieur de la sélection. Nouveaux outils de marque : `pencil`, `invert`, `deselect`, `delete`,
  `erase` (champs `mode` et `feather`). Les anciennes marques `scalpel` restent lisibles.
- `ClippingEditor` : prop `autoSegment` (affiche le détourage automatique à l'ouverture de l'image).
- `ClippingEditor` : niveau de zoom affiché, bouton **1:1** et touche `0` (100 % = un pixel image par pixel écran, y compris sur
  écran Retina). Pixels francs à partir de 200 %.

### Corrigé

- `ClippingEditor` : à 100 % l'image n'est plus floutée (calage sur la grille de pixels écran, canvas dimensionné en pixels
  écran entiers).

## [1.30.0] - 2026-10-17

### Modifié

- Storybook passe de 9.1.16 à 10.6.2. Le serveur MCP (`/mcp`) expose
  désormais la documentation des composants : `docs-list`, `docs-show`,
  `docs-show-story`, `stories-find-by-component`, `stories-preview`.
- Node.js 22 requis pour le développement (Storybook 10 exige 20.19+) :
  `.nvmrc`, image Docker et workflow de publication.
- Le package ne déclare plus de script `postinstall` (correctif
  `@tmcp/session-manager` devenu inutile), qui s'exécutait aussi chez les
  projets consommateurs.

### Corrigé

- `ButtonPlus` : la pastille « + » est un `span` et non plus un second
  `<button>` imbriqué (HTML invalide). Rendu identique.
- `ButtonNotifications` : `addNotifications` exposé par ref suit les valeurs
  à jour de `limit` et `debug` (il gardait celles du premier rendu).
- `StyleProvider` : un changement de `rootClassName` ou `loadFonts` est
  appliqué au `body`.
- Storybook : plus aucune erreur console sur les 86 pages de documentation ni
  sur les 697 stories, lint sans erreur ni avertissement.

## [1.29.1] - 2026-10-16

### Ajouté

- `ClippingEditor` : page « Guide » dans Storybook (en anglais) : démarrage
  rapide, props, outils et raccourcis, gestes du scalpel, modèle de données,
  contrat `onSegment`, fonctionnement côté serveur (requête, réponse, sens de
  chaque outil, options de moteur, squelette de service) et rappel de
  l'architecture observée de Clipping Magic.
- Les types `ClippingNode`, `ClippingPoint` et `ClippingSegmentRequest` sont
  exportés par le package.

## [1.29.0] - 2026-10-16

### Ajouté

- `ClippingEditor` : éditeur de détourage inspiré de Clipping Magic. Outils
  Garder, Retirer, Cheveux, Gomme, Scalpel et Déplacer, taille du pinceau,
  annuler/rétablir, zoom molette et ajustement, vue simple ou partagée
  « Original + traits » / « Aperçu » sur fond transparent, export PNG à la
  taille source. Le composant ne détoure pas : `onSegment({ marks, width,
  height, signal })` renvoie un masque alpha (`ClippingMask`) calculé par le
  moteur de l'application. `createColorClippingSegmenter` fournit un moteur
  de démonstration par couleur pour Storybook, les tests et le repli hors
  ligne.
- `ClippingEditor` : le scalpel trace une courbe éditable. Nœuds ronds
  (courbe) ou carrés (angle vif), basculés par double-clic ou par le bouton
  en haut à gauche du nœud ; bouton en haut à droite (ou Suppr) pour le
  supprimer. Glisser un nœud déplace le chemin ; cliquer sur le chemin y crée
  un nœud ; cliquer entre le nœud et le bord de son anneau relie le tracé à un
  autre point, une extrémité sur une autre les soude ou referme le tracé
  (Entrée ou Échap terminent). Le trait est plus épais. Chaque geste n'écrit
  qu'une entrée d'historique. `ClippingMark` gagne `nodes` et `closed`
  (les `points` restent la courbe échantillonnée lue par le moteur).
- `ClippingEditor` : raccourcis alignés sur Clipping Magic. Flèches pour
  déplacer la vue (50 px, Maj : 1 px), PageUp / PageDown pour zoomer, Q
  maintenu pour voir l'original dans l'aperçu, `[` et `]` pour la taille du
  pinceau, Maj + Z pour rétablir. Les autres : Espace, V, X, S, C ou Maj, Z,
  Y, Accueil, 1, 2. Le zoom des boutons passe à ×1,2.

## [1.28.1] - 2026-10-13

### Corrigé

- `FullFrame` : la molette sur le header ou le footer fait défiler le body.
  Dans un `PageFillLayout`, la partie haute se replie avant le défilement de
  la liste. Les contrôles défilants, gestes de zoom et défilements horizontaux
  conservent leur comportement natif.
- `FullFrame` : Échap appelle le même `onClose` que le bouton X, uniquement
  sur le FullFrame du dessus. Les événements déjà traités par une modale,
  un menu, une liste déroulante ou un tooltip Radix sont ignorés. Nouvelle
  prop `closeOnEscape` (défaut `true`) pour désactiver le raccourci ; un frame
  non fermable protège aussi ceux situés dessous. Les répétitions de touche
  sont ignorées pour éviter de fermer plusieurs frames en maintenant Échap.

### Modifié

- `FileBrowser` utilise directement `FileDropZone mode="overlay"` autour de
  sa liste, avec une seule gestion des dépôts et des erreurs. Le breadcrumb,
  les filtres, les déplacements internes et le callback historique
  `onFileDrop(event)` sont conservés. Le changement de dossier réinitialise
  le retour de dépôt sans remonter la table ni perdre son focus.
- `FileDropZone` : ajout de `resetKey`, de l’événement natif optionnel en
  second argument de `onFilesDrop` et de `validateDrop` (défaut `true`), pour
  préserver les imports historiques de dossiers du FileBrowser.
- Retrait des stories External File Drop de FileBrowser ; les exemples de
  dépôt restent dans FileDropZone. Ajout de stories FullFrame pour la molette,
  les fenêtres Radix, les frames empilés et la désactivation d’Échap.

## [1.28.0] - 2026-10-13

### Ajouté

- `FileDropZone` : sélection de fichiers avec un `Button` GS et retour visuel
  de dépôt compatible, refusé, inconnu ou mixte. Configuration des formats,
  du nombre et de la taille des fichiers, validation personnalisée et gestion
  des traitements asynchrones. Un lot invalide est refusé intégralement.
- Mode `overlay` de `FileDropZone` pour envelopper un composant existant sans
  modifier sa mise en page ni son contexte de fond. Retour visuel au survol,
  messages de chargement et d’erreur, sans double traitement du dépôt.
- Props `chooseButtonLabel`, `chooseButtonVariant` (défaut `normal`) et
  `chooseButtonSize` (défaut `medium`) pour le bouton de sélection.
- Stories interactives de dépôt, dont deux overlays avec les composants
  `FileBrowser` et `DataTable`. Exemples de code publics dans la documentation.
- Traductions FR/EN/ES/IT/DE, annonces accessibles et prise en compte des
  préférences de réduction des animations.

### Modifié

- `FileBrowser` réutilise le retour visuel partagé dans la zone de liste,
  en conservant visibles le breadcrumb et la barre d’outils. Nouvelles props
  `fileDropOptions`, `onFilesDrop`, `onFileDropRejected` et `onFileDropError`.
  Le callback historique `onFileDrop` reste disponible ; les déplacements
  internes de lignes restent indépendants des imports externes.

## [1.27.1] - 2026-10-12

### Ajouté

- Variante de bouton `inverse`, symétrique de `normal`, qui s'adapte au fond :
  noir (#292828) à texte blanc sur fond blanc et gris, blanc à texte noir sur
  fond noir ; survol et appui en bleu (#CDEDFF) à texte noir ; état désactivé
  identique à `normal`. Jetons `buttonXInverse…` déclarés dans
  `figma-primitives.json` (modes clair et sombre) et variante ajoutée au
  générateur de `figma-tokens.css`, comme les autres variantes.
  Disponible sur `Button` et sur tous les composants qui en dérivent (Toggle,
  ButtonMenu, ButtonMenuSmall, Stepper…), y compris l'état de chargement.
  Stories : option « inverse » dans les contrôles, ajout dans « All variants »
  et « Loading variants ».

## [1.27.0] - 2026-10-12

### Modifié

- `FileBrowser` :
  - Bouton « Actualiser » retiré. La prop `onRefresh` est conservée mais
    obsolète et ignorée (retrait prévu en version majeure) ; traduction
    `fileBrowser.refresh` supprimée.
  - Compteur déplacé sur la ligne du breadcrumb, ferré à droite, et formulé en
    « X éléments » (fichiers et dossiers ; `totalFiles` doit compter les deux).
    Nouvelles clés `fileBrowser.itemsCount`, `itemsAndMore`,
    `itemsLimitReached` (avec `_plural`) et `noItems` ; les anciennes
    `filesCount`, `filesAndMore` et `filesLimitReached` sont supprimées. Le
    bandeau de limite parle aussi d'éléments.
  - Le « + » devient un `ButtonMenuSmall` « + Ajouter » (clavier, Échap), à
    droite du compteur. Mêmes entrées : nouveau dossier, import de fichiers,
    import de dossiers.
  - Actions en masse : le menu déroulant est remplacé par les mêmes boutons
    que sur les lignes (mêmes icônes, infobulles, `hiddenActions` et
    `disabledActions`), en variant `secondary`, précédés du nombre d'éléments
    sélectionnés. « Renommer »
    est désactivé quand plusieurs éléments sont sélectionnés. Gouttière de
    barre de défilement réservée sur la barre et le tableau : les boutons
    restent alignés sur ceux des lignes.

  - Libellé de la racine traduit par défaut (clé `fileBrowser.rootFolder` :
    « Mes fichiers », « My files », « Mis archivos », « I miei file »,
    « Meine Dateien ») au lieu de « Mes fichiers » en dur ; `labelRootFolder`
    le surcharge toujours.
  - En mode `auto`, le conteneur du tableau passe de `overflow-x-auto` à
    `overflow-x-clip`, pour que l'en-tête de colonnes colle à la page.
- `Button` (et tous les composants qui en dérivent : Toggle, ButtonMenu,
  ButtonMenuSmall…) : padding horizontal de la taille `medium` ramené de
  `px-4` (20 px) à `px-3` (15 px).

### Corrigé

- `useTranslationSafe` : `useMemo` était appelé seulement quand `language` ou
  `translations` étaient fournis. Un composant traduit (FileBrowser, Modal,
  Spinner…) qui recevait ou perdait l'une de ces props sans être remonté
  plantait (« Cannot read properties of undefined »). Le hook est maintenant
  appelé à chaque rendu.

### Ajouté

- `FileBrowser` :
  - En-tête de colonnes collant (`sticky`) : en haut de la zone qui défile en
    `fill-container` et `max-height`, et sous le header de l'application en
    `auto` grâce à `stickyHeaderOffset` (px ou valeur CSS, défaut 0). Story
    « Sticky header ».
  - Icône `FileImage` (nouvelle dans l'IconProvider) pour les fichiers image :
    type MIME `image/*`, ou à défaut extension d'image connue. Utilitaire
    `isImageFile` exporté depuis le module.
- `FileBrowser` : `renderBulkActions(selectedItems)` pour ajouter des boutons
  à gauche des actions en masse (ex. « Ajouter au projet »). Masqués sans
  sélection, comme les actions natives. Story « With bulk actions », avec deux
  lignes présélectionnées.
- `Stepper` : `layout="inline"`. Ronds à la hauteur d'un bouton medium
  (30 px), titre à droite du rond (gras pour l'étape active, gris pour les
  étapes à venir), étapes à venir cerclées sans fond, étapes terminées avec
  une coche, trait fin et court entre les étapes. Le rond et le titre forment
  un seul bouton. `layout="stacked"` (défaut) inchangé. Stories « Inline » et
  « Inline progress ».
- `FullFrame` :
  - `padding` (4 | 6 | 8) : padding horizontal du header et du footer, et
    padding du body, pour aligner leurs contenus. Le header passe d'une hauteur
    fixe de 60 px à une hauteur minimale de 60 px. Sans `padding`, rendu
    inchangé.
  - `footer`, `footerBg` (défaut : celui du body) et `footerClassName` : zone
    fixe en bas, hors de la zone qui défile.
  - Le body est un conteneur de défilement (`ScrollContainerProvider`,
    `container-type: size`) : un `PageFillLayout` posé dedans s'y adapte.
  - Story « Project wizard » : header et body gris, partie haute repliable
    (Stepper inline, titre, description), FileBrowser qui remplit la hauteur,
    footer Précédent / Suivant.
- `PageFillLayout` dans un conteneur de défilement (corps d'un FullFrame, ou
  `scrollContainer={ref}`) : la molette replie d'abord la partie haute en
  faisant défiler le conteneur, le panneau prend la hauteur visible du
  conteneur (`cqh`) et se cale contre son haut une fois replié ;
  `onCollapsedChange` et `hidePageScrollbar` portent sur le conteneur.
  `scrollContainer={null}` force la fenêtre. Sans conteneur, comportement
  inchangé.
- `usePageFirstScroll` : option `scrollContainer`, et `remainingPageScroll`
  accepte un conteneur. Exports `ScrollContainerProvider`,
  `useScrollContainer` et `SCROLLBAR_HIDDEN_CLASS`.
- `FileBrowser` : page de documentation Storybook (Docs) en anglais : modèle
  de données, en-tête, filtre de date, sélection et clavier, actions et
  actions en masse, tri, glisser-déposer, pagination, modes de hauteur,
  icônes, traductions et props obsolètes (`onRefresh`, `onUpload`).

## [1.26.0] - 2026-10-12

### Ajouté

- `Spinner` : indicateur de chargement du design system. Anneau avec un arc de
  270° sur une piste à 18 % d'opacité, couleur héritée du texte
  (`currentColor`), un tour en 900 ms en rotation linéaire continue.
  - Tailles `12 | 16 | 24 | 32` (épaisseur 1,5 / 2 / 2 / 3 px), 16 par défaut,
    dimensions fixes dans les conteneurs flex.
  - Seul : région de statut avec un nom accessible (`label`, défaut
    « Chargement en cours » traduit, clé `spinner.loading`). À côté d'un texte
    qui décrit déjà le chargement : `decorative` (`aria-hidden`).
  - Animations réduites (`prefers-reduced-motion: reduce`, ou attribut
    `data-gs-reduced-motion` sur un ancêtre, exporté en
    `REDUCED_MOTION_ATTRIBUTE` pour les stories et les tests) : rotation
    arrêtée, transitions supprimées.
- `Button` : props `loading` et `loadingLabel`. Pendant le chargement, le
  bouton est `disabled` et `aria-busy`, avec un Spinner décoratif (12 px en
  small, 16 px sinon) et les couleurs de l'état normal (pas l'opacité de
  l'état désactivé). Dès que `loading` est fourni, les deux libellés sont
  superposés : la largeur ne change pas, fondu de 160 ms. Sans `loading`,
  rendu inchangé.
- `toast` :
  - `id` : un second appel avec le même id met à jour le toast en place
    (texte, type, icône) sans en créer un nouveau. Seuls les champs fournis
    sont envoyés : une mise à jour garde la description et la durée.
  - `duration: Infinity` : le toast reste jusqu'à sa fermeture.
  - `dismissToast(id?)` : ferme un toast, ou tous.
  - Types `ToastProps` et `ToastType` exportés.
- Stories : « UI/Spinner » (Default, Sizes, Backgrounds, Inherits text
  color, Inline with text, Reduced motion, Standalone accessible, Decorative
  with label), Button (Loading on click, Loading sizes, Loading variants,
  Loading reduced motion, Loading failure), Toaster (Loading, Loading counter
  updates, Loading to success, Loading to error, Loading long text, Loading
  reduced motion, Loading long running), Thumbnail (Loading to image, Loading
  failure, Loading reduced motion), FileBrowser (Loading more, Loading more to
  results).

### Modifié

- Toast de chargement : Spinner GS de 16 px au lieu du spinner à 12 barres de
  sonner, fond `#EFEFEF` et texte `#292828` (le texte blanc était illisible).
  Toutes les icônes de toast sont dans un emplacement de 16 × 16 px, à 20 px
  du texte, avec un fondu de 160 ms ; le fond et le texte passent en fondu au
  changement de type (chargement → succès).
- Toast de succès : fond `#2E7D32` (contraste suffisant avec le texte blanc).
  Le jeton `green` du système n'est pas modifié.
- Un toast `loading` reste affiché jusqu'à sa mise à jour : passé en succès ou
  en erreur, son délai de fermeture commence à ce moment-là.
- `Thumbnail` : Spinner de 32 px (décoratif) au lieu de l'anneau gris, et
  `aria-busy` sur la zone image pendant le chargement.
- `FileBrowser` : le bouton « afficher plus » utilise `Button loading`
  (Spinner de 16 px au lieu de l'icône Loader tournante).

## [1.25.0] - 2026-10-12

### Modifié

- `Modal` reconstruit sur Radix Dialog (portail, overlay, contenu). API
  existante inchangée (`isOpen`, `onClose`, `footer`, classes,
  `closeOnOverlayClick`, `closeOnEscape`, `maxHeight`, `maxWidth`), alias
  `ModalLayer` conservé.
  - Dialog imbriqué : ouverte au-dessus d'un `SidePanel` (ou de tout dialog
    Radix), qu'elle soit rendue dans son arbre React ou à côté au niveau de la
    page, la modale passe devant (dernier portail ouvert, z-50), son corps
    défile (molette et tactile), le focus y est piégé, et Échap ou un clic sur
    son overlay ne ferment qu'elle. Un second Échap ferme le SidePanel.
  - Verrou de défilement de la page géré par Radix : la gestion manuelle de
    `document.body.style.overflow` est supprimée.
  - Focus : à l'ouverture, le premier élément focusable reçoit le focus (sauf
    si un champ a déjà `autoFocus`), puis il est rendu au déclencheur à la
    fermeture. Le footer n'a plus d'`overflow-auto` hérité de `Layout`.
- `ReferenceEditModal` et les modales de vues de `TabsWithViews` : le titre
  passe dans le `header` fixe et ne défile plus avec le contenu.

### Ajouté

- `Modal` :
  - `header` (nœud ou fonction) et `headerClassName` : zone fixe en haut, avec
    un séparateur. Structure header (fixe) / corps (`flex-1 min-h-0`, seule
    zone qui défile) / footer (fixe).
  - `bg` (`white` | `grey` | `black`, défaut `white`) : fond de toute la
    fenêtre, transmis par `BgProvider` au header, au corps et au footer.
    Séparateurs assortis (`border-grey-strongest` sur noir), texte blanc et
    overlay plus sombre sur noir.
  - `padding` (4 | 6 | 8) : commun au header, au corps et au footer. Sans
    valeur, le corps reste sans padding (le contenu pose le sien) et le header
    et le footer gardent 4.
  - `title` : nom accessible (lecteurs d'écran), défaut « Fenêtre » traduit.
    Plus d'avertissement Radix.
  - `initialFocus` : élément qui reçoit le focus à l'ouverture.
- Stories « Modal over a SidePanel » et « Fixed header and footer, long list,
  black background ».
- Tests : modale au-dessus d'un SidePanel, rendue à côté ou dans son arbre
  (Échap, overlay, focus, défilement du corps non bloqué), structure, fond,
  padding, et un test sur le bundle construit (`dist/`) qui vérifie que
  SidePanel et Modal partagent la même pile de calques Radix.

## [1.24.0] - 2026-10-11

### Ajouté

- `PageFillLayout` : mise en page avec une partie haute repliable
  (`collapsible`) qui défile avec la page, puis un panneau de la hauteur exacte
  de la fenêtre moins les éléments collants (`stickyTop`, `stickyBottom` :
  nombre, valeur CSS ou ref d'un élément mesuré), avec un plancher
  `minPanelHeight`. Hauteur exposée en variable CSS `--page-panel-height`,
  calculée en CSS pur quand c'est possible. Racine sans `overflow` : c'est la
  fenêtre qui défile.
  - `pageFirstScroll` (actif par défaut) : la molette vers le bas au-dessus du
    panneau replie d'abord la partie haute, puis le contenu défile. Ce qui
    reste à défiler est mesuré depuis la position du panneau et borné par le
    défilement réellement possible de la fenêtre (arrondis, pages courtes).
    Zone exclue avec `data-native-scroll`.
  - `hidePageScrollbar` (désactivé par défaut) : masque la barre de défilement
    de la fenêtre (classe `gs-page-scrollbar-hidden` sur `<html>`, compteur de
    références, règle CSS brute).
  - `onCollapsedChange` : partie haute repliée ou de nouveau visible, appelé au
    changement d'état seulement.
- `usePageFirstScroll(ref, options)` : la molette « page d'abord » seule, pour
  une page qui ne peut pas adopter le composant. Constantes
  `NATIVE_SCROLL_ATTRIBUTE` et `PAGE_SCROLLBAR_HIDDEN_CLASS`.
- `TabsWithViews` : option `fillHeight`. La barre d'onglets garde sa hauteur,
  le contenu prend le reste dans une colonne `flex-1 min-h-0`.
- `Tabs` : prop `rootClassName` pour l'élément racine (`className` reste
  transmis à l'en-tête des onglets).
- `PageHeader` transmet sa `ref` à son élément racine (`forwardRef`), pour
  mesurer sa hauteur réelle (`stickyTop={headerRef}`).
- Stories « Layout/PageFillLayout » (Home, Without top, Collapsed callback,
  Native scroll zone) et documentation en anglais, avec les limites connues
  (tactile, `overscroll-behavior: contain`).

## [1.23.0] - 2026-10-11

### Ajouté

- `Thumbnail` : boutons de statut génériques sous la vignette. `statusButtons`
  (0, 1 ou 2 `ThumbnailStatusButton` : `key`, `icon`, `status`, `isActive`,
  `disabled`, `label`, `rejectionReasons`) décrit les boutons en données, et
  `onStatusButtonClick(key, reason?)` reçoit la clé du bouton cliqué. Aucune
  règle de statut codée en dur : un bouton peut être actif et cliquable.
  Désactivé inactif : grisé ; désactivé actif : aspect normal. `[]` garde la
  hauteur de la ligne. `rejectionReasons` ouvre le menu des motifs de refus du
  bench (un menu par bouton). `label` donne l'`aria-label` et une infobulle
  (`Tooltip`). Type `ThumbnailStatusButton` exporté.
- `ContactSheetReference` : `statusButtons` passe par chaque vignette ; un clic
  remonte l'événement `{ type: "statusButton", key, reason? }` par
  `onThumbnailChange`. Les boutons s'affichent selon les données. Dès qu'une
  vignette d'une référence a des boutons, la ligne est réservée pour toutes,
  pour garder les vignettes alignées.
- `ButtonStatus` : prop `aria-label` qui remplace le libellé calculé, et
  `aria-pressed` selon `isActive`.
- Stories « Status Buttons » (Thumbnail et ContactSheetReference) et
  documentation en anglais.

### Modifié

- Accessibilité des boutons « actifs », homogénéisée : `aria-pressed` pour les
  interrupteurs (`Toggle`, `ButtonStatus`) ; les déclencheurs de menu
  (`ButtonMenu`, `ButtonMenuSmall`, `ButtonMenuStatus`, `ButtonThumbnailStars`,
  `ButtonThumbnailLabels`, `ButtonThumbnailTags`, `ButtonThumbnailComments`)
  n'exposent plus que `aria-expanded` (l'`aria-pressed` hérité de `Toggle`,
  contradictoire, est retiré) ; `Stepper` pose `aria-current="step"` sur
  l'étape en cours. Aucun changement visuel.

### Déprécié

- `Thumbnail` : `onValidate`, `onReject`, `validateDisabled` et
  `rejectDisabled`, remplacés par `statusButtons` / `onStatusButtonClick`. Ils
  restent fonctionnels à l'identique quand `statusButtons` n'est pas défini.
- `ContactSheetReference` : `thumbnailFeatures.validation` et les événements
  `validate` / `reject` ne pilotent plus que l'ancien mode (vignettes sans
  `statusButtons`).

## [1.22.1] - 2026-10-08

### Ajouté

- `Search` : option `captureFindShortcut` (désactivée par défaut). Cmd+F sur
  macOS, Ctrl+F ailleurs, donne le focus au champ (texte sélectionné) au lieu
  d'ouvrir la recherche du navigateur. Si le champ a déjà le focus, le raccourci
  est laissé au navigateur : un second appui ouvre la recherche native. Sans
  effet sur un champ désactivé ou masqué. Story « Capture Find Shortcut ».
- `CheckAll` : option `captureSelectAllShortcut` (désactivée par défaut).
  Cmd+A sur macOS, Ctrl+A ailleurs, coche la case (la page courante) au lieu de
  sélectionner le texte de la page. Laissé au navigateur quand le focus est dans
  un champ de saisie, une zone de texte, un select, une autocomplétion, une
  liste ou un élément éditable, ou quand une modale ou un menu est ouvert. Ne
  désélectionne jamais : sans effet quand tout est déjà coché.
- Utilitaires `src/lib/keyboard-shortcuts.ts` (`isFindShortcut`,
  `isSelectAllShortcut`, `isEditableTarget`, `hasOpenOverlay`).

## [1.22.0] - 2026-10-08

### Ajouté

- `CheckAll` : case « tout sélectionner » d'une liste (typiquement la page
  courante d'une liste paginée), quel que soit le type d'objet. Ne connaît que
  des compteurs (`selectedCount`, `totalCount`) : décochée, cochée ou
  indéterminée ; un clic sélectionne (depuis décochée ou indéterminée) ou
  désélectionne (depuis cochée). Libellé accessible traduit. Utilitaire
  `getCheckAllState`.
- `CheckAllPages` : menu de portée de la sélection à côté de `CheckAll` —
  « Page courante (n) », « Toutes les pages (n) », « Tout désélectionner » ;
  affiche la portée courante, y compris « Personnalisée (n) » en lecture seule.
  « Page courante » est masqué s'il n'y a qu'une page. Utilitaire
  `getCheckAllPagesScope`.
- `usePaginatedSelection<K>()` : état de sélection d'une liste paginée, par
  clés, en mode `include` ou `exclude` (« tout sauf… »), pour la pagination
  côté client (`resolve(allKeys)`) comme côté serveur (`value` à envoyer à
  l'API). `resetKey` vide la sélection quand les filtres changent ; il est
  comparé par valeur, un objet recréé à chaque rendu ne la vide donc pas.
- Traductions `checkAll.*` et `checkAllPages.*` dans les 5 langues.
- Stories « Components/CheckAll » : états, liste paginée côté client,
  pagination côté serveur, libellés traduits.

## [1.21.6] - 2026-10-08

### Modifié

- `PageHeader` : quand le bouton retour est affiché, le bouton du titre passe
  en variant `ghost` (au lieu de `secondary`), pour ne pas encadrer le titre de
  deux boutons pleins. Sans bouton retour, il reste `secondary`. Story « With
  Back Button ».

## [1.21.5] - 2026-10-08

### Modifié

- `PageSearch` : padding de 20 px en haut et en bas (`py-4`, au lieu de 10 px
  posés sur le seul contenu de gauche).
- `PageSearch` : plus de largeur maximale par défaut pour le contenu de gauche
  (`max-w-lg` supprimé) ; `leftContentMaxWidth` reste disponible.

### Ajouté

- `PageSearch` : option `alignWithContactSheet` (désactivée par défaut), qui
  décale le contenu de gauche de 3 px vers la gauche pour aligner une case à
  cocher de tête sur celles des `ContactSheetReference`. Story « Aligned With
  Contact Sheet ».

## [1.21.4] - 2026-10-07

### Modifié

- `Tooltip` : s'adapte au fond sur lequel il s'affiche (contexte `data-bg` du
  Layout parent). Sur fond blanc, gris ou hors Layout : fond noir, texte blanc,
  bordure `black-secondary`, `rounded-[2px]` (inchangé). Sur fond noir : inversé
  (fond blanc, texte noir, bordure grise), au lieu d'un tooltip noir à peine
  visible. Nouvelle prop `bg` sur `TooltipContent` pour forcer le rendu. Même
  API qu'avant : les composants qui l'utilisent (Sidebar, FileBrowser,
  TruncatedText…) en profitent sans changement.
- Le tooltip transmet sa propre surface (`data-bg`) à son contenu.
- Stories Tooltip et documentation en anglais.

## [1.21.3] - 2026-10-07

### Corrigé

- `SidePanel` : le panneau est visible sur les pages plus hautes que l'écran.
  Rendu `fixed` dans un portail en fin de page sans `top`, il se plaçait sous
  tout le contenu, hors de l'écran ; il est désormais ancré en haut de la
  fenêtre (`top-0`). `topOffset` reste prioritaire. Le contournement
  `className="top-0"` n'est plus nécessaire.
- `SidePanel` : `topOffset={0}` est pris en compte (il était ignoré).
- Story « Long page » : page de plusieurs écrans, défilée vers le bas avant
  l'ouverture du panneau.

## [1.21.2] - 2026-10-07

### Ajouté

- Icône `Reports` (axes et trois barres d'histogramme), au format des icônes
  maison : 12 × 12, `currentColor`, trait de 0,5 réglable.

### Corrigé

- `ContactSheetReference` : quand aucune vignette n'affiche les boutons de
  validation, le padding bas passe de 15 à 25 px. L'écart entre le bas des
  vignettes et le bas de la référence est le même avec ou sans boutons.

## [1.21.1] - 2026-10-07

### Corrigé

- `Thumbnail` : le bouton « … » du menu d'actions devient un `ButtonMenuSmall`
  (small, secondary, `p-1 w-4 h-4`) avec l'icône `MoreHorizontal` (10 px), au
  lieu d'un `Button` medium affichant un texte. Libellé accessible « Actions »
  traduit (`thumbnail.actions`).

## [1.21.0] - 2026-10-06

### Ajouté

- `ContactSheetReference` : une référence de planche contact — case de
  sélection (état intermédiaire si sélection partielle), bouton urgent, titre,
  grade, actions d'en-tête (`headerActions`, bouton « Modifier » optionnel),
  attributs configurables (chemins pointés, jusqu'à 3 colonnes), badges
  d'export et vignettes. Composant contrôlé, sans copie des données.
- Exports groupés (badges côte à côte, une seule grille) ou séparés
  (`exportsLayout="separated"`, exports empilés). Le badge d'un export fonce au
  survol de ses vignettes.
- Vignettes : nombre par ligne réglable (`thumbnailsPerRow`), interstice de
  15 px, nom de fichier tronqué au milieu, emplacements vides (vue attendue sans
  média), sélection de plage par Maj+clic, un seul callback `onThumbnailChange`.
- Drag & drop natif au sein d'un export : permutation, insertion, remplissage
  d'un emplacement vide, déplacement de toute la sélection (aperçu en pile avec
  le nombre d'images). Les codes de vue restent attachés aux positions : chaque
  image prend la vue de sa nouvelle position. `onReorder(exportId, pictureIds,
  slots, details)` fournit l'état final et les changements de vue.
- Formulaire « Modifier » : attributs modifiables et tags de la référence.
- `Thumbnail` : props `grade` (Grade medium sous les indicateurs),
  `viewIndicator` (remplace le badge de vue), `filenameTruncation`.
- Icônes `ZoomIn` et `ZoomOut` (loupe à trait fin), utilisées au survol des
  vignettes.
- Documentation Storybook en anglais avec exemples de code, et story
  « Reorder Payload ».

### Modifié

- `Thumbnail` : un clic sur la zone blanche du bas sélectionne la vignette
  (`selectOnFooterClick`, actif par défaut) et un clic sur le nom de fichier le
  copie avec un retour « Copié » (`copyFilenameOnClick`, actif par défaut).
  Les deux se désactivent avec `={false}`. Les écrans qui passent
  `onSelectionChange` obtiennent ces comportements sans changement de code.
- `Thumbnail` : zone de clic élargie autour de la case à cocher ; badge du code
  de vue à 80 % d'opacité.

### Corrigé

- Icône `Urgent` recentrée dans son SVG (décalée d'une unité vers la gauche) ;
  la compensation `ml-[1px]` de `UrgentIndicator` est retirée.
- Picto de zoom au survol des petites vignettes : un seul SVG au lieu de deux
  icônes superposées.

## [1.20.1] - 2026-09-27

### Corrigé

- Sidebar replié : boutons de navigation et menu utilisateur centrés en
  30 × 30 px, avec une colonne de 60 px par défaut.
- Alignement vertical des commandes Sidebar avec PageHeader, dont la hauteur
  de référence est désormais 60 px (`--page-header-height`).
- Stories Sidebar : logo dans PageHeader et bouton d'ouverture uniquement
  sur mobile. Documentation anglaise raccourcie, avec exemples de code.

## [1.20.0] - 2026-09-27

### Ajouté

- Sidebar GS exporté depuis la librairie et `/sidebar`, avec les fonds de
  SidePanel, les composants Button et ButtonMenuSmall, le repli en icônes et
  une présentation mobile. Prise en charge des providers de thème, de style,
  d'icônes et de traduction.
- Menu utilisateur avec avatar, nom et actions dans le pied du Sidebar.
- PageHeader : propriétés `leftContent` et `showLogo` pour placer le bouton
  d'ouverture du Sidebar à la place du logo.
- Stories Sidebar et documentation en anglais, avec tests d'intégration.

## [1.19.2] - 2026-09-19

### Corrigé

- `FileBrowser` : le contrôle de sélection — le `Select` dont le déclencheur
  affiche « {n} sélectionné(s) » — n'est plus rendu quand `hiddenActions` masque
  les cinq actions. Aucune condition ne testait le nombre d'actions restantes :
  le menu s'ouvrait vide, libellé de sélection compris. La sélection elle-même
  est inchangée et continue d'être remontée par `onSelectionChange`.
  Des actions seulement `disabled` gardent le menu, qui les affiche grisées.
- Story FileBrowser « WithAllActionsHidden » pour ce cas.

## [1.19.1] - 2026-09-19

### Corrigé

- `Button` : `asChild` fonctionne enfin. Le bouton rend le libellé *et* deux
  décorations (indicateur, étiquette de debug), alors que `Slot` n'accepte qu'un
  enfant : tout usage de `asChild` levait « React.Children.only », y compris les
  stories qui le documentent. Les décorations sont désormais injectées dans
  l'enfant, et l'enfant est laissé intact quand il n'y en a aucune. Le rendu hors
  `asChild` est inchangé.

### Modifié

- `FileBrowser` : le dossier courant du breadcrumb prend l'apparence d'un bouton
  `outline` au lieu de `ghost`. Le ghost n'ayant pas de cadre visible, le libellé
  flottait à côté des pastilles pleines des segments parents. Le segment reste
  non interactif (`<span>` via `asChild`, `aria-current="page"`), et son libellé
  garde sa graisse : `!font-medium` est nécessaire, car `.font-regular` du bouton
  est déclarée après `.font-medium` dans la feuille compilée et l'emporterait à
  spécificité égale.

## [1.19.0] - 2026-09-19

### Ajouté

- `FileBrowser` : déplacement des lignes sélectionnées vers un sous-dossier par
  glisser-déposer, activé en fournissant `onMoveItems?: (items: FileItem[],
  targetFolder: FileItem) => void`. Sans ce callback, les lignes ne sont pas
  déplaçables. Le composant ne possède pas les données : il signale le
  déplacement, à charge de l'appelant de l'effectuer puis de re-rendre avec les
  nouveaux `files` — et de vider la sélection via `selectionResetKey`.
  - Glisser une ligne sélectionnée déplace toute la sélection, dans l'ordre
    d'affichage ; glisser une ligne hors sélection la sélectionne et ne déplace
    qu'elle, pour ne jamais déplacer une sélection invisible à l'écran.
  - Seuls les dossiers actifs hors sélection acceptent le dépôt : ils s'encadrent
    en noir au survol (`ring-2 ring-inset ring-black`), comme la ligne active.
  - Défilement automatique quand le curseur atteint le haut ou le bas de la liste,
    piloté par une boucle d'animation et non par les événements `dragover`, qui
    cessent dès que le curseur s'immobilise. Actif uniquement si le conteneur est
    réellement défilant (`heightMode` `fill-container` ou `max-height`).
  - Vignette sous le curseur reprenant le premier nom déplacé, avec une pastille
    de comptage au-delà d'un élément. Construite en DOM impératif et stylée en
    `style` inline : `setDragImage` photographie le nœud au `dragstart`, sans
    attendre le rendu React ni la feuille Tailwind de l'application hôte.
- Story FileBrowser « InteractiveDragAndDropMove » : arborescence réelle où le
  dépôt réécrit le `parent_path`, dans un conteneur de hauteur fixe pour exercer
  le défilement automatique.
- `src/lib/file-browser-drag.ts` : logique pure du glisser-déposer
  (`canDropOnItem`, `getDraggedItems`, `computeAutoScrollSpeed`, discrimination
  des types de drag), isolée pour être testable — happy-dom n'implémente ni
  `DataTransfer` ni `setDragImage`.

### Corrigé

- `FileBrowser` : l'import de fichiers depuis le bureau ne capte plus les
  déplacements de lignes, qui déclenchent les mêmes événements sur le même
  conteneur. `handleDrop` appelait `onFileDrop` pour **n'importe quel** dépôt : un
  déplacement relâché à côté d'un dossier était remonté à l'appelant comme un
  import externe. `handleDragOver` forçait par ailleurs le curseur en « copie »
  pendant un déplacement. Les quatre gestionnaires filtrent désormais sur la
  présence du type `Files`.
- `FileBrowser` : l'overlay d'import réapparaît après un glisser-déposer interne.
  `handleDragLeave` décrémentait un compteur que `handleDragEnter` n'incrémentait
  que pour les drags de fichiers ; il passait à -1 dès le premier drag interne et
  l'overlay ne s'affichait plus ensuite.
- `FileBrowser` : le message « Aucun fichier dans ce dossier » n'est plus rendu
  dans un bandeau bordé sous le tableau, où il apparaissait sous une ligne
  horizontale isolée, collé en bas du composant. Il occupe maintenant la hauteur
  restante à l'intérieur du cadre du tableau, centré verticalement. Sans hauteur
  imposée (`heightMode="auto"`), il reste sous l'en-tête, faute d'espace où le
  centrer.
- `FileBrowser` : le dernier segment du breadcrumb — le dossier courant — est
  rendu dans la boîte d'un bouton ghost au lieu d'un texte nu. À la racine, le
  libellé n'avait aucun padding horizontal et se décalait dès qu'on entrait dans
  un sous-dossier, où il devenait un bouton. Le segment n'est pas une
  destination : c'est un `<span>` non focusable, sans clic ni survol, marqué
  `aria-current="page"`.

## [1.18.0] - 2026-09-19

### Ajouté

- `FileBrowser` : prop optionnelle `selectionResetKey?: number | string`, qui vide
  la sélection à chaque changement de valeur (pas au premier rendu). Un parent peut
  ainsi désélectionner depuis l'extérieur — typiquement un bouton « Tout
  désélectionner » placé hors du composant — en incrémentant la clé, là où l'action
  ne faisait jusqu'ici que masquer la barre d'actions en laissant les lignes
  sélectionnées. La sélection reste non contrôlée : shift/ctrl et Cmd+A sont
  inchangés, et c'est l'effet `onSelectionChange` existant qui remonte `[]` au
  parent, sans appel supplémentaire.
- Story FileBrowser « ExternalSelectionReset » : bouton « Tout désélectionner »
  hors du composant, avec le compteur de sélection et la valeur de la clé.
- Test `src/__tests__/file-browser-selection-reset.test.tsx` : un changement de clé
  vide les lignes et produit un `onSelectionChange([])` unique, une valeur identique
  ne déclenche rien, et le premier rendu ne réinitialise pas.

## [1.17.1] - 2026-09-19

### 🎨 Modifié

- `FileBrowser` : le bouton « Afficher les N fichiers suivants » passe en
  `size="medium"` (au lieu de `large`) et son conteneur perd son padding bas
  (`py-3` → `pt-3`). Le bloc de pagination prenait trop de hauteur sous la liste.
  Sans changement d'API.

## [1.17.0] - 2026-09-18

### Ajouté

- `TabsList` : valeur `align="justify"`, qui répartit les onglets à parts égales
  sur toute la largeur de la liste et centre chaque titre. L'indicateur actif
  occupe alors toute la largeur de l'onglet. Les libellés ne sont jamais tronqués :
  si les parts deviennent plus étroites que le titre le plus long, les onglets
  reprennent leur largeur naturelle et la liste redevient défilante.
- Story Tabs : option `justify` dans le contrôle d'alignement et exemple « Justifié ».

## [1.16.1] — 2026-09-18

### 🎨 Modifié

- **`ButtonThumbnailLabels` : le mode neutre affiche le rectangle à bordure pointillée
  au lieu de l'icône `Tag`.** Correction visuelle du mode `buttonDisplay="neutral"`
  livré en 1.16.0, **sans changement d'API**.
  - `Tag` évoquait les méta-tags, pas la couleur. Le déclencheur reprend désormais le
    **rectangle pointillé « pas de couleur »** que le composant dessinait déjà dans sa
    branche « aucune couleur définie » : c'est le vocabulaire de la librairie pour une
    pastille sans valeur, et la même forme que les pastilles du menu, donc ça se lit
    immédiatement comme « couleur ».
  - **Un seul rendu, pas deux** : le rectangle est extrait dans un `renderEmptySwatch`
    au niveau module, partagé par la branche « pas de couleur » et par le mode neutre,
    pour qu'ils ne puissent pas diverger.
  - Dimensions inchangées : le rectangle fait `colorSize` × `colorSize * 0.7`, soit
    10 / 12 / 14 px de large selon `size` — exactement la place que prend l'icône de
    `ButtonMenuStatus` dans un rond de mêmes dimensions. Centré par le
    `inline-flex items-center justify-center` du `Button`.
  - Nettoyage : `neutralIconSize` et l'import d'`Icon` devenaient morts dans ce
    fichier, ils sont retirés.
  - **`ButtonThumbnailStars` est inchangé** : son icône `Star` reste la bonne.
  - Tests adaptés, et la contre-épreuve renforcée : la face reste pointillée et sans
    couleur **même avec `value="red"`**, et le rendu neutre est comparé à celui du mode
    par défaut sans couleur (ils doivent être identiques). Côté `Thumbnail`, un cas
    dédié vérifie que le rectangle pointillé n'apparaît **jamais** quand la photo a une
    couleur.

## [1.16.0] — 2026-09-17

### ✨ Ajouté

- **`ButtonThumbnailStars` / `ButtonThumbnailLabels` : mode d'affichage neutre du
  bouton déclencheur** via la prop `buttonDisplay` (`"value" | "neutral"`,
  `"value"` par défaut, **opt-in, non-breaking**).
  - `buttonDisplay="neutral"` fait reprendre au déclencheur le dessin et les
    couleurs de `ButtonMenuStatus` : même rond aux mêmes dimensions
    (`p-1 w-4 h-4` / `p-0 w-6 h-6` / `p-0 w-8 h-8` selon `size`), même taille
    d'icône (10 / 12 / 14), et **`variant="secondary"` par défaut** — c'est le
    variant avec lequel `ButtonMenuStatus` est appelé dans les barres d'action, là
    où ces deux boutons tombaient sur `normal`. L'appelant n'a donc rien à savoir
    du variant ; s'il en passe un explicitement, il reste prioritaire.
  - La face du bouton affiche une **icône fixe** à la place de la valeur : `Star`
    (le contour, pas `StarFilled`) pour les étoiles, `Tag` pour les couleurs.
  - Motif : dans une barre d'action qui écrit une note ou une couleur **sur une
    sélection**, afficher « 3 étoiles » ou une pastille laisse croire à un état
    commun à toute la sélection et invite à recliquer 3 pour annuler — ce qui
    aplatit la sélection à 3. Le mode neutre supprime cette lecture.
  - **`value` continue de servir au menu** dans les deux modes : la bonne ligne
    reste cochée, exactement comme `currentStatus` pour `ButtonMenuStatus`.
  - **Rien d'autre ne change** : contenu du menu, `compact`, `menuSide`,
    `menuAlign`, `menuBgContext`, `useIsInActionBar()`, `sideOffset`, traductions
    des couleurs.
  - **Le défaut est inchangé, au pixel.** `Thumbnail` ne passe pas la prop et
    continue d'afficher la valeur : c'est toute la fonction du bouton sur une
    vignette. Verrouillé par un test au niveau de `Thumbnail` lui-même
    (`src/__tests__/thumbnail-shows-rating-label-values.test.tsx`), pas seulement
    sur les deux boutons isolés.
  - Stories `NeutralButtonDisplay` sur les deux composants : le mode neutre est
    posé **à côté d'un `ButtonMenuStatus`** sur les trois fonds et les trois
    tailles, pour que la ressemblance soit vérifiable à l'œil.
  - Tests : `src/__tests__/button-thumbnail-neutral-display.test.tsx` (22 cas,
    dont les contre-épreuves : le défaut affiche toujours la valeur, et un
    `buttonDisplay="value"` explicite rend un HTML strictement identique à
    l'omission de la prop).

### 🎨 Modifié

- **`ButtonMenuStatus` et `ButtonMenuSmall` gardent l'apparence hover tant que leur
  menu est ouvert**, comme les quatre boutons de vignette. **Changement visuel sur
  des composants existants**, pas opt-in.
  - La charte veut qu'un bouton qui ouvre un menu conserve son apparence hover
    pendant toute la durée d'ouverture. Les quatre menus de vignette
    (`ButtonThumbnailStars`, `…Labels`, `…Tags`, `…Comments`) le faisaient déjà ;
    ces deux-là étaient les seules exceptions et restaient plates, ce qui se voyait
    dans la barre d'action de la page validation où les quatre boutons se côtoient.
  - **Même mécanisme, pas un second** : une ligne strictement identique à celle des
    boutons de vignette, `data-open={isOpen ? "true" : "false"}` posée sur le
    `Toggle` après `{...buttonProps}`. Les règles existantes de `custom-styles.css`
    (`button[data-open="true"]`) rejouent alors les jetons hover du variant du
    bouton, par contexte `data-bg`. Aucune CSS ajoutée.
  - L'attribut est **toujours présent**, valué `"false"` menu fermé : c'est la
    convention déjà en place, et `button[data-open]` sert de localisateur de
    déclencheur ailleurs dans la suite de tests.
  - Variants couverts par la CSS existante : `normal`, `secondary`, `ghost`,
    `outline`. `destructive` et `link` n'ont pas de règle `data-open` — inchangé,
    mais à savoir.
  - Test `src/__tests__/menu-trigger-data-open.test.tsx` (20 cas) : contrat verrouillé
    par composant, en mode contrôlé et non contrôlé, plus la contre-épreuve
    d'uniformité qui relit l'attribut sur **les six** composants à menu et exige une
    seule valeur distincte par état.

## [1.15.0] - 2026-09-16

### Added

- `Timeline`: grouped chronological entries with controlled or uncontrolled selection,
  read-only mode, disabled entries, custom inline content and two densities.
  Rectangular entries reuse Button ghost and active colors for white, grey and black backgrounds.
- English Timeline documentation and stories covering backgrounds, selection and empty states.
- Timeline accepts flat `items` with UTC ISO 8601 `timestamp` values ending in `Z`.
  Dates and hours are localized to EN/FR/ES/IT/DE using the active language; entries
  are sorted and grouped by day in the browser timezone or an explicit `timeZone`.
  Today and Yesterday headings are localized with the full date underneath.
  Documentation includes UTC data, midnight boundaries and daylight-saving examples.

## [1.14.0] - 2026-09-16

### Ajouté

- `DataTable` : détails génériques dépliables via `renderExpandedRow`,
  `getRowCanExpand`, `expandedIds`, `defaultExpandedIds`, `onExpandedChange`
  et `onRowExpand`. Chevron accessible intégré, clic sur ligne optionnel
  (`expandOnRowClick`) et bouton personnalisé via le contexte de `cell`.
  Les détails ont leurs propres colonnes si souhaité ; tri, pagination et
  sélection continuent à porter sur les lignes principales.
- Stories DataTable : clic sur ligne, bouton personnalisé, état contrôlé avec
  tri/sélection/pagination, accordéon, tableau imbriqué et chargement asynchrone.
  Documentation en anglais regroupée sous `UI / DataTable / Expansion`.
  La case de sélection précède le chevron d’expansion.

- `ButtonMenu` et `ButtonMenuSmall` : sous-menus facultatifs via `children`
  sur les actions, pouvant coexister avec les entrées ordinaires.
  Ouverture au survol, au clic et au clavier, placement automatique à droite
  ou à gauche selon l'espace disponible, chevrons via `IconProvider` suivant
  le côté effectif à l'ouverture. Les sous-menus conservent le style du menu
  et sont affichés hors de son conteneur pour éviter le rognage au défilement.
- `ButtonMenu` : sélection multiple conservée sur l'ensemble des actions
  feuilles, y compris celles des sous-menus fermés.
- Stories des deux composants : sous-menus, position au bord droit et fond noir.

### Corrigé

- `ButtonMenuSmall` : une action sans callback ne provoque plus d'erreur.

## [1.13.0] - 2026-09-15

### Ajouté

- `TabsList` : attribut `align="left" | "center" | "right"`, avec `left` par défaut.
  La ligne inférieure conserve toute la largeur disponible. L'ordre des onglets
  et le défilement en cas de débordement sont conservés. Avec `rightSlot`,
  l'alignement porte sur l'espace de la liste, hors zone d'actions.
- Story Tabs : contrôle d'alignement et exemples gauche, centré et droite.

## [1.12.14] - 2026-09-14

### ✨ Ajouté

- **`Thumbnail` : désactivation externe de la notation et du label** via les props
  `ratingDisabled` et `labelDisabled` (optionnelles, `false` par défaut,
  non-breaking). Symétrique de `validateDisabled` / `rejectDisabled` livré en
  1.12.11, pour les boutons étoiles et couleurs.
  - Permet à l'application hôte de verrouiller les vignettes pendant une écriture
    en lot déclenchée depuis une barre d'action (notation ou pose de label sur une
    sélection), au lieu de laisser des boutons d'apparence active dont le clic est
    rejeté en aval.
  - Les boutons restent **affichés** : pas de saut de layout, contrairement au fait
    de passer `onRatingChange` / `onLabelChange` à `undefined`.
  - **Granularité par action** : `ratingDisabled` ne désactive que les étoiles,
    `labelDisabled` que les couleurs.
  - **Pas de combinaison avec le `status`**, contrairement à ✓ / ✗ : la note et le
    label restent modifiables quel que soit le statut du média, la désactivation
    vient donc uniquement de l'appelant.
  - Le menu correspondant ne peut plus être ouvert, se referme s'il l'était, et ne
    se rouvre pas tout seul à la levée de la désactivation (même règle que le menu
    de motifs de refus).
  - Accessibilité : attribut `disabled` natif réel sur le déclencheur (`Toggle` →
    `Button`), propagé par `ButtonThumbnailStars` / `ButtonThumbnailLabels` à leurs
    entrées de menu. Retour visuel `disabled:opacity-50` + `cursor: not-allowed`
    via le même `<span>` enveloppant que ✓ / ✗ : le `Button` de base ne pose que
    `disabled:pointer-events-none` et ne grisait donc rien.
  - Story `DisabledRatingAndLabelActions` et test
    `src/__tests__/thumbnail-rating-label-disabled.test.tsx` (13 cas, dont les
    contre-épreuves : une prop n'entraîne pas l'autre, absence de prop = rien de
    désactivé).

## [1.12.13] - 2026-09-03

Corrections issues d'une review indépendante du diff `v1.12.11..v1.12.12`.

### 🐛 Corrigé

- **`Thumbnail/Three60Indicator` : le seul Badge de la librairie qui perdait la
  correction d'interlignage de la 1.12.12.** Son `className` portait
  `text-[10px]`. Une taille **arbitraire** est reconnue comme `font-size` par
  `tailwind-merge`, donc elle supprimait le `leading-tight` des classes de base
  du Badge (vérifié : `leading-tight kept: FALSE`, contre `true` pour les quatre
  autres indicateurs). Ce `text-[10px]` était par ailleurs devenu **exactement
  redondant** avec `text-badge-label` (`--badge-fs-label` = 10px). Il est
  supprimé : l'interlignage est rendu à ce Badge, la valeur en dur disparaît et
  la redondance avec le token aussi.
  - À noter : l'effet visuel était **masqué** par le rognage `.gs-text-trim`
    introduit dans la même version, qui rend la boîte de texte indépendante de
    la `line-height`. Le défaut ne se voyait donc que sur le chemin de repli
    (moteur sans `text-box`). Dimensions inchangées, mesurées : 20×20px.

- **`cn()` : la clé `fontSize` `xxl` était restée hors de la déclaration.**
  `isTshirtSize` de `tailwind-merge` reconnaît `2xl` mais **pas** `xxl`, si bien
  que `cn("text-xxl", "text-black")` supprimait la taille. Même classe de bug
  que celle corrigée en 1.12.12, sur la seule clé du preset restée dehors.
  Dormante (aucun `text-xxl` dans les quatre dépôts) mais armée.
  - **Audit complet des clés `fontSize` de `tailwind-preset.cjs`** :
    `xs`, `sm`, `base`, `lg`, `xl` sont reconnues d'origine ; `xxl`,
    `badge-label`, `header-title`, `button-header` ne le sont pas et sont
    désormais **toutes les quatre** déclarées dans `src/lib/utils.ts`.
  - Un test (`src/__tests__/cn-font-size.test.ts`) relit le preset et échoue si
    une clé `fontSize` y est ajoutée sans être déclarée dans `cn()`.

- **`PageHeader` : `aria-label` du bouton de logo en dur et en anglais.**
  `aria-label="home"` est remplacé par `aria-label={t("pageHeader.home")}` via
  `useTranslationSafe`, le mécanisme déjà utilisé par `StatusIndicator`,
  `MediaStatus`, `ButtonStatus` et `DataTable` pour leurs libellés accessibles.
  Nouvelle clé `pageHeader.home` dans `src/utils/component-translations.ts`,
  renseignée dans les **cinq** langues (EN/FR/ES/IT/DE).

- **`PageHeader` / `BrandLogo` : un `<div>` se retrouvait dans le `<button>`.**
  Le modèle de contenu de `<button>` n'accepte que du *phrasing content*,
  exactement le défaut que le passage du Badge en `<span>` corrigeait dans la
  même version. Corrigé sur les **deux** chemins :
  - la zone de marque du `logo` personnalisé passe de
    `<div className="w-5 flex-shrink-0">` à
    `<span className="block w-5 flex-shrink-0">` ;
  - **`BrandLogo` était aussi concerné** — non signalé par la review, mais c'est
    le chemin **par défaut** (sans prop `logo`) : ses trois branches SVG
    rendaient un `<div>`, désormais un `<span>`. La validité HTML dépend de
    l'élément, pas de son `display`, donc `flex` / `block` sur un `<span>` reste
    du phrasing content.
  - Rendu strictement identique (`<span class="block">` ≡ `<div>`), apparence et
    comportement de la prop inchangés.
  - **Limite** : si le consommateur passe lui-même un `<div>` dans `logo`, il
    reste dans le `<button>` — hors de notre contrôle.

### ✅ Tests

- `src/__tests__/badge-trim-children.test.tsx` (17 tests) — verrouille le
  découpage des enfants du Badge : `0` non traité comme falsy, chaîne vide sans
  span, `false`/`null`/`undefined`, aucun enfant, deux chaînes adjacentes
  regroupées en **un seul** span (sinon le `gap-1` s'insère au milieu du texte),
  `number` + `string` mélangés, texte/élément/texte en deux runs, icône laissée
  hors du span, tableaux imbriqués, limites documentées (texte niché et
  fragment non rognés), `textContent` préservé, absence d'avertissement de clé
  React, et classes de base sur la racine et non sur le span.
- `src/__tests__/cn-font-size.test.ts` (14 tests) — les neuf clés `fontSize`
  survivent à une classe de couleur, un `text-sm` du consommateur remplace bien
  la taille de base, l'ordre `font-size` puis `leading-*` conserve
  l'interlignage, le piège de la taille arbitraire est documenté, aucun autre
  groupe de classes n'est altéré, et le garde-fou de relecture du preset.
- `src/__tests__/page-header-logo-button.test.tsx` (5 tests) — `<button
  type="button">` rendu et appelé, absent sans la prop, libellé accessible issu
  de l'i18n, et **aucun `<div>` dans le bouton** sur les deux chemins (logo par
  défaut et logo personnalisé).

## [1.12.12] - 2026-09-02

### ✨ Ajouté

- **`PageHeader` : logo de marque cliquable via une nouvelle prop optionnelle
  `onLogoClick`.** Quand elle est fournie, la zone de marque — le `logo`
  personnalisé ou le `BrandLogo` du thème — est enveloppée dans un vrai
  `<button type="button">` portant `aria-label="home"`, au lieu de recevoir un
  `onClick` sur un `<div>` : l'activation au clavier et la sémantique pour les
  lecteurs d'écran viennent gratuitement. Le bouton ne porte aucun style propre
  (`p-0 border-0 bg-transparent`), la mise en page de l'en-tête est donc
  inchangée. **Non-breaking** : sans la prop, le balisage est exactement celui
  d'avant, sans élément supplémentaire.

### ♻️ Modifié

- **`Badge` rend désormais un `<span>` et non plus un `<div>`.** Un Badge est
  régulièrement posé à l'intérieur d'un élément interactif — un en-tête de
  section rendu cliquable par un vrai `<button>`, par exemple — et le modèle de
  contenu de `<button>` n'accepte que du *phrasing content* : un `<div>` y était
  du HTML invalide. React ne s'en plaint pas, mais le parseur du navigateur peut
  réarranger l'arbre et les validateurs d'accessibilité le signalent.
  - **Aucun effet visuel** : les classes de base portent `inline-flex`, qui
    écrase le `display` par défaut des deux balises.
  - **Aucun breaking change TypeScript** — vérifié : les props publiques passent
    de `React.HTMLAttributes<HTMLDivElement>` à
    `React.HTMLAttributes<HTMLSpanElement>`, mais `HTMLAttributes<T>` n'utilise
    `T` que dans ses handlers d'événements, et les types de handlers de React
    (`EventHandler`) sont **bivariants** par construction (« bivariance hack »).
    Un consommateur qui avait annoté son handler
    `(e: React.MouseEvent<HTMLDivElement>) => …` continue donc de compiler, de
    même qu'un consommateur qui étend `BadgeProps` ; les deux formes de props
    restent mutuellement assignables.
  - Rappel non lié à ce changement : `Badge` n'est pas un `forwardRef`, la prop
    `ref` n'était pas acceptée avant et ne l'est toujours pas.
  - Pas de prop `as` ajoutée : elle permettrait de remettre un `<div>`, donc de
    reproduire le HTML invalide qu'on corrige, au prix d'un typage polymorphe et
    d'une surface d'API publique supplémentaire.

### 🐛 Corrigé

- **`Badge` : le décalage vertical du texte est supprimé, plus seulement
  atténué.** Le texte est désormais enveloppé dans un
  `<span class="gs-text-trim">` qui applique
  `text-box: trim-both cap alphabetic` : la boîte de texte est rognée sur la
  hauteur de capitale et la ligne de base, si bien que le bloc
  capitale→ligne-de-base est exactement centré par le `align-items: center` du
  Badge. **Mesuré sur le CSS buildé : le décalage résiduel passe de 0,790px à
  0,009px.**
  - **Pourquoi un `<span>` et pas la règle sur le Badge** : `text-box-trim`
    n'est pas héritée et ne s'applique qu'aux « block containers » et « inline
    boxes ». Le Badge étant `inline-flex`, son texte vit dans un élément flex
    **anonyme** qui reprend la valeur initiale `none`. Vérifié dans Chrome : la
    règle posée sur le Badge est bien calculée sur l'élément et pourtant
    totalement inopérante (hauteur identique au pixel près), alors que la même
    règle sur un `<span>` enfant fonctionne.
  - **Seuls les enfants `string` et `number` sont enveloppés.** Le texte niché
    dans un élément enfant n'est pas rogné et garde le rendu actuel — c'est le
    cas des trois usages de `gs_w`, qui passent leurs propres `<span>` / `Text`
    et sont donc **strictement inchangés**. Un consommateur qui veut le rognage
    sur son propre texte peut poser la classe `gs-text-trim` lui-même.
  - Les suites d'enfants textuels adjacents sont regroupées dans **un seul**
    span : `<Badge>Vue {code}</Badge>` produit deux enfants string, et un span
    par enfant aurait créé deux éléments flex donc un `gap-1` parasite au milieu
    du texte (mesuré : +2,7px de largeur).
  - `gap-1` entre une icône et le texte est **préservé** (5px mesurés, identique
    à avant), le span étant posé en frère de l'icône et non autour.
  - **`min-h-4` devient structurel** : c'est lui qui tient la hauteur une fois
    la boîte rognée. Vérifié — en le retirant, le Badge s'effondre de 20px à
    13,078px. Ne pas le supprimer.
  - **Amélioration progressive, sans `@supports`** : `text-box` est Baseline
    depuis août 2026 (Chrome 133+, Safari 18.2+, Firefox 154+). Un moteur plus
    ancien ignore la déclaration et la classe ne pose rien d'autre, donc le
    rendu retombe exactement sur le précédent. Vérifié : **hauteur 20px et
    largeur identiques avec et sans rognage** — aucun saut de layout, seul le
    décalage de 0,8px subsiste.
  - Nouvelle classe **`gs-text-trim`**, générique et réutilisable
    (`src/styles/custom-styles.css`). Le biais corrigé est celui de la police,
    donc `Button size="small"` et `TagText` ont exactement le même :
    l'application y est volontairement **différée** (chaque composant demande de
    revoir sa hauteur de boîte), mais c'est cette classe qu'il faudra réutiliser
    plutôt que d'en créer une autre.

- **`Badge` : le texte passe de 9px à 10px.** 9px (`text-xs`) était jugé trop
  petit. Nouveau token `--badge-fs-label` (0,625rem = 10px), déclaré dans
  `src/styles/custom-styles.css` — **pas** dans `figma-tokens.css`, qui est
  régénéré — et exposé en utilitaire `text-badge-label` par une entrée
  **additive** dans `tailwind-preset.cjs`.
  - **Pourquoi 10px et pas 11px** : 10px est la plus grande taille qui
    n'aggrave pas le décalage vertical du texte. Mesuré dans Chrome sur
    AvenirNextLTPro, par deux méthodes indépendantes concordantes, l'asymétrie
    (espace sous la ligne de base moins espace au-dessus de la capitale) vaut
    **1,625px à 9px, 1,578px à 10px, puis 3,531px à 11px** — elle double à
    partir de 11px. 10px offre donc +11 % de lisibilité **à coût nul** sur le
    centrage.
  - À rectifier par rapport à l'analyse préalable : le modèle prédisait 1,372 →
    1,080px, soit un gain de 0,29px. **La mesure donne un gain réel de
    0,047px**, c'est-à-dire invisible. Le modèle supposait un arrondi entier de
    l'ascent/descent ; Chrome cale en fait la ligne de base sur le pixel
    entier. Le bon argument pour 10px est donc « plus grand sans dégrader », et
    non « plus grand et mieux centré ».
  - **Hauteur du Badge inchangée : 20px** (vérifié sur le CSS buildé). Le
    contenu passe de 17,25px à 18,5px, toujours sous les 20px de `min-h-4`.
  - **⚠️ Écart délibéré à la maquette Figma, à re-discuter en design** : 10px
    n'existe pas dans les primitives, dont l'échelle est 9 / 11 / 13 / 16 / 18 /
    20px, et `fontTagFtText` (`src/styles/figma-primitives.json`) prescrit
    **13px** pour le texte d'un tag, 9px étant réservé au « grade ». Le token
    est volontairement nommé d'après le composant, comme `--header-fs-title` et
    `--button-fs-header`, pour que cet écart reste visible et ne soit pas pris
    pour un nouvel échelon global de l'échelle.
  - Impact consommateurs : le texte s'élargit d'environ 11 %. Les 3 usages de
    `gs_w` sont **inchangés** car tous les trois surchargent déjà la taille
    (`popup-tag-text` a `font-size: var(--font-size-sm)` et `line-height: 1` ;
    les deux badges de `HeaderContainer` ont des `<span>` en `text-sm` à hauteur
    explicite). Parmi les 5 indicateurs de `Thumbnail`, seul `ViewIndicator`
    n'avait pas de surcharge : sa hauteur reste à 15px (son `min-h-3`), seule sa
    largeur croît. Côté `gs_guidelines`, les rangées de chips en `flex-wrap`
    s'élargissent d'environ 11 %, donc légèrement plus de retours à la ligne.

- **`cn()` : les tailles de police personnalisées n'étaient plus fusionnées
  correctement.** `tailwind-merge` ne reconnaît comme `font-size` que les clés en
  « taille de t-shirt » (`xs`, `sm`, `2xl`…). Les clés personnalisées du preset
  retombaient donc dans le groupe *text-color* : `cn("text-badge-label",
  "text-black")` supprimait la **taille** au profit de la couleur — cas réel,
  `Thumbnail/ViewIndicator` passe `text-black` à un `Badge`. `src/lib/utils.ts`
  déclare désormais `badge-label`, `header-title` et `button-header` dans le
  groupe `font-size` via `extendTailwindMerge`. Corrige au passage le même bug
  latent sur `text-header-title` et `text-button-header`. Une taille passée par
  le consommateur (`text-sm`) continue de remplacer celle de la librairie.

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

  ⚠️ **Impact visuel côté consommateurs** : les variantes reprennent un fond
  là où elles n'en avaient plus aucun.

  Ces règles sont écrites `:where([data-bg="…"]).badge-*` et non
  `[data-bg="…"].badge-*` : `:where()` ayant une spécificité nulle, elles pèsent
  (0,1,0) — le poids d'une simple classe — au lieu de (0,2,0). Sans ça elles
  auraient battu les utilitaires Tailwind du consommateur et `<Badge
  className="bg-white">` aurait été silencieusement écrasé (cas réel : `gs_w`,
  `src/pages/validation/components/HeaderContainer/HeaderContainerPresentation.js`).
  À égalité de spécificité avec `.bg-white`, c'est l'ordre source qui tranche, et
  `custom-styles.css` est importé **avant** `@tailwind utilities` : l'utilitaire
  du consommateur gagne. Les variantes s'appliquent normalement dès que rien ne
  les surcharge.

  Incohérence assumée : les classes `btn-*` restent en (0,2,0). Les harmoniser
  est un chantier séparé.

### 📚 Documentation

- Story de non-régression `Design System/Typography › Alignement vertical
  Badge / Button` : Badge et `Button size="small"` dans des conteneurs flex plus
  hauts qu'eux, avec repère de centre, plus les cas `items-stretch`, `flex-col`,
  `items-end`, `flex-wrap` et surcharge `py-1`. Elle remet et étend la story
  `AlignmentTest` de `6c3af9d`, disparue avec `08d4809`. Le repère de centre de
  cette story utilise le token `bg-red-strong` : `bg-red` n'est pas une classe
  que le preset GS génère (seul `red-strong` existe dans la palette) et le
  trait était donc invisible.
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
