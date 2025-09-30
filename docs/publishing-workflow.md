# Workflow de publication

## 🔄 Vue d'ensemble du processus

Ce document décrit le workflow complet de publication de la librairie GS Components, depuis le développement jusqu'à la mise en production.

## 📋 Étapes du workflow

### 1. 🛠️ Développement local

```bash
# Démarrer l'environnement de développement
npm run storybook        # Documentation interactive
npm run dev             # Serveur de développement (si applicable)
```

**Activités :**
- Développement de nouveaux composants
- Mise à jour des composants existants
- Tests manuels dans Storybook
- Documentation des composants

### 2. 🧪 Tests et validation

```bash
# Linting du code
npm run lint

# Tests unitaires (si configurés)
npm test

# Build de test
npm run build:lib
```

**Vérifications :**
- ✅ Code conforme aux standards ESLint
- ✅ Aucune erreur TypeScript
- ✅ Build de la librairie réussit
- ✅ Composants fonctionnels dans Storybook

### 3. 📝 Préparation de la release

```bash
# S'assurer que tout est commité
git status
git add .
git commit -m "feat: Nouvelles fonctionnalités prêtes"

# Push vers la branche de développement
git push origin feature/ma-branche
```

**Actions :**
- Création/mise à jour de la Pull Request
- Code review par l'équipe
- Tests d'intégration
- Validation des maquettes Figma

### 4. 🔀 Merge et versioning

```bash
# Après validation, merger dans main
git checkout main
git pull origin main
git merge feature/ma-branche

# Déterminer le type de version
npm version patch   # 0.3.0 -> 0.3.1 (bug fixes)
npm version minor   # 0.3.0 -> 0.4.0 (nouvelles fonctionnalités)
npm version major   # 0.3.0 -> 1.0.0 (breaking changes)

# Ou version beta
npm version prerelease --preid=beta  # 0.3.0 -> 0.4.0-beta.1
```

### 5. 🏗️ Build de production

```bash
# Build de la librairie
npm run build:lib

# Vérification du contenu du build
ls -la dist/
```

**Contenu généré :**
- `gs-components.es.js` - Module ES
- `gs-components.umd.js` - Module UMD
- `*.d.ts` - Fichiers de types TypeScript
- Source maps pour le debugging

### 6. 📦 Publication npm

```bash
# Publication beta (recommandé pour premiers tests)
npm publish --tag beta

# Ou publication stable
npm publish
```

**Vérifications post-publication :**
- ✅ Package visible sur Nexus
- ✅ Installation possible dans un projet test
- ✅ Import des composants fonctionne

### 7. 📚 Déploiement Storybook

```bash
# Build Storybook
npm run build-storybook

# Déploiement (automatique via CI/CD ou manuel)
rsync -av storybook-static/ user@server:/var/www/storybook/
```

### 8. 📢 Communication

- Notification à l'équipe de développement
- Mise à jour du CHANGELOG.md
- Documentation des breaking changes si applicable
- Mise à jour des projets dépendants

## 🌿 Stratégie de branches

### Branches principales

- **`main`** - Code stable, toujours déployable
- **`develop`** - Branche d'intégration pour nouvelles fonctionnalités
- **`feature/*`** - Branches de fonctionnalités
- **`hotfix/*`** - Corrections urgentes

### Workflow Git Flow

```bash
# Nouvelle fonctionnalité
git checkout -b feature/nouveau-composant main
# ... développement ...
git push origin feature/nouveau-composant
# Pull Request vers main

# Correction urgente
git checkout -b hotfix/correction-urgente main
# ... correction ...
git push origin hotfix/correction-urgente
# Pull Request vers main (fast-track)
```

## 📊 Versioning sémantique

### Format : `MAJOR.MINOR.PATCH[-PRERELEASE]`

#### PATCH (0.3.0 → 0.3.1)
- Corrections de bugs
- Améliorations mineures
- Mises à jour de dépendances

