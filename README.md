# GS Components Library

A modern, production-ready UI component library built with React, Tailwind CSS, and TypeScript. Designed for Grand Shooting applications with accessible and customizable components.

## Features

- 🎨 **Modern Design System**: Consistent design language across all components
- ♿ **Accessibility First**: Built on Radix UI primitives for WCAG compliance
- 📘 **TypeScript Support**: Full type definitions for all components and props
- 🎯 **Tree Shakeable**: Import only what you need
- 📱 **Responsive**: Mobile-first design approach
- 🌙 **Theme Support**: Light/dark mode ready

## Installation

```bash
npm install @gs/gs-components-library
```

## Quick Start

### 1. Import the CSS

Add this to your application's entry point (`App.tsx` or `index.tsx`):

```jsx
import '@gs/gs-components-library/dist/style.css';
```

### 2. Use Components

```jsx
import { Button, FileBrowser, type FileItem } from '@gs/gs-components-library';

function App() {
  return (
    <div>
      <Button featured>Get Started</Button>
      <FileBrowser
        files={myFiles}
        currentPath="/"
        onNavigate={(path) => console.log(path)}
      />
    </div>
  );
}
```

### 3. Configure Tailwind (Optional)

If using Tailwind CSS in your project:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@gs/gs-components-library/dist/**/*.js"
  ],
}
```

## Documentation

**📚 Full component documentation and live examples:**
👉 **https://gs-components-library.grand-shooting.org/**

The Storybook documentation includes:
- Interactive component playground
- Complete API documentation
- Code examples for all use cases
- Accessibility guidelines
- Design tokens and theming

## Available Components

- **Buttons**: `Button`, `ButtonCircle`, `ButtonSmall`, `ButtonStatus`
- **File Management**: `FileBrowser`
- **Navigation**: `LanguageSwitcher`
- **Forms**: `Select` and variants
- **Status**: `StatusIndicator`, `ButtonNotifications`
- **Layout**: `PageHeader`
- **Icons**: Complete icon set from Lucide

## Development

### Project Structure

```
src/
├── components/
│   ├── ui/              # UI components (buttons, inputs, etc.)
│   ├── ButtonStatus/    # Status-specific components
│   ├── PageHeader/      # Page layout components
│   └── notifications/   # Notification components
├── lib/                 # Utility functions
├── utils/               # Helper utilities
└── index.ts             # Main entry point
```

### Local Development

```bash
# Install dependencies
npm install

# Start Storybook
npm run storybook

# Build library
npm run build:lib

# Build Storybook
npm run build-storybook
```

### Testing Your Changes

1. Build the library: `npm run build:lib`
2. Link locally: `npm link`
3. In your consuming app: `npm link @gs/gs-components-library`

## Key Notes

- **Data Format**: FileBrowser expects `snake_case` field names (e.g., `file_name`, not `fileName`)
- **Dates**: Use ISO 8601 format for all date fields
- **Types**: Import TypeScript types alongside components for better DX
- **Debug Mode**: Enable `debug={true}` on components to see validation errors

## License

MIT

---

**Questions or Issues?**
Visit our [Storybook documentation](https://gs-components-library.grand-shooting.org/) or open an issue on GitHub.
