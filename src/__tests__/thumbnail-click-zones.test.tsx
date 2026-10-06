import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { Thumbnail } from "@/components/Thumbnail";

/**
 * Zones de clic du Thumbnail : zone élargie autour de la case à cocher, clic
 * sur le pied pour sélectionner (`selectOnFooterClick`) et copie du nom de
 * fichier (`copyFilenameOnClick`). Les deux derniers sont actifs par défaut
 * et se désactivent avec `={false}`.
 */

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const baseProps = { picture_id: 1, src: "/photo.jpg", filename: "7E0125DE91_worn_1.tif" };

describe("Thumbnail — zones de clic", () => {
  it("bascule la sélection depuis la zone élargie autour de la case", async () => {
    const onSelectionChange = vi.fn();
    render(<Thumbnail {...baseProps} onSelectionChange={onSelectionChange} />);
    await userEvent.click(screen.getByTestId("thumbnail-checkbox-hit-area"));
    expect(onSelectionChange).toHaveBeenCalledWith(true, expect.objectContaining({ shiftKey: false }));
  });

  it("ne sélectionne pas au clic sur le pied avec selectOnFooterClick={false}", async () => {
    const onSelectionChange = vi.fn();
    render(<Thumbnail {...baseProps} selectOnFooterClick={false} onSelectionChange={onSelectionChange} />);
    await userEvent.click(screen.getByTestId("thumbnail-footer"));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("sélectionne / désélectionne au clic sur le pied, en transmettant Maj", async () => {
    const onSelectionChange = vi.fn();
    const { rerender } = render(
      <Thumbnail {...baseProps} onSelectionChange={onSelectionChange} />,
    );
    await userEvent.click(screen.getByTestId("thumbnail-footer"));
    expect(onSelectionChange).toHaveBeenLastCalledWith(true, expect.objectContaining({ shiftKey: false }));

    rerender(<Thumbnail {...baseProps} selected onSelectionChange={onSelectionChange} />);
    fireEvent.click(screen.getByTestId("thumbnail-footer"), { shiftKey: true });
    expect(onSelectionChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ shiftKey: true }));
  });

  it("ignore les clics sur les boutons du pied", async () => {
    const onSelectionChange = vi.fn();
    render(
      <Thumbnail {...baseProps} onSelectionChange={onSelectionChange} onValidate={vi.fn()} actions={[{ key: "a", label: "A", action: vi.fn() }]} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "..." }));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("copie le nom de fichier et affiche « Copié » brièvement, sans sélectionner", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    const onSelectionChange = vi.fn();
    render(
      <Thumbnail {...baseProps} onSelectionChange={onSelectionChange} />,
    );

    vi.useFakeTimers();
    await act(async () => {
      fireEvent.click(screen.getByTestId("thumbnail-filename"));
    });
    expect(writeText).toHaveBeenCalledWith("7E0125DE91_worn_1.tif");
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
    expect(onSelectionChange).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1300));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

describe("Thumbnail — copie désactivable", () => {
  it("ne copie pas le nom de fichier avec copyFilenameOnClick={false}", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<Thumbnail {...baseProps} copyFilenameOnClick={false} />);
    await act(async () => {
      fireEvent.click(screen.getByTestId("thumbnail-filename"));
    });
    expect(writeText).not.toHaveBeenCalled();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});

describe("Thumbnail — grade et badge de vue", () => {
  it("affiche le grade sous les indicateurs quand il est renseigné", () => {
    const { container, rerender } = render(<Thumbnail {...baseProps} />);
    expect(container.querySelector(".grade-b")).toBeNull();
    rerender(<Thumbnail {...baseProps} isUrgent grade="B" />);
    expect(container.querySelector(".grade-b")).toHaveTextContent("B");
  });

  it("remplace le code de vue par viewIndicator", () => {
    const { rerender } = render(<Thumbnail {...baseProps} view="worn" />);
    expect(screen.getByText("worn")).toBeInTheDocument();
    rerender(<Thumbnail {...baseProps} view="worn" viewIndicator={<span>2 min</span>} />);
    expect(screen.getByText("2 min")).toBeInTheDocument();
    expect(screen.queryByText("worn")).not.toBeInTheDocument();
  });
});
