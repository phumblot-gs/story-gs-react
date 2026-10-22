import { afterEach, describe, expect, it } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { ButtonMenu } from "@/components/ui/button-menu"
import { ButtonMenuSmall } from "@/components/ui/button-menu-small"
import { BgProvider } from "@/components/layout/BgContext"
import { ActionBar } from "@/components/layout/ActionBar"
import { ActionBarProvider } from "@/components/layout/ActionBarContext"

afterEach(cleanup)

/** The background contexts between an item and its menu, the menu's included. */
function contextsOf(item: HTMLElement) {
  const menu = item.closest("[data-radix-menu-content]") as HTMLElement
  const inner: string[] = []
  for (let n = item.parentElement; n && n !== menu; n = n.parentElement) if (n.dataset.bg) inner.push(n.dataset.bg)
  return { menu: menu.dataset.bg, inner }
}

describe.each([ButtonMenu, ButtonMenuSmall])("%s menuBgContext", (Menu) => {
  it("draws the menu and its actions for the forced background, on any parent", async () => {
    render(<BgProvider value="black"><Menu defaultOpen menuBgContext="grey" actions={[{ label: "Take" }]}>Actions</Menu></BgProvider>)
    const { menu, inner } = contextsOf(await screen.findByRole("menuitem", { name: "Take" }))
    expect(menu).toBe("grey")
    expect(inner.every((bg) => bg === "grey")).toBe(true)
  })

  it("wins over the ActionBar's own choice", async () => {
    render(<ActionBarProvider><ActionBar selectedCount={1} onDeselectAll={() => {}}>
      <Menu defaultOpen menuBgContext="grey" actions={[{ label: "Take" }]}>Actions</Menu>
    </ActionBar></ActionBarProvider>)
    const { menu, inner } = contextsOf(await screen.findByRole("menuitem", { name: "Take" }))
    expect(menu).toBe("grey")
    expect(inner.every((bg) => bg === "grey")).toBe(true)
  })

  it("changes nothing without it: the menu follows its parent's background", async () => {
    render(<BgProvider value="white"><Menu defaultOpen actions={[{ label: "Take" }]}>Actions</Menu></BgProvider>)
    expect(contextsOf(await screen.findByRole("menuitem", { name: "Take" })).menu).toBe("white")
  })
})
