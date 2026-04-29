import * as React from "react";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Icon } from "@/components/ui/icons/Icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/layout/Modal";
import { VStack, HStack } from "@/components/layout";
import { useBgContext } from "@/components/layout/BgContext";
import { useTranslationSafe } from "@/contexts/TranslationContext";
import type { TranslationMap } from "@/utils/translations";

export type ViewVisibility = "public" | "private";

export interface View {
  id: string;
  name: string;
  parentTabId: string;
  filters: Record<string, unknown>;
  visibility: ViewVisibility;
  createdAt: string | number;
  count?: number;
}

export interface TabsFixedTab {
  id: string;
  label: React.ReactNode;
  count?: number;
  canHaveViews?: boolean;
  rightSlot?: React.ReactNode;
}

export interface CreateViewInput {
  name: string;
  visibility: ViewVisibility;
  parentTabId: string;
  filters: Record<string, unknown>;
}

export interface TabsWithViewsProps {
  fixedTabs: TabsFixedTab[];
  views: View[];
  activeTab: string;
  onActiveTabChange: (id: string) => void;
  currentFilters?: Record<string, unknown>;
  onCreateView: (input: CreateViewInput) => Promise<void> | void;
  onRenameView: (id: string, name: string) => Promise<void> | void;
  onDeleteView: (id: string) => Promise<void> | void;
  renderFiltersSummary?: (filters: Record<string, unknown>) => React.ReactNode;
  language?: string;
  translations?: Partial<TranslationMap>;
  className?: string;
  debug?: boolean;
  children?: React.ReactNode;
}

type Sortable = { createdAt: string | number };
const byCreatedAtAsc = (a: Sortable, b: Sortable) => {
  const aT = typeof a.createdAt === "number" ? a.createdAt : Date.parse(a.createdAt);
  const bT = typeof b.createdAt === "number" ? b.createdAt : Date.parse(b.createdAt);
  return aT - bT;
};

const formatCount = (count?: number): string =>
  typeof count === "number" ? ` (${count})` : "";

interface ViewTabTriggerProps {
  view: View;
  isActive: boolean;
  count?: number;
  viewActionsLabel: string;
  renameLabel: string;
  deleteLabel: string;
  onRenameClick: (view: View) => void;
  onDeleteClick: (view: View) => void;
}

const getDropdownContentClasses = (bg: string | null): string => {
  switch (bg) {
    case "white":
      return "bg-black text-white border-grey-strongest";
    case "black":
      return "bg-white text-black border-grey-lighter";
    case "grey":
      return "bg-white text-black border-grey-lighter";
    default:
      return "bg-white text-black border-grey-lighter";
  }
};

const getDropdownItemClasses = (bg: string | null): string => {
  switch (bg) {
    case "white":
      return "bg-black text-white hover:bg-grey-lighter hover:text-black focus:bg-grey-lighter focus:text-black active:bg-grey-lighter active:text-blue-primary data-[highlighted]:bg-grey-lighter data-[highlighted]:text-black";
    case "grey":
      return "bg-black text-white hover:bg-white hover:text-black focus:bg-white focus:text-black active:bg-white active:text-blue-primary data-[highlighted]:bg-white data-[highlighted]:text-black";
    case "black":
      return "bg-black-secondary text-white hover:bg-white hover:text-black focus:bg-white focus:text-black active:bg-white active:text-blue-primary data-[highlighted]:bg-white data-[highlighted]:text-black";
    default:
      return "text-black hover:bg-grey-lighter focus:bg-grey-lighter data-[highlighted]:bg-grey-lighter";
  }
};

