import * as React from "react";
import { Layout, HStack, VStack } from "@/components/layout";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IconProvider } from "@/components/ui/icon-provider";
import { parseReferenceList } from "./reference-list";

export type ReferenceInputVariant = "none" | "smart" | "explicit" | "keyboard";

/** Shared parsing feedback, with two different entry experiences to compare. */
export function ReferenceListEntry({ variant, raw, onChange, onSingleSearch, id }: {
  variant: "smart" | "explicit";
  raw: string;
  onChange: (raw: string) => void;
  onSingleSearch: () => void;
  id: string;
}) {
  const [editing, setEditing] = React.useState(!raw);
  const parsed = parseReferenceList(raw);
  const showEditor = variant === "explicit" || editing || !!parsed.error;
  return <VStack gap={4}>
    <HStack justify="between" align="center" gap={3} wrap>
      <HStack align="center" gap={2}><IconProvider icon="File" /><Text className="font-medium">{variant === "smart" ? "Liste de références détectée" : "Rechercher une liste de références"}</Text><Badge variant="secondary">{parsed.references.length} référence{parsed.references.length > 1 ? "s" : ""}</Badge></HStack>
      <HStack align="center" gap={2}>
        {variant === "smart" && <Button type="button" variant="secondary" onClick={() => setEditing(value => !value)}>{showEditor ? "Réduire la liste" : "Modifier la liste"}</Button>}
        <Button type="button" variant="ghost" onClick={() => { onChange(""); if (variant === "smart") onSingleSearch(); }}>Vider la liste</Button>
      </HStack>
    </HStack>
    <Text as="p" className="text-sm text-grey-strongest">{variant === "smart" ? "Recherchez tous les articles correspondant à ces références exactes." : "Copiez une seule colonne depuis Excel, avec ou sans en-tête. Une référence par ligne."}</Text>
    {showEditor ? <VStack gap={2}>
      <Label htmlFor={`${id}-references`}>Références</Label>
      <Textarea id={`${id}-references`} value={raw} onChange={event => onChange(event.target.value)} rows={5} placeholder={"TSH-001\nPUL-001\nSAC-001"}
        aria-invalid={!!parsed.error} aria-describedby={`${id}-reference-help${parsed.error ? ` ${id}-reference-error` : ""}`} className="h-[140px] overflow-y-auto font-mono" />
    </VStack> : <HStack gap={2} wrap align="center">{parsed.references.slice(0, 5).map(reference => <Badge key={reference} variant="outline">{reference}</Badge>)}{parsed.references.length > 5 && <Badge variant="secondary">+{parsed.references.length - 5} autres</Badge>}</HStack>}
    {parsed.error && <Alert id={`${id}-reference-error`} variant="destructive"><AlertDescription>{parsed.error}</AlertDescription></Alert>}
    <Layout bg="grey" padding={3} className="rounded-sm">
      <Text as="p" id={`${id}-reference-help`} className="text-sm text-grey-strongest">Recherche par références exactes.{parsed.duplicates > 0 && ` ${parsed.duplicates} doublon${parsed.duplicates > 1 ? "s" : ""} ignoré${parsed.duplicates > 1 ? "s" : ""}.`}{parsed.headerRemoved && " En-tête ignoré."} Les lignes vides sont ignorées.</Text>
    </Layout>
    {variant === "smart" && <Button type="button" variant="link" className="self-start p-0" onClick={onSingleSearch}>Revenir à la recherche simple</Button>}
  </VStack>;
}
