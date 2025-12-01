"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { useBgContext } from "@/components/layout/BgContext";
import { Input } from "./input";
import { Icon } from "./icons";
import { VStack } from "@/components/layout";

export interface SelectAutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: React.ReactNode;
  /**
   * Texte utilisé pour la recherche (optionnel)
   * Si non fourni, la recherche se fait sur le label
   */
  searchText?: string;
}

export interface SelectAutocompleteProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "onSelect" | "size" | "value"> {
  /**
   * Liste d'options pour le mode local
   */
  options?: SelectAutocompleteOption[];

  /**
   * Mode de recherche
   * - "local": Filtre les options fournies
   * - "remote": Requête serveur via onSearch
   * @default "local"
   */
  searchMode?: "local" | "remote";

  /**
   * Callback pour recherche serveur
   * Reçoit le terme de recherche et retourne les options
   */
  onSearch?: (searchTerm: string) => Promise<SelectAutocompleteOption[]>;

  /**
   * Délai avant déclenchement de onSearch (ms)
   * @default 300
   */
  searchDebounceMs?: number;

  /**
   * Fonction de filtrage personnalisée (mode local)
   */
  filterFunction?: (option: SelectAutocompleteOption, searchTerm: string) => boolean;

  /**
   * Callback appelé lors de la sélection d'une option
   */
  onSelect?: (option: SelectAutocompleteOption) => void;

  /**
   * Callback appelé lors du changement de valeur de l'input
   */
  onChange?: (value: string) => void;

  /**
   * Ouvre automatiquement le popover au focus
   * @default true
   */
  openOnFocus?: boolean;

  /**
   * Ferme automatiquement après sélection
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Permet de sélectionner une valeur qui n'est pas dans les options
   * @default false
   */
  allowCustomValue?: boolean;

  /**
   * Message affiché quand aucune option ne correspond
   * @default "Aucun résultat"
   */
  noResultsText?: string;

  /**
   * Message affiché pendant le chargement (mode remote uniquement)
   * @default "Recherche en cours..."
   */
  loadingText?: string;

  /**
   * Placeholder pour le champ de recherche
   */
  searchPlaceholder?: string;

  /**
   * Classes CSS pour le popover
   */
  popoverClassName?: string;

  /**
   * Classes CSS pour la liste
   */
  listClassName?: string;

  /**
   * Classes CSS pour les items
   */
  itemClassName?: string;

  /**
   * Taille du composant
   * @default "normal"
   */
  size?: "normal" | "small";

  /**
   * Valeur contrôlée
   */
  value?: string;

  /**
   * Maximum height of the dropdown menu.
   * Default: `max-h-[calc(100vh-2rem)]` to adapt to available space.
   * You can customize with Tailwind classes like `max-h-[40vh]`, `max-h-96`, etc.
   * The menu will automatically enable vertical scrolling when content exceeds this height.
   */
  menuMaxHeight?: string;

  /**
   * Mode debug pour les logs
   */
  debug?: boolean;
}

