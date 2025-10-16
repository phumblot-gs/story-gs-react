import React from "react";
import type { Preview } from "@storybook/react";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { TranslationProvider } from "../src/contexts/TranslationContext";
import "../src/index.css"; // Import your tailwind styles
import "../src/styles/figma-tokens.css"; // Import Figma tokens

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      sort: 'alpha',
    },
    // Ensure proper environment for theming
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#333333' },
      ],
    },
    themes: {
      clearable: false,
      list: [
        { name: 'Light', class: 'light', color: '#FFFFFF' },
        { name: 'Dark', class: 'dark', color: '#222222' },
      ]
    }
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <TranslationProvider defaultLanguage="FR">
          <Story />
        </TranslationProvider>
      </ThemeProvider>
    ),
  ],
};

export default preview;