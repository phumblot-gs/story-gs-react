# Guide de configuration du packaging et publication sur Nexus

Ce guide explique comment configurer un projet pour le packaging et la publication sur Nexus, en suivant le modèle utilisé par `@gs/gs-components-library`.

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Configuration du package.json](#configuration-du-packagejson)
3. [Configuration Vite pour le build de librairie](#configuration-vite-pour-le-build-de-librairie)
4. [Configuration TypeScript](#configuration-typescript)
5. [Configuration de l'authentification Nexus](#configuration-de-lauthentification-nexus)
6. [Scripts de build et publication](#scripts-de-build-et-publication)
7. [Workflow de publication](#workflow-de-publication)
8. [Configuration CI/CD (optionnel)](#configuration-cicd-optionnel)

---

## 🔧 Prérequis

- Node.js 18+ installé
- Accès au repository Nexus : `https://nexus.grand-shooting.org/repository/npm-gs/`
- Identifiants Nexus (username/password) pour la publication
- Projet TypeScript/React configuré avec Vite

---

## 📦 Configuration du package.json

### 1. Métadonnées de base

```json
{
  "name": "@gs/votre-package-name",
  "version": "1.0.0",
  "type": "module",
  "description": "Description de votre package",
  "main": "dist/index.cjs",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "style": "dist/style.css"
}
```

### 2. Configuration des exports

Définissez les points d'entrée pour permettre des imports modulaires :

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./votre-composant": {
      "types": "./dist/components/votre-composant.d.ts",
      "import": "./dist/components/votre-composant.mjs",
      "require": "./dist/components/votre-composant.cjs"
    },
    "./styles": "./dist/style.css"
  }
}
```

### 3. Fichiers à inclure dans la publication

```json
{
  "files": [
    "dist"
  ],
  "sideEffects": [
    "*.css"
  ]
}
```

### 4. Configuration de publication Nexus

```json
{
  "publishConfig": {
    "registry": "https://nexus.grand-shooting.org/repository/npm-gs/",
    "access": "public"
  }
}
```

### 5. Scripts de build et publication

```json
{
  "scripts": {
    "build:lib": "vite build --config vite.lib.config.ts",
    "prepublishOnly": "npm run build:lib"
  }
}
```

> **Note** : Le script `prepublishOnly` s'exécute automatiquement avant `npm publish` pour garantir que le build est à jour.

### 6. Dépendances peer

Si votre librairie dépend de React ou d'autres bibliothèques, déclarez-les comme `peerDependencies` :

```json
{
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

---

## ⚙️ Configuration Vite pour le build de librairie

Créez un fichier `vite.lib.config.ts` séparé pour le build de la librairie :

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dts from "vite-plugin-dts";
import fs from "fs";

// Fonction pour obtenir tous les points d'entrée
const getEntryPoints = () => {
  const entries: Record<string, string> = {
    // Point d'entrée principal
    index: path.resolve(__dirname, "src/index.ts"),
  };

  // Ajouter vos composants/modules ici
  const components = [
    'votre-composant',
    'autre-composant',
  ];

  components.forEach(component => {
    const componentPath = path.resolve(__dirname, `src/components/${component}.tsx`);
    if (fs.existsSync(componentPath)) {
      entries[`components/${component}`] = componentPath;
    }
  });

  return entries;
};

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.lib.json",
      rollupTypes: false,
      insertTypesEntry: true,
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: getEntryPoints(),
      name: "VotreLibrairie",
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const extension = format === 'es' ? 'mjs' : 'cjs';
        return `${entryName}.${extension}`;
      },
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        // Ajoutez ici vos dépendances externes
        // /^@radix-ui/,
        // 'tailwind-merge',
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: 'src',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          if (assetInfo.name?.match(/\.(woff|woff2|ttf|eot)$/)) {
            return 'fonts/[name][extname]';
          }
          return assetInfo.name || '';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    outDir: "dist",
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### Installation des dépendances nécessaires

```bash
npm install --save-dev vite-plugin-dts terser
```

---

## 📝 Configuration TypeScript

Créez un fichier `tsconfig.lib.json` pour le build de la librairie :

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": false,
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false,
    "noEmit": false,
    "moduleResolution": "node",
    "allowImportingTsExtensions": false,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": [
    "**/*.stories.tsx",
    "**/*.test.tsx",
    "**/*.spec.tsx",
    "src/main.tsx",
    "src/App.tsx",
    "node_modules",
    "dist"
  ]
}
```

---

## 🔐 Configuration de l'authentification Nexus

### Option 1 : Fichier `.npmrc` local (recommandé pour développement)

Créez un fichier `.npmrc` à la racine du projet (et ajoutez-le à `.gitignore`) :

```bash
@gs:registry=https://nexus.grand-shooting.org/repository/npm-gs/
//nexus.grand-shooting.org/repository/npm-gs/:_auth=BASE64_ENCODED_AUTH
```

### Génération du token d'authentification

```bash
# Encoder username:password en base64
echo -n "username:password" | base64
```

Remplacez `BASE64_ENCODED_AUTH` par le résultat de la commande ci-dessus.

### Option 2 : Variables d'environnement (recommandé pour CI/CD)

```bash
# Configurer le registry pour les packages @gs
echo "@gs:registry=https://nexus.grand-shooting.org/repository/npm-gs/" >> ~/.npmrc
echo "//nexus.grand-shooting.org/repository/npm-gs/:_auth=$NPM_NEXUS_AUTH" >> ~/.npmrc
```

### `.gitignore`

Assurez-vous que `.npmrc` est dans votre `.gitignore` :

```
.npmrc
dist/
```

---

## 🚀 Scripts de build et publication

### Build de la librairie

```bash
npm run build:lib
```

Cette commande génère :
- `dist/index.mjs` - Module ES
- `dist/index.cjs` - Module CommonJS
- `dist/index.d.ts` - Types TypeScript
- `dist/style.css` - Styles CSS
- Source maps pour le debugging

### Vérification du build

```bash
# Vérifier le contenu du dossier dist
ls -la dist/

# Tester l'installation locale
npm pack
```

---

## 📤 Workflow de publication

### 1. Préparation

```bash
# S'assurer que tout est commité
git status
git add .
git commit -m "feat: Nouvelles fonctionnalités prêtes pour publication"

# Vérifier le linting
npm run lint
```

### 2. Gestion des versions

```bash
# Version patch (1.0.0 -> 1.0.1) - Corrections de bugs
npm version patch

# Version minor (1.0.0 -> 1.1.0) - Nouvelles fonctionnalités
npm version minor

# Version major (1.0.0 -> 2.0.0) - Breaking changes
npm version major

# Version beta (1.0.0 -> 1.1.0-beta.1) - Versions de test
npm version prerelease --preid=beta
```

> **Important** : `npm version` crée automatiquement un tag Git. N'oubliez pas de pusher le tag :
> ```bash
> git push origin main --follow-tags
> ```

### 3. Build et publication

```bash
# Le build s'exécute automatiquement via prepublishOnly
npm publish --tag beta  # Pour version beta
npm publish            # Pour version stable (tag latest)
```

### 4. Vérification post-publication

```bash
# Vérifier que le package est disponible
npm view @gs/votre-package-name versions

# Tester l'installation dans un projet externe
npm install @gs/votre-package-name@latest
```

---

## 🔄 Configuration CI/CD (optionnel)

### GitHub Actions

Créez `.github/workflows/publish.yml` :

```yaml
name: Publish Package

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Configure npm for Nexus authentication
        run: |
          npm config set registry https://registry.npmjs.org/
          echo "@gs:registry=https://nexus.grand-shooting.org/repository/npm-gs/" >> ~/.npmrc
          echo "//nexus.grand-shooting.org/repository/npm-gs/:_auth=${{ secrets.NPM_NEXUS_AUTH }}" >> ~/.npmrc

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npm run lint

      - name: Build library
        run: npm run build:lib

      - name: Publish to Nexus
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_NEXUS_AUTH }}
```

### GitLab CI

Créez `.gitlab-ci.yml` :

```yaml
stages:
  - test
  - build
  - publish

