#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fichiers à corriger
const files = [
  '../src/styles/figma-primitives.json',
  '../src/styles/figma-tokens.json'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);

  try {
    // Lire le fichier
    const content = fs.readFileSync(filePath, 'utf8');

    // Si le contenu commence par un guillemet, c'est une string JSON
    if (content.startsWith('"')) {
      // Enlever les guillemets externes et décoder les échappements
      const cleaned = JSON.parse(content);

      // Parser le JSON réel
      const data = JSON.parse(cleaned);

      // Réécrire le fichier proprement
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      console.log(`✅ Fixed: ${path.basename(filePath)}`);
    } else {
      console.log(`⏭️  Already fixed: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
  }
});

console.log('\n✨ JSON files fixed!');