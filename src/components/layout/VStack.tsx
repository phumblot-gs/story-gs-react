import React from 'react';
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

export interface VStackProps extends Omit<LayoutProps, 'className'> {
  /** Espacement entre les enfants (utilise les primitives spacing) */
  gap?: GapValue;

  /** Alignement horizontal des enfants (axe secondaire) */
  align?: AlignItems;

  /** Alignement vertical des enfants (axe principal) */
  justify?: JustifyContent;

  /** Classes Tailwind supplémentaires */
  className?: string;
}

/**
 * Stack vertical (Flexbox column) - Correspond à Figma Auto Layout vertical
 *
 * Dispose les enfants verticalement les uns sous les autres avec un espacement défini.
 *
 * @example
 * ```tsx
 * // Stack vertical avec espacement
 * <VStack gap={6} align="center">
 *   <Title />
 *   <Description />
 *   <Button />
 * </VStack>
 *
 * // Stack avec fond et scroll
 * <VStack bg="grey" padding={8} gap={4} scroll="vertical" className="h-screen">
 *   {items.map(item => <Card key={item.id} {...item} />)}
 * </VStack>
 * ```
 */
export const VStack = React.forwardRef<HTMLDivElement, VStackProps>(
  (
    {
      gap = 0,
      align = 'stretch',
      justify = 'start',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Layout
        {...props}
        ref={ref}
        className={cn(
          'flex flex-col',
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
          className
        )}
      />
    );
  }
);

VStack.displayName = "VStack";
