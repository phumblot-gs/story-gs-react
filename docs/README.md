# Documentation GS Components Library

Bienvenue dans la documentation de la librairie de composants GS.

## 📚 Guide de navigation

- [Guide de démarrage rapide](./quick-start.md)
- [Guide de développement](./development-guide.md)
- [Guide de déploiement](./deployment-guide.md)
- [Composants disponibles](./components/README.md)
- [Workflow de publication](./publishing-workflow.md)

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

```tsx
import { Button, FileBrowser, Select } from '@gs/gs-components-library';

function App() {
  return (
    <div>
      <Button variant="primary">Mon bouton</Button>
      <FileBrowser files={files} onFilesSelected={handleSelection} />
      <Select options={options} onValueChange={handleChange} />
    </div>
  );
}
```

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