import type { Metadata } from 'next';
import { Programme } from '@/components/events/ProgrammeRow';
import { Faq } from '@/components/ui/Faq';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionHead } from '@/components/ui/SectionHead';
import { resolveProductionEvents } from '@/content/events';
import { offerImages } from '@/content/offers';
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

      <section className="section" aria-labelledby="perf-title">
        <div className="container">
          <SectionHead id="perf-title" title={m.upcomingH} />
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
