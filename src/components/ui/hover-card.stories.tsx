import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Layout } from "@/components/layout";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

const meta: Meta<typeof HoverCardContent> = {
  title: "UI/HoverCard",
  component: HoverCardContent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `Card shown while its trigger is hovered or focused, after the Root's \`openDelay\`
(700ms by default in Radix; pass \`openDelay\` on \`HoverCard\` to shorten it).

Charter defaults, no className needed: \`surface="light"\` (white, 1px grey-strong border, black text) or
\`surface="dark"\` (black), 2px radius, 10px padding, \`shadow-md\`, 5px offset from the trigger. The card
is portalled to \`document.body\`: a scrolling or \`overflow: hidden\` parent does not clip it, and the
\`Layout bg\` around the trigger does not change it. Its content sees the card surface as its \`bg\`
context.

\`\`\`tsx
<HoverCard openDelay={150}>
  <HoverCardTrigger asChild>
    <button type="button" aria-label="Featured picture"><VedetteIndicator /></button>
  </HoverCardTrigger>
  <HoverCardContent side="bottom" align="start">
    <img src={url} alt="Featured picture" className="block w-40" />
  </HoverCardContent>
</HoverCard>
\`\`\``,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HoverCardContent>;

const Demo = ({ surface, bg }: { surface?: "light" | "dark"; bg: "white" | "grey" | "black" }) => (
  <Layout bg={bg} padding={6}>
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <button type="button" className="underline text-sm">
          Hover me ({surface ?? "light"} card on a {bg} background)
        </button>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="start" surface={surface}>
        <p className="m-0 text-sm">Preview content</p>
      </HoverCardContent>
    </HoverCard>
  </Layout>
);

/** Default light surface on a grey background: hover or focus the trigger. */
export const Default: Story = {
  render: () => <Demo bg="grey" />,
  play: async ({ canvasElement }) => {
    await userEvent.hover(within(canvasElement).getByRole("button"));
    // Portalled to document.body, outside the story canvas.
    const card = (await within(document.body).findByText("Preview content")).closest("[data-surface]");
    await expect(card).toHaveAttribute("data-surface", "light");
    await expect(card).toHaveClass("bg-white", "border-grey-strong", "rounded-sm", "p-2");
  },
};

/** Dark surface on a white background. */
export const DarkSurface: Story = {
  render: () => <Demo bg="white" surface="dark" />,
};
