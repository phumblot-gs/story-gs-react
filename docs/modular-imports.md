# Guide des imports modulaires

## 🎯 Introduction

La librairie GS Components supporte désormais les imports modulaires, permettant d'optimiser significativement la taille du bundle final grâce au tree-shaking automatique.

## 📦 Comparaison des méthodes d'import

### Import monolithique (ancien - à éviter)

```typescript
import { Button, FileBrowser, Select } from '@gs/gs-components-library';
// ⚠️ Charge TOUTE la librairie (~250KB)
```

### Import modulaire (nouveau - recommandé)

```typescript
import { Button } from '@gs/gs-components-library/button';
import { FileBrowser } from '@gs/gs-components-library/file-browser';
import { Select } from '@gs/gs-components-library/select';
// ✅ Charge uniquement les composants nécessaires (~45KB)
```

## 📊 Avantages mesurables

- **Réduction de 80% de la taille du bundle** pour les imports sélectifs
- **Tree-shaking automatique** par Webpack/Vite/Rollup
- **Chargement plus rapide** des applications
- **Meilleure performance au runtime**
- **Compatibilité totale** avec l'ancienne méthode

## 🔧 Configuration Tailwind requise

Pour que les styles fonctionnent correctement, ajoutez le chemin de la librairie dans votre `tailwind.config.ts` :

```typescript
export default {
  content: [
    // ... vos autres chemins
    "./node_modules/@gs/gs-components-library/dist/**/*.{js,mjs,jsx}"
  ],
  // ...
}
```

## 📚 Chemins d'import disponibles

### Composants UI de base

| Composant | Import | Description |
|-----------|--------|-------------|
| Button | `@gs/gs-components-library/button` | Boutons et variantes |
| ButtonCircle | `@gs/gs-components-library/button-circle` | Boutons circulaires avec icônes |
| FileBrowser | `@gs/gs-components-library/file-browser` | Explorateur de fichiers complet |
| FolderBrowser | `@gs/gs-components-library/folder-browser` | Navigateur de dossiers |
| Select | `@gs/gs-components-library/select` | Menu déroulant |
| Tabs | `@gs/gs-components-library/tabs` | Onglets de navigation |
| ModalLayer | `@gs/gs-components-library/modal-layer` | Système de modales |

### Composants métier

| Composant | Import | Description |
|-----------|--------|-------------|
| PageHeader | `@gs/gs-components-library/page-header` | En-tête de page |
| ButtonNotifications | `@gs/gs-components-library/button-notifications` | Bouton avec notifications |
| ButtonStatus | `@gs/gs-components-library/button-status` | Bouton avec statut |
| StatusIndicator | `@gs/gs-components-library/status-indicator` | Indicateur de statut |
| MediaStatus | `@gs/gs-components-library/media-status` | Statut des médias |

### Providers

| Provider | Import | Description |
|----------|--------|-------------|
| ThemeProvider | `@gs/gs-components-library/providers/theme` | Gestion des thèmes |
| TranslationProvider | `@gs/gs-components-library/providers/translation` | Système i18n |
| ActivityStatusProvider | `@gs/gs-components-library/providers/activity-status` | Statut d'activité |

### Utilitaires

| Utilitaire | Import | Description |
|------------|--------|-------------|
| cn | `@gs/gs-components-library/utils` | Utility classNames |
| translations | `@gs/gs-components-library/utils/translations` | Traductions par défaut |
| mediaStatus | `@gs/gs-components-library/utils/media-status` | Utilitaires de statut |
| colorUtils | `@gs/gs-components-library/utils/color` | Manipulation des couleurs |

### Icons

```typescript
import { IconProvider } from '@gs/gs-components-library/icons';
import type { IconName } from '@gs/gs-components-library/icons';
```

## 💡 Exemples d'utilisation

### Setup complet avec providers

```typescript
import { ThemeProvider } from '@gs/gs-components-library/providers/theme';
import { TranslationProvider } from '@gs/gs-components-library/providers/translation';
import { Button } from '@gs/gs-components-library/button';

function App() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <Button size="large" featured>
          Mon application
        </Button>
      </TranslationProvider>
    </ThemeProvider>
  );
}
```

### Import dynamique pour lazy loading

```typescript
import { lazy, Suspense } from 'react';

// Lazy loading du FileBrowser
const FileBrowser = lazy(() =>
  import('@gs/gs-components-library/file-browser')
    .then(module => ({ default: module.FileBrowser }))
);

function App() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <FileBrowser files={[]} />
    </Suspense>
  );
}
```

### Personnalisation du thème

```typescript
import { useCustomTheme } from '@gs/gs-components-library/providers/theme';

function MyComponent() {
  const { updateCustomization } = useCustomTheme();

  useEffect(() => {
    // Surcharger les couleurs du thème
    updateCustomization({
      colors: {
        bgWhite: '#f5f5f5',
        textBluePrimary: '#0066cc',
        statusSelected: '#00ff00'
      }
    });
  }, []);

  return <div>Composant avec thème personnalisé</div>;
}
```

## 🔄 Migration depuis les imports monolithiques

### Étape 1: Identifier les composants utilisés

```bash
# Rechercher tous les imports de la librairie
grep -r "@gs/gs-components-library" src/
```

### Étape 2: Remplacer les imports

```typescript
// Avant
import {
  Button,
  FileBrowser,
  Select,
  ThemeProvider
} from '@gs/gs-components-library';

// Après
import { Button } from '@gs/gs-components-library/button';
import { FileBrowser } from '@gs/gs-components-library/file-browser';
import { Select } from '@gs/gs-components-library/select';
import { ThemeProvider } from '@gs/gs-components-library/providers/theme';
```

### Étape 3: Vérifier le build

```bash
npm run build
```

## 📈 Analyse de la taille du bundle

Pour analyser l'impact des imports modulaires sur votre bundle :

```bash
# Installer l'analyseur de bundle (si nécessaire)
npm install --save-dev webpack-bundle-analyzer

# Analyser le bundle
npm run build -- --analyze
```

## ⚠️ Points d'attention

1. **CSS de la librairie** : N'oubliez pas d'importer le CSS principal
   ```typescript
   import '@gs/gs-components-library/style.css';
   ```

2. **Providers requis** : Certains composants nécessitent des providers
   - Les composants avec traductions nécessitent `TranslationProvider`
   - Les composants avec thème nécessitent `ThemeProvider`

3. **Types TypeScript** : Les types sont automatiquement inclus avec chaque import modulaire

## 🆘 Dépannage

### Le composant ne s'affiche pas correctement

Vérifiez que :
1. Le CSS de la librairie est importé
2. Tailwind est configuré pour scanner les fichiers de la librairie
3. Les providers nécessaires sont en place

### Erreur TypeScript sur les imports

Assurez-vous que votre `tsconfig.json` contient :
```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

### Le tree-shaking ne fonctionne pas

Vérifiez que votre bundler est configuré pour :
- Mode production (`NODE_ENV=production`)
- Optimisation activée
- Support des modules ES6