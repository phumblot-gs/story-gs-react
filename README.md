
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
npm install gs-components-library
```

## Usage

```jsx
import { Button, ButtonCircle, ButtonSmall, ButtonStatus, StatusIndicator } from 'gs-components-library';
import 'gs-components-library/dist/style.css';

function App() {
  return (
    <div className="space-y-4">
      <Button>Standard Button</Button>
      <ButtonSmall>Small Button</ButtonSmall>
      <ButtonCircle icon="Plus" />
      <ButtonCircle>A</ButtonCircle>
      <ButtonStatus status={MediaStatus.FOR_APPROVAL} icon="Check" />
      <StatusIndicator status={MediaStatus.VALIDATED} size="md" />
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
