import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  GroupedImageLoader,
  ImageLoadScheduler,
  chunkItems,
  preloadImage,
  type GroupedImageItem,
  type GroupedImageKey,
  type ImagePreloadResult,
  type PreloadImageFn,
} from "@/lib/grouped-image-loading";

/**
 * Préchargement simulé : chaque appel est enregistré, le test choisit quand
 * et comment il se termine.
 */
function fakePreload() {
  const calls: { src: string; high: boolean; cancelled: boolean; resolve: (r: ImagePreloadResult) => void }[] = [];
  const preload: PreloadImageFn = (src, options) => {
    let resolve: (r: ImagePreloadResult) => void = () => {};
    const promise = new Promise<ImagePreloadResult>((r) => (resolve = r));
    const call = { src, high: !!options?.highPriority, cancelled: false, resolve };
    calls.push(call);
    return {
      promise,
      cancel: () => {
        call.cancelled = true;
        resolve("cancelled");
      },
    };
  };
  const finish = async (src: string, result: ImagePreloadResult = "loaded") => {
    const call = calls.find((c) => c.src === src && !c.cancelled);
    if (!call) throw new Error(`pas de chargement pour ${src}`);
    call.resolve(result);
    await flush();
  };
  return { calls, preload, finish, requested: () => calls.map((c) => c.src) };
}

const flush = async () => {
  for (let i = 0; i < 5; i += 1) await Promise.resolve();
};

/** File dont le démarrage est déclenché à la main (`run()`). */
function manualScheduler(maxInFlight = 32) {
  const pending: (() => void)[] = [];
  const scheduler = new ImageLoadScheduler(maxInFlight, (run) => pending.push(run));
  const run = () => {
    while (pending.length) pending.shift()!();
  };
  return { scheduler, run };
}

const items = (count: number, prefix = "img"): GroupedImageItem[] =>
  Array.from({ length: count }, (_, i) => ({ key: i + 1, src: `/${prefix}-${i + 1}.jpg` }));