variables:
  NODE_VERSION: "20"

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
    - npm run build:lib
  only:
    - merge_requests
    - main

publish:
  stage: publish
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - echo "@gs:registry=https://nexus.grand-shooting.org/repository/npm-gs/" >> ~/.npmrc
    - echo "//nexus.grand-shooting.org/repository/npm-gs/:_auth=$NPM_NEXUS_AUTH" >> ~/.npmrc
    - npm run build:lib
    - npm publish
  only:
    - tags
  when: manual
```

### Variables d'environnement à configurer

Dans votre CI/CD, configurez la variable secrète :
- **Nom** : `NPM_NEXUS_AUTH`
- **Valeur** : Token base64 encodé (`echo -n "username:password" | base64`)

---

## ✅ Checklist de configuration

### Configuration initiale

- [ ] `package.json` configuré avec `publishConfig`
- [ ] `exports` définis dans `package.json`
- [ ] `vite.lib.config.ts` créé et configuré
- [ ] `tsconfig.lib.json` créé
- [ ] Script `build:lib` ajouté
- [ ] Script `prepublishOnly` configuré
- [ ] `.npmrc` configuré localement (ou variables d'environnement)
- [ ] `.npmrc` ajouté à `.gitignore`

### Test de publication

- [ ] Build local réussi (`npm run build:lib`)
- [ ] Contenu du dossier `dist/` vérifié
- [ ] Test d'installation locale (`npm pack`)
- [ ] Publication test réussie
- [ ] Package visible sur Nexus
- [ ] Installation dans projet externe fonctionne

---

## 🎯 Bonnes pratiques

### Versioning sémantique

- **PATCH** (1.0.0 → 1.0.1) : Corrections de bugs
- **MINOR** (1.0.0 → 1.1.0) : Nouvelles fonctionnalités (backwards-compatible)
- **MAJOR** (1.0.0 → 2.0.0) : Breaking changes

### Gestion des dépendances

- Utilisez `peerDependencies` pour React et autres bibliothèques partagées
- Externalisez les dépendances lourdes dans `rollupOptions.external`
- Évitez de bundler les dépendances qui seront installées par le projet consommateur

### Tests avant publication

```bash
# 1. Build local
npm run build:lib

