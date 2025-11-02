import React, { useEffect, useId } from 'react';
import { cn } from '@/lib/utils';
import { HStack } from './HStack';
import { Button } from '@/components/ui/button';
import { useActionBarContext } from './ActionBarContext';
import { useTranslationSafe } from '@/contexts/TranslationContext';

export interface ActionBarProps {
  /** Nombre d'éléments sélectionnés */
  selectedCount: number;

  /** Clé de traduction pour le message (ex: "actionBar.filesSelected") */
  translationKey?: string;

  /** Clé de traduction pour le bouton "Tout désélectionner" (ex: "actionBar.deselectAll") */
  deselectAllTranslationKey?: string;

  /** Callback appelé lors du clic sur "Tout désélectionner" */
  onDeselectAll?: () => void;

  /** Afficher le compteur et le bouton de déselection */
  showSelectionInfo?: boolean;

  /** Enfants (boutons d'action à droite) */
  children?: React.ReactNode;

  /** Container parent (Layout/HStack/VStack) pour positionner l'ActionBar relativement */
  container?: React.ReactNode;

  /** Classes Tailwind supplémentaires pour le conteneur principal */
  className?: string;

  /** Props du HStack (bg, gap, align, justify, padding, etc.) */
  hStackProps?: React.ComponentProps<typeof HStack>;
}

/**
 * Composant ActionBar pour afficher une barre d'actions en bas de la fenêtre
 * 
 * S'affiche automatiquement lorsque selectedCount > 0.
 * Une seule ActionBar peut être visible à la fois (gérée par ActionBarContext).
 * 
 * @example
 * ```tsx
 * <ActionBar
 *   selectedCount={5}
 *   translationKey="actionBar.filesSelected"
 *   onDeselectAll={() => setSelected([])}
 * >
 *   <Button variant="normal">Valider</Button>
 *   <Button variant="destructive">Supprimer</Button>
 * </ActionBar>
 * ```
 * 
 * @example Avec container
 * ```tsx
 * <Layout bg="grey" className="relative">
 *   <Content />
 *   <ActionBar
 *     selectedCount={3}
 *     container={<Layout />}
 *   >
 *     <Button>Action</Button>
 *   </ActionBar>
 * </Layout>
 * ```
 */
export function ActionBar({
  selectedCount,
  translationKey,
  deselectAllTranslationKey = 'actionBar.deselectAll',
  onDeselectAll,
  showSelectionInfo = true,
  children,
  container,
  className,
  hStackProps,
}: ActionBarProps) {
  const instanceId = useId();
  const { registerActionBar, unregisterActionBar, updateActionBar, getActiveActionBar } = useActionBarContext();
  const { t } = useTranslationSafe();

  // Mettre à jour l'ActionBar dans le contexte
  useEffect(() => {
    if (selectedCount > 0) {
      registerActionBar(instanceId, {
        selectedCount,
        translationKey,
        onDeselectAll,
      });
    } else {
      unregisterActionBar(instanceId);
    }

    return () => {
      unregisterActionBar(instanceId);
    };
  }, [instanceId, selectedCount, translationKey, onDeselectAll, registerActionBar, unregisterActionBar]);

  // Mettre à jour l'ActionBar quand les props changent
  useEffect(() => {
    if (selectedCount > 0) {
      updateActionBar(instanceId, {
        selectedCount,
        translationKey,
        onDeselectAll,
      });
    }
  }, [instanceId, selectedCount, translationKey, onDeselectAll, updateActionBar]);

  // Vérifier si cette ActionBar est active
  const activeActionBar = getActiveActionBar();
  const isActive = activeActionBar?.instanceId === instanceId && selectedCount > 0;

  // Ne pas afficher si cette ActionBar n'est pas active ou si selectedCount <= 0
  if (!isActive || selectedCount <= 0) {
    return null;
  }

  // Déterminer le pluriel selon la langue
  const plural = selectedCount > 1 ? 's' : '';

  // Si un container est fourni, rendre l'ActionBar dans le container
  if (container) {
    return (
      <div className={cn('absolute bottom-0 left-0 right-0 z-50', className)}>
        <HStack
          bg="black"
          justify={showSelectionInfo ? "between" : "end"}
          align="center"
          padding={4}
          className={cn('h-[50px]', hStackProps?.className)}
          {...hStackProps}
        >
          {showSelectionInfo && (
            <HStack gap={3} align="center">
              <span className="text-white text-sm">
                {translationKey ? t(translationKey, { count: selectedCount, plural }) : `${selectedCount} sélectionné${plural}`}
              </span>
              {onDeselectAll && (
                <Button
                  variant="link"
                  onClick={onDeselectAll}
                  className="text-white hover:text-grey-light p-0 h-auto"
                >
                  {t(deselectAllTranslationKey, {})}
                </Button>
              )}
            </HStack>
          )}
          <HStack gap={2} align="center">
            {children}
          </HStack>
        </HStack>
      </div>
    );
  }

  // Rendu par défaut : position fixe en bas de la fenêtre
  return (
    <div className={cn('fixed bottom-0 left-0 right-0 z-50', className)}>
      <HStack
        bg="black"
        justify={showSelectionInfo ? "between" : "end"}
        align="center"
        padding={4}
        className={cn('h-[50px]', hStackProps?.className)}
        {...hStackProps}
      >
        {showSelectionInfo && (
          <HStack gap={3} align="center">
            <span className="text-white text-sm">
              {translationKey ? t(translationKey, { count: selectedCount, plural }) : `${selectedCount} sélectionné${plural}`}
            </span>
            {onDeselectAll && (
              <Button
                variant="link"
                onClick={onDeselectAll}
                className="text-white hover:text-grey-light p-0 h-auto"
              >
                {t('actionBar.deselectAll', {})}
              </Button>
            )}
          </HStack>
        )}
        <HStack gap={2} align="center">
          {children}
        </HStack>
      </HStack>
    </div>
  );
}

