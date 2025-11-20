import React from 'react';
import { cn } from '@/lib/utils';
import { useBgContext } from '@/components/layout/BgContext';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  /** Variant du lien (pour usage futur) */
  variant?: 'default';
  
  /** Classes Tailwind supplémentaires */
  className?: string;
  
  /** Utiliser comme bouton (onClick au lieu de href) */
  asButton?: boolean;
  
  /** Handler onClick pour le cas bouton */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Composant Link qui s'adapte automatiquement au contexte de fond (black/white/grey)
 * 
 * Caractéristiques :
 * - text-sm italic par défaut
 * - Barre sous le texte séparée de 2px (pas un underline classique)
 * - Couleur adaptée au fond (blanc sur noir, noir sur blanc/gris)
 * 
 * @example
 * ```tsx
 * <Link href="/page">Aller à la page</Link>
 * ```
 * 
 * @example Avec onClick (comme bouton)
 * ```tsx
 * <Link asButton onClick={handleClick}>Action</Link>
 * ```
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'default', asButton, onClick, children, ...props }, ref) => {
    const bgContext = useBgContext();
    
    // Déterminer la couleur du texte selon le fond
    // Si le contexte n'est pas disponible, on assume un fond noir (cas ActionBar)
    const textColorClass = 
      bgContext === 'black' || bgContext === undefined
        ? 'text-white hover:text-grey-stronger' 
        : 'text-black hover:text-grey-stronger';
    
    // Si utilisé comme bouton, utiliser un span au lieu d'un <a>
    if (asButton) {
      const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) {
          onClick(e);
        }
      };
      
      return (
        <span
          onClick={handleClick}
          className={cn(
            // Styles par défaut
            'text-sm italic',
            'cursor-pointer',
            'transition-colors',
            'inline-block',
            
            // Couleur selon le fond
            textColorClass,
            
            // Barre sous le texte séparée de 2px
            'relative',
            'after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[0.5px] after:bg-current',
            
            className
          )}
        >
          {children}
        </span>
      );
    }
    
    return (
      <a
        ref={ref}
        className={cn(
          // Styles par défaut
          'text-sm italic',
          'cursor-pointer',
          'transition-colors',
          'inline-block',
          
          // Couleur selon le fond
          textColorClass,
          
          // Barre sous le texte séparée de 2px
          'relative',
          'after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[0.5px] after:bg-current',
          
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

Link.displayName = 'Link';