```bash
npm version patch
```

#### MINOR (0.3.0 → 0.4.0)
- Nouvelles fonctionnalités
- Nouveaux composants
- Améliorations backwards-compatible

```bash
npm version minor
```

#### MAJOR (0.3.0 → 1.0.0)
- Breaking changes
- Refactoring majeur
- Changements d'API

```bash
npm version major
```

#### PRERELEASE (0.3.0 → 0.4.0-beta.1)
- Versions de test
- Fonctionnalités expérimentales
- Tests avant release stable

```bash
npm version prerelease --preid=beta
npm version prerelease --preid=alpha
npm version prerelease --preid=rc
```

## 🚨 Gestion des urgences

### Hotfix workflow

```bash
# 1. Créer la branche hotfix
git checkout -b hotfix/fix-critical-bug main

# 2. Corriger le problème
# ... développement ...

# 3. Test rapide
npm run lint
npm run build:lib

# 4. Commit et push
git add .
git commit -m "fix: Correction bug critique"
git push origin hotfix/fix-critical-bug

# 5. Merge rapide (après review express)
git checkout main
git merge hotfix/fix-critical-bug

# 6. Version patch immédiate
npm version patch

# 7. Publication urgente
npm run build:lib
npm publish

# 8. Nettoyer
git branch -d hotfix/fix-critical-bug
git push origin --delete hotfix/fix-critical-bug
```

## 🔄 Automatisation CI/CD

### Configuration recommandée

```yaml
# .github/workflows/publish.yml
name: Publish Package

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: |
          npm run lint
          npm run build:lib

      - name: Publish to Nexus
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Déclencheurs automatiques

- **Tag push** → Publication automatique
- **Main branch push** → Build et tests
- **PR creation** → Tests et validation

## 📋 Checklist de publication

### Avant publication ✅

- [ ] Code review approuvé
- [ ] Tests lint passent
- [ ] Build réussit sans erreurs
- [ ] Storybook fonctionne correctement
- [ ] Documentation mise à jour
- [ ] Version appropriée sélectionnée
- [ ] CHANGELOG.md mis à jour

### Pendant la publication ✅

- [ ] Build de production exécuté
- [ ] Publication npm réussie
- [ ] Package visible sur Nexus
- [ ] Storybook déployé
- [ ] Tags Git créés

### Après publication ✅

- [ ] Test d'installation dans projet externe
- [ ] Vérification des imports/exports
- [ ] Notification équipe envoyée
- [ ] Documentation projet mise à jour
- [ ] Surveillance des erreurs/retours

## 🔍 Monitoring post-publication

### Métriques à surveiller

- **Téléchargements npm** - Adoption de la nouvelle version
- **Issues GitHub/GitLab** - Problèmes remontés
- **Retours Slack/Teams** - Feedback de l'équipe
- **Logs d'erreurs** - Sentry, LogRocket, etc.

### Actions correctives

Si problèmes détectés :

```bash
# Deprecate la version problématique
npm deprecate @gs/gs-components-library@1.0.1 "Problème critique - utiliser 1.0.0"

# Ou unpublish (< 72h)
npm unpublish @gs/gs-components-library@1.0.1

# Préparer hotfix immédiatement
git checkout -b hotfix/fix-version-1.0.1 main
```

## 🎯 Bonnes pratiques

### Communication

- **Annonces proactives** pour les breaking changes
- **Documentation claire** des migrations nécessaires
- **Exemples de code** pour les nouvelles fonctionnalités
- **Roadmap publique** des prochaines versions

### Tests

- **Test d'intégration** dans un projet réel avant publication
- **Tests backwards-compatibility** pour les mises à jour
- **Validation multi-environnements** (dev, staging, prod)

### Rollback strategy

- **Maintenir les versions stables** disponibles
- **Documentation des procédures de rollback**
- **Scripts automatisés** pour les retours en arrière rapides