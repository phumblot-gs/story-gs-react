# Vérification du serveur MCP

Ce guide explique comment vérifier que le serveur MCP (Model Context Protocol) fonctionne correctement sur le Storybook déployé sur AWS.

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
./scripts/check-mcp-server.sh https://gs-components-library.grand-shooting.org/mcp
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

> Le MCP est protégé par JumpCloud : sans jeton, `/mcp` répond `401` avec un en-tête
> `WWW-Authenticate` qui indique aux clients MCP comment s'authentifier. Un `401`
> signifie donc que le serveur répond correctement.

### 3. Vérification via les logs

```bash
# sur l'instance (aws ssm start-session, voir docs/aws-deployment.md)
cd /opt/gs-storybook && docker compose logs -f storybook

# Filtrer les logs MCP
docker compose logs storybook mcp-auth-proxy | grep -i mcp

# Vérifier les dernières erreurs
docker compose logs --since 1h | grep -i error
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
- Les logs ne montrent pas d'erreurs MCP
- Les clients MCP peuvent se connecter

❌ **Problèmes possibles :**
- Erreur `404 Not Found` sur `/mcp` → L'addon MCP n'est pas chargé
- Erreur `502 Bad Gateway` → Le serveur Storybook n'est pas démarré
- Timeout → L'instance EC2 est arrêtée ou surchargée
- Erreurs dans les logs → Vérifiez la configuration de l'addon MCP

## Dépannage

### Le serveur ne répond pas

Sur l'instance (`aws ssm start-session`, voir [aws-deployment.md](./aws-deployment.md)) :

1. **Vérifier l'état des conteneurs :**
   ```bash
   cd /opt/gs-storybook && docker compose ps
   ```

2. **Redémarrer le serveur :**
   ```bash
   docker compose restart storybook
   ```

3. **Vérifier les logs pour les erreurs :**
   ```bash
   docker compose logs --tail 100 storybook
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
3. Vérifiez les logs (`docker compose logs mcp-auth-proxy`) pour les erreurs d'authentification ou de requête
4. Testez avec curl d'abord pour isoler le problème

## Commandes utiles

```bash
# Vérification complète
./scripts/check-mcp-server.sh

# sur l'instance (aws ssm start-session, voir docs/aws-deployment.md)
cd /opt/gs-storybook && docker compose logs -f storybook

# Redémarrer le serveur
docker compose restart storybook

# Vérifier le statut
docker compose ps

# Tester l'endpoint MCP directement
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
  https://gs-components-library.grand-shooting.org/mcp
```

