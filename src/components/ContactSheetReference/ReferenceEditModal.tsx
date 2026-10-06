import * as React from "react";
import { Modal } from "@/components/layout/Modal";
import { HStack, VStack } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TagText } from "@/components/ui/tag-text";
import { useTranslationSafe, type TranslationMap } from "@/contexts/TranslationContext";
import { formatAttributeValue, getAttributeValue } from "./attribute-values";
import type { ReferenceAttributeConfig, ReferenceData, ReferenceUpdate } from "./types";

export interface ReferenceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  reference: ReferenceData;
  /** Attributs modifiables, dans l'ordre d'affichage du formulaire. */
  attributes: ReferenceAttributeConfig[];
  /** Affiche l'éditeur de tags. */
  editableTags?: boolean;
  /** Peut être asynchrone : la modale reste ouverte jusqu'à la résolution. */
  onSubmit: (update: ReferenceUpdate) => void | Promise<void>;
  language?: string;
  translations?: Partial<TranslationMap>;
}

function initialValues(reference: ReferenceData, attributes: ReferenceAttributeConfig[]) {
  return Object.fromEntries(
    attributes.map((a) => [a.key, formatAttributeValue(getAttributeValue(reference, a.key))]),
  );
}

/**
 * Formulaire « Modifier » d'une référence : attributs modifiables et tags.
 * Le brouillon est initialisé à chaque ouverture depuis les données courantes,
 * puis seules les valeurs effectivement modifiées sont soumises.
 */
export const ReferenceEditModal: React.FC<ReferenceEditModalProps> = ({
  isOpen,
  onClose,
  reference,
  attributes,
  editableTags = true,
  onSubmit,
  language,
  translations,
}) => {
  const { t } = useTranslationSafe(translations, language);
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [tags, setTags] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Réinitialise le brouillon à l'ouverture seulement : une mise à jour des
  // données pendant la saisie ne doit pas écraser ce que l'utilisateur tape.
  React.useEffect(() => {
    if (!isOpen) return;
    setValues(initialValues(reference, attributes));
    setTags(reference.tags ?? []);
    setNewTag("");
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setNewTag("");
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const initial = initialValues(reference, attributes);
    const changed = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== initial[key]),
    );
    const initialTags = reference.tags ?? [];
    const tagsChanged =
      tags.length !== initialTags.length || tags.some((tag, i) => tag !== initialTags[i]);

    const update: ReferenceUpdate = { values: changed };
    if (editableTags && tagsChanged) update.tags = tags;

    setSaving(true);
    setError(null);
    try {
      await onSubmit(update);
      onClose();
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : t("contactSheet.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !saving && onClose()}
      maxWidth="min(90vw, 520px)"
      className="w-full"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            {t("contactSheet.cancel")}
          </Button>
          <Button onClick={() => handleSubmit()} disabled={saving}>
            {t("contactSheet.save")}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="w-full">
        <VStack gap={3} padding={4}>
          <h2 className="text-base font-bold m-0">
            {t("contactSheet.editTitle", { ref: reference.ref })}
          </h2>

          {attributes.map((attribute) => {
            const id = `ref-${reference.reference_id}-${attribute.key}`;
            return (
              <VStack key={attribute.key} gap={1}>
                <Label htmlFor={id}>{attribute.label}</Label>
                <Input
                  id={id}
                  value={values[attribute.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [attribute.key]: e.target.value })}
                  disabled={saving}
                />
              </VStack>
            );
          })}

          {editableTags && (
            <VStack gap={1}>
              <Label htmlFor={`ref-${reference.reference_id}-new-tag`}>{t("contactSheet.tags")}</Label>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1" data-testid="reference-tags">
                  {tags.map((tag) => (
                    <TagText
                      key={tag}
                      title={tag}
                      disabled={saving}
                      onRemove={() => setTags(tags.filter((t) => t !== tag))}
                    >
                      {tag}
                    </TagText>
                  ))}
                </div>
              )}
              <HStack gap={2}>
                <Input
                  id={`ref-${reference.reference_id}-new-tag`}
                  value={newTag}
                  placeholder={t("contactSheet.addTagPlaceholder")}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    // Entrée ajoute le tag au lieu de soumettre le formulaire.
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  disabled={saving}
                />
                <Button variant="secondary" onClick={addTag} disabled={saving || !newTag.trim()}>
                  {t("contactSheet.addTag")}
                </Button>
              </HStack>
            </VStack>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-strong m-0">
              {error}
            </p>
          )}
        </VStack>
      </form>
    </Modal>
  );
};

ReferenceEditModal.displayName = "ReferenceEditModal";
