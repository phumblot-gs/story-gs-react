import * as React from "react";
import { Button } from "./button";
import { Icon } from "./icons";
import { BgProvider, useBgContext } from "@/components/layout/BgContext";
import { useTranslationSafe } from "@/contexts/TranslationContext";
import { groupTimelineItems } from "@/lib/timeline-dates";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  /** Stable ID, unique across all groups. */
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** UTC ISO 8601 with suffix Z, e.g. 2026-09-16T15:00:54.037Z. */
  timestamp: string;
  disabled?: boolean;
}

export interface TimelineProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "children"> {
  items: TimelineItem[];
  /** EN, FR, ES, IT or DE. Overrides TranslationProvider; defaults to EN. */
  language?: string;
  /** IANA timezone. Defaults to the runtime/browser timezone. */
  timeZone?: string;
  /** undefined = uncontrolled; null = controlled with no selection. */
  selectedId?: string | null;
  defaultSelectedId?: string;
  onSelectionChange?: (id: string, item: TimelineItem) => void;
  /** Read-only chronological list when false. */
  selectable?: boolean;
  disabled?: boolean;
  density?: "compact" | "comfortable";
  /** Inline, non-interactive content only; rendered inside a button when selectable. */
  renderItem?: (item: TimelineItem, context: { selected: boolean; disabled: boolean }) => React.ReactNode;
  emptyContent?: React.ReactNode;
}

/** A grouped chronological list, optionally selecting an external detail view. */
export const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(function Timeline(
  { items, language, timeZone, selectedId, defaultSelectedId, onSelectionChange, selectable = true, disabled = false,
    density = "compact", renderItem, emptyContent, className, ...props }, ref,
) {
  const { currentLanguage } = useTranslationSafe({}, language);
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const update = () => setNow(new Date());
    const interval = window.setInterval(update, 60_000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const visibleGroups = React.useMemo(() => groupTimelineItems(items, currentLanguage.code, timeZone, now), [items, currentLanguage.code, timeZone, now]);
  const bg = useBgContext() ?? "white";
  const scope = React.useId();
  const [internalId, setInternalId] = React.useState<string | undefined>(defaultSelectedId);
  const currentId = selectedId === undefined ? internalId : selectedId;
  return (
    <BgProvider value={bg}>
      <div {...props} ref={ref} data-bg={bg} data-density={density} className={cn("gs-timeline", className)}>
        {visibleGroups.length === 0 ? emptyContent : visibleGroups.map((group, groupIndex) => {
          const headingId = `${scope}-group-${groupIndex}`;
          return <section key={group.id} aria-labelledby={headingId} className="gs-timeline-group">
            <h3 id={headingId} className="gs-timeline-heading">{group.label}
              {group.description && <span className="gs-timeline-group-description">{group.description}</span>}
            </h3>
            <ol className="gs-timeline-list">
              {group.items.map(({ item, time, fullDate }, index) => {
                const selected = selectable && currentId === item.id;
                const isDisabled = disabled || !!item.disabled;
                const timeId = `${headingId}-time-${index}`;
                const contentId = `${headingId}-content-${index}`;
                const content = renderItem ? renderItem(item, { selected, disabled: isDisabled }) : <>
                  <span className="gs-timeline-title">{item.title}</span>
                  {item.description != null && <span className="gs-timeline-description">{item.description}</span>}
                </>;
                return <li key={item.id} className="gs-timeline-row" data-selected={selected} data-disabled={isDisabled}>
                  <time id={timeId} dateTime={item.timestamp} title={fullDate} className="gs-timeline-time">{time}</time>
                  <span className="gs-timeline-marker" aria-hidden="true"><span /></span>
                  {selectable ? <Button type="button" variant="ghost" hasActiveElement={selected}
                    className="gs-timeline-entry" disabled={isDisabled} aria-pressed={selected}
                    aria-labelledby={`${headingId} ${timeId} ${contentId}`}
                    onClick={() => {
                      if (selected) return;
                      if (selectedId === undefined) setInternalId(item.id);
                      onSelectionChange?.(item.id, item);
                    }}>
                    <span id={contentId} className="gs-timeline-content">{content}</span>
                    <span className="gs-timeline-chevron" aria-hidden="true"><Icon name="ChevronRight" size={16} /></span>
                  </Button> : <div className="gs-timeline-entry"><span id={contentId} className="gs-timeline-content">{content}</span></div>}
                </li>;
              })}
            </ol>
          </section>;
        })}
      </div>
    </BgProvider>
  );
});
