import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, expect, waitFor, within } from 'storybook/test';
import { FileDropZone, type FileDropZoneProps } from './file-drop-zone';
import { FileDropFeedback } from './file-drop-feedback';
import { FileBrowser, type FileItem } from './file-browser';
import { DataTable, type TableColumn } from './data-table';
import { validateDroppedFiles } from '@/lib/file-drop';
import { BgProvider } from '@/components/layout/BgContext';
import { Button } from './button';
import type { FileDragPreview } from '@/lib/file-drop';

const EXCEL = { accept: '.xlsx,.xls', multiple: false };
const IMAGES = { accept: '.jpg,.jpeg,.png,.tif,.tiff,.webp', maxFiles: 10 };
const meta = {
  excludeStories: ['DragDropScenarios'],
  title: 'Components/FileDropZone', component: FileDropZone, tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: 'Shared external-file feedback: accepted (provisional), rejected, unknown and mixed. MIME hints are read during hover; extensions, size and count are checked after drop. Complete batches only; the application performs content analysis, validation and loading. Internal FileBrowser row moves are unaffected.' } } },
  argTypes: {
    mode: { control: 'select', options: ['standalone', 'overlay'], table: { defaultValue: { summary: 'standalone' } } },
    chooseButtonLabel: { control: 'text' },
    chooseButtonVariant: { control: 'select', options: ['normal', 'secondary', 'ghost', 'outline', 'destructive', 'link', 'inverse'], table: { defaultValue: { summary: 'normal' } } },
    chooseButtonSize: { control: 'select', options: ['small', 'medium', 'large'], table: { defaultValue: { summary: 'medium' } } },
  },
  args: { options: EXCEL, onFilesDrop: fn(), language: 'fr', label: 'Glissez votre fichier Excel ici', description: 'Le fichier sera analysé puis chargé après validation.' },
} satisfies Meta<typeof FileDropZone>;
export default meta;
type Story = StoryObj<typeof meta>;

function Interactive(props: FileDropZoneProps) {
  const [names, setNames] = useState<string[]>([]);
  return <div className="max-w-[640px] space-y-4"><FileDropZone {...props} onFilesDrop={async files => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    await props.onFilesDrop(files); setNames(files.map(f => f.name));
  }} /><div role="status" className="text-sm break-words">{names.length > 0 && `Prêt pour l’analyse : ${names.join(', ')}`}</div></div>;
}
export const Excel: Story = { render: args => <Interactive {...args} /> };
export const MultipleImages: Story = { args: { options: IMAGES, label: 'Glissez vos images ici', description: 'JPG, PNG, TIFF ou WebP · 10 fichiers maximum' }, render: args => <Interactive {...args} /> };
export const SizeLimit: Story = { args: { options: { ...EXCEL, maxSize: 1024 * 1024 }, description: 'Un fichier Excel · 1 Mo maximum' } };
export const Disabled: Story = { args: { disabled: true } };
export const English: Story = { args: { language: 'en', label: 'Drag your Excel file here', description: 'The file will be analysed, then loaded after validation.' } };
export const ReducedMotion: Story = { render: args => <div data-gs-reduced-motion><Interactive {...args} /></div> };
export const CallbackFailure: Story = { args: { onFilesDrop: fn(async () => { throw new Error('Simulated service failure'); }) } };
export const CustomValidation: Story = { args: { options: { ...EXCEL, validateFile: file => file.name.startsWith('Catalogue_') ? undefined : 'Le nom doit commencer par Catalogue_.' } } };

function Hover({ preview, reduced = false }: { preview: FileDragPreview; reduced?: boolean }) {
  return <div {...(reduced ? { 'data-gs-reduced-motion': '' } : {})} className="relative min-h-[220px] max-w-[640px] border border-grey bg-white"><FileDropFeedback preview={preview} options={EXCEL} language="fr" /></div>;
}
export const HoverAccepted: Story = { render: () => <Hover preview={{ state: 'accepted', count: 1 }} /> };
export const HoverRejectedFormat: Story = { render: () => <Hover preview={{ state: 'rejected', count: 1, reason: 'format' }} /> };
export const HoverRejectedCount: Story = { render: () => <Hover preview={{ state: 'rejected', count: 2, reason: 'count' }} /> };
export const HoverUnknownType: Story = { render: () => <Hover preview={{ state: 'unknown', count: 1 }} /> };
export const HoverMixedBatch: Story = { render: () => <div className="relative min-h-[220px] max-w-[640px]"><FileDropFeedback preview={{ state: 'mixed', count: 3, reason: 'format' }} options={IMAGES} language="fr" /></div> };
export const HoverReducedMotion: Story = { render: () => <Hover reduced preview={{ state: 'accepted' }} /> };

