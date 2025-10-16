const fs = require('fs');
const path = require('path');
const { gzipSync } = require('zlib');

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (e) {
    return 0;
  }
}

function getGzipSize(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return gzipSync(content).length;
  } catch (e) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

console.log('\n📊 Analyse de la taille des bundles\n');
console.log('═'.repeat(60));

const distPath = path.join(__dirname, 'dist');

if (!fs.existsSync(distPath)) {
  console.error('❌ Le dossier dist n\'existe pas. Exécutez d\'abord: npm run build:lib');
  process.exit(1);
}

// Analyser les principaux composants
const components = [
  { name: 'Index (bundle complet)', file: 'index.mjs' },
  { name: 'Button', file: 'components/button.mjs' },
  { name: 'FileBrowser', file: 'components/file-browser.mjs' },
  { name: 'Select', file: 'components/select.mjs' },
  { name: 'ThemeProvider', file: 'providers/theme.mjs' },
  { name: 'TranslationProvider', file: 'providers/translation.mjs' },
];

let totalSize = 0;
let totalGzip = 0;

components.forEach(({ name, file }) => {
  const filePath = path.join(distPath, file);
  const size = getFileSize(filePath);
  const gzipSize = getGzipSize(filePath);

  if (size > 0) {
    console.log(`\n📦 ${name}`);
    console.log(`   Fichier: ${file}`);
    console.log(`   Taille: ${formatBytes(size)}`);
    console.log(`   Gzip: ${formatBytes(gzipSize)}`);

    totalSize += size;
    totalGzip += gzipSize;
  }
});

console.log('\n' + '═'.repeat(60));
console.log('\n📈 Résumé:');
console.log(`   Taille totale: ${formatBytes(totalSize)}`);
console.log(`   Taille Gzip: ${formatBytes(totalGzip)}`);

// Calculer l'économie potentielle
const indexSize = getFileSize(path.join(distPath, 'index.mjs'));
const buttonSize = getFileSize(path.join(distPath, 'components/button.mjs'));
const selectSize = getFileSize(path.join(distPath, 'components/select.mjs'));
const modularSize = buttonSize + selectSize;

if (indexSize > 0 && modularSize > 0) {
  const savings = Math.round(((indexSize - modularSize) / indexSize) * 100);
  console.log('\n💡 Économie avec imports modulaires:');
  console.log(`   Import monolithique: ${formatBytes(indexSize)}`);
  console.log(`   Import Button + Select: ${formatBytes(modularSize)}`);
  console.log(`   Économie: ${savings}% (${formatBytes(indexSize - modularSize)})`);
}

console.log('\n✅ Analyse terminée\n');