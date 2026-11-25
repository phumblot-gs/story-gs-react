import * as React from "react";
import { Layout, HStack, VStack } from "@/components/layout";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Search } from "@/components/ui/search";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SegmentedControl, SegmentedControlList, SegmentedControlTrigger } from "@/components/ui/segmented-control";
import { Switch } from "@/components/ui/switch";
import { IconProvider } from "@/components/ui/icon-provider";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import { articles, matchesArticle, groupArticles, shelfLabel, zoneLabel, type Article, type ArticleGroup, type ArticleSearch, type ArticleView, type SearchField, type Stage } from "./article-search-data";

import { ExpandableCriteriaSearch } from "./ExpandableCriteriaSearch";
import { ReferenceListEntry, type ReferenceInputVariant } from "./ReferenceListEntry";
import { parseReferenceList, parseSearchCriteria, referenceKey } from "./reference-list";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";

const fields: { value: SearchField; label: string; placeholder: string }[] = [
  { value: "all", label: "Tous les champs", placeholder: "Référence, nom, rayon ou zone…" },
  { value: "reference", label: "Référence", placeholder: "Ex. TSH-001" },
  { value: "shelf", label: "Rayon", placeholder: "Ex. R-01 ou Prêt-à-porter" },
  { value: "zone", label: "Zone", placeholder: "Ex. Zone A" },
];
const stages: { key: Stage; label: string }[] = [
  { key: "todo", label: "Non commencé" }, { key: "planned", label: "Planifié" },
  { key: "progress", label: "En cours" }, { key: "done", label: "Shooté" },
];
export interface ArticleSearchExampleProps {
  initialView?: ArticleView;
  initialQuery?: string;
  initialField?: SearchField;
  initiallyIncludeEmpty?: boolean;
  /** Two alternatives for batch reference entry, separate from the baseline example. */
  referenceInput?: ReferenceInputVariant;
  initialReferences?: string;
  initiallyExpanded?: boolean;
}

