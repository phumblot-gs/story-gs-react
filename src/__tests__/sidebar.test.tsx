import { createRef, type MouseEvent } from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import {
  Sidebar, SidebarBrand, SidebarFooter, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSubButton, SidebarProvider, SidebarTrigger, SidebarUserMenu,
} from "@/components/ui/sidebar"
import PageHeader from "@/components/PageHeader"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { IconProvider } from "@/components/ui/icon-provider"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { StyleProvider } from "@/contexts/StyleProvider"
import { TranslationProvider } from "@/contexts/TranslationContext"

beforeEach(() => {
  localStorage.clear()
  Object.defineProperty(window, "innerWidth", { value: 1200, configurable: true })
})
afterEach(() => { cleanup(); document.documentElement.removeAttribute("style") })

function Navigation() {
  return <SidebarProvider><Sidebar><SidebarBrand /><SidebarMenu><SidebarMenuItem>
    <SidebarMenuButton isActive tooltip="Media"><IconProvider icon="File" /><span>Media</span></SidebarMenuButton>
  </SidebarMenuItem></SidebarMenu></Sidebar><SidebarTrigger /></SidebarProvider>
}

describe("Sidebar", () => {
  it("opens navigation from PageHeader before the logo and preserves right actions", () => {
    render(<SidebarProvider defaultOpen={false}>
      <Sidebar />
      <PageHeader title="Media" showTitleButton={false} logo={<span data-testid="brand">Brand</span>}
        leftContent={<SidebarTrigger />} rightContent={<button>Account</button>} />
    </SidebarProvider>)
    const header = screen.getByRole("banner")
    const trigger = header.querySelector('[data-sidebar="trigger"]')!
    expect(trigger.compareDocumentPosition(screen.getByTestId("brand")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(header.contains(screen.getByRole("button", { name: "Account" }))).toBe(true)
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    fireEvent.click(trigger)
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
  })

  it("supports desktop collapse, shortcut and does not intercept typing", () => {
    const { container } = render(<><Navigation /><input aria-label="Editor" /></>)
    const trigger = screen.getByRole("button", { name: /navigation/i })
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    expect(container.querySelector('[data-sidebar="sidebar"]')?.getAttribute("data-bg")).toBe("black")
    expect(screen.getByRole("button", { name: "Media" }).getAttribute("aria-current")).toBe("page")
    fireEvent.click(trigger)
    expect(trigger.getAttribute("aria-expanded")).toBe("false")
    fireEvent.keyDown(window, { key: "b", ctrlKey: true })
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "b", ctrlKey: true })
    expect(trigger.getAttribute("aria-expanded")).toBe("true")
    expect(trigger.querySelector("svg")).toBeTruthy()
  })

  it("keeps uncontrolled state when an onOpenChange observer is provided", () => {
    const change = vi.fn()
    render(<SidebarProvider onOpenChange={change}><SidebarTrigger /></SidebarProvider>)
    fireEvent.click(screen.getByRole("button"))
    expect(change).toHaveBeenCalledWith(false)
    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false")
  })

  it("preserves asChild links, refs, callbacks and background context", () => {
    const ref = createRef<HTMLButtonElement>()
    const subRef = createRef<HTMLAnchorElement>()
    const click = vi.fn((event: MouseEvent) => event.preventDefault())
    render(<SidebarProvider><Sidebar collapsible="none" bg="grey">
      <SidebarMenuButton asChild ref={ref} isActive onClick={click}>
        <a href="/media"><IconProvider icon="File" /><span>Media link</span></a>
      </SidebarMenuButton>
      <SidebarMenuSubButton ref={subRef} href="/published">Published link</SidebarMenuSubButton>
    </Sidebar></SidebarProvider>)
    const link = screen.getByRole("link", { name: "Media link" })
    expect(ref.current).toBe(link)
    expect(link.getAttribute("href")).toBe("/media")
    expect(link.getAttribute("aria-current")).toBe("page")
    expect(link.getAttribute("data-bg")).toBe("grey")
    expect(link.closest("button")).toBeNull()
    fireEvent.click(link)
    expect(click).toHaveBeenCalledTimes(1)
    expect(subRef.current).toBe(screen.getByRole("link", { name: "Published link" }))
  })

  it("honors controlled state and cancellable trigger clicks", () => {
    const change = vi.fn()
    const { rerender } = render(<SidebarProvider open onOpenChange={change}><SidebarTrigger /></SidebarProvider>)
    fireEvent.click(screen.getByRole("button"))
    expect(change).toHaveBeenCalledWith(false)
    expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true")
    rerender(<SidebarProvider open={false} onOpenChange={change}><SidebarTrigger onClick={e => e.preventDefault()} /></SidebarProvider>)
    change.mockClear()
    fireEvent.click(screen.getByRole("button"))
    expect(change).not.toHaveBeenCalled()
  })

  it("inherits theme logo, background variables, font and translated labels together", () => {
    const { container } = render(
      <StyleProvider config={{ customFontFamily: "Georgia", cssVariables: { "--button-b-ghost-bg-pressed": "purple" } }}>
        <ThemeProvider initialCustomization={{ assets: { logo: "/studio.svg" }, text: { brandName: "Studio" }, colors: { bgBlack: "#123456" } }}>
          <TranslationProvider defaultLanguage="EN" customTranslations={{ "sidebar.toggle": { EN: "Show studio navigation" } }}>
            <Navigation />
          </TranslationProvider>
        </ThemeProvider>
      </StyleProvider>)
    expect(screen.getByRole("img").getAttribute("src")).toBe("/studio.svg")
    expect(container.querySelector('.gs-sidebar-logo')?.getAttribute('data-inverted')).toBe("true")
    expect(screen.getByText("Studio")).toBeTruthy()
    expect(screen.getByRole("button", { name: "Show studio navigation" })).toBeTruthy()
    expect(document.documentElement.style.getPropertyValue("--gs-font-sans")).toBe("Georgia")
    expect(document.documentElement.style.getPropertyValue("--bg-black")).toBe("18 52 86")
    expect(document.documentElement.style.getPropertyValue("--button-b-ghost-bg-pressed")).toBe("purple")
  })

  it.each(["black", "white", "grey"] as const)("propagates %s to nested and portaled controls", async bg => {
    const action = vi.fn()
    const { container } = render(<TranslationProvider defaultLanguage="EN"><SidebarProvider><Sidebar bg={bg}>
      <SidebarBrand invertLogo={false} />
      <SidebarFooter><SidebarUserMenu name="Pierre Laurent" defaultOpen
        avatar={<Avatar><AvatarFallback>PL</AvatarFallback></Avatar>}
        actions={[{ label: "Switch account" }, { separator: true }, { label: "Log out", onClick: action }]} />
      </SidebarFooter>
    </Sidebar></SidebarProvider></TranslationProvider>)
    const menu = await screen.findByRole("menu")
    expect(menu.getAttribute("data-bg")).toBe(bg)
    expect(menu.getAttribute("data-side")).toBe("right")
    expect(container.querySelector('[data-sidebar="sidebar"]')?.getAttribute("data-bg")).toBe(bg)
    expect(container.querySelector('.gs-sidebar-logo')?.getAttribute('data-inverted')).toBe("false")
    expect(screen.getByText("PL")).toBeTruthy()
    fireEvent.click(screen.getByRole("menuitem", { name: "Log out" }))
    expect(action).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    expect(screen.getByRole("button", { name: "User menu for Pierre Laurent" })).toBeTruthy()
  })

  it("opens an accessible translated mobile sheet and closes with its control", async () => {
    Object.defineProperty(window, "innerWidth", { value: 390, configurable: true })
    render(<TranslationProvider defaultLanguage="EN" customTranslations={{ "sidebar.title": { EN: "Studio navigation" } }}><Navigation /></TranslationProvider>)
    fireEvent.click(screen.getByRole("button", { name: "Toggle navigation" }))
    const dialog = await screen.findByRole("dialog", { name: "Studio navigation" })
    expect(dialog.getAttribute("data-bg")).toBe("black")
    fireEvent.click(dialog.querySelector('[data-sidebar="trigger"]')!)
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
