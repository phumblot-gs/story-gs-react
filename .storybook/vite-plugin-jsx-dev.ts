import type { Plugin } from 'vite';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Plugin Vite pour forcer l'utilisation du runtime JSX de développement
 * même quand NODE_ENV est défini sur "production"
 */
export function forceJsxDevRuntime(): Plugin {
  return {
    name: 'force-jsx-dev-runtime',
    enforce: 'pre',
    resolveId(id) {
      // Intercepter les imports de react/jsx-runtime et react/jsx-dev-runtime
      if (id === 'react/jsx-runtime' || id === 'react/jsx-dev-runtime') {
        return '\0' + id; // Préfixer avec \0 pour marquer comme module virtuel
      }
      return null;
    },
    load(id) {
      // Si c'est un import de react/jsx-runtime ou react/jsx-dev-runtime,
      // fournir une implémentation ES module qui utilise directement React.createElement
      if (id === '\0react/jsx-runtime' || id === '\0react/jsx-dev-runtime') {
        return {
          code: `
import React from 'react';

export const Fragment = React.Fragment;

export function jsxDEV(type, props, key, isStaticChildren, source, self) {
  if (typeof type === 'function') {
    return type(props);
  }
  return React.createElement(type, props, key);
}

export function jsx(type, props, key) {
  return React.createElement(type, props, key);
}
`,
          map: null,
        };
      }
      return null;
    },
  };
}

