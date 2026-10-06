/**
 * Copie `text` dans le presse-papier. L'API Clipboard n'existe qu'en contexte
 * sécurisé (https, localhost) : ailleurs, repli sur `execCommand("copy")`.
 * Renvoie `false` si aucune des deux méthodes n'a fonctionné.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission refusée : on tente le repli.
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
