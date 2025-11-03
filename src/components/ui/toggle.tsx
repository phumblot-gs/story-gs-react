import * as React from "react";
import { Button, ButtonProps, ButtonVariant, ButtonSize } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface ToggleProps extends Omit<ButtonProps, 'variant' | 'size' | 'onClick' | 'onFocus' | 'onBlur'> {
  /** Variant du bouton (hérite de Button) */
  variant?: ButtonVariant;
  
  /** Taille du bouton (hérite de Button) */
  size?: ButtonSize;
  
  /** État actif du toggle (similaire à ButtonStatus.isActive) */
  isActive?: boolean;
  
  /** Callback appelé lors du clic */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  
  /** Callback appelé lors du focus */
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  
  /** Callback appelé lors du blur */
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  
  /** Désactive le toggle */
  disabled?: boolean;
  
  /** Mode debug */
  debug?: boolean;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ 
    isActive = false,
    onClick,
    onFocus,
    onBlur,
    disabled = false,
    debug = false,
    variant,
    size,
    className,
    children,
    ...props 
  }, ref) => {
    // Normaliser la taille pour déterminer la taille de l'icône
    const normalizedSize = size || "medium";
    
    // Taille de l'icône selon la taille du bouton
    const iconSize = normalizedSize === "small" ? 10 : normalizedSize === "large" ? 14 : 12;
    
    // Si pas de children, afficher l'icône Switch par défaut
    const displayChildren = children || <Icon name="Switch" size={iconSize} />;
    
    // Debug mode : wrapper pour onClick avec log
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      
      e.stopPropagation()
      
      if (debug) {
        console.log('[Toggle Click]', {
          isActive,
          disabled,
          variant,
          size,
          event: e,
        });
      }
      
      // Appeler le onClick original
      onClick?.(e);
    }, [disabled, debug, isActive, variant, size, onClick]);
    
    // Debug mode : wrapper pour onFocus avec log
    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      
      if (debug) {
        console.log('[Toggle Focus]', {
          isActive,
          disabled,
          variant,
          size,
          event: e,
        });
      }
      onFocus?.(e);
    }, [debug, isActive, disabled, variant, size, onFocus]);
    
    // Debug mode : wrapper pour onBlur avec log
    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      
      if (debug) {
        console.log('[Toggle Blur]', {
          isActive,
          disabled,
          variant,
          size,
          event: e,
        });
      }
      onBlur?.(e);
    }, [debug, isActive, disabled, variant, size, onBlur]);
    
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={disabled}
        debug={false}
        className={cn(
          "toggle",
          // Appliquer les styles d'état actif similaires à ButtonStatus
          isActive && "toggle-active",
          className
        )}
        data-state={isActive ? "on" : "off"}
        aria-pressed={isActive}
        onClick={handleClick}
        onFocus={debug ? handleFocus : onFocus}
        onBlur={debug ? handleBlur : onBlur}
        {...props}
      >
        {displayChildren}
        {debug && (
          <span className="absolute -top-6 left-0 text-xs bg-pink text-white px-1 rounded whitespace-nowrap z-10">
            {isActive ? 'on' : 'off'}
          </span>
        )}
      </Button>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle };
