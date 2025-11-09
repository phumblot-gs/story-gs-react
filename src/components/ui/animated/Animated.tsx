import React from "react"
import { AnimatedName } from "./types"
import { renderAnimation, AnimationProps } from "./animation-renderer"
import { cn } from "@/lib/utils"

export interface AnimatedProps {
  /** Nom de l'animation à afficher */
  name: AnimatedName

  /** Taille de l'animation en pixels (défaut: 44) */
  size?: number

  /** Couleur du badge/icône (défaut: "white") */
  color?: string

  /** Couleur de fond du cercle (défaut: "#4CAF50" pour success) */
  bgColor?: string

  /** Durée de l'animation du badge en secondes (défaut: 0.8) */
  duration?: number

  /** Délai avant l'apparition de la coche en secondes (défaut: 0.8) */
  checkDelay?: number

  /** Classes CSS Tailwind additionnelles */
  className?: string

  /** Handler pour le clic */
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void

  /** Mode debug : affiche un border rose et log les clics dans la console */
  debug?: boolean
}

/**
 * Composant Animated réutilisable
 *
 * Permet d'afficher des animations pour illustrer le comportement de l'application.
 * Similaire au composant Icon, mais pour les animations.
 *
 * @example
 * ```tsx
 * // Animation de succès par défaut
 * <Animated name="success" />
 *
 * // Animation de succès avec taille personnalisée
 * <Animated name="success" size={60} />
 *
 * // Animation de succès avec couleurs personnalisées
 * <Animated name="success" size={60} color="white" bgColor="#2196F3" />
 *
 * // Animation avec timing personnalisé
 * <Animated 
 *   name="success" 
 *   size={80} 
 *   duration={1.2} 
 *   checkDelay={1.0} 
 * />
 * ```
 */
export const Animated: React.FC<AnimatedProps> = ({
  name,
  size = 44,
  color,
  bgColor,
  duration = 0.8,
  checkDelay = 0.8,
  className,
  onClick,
  debug = false,
}) => {
  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (debug) {
        console.log("[Animated Click]", {
          name,
          size,
          color,
          bgColor,
          duration,
          checkDelay,
          className,
          event: e,
        })
      }
      onClick?.(e)
    },
    [debug, name, size, color, bgColor, duration, checkDelay, className, onClick]
  )

  // Déterminer les valeurs par défaut selon le type d'animation
  const defaultBgColor = bgColor || (name === "success" ? "#4CAF50" : undefined)
  const defaultColor = color || "white"

  const animationElement = renderAnimation(name, {
    size,
    color: defaultColor,
    bgColor: defaultBgColor,
    duration,
    checkDelay,
  })

  if (!animationElement) {
    console.warn(`[Animated] Animation "${name}" not found`)
    return null
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center flex-shrink-0",
        onClick && "cursor-pointer",
        debug && "ring-2 ring-pink",
        className
      )}
      onClick={debug || onClick ? handleClick : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {animationElement}
    </div>
  )
}

Animated.displayName = "Animated"

