# Documentation des composants

## 🎨 Composants disponibles

Cette documentation présente tous les composants disponibles dans la librairie GS Components.

### 🔘 Composants de base

- [**Button**](./button.md) - Boutons avec variantes et tailles
- [**ButtonCircle**](./button-circle.md) - Boutons circulaires pour actions spécifiques
- [**Select**](./select.md) - Liste déroulante avec variants de style

### 📁 Composants de navigation

- [**FileBrowser**](./file-browser.md) - Explorateur de fichiers avec drag & drop
- [**LanguageSwitcher**](./language-switcher.md) - Sélecteur de langue

### 🔔 Composants de notification

- [**ButtonNotifications**](./button-notifications.md) - Gestion des notifications

### 🎯 Composants utilitaires

- [**IconProvider**](./icon-provider.md) - Système d'icônes unifié

## 🎨 Système de design

### Couleurs

La librairie utilise un système de couleurs cohérent :

- **Primary** : Bleu principal de GS (`blue-primary`)
- **Secondary** : Couleurs secondaires
- **Background** : Variants de fond (white, black, grey)

### Tailles

Les composants utilisent un système de tailles standardisé :

- `small` - Petite taille
- `medium` - Taille moyenne (défaut)
- `large` - Grande taille

### États

- **Default** - État par défaut
- **Hover** - Au survol
- **Pressed** - Lors du clic
- **Disabled** - Désactivé
- **Featured** - Mis en avant

## 🛠️ Utilisation des composants

### Import

```tsx
// Import de composants spécifiques
import { Button, FileBrowser, Select } from '@gs/gs-components-library';

// Import de types
import type { ButtonProps, FileItem } from '@gs/gs-components-library';
```

### Exemple complet

```tsx
import React, { useState } from 'react';
import {
  Button,
  FileBrowser,
  Select,
  LanguageSwitcher
} from '@gs/gs-components-library';
import type { FileItem, Language } from '@gs/gs-components-library';

export function ExempleApp() {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');

  const files: FileItem[] = [
    {
      id: '1',
      file_name: 'Document.pdf',
      file_type: 'file',
      file_size: 1024000,
      modification_date: new Date(),
      path: '/documents/Document.pdf'
    }
  ];

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* En-tête avec sélecteur de langue */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mon application</h1>
        <LanguageSwitcher
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex space-x-4">
        <Button variant="primary" size="large">
          Action principale
        </Button>
        <Button variant="secondary" featured>
          Action secondaire
        </Button>
        <Button variant="outline">
          Annuler
        </Button>
      </div>

      {/* Sélecteur */}
      <div className="w-64">
        <label className="block text-sm font-medium mb-2">
          Choisir une option :
        </label>
        <Select
          options={selectOptions}
          value={selectedOption}
          onValueChange={setSelectedOption}
          background="white"
          allowClear
          placeholder="Sélectionner..."
        />
      </div>

      {/* Explorateur de fichiers */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Mes fichiers</h2>
        <FileBrowser
          files={files}
          selectedFiles={selectedFiles}
          onFilesSelected={setSelectedFiles}
          onUpload={(uploadedFiles) => {
            console.log('Fichiers uploadés:', uploadedFiles);
          }}
          allowDragDrop
        />
      </div>
    </div>
  );
}
```

## 🎯 Bonnes pratiques

### Performance

- Utilisez `React.memo` pour éviter les re-renders inutiles
- Mémorisez les callbacks avec `useCallback`
- Optimisez les listes avec des clés uniques

### Accessibilité

- Tous les composants respectent les standards WCAG 2.1
- Utilisez les attributs ARIA appropriés
- Testez avec un lecteur d'écran

### Styling

- Préférez les props de variantes aux classes CSS custom
- Utilisez `className` pour des ajustements mineurs
- Respectez le système de design établi

## 🔗 Ressources

- [Storybook interactif](http://localhost:6006) - Explorez tous les composants
- [Figma Design System](https://figma.com/gs-design-system) - Maquettes de référence
- [Guide de développement](../development-guide.md) - Pour contribuer