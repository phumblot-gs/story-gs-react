# Architecture de la librairie

## 🏗️ Structure du projet

```
src/
├── components/          # Composants métier
│   ├── ButtonStatus.tsx
│   ├── ButtonNotifications.tsx
│   ├── PageHeader.tsx
│   └── ...
├── components/ui/       # Composants UI de base (shadcn)
│   ├── button/
│   │   └── index.ts    # Export modulaire
│   ├── button.tsx
│   ├── button-circle.tsx
│   ├── file-browser.tsx
│   ├── folder-browser.tsx
│   ├── select.tsx
│   └── ...
├── contexts/           # Providers React
│   ├── ThemeContext.tsx
│   ├── TranslationContext.tsx
│   └── ActivityStatusContext.tsx
├── utils/              # Utilitaires
│   ├── translations.ts
│   ├── mediaStatus.ts
│   ├── colorUtils.ts
│   └── notificationUtils.ts
├── styles/             # Styles et tokens
│   ├── figma-primitives.json  # Primitives Figma
│   ├── figma-tokens.json      # Tokens sémantiques
│   └── globals.css
└── index.ts            # Point d'entrée principal
```

## 🎨 Design Patterns

### 1. Composition over Inheritance

Tous nos composants utilisent la composition plutôt que l'héritage :

```tsx
// ✅ Bon : Composition
const Button = ({ children, ...props }) => (
  <ButtonBase {...props}>
    <IconProvider icon={props.icon} />
    {children}
  </ButtonBase>
);

// ❌ Éviter : Héritage
class Button extends ButtonBase { }
```

### 2. Compound Components

Pour les composants complexes, nous utilisons le pattern Compound Components :

```tsx
<Select>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

### 3. Providers Pattern

Les fonctionnalités transverses utilisent le Context API :

```tsx
<ThemeProvider>
  <TranslationProvider>
    <App />
  </TranslationProvider>
</ThemeProvider>
```

### 4. Forward Ref

Tous les composants interactifs supportent les refs :

```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={className} {...props} />;
  }
);
```

## 🔧 Système de build

### Vite Configuration

La librairie utilise Vite avec plusieurs points d'entrée :

```typescript
// vite.lib.config.ts
{
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        'components/button': 'src/components/ui/button.tsx',
        'components/file-browser': 'src/components/ui/file-browser.tsx',
        // ...
      }
    }
  }
}
```

### Optimisations

1. **Tree-shaking** : `preserveModules: true`
2. **Code splitting** : `cssCodeSplit: true`
3. **Minification** : Terser en production
4. **Source maps** : Générées pour le debugging

## 🎨 Système de styles

### Variables CSS

Les couleurs utilisent des variables CSS avec fallbacks :

```css
:root {
  --bg-white: #ffffff;
  --bg-black: #292828;
  --text-blue-primary: #cdedff;
}
```

### Tailwind Configuration

```javascript
// tailwind.config.ts
colors: {
  'white': 'var(--bg-white, #FFFFFF)',
  'black': 'var(--bg-black, #292828)',
  // ...
}
```

### Tokens Figma

Les tokens sont importés depuis Figma et mappés vers CSS :

```json
// figma-primitives.json
{
  "light": {
    "colorsBlack": "#292828",
    "colorsWhite": "#ffffff",
    // ...
  }
}
```

## 📦 Exports modulaires

### Structure des exports

Chaque composant a son propre fichier d'export :

```typescript
// src/components/ui/button/index.ts
export { Button, buttonVariants } from '../button';
export type { ButtonProps, ButtonSize } from '../button';
```

### Package.json exports field

```json
{
  "exports": {
    "./button": {
      "types": "./dist/components/button.d.ts",
      "import": "./dist/components/button.mjs",
      "require": "./dist/components/button.cjs"
    }
  }
}
```

## 🔌 Intégration avec les frameworks

### Next.js

```typescript
// next.config.js
module.exports = {
  transpilePackages: ['@gs/gs-components-library']
};
```

### Vite

```typescript
// vite.config.ts
export default {
  optimizeDeps: {
    include: ['@gs/gs-components-library']
  }
};
```

### Create React App

Fonctionne sans configuration supplémentaire.

## 🧪 Tests et qualité

### TypeScript

- Strict mode activé
- Types exportés pour tous les composants
- Support des génériques

### ESLint

Configuration stricte avec :
- React hooks rules
- TypeScript rules
- Accessibility rules

### Storybook

Documentation interactive pour :
- Tous les composants
- Tous les états possibles
- Exemples d'utilisation

## 🔒 Sécurité

### Sanitization

Toutes les entrées utilisateur sont sanitizées :

```typescript
const sanitizedValue = DOMPurify.sanitize(userInput);
```

### CSP Headers

Support des Content Security Policy :

```typescript
// Les styles inline utilisent des nonces
<style nonce={nonce}>...</style>
```

## 📊 Performance

### Lazy Loading

Support du chargement différé :

```typescript
const FileBrowser = lazy(() =>
  import('@gs/gs-components-library/file-browser')
);
```

### Memoization

Utilisation de `React.memo` pour les composants purs :

```typescript
export const Button = memo(ButtonComponent);
```

### Virtual Scrolling

Pour les listes longues (FileBrowser) :

```typescript
<VirtualList
  items={files}
  rowHeight={48}
  overscan={5}
/>
```