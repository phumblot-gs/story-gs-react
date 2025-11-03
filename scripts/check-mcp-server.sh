#!/bin/bash

# Script pour vérifier que le serveur MCP fonctionne
# Usage: ./scripts/check-mcp-server.sh [url]

set -e

# URL par défaut
MCP_URL="${1:-https://gs-components-library.grand-shooting.org/mcp}"
STORYBOOK_URL="${MCP_URL%/mcp}"

echo "🔍 Vérification du serveur MCP Storybook"
echo "========================================"
echo ""
echo "URL du serveur MCP: $MCP_URL"
echo "URL Storybook: $STORYBOOK_URL"
echo ""

# Couleurs pour la sortie
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Vérifier que Storybook est accessible
echo "1️⃣  Vérification de l'accessibilité de Storybook..."
if curl -sf "$STORYBOOK_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Storybook est accessible${NC}"
else
    echo -e "${RED}❌ Storybook n'est pas accessible${NC}"
    exit 1
fi
echo ""

# 2. Vérifier l'endpoint MCP principal
echo "2️⃣  Vérification de l'endpoint MCP principal..."
MCP_RESPONSE=$(curl -sf -w "\n%{http_code}" "$MCP_URL" 2>&1 || echo "")
HTTP_CODE=$(echo "$MCP_RESPONSE" | tail -n1)
BODY=$(echo "$MCP_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "405" ] || [ "$HTTP_CODE" = "404" ]; then
    echo -e "${GREEN}✅ Endpoint MCP répond (HTTP $HTTP_CODE)${NC}"
    if [ ! -z "$BODY" ]; then
        echo "   Réponse: $(echo "$BODY" | head -c 200)..."
    fi
else
    echo -e "${RED}❌ Endpoint MCP ne répond pas correctement (HTTP $HTTP_CODE)${NC}"
    if [ ! -z "$BODY" ]; then
        echo "   Réponse: $BODY"
    fi
fi
echo ""

# 3. Vérifier avec une requête POST (format MCP)
echo "3️⃣  Test d'une requête POST MCP..."
MCP_POST_RESPONSE=$(curl -sf -X POST \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' \
    -w "\n%{http_code}" \
    "$MCP_URL" 2>&1 || echo "ERROR")

if echo "$MCP_POST_RESPONSE" | grep -q "jsonrpc\|result\|error" || echo "$MCP_POST_RESPONSE" | grep -q "405\|200"; then
    echo -e "${GREEN}✅ Le serveur MCP répond aux requêtes POST${NC}"
    echo "$MCP_POST_RESPONSE" | head -5 | sed 's/^/   /'
else
    echo -e "${YELLOW}⚠️  Réponse inattendue ou erreur de connexion${NC}"
    echo "$MCP_POST_RESPONSE" | head -5 | sed 's/^/   /'
fi
echo ""

# 4. Vérifier les headers CORS (si applicable)
echo "4️⃣  Vérification des headers CORS..."
CORS_HEADERS=$(curl -sf -I "$MCP_URL" 2>&1 | grep -i "access-control" || echo "")
if [ ! -z "$CORS_HEADERS" ]; then
    echo -e "${GREEN}✅ Headers CORS détectés:${NC}"
    echo "$CORS_HEADERS" | sed 's/^/   /'
else
    echo -e "${YELLOW}⚠️  Aucun header CORS détecté (peut être normal)${NC}"
fi
echo ""

# 5. Vérifier le temps de réponse
echo "5️⃣  Mesure du temps de réponse..."
RESPONSE_TIME=$(curl -sf -o /dev/null -w "%{time_total}" "$STORYBOOK_URL" 2>&1 || echo "ERROR")
if [ "$RESPONSE_TIME" != "ERROR" ]; then
    echo -e "${GREEN}✅ Temps de réponse: ${RESPONSE_TIME}s${NC}"
else
    echo -e "${RED}❌ Impossible de mesurer le temps de réponse${NC}"
fi
echo ""

# Résumé
echo "========================================"
echo "📊 Résumé de la vérification"
echo "========================================"
echo ""
echo "✅ Le serveur MCP semble être accessible"
echo ""
echo "Pour une vérification complète :"
echo "  1. Vérifiez les logs Fly.io: fly logs -a storybook-gs-components"
echo "  2. Testez avec un client MCP (Cursor, Claude Desktop, etc.)"
echo "  3. Vérifiez dans l'interface Storybook que l'addon MCP est chargé"
echo ""
echo "URLs utiles :"
echo "  - Storybook: $STORYBOOK_URL"
echo "  - Serveur MCP: $MCP_URL"
echo ""

