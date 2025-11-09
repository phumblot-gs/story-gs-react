import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { Text } from '@/components/ui/text';
import { Layout } from '@/components/layout';

const Typography = () => {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Typography System</h2>
        <p className="text-gray-600 mb-6">
          The design system uses <strong>Avenir Next LT Pro</strong> as the primary font family.
          All components automatically use this font when configured properly.
        </p>
      </div>

      {/* Font Family */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Font Family</h3>
          <p className="text-sm text-gray-600 mb-4">
            The primary font family is <strong>Avenir Next LT Pro</strong>. It is applied automatically to all components.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto"><code>{`// Available font family classes:
font-sans        // Avenir Next LT Pro (default)
font-custom      // Avenir Next LT Pro
font-avenir      // Avenir Next LT Pro
font-mono        // Monospace font

// Usage:
<div className="font-sans">Text with Avenir Next</div>
<Text className="font-sans">Text component</Text>`}</code></pre>
        </div>
        </div>
      </section>

      {/* Font Weights */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Font Weights</h3>
          <p className="text-sm text-gray-600 mb-4">
            Available font weights and their corresponding Tailwind CSS classes.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Weight Name</th>
                  <th className="px-4 py-2 text-left font-semibold">CSS Class</th>
                  <th className="px-4 py-2 text-left font-semibold">Value</th>
                  <th className="px-4 py-2 text-left font-semibold">Description</th>
                  <th className="px-4 py-2 text-left font-semibold">Preview</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Light</td>
                  <td className="px-4 py-2 font-mono text-xs">font-light</td>
                  <td className="px-4 py-2 font-mono text-xs">300</td>
                  <td className="px-4 py-2 text-gray-600">Light weight for subtle emphasis</td>
                  <td className="px-4 py-2">
                    <span className="font-light text-lg">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Regular</td>
                  <td className="px-4 py-2 font-mono text-xs">font-regular</td>
                  <td className="px-4 py-2 font-mono text-xs">400</td>
                  <td className="px-4 py-2 text-gray-600">Default weight for body text</td>
                  <td className="px-4 py-2">
                    <span className="font-regular text-lg">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Normal</td>
                  <td className="px-4 py-2 font-mono text-xs">font-normal</td>
                  <td className="px-4 py-2 font-mono text-xs">400</td>
                  <td className="px-4 py-2 text-gray-600">Alias for regular weight</td>
                  <td className="px-4 py-2">
                    <span className="font-normal text-lg">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Medium</td>
                  <td className="px-4 py-2 font-mono text-xs">font-medium</td>
                  <td className="px-4 py-2 font-mono text-xs">500</td>
                  <td className="px-4 py-2 text-gray-600">Medium weight for subtitles and emphasis</td>
                  <td className="px-4 py-2">
                    <span className="font-medium text-lg">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Semibold</td>
                  <td className="px-4 py-2 font-mono text-xs">font-semibold</td>
                  <td className="px-4 py-2 font-mono text-xs">700</td>
                  <td className="px-4 py-2 text-gray-600">Semibold weight (uses bold value)</td>
                  <td className="px-4 py-2">
                    <span className="font-semibold text-lg">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Bold</td>
                  <td className="px-4 py-2 font-mono text-xs">font-bold</td>
                  <td className="px-4 py-2 font-mono text-xs">700</td>
                  <td className="px-4 py-2 text-gray-600">Bold weight for titles and strong emphasis</td>
                  <td className="px-4 py-2">
                    <span className="font-bold text-lg">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Heavy</td>
                  <td className="px-4 py-2 font-mono text-xs">font-heavy</td>
                  <td className="px-4 py-2 font-mono text-xs">900</td>
                  <td className="px-4 py-2 text-gray-600">Heavy weight for maximum emphasis</td>
                  <td className="px-4 py-2">
                    <span className="font-heavy text-lg">Sample Text</span>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <pre className="text-sm overflow-x-auto"><code>{`// Usage examples:
<Text className="font-light">Light text</Text>
<Text className="font-regular">Regular text</Text>
<Text className="font-medium">Medium text</Text>
<Text className="font-bold">Bold text</Text>
<Text className="font-heavy">Heavy text</Text>

// Available classes: font-light, font-regular, font-normal, font-medium, font-semibold, font-bold, font-heavy`}</code></pre>
          </div>
        </div>
      </section>

      {/* Font Sizes */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Font Sizes</h3>
          <p className="text-sm text-gray-600 mb-4">
            Available font sizes based on Figma design tokens. All sizes use rem units for accessibility.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Size Name</th>
                  <th className="px-4 py-2 text-left font-semibold">CSS Class</th>
                  <th className="px-4 py-2 text-left font-semibold">Rem</th>
                  <th className="px-4 py-2 text-left font-semibold">Pixels</th>
                  <th className="px-4 py-2 text-left font-semibold">Description</th>
                  <th className="px-4 py-2 text-left font-semibold">Preview</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Extra Small</td>
                  <td className="px-4 py-2 font-mono text-xs">text-xs</td>
                  <td className="px-4 py-2 font-mono text-xs">0.5625rem</td>
                  <td className="px-4 py-2 font-mono text-xs">9px</td>
                  <td className="px-4 py-2 text-gray-600">Very small text for labels and captions</td>
                  <td className="px-4 py-2">
                    <span className="text-xs">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Small</td>
                  <td className="px-4 py-2 font-mono text-xs">text-sm</td>
                  <td className="px-4 py-2 font-mono text-xs">0.6875rem</td>
                  <td className="px-4 py-2 font-mono text-xs">11px</td>
                  <td className="px-4 py-2 text-gray-600">Small text for secondary information</td>
                  <td className="px-4 py-2">
                    <span className="text-sm">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Base</td>
                  <td className="px-4 py-2 font-mono text-xs">text-base</td>
                  <td className="px-4 py-2 font-mono text-xs">0.8125rem</td>
                  <td className="px-4 py-2 font-mono text-xs">13px</td>
                  <td className="px-4 py-2 text-gray-600">Default size for body text</td>
                  <td className="px-4 py-2">
                    <span className="text-base">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Large</td>
                  <td className="px-4 py-2 font-mono text-xs">text-lg</td>
                  <td className="px-4 py-2 font-mono text-xs">1rem</td>
                  <td className="px-4 py-2 font-mono text-xs">16px</td>
                  <td className="px-4 py-2 text-gray-600">Large text for emphasis</td>
                  <td className="px-4 py-2">
                    <span className="text-lg">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Extra Large</td>
                  <td className="px-4 py-2 font-mono text-xs">text-xl</td>
                  <td className="px-4 py-2 font-mono text-xs">1.125rem</td>
                  <td className="px-4 py-2 font-mono text-xs">18px</td>
                  <td className="px-4 py-2 text-gray-600">Extra large text for headings</td>
                  <td className="px-4 py-2">
                    <span className="text-xl">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">2X Large</td>
                  <td className="px-4 py-2 font-mono text-xs">text-2xl</td>
                  <td className="px-4 py-2 font-mono text-xs">1.25rem</td>
                  <td className="px-4 py-2 font-mono text-xs">20px</td>
                  <td className="px-4 py-2 text-gray-600">2X large text for section titles</td>
                  <td className="px-4 py-2">
                    <span className="text-2xl">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">3X Large</td>
                  <td className="px-4 py-2 font-mono text-xs">text-3xl</td>
                  <td className="px-4 py-2 font-mono text-xs">1.5rem</td>
                  <td className="px-4 py-2 font-mono text-xs">24px</td>
                  <td className="px-4 py-2 text-gray-600">3X large text for main headings</td>
                  <td className="px-4 py-2">
                    <span className="text-3xl">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">4X Large</td>
                  <td className="px-4 py-2 font-mono text-xs">text-4xl</td>
                  <td className="px-4 py-2 font-mono text-xs">1.875rem</td>
                  <td className="px-4 py-2 font-mono text-xs">30px</td>
                  <td className="px-4 py-2 text-gray-600">4X large text for hero titles</td>
                  <td className="px-4 py-2">
                    <span className="text-4xl">Sample Text</span>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <pre className="text-sm overflow-x-auto"><code>{`// Usage examples:
<Text className="text-xs">Extra small text</Text>
<Text className="text-sm">Small text</Text>
<Text className="text-base">Base text (default)</Text>
<Text className="text-lg">Large text</Text>
<Text className="text-xl">Extra large text</Text>
<Text className="text-2xl">2X large text</Text>
<Text className="text-3xl">3X large text</Text>
<Text className="text-4xl">4X large text</Text>

// Available classes: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl`}</code></pre>
      </div>
        </div>
      </section>

      {/* Text Styles */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Text Styles</h3>
          <p className="text-sm text-gray-600 mb-4">
            Available text style modifiers for emphasis and decoration.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Style Name</th>
                  <th className="px-4 py-2 text-left font-semibold">CSS Class</th>
                  <th className="px-4 py-2 text-left font-semibold">Description</th>
                  <th className="px-4 py-2 text-left font-semibold">Preview</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Italic</td>
                  <td className="px-4 py-2 font-mono text-xs">italic</td>
                  <td className="px-4 py-2 text-gray-600">Italic style for emphasis and citations</td>
                  <td className="px-4 py-2">
                    <span className="italic">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Not Italic</td>
                  <td className="px-4 py-2 font-mono text-xs">not-italic</td>
                  <td className="px-4 py-2 text-gray-600">Remove italic style</td>
                  <td className="px-4 py-2">
                    <span className="not-italic">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Underline</td>
                  <td className="px-4 py-2 font-mono text-xs">underline</td>
                  <td className="px-4 py-2 text-gray-600">Underline text</td>
                  <td className="px-4 py-2">
                    <span className="underline">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">No Underline</td>
                  <td className="px-4 py-2 font-mono text-xs">no-underline</td>
                  <td className="px-4 py-2 text-gray-600">Remove underline</td>
                  <td className="px-4 py-2">
                    <span className="no-underline">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Line Through</td>
                  <td className="px-4 py-2 font-mono text-xs">line-through</td>
                  <td className="px-4 py-2 text-gray-600">Strikethrough text</td>
                  <td className="px-4 py-2">
                    <span className="line-through">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Uppercase</td>
                  <td className="px-4 py-2 font-mono text-xs">uppercase</td>
                  <td className="px-4 py-2 text-gray-600">Transform text to uppercase</td>
                  <td className="px-4 py-2">
                    <span className="uppercase">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Lowercase</td>
                  <td className="px-4 py-2 font-mono text-xs">lowercase</td>
                  <td className="px-4 py-2 text-gray-600">Transform text to lowercase</td>
                  <td className="px-4 py-2">
                    <span className="lowercase">Sample Text</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Capitalize</td>
                  <td className="px-4 py-2 font-mono text-xs">capitalize</td>
                  <td className="px-4 py-2 text-gray-600">Capitalize first letter of each word</td>
                  <td className="px-4 py-2">
                    <span className="capitalize">sample text</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <pre className="text-sm overflow-x-auto"><code>{`// Usage examples:
<Text className="italic">Italic text</Text>
<Text className="underline">Underlined text</Text>
<Text className="line-through">Strikethrough text</Text>
<Text className="uppercase">Uppercase text</Text>
<Text className="capitalize">Capitalized text</Text>

// Available classes: italic, not-italic, underline, no-underline, line-through, uppercase, lowercase, capitalize`}</code></pre>
          </div>
        </div>
      </section>

      {/* HTML Tag Styles */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">HTML Tag Styles (for Text component 'as' prop)</h3>
          <p className="text-sm text-gray-600 mb-4">
            When using the <code>Text</code> component with the <code>as</code> prop, you can render different HTML elements.
            Here are the default styles for common HTML tags and how to customize them with Tailwind classes.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">HTML Tag</th>
                  <th className="px-4 py-2 text-left font-semibold">Usage</th>
                  <th className="px-4 py-2 text-left font-semibold">Default Styles</th>
                  <th className="px-4 py-2 text-left font-semibold">Recommended Classes</th>
                  <th className="px-4 py-2 text-left font-semibold">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">h1</td>
                  <td className="px-4 py-2 text-gray-600">Main page title</td>
                  <td className="px-4 py-2 text-gray-600">Large, bold</td>
                  <td className="px-4 py-2 font-mono text-xs">text-4xl font-bold</td>
                  <td className="px-4 py-2">
                    <Text as="h1" className="text-4xl font-bold">Heading 1</Text>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">h2</td>
                  <td className="px-4 py-2 text-gray-600">Section title</td>
                  <td className="px-4 py-2 text-gray-600">Large, bold</td>
                  <td className="px-4 py-2 font-mono text-xs">text-3xl font-bold</td>
                  <td className="px-4 py-2">
                    <Text as="h2" className="text-3xl font-bold">Heading 2</Text>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">h3</td>
                  <td className="px-4 py-2 text-gray-600">Subsection title</td>
                  <td className="px-4 py-2 text-gray-600">Medium-large, bold</td>
                  <td className="px-4 py-2 font-mono text-xs">text-2xl font-bold</td>
                  <td className="px-4 py-2">
                    <Text as="h3" className="text-2xl font-bold">Heading 3</Text>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">h4</td>
                  <td className="px-4 py-2 text-gray-600">Sub-subsection title</td>
                  <td className="px-4 py-2 text-gray-600">Large, semibold</td>
                  <td className="px-4 py-2 font-mono text-xs">text-xl font-semibold</td>
                  <td className="px-4 py-2">
                    <Text as="h4" className="text-xl font-semibold">Heading 4</Text>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">h5</td>
                  <td className="px-4 py-2 text-gray-600">Small heading</td>
                  <td className="px-4 py-2 text-gray-600">Medium, semibold</td>
                  <td className="px-4 py-2 font-mono text-xs">text-lg font-semibold</td>
                  <td className="px-4 py-2">
                    <Text as="h5" className="text-lg font-semibold">Heading 5</Text>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">h6</td>
                  <td className="px-4 py-2 text-gray-600">Smallest heading</td>
                  <td className="px-4 py-2 text-gray-600">Base, semibold</td>
                  <td className="px-4 py-2 font-mono text-xs">text-base font-semibold</td>
                  <td className="px-4 py-2">
                    <Text as="h6" className="text-base font-semibold">Heading 6</Text>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">p</td>
                  <td className="px-4 py-2 text-gray-600">Paragraph text</td>
                  <td className="px-4 py-2 text-gray-600">Base, regular</td>
                  <td className="px-4 py-2 font-mono text-xs">text-base font-regular</td>
                  <td className="px-4 py-2">
                    <Text as="p" className="text-base font-regular">Paragraph text</Text>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">span</td>
                  <td className="px-4 py-2 text-gray-600">Inline text (default)</td>
                  <td className="px-4 py-2 text-gray-600">Base, regular</td>
                  <td className="px-4 py-2 font-mono text-xs">text-base font-regular</td>
                  <td className="px-4 py-2">
                    <Text as="span" className="text-base font-regular">Inline text</Text>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">div</td>
                  <td className="px-4 py-2 text-gray-600">Block container</td>
                  <td className="px-4 py-2 text-gray-600">Base, regular</td>
                  <td className="px-4 py-2 font-mono text-xs">text-base font-regular</td>
                  <td className="px-4 py-2">
                    <Text as="div" className="text-base font-regular">Block text</Text>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">strong</td>
                  <td className="px-4 py-2 text-gray-600">Strong emphasis</td>
                  <td className="px-4 py-2 text-gray-600">Base, bold</td>
                  <td className="px-4 py-2 font-mono text-xs">text-base font-bold</td>
                  <td className="px-4 py-2">
                    <Text as="strong" className="text-base font-bold">Strong text</Text>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">em</td>
                  <td className="px-4 py-2 text-gray-600">Emphasis</td>
                  <td className="px-4 py-2 text-gray-600">Base, italic</td>
                  <td className="px-4 py-2 font-mono text-xs">text-base italic</td>
                  <td className="px-4 py-2">
                    <Text as="em" className="text-base italic">Emphasized text</Text>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs">small</td>
                  <td className="px-4 py-2 text-gray-600">Small text</td>
                  <td className="px-4 py-2 text-gray-600">Small, regular</td>
                  <td className="px-4 py-2 font-mono text-xs">text-sm font-regular</td>
                  <td className="px-4 py-2">
                    <Text as="small" className="text-sm font-regular">Small text</Text>
                  </td>
                </tr>
              </tbody>
            </table>
        </div>
          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <pre className="text-sm overflow-x-auto"><code>{`// Usage examples with Text component:
import { Text } from '@gs/gs-components-library';

// Headings
<Text as="h1" className="text-4xl font-bold">Main Title</Text>
<Text as="h2" className="text-3xl font-bold">Section Title</Text>
<Text as="h3" className="text-2xl font-bold">Subsection Title</Text>

// Paragraphs
<Text as="p" className="text-base font-regular">Paragraph text</Text>

// Inline elements
<Text as="span" className="text-base font-regular">Inline text</Text>
<Text as="strong" className="text-base font-bold">Strong text</Text>
<Text as="em" className="text-base italic">Emphasized text</Text>
<Text as="small" className="text-sm font-regular">Small text</Text>

// Available 'as' values: 'span' | 'p' | 'div' | 'strong' | 'em' | 'small'
// Note: You can also use h1-h6 by extending the Text component type if needed`}</code></pre>
          </div>
        </div>
      </section>

      {/* Line Heights */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Line Heights</h3>
          <p className="text-sm text-gray-600 mb-4">
            Available line height values for controlling vertical spacing between lines of text.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Line Height Name</th>
                  <th className="px-4 py-2 text-left font-semibold">CSS Class</th>
                  <th className="px-4 py-2 text-left font-semibold">Value</th>
                  <th className="px-4 py-2 text-left font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Tight</td>
                  <td className="px-4 py-2 font-mono text-xs">leading-tight</td>
                  <td className="px-4 py-2 font-mono text-xs">1</td>
                  <td className="px-4 py-2 text-gray-600">Tight line height for headings</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">125</td>
                  <td className="px-4 py-2 font-mono text-xs">leading-125</td>
                  <td className="px-4 py-2 font-mono text-xs">1.25</td>
                  <td className="px-4 py-2 text-gray-600">Slightly tight line height</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Normal</td>
                  <td className="px-4 py-2 font-mono text-xs">leading-normal</td>
                  <td className="px-4 py-2 font-mono text-xs">1.5</td>
                  <td className="px-4 py-2 text-gray-600">Default line height for body text</td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="px-4 py-2 font-semibold">Relaxed</td>
                  <td className="px-4 py-2 font-mono text-xs">leading-relaxed</td>
                  <td className="px-4 py-2 font-mono text-xs">1.75</td>
                  <td className="px-4 py-2 text-gray-600">Relaxed line height for readability</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mt-4">
            <pre className="text-sm overflow-x-auto"><code>{`// Usage examples:
<Text className="leading-tight">Tight line height</Text>
<Text className="leading-normal">Normal line height</Text>
<Text className="leading-relaxed">Relaxed line height</Text>

// Available classes: leading-tight, leading-125, leading-normal, leading-relaxed`}</code></pre>
          </div>
        </div>
      </section>

      {/* Complete Examples */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Complete Usage Examples</h3>
      <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Typography Hierarchy Example</h4>
              <pre className="text-sm overflow-x-auto"><code>{`import { Text, Layout } from '@gs/gs-components-library';

<Layout bg="white" padding={6}>
  <Text as="h1" className="text-4xl font-bold mb-4">
    Main Page Title
  </Text>
  <Text as="h2" className="text-3xl font-bold mb-3">
    Section Title
  </Text>
  <Text as="p" className="text-base font-regular leading-normal mb-4">
    This is a paragraph with normal line height. It provides good readability
    for body text and maintains consistent spacing.
  </Text>
  <Text as="p" className="text-sm font-regular italic text-grey-strongest">
    This is a small italic note for additional information.
  </Text>
</Layout>`}</code></pre>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Combining Multiple Styles</h4>
              <pre className="text-sm overflow-x-auto"><code>{`// Combine size, weight, style, and color
<Text className="text-xl font-bold italic uppercase text-blue-primary">
  Styled Text
</Text>

// Multiple classes for complex styling
<Text 
  as="h2" 
  className="text-3xl font-bold leading-tight underline text-black"
>
  Heading with Underline
</Text>`}</code></pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const meta = {
  title: 'Design System/Typography',
  component: Typography,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Typography System

The design system uses **Avenir Next LT Pro** as the primary font family.
All typography tokens are based on Figma design tokens and can be applied using Tailwind CSS classes.

### Font Family

The primary font is **Avenir Next LT Pro**, applied automatically to all components.

### Font Weights

Available weights: light (300), regular (400), medium (500), semibold (700), bold (700), heavy (900)

### Font Sizes

Available sizes: xs (9px), sm (11px), base (13px), lg (16px), xl (18px), 2xl (20px), 3xl (24px), 4xl (30px)

### Text Component

The \`Text\` component automatically adapts its color based on the parent \`data-bg\` context.
Use the \`as\` prop to render different HTML elements (h1-h6, p, span, div, strong, em, small).

### Usage

\`\`\`tsx
import { Text } from '@gs/gs-components-library';

<Text as="h1" className="text-4xl font-bold">Title</Text>
<Text as="p" className="text-base font-regular">Body text</Text>
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Typography Overview',
};

export const FontWeights: Story = {
  name: 'Font Weights',
  render: () => (
    <div className="p-8 space-y-4">
      <div className="space-y-2">
        <p className="font-light text-2xl">Light (300)</p>
        <p className="font-regular text-2xl">Regular (400)</p>
        <p className="font-normal text-2xl">Normal (400)</p>
        <p className="font-medium text-2xl">Medium (500)</p>
        <p className="font-semibold text-2xl">Semibold (700)</p>
        <p className="font-bold text-2xl">Bold (700)</p>
        <p className="font-heavy text-2xl">Heavy (900)</p>
      </div>
    </div>
  ),
};

export const FontSizes: Story = {
  name: 'Font Sizes',
  render: () => (
    <div className="p-8 space-y-2">
      <p className="text-xs">Extra Small (text-xs) - 9px</p>
      <p className="text-sm">Small (text-sm) - 11px</p>
      <p className="text-base">Base (text-base) - 13px</p>
      <p className="text-lg">Large (text-lg) - 16px</p>
      <p className="text-xl">Extra Large (text-xl) - 18px</p>
      <p className="text-2xl">2X Large (text-2xl) - 20px</p>
      <p className="text-3xl">3X Large (text-3xl) - 24px</p>
      <p className="text-4xl">4X Large (text-4xl) - 30px</p>
    </div>
  ),
};

export const TextStyles: Story = {
  name: 'Text Styles',
  render: () => (
    <div className="p-8 space-y-2">
      <p className="italic">Italic text</p>
      <p className="underline">Underlined text</p>
      <p className="line-through">Strikethrough text</p>
      <p className="uppercase">Uppercase text</p>
      <p className="lowercase">Lowercase text</p>
      <p className="capitalize">capitalized text</p>
    </div>
  ),
};

export const HTMLTags: Story = {
  name: 'HTML Tag Styles',
  render: () => (
    <Layout bg="white" padding={6}>
        <div className="space-y-4">
        <Text as="h1" className="text-4xl font-bold">Heading 1</Text>
        <Text as="h2" className="text-3xl font-bold">Heading 2</Text>
        <Text as="h3" className="text-2xl font-bold">Heading 3</Text>
        <Text as="h4" className="text-xl font-semibold">Heading 4</Text>
        <Text as="h5" className="text-lg font-semibold">Heading 5</Text>
        <Text as="h6" className="text-base font-semibold">Heading 6</Text>
        <Text as="p" className="text-base font-regular">
          This is a paragraph with regular weight and base size. It demonstrates
          how body text should appear in the design system.
        </Text>
        <Text as="strong" className="text-base font-bold">Strong text</Text>
        <Text as="em" className="text-base italic">Emphasized text</Text>
        <Text as="small" className="text-sm font-regular">Small text</Text>
      </div>
    </Layout>
  ),
};
