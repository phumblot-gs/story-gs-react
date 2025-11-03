# Vérification du serveur MCP

Ce guide explique comment vérifier que le serveur MCP (Model Context Protocol) fonctionne correctement sur Storybook déployé sur Fly.io.

## URL du serveur MCP

Le serveur MCP est accessible à l'URL suivante :

```
https://gs-components-library.grand-shooting.org/mcp
```

## Méthodes de vérification

### 1. Script automatique (recommandé)

Utilisez le script de vérification inclus :

```bash
cd /Users/phf/story-gs-react
./scripts/check-mcp-server.sh
```

Ou avec une URL personnalisée :

```bash
./scripts/check-mcp-server.sh https://votre-url.fly.dev/mcp
```

### 2. Vérification manuelle avec curl

#### Test 1 : Vérifier que Storybook est accessible

```bash
curl -I https://gs-components-library.grand-shooting.org
```

Vous devriez recevoir une réponse `200 OK`.

#### Test 2 : Vérifier l'endpoint MCP

```bash
curl https://gs-components-library.grand-shooting.org/mcp
```

Le serveur devrait répondre (même avec une erreur 405 Method Not Allowed ou une réponse JSON est normal pour un endpoint qui attend des requêtes POST).

#### Test 3 : Test d'une requête MCP valide

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  https://gs-components-library.grand-shooting.org/mcp
```

Une réponse valide devrait contenir `jsonrpc`, `result`, ou `error` dans le JSON retourné.

#### Test 4 : Vérifier les capacités du serveur

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test-client","version":"1.0.0"}}}' \
  https://gs-components-library.grand-shooting.org/mcp | jq .
```

### 3. Vérification via les logs Fly.io

```bash
# Voir les logs en temps réel
fly logs -a storybook-gs-components

# Filtrer les logs MCP
fly logs -a storybook-gs-components | grep -i mcp

# Vérifier les dernières erreurs
fly logs -a storybook-gs-components | grep -i error
```

Dans les logs, vous devriez voir des messages indiquant que :
- Storybook a démarré correctement
- L'addon MCP est chargé
- Le serveur écoute sur le port 8080
- Les requêtes vers `/mcp` sont traitées

### 4. Vérification dans l'interface Storybook

1. Ouvrez Storybook dans votre navigateur : https://gs-components-library.grand-shooting.org
2. Ouvrez la console développeur (F12)
3. Vérifiez qu'il n'y a pas d'erreurs liées à MCP
4. Recherchez dans les logs de la console des messages comme :
   - `[MCP] Server initialized`
   - `[MCP] Listening on /mcp`
   - Messages d'erreur liés à MCP

### 5. Test avec un client MCP

#### Avec Claude Desktop

Configurez le serveur MCP dans `~/.config/claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "storybook": {
      "url": "https://gs-components-library.grand-shooting.org/mcp",
      "transport": "http"
    }
  }
}
```

Puis redémarrez Claude Desktop et vérifiez que le serveur apparaît dans la liste des serveurs MCP.

#### Avec Cursor

1. Ouvrez les paramètres de Cursor
2. Recherchez "MCP" ou "Model Context Protocol"
3. Ajoutez le serveur avec l'URL : `https://gs-components-library.grand-shooting.org/mcp`
4. Vérifiez que la connexion est établie dans les logs Cursor

## Signes que le serveur fonctionne correctement

✅ **Serveur fonctionnel :**
- Storybook est accessible
- L'endpoint `/mcp` répond (même avec 405 pour GET)
- Les requêtes POST vers `/mcp` retournent du JSON valide
- Les logs Fly.io ne montrent pas d'erreurs MCP
- Les clients MCP peuvent se connecter

❌ **Problèmes possibles :**
- Erreur `404 Not Found` sur `/mcp` → L'addon MCP n'est pas chargé
- Erreur `502 Bad Gateway` → Le serveur Storybook n'est pas démarré
- Timeout → Le serveur Fly.io est arrêté ou surchargé
- Erreurs dans les logs → Vérifiez la configuration de l'addon MCP

## Dépannage

### Le serveur ne répond pas

1. **Vérifier le statut Fly.io :**
   ```bash
   fly status -a storybook-gs-components
   ```

2. **Redémarrer le serveur :**
   ```bash
   fly restart -a storybook-gs-components
   ```

3. **Vérifier les logs pour les erreurs :**
   ```bash
   fly logs -a storybook-gs-components --limit 100
   ```

### L'addon MCP n'est pas chargé

1. Vérifiez que `@storybook/addon-mcp` est dans `package.json`
2. Vérifiez que l'addon est listé dans `.storybook/main.ts` :
   ```typescript
   addons: ["@storybook/addon-links", "@storybook/addon-docs", "@storybook/addon-mcp"]
   ```
3. Vérifiez que le build Storybook inclut l'addon (pas de build statique)

### Erreurs de connexion depuis un client

1. Vérifiez que l'URL est correcte (avec `/mcp` à la fin)
2. Vérifiez que le transport est `http` (pas `stdio`)
3. Vérifiez les logs Fly.io pour les erreurs CORS ou de requête
4. Testez avec curl d'abord pour isoler le problème

## Commandes utiles

```bash
# Vérification complète
./scripts/check-mcp-server.sh

# Voir les logs Fly.io
fly logs -a storybook-gs-components

# Redémarrer le serveur
fly restart -a storybook-gs-components

# Vérifier le statut
fly status -a storybook-gs-components

# Tester l'endpoint MCP directement
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  https://gs-components-library.grand-shooting.org/mcp
```

