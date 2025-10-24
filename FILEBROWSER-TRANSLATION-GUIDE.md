# FileBrowser Translation Guide

## Problem Solved

The `FileBrowser` component now works **with or without** `TranslationProvider`, solving the issue where intermediate wrapper components (like `SourcingFileBrowser`) couldn't propagate the translation context due to React Context version conflicts.

## Three Ways to Use FileBrowser

### Mode 1: With TranslationProvider (Recommended)

**When to use**: When you have direct control over the component tree and want centralized translation management.

```tsx
import { FileBrowser, TranslationProvider } from '@gs/gs-components-library';
import '@gs/gs-components-library/styles';

function App() {
  return (
    <TranslationProvider language="fr">
      <FileBrowser
        files={files}
        currentPath="/"
        onNavigate={handleNavigate}
        // ... other props
      />
    </TranslationProvider>
  );
}
```

**Benefits**:
- Centralized language management
- Easy language switching with `LanguageSwitcher`
- All components share the same translations

---

### Mode 2: With Props (Wrapper-Friendly) ✨ **NEW**

**When to use**: When `FileBrowser` is wrapped inside another component that can't propagate the React Context (e.g., `SourcingFileBrowser`).

```tsx
import { FileBrowser } from '@gs/gs-components-library';
import '@gs/gs-components-library/styles';

// In a wrapper component like SourcingFileBrowser
function SourcingFileBrowser({ language = 'fr', customTranslations }) {
  return (
    <FileBrowser
      files={files}
      currentPath="/"
      language={language}
      translations={customTranslations}
      // ... other props
    />
  );
}

// In the main app
<SourcingFileBrowser
  language="fr"
  customTranslations={{
    "fileBrowser.name": { FR: "Nom du fichier", EN: "File name" }
  }}
/>
```

**Benefits**:
- Works without `TranslationProvider`
- No React Context version conflicts
- Props can be passed through wrapper components
- Supports custom translations to override defaults

---

### Mode 3: Fallback (English Default)

**When to use**: Quick prototyping or when translations aren't needed.

```tsx
import { FileBrowser } from '@gs/gs-components-library';
import '@gs/gs-components-library/styles';

// No TranslationProvider, no props
<FileBrowser
  files={files}
  currentPath="/"
  // ... other props
/>
```

**Behavior**:
- Automatically uses English (`EN`) translations
- No errors thrown
- Minimal setup required

---

## Props API

### New Translation Props

```tsx
interface FileBrowserProps {
  // ... existing props

  /**
   * Language code (optional)
   * @example "fr", "en", "es", "it"
   * @default Uses TranslationProvider language or "EN" fallback
   */
  language?: string;

  /**
   * Custom translations to override defaults (optional)
   * @example { "fileBrowser.name": { FR: "Nom", EN: "Name" } }
   */
  translations?: Partial<TranslationMap>;
}
```

---

## For Wrapper Component Developers

If you're creating a component that wraps `FileBrowser` (like `SourcingFileBrowser`):

### ✅ DO

```tsx
// Accept translation props and pass them down
interface SourcingFileBrowserProps {
  language?: string;
  translations?: Partial<TranslationMap>;
  // ... other props
}

export function SourcingFileBrowser({
  language,
  translations,
  ...otherProps
}: SourcingFileBrowserProps) {
  return (
    <FileBrowser
      language={language}
      translations={translations}
      {...otherProps}
    />
  );
}
```

### ❌ DON'T

```tsx
// Don't try to wrap with TranslationProvider inside the wrapper
// (causes Context version conflicts)
export function SourcingFileBrowser(props) {
  return (
    <TranslationProvider language="fr">  {/* ❌ Conflict! */}
      <FileBrowser {...props} />
    </TranslationProvider>
  );
}
```

---

## Custom Translations

You can override any translation key:

```tsx
const customTranslations = {
  "fileBrowser.name": {
    FR: "Nom du fichier",
    EN: "File name",
    ES: "Nombre del archivo",
    IT: "Nome del file"
  },
  "fileBrowser.size": {
    FR: "Taille du fichier",
    EN: "File size"
  },
  // ... more keys
};

<FileBrowser
  language="fr"
  translations={customTranslations}
  // ...
/>
```

**Available translation keys**: See `src/utils/component-translations.ts` for the complete list of `fileBrowser.*` keys.

---

## Migration Guide

### Before (v1.0.x - Required TranslationProvider)

```tsx
// ❌ Would throw error without TranslationProvider
<FileBrowser files={files} currentPath="/" />
```

### After (v1.1.0+)

```tsx
// ✅ Works fine without TranslationProvider (uses EN)
<FileBrowser files={files} currentPath="/" />

// ✅ Or specify language via props
<FileBrowser
  files={files}
  currentPath="/"
  language="fr"
/>
```

---

## Technical Details

### Hook: `useTranslationSafe`

The `FileBrowser` uses `useTranslationSafe` instead of `useTranslation`:

```tsx
// OLD: throws error if no Provider
const { t } = useTranslation();

// NEW: works with or without Provider
const { t } = useTranslationSafe(translations, language);
```

**Behavior**:
1. **If `TranslationProvider` exists**: Uses the Provider (priority #1)
2. **If no Provider**: Falls back to props `language` and `translations`
3. **If no props**: Falls back to English (`EN`) and default translations

---

## Troubleshooting

### Issue: Translations not working in wrapped component

**Symptom**: `SourcingFileBrowser` shows English even though app has `<TranslationProvider language="fr">`

**Cause**: React Context doesn't propagate through different library versions

**Solution**: Pass `language` prop explicitly

```tsx
// In app
<SourcingFileBrowser language="fr" />

// In SourcingFileBrowser
<FileBrowser language={language} {...otherProps} />
```

### Issue: `useTranslation must be used within a TranslationProvider` error

**Cause**: Using old version (< v1.1.0)

**Solution**: Upgrade to v1.1.0-beta.0 or later

```bash
npm install @gs/gs-components-library@beta
```

---

## Complete Example

```tsx
import {
  FileBrowser,
  TranslationProvider,
  LanguageSwitcher,
  type TranslationMap
} from '@gs/gs-components-library';
import '@gs/gs-components-library/styles';

const customTranslations: Partial<TranslationMap> = {
  "fileBrowser.noFilesInFolder": {
    FR: "Aucun document trouvé",
    EN: "No documents found"
  }
};

function App() {
  const [language, setLanguage] = useState('fr');

  return (
    <TranslationProvider language={language}>
      <LanguageSwitcher
        languages={[
          { code: "FR", name: "Français" },
          { code: "EN", name: "English" }
        ]}
        currentLanguage={{ code: language, name: language }}
        onLanguageChange={(lang) => setLanguage(lang.code.toLowerCase())}
      />

      <FileBrowser
        files={files}
        currentPath="/"
        translations={customTranslations}
        onNavigate={handleNavigate}
      />
    </TranslationProvider>
  );
}
```

---

## Version History

- **v1.1.0-beta.0**: Added `useTranslationSafe`, `language` and `translations` props to `FileBrowser`
- **v1.0.x**: Required `TranslationProvider` wrapper
