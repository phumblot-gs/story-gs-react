import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import * as React from "react";
import "@testing-library/jest-dom/vitest";

import { TranslationProvider, useTranslationSafe } from "@/contexts/TranslationContext";

afterEach(cleanup);

function Label({ language, translations }: { language?: string; translations?: Record<string, Record<string, string>> }) {
  const { t } = useTranslationSafe(translations, language);
  // Hook après useTranslationSafe, comme dans les composants réels : un
  // décalage de l'ordre des hooks le ferait lire l'état d'un autre hook.
  const [suffix] = React.useState("");
  return <span data-testid="label">{t("spinner.loading")}{suffix}</span>;
}

describe("useTranslationSafe — ordre des hooks stable", () => {
  it("language ajouté puis retiré sur une instance montée", () => {
    const { rerender } = render(<Label />);
    expect(screen.getByTestId("label")).toHaveTextContent("Loading");
    rerender(<Label language="FR" />);
    expect(screen.getByTestId("label")).toHaveTextContent("Chargement en cours");
    rerender(<Label />);
    expect(screen.getByTestId("label")).toHaveTextContent("Loading");
  });

  it("translations ajoutées puis retirées, sous un TranslationProvider", () => {
    const custom = { "spinner.loading": { EN: "Please wait" } };
    const { rerender } = render(
      <TranslationProvider defaultLanguage="EN">
        <Label />
      </TranslationProvider>,
    );
    rerender(
      <TranslationProvider defaultLanguage="EN">
        <Label translations={custom} />
      </TranslationProvider>,
    );
    expect(screen.getByTestId("label")).toHaveTextContent("Please wait");
    rerender(
      <TranslationProvider defaultLanguage="EN">
        <Label />
      </TranslationProvider>,
    );
    expect(screen.getByTestId("label")).toHaveTextContent("Loading");
  });
});
