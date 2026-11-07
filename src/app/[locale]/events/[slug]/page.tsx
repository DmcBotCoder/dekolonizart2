import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Facts } from '@/components/events/Facts';
import { Initials } from '@/components/people/Initials';
import { Faq } from '@/components/ui/Faq';
import { PageHeader } from '@/components/ui/PageHeader';
import { PosterButton } from '@/components/ui/PosterButton';
import { ProductionMedia } from '@/components/ui/ProductionMedia';
import { ReadMore } from '@/components/ui/ReadMore';
import { SectionHead } from '@/components/ui/SectionHead';
import { SectionNav } from '@/components/ui/SectionNav';
import { VideoIntro } from '@/components/ui/VideoIntro';
import { getArtist } from '@/content/artists';
import { resolveAgenda } from '@/content/agenda';
import { heroImages, resolvePoster } from '@/content/media';
import { bookingPath, getProduction, productionPath, productions } from '@/content/productions';
import { venue } from '@/content/site';
import { localizePath } from '@/i18n/config';
import { format, getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import { youTubeId } from '@/lib/youtube';
import styles from './production.module.css';

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
    path: productionPath(production.slug),
    title: production.shortTitle,
    description: t.shows[production.slug].text,
    image: production.image ? resolvePoster(t, production.image.key) : undefined,
  });
}

/**
 * Production page, composed like a playbill: the stage opening, then a
 * ticket stub that stays beside the story (date, venue, credits, Book now)
 * while plot → intro video → cast → dates run in the main column.
 */
