import type { Preview } from "@storybook/react";
import "../src/index.css";

// Forcer NODE_ENV en développement pour le runtime JSX
if (typeof process !== "undefined") {
  process.env.NODE_ENV = "development";
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Context",
          "Design System",
          "Layout",
          "Components",
          "UI",
        ],
        method: "alphabetical",
      },
    },
  },
};

export default preview;

