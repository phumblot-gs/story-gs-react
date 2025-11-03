# Guide de migration Netlify → Fly.io

## Résumé des changements

### ✅ Ce qui a été fait :

1. **Workflow GitHub Actions créé** : `.github/workflows/deploy-fly.yml`
   - Se déclenche sur push vers la branche `latest`
   - Build Storybook
   - Déploie sur Fly.io

2. **Configuration Fly.io mise à jour** : `fly.toml`
   - Builder Node.js configuré
   - Port 8080 configuré
   - Health checks configurés

3. **Procfile** : Déjà en place pour démarrer Storybook en mode serveur

## 📋 Étapes à suivre (dans l'ordre)

### Étape 1 : Installer Fly.io CLI (si pas déjà fait)

```bash
curl -L https://fly.io/install.sh | sh
```

### Étape 2 : Se connecter à Fly.io

```bash
flyctl auth login
```

### Étape 3 : Créer l'application Fly.io (si première fois)

```bash
flyctl apps create storybook-gs-components
```

Si l'application existe déjà, vous pouvez la voir avec :
```bash
flyctl apps list
```

### Étape 4 : Obtenir le token API Fly.io

```bash
flyctl auth token
```

Copiez le token affiché.

### Étape 5 : Configurer le secret GitHub

1. Aller sur : https://github.com/phumblot-gs/story-gs-react/settings/secrets/actions
2. Cliquer sur **"New repository secret"**
3. Nom : `FLY_API_TOKEN`
4. Valeur : Coller le token obtenu à l'étape 4
5. Cliquer sur **"Add secret"**

### Étape 6 : Configurer le domaine personnalisé (optionnel)

Si vous voulez utiliser `gs-components-library.grand-shooting.org` :

```bash
flyctl certs add gs-components-library.grand-shooting.org
```

Suivez les instructions pour configurer les DNS.

### Étape 7 : Test du déploiement manuel (recommandé)

Avant de laisser le CI/CD faire le travail, testez une fois manuellement :

```bash
# Build local
npm run build-storybook

# Déployer sur Fly.io
flyctl deploy
```

### Étape 8 : Vérifier le déploiement

```bash
# Voir les logs
flyctl logs

# Voir l'état de l'application
flyctl status

# Ouvrir l'application dans le navigateur
flyctl open
```

### Étape 9 : Activer le CI/CD

Une fois que tout fonctionne manuellement, vous pouvez activer le CI/CD :

1. Commiter les fichiers :
   ```bash
   git add .github/workflows/deploy-fly.yml fly.toml Procfile
   git commit -m "feat: Migration du déploiement de Netlify vers Fly.io"
   ```

2. Pousser sur la branche `latest` :
   ```bash
   git checkout latest
   git merge main  # ou la branche avec vos changements
   git push origin latest
   ```

3. Vérifier le workflow GitHub Actions :
   - Aller sur : https://github.com/phumblot-gs/story-gs-react/actions
   - Vous devriez voir le workflow "Deploy Storybook to Fly.io" se lancer

## 🔍 Vérifications

### Vérifier que Storybook fonctionne

Une fois déployé, vérifiez :
- L'interface Storybook : `https://storybook-gs-components.fly.dev/`
- Le serveur MCP : `https://storybook-gs-components.fly.dev/mcp`

### Vérifier les logs en cas de problème

```bash
flyctl logs
```

### Redémarrer l'application si nécessaire

```bash
flyctl restart
```

## 🚨 Dépannage

### L'application ne démarre pas

```bash
# Voir les logs
flyctl logs

# Vérifier la configuration
flyctl config show
```

### Le port n'est pas accessible

Vérifiez que `PORT=8080` est bien défini dans `fly.toml` et que le `Procfile` utilise ce port.

### Les dépendances ne s'installent pas

Vérifiez que `package.json` contient bien toutes les dépendances nécessaires et que `postinstall` fonctionne.

## 📝 Notes importantes

- **Netlify** : Le déploiement Netlify continuera de fonctionner tant que vous n'avez pas désactivé l'intégration dans Netlify
- **Fly.io** : L'application tourne en continu (pas de build statique), ce qui permet au serveur MCP de fonctionner
- **Coûts** : Fly.io facture par machine/heure. Avec `min_machines_running = 1`, il y aura toujours une machine active

## 🔄 Désactiver Netlify (quand tout fonctionne)

Une fois que vous êtes sûr que Fly.io fonctionne bien :

1. Aller sur Netlify Dashboard
2. Sélectionner le projet `gs-components-library.grand-shooting.org`
3. Aller dans les paramètres
4. Désactiver les builds automatiques ou supprimer le projet

