import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RichTextEditor } from "./rich-text-editor";
import { Button } from "./button";
import { Layout } from "@/components/layout";
import {
  richTextFromTemplateString,
  richTextRenderTemplateString,
  richTextToHtml,
  richTextToPlainText,
  richTextToTemplateString,
  richTextValidate,
  type RichTextValue,
  type RichTextVariable,
} from "@/lib/rich-text";

const variables: RichTextVariable[] = [
  { id: "fournisseur", label: "Fournisseur" },
  { id: "marketplace", label: "Marketplace" },
  { id: "lien_depot", label: "Lien de dépôt", kind: "url" },
  { id: "references", label: "Références en attente", kind: "list" },
];
const sampleValues = {
  fournisseur: "Maison Dupont",
  marketplace: "Printemps",
  lien_depot: "https://mediagrade.example.com/depot/abc",
  references: ["REF-1042 – Robe lin", "REF-1043 – Chemise oxford", "REF-1051 – Sac cabas"],
};
/** Styles en ligne de l'email (les clients mail ignorent les feuilles de style). */
const emailStyles = {
  p: "margin:0 0 12px 0;line-height:1.5;",
  ul: "margin:0 0 12px 0;padding-left:24px;line-height:1.5;",
  ol: "margin:0 0 12px 0;padding-left:24px;line-height:1.5;",
  a: "color:#292828;text-decoration:underline;",
  liParagraph: "margin:0;line-height:1.5;",
};

const t = (text: string, marks?: { type: string; attrs?: Record<string, unknown> }[]) => ({ type: "text", text, ...(marks ? { marks } : {}) });
const v = (id: string, label: string) => ({ type: "variable", attrs: { id, label } });
const example: RichTextValue = {
  type: "doc",
  content: [
    { type: "paragraph", content: [t("Bonjour "), v("fournisseur", "Fournisseur"), t(",")] },
    { type: "paragraph", content: [
      t("Nous attendons encore vos visuels pour "), v("marketplace", "Marketplace"), t(". "),
      t("Merci de les déposer", [{ type: "bold" }]), t(" avant "), t("vendredi", [{ type: "italic" }, { type: "underline" }]), t(" 🙏"),
    ] },
    { type: "bulletList", content: [
      { type: "listItem", content: [{ type: "paragraph", content: [t("format JPEG ou TIFF")] }] },
      { type: "listItem", content: [{ type: "paragraph", content: [t("fond blanc")] }] },
    ] },
    { type: "orderedList", content: [
      { type: "listItem", content: [{ type: "paragraph", content: [t("Ouvrez la "), t("page de dépôt", [{ type: "link", attrs: { variableId: "lien_depot" } }])] }] },
      { type: "listItem", content: [{ type: "paragraph", content: [t("Consultez la "), t("charte", [{ type: "link", attrs: { href: "https://grand-shooting.com/" } }])] }] },
    ] },
    { type: "variableBlock", attrs: { id: "references", label: "Références en attente" } },
    { type: "paragraph", content: [t("Cordialement,"), { type: "hardBreak" }, t("L'équipe e-commerce")] },
  ],
};