/** Local data only: search determines the scope; display options change its presentation. */
export function ArticleSearchExample({ initialView = "shelf", initialQuery = "", initialField = "all", initiallyIncludeEmpty = false, referenceInput = "none", initialReferences = "", initiallyExpanded = false }: ArticleSearchExampleProps) {
  const [query, setQuery] = React.useState(initialQuery);
  const [field, setField] = React.useState<SearchField>(initialField);
  const [referenceMode, setReferenceMode] = React.useState(referenceInput !== "none" && (!!initialReferences || initiallyExpanded));
  const [rawReferences, setRawReferences] = React.useState(initialReferences);
  const parsed = referenceInput === "keyboard" ? parseSearchCriteria(rawReferences, field) : parseReferenceList(rawReferences);
  const [applied, setApplied] = React.useState<ArticleSearch>(() => {
    const initialList = referenceInput === "keyboard" ? parseSearchCriteria(initialReferences, initialField) : parseReferenceList(initialReferences);
    if (referenceInput !== "none" && initialReferences && !initialList.error) return referenceInput === "keyboard"
      ? { query: "", field: initialField, criteria: initialList.references }
      : { query: "", field: "reference", references: initialList.references };
    return { query: initialQuery, field: initialField };
  });
  const [view, setView] = React.useState<ArticleView>(initialView);
  const [includeEmpty, setIncludeEmpty] = React.useState(initiallyIncludeEmpty);
  const [focus, setFocus] = React.useState<{ kind: "shelf" | "zone"; id: string; label: string } | null>(null);
  const [page, setPage] = React.useState(1);
  const id = React.useId();
  const results = articles.filter(article => matchesArticle(article, applied));
  const visible = focus ? results.filter(article => focus.kind === "shelf" ? article.shelf === focus.id : zoneLabel(article.shelf) === focus.id) : results;
  const groups = view === "articles" ? [] : groupArticles(results, view, applied, includeEmpty);
  const hasSearch = !!applied.query || !!applied.references?.length || !!applied.criteria?.length;
  const draftSearch: ArticleSearch = referenceMode
    ? referenceInput === "keyboard" ? { query: "", field, criteria: parsed.references } : { query: "", field: "reference", references: parsed.references }
    : { query, field };
  const hasDraft = JSON.stringify(draftSearch) !== JSON.stringify(applied);
  const submittedReferences = applied.references ?? (applied.field === "reference" ? applied.criteria : undefined);
  const missingReferences = submittedReferences?.filter(reference => !articles.some(article => referenceKey(article.reference) === referenceKey(reference))) ?? [];
  const foundReferenceCount = (submittedReferences?.length ?? 0) - missingReferences.length;
  const emptyCount = groupArticles([], "shelf", applied, true).length;
  const appliedField = fields.find(option => option.value === applied.field)!;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (referenceMode && (parsed.error || !parsed.references.length)) return;
    setQuery(query.trim()); setApplied(referenceMode ? draftSearch : { query: query.trim(), field }); setFocus(null); setPage(1);
  }
  function clearSearch() { setReferenceMode(false); setRawReferences(""); setQuery(""); setApplied({ query: "", field }); setFocus(null); setPage(1); }
  function showAll() { clearSearch(); setView("articles"); }
  function changeView(value: ArticleView) { setView(value); setFocus(null); setPage(1); }
  function handlePaste(event: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (referenceInput !== "smart") return;
    const text = event.clipboardData.getData("text/plain");
    if (!/[\r\n\t]/.test(text)) return;
    const pasted = parseReferenceList(text);
    if (!pasted.error && pasted.references.length <= 1 && !pasted.headerRemoved) return;
    event.preventDefault(); setRawReferences(text); setReferenceMode(true);
  }
  function inspectGroup(group: ArticleGroup) {
    if (!group.total || view === "articles") return;
    setFocus({ kind: view, id: group.id, label: group.label }); setView("articles"); setPage(1);
  }
  const articleColumns: TableColumn<Article>[] = [
    { id: "reference", header: "Référence", sortable: true, cell: article => <Text className="font-medium whitespace-nowrap">{article.reference}</Text> },
    { id: "name", header: "Article", sortable: true, cell: article => article.name },
    { id: "shelf", header: "Rayon", sortable: true, sortAccessor: article => shelfLabel(article.shelf), cell: article => shelfLabel(article.shelf) },
    { id: "zone", header: "Zone", sortable: true, sortAccessor: article => zoneLabel(article.shelf), cell: article => zoneLabel(article.shelf) },
    { id: "stage", header: "Avancement", sortable: true, cell: article => <Badge variant={article.stage === "progress" ? "default" : "secondary"}>{stages.find(stage => stage.key === article.stage)!.label}</Badge> },
    { id: "inStock", header: "Stock", sortable: true, sortAccessor: article => Number(article.inStock), cell: article => article.inStock ? "En stock" : <Text className="text-grey-strongest">À recevoir</Text> },
  ];
  const groupColumns: TableColumn<ArticleGroup>[] = [
    { id: "label", header: view === "shelf" ? "Rayon" : "Zone", sortable: true, interactive: true,
      cell: group => <HStack align="center" gap={2}>{group.total ? <Button type="button" variant="link" className="p-0 text-left" onClick={() => inspectGroup(group)}>{group.label}</Button> : <><Text className="text-grey-strongest">{group.label}</Text><Badge variant="secondary">Vide</Badge></>}</HStack> },
    ...stages.map(stage => ({ id: stage.key, header: stage.label, sortable: true, align: "right" as const, cell: (group: ArticleGroup) => <Text className={group[stage.key] ? "tabular-nums" : "text-grey-strongest tabular-nums"}>{group[stage.key]}</Text> })),
    { id: "total", header: "Total", sortable: true, align: "right", cell: group => <Text className="font-medium tabular-nums">{group.total}</Text> },
  ];
  const emptyState = <VStack align="center" gap={3} className="py-8"><IconProvider icon="EmptySearch" size={28} /><Text className="font-medium">Aucun résultat pour cette recherche</Text><Text className="text-sm text-grey-strongest">Essayez un autre terme ou recherchez dans tous les champs.</Text><Button variant="secondary" onClick={showAll}>Voir tous les articles</Button></VStack>;

  return <VStack bg="grey" className="gs-article-search min-h-[100svh] text-left" gap={0}>
    <PageHeader title="Stock & production" showTitleButton={false} />
    <VStack as="main" gap={6} className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8">
      <VStack gap={2}>
        <Text as="h1" className="text-2xl font-bold">Articles</Text>
        <Text as="p" className="text-grey-strongest">Recherchez un article ou parcourez vos emplacements.</Text>
      </VStack>
      <form onSubmit={submit}>
        <VStack gap={3}>
          <HStack align="center" justify="between" gap={3} wrap>
            <Text as="h2" className="font-bold uppercase">Rechercher</Text>
            {referenceInput === "explicit" && <SegmentedControl value={referenceMode ? "list" : "single"} onValueChange={value => setReferenceMode(value === "list")}>
              <SegmentedControlList size="medium" aria-label="Mode de recherche">
                <SegmentedControlTrigger className="text-sm" value="single">Recherche simple</SegmentedControlTrigger>
                <SegmentedControlTrigger className="text-sm" value="list">Liste de références</SegmentedControlTrigger>
              </SegmentedControlList>
            </SegmentedControl>}
          </HStack>
          <Card className="gap-3 p-3 sm:p-4">
            {referenceInput === "keyboard" ? <Layout className="grid items-start gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <VStack gap={2}>
                <Label htmlFor={`${id}-field`}>Rechercher dans</Label>
                <Select value={field} onValueChange={value => setField(value as SearchField)}>
                  <SelectTrigger id={`${id}-field`} className="h-8"><SelectValue /></SelectTrigger>
                  <SelectContent>{fields.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                </Select>
              </VStack>
              <ExpandableCriteriaSearch id={id} query={query} onQueryChange={setQuery} raw={rawReferences} onRawChange={setRawReferences}
                multiple={referenceMode} onMultipleChange={setReferenceMode} parsed={parsed} initiallyExpanded={initiallyExpanded} />
            </Layout> : referenceMode && (referenceInput === "smart" || referenceInput === "explicit") ? <ReferenceListEntry variant={referenceInput} raw={rawReferences} onChange={setRawReferences} onSingleSearch={() => setReferenceMode(false)} id={id} /> : <>
            <Layout className="grid items-end gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
              <VStack gap={2}>
                <Label htmlFor={`${id}-field`}>Rechercher dans</Label>
                <Select value={field} onValueChange={value => setField(value as SearchField)}>
                  <SelectTrigger id={`${id}-field`}><SelectValue /></SelectTrigger>
                  <SelectContent>{fields.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                </Select>
              </VStack>
              <VStack gap={2} className="min-w-0">
                <Label htmlFor={`${id}-query`}>Votre recherche</Label>
                <Search id={`${id}-query`} value={query} onChange={event => setQuery(event.target.value)} onClear={() => setQuery("")}
                  placeholder={referenceInput === "smart" && (field === "all" || field === "reference") ? "Saisissez votre recherche ou collez une liste de références…" : fields.find(option => option.value === field)!.placeholder} {...(referenceInput === "smart" ? { onPaste: handlePaste } : {})} captureFindShortcut containerClassName="w-full" className="w-full" />
              </VStack>
            </Layout>
            {referenceInput === "smart" && <HStack justify="between" align="center" gap={3} wrap>
              <Text className="text-sm text-grey-strongest">Vous pouvez aussi coller une colonne de références depuis Excel.</Text>
              <Button type="button" variant="link" onClick={() => setReferenceMode(true)}>Coller une liste de références</Button>
            </HStack>}
            </>}
          </Card>
          <HStack justify="between" align="center" gap={3} wrap>
            {referenceInput !== "keyboard" && <Text className="text-sm text-grey-strongest">{hasDraft ? "Validez pour appliquer votre recherche." : hasSearch ? "Votre recherche est appliquée aux résultats ci-dessous." : "Sans recherche, tous les articles sont affichés."}</Text>}
            <Button type="submit" variant="inverse" className="ml-auto" disabled={referenceMode && (!!parsed.error || !parsed.references.length)}><IconProvider icon="Search" />{referenceMode ? `Rechercher ${parsed.references.length} ${referenceInput === "keyboard" ? "critère" : "référence"}${parsed.references.length > 1 ? "s" : ""}` : "Rechercher"}</Button>
          </HStack>
        </VStack>
      </form>

      <VStack as="section" gap={4}>
        <HStack align="start" justify="between" wrap gap={4}>
          <VStack gap={2}>
            <HStack gap={2} align="center"><Text as="h2" className="font-bold uppercase">{hasSearch || focus ? "Résultats" : "Tous les articles"}</Text><Badge variant="secondary">{visible.length}</Badge></HStack>
            <Text as="p" className="text-sm text-grey-strongest" role="status" aria-live="polite">{visible.length} article{visible.length > 1 ? "s" : ""}{hasSearch || focus ? ` sur ${articles.length}` : ""} · {visible.filter(article => article.inStock).length} en stock</Text>
          </VStack>
          <VStack gap={2} align="start">
            <Text className="text-sm text-grey-strongest" id={`${id}-view`}>Afficher les résultats</Text>
            <SegmentedControl value={view} onValueChange={value => changeView(value as ArticleView)}>
              <SegmentedControlList size="medium" aria-labelledby={`${id}-view`}>
                <SegmentedControlTrigger className="text-sm" value="articles">Articles</SegmentedControlTrigger>
                <SegmentedControlTrigger className="text-sm" value="shelf">Par rayon</SegmentedControlTrigger>
                <SegmentedControlTrigger className="text-sm" value="zone">Par zone</SegmentedControlTrigger>
              </SegmentedControlList>
            </SegmentedControl>
          </VStack>
        </HStack>
        {(hasSearch || focus) && <HStack gap={2} align="center" wrap>
          {hasSearch && <Badge variant="outline">{applied.references ? `Liste de ${applied.references.length} références` : applied.criteria ? `${appliedField.label} : ${applied.criteria.length} critères` : `${appliedField.label} : « ${applied.query} »`}</Badge>}
          {focus && <Badge variant="outline">{focus.kind === "shelf" ? "Rayon" : "Zone"} : {focus.label}</Badge>}
          <Button variant="link" onClick={showAll}>Voir tous les articles</Button>
          {focus && <Button variant="secondary" onClick={() => { const previous = focus.kind; setFocus(null); setView(previous); setPage(1); }}>Revenir à la synthèse</Button>}
        </HStack>}
        {submittedReferences && <VStack gap={2}>
          <Text as="p" className="text-sm text-grey-strongest">{submittedReferences.length} références recherchées · {foundReferenceCount} trouvée{foundReferenceCount > 1 ? "s" : ""} · {missingReferences.length} introuvable{missingReferences.length > 1 ? "s" : ""}.</Text>
          {missingReferences.length > 0 && <Accordion type="single" collapsible>
            <AccordionItem value="missing" className="border-b-0">
              <AccordionTrigger className="py-1 text-sm">Voir les références introuvables ({missingReferences.length})</AccordionTrigger>
              <AccordionContent><VStack gap={2}>
                <Label htmlFor={`${id}-missing`}>Références sans résultat</Label>
                <Textarea id={`${id}-missing`} readOnly value={missingReferences.join("\n")} className="h-[90px] font-mono" />
                <Text as="p" className="text-sm text-grey-strongest">Vérifiez ces références ou copiez cette liste pour la corriger.</Text>
              </VStack></AccordionContent>
            </AccordionItem>
          </Accordion>}
        </VStack>}
        <HStack align="center" justify="between" gap={3} wrap>
          <Text className="text-sm text-grey-strongest">{view === "articles" ? "Un article par ligne." : `Sélectionnez ${view === "shelf" ? "un rayon" : "une zone"} pour voir ses articles.`}</Text>
          {view === "shelf" && !submittedReferences && <HStack align="center" gap={2}>
            <Switch id={`${id}-empty`} value={includeEmpty} onValueChange={value => { setIncludeEmpty(value); setPage(1); }} aria-label="Inclure les rayons vides" onText="" offText="" />
            <Label htmlFor={`${id}-empty`} className="text-sm font-normal">Inclure les rayons vides ({emptyCount})</Label>
          </HStack>}
        </HStack>
        {view === "articles" ? <DataTable key="articles" data={visible} columns={articleColumns} getRowId={article => article.id} language="FR"
          pageSize={10} pageSizeOptions={[5, 10, 25, 50]} currentPage={page} onPageChange={setPage} defaultSort={{ columnId: "reference", direction: "asc" }} emptyState={emptyState} />
          : <DataTable key={view} data={groups} columns={groupColumns} getRowId={group => group.id} onRowClick={inspectGroup} language="FR"
            pageSize={10} pageSizeOptions={[5, 10, 25, 50]} currentPage={page} onPageChange={setPage} emptyState={emptyState} />}
      </VStack>
    </VStack>
  </VStack>;
}
