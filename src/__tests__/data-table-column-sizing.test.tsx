import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { DataTable, type DataTableProps, type TableColumn } from "@/components/ui/data-table";

afterEach(cleanup);
type Row = { id: string; name: string; city: string };
const data: Row[] = [{ id: "a", name: "Alpha", city: "Paris" }, { id: "b", name: "Beta", city: "Lyon" }];
const columns: TableColumn<Row>[] = [
  { id: "name", header: "Name", sortable: true, cell: (row) => row.name },
  { id: "city", header: "City", cell: (row) => row.city },
];
const base: DataTableProps<Row> = { data, columns, getRowId: (row) => row.id, pageSize: 0, language: "EN" };
const sized = columns.map((col, i) => ({ ...col, width: [200, 120][i] }));
const table = () => document.querySelector("table")!;
const colWidths = () => [...document.querySelectorAll("col")].map((col) => (col as HTMLElement).style.width);
const handle = (name: string) => screen.getByRole("separator", { name: `Resize column ${name}` });
/** jsdom has no PointerEvent: a MouseEvent of the pointer type carries clientX and button. */
const pointer = (target: EventTarget, type: string, clientX: number) =>
  act(() => { target.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX, button: 0 })); });

describe("DataTable column sizing", () => {
  it("renders as before without sizing props: automatic layout, no handles", () => {
    render(<DataTable {...base} />);
    expect(document.querySelector("colgroup")).toBeNull();
    expect(table().style.tableLayout).toBe("");
    expect(screen.queryAllByRole("separator")).toHaveLength(0);
  });

  it("uses a fixed layout with exact widths when every column has one", () => {
    render(<DataTable {...base} columns={sized} selectable />);
    expect(table().style.tableLayout).toBe("fixed");
    expect(table().style.width).toBe("376px"); // 56 (selection) + 200 + 120
    expect(colWidths()).toEqual(["56px", "200px", "120px"]);
  });

  it("keeps the automatic layout while some columns have no width", () => {
    render(<DataTable {...base} columns={[sized[0]!, columns[1]!]} />);
    expect(table().style.tableLayout).toBe("");
    expect(colWidths()).toEqual(["200px", ""]);
  });

  it("adds a handle between columns only: none on the table's right edge", () => {
    render(<DataTable {...base} columns={sized} resizableColumns />);
    expect(screen.getAllByRole("separator")).toHaveLength(1);
    expect(handle("Name").getAttribute("aria-valuenow")).toBe("200");
    expect(screen.queryByRole("separator", { name: "Resize column City" })).toBeNull();
  });

  it("lets column.resizable override the table setting", () => {
    const third: TableColumn<Row> = { id: "id", header: "Id", width: 60, cell: (row) => row.id };
    render(<DataTable {...base} columns={[{ ...sized[0]!, resizable: false }, sized[1]!, third]} resizableColumns />);
    expect(screen.getAllByRole("separator")).toHaveLength(1);
    expect(handle("City")).toBeTruthy();
  });

  it("resizes with the keyboard, Shift for larger steps, within minWidth", () => {
    const change = vi.fn();
    render(<DataTable {...base} columns={[{ ...sized[0]!, minWidth: 180 }, sized[1]!]} resizableColumns onColumnWidthsChange={change} />);
    fireEvent.keyDown(handle("Name"), { key: "ArrowRight" });
    expect(change).toHaveBeenLastCalledWith({ name: 210, city: 120 });
    fireEvent.keyDown(handle("Name"), { key: "ArrowLeft", shiftKey: true });
    expect(change).toHaveBeenLastCalledWith({ name: 180, city: 120 });
    expect(colWidths()).toEqual(["180px", "120px"]);
  });

  it("follows the pointer while dragging and stops on release, without sorting", () => {
    const change = vi.fn();
    const sort = vi.fn();
    render(<DataTable {...base} columns={sized} resizableColumns onColumnWidthsChange={change} onSortChange={sort} />);
    pointer(handle("Name"), "pointerdown", 100);
    pointer(window, "pointermove", 160);
    expect(change).toHaveBeenLastCalledWith({ name: 260, city: 120 });
    pointer(window, "pointermove", 130);
    expect(colWidths()).toEqual(["230px", "120px"]);
    pointer(window, "pointerup", 130);
    pointer(window, "pointermove", 400);
    expect(colWidths()).toEqual(["230px", "120px"]);
    fireEvent.click(handle("Name"));
    expect(sort).not.toHaveBeenCalled();
  });

  it("resets a column to its declared width on double-click", () => {
    render(<DataTable {...base} columns={sized} resizableColumns defaultColumnWidths={{ name: 300 }} />);
    expect(colWidths()).toEqual(["300px", "120px"]);
    fireEvent.doubleClick(handle("Name"));
    expect(colWidths()).toEqual(["200px", "120px"]);
  });

  it("in controlled mode, only requests widths and renders the props", () => {
    const change = vi.fn();
    const widths = { name: 150, city: 90 };
    const { rerender } = render(<DataTable {...base} columns={sized} resizableColumns columnWidths={widths} onColumnWidthsChange={change} />);
    fireEvent.keyDown(handle("Name"), { key: "ArrowRight" });
    expect(change).toHaveBeenLastCalledWith({ name: 160, city: 90 });
    expect(widths).toEqual({ name: 150, city: 90 });
    expect(colWidths()).toEqual(["150px", "90px"]);
    rerender(<DataTable {...base} columns={sized} resizableColumns columnWidths={{ name: 160, city: 90 }} onColumnWidthsChange={change} />);
    expect(colWidths()).toEqual(["160px", "90px"]);
  });

  it("freezes auto-sized columns at their rendered width on the first resize", () => {
    const change = vi.fn();
    render(<DataTable {...base} resizableColumns onColumnWidthsChange={change} />);
    fireEvent.keyDown(handle("Name"), { key: "ArrowRight" });
    // jsdom renders every cell 0 px wide: the frozen widths are clamped to the 48 px minimum
    expect(change).toHaveBeenLastCalledWith({ name: 58, city: 48 });
    expect(table().style.tableLayout).toBe("fixed");
  });
});

describe("DataTable surfaces and narrow headers", () => {
  it("hovers rows with grey-lighter on a grey parent, grey-light elsewhere", async () => {
    const { BgProvider } = await import("@/components/layout/BgContext");
    const { container, unmount } = render(<BgProvider value="grey"><DataTable {...base} /></BgProvider>);
    expect(container.querySelector("tbody tr")!.className).toContain("hover:bg-grey-lighter");
    unmount();
    render(<DataTable {...base} />);
    expect(document.querySelector("tbody tr")!.className).toContain("hover:bg-grey-light");
    expect(document.querySelector("tbody tr")!.className).not.toContain("hover:bg-grey-lighter");
  });

  it("keeps the sort indicator and the alignment of a narrowed header; the full header is in the title", () => {
    render(<DataTable {...base} columns={[{ ...sized[0]!, width: 48, align: "center" }, sized[1]!]} />);
    const button = screen.getByRole("button", { name: /Name/ });
    expect(button.className).toContain("max-w-full");
    expect(button.className).toContain("mx-auto");
    expect(button.getAttribute("title")).toBe("Name");
    expect(button.querySelector("span")!.className).toContain("text-ellipsis");
    expect(button.querySelector("svg, [class*='shrink-0']")).not.toBeNull();
    // a narrow column keeps 8 px side padding instead of 16, the others keep theirs
    const [narrow, wide] = screen.getAllByRole("columnheader");
    expect(narrow!.className).toContain("px-2");
    expect(wide!.className).not.toMatch(/\bpx-2\b/);
  });
});
