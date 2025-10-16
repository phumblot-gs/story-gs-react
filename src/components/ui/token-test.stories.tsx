import type { Meta, StoryObj } from '@storybook/react';

const TokenTest = () => {
  const colors = [
    'black', 'white', 'grey', 'grey-light', 'grey-lighter',
    'grey-strong', 'grey-stronger', 'grey-strongest',
    'blue', 'blue-primary', 'green', 'green-primary',
    'yellow', 'pastel-yellow', 'orange', 'red-strong',
    'pink', 'purple', 'khaki', 'braun'
  ];

  const spacings = [
    'small', 'medium', 'large-standard',
    'xlarge', 'xxlarge', 'xxxlarge'
  ];

  const fontSizes = [
    'xs', 'sm', 'base', 'lg', 'xl'
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Tokens Figma Test</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Couleurs</h2>
        <div className="grid grid-cols-4 gap-4">
          {colors.map(color => (
            <div key={color} className="text-center">
              <div
                className="w-full h-20 rounded border"
                style={{ backgroundColor: `var(--color-${color})` }}
              />
              <p className="mt-2 text-xs">--color-{color}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Espacements</h2>
        <div className="space-y-2">
          {spacings.map(spacing => (
            <div key={spacing} className="flex items-center gap-4">
              <span className="text-sm w-32">--spacing-{spacing}</span>
              <div
                className="bg-blue-200"
                style={{
                  width: `var(--spacing-${spacing})`,
                  height: '20px'
                }}
              />
              <span className="text-xs text-gray-500">
                {getComputedStyle(document.documentElement)
                  .getPropertyValue(`--spacing-${spacing}`)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tailles de police</h2>
        <div className="space-y-2">
          {fontSizes.map(size => (
            <div
              key={size}
              style={{ fontSize: `var(--font-size-${size})` }}
            >
              Texte en --font-size-{size}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Couleurs de statut</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            'ignored', 'reshoot', 'not-selected', 'selected',
            'refused', 'for-approval', 'validated',
            'to-publish', 'error', 'published'
          ].map(status => (
            <div key={status} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: `var(--status-${status}-color)` }}
              />
              <span className="text-sm">{status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test avec composants existants</h2>
        <div className="space-y-4">
          <button
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: 'var(--color-black)',
              color: 'var(--color-white)',
              padding: 'var(--spacing-small) var(--spacing-medium)'
            }}
          >
            Bouton avec tokens
          </button>

          <div
            className="p-4 rounded"
            style={{
              backgroundColor: 'var(--color-grey-lighter)',
              border: '1px solid var(--color-grey-strong)'
            }}
          >
            <p style={{ fontSize: 'var(--font-size-base)' }}>
              Carte avec tokens Figma
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const meta: Meta = {
  title: 'System/Token Test',
  component: TokenTest,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div data-theme="dark" className="theme-dark min-h-screen bg-gray-900 text-white">
        <Story />
      </div>
    ),
  ],
};