
# UI Component Library

A modern, responsive UI component library built with React, Tailwind CSS, and TypeScript.

## Features

- **Comprehensive Button Collection**: Various button styles including standard, circular, small, and status-specific buttons
- **TypeScript Support**: Full type definitions for all components
- **Tailwind Integration**: Seamless integration with Tailwind CSS
- **Storybook Documentation**: Interactive component documentation

## Installation

```bash
npm install gs-components-library
```

## Usage

```jsx
import { Button, ButtonCircle, ButtonSmall } from 'gs-components-library';
import 'gs-components-library/dist/style.css';

function App() {
  return (
    <div>
      <Button>Standard Button</Button>
      <ButtonCircle icon="Plus" />
      <ButtonSmall>Small Button</ButtonSmall>
    </div>
  );
}
```

## Development

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start Storybook: `npm run storybook`

### Building

- Build the library: `npm run build:lib`
- Build Storybook: `npm run build-storybook`

## Components

### Button

Standard button component with various styling options:

```jsx
<Button variant="primary">Click Me</Button>
```

### ButtonCircle

Circular button with icon or letter:

```jsx
<ButtonCircle icon="Plus" />
<ButtonCircle letter="A" />
```

### ButtonSmall

Small button:

```jsx
<ButtonSmall variant="primary">Small Button</ButtonSmall>
```

### ButtonStatus

Status-specific button:

```jsx
<ButtonStatus status={MediaStatus.FOR_APPROVAL} icon="Check" />
```

## License

MIT
