import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { cn } from "@/lib/utils";

/**
 * `cn()` est consommé par TOUS les composants de la librairie, donc une
 * régression ici est silencieuse et globale.
 *
 * Le bug corrigé : `tailwind-merge` ne reconnaît comme `font-size` que les clés
 * en « taille de t-shirt » (`xs`, `sm`, `lg`, `2xl`…). Les clés `fontSize`
 * personnalisées du preset GS retombaient dans le groupe *text-color*, si bien
 * qu'une classe de couleur supprimait la TAILLE. Cas réel rencontré :
 * `Thumbnail/ViewIndicator` passe `text-black` à un `Badge`.
 *
 * `xxl` est le piège le plus vicieux : `2xl` est reconnu, `xxl` ne l'est pas.
 */

/** Clés `fontSize` que `isTshirtSize` de tailwind-merge reconnaît déjà. */
const RECONNUES_DORIGINE = ["xs", "sm", "base", "lg", "xl"];
/** Clés `fontSize` du preset qu'il faut déclarer à la main dans `cn()`. */
const A_DECLARER = ["xxl", "badge-label", "header-title", "button-header"];

describe("cn() — tailles de police personnalisées", () => {
  it.each([...RECONNUES_DORIGINE, ...A_DECLARER])(
    "text-%s survit à une classe de couleur postérieure",
    (cle) => {
      expect(cn(`text-${cle}`, "text-black")).toContain(`text-${cle}`);
      expect(cn(`text-${cle}`, "text-black")).toContain("text-black");
    }
  );

  it("une taille passée par le consommateur remplace celle de la librairie", () => {
    const res = cn("text-badge-label", "text-sm");
    expect(res).toContain("text-sm");
    expect(res).not.toContain("text-badge-label");
  });

  it("l'ordre font-size puis leading-* conserve l'interlignage", () => {
    // C'est l'ordre utilisé par les classes de base du Badge. tailwind-merge a
    // un conflit font-size -> leading : une taille POSTÉRIEURE supprimerait le
    // leading. L'ordre inverse doit donc être conservé dans les composants.
    expect(cn("text-badge-label", "leading-tight")).toContain("leading-tight");
  });

  it("une taille arbitraire postérieure supprime le leading (piège connu)", () => {
    // Documenté volontairement : c'est ce qui faisait perdre `leading-tight` à
    // Three60Indicator via son `text-[10px]`, désormais retiré.
    expect(cn("leading-tight", "text-[10px]")).not.toContain("leading-tight");
  });

  it("aucune clé fontSize du preset n'est laissée hors de la déclaration", () => {
    // Garde-fou : si quelqu'un ajoute une clé fontSize au preset sans la
    // déclarer dans src/lib/utils.ts, ce test échoue.
    const preset = readFileSync(
      resolve(__dirname, "../../tailwind-preset.cjs"),
      "utf8"
    );
    const bloc = preset.match(/fontSize:\s*\{([\s\S]*?)\n {6}\},/);
    expect(bloc).not.toBeNull();
    const cles = [...bloc![1].matchAll(/^\s*"?([A-Za-z0-9-]+)"?:/gm)].map(
      (m) => m[1]
    );
    expect(cles.length).toBeGreaterThan(0);
    for (const cle of cles) {
      expect(
        cn(`text-${cle}`, "text-black"),
        `text-${cle} est traité comme une couleur : déclarer "${cle}" dans le groupe font-size de src/lib/utils.ts`
      ).toContain(`text-${cle}`);
    }
  });

  it("ne modifie aucun autre groupe de classes", () => {
    expect(cn("p-1", "p-2")).toBe("p-2");
    expect(cn("text-center", "text-black")).toBe("text-center text-black");
    expect(cn("text-ellipsis", "text-black")).toBe("text-ellipsis text-black");
    expect(cn("flex", "block")).toBe("block");
    expect(cn("self-start", "self-center")).toBe("self-center");
  });
});
