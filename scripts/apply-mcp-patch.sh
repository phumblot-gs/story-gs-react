#!/bin/bash
# Script pour appliquer le patch @tmcp/session-manager après npm install
# Ce patch ajoute l'export "require" pour la compatibilité CommonJS avec Storybook

PATCH_FILE="patches/@tmcp+session-manager+0.2.0.patch"
PACKAGE_JSON="node_modules/@tmcp/session-manager/package.json"

if [ ! -f "$PACKAGE_JSON" ]; then
  echo "Package @tmcp/session-manager not found, skipping patch"
  exit 0
fi

# Vérifier si le patch est déjà appliqué
if grep -q '"require": "./src/index.js"' "$PACKAGE_JSON"; then
  echo "✅ Patch already applied to @tmcp/session-manager"
  exit 0
fi

# Appliquer le patch manuellement
echo "Applying patch to @tmcp/session-manager..."
if [ -f "$PATCH_FILE" ]; then
  cd node_modules/@tmcp/session-manager && patch -p1 < "../../$PATCH_FILE" 2>/dev/null || {
    # Si le patch échoue, appliquer manuellement
    cd ../..
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('$PACKAGE_JSON', 'utf8'));
    if (pkg.exports && pkg.exports['.'] && !pkg.exports['.'].require) {
      pkg.exports['.'].require = './src/index.js';
      fs.writeFileSync('$PACKAGE_JSON', JSON.stringify(pkg, null, 2) + '\n');
      console.log('✅ Patch applied successfully');
    }
    "
  }
else
  # Appliquer le patch directement
  node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('$PACKAGE_JSON', 'utf8'));
  if (pkg.exports && pkg.exports['.'] && !pkg.exports['.'].require) {
    pkg.exports['.'].require = './src/index.js';
    fs.writeFileSync('$PACKAGE_JSON', JSON.stringify(pkg, null, 2) + '\n');
    console.log('✅ Patch applied successfully');
  }
  "
fi

echo "✅ Patch applied to @tmcp/session-manager"

