
import { useState, useCallback } from "react";

type ToastType = "default" | "success" | "error" | "warning" | "info";

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: React.ReactNode;
  debug?: boolean;
};

type ToastState = {
  toasts: ToastProps[];
};

type ToastOptions = Omit<ToastProps, "id">;

const useToast = () => {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  const toast = useCallback((options: ToastOptions = {}) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastProps = {
      id,
      title: options.title,
      description: options.description,
      type: options.type || "default",
      duration: options.duration || 5000,
      action: options.action,
      debug: options.debug || false,
    };

    if (newToast.debug) {
      console.log(`[Toast Debug] Creating toast with id: ${id}`, newToast);
    }

    setState((prev) => ({
      toasts: [...prev.toasts, newToast],
    }));

    return id;
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      setState((prev) => {
        const toastToRemove = prev.toasts.find(t => t.id === toastId);
        if (toastToRemove?.debug) {
          console.log(`[Toast Debug] Dismissing toast with id: ${toastId}`);
        }
        return {
          toasts: prev.toasts.filter((toast) => toast.id !== toastId),
        };
      });
    } else {
      setState({ toasts: [] });
    }
  }, []);

  return {
    toast,
    dismiss,
    toasts: state.toasts,
  };
};

export { useToast, type ToastOptions };

// Create a simple toast function that can be used without hooks
let toastCallback: ((options: ToastOptions) => string) | null = null;

export const setToastCallback = (callback: (options: ToastOptions) => string) => {
  toastCallback = callback;
};

export const toast = (options: ToastOptions = {}) => {
  if (toastCallback) {
    return toastCallback(options);
  }
  console.warn("Toast not available outside of React component tree");
  return "";
};
