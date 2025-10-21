# Layout Components - Background Context System

## 🎯 Vue d'ensemble

Les composants Layout, HStack et VStack utilisent un système de **React Context** pour propager le background (`data-bg`) à travers l'arbre de composants. Cela permet aux composants enfants (comme Button) d'appliquer automatiquement les bons styles CSS via des sélecteurs contextuels.

## 📦 Composants

### `Layout`
Composant de base qui gère le contexte de couleur de fond.

```tsx
<Layout bg="white" padding={4}>
  {/* Contenu */}
</Layout>
```

### `HStack`
Stack horizontal (flexbox row) qui hérite ou définit le contexte bg.

```tsx
<HStack gap={4} align="center">
  {/* Enfants horizontalement */}
</HStack>
```

### `VStack`
Stack vertical (flexbox column) qui hérite ou définit le contexte bg.

```tsx
<VStack gap={6} align="start">
  {/* Enfants verticalement */}
</VStack>
```

## 🔄 Système de propagation BgContext

### Comment ça marche

1. **BgProvider** : Chaque Layout avec `bg` spécifié crée un nouveau React Context
2. **useBgContext** : Composants enfants lisent le bg du parent via le hook
3. **effectiveBg** : `bg || parentBg` détermine le bg effectif à appliquer
4. **data-bg** : Attribut HTML appliqué pour les sélecteurs CSS

### Code interne (simplifié)

```tsx
// Layout.tsx
const parentBg = useBgContext();           // Lit contexte parent
const effectiveBg = bg || parentBg;        // Hérite si non spécifié

<Component data-bg={effectiveBg}>
  {children}
</Component>

// Si bg spécifié, crée nouveau contexte
return bg ? (
  <BgProvider value={bg}>{content}</BgProvider>
) : content;
```

## 🏗️ Layouts imbriqués - Règles importantes

### ✅ Le contexte enfant écrase TOUJOURS le parent

```tsx
<Layout bg="white">           {/* BgContext = "white" */}
  <Layout bg="grey">          {/* BgContext = "grey" (écrase white) */}
    <Layout bg="black">       {/* BgContext = "black" (écrase grey) */}
      <Button />              {/* Utilise styles BLACK uniquement */}
    </Layout>
  </Layout>
</Layout>
```

**DOM généré** :
```html
<div data-bg="white">
  <div data-bg="grey">
    <div data-bg="black">
      <button class="btn-normal">
        <!-- Styles via [data-bg="black"] .btn-normal -->
      </button>
    </div>
  </div>
</div>
```

**CSS appliqué** :
```css
/* ✅ CE sélecteur match (ancêtre le plus proche) */
[data-bg="black"] .btn-normal {
  background: var(--button-b-normal-bg-default);
  color: var(--button-b-normal-fg-default);
}

/* ❌ Ces sélecteurs ne matchent PAS (ancêtres plus éloignés) */
[data-bg="grey"] .btn-normal { ... }
[data-bg="white"] .btn-normal { ... }
```

### 🎨 Comportement selon la spécification de `bg`

#### Cas 1 : Layout avec `bg` spécifié
```tsx
<Layout bg="grey">
  <HStack gap={3}>
    <Button />  {/* data-bg="grey" via Context */}
  </HStack>
</Layout>
```
- Crée **nouveau BgProvider** avec value="grey"
- Applique `data-bg="grey"` sur l'élément DOM
- Tous les enfants héritent "grey"

#### Cas 2 : Layout sans `bg` (hérite du parent)
```tsx
<Layout bg="white">
  <VStack gap={4}>        {/* Hérite bg="white" */}
    <HStack gap={2}>      {/* Hérite bg="white" */}
      <Button />          {/* data-bg="white" */}
    </HStack>
  </VStack>
</Layout>
```
- HStack/VStack utilisent `useBgContext()` pour lire "white"
- Appliquent `data-bg="white"` sur leurs éléments DOM
- Ne créent PAS de nouveau BgProvider
- Le contexte "white" continue de se propager

