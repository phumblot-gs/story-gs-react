"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { BgProvider, useBgContext } from "@/components/layout/BgContext";
import { useCollisionPadding } from "@/contexts/CollisionInsetsContext";
import { useTranslationSafe, type TranslationMap } from "@/contexts/TranslationContext";
import { Icon } from "./icons";
import { TagText } from "./tag-text";
import type { SelectAutocompleteOption, SelectedOption } from "./select-autocomplete";
import {
  SELECT_TRIGGER_BASE_CLASSES,
  SELECT_TRIGGER_ICON_BUTTON_BASE_CLASSES,
  getSelectTriggerBackgroundStyles,
  getSelectTriggerIconButtonStyles,
  getSelectTriggerSizeStyles,
  getSelectTriggerSurfaceBg,
} from "./select-trigger-styles";

export interface MultiSelectProps {
  /** Options proposées (mode local). `group` n'est pas encore affiché par MultiSelect. */
  options: SelectAutocompleteOption[];
  /** Valeurs cochées (mode contrôlé) : les `value` des options, jamais les labels. */
  value?: string[];
  /** Valeurs cochées au montage (mode non contrôlé). */
  defaultValue?: string[];
  /**
   * Appelé à chaque changement avec les `value` cochées, dans l'ordre où elles ont été cochées,
   * et les options correspondantes `{ value, label }`. Une valeur absente de `options`
   * est renvoyée avec sa propre valeur comme label.
   */
  onChange?: (values: string[], selected: SelectedOption[]) => void;
  /** Appelé à l'ouverture et à la fermeture du menu. */
  onOpenChange?: (open: boolean) => void;
  /** Texte du déclencheur sans valeur. Défaut : traduction `multiSelect.placeholder`. */
  placeholder?: string;
  /** Placeholder du champ de recherche. Défaut : traduction `multiSelect.search`. */
  searchPlaceholder?: string;
  /** Message sans résultat. Défaut : traduction `multiSelect.noResults`. */
  noResultsText?: string;
  /** Filtre de la recherche. Défaut : `searchText` ou `label` contient le terme, sans tenir compte de la casse. */
  filterFunction?: (option: SelectAutocompleteOption, searchTerm: string) => boolean;
  disabled?: boolean;
  /**
   * `normal` : valeurs en tags, résumé « +N » quand elles ne tiennent plus sur une ligne.
   * `small` : résumé « N sélectionné(s) ».
   * @default "normal"
   */
  size?: "normal" | "small";
  /** Rond de la flèche fondu dans le déclencheur au repos, comme `SelectTrigger`. */
  discrete?: boolean;
  /** Affiche une croix qui efface toutes les valeurs (menu fermé). */
  allowClear?: boolean;
  /** Nombre maximum de valeurs cochées. */
  maxSelected?: number;
  /** Hauteur maximale de la liste (classe Tailwind). @default "max-h-[300px]" */
  menuMaxHeight?: string;
  /** Classes du menu. */
  popoverClassName?: string;
  /** Classes du déclencheur. */
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
  /** Logs de l'état dans la console. */
  debug?: boolean;
  /** Code de langue ("fr", "en", "es", "it", "de"). */
  language?: string;
  /** Traductions qui surchargent celles de la librairie. */
  translations?: Partial<TranslationMap>;
}

/** Nombre de tags mesurés pour le résumé « +N » : au-delà, ils ne tiendraient de toute façon pas sur une ligne. */
const MAX_MEASURED_TAGS = 50;
const TAG_GAP_PX = 4;
/** Ligne « Tout sélectionner » dans la navigation clavier. */
const SELECT_ALL = -1;

type PageBg = "white" | "grey" | "black" | undefined;

interface MenuPalette {
  menu: string;
  row: string;
  rowActive: string;
  /** Couleur de la coche : celle du fond de la ligne, pour qu'elle se détache de la case pleine. */
  check: string;
  checkActive: string;
  search: string;
  muted: string;
  separator: string;
}

/**
 * Couleurs du menu, alignées sur SelectAutocomplete : noir sur fond white / grey, black-secondary sur fond black,
 * blanc sans contexte. Chaque fond est posé avec sa couleur de texte : le menu ne dépend jamais de
 * `--popover-foreground` ni d'une couleur héritée.
 */
