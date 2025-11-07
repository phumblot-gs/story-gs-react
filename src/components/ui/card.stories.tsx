import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';
import { Layout } from '../layout/Layout';
import { Button } from './button';

const meta = {
  title: 'Layout/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Card component built with the Figma design system. Displays a card with optional header, content, and footer sections.

## Features
- **Context-aware styling**: Automatically adapts to parent Layout background context
- **Optional sections**: Header and footer are optional, allowing flexible content structure
- **Shadcn compatible**: Follows the same API structure as shadcn/ui Card component
- **Automatic context propagation**: Exposes its own \`data-bg\` context for child components

## Background Context Mapping

The Card component automatically determines its appearance based on the parent Layout's \`data-bg\` context:

- **Parent \`data-bg="white"\`** → Card displays with **grey** background (exposes \`data-bg="grey"\` for children)
- **Parent \`data-bg="grey"\`** → Card displays with **white** background (exposes \`data-bg="white"\` for children)
- **Parent \`data-bg="black"\`** → Card displays with **black** background (exposes \`data-bg="black"\` for children)

## Basic Usage

\`\`\`tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@story-gs-react';
import { Layout } from '@story-gs-react';

<Layout bg="white">
  <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card description text</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Card content goes here</p>
    </CardContent>
    <CardFooter>
      <Button>Action</Button>
    </CardFooter>
  </Card>
</Layout>
\`\`\`

## Component Structure

- **Card**: Root container component
- **CardHeader**: Optional header section (contains title and description)
- **CardTitle**: Title text (uppercase, bold)
- **CardDescription**: Description text (regular weight)
- **CardContent**: Main content area
- **CardFooter**: Optional footer section (typically for actions)

## Context Propagation

The Card component creates a new background context for its children, allowing nested components to adapt correctly:

\`\`\`tsx
<Layout bg="white">
  {/* Card detects white context and displays grey */}
  <Card>
    {/* Card exposes grey context for children */}
    <CardContent>
      <Button>Button adapts to grey context</Button>
    </CardContent>
  </Card>
</Layout>
\`\`\`

## Shadow Effect

The Card component supports an optional shadow effect with smooth hover transition:

\`\`\`tsx
<Card cardShadow={true}>
  <CardHeader>
    <CardTitle>Card with Shadow</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Hover over this card to see the shadow effect</p>
  </CardContent>
</Card>
\`\`\`

When \`cardShadow={true}\`, the Card automatically applies:
- \`shadow-md\` by default
- \`hover:shadow-lg\` on hover
- \`transition-shadow\` for smooth transition

## Examples

### Card with all sections
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Complete Card</CardTitle>
    <CardDescription>With header, content, and footer</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content area</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
\`\`\`

### Card without header
\`\`\`tsx
<Card>
  <CardContent>
    <p>Content without header</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
\`\`\`

### Card without footer
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content without footer</p>
  </CardContent>
</Card>
\`\`\`

### Custom content
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Custom Card</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Any custom content */}
    <div className="custom-content">
      <CustomComponent />
    </div>
  </CardContent>
</Card>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes',
    },
    cardShadow: {
      control: 'boolean',
      description: 'Enable shadow effect with hover transition (shadow-md by default, shadow-lg on hover)',
    },
    footer: {
      control: false,
      description: 'Optional footer content to display below the Card',
    },
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <Story />
      </Layout>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des plans</CardTitle>
        <CardDescription>
          Gérer les plans, leurs fonctionnalités et leurs tarifs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex gap-5 items-center">
          <Button variant="link">Annuler</Button>
          <Button size="medium">Enregistrer</Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const AllBackgrounds: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-bold mb-4">White Background</h3>
        <Layout bg="white" padding={6}>
          <Card>
            <CardHeader>
              <CardTitle>Card on White</CardTitle>
              <CardDescription>Card displays with grey background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[13px] leading-[19.5px]">
                This card is displayed on a white background, so it uses the grey variant.
              </p>
            </CardContent>
          </Card>
        </Layout>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-4">Grey Background</h3>
        <Layout bg="grey" padding={6}>
          <Card>
            <CardHeader>
              <CardTitle>Card on Grey</CardTitle>
              <CardDescription>Card displays with white background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[13px] leading-[19.5px]">
                This card is displayed on a grey background, so it uses the white variant.
              </p>
            </CardContent>
          </Card>
        </Layout>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-4">Black Background</h3>
        <Layout bg="black" padding={6}>
          <Card>
            <CardHeader>
              <CardTitle>Card on Black</CardTitle>
              <CardDescription>Card displays with black background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[13px] leading-[19.5px]">
                This card is displayed on a black background, so it uses the black variant.
              </p>
            </CardContent>
          </Card>
        </Layout>
      </div>
    </div>
  ),
};

export const WithoutHeader: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">
          Card content without header section.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="medium">Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">
          Card content without footer section.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithButtons: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card with Actions</CardTitle>
        <CardDescription>Example with multiple buttons in footer</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">
          This card demonstrates how buttons adapt to the card's context.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex gap-5 items-center">
          <Button variant="link">Annuler</Button>
          <Button size="medium" variant="secondary">Secondary</Button>
          <Button size="medium">Primary</Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const WithShadow: Story = {
  render: () => (
    <Card cardShadow={true}>
      <CardHeader>
        <CardTitle>Card with Shadow</CardTitle>
        <CardDescription>Hover over this card to see the shadow effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-[13px] leading-[19.5px]">
          This card has the shadow effect enabled. Move your mouse over it to see the shadow transition.
        </p>
      </CardContent>
      <CardFooter>
        <div className="flex gap-5 items-center">
          <Button variant="link">Annuler</Button>
          <Button size="medium">Enregistrer</Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const NestedCards: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Parent Card</CardTitle>
        <CardDescription>Card containing another card</CardDescription>
      </CardHeader>
      <CardContent>
        <Card>
          <CardHeader>
            <CardTitle>Nested Card</CardTitle>
            <CardDescription>This card is nested inside another card</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[13px] leading-[19.5px]">
              The nested card adapts to the parent card's context.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  ),
};

