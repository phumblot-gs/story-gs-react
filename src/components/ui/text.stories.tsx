import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './text';
import { Layout } from '../layout/Layout';

const meta = {
  title: 'UI/Text',
  component: Text,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Text component that automatically adapts its color based on the nearest parent \`data-bg\` context.

## Features
- **Context-aware color**: Automatically adapts text color to parent background context
- **Semantic HTML**: Supports multiple HTML elements via the \`as\` prop
- **Simple API**: Just wrap your text content

## Color Mapping

The Text component automatically determines its color based on the parent Layout's \`data-bg\` context:

- **Parent \`data-bg="white"\`** → Text displays in **black**
- **Parent \`data-bg="grey"\`** → Text displays in **black**
- **Parent \`data-bg="black"\`** → Text displays in **white**

## Basic Usage

\`\`\`tsx
import { Text } from '@story-gs-react';
import { Layout } from '@story-gs-react';

<Layout bg="white">
  <Text>This text will be black</Text>
</Layout>

<Layout bg="black">
  <Text>This text will be white</Text>
</Layout>
\`\`\`

## HTML Elements

Use the \`as\` prop to render different HTML elements:

\`\`\`tsx
<Text as="p">Paragraph text</Text>
<Text as="div">Div text</Text>
<Text as="strong">Bold text</Text>
<Text as="em">Italic text</Text>
<Text as="small">Small text</Text>
\`\`\`

**Available elements:** \`span\` (default), \`p\`, \`div\`, \`strong\`, \`em\`, \`small\`

## Examples

### Basic text
\`\`\`tsx
<Text>Simple text content</Text>
\`\`\`

### Paragraph text
\`\`\`tsx
<Text as="p">This is a paragraph of text that adapts to the background context.</Text>
\`\`\`

### Custom styling
\`\`\`tsx
<Text className="text-lg font-bold">Custom styled text</Text>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['span', 'p', 'div', 'strong', 'em', 'small'],
      description: 'HTML element to render. Default: span',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <Story />
      </Layout>
    ),
  ],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Text>
      This text automatically adapts its color based on the parent background context.
    </Text>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold mb-4">White Background</h3>
        <Layout bg="white" padding={6}>
          <Text>
            This text is displayed on a white background, so it uses black color.
          </Text>
        </Layout>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-4">Grey Background</h3>
        <Layout bg="grey" padding={6}>
          <Text>
            This text is displayed on a grey background, so it uses black color.
          </Text>
        </Layout>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-4">Black Background</h3>
        <Layout bg="black" padding={6}>
          <Text>
            This text is displayed on a black background, so it uses white color.
          </Text>
        </Layout>
      </div>
    </div>
  ),
};

export const AsParagraph: Story = {
  render: () => (
    <Text as="p">
      This text is rendered as a paragraph element. It still adapts its color based on the background context.
    </Text>
  ),
};

export const AsDiv: Story = {
  render: () => (
    <Text as="div">
      This text is rendered as a div element. You can use this for block-level text content.
    </Text>
  ),
};

export const WithCustomStyles: Story = {
  render: () => (
    <div className="space-y-4">
      <Text className="text-lg font-bold">
        Large bold text that adapts to context
      </Text>
      <Text className="text-sm italic">
        Small italic text that adapts to context
      </Text>
      <Text as="strong" className="text-xl">
        Extra large strong text that adapts to context
      </Text>
    </div>
  ),
};

export const NestedContexts: Story = {
  render: () => (
    <div className="space-y-4">
      <Layout bg="white" padding={6}>
        <Text>Text on white background (black text)</Text>
        <Layout bg="black" padding={4} className="mt-4">
          <Text>Text on black background inside white (white text)</Text>
        </Layout>
      </Layout>
    </div>
  ),
};

