import type { Meta, StoryObj } from "@storybook/react-vite";
import { TruncatedText } from "./truncated-text";
import { Layout, VStack } from "@/components/layout";
import { DataTable, type TableColumn } from "./data-table";
import { Icon } from "@/components/ui/icons";

const meta = {
  title: "UI/TruncatedText",
  component: TruncatedText,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `One line of text cut with "…". When the text is actually cut, hovering or focusing it shows the full text in a tooltip; when it fits, no tooltip is attached.

The truncation is measured on mount and again whenever the element or its parent is resized (\`ResizeObserver\` and window resize), so the tooltip follows resizable columns and responsive layouts. The parent decides the width: in a flex row, give the text \`min-w-0\` (or \`flex-1 min-w-0\`) so it can shrink.

## API

| Prop | Purpose / default |
| --- | --- |
| \`text\` | The text to display. |
| \`as\` | Element to render. Default: \`span\`. |
| \`className\` | Classes of the text element (always \`block truncate w-full\`). |
| \`tooltipSide\` | \`top\` (default), \`right\`, \`bottom\` or \`left\`. |
| \`tooltipMaxWidth\` | Tailwind max-width class of the tooltip. Default: \`max-w-[200px]\`. |
| \`tooltipClassName\` | Extra classes of the tooltip. |
| other HTML attributes | \`data-*\`, \`aria-*\`, \`style\`, handlers… go to the text element. |

The text in the tooltip can be selected and copied: interacting with it neither closes it nor starts a drag of the trigger.

\`\`\`tsx
import { TruncatedText } from "@gs/gs-components-library";

<div style={{ width: 160 }}>
  <TruncatedText text="B1 Galeries Lafayette - MKP: standard-2026-10-19 H23-PART-1 7610" />
</div>
\`\`\``,
      },
    },
  },
  tags: ["autodocs"],
  args: {
    text: "B1 Galeries Lafayette - MKP: standard-2026-10-19 H23-PART-1 7610",
  },
  argTypes: {
    text: { control: "text", description: "The text to display" },
    className: { control: "text", description: "Extra Tailwind classes of the text" },
    as: { control: "select", options: ["span", "p", "div", "h1", "h2", "h3", "h4", "label"], description: "Element to render" },
    tooltipSide: { control: "select", options: ["top", "right", "bottom", "left"], description: "Side of the tooltip" },
    tooltipMaxWidth: { control: "text", description: "Tailwind max-width class of the tooltip" },
    tooltipClassName: { control: "text", description: "Extra classes of the tooltip" },
  },
} satisfies Meta<typeof TruncatedText>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ width, label, children }: { width: number; label?: string; children: React.ReactNode }) => (
  <div style={{ width }}>
    {label && <p className="text-xs font-medium mb-1">{label}</p>}
    <div className="border border-grey-light p-2 rounded">{children}</div>
  </div>
);

export const Default: Story = {
  render: (args) => (
    <Layout bg="white" padding={6}>
      <Box width={200}><TruncatedText {...args} /></Box>
    </Layout>
  ),
};

export const NotTruncated: Story = {
  parameters: { docs: { description: { story: "The text fits: no tooltip is attached." } } },
  render: () => (
    <Layout bg="white" padding={6}>
      <Box width={300}><TruncatedText text="Short text" /></Box>
    </Layout>
  ),
};

export const Truncated: Story = {
  parameters: { docs: { description: { story: "The text is cut: hover it to read it in full." } } },
  render: () => (
    <Layout bg="white" padding={6}>
      <Box width={150}><TruncatedText text="A very long text that cannot fit in 150 pixels" /></Box>
    </Layout>
  ),
};

export const TooltipPositions: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <div className="grid grid-cols-2 gap-6">
        {(["top", "bottom", "left", "right"] as const).map((side) => (
          <Box key={side} width={140} label={side === "top" ? "top (default)" : side}>
            <TruncatedText text={`Tooltip on the ${side}, hover to see it`} tooltipSide={side} />
          </Box>
        ))}
      </div>
    </Layout>
  ),
};