const meta = {
  title: "UI/RichTextEditor",
  component: RichTextEditor,
  tags: ["autodocs"],
  args: { variables, locale: "en" },
  decorators: [(Story) => <div className="w-full max-w-[720px]"><Story /></div>],
  parameters: {
    docs: {
      description: {
        component: `
Rich text field for emails (supplier reminders): **bold** (⌘/Ctrl+B), *italic* (⌘/Ctrl+I), underline
(⌘/Ctrl+U), links (⌘/Ctrl+K), bulleted and numbered lists, emojis and variables. Built on Tiptap like
\`CommentComposer\`, with its emoji picker. The field owns no submit button, persistence or sending.

- **Value**: Tiptap JSON, controlled with \`value\` / \`onChange\` (\`null\` empties the field). \`onChange\` always
  receives the document reduced to the schema below, with \`{ isEmpty, text }\`.
- **Links**: a fixed URL (\`https:\`, \`http:\`, \`mailto:\` only; \`https://\` added when the scheme is missing, \`mailto:\`
  for an email address) **or** a variable of kind \`url\`. Edit or remove an existing link from the same input.
  Links never open on click in the editor. A typed or pasted URL becomes a link.
- **Variables**: \`variables\` adds the *Insert a variable* button; typing \`{{\` opens the same list. A typed or
  pasted \`{{id}}\` of a known variable becomes a chip. Kind \`text\` (default) and \`url\`: an inline chip. Kind \`list\`:
  a block of its own (a bulleted list once rendered). A variable the editor does not know keeps its chip, with a
  warning style and a tooltip.
- **\`singleLine\`** (email subject): no toolbar, Enter blocked, text and variables only (no list variable). Store
  it as a string with \`richTextToTemplateString\` (\`"Relance {{fournisseur}}"\`), load it back with
  \`richTextFromTemplateString(text, variables)\`.
- **Accessibility**: \`role="toolbar"\` with one Tab stop, arrows / Home / End between the buttons; \`aria-label\`,
  \`aria-describedby\`, \`aria-invalid\` on the field.

### Document schema (contract with the API)

Closed and stable: nothing else is produced, \`richTextValidate\` reports anything else.

| Type | Detail |
| --- | --- |
| \`doc\` | root |
| \`paragraph\` | block |
| \`bulletList\`, \`orderedList\`, \`listItem\` | one level only; a list item holds paragraphs |
| \`variableBlock\` | block, \`attrs: { id, label }\`, variables of kind \`list\` |
| \`hardBreak\` | Shift+Enter |
| \`text\` | marks \`bold\`, \`italic\`, \`underline\`, \`link\` (\`attrs: { href }\` **or** \`{ variableId }\`) |
| \`variable\` | inline, atomic, \`attrs: { id, label }\`, variables of kind \`text\` or \`url\` |

Emojis are Unicode text. No attributes other than those listed.

### Rendering, server side

\`@gs/gs-components-library/rich-text\` exports pure functions — no React, DOM, Tiptap or CSS — for Node 20 (an
API rendering the email) and for the preview in the browser:

\`\`\`ts
import { richTextValidate, richTextToHtml, richTextToPlainText, richTextRenderTemplateString } from "@gs/gs-components-library/rich-text";

const issues = richTextValidate(body, { variables, maxLength: 100_000 }); // [] when valid: refuse otherwise
const html = richTextToHtml(body, values, { variables, inlineStyles: { p: "margin:0 0 12px 0", a: "color:#292828" } });
const text = richTextToPlainText(body, values);
const subject = richTextRenderTemplateString(template.subject, values);
\`\`\`

- \`richTextToHtml(value, values?, options?)\`: text and values escaped; links filtered (a missing or refused target
  keeps the text, without a link); a \`url\` variable rendered as a link when \`options.variables\` is given; a list
  variable as a \`<ul>\`, nothing when empty; no \`<html>\` / \`<body>\` envelope.
- \`richTextValidate\` (refuse) / \`richTextSanitize\` (correct), \`richTextIsEmpty\`, \`richTextToPlainText\`,
  \`richTextToTemplateString\` / \`richTextFromTemplateString\` / \`richTextRenderTemplateString\`, \`richTextSafeHref\`,
  \`richTextNormalizeUrl\`. \`values\`: \`Record<string, string | string[]>\`.
`,
      },
    },
  },
} satisfies Meta<typeof RichTextEditor>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  parameters: { docs: { description: { story: "Empty field with its placeholder. Type `{{` to insert a variable." } } },
};

export const WithContent: Story = {
  args: { defaultValue: example },
  parameters: { docs: { description: { story: "Bold, italic, underline, links (fixed URL and `lien_depot` variable), both lists, an emoji, inline variables and a list variable (block)." } } },
};

function LivePreview(args: React.ComponentProps<typeof RichTextEditor>) {
  const [value, setValue] = React.useState<RichTextValue>(example);
  const issues = richTextValidate(value, { variables });
  return (
    <div className="space-y-4">
      <RichTextEditor {...args} value={value} onChange={(next) => setValue(next)} />
      <div className="grid gap-4 md:grid-cols-2">
        <section className="space-y-1">
          <h3 className="m-0 text-sm font-medium">Email preview (<code>richTextToHtml</code>, sample values)</h3>
          <div className="rounded-sm border border-grey-lighter bg-white p-4 text-sm text-black" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", color: "#292828" }}
            dangerouslySetInnerHTML={{ __html: richTextToHtml(value, sampleValues, { variables, inlineStyles: emailStyles }) }} />
        </section>
        <section className="space-y-1">
          <h3 className="m-0 text-sm font-medium">Plain text (<code>richTextToPlainText</code>)</h3>
          <pre className="m-0 whitespace-pre-wrap rounded-sm bg-grey-lighter p-3 text-xs text-black">{richTextToPlainText(value, sampleValues)}</pre>
          <p className="m-0 text-xs" role="status">Schema: {issues.length ? issues.map((i) => i.message).join(" ") : "valid ✓"}</p>
        </section>
      </div>
      <details>
        <summary className="cursor-pointer text-sm">Document JSON</summary>
        <pre className="max-h-80 overflow-auto rounded-sm bg-grey-lighter p-3 text-xs text-black">{JSON.stringify(value, null, 2)}</pre>
      </details>
    </div>
  );
}

