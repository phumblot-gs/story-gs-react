import * as React from "react";
import { cn } from "@/lib/utils";
import { splitForMiddleTruncation } from "@/lib/middle-truncation";

export interface MiddleTruncatedTextProps {
  /** Texte complet, affiché aussi en infobulle native */
  text: string;
  /**
   * Nombre de caractères conservés avant l'extension, toujours visibles.
   * Avec 1, « 7E0125DE91_worn_1.tif » devient « 7E0125…1.tif ».
   */
  keepBeforeExtension?: number;
  className?: string;
}

/**
 * Texte tronqué au milieu : la fin (extension comprise) reste toujours lisible,
 * c'est la tête qui reçoit l'ellipse. Pur CSS — la tête est `truncate`, la fin
 * ne rétrécit pas — donc pas de mesure ni de ResizeObserver.
 */
export const MiddleTruncatedText: React.FC<MiddleTruncatedTextProps> = ({
  text,
  keepBeforeExtension = 1,
  className,
}) => {
  const { head, tail } = splitForMiddleTruncation(text, keepBeforeExtension);
  return (
    <span className={cn("inline-flex max-w-full min-w-0 whitespace-nowrap", className)} title={text}>
      <span className="truncate">{head}</span>
      <span className="shrink-0">{tail}</span>
    </span>
  );
};

MiddleTruncatedText.displayName = "MiddleTruncatedText";
