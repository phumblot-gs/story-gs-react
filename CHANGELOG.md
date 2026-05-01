# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

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