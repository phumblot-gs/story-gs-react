import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, useEffect } from "react";
import { ActionBar, ActionBarProvider } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Layout, VStack, HStack } from "@/components/layout";
import { TranslationProvider } from "@/contexts/TranslationContext";

const meta = {
  title: "Components/ActionBar",
  component: ActionBar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `ActionBar component built with the Figma design system. ActionBar displays a bottom action bar when items are selected.

## Features
- Automatic display when selectedCount > 0
- Single ActionBar visible at a time (managed by ActionBarContext)
- Selection counter with translation support
- "Deselect all" button (optional)
- Custom action buttons via children
- Fixed position at bottom of window (default) or relative to container
- Black background with 50px height (default, configurable)

## Basic Usage

\`\`\`tsx
import { ActionBar } from '@story-gs-react';
import { ActionBarProvider } from '@story-gs-react';
import { useState } from 'react';

function App() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <ActionBarProvider>
      <YourContent />
      <ActionBar
        selectedCount={selected.length}
        translationKey="actionBar.filesSelected"
        onDeselectAll={() => setSelected([])}
      >
        <Button variant="normal">Valider</Button>
        <Button variant="destructive">Supprimer</Button>
      </ActionBar>
    </ActionBarProvider>
  );
}
\`\`\`

## Multiple ActionBars

Multiple ActionBar instances can exist, but only one is visible at a time. The last modified ActionBar (selection changed) becomes active:

\`\`\`tsx
<ActionBarProvider>
  {/* ActionBar for files */}
  <ActionBar
    selectedCount={fileSelection.length}
    translationKey="actionBar.filesSelected"
    onDeselectAll={() => setFileSelection([])}
  >
    <Button>Upload Files</Button>
  </ActionBar>

  {/* ActionBar for images */}
  <ActionBar
    selectedCount={imageSelection.length}
    translationKey="actionBar.imagesSelected"
    onDeselectAll={() => setImageSelection([])}
  >
    <Button>Edit Images</Button>
  </ActionBar>
</ActionBarProvider>
\`\`\`

## Translation Keys

Use the \`translationKey\` prop to customize the selection message. The system supports pluralization via the \`count\` and \`plural\` parameters:

\`\`\`tsx
<ActionBar
  selectedCount={5}
    translationKey="actionBar.filesSelected"
    // Will display: "{count} fichier{plural} sélectionné{plural}" (translated)
/>
\`\`\`

**Available translation keys:**
- \`actionBar.filesSelected\`: "{count} fichier{plural} sélectionné{plural}"
- \`actionBar.imagesSelected\`: "{count} image{plural} sélectionnée{plural}"
- \`actionBar.itemsSelected\`: "{count} élément{plural} sélectionné{plural}"
- \`actionBar.deselectAll\`: "Tout désélectionner" (used automatically for the deselect button, default)

The translation system automatically handles pluralization based on the \`count\` parameter.

**Customizing the "Deselect All" translation:**

By default, the "Deselect All" button uses the \`actionBar.deselectAll\` translation key. You can customize it using the \`deselectAllTranslationKey\` prop:

\`\`\`tsx
<ActionBar
  selectedCount={5}
  deselectAllTranslationKey="actionBar.deselectAll" // Default value
  // or use a custom key:
  // deselectAllTranslationKey="ma.traduction.custom"
/>
\`\`\`

## Custom Styling

Customize the ActionBar appearance using \`hStackProps\`:

\`\`\`tsx
<ActionBar
  selectedCount={3}
  hStackProps={{
    bg: "black",
    padding: 6,
    gap: 4,
  }}
  className="h-16"
>
  <Button>Action</Button>
</ActionBar>
\`\`\``,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectedCount: {
      control: 'number',
      description: 'Number of selected items. ActionBar displays automatically when > 0',
    },
    translationKey: {
      control: 'text',
      description: 'Translation key for the selection message (e.g., "actionBar.filesSelected"). The translation should use {count} and {plural} placeholders.',
    },
    onDeselectAll: {
      action: 'deselectAll',
      description: 'Callback called when "Deselect all" button is clicked',
    },
    deselectAllTranslationKey: {
      control: 'text',
      description: 'Translation key for the "Deselect All" button (e.g., "actionBar.deselectAll"). Default: "actionBar.deselectAll"',
    },
    className: {
      control: 'text',
      description: 'Additional Tailwind CSS classes for the container',
    },
  },
  decorators: [
    (Story) => (
      <TranslationProvider>
        <ActionBarProvider>
          <Story />
        </ActionBarProvider>
      </TranslationProvider>
    ),
  ],
} satisfies Meta<typeof ActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedCount: 3,
    translationKey: "actionBar.filesSelected",
    showSelectionInfo: true,
    deselectAllTranslationKey: "actionBar.deselectAll",
  },
  render: function Render(args) {
    const [selectedCount, setSelectedCount] = useState(args.selectedCount ?? 0);

    // Synchroniser avec les args quand ils changent depuis les contrôles
    useEffect(() => {
      if (args.selectedCount !== undefined && args.selectedCount !== selectedCount) {
        setSelectedCount(args.selectedCount);
      }
    }, [args.selectedCount]);

    // Synchroniser showSelectionInfo avec les args
    const handleDeselectAll = () => {
      setSelectedCount(0);
      args.onDeselectAll?.();
    };

    return (
      <>
        <Layout bg="grey" padding={8} className="min-h-screen pb-20">
          <VStack gap={6}>
            <h2 className="gs-typo-h1">ActionBar Example</h2>
            <p className="text-sm text-grey-stronger">
              Select items to see the ActionBar appear at the bottom.
              Use the controls below to modify the ActionBar props.
            </p>
            <HStack gap={4}>
              <Button onClick={() => {
                const newCount = selectedCount + 1;
                setSelectedCount(newCount);
              }}>
                Select Item
              </Button>
              <Button onClick={() => {
                const newCount = Math.max(0, selectedCount - 1);
                setSelectedCount(newCount);
              }}>
                Deselect Item
              </Button>
              <Button onClick={() => {
                setSelectedCount(0);
              }}>
                Clear Selection
              </Button>
            </HStack>
            <div className="text-sm">
              Currently selected: {selectedCount} item{selectedCount !== 1 ? 's' : ''}
            </div>
          </VStack>
        </Layout>
        <ActionBar
          {...args}
          selectedCount={selectedCount}
          onDeselectAll={handleDeselectAll}
        >
          <Button variant="normal">Valider</Button>
          <Button variant="destructive">Supprimer</Button>
        </ActionBar>
      </>
    );
  },
};

