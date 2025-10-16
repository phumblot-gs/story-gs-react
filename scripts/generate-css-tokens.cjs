#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Charger les tokens
const primitives = require('../src/styles/figma-primitives.json');
const tokens = require('../src/styles/figma-tokens.json');

/**
 * Convertit les noms de tokens Figma en noms de variables CSS
 */
function tokenToCSSVar(tokenName) {
  // colorsBlack -> --colors-black
  // fontFtSizeBase -> --font-size-base
  // paddingSmall -> --spacing-small

  let cssName = tokenName;

  // Gérer les différents préfixes
  if (tokenName.startsWith('colors')) {
    cssName = tokenName.replace(/^colors/, '');
    // Convertir camelCase en kebab-case
    cssName = cssName.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssName = '--color' + cssName;
  } else if (tokenName.startsWith('font')) {
    cssName = tokenName.replace(/^font/, '');
    cssName = cssName.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssName = '--font' + cssName;
    cssName = cssName.replace('-ft-', '-');
  } else if (tokenName.startsWith('padding')) {
    cssName = tokenName.replace(/^padding/, '');
    cssName = cssName.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssName = '--spacing' + cssName;
  } else {
    cssName = '--' + tokenName.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  // Nettoyer les doubles tirets et les tirets en début
  cssName = cssName.replace(/--+/g, '--');

  return cssName;
}

/**
 * Génère le CSS pour un thème
 */
function generateThemeCSS(theme, tokens, selector) {
  let css = `${selector} {\n`;

  // Parcourir tous les tokens
  for (const [key, value] of Object.entries(tokens)) {
    const cssVar = tokenToCSSVar(key);

    if (typeof value === 'string') {
      css += `  ${cssVar}: ${value};\n`;
    } else if (typeof value === 'number') {
      // Pour les tailles de font et spacing
      if (key.includes('font') || key.includes('Font')) {
        css += `  ${cssVar}: ${value}px;\n`;
      } else if (key.includes('padding') || key.includes('Padding')) {
        css += `  ${cssVar}: ${value}px;\n`;
      } else {
        css += `  ${cssVar}: ${value};\n`;
      }
    }
  }

  // Ajouter des alias pour la compatibilité avec les composants existants
  css += `\n  /* Alias pour compatibilité */\n`;
  css += `  --bg-white: var(--color-white);\n`;
  css += `  --bg-black: var(--color-black);\n`;
  css += `  --bg-grey: var(--color-grey);\n`;
  css += `  --bg-grey-lighter: var(--color-grey-lighter);\n`;
  css += `  --bg-grey-strongest: var(--color-grey-strongest);\n`;
  css += `  --text-grey-stronger: var(--color-grey-stronger);\n`;
  css += `  --text-black: var(--color-black);\n`;
  css += `  --text-white: var(--color-white);\n`;
  css += `  --text-blue-primary: var(--color-blue-primary);\n`;
  css += `  --text-blue: var(--color-blue);\n`;

  // Status colors
  css += `\n  /* Status colors */\n`;
  css += `  --status-ignored-color: var(--color-grey-stronger);\n`;
  css += `  --status-reshoot-color: var(--color-orange);\n`;
  css += `  --status-not-selected-color: var(--color-grey);\n`;
  css += `  --status-selected-color: var(--color-green);\n`;
  css += `  --status-refused-color: var(--color-red-strong);\n`;
  css += `  --status-for-approval-color: var(--color-yellow);\n`;
  css += `  --status-validated-color: var(--color-green-primary);\n`;
  css += `  --status-to-publish-color: var(--color-pastel-blue);\n`;
  css += `  --status-error-color: var(--color-red-strong);\n`;
  css += `  --status-published-color: var(--color-blue);\n`;

  css += `}\n`;

  return css;
}

/**
 * Génère le fichier CSS complet
 */
function generateCSS() {
  let css = `/**
 * Variables CSS générées automatiquement depuis les tokens Figma
 * NE PAS MODIFIER DIRECTEMENT - Généré par scripts/generate-css-tokens.cjs
 * Date: ${new Date().toISOString()}
 */

`;

  // Thème light (par défaut)
  css += generateThemeCSS('light', primitives.light, ':root');
  css += '\n';

  // Thème dark
  css += generateThemeCSS('dark', primitives.dark, '[data-theme="dark"]');
  css += '\n';

  // Classes pour les thèmes
  css += `/* Classes de thème */\n`;
  css += `.theme-light {\n`;
  css += `  color-scheme: light;\n`;
  css += `}\n\n`;
  css += `.theme-dark {\n`;
  css += `  color-scheme: dark;\n`;
  css += `}\n`;

  return css;
}

/**
 * Génère la configuration Tailwind
 */
function generateTailwindConfig() {
  const config = {
    colors: {},
    spacing: {},
    fontSize: {},
  };

  // Extraire les couleurs
  for (const [key, value] of Object.entries(primitives.light)) {
    if (key.startsWith('colors') && typeof value === 'string') {
      const name = key.replace('colors', '').replace(/([A-Z])/g, '-$1').toLowerCase();
      const varName = tokenToCSSVar(key);
      config.colors[name] = `var(${varName})`;
    }
  }

  // Extraire les spacings
  for (const [key, value] of Object.entries(primitives.light)) {
    if (key.startsWith('padding') && typeof value === 'number') {
      const name = key.replace('padding', '').replace(/([A-Z])/g, '-$1').toLowerCase();
      config.spacing[name] = `${value}px`;
    }
  }

  // Extraire les font sizes
  for (const [key, value] of Object.entries(primitives.light)) {
    if (key.startsWith('font') && key.includes('Size') && typeof value === 'number') {
      const name = key.replace('fontFtSize', '').toLowerCase();
      config.fontSize[name] = `${value}px`;
    }
  }

  return config;
}

// Générer le CSS
const cssContent = generateCSS();
const cssPath = path.join(__dirname, '../src/styles/figma-tokens.css');
fs.writeFileSync(cssPath, cssContent);
console.log(`✅ CSS tokens generated: ${cssPath}`);

// Générer la config Tailwind
const tailwindConfig = generateTailwindConfig();
const tailwindPath = path.join(__dirname, '../src/styles/tailwind-tokens.json');
fs.writeFileSync(tailwindPath, JSON.stringify(tailwindConfig, null, 2));
console.log(`✅ Tailwind config generated: ${tailwindPath}`);

console.log('\n✨ Token generation complete!');