/** Browser-side simulator. Protected mode is tested separately with item-only fixtures. */
export function DragDropScenarios({ browser = false, longList = false }: { browser?: boolean; longList?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState('');
  const [example, setExample] = useState('accepted');
  const options = browser ? IMAGES : EXCEL;
  const browserFiles = longList ? Array.from({ length: 80 }, (_, index) => ({
    id: String(index), file_name: `visuel_${String(index + 1).padStart(3, '0')}.png`, parent_path: '/EXPORT GS',
    file_size: 2048, mime_type: 'image/png', is_directory: false,
    created_at: '2026-10-13T08:00:00Z', updated_at: '2026-10-13T08:00:00Z',
  })) : [];
  function transfer() {
    const data = new DataTransfer();
    const type = browser ? 'image/png' : 'application/vnd.ms-excel';
    const name = browser ? 'visuel.png' : 'catalogue.xls';
    const make = (n: string, t: string) => new File(['story fixture'], n, { type: t });
    if (example === 'rejected') data.items.add(make('document.pdf', 'application/pdf'));
    else if (example === 'unknown') data.items.add(make(name, ''));
    else {
      data.items.add(make(name, type));
      if (example === 'multiple') data.items.add(make(browser ? 'visuel_2.png' : 'catalogue_2.xls', type));
      if (example === 'mixed') data.items.add(make('document.pdf', 'application/pdf'));
    }
    return data;
  }
  function dispatch(event: 'dragenter' | 'dragover' | 'dragleave' | 'drop') {
    const target = ref.current?.querySelector('[data-file-drop-target], .gs-file-drop-zone');
    if (!target) return;
    target.dispatchEvent(new DragEvent(event, { bubbles: true, cancelable: true, dataTransfer: transfer() }));
  }
  return <div ref={ref} className="space-y-4">
    <div className="flex flex-wrap gap-3 items-center">
      <label className="text-sm">Scénario <select aria-label="Scénario" value={example} onChange={e => setExample(e.target.value)}>
        <option value="accepted">Compatible</option><option value="rejected">PDF refusé</option><option value="unknown">Type inconnu</option><option value="multiple">Plusieurs fichiers</option><option value="mixed">Lot mixte</option>
      </select></label>
      <Button onClick={() => { dispatch('dragenter'); dispatch('dragover'); }}>Survoler</Button>
      <Button onClick={() => dispatch('dragleave')}>Quitter</Button>
      <Button onClick={() => dispatch('drop')}>Déposer</Button>
    </div>
    {browser ? <FileBrowser files={browserFiles} currentPath="/EXPORT GS" language="fr" showUploadButton fileDropOptions={options} onFilesDrop={files => setResult(`${files.length} fichiers reçus`)} />
      : <FileDropZone language="fr" options={options} description="Le fichier sera analysé puis chargé après validation." onFilesDrop={files => setResult(files.map(f => f.name).join(', '))} />}
    <p role="status" className="text-sm break-words">{result}</p>
  </div>;
}
export const InteractiveScenarios: Story = {
  render: () => <DragDropScenarios />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.getByRole('button', { name: 'Survoler' }).click();
    await waitFor(() => expect(canvasElement.querySelector('[data-file-drop-feedback]')).toHaveAttribute('data-state', 'accepted'));
    await canvas.getByRole('button', { name: 'Quitter' }).click();
    await waitFor(() => expect(canvasElement.querySelector('[data-file-drop-feedback]')).toBeNull());
  },
};
export const FileBrowserScenarios: Story = { render: () => <DragDropScenarios browser /> };


