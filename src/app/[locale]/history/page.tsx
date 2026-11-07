import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from './history.module.css';

const PATH = '/history';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.history, description: t.history.intro });
}

/** The story so far, as a timeline running from the foundation to the first public reading. */
export default async function HistoryPage() {
  const { locale, t } = await getI18n();
  const h = t.history;

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.history}
        kicker={h.eyebrow}
        title={h.title}
        intro={h.intro}
      />
      <section className="section" aria-labelledby="timeline-title">
        <div className="container">
          <h2 id="timeline-title" className="sr-only">
            {h.timelineH}
          </h2>
          {/* A real sequence, so the years lead – set like a stage date. */}
          <ol className={styles.timeline}>
            {h.items.map((item) => (
              <li key={item.year} className={styles.item} data-reveal="rise">
                <p className={styles.year}>
                  <time dateTime={item.year}>{item.year}</time>
                </p>
                <div className={styles.body}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
