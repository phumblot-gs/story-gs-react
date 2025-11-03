# Déploiement Storybook sur Fly.io

Ce guide explique comment déployer Storybook avec le serveur MCP sur Fly.io.

## Prérequis

1. Installer Fly CLI : https://fly.io/docs/hands-on/install-flyctl/
2. Se connecter à Fly.io : `fly auth login`
3. Créer une application Fly.io : `fly launch` (ou utiliser le nom dans `fly.toml`)

## Configuration

Les fichiers suivants sont configurés pour Fly.io :

- `fly.toml` : Configuration Fly.io
- `Procfile` : Commande de démarrage pour Storybook en mode serveur
- `.dockerignore` : Fichiers à exclure du build

## Déploiement

### Première fois

```bash
# Créer l'application Fly.io (si pas déjà fait)
fly launch

# Déployer
fly deploy
```

### Déploiements suivants

```bash
fly deploy
```

## Configuration du serveur MCP

Une fois déployé, le serveur MCP sera accessible à :

```
https://gs-components-library.grand-shooting.org/mcp
```

**Note :** L'application est déployée sur Fly.io mais accessible via le domaine `gs-components-library.grand-shooting.org`.

### Configuration pour les agents

Pour configurer un agent (comme Claude Code) avec le serveur MCP :

```bash
claude mcp add storybook-mcp --transport http https://votre-app.fly.dev/mcp --scope project
```

## Variables d'environnement

Si nécessaire, configurez des variables d'environnement :

```bash
fly secrets set NODE_ENV=production
```

## Monitoring

Vérifier les logs :

```bash
fly logs
```

Vérifier le statut :

```bash
fly status
```

## Notes importantes

- Storybook tourne en mode développement (`storybook dev`) pour exposer le serveur MCP
- Le serveur écoute sur le port 8080 (configuré dans `fly.toml`)
- Le serveur MCP est accessible à l'endpoint `/mcp`
- L'application reste active en permanence (auto_start_machines = true)

