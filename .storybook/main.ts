import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "node:url";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  core: {
    // Le serveur de dev tourne derrière Caddy, oauth2-proxy et mcp-auth-proxy
    // (deploy/aws) : Storybook refuse par défaut les noms d'hôte autres que localhost.
    allowedHosts: ["gs-components-library.grand-shooting.org", "storybook"],
  },

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

  // Configuration Vite : alias des fonts et runtime JSX de développement
  async viteFinal(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@/fonts": fileURLToPath(new URL("../src/fonts", import.meta.url)),
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
