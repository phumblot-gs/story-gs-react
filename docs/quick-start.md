# Guide de démarrage rapide

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Accès au registry Nexus GS

### Installation de la librairie

```bash
# Installation de la version stable
npm install @gs/gs-components-library

# Installation de la version beta
npm install @gs/gs-components-library@beta
```

### Configuration du registry Nexus

Ajoutez la configuration suivante à votre `.npmrc` :

```bash
@gs:registry=https://nexus.grand-shooting.org/repository/npm-gs/
//nexus.grand-shooting.org/repository/npm-gs/:_auth=VOTRE_TOKEN_AUTH
```

## 📦 Configuration dans votre projet

### 1. Import des styles (optionnel)

Si vous n'utilisez pas déjà Tailwind CSS dans votre projet :

```css
/* Dans votre fichier CSS principal */
@import '@gs/gs-components-library/dist/style.css';
```

### 2. Configuration TypeScript

Ajoutez à votre `tsconfig.json` :

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

## 🎯 Premier exemple

```tsx
import React from 'react';
import { Button, FileBrowser } from '@gs/gs-components-library';

function App() {
  const handleButtonClick = () => {
    console.log('Bouton cliqué !');
  };

  const sampleFiles = [
    {
      id: '1',
      file_name: 'Document.pdf',
      file_type: 'file',
      file_size: 1024000,
      modification_date: new Date('2025-09-29'),
      path: '/documents/Document.pdf'
    },
    {
      id: '2',
      file_name: 'Images',
      file_type: 'folder',
      file_size: null,
      modification_date: new Date('2025-09-28'),
      path: '/documents/Images'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ma première app avec GS Components</h1>

      <Button
        variant="primary"
        size="large"
        onClick={handleButtonClick}
      >
        Cliquez-moi !
      </Button>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Explorateur de fichiers</h2>
        <FileBrowser
          files={sampleFiles}
          onFilesSelected={(files) => console.log('Fichiers sélectionnés:', files)}
          onUpload={(files) => console.log('Fichiers uploadés:', files)}
        />
      </div>
    </div>
  );
}

export default App;
```

## 🔧 Composants principaux

### Button
```tsx
<Button variant="primary" size="large">Mon bouton</Button>
<Button variant="secondary" featured>Bouton mis en avant</Button>
```

### FileBrowser
```tsx
<FileBrowser
  files={files}
  onFilesSelected={onSelect}
  onUpload={onUpload}
  allowDragDrop={true}
/>
```

### Select
```tsx
<Select
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ]}
  onValueChange={handleChange}
  background="white"
  allowClear
/>
```

### LanguageSwitcher
```tsx
<LanguageSwitcher
  currentLanguage="fr"
  onLanguageChange={handleLanguageChange}
/>
```

## 🔗 Prochaines étapes

- Consultez la [documentation complète des composants](./components/README.md)
- Explorez les exemples dans [Storybook](http://localhost:6006)
- Lisez le [guide de développement](./development-guide.md) pour contribuer