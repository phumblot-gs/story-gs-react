/**
 * Chargement groupé des images d'une planche contact.
 *
 * Trois briques, sans React (le branchement DOM est dans
 * `useGroupedImageLoading`) :
 * - `preloadImage` : charge et décode une image en JS (`new Image()`,
 *   `decode()`), sans l'afficher ;
 * - `ImageLoadScheduler` : file partagée par toutes les grilles de la page.
 *   Elle limite le nombre d'images en vol et démarre d'abord les blocs
 *   visibles, puis les blocs proches, dans l'ordre d'arrivée ;
 * - `GroupedImageLoader` : l'état des images d'une grille. Les images sont
 *   découpées en blocs (`chunkItems`) ; un bloc ne part que lorsqu'il approche
 *   de la zone d'affichage, et ses images apparaissent ensemble quand toutes
 *   sont chargées et décodées, ou en erreur. Passé `revealTimeoutMs`, ce qui
 *   est prêt apparaît et le reste suit image par image.
 */

/** Issue d'un préchargement. `cancelled` : abandonné (src changée, vignette retirée). */
export type ImagePreloadResult = "loaded" | "error" | "cancelled";

export interface ImagePreload {
  promise: Promise<ImagePreloadResult>;
  /** Abandonne le chargement s'il n'est pas terminé (la promesse rend `cancelled`). */
  cancel: () => void;
  /** Image préchargée, gardée en mémoire tant que la vignette l'affiche. */
  image?: HTMLImageElement;
}

export interface PreloadImageOptions {
  /** Image visible à l'écran : `fetchPriority = "high"`. */
  highPriority?: boolean;
}

export type PreloadImageFn = (src: string, options?: PreloadImageOptions) => ImagePreload;

function releaseImage(image?: HTMLImageElement) {
  if (!image) return;
  image.onload = null; image.onerror = null;
  if (image.removeAttribute) image.removeAttribute("src");
  else image.src = "";
}

/** Per-grid budget. Nearby blocks may exceed it to avoid evicting visible images. */
export interface ContactSheetImageCache {
  /** Retained images, default 120. */
  maxImages?: number;
  /** Extra protected rows around the preload zone, default 4. */
  keepAroundRows?: number;
}

export const DEFAULT_IMAGE_CACHE_SIZE = 120;

/**
 * Charge puis décode une image. Une erreur réseau (404…) ou une image
 * indécodable (`decode()` rejeté) rend `error`. Sans `Image` (SSR), rend
 * `loaded` tout de suite : la vignette se chargera elle-même.
 */
export const preloadImage: PreloadImageFn = (src, { highPriority = false } = {}) => {
  const image = typeof Image === "undefined" ? undefined : new Image();
  let settle: (result: ImagePreloadResult) => void = () => {};
  let settled = false;
  const promise = new Promise<ImagePreloadResult>((resolve) => {
    settle = (result) => {
      if (settled) return;
      settled = true;
      if (image) { image.onload = null; image.onerror = null; }
      resolve(result);
    };
  });
  if (!image) {
    settle("loaded");
    return { promise, cancel: () => {} };
  }
  const target = image;
  image.decoding = "async";
  if (highPriority) image.fetchPriority = "high";
  image.onload = () => {
    if (typeof target.decode !== "function") return settle("loaded");
    target.decode().then(
      () => settle("loaded"),
      () => settle("error"),
    );
  };
  image.onerror = () => settle("error");
  image.src = src;
  return {
    promise,
    image,
    cancel: () => {
      if (settled) return;
      target.onload = null;
      target.onerror = null;
      // Vider src interrompt la requête en cours.
      releaseImage(target);
      settle("cancelled");
    },
  };
};

// --- File d'attente partagée ---------------------------------------------------

