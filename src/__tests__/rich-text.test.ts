// @vitest-environment node
// Le point d'entrée rich-text est importé côté serveur (Node 20, sans window ni document).
import { describe, expect, it } from "vitest";
import {
  richTextFromTemplateString,
  richTextIsEmpty,
  richTextNormalizeUrl,
  richTextRenderTemplateString,
  richTextSafeHref,
  richTextSanitize,
  richTextToHtml,
  richTextToPlainText,
  richTextToTemplateString,
  richTextValidate,
  type RichTextNode,
  type RichTextVariable,
} from "@/lib/rich-text";

const text = (t: string, marks?: RichTextNode["marks"]): RichTextNode => ({ type: "text", text: t, ...(marks ? { marks } : {}) });
const p = (...content: RichTextNode[]): RichTextNode => (content.length ? { type: "paragraph", content } : { type: "paragraph" });
const doc = (...content: RichTextNode[]): RichTextNode => ({ type: "doc", content });
const variable = (id: string, label = id): RichTextNode => ({ type: "variable", attrs: { id, label } });
const variableBlock = (id: string, label = id): RichTextNode => ({ type: "variableBlock", attrs: { id, label } });
const item = (...content: RichTextNode[]): RichTextNode => ({ type: "listItem", content });
const bullet = (...items: RichTextNode[]): RichTextNode => ({ type: "bulletList", content: items });

const VARIABLES: RichTextVariable[] = [
  { id: "fournisseur", label: "Fournisseur" },
  { id: "marketplace", label: "Marketplace" },
  { id: "lien_depot", label: "Lien de dépôt", kind: "url" },
  { id: "references", label: "Références en attente", kind: "list" },
];
const values = { fournisseur: "Maison <Dupont>", marketplace: "Printemps", lien_depot: "https://mediagrade.test" };

describe("environnement", () => {
  it("ne dépend ni de window ni de document", () => {
    expect(typeof window).toBe("undefined");
    expect(typeof document).toBe("undefined");
  });
});

// Cas repris des tests de contrat de Mediagrade (services/api/src/reminders/__tests__/richText.test.ts).
describe("richTextToHtml — contrat Mediagrade", () => {
  it("rend gras, italique, souligné, lien, listes, émoji et saut de ligne", () => {
    const html = richTextToHtml(doc(
      p(text("Bonjour "), text("vite", [{ type: "bold" }, { type: "italic" }]), text(" 🙌")),
      p(text("lien", [{ type: "link", attrs: { href: "https://gs.test/a?b=1&c=2" } }]), { type: "hardBreak" }, text("suite", [{ type: "underline" }])),
      bullet(item(p(text("un")))),
      { type: "orderedList", content: [item(p(text("deux")))] },
    ));
    expect(html).toMatch(/<strong><em>vite<\/em><\/strong>|<em><strong>vite<\/strong><\/em>/);
    expect(html).toContain("🙌");
    expect(html).toContain('href="https://gs.test/a?b=1&amp;c=2"');
    expect(html).toContain("<br><u>suite</u>");
    expect(html).toMatch(/<ul[^>]*><li[^>]*><p[^>]*>un<\/p><\/li><\/ul>/);
    expect(html).toMatch(/<ol[^>]*><li[^>]*><p[^>]*>deux<\/p><\/li><\/ol>/);
  });

  it("échappe le texte et les valeurs des variables", () => {
    const html = richTextToHtml(doc(p(text("<script>alert(1)</script>"), variable("fournisseur"))), values);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Maison &lt;Dupont&gt;");
  });

  it("variable url : un lien vers sa valeur ; une variable sans valeur garde son libellé", () => {
    expect(richTextToHtml(doc(p(variable("lien_depot"))), values, { variables: VARIABLES })).toContain('<a href="https://mediagrade.test/"');
    // Sans la définition des variables, la valeur reste du texte.
    expect(richTextToHtml(doc(p(variable("lien_depot"))), values)).toBe("<p>https://mediagrade.test</p>");
    expect(richTextToHtml(doc(p(variable("marketplace", "Marketplace"))), {})).toContain("{{Marketplace}}");
  });

  it("ignore un lien dangereux et un nœud inconnu au rendu", () => {
    const html = richTextToHtml(doc(
      p(text("x", [{ type: "link", attrs: { href: "javascript:alert(1)" } }])),
      { type: "image", attrs: { src: "https://x" } },
    ));
    expect(html).not.toContain("javascript");
    expect(html).not.toContain("img");
    expect(html).toBe("<p>x</p>");
  });
});

