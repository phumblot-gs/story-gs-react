// Export principal du Button avec tous ses types
export { Button, buttonVariants } from '../button';
export type { ButtonProps, ButtonSize, ButtonBackground } from '../button';

// Export du ButtonBase pour ceux qui veulent étendre
export { Button as ButtonBase, buttonVariants as buttonBaseVariants } from '../button-base';
export type { ButtonProps as ButtonBaseProps } from '../button-base';

// Export du ButtonSmall pour la compatibilité
export const ButtonSmall = (props: Omit<import('../button').ButtonProps, "size">) => {
  const { Button } = require('../button');
  return Button({ ...props, size: "small" });
};
export type ButtonSmallProps = Omit<import('../button').ButtonProps, "size">;