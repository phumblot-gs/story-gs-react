import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import { CheckAll, getCheckAllState } from "@/components/ui/check-all";
import { CheckAllPages, getCheckAllPagesScope } from "@/components/ui/check-all-pages";

afterEach(() => cleanup());

describe("CheckAll", () => {
  it("dérive son état des compteurs", () => {
    expect(getCheckAllState(0, 20)).toBe(false);
    expect(getCheckAllState(20, 20)).toBe(true);
    expect(getCheckAllState(5, 20)).toBe("indeterminate");
    expect(getCheckAllState(0, 0)).toBe(false);
  });

  it("sélectionne depuis l'état intermédiaire, désélectionne depuis coché", async () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(<CheckAll selectedCount={5} totalCount={20} onCheckedChange={onCheckedChange} />);
    const box = screen.getByRole("checkbox", { name: "Select all" });
    expect(box).toHaveAttribute("data-check-all", "indeterminate");
    await userEvent.click(box);
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    rerender(<CheckAll selectedCount={20} totalCount={20} onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Deselect all" }));
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it("est désactivée sans élément", () => {
    render(<CheckAll selectedCount={0} totalCount={0} onCheckedChange={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("traduit son libellé", () => {
    render(<CheckAll selectedCount={0} totalCount={3} onCheckedChange={vi.fn()} language="fr" />);
    expect(screen.getByRole("checkbox", { name: "Tout sélectionner" })).toBeInTheDocument();
  });
});

describe("CheckAllPages", () => {
  it("dérive l'étendue des compteurs", () => {
    expect(getCheckAllPagesScope({ selectedCount: 0, pageCount: 20, totalCount: 51 })).toBe("none");
    expect(getCheckAllPagesScope({ selectedCount: 51, pageCount: 20, totalCount: 51 })).toBe("all");
    expect(getCheckAllPagesScope({ selectedCount: 20, pageCount: 20, pageSelectedCount: 20, totalCount: 51 })).toBe("page");
    // Même nombre, mais pas la page courante : personnalisée.
    expect(getCheckAllPagesScope({ selectedCount: 20, pageCount: 20, pageSelectedCount: 12, totalCount: 51 })).toBe("custom");
    expect(getCheckAllPagesScope({ selectedCount: 20, pageCount: 20, totalCount: 51 })).toBe("custom");
  });

  const renderMenu = (props: Partial<React.ComponentProps<typeof CheckAllPages>> = {}) => {
    const handlers = { onSelectPage: vi.fn(), onSelectAll: vi.fn(), onDeselectAll: vi.fn() };
    render(<CheckAllPages selectedCount={0} pageCount={20} totalCount={51} {...handlers} {...props} />);
    return handlers;
  };

  it("affiche l'étendue courante", () => {
    renderMenu({ selectedCount: 51 });
    expect(screen.getByRole("combobox")).toHaveTextContent("All pages (51)");
    cleanup();
    renderMenu({ selectedCount: 0, language: "fr" });
    expect(screen.getByRole("combobox")).toHaveTextContent("Sélection");
  });

  it("émet l'intention choisie dans le menu", async () => {
    const handlers = renderMenu();
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(await screen.findByRole("option", { name: "All pages (51)" }));
    expect(handlers.onSelectAll).toHaveBeenCalledTimes(1);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(await screen.findByRole("option", { name: "Current page (20)" }));
    expect(handlers.onSelectPage).toHaveBeenCalledTimes(1);
  });

  it("n'offre pas « page courante » quand il n'y a qu'une page", async () => {
    renderMenu({ pageCount: 12, totalCount: 12 });
    await userEvent.click(screen.getByRole("combobox"));
    expect(await screen.findByRole("option", { name: "All pages (12)" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Current page/ })).not.toBeInTheDocument();
  });
});