export const WithMultipleActions: Story = {
  render: () => {
    const [selectedCount, setSelectedCount] = useState(3);

    return (
      <>
        <Layout bg="grey" padding={8} className="min-h-screen pb-20">
          <VStack gap={6}>
            <h2 className="gs-typo-h1">Multiple Actions</h2>
            <p className="text-sm text-grey-stronger">
              ActionBar with multiple action buttons.
            </p>
            <HStack gap={4}>
              <Button onClick={() => setSelectedCount(prev => prev + 1)}>
                Select Item
              </Button>
              <Button onClick={() => setSelectedCount(prev => Math.max(0, prev - 1))}>
                Deselect Item
              </Button>
            </HStack>
          </VStack>
        </Layout>
        <ActionBar
          selectedCount={selectedCount}
          translationKey="actionBar.filesSelected"
          onDeselectAll={() => setSelectedCount(0)}
        >
          <Button variant="secondary">Exporter</Button>
          <Button variant="normal">Valider</Button>
          <Button variant="destructive">Supprimer</Button>
        </ActionBar>
      </>
    );
  },
};

export const WithoutSelectionInfo: Story = {
  render: () => {
    const [selectedCount, setSelectedCount] = useState(5);

    return (
      <>
        <Layout bg="grey" padding={8} className="min-h-screen pb-20">
          <VStack gap={6}>
            <h2 className="gs-typo-h1">Without Selection Info</h2>
            <p className="text-sm text-grey-stronger">
              ActionBar without the selection counter and deselect button.
            </p>
            <HStack gap={4}>
              <Button onClick={() => setSelectedCount(prev => prev + 1)}>
                Select Item
              </Button>
              <Button onClick={() => setSelectedCount(prev => Math.max(0, prev - 1))}>
                Deselect Item
              </Button>
            </HStack>
          </VStack>
        </Layout>
        <ActionBar
          selectedCount={selectedCount}
          showSelectionInfo={false}
        >
          <Button variant="normal">Actions</Button>
          <Button variant="secondary">More</Button>
        </ActionBar>
      </>
    );
  },
};

