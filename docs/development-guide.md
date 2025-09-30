# Guide de développement

## 🛠️ Configuration de l'environnement de développement

### Prérequis

- Node.js 18+
- npm 9+
- Git
- Accès au repository GitLab/GitHub
- Compte Nexus avec droits de publication

### Installation du projet

```bash
# Cloner le repository
git clone <repository-url>
cd story-gs-react

# Installer les dépendances
npm install

# Lancer Storybook en mode développement
npm run storybook

# Lancer le serveur de développement Vite
npm run dev
```

## 📂 Structure du projet

```
story-gs-react/
├── src/
│   ├── components/
│   │   ├── ui/           # Composants UI principaux
│   │   │   ├── button/
│   │   │   ├── file-browser/
│   │   │   ├── select/
│   │   │   └── ...
│   │   └── ...           # Autres composants
│   ├── lib/              # Utilitaires
│   ├── utils/            # Fonctions utilitaires
│   └── index.ts          # Point d'entrée de la librairie
├── docs/                 # Documentation
├── dist/                 # Build de production
├── .storybook/           # Configuration Storybook
├── vite.lib.config.ts    # Configuration build librairie
└── package.json
```

## 🎨 Conventions de développement

### Nomenclature des composants

- **PascalCase** pour les noms de composants : `FileBrowser`, `ButtonCircle`
- **kebab-case** pour les noms de fichiers : `file-browser.tsx`, `button-circle.tsx`
- **camelCase** pour les props et variables : `allowDragDrop`, `onFilesSelected`

### Structure d'un composant

```tsx
// src/components/ui/mon-composant/index.tsx
import React from 'react';
import { cn } from '@/lib/utils';

export interface MonComposantProps {
  className?: string;
  children?: React.ReactNode;
  // ... autres props
}

export const MonComposant = React.forwardRef<
  HTMLDivElement,
  MonComposantProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("base-classes", className)}
      {...props}
    >
      {children}
    </div>
  );
});

MonComposant.displayName = "MonComposant";
```

### Types TypeScript

- Définir des interfaces pour toutes les props
- Utiliser des unions de types pour les variantes
- Exporter les types pour réutilisation

```tsx
export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  featured?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

## 🧪 Tests et qualité

### Linting et formatage

```bash
# Vérifier le linting
npm run lint

# Auto-fix des erreurs lint
npm run lint -- --fix
```

### Tests

```bash
# Lancer les tests (si configurés)
npm test

# Tests en mode watch
npm test -- --watch
```

## 📦 Workflow de développement

### 1. Création d'une nouvelle feature

```bash
# Créer une nouvelle branche
git checkout -b feature/nouveau-composant

# Développer le composant
# ... coding ...

# Tester dans Storybook
npm run storybook
```

### 2. Ajout d'un nouveau composant

1. **Créer la structure du composant** dans `src/components/ui/`
2. **Ajouter les types** dans un fichier `types.ts` si nécessaire
3. **Créer les stories Storybook** dans `mon-composant.stories.tsx`
4. **Exporter le composant** dans `src/index.ts`
5. **Tester** dans Storybook et applications

### 3. Workflow git

```bash
# Commiter les changements
git add .
git commit -m "feat: Ajout du composant MonComposant"

# Pusher la branche
git push origin feature/nouveau-composant

# Créer une Pull Request
# Merger après review
```

## 🚀 Build et publication

### Build de développement

```bash
# Build de la librairie
npm run build:lib

# Build Storybook
npm run build-storybook
```

### Workflow de publication

```bash
# 1. S'assurer que tout est commité
git status

# 2. Corriger les erreurs lint
npm run lint

# 3. Créer une nouvelle version
npm version patch  # ou minor/major/prerelease

# 4. Build de la librairie
npm run build:lib

# 5. Publier sur Nexus
npm publish --tag beta  # pour une version beta
npm publish             # pour une version stable
```

## 🎯 Bonnes pratiques

### Performance

- Utiliser `React.memo` pour les composants qui re-rendent souvent
- Implémenter `useMemo` et `useCallback` quand nécessaire
- Éviter les créations d'objets/fonctions dans le render

### Accessibilité

- Utiliser les primitives Radix UI quand possible
- Ajouter les attributs ARIA appropriés
- Tester avec un lecteur d'écran
- Respecter les contrastes de couleurs

### Styling

- Utiliser Tailwind CSS avec des classes utilitaires
- Créer des variants avec `class-variance-authority`
- Permettre la surcharge avec `className`
- Utiliser `cn()` pour merger les classes

### Documentation

- Documenter toutes les props dans les interfaces TypeScript
- Créer des stories Storybook complètes
- Ajouter des exemples d'utilisation
- Maintenir la documentation à jour

## 🔧 Outils de développement

### VS Code Extensions recommandées

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- ESLint

### Scripts disponibles

```bash
npm run dev          # Serveur de développement Vite
npm run build        # Build application
npm run build:lib    # Build librairie
npm run lint         # Linting ESLint
npm run storybook    # Storybook en mode dev
npm run build-storybook  # Build Storybook
npm run preview      # Preview du build
```

## 🐛 Debugging

### Debugging des composants

- Utiliser React DevTools
- Ajouter des logs avec `console.log` temporairement
- Utiliser les outils de développement du navigateur

### Problèmes courants

- **Styles non appliqués** : Vérifier l'import de Tailwind CSS
- **Types manquants** : S'assurer que les interfaces sont exportées
- **Build échoue** : Vérifier les imports et les dépendances
- **Storybook ne démarre pas** : Vérifier la configuration dans `.storybook/`