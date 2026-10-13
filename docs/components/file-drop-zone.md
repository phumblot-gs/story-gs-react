# FileDropZone and external FileBrowser deposits

`FileDropZone` is a file picker and drop target. `FileBrowser` uses `FileDropZone mode="overlay"` directly around its list, leaving the breadcrumb and toolbar visible.

## Excel: one workbook, then application analysis and validation

```tsx
import { FileDropZone } from '@gs/gs-components-library';

<FileDropZone
  language="fr"
  label="Glissez votre fichier Excel ici"
  description="Le fichier sera analysé puis chargé après validation"
  options={{ accept: '.xlsx,.xls', multiple: false, maxSize: 10 * 1024 * 1024 }}
  onFilesDrop={files => openAnalysisAndValidation(files[0])}
  onDropRejected={result => logEligibilityErrors(result.rejections)}
  onDropError={error => reportServiceFailure(error)}
/>
```

The 10 MiB limit is illustrative: configure the application's actual limit. `onFilesDrop` receives eligible files; it does **not** imply successful upload, analysis, or import. File contents, spreadsheet structure and server rules remain the application's responsibility. A returned promise disables further submissions until it settles; rejection displays a retry message. No network request is built into this component.

## Preview states

- `accepted`: declared format/count appears eligible. Green tint, plus icon, “Drop to add files”. This is provisional, not a content-validation success.
- `rejected`: incompatible declared type or excessive count. Red tint, refusal icon, cursor `dropEffect="none"`.
- `unknown`: missing/generic MIME type, unavailable item list or a custom extension that cannot be inferred from MIME. Blue tint, question icon, “Drop to check files”. Dropping remains possible.
- `mixed`: the batch includes eligible/unknown and incompatible declared types. Orange tint and warning icon. Actual eligibility is determined after drop.

Hover only inspects `DataTransfer.items[].kind/type`. It never reads `files`, `getAsFile`, filenames, sizes or contents in protected drag mode. An absent MIME type is not automatically rejected. Count is shown/checked in preview only when the item list is exposed.

After drop, extensions/MIME rules, count, size, empty files and `validateFile(file)` are checked. An invalid batch is rejected in full: eligible members are listed in `acceptedFiles`, but **none are forwarded**. No silent partial import. Unreadable items/directories omitted from FileList also block a validated batch.

## Options

| Option | Default | Meaning |
|---|---|---|
| `accept` | unrestricted | Comma-separated native input syntax: `.xlsx`, `image/png`, `image/*` |
| `multiple` | `true` | `false` limits the complete batch to one file |
| `maxFiles` | unlimited | Maximum batch count; the tighter count rule wins |
| `maxSize` | unlimited | Maximum bytes per file, checked after drop |
| `rejectEmpty` | `true` | Whether zero-byte files are refused |
| `validateFile` | none | Synchronous application check returning an error message or `undefined` |

The picker and actual drop use identical eligibility checks. Cancellation of the picker preserves current results; the same file can be selected again.

## FileBrowser integration and compatibility

```tsx
<FileBrowser
  files={files}
  currentPath="/EXPORT GS"
  fileDropOptions={{ accept: '.jpg,.jpeg,.png,.tif,.tiff,.webp', maxFiles: 50 }}
  onFilesDrop={files => importIntoCurrentFolder(files)}
  onFileDropRejected={result => handleRejectedBatch(result)}
  onFileDropError={error => reportServiceFailure(error)}
/>
```

The format list and limit are examples, not global FileBrowser defaults. Without a handler, external imports are disabled. Native file drops target the list; the header does not intercept them as an import. Internal row moves keep their existing behavior and never invoke file-import callbacks.

Existing `onFileDrop(event)` integrations continue to receive native events without new filtering when no `fileDropOptions` are provided, including integrations that handle folders themselves. Setting rules enables eligibility checking before this legacy callback. If both callbacks are present, `onFilesDrop` takes precedence to avoid double import. `onFilesDrop` only receives readable `File` objects; directory imports remain an application concern.

## Accessibility, styling, translations

Text and icons convey every state; color is supplementary. Announcements use polite status regions and inline error alerts. Feedback cannot capture pointer events and does not resize the target. Entry and color transitions last 160 ms; `prefers-reduced-motion: reduce` or `data-gs-reduced-motion` removes them. Tokens come from GS styles. Include the library CSS as usual.

Labels and feedback have FR/EN/ES/IT/DE defaults, via `TranslationProvider` or `language`/`translations` props. `label`, `description`, `chooseButtonLabel`, and `destination` customize context. Keep an explicit picker button alongside drag and drop.

The picker button uses `chooseButtonVariant` (default `normal`) and `chooseButtonSize` (default `medium`), with the GS Button variant and size types. `chooseButtonLabel` also names the accessible file input; it replaces the former `chooseLabel` prop.

## Storybook coverage

`Components/FileDropZone`: Excel, multiple images, size limit, disabled, English, reduced motion, callback failure, custom validation, accepted/refused/unknown/mixed hover and an interactive scenario simulator. The simulator illustrates declared metadata, not actual content validation.

External deposit examples live under `Components/FileDropZone`, including `FileBrowserScenarios` and `OverlayFileBrowser`. The FileBrowser stories keep their internal row drag-and-drop examples.


## Overlay on an existing surface

`mode="standalone"` remains the default. With `mode="overlay"`, children stay mounted and keep their existing layout, background context and interactions. No permanent prompt, picker, padding, border or minimum height is added. File feedback appears above the complete wrapped surface during an external file drag. Processing and rejection messages are also positioned above it, without changing its height. Give the wrapper a real content area; use `className` for any required flex sizing.

```tsx
<FileDropZone
  mode="overlay"
  language="fr"
  options={{ accept: '.xlsx,.xls', multiple: false }}
  destination="Catalogues à analyser"
  onFilesDrop={queueForAnalysis}
>
  <DataTable data={catalogues} columns={columns} getRowId={row => row.id} />
</FileDropZone>
```

The overlay owns external file events in the capture phase. A wrapped FileBrowser's own import callback is therefore not also invoked; internal row drags pass through untouched. In nested drop zones the outer overlay owns external deposits. Wrap only the intended destination and configure its rules there. `disabled` disables deposits, without disabling or dimming child controls. Keep an accessible file-picker action in the host: overlay mode does not render the standalone `chooseButton*` button/input, label or description.

`OverlayFileBrowser` wraps the complete browser, including its breadcrumb and toolbar. Use the FileBrowser's existing `fileDropOptions` / `onFilesDrop` integration instead when feedback should cover only its list. `OverlayDataTable` wraps a sortable, selectable catalogue table. Both stories provide native file picking and simulations for compatible, incompatible, unknown and mixed files, plus asynchronous success and failure. Simulated files illustrate eligibility; they are not real parsed workbooks.


### FileBrowser composition and legacy events

FileBrowser delegates external deposits, eligibility and transient state to a single FileDropZone in overlay mode. Its list, scrolling and internal row handlers remain mounted. `resetKey={currentPath}` clears feedback when navigating without remounting those children. FileDropZone also accepts `resetKey` for other destination changes.

The optional second argument of `FileDropZone.onFilesDrop(files, event)` is the native React drag event for a drop; picker selection supplies no event. FileBrowser uses it to adapt the historical `onFileDrop(event)` callback. `validateDrop` defaults to `true`; FileBrowser disables it only for legacy event-based imports with no `fileDropOptions`, preserving integrations that handle directories themselves. Modern file callbacks and explicit rules always enable validation. Processing and errors now stay above the list without resizing it.
