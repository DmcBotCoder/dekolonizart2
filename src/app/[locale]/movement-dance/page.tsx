import type { Metadata } from 'next';
import { Programme } from '@/components/events/ProgrammeRow';
import { Faq } from '@/components/ui/Faq';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHead } from '@/components/ui/SectionHead';
import { movementActivities, workshopActivities, type Activity } from '@/content/activities';
import { resolveProductionEvents } from '@/content/events';
import { offerImages } from '@/content/offers';
import { site } from '@/content/site';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from './movement-dance.module.css';

const PATH = '/movement-dance';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.movement, description: t.movement.intro });
}

/** Movement & dance: every production as its own programme entry, then the general FAQ. */
export default async function MovementDancePage() {
  const { locale, t } = await getI18n();
  const m = t.movement;
  const activities = [...movementActivities, ...workshopActivities];
  const formatLabel = (activity: Activity) => {
    if (activity.format === 'in-person') return m.formatLabels.inPerson;
    if (activity.format === 'online') return m.formatLabels.online;
    return m.formatLabels.hybrid;
  };
  const titleFor = (activity: Activity) => (activity.titleKey === 'movement' ? m.title : t.artistic.youth.h2);

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.movement}
        kicker={m.eyebrow}
        title={m.title}
        intro={m.intro}
        image={offerImages.movement}
      />

      <section className="section" aria-labelledby="classes-title">
        <div className="container">
          <SectionHead id="classes-title" title={m.upcomingH} />
          {activities.length > 0 ? (
            <ul className={styles.activities}>
              {activities.map((activity) => (
                <li key={activity.id}>
                  <article className={styles.activity} aria-labelledby={`${activity.id}-title`}>
                    <div>
                      <p className={styles.activityKind}>{activity.kind === 'class' ? m.title : t.nav.artistic.label}</p>
                      <h2 id={`${activity.id}-title`}>{titleFor(activity)}</h2>
                    </div>
                    <dl className={styles.facts}>
                      <div><dt>{m.format}</dt><dd>{formatLabel(activity)}</dd></div>
                      {activity.recurrence && <div><dt>{m.schedule}</dt><dd>{activity.recurrence}{activity.time ? ` · ${activity.time}` : ''}</dd></div>}
                      {activity.location && <div><dt>{m.location}</dt><dd>{activity.location}</dd></div>}
                      {activity.price && <div><dt>{m.price}</dt><dd>{activity.price}</dd></div>}
                    </dl>
                    {activity.registration?.enabled && (
                      activity.registration.url ? (
                        <a className="btn" href={activity.registration.url} target="_blank" rel="noopener noreferrer">
                          {m.registration}<span className="sr-only"> {t.common.newTab}</span>
                        </a>
                      ) : (
                        <p className={styles.pending}>{m.registrationPending}</p>
                      )
                    )}
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <p>{m.empty}</p>
              <a className="btn-line" href={`mailto:${site.email}`}>{m.contactCta}</a>
            </div>
          )}
        </div>
      </section>

      <section className="surface-stage section" aria-labelledby="perf-title">
        <div className="container">
          <SectionHead id="perf-title" title={t.theater.upcomingH} />
          <Programme events={resolveProductionEvents(t, locale)} showCategory={false} />
        </div>
      </section>

      <section className="surface-clay section" aria-labelledby="mv-faq">
        <div className={`container ${styles.faqGrid}`}>
          <SectionHead id="mv-faq" title={m.faqH} />
          <Faq items={t.faq} />
        </div>
      </section>
    </>
  );
}
