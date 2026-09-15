import { afterEach, describe, expect, it, vi } from "vitest"
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ButtonMenu } from "@/components/ui/button-menu"
import { ButtonMenuSmall } from "@/components/ui/button-menu-small"
import { getSelectedMenuValues } from "@/lib/menu-selection"

afterEach(cleanup)

describe.each([ButtonMenu, ButtonMenuSmall])("%s submenus", Menu => {
  it("mixes ordinary actions and optional submenus, only invoking the leaf", async () => {
    const leaf = vi.fn()
    const parent = vi.fn()
    const onOpenChange = vi.fn()
    render(<Menu defaultOpen onOpenChange={onOpenChange} actions={[
      { label: "Edit", onClick: vi.fn() },
      { label: "Export", onClick: parent, children: [{ label: "JPEG", onClick: leaf }] },
      { label: "Empty", children: [] },
    ]}>Actions</Menu>)
    expect(screen.getByRole("menuitem", { name: "Edit" }).getAttribute("aria-haspopup")).toBeNull()
    expect(screen.getByRole("menuitem", { name: "Empty" }).getAttribute("aria-haspopup")).toBeNull()
    const trigger = screen.getByRole("menuitem", { name: "Export" })
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu")
    fireEvent.click(trigger)
    fireEvent.click(await screen.findByRole("menuitem", { name: "JPEG" }))
    expect(parent).not.toHaveBeenCalled()
    expect(leaf).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })

  it("does not open a disabled submenu or invoke disabled children", async () => {
    const leaf = vi.fn()
    render(<Menu defaultOpen actions={[
      { label: "Locked", disabled: true, children: [{ label: "Hidden" }] },
      { label: "Export", children: [{ label: "Disabled JPEG", disabled: true, onClick: leaf }] },
    ]}>Actions</Menu>)
    fireEvent.click(screen.getByRole("menuitem", { name: "Locked" }))
    expect(screen.queryByRole("menuitem", { name: "Hidden" })).toBeNull()
    fireEvent.click(screen.getByRole("menuitem", { name: "Export" }))
    fireEvent.click(await screen.findByRole("menuitem", { name: "Disabled JPEG" }))
    expect(leaf).not.toHaveBeenCalled()
  })

  it("opens from the keyboard, returns to its parent and closes with Escape", async () => {
    render(<Menu defaultOpen actions={[{ label: "Export", children: [{ label: "JPEG" }] }]} >Actions</Menu>)
    const trigger = screen.getByRole("menuitem", { name: "Export" })
    act(() => trigger.focus())
    fireEvent.keyDown(trigger, { key: "ArrowRight" })
    const child = await screen.findByRole("menuitem", { name: "JPEG" })
    fireEvent.keyDown(child, { key: "ArrowLeft" })
    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("false"))
    expect(document.activeElement).toBe(trigger)
    fireEvent.keyDown(trigger, { key: "Escape" })
    await waitFor(() => expect(screen.queryByRole("menuitem", { name: "Export" })).toBeNull())
  })
})

it("preserves selections from other branches and leaves the menu open in multiSelect mode", async () => {
  const onSelectionChange = vi.fn()
  render(<ButtonMenu defaultOpen multiSelect onSelectionChange={onSelectionChange} actions={[
    { label: "Existing", value: "existing", selected: true },
    { label: "Export", children: [{ label: "JPEG", value: "jpeg" }] },
    { label: "Other", children: [{ label: "PNG", value: "png", selected: true }] },
  ]}>Actions</ButtonMenu>)
  fireEvent.click(screen.getByRole("menuitem", { name: "Export" }))
  fireEvent.click(await screen.findByRole("menuitem", { name: "JPEG" }))
  expect(onSelectionChange).toHaveBeenCalledWith(["existing", "png", "jpeg"])
  expect(screen.getByRole("menuitem", { name: "JPEG" })).toBeTruthy()
})

it("collects only selected leaves, including deeper submenus", () => {
  expect(getSelectedMenuValues([
    { label: "Parent", value: "parent", selected: true, children: [
      { label: "Nested", children: [{ label: "Leaf", value: "leaf", selected: true }] },
    ] },
  ])).toEqual(["leaf"])
})
