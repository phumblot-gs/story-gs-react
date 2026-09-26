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
      <PageHeader title={t(page)} showLogo={false} showTitleButton={false} leftContent={args.side !== "right" && args.collapsible !== "none" ? <SidebarTrigger /> : undefined}
        rightContent={args.side === "right" && args.collapsible !== "none" ? <SidebarTrigger /> : undefined} />
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
    docs: { story: { inline: false, iframeHeight: 640 }, description: { component: `GS-native Sidebar with the Shadcn composition API. Backgrounds and context match SidePanel; the example uses the real PageHeader. Menu entries, actions and the trigger render GS Button directly. The footer renders ButtonMenuSmall. No Sidebar CSS overrides their colors, typography, padding, height or border radius.

SidebarMenuButton preserves Shadcn default / outline variants and default / sm / lg sizes. It also accepts GS variants and small / medium / large sizes. The default menu variant maps to GS ghost when inactive and normal when active; isActive is forwarded as hasActiveElement. SidebarTrigger uses the same ghost / medium Button as the SidePanel close control, with p-0 w-6 h-6 sizing and a 12px icon. Both opening and closing controls share these dimensions and accept all Button props.

Use an IconProvider followed by a span label inside SidebarMenuButton for icon collapse. The default icon rail is 100px to accommodate unmodified GS button padding and avatars. Put Sidebar inside SidebarProvider, and put page content inside SidebarInset. The none mode participates in normal document flow; desktop icon mode uses viewport positioning. Documentation examples run in isolated iframes so fixed panels do not overlap the Docs page.

Place SidebarTrigger in PageHeader.leftContent and set showLogo={false} so the opening control replaces the logo. For a right Sidebar, use rightContent. The examples omit branding from both the Sidebar and PageHeader. SidebarBrand remains optional and uses the same ThemeProvider logo as PageHeader. On black, invertLogo defaults to true; set it to false for an already light or multicolor logo, or supply a custom logo node.

SidebarFooter accepts any content. SidebarUserMenu composes ButtonMenuSmall with an Avatar and user name; actions are supplied by the application and open on the right (menuSide / menuAlign remain configurable). Avatar remains visible when collapsed. Authentication is owned by the application.

All internal labels use TranslationProvider (sidebar.title, sidebar.toggle, sidebar.userMenu). Navigation labels and action labels are supplied by the consumer. Icons use IconProvider, fonts and colors remain CSS variables for StyleProvider and ThemeProvider.

Import from @gs/gs-components-library or @gs/gs-components-library/sidebar. Import @gs/gs-components-library/styles once. Set --sidebar-width and --sidebar-width-icon on SidebarProvider to customize desktop dimensions; mobile uses 300px or Sidebar style overrides.` } },
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
