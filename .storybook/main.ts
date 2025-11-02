
import type { StorybookConfig } from "@storybook/react-vite";
import { join } from "path";
import { forceJsxDevRuntime } from "./vite-plugin-jsx-dev";

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
      plugins: [
        ...(config.plugins || []),
        forceJsxDevRuntime(),
      ],
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@/fonts": join(__dirname, "../src/fonts"),
          // @storybook/blocks reste nécessaire pour les fichiers .mdx
          "@storybook/blocks": join(__dirname, "../node_modules/@storybook/addon-docs/dist/blocks.mjs"),
          // storybook/test et storybook/preview-api sont résolus automatiquement par Storybook
          // Pas besoin d'alias explicite
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
