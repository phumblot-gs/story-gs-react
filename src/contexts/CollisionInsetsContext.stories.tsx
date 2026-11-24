import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CollisionInsetsProvider } from "./CollisionInsetsContext";
import { Thumbnail } from "@/components/Thumbnail/Thumbnail";
import { ButtonMenu } from "@/components/ui/button-menu";
import { ButtonThumbnailStars } from "@/components/ui/button-thumbnail-stars";
import { HStack, Layout } from "@/components/layout";
import { MediaStatus } from "@/utils/mediaStatus";

type DemoArgs = { reservedTop: number; onStatusButtonClick: (key: string, reason?: string) => void };

const meta: Meta<DemoArgs> = {
  title: "Context/CollisionInsetsProvider",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Reserves viewport strips covered by the host page. Every popover, dropdown, select, tooltip and menu of
the library adds the inset to its own \`collisionPadding\` (8 px for most menus), and the menus that cap
their height also stay within the space left, so a menu opened or flipped upwards never slides under
the host's header.

Typical case: the app runs in an iframe that covers the whole window, under a ~60 px header the host
draws over the iframe's top.

\`\`\`tsx
<GSComponentsRoot collisionInsets={{ top: 60 }}>
  <App />
</GSComponentsRoot>

// or, without GSComponentsRoot
<CollisionInsetsProvider insets={{ top: 60 }}>
  <App />
</CollisionInsetsProvider>
\`\`\`

Without a provider (or with 0), nothing changes. A custom \`menuMaxHeight\` is kept as given.
`,
      },
    },
  },
  argTypes: {
    reservedTop: { control: { type: "number", min: 0, step: 4 }, description: "Reserved top inset (px)" },
  },
  args: { reservedTop: 60, onStatusButtonClick: fn() },
};
export default meta;
type Story = StoryObj<DemoArgs>;

const HOST_HEADER_HEIGHT = 60;

const bench = {
  config: {
    validation: {
      rejection_options: {
        active: true,
        main: Array.from({ length: 40 }, (_, i) => `Motif principal ${i + 1}`),
        secondary: Array.from({ length: 20 }, (_, i) => `Motif secondaire ${i + 1}`),
      },
    },
  },
};

const actions = Array.from({ length: 30 }, (_, i) => ({ label: `Action ${i + 1}` }));

/**
 * The black strip stands for the host's header, drawn above the menus as gs_node's header is above
 * gs_w's iframe. With `reservedTop` at 60 the menus stop below it; set it to 0 to see them slide under.
 */
export const HostHeader: Story = {
  render: ({ reservedTop, onStatusButtonClick }) => (
    <CollisionInsetsProvider insets={{ top: reservedTop }}>
      <Layout bg="white" className="relative h-screen overflow-hidden">
        <div
          data-testid="host-header"
          className="fixed inset-x-0 top-0 z-[100] flex items-center bg-black px-4 text-sm text-white"
          style={{ height: HOST_HEADER_HEIGHT }}
        >
          Host header ({HOST_HEADER_HEIGHT} px), drawn over the app
        </div>
        <HStack gap={4} align="end" className="absolute inset-x-0 bottom-0 p-4">
          <Thumbnail
            picture_id={1}
            src="https://picsum.photos/340/340"
            filename="photo_bas_de_page.jpg"
            status={MediaStatus.SUBMITTED_FOR_APPROVAL}
            size="large"
            bench={bench}
            statusButtons={[{ key: "refuse", icon: "X", status: MediaStatus.REFUSED_1, label: "Refuse", rejectionReasons: true }]}
            onStatusButtonClick={onStatusButtonClick}
          />
          <ButtonMenu menuSide="top" actions={actions}>
            Menu (side top)
          </ButtonMenu>
          <ButtonThumbnailStars value={3} />
        </HStack>
      </Layout>
    </CollisionInsetsProvider>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Refuse" }));
    const list = await page.findByTestId("rejection-reasons-list");
    const menu = list.closest("[data-radix-popper-content-wrapper] > *") as HTMLElement;
    await expect(menu.getBoundingClientRect().top).toBeGreaterThanOrEqual(args.reservedTop);
  },
};
