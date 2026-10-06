import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { FileBrowser, FileItem, FileBrowserAction } from "@/components/ui/file-browser";

const ALL_ACTIONS: FileBrowserAction[] = ["rename", "move", "download", "share", "delete"];

const files: FileItem[] = ["a", "b"].map((id, i) => ({
  id,
  file_name: `file-${i}.png`,
  parent_path: "/",
  file_size: 1024,
  mime_type: "image/png",
  is_directory: false,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
}));

const selectFirstRow = () => {
  const row = screen.getByText("file-0.png").closest("tr")!;
  fireEvent.click(row);
};

// Le déclencheur du contrôle de sélection affiche « {n} selected ».
const bulkControl = () => screen.queryByText(/selected|sélectionné/i);

afterEach(() => cleanup());

describe("FileBrowser — bulk selection control", () => {
  it("shows the control once rows are selected", () => {
    render(<FileBrowser files={files} currentPath="/" />);

    expect(bulkControl()).not.toBeInTheDocument();
    selectFirstRow();
    expect(bulkControl()).toBeInTheDocument();
  });

  it("hides the control entirely when every action is hidden", () => {
    // Sans cette condition, le menu s'ouvrait vide, libellé de sélection compris.
    render(<FileBrowser files={files} currentPath="/" hiddenActions={ALL_ACTIONS} />);

    selectFirstRow();
    expect(bulkControl()).not.toBeInTheDocument();
  });

  it("keeps the control as soon as one action remains", () => {
    render(
      <FileBrowser
        files={files}
        currentPath="/"
        hiddenActions={["rename", "move", "share", "delete"]}
      />,
    );

    selectFirstRow();
    expect(bulkControl()).toBeInTheDocument();
  });

  it("keeps the control when actions are only disabled, not hidden", () => {
    // Grisées mais visibles : le menu garde son sens.
    render(<FileBrowser files={files} currentPath="/" disabledActions={ALL_ACTIONS} />);

    selectFirstRow();
    expect(bulkControl()).toBeInTheDocument();
  });
});
