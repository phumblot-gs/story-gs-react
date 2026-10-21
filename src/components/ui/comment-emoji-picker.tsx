import * as React from "react";
import { Picker } from "emoji-mart";
import data from "@emoji-mart/data";
import french from "@emoji-mart/data/i18n/fr.json";

/** Loaded with its data only when the user opens the emoji picker. */
export default function CommentEmojiPicker({ locale, theme, onSelect }: {
  locale: "en" | "fr";
  theme: "light" | "dark";
  onSelect: (emoji: string) => void;
}) {
  const host = React.useRef<HTMLDivElement>(null);
  const callback = React.useRef(onSelect);
  callback.current = onSelect;
  React.useEffect(() => {
    const element = host.current;
    if (!element) return;
    const picker = new Picker({ data, locale, i18n: locale === "fr" ? french : undefined,
      theme, previewPosition: "none", skinTonePosition: "search", autoFocus: true,
      onEmojiSelect: (emoji: { native: string }) => callback.current(emoji.native),
    });
    element.appendChild(picker as unknown as HTMLElement);
    return () => { element.replaceChildren(); };
  }, [locale, theme]);
  return <div ref={host} />;
}
