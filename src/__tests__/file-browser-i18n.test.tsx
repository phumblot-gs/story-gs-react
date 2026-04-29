import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { FileBrowser, FileItem } from "@/components/ui/file-browser";
import { FolderBrowser, FolderItem } from "@/components/ui/folder-browser";

const baseFile = (id: string, idx: number): FileItem => ({
  id,
  file_name: `file-${idx}.png`,
  parent_path: "/",
  file_size: 1024,
  mime_type: "image/png",
  is_directory: false,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
});

const makeFiles = (n: number): FileItem[] =>
  Array.from({ length: n }, (_, i) => baseFile(`f${i}`, i));

afterEach(() => cleanup());

describe("FileBrowser — Bug 1 plural placeholder substitution", () => {
  // The translation strings for filesLimitReached / filesAndMore embed
  // "{plural}" in FR/ES/IT. The fix passes plural: count > 1 ? 's' : '' at
  // each call site so the placeholder is substituted instead of leaking
  // into the DOM.

  it.each(["FR", "ES", "IT"])(
    "renders no '{plural}' literal in %s when limit is reached",
    (language) => {
      const files = makeFiles(1000);
      render(
        <FileBrowser
          files={files}
          currentPath="/"
          maxFilesLimit={1000}
          language={language}
        />,
      );
      expect(document.body.innerHTML).not.toContain("{plural}");
      expect(document.body.innerHTML).not.toContain("{count}");
    },
  );

  it.each(["FR", "ES", "IT"])(
    "renders no '{plural}' literal in %s when there is more to load",
    (language) => {
      const files = makeFiles(1000);
      render(
        <FileBrowser
          files={files}
          currentPath="/"
          hasMore
          totalFiles={null}
          language={language}
        />,
      );
      expect(document.body.innerHTML).not.toContain("{plural}");
      expect(document.body.innerHTML).not.toContain("{count}");
    },
  );

  it("renders singular form (no trailing 's') in FR for count = 1", () => {
    const files = makeFiles(1);
    render(
      <FileBrowser
        files={files}
        currentPath="/"
        maxFilesLimit={1}
        language="FR"
      />,
    );
    const html = document.body.innerHTML;
    expect(html).not.toContain("{plural}");
    expect(html).toContain("1 fichier (limite atteinte)");
  });

  it("renders plural form (with 's') in FR for count > 1", () => {
    const files = makeFiles(1000);
    render(
      <FileBrowser
        files={files}
        currentPath="/"
        maxFilesLimit={1000}
        language="FR"
      />,
    );
    const html = document.body.innerHTML;
    expect(html).not.toContain("{plural}");
    expect(html).toContain("1 000 fichiers (limite atteinte)");
  });
});

describe("FolderBrowser — Bug 2 missing i18n keys", () => {
  // The component reads folderBrowser.emptyFolder, .columnName and .select.
  // Before the fix, .emptyFolder / .columnName / .select were undefined so
  // t() returned the key as-is — the raw key leaked into the DOM.

  it.each(["EN", "FR", "ES", "IT", "DE"])(
    "shows the localized empty-folder message in %s (no raw key in DOM)",
    (language) => {
      render(
        <FolderBrowser folders={[]} currentPath="/" language={language} />,
      );
      const html = document.body.innerHTML;
      expect(html).not.toContain("folderBrowser.emptyFolder");
      expect(html).not.toContain("folderBrowser.columnName");
      expect(html).not.toContain("folderBrowser.select");
    },
  );

  it("renders the FR empty-folder copy", () => {
    render(<FolderBrowser folders={[]} currentPath="/" language="FR" />);
    expect(screen.getByText("Ce dossier est vide")).toBeInTheDocument();
    expect(screen.getByText("NOM DU DOSSIER")).toBeInTheDocument();
  });

  it("renders the EN empty-folder copy", () => {
    render(<FolderBrowser folders={[]} currentPath="/" language="EN" />);
    expect(screen.getByText("This folder is empty")).toBeInTheDocument();
    expect(screen.getByText("FOLDER NAME")).toBeInTheDocument();
  });
});
