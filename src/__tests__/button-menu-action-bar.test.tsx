import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { ButtonMenu } from "@/components/ui/button-menu"
import { ActionBar } from "@/components/layout/ActionBar"
import { ActionBarProvider } from "@/components/layout/ActionBarContext"

afterEach(cleanup)

describe("ButtonMenu in an ActionBar", () => {
  it("renders its menu as on the bar's black background, the menu and its actions in one context", async () => {
    render(<ActionBarProvider><ActionBar selectedCount={1} onDeselectAll={() => {}}>
      <ButtonMenu defaultOpen actions={[{ label: "Take" }]}>Actions</ButtonMenu>
    </ActionBar></ActionBarProvider>)
    const item = await screen.findByRole("menuitem", { name: "Take" })
    const menu = item.closest("[data-radix-menu-content]") as HTMLElement
    expect(menu.dataset.bg).toBe("black")
    expect(menu.className).toContain("bg-white") // the light menu of a black background
    const contexts: string[] = []
    for (let n = item.parentElement; n && n !== menu; n = n.parentElement) if (n.dataset.bg) contexts.push(n.dataset.bg)
    expect(contexts.every((bg) => bg === "black")).toBe(true)
  })
})