/** Un bloc d'images prêt à partir, vu par la file. */
export interface ImageLoadJob {
  /** Nombre d'images que le bloc demandera. */
  readonly size: number;
  /** Au moins une de ses vignettes est à l'écran (pas seulement proche). */
  isVisible: () => boolean;
  /**
   * Lance les images du bloc ; `release` est appelé une fois par image
   * terminée (chargée, en erreur ou abandonnée). Rend le nombre d'images lancées.
   */
  start: (highPriority: boolean, release: () => void) => number;
}

/** Images en vol au plus, toutes grilles confondues (un bloc entier peut dépasser si rien n'est en vol). */
export const MAX_IMAGES_IN_FLIGHT = 32;

export class ImageLoadScheduler {
  private queue: { job: ImageLoadJob; seq: number }[] = [];
  private inFlight = 0;
  private seq = 0;
  private pumpScheduled = false;

  constructor(
    private readonly maxInFlight = MAX_IMAGES_IN_FLIGHT,
    /**
     * Report du démarrage : les blocs signalés dans la même frame (plusieurs
     * grilles) sont classés ensemble, visibles d'abord.
     */
    private readonly defer: (run: () => void) => void = (run) => setTimeout(run, 0),
  ) {}

  /** Images en vol (tests, diagnostic). */
  get pending(): number {
    return this.inFlight;
  }

  /** Blocs en attente de démarrage (tests, diagnostic). */
  get queued(): number {
    return this.queue.length;
  }

  enqueue(job: ImageLoadJob): void {
    if (this.queue.some((q) => q.job === job)) return;
    this.queue.push({ job, seq: this.seq++ });
    this.schedulePump();
  }

  /** Retire un bloc pas encore démarré. Rend `false` s'il était déjà parti (ou inconnu). */
  cancel(job: ImageLoadJob): boolean {
    const index = this.queue.findIndex((q) => q.job === job);
    if (index === -1) return false;
    this.queue.splice(index, 1);
    return true;
  }

  private schedulePump(): void {
    if (this.pumpScheduled) return;
    this.pumpScheduled = true;
    this.defer(() => {
      this.pumpScheduled = false;
      this.pump();
    });
  }

  /** Démarre les blocs en attente, visibles d'abord, tant que la limite le permet. */
  pump(): void {
    if (this.queue.length === 0) return;
    const ranked = this.queue
      .map((q) => ({ ...q, visible: q.job.isVisible() }))
      .sort((a, b) => (a.visible === b.visible ? a.seq - b.seq : a.visible ? -1 : 1));
    for (const { job, visible } of ranked) {
      // Priorité stricte : un bloc moins prioritaire ne double pas celui qui attend de la place.
      if (this.inFlight > 0 && this.inFlight + job.size > this.maxInFlight) break;
      this.cancel(job);
      this.inFlight += job.start(visible, () => {
        this.inFlight -= 1;
        this.schedulePump();
      });
    }
  }
}

/** File partagée par toutes les grilles de la page. */
export const sharedImageLoadScheduler = new ImageLoadScheduler();

// --- Découpage en blocs ----------------------------------------------------------

/** Lignes par bloc pour une grande référence. */
export const CHUNK_ROWS = 4;
/** Taille minimale d'un bloc. */
export const MIN_CHUNK_SIZE = 24;

/**
 * Découpe les images (ordre d'affichage) en blocs. Une référence normale est un
 * seul bloc ; au-delà de `max(colonnes × 4, 24)` images, on coupe par lignes
 * pour que les premières lignes n'attendent pas les suivantes.
 */
