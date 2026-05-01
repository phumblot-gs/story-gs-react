"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslationSafe, TranslationMap } from "@/contexts/TranslationContext";

export interface PageWelcomeProps {
  /** First name shown after the greeting (e.g. "Pierre"). */
  userName: string;
  /**
   * Eyebrow (small overline) shown above the greeting.
   * Defaults to a localized "HOME" via the `pageWelcome.defaultEyebrow` key.
   * Pass an empty string to hide it.
   */
  eyebrow?: string;
  /**
   * Greeting word(s) prefixed to the user name (e.g. "Bonjour").
   * Defaults to a time-of-day greeting localized via
   * `pageWelcome.greeting.morning|afternoon|evening`.
   */
  greeting?: string;
  /**
   * Free-form content rendered below the greeting. Use this for stats,
   * inline links, icons, etc. Translation and pluralization are the
   * caller's responsibility — call `t()` from `useTranslationSafe` /
   * `useTranslation` and pass the resulting node here.
   */
  subtitle?: React.ReactNode;
  /**
   * Override the date used to derive the time-of-day greeting (default: now).
   * Mostly useful for tests and Storybook.
   */
  now?: Date;
  /** Additional className appended to the root container. */
  className?: string;
  // Translation props (optional - works without TranslationProvider)
  language?: string;                          // Language code (e.g., "fr", "en", "es", "it", "de")
  translations?: Partial<TranslationMap>;     // Custom translations to override defaults
}

const getTimeOfDayKey = (hours: number): "morning" | "afternoon" | "evening" => {
  if (hours < 12) return "morning";
  if (hours < 18) return "afternoon";
  return "evening";
};

const PageWelcome = React.forwardRef<HTMLDivElement, PageWelcomeProps>(
  function PageWelcome(
    { userName, eyebrow, greeting, subtitle, now, className, language, translations },
    ref,
  ) {
    const { t } = useTranslationSafe(translations, language);

    const resolvedEyebrow = eyebrow !== undefined ? eyebrow : t("pageWelcome.defaultEyebrow");

    const resolvedGreeting = React.useMemo(() => {
      if (greeting !== undefined) return greeting;
      const date = now ?? new Date();
      const period = getTimeOfDayKey(date.getHours());
      return t(`pageWelcome.greeting.${period}`);
    }, [greeting, now, t]);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        role="region"
        aria-label={resolvedEyebrow || `${resolvedGreeting}, ${userName}`}
      >
        {resolvedEyebrow && (
          <span className="text-xs font-semibold uppercase tracking-wider text-grey-strongest">
            {resolvedEyebrow}
          </span>
        )}
        <h1 className="gs-typo-h1">
          {resolvedGreeting}, {userName}.
        </h1>
        {subtitle !== undefined && subtitle !== null && subtitle !== false && (
          <p className="text-sm text-grey-strongest">{subtitle}</p>
        )}
      </div>
    );
  },
);

export default PageWelcome;
