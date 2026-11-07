import type { Metadata } from 'next';
import { Initials } from '@/components/people/Initials';
import { CurtainImage } from '@/components/ui/CurtainImage';
import { PageHeader } from '@/components/ui/PageHeader';
import { team } from '@/content/team';
import { format, getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import { TeamGrid } from './TeamGrid';
import styles from './team.module.css';

const PATH = '/the-team';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.team, description: t.team.intro });
}

/**
 * The ensemble, presented like the credits of a theatre programme rather
 * than a corporate staff grid: the founder first (a torn-paper portrait,
 * same device as the production pages), then everyone else as a roster of
 * names with small torn-edge portraits.
 */
export default async function TeamPage() {
  const { locale, t } = await getI18n();
  const [lead, ...ensemble] = team;

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.team}
        kicker={t.team.eyebrow}
        title={t.team.title}
        intro={t.team.intro}
      />

      <section className="section" aria-labelledby="members-title">
        <div className="container">
          <h2 id="members-title" className="sr-only">
            {t.team.membersH}
          </h2>

          <article className={styles.lead}>
            <div className={styles.leadFrame}>
              {lead.photo ? (
                <CurtainImage
                  className={styles.fill}
                  image={lead.photo}
                  alt={format(t.team.portraitOf, { name: lead.name })}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
              ) : (
                <Initials name={lead.name} size="l" />
              )}
            </div>
            <div className={styles.leadText}>
              <h3>{lead.name}</h3>
              <p className={styles.role}>{t.team.roles[lead.role]}</p>
            </div>
          </article>

          <TeamGrid members={ensemble} portraitOf={t.team.portraitOf} roles={t.team.roles} />
        </div>
      </section>
    </>
  );
}
