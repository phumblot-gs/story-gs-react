import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Layout, VStack, HStack } from "@/components/layout";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode | (() => React.ReactNode);
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  maxHeight?: string;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  footer,
  className,
  overlayClassName,
  contentClassName,
  footerClassName,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  maxHeight = "90vh",
  maxWidth = "90vw",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        overlayClassName
      )}
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-overlay-20" />

      {/* Modal content */}
      <VStack
        ref={modalRef}
        bg="white"
        className={cn("relative z-10 shadow-lg", className)}
        style={{ maxHeight, maxWidth }}
      >
        {/* Main content */}
        <Layout
          scroll="vertical"
          className={cn("flex-1", contentClassName)}
        >
          {children}
        </Layout>

        {/* Footer */}
        {footer && (
          <HStack
            justify="end"
            align="center"
            gap={3}
            padding={4}
            className={cn("border-t border-grey", footerClassName)}
          >
            {typeof footer === 'function' ? footer() : footer}
          </HStack>
        )}
      </VStack>
    </div>
  );
};
