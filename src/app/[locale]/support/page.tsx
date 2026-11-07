import type { Metadata } from 'next';
import Link from 'next/link';
import { WhyDonateWidget } from '@/components/support/WhyDonateWidget';
import { PageHeader } from '@/components/ui/PageHeader';
import { supportConfig } from '@/content/support';
import { localizePath } from '@/i18n/config';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from '../program-page.module.css';

const PATH = '/support';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { t } = await getI18n();
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.support, description: t.support.intro });
}

export default async function SupportPage() {
  const { locale, t } = await getI18n();
  const s = t.support;
  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.support}
        kicker={s.eyebrow}
        title={s.title}
        intro={s.intro}
      />
      <section className="section">
        <div className={`container ${styles.grid}`}>
          <div className={styles.panel}>
            <h2>{s.impactH}</h2>
            <p>{s.impactP}</p>
            <ul className={styles.list}>
              {s.impactItems.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.panel}>
            <h2>{s.widgetH}</h2>
            <p>{s.widgetP}</p>
            <WhyDonateWidget lang={locale} {...supportConfig.donationWidget} />
          </div>
        </div>
      </section>
      <section className="surface-clay section">
        <div className={`container ${styles.center}`}>
          <p>{s.contact}</p>
          <Link className="btn-line" href={localizePath('/contact', locale)}>
            {t.meta.titles.contact} →
          </Link>
        </div>
      </section>
    </>
  );
}
