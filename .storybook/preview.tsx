import React from "react";
import type { Preview } from "@storybook/react";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { TranslationProvider } from "../src/contexts/TranslationContext";
import { StyleProvider } from "../src/contexts/StyleProvider";
import "../src/index.css"; // Import your tailwind styles

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
      <StyleProvider
        config={{
          applyGlobalStyles: true,
          loadFonts: true,
          customFontFamily: '"AvenirNextLTPro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <ThemeProvider>
          <TranslationProvider defaultLanguage="FR">
            <Story />
          </TranslationProvider>
        </ThemeProvider>
      </StyleProvider>
    ),
  ],
};

export default preview;