# Guide de Pluralisation

Le système de traduction supporte maintenant **la pluralisation automatique** basée sur le paramètre `count`.

## Comment ça fonctionne

Quand vous appelez `t('key', { count: n })`, le système cherche automatiquement les clés suivantes **dans cet ordre** :

1. `key_zero` si `count === 0`
2. `key_plural` si `count !== 1`
3. `key` (forme singulier) dans tous les autres cas

## Exemples

### Exemple 1 : Fichiers

```typescript
// Traductions
{
  "fileBrowser.filesCount": {
    "FR": "{count} fichier",
    "EN": "{count} file"
  },
  "fileBrowser.filesCount_plural": {
    "FR": "{count} fichiers",
    "EN": "{count} files"
  },
  "fileBrowser.filesCount_zero": {
    "FR": "Aucun fichier",
    "EN": "No files"
  }
}

// Utilisation
t('fileBrowser.filesCount', { count: 0 })  // → "Aucun fichier" (utilise _zero)
t('fileBrowser.filesCount', { count: 1 })  // → "1 fichier" (utilise key de base)
t('fileBrowser.filesCount', { count: 5 })  // → "5 fichiers" (utilise _plural)
```

### Exemple 2 : Éléments sélectionnés

```typescript
// Traductions
{
  "fileBrowser.selected": {
    "FR": "{count} sélectionné",
    "EN": "{count} selected"
  },
  "fileBrowser.selected_plural": {
    "FR": "{count} sélectionnés",
    "EN": "{count} selected"  // EN n'a pas besoin de forme différente
  }
}

// Utilisation
t('fileBrowser.selected', { count: 1 })  // → "1 sélectionné"
t('fileBrowser.selected', { count: 3 })  // → "3 sélectionnés"
```

### Exemple 3 : Notifications

```typescript
// Traductions
{
  "notifications.unread": {
    "FR": "{count} notification non lue",
    "EN": "{count} unread notification"
  },
  "notifications.unread_plural": {
    "FR": "{count} notifications non lues",
    "EN": "{count} unread notifications"
  }
}

// Utilisation
t('notifications.unread', { count: 1 })   // → "1 notification non lue"
t('notifications.unread', { count: 10 })  // → "10 notifications non lues"
```

## Règles de pluralisation

### Français / Anglais (règle simple)

- **Singulier** : `count === 1`
- **Pluriel** : `count !== 1`
- **Zéro** : `count === 0` (optionnel, utilise pluriel par défaut)

### Structure des clés

```
baseKey              → Forme singulier (count === 1)
baseKey_plural       → Forme pluriel (count !== 1)
baseKey_zero         → Forme zéro (count === 0, optionnel)
```

## Compatibilité descendante

**Le système reste compatible avec l'ancien format `{count} fichier(s)`** :

```typescript
// Ancien format (toujours fonctionnel)
{
  "fileBrowser.filesCount": {
    "FR": "{count} fichier(s)",
    "EN": "{count} file(s)"
  }
}

t('fileBrowser.filesCount', { count: 5 })  // → "5 fichier(s)"
```

Mais **le nouveau format avec `_plural` est recommandé** pour une meilleure qualité linguistique :

```typescript
// Nouveau format (recommandé)
{
  "fileBrowser.filesCount": {
    "FR": "{count} fichier",
    "EN": "{count} file"
  },
  "fileBrowser.filesCount_plural": {
    "FR": "{count} fichiers",
    "EN": "{count} files"
  }
}

t('fileBrowser.filesCount', { count: 5 })  // → "5 fichiers" ✅
```

## Migration

Pour migrer vos traductions existantes :

### Étape 1 : Identifier les traductions avec `{count}`

Recherchez toutes les clés contenant `{count}` dans vos traductions.

### Étape 2 : Créer les clés `_plural` et `_zero`

```typescript
// AVANT
{
  "myKey": {
    "FR": "{count} élément(s)",
    "EN": "{count} item(s)"
  }
}

// APRÈS
{
  "myKey": {
    "FR": "{count} élément",
    "EN": "{count} item"
  },
  "myKey_plural": {
    "FR": "{count} éléments",
    "EN": "{count} items"
  },
  "myKey_zero": {  // Optionnel
    "FR": "Aucun élément",
    "EN": "No items"
  }
}
```

### Étape 3 : Tester

```typescript
// Le code reste inchangé
t('myKey', { count: 0 })  // → "Aucun élément"
t('myKey', { count: 1 })  // → "1 élément"
t('myKey', { count: 5 })  // → "5 éléments"
```

## Limitations

### Langues avec règles complexes

Le système actuel supporte uniquement **les règles FR/EN** (2 formes + zéro optionnel).

Pour les langues avec des règles plus complexes (Russe, Arabe, Polonais, etc.), il faudra intégrer **i18next** qui gère automatiquement toutes les règles de pluralisation.

### Exemple de limitation (Russe)

Le russe a **3 formes de pluriel** :
- 1, 21, 31... → "файл"
- 2-4, 22-24... → "файла"
- 5-20, 25-30... → "файлов"

Notre système actuel ne peut pas gérer ces règles complexes. Pour le russe, utilisez i18next.

## Utilisation avec i18next (optionnel)

Si vous avez besoin de règles de pluralisation avancées, vous pouvez installer i18next :

```bash
npm install i18next react-i18next
```

Voir [i18next documentation](https://www.i18next.com/translation-function/plurals) pour plus de détails.

## Exemples complets

### FileBrowser

```typescript
const translations = {
  "fileBrowser.filesCount": {
    "FR": "{count} fichier",
    "EN": "{count} file"
  },
  "fileBrowser.filesCount_plural": {
    "FR": "{count} fichiers",
    "EN": "{count} files"
  },
  "fileBrowser.filesCount_zero": {
    "FR": "Aucun fichier",
    "EN": "No files"
  },
  "fileBrowser.selected": {
    "FR": "{count} sélectionné",
    "EN": "{count} selected"
  },
  "fileBrowser.selected_plural": {
    "FR": "{count} sélectionnés",
    "EN": "{count} selected"
  }
};

<FileBrowser
  files={files}
  language="fr"
  translations={translations}
/>

// Dans le composant
const { t } = useTranslationSafe(translations, "fr");

// Affiche le nombre de fichiers
<p>{t('fileBrowser.filesCount', { count: files.length })}</p>

// Affiche le nombre sélectionné
<p>{t('fileBrowser.selected', { count: selectedCount })}</p>
```

## Résumé

✅ **Support automatique du pluriel** via `_plural` et `_zero`
✅ **Compatible avec l'ancien format** `{count} fichier(s)`
✅ **Fonctionne avec TranslationProvider ET props**
✅ **Pas de breaking change** - migration progressive
⚠️ **Limité aux règles FR/EN** - utiliser i18next pour langues complexes
