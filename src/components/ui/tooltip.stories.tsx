import type { Meta, StoryObj } from "@storybook/react-vite";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const meta: Meta<typeof TooltipContent> = {
  title: "UI/Tooltip",
  component: TooltipContent,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
GS Tooltip, built on the Radix / shadcn Tooltip with the same API (\`Tooltip\`, \`TooltipTrigger\`,
\`TooltipContent\`, \`TooltipProvider\`). Its look follows the background it is displayed on
(the \`data-bg\` context of the parent \`Layout\`):

| Background | Tooltip |
|---|---|
| white, grey, or no \`Layout\` | black background, white text, \`black-secondary\` border, \`rounded-[2px]\` |
| black | inverted: white background, black text, grey border, \`rounded-[2px]\` |

The tooltip passes its own surface to its content (\`data-bg\` and context), so icons or buttons
inside it render as on a black or white surface.

\`\`\`tsx
import { Layout, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@gs/gs-components-library";

<TooltipProvider>
  <Layout bg="black">
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>Hover me</Button>
      </TooltipTrigger>
      {/* white tooltip: the trigger sits on a black background */}
      <TooltipContent>Inverted on black</TooltipContent>
    </Tooltip>
  </Layout>
</TooltipProvider>
\`\`\`

When the trigger is not inside a \`Layout\`, or to force a rendering, pass \`bg\` to
\`TooltipContent\`: \`<TooltipContent bg="black">\` renders the inverted tooltip.
`,
      },
    },
  },
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof meta>;

const BACKGROUNDS = ["white", "grey", "black"] as const;

/** The tooltip on each background, kept open for comparison. */
export const OnEachBackground: Story = {
  render: () => (
    <TooltipProvider>
      <div className="grid grid-cols-3 min-h-[260px]">
        {BACKGROUNDS.map((bg) => (
          <Layout key={bg} bg={bg} className="flex flex-col items-center justify-center gap-4 p-8">
            <span className={bg === "black" ? "text-white text-sm" : "text-sm"}>bg="{bg}"</span>
            <Tooltip open>
              <TooltipTrigger asChild>
                <Button size="small">Trigger</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Tooltip on a {bg} background</TooltipContent>
            </Tooltip>
          </Layout>
        ))}
      </div>
    </TooltipProvider>
  ),
};

/** Hover the buttons: same behaviour as the Radix tooltip, look adapted to the background. */
export const OnHover: Story = {
  render: () => (
    <TooltipProvider delayDuration={200}>
      <div className="grid grid-cols-3 min-h-[200px]">
        {BACKGROUNDS.map((bg) => (
          <Layout key={bg} bg={bg} className="flex items-center justify-center gap-4 p-8">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="small" aria-label="Reports">
                  <Icon name="Reports" size={12} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reports</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="small">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent side="right">A longer tooltip text on {bg}</TooltipContent>
            </Tooltip>
          </Layout>
        ))}
      </div>
    </TooltipProvider>
  ),
};

/** `bg` on TooltipContent overrides the context: here, an inverted tooltip outside any black Layout. */
export const ForcedBackground: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-16 min-h-[200px] bg-grey">
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button size="small">No Layout</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Default (black)</TooltipContent>
        </Tooltip>
        <Tooltip open>
          <TooltipTrigger asChild>
            <Button size="small">bg="black"</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" bg="black">
            Forced inverted
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};
