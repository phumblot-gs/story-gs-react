import type { Preview } from "@storybook/react-vite";
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
        // Sensible à la casse : /Date$/i attrapait onValidate (« onVali-date »).
        date: /(^date|Date)$/,
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

