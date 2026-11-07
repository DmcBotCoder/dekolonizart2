import { localizePath, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import { normalizeForSearch } from '@/lib/search';
import { agenda } from './agenda';
import { posters, type ImageAsset } from './media';
import { venue } from './site';
import { bookingPath, productionPath, productions, type EventCategory, type Production, type ProductionSlug } from './productions';

/** One card of the "All events" page – plain data, handed to the client-side search. */
export interface EventItem {
  id: string;
  category: EventCategory;
  categoryLabel: string;
  when: string;
  title: string;
  titleLang?: string;
  subtitle?: string;
  text: string;
  /** `booking`: the production's booking page (ticket). `signup`: workshop registration by contact. */
  primary: { href: string; label: string; kind: 'booking' | 'signup' };
  secondary: { href: string; label: string };
  /** Poster or photo of the event (decorative in lists – the title carries the meaning). */
  image?: ImageAsset;
  /** Venue name when the event takes place at the current venue. */
  place?: string;
  /** Normalised text the search looks in (names, subtitles, date, category). */
  search: string;
}

/**
 * Every event, in agenda order: the dated entries ("What's on") followed by
 * the productions that have no date yet. Production events link to the same
 * booking and information pages as everywhere else on the site. The Theater
 * page shows the `theater` ones, the "All events" page all of them.
 */
export function resolveEvents(t: Messages, locale: Locale): EventItem[] {
  const l = (href: string) => localizePath(href, locale);
  const otherLang = (lang?: Locale) => (lang && lang !== locale ? lang : undefined);
  const searchable = (...parts: (string | undefined)[]) => normalizeForSearch(parts.filter(Boolean).join(' '));

  /** `occurrence` names one dated performance; without it the card shows the production's full title. */
  const fromProduction = (id: string, production: Production, when: string, occurrence?: { title: string; asSubtitle: boolean }): EventItem => {
    const show = t.shows[production.slug];
    const categoryLabel = t.allEvents.categories[production.category];
    const titledByOccurrence = occurrence && !occurrence.asSubtitle;
    const subtitle = occurrence ? (occurrence.asSubtitle ? occurrence.title : production.shortTitle) : undefined;
    return {
      id,
      category: production.category,
      categoryLabel,
      when,
      title: titledByOccurrence ? occurrence.title : show.title,
      titleLang: titledByOccurrence ? undefined : otherLang(production.titleLang),
      subtitle,
      text: show.text,
      primary: { href: l(bookingPath(production.slug)), label: t.showCard.book, kind: 'booking' },
      secondary: { href: l(productionPath(production.slug)), label: t.showCard.info },
      image: production.image ? posters[production.image.key] : undefined,
      place: production.atCurrentVenue ? venue.name : undefined,
      search: searchable(production.shortTitle, show.title, production.subtitle, occurrence?.title, when, categoryLabel),
    };
  };

  const dated = agenda.flatMap((entry): EventItem[] => {
    const occurrence = t.events[entry.id];
    if ('production' in entry) {
      const production = productions.find((p) => p.slug === entry.production);
      const asSubtitle = 'cardTitle' in entry && entry.cardTitle === 'production';
      return production ? [fromProduction(entry.id, production, occurrence.date, { title: occurrence.title, asSubtitle })] : [];
    }
    // Theater & Geschichte – the youth workshop of MeMo (sign-up, not ticketed).
    const youth = t.artistic.youth;
    const categoryLabel = t.allEvents.categories[entry.category];
    return [
      {
        id: entry.id,
        category: entry.category,
        categoryLabel,
        when: occurrence.date,
        title: youth.h2,
        titleLang: otherLang('de'),
        subtitle: occurrence.title,
        text: youth.lead,
        primary: { href: l('/contact'), label: youth.cta, kind: 'signup' },
        secondary: { href: l(entry.href), label: t.common.knowMore },
        image: posters.theaterGeschichte,
        place: venue.place,
        search: searchable(youth.h2, youth.h2Translation, occurrence.title, occurrence.date, categoryLabel),
      },
    ];
  });

  const withDates = new Set<ProductionSlug>(agenda.flatMap((entry) => ('production' in entry ? [entry.production] : [])));
  const undated = productions
    .filter((production) => !withDates.has(production.slug))
    .map((production) => fromProduction(production.slug, production, t.shows[production.slug].when));

  return [...dated, ...undated];
}

/**
 * Every production as one programme entry with its own date line
 * (`messages.shows[slug].when`) – the Movement & dance page lists them like this.
 */
export function resolveProductionEvents(t: Messages, locale: Locale): EventItem[] {
  const all = resolveEvents(t, locale);
  return productions.map((production) => {
    const own = all.find((event) => event.id === production.slug);
    if (own) return own;
    // Productions with agenda dates: reuse the first dated entry's links, but show the production itself.
    const dated = all.find((event) => event.secondary.href.endsWith(productionPath(production.slug)));
    const show = t.shows[production.slug];
    return {
      ...(dated as EventItem),
      id: production.slug,
      when: show.when,
      title: show.title,
      titleLang: production.titleLang && production.titleLang !== locale ? production.titleLang : undefined,
      subtitle: undefined,
      text: show.text,
    };
  });
}
