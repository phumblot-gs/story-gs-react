
import type { StorybookConfig } from "@storybook/react-vite";
import { join } from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  // Configuration pour servir les fonts statiques
  staticDirs: [
    {
      from: "../src/fonts",
      to: "/fonts"
    },
    "../public"
  ],
  // Configuration Vite pour les fonts
  async viteFinal(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@/fonts": join(__dirname, "../src/fonts"),
        },
      },
    };
  },
};

export default config;
