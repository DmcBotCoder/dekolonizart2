import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { supportConfig } from '@/content/support';
import { localizePath } from '@/i18n/config';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from '../program-page.module.css';

const PATH = '/community';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { t } = await getI18n();
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.community, description: t.community.intro });
}

export default async function CommunityPage() {
  const { locale, t } = await getI18n();
  const c = t.community;
  const mailto = `mailto:${supportConfig.community.signupEmail}?subject=${encodeURIComponent('DekolonizArt community')}`;
  const channels = [
    { label: c.signal, href: supportConfig.community.signalUrl },
    { label: c.whatsapp, href: supportConfig.community.whatsappUrl },
  ];
  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.community}
        kicker={c.eyebrow}
        title={c.title}
        intro={c.intro}
      />
      <section className="section">
        <div className={`container ${styles.grid}`}>
          <div className={styles.panel}>
            <h2>{c.signupH}</h2>
            <p>{c.signupText}</p>
            <a className="btn" href={mailto}>{c.signupCta}</a>
          </div>
          <div className={styles.panel}>
            <h2>{t.meta.titles.community}</h2>
            <ul className={styles.list}>
              {channels.map((channel) => (
                <li key={channel.label}>
                  <strong>{channel.label}</strong>
                  {channel.href ? (
                    <a href={channel.href} target="_blank" rel="noopener noreferrer">
                      {channel.label}<span className="sr-only"> {t.common.newTab}</span>
                    </a>
                  ) : (
                    <span className={styles.pending}>{c.invitePending}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="surface-clay section">
        <div className={`container ${styles.center}`}>
          <Link className="btn-line" href={localizePath('/support', locale)}>
            {t.meta.titles.support} →
          </Link>
        </div>
      </section>
    </>
  );
}
