import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./pagination";
import { Layout } from "@/components/layout";
import { useState } from "react";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
## Pagination Component

A pagination component that displays item range information and navigation controls.

### Features

- **Item range display**: Shows current range of items (e.g., "1 - 100 sur 2500")
- **Page navigation**: Previous/Next buttons with arrow icons
- **Page numbers**: Clickable page number buttons with ellipsis for large page counts
- **Active page**: Highlighted page number simulating Button variant="normal" hover state
- **Context-aware styling**: Adapts to parent \`data-bg\` context
- **Debug mode**: Visual indicators and console logs for development

### Basic Usage

\`\`\`tsx
import { Pagination } from '@gs/gs-components-library';

<Pagination
  currentPage={1}
  totalItems={2500}
  itemsPerPage={100}
  onPageChange={(page) => console.log('Page changed:', page)}
/>
\`\`\`

### Props

- \`currentPage\`: Current page number (1-indexed)
- \`totalItems\`: Total number of items
- \`itemsPerPage\`: Number of items per page
- \`onPageChange\`: Callback when page changes
- \`maxVisiblePages\`: Maximum number of page buttons to show (default: 5)
- \`debug\`: Enable debug mode

### Button Specifications

- All buttons use \`Button size="small"\` with \`className="p-1 w-4 h-4"\`
- Previous/Next buttons: \`variant="secondary"\` with \`Icon ArrowLeft/ArrowRight\` (10x10px)
- Page number buttons: \`variant="ghost"\`
- Active page button: \`variant="normal"\` with hover state simulation
        `
      }
    }
  },
  argTypes: {
    currentPage: {
      control: "number",
      description: "Current page number (1-indexed)",
    },
    totalItems: {
      control: "number",
      description: "Total number of items",
    },
    itemsPerPage: {
      control: "number",
      description: "Number of items per page",
    },
    maxVisiblePages: {
      control: "number",
      description: "Maximum number of page buttons to show",
    },
    debug: {
      control: "boolean",
      description: "Enable debug mode",
    },
    onPageChange: {
      action: "pageChanged",
      description: "Callback fired when page changes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 1);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(newPage) => {
          setPage(newPage);
          args.onPageChange?.(newPage);
        }}
      />
    );
  },
  args: {
    currentPage: 1,
    totalItems: 2500,
    itemsPerPage: 100,
    maxVisiblePages: 5,
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </Layout>
    ),
  ],
};

export const MiddlePage: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 50);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(newPage) => {
          setPage(newPage);
          args.onPageChange?.(newPage);
        }}
      />
    );
  },
  args: {
    currentPage: 50,
    totalItems: 2500,
    itemsPerPage: 100,
    maxVisiblePages: 5,
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </Layout>
    ),
  ],
};

export const LastPage: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 25);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(newPage) => {
          setPage(newPage);
          args.onPageChange?.(newPage);
        }}
      />
    );
  },
  args: {
    currentPage: 25,
    totalItems: 2500,
    itemsPerPage: 100,
    maxVisiblePages: 5,
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </Layout>
    ),
  ],
};

export const SmallDataset: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 1);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(newPage) => {
          setPage(newPage);
          args.onPageChange?.(newPage);
        }}
      />
    );
  },
  args: {
    currentPage: 1,
    totalItems: 150,
    itemsPerPage: 50,
    maxVisiblePages: 5,
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </Layout>
    ),
  ],
};

export const AllBackgrounds: Story = {
  render: (args) => {
    const [pageWhite, setPageWhite] = useState(1);
    const [pageGrey, setPageGrey] = useState(1);
    const [pageBlack, setPageBlack] = useState(1);

    return (
      <div className="space-y-8 p-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">White Background</h3>
          <Layout bg="white" padding={6}>
            <div className="w-full max-w-2xl">
              <Pagination
                {...args}
                currentPage={pageWhite}
                onPageChange={(newPage) => {
                  setPageWhite(newPage);
                  args.onPageChange?.(newPage);
                }}
              />
            </div>
          </Layout>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Grey Background</h3>
          <Layout bg="grey" padding={6}>
            <div className="w-full max-w-2xl">
              <Pagination
                {...args}
                currentPage={pageGrey}
                onPageChange={(newPage) => {
                  setPageGrey(newPage);
                  args.onPageChange?.(newPage);
                }}
              />
            </div>
          </Layout>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Black Background</h3>
          <Layout bg="black" padding={6}>
            <div className="w-full max-w-2xl">
              <Pagination
                {...args}
                currentPage={pageBlack}
                onPageChange={(newPage) => {
                  setPageBlack(newPage);
                  args.onPageChange?.(newPage);
                }}
              />
            </div>
          </Layout>
        </div>
      </div>
    );
  },
  args: {
    currentPage: 1,
    totalItems: 2500,
    itemsPerPage: 100,
    maxVisiblePages: 5,
  },
};

export const DebugMode: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 1);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(newPage) => {
          setPage(newPage);
          args.onPageChange?.(newPage);
        }}
      />
    );
  },
  args: {
    currentPage: 1,
    totalItems: 2500,
    itemsPerPage: 100,
    maxVisiblePages: 5,
    debug: true,
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </Layout>
    ),
  ],
};

export const ManyPages: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 1);
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(newPage) => {
          setPage(newPage);
          args.onPageChange?.(newPage);
        }}
      />
    );
  },
  args: {
    currentPage: 1,
    totalItems: 10000,
    itemsPerPage: 50,
    maxVisiblePages: 5,
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-2xl">
          <Story />
        </div>
      </Layout>
    ),
  ],
};