#### Cas 3 : Surcharge du contexte
```tsx
<Layout bg="white">
  <VStack gap={4}>              {/* Hérite white */}
    <Button />                  {/* Styles white */}

    <HStack bg="black" gap={2}> {/* Surcharge avec black */}
      <Button />                {/* Styles black */}
    </HStack>

    <Button />                  {/* Retour à white */}
  </VStack>
</Layout>
```

## 🧪 Exemple complet : 3 niveaux imbriqués

```tsx
<Layout bg="white" padding={4}>
  {/* Niveau 1 : Contexte WHITE */}
  <Button variant="normal" />  {/* Bleu clair (white styles) */}

  <Layout bg="grey" padding={4}>
    {/* Niveau 2 : Contexte GREY (écrase white) */}
    <Button variant="normal" />  {/* Gris (grey styles) */}

    <Layout bg="black" padding={4}>
      {/* Niveau 3 : Contexte BLACK (écrase grey) */}
      <Button variant="normal" />  {/* Noir (black styles) */}
    </Layout>

    {/* Retour au niveau 2 : Contexte GREY */}
    <Button variant="normal" />  {/* Gris (grey styles) */}
  </Layout>

  {/* Retour au niveau 1 : Contexte WHITE */}
  <Button variant="normal" />  {/* Bleu clair (white styles) */}
</Layout>
```

**Arbre React Context** :
```
BgProvider(white)
├─ Button (white)
├─ BgProvider(grey)
│  ├─ Button (grey)
│  ├─ BgProvider(black)
│  │  └─ Button (black)
│  └─ Button (grey)
└─ Button (white)
```

## 🚨 Points d'attention

### ❌ Erreur : Oublier le Layout racine
```tsx
{/* ❌ Pas de Layout racine avec bg */}
<HStack gap={3}>
  <Button />  {/* data-bg=undefined → pas de styles ! */}
</HStack>
```

**Solution** :
```tsx
{/* ✅ Layout racine définit le contexte */}
<Layout bg="white">
  <HStack gap={3}>
    <Button />  {/* data-bg="white" ✓ */}
  </HStack>
</Layout>
```

### ✅ Bonne pratique : Layout racine dans les stories
```tsx
export const MyStory: Story = {
  render: () => (
    <Layout bg="white" padding={6}>  {/* Toujours un Layout racine */}
      {/* Votre contenu */}
    </Layout>
  ),
};
```

## 🔍 Debugging

### Vérifier le data-bg dans le DOM
```tsx
// Dans le DevTools, chercher :
<div data-bg="white">
  <div data-bg="grey">  {/* Nouveau contexte */}
    <button class="btn-normal">
```

### Hook de debug
```tsx
import { useBgContext } from '@/components/layout';

function MyComponent() {
  const bg = useBgContext();
  console.log('Current bg context:', bg);  // "white" | "grey" | "black" | undefined
  return <Button />;
}
```

## 📚 Ressources

- [Layout.tsx](./Layout.tsx) - Composant principal
- [BgContext.tsx](./BgContext.tsx) - React Context
- [Button.stories.tsx](../../stories/Button.stories.tsx) - Story "NestedLayouts"
- [Figma tokens CSS](../../styles/figma-tokens.css) - Sélecteurs `[data-bg=...]`

## 🎓 Règles à retenir

1. ✅ **Chaque Layout avec `bg`** crée un nouveau contexte qui écrase le parent
2. ✅ **HStack/VStack sans `bg`** héritent du contexte parent de manière transparente
3. ✅ **Le CSS utilise l'ancêtre le plus proche** avec `[data-bg="..."]`
4. ✅ **Aucun héritage en cascade** - chaque niveau est isolé
5. ✅ **Toujours un Layout racine** dans les composants/stories pour définir le contexte initial