export default async function ProductionPage({ params }: Props) {
  const { slug } = await params;
  const production = getProduction(slug);
  if (!production) notFound();

  const { locale, t } = await getI18n();
  const l = (href: string) => localizePath(href, locale);
  const show = t.shows[production.slug];
  const f = t.featured;
  const titleLang = production.titleLang && production.titleLang !== locale ? production.titleLang : undefined;
  const image = production.image ? resolvePoster(t, production.image.key) : undefined;
  const heroImage = production.heroImage ? heroImages[production.heroImage] : undefined;
  const poster = image && production.image?.kind === 'poster' ? image : undefined;
  // A photo already shown in the hero is not repeated in the body.
  const bodyPhoto = image && production.image?.kind === 'photo' && image.src !== heroImage?.src ? image : undefined;
  const cast = production.cast.flatMap((entry) => {
    const artist = getArtist(entry.artist);
    return artist ? [{ ...entry, artist }] : [];
  });
  const creditName = (kind: 'author' | 'composer') => cast.find((c) => c.credit === kind)?.artist.name;
  const plotLang = production.plot && production.plot.lang !== locale ? production.plot.lang : undefined;
  const introVideoId = production.introVideo ? youTubeId(production.introVideo.url) : undefined;
  const booking = l(bookingPath(production.slug));
  const dates = resolveAgenda(t, production.slug);
  const category = t.allEvents.categories[production.category];

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
    ...(creditName('author') ? [{ label: f.labels.author, value: creditName('author') }] : []),
    ...(creditName('composer') ? [{ label: f.labels.composer, value: creditName('composer') }] : []),
  ];

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(productionPath(production.slug), locale, t, [{ href: '/theater', label: t.nav.theater.label }])}
        current={production.shortTitle}
        kicker={category}
        title={production.shortTitle}
        titleLang={titleLang}
        subtitle={
          production.subtitle ? (
            <p className={styles.subtitle}>
              <span lang={titleLang}>{production.subtitle}</span>
              {'subtitleTranslation' in show && show.subtitleTranslation && <span className={styles.translation}>{show.subtitleTranslation}</span>}
            </p>
          ) : undefined
        }
        intro={show.text}
        image={heroImage}
      >
        <div className="actions">
          <Link href={booking} className="ticket">
            {t.showCard.book}
            <span className="sr-only">: {show.title}</span>
          </Link>
        </div>
      </PageHeader>

      <div className="section">
        <div className={`container ${styles.layout}`}>
          {/* ---------- Ticket stub + section navigation ---------- */}
          <div className={styles.aside}>
            <div className={styles.stub}>
              {poster && (
                <PosterButton
                  className={styles.poster}
                  image={poster}
                  label={format(t.common.enlargePoster, { title: production.shortTitle })}
                  zoomLabel={t.common.zoom}
                  sizes="(min-width: 1024px) 22rem, 70vw"
                />
              )}
              <Facts items={facts} columns={1} />
              <Link href={booking} className={`ticket ${styles.stubCta}`}>
                {t.showCard.book}
                <span className="sr-only">: {show.title}</span>
              </Link>
            </div>
            <SectionNav
              title={t.common.inThisSection}
              items={productions.map((p) => ({
                href: l(productionPath(p.slug)),
                label: p.shortTitle,
                lang: p.titleLang && p.titleLang !== locale ? p.titleLang : undefined,
                current: p.slug === production.slug,
              }))}
            />
          </div>

          <div className={styles.main}>
            {bodyPhoto && (
              <figure className={styles.photo}>
                <Image src={bodyPhoto.src} alt={bodyPhoto.alt} width={bodyPhoto.width} height={bodyPhoto.height} sizes="(min-width: 1024px) 60vw, 100vw" />
              </figure>
            )}

            {/* ---------- Plot (Read More) ---------- */}
            {production.plot && (
              <section className={styles.block} aria-labelledby="plot-title">
                <h2 id="plot-title">{t.production.plotH}</h2>
                {plotLang && <p className={styles.langNote}>{t.common.onlyEnglish}</p>}
                <ReadMore blocks={production.plot.blocks} lang={plotLang} labels={{ more: t.common.readMore, less: t.common.readLess }} />
              </section>
            )}

            {/* ---------- Intro video: after the plot, before the cast ---------- */}
            {introVideoId && (
              <section className={styles.block} aria-labelledby="intro-title">
                <h2 id="intro-title">{t.production.introH}</h2>
                <VideoIntro
                  id={introVideoId}
                  title={format(t.production.introVideo, { title: production.shortTitle })}
                  fallbackLabel={t.production.watchOnYouTube}
                />
              </section>
            )}

            {production.media && (
              <ProductionMedia
                items={production.media}
                heading={t.production.mediaH}
                videoLabel={t.production.watchOnYouTube}
                audioLabel={t.production.audioLabel}
              />
            )}

            {/* ---------- Cast ---------- */}
            {cast.length > 0 && (
              <section className={styles.block} aria-labelledby="cast-title">
                <h2 id="cast-title">{t.production.castH}</h2>
                <ul className={styles.cast}>
                  {cast.map(({ artist, credit }) => (
                    <li key={artist.slug}>
                      <Link href={l(`/artists#${artist.slug}`)} className={styles.castLink}>
                        <span className={styles.castFrame}>
                          {artist.photo ? (
                            <Image src={artist.photo.src} alt="" width={artist.photo.width} height={artist.photo.height} sizes="(min-width: 768px) 14rem, 40vw" />
                          ) : (
                            <Initials name={artist.name} />
                          )}
                        </span>
                        <span className={styles.castText}>
                          {credit !== 'cast' && <span className={styles.castCredit}>{f.labels[credit]}</span>}
                          <span className={styles.castName}>{artist.name}</span>
                          <span className={styles.castRole}>{t.artists.roles[artist.role]}</span>
                          <span className={styles.castMore}>{t.production.castLink}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* ---------- Dates ---------- */}
            <section id="dates" className={styles.block} aria-labelledby="dates-title" tabIndex={-1}>
              <h2 id="dates-title">{t.production.datesH}</h2>
              {dates.length > 0 ? (
                <ul className={styles.dates}>
                  {dates.map((date) => (
                    <li key={date.id}>
                      <span className={styles.dateWhen}>{date.date}</span>
                      <span className={styles.dateTitle}>{date.title}</span>
                      <Link href={booking} className="ticket">
                        {t.showCard.book}
                        <span className="sr-only">
                          : {date.title}, {date.date}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.tba}>{t.production.datesTba}</p>
              )}
            </section>
          </div>
        </div>
        {/* Phones: the booking action stays within reach while reading. */}
        <div className={`surface-deep ${styles.bar}`} role="region" aria-label={t.ui.bookingBar}>
          <span className={styles.barTitle} lang={titleLang}>
            {production.shortTitle}
            <span className={styles.barWhen}>{show.when}</span>
          </span>
          <Link href={booking} className="ticket">
            {t.showCard.book}
            <span className="sr-only">: {show.title}</span>
          </Link>
        </div>
      </div>

      <section className="surface-clay section" aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`}>
          <SectionHead id="faq-title" kicker={t.theater.bookEyebrow} title={t.theater.bookH} />
          <Faq items={t.bookingFaq} />
        </div>
      </section>
    </>
  );
}