export function chunkItems<T>(items: readonly T[], columns: number): T[][] {
  if (items.length === 0) return [];
  const size = Math.max(MIN_CHUNK_SIZE, Math.max(1, Math.round(columns)) * CHUNK_ROWS);
  if (items.length <= size) return [items.slice()];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

// --- État d'une grille -------------------------------------------------------------

export type GroupedImageKey = string | number;

export interface GroupedImageItem {
  key: GroupedImageKey;
  src: string;
}

/** Ce que la vignette doit afficher. */
export interface GroupedImageState {
  /** Image à afficher (l'ancienne tant que la nouvelle d'un changement de src n'est pas prête). */
  src: string;
  /** Pas encore révélée : cadre sans image. */
  pending: boolean;
  /** Image en erreur (404, indécodable) : icône de fichier cassé. */
  error: boolean;
}

/** Délai après lequel un bloc révèle ce qui est prêt sans attendre le reste. */
export const GROUPED_REVEAL_TIMEOUT_MS = 2000;

type EntryStatus = "idle" | "queued" | "loading" | "loaded" | "error";

interface Entry {
  used: number;
  src: string;
  status: EntryStatus;
  /** Ce qui est affiché ; `null` : en attente. */
  display: { src: string; error: boolean } | null;
  job?: Job;
  preload?: ImagePreload;
  image?: HTMLImageElement;
}

interface Job extends ImageLoadJob {
  /** Images du bloc pas encore révélées. */
  keys: Set<GroupedImageKey>;
  started: boolean;
  /** Retire une image du bloc (retirée de la grille, ou src changée). */
  forget: (key: GroupedImageKey) => void;
}

export interface GroupedImageLoaderOptions {
  scheduler?: ImageLoadScheduler;
  /** Appelé quand des vignettes changent d'état (révélées) : la grille se redessine. */
  onChange: () => void;
  preload?: PreloadImageFn;
  revealTimeoutMs?: number;
  /** Les vignettes de ces clés sont-elles à l'écran ? (défaut : oui) */
  isVisible?: (keys: GroupedImageKey[]) => boolean;
  imageCache?: ContactSheetImageCache;
}

export class GroupedImageLoader {
  private entries = new Map<GroupedImageKey, Entry>();
  private chunks: GroupedImageKey[][] = [];
  private chunkOf = new Map<GroupedImageKey, number>();
  private near = new Set<GroupedImageKey>();
  private allNear = false;
  private jobs = new Set<Job>();
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private readonly scheduler: ImageLoadScheduler;
  private readonly preload: PreloadImageFn;
  private readonly revealTimeoutMs: number;
  private clock = 0;
  private columns = 6;
  private cache: ContactSheetImageCache;

  constructor(private readonly options: GroupedImageLoaderOptions) {
    this.scheduler = options.scheduler ?? sharedImageLoadScheduler;
    this.preload = options.preload ?? preloadImage;
    this.revealTimeoutMs = options.revealTimeoutMs ?? GROUPED_REVEAL_TIMEOUT_MS;
    this.cache = options.imageCache ?? {};
  }

  setCacheOptions(options: ContactSheetImageCache = {}): void { this.cache = options; }

  /** Diagnostic: resources retained by this loader, not browser-wide RAM. */
  get retainedImages(): number {
    return [...this.entries.values()].filter((entry) => entry.image || entry.preload || entry.display).length;
  }

  private trimCache(): void {
    if (this.allNear) return; // No visibility information: keep displayed images intact.
    const budget = this.cache.maxImages ?? DEFAULT_IMAGE_CACHE_SIZE;
    const limit = this.near.size === 0 ? 0 : Number.isFinite(budget) ? Math.max(1, Math.floor(budget)) : DEFAULT_IMAGE_CACHE_SIZE;
    let retained = this.retainedImages;
    if (retained <= limit) return;
    const rows = this.cache.keepAroundRows ?? 4;
    const padding = (Number.isFinite(rows) ? Math.max(0, Math.floor(rows)) : 4) * this.columns;
    const keys = [...this.entries.keys()];
    const protectedKeys = new Set<GroupedImageKey>();
    keys.forEach((key, index) => {
      if (!this.allNear && !this.near.has(key)) return;
      for (let i = Math.max(0, index - padding); i <= Math.min(keys.length - 1, index + padding); i++) protectedKeys.add(keys[i]);
    });
    // An entire nearby block is protected: never reveal half a block by eviction.
    this.chunks.forEach((chunk, index) => {
      if (this.isChunkNear(index)) chunk.forEach((key) => protectedKeys.add(key));
    });
    const candidates = [...this.entries].filter(([key, entry]) =>
      !protectedKeys.has(key) && (entry.image || entry.preload || entry.display),
    ).sort((a, b) => a[1].used - b[1].used);
    let changed = false;
    for (const [key, entry] of candidates) {
      if (retained <= limit) break;
      entry.display = null;
      this.detach(key, entry);
      entry.status = "idle";
      retained--; changed = true;
    }
    if (changed) this.options.onChange();
  }

  /** État d'affichage d'une image ; `undefined` si la clé est inconnue. */
  getState(key: GroupedImageKey): GroupedImageState | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    return entry.display
      ? { src: entry.display.src, pending: false, error: entry.display.error }
      : { src: entry.src, pending: true, error: false };
  }

  /**
   * Images de la grille, dans l'ordre d'affichage (emplacements vides exclus).
   * Une src changée repart comme une nouvelle image, sans masquer les autres :
   * l'ancienne reste affichée jusqu'à ce que la nouvelle soit prête.
   */
  setItems(items: readonly GroupedImageItem[], columns: number): void {
    this.columns = Math.max(1, Math.round(columns));
    const next = new Map<GroupedImageKey, Entry>();
    for (const { key, src } of items) {
      if (next.has(key)) continue;
      let entry = this.entries.get(key);
      if (!entry) {
        entry = { src, status: "idle", display: null, used: ++this.clock };
      } else if (entry.src !== src) {
        this.detach(key, entry);
        entry.src = src;
        entry.status = "idle";
        entry.image = undefined;
        // Une erreur n'a rien à garder à l'écran : on repasse en attente.
        if (entry.display?.error) entry.display = null;
      }
      next.set(key, entry);
    }
    this.entries.forEach((entry, key) => {
      if (!next.has(key)) this.detach(key, entry);
    });
    this.entries = next;
    this.near.forEach((key) => { if (!next.has(key)) this.near.delete(key); });
    this.chunks = chunkItems(
      [...next.keys()],
      columns,
    );
    this.chunkOf = new Map();
    this.chunks.forEach((chunk, index) => chunk.forEach((key) => this.chunkOf.set(key, index)));
    this.sync();
  }

  /** Une vignette entre dans la zone de préchargement, ou en sort. */
  setNear(key: GroupedImageKey, near: boolean): void {
    if (near) {
      this.near.add(key);
      const entry = this.entries.get(key);
      if (entry) entry.used = ++this.clock;
    }
    else this.near.delete(key);
  }

  /** Tout est considéré proche (pas d'IntersectionObserver : SSR, tests). */
  setAllNear(allNear: boolean): void {
    this.allNear = allNear;
  }

  private isChunkNear(index: number | undefined): boolean {
    if (index === undefined) return false;
    if (this.allNear) return true;
    return this.chunks[index]?.some((key) => this.near.has(key)) ?? false;
  }

  /**
   * Met la file à jour : chaque bloc proche qui a des images au repos part en
   * file ; un bloc en file pas encore démarré qui s'est éloigné en est retiré.
   */
  sync(): void {
    this.jobs.forEach((job) => {
      if (job.started) return;
      const stillNear = [...job.keys].some((key) => this.isChunkNear(this.chunkOf.get(key)));
      if (stillNear) return;
      this.scheduler.cancel(job);
      this.jobs.delete(job);
      job.keys.forEach((key) => {
        const entry = this.entries.get(key);
        if (entry?.job === job) {
          entry.job = undefined;
          entry.status = "idle";
        }
      });
    });
    this.chunks.forEach((chunk, index) => {
      if (!this.isChunkNear(index)) return;
      const idle = chunk.filter((key) => this.entries.get(key)?.status === "idle");
      if (idle.length > 0) this.createJob(idle);
    });
    this.trimCache();
  }

  private createJob(keys: GroupedImageKey[]): void {
    let timedOut = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    /** Images lancées, pas encore terminées. */
    const loading = new Set<GroupedImageKey>();

    const finish = () => {
      if (timer !== undefined) {
        clearTimeout(timer);
        this.timers.delete(timer);
      }
      this.jobs.delete(job);
    };
    // Révèle les images terminées parmi `revealed` ; le bloc est fini quand il n'en reste plus.
    const reveal = (revealed: GroupedImageKey[]) => {
      let changed = false;
      revealed.forEach((key) => {
        const entry = this.entries.get(key);
        if (!entry || entry.job !== job) return;
        if (entry.status !== "loaded" && entry.status !== "error") return;
        entry.display = { src: entry.src, error: entry.status === "error" };
        entry.used = ++this.clock;
        entry.job = undefined;
        job.keys.delete(key);
        changed = true;
      });
      if (job.keys.size === 0) finish();
      if (changed) this.options.onChange();
      this.trimCache();
    };
    // Une image terminée : seule après le délai, sinon avec tout le bloc quand c'est la dernière.
    const settle = (key: GroupedImageKey) => {
      loading.delete(key);
      if (timedOut) reveal([key]);
      else if (loading.size === 0) reveal([...job.keys]);
    };

    const job: Job = {
      keys: new Set(keys),
      started: false,
      get size() {
        return job.keys.size;
      },
      isVisible: () => this.options.isVisible?.([...job.keys]) ?? true,
      start: (highPriority, release) => {
        job.started = true;
        job.keys.forEach((key) => {
          const entry = this.entries.get(key);
          if (!entry || entry.job !== job) return;
          entry.status = "loading";
          loading.add(key);
          const preload = this.preload(entry.src, { highPriority });
          entry.preload = preload;
          void preload.promise.then((result) => {
            release();
            // Image retirée ou src changée entre-temps : detach() a déjà fait le ménage.
            if (this.entries.get(key) !== entry || entry.preload !== preload) return;
            entry.preload = undefined;
            entry.image = preload.image;
            entry.status = result === "loaded" ? "loaded" : "error";
            settle(key);
          });
        });
        if (loading.size === 0) {
          finish();
          return 0;
        }
        timer = setTimeout(() => {
          this.timers.delete(timer!);
          timer = undefined;
          timedOut = true;
          reveal([...job.keys].filter((key) => !loading.has(key)));
        }, this.revealTimeoutMs);
        this.timers.add(timer);
        return loading.size;
      },
      forget: (key) => {
        job.keys.delete(key);
        if (!job.started) {
          if (job.keys.size === 0) {
            this.scheduler.cancel(job);
            this.jobs.delete(job);
          }
          return;
        }
        if (loading.delete(key) && !timedOut && loading.size === 0 && job.keys.size > 0) reveal([...job.keys]);
        else if (job.keys.size === 0) finish();
      },
    };

    keys.forEach((key) => {
      const entry = this.entries.get(key)!;
      entry.status = "queued";
      entry.job = job;
    });
    this.jobs.add(job);
    this.scheduler.enqueue(job);
  }

  /** Sort une image de son bloc (retirée, ou src changée) et abandonne son chargement. */
  private detach(key: GroupedImageKey, entry: Entry): void {
    const job = entry.job;
    entry.job = undefined;
    const preload = entry.preload;
    entry.preload = undefined;
    preload?.cancel();
    releaseImage(preload?.image);
    job?.forget(key);
    releaseImage(entry.image);
    entry.image = undefined;
  }

  /** Abandonne tout (démontage) ; l'objet reste utilisable via `setItems`. */
  reset(): void {
    this.jobs.forEach((job) => this.scheduler.cancel(job));
    this.jobs.clear();
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.entries.forEach((entry) => { entry.preload?.cancel(); releaseImage(entry.image); });
    this.entries = new Map();
    this.chunks = [];
    this.chunkOf = new Map();
    this.near.clear();
  }
}
