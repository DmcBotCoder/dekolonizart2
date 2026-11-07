import Image from 'next/image';
import Link from 'next/link';
import { socials } from '@/content/site';
import { localizePath, type Locale } from '@/i18n/config';
import type { Messages } from '@/i18n/messages';
import { MotionToggle, NewsletterForm } from './FooterControls';
import styles from './Footer.module.css';

export function Footer({ locale, t }: { locale: Locale; t: Messages }) {
  const f = t.footer;
  const l = (href: string) => localizePath(href, locale);
  const year = new Date().getFullYear();

  const columns = [
    {
      id: 'f-nav',
      title: f.navigate,
      links: [
        ['/about', f.about],
        ['/services', f.faqs],
        ['/events', t.nav.events.label],
        ['/contact', f.contact],
      ],
    },
    {
      id: 'f-offers',
      title: f.offers,
      links: [
        ['/theater', f.performances],
        ['/artistic', f.workshops],
        ['/movement-dance', f.dance],
      ],
    },
  ] as const;

  return (
    <footer className={`surface-deep ${styles.footer}`}>
      <div className={`container ${styles.top}`}>
        <p className={styles.claim}>
          {f.claim.map((line, i) => (
            <span key={line} className={styles[`claim${i}` as 'claim0']}>
              {line}
            </span>
          ))}
        </p>
        <Image className={styles.logo} src="/img/logo.png" alt="" width={160} height={160} />
      </div>

      <div className={`container ${styles.cols}`}>
        {columns.map((column) => (
          <nav key={column.id} aria-labelledby={column.id}>
            <h2 id={column.id} className={styles.h}>
              {column.title}
            </h2>
            <ul className={styles.links}>
              {column.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={l(href)}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className={styles.news}>
          <NewsletterForm
            labels={{
              heading: f.newsletter,
              emailLabel: f.emailLabel,
              send: f.send,
              thanks: f.thanks,
              errEmpty: f.errEmpty,
              errInvalid: f.errInvalid,
            }}
          />
        </div>
        <div>
          <h2 className={styles.h}>{f.follow}</h2>
          <ul className={styles.links}>
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noopener">
                  {social.label}
                  <span className="sr-only"> {t.common.newTab}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.legal}`}>
        <p>
          © {year} DekolonizArt – {f.rights}
        </p>
        <ul className={styles.legalLinks}>
          <li>
            <Link href={l('/impressum')}>{f.impressum}</Link>
          </li>
          <li>
            <Link href={l('/datenschutz')}>{f.datenschutz}</Link>
          </li>
          <li>
            <Link href={l('/accessibility')}>{f.accessibility}</Link>
          </li>
          <li>
            <Link href={l('/easy-read')}>{f.easy}</Link>
          </li>
          <li>
            <Link href={l('/glossary')}>{t.a11y.glossary}</Link>
          </li>
          <li>
            <MotionToggle label={f.reduceMotion} on={t.a11y.on} off={t.a11y.off} />
          </li>
        </ul>
      </div>
    </footer>
  );
}
