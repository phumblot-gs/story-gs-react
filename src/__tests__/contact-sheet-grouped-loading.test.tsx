import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { ContactSheetReference, type ContactSheetExport } from "@/components/ContactSheetReference";

/**
 * Chargement groupé (`imageLoading="grouped"`) : `Image` et
 * IntersectionObserver sont simulés, le test décide quand chaque image se
 * charge, échoue, et quand les cellules approchent de l'écran.
 */

class FakeImage {
  static created: FakeImage[] = [];
  decoding = "";
  fetchPriority = "";
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = "";
  constructor() {
    FakeImage.created.push(this);
  }
  decode() {
    return Promise.resolve();
  }
}

const requested = () => FakeImage.created.map((image) => image.src).filter(Boolean);

async function finish(src: string, ok = true) {
  const image = FakeImage.created.find((i) => i.src === src);
  if (!image) throw new Error(`${src} n'a pas été demandée`);
  await act(async () => {
    if (ok) image.onload?.();
    else image.onerror?.();
    for (let i = 0; i < 5; i += 1) await Promise.resolve();
  });
}

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  targets: Element[] = [];
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit,
  ) {
    FakeIntersectionObserver.instances.push(this);
  }
  observe(target: Element) {
    this.targets.push(target);
  }
  unobserve(target: Element) {
    this.targets = this.targets.filter((t) => t !== target);
  }
  disconnect() {
    this.targets = [];
  }
  /** Les cellules passent dans la zone de préchargement (ou en sortent). */
  intersect(isIntersecting: boolean) {
    act(() => {
      this.callback(
        this.targets.map((target) => ({ target, isIntersecting }) as IntersectionObserverEntry),
        this as unknown as IntersectionObserver,
      );
    });
  }
}

const OriginalImage = globalThis.Image;

beforeEach(() => {
  FakeImage.created = [];
  FakeIntersectionObserver.instances = [];
  globalThis.Image = FakeImage as unknown as typeof Image;
});

afterEach(() => {
  cleanup();
  globalThis.Image = OriginalImage;
  vi.unstubAllGlobals();
});

const exportsOf = (srcs: string[]): ContactSheetExport[] => [
  {
    id: "e1",
    thumbnails: [
      ...srcs.map((src, i) => ({ picture_id: i + 1, src, filename: `photo_${i + 1}.tif` })),
      { view: "L" }, // emplacement vide : hors chargement
    ],
  },
];

const thumbnailImages = (container: HTMLElement) => container.querySelectorAll("[data-picture-id] img");

describe("ContactSheetReference — imageLoading=\"grouped\"", () => {
  it("révèle les images ensemble ; une 404 ne retarde pas les autres et affiche le fichier cassé", async () => {
    // Sans IntersectionObserver (SSR, tests) : tout est considéré visible.
    vi.stubGlobal("IntersectionObserver", undefined);
    const { container } = render(
      <ContactSheetReference
        reference={{ reference_id: 1, ref: "REF" }}
        exports={exportsOf(["/a.jpg", "/b.jpg", "/404.jpg"])}
        imageLoading="grouped"
      />,
    );

    // Cadres en attente, sans <img> ni requête.
    expect(thumbnailImages(container)).toHaveLength(0);
    expect(container.querySelectorAll("[data-image-pending]")).toHaveLength(3);
    await waitFor(() => expect(requested()).toEqual(["/a.jpg", "/b.jpg", "/404.jpg"]));

    await finish("/a.jpg");
    await finish("/b.jpg");
    expect(thumbnailImages(container)).toHaveLength(0);

    await finish("/404.jpg", false);
    const images = thumbnailImages(container);
    expect([...images].map((img) => img.getAttribute("src"))).toEqual(["/a.jpg", "/b.jpg"]);
    expect(images[0]).toHaveClass("fade-in-0", "motion-reduce:animate-none");
    const broken = container.querySelector('[data-picture-id="3"]')!;
    expect(broken.querySelector("[data-image-error]")).toBeInTheDocument();
    // Le nom de fichier reste visible.
    expect(broken.querySelector('[data-testid="thumbnail-filename"] [title="photo_3.tif"]')).toBeInTheDocument();
    expect(container.querySelectorAll("[data-image-pending]")).toHaveLength(0);
  });

  it("ne demande rien avant que les cellules approchent de l'écran (300px)", async () => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    vi.useFakeTimers();
    try {
      const { container } = render(
        <ContactSheetReference
          reference={{ reference_id: 1, ref: "REF" }}
          exports={exportsOf(["/a.jpg", "/b.jpg"])}
          imageLoading="grouped"
        />,
      );
      const observer = FakeIntersectionObserver.instances[0];
      expect(observer.options?.rootMargin).toBe("300px 0px");
      // Les cellules des images sont observées, pas l'emplacement vide.
      expect(observer.targets).toHaveLength(2);
      act(() => void vi.runAllTimers());
      expect(requested()).toEqual([]);

      observer.intersect(true);
      act(() => void vi.runAllTimers());
      expect(requested()).toEqual(["/a.jpg", "/b.jpg"]);
      expect(thumbnailImages(container)).toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it("une src changée remplace l'image une fois prête, sans masquer les autres", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const props = { reference: { reference_id: 1, ref: "REF" }, imageLoading: "grouped" as const };
    const { container, rerender } = render(<ContactSheetReference {...props} exports={exportsOf(["/a.jpg", "/b.jpg"])} />);
    await waitFor(() => expect(requested()).toHaveLength(2));
    await finish("/a.jpg");
    await finish("/b.jpg");
    expect(thumbnailImages(container)).toHaveLength(2);

    rerender(<ContactSheetReference {...props} exports={exportsOf(["/a.jpg", "/b-v2.jpg"])} />);
    await waitFor(() => expect(requested()).toContain("/b-v2.jpg"));
    // Pendant le chargement, l'ancienne version reste affichée.
    expect([...thumbnailImages(container)].map((img) => img.getAttribute("src"))).toEqual(["/a.jpg", "/b.jpg"]);
    await finish("/b-v2.jpg");
    expect([...thumbnailImages(container)].map((img) => img.getAttribute("src"))).toEqual(["/a.jpg", "/b-v2.jpg"]);
  });

  it("mode natif (défaut) : les <img> sont rendues tout de suite, sans préchargement", () => {
    const { container } = render(
      <ContactSheetReference reference={{ reference_id: 1, ref: "REF" }} exports={exportsOf(["/a.jpg", "/b.jpg"])} />,
    );
    expect(thumbnailImages(container)).toHaveLength(2);
    expect(container.querySelectorAll("[data-image-pending]")).toHaveLength(0);
    expect(FakeImage.created).toHaveLength(0);
  });
});
