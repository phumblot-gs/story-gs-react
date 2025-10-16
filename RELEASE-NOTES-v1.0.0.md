# Release Notes - v1.0.0-beta.1

## 🚀 Version Majeure - Refonte Complète

### 📅 Date: 2024-10-16

## ✨ Nouvelles Fonctionnalités

### 1. **Système de Traduction Multi-langue**
- Support de 5 langues : EN, FR, ES, IT, DE
- `TranslationProvider` et hook `useTranslation`
- Tous les composants UI traduits
- Changement de langue dynamique

### 2. **Intégration Figma Tokens**
- Génération automatique de CSS depuis les tokens Figma
- Script `generate-css-tokens.cjs`
- Variables CSS pour couleurs, espacements et typographie
- Support light/dark mode

### 3. **Alignement shadcn/ui**
- Variables CSS standardisées
- Format RGB pour support opacité Tailwind
- Composant `button-shadcn` compatible
- Fichier `theme-variables.css` unifié

### 4. **ThemeProvider Amélioré**
- Conversion automatique hex vers RGB
- Override des variables CSS à la volée
- Persistance dans localStorage
- Support complet dark mode

## 🔄 Breaking Changes

### Exports Modularisés
```javascript
// Avant (v0.x)
import Component from '@gs/gs-components-library/Component';

// Après (v1.0.0)
import { Component } from '@gs/gs-components-library';
```

### Providers Requis
Les composants nécessitent maintenant les providers :
```jsx
<ThemeProvider>
  <TranslationProvider defaultLanguage="FR">
    <App />
  </TranslationProvider>
</ThemeProvider>
```

### Variables CSS
Format RGB au lieu d'hexadécimal :
```css
/* Avant */
--bg-black: #292828;

/* Après */
--bg-black: 41 40 40;
```

## 📦 Composants Mis à Jour

- ✅ FileBrowser - Traductions complètes
- ✅ FolderBrowser - Traductions complètes
- ✅ Button - Support shadcn patterns
- ✅ Select - Compatible avec providers
- ✅ ModalLayer - Compatible avec providers

## 🛠️ Configuration

### Build
```bash
npm run build:lib        # Build de production
npm run generate:tokens  # Génération des tokens CSS
```

### Storybook
```bash
npm run storybook  # Lance sur http://localhost:6006
```

### Imports Requis
```javascript
import {
  ThemeProvider,
  TranslationProvider,
  useCustomTheme,
  useTranslation
} from '@gs/gs-components-library';
```

## 📊 Métriques

- **Taille du bundle**: ~82KB (CSS inclus)
- **Temps de build**: ~11.6s
- **Modules**: 3406 transformés
- **Tree-shaking**: ✅ Optimisé
- **TypeScript**: ✅ Types exportés

## 🔍 Tests Validés

| Test | Statut | Description |
|------|--------|-------------|
| Build | ✅ | Compilation sans erreurs |
| Types | ✅ | Tous les types exportés |
| Providers | ✅ | Fonctionnement vérifié |
| Traductions | ✅ | 5 langues testées |
| Storybook | ✅ | Stories fonctionnelles |

## 📝 Migration Guide

### 1. Mettre à jour les imports
Remplacer tous les `export default` par des imports nommés.

### 2. Ajouter les providers
Wrapper votre app avec `ThemeProvider` et `TranslationProvider`.

### 3. Mettre à jour les variables CSS
Si vous utilisez des variables custom, convertir en format RGB.

### 4. Vérifier les dépendances
```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

## 🐛 Corrections

- Fix: Erreur TranslationProvider dans Storybook
- Fix: Exports des providers manquants
- Fix: Syntaxe dans FileBrowser
- Fix: Variables CSS en format RGB

## 👥 Contributors

- GS Development Team
- Claude AI Assistant

## 📄 License

Propriétaire - GS Components Library

---

Pour toute question ou problème, ouvrir une issue sur le repository.