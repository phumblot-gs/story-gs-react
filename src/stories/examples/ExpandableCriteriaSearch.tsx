import * as React from "react";
import { Layout, HStack, VStack } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconProvider } from "@/components/ui/icon-provider";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ParsedReferenceList } from "./reference-list";

/** Shift+Enter opens an integrated editor; Tab retains normal focus navigation. */
export function ExpandableCriteriaSearch({ id, query, onQueryChange, raw, onRawChange, multiple, onMultipleChange, parsed, initiallyExpanded = false }: {
  id: string;
  query: string;
  onQueryChange: (value: string) => void;
  raw: string;
  onRawChange: (value: string) => void;
  multiple: boolean;
  onMultipleChange: (value: boolean) => void;
  parsed: ParsedReferenceList;
  initiallyExpanded?: boolean;
}) {
  const [expanded, setExpanded] = React.useState(initiallyExpanded);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const summaryRef = React.useRef<HTMLButtonElement>(null);
  const editorRef = React.useRef<HTMLTextAreaElement>(null);
  const pendingFocus = React.useRef<"editor" | "control" | null>(null);
  const count = parsed.references.length;
  const isExpanded = expanded && multiple;

  React.useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    const target = pendingFocus.current === "editor" ? editorRef.current : multiple ? summaryRef.current : inputRef.current;
    if (target) { target.focus(); pendingFocus.current = null; }
  });

  function open() {
    if (!multiple) { onRawChange(query); onMultipleChange(true); }
    pendingFocus.current = "editor"; setExpanded(true);
  }
  function collapse() {
    if (!parsed.error && count <= 1) {
      onQueryChange(parsed.references[0] ?? ""); onMultipleChange(false);
    }
    pendingFocus.current = "control"; setExpanded(false);
  }
  function clear() {
    onRawChange(""); onQueryChange(""); onMultipleChange(false);
    pendingFocus.current = "control"; setExpanded(false);
  }
  function paste(event: React.ClipboardEvent<HTMLInputElement>) {
    const value = event.clipboardData.getData("text/plain");
    if (!/[\r\n\t]/.test(value)) return;
    event.preventDefault(); onRawChange(value); onMultipleChange(true);
    pendingFocus.current = "control"; setExpanded(false);
  }
  const summary = parsed.error ? "Liste à corriger" : `${count} critère${count > 1 ? "s" : ""}`;

  function expandShortcut(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" && event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault(); event.stopPropagation(); open();
    }
  }

  return <VStack gap={2} className="min-w-0">
    <Label htmlFor={`${id}-query`}>Votre recherche</Label>
    <Layout className={`gs-expandable-criteria min-w-0 overflow-hidden bg-grey-lighter focus-within:ring-1 focus-within:ring-black/40 ${isExpanded || (multiple && parsed.error) ? "rounded-lg" : "rounded-full"}`}>
      <HStack align="center" gap={0} className="p-1">
        {multiple ? <Button ref={summaryRef} id={`${id}-query`} type="button" variant="ghost" className="h-6 min-w-0 flex-1 justify-start px-2"
          onClick={open} onKeyDown={expandShortcut} aria-keyshortcuts="Shift+Enter" aria-label={`${summary} de recherche, modifier`} aria-expanded={isExpanded} aria-controls={`${id}-editor-panel`}>
          <IconProvider icon="Search" size={14} />
          <Badge variant="default" className="text-sm font-medium">{summary}</Badge>
          {count > 0 && <Text className="hidden truncate text-sm text-grey-strongest sm:block">{parsed.references.slice(0, 2).join(", ")}{count > 2 ? "…" : ""}</Text>}
        </Button> : <Input ref={inputRef} id={`${id}-query`} type="search" role="searchbox"
          className="h-6 min-w-0 flex-1 rounded-none border-0 bg-transparent px-2 py-0 focus:border-0 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          placeholder="Maj+Entrée pour une recherche multiple" value={query} onChange={event => onQueryChange(event.target.value)} onPaste={paste}
          onKeyDown={expandShortcut} aria-keyshortcuts="Shift+Enter" aria-describedby={`${id}-shortcut-help`} />}
        <Button type="button" variant="ghost" className="shrink-0 px-2" onClick={isExpanded ? collapse : open}
          aria-label={isExpanded ? "Replier la recherche multiple" : "Ouvrir la recherche multiple"} aria-expanded={isExpanded} aria-controls={`${id}-editor-panel`}>
          <IconProvider icon={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} /><Text className="text-sm">{isExpanded ? "Replier" : "Multiple"}</Text>
        </Button>
        {(query || raw) && <Button type="button" variant="ghost" className="shrink-0 px-2" onClick={clear} aria-label="Vider les critères"><IconProvider icon="X" size={14} /></Button>}
      </HStack>
      <div id={`${id}-editor-panel`} hidden={!isExpanded}>
        <Separator />
        <VStack gap={0}>
          <Label htmlFor={`${id}-criteria`} className="sr-only">Critères de recherche — une valeur par ligne</Label>
          <Textarea ref={editorRef} id={`${id}-criteria`} value={raw} onChange={event => onRawChange(event.target.value)}
            className="h-[150px] resize-none overflow-y-auto rounded-none border-0 bg-transparent px-3 py-2 font-mono focus:border-0"
            placeholder={"Collez une colonne depuis Excel\nou saisissez un critère par ligne"} aria-invalid={!!parsed.error}
            aria-describedby={`${id}-editor-help${parsed.error ? ` ${id}-criteria-error` : ""}`}
            onKeyDown={event => {
              if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); collapse(); }
              if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); }
            }} />
          <HStack align="center" justify="between" gap={2} wrap className="px-3 pb-2 pt-1">
            <Text as="p" id={`${id}-editor-help`} className="text-sm text-grey-strongest">Une valeur par ligne · Échap : replier · Ctrl/⌘+Entrée : rechercher.</Text>
            <Text as="p" className="text-sm text-grey-strongest" aria-live="polite">{count} critère{count > 1 ? "s" : ""} unique{count > 1 ? "s" : ""}.{parsed.duplicates > 0 && ` ${parsed.duplicates} doublon${parsed.duplicates > 1 ? "s" : ""} ignoré${parsed.duplicates > 1 ? "s" : ""}.`}{parsed.headerRemoved && " En-tête ignoré."}</Text>
          </HStack>
        </VStack>
      </div>
      {parsed.error && multiple && <Alert id={`${id}-criteria-error`} variant="destructive" className="m-2 w-auto rounded-sm"><AlertDescription>{parsed.error}</AlertDescription></Alert>}
      <Text as="p" id={`${id}-shortcut-help`} className="sr-only">Majuscule et Entrée pour déplier la recherche multiple. Le bouton Multiple permet aussi de l’ouvrir.</Text>
    </Layout>
  </VStack>;
}
