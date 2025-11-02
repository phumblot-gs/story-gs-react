import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { VStack, VStackProps } from './VStack';
import { HStack } from './HStack';

type BgContext = 'white' | 'grey' | 'black';

export interface FullFrameProps {
  /** Enfants du body (sera dans un VStack) */
  children: ReactNode;

  /** Callback appelé lors du clic sur le bouton de fermeture */
  onClose?: () => void;

  /** Classes Tailwind supplémentaires pour le conteneur principal */
  className?: string;

  /** Props du VStack pour le body */
  bodyProps?: Omit<VStackProps, 'children'>;

  /** Background du header (défaut: "white") */
  headerBg?: BgContext;

  /** Background du body (défaut: "white") */
  bodyBg?: BgContext;

  /** Contenu personnalisé du header. Si non fourni, affiche uniquement le bouton de fermeture */
  headerContent?: ReactNode;
}

/**
 * Composant FullFrame pour affichage en mode popup sur toute la fenêtre
 *
 * Le composant comprend :
 * - Un header fixe de 60px avec un bouton de fermeture
 * - Un body qui prend tout le reste de l'écran et utilise un VStack
 *
 * @example
 * ```tsx
 * <FullFrame onClose={() => setIsOpen(false)}>
 *   <h1>Contenu</h1>
 *   <p>Body content</p>
 * </FullFrame>
 * ```
 *
 * @example Header et body avec backgrounds différents
 * ```tsx
 * <FullFrame 
 *   headerBg="white" 
 *   bodyBg="grey"
 *   onClose={() => setIsOpen(false)}
 * >
 *   <h1>Contenu</h1>
 * </FullFrame>
 * ```
 *
 * @example Header personnalisé
 * ```tsx
 * <FullFrame 
 *   headerContent={
 *     <>
 *       <h2>Titre</h2>
 *       <Button onClick={handleAction}>Action</Button>
 *     </>
 *   }
 *   onClose={() => setIsOpen(false)}
 * >
 *   <h1>Contenu</h1>
 * </FullFrame>
 * ```
 */
export function FullFrame({
  children,
  onClose,
  className,
  bodyProps,
  headerBg = 'white',
  bodyBg = 'white',
  headerContent,
}: FullFrameProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        'flex flex-col',
        'bg-white',
        className
      )}
    >
      {/* Header */}
      <HStack
        bg={headerBg}
        align="center"
        className={cn(
          'h-12',
          'px-3 py-2',
          'justify-between',
          'shrink-0'
        )}
      >
        {headerContent ? (
          <>
            <div className="flex-1">{headerContent}</div>
            {onClose && (
              <Button
                size="large"
                variant="ghost"
                onClick={onClose}
                aria-label="Fermer"
                className="p-0 w-8 h-8"
              >
                <Icon name="X" size={14} />
              </Button>
            )}
          </>
        ) : (
          onClose && (
            <Button
              size="large"
              variant="ghost"
              onClick={onClose}
              aria-label="Fermer"
              className="p-0 w-8 h-8 ml-auto"
            >
              <Icon name="X" size={14} />
            </Button>
          )
        )}
      </HStack>

      {/* Body */}
      <VStack
        bg={bodyBg}
        {...bodyProps}
        className={cn(
          'flex-1',
          'overflow-auto',
          bodyProps?.className
        )}
      >
        {children}
      </VStack>
    </div>
  );
}

