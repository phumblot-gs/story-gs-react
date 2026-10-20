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

  it("adds a handle per resizable column; column.resizable overrides the table setting", () => {
    render(<DataTable {...base} columns={[sized[0]!, { ...sized[1]!, resizable: false }]} resizableColumns />);
    expect(screen.getAllByRole("separator")).toHaveLength(1);
    expect(handle("Name").getAttribute("aria-valuenow")).toBe("200");
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
    fireEvent.keyDown(handle("City"), { key: "ArrowRight" });
    expect(change).toHaveBeenLastCalledWith({ name: 150, city: 100 });
    expect(widths).toEqual({ name: 150, city: 90 });
    expect(colWidths()).toEqual(["150px", "90px"]);
    rerender(<DataTable {...base} columns={sized} resizableColumns columnWidths={{ name: 150, city: 100 }} onColumnWidthsChange={change} />);
    expect(colWidths()).toEqual(["150px", "100px"]);
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
