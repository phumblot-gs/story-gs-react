import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type DataTableProps, type TableColumn } from "@/components/ui/data-table";

afterEach(cleanup);
type Row = { id: string; name: string };
const data = [{ id: "a", name: "Alpha" }, { id: "b", name: "Beta" }, { id: "c", name: "Gamma" }];
const columns: TableColumn<Row>[] = [{ id: "name", header: "Name", sortable: true, cell: row => row.name }];
const base: DataTableProps<Row> = {
  data, columns, getRowId: row => row.id, pageSize: 0, language: "EN",
  renderExpandedRow: row => <p>Detail {row.name}</p>,
};
const mainRow = (name: string) => screen.getByText(name, { exact: true }).closest("tr")!;
const expandButton = (name: string) => mainRow(name).querySelector<HTMLButtonElement>("button[aria-expanded]")!;

describe("DataTable expansion", () => {
  it("does not add columns or change row clicks without a detail renderer", () => {
    const click = vi.fn();
    render(<DataTable {...base} renderExpandedRow={undefined} onRowClick={click} />);
    expect(screen.getAllByRole("columnheader")).toHaveLength(1);
    fireEvent.click(screen.getByText("Alpha"));
    expect(click).toHaveBeenCalledWith(data[0]);
    expect(screen.queryByText("Detail Alpha")).toBeNull();
  });

  it("opens only allowed rows and renders detail across all columns", () => {
    render(<DataTable {...base} selectable getRowCanExpand={row => row.id !== "b"} />);
    expect(expandButton("Beta")).toBeNull();
    expect(mainRow("Alpha").cells[0].querySelector('[role="checkbox"]')).not.toBeNull();
    expect(mainRow("Alpha").cells[1].querySelector("button[aria-expanded]")).not.toBeNull();
    fireEvent.click(expandButton("Alpha"));
    const detail = screen.getByText("Detail Alpha");
    expect(detail.closest("td")?.colSpan).toBe(3);
    const button = expandButton("Alpha");
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById(button.getAttribute("aria-controls")!)?.contains(detail)).toBe(true);
    fireEvent.click(button);
    expect(screen.queryByText("Detail Alpha")).toBeNull();
  });

  it("supports keyboard activation on the built-in button", async () => {
    const user = userEvent.setup();
    render(<DataTable {...base} />);
    expandButton("Alpha").focus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Detail Alpha")).toBeTruthy();
    await user.keyboard(" ");
    expect(screen.queryByText("Detail Alpha")).toBeNull();
  });

  it("emits expansion requests without mutating or applying controlled state", () => {
    const ids = new Set<string>();
    const change = vi.fn(); const expand = vi.fn();
    const { rerender } = render(<DataTable {...base} expandedIds={ids} onExpandedChange={change} onRowExpand={expand} />);
    fireEvent.click(expandButton("Alpha"));
    expect(ids.size).toBe(0);
    expect(change).toHaveBeenCalledWith(new Set(["a"]));
    expect(expand).toHaveBeenCalledWith(data[0], true);
    expect(screen.queryByText("Detail Alpha")).toBeNull();
    rerender(<DataTable {...base} expandedIds={new Set(["a"])} onExpandedChange={change} onRowExpand={expand} />);
    expect(screen.getByText("Detail Alpha")).toBeTruthy();
    expect(expand).toHaveBeenCalledTimes(1);
    fireEvent.click(expandButton("Alpha"));
    expect(change).toHaveBeenLastCalledWith(new Set());
    expect(expand).toHaveBeenLastCalledWith(data[0], false);
    expect(screen.getByText("Detail Alpha")).toBeTruthy();
  });

  it("initializes uncontrolled state once and keeps multiple details open", () => {
    const initial = new Set(["a"]);
    const { rerender } = render(<DataTable {...base} defaultExpandedIds={initial} />);
    fireEvent.click(expandButton("Beta"));
    expect(screen.getByText("Detail Alpha")).toBeTruthy();
    expect(screen.getByText("Detail Beta")).toBeTruthy();
    expect(initial).toEqual(new Set(["a"]));
    rerender(<DataTable {...base} defaultExpandedIds={new Set()} />);
    expect(screen.getByText("Detail Alpha")).toBeTruthy();
  });

  it("row-click expansion replaces navigation and ignores interactive controls", () => {
    const navigate = vi.fn(); const expand = vi.fn(); const selection = vi.fn();
    const action = vi.fn();
    render(<DataTable {...base} expandOnRowClick selectable onRowClick={navigate} onRowExpand={expand}
      onSelectionChange={selection} columns={[...columns,
        { id: "action", header: "Action", interactive: true, cell: () => <button onClick={action}>Edit</button> },
        { id: "link", header: "Link", cell: () => <a href="#detail">Link</a> },
      ]} />);
    fireEvent.click(screen.getAllByText("Edit")[0]);
    fireEvent.click(screen.getAllByText("Link")[0]);
    fireEvent.click(mainRow("Alpha").querySelector('[role="checkbox"]')!);
    expect(action).toHaveBeenCalledTimes(1);
    expect(selection).toHaveBeenCalledWith(new Set(["a"]));
    expect(expand).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Alpha"));
    expect(expand).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("custom cell buttons toggle once, independently of row navigation", () => {
    const navigate = vi.fn(); const expand = vi.fn();
    const custom: TableColumn<Row>[] = [...columns, {
      id: "toggle", header: "Details", interactive: true,
      cell: (_row, ctx) => <button onClick={ctx.toggleExpanded} aria-expanded={ctx.isExpanded}>Toggle</button>,
    }];
    const { rerender } = render(<DataTable {...base} columns={custom} showExpandButton={false}
      onRowClick={navigate} onRowExpand={expand} />);
    fireEvent.click(screen.getAllByText("Toggle")[0]);
    expect(screen.getByText("Detail Alpha")).toBeTruthy();
    expect(navigate).not.toHaveBeenCalled();
    expect(screen.getByText("Detail Alpha").closest("td")?.colSpan).toBe(2);
    fireEvent.click(screen.getByText("Alpha"));
    expect(navigate).toHaveBeenCalledTimes(1);
    rerender(<DataTable {...base} columns={custom} showExpandButton={false} expandOnRowClick onRowExpand={expand} />);
    fireEvent.click(screen.getAllByText("Toggle")[0]);
    expect(expand).toHaveBeenCalledTimes(2);
    expect(screen.queryByText("Detail Alpha")).toBeNull();
  });

  it("preserves expansion by ID through sorting, pagination and filtering", () => {
    const { rerender } = render(<DataTable {...base} pageSize={1} currentPage={1} defaultExpandedIds={new Set(["a"])} />);
    expect(screen.getByText("Detail Alpha")).toBeTruthy();
    rerender(<DataTable {...base} pageSize={1} currentPage={2} />);
    expect(screen.queryByText("Detail Alpha")).toBeNull();
    expect(screen.getByText("Beta")).toBeTruthy();
    rerender(<DataTable {...base} sort={{ columnId: "name", direction: "desc" }} />);
    expect(screen.getAllByRole("row")[1].textContent).toContain("Gamma");
    expect(mainRow("Alpha").nextElementSibling?.textContent).toBe("Detail Alpha");
    rerender(<DataTable {...base} data={data.slice(1)} />);
    expect(screen.queryByText("Detail Alpha")).toBeNull();
    rerender(<DataTable {...base} />);
    expect(screen.getByText("Detail Alpha")).toBeTruthy();
  });

  it("does not render disabled details even if their IDs are controlled as open", () => {
    render(<DataTable {...base} expandedIds={new Set(["a"])} getRowCanExpand={() => false} expandOnRowClick />);
    fireEvent.click(screen.getByText("Alpha"));
    expect(screen.queryByText("Detail Alpha")).toBeNull();
    expect(mainRow("Alpha").querySelector("button")).toBeNull();
  });

  it("range selection includes only main rows even with expanded details between them", () => {
    const selection = vi.fn();
    render(<DataTable {...base} selectable onSelectionChange={selection}
      defaultExpandedIds={new Set(["a", "b"])} />);
    const first = mainRow("Alpha").querySelector('[role="checkbox"]')!;
    const last = mainRow("Gamma").querySelector('[role="checkbox"]')!;
    fireEvent.mouseDown(first);
    fireEvent.click(first);
    fireEvent.mouseDown(last, { shiftKey: true });
    fireEvent.click(last, { shiftKey: true });
    expect(selection).toHaveBeenLastCalledWith(new Set(["a", "b", "c"]));
    expect(screen.getByText("Detail Alpha")).toBeTruthy();
    expect(screen.getByText("Detail Beta")).toBeTruthy();
  });

  it("unmounts detail state on collapse and keeps separate table DOM ids unique", () => {
    const cleanupDetail = vi.fn();
    function Detail() {
      React.useEffect(() => cleanupDetail, []);
      return <p>Mounted detail</p>;
    }
    const { container } = render(<>
      <DataTable {...base} data={[data[0]]} defaultExpandedIds={new Set(["a"])} renderExpandedRow={() => <Detail />} />
      <DataTable {...base} data={[data[0]]} defaultExpandedIds={new Set(["a"])} />
    </>);
    const controls = Array.from(container.querySelectorAll("button[aria-controls]"));
    expect(new Set(controls.map(button => button.getAttribute("aria-controls"))).size).toBe(2);
    fireEvent.click(controls[0]);
    expect(cleanupDetail).toHaveBeenCalledTimes(1);
  });
});
