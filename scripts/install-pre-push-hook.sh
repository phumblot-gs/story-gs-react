#!/bin/sh

# Script d'installation du hook pre-push pour vérifier le build Storybook
# Usage: ./scripts/install-pre-push-hook.sh

HOOK_FILE=".git/hooks/pre-push"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "📦 Installation du hook pre-push pour Storybook..."

# Créer le dossier hooks s'il n'existe pas
mkdir -p "$PROJECT_ROOT/.git/hooks"

# Créer le hook pre-push
cat > "$PROJECT_ROOT/$HOOK_FILE" << 'EOF'
#!/bin/sh

# Git pre-push hook pour vérifier que le build Storybook fonctionne
# Ce hook empêche le push si le build échoue

echo "🔍 Vérification du build Storybook avant le push..."

# Exécuter le build Storybook
npm run build-storybook

# Vérifier le code de retour
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Le build Storybook a échoué !"
  echo "   Veuillez corriger les erreurs avant de pousser."
  echo ""
  echo "   Pour ignorer cette vérification (non recommandé) :"
  echo "   git push --no-verify"
  echo ""
  exit 1
fi

echo "✅ Build Storybook réussi !"
exit 0
EOF

# Rendre le hook exécutable
chmod +x "$PROJECT_ROOT/$HOOK_FILE"

echo "✅ Hook pre-push installé avec succès !"
echo ""
echo "Le hook vérifiera automatiquement que le build Storybook fonctionne"
echo "avant chaque push. Pour ignorer cette vérification :"
echo "  git push --no-verify"

