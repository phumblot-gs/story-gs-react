import * as React from "react";
import { Layout, HStack, VStack } from "@/components/layout";
import PageHeader from "@/components/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconProvider } from "@/components/ui/icon-provider";
import { Stepper } from "@/components/ui/stepper";
import { FileDropZone } from "@/components/ui/file-drop-zone";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Search } from "@/components/ui/search";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const columns = [
  ["REF", "Référence unique du produit à shooter. Obligatoire.", "TSH-001", "Identification"],
  ["NAME", "Nom de la référence. LABEL est aussi accepté.", "T-shirt en coton", "Identification"],
  ["PRODUCT_REF", "Code produit qui regroupe ses déclinaisons, par exemple les coloris.", "TSH", "Identification"],
  ["EAN", "EAN principal de la référence.", "3700000000016", "Identification"],
  ["ALTERNATIVE_EANS", "Autres EAN, séparés par des virgules.", "3700000000023,3700000000030", "Identification"],
  ["UNIVERS", "Niveau de classification 1.", "Prêt-à-porter", "Classification"],
  ["RANGE", "Niveau de classification 2. GAMME est aussi accepté.", "T-shirts", "Classification"],
  ["FAMILY", "Niveau de classification 3.", "Manches courtes", "Classification"],
  ["BRAND", "Marque.", "Maison Lumière", "Classification"],
  ["COLLECTION", "Collection.", "Printemps–été", "Classification"],
  ["GENDER", "Femme, homme, enfant…", "Femme", "Déclinaisons"],
  ["COLOR", "Code ou nom de la couleur.", "Écru", "Déclinaisons"],
  ["HEXA_COLOR", "Code couleur hexadécimal pour afficher une pastille de couleur.", "#F5F0E8", "Déclinaisons"],
  ["SIZE", "Taille du produit.", "M", "Déclinaisons"],
  ["SKU", "Code complémentaire, par exemple pour renommer les fichiers.", "TSH-001-M", "Suivi"],
  ["ONLINE", "Date de mise en ligne : AAAA-MM-JJ ou JJ/MM/AAAA.", "2026-06-15", "Suivi"],
  ["TAGS", "Tags séparés par des virgules.", "nouveauté,e-shop", "Suivi"],
  ["COMMENT", "Commentaire sur le shooting de la référence.", "Photographier le détail du col", "Suivi"],
] as const;