# 2. Pack local
npm pack

# 3. Tester dans un projet externe
cd /tmp
mkdir test-install
cd test-install
npm init -y
npm install /path/to/your/package/gs-votre-package-name-1.0.0.tgz
```

### Documentation

- Maintenez un `CHANGELOG.md` à jour
- Documentez les breaking changes
- Fournissez des exemples d'utilisation

---

## 🆘 Dépannage

### Erreur : "401 Unauthorized"

**Cause** : Authentification Nexus incorrecte

**Solution** :
```bash
# Vérifier le token base64
echo -n "username:password" | base64

# Vérifier le contenu de .npmrc
cat .npmrc
```

### Erreur : "404 Not Found"

**Cause** : Registry incorrect ou package non trouvé

**Solution** :
```bash
# Vérifier la configuration du registry
npm config get registry
npm config get @gs:registry

# Vérifier que le package existe
npm view @gs/votre-package-name
```

### Erreur : "Cannot find module"

**Cause** : Exports mal configurés ou build incomplet

**Solution** :
```bash
# Vérifier les exports dans package.json
# Vérifier que dist/ contient les bons fichiers
ls -la dist/
```

---

## 📚 Ressources supplémentaires

- [Documentation npm publish](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [Documentation Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [Semantic Versioning](https://semver.org/)

---

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement ou consultez la documentation du projet de référence `@gs/gs-components-library`.


