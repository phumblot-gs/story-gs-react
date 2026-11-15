import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { ButtonThumbnailComments } from "@/components/ui/button-thumbnail-comments";
import { ContactSheetReference } from "@/components/ContactSheetReference";

/**
 * Comment write failure (CR-684): the composer used to clear the field and close the menu without
 * waiting for `onAddComment`, so a failed save lost the typed text and left an unhandled rejection.
 */

afterEach(() => cleanup());

const deferred = () => {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const field = () => screen.getByPlaceholderText("Add a comment");
const submit = () => screen.getByRole("button", { name: "Submit" });

describe("ButtonThumbnailComments — envoi du commentaire", () => {
  it("callback synchrone : vide le champ et ferme le menu tout de suite (inchangé)", async () => {
    const onAddComment = vi.fn();
    render(<ButtonThumbnailComments defaultOpen onAddComment={onAddComment} />);
    await userEvent.type(field(), "  Nice  ");
    await userEvent.click(submit());
    expect(onAddComment).toHaveBeenCalledWith("Nice");
    expect(screen.queryByPlaceholderText("Add a comment")).not.toBeInTheDocument();
  });

  it("promesse en cours : champ et bouton désactivés, menu ouvert ; résolue : vide et ferme", async () => {
    const save = deferred();
    render(<ButtonThumbnailComments defaultOpen onAddComment={() => save.promise} />);
    await userEvent.type(field(), "Retouch the collar");
    await userEvent.click(submit());

    expect(field()).toBeDisabled();
    expect(submit()).toBeDisabled();
    expect(field()).toHaveValue("Retouch the collar");

    save.resolve();
    await waitFor(() => expect(screen.queryByPlaceholderText("Add a comment")).not.toBeInTheDocument());
  });

  it("promesse rejetée : garde le texte et le menu, affiche l'erreur, puis permet de renvoyer", async () => {
    const onAddComment = vi.fn().mockRejectedValueOnce(new Error("500")).mockResolvedValueOnce(undefined);
    render(<ButtonThumbnailComments defaultOpen onAddComment={onAddComment} />);
    await userEvent.type(field(), "Retouch the collar");
    await userEvent.click(submit());

    expect(await screen.findByRole("alert")).toHaveTextContent("The comment could not be saved");
    expect(field()).toHaveValue("Retouch the collar");
    expect(field()).toBeEnabled();

    await userEvent.click(submit());
    expect(onAddComment).toHaveBeenCalledTimes(2);
    await waitFor(() => expect(screen.queryByPlaceholderText("Add a comment")).not.toBeInTheDocument());
  });

  // The field is disabled while pending, which drops focus to <body>; it must come back on failure.
  it("rend le focus au champ après un échec", async () => {
    render(<ButtonThumbnailComments defaultOpen onAddComment={() => Promise.reject(new Error("500"))} />);
    await userEvent.type(field(), "Retouch");
    await userEvent.click(submit());
    await screen.findByRole("alert");
    expect(field()).toHaveFocus();
  });

  it("l'erreur disparaît dès que le texte change", async () => {
    render(<ButtonThumbnailComments defaultOpen onAddComment={() => Promise.reject(new Error("500"))} />);
    await userEvent.type(field(), "A");
    await userEvent.click(submit());
    await screen.findByRole("alert");
    await userEvent.type(field(), "B");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("ignore un second envoi pendant que le premier est en cours", async () => {
    const save = deferred();
    const onAddComment = vi.fn(() => save.promise);
    render(<ButtonThumbnailComments defaultOpen onAddComment={onAddComment} />);
    await userEvent.type(field(), "Once");
    await userEvent.click(submit());
    field().closest("form")!.requestSubmit();
    expect(onAddComment).toHaveBeenCalledTimes(1);
    save.resolve();
  });
});

describe("ContactSheetReference — commentaire en échec", () => {
  it("la promesse de onThumbnailChange (type comment) remonte jusqu'au champ", async () => {
    const onThumbnailChange = vi.fn((change: { type: string }) =>
      change.type === "comment" ? Promise.reject(new Error("500")) : undefined,
    );
    render(
      <ContactSheetReference
        reference={{ reference_id: 1, ref: "R1" }}
        exports={[{ id: "e1", thumbnails: [{ picture_id: 7, src: "/p7.jpg", filename: "p7.tif" }] }]}
        onThumbnailChange={onThumbnailChange}
        thumbnailFeatures={{ validation: false }}
      />,
    );
    const thumbnail = document.querySelector('[data-picture-id="7"]')!;
    await userEvent.hover(thumbnail);
    // Menu triggers in order: stars, labels, tags, comments (the comments one has no accessible name).
    const triggers = thumbnail.querySelectorAll<HTMLButtonElement>("button[data-open]");
    await userEvent.click(triggers[triggers.length - 1]);

    await userEvent.type(await screen.findByPlaceholderText("Add a comment"), "Retouch the collar");
    await userEvent.click(submit());

    expect(onThumbnailChange).toHaveBeenCalledWith({
      type: "comment",
      comment: "Retouch the collar",
      pictureId: 7,
      exportId: "e1",
    });
    expect(await screen.findByRole("alert")).toHaveTextContent("The comment could not be saved");
    expect(field()).toHaveValue("Retouch the collar");
  });
});
