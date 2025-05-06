
import type { Preview } from "@storybook/react";
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
};

export default preview;
