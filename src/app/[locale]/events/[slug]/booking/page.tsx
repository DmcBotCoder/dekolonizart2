import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Facts } from '@/components/events/Facts';
import { Faq } from '@/components/ui/Faq';
import { PageHeader } from '@/components/ui/PageHeader';
import { PosterButton } from '@/components/ui/PosterButton';
import { SectionHead } from '@/components/ui/SectionHead';
import { resolvePoster } from '@/content/media';
import { bookingPath, getProduction, productionPath, productions, resolveBooking } from '@/content/productions';
import { site, venue } from '@/content/site';
import { localizePath } from '@/i18n/config';
import { format, getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from './booking.module.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return productions.map((production) => ({ slug: production.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const production = getProduction(slug);
  if (!production) return {};
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({
    locale,
    path: bookingPath(production.slug),
    title: format(t.booking.pageTitle, { title: production.shortTitle }),
    description: t.shows[production.slug].text,
    image: production.image ? resolvePoster(t, production.image.key) : undefined,
  });
}

/**
 * Booking page – the single destination of every booking button. With a
 * ticket link configured (`booking.url`) it hands over to the provider
 * (Vibetix); without one it says so and offers reservation by e-mail.
 */
export default async function BookingPage({ params }: Props) {
  const { slug } = await params;
  const production = getProduction(slug);
  if (!production) notFound();

  const { locale, t } = await getI18n();
  const b = t.booking;
  const f = t.featured;
  const show = t.shows[production.slug];
  const titleLang = production.titleLang && production.titleLang !== locale ? production.titleLang : undefined;
  const poster = production.image?.kind === 'poster' ? resolvePoster(t, production.image.key) : undefined;
  const online = resolveBooking(production);
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(format(b.emailSubject, { title: production.shortTitle }))}`;
  const [beforeEmail, afterEmail] = b.byEmail.split('{email}');

  const facts = [
    { label: f.labels.date, value: show.when },
    ...(production.atCurrentVenue
      ? [
          {
            label: f.labels.venue,
            value: (
              <>
                <span className={styles.line}>{venue.name}</span>
                <span className={styles.line}>
                  {venue.street}, {venue.city}
                </span>
                <span className={styles.line}>{venue.place}</span>
                <a href={venue.mapUrl} target="_blank" rel="noopener">
                  {t.common.showOnMap}
                  <span className="sr-only"> {t.common.newTab}</span>
                </a>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHeader
        size="m"
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(bookingPath(production.slug), locale, t, [
          { href: '/theater', label: t.nav.theater.label },
          { href: productionPath(production.slug), label: production.shortTitle },
        ])}
        current={b.eyebrow}
        kicker={b.eyebrow}
        title={production.shortTitle}
        titleLang={titleLang}
      />

      <section className="section" aria-labelledby="book-title">
        <div className={`container ${styles.layout} ${poster ? '' : styles.noPoster}`}>
          {poster && (
            <div className={styles.posterCol}>
              <PosterButton
                image={poster}
                label={format(t.common.enlargePoster, { title: production.shortTitle })}
                zoomLabel={t.common.zoom}
                sizes="(min-width: 900px) 28vw, 70vw"
                priority
              />
            </div>
          )}

          {/* The ticket: facts on the stub, the hand-over (or e-mail fallback) on the counterfoil. */}
          <div className={styles.ticket}>
            <div className={styles.stubPart}>
              <h2 id="book-title">{b.title}</h2>
              <Facts items={facts} columns={1} />
            </div>
            <div className={styles.counterfoil}>
              {online ? (
                <>
                  <p>{format(b.provider, { provider: online.provider })}</p>
                  <a className="ticket" href={online.url} target="_blank" rel="noopener">
                    {b.continue}
                    <span className="sr-only">
                      : {show.title} {t.common.newTab}
                    </span>
                  </a>
                </>
              ) : (
                <>
                  <p className={styles.status}>{b.unavailable}</p>
                  <p>
                    {beforeEmail}
                    <a className={styles.mail} href={mailto}>
                      {site.email}
                    </a>
                    {afterEmail}
                  </p>
                  <a className="btn" href={mailto}>
                    {b.emailCta}
                  </a>
                </>
              )}
            </div>
          </div>

          <Link href={localizePath(productionPath(production.slug), locale)} className={`btn-line ${styles.back}`}>
            {t.showCard.info}
            <span className="sr-only">: {show.title}</span>
          </Link>
        </div>
      </section>

      <section className="surface-clay section" aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`}>
          <SectionHead id="faq-title" kicker={t.theater.bookEyebrow} title={t.theater.bookH} />
          <Faq items={t.bookingFaq} />
        </div>
      </section>
    </>
  );
}