describe("richTextToHtml", () => {
  it("sans option : HTML nu, sans classes ni styles ; paragraphe vide en &nbsp;", () => {
    expect(richTextToHtml(doc(p(text("a")), p()))).toBe("<p>a</p><p>&nbsp;</p>");
  });

  it("styles en ligne par balise, paragraphe de liste à part", () => {
    const html = richTextToHtml(doc(p(text("a"), text("l", [{ type: "link", attrs: { href: "https://a.test" } }])), bullet(item(p(text("b"))))), {}, {
      inlineStyles: { p: "margin:0 0 12px", ul: "padding-left:24px", li: "margin:0", a: "color:#292828", liParagraph: "margin:0" },
    });
    expect(html).toBe(
      '<p style="margin:0 0 12px">a<a href="https://a.test/" style="color:#292828">l</a></p>' +
        '<ul style="padding-left:24px"><li style="margin:0"><p style="margin:0">b</p></li></ul>',
    );
  });

  it("échappe un style qui contiendrait des guillemets", () => {
    expect(richTextToHtml(doc(p(text("a"))), {}, { inlineStyles: { p: 'font-family:"x"' } })).toBe('<p style="font-family:&quot;x&quot;">a</p>');
  });

  it("lien vers une variable : href = valeur filtrée ; absente ou refusée → le texte sans lien", () => {
    const linked = doc(p(text("Déposer", [{ type: "bold" }, { type: "link", attrs: { variableId: "lien_depot" } }])));
    expect(richTextToHtml(linked, values)).toBe('<p><a href="https://mediagrade.test/"><strong>Déposer</strong></a></p>');
    expect(richTextToHtml(linked, {})).toBe("<p><strong>Déposer</strong></p>");
    expect(richTextToHtml(linked, { lien_depot: "javascript:alert(1)" })).toBe("<p><strong>Déposer</strong></p>");
    expect(richTextToHtml(linked, { lien_depot: "" })).not.toContain("href");
  });

  it("variable liste : <ul> échappé ; vide ou absente → rien", () => {
    const value = doc(p(text("Références :")), variableBlock("references"));
    expect(richTextToHtml(value, { references: ["REF-1", "<b>2</b>"] })).toBe(
      "<p>Références :</p><ul><li><p>REF-1</p></li><li><p>&lt;b&gt;2&lt;/b&gt;</p></li></ul>",
    );
    expect(richTextToHtml(value, { references: [] })).toBe("<p>Références :</p>");
    expect(richTextToHtml(value)).toBe("<p>Références :</p>");
  });
});

describe("richTextToPlainText", () => {
  it("contrat Mediagrade : variables remplacées, listes en « - »", () => {
    expect(richTextToPlainText(doc(p(text("Bonjour "), variable("fournisseur")), bullet(item(p(text("a"))))), values)).toBe(
      "Bonjour Maison <Dupont>\n\n- a",
    );
  });

  it("liste numérotée, saut de ligne, variable sans valeur, variable liste", () => {
    const value = doc(
      p(text("a"), { type: "hardBreak" }, variable("marketplace", "Marketplace")),
      { type: "orderedList", content: [item(p(text("un"))), item(p(text("deux")))] },
      variableBlock("references"),
    );
    expect(richTextToPlainText(value)).toBe("a\n{{Marketplace}}\n\n1. un\n2. deux");
    expect(richTextToPlainText(value, { references: ["R1", "R2"] })).toBe("a\n{{Marketplace}}\n\n1. un\n2. deux\n\n- R1\n- R2");
  });
});

describe("richTextIsEmpty", () => {
  it("ni texte ni variable", () => {
    expect(richTextIsEmpty(null)).toBe(true);
    expect(richTextIsEmpty(doc(p()))).toBe(true);
    expect(richTextIsEmpty(doc(p(text("  "))))).toBe(true);
    expect(richTextIsEmpty(doc(p(variable("fournisseur"))))).toBe(false);
    expect(richTextIsEmpty(doc(variableBlock("references")))).toBe(false);
    expect(richTextIsEmpty(doc(bullet(item(p(text("x"))))))).toBe(false);
  });
});

