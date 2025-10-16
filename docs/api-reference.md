# API Reference

Documentation détaillée de l'API de tous les composants et utilitaires.

## 📦 Composants

### Button

```typescript
import { Button } from '@gs/gs-components-library/button';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'large' \| 'sm' \| 'default' \| 'lg' \| 'icon'` | `'large'` | Taille du bouton |
| `background` | `'white' \| 'black' \| 'grey'` | `'white'` | Couleur de fond |
| `featured` | `boolean` | `true` | Style mis en avant |
| `indicator` | `boolean` | `false` | Affiche un indicateur jaune |
| `disabled` | `boolean` | `false` | État désactivé |
| `isActive` | `boolean` | `false` | État actif |
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | - | Variante shadcn |
| `onClick` | `MouseEventHandler` | - | Gestionnaire de clic |
| `onFocus` | `FocusEventHandler` | - | Gestionnaire de focus |
| `onBlur` | `FocusEventHandler` | - | Gestionnaire de blur |

#### Exemple

```tsx
<Button
  size="large"
  background="black"
  featured
  onClick={() => console.log('clicked')}
>
  Mon bouton
</Button>
```

---

### FileBrowser

```typescript
import { FileBrowser } from '@gs/gs-components-library/file-browser';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `files` | `FileItem[]` | `[]` | Liste des fichiers |
| `currentPath` | `string` | `'/'` | Chemin actuel |
| `labelRootFolder` | `string` | `'Mes fichiers'` | Label du dossier racine |
| `showUploadButton` | `boolean` | `false` | Affiche le bouton upload |
| `heightMode` | `'auto' \| 'fill-container' \| 'max-height'` | `'auto'` | Mode de hauteur |
| `maxHeight` | `string` | `'600px'` | Hauteur maximale |
| `totalFiles` | `number \| null` | `null` | Nombre total de fichiers |
| `hasMore` | `boolean` | `false` | Plus de fichiers disponibles |
| `isLoadingMore` | `boolean` | `false` | Chargement en cours |
| `maxFilesLimit` | `number` | `10000` | Limite maximale |
| `onNavigate` | `(path: string) => void` | - | Navigation |
| `onRefresh` | `() => void` | - | Rafraîchissement |
| `onUpload` | `() => void` | - | Upload |
| `onFileDrop` | `(event: DragEvent) => void` | - | Drag & drop |
| `onSelectionChange` | `(items: FileItem[]) => void` | - | Changement de sélection |

#### Types

```typescript
interface FileItem {
  id: string;
  file_name: string;
  parent_path: string | null;
  file_size: number;
  mime_type: string | null;
  is_directory: boolean;
  created_at: string;
  updated_at: string;
  disabled?: boolean;
}

type SortField = 'file_name' | 'updated_at' | 'file_size';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
```

---

### Select

```typescript
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@gs/gs-components-library/select';
```

#### Props SelectTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `background` | `'white' \| 'grey' \| 'black'` | `'white'` | Couleur de fond |
| `className` | `string` | - | Classes CSS additionnelles |
| `disabled` | `boolean` | `false` | État désactivé |

#### Exemple

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger background="grey">
    <SelectValue placeholder="Choisir..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

### PageHeader

```typescript
import { PageHeader } from '@gs/gs-components-library/page-header';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Titre de la page |
| `subtitle` | `string` | - | Sous-titre |
| `breadcrumb` | `BreadcrumbItem[]` | - | Fil d'Ariane |
| `actions` | `ReactNode` | - | Actions en haut à droite |
| `showGradient` | `boolean` | `true` | Affiche le gradient |
| `className` | `string` | - | Classes CSS additionnelles |

---

### ModalLayer

```typescript
import { ModalLayer } from '@gs/gs-components-library/modal-layer';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | État d'ouverture |
| `onOpenChange` | `(open: boolean) => void` | - | Changement d'état |
| `title` | `string` | - | Titre de la modale |
| `description` | `string` | - | Description |
| `children` | `ReactNode` | - | Contenu |
| `footer` | `ReactNode` | - | Pied de page |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Taille |

---

## 🔧 Hooks

### useCustomTheme

```typescript
import { useCustomTheme } from '@gs/gs-components-library/providers/theme';

