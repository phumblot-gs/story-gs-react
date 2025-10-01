
# UI Component Library

A modern, responsive UI component library built with React, Tailwind CSS, and TypeScript, providing accessible and customizable UI components with consistent design language.

## Features

- **Comprehensive Button Collection**: Various button styles including standard, circular, small, and status-specific buttons
- **Status Indicators**: Visual elements for representing different states in workflows
- **TypeScript Support**: Full type definitions for all components
- **Tailwind Integration**: Seamless integration with Tailwind CSS
- **Accessibility**: Built on top of Radix UI primitives
- **Storybook Documentation**: Interactive component documentation

## Installation

```bash
npm install @gs/gs-components-library
```

## Setup

### 1. Import the CSS

**Important:** You must import the CSS file in your application's entry point to ensure proper styling:

```jsx
// In your main App.tsx or index.tsx
import '@gs/gs-components-library/dist/style.css';
```

### 2. Configure Tailwind (Optional but Recommended)

If you're using Tailwind in your project, add the library's components to your `content` array:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@gs/gs-components-library/dist/**/*.js"
  ],
  // ... rest of your config
}
```

## Usage

**Quick Start:**

```jsx
import { Button, FileBrowser, type FileItem } from '@gs/gs-components-library';
import '@gs/gs-components-library/dist/style.css';

function App() {
  const files: FileItem[] = [
    {
      id: "1",
      file_name: "document.pdf",
      parent_path: "/",
      file_size: 1024000,
      mime_type: "application/pdf",
      is_directory: false,
      created_at: "2025-10-01T09:13:47.042Z",
      updated_at: "2025-10-01T09:13:47.042Z"
    }
  ];

  return (
    <div className="space-y-4">
      <Button>Standard Button</Button>
      <FileBrowser
        files={files}
        currentPath="/"
        onNavigate={(path) => console.log('Navigate to:', path)}
      />
    </div>
  );
}
```

## Component API

### Button

Standard button component with various styling options:

```jsx
<Button 
  background="white" // 'white' | 'black' | 'grey'
  disabled={false} // boolean
  featured={false} // boolean - gives more prominence
  indicator={false} // boolean - shows indicator dot
>
  Button Text
</Button>
```

### ButtonSmall

Compact button for secondary actions:

```jsx
<ButtonSmall 
  background="white" // 'white' | 'black' | 'grey'
  disabled={false} // boolean
  featured={false} // boolean - gives more prominence
  indicator={false} // boolean - shows indicator dot
>
  Small Button
</ButtonSmall>
```

### ButtonCircle

Circular button with icon or letter:

```jsx
<ButtonCircle
  background="white" // 'white' | 'black' | 'grey'
  disabled={false} // boolean
  featured={false} // boolean - gives more prominence
  icon="Plus" // Use any of the allowed pictograms (optional)
  indicator={false} // boolean - shows indicator dot
  size="large" // 'small' | 'large'
>
  A {/* Optional single letter (not needed when using icon) */}
</ButtonCircle>
```

### ButtonStatus

Status-specific button:

```jsx
<ButtonStatus
  disabled={false} // boolean
  icon="Check" // 'Check' | 'X'
  isActive={false} // boolean
  size="large" // 'small' | 'large'
  status={MediaStatus.FOR_APPROVAL} // MediaStatus enum
/>
```

### StatusIndicator

Visual indicator for different status states:

```jsx
<StatusIndicator
  size="md" // 'sm' | 'md' | 'lg'
  status={MediaStatus.VALIDATED} // MediaStatus enum
/>
```

### FileBrowser

File browser component with sorting, filtering, and actions:

```jsx
import { FileBrowser, type FileItem, type SortConfig } from '@gs/gs-components-library';

const files: FileItem[] = [
  {
    id: "unique-id",
    file_name: "document.pdf",        // Required: snake_case
    parent_path: "/folder",           // Required: snake_case
    file_size: 1024000,               // Required: snake_case (in bytes)
    mime_type: "application/pdf",     // Required: snake_case
    is_directory: false,              // Required: snake_case
    created_at: "2025-10-01T09:13:47.042Z",  // Required: snake_case (ISO 8601)
    updated_at: "2025-10-01T09:13:47.042Z"   // Required: snake_case (ISO 8601)
  }
];

<FileBrowser
  files={files}
  currentPath="/"
  labelRootFolder="My Files"
  showUploadButton={true}
  debug={false}
  onNavigate={(path) => console.log('Navigate:', path)}
  onRefresh={() => console.log('Refresh')}
  onUpload={() => console.log('Upload')}
  onFileDrop={(fileList) => console.log('Files dropped:', fileList)}
  onRename={(items) => console.log('Rename:', items)}
  onMove={(items) => console.log('Move:', items)}
  onDownload={(items) => console.log('Download:', items)}
  onShare={(items) => console.log('Share:', items)}
  onDelete={(items) => console.log('Delete:', items)}
  onDateFilterChange={(filter) => console.log('Filter:', filter)}
  onSortChange={(sortConfig) => console.log('Sort:', sortConfig)}
  onSelectionChange={(selectedItems) => {
    console.log('Selection changed:', selectedItems);
    // Use this to display preview, update UI, etc.
  }}
/>
```

**Important Notes:**
- All field names must be in **snake_case** (e.g., `file_name`, not `fileName`)
- Dates must be valid ISO 8601 strings
- Enable `debug={true}` to see validation errors in console
- If dates are invalid, the component will display "Date invalide" instead of crashing

**Keyboard Navigation:**
- **Click on a row** to give focus to the table and enable keyboard navigation
- **↑/↓ Arrow keys**: Navigate up/down through files
- **Enter**: Open the selected folder (triggers `onNavigate` with the new path)
- **Cmd+A / Ctrl+A**: Select all files
- **Double-click on a folder**: Navigate into it (same as Enter key)

**Selection Tracking:**
The `onSelectionChange` callback is triggered whenever the selection changes:
```jsx
const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);

<FileBrowser
  files={files}
  onSelectionChange={(items) => {
    setSelectedFiles(items);
    // Display preview, enable/disable actions, etc.
  }}
/>

{/* Display preview of selected file */}
{selectedFiles.length === 1 && (
  <div className="preview">
    <h3>{selectedFiles[0].file_name}</h3>
    <p>Size: {selectedFiles[0].file_size} bytes</p>
    <p>Modified: {selectedFiles[0].updated_at}</p>
  </div>
)}
```

## Available Icons

ButtonCircle supports a wide range of icons including:
- Action icons: Check, X, Plus, Minus, etc.
- Navigation icons: ArrowUp, ArrowDown, ArrowLeft, ArrowRight
- Status icons: Alert, Status, Urgent, etc.
- Utility icons: Settings, Filter, Help, etc.

## Development

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start Storybook: `npm run storybook`

### Building

- Build the library: `npm run build:lib`
- Build Storybook: `npm run build-storybook`

## License

MIT
