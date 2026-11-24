import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { Thumbnail } from "@/components/Thumbnail";
import { ButtonThumbnailStars } from "@/components/ui/button-thumbnail-stars";
import { ButtonMenu } from "@/components/ui/button-menu";
import { ActionBar } from "@/components/layout/ActionBar";
import { ActionBarProvider } from "@/components/layout/ActionBarContext";
import { GSComponentsRoot } from "@/components/GSComponentsRoot";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { CollisionInsetsProvider, useCollisionPadding } from "@/contexts/CollisionInsetsContext";
import { MediaStatus } from "@/utils/mediaStatus";

/**
 * CR-511: gs_w runs in an iframe under gs_node's header (~60 px drawn over the iframe's top),
 * so a menu opened or flipped upwards must keep clear of a host-reserved top strip.
 * jsdom has no layout: the collisionPadding handed to Radix is captured instead.
 */

const captured = vi.hoisted(() => ({
  popover: [] as unknown[],
  dropdown: [] as unknown[],
  select: [] as unknown[],
  tooltip: [] as unknown[],
  contextMenu: [] as unknown[],
}));

vi.mock("@radix-ui/react-popover", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@radix-ui/react-popover")>();
  const Content = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof actual.Content>>((props, ref) => {
    captured.popover.push(props.collisionPadding);
    return <actual.Content ref={ref} {...props} />;
  });
  return { ...actual, Content, PopoverContent: Content };
});

vi.mock("@radix-ui/react-dropdown-menu", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@radix-ui/react-dropdown-menu")>();
  const Content = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof actual.Content>>((props, ref) => {
    captured.dropdown.push(props.collisionPadding);
    return <actual.Content ref={ref} {...props} />;
  });
  return { ...actual, Content, DropdownMenuContent: Content };
});

vi.mock("@radix-ui/react-select", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@radix-ui/react-select")>();
  const Content = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof actual.Content>>((props, ref) => {
    captured.select.push(props.collisionPadding);
    return <actual.Content ref={ref} {...props} />;
  });
  return { ...actual, Content, SelectContent: Content };
});

vi.mock("@radix-ui/react-tooltip", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@radix-ui/react-tooltip")>();
  const Content = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof actual.Content>>((props, ref) => {
    captured.tooltip.push(props.collisionPadding);
    return <actual.Content ref={ref} {...props} />;
  });
  return { ...actual, Content, TooltipContent: Content };
});

vi.mock("@radix-ui/react-context-menu", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@radix-ui/react-context-menu")>();
  const Content = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof actual.Content>>((props, ref) => {
    captured.contextMenu.push(props.collisionPadding);
    return <actual.Content ref={ref} {...props} />;
  });
  return { ...actual, Content, ContextMenuContent: Content };
});

beforeEach(() => {
  Object.values(captured).forEach((list) => (list.length = 0));
});
afterEach(() => cleanup());

const last = (list: unknown[]) => list[list.length - 1];
const reserved = { top: 68, right: 8, bottom: 8, left: 8 };

const refuseWithReasons = {
  key: "refuse",
  icon: "X",
  status: MediaStatus.REFUSED_1,
  label: "Refuse",
  rejectionReasons: true,
} as const;
const bench = { config: { validation: { rejection_options: { active: true, main: ["Blurry"], secondary: ["Other"] } } } };

const thumbnail = () => (
  <Thumbnail
    picture_id={1}
    src="/photo.jpg"
    filename="photo.jpg"
    status={MediaStatus.SUBMITTED_FOR_APPROVAL}
    bench={bench}
    statusButtons={[refuseWithReasons]}
    onStatusButtonClick={vi.fn()}
  />
);
const openRejectionMenu = async () => {
  await userEvent.click(screen.getByRole("button", { name: "Refuse" }));
  await screen.findByRole("button", { name: "Blurry" });
};

const actionBarMenu = () => (
  <ActionBarProvider>
    <ActionBar selectedCount={1} onDeselectAll={() => {}}>
      <ButtonMenu defaultOpen actions={[{ label: "Take" }]}>
        Actions
      </ButtonMenu>
    </ActionBar>
  </ActionBarProvider>
);

