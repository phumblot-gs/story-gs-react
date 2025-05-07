
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast as sonnerToast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:border-border group-[.toaster]:shadow-lg px-[30px] py-[20px]",
          description: "group-[.toast]:text-muted-foreground",
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
}

const toast = ({
  title,
  description,
  type = "default",
  duration = 5000,
  action
}: ToastProps) => {
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

  return toastFunction(title, {
    description,
    duration,
    action
  });
};

export { Toaster, toast, sonnerToast }
