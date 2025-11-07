// Export principal du Button avec tous ses types
export { Button, buttonVariants } from '../button';
export type { ButtonProps, ButtonSize } from '../button';

// Export du ButtonBase pour ceux qui veulent étendre
export { Button as ButtonBase, buttonVariants as buttonBaseVariants } from '../button-base';
export type { ButtonProps as ButtonBaseProps } from '../button-base';

// Export du ButtonSmall pour la compatibilité
import { Button } from '../button';
import type { ButtonProps } from '../button';

export const ButtonSmall = (props: Omit<ButtonProps, "size">) => {
  return Button({ ...props, size: "small" });
};
export type ButtonSmallProps = Omit<ButtonProps, "size">;