const overlayColumns: TableColumn<FileItem>[] = [
  { id: 'name', header: 'Fichier', cell: row => row.file_name, sortable: true, sortAccessor: 'file_name' },
  { id: 'status', header: 'État', cell: () => 'En attente d’analyse' },
];
function OverlayDemo({ browser, ...props }: FileDropZoneProps & { browser: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState('/EXPORT GS');
  const [files, setFiles] = useState<FileItem[]>(() => Array.from({ length: 4 }, (_, i) => ({
    id: `initial-${i}`, file_name: browser ? `visuel_${i + 1}.png` : `Catalogue_${i + 1}.xlsx`,
    parent_path: '/EXPORT GS', file_size: 2048, mime_type: browser ? 'image/png' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    is_directory: false, created_at: '2026-10-13T08:00:00Z', updated_at: '2026-10-13T08:00:00Z',
  })));
  const [scenario, setScenario] = useState('accepted');
  const [result, setResult] = useState('');
  const [pickerError, setPickerError] = useState('');
  const [picking, setPicking] = useState(false);
  const [receiving, setReceiving] = useState(false);
  const options = props.options;
  async function receive(batch: File[]) {
    setResult('');
    setPickerError('');
    setReceiving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (scenario === 'failure') throw new Error('Simulated import failure');
      await props.onFilesDrop(batch);
      setFiles(current => [...current, ...batch.map((file, i) => ({
        id: `drop-${Date.now()}-${i}`, file_name: file.name, parent_path: path,
        file_size: file.size, mime_type: file.type, is_directory: false,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }))]);
      setResult(`${batch.length} fichier(s) reçu(s)${browser ? ' dans le dossier courant' : ' · en attente d’analyse'}.`);
    } finally { setReceiving(false); }
  }
  function simulate(event: 'dragenter' | 'dragover' | 'dragleave' | 'drop') {
    // Dispatch on a real child cell to exercise event capture through the host.
    const target = ref.current?.querySelector('tbody td, [data-mode="overlay"]');
    if (!target) return;
    const data = new DataTransfer();
    const name = browser ? 'Nouveau_visuel.png' : 'Nouveau_catalogue.xlsx';
    const type = browser ? 'image/png' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    data.items.add(new File(['story fixture'], scenario === 'rejected' ? 'document.pdf' : name,
      { type: scenario === 'rejected' ? 'application/pdf' : scenario === 'unknown' ? '' : type }));
    if (scenario === 'mixed') data.items.add(new File(['pdf'], 'document.pdf', { type: 'application/pdf' }));
    target.dispatchEvent(new DragEvent(event, { bubbles: true, cancelable: true, dataTransfer: data }));
  }
  return <BgProvider value="white"><div data-bg="white" className="space-y-4 max-w-[1100px]">
    <h2 className="text-base font-medium">{browser ? 'Mes fichiers' : 'Catalogues à analyser'}</h2>
    <p className="text-sm">Le contenu reste utilisable au repos. Glissez des fichiers depuis votre ordinateur ou utilisez la simulation ci-dessous. {browser ? 'JPG, PNG, TIFF ou WebP' : 'Excel (.xlsx, .xls)'} · 10 fichiers maximum.</p>
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm">Scénario <select aria-label="Scénario" value={scenario} onChange={e => setScenario(e.target.value)}>
        <option value="accepted">Compatible</option><option value="rejected">PDF refusé</option>
        <option value="unknown">Type inconnu</option><option value="mixed">Lot mixte</option><option value="failure">Erreur de traitement</option>
      </select></label>
      <Button onClick={() => { simulate('dragenter'); simulate('dragover'); }}>Survoler</Button>
      <Button onClick={() => simulate('dragleave')}>Quitter</Button>
      <Button onClick={() => simulate('drop')}>Déposer</Button>
      <Button disabled={props.disabled || picking || receiving} onClick={() => { if (input.current) { input.current.value = ''; input.current.click(); } }}>+ Ajouter</Button>
    </div>
    <input ref={input} type="file" hidden accept={options?.accept} multiple={options?.multiple !== false && options?.maxFiles !== 1} aria-label="Ajouter des fichiers" onChange={async event => {
      const batch = Array.from(event.target.files ?? []);
      if (!batch.length) return;
      const checked = validateDroppedFiles(batch, options);
      if (!checked.isValid) { setPickerError('Lot refusé : vérifiez le format, la taille et le nombre de fichiers.'); return; }
      setPicking(true);
      try { await receive(batch); } catch { setPickerError('Le chargement a échoué. Réessayez.'); } finally { setPicking(false); }
    }} />
    <div ref={ref}>
      <FileDropZone {...props} key={path} mode="overlay" disabled={props.disabled || picking} destination={browser ? path : 'Catalogues à analyser'} onFilesDrop={receive}>
        {browser ? <FileBrowser files={files} currentPath={path} onNavigate={setPath} language="fr" showUploadButton={false} />
          : <DataTable data={files} columns={overlayColumns} getRowId={row => row.id} selectable pageSize={0} />}
      </FileDropZone>
    </div>
    {pickerError && <p role="alert" className="text-sm text-red-strong">{pickerError}</p>}
    <p role="status" className="text-sm">{result}</p>
  </div></BgProvider>;
}
// waitFor : le retour visuel suit des événements DOM natifs, rendus par React un tick plus tard.
const overlayPlay: Story['play'] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitFor(() => expect(canvasElement.querySelector('[data-file-drop-feedback]')).toBeNull());
  await canvas.getByRole('button', { name: 'Survoler' }).click();
  await waitFor(() => expect(canvasElement.querySelector('[data-file-drop-feedback]')).toHaveAttribute('data-state', 'accepted'));
  await canvas.getByRole('button', { name: 'Quitter' }).click();
  await waitFor(() => expect(canvasElement.querySelector('[data-file-drop-feedback]')).toBeNull());
};
// Show public library composition in Docs instead of the internal simulator.
const overlayFileBrowserSource = `import { useState } from 'react';
import {
  FileDropZone,
  FileBrowser,
  type FileItem,
} from '@gs/gs-components-library';

export function ImagesDuProjet({ files, importIntoFolder }: {
  files: FileItem[];
  importIntoFolder: (files: File[], path: string) => Promise<void>;
}) {
  const [currentPath, setCurrentPath] = useState('/EXPORT GS');

  return (
    <FileDropZone
      key={currentPath}
      mode="overlay"
      language="fr"
      destination={currentPath}
      options={{ accept: '.jpg,.jpeg,.png,.tif,.tiff,.webp', maxFiles: 10 }}
      onFilesDrop={files => importIntoFolder(files, currentPath)}
    >
      <FileBrowser
        files={files}
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        language="fr"
        showUploadButton={false}
      />
    </FileDropZone>
  );
}`;
const overlayDataTableSource = `import {
  FileDropZone,
  DataTable,
  type TableColumn,
} from '@gs/gs-components-library';

type Catalogue = {
  id: string;
  name: string;
  status: string;
};

const columns: TableColumn<Catalogue>[] = [
  { id: 'name', header: 'Fichier', cell: row => row.name,
    sortable: true, sortAccessor: 'name' },
  { id: 'status', header: 'État', cell: row => row.status },
];

export function CataloguesAAnalyser({ catalogues, queueForAnalysis }: {
  catalogues: Catalogue[];
  queueForAnalysis: (files: File[]) => Promise<void>;
}) {
  return (
    <FileDropZone
      mode="overlay"
      language="fr"
      destination="Catalogues à analyser"
      options={{ accept: '.xlsx,.xls', multiple: true, maxFiles: 10 }}
      onFilesDrop={queueForAnalysis}
    >
      <DataTable
        data={catalogues}
        columns={columns}
        getRowId={row => row.id}
        selectable
        pageSize={0}
      />
    </FileDropZone>
  );
}`;
export const OverlayFileBrowser: Story = {
  args: { mode: 'overlay', options: IMAGES }, render: args => <OverlayDemo {...args} browser />, play: overlayPlay,
  parameters: { docs: { source: { type: 'code', language: 'tsx', code: overlayFileBrowserSource }, description: { story: 'Overlay sur le FileBrowser complet, breadcrumb et barre d’outils inclus. Le dépôt ajoute les fichiers au dossier courant après une attente simulée. Les déplacements internes restent distincts. Le code ci-dessous utilise les composants publics : files et importIntoFolder sont fournis par votre application, qui actualise la liste après import. Conservez une action de sélection de fichiers accessible dans l’interface hôte.' } } },
};
export const OverlayDataTable: Story = {
  args: { mode: 'overlay', options: { ...EXCEL, multiple: true, maxFiles: 10 } }, render: args => <OverlayDemo {...args} browser={false} />, play: overlayPlay,
  parameters: { docs: { source: { type: 'code', language: 'tsx', code: overlayDataTableSource }, description: { story: 'Overlay sur une DataTable sélectionnable et triable. Un fichier Excel éligible rejoint la liste « En attente d’analyse » ; aucun contenu Excel n’est analysé dans cette démonstration. Le code ci-dessous utilise les composants publics : catalogues et queueForAnalysis sont fournis par votre application, qui actualise la liste des fichiers reçus. Conservez une action de sélection de fichiers accessible dans l’interface hôte.' } } },
};
