import type { Meta, StoryObj } from '@storybook/react';
import { TestApp, IntegrationTest } from '../../test-integration';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { TranslationProvider } from '../../contexts/TranslationContext';

const meta = {
  title: 'Integration/Full Test Suite',
  component: IntegrationTest,
  parameters: {
    layout: 'fullscreen',
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
} satisfies Meta<typeof IntegrationTest>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CompleteIntegration: Story = {
  name: '🧪 Complete Integration Test',
  parameters: {
    docs: {
      description: {
        story: 'Test complet de tous les providers et composants ensemble',
      },
    },
  },
};

export const FrenchDefault: Story = {
  name: '🇫🇷 French Default',
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

export const EnglishDefault: Story = {
  name: '🇬🇧 English Default',
  decorators: [
    (Story) => (
      <ThemeProvider>
        <TranslationProvider defaultLanguage="EN">
          <Story />
        </TranslationProvider>
      </ThemeProvider>
    ),
  ],
};

export const CustomTheme: Story = {
  name: '🎨 Custom Theme',
  decorators: [
    (Story) => (
      <ThemeProvider
        initialCustomization={{
          colors: {
            bgBlack: '#FF5733',
            textBluePrimary: '#33FF57',
          },
        }}
      >
        <TranslationProvider defaultLanguage="EN">
          <Story />
        </TranslationProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Test avec un thème personnalisé initial',
      },
    },
  },
};