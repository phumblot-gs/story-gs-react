import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

import { Thumbnail } from "@/components/Thumbnail";
import { MediaStatus } from "@/utils/mediaStatus";

/**
 * `validateDisabled` / `rejectDisabled` (GSP-413): allow the host application to
 * lock the ✓ / ✗ buttons from the outside while a write is in flight, instead of
 * leaving buttons that look active but whose click is rejected downstream.
 *
 * The two props must combine with the pre-existing status-based disabling and
 * must be strictly no-ops when absent.
 */

afterEach(() => cleanup());

const validateButton = () => screen.getByRole("button", { name: /^Approve/i });
const rejectButton = () => screen.getByRole("button", { name: /^Reject/i });

const baseProps = {
  picture_id: 1,
  src: "/photo.jpg",
  filename: "photo.jpg",
  status: MediaStatus.SUBMITTED_FOR_APPROVAL,
};

describe("Thumbnail — external disabling of validate/reject", () => {
  it("leaves both buttons enabled when the props are absent (non-breaking default)", () => {
    render(<Thumbnail {...baseProps} onValidate={vi.fn()} onReject={vi.fn()} />);

    expect(validateButton()).toBeEnabled();
    expect(rejectButton()).toBeEnabled();
  });

  it("disables only the validate button with validateDisabled", () => {
    render(
      <Thumbnail {...baseProps} validateDisabled onValidate={vi.fn()} onReject={vi.fn()} />
    );

    expect(validateButton()).toBeDisabled();
    expect(rejectButton()).toBeEnabled();
  });

  it("disables only the reject button with rejectDisabled", () => {
    render(<Thumbnail {...baseProps} rejectDisabled onValidate={vi.fn()} onReject={vi.fn()} />);

    expect(validateButton()).toBeEnabled();
    expect(rejectButton()).toBeDisabled();
  });

  it("disables the whole action block when both props are set", () => {
    render(
      <Thumbnail
        {...baseProps}
        validateDisabled
        rejectDisabled
        onValidate={vi.fn()}
        onReject={vi.fn()}
      />
    );

    expect(validateButton()).toBeDisabled();
    expect(rejectButton()).toBeDisabled();
  });

  it("still renders the action block (no layout jump) when disabled", () => {
    const { container } = render(
      <Thumbnail
        {...baseProps}
        validateDisabled
        rejectDisabled
        onValidate={vi.fn()}
        onReject={vi.fn()}
      />
    );

    expect(container.querySelectorAll("button[disabled]").length).toBeGreaterThanOrEqual(2);
  });

  it("does not click through a disabled validate button", () => {
    const onValidate = vi.fn();
    render(<Thumbnail {...baseProps} validateDisabled onValidate={onValidate} />);

    validateButton().click();
    expect(onValidate).not.toHaveBeenCalled();
  });

  it("keeps the status-based disabling when the external props are false", () => {
    render(
      <Thumbnail
        {...baseProps}
        status={MediaStatus.VALIDATED}
        validateDisabled={false}
        rejectDisabled={false}
        onValidate={vi.fn()}
        onReject={vi.fn()}
      />
    );

    // status 50 (VALIDATED) already disables ✓ internally — unchanged behaviour.
    expect(validateButton()).toBeDisabled();
    expect(rejectButton()).toBeEnabled();
  });

  const benchWithReasons = {
    config: {
      validation: {
        rejection_options: {
          active: true,
          main: ["Flou", "Cadrage"],
        },
      },
    },
  };

  it("opens the rejection-reasons menu when rejectDisabled is absent (control)", async () => {
    const onReject = vi.fn();
    render(<Thumbnail {...baseProps} bench={benchWithReasons} onReject={onReject} />);

    await userEvent.click(rejectButton());

    expect(screen.getByText("Flou")).toBeInTheDocument();
  });

  it("does not open the rejection-reasons menu while rejectDisabled is set", async () => {
    const onReject = vi.fn();
    render(
      <Thumbnail {...baseProps} bench={benchWithReasons} rejectDisabled onReject={onReject} />
    );

    await userEvent.click(rejectButton(), { pointerEventsCheck: 0 });

    expect(screen.queryByText("Flou")).not.toBeInTheDocument();
    expect(onReject).not.toHaveBeenCalled();
  });
});
