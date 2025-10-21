#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Charger les tokens
const figmaData = require('../src/styles/figma-primitives.json');
const primitives = figmaData;
const tokens = figmaData;

/**
 * Convertit px en rem (base 16px)
 */
function pxToRem(px) {
  return `${(px / 16).toFixed(4).replace(/\.?0+$/, '')}rem`;
}

/**
 * Convertit les noms de tokens Figma en noms de variables CSS
 */
function tokenToCSSVar(tokenName) {
  // colorsBlack -> --color-black
  // textBase -> --font-size-base
  // fontBold -> --font-weight-bold
  // leadingNormal -> --font-lh-normal
  // paddingSmall -> --spacing-small
  // spacing1 -> --spacing-1
  // shadcnPrimary -> --primary
  // shadcnPrimaryW -> ignoré (géré séparément)

  let cssName = tokenName;

  // Gérer les différents préfixes
  if (tokenName.startsWith('colors')) {
    cssName = tokenName.replace(/^colors/, '');
    cssName = cssName.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssName = '--color' + cssName;
  } else if (tokenName.startsWith('text')) {
    // textXs -> --font-size-xs
    cssName = tokenName.replace(/^text/, '');
    cssName = cssName.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssName = '--font-size' + cssName;
  } else if (tokenName.startsWith('font') && !tokenName.includes('Ft')) {
    // fontBold -> --font-weight-bold
    cssName = tokenName.replace(/^font/, '');
    cssName = cssName.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssName = '--font-weight' + cssName;
  } else if (tokenName.startsWith('leading')) {
    // leadingNormal -> --font-lh-normal
    cssName = tokenName.replace(/^leading/, '');
    cssName = cssName.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssName = '--font-lh' + cssName;
  } else if (tokenName.startsWith('spacing')) {
    // spacing1 -> --spacing-1
    cssName = tokenName.replace(/^spacing/, '');
    cssName = cssName.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssName = '--spacing-' + cssName;
  } else if (tokenName.startsWith('radius')) {
    // radiusBase -> --border-radius-base
    cssName = tokenName.replace(/^radius/, '');
    cssName = cssName.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssName = '--border-radius' + cssName;
  } else if (tokenName.startsWith('border')) {
    // borderBase -> --border-width-base
    cssName = tokenName.replace(/^border/, '');
    cssName = cssName.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssName = '--border-width' + cssName;
  } else if (tokenName.startsWith('shadow')) {
    // shadowSm -> --box-shadow-sm
    cssName = tokenName.replace(/^shadow/, '');
    cssName = cssName.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssName = '--box-shadow' + cssName;
  } else if (tokenName.startsWith('opacity')) {
    // opacity50 -> --opacity-50
    cssName = tokenName.replace(/^opacity/, '');
    cssName = '--opacity-' + cssName;
  } else if (tokenName.startsWith('z')) {
    // z10 -> --z-index-10
    cssName = tokenName.replace(/^z/, '');
    cssName = '--z-index-' + cssName;
  } else if (tokenName.startsWith('shadcn') && !tokenName.match(/[WGB]$/)) {
    // shadcnPrimary -> --primary (base shadcn tokens)
    cssName = tokenName.replace(/^shadcn/, '');
    cssName = cssName.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssName = '--' + cssName.replace(/^-/, '');
  } else if (tokenName.startsWith('font')) {
    // Old format: fontFtSizeBase -> --font-size-base
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

  // Parcourir tous les tokens (sauf les tokens shadcn contextuels W/G/B)
  for (const [key, value] of Object.entries(tokens)) {
    // Ignorer les tokens shadcn contextuels (avec suffixes W, G, B)
    if (key.startsWith('shadcn') && key.match(/[WGB]$/)) {
      continue;
    }

    const cssVar = tokenToCSSVar(key);

    if (typeof value === 'string') {
      css += `  ${cssVar}: ${value};\n`;
    } else if (typeof value === 'number') {
      // Font weights: valeurs sans unité (300, 400, 500, 700, 900)
      if (key.startsWith('font') && !key.includes('Ft')) {
        css += `  ${cssVar}: ${value};\n`;
      }
      // Line heights: valeurs relatives sans unité (1, 1.25, 1.5, etc.)
      else if (key.startsWith('leading')) {
        css += `  ${cssVar}: ${value};\n`;
      }
      // Font sizes: conversion px -> rem
      else if (key.startsWith('text')) {
        css += `  ${cssVar}: ${pxToRem(value)};\n`;
      }
      // Spacing: conversion px -> rem
      else if (key.startsWith('spacing')) {
        css += `  ${cssVar}: ${pxToRem(value)};\n`;
      }
      // Border radius: conversion px -> rem
      else if (key.startsWith('radius') && value !== 9999) {
        css += `  ${cssVar}: ${pxToRem(value)};\n`;
      }
      // Border radius full
      else if (key.startsWith('radius') && value === 9999) {
        css += `  ${cssVar}: ${value}px;\n`;
      }
      // Border width: px
      else if (key.startsWith('border')) {
        css += `  ${cssVar}: ${value}px;\n`;
      }
      // Opacity: sans unité
      else if (key.startsWith('opacity')) {
        css += `  ${cssVar}: ${value};\n`;
      }
      // Z-index: sans unité
      else if (key.startsWith('z')) {
        css += `  ${cssVar}: ${value};\n`;
      }
      // Old format font-weight
      else if (key.includes('Weight')) {
        css += `  ${cssVar}: ${value};\n`;
      }
      // Old format line-height (valeurs < 10 = relatif)
      else if (key.includes('Lh') && value < 10) {
        css += `  ${cssVar}: ${value};\n`;
      }
      // Old format font sizes
      else if (key.includes('font') || key.includes('Font')) {
        css += `  ${cssVar}: ${pxToRem(value)};\n`;
      }
      // Spacing/padding -> conversion en rem
      else if (key.includes('padding') || key.includes('Padding')) {
        css += `  ${cssVar}: ${pxToRem(value)};\n`;
      }
      // Autres valeurs numériques
      else {
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
 * Génère les variables CSS contextuelles shadcn pour un fond spécifique
 */
function generateShadcnContextCSS(tokens, context) {
  const suffix = context === 'white' ? 'W' : context === 'grey' ? 'G' : 'B';
  let css = `[data-bg="${context}"] {\n`;

  // Extraire uniquement les tokens shadcn avec le bon suffixe
  for (const [key, value] of Object.entries(tokens)) {
    if (key.startsWith('shadcn') && key.endsWith(suffix)) {
      // shadcnPrimaryW -> --primary
      const baseName = key.replace(/^shadcn/, '').replace(new RegExp(suffix + '$'), '');
      const cssVar = '--' + baseName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');

      if (typeof value === 'string') {
        css += `  ${cssVar}: ${value};\n`;
      }
    }
  }

  css += `}\n`;
  return css;
}

/**
 * Génère les variables CSS Button pour :root
 */
function generateButtonTokensCSS(tokens) {
  let css = '';

  // Extraire tous les tokens button
  const buttonTokens = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (key.startsWith('button')) {
      buttonTokens[key] = value;
    }
  }

  // Générer les variables CSS
  for (const [key, value] of Object.entries(buttonTokens)) {
    // buttonWNormalBgDefault -> --button-w-normal-bg-default
    const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^--/, '--');

    if (typeof value === 'string') {
      css += `  ${cssVar}: ${value};\n`;
    } else if (value === null) {
      // Pour le variant link qui n'a pas de background
      css += `  ${cssVar}: transparent;\n`;
    }
  }

  return css;
}

/**
 * Génère les classes CSS Button contextuelles pour chaque variant
 */
function generateButtonClassesCSS(tokens) {
  const variants = ['normal', 'secondary', 'ghost', 'outline', 'destructive', 'link'];
  const backgrounds = [
    { name: 'white', prefix: 'W' },
    { name: 'grey', prefix: 'G' },
    { name: 'black', prefix: 'B' }
  ];
  const states = ['default', 'hover', 'pressed', 'disabled'];

  let css = '';

  for (const bg of backgrounds) {
    css += `\n/* Button variants pour background ${bg.name} */\n`;

    for (const variant of variants) {
      const capitalizedVariant = variant.charAt(0).toUpperCase() + variant.slice(1);

      css += `[data-bg="${bg.name}"] .btn-${variant} {\n`;

      // Background
      const bgToken = `button${bg.prefix}${capitalizedVariant}BgDefault`;
      if (tokens[bgToken] !== undefined) {
        if (tokens[bgToken] === null) {
          css += `  background: transparent;\n`;
        } else {
          css += `  background: var(--button-${bg.name.charAt(0)}-${variant}-bg-default);\n`;
        }
      }

      // Foreground
      const fgToken = `button${bg.prefix}${capitalizedVariant}FgDefault`;
      if (tokens[fgToken] !== undefined) {
        css += `  color: var(--button-${bg.name.charAt(0)}-${variant}-fg-default);\n`;
      }

      // Border pour outline
      if (variant === 'outline') {
        css += `  border: 1px solid var(--button-${bg.name.charAt(0)}-${variant}-fg-default);\n`;
      }

      // Underline pour link
      if (variant === 'link') {
        css += `  text-decoration: none;\n`;
      }

      css += `}\n\n`;

      // Hover
      const bgHoverToken = `button${bg.prefix}${capitalizedVariant}BgHover`;
      if (tokens[bgHoverToken] !== undefined) {
        css += `[data-bg="${bg.name}"] .btn-${variant}:hover:not(:disabled) {\n`;

        if (tokens[bgHoverToken] === null) {
          css += `  background: transparent;\n`;
        } else {
          css += `  background: var(--button-${bg.name.charAt(0)}-${variant}-bg-hover);\n`;
        }

        const fgHoverToken = `button${bg.prefix}${capitalizedVariant}FgHover`;
        if (tokens[fgHoverToken] !== undefined) {
          css += `  color: var(--button-${bg.name.charAt(0)}-${variant}-fg-hover);\n`;
        }

        if (variant === 'link') {
          css += `  text-decoration: underline;\n`;
        }

        css += `}\n\n`;
      }

      // Pressed (active)
      const bgPressedToken = `button${bg.prefix}${capitalizedVariant}BgPressed`;
      if (tokens[bgPressedToken] !== undefined) {
        css += `[data-bg="${bg.name}"] .btn-${variant}:active:not(:disabled) {\n`;

        if (tokens[bgPressedToken] === null) {
          css += `  background: transparent;\n`;
        } else {
          css += `  background: var(--button-${bg.name.charAt(0)}-${variant}-bg-pressed);\n`;
        }

        const fgPressedToken = `button${bg.prefix}${capitalizedVariant}FgPressed`;
        if (tokens[fgPressedToken] !== undefined) {
          css += `  color: var(--button-${bg.name.charAt(0)}-${variant}-fg-pressed);\n`;
        }

        css += `}\n\n`;
      }

      // Disabled
      const bgDisabledToken = `button${bg.prefix}${capitalizedVariant}BgDisabled`;
      if (tokens[bgDisabledToken] !== undefined) {
        css += `[data-bg="${bg.name}"] .btn-${variant}:disabled {\n`;

        if (tokens[bgDisabledToken] === null) {
          css += `  background: transparent;\n`;
        } else {
          css += `  background: var(--button-${bg.name.charAt(0)}-${variant}-bg-disabled);\n`;
        }

        const fgDisabledToken = `button${bg.prefix}${capitalizedVariant}FgDisabled`;
        if (tokens[fgDisabledToken] !== undefined) {
          css += `  color: var(--button-${bg.name.charAt(0)}-${variant}-fg-disabled);\n`;
        }

        css += `  cursor: not-allowed;\n`;
        css += `  opacity: 0.5;\n`;
        css += `}\n\n`;
      }
    }
  }

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
  css += generateThemeCSS('light', primitives.primitives.light, ':root');
  css += '\n';

  // Thème dark
  css += generateThemeCSS('dark', primitives.primitives.dark, '[data-theme="dark"]');
  css += '\n';

  // Variables Button tokens
  css += `/* Button tokens */\n`;
  css += ':root {\n';
  css += generateButtonTokensCSS(tokens.tokens.light);
  css += '}\n\n';

  // Variables contextuelles shadcn (fond white, grey, black)
  css += `/* Variables shadcn contextuelles par type de fond */\n`;
  css += generateShadcnContextCSS(tokens.tokens.light, 'white');
  css += '\n';
  css += generateShadcnContextCSS(tokens.tokens.light, 'grey');
  css += '\n';
  css += generateShadcnContextCSS(tokens.tokens.light, 'black');
  css += '\n';

  // Classes Button contextuelles
  css += `/* Classes Button contextuelles */\n`;
  css += generateButtonClassesCSS(tokens.tokens.light);

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

  const prims = primitives.primitives.light;

  // Extraire les couleurs
  for (const [key, value] of Object.entries(prims)) {
    if (key.startsWith('colors') && typeof value === 'string') {
      const name = key.replace('colors', '').replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
      const varName = tokenToCSSVar(key);
      config.colors[name] = `var(${varName})`;
    }
  }

  // Extraire les spacings (nouvelle convention spacing1, spacing2, etc.)
  for (const [key, value] of Object.entries(prims)) {
    if (key.startsWith('spacing') && typeof value === 'number') {
      const name = key.replace('spacing', '');
      config.spacing[name] = pxToRem(value);
    }
    // Old format padding pour rétrocompatibilité
    else if (key.startsWith('padding') && typeof value === 'number') {
      const name = key.replace('padding', '').replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
      config.spacing[name] = pxToRem(value);
    }
  }

  // Extraire les font sizes (conversion en rem)
  for (const [key, value] of Object.entries(prims)) {
    // New format: textXs, textSm, etc.
    if (key.startsWith('text') && typeof value === 'number') {
      const name = key.replace('text', '').replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
      config.fontSize[name] = pxToRem(value);
    }
    // Old format: fontFtSizeXs, fontFtSizeSm, etc.
    else if (key.startsWith('font') && key.includes('Size') && typeof value === 'number') {
      const name = key.replace('fontFtSize', '').toLowerCase();
      config.fontSize[name] = pxToRem(value);
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