export const DifferentElements: Story = {
  parameters: { docs: { description: { story: "`as` renders another element, for a title or a label." } } },
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <Box width={200} label='as="span" (default)'><TruncatedText text="Text in a span that will be cut" /></Box>
        <Box width={200} label='as="p"'><TruncatedText text="Text in a paragraph that will be cut" as="p" /></Box>
        <Box width={200} label='as="h4"'><TruncatedText text="A heading that is far too long" as="h4" className="font-bold" /></Box>
        <Box width={200} label='as="label"'><TruncatedText text="A form label that will be cut" as="label" className="text-sm" /></Box>
      </VStack>
    </Layout>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <Layout bg="white" padding={6}>
      <VStack gap={4}>
        <Box width={180} label="Coloured text"><TruncatedText text="Blue text that will be cut automatically" className="text-blue-primary font-medium" /></Box>
        <Box width={180} label="Wider tooltip"><TruncatedText text="This text has a wider tooltip to show more content on one line" tooltipMaxWidth="max-w-[300px]" /></Box>
      </VStack>
    </Layout>
  ),
};

export const InFileList: Story = {
  render: () => {
    const files = ["document.pdf", "summer_holiday_photo_2024_beach.jpg", "company_annual_report_2024.docx", "notes.txt", "client_project_presentation_final_v2.pptx"];
    return (
      <Layout bg="white" padding={6}>
        <div className="border border-grey-light rounded overflow-hidden" style={{ width: 250 }}>
          {files.map((name, index) => (
            <div key={name} className={`p-2 flex items-center gap-2 ${index !== files.length - 1 ? "border-b border-grey-light" : ""}`}>
              <Icon name="File" size={12} />
              <TruncatedText text={name} className="text-sm min-w-0" />
            </div>
          ))}
        </div>
      </Layout>
    );
  },
};

interface Batch { id: string; name: string; comments: number; images: number }
const BATCHES: Batch[] = [
  { id: "1", name: "B1 Galeries Lafayette - MKP: standard-2026-10-19 H23-PART-1 7610", comments: 2, images: 420 },
  { id: "2", name: "REDO B1 The Kooples Connect: Détourage - batch 14 297", comments: 0, images: 12 },
  { id: "3", name: "B1 Printemps FNR: VAN LAACK 20261020 6153", comments: 1, images: 7 },
];
const batchColumns: TableColumn<Batch>[] = [
  {
    id: "name", header: "Batch", width: 240,
    cell: (b) => (
      <span className="flex items-center gap-2">
        <TruncatedText text={b.name} className="min-w-0 font-medium" />
        <span className="ml-auto flex shrink-0 items-center gap-1 text-grey-strongest"><Icon name="Comment" size={12} />{b.comments}</span>
      </span>
    ),
  },
  { id: "images", header: "Images", align: "right", width: 100, cell: (b) => b.images },
];

export const InTableCell: Story = {
  parameters: {
    layout: "fullscreen",
    docs: { description: { story: "In a resizable DataTable column, with an icon kept visible on the right. Widen or narrow the Batch column: the ellipsis and the tooltip follow the width." } },
  },
  render: () => (
    <Layout bg="grey" padding={6}>
      <DataTable<Batch> data={BATCHES} columns={batchColumns} getRowId={(b) => b.id} pageSize={0} resizableColumns />
    </Layout>
  ),
};

export const ResponsiveBehavior: Story = {
  parameters: { docs: { description: { story: "Resize the window: the tooltip appears as soon as the text no longer fits." } } },
  render: () => (
    <Layout bg="white" padding={6}>
      <div className="w-full border border-grey-light p-4 rounded">
        <TruncatedText
          text="This text follows the width of its container. Narrow the window to see the tooltip appear automatically once the text is cut."
          className="text-sm"
        />
      </div>
    </Layout>
  ),
};
