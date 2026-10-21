import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommentComposer, type CommentComposerValue, type CommentMention } from "./comment-composer";
import { Button } from "./button";
import { Input } from "./input";
import { Layout } from "@/components/layout";

const people: CommentMention[] = [
  { id: "alba-1", label: "Alba Martin", description: "Art director" },
  { id: "bruno-2", label: "Bruno Keller", description: "Photographer" },
  { id: "chloe-3", label: "Chloé Bernard", description: "Retoucher" },
  { id: "daniel-4", label: "Daniel Wilson", description: "Project manager" },
];
const example: CommentComposerValue = { type: "doc", content: [{ type: "paragraph", content: [
  { type: "mention", attrs: { id: "alba-1", label: "Alba Martin" } },
  { type: "text", text: " please review the " },
  { type: "text", text: "shadows", marks: [{ type: "bold" }] },
  { type: "text", text: " before " },
  { type: "text", text: "approval", marks: [{ type: "italic" }] },
  { type: "text", text: ". Thank you! 🙌" },
] }] };

const meta = {
  title: "UI/CommentComposer",
  component: CommentComposer,
  tags: ["autodocs"],
  args: { mentions: people, locale: "en" },
  decorators: [Story => <div className="w-full max-w-[640px]"><Story /></div>],
  parameters: {
    docs: { description: { component: "Compose comments with inline @mentions, Unicode emojis, bold and italic. The field emits a Tiptap JSON document plus plain text, unique mentioned user IDs and empty state. It owns no submit button, network persistence or notifications. Use value/onChange for controlled forms; pass null to reset. Enter inserts a new paragraph; Cmd/Ctrl+Enter only calls onSubmitShortcut when provided. The aria-label prop names the editable field; aria-describedby and aria-invalid support parent-owned validation." } },
  },
} satisfies Meta<typeof CommentComposer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { docs: { description: { story: "As a reviewer, I want to write a comment and format it without leaving the field. Select text and use Bold or Italic, or type **bold** and *italic* followed by a space." } } },
};
export const WithExistingComment: Story = {
  args: { defaultValue: example },
  parameters: { docs: { description: { story: "As a reviewer, I want to edit an existing comment while preserving its formatting and mention identities." } } },
};
export const MentionAutocomplete: Story = {
  parameters: { docs: { description: { story: "As a reviewer, I want to type @ or use the mention button to find teammates by name. Try @chloe for accent-insensitive matching, use Up/Down to navigate, Enter to select, and Escape to dismiss. Unknown names show an empty state." } } },
};
export const AsyncMentions: Story = {
  args: { mentions: async query => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return people.filter(person => person.label.toLowerCase().includes(query.toLowerCase()));
  } },
  parameters: { docs: { description: { story: "As an application developer, I want to provide an asynchronous people search without coupling the composer to an API. Type @ and then a name to simulate a remote directory." } } },
};
export const MentionSearchError: Story = {
  args: { mentions: async () => { throw new Error("Directory unavailable"); } },
  parameters: { docs: { description: { story: "As a reviewer, I want a clear message when the people directory is unavailable, while keeping my draft. Type @ to display the error state." } } },
};
export const Emojis: Story = {
  parameters: { docs: { description: { story: "As a reviewer, I want to search for an emoji and insert it at my cursor. Open the smile button. The picker and its data load on demand; the value stores standard Unicode emojis." } } },
};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: example },
  parameters: { docs: { description: { story: "As a reviewer, I want to see my draft while editing and all toolbar controls are disabled during a parent-owned operation." } } },
};
export const French: Story = { args: { locale: "fr" } };
export const AllBackgrounds: Story = {
  render: args => <div className="space-y-4">{(["white", "grey", "black"] as const).map(bg => <Layout key={bg} bg={bg} padding={4}><div className="w-full space-y-2"><p className={bg === "black" ? "text-sm text-white" : "text-sm text-black"}>Background: {bg}</p><CommentComposer {...args} defaultValue={example} /></div></Layout>)}</div>,
};

function FormExample(args: React.ComponentProps<typeof CommentComposer>) {
  const [value, setValue] = React.useState<CommentComposerValue | null>(null);
  const [title, setTitle] = React.useState("");
  const [empty, setEmpty] = React.useState(true);
  const [submitted, setSubmitted] = React.useState<unknown>(null);
  const form = React.useRef<HTMLFormElement>(null);
  return <form ref={form} className="space-y-3" onSubmit={event => {
    event.preventDefault();
    if (empty || !title.trim()) return;
    setSubmitted({ title, comment: value }); setValue(null); setEmpty(true); setTitle("");
  }}>
    <label htmlFor="review-title" className="block text-sm">Review title</label>
    <Input id="review-title" required value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Lighting review" />
    <label htmlFor="review-comment" className="block text-sm">Comment</label>
    <CommentComposer {...args} id="review-comment" aria-label="Review comment" aria-describedby="review-help" value={value} onChange={(next, details) => { setValue(next); setEmpty(details.isEmpty); }} onSubmitShortcut={() => form.current?.requestSubmit()} />
    <p id="review-help" className="text-xs text-grey-strongest">Mention a teammate with @. Press Cmd/Ctrl+Enter to submit the form.</p>
    <div className="flex justify-end"><Button type="submit" disabled={empty || !title.trim()}>Publish review</Button></div>
    {submitted !== null && <div role="status" className="space-y-2"><p className="text-sm">Review submitted. The parent reset the composer.</p><pre className="max-h-64 overflow-auto rounded-sm bg-grey-lighter p-3 text-xs text-black">{JSON.stringify(submitted, null, 2)}</pre></div>}
  </form>;
}
export const InsideAForm: Story = {
  render: args => <FormExample {...args} />,
  parameters: { docs: { description: { story: "As an application developer, I want to combine the composer with other fields and own validation, submission and reset. The Publish review button belongs to this form, not to CommentComposer." } } },
};
