# Guide d'utilisation des Styles et Fonts

## 🎨 Configuration des Styles GS Components

La librairie GS Components offre plusieurs façons d'appliquer les styles et fonts à votre application.

## 1. Installation Rapide (Recommandée)

### Option A : Application Complète avec tous les providers

```tsx
import { GSComponentsRoot } from '@gs/gs-components-library';
import '@gs/gs-components-library/dist/lib.css'; // Important !

function App() {
  return (
    <GSComponentsRoot
      styleConfig={{
        applyGlobalStyles: true,  // Applique les styles à toute l'app
        loadFonts: true,          // Charge Avenir Next LT Pro
      }}
      translationConfig={{
        defaultLanguage: 'FR'
      }}
    >
      <YourApp />
    </GSComponentsRoot>
  );
}
```

### Option B : Styles Globaux Uniquement

Si vous avez déjà vos propres providers :

```tsx
import { GSGlobalStyles } from '@gs/gs-components-library';
import '@gs/gs-components-library/dist/lib.css';

function App() {
  return (
    <>
      <GSGlobalStyles />
      <YourApp />
    </>
  );
}
```

## 2. Configuration Avancée

### Personnaliser la Police

```tsx
<GSComponentsRoot
  styleConfig={{
    applyGlobalStyles: true,
    customFontFamily: "'Inter', 'Helvetica Neue', sans-serif", // Votre police
    loadFonts: false, // Désactive Avenir Next si vous utilisez votre propre police
  }}
>
  <App />
</GSComponentsRoot>
```

### Utiliser le StyleProvider Séparément

```tsx
import { StyleProvider, ThemeProvider, TranslationProvider } from '@gs/gs-components-library';

function App() {
  return (
    <StyleProvider config={{
      applyGlobalStyles: true,
      loadFonts: true,
      cssVariables: {
        '--gs-font-sans': 'Inter, sans-serif',
        '--primary': '200 100% 50%',
      }
    }}>
      <ThemeProvider>
        <TranslationProvider>
          <YourApp />
        </TranslationProvider>
      </ThemeProvider>
    </StyleProvider>
  );
}
```

## 3. Surcharge avec Tailwind

### Dans votre tailwind.config.js

```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // Surcharge la police par défaut
        'sans': ['Inter', 'var(--gs-font-sans)', 'sans-serif'],
      },
      colors: {
        // Utilise les variables CSS de GS Components
        'gs-primary': 'rgb(var(--text-blue-primary) / <alpha-value>)',
        'gs-black': 'rgb(var(--bg-black) / <alpha-value>)',
      }
    }
  }
}
```

### Dans vos composants

```tsx
// Les composants GS utilisent automatiquement Avenir Next
<FileBrowser files={files} />

// Vos composants peuvent utiliser votre police
<div className="font-sans">Utilise votre police configurée</div>

// Ou forcer Avenir Next
<div className="font-avenir">Force Avenir Next LT Pro</div>
```

## 4. Variables CSS Disponibles

### Fonts
```css
--gs-font-sans: 'AvenirNextLTPro', sans-serif;
--gs-font-mono: monospace;
```

### Couleurs (format RGB pour Tailwind)
```css
--bg-black: 41 40 40;
--bg-white: 255 255 255;
--text-blue-primary: 205 237 255;
/* ... et plus */
```

### Utilisation dans CSS personnalisé
```css
.my-component {
  font-family: var(--gs-font-sans);
  background-color: rgb(var(--bg-black));
  color: rgb(var(--text-white));
}
```

## 5. Hook useGlobalStyles

Pour une application existante :

```tsx
import { useGlobalStyles } from '@gs/gs-components-library';

function MyExistingApp() {
  // Applique les styles GS à votre app
  useGlobalStyles({
    applyGlobalStyles: true,
    loadFonts: true,
  });

  return <div>...</div>;
}
```

## 6. Classes Utilitaires

La librairie fournit plusieurs classes CSS :

- `.gs-font-base` : Applique la police Avenir Next
- `.gs-global-styles` : Applique tous les styles globaux
- `.gs-font-normal` : Font weight 400
- `.gs-font-medium` : Font weight 500
- `.gs-font-bold` : Font weight 700

## 7. Exemples Complets

### Application Next.js

```tsx
// pages/_app.tsx
import { GSComponentsRoot } from '@gs/gs-components-library';
import '@gs/gs-components-library/dist/lib.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <GSComponentsRoot
      styleConfig={{
        applyGlobalStyles: true,
        loadFonts: true
      }}
    >
      <Component {...pageProps} />
    </GSComponentsRoot>
  );
}
```

### Application Vite/React

```tsx
// main.tsx
import { GSComponentsRoot } from '@gs/gs-components-library';
import '@gs/gs-components-library/dist/lib.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GSComponentsRoot
    styleConfig={{ applyGlobalStyles: true }}
    translationConfig={{ defaultLanguage: 'FR' }}
  >
    <App />
  </GSComponentsRoot>
);
```

### Composant Isolé

```tsx
// Sans affecter le reste de l'app
import { StyleProvider } from '@gs/gs-components-library';

function IsolatedSection() {
  return (
    <StyleProvider config={{ loadFonts: true }}>
      <div className="gs-components">
        <FileBrowser files={files} />
      </div>
    </StyleProvider>
  );
}
```

## ⚠️ Important

1. **Toujours importer le CSS** : `import '@gs/gs-components-library/dist/lib.css'`
2. **Les fonts sont automatiquement chargées** si `loadFonts: true`
3. **Les styles globaux sont optionnels** via `applyGlobalStyles`
4. **Compatible avec tous les frameworks React** (Next.js, Vite, CRA, etc.)

## 🔧 Dépannage

### Les fonts ne se chargent pas
- Vérifiez que `lib.css` est bien importé
- Assurez-vous que `loadFonts: true` dans la config
- Les fichiers de fonts doivent être accessibles dans `dist/fonts/`

### Conflits de styles
- Utilisez `applyGlobalStyles: false` si vous avez vos propres styles globaux
- Utilisez le préfixe `.gs-` pour éviter les conflits
- Configurez `classPrefix` dans StyleProvider si nécessaire

### Override des couleurs
- Utilisez `cssVariables` dans StyleConfig
- Ou override directement dans votre CSS avec les variables `--gs-*`