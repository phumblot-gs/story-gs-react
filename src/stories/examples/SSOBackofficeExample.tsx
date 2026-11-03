import * as React from "react";
import { Layout, HStack, VStack, Modal, ActionBarProvider } from "@/components/layout";
import PageHeader from "@/components/PageHeader";
import { Sidebar, SidebarProvider, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, SidebarUserMenu, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { IconProvider } from "@/components/ui/icon-provider";
import type { IconName } from "@/components/ui/icons/types";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "@/components/ui/search";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

type Person = { id: string; name: string; email: string; type: string; status: string; role: string; language: string; created: string; organisation: string };
const people: Person[] = [
  { id: "3bb11ba0-6eb6-4653-bbff-884986b6f4aa", name: "Platform support", email: "support@sorians.local", type: "Personne", status: "Active", role: "Support (lecture seule)", language: "EN", created: "2026-11-03T01:58:06", organisation: "Sorians" },
  { id: "paul-01", name: "Paul Martin", email: "paul@studio-nord.local", type: "Personne", status: "Active", role: "Aucun", language: "FR", created: "2026-11-01T03:56:57", organisation: "Studio Nord" },
  { id: "marie-02", name: "Marie Lumière", email: "marie@maison-lumiere.local", type: "Personne", status: "Active", role: "Aucun", language: "FR", created: "2026-11-01T03:56:57", organisation: "Maison Lumière" },
  { id: "invite-03", name: "", email: "e2e-19b420c7@example.com", type: "Personne", status: "Invitée", role: "Aucun", language: "FR", created: "2026-11-01T03:51:03", organisation: "—" },
  { id: "e71fef4f-f4ce-4718-88c8-af913edede16", name: "E2E agent", email: "e71fef4f-f4ce-4718-88c8-af913edede16", type: "Agent IA", status: "Active", role: "Aucun", language: "EN", created: "2026-11-01T03:51:03", organisation: "Sorians" },
  { id: "admin-04", name: "Platform admin", email: "admin@sorians.local", type: "Personne", status: "Active", role: "Superadmin", language: "FR", created: "2026-11-01T03:46:02", organisation: "Sorians" },
];
const roles = ["Aucun", "Support (lecture seule)", "Superadmin"];
const navigation: { title: string; items: [string, IconName][] }[] = [
  { title: "Identité", items: [["Personnes", "Users"], ["Agents et clés API", "Tag"], ["Rôles de plateforme", "Star"]] },
  { title: "Accès", items: [["Entreprises", "Globe"], ["Organisations", "Folder"], ["Espaces de travail", "Folder"], ["Politiques", "Settings"], ["Clients OIDC", "Share"]] },
  { title: "Plateforme", items: [["Cellules", "ViewSplit"], ["Livraison des événements", "Upload"], ["Clés de signature", "Tag"], ["Limites de débit", "Settings"], ["Journal d’audit", "File"]] },
];
const date = (value: string) => new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function Choice({ label, value, options, onChange, id }: { label: string; value: string; options: string[]; onChange: (v: string) => void; id: string }) {
  return <VStack gap={2} className="min-w-0"><Label htmlFor={id}>{label}</Label><Select value={value} onValueChange={onChange}><SelectTrigger id={id}><SelectValue /></SelectTrigger><SelectContent>{options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></VStack>;
}
function Status({ value }: { value: string }) {
  return <Badge variant={value === "Active" ? "default" : "secondary"}>{value}</Badge>;
}
function Attribute({ label, children }: { label: string; children: React.ReactNode }) {
  return <VStack gap={2} className="min-w-0"><Text className="text-sm text-grey-strongest">{label}</Text><Text className="break-words">{children}</Text></VStack>;
}
function NavigationControl() {
  const { isMobile, state } = useSidebar();
  return !isMobile && <SidebarHeader className={state === "expanded" ? "items-end" : "items-center"}><SidebarTrigger aria-label="Réduire ou développer le menu" /></SidebarHeader>;
}
function Header() {
  const { isMobile } = useSidebar();
  return <PageHeader title="Identité & accès" showTitleButton={false} leftContent={isMobile ? <SidebarTrigger /> : undefined} rightContent={<Badge variant="outline">Backoffice SSO</Badge>} />;
}

/** Section headings stay above cards; tables can use the full content width. */
function ContentSection({ title, description, accessory, actions, uncontained = false, cardClassName, children }: {
  title: string;
  description?: string;
  accessory?: React.ReactNode;
  actions?: React.ReactNode;
  uncontained?: boolean;
  cardClassName?: string;
  children: React.ReactNode;
}) {
  const heading = <HStack justify="between" align="center" gap={3} wrap>
    <VStack gap={1}>
      <HStack align="center" gap={2}><CardTitle>{title}</CardTitle>{accessory}</HStack>
      {description && <Text as="p" className="text-sm text-grey-strongest">{description}</Text>}
    </VStack>
    {actions}
  </HStack>;
  return <VStack as="section" gap={3}>{heading}{uncontained ? children : <Card className={`gap-4 ${cardClassName ?? ""}`}>{children}</Card>}</VStack>;
}

export interface SSOBackofficeExampleProps {
  initialView?: "list" | "detail" | "invite" | "edit" | "errors" | "selection"; }
/** A local, interactive CRUD composition. No network or account operations. */
export function SSOBackofficeExample({ initialView = "list" }: SSOBackofficeExampleProps) {
  const [rows, setRows] = React.useState(people);
  const [personId, setPersonId] = React.useState<string | null>(["detail", "edit"].includes(initialView) ? people[0].id : null);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("Tous");
  const [role, setRole] = React.useState("Tous");
  const [type, setType] = React.useState("Tous");
  const [appliedFilters, setAppliedFilters] = React.useState({ query: "", status: "Tous", role: "Tous", type: "Tous" });
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState(new Set(initialView === "selection" ? [people[1].id, people[2].id] : []));
  const [modal, setModal] = React.useState<"invite" | "edit" | null>(initialView === "edit" ? "edit" : ["invite", "errors"].includes(initialView) ? "invite" : null);
  const [email, setEmail] = React.useState(initialView === "edit" ? people[0].email : initialView === "errors" ? "marie@" : "");
  const [name, setName] = React.useState(initialView === "edit" ? people[0].name : "");
  const [language, setLanguage] = React.useState(initialView === "edit" ? people[0].language : "FR");
  const [error, setError] = React.useState(initialView === "errors" ? "Saisissez une adresse e-mail valide." : "");
  const [notice, setNotice] = React.useState("");
  const [interfaceLanguage, setInterfaceLanguage] = React.useState({ code: "FR", name: "Français" });
  const [help, setHelp] = React.useState(false);
  const [draftRole, setDraftRole] = React.useState(people[0].role);
  const [confirmation, setConfirmation] = React.useState<{ title: string; description: string; label: string; run: () => void } | null>(null);
  React.useEffect(() => { window.scrollTo(0, 0); }, [personId]);
  const person = rows.find(row => row.id === personId);
  const hasFilters = !!query || status !== "Tous" || role !== "Tous" || type !== "Tous" || (!!appliedFilters.query || appliedFilters.status !== "Tous" || appliedFilters.role !== "Tous" || appliedFilters.type !== "Tous");
  const filters = appliedFilters;
  const filtered = rows.filter(row => (!filters.query || normalize([row.name, row.email, row.id].join(" ")).includes(normalize(filters.query))) && (filters.status === "Tous" || row.status === filters.status) && (filters.role === "Tous" || row.role === filters.role) && (filters.type === "Tous" || row.type === filters.type));
  function changeFilter(setter: (v: string) => void, value: string) { setter(value); }
  function applySearch(event: React.FormEvent) { event.preventDefault(); setAppliedFilters({ query: query.trim(), status, role, type }); setPage(1); setSelected(new Set()); }
  function reset() { setAppliedFilters({ query: "", status: "Tous", role: "Tous", type: "Tous" }); setQuery(""); setStatus("Tous"); setRole("Tous"); setType("Tous"); setPage(1); setSelected(new Set()); }
  function openPerson(row: Person) { setPersonId(row.id); setDraftRole(row.role); setSelected(new Set()); setNotice(""); }
  function openForm(mode: "invite" | "edit") { setEmail(mode === "edit" && person ? person.email : ""); setName(mode === "edit" && person ? person.name : ""); setLanguage(mode === "edit" && person ? person.language : "FR"); setError(""); setModal(mode); }
  function update(ids: Set<string>, changes: Partial<Person>) { setRows(current => current.map(row => ids.has(row.id) ? { ...row, ...changes } : row)); setSelected(new Set()); }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const cleaned = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) { setError("Saisissez une adresse e-mail valide."); return; }
    if (rows.some(row => row.email.toLowerCase() === cleaned.toLowerCase() && (modal !== "edit" || row.id !== personId))) { setError("Cette adresse e-mail est déjà associée à une personne."); return; }
    if (modal === "edit" && person) { update(new Set([person.id]), { email: cleaned, name: name.trim(), language }); setNotice("Les modifications ont été enregistrées dans la démonstration."); }
    else { setRows(current => [...current, { id: crypto.randomUUID(), name: name.trim(), email: cleaned, type: "Personne", status: "Invitée", role: "Aucun", language, created: new Date().toISOString(), organisation: "—" }]); setNotice("Invitation ajoutée à la démonstration. Aucun e-mail n’a été envoyé."); }
    setModal(null);
  }
  function exportCSV(data: Person[]) {
    const cell = (value: string) => '"' + (/^[=+@\-\t\r]/.test(value) ? "'" : "") + value.replace(/"/g, '""') + '"';
    const content = [["Nom", "E-mail", "Type", "Statut", "Rôle de plateforme", "Créée le"], ...data.map(row => [row.name, row.email, row.type, row.status, row.role, row.created])].map(row => row.map(cell).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "personnes.csv"; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function confirmDisable(ids: Set<string>) { setConfirmation({ title: ids.size > 1 ? `Désactiver ${ids.size} personnes ?` : "Désactiver cette personne ?", description: "Ces personnes ne pourront plus se connecter. Leurs sessions seront fermées lors de l’intégration au service SSO.", label: "Désactiver", run: () => { update(ids, { status: "Désactivée" }); setNotice("Désactivation appliquée dans la démonstration."); } }); }
  const columns: TableColumn<Person>[] = [
    { id: "name", header: "Nom", sortable: true, cell: row => <HStack gap={2} align="center"><Avatar><AvatarFallback>{(row.name || row.email).slice(0, 2).toUpperCase()}</AvatarFallback></Avatar><Button variant="link" onClick={() => openPerson(row)} className="p-0 text-left">{row.name || "Nom non renseigné"}</Button></HStack>, interactive: true },
    { id: "email", header: "E-mail / identifiant", sortable: true, cell: row => <Text className="block max-w-[280px] truncate" title={row.email}>{row.email}</Text> },
    { id: "type", header: "Type", sortable: true, cell: row => row.type },
    { id: "status", header: "Statut", sortable: true, cell: row => <Status value={row.status} /> },
    { id: "role", header: "Rôle de plateforme", sortable: true, cell: row => row.role === "Aucun" ? <Text className="text-grey-strongest">—</Text> : <Badge variant="outline">{row.role}</Badge> },
    { id: "created", header: "Créée le", sortable: true, cell: row => date(row.created) },
  ];
  return <ActionBarProvider><SidebarProvider defaultOpen className="gs-sso-backoffice text-left">
    <Sidebar bg="black">
      <NavigationControl />
      <SidebarContent>{navigation.map(group => <SidebarGroup key={group.title}><SidebarGroupLabel>{group.title}</SidebarGroupLabel><SidebarMenu>{group.items.map(([label, icon]) => <SidebarMenuItem key={label}><SidebarMenuButton isActive={label === "Personnes"} tooltip={label} onClick={() => label === "Personnes" ? (setPersonId(null), setNotice("")) : setNotice(`La rubrique « ${label} » n’est pas incluse dans cet exemple.`)}><IconProvider icon={icon} /><span>{label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroup>)}</SidebarContent>
      <SidebarFooter><SidebarUserMenu name="Platform admin" avatar={<Avatar><AvatarFallback>PA</AvatarFallback></Avatar>} actions={[{ label: "Se déconnecter", icon: <IconProvider icon="Logout" />, onClick: () => setNotice("Démonstration : aucune session réelle n’a été déconnectée.") }]} /><HStack justify="between" align="center" className="px-2 py-1"><Text className="text-sm">Langue de l’interface</Text><LanguageSwitcher languages={[{ code: "FR", name: "Français" }, { code: "EN", name: "English" }]} currentLanguage={interfaceLanguage} onLanguageChange={value => { setInterfaceLanguage(value); setNotice("Préférence de langue : " + value.name + ". Cette maquette présente les écrans en français."); }} /></HStack></SidebarFooter>
    </Sidebar>
    <SidebarInset className="min-w-0"><Header />
      <VStack as="main" bg="grey" gap={5} className="min-h-[calc(100vh-60px)] px-4 py-6 md:px-6 pb-24">
        <VStack gap={1}><HStack gap={2} align="center"><Button variant="link" onClick={() => setPersonId(null)} className="p-0 text-sm">Identité</Button><Text className="text-sm text-grey-strongest">/</Text><Button variant="link" onClick={() => setPersonId(null)} className="p-0 text-sm">Personnes</Button>{person && <Text className="text-sm text-grey-strongest">/ {person.name || person.email}</Text>}</HStack>
        <HStack align="center" justify="between" gap={4} wrap><VStack gap={1}><HStack align="center" gap={3}><Text as="h1" className="text-2xl font-bold">{person ? person.name || "Personne invitée" : "Personnes"}</Text>{person && <Status value={person.status} />}</HStack><Text as="p" className="text-grey-strongest">{person ? person.email : "Gérez les identités et les accès à votre plateforme."}</Text></VStack>
        <HStack gap={2} wrap align="center">{person ? <><Button onClick={() => openForm("edit")}><IconProvider icon="Pencil" />Modifier</Button><DropdownMenu><DropdownMenuTrigger asChild><Button variant="secondary"><IconProvider icon="Settings" />Actions<IconProvider icon="ChevronDown" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => setConfirmation({ title: "Réinitialiser les seconds facteurs ?", description: "La personne devra configurer à nouveau ses facteurs d’authentification à sa prochaine connexion.", label: "Réinitialiser", run: () => setNotice("Demande simulée de réinitialisation des seconds facteurs.") })}>Réinitialiser les seconds facteurs</DropdownMenuItem><DropdownMenuItem onSelect={() => setConfirmation({ title: "Exiger un nouveau mot de passe ?", description: "La personne devra changer son mot de passe à sa prochaine connexion.", label: "Confirmer", run: () => setNotice("Demande simulée de changement de mot de passe.") })}>Exiger un nouveau mot de passe</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onSelect={() => confirmDisable(new Set([person.id]))}>Désactiver la personne</DropdownMenuItem><DropdownMenuItem onSelect={() => setConfirmation({ title: "Anonymiser cette personne ?", description: "Cette action efface ses données personnelles et désactive son compte. Dans l’application, elle est irréversible.", label: "Anonymiser", run: () => { update(new Set([person.id]), { name: "Personne anonymisée", email: `${person.id}@anonyme.invalid`, status: "Désactivée", organisation: "—", role: "Aucun" }); setDraftRole("Aucun"); setNotice("Anonymisation appliquée dans la démonstration."); } })}>Anonymiser (RGPD)</DropdownMenuItem></DropdownMenuContent></DropdownMenu></> : <><Button variant="secondary" onClick={() => exportCSV(filtered)}><IconProvider icon="Download" />Exporter en CSV</Button><Button onClick={() => openForm("invite")}><IconProvider icon="Plus" />Inviter une personne</Button></>}<Button variant="ghost" aria-label="Afficher l’aide" aria-pressed={help} onClick={() => setHelp(!help)}><IconProvider icon="Help" /></Button></HStack></HStack></VStack>
        {notice && <Alert role="status" className="border-0 bg-pastel-blue-secondary"><HStack justify="between" align="center" gap={3}><AlertDescription>{notice}</AlertDescription><Button variant="ghost" aria-label="Fermer le message" onClick={() => setNotice("")}><IconProvider icon="X" /></Button></HStack></Alert>}
        {help && <Alert role="note" className="border-0 bg-pastel-yellow-secondary"><AlertTitle>Comprendre les accès</AlertTitle><AlertDescription>Une identité permet de se connecter. L’accès aux espaces de travail est accordé par les organisations. Les rôles de plateforme donnent des droits d’administration transverses.</AlertDescription></Alert>}
        {!person ? <>
          <form onSubmit={applySearch}>
            <VStack gap={3}>
              <ContentSection title="Rechercher et filtrer" cardClassName="p-3 sm:p-4" actions={hasFilters ? <Button type="button" variant="link" onClick={reset}>Réinitialiser</Button> : undefined}>
                <Layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-[2fr_1fr_1.5fr_1fr]"><VStack gap={2}><Label htmlFor="people-search">E-mail, nom ou identifiant</Label><Search id="people-search" containerClassName="w-full" className="w-full" captureFindShortcut value={query} placeholder="Rechercher une personne…" onChange={event => changeFilter(setQuery, event.target.value)} onClear={() => changeFilter(setQuery, "")} /></VStack><Choice id="filter-status" label="Statut" value={status} options={["Tous", "Active", "Invitée", "Désactivée"]} onChange={v => changeFilter(setStatus, v)} /><Choice id="filter-role" label="Rôle de plateforme" value={role} options={["Tous", ...roles]} onChange={v => changeFilter(setRole, v)} /><Choice id="filter-type" label="Type" value={type} options={["Tous", "Personne", "Agent IA"]} onChange={v => changeFilter(setType, v)} /></Layout>
              </ContentSection>
              <Button type="submit" variant="inverse" className="self-end"><IconProvider icon="Search" />Rechercher</Button>
            </VStack>
          </form>
          <ContentSection title="Personnes" accessory={<Badge variant="secondary">{filtered.length}</Badge>} description="Sélectionnez des lignes pour afficher les actions groupées." uncontained>
            <DataTable data={filtered} columns={columns} getRowId={row => row.id} onRowClick={openPerson} selectable selectedIds={selected} onSelectionChange={setSelected} pageSize={10} pageSizeOptions={[5, 10, 25, 50]} currentPage={page} onPageChange={setPage} defaultSort={{ columnId: "created", direction: "desc" }} language="FR" emptyState={<VStack align="center" gap={3} className="py-8"><IconProvider icon="Users" size={28} /><Text>Aucune personne ne correspond aux filtres.</Text><Button variant="secondary" onClick={reset}>Réinitialiser les filtres</Button></VStack>} actionBar={({ selectedRows }) => <><Button variant="secondary" onClick={() => exportCSV(selectedRows)}><IconProvider icon="Download" />Exporter la sélection</Button><Button variant="destructive" onClick={() => confirmDisable(new Set(selectedRows.map(row => row.id)))}>Désactiver</Button></>} />
          </ContentSection>
        </> : <>
          <ContentSection title="Identité" accessory={<Badge variant="secondary">{person.type}</Badge>}><Layout className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3"><Attribute label="Nom">{person.name || "Non renseigné"}</Attribute><Attribute label="E-mail / identifiant">{person.email}</Attribute><Attribute label="Organisation">{person.organisation}</Attribute><Attribute label="Langue">{person.language === "FR" ? "Français" : "English"}</Attribute><Attribute label="Créée le">{date(person.created)}</Attribute><Attribute label="Identifiant unique"><Text className="text-sm break-all">{person.id}</Text></Attribute></Layout></ContentSection>
          <ContentSection title="Rôle de plateforme" description="Définissez les droits d’administration de cette personne."><HStack align="end" gap={3} wrap><Layout className="w-full sm:max-w-[360px]"><Choice id="person-role" label="Rôle de plateforme" value={draftRole} options={roles} onChange={setDraftRole} /></Layout><Button disabled={draftRole === person.role} onClick={() => setConfirmation({ title: "Modifier le rôle de plateforme ?", description: `Nouveau rôle : ${draftRole}. Les superadmins seront prévenus par e-mail et les sessions de la personne seront fermées.`, label: "Enregistrer le rôle", run: () => { update(new Set([person.id]), { role: draftRole }); setNotice("Rôle modifié dans la démonstration. Aucun e-mail n’a été envoyé."); } })}>Enregistrer le rôle</Button></HStack><Alert role="note" className="border-0 bg-pastel-yellow-secondary"><AlertDescription><Text className="font-medium">Une modification sensible.</Text> Chaque changement prévient les superadmins par e-mail et ferme les sessions de la personne.</AlertDescription></Alert></ContentSection>
          <ContentSection title="Sessions ouvertes" accessory={<Badge variant="secondary">0</Badge>}><VStack align="center" gap={2} className="py-5"><IconProvider icon="Check" size={28} /><Text className="font-medium">Aucune session ouverte</Text><Text className="text-sm text-grey-strongest">Les connexions actives de cette personne apparaîtront ici.</Text></VStack></ContentSection>
        </>}
        <Text className="text-sm text-grey-strongest">Démonstration interactive · données locales, sans connexion au service SSO.</Text>
      </VStack>
    </SidebarInset>
    <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal === "edit" ? "Modifier la personne" : "Inviter une personne"} padding={6} className="w-[540px]" maxWidth="calc(100vw - 30px)" header={<HStack align="center" justify="between"><Text as="h2" className="gs-typo-h2">{modal === "edit" ? "Modifier la personne" : "Inviter une personne"}</Text><Button variant="ghost" aria-label="Fermer" onClick={() => setModal(null)}><IconProvider icon="X" /></Button></HStack>} footer={<><Button variant="secondary" onClick={() => setModal(null)}>Annuler</Button><Button type="submit" form="person-form">{modal === "edit" ? "Enregistrer les modifications" : "Envoyer l’invitation"}</Button></>}>
      <form id="person-form" noValidate onSubmit={submit}><VStack gap={5}>
        {modal === "invite" && <Alert role="note" className="border-0 bg-pastel-blue-secondary"><AlertDescription>La personne reçoit un lien pour créer son mot de passe, valable 7 jours. Ses organisations lui donnent accès aux espaces de travail.</AlertDescription></Alert>}
        <VStack gap={2}><Label htmlFor="person-email">E-mail <Text className="text-grey-strongest">(obligatoire)</Text></Label><Input id="person-email" autoFocus type="email" autoComplete="email" required value={email} onChange={event => { setEmail(event.target.value); setError(""); }} placeholder="prenom.nom@entreprise.fr" aria-invalid={!!error} aria-describedby={error ? "email-error" : undefined} className={error ? "border-destructive" : ""} />{error && <Text as="p" id="email-error" role="alert" className="text-sm text-destructive">{error}</Text>}</VStack>
        <VStack gap={2}><Label htmlFor="person-name">Nom <Text className="text-grey-strongest">(facultatif)</Text></Label><Input id="person-name" autoComplete="name" value={name} onChange={event => setName(event.target.value)} placeholder="Prénom et nom" /></VStack>
        <Choice id="person-language" label="Langue des communications" value={language} options={["FR", "EN"]} onChange={setLanguage} />
      </VStack></form>
    </Modal>
    <Modal isOpen={!!confirmation} onClose={() => setConfirmation(null)} title={confirmation?.title} padding={6} className="w-[500px]" maxWidth="calc(100vw - 30px)" header={<Text as="h2" className="gs-typo-h2">{confirmation?.title}</Text>} footer={<><Button variant="secondary" autoFocus onClick={() => setConfirmation(null)}>Annuler</Button><Button variant="destructive" onClick={() => { confirmation?.run(); setConfirmation(null); }}>{confirmation?.label}</Button></>}><Text as="p">{confirmation?.description}</Text></Modal>
  </SidebarProvider></ActionBarProvider>;
}
