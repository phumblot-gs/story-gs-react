import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import dts from "vite-plugin-dts";
import fs from "fs";

// Fonction pour obtenir tous les points d'entrée
const getEntryPoints = () => {
  const entries: Record<string, string> = {
    // Point d'entrée principal pour la compatibilité
    index: path.resolve(__dirname, "src/index.ts"),
  };

  // Composants UI de base (shadcn)
  const uiComponents = [
    'button',
    'button-base',
    'button-circle',
    'select',
    'tabs',
    'input',
    'card',
    'dialog',
    'tooltip',
    'popover',
    'dropdown-menu',
    'accordion',
    'alert-dialog',
    'aspect-ratio',
    'avatar',
    'badge',
    'breadcrumb',
    'calendar',
    'carousel',
    'chart',
    'checkbox',
    'collapsible',
    'command',
    'context-menu',
    'date-picker',
    'drawer',
    'form',
    'hover-card',
    'input-otp',
    'label',
    'menubar',
    'modal-layer',
    'navigation-menu',
    'pagination',
    'progress',
    'radio-group',
    'resizable',
    'scroll-area',
    'separator',
    'sheet',
    'skeleton',
    'slider',
    'sonner',
    'switch',
    'table',
    'textarea',
    'toast',
    'toaster',
    'toggle',
    'toggle-group',
    'truncated-text',
    'file-browser',
    'folder-browser',
    'language-switcher',
    'icon-provider',
  ];

  // Ajouter les composants UI
  uiComponents.forEach(component => {
    const componentPath = path.resolve(__dirname, `src/components/ui/${component}.tsx`);
    if (fs.existsSync(componentPath)) {
      entries[`components/${component}`] = componentPath;
    }
  });

  // Composants métier complexes
  const businessComponents = [
    'ButtonStatus',
    'ButtonNotifications',
    'StatusIndicator',
    'MediaStatus',
    'PageHeader',
    'ThemeSwitcher',
    'ThemeCustomizer',
    'ColorInput',
  ];

  // Ajouter les composants métier
  businessComponents.forEach(component => {
    const componentPath = path.resolve(__dirname, `src/components/${component}.tsx`);
    if (fs.existsSync(componentPath)) {
      entries[`components/${component}`] = componentPath;
    }
  });

  // Contexts/Providers
  entries['providers/theme'] = path.resolve(__dirname, 'src/contexts/ThemeContext.tsx');
  entries['providers/translation'] = path.resolve(__dirname, 'src/contexts/TranslationContext.tsx');
  entries['providers/activity-status'] = path.resolve(__dirname, 'src/contexts/ActivityStatusContext.tsx');

  // Utilitaires
  entries['utils'] = path.resolve(__dirname, 'src/lib/utils.ts');
  entries['utils/translations'] = path.resolve(__dirname, 'src/utils/translations.ts');
  entries['utils/media-status'] = path.resolve(__dirname, 'src/utils/mediaStatus.ts');
  entries['utils/color'] = path.resolve(__dirname, 'src/utils/colorUtils.ts');
  entries['utils/notifications'] = path.resolve(__dirname, 'src/utils/notificationUtils.ts');

  // Icons
  entries['icons'] = path.resolve(__dirname, 'src/components/ui/icons/index.ts');

  return entries;
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.lib.json",
      rollupTypes: false, // Changé pour générer des types par module
      insertTypesEntry: true,
      copyDtsFiles: true,
    }),
  ],
  build: {
    lib: {
      entry: getEntryPoints(),
      name: "GSComponents",
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const extension = format === 'es' ? 'mjs' : 'cjs';
        return `${entryName}.${extension}`;
      },
    },
    cssCodeSplit: true, // Changé pour permettre le CSS splitting
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        // Ajouter les dépendances peer qui ne doivent pas être bundlées
        'tailwindcss',
        'next-themes',
        '@radix-ui/react-*',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
        },
        // Force l'utilisation d'exports nommés uniquement pour éviter les warnings
        exports: 'named',
        // Préserver la structure des modules pour faciliter les imports
        preserveModules: true,
        preserveModulesRoot: 'src',
        // Éviter de bundler les dépendances externes
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return assetInfo.name || '';
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    outDir: "dist",
    // Optimisation pour réduire la taille du bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});