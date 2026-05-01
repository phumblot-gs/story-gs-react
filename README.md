# GS Components Library

Modern React UI component library built on top of [shadcn/ui](https://ui.shadcn.com), Tailwind CSS and TypeScript. Designed for Grand Shooting applications and consumer projects, with accessible primitives, a design-token theme, and a Storybook-driven documentation site.

- 📚 **Live documentation:** https://gs-components-library.grand-shooting.org/
- 📦 **Registry:** `https://nexus.grand-shooting.org/repository/npm-gs/`

---

## Installation

```bash
npm install @gs/gs-components-library
```

The package targets React 18 / 19 (declared as peer dependencies). It also relies on a handful of `@radix-ui/*` packages and `lucide-react`; npm will install them as transitive dependencies automatically.

---

## Quick start

### 1. Import the compiled CSS

Import this once at your app's entry point (e.g. `src/main.tsx`, `src/index.tsx`, or your top-level layout):

```tsx
import "@gs/gs-components-library/styles";
```

That single import provides every Tailwind class, design token (CSS variables) and font face used by the library. **You do not need to add the lib's path to your own Tailwind `content` array** — all classes used by the components are already pre-compiled in this stylesheet.

> 💡 Equivalent paths that all resolve to the same file: `@gs/gs-components-library/lib.css`, `@gs/gs-components-library/style.css`, or directly `@gs/gs-components-library/dist/lib.css`. Pick whichever suits your tooling.

### 2. Use components

```tsx
import { Button, FileBrowser, type FileItem } from "@gs/gs-components-library";

function App() {
  return (
    <div>
      <Button>Get started</Button>
      <FileBrowser
        files={myFiles}
        currentPath="/"
        onNavigate={(path) => console.log(path)}
      />
    </div>
  );
}
```

### 3. Wrap with the providers (recommended)

For full theming + i18n support, wrap your app in `GSComponentsRoot`:

```tsx
import { GSComponentsRoot } from "@gs/gs-components-library";

<GSComponentsRoot
  themeConfig={{ /* optional: defaultTheme, customTokens, ... */ }}
  translationConfig={{ defaultLanguage: "FR" }}
>
  <App />
</GSComponentsRoot>
```

`GSComponentsRoot` sets up `ThemeProvider`, `TranslationProvider` and `StyleProvider`. If you only want to apply the global stylesheet without the providers, use `<GSGlobalStyles />` instead.

---

## Use Tailwind alongside the lib (optional)

If your own components are written with Tailwind utility classes and you want them to share the GS design tokens (colors, spacing scale, font sizes, animations…), extend our **Tailwind preset** in your `tailwind.config.{js,cjs}`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@gs/gs-components-library/tailwind-preset")],
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./index.html",
  ],
  // your project-specific extensions go here
};
```

The preset provides:

- the full GS color palette (`black`, `grey-light…strongest`, `blue-primary`, `pastel-yellow`, status `token.state.*`, grades, flags…) bound to CSS variables so they switch with the active theme,
- the 5 px spacing increments (`p-1` = 5 px, `p-2` = 10 px, `p-4` = 20 px…),
- font families (`AvenirNextLTPro`), font sizes (`xs`–`xxl`), font weights, line heights,
- border-radius scale, animations (`accordion-down/up`, `gradient-flow`),
- `tailwindcss-animate` plugin.

> The preset requires `tailwindcss-animate` to be installed in your project: `npm install -D tailwindcss-animate`.

If your project only consumes the lib's pre-built components and **doesn't add custom Tailwind classes that need the GS tokens**, you can skip the preset entirely — the imported `dist/lib.css` already covers everything used by the components.

---

## Documentation

The full reference, props and live examples are in the Storybook:

👉 **https://gs-components-library.grand-shooting.org/**

Highlights:
- Interactive playground for every component
- Auto-generated props tables
- Code recipes for common patterns (FileBrowser data, ActivityHeatmap subtitles with pluralization, DataTable filters, etc.)
- Theme tokens explorer
- Accessibility notes

---

## Available components (non-exhaustive)

- **Layout:** `Layout`, `HStack`, `VStack`, `Modal`, `FullFrame`, `SidePanel`, `ActionBar`
- **Pages:** `PageHeader`, `PageSearch`, `PageWelcome`
- **Tables:** `DataTable` (sort, pagination, multi-select, ActionBar integration, shift-click range), the underlying shadcn `Table` primitives are also exported
- **Buttons:** `Button`, `ButtonMenu`, `ButtonPlus`, `ButtonNotifications`, `ButtonStatus`, plus thumbnail variants (`ButtonThumbnailStars`, `ButtonThumbnailLabels`, etc.)
- **Forms:** `Select`, `SelectAutocomplete`, `Input`, `InputOTP`, `Search`, `Checkbox`, `RadioGroup`, `Toggle`, `Switch`, `Slider`, `Calendar`
- **Containers / cards:** `Card` (with `variant="filled" | "outline"`), `Sheet`, `Drawer`, `Dialog`, `Popover`, `Tooltip`, `HoverCard`, `Accordion`, `Tabs`, `TabsWithViews`, `Carousel`
- **Feedback:** `Alert`, `Toaster`/`toast`, `Progress`, `Skeleton`
- **Domain:** `FileBrowser`, `FolderBrowser`, `ActivityHeatmap`, `Thumbnail`, `MediaStatus`, `StatusIndicator`
- **Icons:** the full `Icon` set (Lucide + custom GS icons via `IconProvider`)

---

## Design system & theming

Every component reads its surface color from the closest `Layout` ancestor's `data-bg` attribute (`white` / `grey` / `black`). Most components automatically swap their fill, border and contrast accordingly — for example, `Card` flips white ↔ grey, and `Select` adapts its trigger / dropdown / placeholder colors.

For finer customization, wrap the app in `<ThemeProvider>` (or pass `themeConfig` to `GSComponentsRoot`) and override CSS variables in your own `:root` block:

```css
:root {
  --status-error-color: #FF4444;
  /* …any other --* token from tailwind-preset.cjs */
}
```

---

## Notes worth knowing

- **`StatusIndicator` inside a `<button>`**: when its parent `<button>` is `:hover`, `:active` or `:disabled`, the indicator color is intentionally overridden by `lib.css` (the indicator becomes `currentColor` on hover, blue on press, grey on disabled). This is by design so that a disabled button looks fully greyed out, indicator included. If you want to keep the status color regardless of the button state, render the `StatusIndicator` **outside** the button or apply your own override class with higher specificity.
- **`FileBrowser` data shape**: expects `snake_case` field names (`file_name`, `file_size`, `is_directory`, `created_at`, `updated_at`). Use ISO-8601 strings for dates.
- **i18n**: `Layout`, `FileBrowser`, `FolderBrowser`, `DataTable`, `ActivityHeatmap`, `PageWelcome`, `Select`, `TabsWithViews` and a few others accept a `language?: string` prop and a `translations?: Partial<TranslationMap>` prop, with EN / FR / ES / IT / DE shipped by default. Wrap in `<TranslationProvider>` to drive the language globally; the prop overrides take precedence over the context.
- **Debug mode**: most interactive components accept `debug={true}` to log validated props in the console.

---

## Development

### Project structure

```
src/
├── components/
│   ├── ui/              # base components (shadcn primitives + GS overrides)
│   ├── layout/          # Layout, HStack, VStack, Modal, ActionBar…
│   ├── PageHeader/      # higher-level page composition
│   ├── PageSearch/
│   ├── PageWelcome/
│   ├── notifications/
│   └── Thumbnail/
├── lib/                 # tiny helpers (cn, etc.)
├── utils/               # translations, mediaStatus, color, notifications
├── styles/              # design tokens (figma-tokens.css, typography.css, custom-styles.css)
├── contexts/            # ThemeContext, TranslationContext, StyleProvider
└── index.ts             # main entry point — re-exports everything
```

### Local development

```bash
# Install dependencies
npm install

# Run Storybook
npm run storybook

# Type-check + tests
npm run lint
npm run test

# Build the library bundle
npm run build:lib

# Build Storybook for production
npm run build-storybook
```

### Pre-push hook

A pre-push hook runs `build-storybook` to catch broken stories before they reach CI. Install with:

```bash
./scripts/install-pre-push-hook.sh
```

To bypass (not recommended): `git push --no-verify`.

### Testing locally inside another app

```bash
# In gs-components-library
npm run build:lib
npm link

# In the consuming app
npm link @gs/gs-components-library
```

---

## Release & publishing

The Nexus publication is automated by the `Publish Package to Nexus` GitHub workflow. To cut a new release:

```bash
git checkout latest
npm version --no-git-tag-version <patch|minor|major>
# update CHANGELOG.md
git commit -am "<new version>"
git tag v<new version>
git push origin latest
git push origin v<new version>     # ← triggers the workflow
git checkout main
git merge --no-ff latest
git push origin main
```

The workflow validates that `package.json` matches the tag, runs `build:lib`, then `npm publish` to the Nexus registry.

---

## License

MIT

**Questions or issues?** See the [Storybook](https://gs-components-library.grand-shooting.org/) or open an issue on GitHub.
