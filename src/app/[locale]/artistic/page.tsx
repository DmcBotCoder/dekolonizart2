import type { Metadata } from 'next';
import Link from 'next/link';
import { Spotlight } from '@/components/events/Spotlight';
import { CurtainImage } from '@/components/ui/CurtainImage';
import { PageHeader } from '@/components/ui/PageHeader';
import { PosterText } from '@/components/ui/PosterText';
import { SectionHead } from '@/components/ui/SectionHead';
import { Term } from '@/components/ui/Term';
import { resolvePoster, workshopBand, workshops } from '@/content/media';
import { offerImages } from '@/content/offers';
import { localizePath } from '@/i18n/config';
import { format, getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from './artistic.module.css';

const PATH = '/artistic';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({
    locale,
    path: PATH,
    title: t.meta.titles.artistic,
    description: t.artistic.intro,
    image: { ...workshopBand, alt: t.artistic.bandAlt },
  });
}

/**
 * MeMo, DekolonizArt's participatory art project: what it is, past workshops,
 * and – as the target of `agenda.ts`'s `{ id: 'youth', href: '/artistic#youth' }`
 * (linked from the homepage "What's on" and the events listing) – the
 * "Theater & Geschichte" youth project.
 */
export default async function ArtisticPage() {
  const { locale, t } = await getI18n();
  const a = t.artistic;
  const youth = a.youth;
  const l = (href: string) => localizePath(href, locale);
  const term = (id: string, label: string) => (
    <Term id={id} locale={locale} explained={t.common.explained}>
      {label}
    </Term>
  );
  const de = locale === 'de' ? undefined : 'de';

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.artistic}
        kicker={a.eyebrow}
        title="MeMo"
        intro={a.intro}
        image={offerImages.workshops}
      />

      {/* ---------- What MeMo is ---------- */}
      <section className="section" aria-labelledby="memo-title">
        <div className={`container grid ${styles.intro}`}>
          <h2 id="memo-title" className={styles.introTitle}>
            {a.h2}
          </h2>
          <div className={styles.introText}>
            <p className="lead">
              {term('memo', 'MeMo')}
              {a.leadA}
              {term('participatory', a.leadTerm)}
              {a.leadB}
            </p>
            <p>{a.p1}</p>
            <p>
              {a.p2a}
              <em>
                {term('duala-manga-bell', 'Douala Manga Bell')}
                {a.p2b}
              </em>
              {a.p2c}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Band: the workshop in Doha ---------- */}
      <figure className={styles.band}>
        <CurtainImage className={styles.bandImage} image={{ ...workshopBand, position: '50% 45%' }} alt={a.bandAlt} sizes="100vw" />
        <figcaption className="container">
          <span>{t.workshops.doha.title}</span> {a.bandPlace}
        </figcaption>
      </figure>

      {/* ---------- Three principles ---------- */}
      <section className="surface-clay section" aria-label={a.cards.map((card) => card.h).join(', ')}>
        <div className={`container ${styles.principles}`}>
          {a.cards.map((card) => (
            <article key={card.h} className={styles.principle}>
              <h2>{card.h}</h2>
              <p>{card.p}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Past workshops ---------- */}
      <section className="section" aria-labelledby="past-title">
        <div className="container">
          <SectionHead id="past-title" kicker={a.pastEyebrow} title={a.pastH} />
          <div className={styles.past}>
            {workshops.map((workshop, i) => {
              const w = t.workshops[workshop.id];
              return (
                <article key={workshop.id} className={`${styles.workshop} ${i % 2 ? styles.flip : ''}`}>
                  <CurtainImage className={styles.workshopImage} image={workshop.image} alt={w.alt} sizes="(min-width: 900px) 55vw, 100vw" />
                  <div className={styles.workshopText}>
                    <p className={styles.place}>{w.place}</p>
                    <h3>{w.title}</h3>
                    <p>{w.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Theater & Geschichte – MeMo for young people ---------- */}
      <section id="youth" className="surface-stage section" aria-labelledby="youth-title" tabIndex={-1}>
        <div className="container">
          <Spotlight
            id="youth-title"
            flip
            kicker={youth.eyebrow}
            title={youth.h2}
            titleLang={de}
            subtitle={youth.h2Translation ? { text: youth.h2Translation.replace(/^\(|\)$/g, '') } : undefined}
            lead={youth.lead}
            details={
              <ul className={styles.youthFacts}>
                {youth.facts.map((fact) => (
                  <li key={fact.strong}>
                    <strong>{fact.strong}</strong>
                    <span>{fact.span}</span>
                  </li>
                ))}
              </ul>
            }
            primary={{ href: l('/contact'), label: youth.cta, kind: 'signup', srLabel: ` ${youth.ctaSr}` }}
            credit={youth.credit}
            poster={{
              image: resolvePoster(t, 'theaterGeschichte'),
              label: format(t.common.enlargePoster, { title: 'Theater & Geschichte' }),
              zoom: t.common.zoom,
              text: <PosterText poster="theaterGeschichte" locale={locale} t={t.posterText} />,
            }}
          />
        </div>
      </section>

      {/* ---------- Book a workshop ---------- */}
      <section className="surface-camwood section-tight">
        <div className={`container ${styles.cta}`}>
          <div>
            <h2>{a.ctaH}</h2>
            <p className="lead">{a.ctaP}</p>
          </div>
          <Link href={l('/contact')} className="btn">
            {a.ctaBtn}
          </Link>
        </div>
      </section>
    </>
  );
}
