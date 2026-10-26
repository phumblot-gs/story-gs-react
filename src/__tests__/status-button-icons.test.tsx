import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { ButtonStatus } from "@/components/ButtonStatus";
import { Thumbnail, type ThumbnailStatusButton } from "@/components/Thumbnail";
import { AVAILABLE_ICONS } from "@/components/ui/icons/constants";
import { renderIcon } from "@/components/ui/icons/icon-renderer";
import { MediaStatus } from "@/utils/mediaStatus";

/**
 * Status buttons accept any library icon (CR-684): gs_w validation needs a broadcast
 * button (Broadcast, 51), broadcast state indicators (51 / 55 / 52, same glyph as the legacy
 * validation) and a restore button (Restore, from status 1).
 */

afterEach(() => cleanup());

describe("Icônes de la librairie", () => {
  it("chaque nom de AVAILABLE_ICONS a un rendu, Broadcast et Restore compris", () => {
    expect(AVAILABLE_ICONS).toEqual(expect.arrayContaining(["Broadcast", "Restore"]));
    const missing = AVAILABLE_ICONS.filter((name) => renderIcon(name) === null);
    expect(missing).toEqual([]);
  });
});

describe("ButtonStatus — icône et libellé accessible", () => {
  it("garde le libellé calculé pour Check et X", () => {
    render(
      <>
        <ButtonStatus icon="Check" status={MediaStatus.VALIDATED} />
        <ButtonStatus icon="X" status={MediaStatus.REFUSED_1} />
      </>,
    );
    expect(screen.getByRole("button", { name: "Approve - Validated" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reject - Refused" })).toBeInTheDocument();
  });

  it("une autre icône n'est plus annoncée « Reject » : libellé du statut, ou aria-label", () => {
    render(
      <>
        <ButtonStatus icon="Broadcast" status={MediaStatus.READY_TO_BROADCAST} />
        <ButtonStatus icon="Restore" status={MediaStatus.NOT_SELECTED} aria-label="Restore" />
      </>,
    );
    const broadcastButton = screen.getByRole("button", { name: "Media status: Ready to Broadcast" });
    expect(broadcastButton.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Restore" })).toBeInTheDocument();
  });
});

describe("Thumbnail — boutons de diffusion et de restauration", () => {
  const baseProps = { picture_id: 1, src: "/photo.jpg", filename: "photo.jpg" };
  const broadcast: ThumbnailStatusButton = {
    key: "broadcast",
    icon: "Broadcast",
    status: MediaStatus.READY_TO_BROADCAST,
    label: "Broadcast",
  };
  const restore: ThumbnailStatusButton = {
    key: "restore",
    icon: "Restore",
    status: MediaStatus.NOT_SELECTED,
    label: "Restore",
  };
  const indicator = (status: MediaStatus, icon: ThumbnailStatusButton["icon"], label: string): ThumbnailStatusButton => ({
    key: "broadcast-state",
    icon,
    status,
    label,
    isActive: true,
    disabled: true,
  });

  it("Diffuser (Broadcast, 51) est cliquable et remonte sa clé", async () => {
    const onStatusButtonClick = vi.fn();
    render(
      <Thumbnail
        {...baseProps}
        status={MediaStatus.VALIDATED}
        statusButtons={[broadcast]}
        onStatusButtonClick={onStatusButtonClick}
      />,
    );
    const button = screen.getByRole("button", { name: "Broadcast" });
    expect(button.querySelector("svg")).toBeInTheDocument();
    await userEvent.click(button);
    expect(onStatusButtonClick).toHaveBeenCalledWith("broadcast", undefined);
  });

  it.each([
    [MediaStatus.READY_TO_BROADCAST, "Broadcast", "To broadcast"],
    [MediaStatus.BROADCAST, "Broadcast", "Broadcasted"],
    [MediaStatus.ERROR_DURING_BROADCAST, "Broadcast", "Broadcast error"],
  ] as const)("indicateur %s : actif, non cliquable, nommé", async (status, icon, label) => {
    const onStatusButtonClick = vi.fn();
    render(
      <Thumbnail
        {...baseProps}
        status={status}
        statusButtons={[indicator(status, icon, label)]}
        onStatusButtonClick={onStatusButtonClick}
      />,
    );
    const button = screen.getByRole("button", { name: label });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(button);
    expect(onStatusButtonClick).not.toHaveBeenCalled();
  });

  it("Restaurer (Restore) est cliquable depuis le statut 1", async () => {
    const onStatusButtonClick = vi.fn();
    render(
      <Thumbnail
        {...baseProps}
        status={MediaStatus.IGNORED}
        statusButtons={[restore]}
        onStatusButtonClick={onStatusButtonClick}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Restore" }));
    expect(onStatusButtonClick).toHaveBeenCalledWith("restore", undefined);
  });
});
