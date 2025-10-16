# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

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