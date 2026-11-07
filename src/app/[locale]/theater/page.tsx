import type { Metadata } from 'next';
import { Programme } from '@/components/events/ProgrammeRow';
import { Spotlight } from '@/components/events/Spotlight';
import { Faq } from '@/components/ui/Faq';
import { PageHeader } from '@/components/ui/PageHeader';
import { PosterText } from '@/components/ui/PosterText';
import { SectionHead } from '@/components/ui/SectionHead';
import { Term } from '@/components/ui/Term';
import { getArtist } from '@/content/artists';
import { resolveEvents } from '@/content/events';
import { resolvePoster } from '@/content/media';
import { offerImages } from '@/content/offers';
import { bookingPath, featuredProduction, getProduction, productionPath } from '@/content/productions';
import { venue } from '@/content/site';
import { localizePath } from '@/i18n/config';
import { format, getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from './theater.module.css';

const PATH = '/theater';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({
    locale,
    path: PATH,
    title: t.meta.titles.theater,
    description: t.theater.title,
    image: resolvePoster(t, 'saveTheDate'),
  });
}

/** Theatre: the "Save the date" spotlight for the featured production, upcoming events and a booking FAQ. */
export default async function TheaterPage() {
  const { locale, t } = await getI18n();
  const th = t.theater;
  const f = t.featured;
  const l = (href: string) => localizePath(href, locale);
  const production = getProduction(featuredProduction);
  const credit = (kind: 'author' | 'composer') => getArtist(production?.cast.find((c) => c.credit === kind)?.artist ?? '')?.name;
  // Same list (and order) as the theatre entries of "All events".
  const upcoming = resolveEvents(t, locale).filter((event) => event.category === 'theater');

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.theater}
        kicker={th.eyebrow}
        title={th.title}
        image={offerImages.performance}
      />

      {/* ---------- Save the date: first public reading ---------- */}
      <section className="section" aria-labelledby="std-title">
        <div className="container">
          <Spotlight
            id="std-title"
            kicker={th.std.eyebrow}
            title="Douala Manga Bell"
            titleLang={locale === 'de' ? undefined : 'de'}
            subtitle={{ text: 'Der König der sein Recht wollte', lang: locale === 'de' ? undefined : 'de', translation: f.subtitleTranslation }}
            date={{ parts: ['13', '12', '26'], label: f.dateLong }}
            facts={[
              { label: f.labels.time, value: f.time },
              {
                label: f.labels.venue,
                value: (
                  <>
                    <span className={styles.line}>{venue.name}</span>
                    <span className={styles.line}>
                      {venue.street}, {venue.city}
                    </span>
                    <Term id="global-village" locale={locale} explained={t.common.explained}>
                      {venue.place}
                    </Term>
                  </>
                ),
              },
              { label: f.labels.author, value: credit('author') },
              { label: f.labels.composer, value: credit('composer') },
            ]}
            primary={{ href: l(bookingPath(featuredProduction)), label: th.std.reserve, kind: 'booking', srLabel: ': Douala Manga Bell' }}
            secondary={{ href: l(productionPath(featuredProduction)), label: t.showCard.info, srLabel: ': Douala Manga Bell' }}
            credit={th.std.credit}
            poster={{
              image: resolvePoster(t, 'saveTheDate'),
              label: format(t.common.enlargePoster, { title: `${f.title} ${f.subtitle}` }),
              zoom: t.common.zoom,
              text: <PosterText poster="saveTheDate" locale={locale} t={t.posterText} />,
            }}
            priority
          />
        </div>
      </section>

      {/* ---------- Upcoming events ---------- */}
      <section className="surface-stage section" aria-labelledby="upcoming-title">
        <div className="container">
          <SectionHead id="upcoming-title" title={th.upcomingH} link={{ href: l('/events'), label: t.home.viewAll }} />
          <Programme events={upcoming} showCategory={false} />
        </div>
      </section>

      {/* ---------- Before you book ---------- */}
      <section className="surface-clay section" aria-labelledby="book-faq">
        <div className={`container ${styles.faqGrid}`}>
          <SectionHead id="book-faq" kicker={th.bookEyebrow} title={th.bookH} />
          <Faq items={t.bookingFaq} />
        </div>
      </section>
    </>
  );
}