const SelectAutocomplete = React.forwardRef<HTMLInputElement, SelectAutocompleteProps>(
  (
    {
      options = [],
      searchMode = "local",
      onSearch,
      searchDebounceMs = 300,
      filterFunction,
      onSelect,
      onChange,
      openOnFocus = true,
      closeOnSelect = true,
      allowCustomValue = false,
      noResultsText = "Aucun résultat",
      loadingText = "Recherche en cours...",
      searchPlaceholder,
      placeholder,
      popoverClassName,
      listClassName,
      itemClassName,
      size = "normal",
      menuMaxHeight = "max-h-[calc(100vh-2rem)]",
      debug = false,
      value: valueProp,
      defaultValue,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const bg = useBgContext();
    const [internalValue, setInternalValue] = React.useState(defaultValue || "");
    const [searchText, setSearchText] = React.useState(""); // Texte de recherche saisi par l'utilisateur
    const [isOpen, setIsOpen] = React.useState(false);
    const [filteredOptions, setFilteredOptions] = React.useState<SelectAutocompleteOption[]>(options);
    const [isSearching, setIsSearching] = React.useState(false);
    const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const searchTimeoutRef = React.useRef<NodeJS.Timeout>();
    const abortControllerRef = React.useRef<AbortController>();
    const [popoverWidth, setPopoverWidth] = React.useState<number | undefined>(undefined);

    // Valeur sélectionnée (ID)
    const selectedValue = valueProp !== undefined ? String(valueProp) : internalValue;
    
    // Trouver l'option sélectionnée pour obtenir son label
    const selectedOption = React.useMemo(() => {
      return options.find(opt => opt.value === selectedValue);
    }, [options, selectedValue]);

    // Texte à afficher dans l'input : label de l'option sélectionnée ou texte de recherche
    const displayText = React.useMemo(() => {
      if (isOpen && searchText) {
        // Pendant la recherche, afficher le texte saisi
        return searchText;
      }
      // Sinon, afficher le label de l'option sélectionnée
      return selectedOption?.label || "";
    }, [isOpen, searchText, selectedOption]);

    const hasValue = Boolean(selectedValue);

    // Combiner refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Fonction de filtrage par défaut
    // Utilise searchText si fourni, sinon label
    const defaultFilterFunction = React.useCallback(
      (option: SelectAutocompleteOption, searchTerm: string) => {
        const textToSearch = option.searchText || option.label;
        return textToSearch.toLowerCase().includes(searchTerm.toLowerCase());
      },
      []
    );

    const filterFn = filterFunction || defaultFilterFunction;

    // Filtrage local
    const filterLocalOptions = React.useCallback(
      (searchTerm: string) => {
        if (!searchTerm.trim()) {
          setFilteredOptions(options);
          return;
        }
        const filtered = options.filter((option) => filterFn(option, searchTerm));
        setFilteredOptions(filtered);
      },
      [options, filterFn]
    );

    // Recherche remote
    const performRemoteSearch = React.useCallback(
      async (searchTerm: string) => {
        if (!onSearch) return;

        // Annuler la requête précédente
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Créer un nouveau AbortController
        abortControllerRef.current = new AbortController();

        setIsSearching(true);

        try {
          const results = await onSearch(searchTerm);
          // Vérifier si la requête n'a pas été annulée
          if (!abortControllerRef.current.signal.aborted) {
            setFilteredOptions(results);
            setIsSearching(false);
          }
        } catch (error) {
          if (!abortControllerRef.current.signal.aborted) {
            if (debug) {
              console.error("[SelectAutocomplete] Search error:", error);
            }
            setIsSearching(false);
            setFilteredOptions([]);
          }
        }
      },
      [onSearch, debug]
    );

    // Gestion du changement de valeur (texte saisi dans l'input)
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchText = e.target.value;
        setSearchText(newSearchText);

        // Ne pas changer la value sélectionnée pendant la recherche
        // La value ne change que lors de la sélection d'une option

        // Ouvrir le popover si fermé
        if (!isOpen) {
          setIsOpen(true);
        }

        // Réinitialiser l'index surligné
        setHighlightedIndex(-1);

        // Annuler le debounce précédent
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        if (searchMode === "local") {
          filterLocalOptions(newSearchText);
        } else {
          // Debounce pour la recherche remote
          searchTimeoutRef.current = setTimeout(() => {
            performRemoteSearch(newSearchText);
          }, searchDebounceMs);
        }
      },
      [isOpen, searchMode, filterLocalOptions, performRemoteSearch, searchDebounceMs]
    );

    // Gestion du focus
    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        props.onFocus?.(e);
        if (openOnFocus && !disabled) {
          setIsOpen(true);
          // Réinitialiser le texte de recherche au focus
          setSearchText("");
          if (searchMode === "local") {
            setFilteredOptions(options);
          }
        }
      },
      [props, openOnFocus, disabled, searchMode, options]
    );

    // Gestion du blur - ne pas fermer si on clique dans le popover
    const handleBlur = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        props.onBlur?.(e);
        // Ne pas fermer immédiatement - laisser onInteractOutside gérer
      },
      [props]
    );

    // Gestion de la sélection
    const handleSelect = React.useCallback(
      (option: SelectAutocompleteOption) => {
        // Mettre à jour la value (ID) sélectionnée
        if (valueProp === undefined) {
          setInternalValue(option.value);
        }
        // Retourner la value dans onChange, pas le label
        onChange?.(option.value);
        onSelect?.(option);
        
        // Réinitialiser le texte de recherche
        setSearchText("");

        if (closeOnSelect) {
          setIsOpen(false);
          inputRef.current?.blur();
        }
        setHighlightedIndex(-1);
      },
      [valueProp, onChange, onSelect, closeOnSelect]
    );

    // Navigation clavier
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown?.(e);

        if (disabled) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
            } else {
              setHighlightedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : prev
              );
            }
            break;

          case "ArrowUp":
            e.preventDefault();
            if (isOpen) {
              setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
            }
            break;

          case "Enter":
            e.preventDefault();
            if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
              const option = filteredOptions[highlightedIndex];
              if (!option.disabled) {
                handleSelect(option);
              }
            } else if (allowCustomValue && searchText) {
              // Permettre la sélection de la valeur personnalisée
              const customOption: SelectAutocompleteOption = {
                value: searchText,
                label: searchText,
              };
              handleSelect(customOption);
            }
            break;

          case "Escape":
            e.preventDefault();
            setIsOpen(false);
            setHighlightedIndex(-1);
            setSearchText(""); // Réinitialiser pour afficher le label de l'option sélectionnée
            inputRef.current?.blur();
            break;

          case "Tab":
            setIsOpen(false);
            setHighlightedIndex(-1);
            setSearchText(""); // Réinitialiser pour afficher le label de l'option sélectionnée
            break;
        }
      },
      [
        props,
        disabled,
        isOpen,
        filteredOptions,
        highlightedIndex,
        handleSelect,
        allowCustomValue,
        searchText,
      ]
    );

    // Mettre à jour les options filtrées quand les options changent
    React.useEffect(() => {
      if (searchMode === "local") {
        if (!searchText.trim()) {
          setFilteredOptions(options);
        } else {
          filterLocalOptions(searchText);
        }
      }
    }, [options, searchMode, searchText, filterLocalOptions]);

    // Réinitialiser le texte de recherche quand la value change (depuis l'extérieur)
    React.useEffect(() => {
      if (!isOpen) {
        setSearchText("");
      }
    }, [selectedValue, isOpen]);

    // Scroll vers l'option surlignée
    React.useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const item = listRef.current.children[highlightedIndex] as HTMLElement;
        if (item) {
          item.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      }
    }, [highlightedIndex]);

    // Mettre à jour la largeur du popover quand l'input change de taille
    React.useEffect(() => {
      if (containerRef.current) {
        const updateWidth = () => {
          const width = containerRef.current?.offsetWidth;
          if (width) {
            setPopoverWidth(width);
          }
        };
        updateWidth();
        const resizeObserver = new ResizeObserver(updateWidth);
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
      }
    }, []);

    // Nettoyage
    React.useEffect(() => {
      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }, []);

    // Styles du popover selon le background
    const getPopoverStyles = () => {
      switch (bg) {
        case "white":
        case "grey":
          return "bg-black text-white border-grey-strongest";
        case "black":
          return "bg-white text-black border-grey-lighter";
        default:
          return "bg-white text-black border-grey-lighter";
      }
    };

    // Styles des items selon le background
    const getItemStyles = () => {
      switch (bg) {
        case "white":
          return "bg-black text-white hover:bg-grey-lighter hover:text-black focus:bg-grey-lighter focus:text-black";
        case "grey":
          return "bg-black text-white hover:bg-white hover:text-black focus:bg-white focus:text-black";
        case "black":
          return "bg-black-secondary text-white hover:bg-white hover:text-black focus:bg-white focus:text-black";
        default:
          return "text-black hover:bg-grey-lighter focus:bg-grey-lighter";
      }
    };

    // Styles de taille
    const getSizeStyles = () => {
      if (size === "small") {
        return {
          input: "h-4 text-xs",
          item: "h-4 text-xs px-2 py-1",
        };
      }
      return {
        input: "h-8 text-sm",
        item: "h-4 text-sm px-3 py-2",
      };
    };

    const sizeStyles = getSizeStyles();

    if (debug) {
      console.log("[SelectAutocomplete]", {
        isOpen,
        selectedValue,
        displayText,
        searchText,
        filteredOptionsCount: filteredOptions.length,
        highlightedIndex,
        isSearching,
        searchMode,
      });
    }

    // Gestion de l'interaction en dehors du popover
    const handleInteractOutside = React.useCallback(
      (e: Event) => {
        const target = e.target as HTMLElement;
        // Ne pas fermer si on clique dans l'input ou dans le popover
        if (inputRef.current?.contains(target) || listRef.current?.contains(target)) {
          e.preventDefault();
          return;
        }
        // Fermer seulement si on clique vraiment en dehors
        setIsOpen(false);
        setHighlightedIndex(-1);
        // Réinitialiser le texte de recherche pour afficher le label de l'option sélectionnée
        setSearchText("");
      },
      []
    );

    // Gestion du changement d'état du popover
    const handleOpenChange = React.useCallback((open: boolean) => {
      setIsOpen(open);
      if (!open) {
        setHighlightedIndex(-1);
        // Réinitialiser le texte de recherche pour afficher le label de l'option sélectionnée
        setSearchText("");
      }
    }, []);

    return (
      <PopoverPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverPrimitive.Anchor asChild>
          <div ref={containerRef} className={cn("relative w-full", className)}>
          <Input
            ref={inputRef}
            value={displayText}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={() => {
              // Ouvrir au clic si fermé
              if (!isOpen && !disabled) {
                setIsOpen(true);
                setSearchText("");
                if (searchMode === "local") {
                  setFilteredOptions(options);
                }
              }
            }}
            placeholder={searchPlaceholder || placeholder}
            disabled={disabled}
            className={cn(sizeStyles.input, "pr-8")}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            {...props}
          />

          {/* Icône dropdown/clear */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            {hasValue && !disabled ? (
              <button
                type="button"
                className="pointer-events-auto p-0.5 rounded-full hover:bg-black/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (valueProp === undefined) {
                    setInternalValue("");
                  }
                  onChange?.("");
                  setSearchText("");
                  setFilteredOptions(options);
                  inputRef.current?.focus();
                  // Garder le popover ouvert après clear
                  if (!isOpen) {
                    setIsOpen(true);
                  }
                }}
                onMouseDown={(e) => {
                  // Empêcher le blur de l'input
                  e.preventDefault();
                }}
                aria-label="Effacer"
              >
                <Icon name="X" size={size === "small" ? 8 : 10} />
              </button>
            ) : (
              <Icon
                name={isOpen ? "ArrowUp" : "ArrowDown"}
                size={size === "small" ? 8 : 10}
              />
            )}
          </div>

          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              className={cn(
                "z-50 min-h-16 overflow-hidden rounded-none shadow-lg p-0 popup-action",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2",
                getPopoverStyles(),
                popoverClassName
              )}
              data-bg={bg || undefined}
              sideOffset={5}
              align="start"
              style={{ width: popoverWidth ? `${popoverWidth}px` : undefined }}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={handleInteractOutside}
              onEscapeKeyDown={() => {
                setIsOpen(false);
                setHighlightedIndex(-1);
                setSearchText(""); // Réinitialiser pour afficher le label de l'option sélectionnée
                inputRef.current?.blur();
              }}
            >
              <div
                ref={listRef}
                className={cn(
                  "popup-action overflow-y-auto p-0",
                  menuMaxHeight,
                  listClassName
                )}
                role="listbox"
                onMouseDown={(e) => {
                  // Empêcher le blur de l'input quand on clique dans la liste
                  e.preventDefault();
                }}
              >
                {isSearching ? (
                  <div className="px-3 py-2 text-sm text-center text-grey-stronger">
                    {loadingText}
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-center text-grey-stronger">
                    {noResultsText}
                  </div>
                ) : (
                  <VStack gap={0} padding={0}>
                    {filteredOptions.map((option, index) => (
                      <button
                        key={option.value}
                        type="button"
                        className={cn(
                          "w-full text-left flex items-center gap-2",
                          "transition-colors duration-150",
                          "focus:outline-none focus:ring-0",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          sizeStyles.item,
                          getItemStyles(),
                          highlightedIndex === index && "bg-grey-lighter text-black",
                          itemClassName
                        )}
                        disabled={option.disabled}
                        onClick={() => handleSelect(option)}
                        role="option"
                        aria-selected={highlightedIndex === index}
                      >
                        {option.icon && (
                          <span className="flex-shrink-0">{option.icon}</span>
                        )}
                        <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </VStack>
                )}
              </div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
          </div>
        </PopoverPrimitive.Anchor>
      </PopoverPrimitive.Root>
    );
  }
);

SelectAutocomplete.displayName = "SelectAutocomplete";

export { SelectAutocomplete };


