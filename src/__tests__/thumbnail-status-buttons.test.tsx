import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { Thumbnail, type ThumbnailStatusButton } from "@/components/Thumbnail";
import { MediaStatus } from "@/utils/mediaStatus";

/**
 * Boutons de statut génériques : l'application passe la liste des boutons en
 * données (`statusButtons`) et reçoit la clé du bouton cliqué
 * (`onStatusButtonClick`). Aucune règle de statut codée en dur.
 */

afterEach(() => cleanup());

const baseProps = { picture_id: 1, src: "/photo.jpg", filename: "photo.jpg", status: MediaStatus.SUBMITTED_FOR_APPROVAL };
const select: ThumbnailStatusButton = { key: "select", icon: "Check", status: MediaStatus.SELECTED, label: "Select" };
const refuse: ThumbnailStatusButton = { key: "refuse", icon: "X", status: MediaStatus.REFUSED_1, label: "Refuse" };
const validate: ThumbnailStatusButton = { key: "validate", icon: "Check", status: MediaStatus.VALIDATED, label: "Validate" };
const statusRow = (container: HTMLElement) => container.querySelector(".min-h-\\[40px\\]");
const bench = { config: { validation: { rejection_options: { active: true, main: ["Blurry"], secondary: ["Other"] } } } };

describe("Thumbnail — statusButtons", () => {
  it("1 bouton : le clic remonte sa clé", async () => {
    const onStatusButtonClick = vi.fn();
    render(<Thumbnail {...baseProps} statusButtons={[select]} onStatusButtonClick={onStatusButtonClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Select" }));
    expect(onStatusButtonClick).toHaveBeenCalledWith("select", undefined);
  });

  it("un bouton actif mais non désactivé reste cliquable (aria-pressed)", async () => {
    const onStatusButtonClick = vi.fn();
    render(
      <Thumbnail {...baseProps} statusButtons={[{ ...select, isActive: true }]} onStatusButtonClick={onStatusButtonClick} />,
    );
    const button = screen.getByRole("button", { name: "Select" });
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(button);
    expect(onStatusButtonClick).toHaveBeenCalledWith("select", undefined);
  });

  it("2 boutons : ordre respecté, disabled bloque le clic", async () => {
    const onStatusButtonClick = vi.fn();
    render(
      <Thumbnail
        {...baseProps}
        statusButtons={[refuse, { ...validate, disabled: true }]}
        onStatusButtonClick={onStatusButtonClick}
      />,
    );
    const labels = screen.getAllByRole("button").map((b) => b.getAttribute("aria-label")).filter((l) => l === "Refuse" || l === "Validate");
    expect(labels).toEqual(["Refuse", "Validate"]);
    await userEvent.click(screen.getByRole("button", { name: "Validate" }));
    expect(onStatusButtonClick).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Refuse" }));
    expect(onStatusButtonClick).toHaveBeenCalledWith("refuse", undefined);
  });

  it("désactivé inactif : grisé ; désactivé actif : aspect normal", () => {
    render(
      <Thumbnail
        {...baseProps}
        statusButtons={[{ ...refuse, disabled: true }, { ...validate, disabled: true, isActive: true }]}
      />,
    );
    const greyed = screen.getByRole("button", { name: "Refuse" });
    const normal = screen.getByRole("button", { name: "Validate" });
    expect(greyed).toBeDisabled();
    expect(greyed).toHaveClass("disabled:opacity-50");
    expect(greyed.closest("span")).toHaveClass("cursor-not-allowed");
    expect(normal).toBeDisabled();
    expect(normal).not.toHaveClass("disabled:opacity-50");
    expect(normal.closest("span")).not.toHaveClass("cursor-not-allowed");
  });

  it("[] : aucun bouton, mais la ligne garde sa hauteur", () => {
    const { container } = render(<Thumbnail {...baseProps} statusButtons={[]} />);
    expect(statusRow(container)).toBeInTheDocument();
    expect(statusRow(container)!.querySelectorAll("button")).toHaveLength(0);
  });

  it("statusButtons défini remplace onValidate / onReject", () => {
    render(<Thumbnail {...baseProps} statusButtons={[select]} onValidate={vi.fn()} onReject={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Select" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Approve/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Reject/ })).not.toBeInTheDocument();
  });

  it("rejectionReasons ouvre le menu des motifs ; le motif choisi est remonté", async () => {
    const onStatusButtonClick = vi.fn();
    render(
      <Thumbnail
        {...baseProps}
        bench={bench}
        statusButtons={[{ ...refuse, rejectionReasons: true }, validate]}
        onStatusButtonClick={onStatusButtonClick}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Refuse" }));
    expect(onStatusButtonClick).not.toHaveBeenCalled();
    await userEvent.click(await screen.findByRole("button", { name: "Blurry" }));
    expect(onStatusButtonClick).toHaveBeenCalledWith("refuse", "Blurry");
  });

  it("rejectionReasons sans motifs configurés : clic direct", async () => {
    const onStatusButtonClick = vi.fn();
    render(
      <Thumbnail {...baseProps} statusButtons={[{ ...refuse, rejectionReasons: true }]} onStatusButtonClick={onStatusButtonClick} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Refuse" }));
    expect(onStatusButtonClick).toHaveBeenCalledWith("refuse", undefined);
  });

  it("le menu des motifs reste fermé sur un bouton désactivé", async () => {
    render(
      <Thumbnail {...baseProps} bench={bench} statusButtons={[{ ...refuse, rejectionReasons: true, disabled: true }]} onStatusButtonClick={vi.fn()} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Refuse" }));
    expect(screen.queryByRole("button", { name: "Blurry" })).not.toBeInTheDocument();
  });

  it("label donne l'aria-label ; sans label, celui de ButtonStatus", () => {
    render(<Thumbnail {...baseProps} statusButtons={[select, { ...validate, label: undefined }]} />);
    expect(screen.getByRole("button", { name: "Select" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Approve - / })).toBeInTheDocument();
  });

  it("pas de boutons sans picture_id (emplacement vide), comme avant", () => {
    const { container } = render(<Thumbnail view="F" statusButtons={[select]} />);
    expect(statusRow(container)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Select" })).not.toBeInTheDocument();
  });
});