function getMenuPalette(bg: PageBg): MenuPalette {
  switch (bg) {
    case "white":
    case "grey":
      return {
        menu: "bg-black text-white border-grey-strongest",
        row: "bg-black text-white",
        rowActive: bg === "white" ? "bg-grey-lighter text-black" : "bg-white text-black",
        check: "text-black",
        checkActive: bg === "white" ? "text-grey-lighter" : "text-white",
        search: "bg-black-secondary text-white placeholder:text-grey-stronger",
        muted: "text-grey-stronger",
        separator: "border-black-secondary",
      };
    case "black":
      return {
        menu: "bg-black-secondary text-white border-black-secondary",
        row: "bg-black-secondary text-white",
        rowActive: "bg-white text-black",
        check: "text-black-secondary",
        checkActive: "text-white",
        search: "bg-black text-white placeholder:text-grey-stronger",
        muted: "text-grey-stronger",
        separator: "border-black",
      };
    default:
      return {
        menu: "bg-white text-black border-grey-lighter",
        row: "bg-white text-black",
        rowActive: "bg-grey-lighter text-black",
        check: "text-white",
        checkActive: "text-grey-lighter",
        search: "bg-grey-lighter text-black placeholder:text-grey-strongest",
        muted: "text-grey-strongest",
        separator: "border-grey-lighter",
      };
  }
}

const defaultFilter = (option: SelectAutocompleteOption, searchTerm: string) =>
  (option.searchText || option.label).toLowerCase().includes(searchTerm.toLowerCase());

/** Case à cocher dessinée (pas de Checkbox Radix par ligne, pour rester léger sur de longues listes). */
function CheckBox({ state, checkClass }: { state: boolean | "indeterminate"; checkClass: string }) {
  const filled = state !== false;
  return (
    <span
      aria-hidden="true"
      data-state={state === "indeterminate" ? "indeterminate" : state ? "checked" : "unchecked"}
      className={cn(
        "flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px] border border-current",
        filled && "bg-current"
      )}
    >
      {state === "indeterminate" ? (
        <Minus className={cn("h-2 w-2", checkClass)} strokeWidth={3} />
      ) : state ? (
        <Check className={cn("h-2 w-2", checkClass)} strokeWidth={3} />
      ) : null}
    </span>
  );
}

interface RowProps {
  id: string;
  index: number;
  option: SelectAutocompleteOption;
  checked: boolean;
  active: boolean;
  disabled: boolean;
  palette: MenuPalette;
  rowClass: string;
  onToggle: (value: string) => void;
  onActivate: (index: number) => void;
}

