
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast as sonnerToast } from "sonner"
import { IconProvider } from "./icon-provider"
import { Spinner } from "./spinner"

type ToasterProps = React.ComponentProps<typeof Sonner> & {
  defaultDuration?: number
  debug?: boolean
}

const Toaster = ({ defaultDuration = 2000, debug = false, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      // Toast de chargement : le Spinner GS remplace le spinner à 12 barres de
      // sonner (qui ignore l'option `icon` d'un toast de type loading).
      icons={{ loading: <Spinner size={16} decorative />, ...props.icons }}
      toastOptions={{
        duration: defaultDuration,
        classNames: {
          toast: "gs-toast group toast group-[.toaster]:shadow-lg rounded-sm px-[30px] py-[20px]",
          title: "text-[1rem] italic font-[300]",
          description: "font-[300]",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          // #2E7D32 : contraste suffisant avec le texte blanc (le vert du
          // système, #89CC52, ne l'est pas). Limité au toast de succès.
          success: "!bg-[#2E7D32] !text-white",
          error: "!bg-red-strong !text-white",
          info: "!bg-pastel-yellow-secondary !text-black",
          warning: "!bg-orange !text-white",
          loading: "!bg-grey !text-black",
        },
      }}
      {...props}
    />
  )
}

type ToastType = "success" | "error" | "warning" | "info" | "loading" | "default"

interface ToastProps {
  /**
   * Identifiant du toast. Un second appel avec le même id met à jour le toast
   * en place (texte, type, icône) au lieu d'en créer un nouveau. Seuls les
   * champs fournis sont modifiés : une mise à jour du titre garde la
   * description et la durée.
   */
  id?: string | number
  title?: string
  description?: string
  type?: ToastType
  /**
   * Durée d'affichage en ms, `Infinity` pour rester jusqu'à la fermeture.
   * Défaut 3000 à la création. Un toast `loading` reste affiché tant qu'il
   * n'est pas mis à jour ou fermé ; passé ensuite en success ou error, son
   * délai de fermeture commence à ce moment-là.
   */
  duration?: number
  action?: React.ReactNode
  debug?: boolean
}

const DEFAULT_TOAST_DURATION = 3000

/** Ferme un toast par son id, ou tous les toasts sans argument. */
const dismissToast = (id?: string | number) => sonnerToast.dismiss(id)

const toast = ({
  id,
  title,
  description,
  type = "default",
  duration,
  action,
  debug = false
}: ToastProps) => {
  // Mise à jour d'un toast existant : sonner fusionne { ...ancien, ...nouveau },
  // un champ envoyé à `undefined` effacerait l'ancien (description) et une
  // durée par défaut écraserait `Infinity`. On n'envoie donc que les champs
  // fournis, et la durée par défaut seulement à la création.
  const isUpdate = id !== undefined && sonnerToast.getToasts().some((t) => t.id === id)
  // Déterminer quelle icône utiliser en fonction du type de toast
  const getIcon = () => {
    switch (type) {
      case "success": 
        return <IconProvider icon="ToastSuccessIcon" size={16} />;
      case "error":
        return <IconProvider icon="ToastErrorIcon" size={16} />;
      case "warning":
      case "info":
      case "loading":
      default:
        return null;
    }
  };

  // Créer une fonction action qui loggue si le mode debug est activé
  const actionWithDebug = action && debug ? 
    <div onClick={() => {
      console.log(`[Toast Debug] Action clicked for toast: ${title}`);
      // Si action est un React Element avec un onClick, on l'exécute également
      const originalOnClick = (action as React.ReactElement)?.props?.onClick;
      if (typeof originalOnClick === 'function') {
        originalOnClick();
      }
    }}>
      {action}
    </div> 
    : action;

  const toastFunction = type === "success" 
    ? sonnerToast.success 
    : type === "error" 
    ? sonnerToast.error 
    : type === "warning" 
    ? sonnerToast.warning
    : type === "info" 
    ? sonnerToast.info
    : type === "loading"
    ? sonnerToast.loading
    : sonnerToast;

  // Passer l'icône personnalisée si disponible
  const icon = getIcon();
  
  if (debug) {
    console.log(`[Toast Debug] Creating toast: ${type} - ${title}`);
  }
  
  const options: Parameters<typeof sonnerToast>[1] = { icon }
  if (id !== undefined) options.id = id
  if (description !== undefined) options.description = description
  if (actionWithDebug !== undefined) options.action = actionWithDebug
  if (duration !== undefined) options.duration = duration
  else if (!isUpdate) options.duration = DEFAULT_TOAST_DURATION
  // `sonnerToast()` ne pose pas de type : sans lui, une mise à jour vers
  // "default" garderait le type précédent.
  if (type === "default") (options as { type?: string }).type = "default"

  return toastFunction(title, options);
};

export { Toaster, toast, dismissToast, sonnerToast }
export type { ToastProps, ToastType }
