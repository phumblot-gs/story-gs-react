import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Spinner, type SpinnerSize } from "./spinner";
import { withReducedMotion } from "@/stories/reducedMotion";

const SIZES: { size: SpinnerSize; stroke: string; usage: string }[] = [
  { size: 12, stroke: "1.5 px", usage: "Small buttons, compact spaces" },
  { size: 16, stroke: "2 px", usage: "Toasts, buttons, end of lists" },
  { size: 24, stroke: "2 px", usage: "Loading an area" },
  { size: 32, stroke: "3 px", usage: "Thumbnails" },
];

const BACKGROUNDS = [
  { name: "White #FFFFFF", className: "bg-white text-black" },
  { name: "Grey #EFEFEF", className: "bg-grey text-black" },
  { name: "Black #000000", className: "bg-[#000000] text-white" },
];

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Loading indicator: a ring with a **270° arc** over a discreet track (18 % opacity). One shape for every task
(loading, sorting, analysis, import…): the context is carried by the text.

\`\`\`tsx
<Spinner />                                  // standalone: role="status", "Loading" (translated)
<Spinner size={24} label="Analysing visuals" />
<span><Spinner decorative /> Import in progress…</span>  // the text already describes the loading
\`\`\`

- **Sizes** (outer size / stroke): 12 / 1.5 px, 16 / 2 px (default), 24 / 2 px, 32 / 3 px. Fixed dimensions,
  never shrinks in a flex container.
- **Colour**: inherited from the text (\`currentColor\`). GS black \`#292828\` on white and grey, white on black.
- **Animation**: continuous linear clockwise rotation, one turn in 900 ms at every size.
- **Reduced motion** (\`prefers-reduced-motion: reduce\`, or a \`data-gs-reduced-motion\` attribute on an ancestor
  for tests): the rotation stops, the ring stays visible; the text must say that loading is in progress.
- **Accessibility**: standalone, a status region with an accessible name (\`label\`, default "Loading" translated);
  next to a text describing the loading (button, toast, list footer), pass \`decorative\` (\`aria-hidden\`) to avoid
  a double announcement. Rotations are never announced, focus is never moved.
- Used by \`Button loading\`, the loading toast, \`Thumbnail\` and the \`FileBrowser\` "show more" button.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "inline-radio", options: [12, 16, 24, 32], description: "Outer size in px. Default 16." },
    label: { control: "text", description: 'Accessible name when standalone. Default "Loading" (translated).' },
    decorative: { control: "boolean", description: "A nearby text already describes the loading: aria-hidden." },
  },
  args: { size: 16, decorative: false },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The four sizes at actual size, with their stroke width and usage. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-8 text-black">
      {SIZES.map(({ size, stroke, usage }) => (
        <div key={size} className="flex w-[110px] flex-col items-center gap-2 text-center text-xs">
          <Spinner size={size} />
          <strong>{size} px</strong>
          <span>Stroke {stroke}</span>
          <span className="text-grey-stronger">{usage}</span>
        </div>
      ))}
    </div>
  ),
};

/** The four sizes on white, grey and black. */
export const Backgrounds: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="grid grid-cols-3">
      {BACKGROUNDS.map(({ name, className }) => (
        <div key={name} className={`flex flex-col items-center gap-6 p-8 ${className}`}>
          <span className="text-xs">{name}</span>
          <div className="flex items-center gap-6">
            {SIZES.map(({ size }) => (
              <Spinner key={size} size={size} decorative />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

/** The colour comes from the parent (`currentColor`), even after it changes. */
export const InheritsTextColor: Story = {
  render: () => {
    const COLORS = ["#292828", "#2E7D32", "#C62828", "#1565C0"];
    const [index, setIndex] = React.useState(0);
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-sm" style={{ color: COLORS[index] }}>
          <Spinner size={24} decorative />
          Parent colour: {COLORS[index]}
        </div>
        <button className="rounded-sm border border-grey-strong px-3 py-1 text-xs" onClick={() => setIndex((index + 1) % COLORS.length)}>
          Change the parent colour
        </button>
      </div>
    );
  },
};

/** Alignment with a short label and with a text on several lines. */
export const InlineWithText: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-6 text-sm text-black">
      <div className="flex items-center gap-2">
        <Spinner size={16} decorative />
        Loading…
      </div>
      <div className="flex items-start gap-2">
        <Spinner size={16} decorative className="mt-[2px]" />
        <span>Analysing visuals in progress (3 references). This can take a few minutes for large productions.</span>
      </div>
      <div className="flex items-center gap-1 text-xs">
        <Spinner size={12} decorative />
        Sorting
      </div>
    </div>
  ),
};

/** Reduced motion: the rotation stops, the indicator stays visible and the text says "in progress". */
export const ReducedMotion: Story = {
  decorators: [withReducedMotion],
  render: () => (
    <div className="flex items-center gap-2 text-sm text-black">
      <Spinner size={24} decorative />
      Automatic sorting of visuals in progress
    </div>
  ),
};

/** Standalone: a status region with an accessible name. */
export const StandaloneAccessible: Story = {
  render: () => (
    <div className="flex h-[120px] w-[240px] items-center justify-center rounded-sm bg-grey text-black">
      <Spinner size={24} label="Loading the production" />
    </div>
  ),
};

/** Decorative next to a status text: only the text is announced, no double announcement. */
export const DecorativeWithLabel: Story = {
  render: () => (
    <div role="status" className="flex items-center gap-2 text-sm text-black">
      <Spinner size={16} decorative />
      Analysing visuals in progress (3 references)
    </div>
  ),
};