const ViewTabTrigger: React.FC<ViewTabTriggerProps> = ({
  view,
  isActive,
  count,
  viewActionsLabel,
  renameLabel,
  deleteLabel,
  onRenameClick,
  onDeleteClick,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const bg = useBgContext();

  const dropdownContentClasses = cn(
    "rounded-none p-0 border-0 shadow-lg min-w-[140px]",
    getDropdownContentClasses(bg)
  );
  const dropdownItemClasses = cn(
    "rounded-none border-0 px-3 py-2 h-8 text-sm font-light transition-colors duration-150 cursor-default",
    "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
    getDropdownItemClasses(bg)
  );

  return (
    <div
      className={cn(
        "tabs-view-wrapper",
        menuOpen && "tabs-view-wrapper--menu-open"
      )}
    >
      <TabsTrigger value={view.id}>
        {view.name}
        {formatCount(count)}
      </TabsTrigger>
      {isActive && (
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="small"
              variant="ghost"
              aria-label={viewActionsLabel}
              className={cn(
                "p-1 w-4 h-4 [&_svg]:!w-[10px] [&_svg]:!h-[10px]",
                "tabs-view-menu-button",
                menuOpen && "tabs-view-menu-button--open"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name={menuOpen ? "ArrowUp" : "ArrowDown"} size={10} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={8} className={dropdownContentClasses}>
            <DropdownMenuItem
              className={dropdownItemClasses}
              onSelect={() => {
                onRenameClick(view);
              }}
            >
              {renameLabel}
            </DropdownMenuItem>
            <DropdownMenuItem
              className={dropdownItemClasses}
              onSelect={() => {
                onDeleteClick(view);
              }}
            >
              {deleteLabel}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

interface ViewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  nameLabel: string;
  namePlaceholder: string;
  visibilityLabel: string;
  publicLabel: string;
  privateLabel: string;
  publicHelp: string;
  privateHelp: string;
  filtersLabel: string;
  noFiltersLabel: string;
  submitLabel: string;
  cancelLabel: string;
  nameRequiredLabel: string;
  initialName?: string;
  initialVisibility?: ViewVisibility;
  visibilityEditable: boolean;
  filtersSummary: React.ReactNode;
  onSubmit: (name: string, visibility: ViewVisibility) => Promise<void> | void;
}

const ViewFormModal: React.FC<ViewFormModalProps> = ({
  isOpen,
  onClose,
  title,
  nameLabel,
  namePlaceholder,
  visibilityLabel,
  publicLabel,
  privateLabel,
  publicHelp,
  privateHelp,
  filtersLabel,
  noFiltersLabel,
  submitLabel,
  cancelLabel,
  nameRequiredLabel,
  initialName = "",
  initialVisibility = "private",
  visibilityEditable,
  filtersSummary,
  onSubmit,
}) => {
  const [name, setName] = React.useState(initialName);
  const [visibility, setVisibility] = React.useState<ViewVisibility>(initialVisibility);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setVisibility(initialVisibility);
      setError(null);
      setSubmitting(false);
    }
  }, [isOpen, initialName, initialVisibility]);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(nameRequiredLabel);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(trimmed, visibility);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  const isPublic = visibility === "public";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-[480px]"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            {cancelLabel}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitLabel}
          </Button>
        </>
      }
    >
      <VStack gap={4} padding={5}>
        <h3 className="gs-typo-h3">{title}</h3>

        <VStack gap={2}>
          <Label htmlFor="tabs-view-name">{nameLabel}</Label>
          <Input
            id="tabs-view-name"
            value={name}
            placeholder={namePlaceholder}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            autoFocus
          />
          {error && <span className="text-xs text-destructive">{error}</span>}
        </VStack>

        <VStack gap={2}>
          <Label>{visibilityLabel}</Label>
          <HStack gap={3} align="center">
            <Switch
              value={isPublic}
              onValueChange={(v) => {
                if (visibilityEditable) setVisibility(v ? "public" : "private");
              }}
              onText={publicLabel}
              offText={privateLabel}
              disabled={!visibilityEditable}
            />
            <span className="text-xs text-grey-stronger">
              {isPublic ? publicHelp : privateHelp}
            </span>
          </HStack>
        </VStack>

        <VStack gap={2}>
          <Label>{filtersLabel}</Label>
          <div className="text-sm text-grey-stronger">
            {filtersSummary ?? noFiltersLabel}
          </div>
        </VStack>
      </VStack>
    </Modal>
  );
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => Promise<void> | void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setSubmitting(false);
      setError(null);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-[420px]"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            {cancelLabel}
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={submitting}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <VStack gap={3} padding={5}>
        <h3 className="gs-typo-h3">{title}</h3>
        <p className="text-sm">{message}</p>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </VStack>
    </Modal>
  );
};

