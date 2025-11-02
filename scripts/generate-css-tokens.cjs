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

      css += `[data-bg="${bg.name}"].btn-${variant} {\n`;

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
        css += `[data-bg="${bg.name}"].btn-${variant}:hover:not(:disabled) {\n`;

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
        css += `[data-bg="${bg.name}"].btn-${variant}:active:not(:disabled) {\n`;

        if (tokens[bgPressedToken] === null) {
          css += `  background: transparent;\n`;
        } else {
          css += `  background: var(--button-${bg.name.charAt(0)}-${variant}-bg-pressed);\n`;
        }

        const fgPressedToken = `button${bg.prefix}${capitalizedVariant}FgPressed`;
        if (tokens[fgPressedToken] !== undefined) {
          css += `  color: var(--button-${bg.name.charAt(0)}-${variant}-fg-pressed);\n`;
        }

        if (variant === 'link') {
          css += `  text-decoration: underline;\n`;
        }

        css += `}\n\n`;
      }

      // Disabled
      const bgDisabledToken = `button${bg.prefix}${capitalizedVariant}BgDisabled`;
      if (tokens[bgDisabledToken] !== undefined) {
        css += `[data-bg="${bg.name}"].btn-${variant}:disabled {\n`;

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
 * Génère les styles personnalisés pour les composants (Checkbox, RadioGroup, Switch, Grade, Tags, Label, etc.)
 * Ces styles sont ajoutés après la génération automatique pour éviter qu'ils soient écrasés
 */
function generateComponentStyles() {
  return `
/* Checkbox styles pour adaptation selon background */
[data-bg="white"].checkbox-default {
  background-color: var(--color-grey-lighter);
  border-color: var(--color-grey-lighter);
}

[data-bg="white"].checkbox-default[data-state="checked"] {
  background-color: var(--color-black);
  color: var(--color-white);
  border-color: var(--color-black);
}

[data-bg="white"].checkbox-default[data-state="indeterminate"] {
  background-color: var(--color-black);
  color: var(--color-white);
  border-color: var(--color-black);
}

[data-bg="grey"].checkbox-default {
  background-color: var(--color-white);
  border-color: var(--color-white);
}

[data-bg="grey"].checkbox-default[data-state="checked"] {
  background-color: var(--color-black);
  color: var(--color-white);
  border-color: var(--color-black);
}

[data-bg="grey"].checkbox-default[data-state="indeterminate"] {
  background-color: var(--color-black);
  color: var(--color-white);
  border-color: var(--color-black);
}

[data-bg="black"].checkbox-default {
  background-color: var(--color-black-secondary);
  border-color: var(--color-black-secondary);
}

[data-bg="black"].checkbox-default[data-state="checked"] {
  background-color: var(--color-white);
  color: var(--color-black);
  border-color: var(--color-white);
}

[data-bg="black"].checkbox-default[data-state="indeterminate"] {
  background-color: var(--color-white);
  color: var(--color-black);
  border-color: var(--color-white);
}

/* Label styles pour adaptation selon background */
[data-bg="white"].label-default {
  color: #292828; /* text-black */
}

[data-bg="grey"].label-default {
  color: #292828; /* text-black */
}

[data-bg="black"].label-default {
  color: #ffffff; /* text-white */
}

/* RadioGroupItem styles pour adaptation selon background */
[data-bg="white"].radio-group-item-default {
  background-color: var(--color-grey-lighter);
}

[data-bg="white"].radio-group-item-default > span > svg {
  fill: var(--color-black);
  color: var(--color-black);
}

[data-bg="white"].radio-group-item-default[data-state="checked"] {
  background-color: var(--color-black);
  color: var(--color-white);
}

[data-bg="white"].radio-group-item-default[data-state="checked"] > span > svg {
  fill: var(--color-white);
  color: var(--color-white);
}

[data-bg="grey"].radio-group-item-default {
  background-color: var(--color-white);
}

[data-bg="grey"].radio-group-item-default > span > svg {
  fill: var(--color-black);
  color: var(--color-black);
}

[data-bg="grey"].radio-group-item-default[data-state="checked"] {
  background-color: var(--color-black);
  color: var(--color-white);
}

[data-bg="grey"].radio-group-item-default[data-state="checked"] > span > svg {
  fill: var(--color-white);
  color: var(--color-white);
}

[data-bg="black"].radio-group-item-default {
  background-color: var(--color-black-secondary);
}

[data-bg="black"].radio-group-item-default > span > svg {
  fill: var(--color-white);
  color: var(--color-white);
}

[data-bg="black"].radio-group-item-default[data-state="checked"] {
  background-color: var(--color-white);
  color: var(--color-black);
}

[data-bg="black"].radio-group-item-default[data-state="checked"] > span > svg {
  fill: var(--color-black);
  color: var(--color-black);
}

/* ButtonToggle/Switch styles pour adaptation selon background */
/* Container styles */
[data-bg="white"].button-toggle-default[data-state="on"]:not(:disabled) {
  background-color: #292828; /* black */
}

[data-bg="white"].button-toggle-default[data-state="off"]:not(:disabled) {
  background-color: #f3f3f3; /* grey-lighter */
}

[data-bg="grey"].button-toggle-default[data-state="on"]:not(:disabled) {
  background-color: #292828; /* black */
}

[data-bg="grey"].button-toggle-default[data-state="off"]:not(:disabled) {
  background-color: #ffffff; /* white */
}

[data-bg="black"].button-toggle-default[data-state="on"]:not(:disabled) {
  background-color: #ffffff; /* white */
}

[data-bg="black"].button-toggle-default[data-state="off"]:not(:disabled) {
  background-color: #3a3a3a; /* black-secondary */
}

/* Disabled container styles */
[data-bg="white"].button-toggle-default[data-state="on"]:disabled,
[data-bg="grey"].button-toggle-default[data-state="on"]:disabled {
  background-color: #c1c1c1; /* grey-stronger */
}

[data-bg="white"].button-toggle-default[data-state="off"]:disabled {
  background-color: #f3f3f3; /* grey-lighter */
}

[data-bg="grey"].button-toggle-default[data-state="off"]:disabled {
  background-color: #ffffff; /* white */
}

[data-bg="black"].button-toggle-default[data-state="on"]:disabled {
  background-color: #ffffff; /* white */
}

[data-bg="black"].button-toggle-default[data-state="off"]:disabled {
  background-color: #3a3a3a; /* black-secondary */
}

/* Pill styles */
[data-bg="white"].button-toggle-default[data-state="on"]:not(:disabled) .button-toggle-pill,
[data-bg="grey"].button-toggle-default[data-state="on"]:not(:disabled) .button-toggle-pill {
  background-color: #ffffff; /* white */
}

[data-bg="black"].button-toggle-default[data-state="on"]:not(:disabled) .button-toggle-pill {
  background-color: #292828; /* black */
}

[data-bg="white"].button-toggle-default[data-state="off"]:not(:disabled) .button-toggle-pill,
[data-bg="grey"].button-toggle-default[data-state="off"]:not(:disabled) .button-toggle-pill,
[data-bg="black"].button-toggle-default[data-state="off"]:not(:disabled) .button-toggle-pill {
  background-color: #292828; /* black */
}

.button-toggle-default:disabled .button-toggle-pill {
  background-color: #c1c1c1; /* grey-stronger */
}

/* Text styles */
[data-bg="white"].button-toggle-default[data-state="on"]:not(:disabled) .button-toggle-text,
[data-bg="grey"].button-toggle-default[data-state="on"]:not(:disabled) .button-toggle-text {
  color: #ffffff; /* white */
}

[data-bg="black"].button-toggle-default[data-state="on"]:not(:disabled) .button-toggle-text {
  color: #292828; /* black */
}

[data-bg="white"].button-toggle-default[data-state="off"]:not(:disabled) .button-toggle-text,
[data-bg="grey"].button-toggle-default[data-state="off"]:not(:disabled) .button-toggle-text {
  color: #292828; /* black */
}

[data-bg="black"].button-toggle-default[data-state="off"]:not(:disabled) .button-toggle-text {
  color: #ffffff; /* white */
}

.button-toggle-default:disabled .button-toggle-text {
  color: #c1c1c1; /* grey-stronger */
}

/* Base pill styles */
.button-toggle-pill {
  width: 14px;
  height: 14px;
  border-radius: 7px;
  flex-shrink: 0;
  transition: all 0.2s;
}

/* Grade Component Styles */
/* Variables CSS pour Grade - basées sur les tokens Figma */
:root {
  /* Grade colors (from Figma tokens) */
  --grade-bg-A: #89cc52;
  --grade-bg-B: #74d4da;
  --grade-bg-C: #ffd331;
  --grade-bg-D: #dd3733;
  --grade-bg-E: #595959;
  --grade-fg-A: #ffffff;
  --grade-fg-B: #ffffff;
  --grade-fg-C: #ffffff;
  --grade-fg-D: #ffffff;
  --grade-fg-E: #ffffff;
}

/* Grade styles */
.grade {
  /* Taille minimale pour contenir le texte */
  min-width: 14px;
  min-height: 14px;
  padding: 1px 3px;
}

/* Grades individuels avec leurs couleurs */
.grade-a {
  background: var(--grade-bg-A);
  color: var(--grade-fg-A);
}

.grade-b {
  background: var(--grade-bg-B);
  color: var(--grade-fg-B);
}

.grade-c {
  background: var(--grade-bg-C);
  color: var(--grade-fg-C);
}

.grade-d {
  background: var(--grade-bg-D);
  color: var(--grade-fg-D);
}

.grade-e {
  background: var(--grade-bg-E);
  color: var(--grade-fg-E);
}

/* TagGrade Component Styles */
/* Variables CSS pour TagGrade - basées sur les tokens Figma (même logique que TagText) */
:root {
  /* TagGrade - White background */
  --tag-grade-w-bg-default: #f3f3f3;
  --tag-grade-w-fg-default: #292828;
  --tag-grade-w-bg-hover: #292828;
  --tag-grade-w-fg-hover: #ffffff;
  --tag-grade-w-bg-pressed: #292828;
  --tag-grade-w-fg-pressed: #cdedff;
  --tag-grade-w-bg-disabled: #f3f3f3;
  --tag-grade-w-fg-disabled: #292828;
  
  /* TagGrade - Grey background */
  --tag-grade-g-bg-default: #ffffff;
  --tag-grade-g-fg-default: #292828;
  --tag-grade-g-bg-hover: #292828;
  --tag-grade-g-fg-hover: #ffffff;
  --tag-grade-g-bg-pressed: #292828;
  --tag-grade-g-fg-pressed: #cdedff;
  --tag-grade-g-bg-disabled: #ffffff;
  --tag-grade-g-fg-disabled: #292828;
  
  /* TagGrade - Black background */
  --tag-grade-b-bg-default: #3a3a3a;
  --tag-grade-b-fg-default: #ffffff;
  --tag-grade-b-bg-hover: #ffffff;
  --tag-grade-b-fg-hover: #292828;
  --tag-grade-b-bg-pressed: #3a3a3a;
  --tag-grade-b-fg-pressed: #cdedff;
  --tag-grade-b-bg-disabled: #ffffff;
  --tag-grade-b-fg-disabled: #292828;
}

/* TagGrade styles */
[data-bg="white"] .tag-grade {
  background: var(--tag-grade-w-bg-default);
  color: var(--tag-grade-w-fg-default);
}

[data-bg="white"] .tag-grade:hover:not(.tag-grade-disabled) {
  background: var(--tag-grade-w-bg-hover);
  color: var(--tag-grade-w-fg-hover);
}

[data-bg="white"] .tag-grade:active:not(.tag-grade-disabled) {
  background: var(--tag-grade-w-bg-pressed);
  color: var(--tag-grade-w-fg-pressed);
}

[data-bg="white"] .tag-grade.tag-grade-disabled {
  background: var(--tag-grade-w-bg-disabled);
  color: var(--tag-grade-w-fg-disabled);
  opacity: 0.5;
  cursor: not-allowed;
}

[data-bg="grey"] .tag-grade {
  background: var(--tag-grade-g-bg-default);
  color: var(--tag-grade-g-fg-default);
}

[data-bg="grey"] .tag-grade:hover:not(.tag-grade-disabled) {
  background: var(--tag-grade-g-bg-hover);
  color: var(--tag-grade-g-fg-hover);
}

[data-bg="grey"] .tag-grade:active:not(.tag-grade-disabled) {
  background: var(--tag-grade-g-bg-pressed);
  color: var(--tag-grade-g-fg-pressed);
}

[data-bg="grey"] .tag-grade.tag-grade-disabled {
  background: var(--tag-grade-g-bg-disabled);
  color: var(--tag-grade-g-fg-disabled);
  opacity: 0.5;
  cursor: not-allowed;
}

[data-bg="black"] .tag-grade {
  background: var(--tag-grade-b-bg-default);
  color: var(--tag-grade-b-fg-default);
}

[data-bg="black"] .tag-grade:hover:not(.tag-grade-disabled) {
  background: var(--tag-grade-b-bg-hover);
  color: var(--tag-grade-b-fg-hover);
}

[data-bg="black"] .tag-grade:active:not(.tag-grade-disabled) {
  background: var(--tag-grade-b-bg-pressed);
  color: var(--tag-grade-b-fg-pressed);
}

[data-bg="black"] .tag-grade.tag-grade-disabled {
  background: var(--tag-grade-b-bg-disabled);
  color: var(--tag-grade-b-fg-disabled);
  opacity: 0.5;
  cursor: not-allowed;
}

/* TagCross dans TagGrade - mêmes styles que TagText */
[data-bg="white"] .tag-grade:hover .tag-cross:not(:disabled) {
  color: var(--tag-cross-w-fg-hover);
}

[data-bg="white"] .tag-grade:active .tag-cross:not(:disabled) {
  color: var(--tag-cross-w-fg-pressed);
}

[data-bg="white"] .tag-grade-disabled .tag-cross {
  color: var(--tag-cross-w-fg-disabled);
  cursor: not-allowed;
}

[data-bg="grey"] .tag-grade:hover .tag-cross:not(:disabled) {
  color: var(--tag-cross-g-fg-hover);
}

[data-bg="grey"] .tag-grade:active .tag-cross:not(:disabled) {
  color: var(--tag-cross-g-fg-pressed);
}

[data-bg="grey"] .tag-grade-disabled .tag-cross {
  color: var(--tag-cross-g-fg-disabled);
  cursor: not-allowed;
}

[data-bg="black"] .tag-grade:hover .tag-cross:not(:disabled) {
  color: var(--tag-cross-b-fg-hover);
}

[data-bg="black"] .tag-grade:active .tag-cross:not(:disabled) {
  color: var(--tag-cross-b-fg-pressed);
}

[data-bg="black"] .tag-grade-disabled .tag-cross {
  color: var(--tag-cross-b-fg-disabled);
  cursor: not-allowed;
}

/* TagText Component Styles */
/* Variables CSS pour TagText et TagCross - basées sur les tokens Figma */
:root {
  /* TagText - White background */
  --tag-text-w-bg-default: #f3f3f3;
  --tag-text-w-fg-default: #292828;
  --tag-text-w-bg-hover: #292828;
  --tag-text-w-fg-hover: #ffffff;
  --tag-text-w-bg-pressed: #292828;
  --tag-text-w-fg-pressed: #cdedff;
  --tag-text-w-bg-disabled: #f3f3f3;
  --tag-text-w-fg-disabled: #292828;
  
  /* TagText - Grey background */
  --tag-text-g-bg-default: #ffffff;
  --tag-text-g-fg-default: #292828;
  --tag-text-g-bg-hover: #292828;
  --tag-text-g-fg-hover: #ffffff;
  --tag-text-g-bg-pressed: #292828;
  --tag-text-g-fg-pressed: #cdedff;
  --tag-text-g-bg-disabled: #ffffff;
  --tag-text-g-fg-disabled: #292828;
  
  /* TagText - Black background */
  --tag-text-b-bg-default: #3a3a3a;
  --tag-text-b-fg-default: #ffffff;
  --tag-text-b-bg-hover: #ffffff;
  --tag-text-b-fg-hover: #292828;
  --tag-text-b-bg-pressed: #3a3a3a;
  --tag-text-b-fg-pressed: #cdedff;
  --tag-text-b-bg-disabled: #ffffff;
  --tag-text-b-fg-disabled: #292828;
  
  /* TagCross - White background */
  --tag-cross-w-fg-default: #292828;
  --tag-cross-w-fg-hover: #ffffff;
  --tag-cross-w-fg-pressed: #cdedff;
  --tag-cross-w-fg-disabled: #c1c1c1;
  
  /* TagCross - Grey background */
  --tag-cross-g-fg-default: #292828;
  --tag-cross-g-fg-hover: #ffffff;
  --tag-cross-g-fg-pressed: #cdedff;
  --tag-cross-g-fg-disabled: #c1c1c1;
  
  /* TagCross - Black background */
  --tag-cross-b-fg-default: #ffffff;
  --tag-cross-b-fg-hover: #292828;
  --tag-cross-b-fg-pressed: #cdedff;
  --tag-cross-b-fg-disabled: #c1c1c1;
  
  /* TagStar - White background */
  --tag-star-w-bg-default: #f3f3f3;
  --tag-star-w-fg-default: #ffd331;
  --tag-star-w-bg-hover: #292828;
  --tag-star-w-fg-hover: #ffd331;
  --tag-star-w-bg-pressed: #292828;
  --tag-star-w-fg-pressed: #ffd331;
  --tag-star-w-bg-disabled: #f3f3f3;
  --tag-star-w-fg-disabled: #ffd331;
  
  /* TagStar - Grey background */
  --tag-star-g-bg-default: #ffffff;
  --tag-star-g-fg-default: #ffd331;
  --tag-star-g-bg-hover: #292828;
  --tag-star-g-fg-hover: #ffd331;
  --tag-star-g-bg-pressed: #292828;
  --tag-star-g-fg-pressed: #ffd331;
  --tag-star-g-bg-disabled: #ffffff;
  --tag-star-g-fg-disabled: #ffd331;
  
  /* TagStar - Black background */
  --tag-star-b-bg-default: #3a3a3a;
  --tag-star-b-fg-default: #ffd331;
  --tag-star-b-bg-hover: #ffffff;
  --tag-star-b-fg-hover: #ffd331;
  --tag-star-b-bg-pressed: #3a3a3a;
  --tag-star-b-fg-pressed: #ffd331;
  --tag-star-b-bg-disabled: #ffffff;
  --tag-star-b-fg-disabled: #ffd331;
}

/* TagText styles */
[data-bg="white"] .tag-text {
  background: var(--tag-text-w-bg-default);
  color: var(--tag-text-w-fg-default);
}

[data-bg="white"] .tag-text:hover:not(.tag-text-disabled) {
  background: var(--tag-text-w-bg-hover);
  color: var(--tag-text-w-fg-hover);
}

[data-bg="white"] .tag-text:active:not(.tag-text-disabled) {
  background: var(--tag-text-w-bg-pressed);
  color: var(--tag-text-w-fg-pressed);
}

[data-bg="white"] .tag-text.tag-text-disabled {
  background: var(--tag-text-w-bg-disabled);
  color: var(--tag-text-w-fg-disabled);
  opacity: 0.5;
  cursor: not-allowed;
}

[data-bg="grey"] .tag-text {
  background: var(--tag-text-g-bg-default);
  color: var(--tag-text-g-fg-default);
}

[data-bg="grey"] .tag-text:hover:not(.tag-text-disabled) {
  background: var(--tag-text-g-bg-hover);
  color: var(--tag-text-g-fg-hover);
}

[data-bg="grey"] .tag-text:active:not(.tag-text-disabled) {
  background: var(--tag-text-g-bg-pressed);
  color: var(--tag-text-g-fg-pressed);
}

[data-bg="grey"] .tag-text.tag-text-disabled {
  background: var(--tag-text-g-bg-disabled);
  color: var(--tag-text-g-fg-disabled);
  opacity: 0.5;
  cursor: not-allowed;
}

[data-bg="black"] .tag-text {
  background: var(--tag-text-b-bg-default);
  color: var(--tag-text-b-fg-default);
}

[data-bg="black"] .tag-text:hover:not(.tag-text-disabled) {
  background: var(--tag-text-b-bg-hover);
  color: var(--tag-text-b-fg-hover);
}

[data-bg="black"] .tag-text:active:not(.tag-text-disabled) {
  background: var(--tag-text-b-bg-pressed);
  color: var(--tag-text-b-fg-pressed);
}

[data-bg="black"] .tag-text.tag-text-disabled {
  background: var(--tag-text-b-bg-disabled);
  color: var(--tag-text-b-fg-disabled);
  opacity: 0.5;
  cursor: not-allowed;
}

/* TagCross styles */
[data-bg="white"] .tag-cross {
  color: var(--tag-cross-w-fg-default);
}

[data-bg="white"] .tag-text:hover .tag-cross:not(:disabled) {
  color: var(--tag-cross-w-fg-hover);
}

[data-bg="white"] .tag-text:active .tag-cross:not(:disabled) {
  color: var(--tag-cross-w-fg-pressed);
}

[data-bg="white"] .tag-cross:disabled,
[data-bg="white"] .tag-text-disabled .tag-cross {
  color: var(--tag-cross-w-fg-disabled);
}

[data-bg="grey"] .tag-cross {
  color: var(--tag-cross-g-fg-default);
}

[data-bg="grey"] .tag-text:hover .tag-cross:not(:disabled) {
  color: var(--tag-cross-g-fg-hover);
}

[data-bg="grey"] .tag-text:active .tag-cross:not(:disabled) {
  color: var(--tag-cross-g-fg-pressed);
}

[data-bg="grey"] .tag-cross:disabled,
[data-bg="grey"] .tag-text-disabled .tag-cross {
  color: var(--tag-cross-g-fg-disabled);
}

[data-bg="black"] .tag-cross {
  color: var(--tag-cross-b-fg-default);
}

[data-bg="black"] .tag-text:hover .tag-cross:not(:disabled) {
  color: var(--tag-cross-b-fg-hover);
}

[data-bg="black"] .tag-text:active .tag-cross:not(:disabled) {
  color: var(--tag-cross-b-fg-pressed);
}

[data-bg="black"] .tag-cross:disabled,
[data-bg="black"] .tag-text-disabled .tag-cross {
  color: var(--tag-cross-b-fg-disabled);
}

/* TagStar styles */
[data-bg="white"] .tag-star {
  background: var(--tag-star-w-bg-default);
  color: var(--tag-star-w-fg-default);
}

[data-bg="white"] .tag-star:hover:not(.tag-star-disabled) {
  background: var(--tag-star-w-bg-hover);
  color: var(--tag-star-w-fg-hover);
}

[data-bg="white"] .tag-star:active:not(.tag-star-disabled) {
  background: var(--tag-star-w-bg-pressed);
  color: var(--tag-star-w-fg-pressed);
}

[data-bg="white"] .tag-star.tag-star-disabled {
  background: var(--tag-star-w-bg-disabled);
  color: var(--tag-star-w-fg-disabled);
  opacity: 0.5;
  cursor: not-allowed;
}

[data-bg="grey"] .tag-star {
  background: var(--tag-star-g-bg-default);
  color: var(--tag-star-g-fg-default);
}

[data-bg="grey"] .tag-star:hover:not(.tag-star-disabled) {
  background: var(--tag-star-g-bg-hover);
  color: var(--tag-star-g-fg-hover);
}

[data-bg="grey"] .tag-star:active:not(.tag-star-disabled) {
  background: var(--tag-star-g-bg-pressed);
  color: var(--tag-star-g-fg-pressed);
}

[data-bg="grey"] .tag-star.tag-star-disabled {
  background: var(--tag-star-g-bg-disabled);
  color: var(--tag-star-g-fg-disabled);
  opacity: 0.5;
  cursor: not-allowed;
}

[data-bg="black"] .tag-star {
  background: var(--tag-star-b-bg-default);
  color: var(--tag-star-b-fg-default);
}

[data-bg="black"] .tag-star:hover:not(.tag-star-disabled) {
  background: var(--tag-star-b-bg-hover);
  color: var(--tag-star-b-fg-hover);
}

[data-bg="black"] .tag-star:active:not(.tag-star-disabled) {
  background: var(--tag-star-b-bg-pressed);
  color: var(--tag-star-b-fg-pressed);
}

[data-bg="black"] .tag-star.tag-star-disabled {
  background: var(--tag-star-b-bg-disabled);
  color: var(--tag-star-b-fg-disabled);
  opacity: 0.5;
  cursor: not-allowed;
}

/* TagStar styles pour les étoiles (héritent de la couleur du tag) */
[data-bg="white"] .tag-star .tag-star-stars,
[data-bg="white"] .tag-star:hover:not(.tag-star-disabled) .tag-star-stars,
[data-bg="white"] .tag-star:active:not(.tag-star-disabled) .tag-star-stars {
  color: var(--tag-star-w-fg-default);
}

[data-bg="grey"] .tag-star .tag-star-stars,
[data-bg="grey"] .tag-star:hover:not(.tag-star-disabled) .tag-star-stars,
[data-bg="grey"] .tag-star:active:not(.tag-star-disabled) .tag-star-stars {
  color: var(--tag-star-g-fg-default);
}

[data-bg="black"] .tag-star .tag-star-stars,
[data-bg="black"] .tag-star:hover:not(.tag-star-disabled) .tag-star-stars,
[data-bg="black"] .tag-star:active:not(.tag-star-disabled) .tag-star-stars {
  color: var(--tag-star-b-fg-default);
}

[data-bg="white"] .tag-star.tag-star-disabled .tag-cross,
[data-bg="grey"] .tag-star.tag-star-disabled .tag-cross,
[data-bg="black"] .tag-star.tag-star-disabled .tag-cross {
  color: var(--tag-cross-w-fg-disabled);
}

[data-bg="white"] .tag-star.tag-star-disabled .tag-star-stars,
[data-bg="grey"] .tag-star.tag-star-disabled .tag-star-stars,
[data-bg="black"] .tag-star.tag-star-disabled .tag-star-stars {
  opacity: 0.5;
}

/* Étoile outline (value=0) : trait plus épais pour meilleure visibilité */
.tag-star .tag-star-outline svg path {
  stroke-width: 1;
}

/* TagCross dans TagStar : blanc au hover */
[data-bg="white"] .tag-star:hover:not(.tag-star-disabled) .tag-cross,
[data-bg="grey"] .tag-star:hover:not(.tag-star-disabled) .tag-cross,
[data-bg="black"] .tag-star:hover:not(.tag-star-disabled) .tag-cross {
  color: #ffffff;
}

/* TagLabel Component Styles */
/* Variables CSS pour TagLabel - basées sur les tokens Figma */
:root {
  /* TagLabel - White background */
  --tag-label-w-bg-default: #f3f3f3;
  --tag-label-w-fg-default: #292828;
  --tag-label-w-bg-hover: #292828;
  --tag-label-w-fg-hover: #ffffff;
  --tag-label-w-bg-pressed: #292828;
  --tag-label-w-fg-pressed: #cdedff;
  --tag-label-w-bg-disabled: #f3f3f3;
  --tag-label-w-fg-disabled: #292828;
  
  /* TagLabel - Grey background */
  --tag-label-g-bg-default: #ffffff;
  --tag-label-g-fg-default: #292828;
  --tag-label-g-bg-hover: #292828;
  --tag-label-g-fg-hover: #ffffff;
  --tag-label-g-bg-pressed: #292828;
  --tag-label-g-fg-pressed: #cdedff;
  --tag-label-g-bg-disabled: #ffffff;
  --tag-label-g-fg-disabled: #292828;
  
  /* TagLabel - Black background */
  --tag-label-b-bg-default: #3a3a3a;
  --tag-label-b-fg-default: #ffffff;
  --tag-label-b-bg-hover: #ffffff;
  --tag-label-b-fg-hover: #292828;
  --tag-label-b-bg-pressed: #3a3a3a;
  --tag-label-b-fg-pressed: #cdedff;
  --tag-label-b-bg-disabled: #ffffff;
  --tag-label-b-fg-disabled: #292828;
  
  /* Label colors (from Figma variables) */
  --label-blue: #74d4da;
  --label-green: #89cc52;
  --label-orange: #ff9900;
  --label-pink: #ffaad4;
  --label-purple: #a44c9f;
  --label-red: #dd3733;
  --label-white: #ffffff;
}

/* TagLabel styles */
[data-bg="white"] .tag-label {
  background: var(--tag-label-w-bg-default);
  color: var(--tag-label-w-fg-default);
}

[data-bg="white"] .tag-label:hover:not(.tag-label-disabled) {
  background: var(--tag-label-w-bg-hover);
  color: var(--tag-label-w-fg-hover);
}

[data-bg="white"] .tag-label:active:not(.tag-label-disabled) {
  background: var(--tag-label-w-bg-pressed);
  color: var(--tag-label-w-fg-pressed);
}

[data-bg="white"] .tag-label.tag-label-disabled {
  background: var(--tag-label-w-bg-disabled);
  color: var(--tag-label-w-fg-disabled);
}

[data-bg="grey"] .tag-label {
  background: var(--tag-label-g-bg-default);
  color: var(--tag-label-g-fg-default);
}

[data-bg="grey"] .tag-label:hover:not(.tag-label-disabled) {
  background: var(--tag-label-g-bg-hover);
  color: var(--tag-label-g-fg-hover);
}

[data-bg="grey"] .tag-label:active:not(.tag-label-disabled) {
  background: var(--tag-label-g-bg-pressed);
  color: var(--tag-label-g-fg-pressed);
}

[data-bg="grey"] .tag-label.tag-label-disabled {
  background: var(--tag-label-g-bg-disabled);
  color: var(--tag-label-g-fg-disabled);
}

[data-bg="black"] .tag-label {
  background: var(--tag-label-b-bg-default);
  color: var(--tag-label-b-fg-default);
}

[data-bg="black"] .tag-label:hover:not(.tag-label-disabled) {
  background: var(--tag-label-b-bg-hover);
  color: var(--tag-label-b-fg-hover);
}

[data-bg="black"] .tag-label:active:not(.tag-label-disabled) {
  background: var(--tag-label-b-bg-pressed);
  color: var(--tag-label-b-fg-pressed);
}

[data-bg="black"] .tag-label.tag-label-disabled {
  background: var(--tag-label-b-bg-disabled);
  color: var(--tag-label-b-fg-disabled);
}

/* TagCross dans TagLabel - mêmes styles que TagText */
[data-bg="white"] .tag-label:hover .tag-cross:not(:disabled) {
  color: var(--tag-cross-w-fg-hover);
}

[data-bg="white"] .tag-label:active .tag-cross:not(:disabled) {
  color: var(--tag-cross-w-fg-pressed);
}

[data-bg="white"] .tag-label-disabled .tag-cross {
  color: var(--tag-cross-w-fg-disabled);
  cursor: not-allowed;
}

[data-bg="grey"] .tag-label:hover .tag-cross:not(:disabled) {
  color: var(--tag-cross-g-fg-hover);
}

[data-bg="grey"] .tag-label:active .tag-cross:not(:disabled) {
  color: var(--tag-cross-g-fg-pressed);
}

[data-bg="grey"] .tag-label-disabled .tag-cross {
  color: var(--tag-cross-g-fg-disabled);
  cursor: not-allowed;
}

[data-bg="black"] .tag-label:hover .tag-cross:not(:disabled) {
  color: var(--tag-cross-b-fg-hover);
}

[data-bg="black"] .tag-label:active .tag-cross:not(:disabled) {
  color: var(--tag-cross-b-fg-pressed);
}

[data-bg="black"] .tag-label-disabled .tag-cross {
  color: var(--tag-cross-b-fg-disabled);
  cursor: not-allowed;
}

/* Disabled state - les labels gardent leur couleur mais avec opacité réduite */
.tag-label-disabled .tag-label-icon {
  opacity: 0.5;
}

/* Cas particulier : white label sur grey background - ajout d'une bordure grise intérieure */
[data-bg="grey"] .tag-label-white-on-grey {
  border: 1px solid var(--color-grey-stronger);
  border-radius: 2px;
  box-sizing: border-box;
}

/* Enlever le border au hover pour grey background */
[data-bg="grey"] .tag-label:hover:not(.tag-label-disabled) .tag-label-white-on-grey {
  border: none;
}

/* Cas particulier : white label sur black background - bordure au hover uniquement */
[data-bg="black"] .tag-label-white-on-black {
  border: none;
  border-radius: 2px;
  box-sizing: border-box;
}

/* Ajouter le border au hover pour black background */
[data-bg="black"] .tag-label:hover:not(.tag-label-disabled) .tag-label-white-on-black {
  border: 1px solid var(--color-grey-stronger);
}

/* Application de la couleur via variable CSS sur la div */
.tag-label-icon[style*="--tag-label-color"] {
  color: var(--tag-label-color);
}

/* Les SVG dans tag-label-icon doivent s'adapter au conteneur */
.tag-label-icon svg {
  width: 100%;
  height: 100%;
}

`;
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

  // Ajouter les styles personnalisés pour les composants
  css += `\n/* Styles personnalisés pour les composants - générés automatiquement */\n`;
  css += generateComponentStyles();

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