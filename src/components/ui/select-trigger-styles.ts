/**
 * Styles du déclencheur des listes déroulantes (`SelectTrigger`, `MultiSelect`).
 * Module interne : une seule source pour les fonds, le rond de la flèche et les tailles,
 * pour que les deux composants restent identiques.
 */

export type SelectTriggerBg = "white" | "grey" | "black" | undefined;
export type SelectTriggerSize = "normal" | "small";

/** Fond, texte, bordure et couleur du placeholder du déclencheur selon le fond qui l'entoure. */
export function getSelectTriggerBackgroundStyles(bg: SelectTriggerBg, disabled?: boolean): string {
  if (disabled) {
    // État désactivé - toujours gris peu importe le fond
    return "bg-grey-lighter text-grey-stronger border-grey-lighter data-[placeholder]:text-grey-stronger";
  }

  switch (bg) {
    case "white":
      // Le composant s'affiche sur fond blanc - bordure invisible (même couleur que bg)
      return "bg-grey-lighter text-black border-grey-lighter hover:border-black/50 focus:border-black/50 hover:border-[0.5px] focus:border-[0.5px] data-[placeholder]:text-grey-strongest";
    case "black":
      // Le composant s'affiche sur fond noir - bordure invisible (même couleur que bg)
      // Placeholder en gris clair pour rester lisible sur le trigger sombre.
      return "bg-black-secondary text-white border-black-secondary hover:border-white/50 focus:border-white/50 hover:border-[0.5px] focus:border-[0.5px] data-[placeholder]:text-grey-stronger";
    case "grey":
      // Le composant s'affiche sur fond gris - bordure invisible (même couleur que bg)
      return "bg-white text-black border-white hover:border-black/50 focus:border-black/50 hover:border-[0.5px] focus:border-[0.5px] data-[placeholder]:text-grey-strongest";
    default:
      return "bg-grey-lighter text-black border-grey-lighter hover:border-black/50 focus:border-black/50 hover:border-[0.5px] focus:border-[0.5px] data-[placeholder]:text-grey-strongest";
  }
}

/**
 * Fond du déclencheur exprimé comme un contexte `data-bg`, pour ce qui est posé dessus (tags) :
 * grey-lighter → "grey", white → "white", black-secondary → "black".
 */
export function getSelectTriggerSurfaceBg(bg: SelectTriggerBg, disabled?: boolean): "white" | "grey" | "black" {
  if (disabled) return "grey";
  switch (bg) {
    case "grey":
      return "white";
    case "black":
      return "black";
    case "white":
    default:
      return "grey";
  }
}

export interface SelectTriggerIconState {
  isOpen: boolean;
  isPressed: boolean;
  isHovered: boolean;
  discrete: boolean;
}

/** Rond de l'icône (flèche ou croix) selon le fond et l'état. */
export function getSelectTriggerIconButtonStyles(
  bg: SelectTriggerBg,
  { isOpen, isPressed, isHovered, discrete }: SelectTriggerIconState
): string {
  // État ouvert (liste déroulée) - même pour tous les backgrounds
  if (isOpen) {
    return "bg-blue-primary text-black";
  }

  // État pressé - même pour tous les backgrounds
  if (isPressed) {
    return "bg-black text-blue-primary";
  }

  // État hover - même pour tous les backgrounds
  if (isHovered) {
    return "bg-black text-white";
  }

  // Mode discret : au repos, le rond adopte le fond du trigger pour
  // visuellement disparaître ; seule l'icône reste perceptible.
  if (discrete) {
    switch (bg) {
      case "grey":
        return "bg-white text-black"; // trigger sur grey = fond white
      case "black":
        return "bg-black-secondary text-white"; // trigger sur black = fond black-secondary
      case "white":
      default:
        return "bg-grey-lighter text-black"; // trigger sur white = fond grey-lighter
    }
  }

  // État par défaut selon le background
  switch (bg) {
    case "grey":
      return "bg-grey-lighter text-black";
    case "white":
    case "black":
    default:
      return "bg-white text-black";
  }
}

export interface SelectTriggerSizeStyles {
  trigger: string;
  button: string;
  iconWrapper: string;
  iconSize: number;
}

export function getSelectTriggerSizeStyles(size: SelectTriggerSize): SelectTriggerSizeStyles {
  if (size === "small") {
    return {
      trigger: "h-4 py-0 pl-2 pr-[2px]",
      button: "h-3 w-3",
      iconWrapper: "w-[5px] h-[5px]",
      iconSize: 5,
    };
  }
  return {
    trigger: "h-[30px] py-1 pl-3 pr-[4px]",
    button: "h-4 w-4",
    iconWrapper: "w-[10px] h-[10px]",
    iconSize: 10,
  };
}

/** Classes communes du déclencheur (forme, typo, focus). */
export const SELECT_TRIGGER_BASE_CLASSES =
  "flex w-full items-center justify-between rounded-full border text-sm font-light transition-colors duration-200 focus:outline-none focus:ring-0";

/** Classes communes du rond de l'icône. */
export const SELECT_TRIGGER_ICON_BUTTON_BASE_CLASSES =
  "flex items-center justify-center rounded-full transition-colors duration-200";
