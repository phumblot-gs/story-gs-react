import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";

import NotificationPanel, {
  type NotificationProps,
} from "@/components/notifications/NotificationPanel";
import { MediaStatus } from "@/utils/mediaStatus";

afterEach(() => cleanup());

const notification: NotificationProps = {
  notification_id: "n-1",
  title: "Commentaire ajouté",
  subtitle: "PROD-42",
  pictureStatus: MediaStatus.VALIDATED,
  type: "comment",
  redirectLink: "/productions/42",
  date: new Date(2026, 10, 24, 10, 30),
  unread: true,
};

describe("NotificationPanel — lien sans routeur", () => {
  // La librairie embarquait son propre react-router-dom 6 : dans une app sur
  // react-router 7 ou 8, le <Link> n'avait pas de contexte et levait
  // « useHref() may be used only in the context of a <Router> ».

  it("renders a plain <a href> without any router", () => {
    render(<NotificationPanel {...notification} />);

    const link = screen.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/productions/42");
  });

  it.each(["", "#", "   "])("blocks navigation for redirectLink %j and still calls onClick", (redirectLink) => {
    const onClick = vi.fn();
    const { container } = render(
      <NotificationPanel {...notification} redirectLink={redirectLink} onClick={onClick} />,
    );

    // <a href=""> n'a pas le rôle « link » pour testing-library : on cible l'élément.
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    container.querySelector("a")!.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(onClick).toHaveBeenCalledWith("n-1");
  });

  it("does not block navigation for a valid link", () => {
    render(<NotificationPanel {...notification} />);

    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    screen.getByRole("link").dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it("navigates client-side with the app router's Link passed to renderLink", () => {
    const onClick = vi.fn();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <NotificationPanel
                {...notification}
                onClick={onClick}
                renderLink={({ href, ...props }) => <Link to={href} {...props} />}
              />
            }
          />
          <Route path="/productions/42" element={<p>Production 42</p>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("link"));

    expect(onClick).toHaveBeenCalledWith("n-1");
    expect(screen.getByText("Production 42")).toBeInTheDocument();
  });

  it("keeps the empty-link guard with a router Link", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <NotificationPanel
                {...notification}
                redirectLink="#"
                renderLink={({ href, ...props }) => <Link to={href} {...props} />}
              />
            }
          />
          <Route path="*" element={<p>Ailleurs</p>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("link"));

    expect(screen.getByText("Commentaire ajouté")).toBeInTheDocument();
    expect(screen.queryByText("Ailleurs")).not.toBeInTheDocument();
  });
});
