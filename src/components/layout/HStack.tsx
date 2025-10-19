import { cn } from '@/lib/utils';
import { Layout, LayoutProps } from './Layout';

type GapValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 28 | 30 | 32 | 36 | 40 | 44 | 48 | 50 | 52 | 56 | 60 | 64 | 68 | 70 | 72 | 80 | 90 | 100;
type AlignItems = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

// Mapping explicite pour Tailwind JIT
const gapClasses: Record<GapValue, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
  20: 'gap-20',
  24: 'gap-24',
  28: 'gap-28',
  30: 'gap-30',
  32: 'gap-32',
  36: 'gap-36',
  40: 'gap-40',
  44: 'gap-44',
  48: 'gap-48',
  50: 'gap-50',
  52: 'gap-52',
  56: 'gap-56',
  60: 'gap-60',
  64: 'gap-64',
  68: 'gap-68',
  70: 'gap-70',
  72: 'gap-72',
  80: 'gap-80',
  90: 'gap-90',
  100: 'gap-100',
};

export interface HStackProps extends Omit<LayoutProps, 'className'> {
  /** Espacement entre les enfants (utilise les primitives spacing) */
  gap?: GapValue;

  /** Alignement vertical des enfants (axe secondaire) */
  align?: AlignItems;

  /** Alignement horizontal des enfants (axe principal) */
  justify?: JustifyContent;

  /** Classes Tailwind supplémentaires */
  className?: string;

  /** Permet le retour à la ligne */
  wrap?: boolean;
}

/**
 * Stack horizontal (Flexbox row) - Correspond à Figma Auto Layout horizontal
 *
 * Dispose les enfants horizontalement côte à côte avec un espacement défini.
 *
 * @example
 * ```tsx
 * // Stack horizontal avec espacement et alignement
 * <HStack gap={4} align="center" justify="between">
 *   <Logo />
 *   <Navigation />
 *   <UserMenu />
 * </HStack>
 *
 * // Stack avec fond et padding
 * <HStack bg="white" padding={6} gap={2}>
 *   <Button>Action 1</Button>
 *   <Button>Action 2</Button>
 * </HStack>
 * ```
 */
export function HStack({
  gap = 0,
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
  ...props
}: HStackProps) {
  return (
    <Layout
      {...props}
      className={cn(
        'flex flex-row',
        gapClasses[gap],
        align === 'start' && 'items-start',
        align === 'center' && 'items-center',
        align === 'end' && 'items-end',
        align === 'baseline' && 'items-baseline',
        align === 'stretch' && 'items-stretch',
        justify === 'start' && 'justify-start',
        justify === 'center' && 'justify-center',
        justify === 'end' && 'justify-end',
        justify === 'between' && 'justify-between',
        justify === 'around' && 'justify-around',
        justify === 'evenly' && 'justify-evenly',
        wrap && 'flex-wrap',
        className
      )}
    />
  );
}
