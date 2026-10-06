import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import type { ReactElement } from "react";

import { ButtonMenuStatus } from "@/components/ui/button-menu-status";
import { ButtonMenuSmall } from "@/components/ui/button-menu-small";
import { ButtonThumbnailStars } from "@/components/ui/button-thumbnail-stars";
import { ButtonThumbnailLabels } from "@/components/ui/button-thumbnail-labels";
import { ButtonThumbnailTags } from "@/components/ui/button-thumbnail-tags";
import { ButtonThumbnailComments } from "@/components/ui/button-thumbnail-comments";
import { MediaStatus } from "@/utils/mediaStatus";

/**
 * `data-open` on menu triggers.
 *
 * House rule: a button that opens a menu keeps its hover appearance for as long as
 * that menu is open. The library implements it with a single mechanism — the trigger
 * carries `data-open="true" | "false"`, and `custom-styles.css` (`button[data-open="true"]`,
 * around lines 996-1035) replays the hover tokens of the button's own variant.
 *
 * `ButtonMenuStatus` and `ButtonMenuSmall` used to be the two exceptions: they did not
 * emit the attribute, so they stayed flat while their menu was open, unlike the four
 * thumbnail menus sitting next to them in an action bar. They now use the exact same
 * line as the others.
 *
 * Note the attribute is *always present*, valued "false" when closed. That is the
 * pre-existing convention (`button[data-open]` is used as a trigger locator elsewhere
 * in the suite); the tests below lock the value, not the presence, so the six
 * components cannot drift apart.
 */

afterEach(() => cleanup());

const trigger = (container: HTMLElement) => {
  const buttons = container.querySelectorAll<HTMLButtonElement>("button");
  expect(buttons).toHaveLength(1);
  return buttons[0];
};

const statusOptions = [
  { status: MediaStatus.SELECTED, label: "Sélectionné" },
  { status: MediaStatus.VALIDATED, label: "Validé" },
];

const actions = [{ label: "Éditer", onClick: () => {} }];

/**
 * Every component of the library whose trigger opens a dropdown menu. The first four
 * are the ones sitting side by side in the gs_w validation action bar; that row is
 * precisely the invariant being locked.
 */
const MENU_TRIGGERS: Array<{ name: string; render: (open: boolean) => ReactElement }> = [
  {
    name: "ButtonMenuStatus",
    render: (open) => (
      <ButtonMenuStatus
        currentStatus={MediaStatus.SELECTED}
        statusOptions={statusOptions}
        open={open}
      />
    ),
  },
  {
    name: "ButtonThumbnailStars",
    render: (open) => <ButtonThumbnailStars value={3} open={open} />,
  },
  {
    name: "ButtonThumbnailLabels",
    render: (open) => <ButtonThumbnailLabels value="red" open={open} />,
  },
  {
    name: "ButtonMenuSmall",
    render: (open) => <ButtonMenuSmall actions={actions} open={open} />,
  },
  {
    name: "ButtonThumbnailTags",
    render: (open) => <ButtonThumbnailTags value={{ retouche: true }} open={open} />,
  },
  {
    name: "ButtonThumbnailComments",
    render: (open) => <ButtonThumbnailComments value={[]} open={open} />,
  },
];

describe("ButtonMenuStatus — data-open", () => {
  it('carries data-open="false" while the menu is closed', () => {
    const { container } = render(
      <ButtonMenuStatus
        currentStatus={MediaStatus.SELECTED}
        statusOptions={statusOptions}
        open={false}
      />
    );

    expect(trigger(container)).toHaveAttribute("data-open", "false");
  });

  it('carries data-open="true" while the menu is open', () => {
    const { container } = render(
      <ButtonMenuStatus
        currentStatus={MediaStatus.SELECTED}
        statusOptions={statusOptions}
        open
      />
    );

    expect(trigger(container)).toHaveAttribute("data-open", "true");
  });

  it("emits the attribute in uncontrolled mode too", () => {
    const closed = render(
      <ButtonMenuStatus currentStatus={MediaStatus.SELECTED} statusOptions={statusOptions} />
    );
    expect(trigger(closed.container)).toHaveAttribute("data-open", "false");
    closed.unmount();

    const opened = render(
      <ButtonMenuStatus
        currentStatus={MediaStatus.SELECTED}
        statusOptions={statusOptions}
        defaultOpen
      />
    );
    expect(trigger(opened.container)).toHaveAttribute("data-open", "true");
  });
});

describe("ButtonMenuSmall — data-open", () => {
  it('carries data-open="false" while the menu is closed', () => {
    const { container } = render(<ButtonMenuSmall actions={actions} open={false} />);

    expect(trigger(container)).toHaveAttribute("data-open", "false");
  });

  it('carries data-open="true" while the menu is open', () => {
    const { container } = render(<ButtonMenuSmall actions={actions} open />);

    expect(trigger(container)).toHaveAttribute("data-open", "true");
  });

  it("emits the attribute in uncontrolled mode too", () => {
    const closed = render(<ButtonMenuSmall actions={actions} />);
    expect(trigger(closed.container)).toHaveAttribute("data-open", "false");
    closed.unmount();

    const opened = render(<ButtonMenuSmall actions={actions} defaultOpen />);
    expect(trigger(opened.container)).toHaveAttribute("data-open", "true");
  });
});

describe("every menu trigger of the library behaves the same", () => {
  it("covers the four buttons of the gs_w validation action bar", () => {
    expect(MENU_TRIGGERS.slice(0, 4).map((entry) => entry.name)).toEqual([
      "ButtonMenuStatus",
      "ButtonThumbnailStars",
      "ButtonThumbnailLabels",
      "ButtonMenuSmall",
    ]);
  });

  it.each(MENU_TRIGGERS)('$name marks its trigger data-open="false" when closed', ({ render: renderTrigger }) => {
    const { container } = render(renderTrigger(false));

    expect(trigger(container)).toHaveAttribute("data-open", "false");
  });

  it.each(MENU_TRIGGERS)('$name marks its trigger data-open="true" when open', ({ render: renderTrigger }) => {
    const { container } = render(renderTrigger(true));

    expect(trigger(container)).toHaveAttribute("data-open", "true");
  });

  /**
   * The counter-proof the uniformity is actually about: read the attribute off every
   * component in one pass and assert a single distinct value per state. One component
   * drifting — dropping the attribute, or emitting `undefined` instead of "false" —
   * makes this fail, whereas the per-component cases above would still pass for the
   * five others.
   */
  it("agrees on one single value per state across all six components", () => {
    const readAll = (open: boolean) =>
      MENU_TRIGGERS.map(({ render: renderTrigger }) => {
        const { container, unmount } = render(renderTrigger(open));
        const value = trigger(container).getAttribute("data-open");
        unmount();
        return value;
      });

    expect(new Set(readAll(false))).toEqual(new Set(["false"]));
    expect(new Set(readAll(true))).toEqual(new Set(["true"]));
  });
});
