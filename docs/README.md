# Documentation GS Components Library

Bienvenue dans la documentation de la librairie de composants GS.

## 📚 Guide de navigation

### 🚀 Démarrage
- [Guide de démarrage rapide](./quick-start.md) - Installation et premiers pas
- [Imports modulaires](./modular-imports.md) - **🆕 Optimisation du bundle avec tree-shaking**

### 💻 Développement
- [Guide de développement](./development-guide.md) - Contribuer au projet
- [Architecture](./architecture.md) - Structure et design patterns
- [Intégration Figma](./figma-integration.md) - Tokens et design system

### 📖 Référence
- [Composants disponibles](./components/README.md) - Catalogue complet
- [Providers](./providers.md) - ThemeProvider, TranslationProvider
- [API Reference](./api-reference.md) - Documentation détaillée

### 🚢 Déploiement
- [Guide de déploiement](./deployment-guide.md) - Mise en production
- [Workflow de publication](./publishing-workflow.md) - Process de release

## 🚀 Vue d'ensemble

Cette librairie fournit un ensemble de composants React réutilisables avec support TypeScript, construite avec :

- **React 18** - Framework principal
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **Radix UI** - Primitives accessibles
- **Storybook** - Documentation interactive
- **Vite** - Build tool moderne

## 📦 Installation

```bash
# Installation depuis le registry Nexus privé
npm install @gs/gs-components-library

# Installation de la version beta
npm install @gs/gs-components-library@beta
```

## 🎯 Utilisation rapide

### Import monolithique (compatibilité)
```tsx
import { Button, FileBrowser, Select } from '@gs/gs-components-library';
```

### Import modulaire (recommandé - 80% plus léger!)
```tsx
import { Button } from '@gs/gs-components-library/button';
import { FileBrowser } from '@gs/gs-components-library/file-browser';
import { Select } from '@gs/gs-components-library/select';
```

### Exemple complet
```tsx
import { ThemeProvider } from '@gs/gs-components-library/providers/theme';
import { Button } from '@gs/gs-components-library/button';

function App() {
  return (
    <ThemeProvider>
      <Button size="large" featured>
        Mon bouton optimisé
      </Button>
    </ThemeProvider>
  );
}
```

📘 Voir le [guide des imports modulaires](./modular-imports.md) pour plus de détails.

## 🔗 Liens utiles

- [Storybook local](http://localhost:6006) - Documentation interactive des composants
- [Repository Nexus](https://nexus.grand-shooting.org/repository/npm-gs/) - Registry privé
- [Interface Nexus](https://nexus.grand-shooting.org/) - Gestion des packages

## 📋 Statut du projet

**Version actuelle :** 0.3.0-beta.1
**Dernière mise à jour :** 30 septembre 2025
**Statut :** En développement actif

## 🤝 Contribution

Pour contribuer au projet, consultez le [guide de développement](./development-guide.md).