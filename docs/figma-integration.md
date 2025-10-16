# Intégration Figma

## 🎨 Vue d'ensemble

La librairie GS Components est étroitement intégrée avec Figma pour assurer une cohérence parfaite entre le design et le code.

## 📁 Fichiers de tokens

### Primitives (`figma-primitives.json`)

Les primitives définissent les valeurs de base du design system :

```json
{
  "light": {
    "colorsBlack": "#292828",
    "colorsWhite": "#ffffff",
    "colorsBluePrimary": "#cdedff",
    "paddingSmall": 5,
    "paddingMedium": 10,
    "fontFtSizeBase": 13,
    // ...
  },
  "dark": {
    // Variantes pour le mode sombre
  }
}
```

### Tokens sémantiques (`figma-tokens.json`)

Les tokens appliquent les primitives dans des contextes spécifiques :

```json
{
  "button": {
    "primary": {
      "background": "{colorsBlack}",
      "text": "{colorsWhite}",
      "hover": {
        "background": "{colorsGreyStrongest}"
      }
    }
  }
}
```

## 🔄 Process de synchronisation

### 1. Export depuis Figma

Dans Figma Desktop :

1. Ouvrez votre fichier de design system
2. Panneau droit → Local variables (icône hexagone)
3. Menu (3 points) → Export variable collection
4. Format JSON

### 2. Import dans le projet

```bash
# Placer les fichiers dans le bon répertoire
cp ~/Downloads/figma-*.json src/styles/
```

### 3. Génération des variables CSS

Un script transforme automatiquement les tokens en variables CSS :

```javascript
// scripts/generate-css-variables.js
const primitives = require('../src/styles/figma-primitives.json');
const tokens = require('../src/styles/figma-tokens.json');

// Génère les variables CSS
generateCSSVariables(primitives, tokens);
```

### 4. Utilisation dans les composants

```tsx
// Les composants utilisent les variables CSS
<Button
  className="bg-[var(--button-primary-background)]"
/>
```

## 🎯 Mapping des tokens

### Couleurs

| Token Figma | Variable CSS | Classe Tailwind |
|------------|--------------|-----------------|
| `colorsBlack` | `--bg-black` | `bg-black` |
| `colorsWhite` | `--bg-white` | `bg-white` |
| `colorsBluePrimary` | `--text-blue-primary` | `text-blue-primary` |
| `colorsGreen` | `--text-green` | `text-green` |

### Espacements

| Token Figma | Variable CSS | Classe Tailwind |
|------------|--------------|-----------------|
| `paddingSmall` | `--padding-small` | `p-1` (5px) |
| `paddingMedium` | `--padding-medium` | `p-2` (10px) |
| `paddingLarge` | `--padding-large` | `p-4` (20px) |

### Typographie

| Token Figma | Variable CSS | Classe Tailwind |
|------------|--------------|-----------------|
| `fontFtSizeXs` | `--font-size-xs` | `text-xs` |
| `fontFtSizeSm` | `--font-size-sm` | `text-sm` |
| `fontFtSizeBase` | `--font-size-base` | `text-base` |

## 🔧 Configuration Tailwind

Le fichier `tailwind.config.ts` est configuré pour utiliser les tokens :

```javascript
export default {
  theme: {
    extend: {
      colors: {
        'black': 'var(--bg-black, #292828)',
        'white': 'var(--bg-white, #FFFFFF)',
        'blue-primary': 'var(--text-blue-primary, #CDEDFF)',
        // ...
      },
      spacing: {
        '1': '5px',  // paddingSmall
        '2': '10px', // paddingMedium
        '4': '20px', // paddingLarge
        // ...
      }
    }
  }
}
```

## 🎨 Utilisation du ThemeProvider

Le `ThemeProvider` permet de surcharger les tokens à l'exécution :

```tsx
import { ThemeProvider } from '@gs/gs-components-library/providers/theme';

function App() {
  const customTheme = {
    colors: {
      bgWhite: '#f5f5f5', // Surcharge le blanc
      textBluePrimary: '#0066cc' // Surcharge le bleu
    }
  };

  return (
    <ThemeProvider initialCustomization={customTheme}>
      {/* Les composants utilisent les couleurs personnalisées */}
    </ThemeProvider>
  );
}
```

## 📊 Statuts et états

### Statuts des médias

Les couleurs de statut sont définies dans les tokens :

```json
{
  "statusIgnored": "#C1C1C1",
  "statusSelected": "#89CC52",
  "statusReshoot": "#FF9900",
  "statusForApproval": "#FFD331",
  "statusValidated": "#9EDEAB",
  "statusPublished": "#74D4DA",
  "statusError": "#DD3733"
}
```

Utilisation dans les composants :

```tsx
<StatusIndicator status="validated" />
// Utilise automatiquement var(--status-validated-color)
```

## 🔄 Workflow de mise à jour

### 1. Modification dans Figma

Le designer met à jour les variables dans Figma

### 2. Export et commit

```bash
# Export depuis Figma
# Puis dans le terminal :
git add src/styles/figma-*.json
git commit -m "feat: Update Figma tokens"
```

### 3. Génération des styles

```bash
npm run generate:tokens
```

### 4. Test des changements

```bash
npm run storybook
# Vérifier visuellement les changements
```

### 5. Publication

```bash
npm version patch
npm publish
```

## 🛠️ Scripts utiles

### Validation des tokens

```bash
npm run validate:tokens
# Vérifie la cohérence entre primitives et tokens
```

### Diff des tokens

```bash
npm run tokens:diff
# Affiche les changements depuis la dernière version
```

### Génération de la documentation

```bash
npm run docs:tokens
# Génère une page HTML avec tous les tokens
```

## ⚠️ Bonnes pratiques

### ✅ À faire

- Toujours utiliser les tokens au lieu de valeurs en dur
- Documenter les nouveaux tokens ajoutés
- Tester en mode clair ET sombre
- Versionner les changements de tokens

### ❌ À éviter

- Modifier directement les variables CSS sans mettre à jour les tokens
- Utiliser des couleurs hexadécimales en dur dans les composants
- Ignorer les warnings de tokens manquants
- Surcharger les tokens dans les composants (utiliser ThemeProvider)

## 🔍 Debugging

### Les couleurs ne s'appliquent pas

1. Vérifier que les variables CSS sont chargées :
```javascript
console.log(getComputedStyle(document.documentElement)
  .getPropertyValue('--bg-black'));
```

2. Vérifier le mapping dans Tailwind :
```bash
npx tailwind-config-viewer
```

### Token non trouvé

Message d'erreur : `Token '{colorPrimary}' not found`

Solution : Vérifier que le token existe dans `figma-primitives.json`

### Incohérence visuelle

Si les composants ne correspondent pas à Figma :

1. Re-exporter les tokens depuis Figma
2. Comparer avec `git diff src/styles/`
3. Régénérer les variables CSS