describe("marge haute réservée (CollisionInsetsProvider)", () => {
  describe("sans provider : comportement inchangé", () => {
    it("Thumbnail, menu des motifs de refus : collisionPadding 8", async () => {
      render(thumbnail());
      await openRejectionMenu();
      expect(last(captured.popover)).toBe(8);
    });

    it("ButtonThumbnailStars : collisionPadding 8 et hauteur max historique", async () => {
      render(<ButtonThumbnailStars value={3} defaultOpen />);
      const menu = await screen.findByRole("menu");
      expect(last(captured.dropdown)).toBe(8);
      expect(menu).toHaveClass("max-h-[calc(100vh-2rem)]");
    });

    it("ButtonMenu de l'ActionBar : collisionPadding 8", async () => {
      render(actionBarMenu());
      await screen.findByRole("menuitem", { name: "Take" });
      expect(last(captured.dropdown)).toBe(8);
    });
  });

  describe("avec { top: 60 } : la marge s'ajoute aux 8 px du haut", () => {
    it("Thumbnail, menu des motifs de refus", async () => {
      render(<CollisionInsetsProvider insets={{ top: 60 }}>{thumbnail()}</CollisionInsetsProvider>);
      await openRejectionMenu();
      expect(last(captured.popover)).toEqual(reserved);
    });

    it("ButtonThumbnailStars : padding et hauteur bornée par la hauteur disponible Radix", async () => {
      render(
        <CollisionInsetsProvider insets={{ top: 60 }}>
          <ButtonThumbnailStars value={3} defaultOpen />
        </CollisionInsetsProvider>,
      );
      const menu = await screen.findByRole("menu");
      expect(last(captured.dropdown)).toEqual(reserved);
      expect(menu).toHaveClass(
        "max-h-[min(calc(100vh-2rem),var(--radix-dropdown-menu-content-available-height))]",
      );
    });

    it("ButtonMenu de l'ActionBar, via GSComponentsRoot collisionInsets", async () => {
      render(<GSComponentsRoot collisionInsets={{ top: 60 }}>{actionBarMenu()}</GSComponentsRoot>);
      await screen.findByRole("menuitem", { name: "Take" });
      expect(last(captured.dropdown)).toEqual(reserved);
    });

    it("une hauteur max personnalisée reste celle de l'appelant", async () => {
      render(
        <CollisionInsetsProvider insets={{ top: 60 }}>
          <ButtonThumbnailStars value={3} defaultOpen menuMaxHeight="max-h-96" />
        </CollisionInsetsProvider>,
      );
      const menu = await screen.findByRole("menu");
      expect(menu).toHaveClass("max-h-96");
      expect(menu.className).not.toContain("available-height");
    });
  });

  describe("SelectContent : la marge s'ajoute au défaut Radix Select (10 px), pas à 0", () => {
    const select = (contentProps: React.ComponentProps<typeof SelectContent> = {}) => (
      <Select>
        <SelectTrigger>Choose</SelectTrigger>
        <SelectContent {...contentProps}>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>
    );
    const openSelect = async () => {
      await userEvent.click(screen.getByRole("combobox"));
      await screen.findByRole("option", { name: "A" });
    };

    // Radix Select defaults an undefined collisionPadding to CONTENT_MARGIN (10): passing 10 explicitly is identical.
    it("sans provider : 10, le défaut Radix", async () => {
      render(select());
      await openSelect();
      expect(last(captured.select)).toBe(10);
    });

    it("avec { top: 60 } : { top: 70, right: 10, bottom: 10, left: 10 }", async () => {
      render(<CollisionInsetsProvider insets={{ top: 60 }}>{select()}</CollisionInsetsProvider>);
      await openSelect();
      expect(last(captured.select)).toEqual({ top: 70, right: 10, bottom: 10, left: 10 });
    });

    // A partial object keeps Radix's meaning (missing sides are 0, Radix Select's 10 no longer applies).
    it("collisionPadding partiel { left: 4 } avec { top: 60 } : { top: 60, right: 0, bottom: 0, left: 4 }", async () => {
      render(<CollisionInsetsProvider insets={{ top: 60 }}>{select({ collisionPadding: { left: 4 } })}</CollisionInsetsProvider>);
      await openSelect();
      expect(last(captured.select)).toEqual({ top: 60, right: 0, bottom: 0, left: 4 });
    });
  });

  describe("TooltipContent et ContextMenuContent : la marge s'ajoute au défaut Popper (0)", () => {
    const tooltip = () => (
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Info</TooltipTrigger>
          <TooltipContent>Details</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    const contextMenu = () => (
      <ContextMenu>
        <ContextMenuTrigger>Zone</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
    const openContextMenu = async () => {
      await userEvent.pointer({ keys: "[MouseRight]", target: screen.getByText("Zone") });
      await screen.findByRole("menuitem", { name: "Copy" });
    };

    it("tooltip sans provider : rien de transmis (défaut Radix)", async () => {
      render(tooltip());
      await screen.findAllByText("Details");
      expect(last(captured.tooltip)).toBeUndefined();
    });

    it("tooltip avec { top: 60 } : { top: 60, right: 0, bottom: 0, left: 0 }", async () => {
      render(<CollisionInsetsProvider insets={{ top: 60 }}>{tooltip()}</CollisionInsetsProvider>);
      await screen.findAllByText("Details");
      expect(last(captured.tooltip)).toEqual({ top: 60, right: 0, bottom: 0, left: 0 });
    });

    it("context-menu sans provider : rien de transmis ; avec { top: 60 } : marge haute", async () => {
      const { unmount } = render(contextMenu());
      await openContextMenu();
      expect(last(captured.contextMenu)).toBeUndefined();
      unmount();

      render(<CollisionInsetsProvider insets={{ top: 60 }}>{contextMenu()}</CollisionInsetsProvider>);
      await openContextMenu();
      expect(last(captured.contextMenu)).toEqual({ top: 60, right: 0, bottom: 0, left: 0 });
    });
  });

  describe("useCollisionPadding", () => {
    const withInsets = (insets?: { top?: number }) =>
      function Wrapper({ children }: { children: React.ReactNode }) {
        return <CollisionInsetsProvider insets={insets}>{children}</CollisionInsetsProvider>;
      };

    it("sans marge, rend l'entrée telle quelle (même référence)", () => {
      const padding = { left: 4 };
      expect(renderHook(() => useCollisionPadding(padding)).result.current).toBe(padding);
      expect(renderHook(() => useCollisionPadding(10)).result.current).toBe(10);
      expect(renderHook(() => useCollisionPadding(undefined)).result.current).toBeUndefined();
    });

    it("un provider imbriqué remplace les marges du parent ; sans insets, il les remet à 0", () => {
      const nested = (inner?: { top?: number }) =>
        function Wrapper({ children }: { children: React.ReactNode }) {
          const Inner = withInsets(inner);
          return (
            <CollisionInsetsProvider insets={{ top: 60 }}>
              <Inner>{children}</Inner>
            </CollisionInsetsProvider>
          );
        };
      expect(renderHook(() => useCollisionPadding(8), { wrapper: nested({ top: 20 }) }).result.current).toEqual({
        top: 28,
        right: 8,
        bottom: 8,
        left: 8,
      });
      expect(renderHook(() => useCollisionPadding(8), { wrapper: nested() }).result.current).toBe(8);
    });
  });

  it("un GSComponentsRoot imbriqué sans collisionInsets remet les marges à 0 pour son sous-arbre", async () => {
    render(
      <GSComponentsRoot collisionInsets={{ top: 60 }}>
        <GSComponentsRoot withProviders={false}>{actionBarMenu()}</GSComponentsRoot>
      </GSComponentsRoot>,
    );
    await screen.findByRole("menuitem", { name: "Take" });
    expect(last(captured.dropdown)).toBe(8);
  });

  it("des marges à 0 ne changent rien", async () => {
    render(<CollisionInsetsProvider insets={{ top: 0 }}>{thumbnail()}</CollisionInsetsProvider>);
    await openRejectionMenu();
    expect(last(captured.popover)).toBe(8);
  });
});

describe("MultiSelect", () => {
  const openMultiSelect = () => {
    const trigger = screen.getByRole("combobox");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
  };
  const options = [{ value: "pe27", label: "PE27" }];

  it("sans provider : collisionPadding inchangé (défaut Radix)", () => {
    render(<MultiSelect options={options} />);
    openMultiSelect();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(last(captured.popover)).toBeUndefined();
  });

  it("avec { top: 60 } : la marge est réservée en haut", () => {
    render(
      <CollisionInsetsProvider insets={{ top: 60 }}>
        <MultiSelect options={options} />
      </CollisionInsetsProvider>,
    );
    openMultiSelect();
    expect(last(captured.popover)).toEqual({ top: 60, right: 0, bottom: 0, left: 0 });
  });
});
