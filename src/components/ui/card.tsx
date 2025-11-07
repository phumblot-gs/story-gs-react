import * as React from "react"
import { cn } from "@/lib/utils"
import { useBgContext, BgProvider } from "@/components/layout/BgContext"

/**
 * Détermine le variant de Card selon le contexte parent
 * - white → grey (expose data-bg="grey")
 * - grey → white (expose data-bg="white")
 * - black → black (expose data-bg="black")
 */
function getCardVariant(parentBg: 'white' | 'grey' | 'black' | undefined): {
  variant: 'white' | 'grey' | 'black';
  exposedBg: 'white' | 'grey' | 'black';
} {
  switch (parentBg) {
    case 'white':
      return { variant: 'grey', exposedBg: 'grey' };
    case 'grey':
      return { variant: 'white', exposedBg: 'white' };
    case 'black':
      return { variant: 'black', exposedBg: 'black' };
    default:
      // Par défaut, si pas de contexte, on utilise grey
      return { variant: 'grey', exposedBg: 'grey' };
  }
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Footer optionnel à afficher sous la Card */
  footer?: React.ReactNode;
  /** Active l'effet d'ombre avec transition au hover (shadow-md par défaut, shadow-lg au hover) */
  cardShadow?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, footer, cardShadow = false, children, ...props }, ref) => {
    const parentBg = useBgContext();
    const { variant, exposedBg } = getCardVariant(parentBg);

    // Séparer les enfants pour détecter CardFooter
    const childrenArray = React.Children.toArray(children);
    const cardFooterIndex = childrenArray.findIndex(
      (child) =>
        React.isValidElement(child) &&
        typeof child.type !== 'string' &&
        (child.type as React.ComponentType & { displayName?: string })?.displayName === 'CardFooter'
    );

    // Si CardFooter est trouvé dans les children, le séparer
    const hasCardFooter = cardFooterIndex !== -1;
    const cardContent = hasCardFooter
      ? childrenArray.filter((_, index) => index !== cardFooterIndex)
      : childrenArray;
    const cardFooter = hasCardFooter
      ? childrenArray[cardFooterIndex]
      : footer;

    // Classes d'ombre conditionnelles
    const shadowClasses = cardShadow
      ? 'shadow-md hover:shadow-lg transition-shadow'
      : '';

    const cardElement = (
      <div
        ref={ref}
        className={cn(
          "card-base rounded-[4px] p-[30px] flex flex-col gap-[30px]",
          shadowClasses,
          className
        )}
        data-bg={exposedBg}
        {...props}
      >
        {cardContent}
      </div>
    );

    const footerElement = cardFooter ? (
      <div
        className={cn(
          "card-footer flex items-center justify-end pt-2 pb-6 px-6",
          "w-full"
        )}
        data-bg={exposedBg}
      >
        {React.isValidElement(cardFooter) && 
         typeof cardFooter.type !== 'string' &&
         (cardFooter.type as React.ComponentType & { displayName?: string })?.displayName === 'CardFooter'
          ? React.cloneElement(cardFooter as React.ReactElement<React.HTMLAttributes<HTMLDivElement>>, {
              className: cn(
                (cardFooter as React.ReactElement<React.HTMLAttributes<HTMLDivElement>>).props.className,
                "w-full"
              ),
            })
          : cardFooter}
      </div>
    ) : null;

    // Expose le nouveau contexte pour les enfants
    return (
      <BgProvider value={exposedBg}>
        <div className="flex flex-col">
          {cardElement}
          {footerElement}
        </div>
      </BgProvider>
    );
  }
);
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("card-header flex flex-col gap-[10px]", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "card-title text-large-bold uppercase",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "card-description text-std-medium",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("card-content flex flex-col gap-[10px]", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("card-footer-content flex items-center justify-end gap-5", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
