
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast as sonnerToast } from "sonner"
import { IconProvider } from "./icon-provider"

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
      toastOptions={{
        duration: defaultDuration,
        classNames: {
          toast: "group toast group-[.toaster]:shadow-lg rounded-sm px-[30px] py-[20px]",
          title: "text-[1rem] italic font-[300]",
          description: "font-[300]",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "!bg-green !text-white",
          error: "!bg-red-strong !text-white",
          info: "!bg-pastel-yellow-secondary !text-black",
          warning: "!bg-orange !text-white",
          loading: "!bg-grey !text-white",
        },
      }}
      {...props}
    />
  )
}

type ToastType = "success" | "error" | "warning" | "info" | "loading" | "default"

interface ToastProps {
  title?: string
  description?: string
  type?: ToastType
  duration?: number
  action?: React.ReactNode
  debug?: boolean
}

const toast = ({
  title,
  description,
  type = "default",
  duration = 3000,
  action,
  debug = false
}: ToastProps) => {
  // Déterminer quelle icône utiliser en fonction du type de toast
  const getIcon = () => {
    switch (type) {
      case "success": 
        return <IconProvider icon="ToastSuccessIcon" className="mr-[20px]" size={16} />;
      case "error":
        return <IconProvider icon="ToastErrorIcon" className="mr-[20px]" size={16} />;
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
  
  return toastFunction(title, {
    description,
    duration,
    action: actionWithDebug,
    icon
  });
};

export { Toaster, toast, sonnerToast }
