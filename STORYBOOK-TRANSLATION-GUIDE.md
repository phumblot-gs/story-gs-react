# Guide des Traductions dans Storybook

Ce guide explique les **3 modes** pour utiliser les traductions dans les stories Storybook.

## Mode 1 : Avec TranslationProvider (Recommandé)

Enveloppez votre composant avec le `TranslationProvider` pour bénéficier du système complet de traduction avec changement dynamique de langue.

### Exemple : FileBrowser avec TranslationProvider

```tsx
import { TranslationProvider } from "@/contexts/TranslationContext";

export const WithTranslationProvider: Story = {
  render: (args) => (
    <TranslationProvider initialLanguage={{ code: "FR", name: "Français" }}>
      <FileBrowser {...args} />
    </TranslationProvider>
  ),
  args: {
    files: mockFiles,
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
  },
};
```

### Avantages
- ✅ Changement dynamique de langue via `LanguageSwitcher` ou controls Storybook
- ✅ Traductions complètes (FR, EN, ES, IT)
- ✅ Possibilité de surcharger les traductions par défaut

### Exemple avec traductions personnalisées

```tsx
export const WithCustomTranslations: Story = {
  render: (args) => (
    <TranslationProvider
      initialLanguage={{ code: "FR", name: "Français" }}
      customTranslations={{
        "fileBrowser.noFilesInFolder": {
          "FR": "Aucun fichier trouvé ici",
          "EN": "No files found here",
        },
      }}
    >
      <FileBrowser {...args} />
    </TranslationProvider>
  ),
  args: {
    files: [],
    currentPath: "/Empty",
  },
};
```

---

## Mode 2 : Avec Props (Props-Based) ✨

Passez directement les props `language` et `translations` au composant `FileBrowser`. Ce mode est idéal pour les **composants wrapper** ou lorsque le `TranslationProvider` n'est pas disponible.

### Exemple : FileBrowser avec props

```tsx
import { TranslationMap } from "@/utils/translations";

const customTranslations: Partial<TranslationMap> = {
  "fileBrowser.noFilesInFolder": {
    "FR": "Aucun fichier dans ce dossier",
    "EN": "No files in this folder",
  },
  "fileBrowser.selectAll": {
    "FR": "Tout sélectionner",
    "EN": "Select all",
  },
};

export const WithPropsTranslations: Story = {
  args: {
    files: mockFiles,
    currentPath: "/",
    labelRootFolder: "Mes fichiers",
    showUploadButton: true,
    language: "fr",  // ✨ Langue via props
    translations: customTranslations,  // ✨ Traductions via props
  },
};
```

### Avantages
- ✅ Fonctionne **sans** TranslationProvider
- ✅ Idéal pour les composants wrapper (ex: `SourcingFileBrowser`)
- ✅ Pas de conflit de version React Context
- ✅ Contrôle total sur les traductions

### Utilisation dans un wrapper

```tsx
// Dans votre composant wrapper
export const SourcingFileBrowser: React.FC<Props> = ({
  language = "fr",
  translations,
  ...rest
}) => {
  return (
    <FileBrowser
      language={language}
      translations={translations}
      {...rest}
    />
  );
};
```

---

## Mode 3 : Sans Traductions (Fallback EN)

Utilisez le composant sans `TranslationProvider` ni props de traduction. Le composant utilise automatiquement les traductions **anglaises par défaut**.

### Exemple : FileBrowser sans traductions

```tsx
export const WithoutTranslations: Story = {
  args: {
    files: mockFiles,
    currentPath: "/",
    labelRootFolder: "My Files",  // En anglais
    showUploadButton: true,
    // Pas de language ni translations
  },
};
```

### Comportement
- ✅ Fonctionne sans configuration
- ⚠️ Affiche les traductions **EN** par défaut
- ⚠️ Pas de changement dynamique de langue

---

## Comparaison des 3 Modes

| Caractéristique | Mode 1 : Provider | Mode 2 : Props | Mode 3 : Fallback |
|----------------|-------------------|----------------|-------------------|
| **Changement dynamique** | ✅ Oui | ❌ Non | ❌ Non |
| **Traductions multiples** | ✅ FR, EN, ES, IT | ✅ Custom | ⚠️ EN seulement |
| **Wrapper-friendly** | ⚠️ Peut avoir des conflits | ✅ Oui | ✅ Oui |
| **Configuration** | Provider requis | Props optionnelles | Aucune |
| **Use case principal** | App complète | Composants wrapper | Prototypage rapide |

---

## Exemple Complet : Story avec les 3 Modes

