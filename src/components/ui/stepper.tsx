import * as React from "react"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icons"
import { useBgContext } from "@/components/layout/BgContext"
import type { ButtonVariant } from "@/components/ui/button"

export type StepperStepState = "future" | "active" | "completed"

export interface StepperStep {
  /** Numéro ou contenu de l'étape */
  label: string | number
  /** État de l'étape */
  state?: StepperStepState
  /** Titre optionnel affiché sous l'étape */
  title?: string
  /** Callback optionnel appelé au clic sur l'étape */
  onClick?: () => void
}

export interface StepperProps {
  /** Liste des étapes */
  steps: StepperStep[]
  /** Variant du bouton (normal, secondary, outline, ghost) */
  variant?: ButtonVariant
  /** Classes CSS supplémentaires */
  className?: string
  /** Mode debug pour afficher les logs */
  debug?: boolean
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, variant = "normal", className, debug = false }, ref) => {
    const bg = useBgContext()

    // Détermine les variables CSS pour la ligne de connexion selon le variant et l'état
    const getConnectorStyle = (state: StepperStepState, variant: ButtonVariant, bg: string | null): React.CSSProperties => {
      const bgPrefix = bg === "black" ? "b" : bg === "grey" ? "g" : "w"
      
      if (state === "completed") {
        // Ligne complétée : utiliser la couleur hover du variant (comme le rond)
        return {
          backgroundColor: `var(--button-${bgPrefix}-${variant}-bg-hover)`,
        }
      } else if (state === "active") {
        // Ligne active : utiliser la couleur pressed du variant (comme le rond)
        return {
          backgroundColor: `var(--button-${bgPrefix}-${variant}-bg-pressed)`,
        }
      } else {
        // Ligne future : utiliser la couleur grey-lighter
        return {
          backgroundColor: "var(--color-grey-lighter)",
        }
      }
    }

    // Détermine les styles pour le bouton selon l'état
    const getStepButtonStyle = (state: StepperStepState, variant: ButtonVariant, bg: string | null): React.CSSProperties => {
      const bgPrefix = bg === "black" ? "b" : bg === "grey" ? "g" : "w"
      
      const baseStyle: React.CSSProperties = {}
      
      // Pour le variant outline, ajouter la bordure
      if (variant === "outline") {
        if (state === "completed") {
          baseStyle.border = `1px solid var(--button-${bgPrefix}-outline-fg-hover)`
        } else if (state === "active") {
          baseStyle.border = `1px solid var(--button-${bgPrefix}-outline-fg-pressed)`
        } else {
          baseStyle.border = `1px solid var(--button-${bgPrefix}-outline-fg-default)`
        }
      }
      
      if (state === "completed") {
        // État complété : utiliser les styles hover du variant pour le fond, mais pressed pour le texte
        return {
          ...baseStyle,
          backgroundColor: `var(--button-${bgPrefix}-${variant}-bg-hover)`,
          color: `var(--button-${bgPrefix}-${variant}-fg-hover)`,
        }
      } else if (state === "active") {
        // État actif : utiliser les styles pressed du variant
        return {
          ...baseStyle,
          backgroundColor: `var(--button-${bgPrefix}-${variant}-bg-pressed)`,
          color: `var(--button-${bgPrefix}-${variant}-fg-pressed)`,
        }
      } else {
        // État futur : utiliser les styles par défaut du variant
        return {
          ...baseStyle,
          backgroundColor: `var(--button-${bgPrefix}-${variant}-bg-default)`,
          color: `var(--button-${bgPrefix}-${variant}-fg-default)`,
        }
      }
    }

    if (debug) {
      console.log("[Stepper] Rendering", { steps, variant, bg })
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-start gap-2", className)}
        data-bg={bg || undefined}
      >
        {steps.map((step, index) => {
          const state = step.state || "future"
          const isCompleted = state === "completed"
          const isActive = state === "active"
          const isLast = index === steps.length - 1
          // Pour la ligne, on utilise l'état de l'étape suivante pour déterminer la couleur
          // Si l'étape suivante est complétée ou active, la ligne doit être colorée
          const nextStepState = index < steps.length - 1 ? (steps[index + 1].state || "future") : "future"
          const connectorState = isCompleted || isActive ? state : nextStepState

          return (
            <React.Fragment key={index}>
              {/* Étape */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  className={cn(
                    "stepper-step rounded-full p-0 w-8 h-8 flex items-center justify-center text-sm font-medium transition-colors",
                    `btn-${variant}`,
                    isCompleted && "stepper-completed",
                    isActive && "stepper-active",
                    step.onClick && "cursor-pointer",
                    !step.onClick && "cursor-default"
                  )}
                  style={getStepButtonStyle(state, variant, bg)}
                  onClick={step.onClick}
                  disabled={!step.onClick}
                  aria-label={step.title || `Étape ${index + 1}`}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={14} />
                  ) : (
                    <span>{step.label}</span>
                  )}
                </button>
                {step.title && (
                  <span className={cn(
                    "text-xs text-center whitespace-nowrap",
                    bg === "black" ? "text-white" : "text-black"
                  )}>
                    {step.title}
                  </span>
                )}
              </div>

              {/* Ligne de connexion - centrée verticalement par rapport au bouton */}
              {!isLast && (
                <div className="h-8 flex items-center">
                  <div
                    className="h-[2px] w-full flex-1 min-w-[40px] transition-colors"
                    style={getConnectorStyle(connectorState, variant, bg)}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)

Stepper.displayName = "Stepper"

export { Stepper }

