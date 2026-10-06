import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { BgProvider, useBgContext } from "@/components/layout/BgContext"
import { useTranslationSafe } from "@/contexts/TranslationContext"
import { useThemeValues } from "@/hooks/useThemeValues"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import BrandLogo from "@/components/PageHeader/BrandLogo"
import { Button, type ButtonProps } from "./button"
import { ButtonMenuSmall, type ButtonMenuSmallProps } from "./button-menu-small"
import { Avatar, AvatarFallback } from "./avatar"
import { IconProvider } from "./icon-provider"
import { Input } from "./input"
import { Separator } from "./separator"
import { Skeleton } from "./skeleton"
import { Text } from "./text"
import { Sheet, SheetContent, SheetTitle } from "./sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "300px"
const SIDEBAR_WIDTH_MOBILE = "300px"
const SIDEBAR_WIDTH_ICON = "var(--page-header-height, 60px)"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (openProp === undefined) _setOpen(openState)
        setOpenProp?.(openState)

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open, openProp]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          !event.defaultPrevented &&
          !(event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable=true]")) &&
          event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "gs-sidebar-provider gs-font-base relative flex min-h-svh w-full",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

export interface SidebarProps extends React.ComponentProps<"div"> {
  side?: "left" | "right"
  variant?: "sidebar" | "inset"
  collapsible?: "icon" | "none"
  /** SidePanel background context, inherited by every GS control. */
  bg?: "white" | "grey" | "black"
  /** Accessible mobile dialog title. */
  title?: string
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ side = "left", variant = "sidebar", collapsible = "icon", bg = "black",
    className, children, style, title, ...props }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
    const { t } = useTranslationSafe()
    // Exactly the same surface classes and context as SidePanel.
    const surface = cn("gs-sidebar gs-font-base flex flex-col text-base",
      bg === "white" ? "bg-white text-black" : bg === "grey" ? "bg-grey text-black" : "bg-black text-white")
    const content = <BgProvider value={bg}>{children}</BgProvider>

    if (collapsible === "none") {
      return <div ref={ref} data-sidebar="sidebar" data-bg={bg} data-state="expanded"
        data-side={side} className={cn(surface, "gs-sidebar-static", className)}
        style={style} {...props}>{content}</div>
    }
    if (isMobile) {
      return <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent ref={ref} data-sidebar="sidebar" data-mobile="true" data-bg={bg}
          side={side} aria-describedby={undefined}
          className={cn(surface, "w-[--sidebar-width] max-w-[calc(100vw-20px)] gap-0 border-none p-0", className)}
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE, ...style } as React.CSSProperties} {...props}>
          <SheetTitle className="sr-only">{title ?? t("sidebar.title")}</SheetTitle>
          <BgProvider value={bg}>
            <SidebarHeader className="items-end"><SidebarTrigger /></SidebarHeader>
            {children}
          </BgProvider>
        </SheetContent>
      </Sheet>
    }
    return <div className="gs-sidebar-shell group peer" data-state={state} data-side={side}
      data-variant={variant} data-collapsible={state === "collapsed" ? collapsible : ""}>
      <div className="gs-sidebar-spacer" aria-hidden="true" />
      <div className="gs-sidebar-positioner">
        <div ref={ref} data-sidebar="sidebar" data-bg={bg}
          className={cn(surface, "h-full w-full shadow-lg", className)}
          style={style} {...props}>{content}</div>
      </div>
    </div>
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, children, className, ...props }, ref) => {
    const { toggleSidebar, isMobile, openMobile, open } = useSidebar()
    const bg = useBgContext()
    const { t } = useTranslationSafe()
    // A standalone trigger gets the same white context as PageHeader.
    return <BgProvider value={bg ?? "white"}><Button ref={ref} type="button" variant="ghost" size="medium"
      className={cn("p-0 w-6 h-6", className)} data-sidebar="trigger" aria-label={t("sidebar.toggle")} aria-expanded={isMobile ? openMobile : open}
      onClick={event => { onClick?.(event); if (!event.defaultPrevented) toggleSidebar() }} {...props}>
      {children ?? <IconProvider icon={isMobile && openMobile ? "X" : "Menu"} />}
    </Button></BgProvider>
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()
    const { t } = useTranslationSafe()
    return <button ref={ref} type="button" tabIndex={-1} data-sidebar="rail"
      aria-label={t("sidebar.toggle")} title={t("sidebar.toggle")}
      className={cn("gs-sidebar-rail", className)}
      onClick={event => { onClick?.(event); if (!event.defaultPrevented) toggleSidebar() }} {...props} />
  }
)
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(
  ({ className, ...props }, ref) => <BgProvider value="white"><main ref={ref}
    className={cn("gs-sidebar-inset gs-font-base min-w-0 flex-1 bg-white text-black", className)} {...props} /></BgProvider>
)
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<React.ElementRef<typeof Input>, React.ComponentProps<typeof Input>>(
  (props, ref) => <Input ref={ref} data-sidebar="input" {...props} />
)
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} data-sidebar="header"
    className={cn("gs-sidebar-header flex shrink-0 flex-col justify-center gap-2 p-2", className)} {...props} />
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} data-sidebar="footer"
    className={cn("flex shrink-0 flex-col gap-2 p-2", className)} {...props} />
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} data-sidebar="content"
    className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden", className)} {...props} />
)
SidebarContent.displayName = "SidebarContent"

