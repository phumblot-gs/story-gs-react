import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Editor } from "@tiptap/react";
import { CommentComposer } from "@/components/ui/comment-composer";

// Only the heavyweight, lazy-loaded picker is replaced. All editor behavior is real.
vi.mock("@/components/ui/comment-emoji-picker", () => ({ default: ({ onSelect }: { onSelect: (text: string) => void }) => <button onClick={() => onSelect("🙌")}>Choose emoji</button> }));
afterEach(cleanup);
async function getEditor() {
  const field = await screen.findByRole("textbox");
  return { field, editor: (field as HTMLElement & { editor: Editor }).editor };
}
const people = [{ id: "a", label: "Alba Martin" }, { id: "c", label: "Chloé Bernard" }];

describe("CommentComposer", () => {
  it("keeps submission in the parent and reports structured content and unique mention IDs", async () => {
    const onChange = vi.fn();
    render(<CommentComposer onChange={onChange} />);
    const { editor } = await getEditor();
    expect(screen.queryByText("Publish")).toBeNull();
    act(() => { editor.commands.insertContent([
      { type: "mention", attrs: { id: "a", label: "Alba Martin" } },
      { type: "text", text: " hello ", marks: [{ type: "bold" }] },
      { type: "mention", attrs: { id: "a", label: "Alba Martin" } },
    ]); });
    const [value, details] = onChange.mock.calls.at(-1)!;
    expect(value.type).toBe("doc");
    expect(value.content[0].content[1].marks).toEqual([{ type: "bold" }]);
    expect(details).toEqual({ text: "@Alba Martin hello @Alba Martin", mentionedIds: ["a"], isEmpty: false });
  });

  it("resets a controlled value without emitting a change", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<CommentComposer value={{ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Draft" }] }] }} onChange={onChange} />);
    const { field } = await getEditor();
    expect(field.textContent).toBe("Draft");
    rerender(<CommentComposer value={null} onChange={onChange} />);
    await waitFor(() => expect(field.textContent).toBe(""));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("filters names without accents, selects with Enter and preserves the user ID", async () => {
    const onChange = vi.fn();
    render(<CommentComposer mentions={people} onChange={onChange} />);
    const { editor, field } = await getEditor();
    act(() => { editor.commands.insertContent("@chloe"); });
    await screen.findByRole("option", { name: "Chloé Bernard" });
    expect(screen.queryByRole("option", { name: "Alba Martin" })).toBeNull();
    const range = document.createRange();
    range.selectNodeContents(field);
    window.getSelection()?.addRange(range);
    fireEvent.keyDown(field, { key: "Enter" });
    await waitFor(() => expect(field.textContent).toContain("@Chloé Bernard"));
    expect(onChange.mock.calls.at(-1)![1].mentionedIds).toEqual(["c"]);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("renders the suggestions inside the dialog that holds it, where a click selects a person", async () => {
    // a modal dialog (SidePanel, Sheet, Dialog) blocks the pointer outside itself: the list must not be rendered at the end of the page
    const onChange = vi.fn();
    render(<div role="dialog"><CommentComposer mentions={people} onChange={onChange} /></div>);
    const { editor, field } = await getEditor();
    act(() => { editor.commands.insertContent("@chl"); });
    const option = await screen.findByRole("option", { name: "Chloé Bernard" });
    expect(option.closest('[role="dialog"]')).toBe(field.closest('[role="dialog"]'));
    fireEvent.mouseDown(option);
    fireEvent.click(option);
    await waitFor(() => expect(field.textContent).toContain("@Chloé Bernard"));
    expect(onChange.mock.calls.at(-1)![1].mentionedIds).toEqual(["c"]);
  });

  it("navigates suggestions with arrows and dismisses with Escape", async () => {
    render(<CommentComposer mentions={people} />);
    const { editor, field } = await getEditor();
    act(() => { editor.commands.insertContent("@"); });
    await screen.findByRole("option", { name: "Alba Martin" });
    fireEvent.keyDown(field, { key: "ArrowDown" });
    expect(screen.getByRole("option", { name: "Chloé Bernard" }).getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(field, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(field.textContent).toBe("@");
  });

  it("handles directory failures and empty results", async () => {
    render(<CommentComposer mentions={async () => { throw new Error("Offline"); }} />);
    const { editor } = await getEditor();
    act(() => { editor.commands.insertContent("@"); });
    await screen.findByText("Could not load people");
    expect(editor.getText()).toBe("@");
  });

  it("ignores stale asynchronous search results", async () => {
    let first: (items: typeof people) => void = () => {};
    const search = vi.fn((query: string) => query === "a" ? new Promise<typeof people>(resolve => { first = resolve; }) : Promise.resolve([people[1]]));
    render(<CommentComposer mentions={search} />);
    const { editor } = await getEditor();
    act(() => { editor.commands.insertContent("@a"); });
    await waitFor(() => expect(search).toHaveBeenCalledWith("a"));
    act(() => { editor.commands.insertContent("b"); });
    await screen.findByRole("option", { name: "Chloé Bernard" });
    await act(async () => { first([people[0]]); });
    expect(screen.queryByRole("option", { name: "Alba Martin" })).toBeNull();
    expect(screen.getByRole("option", { name: "Chloé Bernard" })).toBeTruthy();
  });

  it("toggles formatting through toolbar buttons", async () => {
    render(<CommentComposer />);
    const { editor } = await getEditor();
    act(() => { editor.commands.insertContent("Review"); editor.commands.selectAll(); });
    fireEvent.click(screen.getByRole("button", { name: "Bold" }));
    fireEvent.click(screen.getByRole("button", { name: "Italic" }));
    expect(editor.getJSON().content![0].content![0].marks).toEqual([{ type: "bold" }, { type: "italic" }]);
    expect(screen.getByRole("button", { name: "Bold" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("inserts an emoji at the saved selection", async () => {
    render(<CommentComposer />);
    const { editor, field } = await getEditor();
    act(() => { editor.commands.insertContent("Hello world"); editor.commands.setTextSelection(7); });
    fireEvent.click(screen.getByRole("button", { name: "Insert emoji" }));
    fireEvent.click(await screen.findByText("Choose emoji"));
    await waitFor(() => expect(field.textContent).toBe("Hello 🙌world"));
  });

  it("signals the parent shortcut, keeps Enter as a newline and ignores IME composition", async () => {
    const onSubmitShortcut = vi.fn();
    render(<CommentComposer onSubmitShortcut={onSubmitShortcut} />);
    const { field, editor } = await getEditor();
    fireEvent.keyDown(field, { key: "Enter", ctrlKey: true });
    expect(onSubmitShortcut).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(field, { key: "Enter", ctrlKey: true, isComposing: true });
    expect(onSubmitShortcut).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(field, { key: "Enter" });
    expect(editor.getJSON().content).toHaveLength(2);
    expect(onSubmitShortcut).toHaveBeenCalledTimes(1);
  });

  it("disables the editable field and every toolbar control", async () => {
    const onSubmitShortcut = vi.fn();
    render(<CommentComposer disabled onSubmitShortcut={onSubmitShortcut} />);
    const { field } = await getEditor();
    expect(field.getAttribute("contenteditable")).toBe("false");
    screen.getAllByRole("button").forEach(button => expect((button as HTMLButtonElement).disabled).toBe(true));
    fireEvent.keyDown(field, { key: "Enter", ctrlKey: true });
    expect(onSubmitShortcut).not.toHaveBeenCalled();
  });
});