describe("richTextValidate", () => {
  const codes = (value: unknown, options?: Parameters<typeof richTextValidate>[1]) => richTextValidate(value, options).map((i) => i.code);

  it("accepte le schéma autorisé", () => {
    const value = doc(
      p(text("a", [{ type: "bold" }, { type: "link", attrs: { href: "https://a.test" } }]), variable("fournisseur"), { type: "hardBreak" }),
      p(text("b", [{ type: "link", attrs: { variableId: "lien_depot" } }])),
      bullet(item(p(text("c")))),
      variableBlock("references"),
    );
    expect(richTextValidate(value, { variables: VARIABLES })).toEqual([]);
  });

  it("contrat Mediagrade : refuse nœuds, marques, liens et variables hors schéma", () => {
    expect(codes({ type: "paragraph" })).toEqual(["invalid-document"]);
    expect(codes(doc({ type: "heading", content: [] }))).toEqual(["unknown-node"]);
    expect(codes(doc(p(text("a", [{ type: "strike" }]))))).toEqual(["unknown-mark"]);
    expect(codes(doc(p(text("a", [{ type: "link", attrs: { href: "javascript:x" } }]))))).toEqual(["unsafe-link"]);
    expect(codes(doc(p(variable("prenom"))), { variables: VARIABLES })).toEqual(["unknown-variable"]);
    expect(codes(doc(p(text("x".repeat(200)))), { maxLength: 100 })).toEqual(["too-long"]);
  });

  it("lien : href ou variableId, jamais les deux ; variableId de type url", () => {
    const linked = (attrs: Record<string, unknown>) => doc(p(text("a", [{ type: "link", attrs }])));
    expect(codes(linked({ href: "https://a.test", variableId: "lien_depot" }))).toEqual(["invalid-attrs"]);
    expect(codes(linked({}))).toEqual(["invalid-attrs"]);
    expect(codes(linked({ href: "https://a.test", target: "_blank" }))).toEqual(["invalid-attrs"]);
    expect(codes(linked({ variableId: "fournisseur" }), { variables: VARIABLES })).toEqual(["variable-kind"]);
    expect(codes(linked({ variableId: "inconnue" }), { variables: VARIABLES })).toEqual(["unknown-variable"]);
  });

  it("variable liste seulement en bloc, variable texte seulement en ligne", () => {
    expect(codes(doc(p(variable("references"))), { variables: VARIABLES })).toEqual(["variable-kind"]);
    expect(codes(doc(variableBlock("fournisseur")), { variables: VARIABLES })).toEqual(["variable-kind"]);
  });

  it("listes : un seul niveau, des listItem contenant des paragraphes", () => {
    expect(codes(doc(bullet(item(p(text("a")), bullet(item(p(text("b"))))))))).toEqual(["nested-list"]);
    expect(codes(doc(bullet(p(text("a")))))).toEqual(["unknown-node"]);
    expect(codes(doc(bullet()))).toEqual(["invalid-document"]);
  });

  it("attributs inattendus et textes vides", () => {
    expect(codes(doc({ type: "orderedList", attrs: { start: 3 }, content: [item(p(text("a")))] }))).toEqual(["invalid-attrs"]);
    expect(codes(doc(p({ type: "text", text: "" })))).toEqual(["invalid-text"]);
    expect(codes(doc(p(text("a", [{ type: "bold", attrs: { x: 1 } }]))))).toEqual(["invalid-attrs"]);
    // Attributs à null (sortie brute de Tiptap) : tolérés.
    expect(codes(doc({ type: "orderedList", attrs: { type: null }, content: [item(p(text("a")))] }))).toEqual([]);
  });

  it("donne le chemin de chaque écart", () => {
    const [issue] = richTextValidate(doc(p(text("a")), p(text("b", [{ type: "strike" }]))));
    expect(issue.path).toBe("content[1].content[0].marks[0]");
  });
});

