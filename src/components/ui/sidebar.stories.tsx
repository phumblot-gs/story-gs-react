import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
  SidebarProvider, SidebarTrigger, SidebarUserMenu, useSidebar, type SidebarProps,
} from "./sidebar"
import { IconProvider } from "./icon-provider"
import { Avatar, AvatarFallback } from "./avatar"
import { Button } from "./button"
import { Layout, HStack, VStack } from "@/components/layout"
import { SidePanel } from "@/components/layout/SidePanel"
import PageHeader from "@/components/PageHeader"
import { Text } from "./text"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { StyleProvider } from "@/contexts/StyleProvider"
import { TranslationProvider, useTranslationSafe } from "@/contexts/TranslationContext"
import type { TranslationMap } from "@/utils/translations"

const translations: TranslationMap = {
  "demo.workspace": { FR: "Espace de travail", EN: "Workspace" },
  "demo.productions": { FR: "Productions", EN: "Productions" },
  "demo.media": { FR: "Médiathèque", EN: "Media library" },
  "demo.all": { FR: "Tous les médias", EN: "All media" },
  "demo.published": { FR: "Publiés", EN: "Published" },
  "demo.team": { FR: "Équipe", EN: "Team" },
  "demo.account": { FR: "Changer de compte", EN: "Switch account" },
  "demo.logout": { FR: "Se déconnecter", EN: "Log out" },
}

function NavigationHeader({ collapsible }: Pick<SidebarProps, "collapsible">) {
  const { isMobile, state } = useSidebar()
  const { t } = useTranslationSafe()
  // The mobile sheet already supplies its own close control.
  if (isMobile || collapsible === "none") return null
  return <SidebarHeader className={state === "expanded" ? "items-end" : "items-center"}>
    <SidebarTrigger aria-label={t(state === "expanded" ? "button.close" : "sidebar.toggle")}>
      <IconProvider icon={state === "expanded" ? "X" : "Menu"} size={12} />
    </SidebarTrigger>
  </SidebarHeader>
}

function NavigationPageHeader({ title, collapsible }: Pick<SidebarProps, "collapsible"> & { title: string }) {
  const { isMobile } = useSidebar()
  return <PageHeader title={title} showTitleButton={false}
    leftContent={isMobile && collapsible !== "none" ? <SidebarTrigger /> : undefined} />
}

