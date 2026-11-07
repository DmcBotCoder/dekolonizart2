import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { site, socials, venue } from '@/content/site';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from './contact.module.css';

const PATH = '/contact';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.contact, description: t.contact.title });
}

/** Contact: centred, no form – the real addresses, set large enough to act on. */
export default async function ContactPage() {
  const { locale, t } = await getI18n();
  const c = t.contact;

  return (
    <div className={`surface-stage ${styles.contact}`}>
      <div className="container">
        <Breadcrumbs label={t.common.breadcrumb} crumbs={buildCrumbs(PATH, locale, t)} current={t.meta.titles.contact} />
        <div className={styles.center}>
          <p className={styles.kicker}>{c.eyebrow}</p>
          <h1>{c.title}</h1>

          <div className={styles.departments}>
            {[c.artistic, c.production].map((department) => (
              <section key={department} className={styles.department} aria-label={department}>
                <h2>{department}</h2>
                <a href={`mailto:${site.email}`} className={styles.mail}>
                  {site.email}
                </a>
              </section>
            ))}
          </div>

          <div className={styles.more}>
            <section aria-labelledby="venue-title" className={styles.venue}>
              <h2 id="venue-title">{t.ui.venueH}</h2>
              <address>
                <span>{venue.name}</span>
                <span>
                  {venue.street}, {venue.city}
                </span>
                <span>{venue.place}</span>
              </address>
              <a href={venue.mapUrl} className="textlink" target="_blank" rel="noopener">
                {t.common.showOnMap}
                <span className="sr-only"> {t.common.newTab}</span>
              </a>
            </section>
            <section aria-labelledby="follow-title" className={styles.follow}>
              <h2 id="follow-title">{t.footer.follow}</h2>
              <ul>
                {socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noopener">
                      {social.label}
                      <span className="sr-only"> {t.common.newTab}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