function setup({
  count = 3,
  columns = 6,
  visible = () => true,
  maxInFlight,
}: { count?: number; columns?: number; visible?: (keys: GroupedImageKey[]) => boolean; maxInFlight?: number } = {}) {
  const fake = fakePreload();
  const { scheduler, run } = manualScheduler(maxInFlight);
  const onChange = vi.fn();
  const loader = new GroupedImageLoader({ scheduler, preload: fake.preload, onChange, isVisible: visible });
  const list = items(count);
  loader.setItems(list, columns);
  const states = () => list.map(({ key }) => loader.getState(key));
  return { fake, scheduler, run, onChange, loader, list, states };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("chunkItems", () => {
  it("une référence normale est un seul bloc", () => {
    expect(chunkItems(items(20), 6).map((c) => c.length)).toEqual([20]);
    expect(chunkItems(items(24), 6).map((c) => c.length)).toEqual([24]);
    expect(chunkItems([], 6)).toEqual([]);
  });

  it("une très grande référence est découpée par lignes : colonnes × 4, 24 au moins, dans l'ordre", () => {
    const chunks = chunkItems(items(100), 6);
    expect(chunks.map((c) => c.length)).toEqual([24, 24, 24, 24, 4]);
    expect(chunks[1][0].key).toBe(25);
    expect(chunkItems(items(100), 10).map((c) => c.length)).toEqual([40, 40, 20]);
    // 4 colonnes × 4 lignes = 16 < 24 : le minimum s'applique.
    expect(chunkItems(items(50), 4).map((c) => c.length)).toEqual([24, 24, 2]);
  });
});

describe("GroupedImageLoader", () => {
  it("ne retient pas les ressources des 1 000 pages précédentes", async () => {
    const { scheduler, run } = manualScheduler();
    let allocated = 0, released = 0;
    const loader = new GroupedImageLoader({ scheduler, onChange: vi.fn(), preload: (src) => {
      allocated++;
      return { promise: Promise.resolve("loaded"), cancel: vi.fn(), image: {
        src, onload: null, onerror: null, removeAttribute: () => { released++; },
      } as unknown as HTMLImageElement };
    } });
    for (let page = 0; page < 1000; page++) {
      loader.setItems(items(24, `page-${page}`), 6);
      loader.setNear(1, true); loader.sync(); run(); await flush();
      expect(loader.retainedImages).toBe(24);
      expect(allocated - released).toBe(24);
    }
    loader.reset();
    expect(loader.retainedImages).toBe(0);
    expect(allocated).toBe(24000);
    expect(released).toBe(allocated);
  });

  it("borne les ressources au fil du scroll, recharge une image évincée et vide une grille éloignée", async () => {
    const { fake, run, loader } = setup({ count: 240 });
    loader.setCacheOptions({ maxImages: 48, keepAroundRows: 0 });
    let previous: number | null = null;
    for (let key = 1; key <= 240; key += 24) {
      if (previous !== null) loader.setNear(previous, false);
      loader.setNear(key, true); loader.sync(); run();
      fake.calls.forEach((call) => call.resolve("loaded"));
      await flush(); run();
      expect(loader.retainedImages).toBeLessThanOrEqual(48);
      previous = key;
    }
    expect(loader.getState(1)?.pending).toBe(true);
    const before = fake.calls.length;
    loader.setNear(previous!, false); loader.setNear(1, true); loader.sync(); run();
    expect(fake.calls.length).toBeGreaterThan(before);
    fake.calls.forEach((call) => call.resolve("loaded")); await flush();
    expect(loader.getState(1)?.pending).toBe(false);
    loader.setNear(1, false); loader.sync();
    expect(loader.retainedImages).toBe(0);
  });

  it("protège le bloc visible même si le budget est plus petit et libère les sources au retrait", async () => {
    const released = vi.fn();
    const { scheduler, run } = manualScheduler();
    const loader = new GroupedImageLoader({ scheduler, imageCache: { maxImages: 1, keepAroundRows: 0 }, onChange: vi.fn(),
      preload: (src) => ({ promise: Promise.resolve("loaded"), cancel: vi.fn(), image: {
        src, onload: null, onerror: null, removeAttribute: released,
      } as unknown as HTMLImageElement }),
    });
    loader.setItems(items(3), 6); loader.setNear(1, true); loader.sync(); run(); await flush();
    expect(loader.retainedImages).toBe(3);
    loader.setItems([], 6);
    expect(loader.retainedImages).toBe(0);
    expect(released).toHaveBeenCalledTimes(3);
  });

  it("ne demande rien tant que le bloc n'approche pas de l'écran", async () => {
    const { fake, run, loader, states } = setup();
    run();
    expect(fake.requested()).toEqual([]);
    expect(states().every((s) => s?.pending)).toBe(true);

    loader.setNear(3, true);
    loader.sync();
    run();
    // Une seule vignette proche suffit : tout le bloc (la référence) part.
    expect(fake.requested()).toEqual(["/img-1.jpg", "/img-2.jpg", "/img-3.jpg"]);
  });

  it("révèle les images d'un bloc ensemble, quand la dernière est prête", async () => {
    const { fake, run, loader, states, onChange } = setup();
    loader.setAllNear(true);
    loader.sync();
    run();

    await fake.finish("/img-1.jpg");
    await fake.finish("/img-3.jpg");
    expect(states().map((s) => s?.pending)).toEqual([true, true, true]);
    expect(onChange).not.toHaveBeenCalled();

    await fake.finish("/img-2.jpg");
    expect(states()).toEqual([
      { src: "/img-1.jpg", pending: false, error: false },
      { src: "/img-2.jpg", pending: false, error: false },
      { src: "/img-3.jpg", pending: false, error: false },
    ]);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("une image en erreur (404, indécodable) compte comme terminée et passe en erreur", async () => {
    const { fake, run, loader, states } = setup();
    loader.setAllNear(true);
    loader.sync();
    run();

    await fake.finish("/img-1.jpg");
    await fake.finish("/img-2.jpg", "error");
    await fake.finish("/img-3.jpg");
    expect(states().map((s) => [s?.pending, s?.error])).toEqual([
      [false, false],
      [false, true],
      [false, false],
    ]);
  });

  it("après 2 s, révèle ce qui est prêt ; le reste apparaît image par image", async () => {
    vi.useFakeTimers();
    const { fake, run, loader, states, onChange } = setup();
    loader.setAllNear(true);
    loader.sync();
    run();

    await fake.finish("/img-1.jpg");
    vi.advanceTimersByTime(1999);
    expect(states()[0]?.pending).toBe(true);
    vi.advanceTimersByTime(1);
    expect(states().map((s) => s?.pending)).toEqual([false, true, true]);
    expect(onChange).toHaveBeenCalledTimes(1);

    await fake.finish("/img-3.jpg", "error");
    expect(states().map((s) => s?.pending)).toEqual([false, true, false]);
    expect(states()[2]?.error).toBe(true);
    await fake.finish("/img-2.jpg");
    expect(states().map((s) => s?.pending)).toEqual([false, false, false]);
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("un bloc sorti de la zone avant d'avoir démarré ne démarre pas", () => {
    const { fake, run, loader, scheduler } = setup();
    loader.setNear(1, true);
    loader.sync();
    expect(scheduler.queued).toBe(1);
    // Défilement rapide : la vignette ressort avant que la file ne tourne.
    loader.setNear(1, false);
    loader.sync();
    run();
    expect(fake.requested()).toEqual([]);
    expect(scheduler.queued).toBe(0);

    // Elle revient : le bloc repart.
    loader.setNear(1, true);
    loader.sync();
    run();
    expect(fake.requested()).toHaveLength(3);
  });

  it("une très grande référence charge d'abord les blocs proches", () => {
    const { fake, run, loader } = setup({ count: 100, columns: 6 });
    loader.setNear(1, true);
    loader.sync();
    run();
    expect(fake.requested()).toHaveLength(24);
    expect(fake.requested()[23]).toBe("/img-24.jpg");
  });

  it("priorité haute pour un bloc visible, normale pour un bloc seulement proche", () => {
    const visible = setup({ visible: () => true });
    visible.loader.setAllNear(true);
    visible.loader.sync();
    visible.run();
    expect(visible.fake.calls.every((c) => c.high)).toBe(true);

    const near = setup({ visible: () => false });
    near.loader.setAllNear(true);
    near.loader.sync();
    near.run();
    expect(near.fake.calls.every((c) => !c.high)).toBe(true);
  });

  it("une src changée se charge comme une nouvelle image, sans masquer les autres", async () => {
    const { fake, run, loader, list } = setup();
    loader.setAllNear(true);
    loader.sync();
    run();
    await fake.finish("/img-1.jpg");
    await fake.finish("/img-2.jpg");
    await fake.finish("/img-3.jpg");

    loader.setItems(
      list.map((item) => (item.key === 2 ? { ...item, src: "/img-2-v2.jpg" } : item)),
      6,
    );
    run();
    expect(fake.requested().slice(3)).toEqual(["/img-2-v2.jpg"]);
    // L'ancienne image reste affichée tant que la nouvelle n'est pas prête.
    expect(loader.getState(2)).toEqual({ src: "/img-2.jpg", pending: false, error: false });
    expect(loader.getState(1)?.pending).toBe(false);

    await fake.finish("/img-2-v2.jpg");
    expect(loader.getState(2)).toEqual({ src: "/img-2-v2.jpg", pending: false, error: false });
  });

  it("une image retirée pendant son chargement ne bloque pas le reste du bloc", async () => {
    const { fake, run, loader, list, states } = setup();
    loader.setAllNear(true);
    loader.sync();
    run();
    await fake.finish("/img-1.jpg");
    await fake.finish("/img-3.jpg");

    loader.setItems(list.filter((item) => item.key !== 2), 6);
    await flush();
    expect(fake.calls[1].cancelled).toBe(true);
    expect(states()[0]?.pending).toBe(false);
    expect(states()[2]?.pending).toBe(false);
    expect(loader.getState(2)).toBeUndefined();
  });

  it("reset abandonne les chargements en cours", async () => {
    const { fake, run, loader } = setup();
    loader.setAllNear(true);
    loader.sync();
    run();
    loader.reset();
    expect(fake.calls.every((c) => c.cancelled)).toBe(true);
    expect(loader.getState(1)).toBeUndefined();
  });
});

describe("ImageLoadScheduler", () => {
  it("démarre d'abord les blocs visibles, et limite les images en vol", async () => {
    const fake = fakePreload();
    const { scheduler, run } = manualScheduler(4);
    const make = (prefix: string, visible: boolean) => {
      const loader = new GroupedImageLoader({
        scheduler,
        preload: fake.preload,
        onChange: () => {},
        isVisible: () => visible,
      });
      loader.setAllNear(true);
      loader.setItems(items(3, prefix), 6);
      return loader;
    };
    // Grille du haut, seulement proche ; grille du bas, visible : la visible passe devant.
    make("near", false);
    make("visible", true);
    run();
    expect(fake.requested()).toEqual(["/visible-1.jpg", "/visible-2.jpg", "/visible-3.jpg"]);
    expect(scheduler.pending).toBe(3);

    // 3 + 3 > 4 : l'autre bloc attend que de la place se libère.
    await fake.finish("/visible-1.jpg");
    run();
    await fake.finish("/visible-2.jpg");
    run();
    expect(fake.requested()).toHaveLength(6);
    expect(fake.requested().slice(3)).toEqual(["/near-1.jpg", "/near-2.jpg", "/near-3.jpg"]);
  });
});

describe("preloadImage", () => {
  const OriginalImage = globalThis.Image;
  let created: FakeImage[] = [];

  class FakeImage {
    decoding = "";
    fetchPriority = "";
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    decodeResult: Promise<void> = Promise.resolve();
    private value = "";
    constructor() {
      created.push(this);
    }
    get src() {
      return this.value;
    }
    set src(value: string) {
      this.value = value;
    }
    decode() {
      return this.decodeResult;
    }
  }

  beforeEach(() => {
    created = [];
    globalThis.Image = FakeImage as unknown as typeof Image;
  });
  afterEach(() => {
    globalThis.Image = OriginalImage;
  });

  it("charge puis décode, en priorité haute si demandé", async () => {
    const result = preloadImage("/a.jpg", { highPriority: true });
    const image = created[0];
    expect(image.src).toBe("/a.jpg");
    expect(image.decoding).toBe("async");
    expect(image.fetchPriority).toBe("high");
    image.onload?.();
    await expect(result.promise).resolves.toBe("loaded");
  });

  it("une erreur réseau ou un décodage refusé rendent « error »", async () => {
    const notFound = preloadImage("/404.jpg");
    created[0].onerror?.();
    await expect(notFound.promise).resolves.toBe("error");

    const corrupt = preloadImage("/corrupt.jpg");
    created[1].decodeResult = Promise.reject(new Error("EncodingError"));
    created[1].onload?.();
    await expect(corrupt.promise).resolves.toBe("error");
  });

  it("cancel interrompt la requête", async () => {
    const result = preloadImage("/slow.jpg");
    result.cancel();
    expect(created[0].src).toBe("");
    await expect(result.promise).resolves.toBe("cancelled");
  });
});