function Example({ reference = false, ...args }: SidebarProps & { reference?: boolean }) {
  const { t } = useTranslationSafe()
  const [page, setPage] = React.useState("demo.all")
  const [mediaOpen, setMediaOpen] = React.useState(true)
  const [action, setAction] = React.useState("")
  const [panelOpen, setPanelOpen] = React.useState(false)
  return <SidebarProvider>
    <Sidebar {...args}>
      <NavigationHeader collapsible={args.collapsible} />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("demo.workspace")}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem><SidebarMenuButton tooltip={t("demo.productions")} isActive={page === "demo.productions"}
              onClick={() => setPage("demo.productions")}>
              <IconProvider icon="Folder" /><span>{t("demo.productions")}</span>
            </SidebarMenuButton></SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={t("demo.media")} aria-expanded={mediaOpen} onClick={() => setMediaOpen(!mediaOpen)}>
                <IconProvider icon="File" /><span>{t("demo.media")}</span>
              </SidebarMenuButton>
              {mediaOpen && <SidebarMenuSub>{["demo.all", "demo.published"].map(key =>
                <SidebarMenuSubItem key={key}><SidebarMenuSubButton asChild isActive={page === key}>
                  <button type="button" onClick={() => setPage(key)}>{t(key)}</button>
                </SidebarMenuSubButton></SidebarMenuSubItem>
              )}</SidebarMenuSub>}
            </SidebarMenuItem>
            <SidebarMenuItem><SidebarMenuButton tooltip={t("demo.team")} isActive={page === "demo.team"} onClick={() => setPage("demo.team")}>
              <IconProvider icon="Users" /><span>{t("demo.team")}</span>
            </SidebarMenuButton></SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserMenu name="Pierre Laurent"
          avatar={<Avatar size="small"><AvatarFallback size="small" className="bg-grey-light text-black">PL</AvatarFallback></Avatar>}
          actions={[
            { label: t("demo.account"), icon: <IconProvider icon="Switch" />, onClick: () => setAction(t("demo.account")) },
            { separator: true },
            { label: t("demo.logout"), icon: <IconProvider icon="Logout" />, onClick: () => setAction(t("demo.logout")) },
          ]} />
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <NavigationPageHeader title={t(page)} collapsible={args.collapsible} />
      <Layout padding={6} bg="white">
        <Text as="h2" className="gs-typo-h2">{t(page)}</Text>
        <Text as="p" aria-live="polite">{action}</Text>
        {reference && <VStack gap={4}>
          <Text as="p">Unwrapped GS controls, using the same background context as the Sidebar.</Text>
          <Layout bg={args.bg ?? "black"} padding={2}>
            <HStack gap={2} wrap align="center">
              <Button variant="normal">Normal</Button><Button variant="secondary">Secondary</Button>
              <Button variant="ghost"><IconProvider icon="Folder" />Productions</Button>
              <Button variant="outline">Outline</Button>
              <SidebarTrigger />
            </HStack>
          </Layout>
          <Button className="self-start" onClick={() => setPanelOpen(true)}>Open GS SidePanel</Button>
        </VStack>}
      </Layout>
      {reference && <SidePanel bg={args.bg ?? "black"} isOpen={panelOpen} onClose={() => setPanelOpen(false)}
        headerContent={<Text as="h2" className="gs-typo-h2">GS SidePanel reference</Text>}>
        <VStack padding={2} gap={2} align="start">
          <Button variant="ghost"><IconProvider icon="Folder" />Productions</Button>
          <Button variant="normal">Normal</Button><Button variant="secondary">Secondary</Button>
        </VStack>
      </SidePanel>}
    </SidebarInset>
  </SidebarProvider>
}

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { story: { inline: false, iframeHeight: 640 }, description: { component: `GS navigation with a persistent icon rail on desktop and an overlay below 768px. Collapsed buttons are 30 × 30px; the rail and PageHeader are 60px by default.

### Page layout

Keep the logo in PageHeader. Show its navigation trigger only on mobile; desktop uses the control inside SidebarHeader.

\`\`\`tsx
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarInset,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, useSidebar,
  PageHeader, IconProvider,
} from "@gs/gs-components-library";
import "@gs/gs-components-library/styles";

function NavigationLayout() {
  const { isMobile, state } = useSidebar();

  return <>
    <Sidebar bg="black">
      {!isMobile && <SidebarHeader className={state === "expanded" ? "items-end" : "items-center"}>
        <SidebarTrigger>
          <IconProvider icon={state === "expanded" ? "X" : "Menu"} />
        </SidebarTrigger>
      </SidebarHeader>}
      <SidebarContent>
        <SidebarMenu className="p-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive tooltip="Media">
              <a href="/media"><IconProvider icon="File" /><span>Media</span></a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
    <SidebarInset>
      <PageHeader title="Media" showTitleButton={false}
        leftContent={isMobile ? <SidebarTrigger /> : undefined} />
      <section>Your page content</section>
    </SidebarInset>
  </>;
}

export function App() {
  return <SidebarProvider><NavigationLayout /></SidebarProvider>;
}
\`\`\`

### User menu

Add inside Sidebar, after SidebarContent. Actions open on the right; only the avatar remains when collapsed.

\`\`\`tsx
import { SidebarFooter, SidebarUserMenu } from "@gs/gs-components-library";

<SidebarFooter>
  <SidebarUserMenu name="Pierre Laurent" actions={[
    { label: "Switch account", onClick: () => openAccountPicker() },
    { separator: true },
    { label: "Log out", onClick: () => logout() },
  ]} />
</SidebarFooter>
\`\`\`

### Dimensions

Set the shared height on a parent of SidebarProvider to resize PageHeader and the collapsed rail together. Use \`collapsible="none"\` to disable collapsing.

\`\`\`tsx
<div style={{ "--page-header-height": "70px" } as React.CSSProperties}>
  <SidebarProvider style={{ "--sidebar-width": "320px" } as React.CSSProperties}>
    <NavigationLayout />
  </SidebarProvider>
</div>
\`\`\`` } },
  },
  argTypes: {
    bg: { control: "select", options: ["black", "white", "grey"] },
    variant: { control: "select", options: ["sidebar", "inset"] },
    collapsible: { control: "select", options: ["icon", "none"] },
    side: { control: "select", options: ["left", "right"] },
  },
  args: { bg: "black", collapsible: "icon", side: "left", variant: "sidebar" },
  decorators: [(Story) => <StyleProvider><TranslationProvider defaultLanguage="EN" customTranslations={translations}><Story /></TranslationProvider></StyleProvider>],
  render: args => <Example {...args} />,
} satisfies Meta<typeof Sidebar>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const White: Story = { args: { bg: "white" } }
export const Grey: Story = { args: { bg: "grey" } }
export const DesignSystemReference: Story = { render: args => <Example {...args} reference /> }
export const WithProviders: Story = {
  decorators: [(Story) => <StyleProvider config={{ customFontFamily: "Georgia, serif", cssVariables: { "--button-b-ghost-bg-pressed": "#27454d" } }}>
    <ThemeProvider initialCustomization={{ text: { brandName: "Studio Nord" }, assets: { logo: '<svg viewBox="0 0 25 14" width="25" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M0 14V0h5l15 10V0h5v14h-5L5 4v10Z" fill="#292828"/></svg>' }, colors: { bgBlack: "#18343c", textBluePrimary: "#b9eee5" } }}>
      <TranslationProvider defaultLanguage="EN" customTranslations={translations}><Story /></TranslationProvider>
    </ThemeProvider>
  </StyleProvider>],
}
