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
- [Déploiement AWS](./aws-deployment.md) - Hébergement EC2, authentification JumpCloud et déploiement
- [Workflow de publication](./publishing-workflow.md) - Process de release

### 🔌 Serveur MCP
- [Configuration Cursor](./CURSOR_MCP_CONFIGURATION.md) - Configuration du serveur MCP dans Cursor IDE
- [Vérification du serveur MCP](./VERIFIER_MCP_SERVEUR.md) - Guide de vérification et dépannage

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

- [Storybook en production](https://gs-components-library.grand-shooting.org) - Documentation interactive des composants
- [Storybook local](http://localhost:6006) - Documentation interactive locale
- [Serveur MCP](https://gs-components-library.grand-shooting.org/mcp) - Endpoint du serveur MCP
- [Repository Nexus](https://nexus.grand-shooting.org/repository/npm-gs/) - Registry privé
- [Interface Nexus](https://nexus.grand-shooting.org/) - Gestion des packages

## 📋 Statut du projet

**Version actuelle :** 1.5.12
**Dernière mise à jour :** Novembre 2025
**Statut :** En développement actif
**Déploiement :** AWS EC2, accès JumpCloud (https://gs-components-library.grand-shooting.org)

## 🤝 Contribution

Pour contribuer au projet, consultez le [guide de développement](./development-guide.md).