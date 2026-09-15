import type { ButtonMenuAction } from "@/components/ui/button-menu"

/** Selection spans all leaf actions, including closed submenus. */
export function getSelectedMenuValues(actions: ButtonMenuAction[]): string[] {
  return actions.flatMap(action => action.children?.length
    ? getSelectedMenuValues(action.children)
    : action.selected && action.value !== undefined ? [action.value] : [])
}

