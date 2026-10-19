import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ClippingEditor, type ClippingEditorProps, type ClippingMark, type ClippingMask, type ClippingSegmenter } from './clipping-editor';
import { createColorClippingSegmenter } from '@/lib/clipping-color-segmenter';
import { cutToMark } from '@/lib/clipping-scalpel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { useTranslationSafe } from '@/contexts/TranslationContext';

/** Produit sur fond clair, généré en SVG : la story ne dépend d'aucun fichier ni réseau. */
const PRODUCT = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="900" viewBox="0 0 800 900">
<rect width="800" height="900" fill="#f4f4f2"/>
<ellipse cx="400" cy="800" rx="260" ry="26" fill="#d8d8d4"/>
<rect x="150" y="180" width="330" height="610" fill="#e0793a"/><rect x="150" y="180" width="330" height="40" fill="#c9622a"/>
<rect x="480" y="330" width="170" height="460" rx="30" fill="#fbfbf6" stroke="#cfcfc6" stroke-width="4"/>
<rect x="520" y="250" width="90" height="110" rx="10" fill="#3b2f6b"/>
</svg>`)}`;

async function loadPixels(src: string) {
  const img = new Image();
  img.src = src;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/** Simulateur : détourage par couleur (voir createColorClippingSegmenter). Un vrai backend se branche sur la même signature. */
function useDemoSegmenter(src: string, latencyMs = 250): ClippingSegmenter {
  return useMemo(() => {
    const engine = loadPixels(src).then(createColorClippingSegmenter);
    // Image illisible (story LoadFailure) : l'échec ressort à chaque appel, pas en rejet non géré.
    engine.catch(() => {});
    return async (request) => {
      await new Promise((resolve) => setTimeout(resolve, latencyMs));
      if (request.signal.aborted) throw new DOMException('Aborted', 'AbortError');
      return (await engine)(request);
    };
  }, [src, latencyMs]);
}

const meta = {
  title: 'Components/ClippingEditor', component: ClippingEditor,
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Éditeur de détourage : on trace des traits « Garder » / « Retirer » (et « Cheveux ») et des sélections au « Crayon » sur l’image, un moteur fourni par l’application calcule le masque et l’aperçu sur fond transparent se met à jour. Le composant ne détoure pas lui-même : `onSegment` reçoit les traits et renvoie un masque alpha. Raccourcis : Espace Garder/Retirer, V Cheveux, X Gomme, S Crayon, A Crayon +, D Crayon −, C ou Maj Déplacer, Z/Y Annuler/Rétablir, Accueil ajuster, 1/2 vues, molette zoom.' } } },
  argTypes: {
    titleAccessory: { control: false },
    primaryAction: { control: false },
    defaultSettingsOpen: { control: "boolean" },
    defaultTool: { control: 'select', options: ['keep', 'remove', 'hair', 'eraser', 'pencil', 'pencilAdd', 'pencilSub', 'pan'] },
    defaultView: { control: 'radio', options: ['split', 'single'] },
    language: { control: 'select', options: ['fr', 'en', 'es', 'it', 'de'] },
    defaultBrushSize: { control: { type: 'range', min: 2, max: 200, step: 1 } },
  },
  args: { src: PRODUCT, fileName: 'flacon-C182.jpg', language: 'fr', defaultView: 'split', defaultBrushSize: 28, onMarksChange: fn(), onDownload: fn(), onSegment: fn() },
} satisfies Meta<typeof ClippingEditor>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ latencyMs, ...args }: ClippingEditorProps & { latencyMs?: number }) {
  const onSegment = useDemoSegmenter(args.src, latencyMs);
  return <div className="h-[760px]"><ClippingEditor {...args} onSegment={onSegment} /></div>;
}

export const Default: Story = { render: (args) => <Demo {...args} /> };

function HeaderControlsDemo(args: ClippingEditorProps) {
  const { t } = useTranslationSafe(args.translations, args.language);
  return <Demo {...args}
    titleAccessory={<Select defaultValue="opaque">
      <SelectTrigger aria-label={t('clipping.example.material')}><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="opaque">{t('clipping.example.opaque')}</SelectItem>
        <SelectItem value="translucent">{t('clipping.example.translucent')}</SelectItem>
      </SelectContent>
    </Select>}
    primaryAction={{
      label: t('clipping.example.validateNext'),
      loadingLabel: t('clipping.example.validating'),
      onClick: async () => { await new Promise<void>(resolve => setTimeout(resolve, 1200)); },
      'data-testid': 'clipping-validate-next',
    }}
  />;
}
export const WithHeaderControls: Story = { args: { onClose: fn() }, render: (args) => <HeaderControlsDemo {...args} /> };
/** With `autoSegment`, the engine is asked for its automatic cut-out as soon as the image opens (here the demo engine treats the border as background). */
export const AutoSegment: Story = { args: { autoSegment: true }, render: (args) => <Demo {...args} /> };
export const SettingsCollapsed: Story = { args: { defaultSettingsOpen: false }, render: (args) => <Demo {...args} /> };
/** The panel state is handed back through callbacks, so an application can restore it the next time the editor opens. */
export const RememberedPanelState: Story = { args: { defaultSettingsOpen: true, defaultFileInfoOpen: true, onSettingsOpenChange: fn(), onFileInfoOpenChange: fn() }, render: (args) => <Demo {...args} /> };
/**
 * `initialMask` : the mask of the starting marks is known (here computed once by the demo engine, in an application it would be the
 * validated result stored by the server). The editor shows it at once and the engine is not asked again until a mark changes:
 * the counter below counts the engine calls made by the editor itself.
 */
