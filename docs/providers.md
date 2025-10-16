# Providers

Les providers sont des composants React qui fournissent des fonctionnalités transverses à toute l'application via le Context API.

## 🎨 ThemeProvider

Le `ThemeProvider` gère les thèmes et la personnalisation visuelle.

### Installation

```tsx
import { ThemeProvider } from '@gs/gs-components-library/providers/theme';
```

### Utilisation basique

```tsx
function App() {
  return (
    <ThemeProvider>
      {/* Votre application */}
    </ThemeProvider>
  );
}
```

### Personnalisation initiale

```tsx
<ThemeProvider
  defaultTheme="light"
  initialCustomization={{
    colors: {
      bgWhite: '#f5f5f5',
      bgBlack: '#1a1a1a',
      textBluePrimary: '#0066cc'
    },
    assets: {
      logo: '/path/to/logo.svg'
    },
    text: {
      brandName: 'Mon Entreprise'
    }
  }}
>
  <App />
</ThemeProvider>
```

### Hook useCustomTheme

```tsx
import { useCustomTheme } from '@gs/gs-components-library/providers/theme';

function MyComponent() {
  const {
    theme,              // 'light' | 'dark' | 'system'
    setTheme,           // Fonction pour changer le thème
    customization,      // Configuration actuelle
    updateCustomization,// Mettre à jour la configuration
    resetCustomization  // Réinitialiser aux valeurs par défaut
  } = useCustomTheme();

  // Changer le thème
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Personnaliser les couleurs
  const updateColors = () => {
    updateCustomization({
      colors: {
        bgWhite: '#f0f0f0'
      }
    });
  };

  return (
    <div>
      <button onClick={toggleTheme}>
        Thème actuel : {theme}
      </button>
      <button onClick={updateColors}>
        Personnaliser
      </button>
    </div>
  );
}
```

### Variables disponibles

#### Couleurs de fond
- `bgWhite` - Fond blanc
- `bgBlack` - Fond noir
- `bgGrey` - Fond gris
- `bgGreyLighter` - Fond gris clair
- `bgGreyStrongest` - Fond gris foncé

#### Couleurs de texte
- `textGreyStronger` - Texte gris foncé
- `textBlack` - Texte noir
- `textWhite` - Texte blanc
- `textBluePrimary` - Texte bleu principal
- `textBlue` - Texte bleu

#### Couleurs de statut
- `statusIgnored` - Ignoré
- `statusReshoot` - À refaire
- `statusNotSelected` - Non sélectionné
- `statusSelected` - Sélectionné
- `statusRefused` - Refusé
- `statusForApproval` - Pour approbation
- `statusValidated` - Validé
- `statusToPublish` - À publier
- `statusError` - Erreur
- `statusPublished` - Publié

## 🌍 TranslationProvider

Le `TranslationProvider` gère l'internationalisation (i18n).

### Installation

```tsx
import { TranslationProvider } from '@gs/gs-components-library/providers/translation';
```

### Utilisation basique

```tsx
function App() {
  return (
    <TranslationProvider>
      {/* Votre application */}
    </TranslationProvider>
  );
}
```

### Configuration avancée

```tsx
<TranslationProvider
  initialLanguage={{ code: 'FR', name: 'Français' }}
  languages={[
    { code: 'FR', name: 'Français' },
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' }
  ]}
  customTranslations={{
    'welcome.title': {
      FR: 'Bienvenue',
      EN: 'Welcome',
      ES: 'Bienvenido',
      DE: 'Willkommen'
    },
    'button.submit': {
      FR: 'Envoyer',
      EN: 'Submit',
      ES: 'Enviar',
      DE: 'Senden'
    }
  }}
>
  <App />
</TranslationProvider>
```

### Hook useTranslation