const {
  theme,              // 'light' | 'dark' | 'system'
  setTheme,           // (theme: string) => void
  customization,      // ThemeCustomization
  updateCustomization,// (updates: Partial<ThemeCustomization>) => void
  resetCustomization  // () => void
} = useCustomTheme();
```

### useTranslation

```typescript
import { useTranslation } from '@gs/gs-components-library/providers/translation';

const {
  currentLanguage,    // Language
  setLanguage,        // (language: Language) => void
  availableLanguages, // Language[]
  t                   // (key: string, params?: Record<string, string | number>) => string
} = useTranslation();
```

---

## 🛠️ Utilitaires

### cn (classNames)

Combine les classes CSS avec support des conditionnels :

```typescript
import { cn } from '@gs/gs-components-library/utils';

const className = cn(
  'base-class',
  isActive && 'active-class',
  {
    'conditional-class': someCondition
  }
);
```

### getMediaStatus

Obtient les informations de statut d'un média :

```typescript
import { getMediaStatus } from '@gs/gs-components-library/utils/media-status';

const status = getMediaStatus('validated');
// { label: 'Validé', color: '#9EDEAB', icon: 'Check' }
```

### colorUtils

Manipulation des couleurs :

```typescript
import {
  hexToRgb,
  rgbToHex,
  lighten,
  darken
} from '@gs/gs-components-library/utils/color';

const rgb = hexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const lighter = lighten('#ff0000', 0.2); // '#ff3333'
```

---

## 📝 Types

### FileItem

```typescript
interface FileItem {
  id: string;
  file_name: string;
  parent_path: string | null;
  file_size: number;
  mime_type: string | null;
  is_directory: boolean;
  created_at: string;
  updated_at: string;
  disabled?: boolean;
}
```

### Language

```typescript
interface Language {
  code: string;
  name: string;
}
```

### ThemeCustomization

```typescript
interface ThemeCustomization {
  colors: {
    bgWhite?: string;
    bgBlack?: string;
    bgGrey?: string;
    bgGreyLighter?: string;
    bgGreyStrongest?: string;
    textGreyStronger?: string;
    textBlack?: string;
    textWhite?: string;
    textBluePrimary?: string;
    textBlue?: string;
    statusIgnored?: string;
    statusReshoot?: string;
    statusNotSelected?: string;
    statusSelected?: string;
    statusRefused?: string;
    statusForApproval?: string;
    statusValidated?: string;
    statusToPublish?: string;
    statusError?: string;
    statusPublished?: string;
    headerGradientStart?: string;
    headerGradientEnd?: string;
  };
  assets: {
    logo?: string;
  };
  text: {
    brandName?: string;
  };
}
```

### IconName

```typescript
type IconName =
  | 'Alert'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'Bell'
  | 'Check'
  | 'ChevronDown'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'ChevronUp'
  | 'Download'
  | 'Eye'
  | 'File'
  | 'Filter'
  | 'Folder'
  | 'FolderOpened'
  | 'FolderMoved'
  | 'Globe'
  | 'Grip'
  | 'Menu'
  | 'Minus'
  | 'MoreHorizontal'
  | 'MoreVertical'
  | 'Pencil'
  | 'Plus'
  | 'Refresh'
  | 'Search'
  | 'Share'
  | 'Star'
  | 'StarFilled'
  | 'Trash'
  | 'Upload'
  | 'User'
  | 'Users'
  | 'X';
```

---

## 🎯 Patterns d'utilisation

### Composition de composants

```tsx
import { Button } from '@gs/gs-components-library/button';
import { IconProvider } from '@gs/gs-components-library/icons';

function IconButton({ icon, children, ...props }) {
  return (
    <Button {...props}>
      <IconProvider icon={icon} size={16} />
      {children}
    </Button>
  );
}
```

### Gestion d'état avec providers

```tsx
import { ThemeProvider } from '@gs/gs-components-library/providers/theme';
import { TranslationProvider } from '@gs/gs-components-library/providers/translation';

function App() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <YourApp />
      </TranslationProvider>
    </ThemeProvider>
  );
}
```

### Lazy loading

```tsx
import { lazy, Suspense } from 'react';

const FileBrowser = lazy(() =>
  import('@gs/gs-components-library/file-browser')
    .then(module => ({ default: module.FileBrowser }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FileBrowser files={[]} />
    </Suspense>
  );
}
```