function WithKnownMask(args: ClippingEditorProps) {
  const engine = useDemoSegmenter(args.src, 0);
  const marks = args.defaultMarks ?? [];
  const [mask, setMask] = useState<ClippingMask | null>(null);
  const [calls, setCalls] = useState(0);
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.onload = () => { void engine({ marks, width: img.naturalWidth, height: img.naturalHeight, signal: new AbortController().signal }).then((m) => { if (alive) setMask(m); }); };
    img.src = args.src;
    return () => { alive = false; };
  }, [engine, args.src]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!mask) return <div className="h-[760px]" />;
  return (
    <div className="h-[760px]">
      <div className="p-2 text-sm" data-testid="engine-calls">Appels au moteur depuis l'ouverture : {calls}</div>
      <div className="h-[720px]"><ClippingEditor {...args} initialMask={mask} onSegment={(request) => { setCalls((n) => n + 1); return engine(request); }} /></div>
    </div>
  );
}
export const WithInitialMask: Story = {
  args: { autoSegment: true, defaultMarks: [{ id: 'keep-1', tool: 'keep', size: 40, points: [{ x: 300, y: 500 }, { x: 300, y: 600 }] }] },
  render: (args) => <WithKnownMask {...args} />,
};
export const HairSettings: Story = { args: { defaultTool: "hair" }, render: (args) => <Demo {...args} /> };
export const SinglePane: Story = { args: { defaultView: 'single' }, render: (args) => <Demo {...args} /> };

const PRESET: ClippingMark[] = [
  { id: 'keep-1', tool: 'keep', size: 40, points: [{ x: 300, y: 500 }, { x: 300, y: 600 }, { x: 560, y: 600 }] },
  { id: 'remove-1', tool: 'remove', size: 40, points: [{ x: 60, y: 80 }, { x: 740, y: 80 }, { x: 740, y: 700 }] },
];
export const WithMarks: Story = { args: { defaultMarks: PRESET }, render: (args) => <Demo {...args} /> };
/** Un tracé ouvert (nœuds ronds et un angle) et un tracé fermé, à éditer : déplacer, ajouter, relier, supprimer. */
const CUTS: ClippingMark[] = [
  cutToMark('cut-open', { closed: false, nodes: [{ x: 120, y: 120 }, { x: 300, y: 90 }, { x: 500, y: 140, corner: true }, { x: 640, y: 300 }] }),
  cutToMark('cut-loop', { closed: true, nodes: [{ x: 200, y: 600 }, { x: 330, y: 540 }, { x: 460, y: 620 }, { x: 330, y: 720 }] }),
];
export const Pencil: Story = { args: { defaultTool: 'pencil', defaultMarks: CUTS }, render: (args) => <Demo {...args} /> };
/** Une sélection (tracé fermé) avec un trait Retirer à l'intérieur : seul l'intérieur est concerné. */
export const WithSelection: Story = { args: { defaultMarks: [CUTS[1], { id: 'rm', tool: 'remove', size: 30, points: [{ x: 330, y: 600 }, { x: 340, y: 640 }] }] }, render: (args) => <Demo {...args} /> };
export const English: Story = { args: { language: 'en' }, render: (args) => <Demo {...args} /> };
export const Closable: Story = { args: { onClose: fn() }, render: (args) => <Demo {...args} /> };

export const SlowEngine: Story = { render: (args) => <Demo {...args} latencyMs={2500} /> };
export const EngineFailure: Story = {
  args: { defaultMarks: PRESET },
  render: (args) => <div className="h-[760px]"><ClippingEditor {...args} onSegment={async () => { throw new Error('Simulated backend failure'); }} /></div>,
};
// Image invalide sans requête réseau (une URL absente afficherait un 404 dans la console).
export const LoadFailure: Story = { args: { src: 'data:image/png;base64,' }, render: (args) => <Demo {...args} /> };

function Controlled(props: ClippingEditorProps) {
  const onSegment = useDemoSegmenter(props.src);
  const [marks, setMarks] = useState<ClippingMark[]>([]);
  return (
    <div className="flex h-[760px] flex-col gap-2">
      <div className="min-h-0 flex-1"><ClippingEditor {...props} onSegment={onSegment} onMarksChange={setMarks} /></div>
      <div role="status" className="px-3 text-sm">{marks.length} trait(s) · {marks.reduce((n, m) => n + m.points.length, 0)} points transmis au moteur</div>
    </div>
  );
}
export const MarksCallback: Story = { render: (args) => <Controlled {...args} /> };
