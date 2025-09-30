# Guide de déploiement

## 🚀 Vue d'ensemble du déploiement

Cette librairie a deux types de déploiements :

1. **Storybook** - Documentation interactive des composants
2. **Package npm** - Librairie distribuée via Nexus

## 📚 Déploiement Storybook

### Build de production

```bash
# Build Storybook pour la production
npm run build-storybook
```

Le build génère un dossier `storybook-static/` contenant les fichiers statiques.

### Déploiement automatique

Le déploiement Storybook est automatisé via CI/CD :

- **Déclencheur** : Push sur la branche `main`
- **Cible** : Serveur de documentation interne
- **URL** : `https://storybook.gs-components.internal`

### Configuration CI/CD

```yaml
# .gitlab-ci.yml ou .github/workflows/deploy.yml
deploy-storybook:
  stage: deploy
  script:
    - npm install
    - npm run build-storybook
    - rsync -av storybook-static/ user@server:/var/www/storybook/
  only:
    - main
```

### Déploiement manuel

```bash
# Build
npm run build-storybook

# Upload vers le serveur
scp -r storybook-static/* user@server:/var/www/storybook/

# Ou avec rsync
rsync -av storybook-static/ user@server:/var/www/storybook/
```

## 📦 Publication de la librairie npm

### Workflow de publication

#### 1. Préparation

```bash
# S'assurer que tout est commité
git status
git add .
git commit -m "feat: Nouvelles fonctionnalités prêtes pour publication"

# Vérifier le linting
npm run lint
```

#### 2. Gestion des versions

```bash
# Version patch (0.3.0 -> 0.3.1)
npm version patch    # Crée automatiquement le tag Git v0.3.1

# Version minor (0.3.0 -> 0.4.0)
npm version minor    # Crée automatiquement le tag Git v0.4.0

# Version major (0.3.0 -> 1.0.0)
npm version major    # Crée automatiquement le tag Git v1.0.0

# Version beta (0.3.0 -> 0.4.0-beta.1)
npm version prerelease --preid=beta  # Crée automatiquement le tag Git v0.4.0-beta.1

# Pusher le tag vers le repository
git push origin main --follow-tags
```

> ⚠️ **Important** : `npm version` crée automatiquement un tag Git correspondant à la version.
> N'oubliez pas de pusher le tag avec `git push --follow-tags`.

#### 3. Build et publication

```bash
# Build de la librairie
npm run build:lib

# Publication sur Nexus
npm publish --tag beta  # Pour version beta
npm publish             # Pour version stable
```

### Configuration Nexus

#### Fichier `.npmrc`

```bash
@gs:registry=https://nexus.grand-shooting.org/repository/npm-gs/
//nexus.grand-shooting.org/repository/npm-gs/:_auth=BASE64_ENCODED_AUTH
```

#### Génération du token d'authentification

```bash
# Encoder username:password en base64
echo -n "username:password" | base64
```

### Registries disponibles

- **npm-gs** : Repository hosted pour la publication
- **npm-group-gs** : Repository group pour la consommation (lecture seule)

### Stratégie de versioning

#### Versions stables
- Format : `X.Y.Z`
- Exemple : `1.0.0`, `1.1.0`, `1.1.1`
- Tag npm : `latest`

#### Versions beta
- Format : `X.Y.Z-beta.N`
- Exemple : `1.0.0-beta.1`, `1.0.0-beta.2`
- Tag npm : `beta`

#### Versions alpha/dev
- Format : `X.Y.Z-alpha.N`
- Exemple : `1.0.0-alpha.1`
- Tag npm : `alpha`

## 🔄 Workflow CI/CD complet

### Pipeline GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run lint
    - npm run test  # si des tests sont configurés
  only:
    - merge_requests
    - main

build-lib:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build:lib
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  only:
    - main

build-storybook:
  stage: build
  image: node:${NODE_VERSION}
  script:
    - npm ci
    - npm run build-storybook
  artifacts:
    paths:
      - storybook-static/
    expire_in: 1 hour
  only:
    - main

deploy-storybook:
  stage: deploy
  dependencies:
    - build-storybook
  script:
    - rsync -av storybook-static/ $STORYBOOK_SERVER:/var/www/storybook/
  only:
    - main

publish-npm:
  stage: deploy
  dependencies:
    - build-lib
  script:
    - echo "//nexus.grand-shooting.org/repository/npm-gs/:_auth=$NPM_AUTH" >> .npmrc
    - npm publish
  only:
    - tags
  when: manual
```

### Variables d'environnement

Dans GitLab CI/CD ou GitHub Actions, configurer :

- `NPM_AUTH` : Token d'authentification Nexus (base64)
- `STORYBOOK_SERVER` : Adresse du serveur Storybook

## 🚨 Rollback et gestion d'erreurs

### Rollback d'une version npm

```bash
# Deprecate une version problématique
npm deprecate @gs/gs-components-library@1.0.1 "Version avec bug critique"

# Ou unpublish (dans les 72h seulement)
npm unpublish @gs/gs-components-library@1.0.1
```

### Rollback Storybook

```bash
# Restaurer la version précédente
git checkout HEAD~1 -- storybook-static/
npm run build-storybook
# Redéployer
```

## 📊 Monitoring et métriques

### Métriques npm

- Nombre de téléchargements
- Versions utilisées
- Issues remontées

### Métriques Storybook

- Nombre de visites
- Pages les plus consultées
- Temps de chargement

## 🔒 Sécurité

### Audit des dépendances

```bash
# Audit de sécurité
npm audit

# Fix automatique
npm audit fix
```

### Gestion des secrets

- Ne jamais commiter les tokens d'authentification
- Utiliser les variables d'environnement CI/CD
- Rotation régulière des tokens

## 📋 Checklist de déploiement

### Avant publication

- [ ] Code review validée
- [ ] Tests passent
- [ ] Lint sans erreurs
- [ ] Documentation mise à jour
- [ ] Version incrémentée
- [ ] CHANGELOG.md mis à jour

### Après publication

- [ ] Vérifier la publication sur Nexus
- [ ] Tester l'installation dans un projet test
- [ ] Notifier l'équipe
- [ ] Mettre à jour la documentation projet

## 🆘 Résolution de problèmes

### Erreurs de publication courantes

**403 Forbidden**
```bash
# Vérifier l'authentification
npm whoami --registry=https://nexus.grand-shooting.org/repository/npm-gs/

# Vérifier les droits sur Nexus
```

**Version déjà publiée**
```bash
# Incrémenter la version
npm version patch
npm publish
```

**Build échoue**
```bash
# Nettoyer et réinstaller
rm -rf node_modules dist
npm install
npm run build:lib
```