const MultiSelectRow = React.memo(function MultiSelectRow({
  id,
  index,
  option,
  checked,
  active,
  disabled,
  palette,
  rowClass,
  onToggle,
  onActivate,
}: RowProps) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={checked}
      aria-disabled={disabled || undefined}
      data-active={active || undefined}
      className={cn(
        "flex w-full select-none items-center gap-2 font-light",
        rowClass,
        active ? palette.rowActive : palette.row,
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
      // garde le focus dans le champ de recherche
      onMouseDown={(e) => e.preventDefault()}
      onMouseMove={() => {
        if (!active) onActivate(index);
      }}
      onClick={() => {
        if (!disabled) onToggle(option.value);
      }}
    >
      <CheckBox state={checked} checkClass={active ? palette.checkActive : palette.check} />
      {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
      <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{option.label}</span>
    </div>
  );
});

/**
 * Liste déroulante à choix multiples : tags dans le déclencheur, menu avec recherche,
 * cases à cocher et « Tout sélectionner » sur les options visibles.
 */
const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value: valueProp,
      defaultValue,
      onChange,
      onOpenChange,
      placeholder,
      searchPlaceholder,
      noResultsText: noResultsTextProp,
      filterFunction,
      disabled = false,
      size = "normal",
      discrete = false,
      allowClear = false,
      maxSelected,
      menuMaxHeight = "max-h-[300px]",
      popoverClassName,
      className,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      debug = false,
      language,
      translations,
    },
    ref
  ) => {
    const bg = useBgContext();
    // Marges réservées par l'hôte (CollisionInsetsProvider) ; la hauteur du menu suit déjà la hauteur
    // disponible calculée par Radix, qui en tient compte.
    const collisionPadding = useCollisionPadding(undefined);
    const { t } = useTranslationSafe(translations, language);
    const placeholderText = placeholder ?? t("multiSelect.placeholder");
    const searchPlaceholderText = searchPlaceholder ?? t("multiSelect.search");
    const noResultsText = noResultsTextProp ?? t("multiSelect.noResults");

    const baseId = React.useId();
    const listId = `${baseId}-list`;
    const optionId = React.useCallback((index: number) => `${baseId}-opt-${index}`, [baseId]);

    const triggerRef = React.useRef<HTMLDivElement>(null);
    const searchRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => triggerRef.current as HTMLDivElement);

    // ---------- valeurs ----------
    const isControlled = valueProp !== undefined;
    const [internalValues, setInternalValues] = React.useState<string[]>(defaultValue ?? []);
    const values = isControlled ? valueProp : internalValues;
    const selectedSet = React.useMemo(() => new Set(values), [values]);

    const optionByValue = React.useMemo(() => {
      const map = new Map<string, SelectAutocompleteOption>();
      for (const option of options) map.set(option.value, option);
      return map;
    }, [options]);
    const labelOf = React.useCallback((v: string) => optionByValue.get(v)?.label ?? v, [optionByValue]);

    const atMax = maxSelected !== undefined && values.length >= maxSelected;

    const commit = React.useCallback(
      (next: string[]) => {
        if (!isControlled) setInternalValues(next);
        onChange?.(next, next.map((v) => ({ value: v, label: labelOf(v) })));
      },
      [isControlled, onChange, labelOf]
    );

    // ---------- menu ----------
    const [open, setOpenState] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [active, setActive] = React.useState<number | null>(null);
    const scrollOnActiveRef = React.useRef(false);

    const filterFn = filterFunction ?? defaultFilter;
    const filtered = React.useMemo(() => {
      const term = search.trim();
      return term ? options.filter((option) => filterFn(option, term)) : options;
    }, [options, search, filterFn]);

    const visibleEnabled = React.useMemo(() => filtered.filter((o) => !o.disabled), [filtered]);
    const allVisibleSelected = visibleEnabled.length > 0 && visibleEnabled.every((o) => selectedSet.has(o.value));
    const someVisibleSelected = visibleEnabled.some((o) => selectedSet.has(o.value));
    const missingVisible = React.useMemo(
      () => visibleEnabled.filter((o) => !selectedSet.has(o.value)).map((o) => o.value),
      [visibleEnabled, selectedSet]
    );
    const showSelectAll = visibleEnabled.length > 0;
    // Tout désélectionner est toujours possible ; tout sélectionner est bloqué s'il dépasserait le maximum.
    const selectAllDisabled =
      !allVisibleSelected && maxSelected !== undefined && values.length + missingVisible.length > maxSelected;

    const isRowDisabled = React.useCallback(
      (option: SelectAutocompleteOption) => Boolean(option.disabled) || (atMax && !selectedSet.has(option.value)),
      [atMax, selectedSet]
    );

    const firstEnabledIndex = React.useCallback(
      (list: SelectAutocompleteOption[]) => {
        const index = list.findIndex((o) => !isRowDisabled(o));
        return index === -1 ? null : index;
      },
      [isRowDisabled]
    );

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (next && disabled) return;
        setOpenState(next);
        setSearch("");
        if (next) {
          scrollOnActiveRef.current = true;
          setActive(firstEnabledIndex(options));
        } else {
          setActive(null);
        }
        onOpenChange?.(next);
      },
      [disabled, firstEnabledIndex, options, onOpenChange]
    );

    // ---------- actions ----------
    const toggleValue = React.useCallback(
      (v: string) => {
        if (selectedSet.has(v)) {
          commit(values.filter((x) => x !== v));
          return;
        }
        const option = optionByValue.get(v);
        if (option?.disabled || atMax) return;
        commit([...values, v]);
      },
      [selectedSet, values, commit, optionByValue, atMax]
    );

    const toggleAllVisible = React.useCallback(() => {
      if (allVisibleSelected) {
        const visible = new Set(visibleEnabled.map((o) => o.value));
        commit(values.filter((v) => !visible.has(v)));
      } else if (!selectAllDisabled) {
        commit([...values, ...missingVisible]);
      }
    }, [allVisibleSelected, visibleEnabled, values, commit, selectAllDisabled, missingVisible]);

    // Rappels stables pour les lignes mémoïsées.
    const toggleRef = React.useRef(toggleValue);
    toggleRef.current = toggleValue;
    const onRowToggle = React.useCallback((v: string) => toggleRef.current(v), []);
    const onRowActivate = React.useCallback((index: number) => {
      scrollOnActiveRef.current = false;
      setActive(index);
    }, []);

    const activateKey = React.useCallback(
      (key: number | null) => {
        if (key === SELECT_ALL) toggleAllVisible();
        else if (key !== null && filtered[key] && !isRowDisabled(filtered[key])) toggleValue(filtered[key].value);
      },
      [toggleAllVisible, filtered, isRowDisabled, toggleValue]
    );

    const moveActive = React.useCallback(
      (direction: 1 | -1) => {
        const order: number[] = [];
        if (showSelectAll && !selectAllDisabled) order.push(SELECT_ALL);
        filtered.forEach((option, index) => {
          if (!isRowDisabled(option)) order.push(index);
        });
        if (!order.length) return;
        const position = active === null ? -1 : order.indexOf(active);
        let next: number;
        if (position === -1) next = direction > 0 ? order[0] : order[order.length - 1];
        else next = order[Math.min(order.length - 1, Math.max(0, position + direction))];
        scrollOnActiveRef.current = true;
        setActive(next);
      },
      [showSelectAll, selectAllDisabled, filtered, isRowDisabled, active]
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setSearch(next);
      const term = next.trim();
      const list = term ? options.filter((option) => filterFn(option, term)) : options;
      scrollOnActiveRef.current = true;
      setActive(firstEnabledIndex(list));
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          moveActive(1);
          break;
        case "ArrowUp":
          e.preventDefault();
          moveActive(-1);
          break;
        case "Enter":
          e.preventDefault();
          activateKey(active);
          break;
        case " ":
          // Espace coche seulement quand la recherche est vide ; sinon elle s'écrit dans le champ.
          if (search === "" && active !== null) {
            e.preventDefault();
            activateKey(active);
          }
          break;
        case "Backspace":
          if (search === "" && values.length > 0) {
            e.preventDefault();
            commit(values.slice(0, -1));
          }
          break;
        case "Tab":
          // Le menu ne contient qu'un champ : Tab le ferme et rend le focus au déclencheur.
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
          break;
      }
    };

    // Ligne active visible quand elle change au clavier (pas au survol).
    React.useEffect(() => {
      if (!open || active === null || !scrollOnActiveRef.current) return;
      const element = document.getElementById(active === SELECT_ALL ? `${baseId}-all` : optionId(active));
      element?.scrollIntoView?.({ block: "nearest" });
    }, [open, active, baseId, optionId]);

    // ---------- déclencheur ----------
    const [isHovered, setIsHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);
    const sizeStyles = getSelectTriggerSizeStyles(size);
    const surfaceBg = getSelectTriggerSurfaceBg(bg, disabled);
    const hasValues = values.length > 0;
    const canClear = allowClear && hasValues && !open && !disabled;

    const removeValue = (v: string) => {
      commit(values.filter((x) => x !== v));
      triggerRef.current?.focus();
    };

    const handleTriggerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;
      // Croix d'un tag ou bouton d'effacement : leur propre clic suffit.
      const target = e.target as HTMLElement;
      if (target.closest("button")) return;
      // Ouvre au pointerdown, comme Select : le menu modal rend le reste de la page inerte,
      // le clic qui suit ne peut donc pas le rouvrir après une fermeture.
      e.preventDefault();
      setOpen(!open);
    };

    const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Backspace" && hasValues) {
        e.preventDefault();
        commit(values.slice(0, -1));
      }
    };

    // ---------- résumé « +N » ----------
    const tagsRef = React.useRef<HTMLDivElement>(null);
    const measureRef = React.useRef<HTMLDivElement>(null);
    const [visibleCount, setVisibleCount] = React.useState(values.length);
    const [layoutTick, setLayoutTick] = React.useState(0);
    const measured = values.slice(0, MAX_MEASURED_TAGS);

    React.useLayoutEffect(() => {
      if (size === "small") return;
      const container = tagsRef.current;
      const measure = measureRef.current;
      if (!container || !measure) return;
      const tags = Array.from(measure.querySelectorAll<HTMLElement>("[data-measure-tag]"));
      const plus = measure.querySelector<HTMLElement>("[data-measure-plus]");
      const available = container.clientWidth;
      // Pas encore de largeur (zone masquée au montage) : tout afficher, le ResizeObserver recalculera.
      if (available === 0) {
        setVisibleCount(values.length);
        return;
      }
      const plusWidth = plus?.offsetWidth ?? 0;
      let used = 0;
      let fit = 0;
      for (let i = 0; i < tags.length; i++) {
        const next = used + (i > 0 ? TAG_GAP_PX : 0) + tags[i].offsetWidth;
        const remaining = values.length - (i + 1);
        const reserve = remaining > 0 ? TAG_GAP_PX + plusWidth : 0;
        if (next + reserve > available) break;
        used = next;
        fit = i + 1;
      }
      setVisibleCount(values.length === 0 ? 0 : Math.max(1, fit));
    }, [values, size, layoutTick, labelOf]);

    React.useEffect(() => {
      const container = tagsRef.current;
      if (!container || typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(() => setLayoutTick((n) => n + 1));
      observer.observe(container);
      return () => observer.disconnect();
    }, []);

    const shownValues = values.slice(0, visibleCount);
    const hiddenValues = values.slice(visibleCount);

    const palette = React.useMemo(() => getMenuPalette(bg), [bg]);
    const rowClass = size === "small" ? "h-[25px] px-2 text-xs" : "h-8 px-3 text-sm";

    if (debug) {
      console.log("[MultiSelect]", {
        bg,
        open,
        values,
        search,
        active,
        filteredCount: filtered.length,
        visibleCount,
        atMax,
        selectAllDisabled,
      });
    }

    const activeDescendant =
      active === null ? undefined : active === SELECT_ALL ? `${baseId}-all` : optionId(active);

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen} modal>
        <PopoverPrimitive.Anchor asChild>
          <div
            ref={triggerRef}
            id={id}
            role="combobox"
            tabIndex={disabled ? -1 : 0}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={open ? listId : undefined}
            aria-disabled={disabled || undefined}
            aria-invalid={ariaInvalid}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            data-state={open ? "open" : "closed"}
            data-disabled={disabled ? "" : undefined}
            data-placeholder={hasValues ? undefined : ""}
            data-size={size}
            className={cn(
              SELECT_TRIGGER_BASE_CLASSES,
              sizeStyles.trigger,
              getSelectTriggerBackgroundStyles(bg, disabled),
              disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              className
            )}
            onPointerDown={handleTriggerPointerDown}
            onKeyDown={handleTriggerKeyDown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setIsPressed(false);
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
          >
            <div ref={tagsRef} className="relative flex min-w-0 flex-1 items-center overflow-hidden">
              {!hasValues ? (
                <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                  {placeholderText}
                </span>
              ) : size === "small" ? (
                <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-xs">
                  {t("multiSelect.selectedCount", { count: values.length })}
                </span>
              ) : (
                // Les tags reprennent le fond du déclencheur, pas celui de la page (sinon tag et déclencheur se confondent).
                <BgProvider value={surfaceBg}>
                  <div
                    data-bg={surfaceBg}
                    className="multi-select-tags flex min-w-0 flex-1 items-center gap-[4px]"
                    data-testid="multi-select-tags"
                  >
                    {shownValues.map((v) => (
                      <TagText
                        key={v}
                        title={labelOf(v)}
                        disabled={disabled}
                        className="shrink-0"
                        onRemove={(e) => {
                          e.stopPropagation();
                          removeValue(v);
                        }}
                      >
                        {labelOf(v)}
                      </TagText>
                    ))}
                    {hiddenValues.length > 0 && (
                      <span
                        className="tag-text inline-flex shrink-0 items-center rounded-[10px] px-2 py-[2px] text-[9px] leading-[16px]"
                        title={t("multiSelect.more", {
                          count: hiddenValues.length,
                          labels: hiddenValues.map(labelOf).join(", "),
                        })}
                        data-testid="multi-select-more"
                      >
                        +{hiddenValues.length}
                      </span>
                    )}
                    {/* Calque de mesure, invisible et hors de l'ordre de tabulation. */}
                    <div
                      ref={measureRef}
                      aria-hidden="true"
                      className="pointer-events-none invisible absolute left-0 top-0 flex items-center gap-[4px]"
                    >
                      {measured.map((v) => (
                        <TagText key={v} data-measure-tag="" className="shrink-0">
                          {labelOf(v)}
                        </TagText>
                      ))}
                      <span
                        data-measure-plus=""
                        className="tag-text inline-flex shrink-0 items-center rounded-[10px] px-2 py-[2px] text-[9px] leading-[16px]"
                      >
                        +{values.length}
                      </span>
                    </div>
                  </div>
                </BgProvider>
              )}
            </div>
            <div className="ml-2 shrink-0">
              {canClear ? (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={t("multiSelect.clear")}
                  className={cn(
                    SELECT_TRIGGER_ICON_BUTTON_BASE_CLASSES,
                    sizeStyles.button,
                    getSelectTriggerIconButtonStyles(bg, { isOpen: open, isPressed, isHovered, discrete }),
                    "cursor-pointer"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    commit([]);
                    triggerRef.current?.focus();
                  }}
                >
                  <span className={cn("flex items-center justify-center", sizeStyles.iconWrapper)}>
                    <Icon name="X" size={sizeStyles.iconSize} />
                  </span>
                </button>
              ) : (
                <div
                  aria-hidden="true"
                  className={cn(
                    SELECT_TRIGGER_ICON_BUTTON_BASE_CLASSES,
                    sizeStyles.button,
                    getSelectTriggerIconButtonStyles(bg, { isOpen: open, isPressed, isHovered, discrete })
                  )}
                >
                  <span className={cn("flex items-center justify-center", sizeStyles.iconWrapper)}>
                    <Icon name={open ? "ArrowUp" : "ArrowDown"} size={sizeStyles.iconSize} />
                  </span>
                </div>
              )}
            </div>
          </div>
        </PopoverPrimitive.Anchor>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            data-bg={bg || undefined}
            data-multi-select-menu=""
            sideOffset={5}
            collisionPadding={collisionPadding}
            align="start"
            className={cn(
              "z-50 flex flex-col overflow-hidden rounded-none border p-0 shadow-lg",
              "w-[var(--radix-popover-trigger-width)] max-h-[var(--radix-popover-content-available-height)]",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              palette.menu,
              popoverClassName
            )}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              searchRef.current?.focus();
            }}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              // Rend le focus au déclencheur, sauf s'il est déjà parti sur un autre contrôle. Le piège de focus
              // d'une Modal ou d'un SidePanel le renvoie sur sa fenêtre quand le champ de recherche disparaît :
              // un conteneur du déclencheur compte comme « pas encore placé ».
              const trigger = triggerRef.current;
              const focused = document.activeElement;
              if (!trigger) return;
              if (!focused || focused === document.body || !focused.isConnected || focused.contains(trigger)) {
                trigger.focus();
              }
            }}
          >
            <div className={cn("shrink-0 border-b p-2", palette.separator)}>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder={searchPlaceholderText}
                aria-label={searchPlaceholderText}
                aria-controls={listId}
                aria-activedescendant={activeDescendant}
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
                className={cn(
                  "w-full rounded-full border-0 font-light outline-none focus:outline-none focus:ring-0",
                  size === "small" ? "h-[25px] px-2 text-xs" : "h-[30px] px-3 text-sm",
                  palette.search
                )}
              />
            </div>

            <div
              id={listId}
              role="listbox"
              aria-multiselectable="true"
              aria-label={ariaLabel}
              aria-labelledby={ariaLabel ? undefined : ariaLabelledBy}
              className={cn("min-h-0 flex-1 overflow-y-auto py-1", menuMaxHeight)}
            >
              {showSelectAll && (
                <div
                  id={`${baseId}-all`}
                  role="option"
                  aria-selected={allVisibleSelected}
                  aria-disabled={selectAllDisabled || undefined}
                  data-active={active === SELECT_ALL || undefined}
                  data-select-all=""
                  className={cn(
                    "flex w-full select-none items-center gap-2 border-b font-normal",
                    rowClass,
                    palette.separator,
                    active === SELECT_ALL ? palette.rowActive : palette.row,
                    selectAllDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseMove={() => {
                    if (active !== SELECT_ALL && !selectAllDisabled) onRowActivate(SELECT_ALL);
                  }}
                  onClick={() => {
                    if (!selectAllDisabled) toggleAllVisible();
                  }}
                >
                  <CheckBox
                    state={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                    checkClass={active === SELECT_ALL ? palette.checkActive : palette.check}
                  />
                  <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {allVisibleSelected ? t("multiSelect.deselectAll") : t("multiSelect.selectAll")}
                  </span>
                </div>
              )}
              {filtered.map((option, index) => (
                <MultiSelectRow
                  key={option.value}
                  id={optionId(index)}
                  index={index}
                  option={option}
                  checked={selectedSet.has(option.value)}
                  active={active === index}
                  disabled={isRowDisabled(option)}
                  palette={palette}
                  rowClass={rowClass}
                  onToggle={onRowToggle}
                  onActivate={onRowActivate}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className={cn("px-3 pb-3 pt-1 text-center text-sm", palette.muted)}>{noResultsText}</div>
            )}
            {maxSelected !== undefined && atMax && (
              <div role="status" className={cn("shrink-0 border-t px-3 py-1 text-xs", palette.separator, palette.muted)}>
                {t("multiSelect.maxReached", { max: maxSelected })}
              </div>
            )}
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
