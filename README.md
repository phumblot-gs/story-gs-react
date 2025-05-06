
# UI Component Library

A modern, responsive UI component library built with React, Tailwind CSS, and TypeScript.

## Features

- **Comprehensive Button Collection**: Various button styles including standard, circular, small text, large text, and status-specific buttons
- **TypeScript Support**: Full type definitions for all components
- **Tailwind Integration**: Seamless integration with Tailwind CSS
- **Storybook Documentation**: Interactive component documentation

## Installation

```bash
npm install gs-components-library
```

## Usage

```jsx
import { Button, ButtonCircle, ButtonTextSmall, ButtonTextLarge } from 'gs-components-library';
import 'gs-components-library/dist/style.css';

function App() {
  return (
    <div>
      <Button>Standard Button</Button>
      <ButtonCircle icon="Plus" />
      <ButtonTextSmall>Small Text Button</ButtonTextSmall>
      <ButtonTextLarge>Large Text Button</ButtonTextLarge>
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
<Button variant="default" size="default">Click Me</Button>
```

### ButtonCircle

Circular button with icon or letter:

```jsx
<ButtonCircle icon="Plus" />
<ButtonCircle letter="A" />
```

### ButtonTextSmall

Small text button:

```jsx
<ButtonTextSmall variant="primary">Small Button</ButtonTextSmall>
```

### ButtonTextLarge

Large text button:

```jsx
<ButtonTextLarge variant="primary">Large Button</ButtonTextLarge>
```

### ButtonStatus

Status-specific button:

```jsx
<ButtonStatus status={MediaStatus.FOR_APPROVAL} icon="Check" />
```

## License

MIT
