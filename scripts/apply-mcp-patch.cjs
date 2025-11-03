// Script pour appliquer le patch @tmcp/session-manager après npm install
// Ce patch ajoute l'export "require" pour la compatibilité CommonJS avec Storybook

const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

const packageJsonPath = join(process.cwd(), 'node_modules/@tmcp/session-manager/package.json');

try {
  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  
  if (pkg.exports && pkg.exports['.'] && !pkg.exports['.'].require) {
    pkg.exports['.'].require = './src/index.js';
    writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log('✅ Patch applied successfully to @tmcp/session-manager');
  } else {
    console.log('✅ Patch already applied to @tmcp/session-manager');
  }
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('⚠️  Package @tmcp/session-manager not found, skipping patch');
  } else {
    console.error('❌ Error applying patch:', error.message);
    process.exit(1);
  }
}

