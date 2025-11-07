# Configuration Cursor pour le serveur MCP Storybook

Ce guide explique comment connecter Cursor IDE au serveur MCP (Model Context Protocol) hébergé sur Storybook.

## URL du serveur MCP

Le serveur MCP est accessible à l'URL suivante :

```
https://gs-components-library.grand-shooting.org/mcp
```

## Configuration dans Cursor

### Option 1 : Configuration via les paramètres Cursor

1. Ouvrez les paramètres de Cursor (Cmd/Ctrl + ,)
2. Recherchez "MCP" ou "Model Context Protocol"
3. Ajoutez une nouvelle configuration de serveur MCP avec les paramètres suivants :

```json
{
  "mcpServers": {
    "storybook-gs-components": {
      "url": "https://gs-components-library.grand-shooting.org/mcp",
      "transport": "http"
    }
  }
}
```

### Option 2 : Configuration via le fichier de configuration Cursor

Créez ou modifiez le fichier de configuration Cursor (généralement dans `~/.cursor/config.json` ou dans les paramètres de l'application) :

```json
{
  "mcpServers": {
    "storybook-gs-components": {
      "url": "https://gs-components-library.grand-shooting.org/mcp",
      "transport": "http",
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
}
```

### Option 3 : Configuration via les paramètres avancés

Si Cursor utilise une configuration similaire à Claude Desktop, vous pouvez ajouter dans les paramètres :

```json
{
  "mcpServers": {
    "storybook": {
      "command": "npx",
      "args": [
        "-y",
        "@storybook/addon-mcp"
      ],
      "env": {
        "STORYBOOK_URL": "https://gs-components-library.grand-shooting.org"
      }
    }
  }
}
```

## Vérification de la connexion

Pour vérifier que le serveur MCP fonctionne :

1. Ouvrez la console développeur de Cursor (si disponible)
2. Vérifiez les logs de connexion MCP
3. Testez une commande qui utilise le serveur MCP

## Endpoints disponibles

Le serveur MCP Storybook expose généralement les endpoints suivants :

- `/mcp` - Endpoint principal du serveur MCP
- `/mcp/health` - Endpoint de santé (si disponible)
- `/mcp/capabilities` - Informations sur les capacités du serveur

## Dépannage

### Le serveur ne répond pas

1. Vérifiez que Storybook est bien déployé et accessible :
   ```bash
   curl https://gs-components-library.grand-shooting.org
   ```

2. Vérifiez que le serveur MCP est accessible :
   ```bash
   curl https://gs-components-library.grand-shooting.org/mcp
   ```

3. Vérifiez les logs Fly.io :
   ```bash
   flyctl logs -a storybook-gs-components
   ```

### Erreur de connexion

- Assurez-vous que l'URL est correcte et que le serveur est accessible
- Vérifiez que Cursor supporte les serveurs MCP HTTP (certaines versions peuvent nécessiter une configuration différente)
- Consultez la documentation de Cursor pour les dernières instructions sur la configuration MCP

## Note importante

La configuration exacte peut varier selon la version de Cursor. Consultez la documentation officielle de Cursor pour les dernières instructions sur la configuration des serveurs MCP.

Si Cursor utilise une configuration similaire à Claude Desktop, vous devrez peut-être configurer le serveur MCP différemment. Dans ce cas, consultez la documentation de l'addon MCP Storybook : https://storybook.js.org/addons/@storybook/addon-mcp

