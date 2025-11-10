import type { Meta, StoryObj } from "@storybook/react-vite"
import { Pagination } from "./pagination"
import { Layout } from "@/components/layout"
import React, { useState } from "react"

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Pagination Component

A pagination component for navigating through large sets of data, designed to match the provided Figma mockup.
It closely follows the Shadcn UI \`Pagination\` implementation structure but with custom styling and behavior.

### Features

- **Navigation Buttons**: "Previous" and "Next" buttons with \`ArrowLeft\` and \`ArrowRight\` icons.
- **Page Number Buttons**: Displays individual page numbers, with an active state.
- **Ellipsis Handling**: Automatically shows "..." for omitted page numbers when there are many pages.
- **Context-aware Text Color**: Text color adapts based on the parent \`data-bg\` context (black for white/grey, white for black).
- **Custom Button Styling**: All buttons are \`Button size="small"\` with specific \`className="p-1 w-4 h-4"\`.
- **Active Page Styling**: The active page button simulates a \`Button variant="normal" hover\` state.
- **Debug Mode**: Provides visual indicators and console logs for development.
- **onPageChange Callback**: Use this callback to update your item range display (e.g., "1 - 100 sur 2500") separately.

### Basic Usage

\`\`\`tsx
import { Pagination, Layout } from '@gs/gs-components-library';
import React from 'react';

function PaginationDemo() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = 10;

  return (
    <Layout bg="white" className="p-4">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Layout>
  );
}

export default PaginationDemo;
\`\`\`

### Props

- \`currentPage\`: (number) The current active page number (1-indexed).
- \`totalPages\`: (number) The total number of pages.
- \`onPageChange\`: (function) Callback function when the page changes. Use this to update your item range display separately.
- \`maxVisiblePages\`: (number, optional) Maximum number of page buttons to show (default: 5).
- \`debug\`: (boolean, optional) Enable debug mode with visual indicators and console logs.
- \`className\`: (string, optional) Additional CSS classes for the main container.
        `,
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: "number", min: 1 },
      description: "The current active page number (1-indexed)",
    },
    totalPages: {
      control: { type: "number", min: 1 },
      description: "The total number of pages",
    },
    onPageChange: {
      action: "pageChanged",
      description: "Callback function when the page changes. Use this to update your item range display separately.",
    },
    maxVisiblePages: {
      control: { type: "number", min: 3, max: 10 },
      description: "Maximum number of page buttons to show (excluding prev/next)",
    },
    debug: {
      control: "boolean",
      description: "Enable debug mode with visual indicators and console logs",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for the main container",
    },
  },
  args: {
    currentPage: 1,
    totalPages: 10,
  },
  decorators: [
    (Story) => (
      <Layout bg="white" padding={6}>
        <div className="w-full max-w-xl">
          <Story />
        </div>
      </Layout>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Default: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 1)
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(newPage) => {
          setPage(newPage)
          args.onPageChange?.(newPage)
        }}
      />
    )
  },
  args: {
    currentPage: 1,
    totalPages: 10,
  },
}

export const WithManyPages: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 50)
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(newPage) => {
          setPage(newPage)
          args.onPageChange?.(newPage)
        }}
      />
    )
  },
  args: {
    currentPage: 50,
    totalPages: 100,
  },
}

export const WithEllipsis: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 5)
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(newPage) => {
          setPage(newPage)
          args.onPageChange?.(newPage)
        }}
      />
    )
  },
  args: {
    currentPage: 5,
    totalPages: 10,
  },
}

export const WithItemRange: Story = {
  render: (args) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage || 1)
    const totalItems = 2500
    const itemsPerPage = 100
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    // Calculate item range
    const firstItem = (currentPage - 1) * itemsPerPage + 1
    const lastItem = Math.min(currentPage * itemsPerPage, totalItems)
    const itemRange = `${firstItem} - ${lastItem} sur ${totalItems}`

    const handlePageChange = (page: number) => {
      setCurrentPage(page)
      args.onPageChange?.(page)
    }

    return (
      <div className="flex items-center justify-between w-full">
        {/* Item range display - managed separately */}
        <span className="text-base font-regular text-black">{itemRange}</span>

        {/* Pagination component */}
        <Pagination
          {...args}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    )
  },
  args: {
    currentPage: 1,
    totalPages: 25,
  },
  parameters: {
    docs: {
      description: {
        story: `
This example demonstrates how to use the \`onPageChange\` callback to manage the item range display (e.g., "1 - 100 sur 2500") separately from the Pagination component.

The item range is calculated and displayed outside the Pagination component, and updated whenever \`onPageChange\` is called.
        `,
      },
    },
  },
}

export const AllBackgrounds: Story = {
  render: (args) => {
    const [pageWhite, setPageWhite] = useState(1)
    const [pageGrey, setPageGrey] = useState(1)
    const [pageBlack, setPageBlack] = useState(1)

    return (
      <div className="space-y-8 p-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">White Background</h3>
          <Layout bg="white" padding={6}>
            <div className="w-full max-w-xl">
              <Pagination
                {...args}
                currentPage={pageWhite}
                onPageChange={(newPage) => {
                  setPageWhite(newPage)
                  args.onPageChange?.(newPage)
                }}
              />
            </div>
          </Layout>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Grey Background</h3>
          <Layout bg="grey" padding={6}>
            <div className="w-full max-w-xl">
              <Pagination
                {...args}
                currentPage={pageGrey}
                onPageChange={(newPage) => {
                  setPageGrey(newPage)
                  args.onPageChange?.(newPage)
                }}
              />
            </div>
          </Layout>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Black Background</h3>
          <Layout bg="black" padding={6}>
            <div className="w-full max-w-xl">
              <Pagination
                {...args}
                currentPage={pageBlack}
                onPageChange={(newPage) => {
                  setPageBlack(newPage)
                  args.onPageChange?.(newPage)
                }}
              />
            </div>
          </Layout>
        </div>
      </div>
    )
  },
  args: {
    currentPage: 1,
    totalPages: 10,
  },
}

export const DebugMode: Story = {
  render: (args) => {
    const [page, setPage] = useState(args.currentPage || 3)
    return (
      <Pagination
        {...args}
        currentPage={page}
        onPageChange={(newPage) => {
          setPage(newPage)
          args.onPageChange?.(newPage)
        }}
      />
    )
  },
  args: {
    currentPage: 3,
    totalPages: 10,
    debug: true,
  },
}
