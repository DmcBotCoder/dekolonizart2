import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Term } from '@/components/ui/Term';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from './about.module.css';

const PATH = '/about';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.about, description: t.about.intro });
}

/**
 * Who we are: the manifesto (remembrance into renewal), the four chapters
 * (mission, vision, ambition, envisioned space) and – as the target of the
 * "Our values" nav card (`/about#values`) – Ubuntu and the other three values.
 */
export default async function AboutPage() {
  const { locale, t } = await getI18n();
  const a = t.about;
  const [ubuntu, ...values] = t.values;

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.about}
        kicker={a.eyebrow}
        title="DekolonizArt"
        intro={a.intro}
      />

      {/* ---------- Remembrance into renewal ---------- */}
      <section className="section" aria-labelledby="renewal-title">
        <div className={`container grid ${styles.manifest}`}>
          <h2 id="renewal-title" className={styles.manifestTitle}>
            <span className={styles.past}>{a.h2[0]}</span> <span className={styles.future}>{a.h2[1]}</span>
          </h2>
          <div className={styles.manifestText}>
            <p className="lead">
              {a.leadA}
              <Term id="african-perspectives" locale={locale} explained={t.common.explained}>
                {a.leadTerm}
              </Term>
              {a.leadB}
            </p>
            <p>{a.p1}</p>
            <p>{a.p2}</p>
            <p className={styles.strong}>{a.strong}</p>
            <p className={styles.sig}>
              {a.sig}
              <span>Ngako Keuni</span>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Mission, vision, ambition, envisioned space ---------- */}
      <section className="surface-stage section" aria-label={a.cards.map((card) => card.h).join(', ')}>
        <div className={`container ${styles.chapters}`}>
          {a.cards.map((card) => (
            <article key={card.h} className={styles.chapter}>
              <h2>{card.h}</h2>
              <div className={styles.chapterText}>
                {card.p.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Values (target of the "Our values" nav card) ---------- */}
      <section id="values" className="surface-camwood section" aria-labelledby="values-title" tabIndex={-1}>
        <div className="container">
          <h2 id="values-title" className={styles.valuesKicker}>
            {a.valuesH}
          </h2>
          <article className={styles.ubuntu}>
            <h3>{ubuntu.title}</h3>
            <p className={styles.ubuntuText}>{ubuntu.text}</p>
            <p>
              <Term id="ubuntu" locale={locale} explained={t.common.explained}>
                {a.ubuntuLink}
              </Term>
            </p>
          </article>
          <div className={styles.values}>
            {values.map((value) => (
              <article key={value.id} className={styles.value}>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
