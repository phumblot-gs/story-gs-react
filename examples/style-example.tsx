/**
 * Exemples d'utilisation du système de styles GS Components
 */

import React from 'react';
import {
  StyleProvider,
  useGlobalStyles,
  GSComponentsRoot
} from '@gs/gs-components-library';
import { Button } from '@gs/gs-components-library/components/button';
import { Card } from '@gs/gs-components-library/components/card';

// Exemple 1 : Utilisation du StyleProvider avec configuration personnalisée
export function AppWithCustomStyles() {
  return (
    <StyleProvider
      config={{
        // Appliquer les styles GS globalement
        applyGlobalStyles: true,

        // Utiliser une police personnalisée si Avenir n'est pas disponible
        customFontFamily: '"AvenirNextLTPro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

        // Charger les fonts depuis la librairie
        loadFonts: true,

        // Variables CSS personnalisées
        cssVariables: {
          '--primary': '221 83 53', // Couleur primaire personnalisée
          '--radius': '0.25rem',    // Rayon de bordure personnalisé
        },

        // Classe racine personnalisée
        rootClassName: 'gs-app',

        // Préfixe de classe
        classPrefix: 'gs'
      }}
    >
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Application avec styles GS</h1>
        <Card className="p-4">
          <p>Cette card utilise la police Avenir Next et les styles GS</p>
          <Button className="mt-4">Bouton stylisé</Button>
        </Card>
      </div>
    </StyleProvider>
  );
}

// Exemple 2 : Utilisation du hook useGlobalStyles (sans wrapper)
export function AppWithHook() {
  // Applique les styles globalement via un hook
  useGlobalStyles({
    applyGlobalStyles: true,
    customFontFamily: '"AvenirNextLTPro", sans-serif',
    loadFonts: true
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">App avec hook de styles</h1>
      <p>Les styles sont appliqués via le hook useGlobalStyles</p>
    </div>
  );
}

// Exemple 3 : Utilisation du GSComponentsRoot (tout-en-un)
export function AppWithRoot() {
  return (
    <GSComponentsRoot
      // Configuration du thème
      themeConfig={{
        defaultTheme: 'light',
        enableSystem: true
      }}

      // Configuration de la traduction
      translationConfig={{
        defaultLanguage: 'FR'
      }}

      // Configuration des styles
      styleConfig={{
        applyGlobalStyles: true,
        loadFonts: true,
        customFontFamily: '"AvenirNextLTPro", sans-serif'
      }}
    >
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Application complète GS</h1>
        <p>Tous les providers sont configurés automatiquement</p>
        <Button variant="default">Bouton avec tous les providers</Button>
      </div>
    </GSComponentsRoot>
  );
}

// Exemple 4 : Import des styles CSS directement
export function AppWithDirectCSS() {
  // Importer les CSS directement dans votre application
  // import '@gs/gs-components-library/dist/styles/fonts.css';
  // import '@gs/gs-components-library/dist/styles/theme-variables.css';
  // import '@gs/gs-components-library/dist/style.css';

  return (
    <div className="p-8 gs-font-base">
      <h1 className="text-3xl font-bold mb-4">Import CSS direct</h1>
      <p>Les styles sont importés directement via les fichiers CSS</p>
    </div>
  );
}

// Exemple 5 : Override de variables CSS dans votre app
export function AppWithCSSOverrides() {
  return (
    <>
      <style>{`
        :root {
          /* Override des variables de couleur */
          --primary: 200 80 60;
          --secondary: 150 60 80;

          /* Override de la police */
          --gs-font-sans: 'Helvetica Neue', sans-serif;

          /* Override des tailles de police */
          --font-size-base: 1.125rem;
          --font-size-lg: 1.25rem;
        }
      `}</style>

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Overrides CSS</h1>
        <p>Les variables CSS sont surchargées localement</p>
        <Button>Bouton avec styles overridés</Button>
      </div>
    </>
  );
}

// Exemple 6 : Utilisation dans Next.js
export function NextJsExample() {
  // Dans _app.tsx ou layout.tsx :
  /*
  import { GSComponentsRoot } from '@gs/gs-components-library';
  import '@gs/gs-components-library/dist/style.css';

  export default function App({ Component, pageProps }) {
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
  */

  return null;
}

// Exemple 7 : Configuration Tailwind pour étendre les styles
export const tailwindConfig = {
  // Dans votre tailwind.config.js :
  content: [
    // Inclure les composants GS
    './node_modules/@gs/gs-components-library/dist/**/*.{js,mjs,jsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        // Utiliser Avenir comme police par défaut
        sans: ['AvenirNextLTPro', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Utiliser les couleurs GS
        'gs-primary': 'rgb(var(--text-blue-primary) / <alpha-value>)',
        'gs-green': 'rgb(var(--text-green) / <alpha-value>)',
        'gs-yellow': 'rgb(var(--text-yellow) / <alpha-value>)',
      }
    }
  }
};