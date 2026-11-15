import { vi } from "vitest";

/**
 * requestAnimationFrame piloté par le test : les images ne tournent que sur
 * `runFrames(time)` (une image) ou `flushFrames()` (jusqu'à la fin des animations).
 * À appeler dans un `beforeEach` ; `vi.restoreAllMocks()` remet l'original.
 */
export function mockAnimationFrames() {
  let nextId = 1;
  let queue = new Map<number, FrameRequestCallback>();
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    const id = nextId++;
    queue.set(id, callback);
    return id;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    queue.delete(id);
  });
  const runFrames = (time: number) => {
    const current = queue;
    queue = new Map();
    current.forEach((callback) => callback(time));
  };
  return {
    runFrames,
    flushFrames: () => {
      for (let i = 0; i < 100 && queue.size > 0; i++) runFrames(Number.MAX_SAFE_INTEGER);
    },
    pending: () => queue.size,
  };
}
