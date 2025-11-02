
import type { StorybookConfig } from "@storybook/react-vite";
import { join } from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-docs", "@storybook/addon-mcp"],

  framework: {
    name: "@storybook/react-vite",
    options: {},
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
          "@storybook/blocks": join(__dirname, "../node_modules/@storybook/addon-docs/dist/blocks.mjs"),
          "@storybook/test": join(__dirname, "../node_modules/storybook/dist/test/index.mjs"),
          "@storybook/preview-api": join(__dirname, "../node_modules/storybook/dist/preview-api/index.mjs"),
        },
      },
      // Forcer Storybook à utiliser le runtime JSX de développement même en production
      // car Storybook dev nécessite _jsxDEV
      define: {
        ...config.define,
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        include: ["react", "react-dom", "react/jsx-dev-runtime"],
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
