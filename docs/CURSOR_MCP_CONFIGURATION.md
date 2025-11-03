# Configuration Cursor pour le serveur MCP Storybook

Ce guide explique comment configurer Cursor IDE pour utiliser le serveur MCP Storybook hébergé sur Fly.io.

## URL du serveur MCP

Le serveur MCP est accessible à l'URL suivante :

```
https://gs-components-library.grand-shooting.org/mcp
```

## Configuration dans Cursor

### Méthode 1 : Configuration au niveau du projet (Recommandée)

1. Créez le dossier `.cursor` à la racine de votre projet (s'il n'existe pas déjà)
2. Créez ou modifiez le fichier `.cursor/mcp.json` dans votre projet
3. Ajoutez la configuration suivante :

```json
{
  "mcpServers": {
    "storybook-gs-components": {
      "server": {
        "url": "https://gs-components-library.grand-shooting.org/mcp"
      }
    }
  }
}
```

**Note :** Un fichier `.cursor/mcp.json` est déjà présent dans ce projet avec cette configuration. Vous pouvez le copier dans d'autres projets si nécessaire.

### Méthode 2 : Configuration globale

Pour utiliser le serveur MCP dans tous vos projets Cursor :

1. Créez ou modifiez le fichier `~/.cursor/mcp.json` dans votre répertoire personnel
2. Ajoutez la même configuration que ci-dessus

### Méthode 3 : Configuration via l'interface Cursor

1. Ouvrez les paramètres de Cursor (`Cmd/Ctrl + ,`)
2. Recherchez "MCP" ou "Model Context Protocol"
3. Ajoutez un nouveau serveur MCP avec :
   - **Nom** : `storybook-gs-components`
   - **URL** : `https://gs-components-library.grand-shooting.org/mcp`
   - **Type** : HTTP

## Vérification de la connexion

Après avoir ajouté la configuration :

1. **Redémarrez Cursor** pour que la configuration soit prise en compte
2. Vérifiez dans les logs Cursor que le serveur MCP est connecté
3. Testez une commande qui utilise le serveur MCP (par exemple, demander des informations sur les composants Storybook)

### Vérification rapide

Vous pouvez vérifier que le serveur MCP fonctionne avant de le configurer dans Cursor :

```bash
# Depuis le projet story-gs-react
./scripts/check-mcp-server.sh

# Ou manuellement
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' \
  https://gs-components-library.grand-shooting.org/mcp
```

## Utilisation

Une fois configuré, Cursor pourra utiliser le serveur MCP pour :

- Accéder aux composants Storybook
- Obtenir des informations sur les stories disponibles
- Récupérer la documentation des composants
- Et autres fonctionnalités exposées par le serveur MCP Storybook

## Structure du fichier de configuration

Le fichier `.cursor/mcp.json` suit cette structure :

```json
{
  "mcpServers": {
    "nom-du-serveur": {
      "server": {
        "url": "https://url-du-serveur/mcp"
      }
    }
  }
}
```

Où :
- `nom-du-serveur` : Un identifiant unique pour votre serveur (ex: `storybook-gs-components`)
- `url` : L'URL complète du serveur MCP (doit se terminer par `/mcp`)

## Dépannage

### Le serveur ne se connecte pas

1. **Vérifiez que le serveur est accessible :**
   ```bash
   curl https://gs-components-library.grand-shooting.org/mcp
   ```

2. **Vérifiez les logs Fly.io :**
   ```bash
   fly logs -a storybook-gs-components | grep -i mcp
   ```

3. **Vérifiez la configuration dans Cursor :**
   - Assurez-vous que le fichier `mcp.json` est valide JSON
   - Vérifiez que l'URL est correcte et se termine par `/mcp`
   - Redémarrez Cursor après avoir modifié la configuration

### Erreur "Server not found"

- Vérifiez que le nom du serveur dans `mcp.json` correspond à celui utilisé dans Cursor
- Assurez-vous que le fichier de configuration est au bon endroit (`.cursor/mcp.json` dans le projet ou `~/.cursor/mcp.json` globalement)

### Le serveur répond mais Cursor ne le voit pas

- Redémarrez Cursor complètement
- Vérifiez que votre version de Cursor supporte les serveurs MCP HTTP
- Consultez les logs Cursor pour voir les erreurs de connexion

## Ressources

- Documentation Cursor MCP : https://docs.cursor.com/context/mcp
- Documentation Storybook MCP Addon : https://storybook.js.org/addons/@storybook/addon-mcp
- Script de vérification : `./scripts/check-mcp-server.sh`

