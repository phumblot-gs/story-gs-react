import { ReactNode, ElementType } from 'react';
import { cn } from '@/lib/utils';
import { useBgContext, BgProvider } from './BgContext';

type BgContext = 'white' | 'grey' | 'black';
type ScrollBehavior = 'none' | 'auto' | 'always' | 'vertical' | 'horizontal' | 'both';
type SpacingValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 28 | 30 | 32 | 36 | 40 | 44 | 48 | 50 | 52 | 56 | 60 | 64 | 68 | 70 | 72 | 80 | 90 | 100;

export interface LayoutProps {
  /** Contexte de couleur de fond (définit data-bg pour les composants enfants shadcn) */
  bg?: BgContext;

  /** Enfants du layout */
  children: ReactNode;

  /** Classes Tailwind supplémentaires (flexbox, grid, spacing, etc.) */
  className?: string;

  /** Padding du layout (utilise les primitives spacing) */
  padding?: SpacingValue;

  /** Comportement du scroll */
  scroll?: ScrollBehavior;

  /** Élément HTML à rendre */
  as?: ElementType;
}

/**
 * Composant Layout pour gérer les contextes de couleurs et la disposition.
 *
 * Ce composant permet de :
 * - Définir le contexte de couleur (white/grey/black) pour les composants shadcn enfants
 * - Gérer le scroll (vertical, horizontal, les deux, ou aucun)
 * - Appliquer un padding cohérent avec les primitives spacing
 * - Utiliser les classes Tailwind pour flexbox, grid, etc.
 *
 * @example
 * ```tsx
 * // Layout avec fond gris et scroll vertical
 * <Layout bg="grey" scroll="vertical" padding={8} className="min-h-screen">
 *   <Content />
 * </Layout>
 *
 * // Layout avec flexbox
 * <Layout bg="white" className="flex items-center justify-between" padding={4}>
 *   <Logo />
 *   <Navigation />
 * </Layout>
 * ```
 */
// Mapping explicite pour Tailwind JIT (nécessaire car les classes dynamiques ne sont pas détectées)
const paddingClasses: Record<SpacingValue, string> = {
  0: 'p-0',
  1: 'p-1',
  2: 'p-2',
  3: 'p-3',
  4: 'p-4',
  5: 'p-5',
  6: 'p-6',
  8: 'p-8',
  10: 'p-10',
  12: 'p-12',
  16: 'p-16',
  20: 'p-20',
  24: 'p-24',
  28: 'p-28',
  30: 'p-30',
  32: 'p-32',
  36: 'p-36',
  40: 'p-40',
  44: 'p-44',
  48: 'p-48',
  50: 'p-50',
  52: 'p-52',
  56: 'p-56',
  60: 'p-60',
  64: 'p-64',
  68: 'p-68',
  70: 'p-70',
  72: 'p-72',
  80: 'p-80',
  90: 'p-90',
  100: 'p-100',
};

export function Layout({
  bg,
  children,
  className,
  padding,
  scroll = 'auto',
  as: Component = 'div',
}: LayoutProps) {
  // Récupère le bg du parent via Context
  const parentBg = useBgContext();

  // Utilise bg spécifié, sinon hérite du parent
  const effectiveBg = bg || parentBg;

  const content = (
    <Component
      data-bg={effectiveBg || undefined}
      className={cn(
        // Couleur de fond selon le contexte (seulement si bg est spécifié)
        bg === 'white' && 'bg-white',
        bg === 'grey' && 'bg-grey',
        bg === 'black' && 'bg-black',

        // Padding (utilise les primitives spacing)
        padding !== undefined && paddingClasses[padding],

        // Comportement du scroll
        scroll === 'none' && 'overflow-hidden',
        scroll === 'auto' && 'overflow-auto',
        scroll === 'always' && 'overflow-scroll',
        scroll === 'vertical' && 'overflow-y-auto overflow-x-hidden',
        scroll === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
        scroll === 'both' && 'overflow-auto',

        // Classes personnalisées
        className
      )}
    >
      {children}
    </Component>
  );

  // Si un nouveau bg est spécifié, on crée un nouveau contexte
  // Sinon on laisse passer le contexte parent
  return bg ? (
    <BgProvider value={bg}>
      {content}
    </BgProvider>
  ) : content;
}