export const Variables: Story = {
  render: (args) => <LivePreview {...args} />,
  parameters: { docs: { description: { story: "Live document, email preview and plain text, rendered by the same pure functions as the API. Insert a variable with the button or `{{`; make a link point to *Lien de dépôt* from the link input (Variable)." } } },
};

export const Subject: Story = {
  render: (args) => {
    const Demo = () => {
      const [value, setValue] = React.useState<RichTextValue>(() => richTextFromTemplateString("Relance : visuels {{marketplace}} pour {{fournisseur}}", variables));
      const stored = richTextToTemplateString(value);
      return (
        <div className="space-y-2">
          <RichTextEditor {...args} singleLine aria-label="Subject" placeholder="Subject" value={value} onChange={(next) => setValue(next)} />
          <p className="m-0 text-xs">Stored: <code>{stored}</code></p>
          <p className="m-0 text-xs">Sent: <code>{richTextRenderTemplateString(stored, sampleValues)}</code></p>
        </div>
      );
    };
    return <Demo />;
  },
  parameters: { docs: { description: { story: "`singleLine`: one line, no toolbar, text and variables only (list variables are not offered). Stored as a template string, rendered at sending time." } } },
};

export const UnknownVariable: Story = {
  args: {
    defaultValue: { type: "doc", content: [{ type: "paragraph", content: [t("Bonjour "), v("prenom", "Prénom"), t(", "), v("fournisseur", "Fournisseur")] }] },
  },
  parameters: { docs: { description: { story: "A variable missing from `variables` (here *Prénom*) keeps its chip, with a warning style and a tooltip: the API would refuse it." } } },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: example } };

export const French: Story = { args: { locale: "fr", defaultValue: example } };

export const AllBackgrounds: Story = {
  render: (args) => (
    <div className="space-y-4">
      {(["white", "grey", "black"] as const).map((bg) => (
        <Layout key={bg} bg={bg} padding={4}>
          <div className="w-full space-y-2">
            <p className={bg === "black" ? "text-sm text-white" : "text-sm text-black"}>Background: {bg}</p>
            <RichTextEditor {...args} defaultValue={example} />
          </div>
        </Layout>
      ))}
    </div>
  ),
};

function FormExample(args: React.ComponentProps<typeof RichTextEditor>) {
  const [subject, setSubject] = React.useState<RichTextValue | null>(null);
  const [body, setBody] = React.useState<RichTextValue | null>(null);
  const [empty, setEmpty] = React.useState({ subject: true, body: true });
  const [submitted, setSubmitted] = React.useState<unknown>(null);
  const invalid = empty.subject || empty.body;
  return (
    <form className="space-y-3" onSubmit={(event) => {
      event.preventDefault();
      if (invalid) return;
      setSubmitted({ subject: richTextToTemplateString(subject), body });
      setSubject(null); setBody(null); setEmpty({ subject: true, body: true });
    }}>
      <label htmlFor="reminder-subject" className="block text-sm">Subject</label>
      <RichTextEditor {...args} singleLine id="reminder-subject" aria-label="Subject" placeholder="e.g. Reminder: {{marketplace}} pictures"
        value={subject} onChange={(next, details) => { setSubject(next); setEmpty((e) => ({ ...e, subject: details.isEmpty })); }} />
      <label htmlFor="reminder-body" className="block text-sm">Message</label>
      <RichTextEditor {...args} id="reminder-body" aria-label="Message" aria-describedby="reminder-help" minHeight={200}
        value={body} onChange={(next, details) => { setBody(next); setEmpty((e) => ({ ...e, body: details.isEmpty })); }} />
      <p id="reminder-help" className="text-xs text-grey-strongest">Type {"{{"} to insert a variable, ⌘/Ctrl+K for a link.</p>
      <div className="flex justify-end"><Button type="submit" disabled={invalid}>Save template</Button></div>
      {submitted !== null && (
        <div role="status" className="space-y-2">
          <p className="text-sm">Template saved. The parent reset both fields.</p>
          <pre className="max-h-64 overflow-auto rounded-sm bg-grey-lighter p-3 text-xs text-black">{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}
    </form>
  );
}

export const InsideAForm: Story = {
  render: (args) => <FormExample {...args} />,
  parameters: { docs: { description: { story: "A reminder template: subject (`singleLine`, stored as a template string) and message (JSON document). Validation, saving and reset belong to the form." } } },
};
