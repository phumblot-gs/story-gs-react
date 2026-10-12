import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { IconProvider } from "@/components/ui/icon-provider";
import { cn } from "@/lib/utils";

/**
 * Démonstration (stories et tests, non exportée par la librairie) : clic →
 * chargement → succès → retour au libellé initial.
 *
 * La prop `loading` du Button gère le spinner, `disabled`, `aria-busy` et la
 * largeur pendant le chargement. Le succès et l'échec sont propres à
 * l'application : ici, leurs libellés sont superposés au libellé initial dans
 * `children`, pour que la largeur ne change dans aucune phase.
 */

type Phase = "idle" | "loading" | "success" | "failure";

export interface ButtonLoadingDemoProps {
  /** Durée de l'action simulée, en ms. Défaut 3000. */
  actionDuration?: number;
  /** Délai avant le retour au libellé initial après un succès, en ms. Défaut 1500. */
  successDuration?: number;
  /** L'action simulée échoue. */
  fail?: boolean;
  /** Appelé à chaque démarrage d'action (tests). */
  onAction?: () => void;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  idleLabel?: string;
  loadingLabel?: string;
  successLabel?: string;
  failureLabel?: string;
  failureMessage?: string;
}

/** Libellés superposés dans une même cellule : seul celui de la phase active est visible et lu. */
function StackedLabels({ active, labels }: { active: string; labels: Record<string, React.ReactNode> }) {
  return (
    <span className="inline-grid" style={{ gap: "inherit" }}>
      {Object.entries(labels).map(([key, node]) => (
        <span
          key={key}
          aria-hidden={key === active ? undefined : true}
          className={cn("gs-state-fade inline-flex items-center justify-center [grid-area:1/1]", key !== active && "opacity-0")}
          style={{ gap: "inherit" }}
        >
          {node}
        </span>
      ))}
    </span>
  );
}

export function ButtonLoadingDemo({
  actionDuration = 3000,
  successDuration = 1500,
  fail = false,
  onAction,
  size = "medium",
  variant = "normal",
  idleLabel = "Importer les visuels",
  loadingLabel = "Import en cours…",
  successLabel = "Import terminé",
  failureLabel = "Réessayer l'import",
  failureMessage = "L'import a échoué.",
}: ButtonLoadingDemoProps) {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const actionTimer = React.useRef<ReturnType<typeof setTimeout>>();
  const resetTimer = React.useRef<ReturnType<typeof setTimeout>>();

  // Temporisations nettoyées au démontage.
  React.useEffect(
    () => () => {
      clearTimeout(actionTimer.current);
      clearTimeout(resetTimer.current);
    },
    [],
  );

  const start = () => {
    if (phase === "loading") return;
    // Un redémarrage pendant le succès annule le retour automatique précédent.
    clearTimeout(resetTimer.current);
    setPhase("loading");
    onAction?.();
    actionTimer.current = setTimeout(() => {
      if (fail) {
        setPhase("failure");
        return;
      }
      setPhase("success");
      resetTimer.current = setTimeout(() => setPhase("idle"), successDuration);
    }, actionDuration);
  };

  const iconSize = size === "small" ? 12 : 16;
  const label = phase === "failure" ? "failure" : phase === "success" ? "success" : "idle";

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <Button size={size} variant={variant} loading={phase === "loading"} loadingLabel={loadingLabel} onClick={start}>
        <StackedLabels
          active={label}
          labels={{
            idle: idleLabel,
            success: (
              <>
                <span className="inline-flex shrink-0" style={{ width: iconSize, height: iconSize }}>
                  <IconProvider icon="ToastSuccessIcon" size={iconSize} />
                </span>
                {successLabel}
              </>
            ),
            failure: failureLabel,
          }}
        />
      </Button>
      {/* Région présente dès le départ : son contenu est annoncé quand il change. */}
      <span role="status" className="min-h-[1em] text-xs">
        {phase === "failure" ? failureMessage : ""}
      </span>
    </div>
  );
}
