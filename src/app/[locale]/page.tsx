import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Programme } from '@/components/events/ProgrammeRow';
import { Spotlight } from '@/components/events/Spotlight';
import { Hero, heroNext } from '@/components/ui/Hero';
import { PosterText } from '@/components/ui/PosterText';
import { SectionHead } from '@/components/ui/SectionHead';
import { Term } from '@/components/ui/Term';
import { agenda } from '@/content/agenda';
import { getArtist } from '@/content/artists';
import { resolveEvents } from '@/content/events';
import { closingPortrait, partners, resolvePoster } from '@/content/media';
import { resolveOffers } from '@/content/offers';
import { bookingPath, featuredProduction, getProduction, productionPath } from '@/content/productions';
import { venue } from '@/content/site';
import { localizePath } from '@/i18n/config';
import { format } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildMetadata } from '@/lib/seo';
import { datePartsShortYear } from '@/lib/text';
import styles from './home.module.css';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ locale: await getLocale(), path: '/' });
}

export default async function HomePage() {
  const { locale, t } = await getI18n();
  const h = t.home;
  const f = t.featured;
  const l = (href: string) => localizePath(href, locale);

  const production = getProduction(featuredProduction);
  const credit = (kind: 'author' | 'composer') => getArtist(production?.cast.find((c) => c.credit === kind)?.artist ?? '')?.name;
  const poster = resolvePoster(t, 'saveTheDate');
  const reading = t.events.reading;

  const datedIds = new Set<string>(agenda.map((entry) => entry.id));
  const whatsOn = resolveEvents(t, locale).filter((event) => datedIds.has(event.id));
  const offers = resolveOffers(t);
  const subtitleLang = locale === 'de' ? undefined : 'de';

  return (
    <>
      {/* ---------- Opening: the torn archive ---------- */}
      <Hero
        eyebrow={h.eyebrow}
        lines={[h.h1a, h.h1b]}
        actions={{
          primary: { href: l('/services'), label: h.ctaOffers },
          secondary: { href: l('/about'), label: h.ctaAbout },
        }}
        next={{
          label: t.ui.nextUp,
          date: reading.date,
          title: reading.title,
          production: production?.shortTitle,
          productionLang: locale === 'de' ? undefined : 'de',
          venue: venue.name,
          href: l(bookingPath(featuredProduction)),
          cta: h.book,
        }}
      />

      {/* ---------- Should we all have a voice? (slides in under the hero's torn edge) ---------- */}
      <section className={`surface-paper ${heroNext}`} aria-labelledby="voice-title">
        <div className={`container grid ${styles.voice}`}>
          <h2 id="voice-title" className={styles.voiceTitle}>
            {h.introH}
          </h2>
          <div className={styles.voiceText}>
            <p className="lead">{h.lead}</p>
            <p>
              {h.p1a}
              <Term id="decolonial" locale={locale} explained={t.common.explained}>
                {h.p1term}
              </Term>
              {h.p1b}
            </p>
            <p className={styles.dare}>{h.p2}</p>
            <Link href={l('/history')} className="textlink">
              {h.history}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Save the date: the featured production ---------- */}
      <section className="surface-deep section" aria-labelledby="featured-title">
        <div className="container">
          <Spotlight
            id="featured-title"
            kicker={f.note.replace(/^\(|\)$/g, '')}
            title={f.title.replace(/,$/, '')}
            subtitle={{ text: f.subtitle, lang: subtitleLang, translation: f.subtitleTranslation }}
            lead={f.description}
            date={{ parts: datePartsShortYear(f.date), label: f.dateLong }}
            facts={[
              { label: f.labels.time, value: f.time },
              {
                label: f.labels.venue,
                value: f.venue.map((line) => (
                  <span key={line} style={{ display: 'block' }}>
                    {line.replace(/[,.]$/, '')}
                  </span>
                )),
              },
              { label: f.labels.author, value: credit('author') },
              { label: f.labels.composer, value: credit('composer') },
            ]}
            primary={{ href: l(bookingPath(featuredProduction)), label: h.book, kind: 'booking', srLabel: `: ${production?.shortTitle}` }}
            secondary={{ href: l(productionPath(featuredProduction)), label: t.showCard.info, srLabel: `: ${production?.shortTitle}` }}
            poster={{
              image: poster,
              label: format(t.common.enlargePoster, { title: `${f.title} ${f.subtitle}` }),
              zoom: t.common.zoom,
              text: <PosterText poster="saveTheDate" locale={locale} t={t.posterText} />,
            }}
          />
        </div>
      </section>

      {/* ---------- Offers: three spreads ---------- */}
      <section className="section" aria-labelledby="offers-title">
        <div className="container">
          <SectionHead id="offers-title" kicker={h.offersEyebrow} title={h.offersH} />
          <div className={styles.offers}>
            {offers.map((offer, i) => (
              <Link key={offer.id} href={l(offer.href)} className={`${styles.offer} ${styles[`offer${i}` as 'offer0']}`}>
                <span className={styles.offerNumber}>0{i + 1}</span>
                <span className={styles.offerImage}>
                  <Image
                    src={offer.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 900px) 42vw, 100vw"
                    style={{ objectPosition: offer.image.position }}
                  />
                </span>
                <span className={styles.offerText}>
                  <strong>{offer.title}</strong>
                  <small>{offer.text}</small>
                  <em>{h.discover} ↗</em>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- What's on ---------- */}
      <section className="surface-stage section" aria-labelledby="whats-on">
        <div className="container">
          <SectionHead id="whats-on" title={h.whatsOn} link={{ href: l('/events'), label: h.viewAll }} />
          <Programme events={whatsOn} />
        </div>
      </section>

      {/* ---------- Community & partners ---------- */}
      <section className="surface-clay section" aria-labelledby="join-title">
        <div className={`container grid ${styles.join}`}>
          <h2 id="join-title" className={styles.joinTitle}>
            {h.supportH1}
          </h2>
          <div className={styles.joinText}>
            <p className="lead">{h.support1}</p>
            <div className="actions">
              <Link href={l('/contact')} className="btn">
                {h.join}
              </Link>
            </div>
          </div>
          <div className={styles.partners}>
            <h3 className={styles.partnersTitle}>{h.partners}</h3>
            <ul>
              {partners.map((partner) => (
                <li key={partner.name}>
                  <a href={partner.href} target="_blank" rel="noopener noreferrer" aria-label={`${partner.name} (${t.common.newTab})`}>
                    <Image
                      src={partner.logo.src}
                      alt={partner.name}
                      lang={'lang' in partner ? partner.lang : undefined}
                      width={160}
                      height={160}
                      sizes="160px"
                    />
                    <span className="sr-only"> {t.common.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Support (target of every "Donation" button) ---------- */}
      <section id="support" className={styles.support} aria-labelledby="support-title" tabIndex={-1}>
        <div className={styles.supportMedia} aria-hidden="true">
          <Image className={styles.supportImg} src={closingPortrait.src} alt="" fill sizes="100vw" />
        </div>
        <div className={`container ${styles.supportInner}`}>
          <h2 id="support-title" className={styles.supportLabel}>
            <span aria-hidden="true">|| </span>
            {h.supportH2.replace(/^\|\|\s*/, '')}
          </h2>
          <div className={styles.supportBody}>
            <p>{h.support2}</p>
            <div>
              <Link href={l('/support')} className={`btn ${styles.supportBtn}`}>
                {h.donate}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
