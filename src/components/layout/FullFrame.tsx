import { ReactNode, useRef } from 'react';
import { useFullFrameEscape } from '@/hooks/useFullFrameEscape';
import { useFullFrameWheel } from '@/hooks/useFullFrameWheel';
import { ScrollContainerProvider } from './ScrollContainerContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { VStack, VStackProps } from './VStack';
import { HStack } from './HStack';
import { useTranslationSafe } from '@/contexts/TranslationContext';

type BgContext = 'white' | 'grey' | 'black';

export interface FullFrameProps {
  /** Enfants du body (sera dans un VStack) */
  children: ReactNode;

  /** Callback appelé par le bouton de fermeture ou Échap. */
  onClose?: () => void;

  /** Échap ferme uniquement le FullFrame du dessus, si l’événement n’est pas déjà traité. Défaut true. */
  closeOnEscape?: boolean;

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

  /**
   * Marge commune : padding horizontal du header et padding du body, pour que le
   * contenu du header (nom du projet…) soit aligné sur celui du body (stepper,
   * titre…). 4 = 20 px, 6 = 30 px, 8 = 40 px. Sans valeur : rendu historique
   * (header en px-3, body sans padding).
   */
  padding?: 4 | 6 | 8;

  /**
   * Zone fixe en bas (boutons « Précédent / Suivant »…), qui ne défile jamais.
   * Même padding horizontal que le header.
   */
  footer?: ReactNode;

  /** Background du footer (défaut : celui du body). */
  footerBg?: BgContext;

  /** Classes du footer (ex. `border-t border-grey` pour un séparateur). */
  footerClassName?: string;
}

const HEADER_PADDING: Record<4 | 6 | 8, string> = { 4: 'px-4', 6: 'px-6', 8: 'px-8' };
const BODY_PADDING: Record<4 | 6 | 8, string> = { 4: 'p-4', 6: 'p-6', 8: 'p-8' };

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
  closeOnEscape = true,
  className,
  bodyProps,
  headerBg = 'white',
  bodyBg = 'white',
  headerContent,
  padding,
  footer,
  footerBg,
  footerClassName,
}: FullFrameProps) {
  const { t } = useTranslationSafe();
  const frameRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  useFullFrameWheel(frameRef, bodyRef);
  useFullFrameEscape(frameRef, { closeOnEscape, onClose });

  return (
    <div
      ref={frameRef}
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
          // Hauteur minimale de 60 px plutôt que fixe : le header peut porter
          // un contenu plus haut (titre sur deux lignes…).
          'min-h-12',
          padding ? HEADER_PADDING[padding] : 'px-3',
          'py-2',
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
                aria-label={t('button.close')}
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
              aria-label={t('button.close')}
              className="p-0 w-8 h-8 ml-auto"
            >
              <Icon name="X" size={14} />
            </Button>
          )
        )}
      </HStack>

      {/* Body : seule zone qui défile. Fournie par contexte comme conteneur de
          défilement : un PageFillLayout posé dedans s'y adapte (partie haute
          repliable, panneau à la hauteur du body). `container-type: size`
          permet au panneau de se dimensionner en `cqh`. */}
      <ScrollContainerProvider value={bodyRef}>
        <VStack
          bg={bodyBg}
          {...bodyProps}
          ref={bodyRef}
          style={{ containerType: 'size', ...bodyProps?.style }}
          className={cn(
            'flex-1',
            'min-h-0',
            'overflow-auto',
            padding && BODY_PADDING[padding],
            bodyProps?.className
          )}
        >
          {children}
        </VStack>
      </ScrollContainerProvider>

      {/* Footer */}
      {footer && (
        <HStack
          bg={footerBg ?? bodyBg}
          align="center"
          className={cn(
            'shrink-0',
            padding ? HEADER_PADDING[padding] : 'px-3',
            'py-4',
            footerClassName
          )}
        >
          {footer}
        </HStack>
      )}
    </div>
  );
}