export const TabsWithViews: React.FC<TabsWithViewsProps> = ({
  fixedTabs,
  views,
  activeTab,
  onActiveTabChange,
  currentFilters,
  onCreateView,
  onRenameView,
  onDeleteView,
  renderFiltersSummary,
  language,
  translations,
  className,
  debug,
  children,
}) => {
  const { t } = useTranslationSafe(translations, language);

  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [renameTargetView, setRenameTargetView] = React.useState<View | null>(null);
  const [deleteTargetView, setDeleteTargetView] = React.useState<View | null>(null);

  const viewsByParent = React.useMemo(() => {
    const map = new Map<string, View[]>();
    for (const v of views) {
      const list = map.get(v.parentTabId) ?? [];
      list.push(v);
      map.set(v.parentTabId, list);
    }
    for (const list of map.values()) list.sort(byCreatedAtAsc);
    return map;
  }, [views]);

  const activeView = React.useMemo(
    () => views.find((v) => v.id === activeTab) ?? null,
    [views, activeTab]
  );
  const activeParentTabId = activeView ? activeView.parentTabId : activeTab;
  const activeParentTab = React.useMemo(
    () => fixedTabs.find((t) => t.id === activeParentTabId) ?? null,
    [fixedTabs, activeParentTabId]
  );

  const showCreateLink = Boolean(activeParentTab?.canHaveViews);
  const parentRightSlot = activeParentTab?.rightSlot;

  const rightSlot =
    showCreateLink || parentRightSlot ? (
      <>
        {showCreateLink && (
          <Link asButton onClick={() => setCreateModalOpen(true)}>
            {t("tabsWithViews.createView")}
          </Link>
        )}
        {parentRightSlot}
      </>
    ) : null;

  const handleCreate = async (name: string, visibility: ViewVisibility) => {
    if (!activeParentTab) return;
    await onCreateView({
      name,
      visibility,
      parentTabId: activeParentTab.id,
      filters: currentFilters ?? {},
    });
  };

  const handleRename = async (name: string) => {
    if (!renameTargetView) return;
    await onRenameView(renameTargetView.id, name);
  };

  const handleDelete = async () => {
    if (!deleteTargetView) return;
    await onDeleteView(deleteTargetView.id);
  };

  const viewActionsLabel = t("tabsWithViews.viewActions");
  const renameLabel = t("tabsWithViews.rename");
  const deleteLabel = t("tabsWithViews.delete");

  const createFiltersSummary = React.useMemo(
    () =>
      renderFiltersSummary && currentFilters
        ? renderFiltersSummary(currentFilters)
        : null,
    [renderFiltersSummary, currentFilters]
  );

  const renameFiltersSummary = React.useMemo(
    () =>
      renderFiltersSummary && renameTargetView
        ? renderFiltersSummary(renameTargetView.filters)
        : null,
    [renderFiltersSummary, renameTargetView]
  );

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={onActiveTabChange}
        className={className}
        debug={debug}
      >
        <TabsList rightSlot={rightSlot}>
          {fixedTabs.map((tab) => {
            const tabViews = viewsByParent.get(tab.id) ?? [];
            return (
              <React.Fragment key={tab.id}>
                <TabsTrigger value={tab.id}>
                  {tab.label}
                  {formatCount(tab.count)}
                </TabsTrigger>
                {tabViews.map((view) => (
                  <ViewTabTrigger
                    key={view.id}
                    view={view}
                    isActive={activeTab === view.id}
                    count={view.count}
                    viewActionsLabel={viewActionsLabel}
                    renameLabel={renameLabel}
                    deleteLabel={deleteLabel}
                    onRenameClick={(v) => setRenameTargetView(v)}
                    onDeleteClick={(v) => setDeleteTargetView(v)}
                  />
                ))}
              </React.Fragment>
            );
          })}
        </TabsList>
        {children}
      </Tabs>

      <ViewFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title={t("tabsWithViews.createTitle")}
        nameLabel={t("tabsWithViews.nameLabel")}
        namePlaceholder={t("tabsWithViews.namePlaceholder")}
        visibilityLabel={t("tabsWithViews.visibilityLabel")}
        publicLabel={t("tabsWithViews.public")}
        privateLabel={t("tabsWithViews.private")}
        publicHelp={t("tabsWithViews.publicHelp")}
        privateHelp={t("tabsWithViews.privateHelp")}
        filtersLabel={t("tabsWithViews.filtersLabel")}
        noFiltersLabel={t("tabsWithViews.noFilters")}
        submitLabel={t("tabsWithViews.create")}
        cancelLabel={t("tabsWithViews.cancel")}
        nameRequiredLabel={t("tabsWithViews.nameRequired")}
        initialName=""
        initialVisibility="private"
        visibilityEditable
        filtersSummary={createFiltersSummary}
        onSubmit={handleCreate}
      />

      <ViewFormModal
        isOpen={renameTargetView !== null}
        onClose={() => setRenameTargetView(null)}
        title={t("tabsWithViews.renameTitle")}
        nameLabel={t("tabsWithViews.nameLabel")}
        namePlaceholder={t("tabsWithViews.namePlaceholder")}
        visibilityLabel={t("tabsWithViews.visibilityLabel")}
        publicLabel={t("tabsWithViews.public")}
        privateLabel={t("tabsWithViews.private")}
        publicHelp={t("tabsWithViews.publicHelp")}
        privateHelp={t("tabsWithViews.privateHelp")}
        filtersLabel={t("tabsWithViews.filtersLabel")}
        noFiltersLabel={t("tabsWithViews.noFilters")}
        submitLabel={t("tabsWithViews.save")}
        cancelLabel={t("tabsWithViews.cancel")}
        nameRequiredLabel={t("tabsWithViews.nameRequired")}
        initialName={renameTargetView?.name ?? ""}
        initialVisibility={renameTargetView?.visibility ?? "private"}
        visibilityEditable={false}
        filtersSummary={renameFiltersSummary}
        onSubmit={handleRename}
      />

      <DeleteConfirmModal
        isOpen={deleteTargetView !== null}
        onClose={() => setDeleteTargetView(null)}
        title={t("tabsWithViews.deleteConfirmTitle")}
        message={t("tabsWithViews.deleteConfirmMessage", {
          name: deleteTargetView?.name ?? "",
        })}
        confirmLabel={t("tabsWithViews.confirmDelete")}
        cancelLabel={t("tabsWithViews.cancel")}
        onConfirm={handleDelete}
      />
    </>
  );
};

TabsWithViews.displayName = "TabsWithViews";