describe("richTextSanitize", () => {
  it("ramène un document quelconque au schéma (et le résultat est valide)", () => {
    const dirty = {
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 1 }, content: [text("Titre", [{ type: "bold" }, { type: "strike" }])] },
        { type: "blockquote", content: [p(text("cité"))] },
        { type: "image", attrs: { src: "x" } },
        { type: "orderedList", attrs: { start: 3, type: null }, content: [item(p(text("a")), bullet(item(p(text("b")))))] },
        p(text("lien", [{ type: "link", attrs: { href: "javascript:x", target: "_blank" } }]), { type: "mention", attrs: { id: "u" } }),
        p(text("ok", [{ type: "link", attrs: { href: "https://a.test", variableId: "lien_depot", rel: "x" } }])),
        { type: "variable", attrs: { id: "fournisseur" } },
      ],
    };
    const clean = richTextSanitize(dirty);
    expect(clean).toEqual(doc(
      p(text("Titre", [{ type: "bold" }])),
      p(text("cité")),
      { type: "orderedList", content: [item(p(text("a"))), item(p(text("b")))] },
      p(text("lien")),
      p(text("ok", [{ type: "link", attrs: { variableId: "lien_depot" } }])),
      p({ type: "variable", attrs: { id: "fournisseur", label: "fournisseur" } }),
    ));
    expect(richTextValidate(clean)).toEqual([]);
  });

  it("entrée invalide ou vide : un document vide valide", () => {
    expect(richTextSanitize(null)).toEqual(doc(p()));
    expect(richTextSanitize({ type: "doc", content: [] })).toEqual(doc(p()));
    expect(richTextSanitize("x")).toEqual(doc(p()));
  });

  it("normalise un href valide", () => {
    expect(richTextSanitize(doc(p(text("a", [{ type: "link", attrs: { href: " https://a.test " } }]))))).toEqual(
      doc(p(text("a", [{ type: "link", attrs: { href: "https://a.test/" } }]))),
    );
  });
});

describe("URL", () => {
  it("richTextSafeHref : http(s) et mailto seulement (contrat Mediagrade)", () => {
    expect(richTextSafeHref("https://a.test")).toBe("https://a.test/");
    expect(richTextSafeHref("mailto:a@b.test")).toBe("mailto:a@b.test");
    expect(richTextSafeHref("javascript:alert(1)")).toBeNull();
    expect(richTextSafeHref("data:text/html,x")).toBeNull();
    expect(richTextSafeHref("//evil.test")).toBeNull();
    expect(richTextSafeHref(42)).toBeNull();
  });

  it("richTextNormalizeUrl : https:// ou mailto: ajoutés, autres schémas refusés", () => {
    expect(richTextNormalizeUrl("gs.com/depot")).toBe("https://gs.com/depot");
    expect(richTextNormalizeUrl("contact@gs.com")).toBe("mailto:contact@gs.com");
    expect(richTextNormalizeUrl("localhost:3000/a")).toBe("https://localhost:3000/a");
    expect(richTextNormalizeUrl("HTTP://A.test")).toBe("http://a.test/");
    expect(richTextNormalizeUrl("javascript:alert(1)")).toBeNull();
    expect(richTextNormalizeUrl("ftp://a.test")).toBeNull();
    expect(richTextNormalizeUrl("  ")).toBeNull();
  });
});

describe("chaînes de template (sujet)", () => {
  it("document → chaîne avec {{id}}", () => {
    expect(richTextToTemplateString(doc(p(text("Relance : visuels "), variable("fournisseur", "Fournisseur"))))).toBe(
      "Relance : visuels {{fournisseur}}",
    );
    expect(richTextToTemplateString(doc(p(text("a"), { type: "hardBreak" }, text("b")), p(text("c"))))).toBe("a b c");
  });

  it("chaîne → document : {{id}} connu en variable, inconnu ou liste en texte", () => {
    expect(richTextFromTemplateString("Relance {{ fournisseur }} / {{inconnue}} {{references}}", VARIABLES)).toEqual(
      doc(p(text("Relance "), variable("fournisseur", "Fournisseur"), text(" / {{inconnue}} {{references}}"))),
    );
    expect(richTextFromTemplateString("", VARIABLES)).toEqual(doc(p()));
  });

  it("aller-retour stable", () => {
    const subject = "Visuels {{marketplace}} pour {{fournisseur}}";
    expect(richTextToTemplateString(richTextFromTemplateString(subject, VARIABLES))).toBe(subject);
  });

  it("rendu : contrat Mediagrade (renderSubject)", () => {
    expect(richTextRenderTemplateString("Relance {{ marketplace }} / {{inconnue}}\n", values)).toBe("Relance Printemps / {{inconnue}}");
    expect(richTextRenderTemplateString("{{references}}", { references: ["a", "b"] })).toBe("a, b");
  });
});