const SidebarSeparator = React.forwardRef<React.ElementRef<typeof Separator>, React.ComponentProps<typeof Separator>>(
  (props, ref) => <Separator ref={ref} data-sidebar="separator" {...props} />
)
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} data-sidebar="group"
    className={cn("relative flex min-w-0 flex-col gap-2 p-2", className)} {...props} />
)
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { asChild?: boolean }>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return <Comp ref={ref} data-sidebar="group-label" className={cn("px-4", className)} {...props}>
      {asChild ? children : <Text as="h3" className="gs-typo-h3">{children}</Text>}
    </Comp>
  }
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => <Button ref={ref} type="button" variant="ghost" size="small"
    data-sidebar="group-action" className={cn("self-end", className)} {...props} />
)
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} data-sidebar="group-content" className={cn("w-full", className)} {...props} />
)
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => <ul ref={ref} data-sidebar="menu"
    className={cn("flex min-w-0 flex-col gap-1", className)} {...props} />
)
SidebarMenu.displayName = "SidebarMenu"
const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => <li ref={ref} data-sidebar="menu-item" className={cn("gs-sidebar-menu-item", className)} {...props} />
)
SidebarMenuItem.displayName = "SidebarMenuItem"

export interface SidebarMenuButtonProps extends Omit<ButtonProps, "size"> {
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
  size?: "default" | "sm" | "lg" | "small" | "medium" | "large"
}
const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
    const { state, isMobile } = useSidebar()
    const button = <Button ref={ref} type={props.asChild ? undefined : "button"}
      data-sidebar="menu-button" data-active={isActive} data-size={size}
      aria-current={isActive ? "page" : undefined}
      variant={variant === "default" ? (isActive ? "normal" : "ghost") : variant}
      size={size} hasActiveElement={isActive}
      className={cn("gs-sidebar-menu-button w-full min-w-0 justify-start text-left", className)} {...props} />
    if (!tooltip) return button
    return <Tooltip><TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" hidden={state !== "collapsed" || isMobile}
        {...(typeof tooltip === "string" ? { children: tooltip } : tooltip)} />
    </Tooltip>
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<HTMLButtonElement, ButtonProps & { showOnHover?: boolean }>(
  ({ showOnHover = false, className, ...props }, ref) => <Button ref={ref} type="button" variant="ghost" size="small"
    data-sidebar="menu-action" data-show-on-hover={showOnHover}
    className={cn("gs-sidebar-menu-action", className)} {...props} />
)
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} data-sidebar="menu-badge"
    className={cn("pointer-events-none self-center text-sm tabular-nums", className)} {...props} />
)
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { showIcon?: boolean }>(
  ({ className, showIcon, ...props }, ref) => <div ref={ref} data-sidebar="menu-skeleton"
    className={cn("flex items-center gap-2 px-4 py-1", className)} {...props}>
    {showIcon && <Skeleton className="h-3 w-3 rounded-full" />}
    <Skeleton className="h-3 w-3/4" />
  </div>
)
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => <ul ref={ref} data-sidebar="menu-sub"
    className={cn("flex min-w-0 flex-col gap-1 pl-4", className)} {...props} />
)
SidebarMenuSub.displayName = "SidebarMenuSub"
const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  (props, ref) => <li ref={ref} data-sidebar="menu-sub-item" {...props} />
)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<HTMLAnchorElement,
  React.ComponentProps<"a"> & { asChild?: boolean; size?: "sm" | "md"; isActive?: boolean }>(
  ({ asChild = false, size = "md", isActive = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"
    return <Button asChild size={size === "sm" ? "small" : "medium"}
      variant={isActive ? "normal" : "ghost"} hasActiveElement={isActive}
      className={cn("w-full min-w-0 justify-start text-left", className)}>
      <Comp ref={ref} data-sidebar="menu-sub-button" data-active={isActive}
        aria-current={isActive ? "page" : undefined} {...props}>{children}</Comp>
    </Button>
  }
)
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export interface SidebarBrandProps extends React.ComponentProps<"div"> {
  /** Same override as PageHeader; otherwise uses ThemeProvider.assets.logo. */
  logo?: React.ReactNode
  name?: React.ReactNode
  /** Defaults to inversion on black. Disable for an already light custom logo. */
  invertLogo?: boolean
  onLogoClick?: () => void
}
const SidebarBrand = React.forwardRef<HTMLDivElement, SidebarBrandProps>(
  ({ logo, name, invertLogo, onLogoClick, className, ...props }, ref) => {
    const { logo: themeLogo, brandName } = useThemeValues()
    const bg = useBgContext()
    const { t } = useTranslationSafe()
    const brand = <>
      <span className="gs-sidebar-logo inline-flex shrink-0" data-inverted={invertLogo ?? bg === "black"}>
        {logo ?? <BrandLogo logo={themeLogo} width={25} height={14} />}
      </span>
      <span className="gs-sidebar-brand-name truncate">{name ?? brandName}</span>
    </>
    return <div ref={ref} data-sidebar="brand" className={cn("min-w-0", className)} {...props}>
      {onLogoClick ? <Button variant="link" className="w-full justify-start text-left" onClick={onLogoClick}
        type="button" aria-label={t("pageHeader.home")}>{brand}</Button>
        : <div className="flex items-center gap-4 px-4 py-2">{brand}</div>}
    </div>
  }
)
SidebarBrand.displayName = "SidebarBrand"

export interface SidebarUserMenuProps extends Omit<ButtonMenuSmallProps, "children"> {
  name: string
  /** Pass an Avatar with AvatarImage/AvatarFallback, or another custom avatar. */
  avatar?: React.ReactNode
}
const SidebarUserMenu = React.forwardRef<HTMLButtonElement, SidebarUserMenuProps>(
  ({ name, avatar, className, menuSide = "right", menuAlign = "end", ...props }, ref) => {
    const { t } = useTranslationSafe()
    return <ButtonMenuSmall ref={ref} variant="secondary" menuSide={menuSide} menuAlign={menuAlign}
      aria-label={t("sidebar.userMenu", { name })}
      className={cn("gs-sidebar-user-menu w-full min-w-0 justify-start", className)} {...props}>
      <span className="inline-flex shrink-0">{avatar ?? <Avatar size="small"><AvatarFallback className="bg-grey-light text-black">
        {name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("")}
      </AvatarFallback></Avatar>}</span>
      <span className="gs-sidebar-user-name min-w-0 flex-1 truncate text-left">{name}</span>
      <span className="gs-sidebar-user-chevron"><IconProvider icon="ChevronRight" /></span>
    </ButtonMenuSmall>
  }
)
SidebarUserMenu.displayName = "SidebarUserMenu"

export {
  Sidebar, SidebarBrand, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset,
  SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
  SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, SidebarUserMenu, useSidebar,
}
