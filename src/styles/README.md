# Architecture CSS du Design System

## 📂 Fichiers et responsabilités

### `figma-tokens.css` 🎨
**SOURCE DE VÉRITÉ** - Variables générées automatiquement depuis Figma

- ⚠️ **NE JAMAIS MODIFIER MANUELLEMENT**
- Généré par `scripts/generate-css-tokens.cjs`
- Contient toutes les variables de design : couleurs, typographie, spacing, etc.
- Exemple : `--font-size-sm: 0.6875rem`, `--color-blue-primary: #cdedff`

### `shadcn-theme.css` 🎭
Variables **shadcn/ui uniquement** (HSL, sémantiques)

- Variables HSL pour composants shadcn : `--primary`, `--destructive`, etc.
- Variables RGB pour Tailwind opacity : `--bg-white: 255 255 255`
- **NE DOIT PAS** importer `figma-tokens.css` (ordre géré en amont)
- Ancien nom : `theme-variables.css` (déprécié)

### `fonts.css` 🔤
Déclarations `@font-face` pour AvenirNextLTPro

- Polices custom chargées depuis `src/fonts/`
- Variables CSS pour font-family : `--gs-font-sans`, `--gs-font-mono`
- Utility classes : `.gs-font-regular`, `.gs-font-bold`, etc.

### `typography.css` 📝
Classes utilitaires typographiques

- Styles pour titres : `.gs-typo-h1`, `.gs-typo-h2`, etc.
- Applique les variables de `figma-tokens.css`
- Exemple : `font-size: var(--font-size-xxl)`

## 🔀 Ordre d'import (CRITIQUE)

```css
/* 1️⃣ Figma tokens (SOURCE DE VÉRITÉ) */
@import './styles/figma-tokens.css';

/* 2️⃣ Shadcn theme (UTILISE les tokens Figma) */
@import './styles/shadcn-theme.css';

/* 3️⃣ Autres styles */
@import './styles/fonts.css';
@import './styles/typography.css';

/* 4️⃣ Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### ⚠️ Pourquoi cet ordre ?

1. **figma-tokens.css définit** : `--font-size-sm: 0.6875rem`
2. **shadcn-theme.css peut utiliser** : `--input: var(--font-size-sm, 0.75rem)`
3. Si l'ordre est inversé, shadcn-theme ne trouve pas les variables Figma

## 🏗️ Points d'entrée

### `src/index.css` (Storybook + Apps)
```css
@import './styles/figma-tokens.css';
@import './styles/shadcn-theme.css';
@import './styles/typography.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `src/lib.css` (Librairie NPM)
```css
@import './styles/fonts.css';
@import './styles/figma-tokens.css';
@import './styles/shadcn-theme.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🔄 Workflow de mise à jour

### Mise à jour des tokens Figma
```bash
# 1. Mettre à jour figma-primitives.json depuis Figma
# 2. Régénérer les tokens CSS
npm run generate-tokens

# figma-tokens.css est automatiquement régénéré
```

### Mise à jour Tailwind
```bash
npm update tailwindcss

# ✅ Aucun conflit grâce à la séparation des fichiers
# Les variables Figma restent prioritaires
```

### Ajout de variables shadcn
```css
/* Dans shadcn-theme.css uniquement */
:root {
  --nouvelle-variable-shadcn: 0 0% 50%;
}
```

## 🚨 Règles d'or

1. ✅ **TOUJOURS** importer `figma-tokens.css` AVANT `shadcn-theme.css`
2. ❌ **JAMAIS** redéfinir de variables Figma dans `shadcn-theme.css`
3. ❌ **JAMAIS** ajouter `@import` dans `shadcn-theme.css`
4. ✅ **TOUJOURS** utiliser `scripts/generate-css-tokens.cjs` pour modifier `figma-tokens.css`
5. ✅ Documenter les changements dans ce README

## 🐛 Debugging

### Variable CSS non définie dans le navigateur
```bash
# Vérifier l'ordre d'import
grep -n "@import" src/index.css src/lib.css

# Vérifier que la variable existe
grep "mon-variable" src/styles/figma-tokens.css
```

### Conflit entre figma-tokens et shadcn-theme
```bash
# Chercher les doublons
grep -h "^  --" src/styles/figma-tokens.css src/styles/shadcn-theme.css | sort | uniq -d
```

## 📚 Ressources

- [Tailwind CSS Configuration](../../tailwind.config.ts)
- [Script de génération](../../scripts/generate-css-tokens.cjs)
- [Figma Design Tokens](../../figma-primitives.json)
