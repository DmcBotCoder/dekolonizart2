import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Faq } from '@/components/ui/Faq';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHead } from '@/components/ui/SectionHead';
import { resolveOffers } from '@/content/offers';
import { localizePath } from '@/i18n/config';
import { getMessages } from '@/i18n/messages';
import { getI18n, getLocale } from '@/i18n/server';
import { buildCrumbs } from '@/lib/breadcrumbs';
import { buildMetadata } from '@/lib/seo';
import styles from './services.module.css';

const PATH = '/services';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getMessages(locale);
  return buildMetadata({ locale, path: PATH, title: t.meta.titles.services, description: t.services.intro });
}

/** The three service areas (same content as the home "Our Offers"), then the general FAQ and a contact CTA. */
export default async function ServicesPage() {
  const { locale, t } = await getI18n();
  const s = t.services;
  const l = (href: string) => localizePath(href, locale);

  return (
    <>
      <PageHeader
        breadcrumbLabel={t.common.breadcrumb}
        crumbs={buildCrumbs(PATH, locale, t)}
        current={t.meta.titles.services}
        kicker={s.eyebrow}
        title={s.title}
        intro={s.intro}
      />

      {/* Numbered editorial bands – one discipline in each. */}
      <section className="section" aria-labelledby="svc-title">
        <div className="container">
          <h2 id="svc-title" className="sr-only">
            {s.listH}
          </h2>
          <ul className={styles.triptych}>
            {resolveOffers(t).map((offer, i) => (
              <li key={offer.id}>
                <Link href={l(offer.href)} className={`${styles.panel} ${styles[`panel${i}` as 'panel0']}`}>
                  <span className={styles.number}>0{i + 1}</span>
                  <span className={styles.image}>
                    <Image
                      src={offer.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 900px) 42vw, 100vw"
                      style={{ objectPosition: offer.image.position }}
                    />
                  </span>
                  <span className={styles.panelText}>
                    <strong>{offer.title}</strong>
                    <small>{offer.text}</small>
                    <em>
                      {s.visit} ↗<span className="sr-only">: {offer.title}</span>
                    </em>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-clay section" aria-labelledby="faq-title">
        <div className={`container ${styles.faqGrid}`}>
          <SectionHead id="faq-title" kicker={s.faqEyebrow} title={s.faqH} />
          <Faq items={t.faq} />
        </div>
      </section>

      <section className="surface-camwood section-tight">
        <div className={`container ${styles.cta}`}>
          <h2>{s.ctaH}</h2>
          <Link href={l('/contact')} className="btn">
            {s.ctaBtn}
          </Link>
        </div>
      </section>
    </>
  );
}