export const MultipleActionBars: Story = {
  render: () => {
    const [fileSelection, setFileSelection] = useState(0);
    const [imageSelection, setImageSelection] = useState(0);

    return (
      <>
        <Layout bg="grey" padding={8} className="min-h-screen pb-20">
          <VStack gap={6}>
            <h2 className="gs-typo-h1">Multiple ActionBars</h2>
            <p className="text-sm text-grey-stronger">
              Multiple ActionBar instances - only the last modified one is visible.
            </p>
            <VStack gap={4}>
              <div>
                <h3 className="text-sm font-semibold mb-2">Files</h3>
                <HStack gap={2}>
                  <Button onClick={() => setFileSelection(prev => prev + 1)}>
                    Select File
                  </Button>
                  <Button onClick={() => setFileSelection(prev => Math.max(0, prev - 1))}>
                    Deselect File
                  </Button>
                  <span className="text-sm">Selected: {fileSelection}</span>
                </HStack>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">Images</h3>
                <HStack gap={2}>
                  <Button onClick={() => setImageSelection(prev => prev + 1)}>
                    Select Image
                  </Button>
                  <Button onClick={() => setImageSelection(prev => Math.max(0, prev - 1))}>
                    Deselect Image
                  </Button>
                  <span className="text-sm">Selected: {imageSelection}</span>
                </HStack>
              </div>
            </VStack>
          </VStack>
        </Layout>
        {/* File ActionBar */}
        <ActionBar
          selectedCount={fileSelection}
          translationKey="actionBar.filesSelected"
          onDeselectAll={() => setFileSelection(0)}
        >
          <Button variant="normal">Upload Files</Button>
        </ActionBar>
        {/* Image ActionBar */}
        <ActionBar
          selectedCount={imageSelection}
          translationKey="actionBar.imagesSelected"
          onDeselectAll={() => setImageSelection(0)}
        >
          <Button variant="normal">Edit Images</Button>
        </ActionBar>
      </>
    );
  },
};

export const CustomStyling: Story = {
  render: () => {
    const [selectedCount, setSelectedCount] = useState(2);

    return (
      <>
        <Layout bg="grey" padding={8} className="min-h-screen pb-20">
          <VStack gap={6}>
            <h2 className="gs-typo-h1">Custom Styling</h2>
            <p className="text-sm text-grey-stronger">
              ActionBar with custom height and padding.
            </p>
            <HStack gap={4}>
              <Button onClick={() => setSelectedCount(prev => prev + 1)}>
                Select Item
              </Button>
              <Button onClick={() => setSelectedCount(prev => Math.max(0, prev - 1))}>
                Deselect Item
              </Button>
            </HStack>
          </VStack>
        </Layout>
        <ActionBar
          selectedCount={selectedCount}
          translationKey="actionBar.filesSelected"
          onDeselectAll={() => setSelectedCount(0)}
          className="h-16"
          hStackProps={{
            padding: 6,
            gap: 4,
          }}
        >
          <Button variant="normal">Custom Action</Button>
        </ActionBar>
      </>
    );
  },
};

