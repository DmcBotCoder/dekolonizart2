import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { coaches, referenceOrganizations } from '@/content/references';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from '../program-page.module.css';

const PATH = '/references';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { t } = await getI18n();
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.references, description: t.references.intro });
}

export default async function ReferencesPage() {
  const { locale, t } = await getI18n();
  const r = t.references;
  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.references}
        kicker={r.eyebrow}
        title={r.title}
        intro={r.intro}
      />
      <section className="section">
        <div className={`container ${styles.stack}`}>
          <div>
            <h2>{r.partnersH}</h2>
            <div className={styles.grid}>
              {referenceOrganizations.map((partner) => (
                <article key={partner.name} className={styles.panel}>
                  <Image className={styles.partnerLogo} src={partner.logo.src} alt="" width={partner.logo.width} height={partner.logo.height} />
                  <h3>{partner.name}</h3>
                  <p>{r.noDescription}</p>
                  <a className="textlink" href={partner.href} target="_blank" rel="noopener noreferrer">
                    {r.website}<span className="sr-only"> {t.common.newTab}</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h2>{r.coachesH}</h2>
            <p>{coaches.length ? r.noDescription : r.noCoaches}</p>
          </div>
        </div>
      </section>
    </>
  );
}
