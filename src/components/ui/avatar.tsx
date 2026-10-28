import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { trimTextChildren } from "@/lib/text-trim"

export type AvatarSize = "small" | "medium" | "large";

const avatarVariants = cva(
  // Conteneur de requête : les initiales de AvatarFallback prennent une taille
  // relative au diamètre (cqw), quelle que soit la taille, custom comprise.
  "relative flex shrink-0 overflow-hidden rounded-full [container-type:inline-size]",
  {
    variants: {
      size: {
        small: "h-4 w-4",      // 20px - using spacing-4 (1.25rem)
        medium: "h-6 w-6",     // 30px - using spacing-6 (1.875rem)
        large: "h-10 w-10",    // 50px - using spacing-10 (3.125rem)
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

/**
 * Initiales à 40 % du diamètre de l'Avatar, 9px minimum (plus petite taille de
 * l'échelle GS) : 20px → 9px, 30px → 12px, 50px → 20px, 28px → 11,2px.
 *
 * `cqw` se rapporte au conteneur le plus proche, l'Avatar (voir
 * `avatarVariants`). Radix interdit un AvatarFallback hors d'un Avatar, donc ce
 * conteneur existe toujours. Le libellé `length:` permet à tailwind-merge de
 * reconnaître une taille de police : un `text-*` passé en className la remplace.
 */
const avatarFallbackClassName =
  "flex h-full w-full items-center justify-center rounded-full bg-muted text-[length:max(9px,40cqw)]"

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size = "medium", ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  /**
   * @deprecated Sans effet : la taille des initiales suit celle de l'Avatar.
   * Conservée pour ne pas casser les appels existants.
   */
  size?: AvatarSize;
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, size: _size, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(avatarFallbackClassName, className)}
    {...props}
  >
    {/* Initiales rognées sur la hauteur de capitale : sans ça, la police les
        dessine au-dessus du centre (cf. trimTextChildren). Avec asChild, le
        Slot de Radix attend un élément unique : on n'y touche pas. */}
    {props.asChild ? children : trimTextChildren(children)}
  </AvatarPrimitive.Fallback>
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