```tsx
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileBrowser, type FileItem } from "./file-browser";
import { TranslationProvider } from "@/contexts/TranslationContext";
import { TranslationMap } from "@/utils/translations";

const meta: Meta<typeof FileBrowser> = {
  title: "Components/FileBrowser",
  component: FileBrowser,
};

export default meta;
type Story = StoryObj<typeof FileBrowser>;

const mockFiles: FileItem[] = [/* ... */];

// MODE 1: Avec TranslationProvider
export const Mode1_WithProvider: Story = {
  render: (args) => (
    <TranslationProvider initialLanguage={{ code: "FR", name: "Français" }}>
      <FileBrowser {...args} />
    </TranslationProvider>
  ),
  args: {
    files: mockFiles,
    currentPath: "/",
  },
  parameters: {
    docs: {
      description: {
        story: "Mode 1 : Utilise TranslationProvider pour gérer les traductions dynamiquement.",
      },
    },
  },
};

// MODE 2: Avec Props
export const Mode2_WithProps: Story = {
  args: {
    files: mockFiles,
    currentPath: "/",
    language: "fr",
    translations: {
      "fileBrowser.noFilesInFolder": {
        "FR": "Aucun fichier personnalisé",
        "EN": "No custom files",
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Mode 2 : Passe les traductions directement via les props `language` et `translations`.",
      },
    },
  },
};

// MODE 3: Sans Traductions (Fallback EN)
export const Mode3_Fallback: Story = {
  args: {
    files: mockFiles,
    currentPath: "/",
    labelRootFolder: "My Files",
  },
  parameters: {
    docs: {
      description: {
        story: "Mode 3 : Aucune configuration de traduction, utilise l'anglais par défaut.",
      },
    },
  },
};
```

---

## Recommandations

### Pour les Stories de Développement
- **Utilisez le Mode 1** : TranslationProvider avec `initialLanguage` pour tester les différentes langues.

### Pour les Composants Wrapper
- **Utilisez le Mode 2** : Props `language` et `translations` pour éviter les conflits de Context.

### Pour les Prototypes Rapides
- **Utilisez le Mode 3** : Aucune configuration, fallback EN automatique.

---

## Clés de Traduction FileBrowser

Voici les clés utilisées par le composant `FileBrowser` :

```typescript
{
  "fileBrowser.noFilesInFolder": "Aucun fichier dans ce dossier",
  "fileBrowser.selectAll": "Tout sélectionner",
  "fileBrowser.unselectAll": "Tout désélectionner",
  "fileBrowser.selected": "{count} sélectionné(s)",
  "fileBrowser.files": "{count} fichier(s)",
  "fileBrowser.filesAndMore": "{count} fichiers et plus...",
  "fileBrowser.limitReached": "{count} fichiers (limite atteinte)",
  "fileBrowser.loadMore": "Afficher les éléments suivants",
  "fileBrowser.loading": "Chargement...",
  "fileBrowser.limitWarning": "La limite maximale de {limit} fichiers a été atteinte. Utilisez les filtres pour affiner votre recherche.",
  "fileBrowser.rename": "Renommer",
  "fileBrowser.move": "Déplacer",
  "fileBrowser.download": "Télécharger",
  "fileBrowser.share": "Partager",
  "fileBrowser.delete": "Supprimer",
  "fileBrowser.createFolder": "Créer un dossier",
  "fileBrowser.importFiles": "Importer des fichiers",
  "fileBrowser.importFolders": "Importer des dossiers",
}
```

---

## Migration depuis v1.0.x vers v1.1.0+

Si vous avez des composants qui wrappent `FileBrowser` (comme `SourcingFileBrowser`), vous devez maintenant **passer les props de traduction** :

### Avant (v1.0.x) ❌
```tsx
// Ne fonctionnait PAS si le Context était d'une version différente
<SourcingFileBrowser files={files} currentPath="/" />
```

### Après (v1.1.0+) ✅
```tsx
// Option 1: Passer les props
<SourcingFileBrowser
  files={files}
  currentPath="/"
  language="fr"
  translations={customTranslations}
/>

// Option 2: Envelopper avec Provider
<TranslationProvider initialLanguage={{ code: "FR", name: "Français" }}>
  <SourcingFileBrowser files={files} currentPath="/" />
</TranslationProvider>
```

---

## Troubleshooting

### Les traductions ne s'affichent pas
1. Vérifiez que vous utilisez le **Mode 1** (Provider) ou **Mode 2** (Props)
2. Vérifiez que la clé de traduction existe dans `defaultTranslations`
3. Consultez la console pour les warnings `Translation key not found`

### Le changement de langue ne fonctionne pas
- Le **Mode 2** (Props) et **Mode 3** (Fallback) ne supportent pas le changement dynamique
- Utilisez le **Mode 1** (Provider) pour activer le changement de langue

### Conflits de Context entre versions
- Si vous utilisez un wrapper compilé avec une ancienne version, utilisez le **Mode 2** (Props)
- Voir [FILEBROWSER-TRANSLATION-GUIDE.md](./FILEBROWSER-TRANSLATION-GUIDE.md) pour plus de détails