function downloadTemplate() {
  // The example contains a header only, so no illustrative product can be imported by mistake.
  const url = URL.createObjectURL(new Blob(["\uFEFF" + columns.map(([key]) => key).join(";") + "\r\n"], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "modele-references.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface ReferenceImportExampleProps {
  /** Open a section initially for product review. */
  defaultHelpSections?: string[];
}

/** UI composition only: all visual elements come from the existing GS library. */
export function ReferenceImportExample({ defaultHelpSections = [] }: ReferenceImportExampleProps) {
  const [search, setSearch] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const filteredColumns = columns.filter(column => normalize(column.join(" ")).includes(normalize(search.trim())));

  return <Layout bg="grey" className="gs-reference-import min-h-screen text-left">
    <PageHeader title="Importer des références" showTitleButton={false}
      rightContent={<Text className="text-sm text-grey-strongest">FR</Text>} />
    <VStack as="main" gap={5} className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6">
      <Layout className="overflow-x-auto pb-1" aria-label="Étapes de l’import">
        <Stepper layout="inline" variant="inverse" steps={[
          { label: 1, title: "Fichier", state: "active" },
          { label: 2, title: "Onglets", state: "future" },
          { label: 3, title: "Correspondance", state: "future" },
          { label: 4, title: "Aperçu", state: "future" },
          { label: 5, title: "Résultat", state: "future" },
        ]} />
      </Layout>

      <Card className="gap-5">
        <HStack align="center" justify="between" gap={3} wrap>
          <VStack gap={1}>
            <CardTitle>Votre fichier de références</CardTitle>
            <Text as="p" className="text-sm text-grey-strongest">Ajoutez ou mettez à jour vos références en une seule fois.</Text>
          </VStack>
          <Button type="button" variant="secondary" onClick={downloadTemplate}>
            <IconProvider icon="Download" size={16} />Télécharger le modèle CSV
          </Button>
        </HStack>
        {selectedFile ? <VStack gap={4}>
          <Alert role="status" className="border-0 bg-grey-lighter">
            <HStack align="center" gap={3}>
              <IconProvider icon="File" size={22} />
              <VStack gap={1} className="min-w-0 flex-1">
                <Text className="font-medium break-all">{selectedFile.name}</Text>
                <Text className="text-sm text-grey-strongest">Fichier sélectionné · {(selectedFile.size / 1024).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} Ko</Text>
              </VStack>
              <Button variant="ghost" onClick={() => setSelectedFile(null)} aria-label="Retirer le fichier"><IconProvider icon="X" /></Button>
            </HStack>
          </Alert>
          <Text as="p" className="text-sm text-grey-strongest">Cet exemple présente la sélection du fichier. L’analyse et l’import seront pris en charge par l’application.</Text>
        </VStack> : <FileDropZone
          language="FR" label="Déposez votre fichier ici" chooseButtonLabel="Choisir un fichier"
          chooseButtonVariant="normal" description="CSV, XLS ou XLSX · 10 Mo maximum"
          options={{ accept: ".csv,.xls,.xlsx", maxFiles: 1, multiple: false, maxSize: 10 * 1024 * 1024 }}
          onFilesDrop={files => setSelectedFile(files[0])}
        />}
      </Card>

      <Card className="gap-5">
        <CardHeader>
          <HStack align="center" gap={3}>
            <Layout bg="grey" padding={2} className="rounded-full"><IconProvider icon="Help" size={20} /></Layout>
            <VStack gap={1}>
              <CardTitle>Préparer votre fichier</CardTitle>
              <CardDescription className="text-grey-strongest">L’essentiel pour réussir votre import.</CardDescription>
            </VStack>
          </HStack>
        </CardHeader>

        <Layout className="grid gap-5 md:grid-cols-3">
          <VStack gap={2}>
            <HStack align="center" gap={2}><Badge variant="secondary" className="bg-black text-white border-black">01</Badge><Text as="h4" className="font-medium">Une référence par ligne</Text></HStack>
            <Text as="p" className="text-sm leading-relaxed text-grey-strongest">Seule la colonne <Badge variant="outline">REF</Badge> est obligatoire. Une REF existante met à jour la référence ; une nouvelle REF la crée.</Text>
          </VStack>
          <VStack gap={2}>
            <HStack align="center" gap={2}><Badge variant="secondary" className="bg-black text-white border-black">02</Badge><Text as="h4" className="font-medium">Vos colonnes, votre ordre</Text></HStack>
            <Text as="p" className="text-sm leading-relaxed text-grey-strongest">Placez les noms de colonnes sur la première ligne, dans l’ordre de votre choix. Majuscules et minuscules sont acceptées.</Text>
          </VStack>
          <VStack gap={2}>
            <HStack align="center" gap={2}><Badge variant="secondary" className="bg-black text-white border-black">03</Badge><Text as="h4" className="font-medium">Vérifiez avant de valider</Text></HStack>
            <Text as="p" className="text-sm leading-relaxed text-grey-strongest">Choisissez vos onglets, confirmez la correspondance des colonnes et consultez l’aperçu. Rien n’est enregistré avant la dernière étape.</Text>
          </VStack>
        </Layout>

        <Alert role="note" className="border-0 bg-pastel-yellow-secondary">
          <HStack gap={3} align="start">
            <IconProvider icon="AlertTriangle" size={18} className="shrink-0" />
            <VStack gap={2}>
              <Text as="h4" className="font-medium">Vous mettez à jour des références existantes ?</Text>
              <AlertDescription>
                <Text as="p" className="text-sm leading-relaxed"><Text as="strong" className="text-sm font-medium">Colonne absente :</Text> la donnée est conservée. <Text as="strong" className="text-sm font-medium">Cellule vide :</Text> la valeur est effacée.</Text>
              </AlertDescription>
            </VStack>
          </HStack>
        </Alert>

        <Accordion type="multiple" defaultValue={defaultHelpSections}>
          <AccordionItem value="columns">
            <AccordionTrigger className="text-base hover:no-underline">
              <Text className="inline-flex flex-wrap items-center gap-2 text-left">Quelles colonnes puis-je importer ? <Badge variant="secondary">18 colonnes</Badge></Text>
            </AccordionTrigger>
            <AccordionContent>
              <VStack gap={4}>
                <HStack align="center" justify="between" gap={3} wrap>
                  <Text as="p" className="text-sm text-grey-strongest">Toutes les colonnes sont facultatives, à l’exception de REF.</Text>
                  <Search value={search} onChange={event => setSearch(event.target.value)} onClear={() => setSearch("")}
                    aria-label="Rechercher une colonne" placeholder="Rechercher une colonne…" containerClassName="w-full sm:w-[280px]" />
                </HStack>
                <Table>
                  <TableHeader><TableRow><TableHead>Colonne</TableHead><TableHead>Utilisation</TableHead><TableHead>Exemple</TableHead></TableRow></TableHeader>
                  <TableBody>{filteredColumns.map(([key, description, example]) => <TableRow key={key}>
                    <TableCell><HStack align="center" gap={2}><Badge variant={key === "REF" ? "default" : "secondary"}>{key}</Badge>{key === "REF" && <Text className="text-sm">Obligatoire</Text>}</HStack></TableCell>
                    <TableCell className="text-grey-strongest min-w-[260px]">{description}</TableCell>
                    <TableCell className="text-grey-strongest min-w-[160px]">{example}</TableCell>
                  </TableRow>)}</TableBody>
                </Table>
                {!filteredColumns.length && <Text as="p" role="status" className="text-sm text-grey-strongest">Aucune colonne ne correspond à « {search} ».</Text>}
              </VStack>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="attributes">
            <AccordionTrigger className="text-base hover:no-underline">Puis-je importer mes attributs personnalisés ?</AccordionTrigger>
            <AccordionContent><Text as="p" className="text-sm leading-relaxed text-grey-strongest">Oui. Les autres colonnes sont rapprochées des attributs de votre organisation par leur clé, sans préfixe. Utilisez la clé exacte de l’attribut comme nom de colonne.</Text></AccordionContent>
          </AccordionItem>
          <AccordionItem value="sheets" className="border-b-0">
            <AccordionTrigger className="text-base hover:no-underline">Mon fichier contient plusieurs onglets</AccordionTrigger>
            <AccordionContent><Text as="p" className="text-sm leading-relaxed text-grey-strongest">À l’étape « Onglets », choisissez ceux à charger. Vous confirmerez ensuite les correspondances de chaque onglet, avec des exemples tirés de votre fichier.</Text></AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </VStack>
  </Layout>;
}
