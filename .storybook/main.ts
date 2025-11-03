
import type { StorybookConfig } from "@storybook/react-vite";
import { join } from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-docs", "@storybook/addon-mcp"],

  framework: {
    name: "@storybook/react-vite",
    options: {
      // Forcer le mode développement pour React
      strictMode: true,
    },
  },

  // Configuration pour servir les fonts statiques
  staticDirs: [
    {
      from: "../src/fonts",
      to: "/fonts"
    },
    "../public"
  ],

  // Configuration Vite pour les fonts et résolution des modules Storybook
  async viteFinal(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@/fonts": join(__dirname, "../src/fonts"),
          // @storybook/blocks reste nécessaire pour les fichiers .mdx
          "@storybook/blocks": join(__dirname, "../node_modules/@storybook/addon-docs/dist/blocks.mjs"),
          // Alias pour @storybook/addon-actions (utilisé par certaines dépendances)
          // Dans Storybook 9.1.16, les actions sont exportées via storybook/actions
          "@storybook/addon-actions": "storybook/actions",
          // Alias pour storybook/test - dans Storybook 9.1.16, cela pointe vers le package storybook lui-même
          // qui exporte les utilitaires de test via son système d'exports
          "storybook/test": "storybook",
          // Alias pour @storybook/test (utilisé par certaines dépendances)
          "@storybook/test": "storybook",
          // Alias pour storybook/preview-api et @storybook/preview-api
          // Dans Storybook 9.1.16, preview-api est exporté via storybook/preview-api
          "storybook/preview-api": "storybook/preview-api",
          "@storybook/preview-api": "storybook/preview-api",
        },
      },
      // Forcer Storybook à utiliser le runtime JSX de développement même en production
      // car Storybook dev nécessite _jsxDEV
      define: {
        ...config.define,
        "process.env.NODE_ENV": JSON.stringify("development"),
        "__DEV__": "true",
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: [
          "react",
          "react-dom",
          "react/jsx-dev-runtime",
          "react/jsx-runtime",
        ],
        esbuildOptions: {
          ...config.optimizeDeps?.esbuildOptions,
          jsx: "automatic",
          jsxDev: true,
        },
      },
      esbuild: {
        ...config.esbuild,
        jsx: "automatic",
        jsxDev: true,
      },
    };
  }
};

export default config;