```tsx
import { useTranslation } from '@gs/gs-components-library/providers/translation';

function MyComponent() {
  const {
    currentLanguage,    // Langue actuelle
    setLanguage,        // Changer de langue
    availableLanguages, // Langues disponibles
    t                   // Fonction de traduction
  } = useTranslation();

  return (
    <div>
      {/* Traduction simple */}
      <h1>{t('welcome.title')}</h1>

      {/* Traduction avec paramètres */}
      <p>{t('user.greeting', { name: 'Jean' })}</p>

      {/* Sélecteur de langue */}
      <select
        value={currentLanguage.code}
        onChange={(e) => {
          const lang = availableLanguages.find(
            l => l.code === e.target.value
          );
          if (lang) setLanguage(lang);
        }}
      >
        {availableLanguages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Traductions par défaut

La librairie inclut des traductions pour les composants internes :

```typescript
{
  'file.upload': {
    FR: 'Télécharger',
    EN: 'Upload'
  },
  'file.delete': {
    FR: 'Supprimer',
    EN: 'Delete'
  },
  'pagination.next': {
    FR: 'Suivant',
    EN: 'Next'
  }
}
```

## 📊 ActivityStatusProvider

Le `ActivityStatusProvider` gère les statuts d'activité et les notifications.

### Installation

```tsx
import { ActivityStatusProvider } from '@gs/gs-components-library/providers/activity-status';
```

### Utilisation

```tsx
function App() {
  return (
    <ActivityStatusProvider>
      {/* Votre application */}
    </ActivityStatusProvider>
  );
}
```

### Hook useActivityStatus

```tsx
import { useActivityStatus } from '@gs/gs-components-library/providers/activity-status';

function MyComponent() {
  const {
    activities,      // Liste des activités
    addActivity,     // Ajouter une activité
    updateActivity,  // Mettre à jour une activité
    removeActivity,  // Supprimer une activité
    clearActivities  // Vider toutes les activités
  } = useActivityStatus();

  // Ajouter une activité
  const handleUpload = async (file) => {
    const id = addActivity({
      type: 'upload',
      name: file.name,
      progress: 0
    });

    // Simuler l'upload
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 100));
      updateActivity(id, { progress: i });
    }

    removeActivity(id);
  };

  return (
    <div>
      {activities.map(activity => (
        <div key={activity.id}>
          {activity.name}: {activity.progress}%
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Combinaison des providers

### Setup recommandé

```tsx
import { ThemeProvider } from '@gs/gs-components-library/providers/theme';
import { TranslationProvider } from '@gs/gs-components-library/providers/translation';
import { ActivityStatusProvider } from '@gs/gs-components-library/providers/activity-status';

function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <ActivityStatusProvider>
          {children}
        </ActivityStatusProvider>
      </TranslationProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AppProviders>
      {/* Votre application */}
    </AppProviders>
  );
}
```

### Provider personnalisé

Créez votre propre provider qui combine tous les autres :

```tsx
// providers/GlobalProvider.tsx
import React from 'react';
import { ThemeProvider } from '@gs/gs-components-library/providers/theme';
import { TranslationProvider } from '@gs/gs-components-library/providers/translation';

const themeConfig = {
  // Votre configuration de thème
};

const translationConfig = {
  // Votre configuration de traduction
};

export function GlobalProvider({ children }) {
  return (
    <ThemeProvider {...themeConfig}>
      <TranslationProvider {...translationConfig}>
        {children}
      </TranslationProvider>
    </ThemeProvider>
  );
}
```

## 💾 Persistance

### ThemeProvider

Les préférences de thème sont automatiquement sauvegardées dans `localStorage` :

```javascript
localStorage.getItem('gs-components-theme-customization')
```

### TranslationProvider

La langue sélectionnée est sauvegardée dans `localStorage` :

```javascript
localStorage.getItem('preferredLanguage')
```

## ⚠️ Bonnes pratiques

### ✅ À faire

- Toujours placer les providers au plus haut niveau de l'application
- Utiliser les hooks uniquement dans les composants enfants des providers
- Centraliser la configuration des providers
- Gérer les erreurs de traduction manquante

### ❌ À éviter

- Imbriquer plusieurs fois le même provider
- Modifier directement le localStorage
- Utiliser les hooks en dehors des providers
- Hardcoder les traductions dans les composants

## 🔍 Debugging

### Provider non trouvé

Erreur : `useCustomTheme must be used within a ThemeProvider`

Solution : Vérifier que le composant est bien enfant du provider

### Traduction manquante

Si une clé de traduction n'existe pas, la clé elle-même est retournée :

```tsx
t('missing.key') // Retourne "missing.key"
```

Pour débugger :
```tsx
console.warn(`Translation key not found: ${key}`);
```